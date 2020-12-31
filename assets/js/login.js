$(function () {
  $('#link_register').on('click', function () {
    $('.login_box').hide().siblings('.register_box').show()
  })
  $('#link_login').on('click', function () {
    $('.login_box').show().siblings('.register_box').hide()
  })
  const form = layui.form
  const layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6~12位，且不能出现空格'],
    repwd: function (value) {
      if (value !== $('.register_box [name=password]').val()) return '两次输入的密码不一致!'
    }
  })
  $('#register_form').on('submit', function (e) {
    e.preventDefault()
    registerUser()
  })
  $('#login_form').on('submit', function (e) {
    e.preventDefault()
    loginUser()
  })
})
function registerUser() {
  $.ajax({
    method: 'POST',
    url: '/api/reguser',
    data: {
      username: $('.register_box [name=username]').val(),
      password: $('.register_box [name=password]').val()
    },
    success(res) {
      if (res.status !== 0) return layer.msg(res.message)
      $('#link_login').click()
    }
  })
}
function loginUser() {
  $.ajax({
    method: 'POST',
    url: '/api/login',
    data: $('#login_form').serialize(),
    success(res) {
      console.log(res)
      if (res.status !== 0) return layer.msg('登陆失败!')
      layer.msg('登陆成功!')
      localStorage.setItem('token', res.token)
      location.href = '/index.html'
    }
  })
}
