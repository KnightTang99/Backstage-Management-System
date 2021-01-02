$(function () {
  const layer = layui.layer
  const form = layui.form
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
        if (res.status !== 0) return layer.msg('添加文章分类失败！')
        layer.msg('添加文章分类成功！')
        layer.close(index)
        initArtCate()
      }
    })
  })
  //   修改内容
  let editIndex = null
  $('tbody').on('click', '.editBtn', function () {
    editIndex = layer.open({
      title: '修改文章分类',
      type: 1,
      area: ['500px', '250px'],
      content: $('#editArt').html()
    })
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success(res) {
        form.val('editForm', res.data)
      }
    })
  })
  $('body').on('submit', '#editForm', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('更新内容失败!')
        }
        layer.msg('更新内容成功！')
        layer.close(editIndex)
        initArtCate()
      }
    })
  })

  //   删除功能
  $('tbody').on('click', '.deletBtn', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCate()
        }
      })
    })
  })
})
// 初始化函数
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
