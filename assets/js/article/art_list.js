$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage
  let q = {
    // 这个就是定义刚开始提交的参数配置
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  initTable()
  initCate()

  // 初始化表格的数据

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        let htmlStr = template('renderList', res) // template() 渲染函数
        $('tbody').html(htmlStr)
        renderPage(res.total) // 渲染列表数据以后拿到数据的总数 res.total 才能渲染后面的页码
      }
    })
  }

  // 过滤器函数，用于处理时间

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

  // 初始化文章类别的函数

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
        form.render() // 请求需要时间，刚开始的时候 art-template 插件还没接收到请求过来的数据，所以渲染为空，此时需要利用form的render函数再次渲染，此情况只针对   【表单元素】   可能是动态插入
      }
    })
  }

  // 表单筛选提交

  $('#cateForm').on('submit', function (e) {
    e.preventDefault()
    let cate_id = $('[name = cate_id]').val() // 将筛选的条件赋值，并作为ajax请求的参数
    let state = $('[name = state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  // 渲染页码的函数

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

  // 删除list

  $('tbody').on('click', '.deletBtn', function () {
    let id = $(this).attr('data-id')
    let len = $('.deletBtn').length // 这里的 deletBtn 不能用id，因为在渲染的时候，id不能有相同的
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      // 提示删除的弹框
      // 以下是确认删除后需要做的事
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id, //删除指定ID的列表
        success(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          if (len == 1) {
            // 为了防止当删除完以后页码跳转但是内容没跳转
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })
})
