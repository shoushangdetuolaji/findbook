// pages/zhuan/_components/Contribute/index.js
import api from '../../../../utils/api/api.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    areaInfo:{
      type:null,
      observer: function (newVal, oldVal){
        if(newVal){
          this.btnChangeColor();
        }
      }
    },
    bookValue:{
      type:null
    },
    canSubmitFlag3:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bookValue: '',
    contactValue:'',
    dormNumValue:'',
    topMoveBook:'',
    topMoveColorBook:'',
    topMoveContact: '',
    topMoveColorContact: '',
    topMoveDormNum:'',
    topMoveColorDormNum:'',
    topMoveColorDorm:'',
    topMoveDorm:'',
    btnBgColor:'',
    canSubmitFlag1:false,
    canSubmitFlag2:false,
    canSubmitFlag3:false,
    canSubmitFlag4:false,
    canIclick:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 对于 item 课本量
     * @getBookValue,focusBook,blurBook
     */
    //获取课本量
    getBookValue(e) {
      //console.log(e.detail.value);
      this.setData({
        bookValue: e.detail.value
      })
      //内容不能为空
      if(e.detail.value==''){
        wx.showToast({
          title: '内容不能为空!',
          icon:'none'
        })
        this.setData({
          canSubmitFlag1:false
        })
      }else{
        this.setData({
          canSubmitFlag1: true
        })
      }
      this.btnChangeColor();
    },
    //focus在 课本量
    focusBook(e){
      this.setData({
        topMoveBook: 'top-move',
        topMoveColorBook:'top-move-color'
      })
    },
    //blur在 课本量
    blurBook(e){
      if (e.detail.value.length==0){
        this.setData({
          topMoveBook: '',
          topMoveColorBook: '',
        })
        wx.showToast({
          title: '课本量不能为空!',
          icon: 'none'
        })
      }else{
        this.setData({
          topMoveBook: 'top-move',
          topMoveColorBook: 'top-move-color',
        })
      }
    },

    /**
     * 对于 item 联系方式
     * @getContactValue,focusContact,blurContact
     */
    getContactValue(e){
      this.setData({
        contactValue:e.detail.value
      })
      let myreg = /^1[34578][0-9]{9}$/;
      if(e.detail.value.length==11){
        if (!myreg.test(e.detail.value)) {
          wx.showToast({
            title: '手机号格式有误！',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            canSubmitFlag2: false
          })
        } else {
          this.setData({
            canSubmitFlag2: true
          })
        }
      }else{
        this.setData({
          canSubmitFlag2: false
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
      if (e.detail.value.length == 0) {
        this.setData({
          topMoveContact: '',
          topMoveColorContact: '',
        })
        //内容不能为空
        wx.showToast({
          title: '联系号码不能为空',
          icon: 'none'
        })
      }
    },
     /**
     * 对于 item 宿舍号
     * @getDormNumValue,focusDormNum,blurDormNum
     */
    getDormNumValue(e){
      this.setData({
        dormNumValue: e.detail.value
      })
      if(e.detail.value!=''){
        if(e.detail.value.length==3){
          this.setData({
            canSubmitFlag4: true
          })
        }else{
          this.setData({
            canSubmitFlag4: false
          })
        }
      }else{
        this.setData({
          canSubmitFlag4: false
        })
      }
      this.btnChangeColor();
    },
    //focus在 宿舍号
    focusDormNum(e) {},
    //blur在 宿舍号
    blurDormNum(e) {
      if(e.detail.value==0){
        //内容不能为空
        wx.showToast({
          title: '宿舍号不能为空',
          icon:'none'
        })
      }
    },
    //传事件给父组件
    toPickAddress(e){  
      console.log(this.data.areaInfo);
      //this.triggerEvent('myevent', { cardTosearch: value });
      this.triggerEvent('myevent');
    },
    //贡献书籍提交表单
    formSubmit(e) {
      let _this=this;
      //console.log(e);
      let token=wx.getStorageSync('token');
      let form_id=e.detail.formId; //formId
      let obj={
        "book_amount": e.detail.value.formBookValue,
        "phone": e.detail.value.formContactValue,
        "address": e.detail.value.formAreaValue,
        "form_id":form_id
      }
      //console.log('form发生了submit事件，携带数据为：', e.detail.value);
      if (token.length!=0){
        api.request('/order/contribute', 'POST', obj, { 'token': token }).then(res => {
          console.log(res);
          /**
           * 处理返回状态 
           * 403token失效 201成功 409申请存在勿重复
           */
          if(res.code==409){
            wx.showModal({
              title: '提示',
              content: res.message,
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  //清除内容
                  //清楚表单内容
                } 
              }
            })
          }else if(res.code==201){
            wx.showModal({
              title: '提示',
              content: '提交成功,等待我们的联系',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          }
          this.setData({
            bookValue: '',
            contactValue: '',
            dormNumValue: '',
            areaInfo: '',
            topMoveBook: '',
            topMoveColorBook: '',
            topMoveContact: '',
            topMoveColorContact: '',
            btnBgColor: '',
            canIclick: true,
            canSubmitFlag1:false,
            canSubmitFlag2:false,
            canSubmitFlag3:false,
            canSubmitFlag4:false
          })
        })
      }else{
        console.log('还没有登录');
      }
    },
    //匹配提交框是否来个变颜色的效果
    btnChangeColor(){
      if(this.data.canSubmitFlag1==true&&this.data.canSubmitFlag2==true&&this.data.canSubmitFlag3==true&&this.data.canSubmitFlag4==true){
        this.setData({
          btnBgColor: 'btnBgColor-on',
          canIclick: false
        })
      }else{
        this.setData({
          btnBgColor: '',
          canIclick: true
        })
      }
    }
  }
})
