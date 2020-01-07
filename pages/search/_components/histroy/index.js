// pages/search/_components/histroy/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listarr: {
      type: Array,
      value: ''
    },
    cardTosearch: {
      type: String,
      value: 'default'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasHistoryShow:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delHistory(e){
      let _this=this;
      wx.showModal({
        title: '提示',
        content: '确定清除搜索历史吗?',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.setData({
              listarr: [],
              hasHistoryShow: false
            })
            //清除缓存的数据
            wx.setStorage({
              key: 'list_arr',
              data: [],
            })
            _this.triggerEvent('myeventShownoSearchRecord');
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    //点击 搜索历史card 继续搜索
    this_value(e) {
      let value = e.currentTarget.dataset.text;
      //console.log(value);
      this.triggerEvent('myevent', { cardTosearch: value });
    }
  }
})
