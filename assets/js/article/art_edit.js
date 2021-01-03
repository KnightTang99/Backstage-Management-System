$(function () {
  const layer = layui.layer
  const form = layui.form
  let p = formateParams(location.search) // 因为是点击编辑按钮，跳转到编辑页面，所以要利用id获取点击了那一项，
  function formateParams(str) {
    let r = str.split('?')[1].split('&')
    const obj = {}
    for (let i = 0; i < r.length; i++) {
      let arr = r[i].split('=')
      obj[arr[0]] = arr[1]
    }
    return obj
  }

  // 编辑页详情函数
  function getArtDetail() {
    $.ajax({
      method: 'GET',
      url: '/my/article/' + p.id,
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取详情失败！')
        }
        layer.msg('获取详情成功！')
        initCate(res.data)
      }
    })
  }
  getArtDetail()
  initEditor()
  function initCate(data) {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类列表失败！')
        }
        let htmlStr = template('modelCate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
        form.val('formEdit', data)
        document.querySelector('#content_ifr').contentDocument.querySelector('#tinymce').innerHTML = data.content
        $('#image').prop('src', 'http://ajax.frontend.itheima.net' + data.cover_img)
        $image.cropper(options)
      }
    })
  }
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域

  $('#chooseImg').on('click', function () {
    $('#coverFile').click()
  })
  $('#coverFile').on('change', function () {
    let file = this.files
    if (file.length === 0) {
      return
    }
    let newImgURL = URL.createObjectURL(file[0])
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  // 发布状态模块
  let art_state = '已发布'
  $('#formSave').on('click', function () {
    art_state = '草稿'
  })
  $('#formPub').on('submit', function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    let fd = new FormData(this)
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        fd.append('Id', p.id)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })
  })
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        // location.href = '/article/art_list.html'
        window.parent.document.querySelector('[href="/article/art_list.html"]').click()
      }
    })
  }
})
