// pages/userCard/index.js
const app = getApp()

import api from '../../utils/api/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind:'',
    listData:'',
    title:'',
    itemTitle:'',
    itemAfterEditor:'',
    show:false, //弹框
    noDataShow:false,
    kindtoDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let kind=options.kind;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      kind:kind
    })
    if(kind==0){
      //为借书订单
      this.setData({
        title: '借书订单',
        itemTitle: '借书',
        kindtoDetail: 'borrowTodetail'
      })
      this.getMyborrowData();
    }else if(kind==1){
      //我的贡献
      this.setData({

        title: '我的贡献',
        itemTitle: '贡献',
        kindtoDetail:'contributeTodetail'
      })
      this.getMyContributeData();
    }
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  contributeTodetail(e){
    console.log('贡献去详情')
    let id = e.currentTarget.dataset.id;
    let kind = 1; //近期贡献
    let status=e.currentTarget.dataset.status;
    if (status =='正在审核中'){
      wx.showToast({
        icon:'none',
        title: '请等待审核😊',
      })
    }else{
      wx.navigateTo({
        url: `../recentContriDetail/index?id=${id}&kind=${kind}`,
      })
    }
  },
  borrowTodetail(e){
    console.log('借书去详情')
    let id = e.currentTarget.dataset.id;
    let kind = 0; //近期贡献
    wx.navigateTo({
      url: `../recentContriDetail/index?id=${id}&kind=${kind}`,
    })
  },
  //加载我的借书订单数据
  getMyborrowData(){
    api.request('/user/borrow', 'GET', '', { 'token': wx.getStorageSync('token') }).then(res=>{
      console.log(res);
      wx.hideLoading();
      if(res.code==200){
        let listData = res.data
        for (var i = 0; i < listData.length; i++) {
          if (listData[i].status == 0) {
            listData[i].status = "正在审核中";
          } else {
            listData[i].status = "搞掂拉嘿嘿";
          }
        }

        this.setData({
          listData: listData
        })
        wx.stopPullDownRefresh();
      }else if(res.code==204){
        this.setData({
          noDataShow:true,
          listData:''
        })
      }
    })
  },
  //加载我的贡献订单数据
  getMyContributeData(){
    api.request('/user/contribution', 'GET', '', { 'token': wx.getStorageSync('token') }).then(res => {
      console.log(res);
      wx.hideLoading();
      if(res.code==200){
        let listData = res.data
        
        for (var i = 0; i < listData.length; i++) {
          if (listData[i].status == 0) {
            listData[i].status = "正在审核中";
            listData[i].first_book_url='/assets/img/zanwu.png'
            listData[i].title_list=['暂无书名']
            listData[i].hasBorder='border:1px solid #000'
          } else {
            listData[i].status = "搞掂拉嘿嘿";
          }
        }
        this.setData({
          listData: listData
        })
        wx.stopPullDownRefresh();
      }else if(res.code==204){
        this.setData({
          noDataShow: true,
          listData: ''
        })
      }
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
    if (this.data.kind == 0) {
      this.getMyborrowData();
    }else if(this.data.kind==1){
      this.getMyContributeData();
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
  //删除借书订单
  delBorrowOrder(obj){
    let _this=this;
    api.request('/order/borrow/cancel','DELETE',obj,{"token":wx.getStorageSync('token')}).then(res=>{
      console.log(res);
      if (res.code == 200) {
        wx.showModal({
          content: '删除成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _this.getMyborrowData();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  //删除贡献订单
  delContributeOrder(obj) {
    let _this = this;
    api.request('/order/contribute/cancel', 'DELETE', obj, { "token": wx.getStorageSync('token') }).then(res => {
      console.log(res);
      if(res.code==200){
        wx.showModal({
          content: '删除成功',
          showCancel:false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _this.getMyContributeData();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  //删除函数
  formSubmit(e) {
    
    //console.log(e);
    let _this=this;
    let form_id = e.detail.formId;
    let id=e.detail.target.dataset.id;
    let obj={
      "id":id,
      "form_id": form_id
    }
    wx.showModal({
      title: '提示',
      content: `确定取消这个${this.data.title}吗?`,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if(_this.data.kind==0){
            _this.delBorrowOrder(obj);
          }else if(_this.data.kind==1){
            _this.delContributeOrder(obj);
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})