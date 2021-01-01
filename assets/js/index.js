$(function () {
  const layer = layui.layer
  $('#logout').on('click', function () {
    layer.confirm('确认退出吗？', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token')
      location.href = '/login.html'
      layer.close(index)
    })
  })
  getUserInfo()
})
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
function renderAvatar(user) {
  let name = user.nickname || user.username
  $('#welcome').html('欢迎' + name)
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.text-avatar').html(name[0].toUpperCase()).show()
    $('.layui-nav-img').hide()
  }
}
