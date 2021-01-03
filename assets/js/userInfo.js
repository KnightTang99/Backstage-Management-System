$(function () {
  const form = layui.form
  const layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6 || value.length < 1) return '昵称长度必须在 1 ~ 6 个字符之间！'
    }
  })

  // 初始化用户信息，因为刚开始的时候，如果有信息得渲染到表单内

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
  // 重置按钮

  $('#btnReset').on('click', function (e) {
    e.preventDefault() //重置按钮也有提交行为，得阻止
    initUserInfo() // 重置了以后得将原始的数据渲染
  })

  // 用户信息修改后提交

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) return layer.msg('修改用户信息失败！')
        window.parent.getUserInfo() // 子操父，调用父级的函数，实现用户名和头像的更新
        $('.layui-form')[0].reset() // reset()只能是 DOM元素调用
      }
    })
  })
})
