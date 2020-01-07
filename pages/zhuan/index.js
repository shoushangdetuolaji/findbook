// pages/zhuan/index.js
import util from '../../utils/util.js';

var address = require('../../utils/dormitory/newDorm.js');
var animation

const app = getApp()

//console.log(dormitory);

const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = ['00','15','30','45'];

//获取年
for (let i = date.getFullYear(); i <= date.getFullYear(); i++) {
  years.push("" + i);
}
//获取月份
for (let i = date.getMonth() + 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = date.getDate()+1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    multiArray: [years, months, days,hours,minutes],
    multiIndex: [1, 11, 17, 10, 17],
    choose_year: '',
    statusBarHeight: app.globalData.statusBarHeight,
    switchContent:'贡献书籍',
    rightMove:'',
    switchHide:true, //一下都是选择地址的
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [], //将address里的provicnces对应 区级
    citys: [],     //citys 对应 苑级
    areas: [],     //areas 对应 苑级里的 栋 
    province: '',   
    city: '',
    area: '',
    canSubmitFlag3:false,
    borrowList:'', //借书清单
    borrowBook_bookid:'',
    borrowBook_urls:'',
    bookValue:'',
    contactValue:'',
    dormNumValue:'',
    imgUrls: [
      '/assets/img/zhuan_guide0.jpg',
      '/assets/img/zhuan_guide1.jpg',
      '/assets/img/zhuan_guide2.jpg'
    ],
    indicatorDots: true,
    guidePageShow:false,
    ltb_cur: 0,//改变当前索引
    lbt_index: 0,//当前的索引
    autoplay: false,
    interval: 5000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //因为自己写了垃圾组件 切换转转 数据不能保存 导致在本地储存绑定事件 麻烦操作
    wx.setStorageSync('form_contri_areaInfo', '')
    this.whetherHaveLogin();
    let _this = this;
    _this.setData({
      navH: app.globalData.navHeight
    })

    /**
     * 判断是否来过
     */
    // let ifcomeGuidePage=wx.getStorageSync('zhuan_guidePageForContribute');
    // if (ifcomeGuidePage.length=='0'){
    //     //guidePageShow=true;
    //     this.setData({
    //       guidePageShow:true,
    //     })
    // }else{
    //   this.setData({
    //     guidePageShow: false,
    //   })
    // }
    //console.log(this.data.multiArray);

    let date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate()+1;
    if (month >= 1 && month<=9){
      month="0"+month;
    }
    if (day >= 0 && day<=9){
      day = "0" + day; 
    }
    let yearIndex;
    let monthIndex;
    let dayIndex;
    //正则遍历 picker的当前时间
    //console.log(_this.data.multiIndex);
    for (let x = 0; x < _this.data.multiArray[0].length; x++) {
      if (year === _this.data.multiArray[0][x]) {
       // console.log(x);
        yearIndex = x;
        break;
      }
    }
    for (let y = 0; y < _this.data.multiArray[1].length; y++) {
      if (month === _this.data.multiArray[1][y]) {
        //console.log(y);
        monthIndex = y;
        break;
      }
    }
    for (let z = 0; z < _this.data.multiArray[2].length; z++) {
      if (day === _this.data.multiArray[2][z]) {
        //console.log(z);
        dayIndex = z;
        break;
      }
    }
    let newmultiIndex = [yearIndex, monthIndex, dayIndex, 9, 0];

    //console.log('x:'+x+' y:'+y+' z:'+z);
    //设置默认的年份
    _this.setData({
      choose_year: _this.data.multiArray[0][0], //默认2019
      time: `${year}-${month}-${day} 09:00`, //显示当前日期
      multiIndex: newmultiIndex
    })

    /**
     * 宿舍地址选择
     */
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    //console.log(this.data)

    this.getBorrowList();
  },
  switchKind(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index
    //console.log(index);
    _this.setData({
      currentTabsIndex: index
    })
    if(index==0){
      _this.setData({
        switchFormShow: true
      })
    }else if(index==1){
      _this.setData({
        switchFormShow: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },  
  //获取时间日期
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hours = this.data.multiArray[3][index[3]];
    const minutes = this.data.multiArray[4][index[4]];
    //console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    //console.log(`${year}-${month}-${day}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
    })
    // console.log(this.data.time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //console.log(app);
    //获取年份
    console.log(e);
    let today = date.getMonth() + 1;
    let hasday = date.getDate();

    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year: choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      console.log(num);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        
        if (num == today) {
          for (let i = hasday+1; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        } else {
          for (let i = 1; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        if (num == today) {
          for (let i = hasday+1; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        } else {
          for (let i = 1; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.whetherHaveLogin();
    this.getBorrowList();
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
  /**
   * 头部导航栏切换
   *  @bindContribute 贡献书籍
   *  @bindBorrow 我要借书
   */
  bindContribute(){
    this.setData({
      rightMove: '',
      switchContent:'贡献书籍',
      switchHide: true
    })
  },
  bindBorrow(){
    this.setData({
      rightMove:'right-move',
      switchContent: '我要借书',
      switchHide:false
    })
  },

  /**
   * 选择宿舍地址
   */
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    console.log('111111111')
    if (that.data.addressMenuIsShow) {
      return
    }f
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name+that.data.citys[value[1]].name+that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
      canSubmitFlag3:true
    })
    wx.setStorageSync('form_contri_areaInfo', areaInfo)
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },
  //贡献书籍组件 传事件给父组件
  onMyEvent(e){
    console.log(e);
    //调用选择宿舍picker组件事件
    this.selectDistrict();
  },
  // //我要借书组件 传事件给父组件
  // borrowOnMyEvent(e) {
  //   console.log(e);
  //   //调用选择宿舍picker组件事件
  //   this.selectDistrict();
  // },

  //判断是否授权登录了
  whetherHaveLogin(){
    //判断是否登录了
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      console.log('登录了');
      this.zhuanzhuanTipsModal();
    } else {
      console.log('m没有登录 跳去我的页面');
      wx.showModal({
        title: '提示',
        content: '请先授权登录',

        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../user/index',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
  },
  zhuanzhuanTipsModal(){
    //进来页面 出现 【贡献书籍】的提示
    let contributeTipShow = wx.getStorageSync('contributeTip');
    console.log(contributeTipShow);
    if (contributeTipShow == 'noShow') {
      console.log('不再提示了');
    } else {
      console.log('又来提示');
      wx.showModal({
        content: '谢谢你这个帅气/漂亮又慷慨的人儿,你终于找到我们啦(///▽///)~我们会按照你所填写的信息进行上门收书服务;\r\n同时,你也可以选择亲自将书送到我们的工作室(黎灿楼网园308),期待你的到来~',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.setStorageSync('contributeTip', 'noShow')
          }
        }
      })
    }
  },
  //获取借书清单
  getBorrowList(){
    let data = wx.getStorageSync('borrowBookArray');
    let borrowBook_urls = [];
    let borrowBook_bookid=[];
    for (var i = 0; i < data.length; i++) {
      borrowBook_urls.push(data[i].resource_url);
      borrowBook_bookid.push(data[i].id);
    }
    this.setData({
      borrowList:data,
      borrowBook_urls: borrowBook_urls,
      borrowBook_bookid: borrowBook_bookid
    })
  },
  //刷新 我要借书的数组data
  refreshBorrowData(e){
    console.log(e);
    this.getBorrowList();
  },
  // swiperChange(e){
  //   // this.setData({
  //   //   swiperCurrent: e.detail.current
  //   // })
  //   let _this=this;
  //   console.log(e);
  //   let current=e.detail.current;
  //   if(current==2){
  //     wx.setStorageSync('zhuan_guidePageForContribute', 'yeeees')
  //     _this.setData({
  //       guidePageShow:false
  //     })
  //   }
  // }
})