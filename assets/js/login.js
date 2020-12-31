$(function () {
  $('#link_register').on('click', function () {
    $('.login_box').hide().siblings('.register_box').show()
  })
  $('#link_login').on('click', function () {
    $('.login_box').show().siblings('.register_box').hide()
  })
})
