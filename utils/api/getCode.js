import api from './api.js'
const app = getApp();

function getCode(){
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //console.log(res.code);
      const code = res.code;
      const obj = {
        "code": code,
        "gender": app.globalData.userInfo.gender,
        "nickName": app.globalData.userInfo.nickName,
        "city": app.globalData.userInfo.city,
        "province": app.globalData.userInfo.province,
        "country": app.globalData.userInfo.country,
        "avatarUrl": app.globalData.userInfo.avatarUrl,
      }
      api.request('/login', 'POST', obj).then(res => {
        console.log(res);
        if (res.code == 200) {
          wx.setStorageSync('token', res.data.token);
        } else {
          wx.showToast({
            title: '获取code失败',
            icon: 'none'
          })
        }
      })
    }
  })
}

module.exports = {
  getCode: getCode
}