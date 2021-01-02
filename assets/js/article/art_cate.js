$(function () {
  const layer = layui.layer
  initArtCate()
  let index = null
  $('#addBtn').on('click', function () {
    index = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '250px'],
      content: $('#addArt').html()
    })
  })
  $('body').on('submit', '#cateForm', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $('#cateForm').serialize(),
      success(res) {
        console.log(res)
        if (res.status !== 0) return layer.msg('添加文章分类失败！')
        layer.msg('添加文章分类成功！')
        layer.close(index)
        initArtCate()
      }
    })
  })
})
function initArtCate() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success(res) {
      let htmlStr = template('modelAdd', res)
      $('tbody').empty().html(htmlStr)
    }
  })
}
