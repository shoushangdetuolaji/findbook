//app.js
App({
  onLaunch: function () {
    //console.log(wx.getStorageSync('nologin_hasCollectBook'));
    if (wx.getStorageSync('nologin_hasCollectBook')==''){
      this.globalData.noLogin_hasCollectBook=[];
      console.log('没有添加收藏书籍历史')
    }else{
      console.log('获取历史收藏书籍历史');
      this.globalData.noLogin_hasCollectBook = wx.getStorageSync('nologin_hasCollectBook');
    }

    if (wx.getStorageSync('borrowBookArray') == '') {
      this.globalData.borrowBookArray = [];
      console.log('没有添加借阅书籍历史')
    } else {
      console.log('获取添加借阅书籍历史');
      this.globalData.borrowBookArray = wx.getStorageSync('borrowBookArray');
    }
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    navHeight:0,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    noLogin_hasCollectBook:[],
    borrowBookArray:[]
  }
})