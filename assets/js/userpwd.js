$(function () {
  const form = layui.form
  const layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6~12位，且不能出现空格'],
    newpwd: function (value) {
      if (value === $('.layui-form [name=oldPwd]').val()) return '新密码不能与原密码相同！'
    },
    repwd: function (value) {
      if (value !== $('.layui-form [name=newPwd]').val()) return '两次密码不一致！'
    }
  })
  $('#pwdForm').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: {
        oldPwd: $('#pwdForm [name=oldPwd]').val(),
        newPwd: $('#pwdForm [name=newPwd]').val()
      },
      success(res) {
        if (res.status !== 0) return layer.msg('修改密码失败！')
        $('#pwdForm')[0].reset()
      }
    })
  })
})
