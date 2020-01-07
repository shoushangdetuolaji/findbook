// pages/answer/index.js
const app = getApp();
import api from '../../utils/api/api.js';
/***
 * 判断用户滑动
 * 左滑还是右滑
 */
const getTouchData = (endX, endY, startX, startY) => {
  let turn = "";
  if (endX - startX > 50 && Math.abs(endY - startY) < 50) {      //右滑
    turn = "right";
  } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {   //左滑
    turn = "left";
  }
  return turn;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navH:'',
    answerid:'',
    listData:'',
    currentPage:0, //默认一进去页面为第1页
    currentPage_Url:'',//默认第一张图,
    cataLogShow:false,//目录
    touchX:'',
    touchY:'',
    catalogueClassName:'catalogue2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })
    console.log(options);
    let answerid=options.answerid;
    this.setData({
      answerid: answerid
    })

    this.getAnswerData();
  },
  getAnswerData(){
    let answerid=this.data.answerid;
    api.request(`/book/answer/${answerid}`,'GET').then(res=>{
      console.log(res);
      this.setData({
        listData:res.data,
        currentPage:0,
        currentPage_Url:res.data[0].url,
      })
    }).catch(err=>{
      console.log(err);
    })
  },
  preview(e){
    console.log(e);
    let thisImgSrc = e.currentTarget.dataset.src;
    wx.previewImage({
      current: thisImgSrc, // 当前显示图片的http链接
      urls: [`${thisImgSrc}`] // 需要预览的图片http链接列表
    })
  },
  //上一页
  lastPage(e){
    console.log('上一页');
    //判断是否第一页
    if(this.data.currentPage==0){
      wx.showToast({
        icon:'none',
        title: '已经是第一页了',
      })
    }else{
      let lastCurrentPage=this.data.currentPage-1;
      let lastcurrentPage_Url = this.data.listData[lastCurrentPage].url;
      this.setData({
        currentPage: lastCurrentPage,
        currentPage_Url: lastcurrentPage_Url
      })
    }
  },
  //下一页
  nextPage(e){
    console.log('下一页');
    console.log(this.data.currentPage);
    if (this.data.currentPage+1 == this.data.listData.length){
      wx.showToast({
        icon:'none',
        title: '已经是最后一页了',
      })
    }else{
      let nextCurrentPage = this.data.currentPage + 1;
      let nextcurrentPage_Url = this.data.listData[nextCurrentPage].url;
      //console.log(nextCurrentPage);
      this.setData({
        currentPage: nextCurrentPage,
        currentPage_Url: nextcurrentPage_Url
      })
    }
  },
  //展开目录
  showCatalogue(){
    this.setData({
      cataLogShow:true,
      catalogueClassName:'catalogueBack2'
    })
  },
  //关闭目录
  hideCato(e){
    console.log(e);
    this.setData({
      cataLogShow: false,
      catalogueClassName: 'catalogue2'
    })
  },
  //切换答案页
  changePage(e){
    let changeUrl=e.currentTarget.dataset.url;
    let changePage=e.currentTarget.dataset.page;
    this.setData({
      currentPage: changePage-1,
      currentPage_Url: changeUrl
    })
  },
  touchStart(e) {
    console.log(e)
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY
    });
  },
  touchEnd(e) {
    console.log(e);
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    
    let direction=getTouchData(x,y,this.data.touchX,this.data.touchY);
    console.log('向' + direction +'滑动');

    if (direction=='left'){
      console.log('下一页');
      this.nextPage();
    }else if(direction=='right'){
      this.lastPage();
      console.log('上一页');
    }
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
  }
})