// pages/collect/index.js
import api from '../../utils/api/api.js'

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  //加载我的收藏数据函数
  getCollectData(){
   
    let noLogin_hasCollectBook = wx.getStorageSync('noLogin_hasCollectBook');
    for (var i = 0; i < noLogin_hasCollectBook.length;i++){
      if (noLogin_hasCollectBook[i].publisher=='暂无'){
        noLogin_hasCollectBook[i].publisher='暂无出版社'
      }
      if (noLogin_hasCollectBook[i].author=='暂无'){
        noLogin_hasCollectBook[i].author ='暂无主编'
      }
    }
    this.setData({
      collectList: noLogin_hasCollectBook
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
    //进入我的收藏加载用户
    this.getCollectData();
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
  //删除收藏
  deleteThisCol(e){
    var _this=this;
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定取消收藏这本书吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定');
          let index;
          let noLogin_hasCollectBook = wx.getStorageSync('noLogin_hasCollectBook');
          for (var i = 0; i < noLogin_hasCollectBook.length;i++){
            if (id == noLogin_hasCollectBook[i].id){
              index=i;
              break;
            }
          }
          noLogin_hasCollectBook.splice(index,1);
          wx.setStorageSync('noLogin_hasCollectBook', noLogin_hasCollectBook);
          wx.showToast({
            icon:'none',
            title: '取消收藏成功',
          })
          _this.getCollectData();
        } else if (res.cancel) {
          console.log('点击取消了');
        }
      }
    })
  },
  tobookDetail(e){
    let book_id = e.currentTarget.dataset.bookid;
    console.log(e);
    wx.navigateTo({
      url: `../detail/index?bookid=${book_id}`,
    })
  }
})