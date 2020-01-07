// pages/search/index.js
const app = getApp();
import api from '../../utils/api/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    index: 0,
    pickername:'类别',
    hasHistoryShow:'', //是否有历史记录
    hasSearchDataFlag: false, //搜索有数据 就是true   
    getSearchDataList:false,//搜索出结果
    getSearchDataIcon:false,
    noDataSearchRecord:true,//暂无搜索记录
    objectArray: [
      {
        id: 0,
        name: '类别'
      },
      {
        id: 1,
        name: '书名'
      },
      {
        id: 3,
        name: '专业'
      },
      {
        id: 4,
        name: '作者'
      },
      {
        id: 5,
        name: 'ISBN'
      }
    ],
    inputVal:"",//input框内值
    searchTxt:'',
    keydown_number: 0,//检测input框内是否有内容
    listarr:[],
    histroyShow:true,
    booksList:[],
    majorsList:[],
    scorllHeight:'',
    waterFallDataIndex:1,
    sosuojilu:'',
    scrollHasShadow:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
  
    //读取缓存历史搜索记录
    // wx.getStorage({
    //   key: 'list_arr',
    //   success: function (res) {
    //     _this.setData({
    //       listarr: res.data
    //     })
    //   }
    // })

    //判断是否从主页的热门进来的
    let info = wx.getStorageSync('indexInfo');
    if (info != '') {
      console.log('从主页的热门进来的');
      wx.setNavigationBarTitle({
        title: '搜索-' + info
      })
      let obj = {
        "sort": '类别',
        "key": info
      }
      this.api_getSearchData(obj);
      _this.setData({
        keydown_number:1,
        searchTxt: info,
        noDataSearchRecord:false
      })
      wx.setStorage({
        key: 'indexInfo',
        data: '',
      })
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          _this.setData({
            listarr: [],
            sosuojilu: 'none'
          })
        }
      })
    }else{
      //读取缓存历史搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          _this.setData({
            listarr: res.data,
            autoFocus:true
          })
          if (res.data.length != '0') {
            _this.setData({
              noDataSearchRecord: false
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this=this;
    let histroyLen=this.data.listarr.length;
    if(histroyLen!=0){
      this.setData({
        hasHistoryShow:true
      })
    } else {
      this.setData({
        hasHistoryShow: false
      })
    }
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
  // 返回上一页
  navBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  navHome: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  bindPickerChange(e) {
    //console.log(e);
    let index = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.objectArray[index].name); //书名
    this.setData({
      index: e.detail.value,
      pickername: this.data.objectArray[index].name //赋值picker 值
    })
  },
  //在输入框的事件
  onInput(e){
    //console.log(e.detail.value);
    this.setData({
      inputVal:e.detail.value,
      searchTxt:e.detail.value,
      histroyShow:false
    })
    if(this.data.searchTxt!==''){
      this.triggerEvent('onSearch',{searchTxt:this.data.searchTxt})
      this.setData({
        keydown_number:1,
        histroyShow: false
      })
    }else{
      this.triggerEvent('onClearSearchValue', { ifHaveSearch: false });
      this.setData({
        keydown_number:0
      })
    }
  },
  keyToEnter(e) {
    console.log(e);
    this.setData({
      searchTxt: e.detail.value
    })
    console.log(this.data.searchTxt);
    if (this.data.searchTxt != '') {
      this.onSearch();
    }
  },
  //那个叉叉 点击清除文本
  onClearSearchValue(e) {
    //console.log(e);
    this.setData({
      searchTxt: '',
      hasHistoryShow: true
    })
  },
  //点击搜索事件  输入框input失去焦点函数
  onSearch(e){
    
    //获取搜索的内容 info
    let info=this.data.searchTxt;
    wx.setNavigationBarTitle({
      title: '搜索-' + info
    })
    if(this.data.keydown_number==1){
      let This=this;
      //把获取的input的值插入数组立面
      let arr = this.data.listarr;
      if (this.data.searchTxt == '') {
        let arrnum = arr.indexOf(this.data.inputVal);
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(this.data.inputVal);
        } else {
          arr.unshift(this.data.inputVal);
        }
      }else{
        console.log('进来第一个');
        let arr_num = arr.indexOf(this.data.searchTxt);
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.searchTxt);
        } else {
          arr.unshift(this.data.searchTxt);
        }
      }
      console.log(arr);
      //储存搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })
      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          This.setData({
            listarr: res.data
          })
        }
      })
      this.setData({
        searchTxt: info,
        hasHistoryShow:false,
        noDataSearchRecord:false,
      })
      let obj={
        "sort": this.data.pickername,
        "key": this.data.searchTxt
      }
      console.log(obj);
      //这里是api请求
      this.api_getSearchData(obj)
    }else{
      //搜索内容为空
      console.log("取消");
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //去专业搜索页
  toProfessionalPage(e){
    console.log("去专业搜索页");
    let name = e.currentTarget.dataset.name;
    console.log(name);
    wx.navigateTo({
      url: `../professionalSearch/index?name=${name}`,
    })
  },
  //去此书详情页
  todetailPage(e){
    let book_id = e.currentTarget.dataset.id;
    console.log(e);
    wx.navigateTo({
      url: `../detail/index?bookid=${book_id}`,
    })
  },
  //搜索请求数据函数
  api_getSearchData(obj){
    wx.showLoading({
      title: '搜索中',
    })
    let _this=this;
    api.request('/book/search', 'GET', obj).then(res => {

      console.log(res);
      if (res.code == 200) {
        let booksList = res.data.books;
        if(obj.sort!="专业"){
          for (var i = 0; i < booksList.length; i++) {
            if (booksList[i].publisher == '') {
              console.log('e');
              booksList[i].publisher = '暂无'
            }
          }

          this.setData({
            booksList: booksList,
            majorsList: res.data.majors,
            getSearchDataList: true,//显示搜索出来的结果
            getSearchDataIcon: false,
          })

          //先动态获取高度
          wx.createSelectorQuery().selectAll('.scroll-box').boundingClientRect(function (rects) {
            //console.log(rects);
            let offsetTop = rects[0].top; //这个高度
            _this.setData({
              scorllHeight: offsetTop
            })
          }).exec()

          if (res.data.books.length == 0 && res.data.majors.length == 0) {
            this.setData({
              getSearchDataIcon: true,
              getSearchDataList: false
            })
          }
        }else{
          this.setData({
            booksList: [],
            majorsList: res.data.majors,
            getSearchDataList: true,//显示搜索出来的结果
            getSearchDataIcon: false,
          })
        }
        
        wx.hideLoading();
      }//请求成功
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 滑到最头 取消阴影
   */
  onMyEvent(e){
    //let info = e.detail.cardTosearch; //获取info值
    let obj = {
      "sort":'类别',
      "key": e.detail.cardTosearch
    }
    this.api_getSearchData(obj);
    this.setData({
      hasHistoryShow:false,
      searchTxt: e.detail.cardTosearch,
      keydown_number: 1
    })
    wx.setNavigationBarTitle({
      title: '搜索-' + e.detail.cardTosearch
    })
  },
  //组建传来的事件 清理搜索历史纪录 就展示
  onMyEventShowNoSearchRecord(){ 
    this.setData({
      noDataSearchRecord:true,
    })
  }
})