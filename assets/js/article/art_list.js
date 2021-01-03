$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage
  let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  initTable()
  initCate()
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        let htmlStr = template('renderList', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败！')
        }
        let htmlStr = template('cateList', res)
        $('#cateForm [name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  $('#cateForm').on('submit', function (e) {
    e.preventDefault()
    let cate_id = $('[name = cate_id]').val()
    let state = $('[name = state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })
  function renderPage(total) {
    laypage.render({
      elem: 'renderPage', //注意，这里的 test1 是 ID，不用加 # 号
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      limits: [2, 3, 5, 10],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      jump: function (obj, first) {
        ;(q.pagenum = obj.curr), (q.pagesize = obj.limit)
        if (!first) {
          initTable()
        }
      }
      //数据总数，从服务端得到
    })
  }
  $('tbody').on('click', '.deletBtn', function () {
    let id = $(this).attr('data-id')
    let len = $('.deletBtn').length
    console.log(len)
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          if (len == 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })
})
