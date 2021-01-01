$(function () {
  const layer = layui.layer
  $('#logout').on('click', function () {
    layer.confirm('确认退出吗？', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token')
      location.href = '/login.html'
      layer.close(index)
    })
  })
})
