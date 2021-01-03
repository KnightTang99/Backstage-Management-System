$(function () {
  const layer = layui.layer
  // 退出模块
  $('#logout').on('click', function () {
    layer.confirm('确认退出吗？', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token')
      location.href = '/login.html'
      layer.close(index)
    })
  })
  // 调用函数第一次渲染页面（头像和个人信息）
  getUserInfo()
})
// 渲染函数
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success(res) {
      if (res.status !== 0) return layer.msg('获取用户信息失败！')
      renderAvatar(res.data)
    }
  })
}
// 渲染头像的函数
function renderAvatar(user) {
  let name = user.nickname || user.username //短路运算符
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.text-avatar').html(name[0].toUpperCase()).show() // toUpperCase()转换为大写
    $('.layui-nav-img').hide()
  }
}
