//index.js
import api from '../../utils/api/api.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: app.globalData.statusBarHeight,
    hotSearchList: [
      "大学英语",
      "大学物理",
      "生物",
      "电子",
      "英语",
      "计算机",
      "物理"
    ],
    user:{},
    recentContriList:[
      {
        "created_at": "2019-05-27 20:10:23",
        "textbooks_count": 4,
        "textbooks": [
          {
            "id": 262,
            "title": "大学化学实验 3",
            "resource_url": "https://book-1256628303.cos.ap-guangzhou.myqcloud.com/cover/559a4e2a7a6459888581f8dbf559666f.jpg",
          },
          {
            "id": 2572,
            "author": "大学体验英语项目组",
            "title": "大学体验英语综合教程（4） 第3版",       
            "resource_url": "https://cjdaoss.oss-cn-beijing.aliyuncs.com/1SVQ5lDcFBkiOIVK.JPG",

          },
          {
            "id": 2573,
            "author": "谭浩强",
            "title": "c语言程序设计第四版",
            "publisher": "清华大学出版社",
            "resource_url": "https://cjdaoss.oss-cn-beijing.aliyuncs.com/312cb678-e111-11e8-93a7-8c8590a3c4f1.jpeg"
          },
          {
            "id": 2819,
            "author": "赵荣",
            "title": "人文地理学 第2版",
            "publisher": "高等教育出版社",      
            "resource_url": "https://cjdaoss.oss-cn-beijing.aliyuncs.com/GcV8T4lMkKsZ_8Vp.jpg",

          }
        ],
        "user": {
          "id": 3,
          "nickName": "受伤的拖拉机",
          "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/8R5MjXc98CUkKsBS49fzFtq63SYkp400IW09OeORTBtDia9q3euwvXzHOkeDXevkyd4ZRcnpE52ml7e9lX0ia8nw/132"
        }
      },
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this=this;

    this.setData({
      navH: app.globalData.navHeight
    })
    wx.showLoading({
      title: '加载中',
    })
    //加载热门搜索
    api.request('/book/hotsearch').then(res=>{
      console.log(res);
      let hotSearchList=res.data;
      this.setData({
        hotSearchList: hotSearchList
      })
    }).catch(err=>{
      console.log('加载热门出错'+err);
    })

    this.getRecentContributeData();
    //

  //   console.log(app.globalData);
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  },
  //去搜索页面
  toSearchPage(e){
    wx.navigateTo({
      url: '../search/index'
    })
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
  toDetailPage(e){
    console.log(e);
    let book_id = e.currentTarget.dataset.bookid;
    console.log(e);
    wx.navigateTo({
      url: `../detail/index?bookid=${book_id}`,
    })
  },
  getRecentContributeData(){
    api.request('/order/recent_contribution','GET').then(res=>{
      console.log(res);
      wx.hideLoading();
      this.setData({
        recentContriList:res.data
      })
    })
  },
  arriveHotSearchPage(e){
    console.log(e.currentTarget.dataset.name);
    let info = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../search/index',
    })
    wx.setStorageSync('indexInfo', info);
  },
  toRecentContriPage(e){
    let id = e.currentTarget.dataset.id;
    let kind = 1; //近期贡献
    wx.navigateTo({
      url: `../recentContriDetail/index?id=${id}&kind=${kind}`,
    })
  }
})
