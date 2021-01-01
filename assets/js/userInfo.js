$(function () {
  const form = layui.form
  const layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6 || value.length < 1) return '昵称长度必须在 1 ~ 6 个字符之间！'
    }
  })
  initUserInfo()
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) return layer.msg('获取用户信息失败！')
        form.val('formUserInfo', res.data)
      }
    })
  }
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) return layer.msg('修改用户信息失败！')
        $('.layui-form')[0].reset()
      }
    })
  })
})
