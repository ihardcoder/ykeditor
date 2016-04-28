YE.Dialog = {
  /**
   * @desc 隐藏全部弹层
   */
  clearAll: function() {
    $(".ye_qwindow").hide();
    $(".ye_qwindow_mask").hide();
  },
  /**
   * @desc 遮罩层
   */
  cover: function() {
    if (!YE.dialog_cover) {
      var html = "";
      html += "<div class='ye_qmask'>";
      html += "<div class='ye_qmask_cover'></div>";
      html += "<i class='ye_loading-64'></i>";
      html += "</div>";
      $("body").append($(html));
      YE.dialog_cover = $(".ye_qmask");
    }
    YE.dialog_cover.css({
      width: document.documentElement.scrollWidth || document.body.scrollWidth,
      height: document.documentElement.scrollHeight || document.body.scrollHeight
    }).show();
  },

  /**
   * @desc 错误提示弹层
   * @param {string} msg - 提示文案
   * @param {object} size - 弹窗尺寸
   */
  error: function(msg, size) {
    var _size = {
      width: 200,
      height: 90
    };
    if (size) {
      _size.width = size.width || 200;
      _size.height = size.height || 90;
    }
    if (!YE.dialog_error) {
      YE.dialog_error = new YE.Util.Qwindow({
        posrefer: window,
        showhandle: true,
        showmask: true,
        elements: '',
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        }
      });
    }
    var html = [
      '<div class="errorBox" >',
      '<div class="errorBox-msg clearfix">',
      '<span class="ye_icon ye_icon_error"></span>',
      msg,
      '</div>',
      '</div>',
    ];
    YE.dialog_error.setContent('html', html.join(''));
    YE.dialog_error.setSize(_size.width, _size.height);
    YE.dialog_error.show();
    setTimeout(function() {
      YE.dialog_error.hide();
    }, 1500);
  },
  /**
   * @desc 警告提示弹层
   * @param {string} msg - 提示文案
   */
  warning: function(msg) {
    if (!YE.dialog_warning) {
      YE.dialog_warning = new YE.Util.Qwindow({
        size: {
          width: 200,
          height: 120
        },
        posrefer: window,
        showhandle: true,
        showmask: true,
        elements: '',
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        }
      });
    }
    var html = [
      '<div class="warnBox" >',
      '<div class="warnBox-msg clearfix">',
      '<span class="ye_icon ye_icon_warn"></span>',
      msg,
      '</div>',
      '</div>',
    ];
    YE.dialog_warning.setContent('html', html.join(''));
    YE.dialog_warning.setSize(200, 90);
    YE.dialog_warning.show();
    setTimeout(function() {
      YE.dialog_warning.hide();
    }, 5000);
  },

  /**
   * @desc 成功提示弹层
   * @param {string} msg - 提示文案
   * @param {string} [url] - 如果参数url不为空，提示后跳转url
   */
  success: function(msg, url) {
    var close_time = 1500; //1.5S 后隐藏
    var success_layer = new YE.Util.Qwindow({
      size: {
        width: 200,
        height: 80
      },
      posrefer: window,
      showhandle: true,
      showmask: true,
      elements: '',
      maskstyle: {
        'color': '#000',
        'opacity': 0.5
      }
    });
    var html = [
      '<div class="ye_finishBox">',
      '<div class="ye_finishBox-msg clearfix">',
      '<span class="ye_icon ye_icon_finish"></span>',
      '<span class="ye_finish_text">' + msg + '</span>',
      '</div>',
      '</div>',
    ];
    success_layer.setContent('html', html.join(""));
    success_layer.show();
    setTimeout(function() {
      success_layer.hide();
      if (url) {
        window.location.href = url;
      }
    }, close_time);
  },
  /**
   * @desc 上传loading弹层
   * @param {string} msg - 提示文案
   */
  uploading: function(msg) {
    if (!YE.dialog_uploading) {
      YE.dialog_uploading = new YE.Util.Qwindow({
        size: {
          width: 200,
          height: 120
        },
        posrefer: window,
        showhandle: false,
        showmask: true,
        elements: '',
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        }
      });
    }
    var tip = msg || "上传中…";

    var html = ['<div class="loadingBox" id="loadingBox">',
      '<div class="loadingBox-msg clearfix">',
      '<span>' + tip + '</span>',
      '</div>',
      '<div class="loadingBox-btn"><img src="' + YE.config.domain +
      '/u/img/pushRM/loading_64.gif" width="32"></div>',
      '</div>'
    ];
    YE.dialog_uploading.setContent('html', html.join(''));
    YE.dialog_uploading.show();
    // return layer;
  },

  /**
   * @desc 确认提示弹层
   * @param {string} msg - 提示文案
   * @param {function} [fn] - 点击确定按钮的回调函数
   * @param {object} [size] - 弹窗尺寸
   */
  confirm: function(msg, fn, size) {
    var _width = (size && size.width) || 200,
      _height = (size && size.height) || 120;
    // 校验都OK了，问一下确认
    var confirm = new YE.Util.Qwindow({
      size: {
        width: _width,
        height: _height
      },
      posrefer: window,
      showhandle: true,
      showmask: true,
      elements: '',
      maskstyle: {
        'color': '#000',
        'opacity': 0.5
      }
    });
    var html = [
      '<div class="ye_dialog_confirm">',
      '<div class="ye_dialog_confirm_msg clearfix">',
      '<span class="ye_icon ye_icon_alert"></span>',
      '<span class="ye_confirm_text">' + msg + '</span>',
      '</div>',
      '<div class="ye_dialog_confirm_btn"><div class="ye_btn ye_btn_s"><span class="ye_btn_text" _cf_for="ok" >确定</span></div> <div class="ye_btn ye_btn_s ye_btn_grey"><span class="ye_btn_text" _cf_for="cancel">取消</span></div></div>',
      '</div>',
    ];
    confirm.setContent('html', html.join(""));
    confirm.show();
    var $confirm_btn = $(confirm.dom.winbody).find('[_cf_for="ok"]');
    var $cancel_btn = $(confirm.dom.winbody).find('[_cf_for="cancel"]');

    function bind() {
      $confirm_btn.on('click', function() {
        confirm.hide();
        if (typeof fn == 'function') {
          fn();
        }
      });
      $cancel_btn.on('click', function() {
        confirm.hide();
      });
    }
    bind();
    return;
  },

  /**
   * @desc 预览弹层
   */
  preview: function(img, title, url) {
    if (!YE.dialog_preview) {
      YE.dialog_preview = new YE.Util.Qwindow({
        size: {
          width: 830,
          height: 590
        },
        scrolling: false,
        showhandle: true,
        showmask: true,
        pos: {
          top: 'top',
          left: 'center'
        },
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        },
        onhide: function() {
          YE.dialog_preview.setContent("html", "");
        }
      });
    }

    var html = [
      '<div class="qWindowBox qWindowBox_ye" id="qWindowBox_yepreview">',
      '<div class="qWindowBox_yepreview_head">广播预览</div>',
      '<div class="qWindowBox_yepreview_body">',
      '<div class="preview_qcode">',
      '<h4 class="preview_qcode_hint">手机扫描二维码预览</h4>',
      '<h4 class="preview_qcode_hint" style="font-size:14px;margin-top:-10px;">预览内容仅10分钟内有效</h4>',
      '<div class="preview_qcode_thumb">',
      '<img class="preview_qcode_img" src="' + img + '">',
      '<div class="preview_qcode_cover">',
      '<i class="ye_icon_refresh"></i>',
      '</div>',
      '</div>',
      '</div>',
      '<div class="preview_page">',
      '<p class="preview_page_title">' + title + '</p>',
      '<iframe class="preview_page_iframe" frameborder="0" scrolling="auto" src="' +
      url + '"></iframe>',
      '</div>',
      '</div>',
      '</div>'
    ].join("");
    YE.dialog_preview.setContent("html", html);
    YE.dialog_preview.show();
  },
  /**
   * @desc 上传正文图片
   * @param {string|number} id - 编辑器的id
   */
  uploadQW: function(id) {
    if (YE.dialog_uploadQW) {
      YE.dialog_uploadQW.destroy();
    }
    var action = YE.config.domain + YE.URL_UPLOAD_IMG +
      "?push_upload_type=editor&callback=parent.YE.Handler.afterUploadQW&ykeditor_id=" +
      id;
    YE.dialog_uploadQW = new YE.Util.Qwindow({
      size: {
        width: 200,
        height: 120
      },
      posrefer: window,
      showhandle: true,
      showmask: true,
      elements: '',
      maskstyle: {
        'color': '#000',
        'opacity': 0.5
      }
    });
    var target = 'upload_iframe_' + new Date().getTime();
    var html = [
      '<div class="selectImageBox" id="selectImageBox">',
      '<div class="selectImageBox-msg clearfix">',
      '<span>请选择图片</span>',
      '</div>',
      '<div class="selectImageBox-btn">',
      '<iframe name="' + target + '" style="display:none;"></iframe>',
      '<form method="post" id="qw_upimg_form" enctype="multipart/form-data" target="' +
      target + '" action="' + action + '">',
      '<div class="ye_btn ye_btn_s ye_btnmaj_s" ><span class="ye_btn_text">浏览</span></div>',
      '<input type="file" name="upfile" class="upfile" style="position:absolute;opacity:0;filter: alpha(opacity=0);z-index:999;left:72px;top:65px;width:57px;height:24px;" onchange="YE.Handler.onUploadQW(this,' +
      id + ')">',
      '</form>',
      '</div>',
      '</div>',
    ].join('');
    YE.dialog_uploadQW.setContent('html', html);
    YE.dialog_uploadQW.show();
  },
  /**
   * @desc 上传正文图片报错弹层
   * @param {string|number} id - 编辑器的id
   * @param {string} title - 错误提示文案
   */
  uploadQW_error: function(id, title) {
    var target = "";
    var action = YE.config.domain + YE.URL_UPLOAD_IMG +
      "?push_upload_type=editor&callback=parent.YE.Handler.afterUploadQW&ykeditor_id=" +
      id;
    if (!YE.dialog_uploadQW_error) {
      YE.dialog_uploadQW_error = new YE.Util.Qwindow({
        size: {
          width: 200,
          height: 120
        },
        posrefer: window,
        showhandle: true,
        showmask: true,
        elements: '',
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        }
      });
    }
    target = 'upload_iframe_' + new Date().getTime();
    var html = '<div class="uploadQW_errorBox">';
    html += '<div class="uploadQW_errorBox-msg clearfix">';
    html += '<span class="ye_icon ye_icon_error"></span>';
    html += title;
    html += '</div>';
    html += '<div class="uploadQW_errorBox-btn">';
    html += '<div class="ye_btn ye_btn_s ye_btnmaj_s">';
    html += '<span class="ye_btn_text">';
    html += '重新上传图片';
    html += '</span>';
    html += '<iframe name="' + target + '" style="display:none;"></iframe>';
    html += '<form method="post" enctype="multipart/form-data" target="' +
      target + '" action="' + action + '">';
    html +=
      '<input type="file" name="upfile" class="upfile" onchange="YE.Handler.onUploadQW(this,' +
      id + ')">';
    html += '</form>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    YE.dialog_uploadQW_error.setContent('html', html);
    YE.dialog_uploadQW_error.show();
  },
  /**
   * @desc 图片库弹层
   * @param {string} type  - 弹层的状态
   * @param {string} target - 插入图片的区域(cover/editor)
   * @param {string} ctx - 图片库html碎片
   */
  gallery: function(type, target, ctx) {
    var _type = type || "loading";
    var _target = target || "editor";
    var content = "";
    var action = YE.config.domain + YE.URL_UPLOAD_IMG +
      "?callback=parent.YE.Handler.afterUploadGE&ykeditor_id=" + YE.FAKE_ID +
      "&isfromgallery=true";
    var maxCount = _target === "cover" ? 1 : YE.MAX_COUNT_GALLERY_CHECKED;
    var checked_count = (YE.checked_id && YE.checked_id.length) || 0;
    if (!YE.dialog_gallery) {
      YE.dialog_gallery = new YE.Util.Qwindow({
        size: {
          width: 830,
          height: 590
        },
        posrefer: window,
        showhandle: true,
        showmask: true,
        elements: '',
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        },
        onhide: function() {
          // 关闭图片库后清空选中状态
          YE.checked_id = [];
        }
      });
    }
    if (_target === "cover") {
      action += "&push_upload_type=cover";
    } else if (_target === "editor") {
      action += "&push_upload_type=editor";
    }
    switch (_type) {
      case "empty":
        content = [
          '<div class="yegallery_gallery_empty" style="display:block">',
          '<i class="ye_icon ye_icon_notice_blue"></i>',
          '<p class="yegallery_gallery_empty_hint">没有图片，请<span class="yegallery_gallery_empty_act">本地上传</span>图片</p>',
          '<form method="post" enctype="multipart/form-data" action="' +
          action +
          '" target="yegallery_upload_iframe" id="yegallery_upload_form_empty">',
          '<input type="file" name="upfile" class="yegallery_upload_file yegallery_upload_file_empty">',
          '</form>',
          '</div>',
          '<div class="yegallery_gallery_box">',
          '<ul class="yegallery_gallery_list clearfix">',
          '</ul>',
          '</div>'
        ].join("");
        break;
      case "error":
        content = [
          '<div class="yegallery_gallery_error" style="display:block">',
          '<i class="ye_icon ye_icon_error"></i>',
          '<p class="yegallery_gallery_error_hint">加载失败，请检查网络状况或<span class="yegallery_gallery_error_act">刷新</span></p>',
          '</div>'
        ].join("");
        break;
      case "content":
        content = ctx;
        break;
      case "loading":
        content = [
          '<div class="yegallery_gallery_loading" style="display:block;">',
          '<i class="ye_loading-64"></i>',
          '</div>'
        ].join("");
        break;
    }
    var html = [
      '<div class="qWindowBox" id="qWindowBox_yegallery">',
      '<div class="qWindowBox_yegallery_head">从图片库选择</div>',
      '<div class="qWindowBox_yegallery_body">',
      '<div class="yegallery_upload">',
      '<span>建议尺寸：640 x 360 px</span>',
      '<div class="ye_btn yegallery_upload_btn">',
      '<span class="ye_btn_text">本地上传</span>',
      '<iframe name="yegallery_upload_iframe" style="display:none;"></iframe>',
      '<form method="post" enctype="multipart/form-data" action="' +
      action +
      '" target="yegallery_upload_iframe" id="yegallery_upload_form">',
      '<input type="file" name="upfile" class="yegallery_upload_file">',
      '</form>',
      '</div>',
      '</div>',
      '<div class="yegallery_gallery">',
      content,
      '</div>',
      '<div class="qWindowBox_yegallery_act">',
      '<span class="qWindowBox_yegallery_slectedsum">已选' + checked_count +
      '个，可选' + maxCount + '个</span>',
      '<div class="ye_btn ye_btn_l ye_btnmaj_l qWindowBox_yegallery_act_btn ye_btn-disable">',
      '<span class="ye_btn_text" _for="add">完成</span>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
    ].join("");
    YE.dialog_gallery.setContent('html', html);
    YE.dialog_gallery.target = _target;
    YE.dialog_gallery.show();
    // 更新图片库选择状态
    if (type === "content") {
      YE.updateGallery(_target);
    }
  },

  /**
   * @desc 音频库
   * @param {string} type - 弹层的类型
   * @param {string} ctx - 图片库html碎片
   */
  audio: function(type, ctx) {
    var _type = type || "loading";
    var content = "";
    // 上传接口
    var action = YE.URL_AJAX_UPLOAD_AUDIO +
      "?callback=parent.YE.Handler.afterUploadAudio";
    if (!YE.dialog_audio) {
      YE.dialog_audio = new YE.Util.Qwindow({
        size: {
          width: 830,
          height: 590
        },
        posrefer: window,
        showhandle: true,
        showmask: true,
        elements: '',
        maskstyle: {
          'color': '#000',
          'opacity': 0.5
        },
        onhide: function() {
          try {
            soundManager.pauseAll();
          } catch (e) {}
        }
      });
    }

    switch (_type) {
      case "empty":
        content = [
          '<div class="yeaudio_empty" style="display:block">',
          '<i class="ye_icon ye_icon_notice_blue"></i>',
          '<p class="yeaudio_empty_hint">没有语音，请<span class="yeaudio_empty_act">上传语音</span></p>',
          '<form method="post" enctype="multipart/form-data" action="' +
          action +
          '" target="yeaudio_upload_iframe" id="yeaudio_upload_form_empty">',
          '<input type="file" name="audio" class="yeaudio_upload_file yeaudio_upload_file_empty" accept=".mp3,.wma,.wav,.amr">',
          '</form>',
          '</div>'
        ].join("");
        break;
      case "error":
        content = [
          '<div class="yeaudio_error" style="display:block">',
          '<i class="ye_icon ye_icon_error"></i>',
          '<p class="yeaudio_error_hint">加载失败，请检查网络状况或<span class="yeaudio_error_act">刷新</span></p>',
          '</div>'
        ].join("");
        break;
      case "content":
        content = ctx;
        break;
      case "loading":
        content = ['<div class="yeaudio_loading" style="display:block;">',
          '<i class="ye_loading-64-white"></i>',
          '</div>'
        ].join("");
        break;
    }

    var html = [
      '<div class="qWindowBox" id="qWindowBox_yeaudio">',
      '<div class="qWindowBox_yeaudio_head">添加语音</div>',
      '<div class="qWindowBox_yeaudio_body">',
      '<div class="yeaudio_upload">',
      '<span>格式支持mp3\\wma\\wav\\amr，文件大小不超过30MB，语音建议30分钟以内</span>',
      '<div class="ye_btn yeaudio_upload_btn">',
      '<span class="ye_btn_text">本地上传</span>',
      '<iframe name="yeaudio_upload_iframe" style="display:none;"></iframe>',
      '<form method="post" enctype="multipart/form-data" action="' +
      action +
      '" target="yeaudio_upload_iframe" id="yeaudio_upload_form">',
      '<input type="file" name="audio" class="yeaudio_upload_file" accept=".mp3,.wma,.wav,.amr">',
      '</form>',
      '</div>',
      '</div>',
      '<div class="yeaudio_container">',
      content,
      '</div>',
      '<div class="qWindowBox_yeaudio_act">',
      '<div class="ye_btn ye_btn_l ye_btnmaj_l qWindowBox_yeaudio_act_btn ye_btn-disable">',
      '<span class="ye_btn_text" _for="add">完成</span>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
    ].join("");
    YE.dialog_audio.setContent('html', html);
    YE.dialog_audio.show();
  }

};
