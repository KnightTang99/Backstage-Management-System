$.ajaxPrefilter(function (options) {
  options.url = 'http://ajax.frontend.itheima.net' + options.url
  if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token') // 给URL含有my的添加请求头
    }
  }
  options.complete = function (res) {
    // 监听ajax请求完成的事件，不管请求发起成功或者失败都会监听到，作用是防止直接访问需要权限的网址
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      window.top.location.href = '/login.html'
    }
  }
})
