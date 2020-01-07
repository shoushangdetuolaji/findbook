// pages/user/index.js
import api from '../../utils/api/api.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    userAvatorUrl: '',
    borrowNum:'',
    contributeNum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 查看是否授权
    wx.getSetting({
      success(res) {
        //console.log(res);
        if (res.authSetting['scope.userInfo']) {
          //同意授权
          wx.login({
            success: res => {
              //console.log("登录成功返回的CODE：" + res.code);
              const code = res.code;
              const obj = {
                "code": code,
                "gender": app.globalData.userInfo.gender,
                "nickName": app.globalData.userInfo.nickName,
                "city": app.globalData.userInfo.city,
                "province": app.globalData.userInfo.province,
                "country": app.globalData.userInfo.country,
                "avatarUrl": app.globalData.userInfo.avatarUrl,
              }
              api.request('/login', 'POST', obj).then(res => {
                console.log(res);
                if (res.code == 200) {
                  wx.setStorage({
                    key: 'token',
                    data: res.data.token,
                  })
                }else if(res.code==403){
                  //token过期重新请求
                  wx.login({
                    success:res=>{
                      console.log(res);
                    }
                  })
                }
              })
            },
            fail: err => {
              console.log('获取登录返回的code失败');
            }
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              //console.log(res);
              //console.log(res.userInfo);
              //console.log(res.rawData)
              _this.setData({
                canIUse: false,
                userInfo: res.userInfo,
               
              })
            },
            fail(err) {
              console.log('调用获取头像失败');
            }
          })
        }
      },
      fail(err) {
        console.log('授权失败');
      }
    })
    if(wx.getStorageSync('token').length!==''){
      //有了token
      _this.getNumOnUser(); //加载用户数量
    }
  },
  getUserInfo(e) {
    wx.showLoading({
      title: '登陆中',
    })
    var _this = this;
    //console.log(e);
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          console.log("登录成功返回的CODE：" + res.code);
          const code = res.code;
          const obj={
            "code":code,
            "gender":app.globalData.userInfo.gender,
            "nickName": app.globalData.userInfo.nickName,
            "city": app.globalData.userInfo.city,
            "province": app.globalData.userInfo.province,
            "country": app.globalData.userInfo.country,
            "avatarUrl": app.globalData.userInfo.avatarUrl,
          }
          api.request('/login','POST',obj).then(res=>{
            console.log(res);
            if(res.code==200){
              wx.setStorageSync('token', res.data.token);
              _this.getNumOnUser(); //获取数量
            }else{
              wx.showToast({
                title: '获取code失败',
                icon:'none'
              })
            }
          })
        }
      })
    }
  },
  //获取 我的页面 数量值
  getNumOnUser(){
    //本地是否存在token
    if(wx.getStorageSync('token')){
      api.request('/user/me', 'GET', '', { 'token': wx.getStorageSync('token') }).then(res => {
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        this.setData({
          contributeNum: res.data.contributions_count,
          borrowNum: res.data.borrows_count
        })
      }).catch(err => {
        console.log(err);
      })
    }else{
      console.log('还没有登录');
    }
  },
  //点击借书订单跳到userCard的0
  tapBorrow(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/userCard/index?kind=0'
    })
  },
  tapContribute(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/userCard/index?kind=1'
    })
  },
  //去关于我们页面
  toAboutUS(e){
    wx.navigateTo({
      url: '/pages/aboutUs/index',
    })
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
    if (wx.getStorageSync('token').length !== '') {
      //有了token
      this.getNumOnUser(); //加载用户数量
    }
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
    var _this = this;
    if (app.globalData.userInfo !== null) {
      wx.showLoading({
        title: '加载中',
      })
      _this.getNumOnUser();
    } else {
      wx.stopPullDownRefresh();
    }
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
  //点击去我的收藏
  toMycollectPage(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/collect/index'
    })
  },
})