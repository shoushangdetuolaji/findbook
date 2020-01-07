let API_HOST = "https://book.lizhen123.cn/api";

function request(url, method, params = {}, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_HOST + url,
      method: method ? method : 'get',
      data: params,
      header: {
        ...header,
        'content-Type': method === 'GET' ? "application/json" : "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.code === 'unlogin') {
          wx.login({
            success(res) {
              request(url, method, params, header).then(resolve(res))
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '因为不能获得用户授权，所以不能够提供对应的服务。请尝试重新操作并授权。',
                showCancel: false,
                confirmColor: "#cba7f9"
              })
            }
          })
        } else {
          resolve(res.data)
        }
      },
      fail: reject
    });
  })
}

module.exports = {
  request: request
}
