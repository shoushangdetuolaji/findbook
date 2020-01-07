// pages/recentContriDetail/index.js
import api from '../../utils/api/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    listData:'',
    kind:'1',//0为 借书订单 1为近期贡献 默认为1,
    title_to:'借阅',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let id=options.id;
    let kind=options.kind;
    this.setData({
      id:id,
      kind:kind
    })
    if(this.data.kind==0){
      this.setData({
        title_to: '借阅'
      })
      wx.setNavigationBarTitle({
        title: "借书-详情"
      })
      this.getBorrowDataDetail();
    }else if(this.data.kind==1){
      this.setData({
        title_to: '贡献'
      })
      wx.setNavigationBarTitle({
        title: "近期贡献-详情"
      })
      this.getRecentContriData();
    }
    wx.showLoading({
      title: '加载中',
    })
  },
  getRecentContriData(){
    api.request('/order/contribute/detail','GET',{"id":this.data.id}).then(res=>{
      console.log(res);
      wx.hideLoading();
      this.setData({
        listData:res.data
      })
    }).catch(err=>{
      console.log(err);
    })
  },
  getBorrowDataDetail(){
    api.request('/order/borrow/detail','GET',{"id":this.data.id},{"token":wx.getStorageSync('token')}).then(res=>{
      console.log(res);
      wx.hideLoading();
      this.setData({
        listData: res.data
      })
    }).catch(err => {
      console.log(err);
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
  toDetailPage(e){
    let book_id = e.currentTarget.dataset.id;
    console.log(e);
    wx.navigateTo({
      url: `../detail/index?bookid=${book_id}`,
    })
  }
})