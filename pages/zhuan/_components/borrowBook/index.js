// pages/zhuan/_components/borrowBook/index.js
import api from '../../../../utils/api/api.js';
import util from '../../../../utils/time.js';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time:{
      type:String
    },
    borrowList:{
      type:Array,
      observer: function (newVal, oldVal) {
        if (newVal) {
          console.log('yes');
          this.btnChangeColor();
        }
      }
    },
    borrowBook_bookid:{
      type: Array
    },
    borrowBook_urls:{
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeValue:'',
    contactValue: '',
    topMoveTime:'',
    topMoveColorTime:'',
    topMoveContact: '',
    topMoveColorContact: '',
    canSubmitFlag:false,
    btnBgColor:"",
    canIclick:true,
    NewborrowList:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * item 上门时间
     * @focusTime,getTimeValue,blurTime
     */
    focusTime(e){
      this.setData({
        topMoveTime: 'top-move',
        topMoveColorTime: 'top-move-color'
      })
    },
    /**
     * 对于 item 联系方式
     * @getContactValue,focusContact,blurContact
     */
    getContactValue(e) {
      this.setData({
        contactValue: e.detail.value
      })
      let myreg = /^1[34578][0-9]{9}$/;
      if (e.detail.value.length == 11) {
        if (!myreg.test(e.detail.value)) {
          wx.showToast({
            title: '手机号格式有误！',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            canSubmitFlag: false
          })
        } else {
          this.setData({
            canSubmitFlag: true
          })
        }
      } else {
        this.setData({
          canSubmitFlag: false
        })
      }
      this.btnChangeColor();
    },
    //focus在 联系方式
    focusContact(e) {
      this.setData({
        topMoveContact: 'top-move',
        topMoveColorContact: 'top-move-color'
      })
    },
    //blur在 联系方式
    blurContact(e) {
      if (this.data.contactValue.length == 0) {
        this.setData({
          topMoveContact: '',
          topMoveColorContact: ''
        })
      } else {
        this.setData({
          topMoveContact: 'top-move',
          topMoveColorContact: 'top-move-color'
        })
      }
    },
    //上门时间
    bindMultiPickerChange(e){

    },
    bindMultiPickerColumnChange(e){
      
    },
    formSubmit(e) {

      let _this=this;
      //console.log(e);
      let token = wx.getStorageSync('token');
      let form_id = e.detail.formId; //formId
      let id = this.properties.borrowBook_bookid;
      //console.log(form_id);

      let obj = {
        "id": id,//课本id
        "visit_time": e.detail.value.formTimeValue,
        "form_id": form_id,
        "phone": e.detail.value.formContactValue,
      }
      console.log(obj);
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      if (token.length != '0') {
        api.request('/order/borrow', 'POST', obj, { 'token': token }).then(res => {
          console.log(res);
          if (res.code == 409) {
            wx.showModal({
              title: '提示',
              content: res.message,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  //清除内容
                }
              }
            })
          } else if (res.code == 201) {
            console.log(res);

            //console.log('青旅');
            // wx.removeStorageSync('borrowBookArray')
            wx.showModal({
              title: '提示',
              content: '提交成功,等待结果',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  //清除内容
                  let empty = [];
                  wx.setStorageSync('borrowBookArray', empty);
                  app.globalData.borrowBookArray = empty;
                  _this.setData({
                    contactValue: '',
                  })
                  _this.blurContact();
                  //wx.setStorageSync('borrowBookArray','');
                  _this.triggerEvent('myevent');
                }
              }
            })
          }
        }).catch(err => {
          console.log(err);
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '请先授权登录',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../user/index',
              })
            }
          }
        })
      }
    },
    //我要借书 按钮变颜色
    btnChangeColor(){
      let borrowBookArrayLen = wx.getStorageSync('borrowBookArray').length;
      if (this.data.canSubmitFlag == true && borrowBookArrayLen!='0') {
        this.setData({
          btnBgColor: 'btnBgColor-on',
          canIclick: false
        })
      } else {
        this.setData({
          btnBgColor: '',
          canIclick: true
        })
      }
    },
    previewImage(e) {
      // let oldArry=wx.getStorageSync('borrowBookArray');
      // let newArry=[];
      // for(var i=0;i<oldArry.length;i++){
      //   newArry.push(oldArry[i].resource_url);
      // }
      console.log(e);
      var current = e.target.dataset.src;
      console.log(e.target.dataset.src);
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: this.properties.borrowBook_urls // 需要预览的图片http链接列表
      })
    },
    //长按删掉此课本
    deleteBook(e){
      let _this=this;
      let list = wx.getStorageSync('borrowBookArray');
      let thisBookId=e.currentTarget.dataset.bookid;
      let index;
      for (var i = 0; i < list.length; i++) {
        if (thisBookId == list[i].id) {
          console.log('ee');
          index = i;
          break;
        }
      }
      //console.log(list);
      wx.showModal({
        title: '提示',
        content: '确定取消借阅这本书？',
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定');
            list.splice(index, 1);
            wx.setStorageSync('borrowBookArray', list)
            app.globalData.borrowBookArray=list;
            //_this.data.borrowList = newborrowList;
            //console.log(_this.data.borrowList);
            _this.triggerEvent('myevent');
          } else if (res.cancel) {
            console.log('点击取消了');
          }
        }
      })
    },
    toBorrowMore(e){
      wx.navigateTo({
        url: '../../../../search/index',
      })
    }
  }
})
