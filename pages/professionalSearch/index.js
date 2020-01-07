// pages/professionalSearch/index.js
const app = getApp()
import api from '../../utils/api/api.js';
import address from '../../utils/dormitory/majors.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    objectArray: [
      {
        id: 0,
        name: '大一'
      },
      {
        id: 1,
        name: '大二'
      },
      {
        id: 2,
        name: '大三'
      },
      {
        id: 3,
        name: '大四'
      }
    ],
    index: 0,
    active:1,
    bookname:'',
    college:'',
    bookLength:'',
    bookList:'',
    scrollHeight:'',
    switchHide: true, //以下都是选择学院和专业的
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [], //picker联动封装的data.js  对应 学院
    citys: [],      //对应 专业  
    areas: [],
    province: '',
    city: '',
    area: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.setStorageSync('pro_Majorindex', 1);
    _this.setData({
      
      // navH: app.globalData.navHeight,
      bookname: options.name
    })
    //console.log(options);
    _this.getComeData('1');

    /**
     * 学院专业
     */
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
    })
  },
  /**
   * 选择宿舍地址
   */
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    console.log('111111111')
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    let _this=this;
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    //只选择专业
    var areaInfo =that.data.citys[value[1]].name
    //console.log(areaInfo);
    //选择其他专业的时候 重新加载数据 
   
    wx.getStorage({
      key: 'pro_Majorindex',
      success: function(res) {
        console.log(res.data);
        let index=res.data;
        _this.getComeData(index);
      },
    })
    that.setData({
      areaInfo: areaInfo,
      canSubmitFlag3: true,
      bookname: areaInfo
    })
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var provinceNum = value[0]
    var cityNum = value[1]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum]
      })
    }
    console.log(this.data)
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
  //获取点进去专业的 页面数据
  getComeData(index){
    wx.showLoading({
      title: '加载中',
    })
    let _this=this;
    let bookname=this.data.bookname;
    api.request(`/major/books?name=${bookname}`).then(res=>{
      if(res.code==200){
        wx.hideLoading();
        //先动态获取高度
        wx.createSelectorQuery().selectAll('.scroll-box').boundingClientRect(function (rects) {
          //console.log(rects);
          let offsetTop = rects[0].top; //这个高度
          _this.setData({
            scrollHeight: offsetTop
          })
        }).exec()

        let bookLength = res.data[1].length + res.data[2].length + res.data[3].length + res.data[4].length;
        //console.log(bookLength);
        console.log(res.data);
        for(var i=1;i<5;i++){
          for (var k = 0; k < res.data[i].length;k++){
            if (res.data[i][k].publisher==''){
              res.data[i][k].publisher='暂无'
            }
          }
        }
        this.setData({
          // bookLength:res.data[1]+
          college: res.data.college,
          bookLength: bookLength,
          bookList:res.data[index]
        })
      }
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
    let current = event.detail.index + 1;
    wx.setStorageSync('pro_Majorindex', current)
    console.log(current);
    this.getComeData(current);
  },
  //去详情页
  todetailPage(e){
    console.log(e);
    let book_id = e.currentTarget.dataset.bookid;
    console.log(book_id);
    wx.navigateTo({
      url: `../detail/index?bookid=${book_id}`,
    })
  },
  
})