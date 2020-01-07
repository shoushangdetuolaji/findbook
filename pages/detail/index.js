// pages/detail/index.js
import api from '../../utils/api/api.js'
import getCode from '../../utils/api/getCode.js'
const app = getApp()

function removeAaary(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    if (_arr[i] == _obj) {
      if (i == 0) {u
        _arr.shift(); //删除并返回数组的第一个元素
        return _arr;
      }
      else if (i == length - 1) {
        _arr.pop();  //删除并返回数组的最后一个元素
        return _arr;
      }
      else {
        _arr.splice(i, 1); //删除下标为i的元素
        return _arr;
      }
    }
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navH: '',
    bookid:'',
    marjorsList:[],
    collectKind:0, //0默认没收藏，1为收藏了 
    collectColor:'',
    bookDetail:'',
    introShow:true,
    cardHeight:'',
    isBorrow:false,
    isBgColor:false,
    borrowKind:0, //0默认没借阅  1为借阅中,
    bookBorrowStorage:[],
    dontGoanyMore:false,
    zhankaiShow:'',
    isAnswer:false,//答案颜色
    noInventory:'',
    noInventoryFlag:'',
    bookDetailInventory:''//库存
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight,
      bookid:options.bookid
    })
    this.getUserInfoCollect();
    this.theBookWhetherBorrow();
    this.getDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getDetail(){
    let id = this.data.bookid;
    console.log
    api.request('/book/detail', 'GET', {"id":id},{"token":wx.getStorageSync('token')}).then(res=>{
      console.log(res);

      if (res.data.ISBN == null) {
        res.data.ISBN = '暂无'
      }
      //判断是否有书本量
      let whetherCanBorrow;
      if (res.data.inventory==0){
        console.log('库存为0');
        this.setData({
          noInventory:'noInventory',
          noInventoryFlag:true
        })
      }
      //判断是否有答案
      let whetherAnswer;
      if (res.data.answer_id!=null){
        console.log('有答案');
        this.setData({
          isAnswer: true
        }) 
      }else{
        console.log('没有答案');
        this.setData({
          isAnswer:false
        })       
      }
      let smallintroduction
      if(res.data.publisher==''){
        res.data.publisher='暂无'
      }
      if(res.data.introduction!=null&&res.data.introduction.length>31){
        console.log('true');
        smallintroduction = res.data.introduction.substr(0, 31) + '...';
        this.setData({
          zhankaiShow:true
        })
      }else{
        smallintroduction = '暂无'
        this.setData({
          zhankaiShow: false
        })

      }
      this.setData({   
        introduction: smallintroduction,
        bookDetail:res.data,
        bookDetailInventory: res.data.inventory
      })
      if(res.data.majors.length!='0'){
        this.setData({
          marjorsList:res.data.majors
        })
      }
    })
  },
  // // 返回上一页
  // navBack: function () {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },
  // navHome: function () {
  //   wx.reLaunch({
  //     url: '../index/index'
  //   })
  // },
  //收藏按钮事件
  colletThisBook(e){
    console.log(e);
    let kind = e.currentTarget.dataset.kind;
    console.log(kind);
    if(kind==1){
      console.log('收藏->取消收藏');
      this.collectDelete();
    }else if(kind==0){
      console.log('未收藏->收藏成功');
      this.collectSuccess();
    }
  },
  //收藏成功
  collectSuccess(){
    //本书id
    let id = this.data.bookid;
    console.log(app.globalData.noLogin_hasCollectBook);
    let noLogin_hasCollectBook = app.globalData.noLogin_hasCollectBook
    noLogin_hasCollectBook.push(this.data.bookDetail);
    app.globalData.noLogin_hasCollectBook = noLogin_hasCollectBook
    wx.setStorageSync('noLogin_hasCollectBook', noLogin_hasCollectBook)
    this.setData({
      collectColor:'#ffa800',
      collectKind:1,
    })
    wx.showToast({
      title: '收藏成功',
    })
  },
  //取消收藏
  collectDelete(){
    //本书id
    let id = this.data.bookid;
    //console.log('用户没有登陆,本地储存');
    //console.log(app.globalData.noLogin_hasCollectBook);
    let noLogin_hasCollectBook = app.globalData.noLogin_hasCollectBook
    removeAaary(noLogin_hasCollectBook,this.data.bookDetail)
    //noLogin_hasCollectBook.remove();
    app.globalData.noLogin_hasCollectBook = noLogin_hasCollectBook
    wx.setStorageSync('noLogin_hasCollectBook', noLogin_hasCollectBook)
    this.setData({
      collectColor: '',
      collectKind: 0
    })
    wx.showToast({
      title: '取消成功',
    })
   
  },
  //获取用户是否收藏了
  getUserInfoCollect(){
      //console.log('用户没有登陆 默认为都没收藏')
      let newnoLogin_hasCollectBook = wx.getStorageSync('noLogin_hasCollectBook');
      for (var i = 0;i < newnoLogin_hasCollectBook.length;i++){
        if (this.data.bookid == newnoLogin_hasCollectBook[i].id) {
          this.setData({
            collectKind: 1,
            collectColor: '#ffa800'
          })
          break;
        }
      }
  },
  //借阅按钮事件
  borrowThisBook(e){
    let _this = this;
    if(app.globalData.userInfo){
    
      if (this.data.noInventoryFlag == true) {
        //库存为0
        wx.showToast({
          icon: 'none',
          title: '暂无库存了😭',
        })
      } else {
        if (!this.data.isBorrow == true) {

          let bookBorrowStorage = app.globalData.borrowBookArray
          let len_borrow = bookBorrowStorage.length + 1;
          //console.log(bookBorrowStorage.length);
          //处理是否超过三本书
          if (len_borrow > 3) {
            this.limitBooks();
          } else {
            console.log('先获取globaldata的借阅数组' + bookBorrowStorage);
            bookBorrowStorage.push({
              "id": this.data.bookDetail.id,
              "resource_url": this.data.bookDetail.resource_url
            }); //添加单位;

            wx.setStorageSync('borrowBookArray', bookBorrowStorage);
            //重新给globData赋新的值;
            app.globalData.borrowBookArray = bookBorrowStorage;
            console.log(app.globalData.borrowBookArray);
            wx.showToast({
              title: '已添加到[转转]',
            })
            let obj={
              "id": this.data.bookDetail.id,
              "dispose":0
            }
            api.request('/book/inventory/update','PUT',obj,{"token": wx.getStorageSync('token')}).then(res=>{
              console.log(res);
              if(res.code==200){
                console.log('es');
                _this.setData({
                  bookDetailInventory: this.data.bookDetailInventory-1
                })
              }
            })

            this.setData({
              isBorrow: !this.data.isBorrow,
              isBgColor: !this.data.isBgColor
            })
          }

        } else {
          let bookBorrowStorage = app.globalData.borrowBookArray;
          let bookid = this.data.bookid;
          let index;
          for (var i = 0; i < bookBorrowStorage.length; i++) {
            if (bookid == bookBorrowStorage[i].id) {
              console.log('ee');
              index = i;
              break;
            }
          }
          console.log(index);
          bookBorrowStorage.splice(index, 1);

          console.log('打印取消借阅那本书的数组' + bookBorrowStorage);
          wx.setStorageSync('borrowBookArray', bookBorrowStorage);
          wx.showToast({
            title: '取消借阅',
          })
          let obj = {
            "id": this.data.bookid,
            "dispose": 1
          }
          api.request('/book/inventory/update', 'PUT', obj, { "token": wx.getStorageSync('token') }).then(res=>{
            console.log(res);
            if (res.code == 200) {
              console.log('es');
              _this.setData({
                bookDetailInventory: this.data.bookDetailInventory + 1
              })
            }
          })
          this.setData({
            isBorrow: !this.data.isBorrow,
            isBgColor: !this.data.isBgColor
          })
        }
      }
    }else {
      console.log('请先登陆');
      wx.showModal({
        title: '请先登陆',
        content: '登陆才能借阅;\r\n同时你可以选选择收藏此课本',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.switchTab({
              url: '../user/index'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //判断这本书是否被借阅
  theBookWhetherBorrow(){
    let newBorrowBookArray=wx.getStorageSync('borrowBookArray');
    for (var i = 0; i < newBorrowBookArray.length; i++) {
      if (this.data.bookid == newBorrowBookArray[i].id) {
        this.setData({
          isBorrow:true,
          isBgColor:true
        })
        break;
      }
    }
  },
  showMore(e){
    console.log("展开更多");
    this.setData({
      introShow:false,
      cardHeight:'auto!important;',
      zhankaiShow:false
    })
  },
  hideMore(e){
    console.log("收起更多");
    this.setData({
      introShow: true,
      cardHeight: '',
      zhankaiShow: true
    })
  },
  //只能借3本
  limitBooks(){
    wx.showModal({
      title: '提示',
      content: '一次借阅,最多只能借3本\r\n或者先收藏,下次订单再来借阅~',
      showCancel:false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');  
        }
      }
    })
  },
  //去答案页的按钮
  toAnwserPage(e){
    console.log(e);
    let answerid=e.currentTarget.dataset.answerid;
    if(answerid){
      console.log('去答案页');
      wx.navigateTo({
        url: `../answer/index?answerid=${answerid}`,
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '暂无答案😭',
      })
    }
  },
  //预览图片
  preview(e){
    console.log(e);
    let thisImgSrc = e.currentTarget.dataset.src;
    wx.previewImage({
      current: thisImgSrc, // 当前显示图片的http链接
      urls: [`${thisImgSrc}`] // 需要预览的图片http链接列表
    })
  },
  //点击下面的 专业
  toProfessionalSearchPage(e){
    let name = e.currentTarget.dataset.name;
    console.log(name);
    wx.navigateTo({
      url: `../professionalSearch/index?name=${name}`,
    })
  },
  // 返回上一页
  navBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  navZhuanzhuan: function () {
    wx.reLaunch({
      url: '../zhuan/index'
    })
  }
})