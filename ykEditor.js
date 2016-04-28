/**! 优酷图文发布器  
 *@version: 1.0.0-2015/09/12
 *@author: zhoujunpeng
*/
var YE = (function($){

var $ = $ || jQuery;

/** @namespace YE
 * @global
 * @type {object}
 * @desc 单例全局对象
 */
var YE = {
  // 纯字符匹配
  REG_CHAR: /^[\w_]+$/,
  // 合法链接匹配
  REG_LINK: /.*?\.?(youku|tudou|laifeng|soku)\.com/,
  // 邮件链接格式匹配
  REG_LINK_MAIL: /^mailto\:.*?\@.*/,
  // 合法图片url匹配
  REG_IMG: /.*?\.?(youku|ykimg)\.com/,
  // 能发布的文章上限
  MAX_NUM_ARTICLE: 1,
  // 标题字数限制
  MAX_COUNT_TITLE: 40,
  // 摘要字数限制
  MAX_COUNT_SUMMARY: 40,
  // 求赏赐标题字数限制
  MAX_COUNT_DONATETITLE: 20,
  // 求赏赐感谢语字数限制
  MAX_COUNT_DONATEFLAG: 100,
  // 正文字数限制
  MAX_COUNT_CONTENT: 20000,
  // 图片库同时可选择的图片个数
  MAX_COUNT_GALLERY_CHECKED: 5,

  //接口url
  URL_AJAX: "/u/pushsub/",
  // 发布接口
  URL_AJAX_PUBLISH: "/u/pushsub/publishPushArticle",
  // 推送接口
  URL_AJAX_SEND: "/u/pushsub/sendPushArticle",
  // 删除文章接口
  URL_AJAX_DEL: "/u/pushsub/delPushArticle",
  // 视频数据获取接口
  URL_AJAX_GET_VIDEO: "/u/pushsub/getVideoList",
  // 但视频获取接口
  URL_AJAX_GET_VIDEO_BY_URL: "/u/pushsub/getVideoByUrl",
  // 上传图片接口
  URL_UPLOAD_IMG: "/u/pushsub/uploadPushImage",
  // 获取可发布次数
  URL_AJAX_GET_PUBLISHLIMIT: "/u/pushsub/getPushLimit",
  // 获取草稿
  URL_AJAX_GET_DRAFT: "/u/pushsub/getPushArticleList",
  // 获取打赏id
  URL_AJAX_GET_DONATEID: "http://hudong.pl.youku.com/interact/libs/set/plugin",
  // 图片库获取
  URL_AJAX_GET_GALLERY: "/u/pushsub/getMaterial",
  // 图片库删除单个图片
  URL_AJAX_DEL_GALLERYL: "/u/pushsub/delMaterial",
  // 获取预览信息
  URL_AJAX_GET_PREVIEW: "/u/pushsub/getPreview",
  // 获取语音库列表
  URL_AJAX_GET_AUDIOS: "/u/pushsub/getAudios",
  // 删除单条语音
  URL_AJAX_DEL_AUDIO: "/u/pushsub/delAudio",
  // 编辑单条语音
  URL_AJAX_EDIT_AUDIO_TITLE: "/u/pushsub/updateaudiotitle",
  // 上传语音
  URL_AJAX_UPLOAD_AUDIO: "http://audio.upload.youku.com/u/pushsub/uploadPushAudio",

  // 图片库上传控件的ykeditor_id值
  FAKE_ID: 1,

  // 容器id
  id: "",

  // 发布&评论&打赏的权限控制
  limitStatus: {
    publish_limit: 1,
    enableDonate: false,
    enableComment: true,
    enableInsertAudio: false
  },

  lock: {
    uploadAudio: false
  },

  // 是否绑定关闭浏览器事件。发布成功后不触发
  isBindUnload: true,

  // 容器box
  $container: null,

  // 图片库被选择的图片id数组
  checked_id: [],
  // 图片库被选择的图片信息
  checked_img: {},

  res_status: {
    uploadGE: false,
    uploadCV: false,
    uploadQW: false,
    uploadAudio: false
  },

  // 初始化的时间戳，用于写入草稿场景
  init_timestamp: null,

  // 实例集合
  instances: {
    count: 0
  },

  //配置参数
  config: {
    domain: "http://" + window.location.host,
    emptyCV: "/u/img/ykeditor/blank-cover.png",
    editor: {
      width: "100%",
      height: 500
    }
  },

  // 默认配置
  defaultOpts: {
    ISHEADERFIXED: true,
    HEIGHT_HEADER: 60,

    editor: {
      serverUrl: "",
      //工具栏图标
      toolbars: [
        ['fontsize', 'forecolor', 'bold', 'italic', 'underline'],
        ['yevideo', 'yeimage', 'yelink', 'yevote', 'yeaudio']
      ],
      // 禁用字数统计
      wordCount: false,
      // 禁用底部节点层次提示
      elementPathEnabled: false,
      // 禁用右键菜单
      enableContextMenu: false,
      //粘贴只保留标签，去除标签所有属性
      retainOnlyLabelPasted: true,
      // false为不使用纯文本粘贴，true为使用纯文本粘贴
      pasteplain: false,
      // 关闭可拖拽改变大小
      scaleEnabled: false,
      // 关闭自动保存
      enableAutoSave: false,
      // 是够转换div标签为p标签
      allowDivTransToP: false,
      // 是否保持toolbar位置不变，false状态为实现toolbar fix
      autoFloatEnabled: false,
      // 手动设置domain是开启为true
      customDomain: true,
      // charset: "utf-8",
      // 字号
      fontsize: [10, 12, 14, 16, 18, 20, 24],
      // 自定义样式
      initialStyle: "img{max-width:100%;display:block;} .donateBox_fake{display:none;visibility:hidden;} .yevote_box{position:relative;} .yevote_box .yevote_box_cover{position:absolute;width:100%;height:100%;background-color:#555;z-index:100;opacity:0.2;filter: alpha(opacity=0.2);} .yeaudio_box{     font-family: '微软雅黑', arial, helvetica, verdana, tahoma, sans-serif; background: url('" +
        "http://" + window.location.host +
        "/u/img/ykeditor/audioimg.png') no-repeat;height: 60px;width: 350px;padding-left: 70px;border: solid #f5f5f5 1px;position:relative;} .yeaudio_box_cover{position: absolute;width: 100%;height: 100%;background-color: #555;z-index: 100;opacity: 0;filter: alpha(opacity=0);top: 0;left: 0;}",
      // 编辑器iframe外链css
      iframeCssUrl: "http://" + "static.youku.com" +
        "/plugins/pluginFrontEndV2/o/css/main.min.css"
    }
  },
  /**
   * @namespace  YE.Ajax
   * @desc Ajax函数集
   */
  Ajax: {},
  /**
   * @namespace  YE.UI
   * @desc UI函数集
   */
  UI: {},
  /**
   * @namespace  YE.Util
   * @desc 工具函数集
   */
  Util: {},
  /**
   * @namespace  YE.Bind
   * @desc 事件绑定函数集
   */
  Bind: {},
  /**
   * @namespace  YE.Handler
   * @desc 事件处理函数集
   */
  Handler: {},
  /**
   * @namespace  YE.Dialog
   * @desc 弹窗函数集
   */
  Dialog: {},
  /**
   * @namespace  YE.Plugins
   * @desc 编辑器插件集
   */
  Plugins: {},

  // 草稿数据
  data_draft: null,

  $publish_box: null,
  $publish_btn: null,
  $publish_status: null,

  /**
   * @desc 编辑器实例生成函数
   * @param {string} id - 容器id
   * @param {object} opt - 配置参数
   */
  getEditor: function(id, opt) {
    if (!id || !this.REG_CHAR.test(id)) {
      this.Util.log.error("invalid id");
      return;
    }
    document.domain = "youku.com";
    var _this = this;
    this.id = id;
    this.editor_opt = $.extend({}, _this.defaultOpts.editor, opt.editor);
    this.opt = $.extend({}, _this.defaultOpts, opt, {
      editor: this.editor_opt
    });

    this.$container = $("#" + id);
    if (this.$container.length === 0) {
      this.Util.log.error("invalid id");
      return;
    }
    this.$container.css({
      "position": "relative"
    });

    // 绘制发布操作区
    this.UI.render.call(this);
    // 获取当天可发布状态后创建编辑器实例
    this.UI.publish.updateStatus.call(this, function() {
      var _this = YE;
      _this.initPlugins();
      var timestamp = _this.init_timestamp = YE.Util.getTimestamp();
      var ykeditor = _this.instances[timestamp];
      if (!ykeditor) {
        ykeditor = _this.instances[timestamp] = new YKEditor(timestamp,
          _this.opt);
        _this.instances.count++;
      }
    });
    // 获取草稿
    setTimeout(function() {
      _this.Ajax.loadDraft.call(_this);
    }, 1000);
    // 绑定发布和添加文章事件
    this.bind();

  },

  /**
   * @function
   * @desc 事件绑定
   */
  bind: function() {
    var _this = this;
    _this.Bind.addArticle.call(_this);
    _this.Bind.publish.call(_this);
    _this.Bind.gallery.call(_this);
    _this.Bind.preview.call(_this);
  },

  /**
   * @function
   * @desc 初始化编辑器内核插件
   */
  initPlugins: function() {
    for (var plugin in YE.Plugins) {
      YE.Plugins[plugin]();
    }
  },
  /**
   * @function
   * @deprecated 站内文件阻塞严重，影响视觉体验，暂时移除
   * @desc 隐藏容器以便样式修正
   */
  hideBox: function() {
    // YE.$container.css("visibility", "hidden");
  },
  /**
   * @function
   * @desc 显示容器和发布操作区
   */
  showBox: function() {
    // YE.$container.css("visibility","visible");
    YE.$publish_box.show();
  },
  /**
   * @function
   * @desc 将草稿数据写入编辑器
   */
  updateDraft: function() {
    var _this = this;
    var data = _this.data_draft;
    if (!data) {
      return;
    }
    var i = 0,
      len = data.length;
    for (i = 0; i < len; i++) {
      // 如果存在多篇草稿，则创建新编辑器实例
      if (i !== len - 1) {
        var _timestamp = YE.Util.getTimestamp();
        var _ykeditor = _this.instances[_timestamp] = new YKEditor(
          _timestamp, _this.opt, data[i], true);
      } else {
        break;
      }
    }

    // 防止编辑器初始化过慢引起的草稿数据写入错误
    var timer = setInterval(function() {
      if (_this.instances[_this.init_timestamp].isComplete) {
        _this.instances[_this.init_timestamp].updateDraft(data[len - 1]);
        clearInterval(timer);
      }
    }, 200);

    _this.Ajax.getArticleLimit.call(_this);
  },
  /**
   * @function
   * @desc 更新发布文章限制，并显示/隐藏add按钮
   */
  updateArticleLimit: function() {
    var _this = this;
    var $all = _this.$container.children();
    var $last = $($all[$all.length - 1]);
    $all.find(".ye_cover_add").hide();
    if (_this.instances.count < _this.MAX_NUM_ARTICLE) {
      $last.find(".ye_cover_add").show();
    }
  },
  /**
   * @function
   * @desc 保存当前编辑的文章草稿。此时未激活状态的文章已经被保存，故无需再次保存。
   */
  saveActive: function() {
    var _this = this;
    for (var i in _this.instances) {
      if (i !== "count") {
        if (_this.instances[i].active) {
          _this.instances[i].autosave();
        }
      }
    }
  },
  /**
   * @function
   * @desc 设置所有实例为不可编辑状态
   */
  disableAll: function() {
    var _this = this;
    for (var i in _this.instances) {
      if (i !== "count") {
        _this.instances[i].disable();
      }
    }
  },
  /**
   * @function
   * @desc 更新图片库状态
   */
  updateGallery: function(target) {
    var _this = this;
    var maxCount = target === "cover" ? 1 : YE.MAX_COUNT_GALLERY_CHECKED;
    $("#qWindowBox_yegallery .qWindowBox_yegallery_slectedsum").html("已选" +
      YE.checked_id.length + "个，可选" + maxCount + "个");
    if (_this.checked_id.length === 0) {
      return;
    }
    $("#qWindowBox_yegallery .qWindowBox_yegallery_act_btn").removeClass(
      "ye_btn-disable");
    $.each(_this.checked_id, function(i, v) {
      $("#qWindowBox_yegallery .yegallery_gallery_item[_id=" + v + "]")
        .addClass("yegallery_gallery_item-checked");
    });
  }
};

/**
 * @memeberof YE
 * @static
 * @type {object}
 * @desc UEditor配置参数映射Object,若开启新配置项必须在此Object内声明映射关系
 */
YE.options = {
	UEDITOR_HOME_URL: "UEDITOR_HOME_URL",
	serverUrl: "serverUrl",
	toolbars: "toolbars",
	elementPathEnabled: "elementPathEnabled",
	wordCount: "wordCount",
	enableContextMenu: "enableContextMenu",
	scaleEnabled: "scaleEnabled",
	enableAutoSave: "enableAutoSave",
	autoFloatEnabled: "autoFloatEnabled",
	customDomain: "customDomain",
	fontsize: "fontsize",
	initialStyle: "initialStyle",
	iframeCssUrl: "iframeCssUrl",
	allowDivTransToP: "allowDivTransToP",
	charset: "charset"
};

/**
 * @desc 绑定添加新文章事件
 * @todo 目前暂未开放
 */
YE.Bind.addArticle = function() {
  var _this = this;

  function addArticle() {
    var _this = YE;
    if (_this.instances.count >= _this.MAX_NUM_ARTICLE) {
      return;
    }
    var timestamp = _this.Util.getTimestamp();
    for (var o in _this.instances) {
      if (o !== "count") {
        _this.instances[o].disable();
      }
    }
    var ykeditor = _this.instances[timestamp] = new YKEditor(timestamp, _this
      .opt);
    _this.instances.count++;
    _this.updateArticleLimit();
  }
  _this.$container.on("click", ".ye_cover_add", addArticle);
};

/**
 * @desc 绑定图片库事件
 */
YE.Bind.gallery = function() {
  var CLASS_CHECKED = "yegallery_gallery_item-checked";

  // 当前激活状态编辑器
  var instance = null;
  var _target = "";
  var maxCount = 0;
  var _id = 0,
    _img = "",
    _index = 0,
    _html = "",
    $img = null;
  var uploading_dom = [
    '<li class="yegallery_gallery_item yegallery_gallery_item-fake">',
    '<div class="gallery_item_thumb">',
    '<div class="thumb_cover thumb_cover_checked"></div>',
    '<img class="thumb_img" src="/u/img/ykeditor/uploading.jpg">',
    '<span class="ye_icon ye_icon_close_cube"></span>',
    '</div>',
    '<div class="gallery_item_entry">',
    '<span class="entry_name">上传中...</span>',
    '</div>',
    '</li>'
  ].join("");
  // 检查图片格式是否合法
  function _checkImg(file) {
    var filename = file;
    // 校验校验扩展名
    var extname = /\.[^\.]+$/.exec(filename)[0];
    extname = extname.toLowerCase();

    if (extname != '.png' && extname != '.jpg' && extname != '.jpeg' &&
      extname != '.gif') {
      return false;
    }
    return true;
  }

  function countChecked() {
    // 区分封面与正文
    maxCount = YE.dialog_gallery.target === "cover" ? 1 : YE.MAX_COUNT_GALLERY_CHECKED;
    $("#qWindowBox_yegallery .qWindowBox_yegallery_slectedsum").html("已选" +
      YE.checked_id.length + "个，可选" + maxCount + "个");

    if (YE.checked_id.length !== 0) {
      $("#qWindowBox_yegallery .qWindowBox_yegallery_act_btn").removeClass(
        "ye_btn-disable");
    } else {
      $("#qWindowBox_yegallery .qWindowBox_yegallery_act_btn").addClass(
        "ye_btn-disable");
    }
  }

  $(document).on("click", "#qWindowBox_yegallery .yegallery_gallery_item",
    function(e) {
      // 区分封面与正文
      maxCount = YE.dialog_gallery.target === "cover" ? 1 : YE.MAX_COUNT_GALLERY_CHECKED;
      if ($(this).hasClass("yegallery_gallery_item-fake")) {
        return false;
      }
      if ($(this).hasClass("yegallery_gallery_item-checked")) {
        $(this).removeClass(CLASS_CHECKED);
        _id = $(this).attr("_id");
        _index = $.inArray(_id, YE.checked_id);
        YE.checked_id.splice(_index, 1);
      } else {
        if (maxCount === 1) {
          $("#qWindowBox_yegallery .yegallery_gallery_item").removeClass(
            CLASS_CHECKED);
          $(this).addClass(CLASS_CHECKED);
          YE.checked_id = [];
          _id = $(this).attr("_id");
          YE.checked_id.push(_id);
        } else {
          if (YE.checked_id.length < maxCount) {
            $(this).addClass(CLASS_CHECKED);
            _id = $(this).attr("_id");
            YE.checked_id.push(_id);
          }
        }
        $img = $(this).find(".thumb_img");
        YE.checked_img[_id] = {
          "src": $img.attr("src"),
          "w": $img.attr("_width") || "0",
          "h": $img.attr("_height") || "0"
        };
      }
      countChecked();
    }).on("click", "#qWindowBox_yegallery .qWindowBox_yegallery_act_btn",
    function(e) {
      // 未选图片不可操作
      if (YE.checked_id.length === 0 || $(this).hasClass("ye_btn-disable")) {
        return;
      }
      // 获取当前active的编辑器
      for (var o in YE.instances) {
        if (o !== "count") {
          if (YE.instances[o].active) {
            instance = YE.instances[o];
          }
        }
      }

      if (YE.dialog_gallery.target === "cover") {
        // 更新封面
        _img = YE.checked_img[YE.checked_id[0]].src;
        instance.$cover_preview_img.attr("src", _img);
        instance.$cover_preview_box.show();
        instance.data.cover = _img;
        instance.status.cover = 1;
        instance.UI.articlelist.updateCover.call(instance);
        instance.$cover_error.hide();
        instance.autosave();
      } else if (YE.dialog_gallery.target === "editor") {
        // 插入新图片之前要清空碎片内容
        _html = "";
        // 正文插入图片
        $.each(YE.checked_id, function(i, v) {
          _img = YE.checked_img[v].src;
          _html += "<img src=" + _img + " _width=" + YE.checked_img[v].w +
            " _height=" + YE.checked_img[v].h + ">";
        });
        instance.ueditor.execCommand("inserthtml", _html);
        instance.autosave();
      }

      YE.dialog_gallery.hide();
    }).on("click", "#qWindowBox_yegallery .ye_icon_close_cube", function(e) {
    // 删除单张图片
    var ev = e || window.event;
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    } else {
      ev.cancelBubble = true;
    }
    // 清空checked图片
    YE.checked_id = [];
    // 保存目标类型
    _target = YE.dialog_gallery.target;

    YE.Dialog.gallery("loading", _target);
    var _url = YE.URL_AJAX_DEL_GALLERYL + "?material_id=" + $(this).attr(
      "_id");
    $.ajax({
      url: _url,
      dataType: "jsonp",
      error: function() {
        YE.Dialog.gallery("error", _target);
      },
      complete: function(xhr, status) {
        if (status === "timeout") {
          YE.Dialog.gallery("error", _target);
        }
      },
      success: function(res) {
        if (!res || res.code !== "100") {
          YE.Dialog.gallery("error", _target);
        }
        YE.Ajax.getGallery(_target);
      }
    });

    return false;
  }).on("change",
    "#qWindowBox_yegallery .yegallery_upload_file, #yegallery_upload_form_empty .yegallery_upload_file_empty",
    function() {
      if ($(this).val() === "") {
        return;
      }
      var isValid = _checkImg($(this).val());
      if (!isValid) {
        alert("图片格式错误");
      } else {
        var filename = $(this).val().split('fakepath\\')[1];
        $("#qWindowBox_yegallery .yegallery_gallery_list").prepend(
          uploading_dom);
        $("#qWindowBox_yegallery .yegallery_gallery_item-fake .entry_name")
          .html(filename);
        if ($(this).hasClass("yegallery_upload_file_empty")) {
          $(".yegallery_gallery_empty").hide();
          $("#yegallery_upload_form_empty").submit();
        } else {
          $("#yegallery_upload_form").submit();
        }

        YE.res_status.uploadGE = false;
        var timer = setTimeout(function() {
          if (YE.res_status.uploadGE) {
            clearTimeout(timer);
          } else {
            $(
              "#qWindowBox_yegallery .yegallery_gallery_item-fake .thumb_img"
            ).attr("src", "/u/img/ykeditor/upload-error.jpg");
          }
        }, 10000);
      }
    }).on("click", "#qWindowBox_yegallery .qPager_gallery a", function() {
    var pager = $(this).attr("_page");
    if (pager) {
      var url = YE.URL_AJAX_GET_GALLERY + "?page=" + pager;
      // 保存目标类型
      _target = YE.dialog_gallery.target;
      YE.Ajax.getGallery(_target, url);
    }
  }).on("click", "#qWindowBox_yegallery .yegallery_gallery_error_act",
    function() {
      // 保存目标类型
      _target = YE.dialog_gallery.target;
      YE.Ajax.getGallery(_target);
    });
};

/**
 * @desc 绑定预览弹层事件
 */
YE.Bind.preview = function() {
	var _this = this;
	$(document).on("click", "#qWindowBox_yepreview .preview_qcode_cover",
		function(e) {
			for (var o in _this.instances) {
				if (o !== "count") {
					if (_this.instances[o].active) {
						_this.instances[o].Ajax.getPreview.call(_this.instances[o]);
						return false;
					}
				}
			}
		});
};

/**
 * @desc 绑定发布事件
 */
YE.Bind.publish = function() {
  var _this = this;
  // 检查打赏内容是否符合规范
  var getDonateId = function() {
    YE.Dialog.cover();
    for (var o in _this.instances) {
      if (o !== "count") {
        _this.instances[o].Ajax.getDonateId.call(_this.instances[o]);
      }
    }
  };
  // 检查是否可发布
  var checkPublish = function() {
    if (_this.limitStatus.publish_limit === 0) {
      _this.$publish_status.parent().addClass("ye_status_publish-error");
      return;
    }
    var isAbleToPublish = false;
    for (var o in _this.instances) {
      if (o !== "count") {
        isAbleToPublish = _this.instances[o].checkAbleToPost("publish");
        if (!isAbleToPublish) {
          _this.instances[o].showErrors();
          return;
        }
      }
    }
    if (isAbleToPublish) {
      _this.Dialog.confirm("发布后将无法修改，确认发布么？", function() {
        if (!_this.limitStatus.enableDonate) {
          onPublish();
        } else {
          getDonateId();
        }
      });
    }
  };
  // 过滤站外资源并储存过滤后的每篇文章
  var onPublish = function() {
    for (var o in _this.instances) {
      if (o !== "count") {
        var formated = _this.Util.formatLinks.call(_this.instances[o]);
        if (formated) {
          _this.instances[o].ueditor.setContent(_this.instances[o].data.content);
        }
        if (_this.instances[o].active) {
          _this.instances[o].Ajax.sendArticle.call(_this.instances[o],
            "publish");
        }
      }
    }
  };
  // 预览
  var onPreview = function() {
    var self;
    for (var o in _this.instances) {
      if (o !== "count") {
        if (_this.instances[o].active) {
          self = _this.instances[o];
          break;
        }
      }
    }
    var isAbleToPreview = self.checkAbleToPost("preview");
    if (isAbleToPreview) {
      var formated = YE.Util.formatLinks.call(self);
      if (formated) {
        YE.Dialog.confirm("站外链接将被过滤，是否继续？", function() {
          self.ueditor.setContent(self.data.content);
          self.Ajax.sendArticle.call(self, "preview");
        });
      } else {
        self.Ajax.sendArticle.call(self, "preview");
      }
    } else {
      self.showErrors();
    }
  };
  // 手动保存
  var onSave = function() {
    for (var o in _this.instances) {
      if (o !== "count") {
        if (_this.instances[o].active) {
          _this.instances[o].autosave("manual");
          break;
        }
      }
    }
  };

  _this.$publish_btn.on("click", checkPublish);
  _this.$publish_btn.on("publish", onPublish);
  _this.$publish_preview.on("click", onPreview);
  _this.$publish_save.on("click", onSave);
};

/**
 * @deprecated
 * @desc 绑定链接跳转事件
 */
YE.Bind.unload = function() {
  var _this = this;
  $(window).on("beforeunload", function() {
    if (_this.isBindUnload) {
      _this.saveActive();
      return "编辑内容已自动保存";
    }
  });
};

/**
 * @desc UI绘制函数
 */
YE.UI.render = function() {
	var _this = this;
	_this.UI.publish.render.call(_this);
};

/**
 * @desc 发布操作区UI
 */
YE.UI.publish = {

  render: function() {
    var html = "<div class='ye_box ye_box_publish' style='display:none;'>";
    html += "<div class='ye_body ye_body_publish'>";
    html += "<div class='ye_btn ye_btn_large ye_btnsub_large ye_act_save'>";
    html += "<span class='ye_btn_text'>保存</span>";
    html += "</div>";
    html +=
      "<div class='ye_btn ye_btn_large ye_btn_grey ml20 ye_act_preview'>";
    html += "<span class='ye_btn_text'>预览</span>";
    html += "</div>";
    html +=
      "<div class='ye_btn ye_btn_large ye_btn_grey ml20 ye_act_publish'>";
    html += "<span class='ye_btn_text'>发布</span>";
    html +=
      "<div class='ml8 f_14 c_gray ye_status_publish'><i class='ye_icon ye_icon_arrow_yellow_l'></i><span class='ye_status_publish_hint'>今天还剩1次发布机会</span></div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    this.$publish_box = $(html).insertAfter(this.$container);
    this.$publish_btn = this.$publish_box.find(".ye_act_publish");
    this.$publish_status = this.$publish_box.find(".ye_status_publish_hint");
    this.$publish_preview = this.$publish_box.find(".ye_act_preview");
    this.$publish_save = this.$publish_box.find(".ye_act_save");
  },
  // 根据接口数据修改是否可发布以及可发布文章数目
  updateStatus: function(callback) {
    var _this = YE;
    var url = YE.config.domain + YE.URL_AJAX_GET_PUBLISHLIMIT;
    $.ajax({
      url: url,
      type: "post",
      dataType: "jsonp",
      success: function(res) {
        if (!res || res.code !== "100" || res.data === 0) {
          YE.UI.publish.disable.call(YE);
          return;
        }
        if (res.code === "100" && res.data !== 0) {
          // 【important】评论和打赏只储存状态，不更新dom，由每个编辑器实例生成后再更新
          YE.limitStatus.enableDonate = res.data.donate_limit;
          YE.limitStatus.enableInsertAudio = res.data.audio_limit;
          YE.limitStatus.publish_limit = res.data.publish_limit;
          YE.limitStatus.enableComment = res.data.comment_limit;
          if (YE.limitStatus.publish_limit === 0) {
            YE.UI.publish.disable.call(YE, YE.limitStatus.publish_limit);
          } else {
            YE.UI.publish.enable.call(YE, YE.limitStatus.publish_limit);
          }
          // _this.$publish_box.show();
          if (callback) {
            callback();
          }
        }
      },
      error: function() {
        YE.Util.log.error("用户数据获取出错");
        YE.UI.publish.disable.call(YE);
      }
    });
  },
  // 设置为不可发布状态
  disable: function() {
    var _this = this;
    _this.$publish_btn.addClass('ye_btn-disable');
    _this.$publish_status.html("今天还剩0次发布机会");
  },
  // 设置为可发布状态
  enable: function(count) {
    var _this = this;
    _this.$publish_btn.removeClass('ye_btn-disable');
    _this.$publish_status.html("今天还剩" + count + "次发布机会");
  }
};

/**
 * @desc 过滤script标签以防止XSS注入
 * @param {string} value - 待过滤的text
 * @param {string} type - 过滤类型
 */
YE.Util.textfilter = function(value, type) {
	var regScript = /(<(s|S)cript>)|(<\/(s|S)cript>)/g;
	var result = "";
	switch (type) {
		case "script":
			result = value.replace(regScript, "script");
			if (result === value) {
				result = "";
			}
			break;
	}

	return result;
};

/**
 * @desc 获取当前时间戳
 */
YE.Util.getTimestamp = function() {
	var date = new Date();
	return date.valueOf() || data.getTime();
};

/**
 * @desc 清除投票控件
 */
YE.Util.clearVoteExtra = function(str) {
	var result = "";
	var $str = $("<div>" + str + "</div>");
	$str.find(".yevote_box").html("");
	result = $str.html();
	return result;
};

/**
 * @desc 规范日期格式
 * @param {object} dateobj - 日期Object
 * @param {string} fmt - 规范化格式
 */
YE.Util.format_date = function(dateobj, fmt) {
  var o = {
    "M+": dateobj.getMonth() + 1, //月份
    "d+": dateobj.getDate(), //日
    "h+": dateobj.getHours(), //小时
    "m+": dateobj.getMinutes(), //分
    "s+": dateobj.getSeconds(), //秒
    "q+": Math.floor((dateobj.getMonth() + 3) / 3), //季度
    "S": dateobj.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (dateobj.getFullYear() + "").substr(4 -
      RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +
        o[k]).substr(("" + o[k]).length)));
  return fmt;
};

/**
 * @desc 过滤编辑内容中的站外链接
 */
YE.Util.formatLinks = function() {
  var _this = this;
  var content = _this.data.content || "";
  var isInvalidLink = false;
  if (content !== "") {
    var $dom = $("<div>" + content + "</div>");
    var $links = $dom.find("a"),
      // $imgs = $dom.find("img"),
      $iframes = $dom.find("iframe");
    // 链接
    if ($links.length !== 0) {
      $.each($links, function(index, link) {
        var href = $(link).attr("href");
        if (href) {
          // 修复IE自动转换mailto url
          if (UE.browser.ie && YE.REG_LINK_MAIL.test(href)) {
            isInvalidLink = true;
            $(link).replaceWith($("<span>" + $(link).html() + "</span>"));
          } else {
            if (!YE.REG_LINK.test(href)) {
              isInvalidLink = true;
              $(link).attr("href", "http://www.youku.com/");
            }
          }
        }
      });
    }
    // 图片
    // if ($imgs.length !== 0) {
    //   $.each($imgs, function(index,img) {
    //     var src = $(img).attr("src");
    //     if (!YE.REG_IMG.test(src)) {
    //       isInvalidLink = true;
    //       $(img).remove();
    //     }
    //   });
    // }
    // iframe
    if ($iframes.length !== 0) {
      $.each($iframes, function(index, iframe) {
        var src = $(iframe).attr("src");
        if (!YE.REG_LINK.test(src)) {
          isInvalidLink = true;
          $(iframe).attr("src", "");
        }
      });
    }
    if (isInvalidLink) {
      _this.data.content = $dom.html();
    }
  }
  return isInvalidLink;
};

/**
 * @desc log函数
 */
YE.Util.log = {
	error: function(msg) {
		/* jshint ignore:start */
		console && console.error(msg);
		/* jshint ignore:end */
	}
};

/**
 * @desc 将ykeditor定义的参数映射为UEditor参数，名称对应参照{@link YE.options}对象
 * @param {object} opt - 原始配置参数
 * @see {@link YE.options}
 */
YE.Util.mapOpts = function(opt) {
  if (!opt || Object.prototype.toString.call(opt) !== "[object Object]") {
    return;
  }
  var reference = YE.options;
  var result = {};
  for (var o in opt) {
    result[reference[o]] = opt[o];
  }

  return result;
};

/**
 * @desc 弹窗工具函数
 * @param {object} params - 配置参数
 */
YE.Util.Qwindow = function(params) {
  //default config
  this.config = {
    title: '',
    size: {
      width: 320,
      height: 200
    },
    mode: 'normal',
    posrefer: window,
    pos: {
      top: 'middle',
      left: 'center'
    },
    content: {
      type: 'html',
      value: ''
    },
    maskstyle: {
      color: '#545454',
      opacity: 0.5
    },
    showmask: true,
    showhandle: true,
    zindex: 30000,
    scrolling: false,
    elements: 'object,embed,select',
    onshow: function() {},
    onhide: function() {},
    ondestroy: function() {}
  };
  this.config = arguments[0] ? (typeof(arguments[0]) == 'object' ? this._mergeConfig(
    this.config, params) : params) : this.config;

  this.isIE = (document.all) ? true : false;
  this.isIE6 = this.isIE && !window.XMLHttpRequest;
  //sogou
  //var ua = navigator.userAgent.toLowerCase();
  //ua.indexOf('se 2.x') != -1 ? true : false;
  this.init();
};

YE.Util.Qwindow.prototype = {
  init: function() {
    this.status = 'hide';
    this.isDestroy = false;
    this.dom = {};
    this.dom.win = document.createElement('div');
    this.dom.win.className = 'ye_qwindow';
    this.dom.winbox = document.createElement('div');
    this.dom.winbox.className = 'ye_winbox';
    this.dom.winbg = document.createElement('div');
    this.dom.winbg.className = 'ye_winbg';

    this.dom.winhead = document.createElement('div');
    this.dom.winhead.className = 'ye_winhead';
    this.dom.wintitle = document.createElement('div');
    this.dom.wintitle.className = 'ye_wintitle';
    this.dom.winclose = document.createElement('div');
    this.dom.winclose.className = 'ye_winclose';
    this.dom.winbody = document.createElement('div');
    this.dom.winbody.className = 'ye_winbody';

    this.dom.winmask = document.createElement('div');
    this.dom.winmask.className = 'ye_qwindow_mask';

    if (this.config.title) {
      this.setTitle(this.config.title).showTitle();
    }
    if (this.config.size) {
      this.setSize(this.config.size.width, this.config.size.height);
    }
    if (this.config.content) {
      this.setContent(this.config.content.type, this.config.content.value);
    }
    if (this.config.mode == 'fixed') {
      this.setMode('fixed');
    }
    if (this.config.showhandle) {
      this.showHandle();
    }

    this.setMaskstyle(this.config.maskstyle.color, this.config.maskstyle.opacity);
    this.setElements(this.config.elements);
    this.setzIndex(this.config.zindex);

    this.dom.winhead.appendChild(this.dom.wintitle);
    this.dom.winhead.appendChild(this.dom.winclose);
    this.dom.winbox.appendChild(this.dom.winhead);
    this.dom.winbox.appendChild(this.dom.winbody);
    this.dom.win.appendChild(this.dom.winbox);
    this.dom.win.appendChild(this.dom.winbg);
    document.body.appendChild(this.dom.winmask);
    document.body.appendChild(this.dom.win);

    this.bind();

  },
  destroy: function() {
    if (this.isDestroy ||
      !this.dom.win ||
      !this.dom.winmask ||
      !this.dom.win.parentNode ||
      !this.dom.winmask.parentNode) {
      return false;
    }

    this.isDestroy = true;
    if (typeof(this.config.ondestroy) == 'function') {
      this.config.ondestroy();
    }

    var iframe = this.dom.win.getElementsByTagName('iframe')[0];
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
    this.dom.win.parentNode.removeChild(this.dom.win);
    this.dom.winmask.parentNode.removeChild(this.dom.winmask);

    return true;
  },
  bind: function() {
    var _this = this;
    this.dom.winclose.onclick = function() {
      _this.hide();
    };
    var resetwin = function() {
      var status = _this.getStatus();
      if (status == 'show') {
        _this.rePos().resizeMask();
      }
    };
    if (window.addEventListener) {
      window.addEventListener('resize', function() {
        setTimeout(resetwin, 10);
      }, false);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', function() {
        setTimeout(resetwin, 10);
      });
    }
    return this;
  },
  _setOpacity: function(element, opacity) {
    if (!element) {
      return false;
    }
    if (!document.all) {
      element.style.opacity = opacity;
    } else {
      element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
    }
    return true;
  },
  show: function() {
    var pos = this.getPos();
    this.setPos(pos.top, pos.left);
    this.hideElements();
    if (!this.isIE) {
      this._setOpacity(this.dom.win, 1);
    }
    this.dom.win.style.visibility = 'visible';
    this.status = 'show';
    if (this.config.showmask) {
      this.resizeMask();
      this.dom.winmask.style.display = 'block';
    }
    if (typeof(this.config.onshow) == 'function') {
      this.config.onshow();
    }
    return this;
  },
  hide: function() {
    this.showElements();
    if (!this.isIE) {
      this._setOpacity(this.dom.win, 0);
    }
    this.dom.win.style.visibility = 'hidden';
    this.dom.winmask.style.display = 'none';
    this.status = 'hide';
    if (typeof(this.config.onhide) == 'function') {
      this.config.onhide();
    }
    return this;
  },
  getStatus: function() {
    return this.status;
  },
  toggle: function() {
    var status = this.getStatus();
    if (status == 'show') {
      this.hide();
    } else if (status == 'hide') {
      this.show();
    }
    return this;
  },
  reload: function() {},
  clearContent: function() {
    var iframe = this.dom.win.getElementsByTagName('iframe')[0];
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
    this.dom.winbody.innerHTML = '';
    return this;
  },
  setMode: function(mode) {
    var m = 'normal';
    if (mode == 'fixed') {
      m = 'fixed';
    } else {
      m = 'normal';
    }
    if (this.config.posrefer == window && !this.isIE6) {
      this.dom.win.style.position = (m == 'fixed') ? 'fixed' : 'absolute';
      this.config.mode = m;
      this.rePos();
    }
    return this;
  },
  setContent: function(type, value) {
    this.config.content.type = type;
    this.config.content.value = value;
    this.clearContent();
    if (type == 'html' || type == 'element') {
      if (type == 'html') {
        this.dom.winbody.innerHTML = value;
      } else {
        if (!value) {
          return false;
        }
        this.dom.winbody.appendChild(value);
      }
      if (this.config.scrolling) {
        this.dom.winbody.style.overflow = 'auto';
      } else {
        this.dom.winbody.style.overflow = 'hidden';
      }
    } else if (type == 'iframe') {
      this.dom.winbody.style.overflow = 'hidden';
      var iframe = document.createElement('iframe');
      iframe.frameBorder = '0';
      iframe.scrolling = this.config.scrolling ? 'auto' : 'no';
      this.dom.winbody.appendChild(iframe);
      setTimeout(function() {
        iframe.src = value;
      }, 10); //for ie6
    }
    return this;
  },
  setScrolling: function(bool) {
    if (this.config.scrolling != bool) {
      this.config.scrolling = bool;
      if (this.config.content.type == 'iframe') {
        iframe = this.dom.winbody.getElementsByTagName('iframe')[0];
        if (iframe) {
          this.dom.winbody.style.overflow = 'hidden';
          var iframe_new = document.createElement('iframe');
          iframe_new.frameBorder = '0';
          iframe_new.scrolling = bool ? 'auto' : 'no';
          iframe_new.src = this.config.content.value;
          iframe.parentNode.removeChild(iframe);
          this.dom.winbody.appendChild(iframe_new);
        }
      } else {
        if (bool) {
          this.dom.winbody.style.overflow = 'auto';
        } else {
          this.dom.winbody.style.overflow = 'hidden';
        }
      }
    }
    return this;
  },
  getSize: function() {
    return this.config.size;
  },
  getRealsize: function() {
    return {
      'width': this.dom.win.scrollWidth,
      'height': this.dom.win.scrollHeight
    };
  },
  setSize: function(_width, _height) {
    var width = parseInt(_width, 10);
    var height = parseInt(_height, 10);
    this.config.size.width = width;
    if (!isNaN(width)) {
      this.dom.winbody.style.width = width + 'px';
      this.dom.winhead.style.width = width + 'px';
    }
    if (!isNaN(height)) {
      this.config.size.height = height;
      this.dom.winbody.style.height = height + 'px';
    }
    this.rePos();
    return this;
  },
  getPos: function() {
    return this.config.pos;
  },
  setPosrefer: function(refer) {
    if (!refer) {
      return false;
    }
    this.config.posrefer = refer;
    this.rePos();
    return this;
  },
  setPos: function(top, left) {
    var top_offset = 0;
    var left_offset = 0;
    var realtop = this.config.posrefer != window ? (isNaN(parseInt(top, 10)) ?
      0 : parseInt(top, 10)) : top;
    var realleft = this.config.posrefer != window ? (isNaN(parseInt(left,
      10)) ? 0 : parseInt(left, 10)) : left;

    var size_real = this.getRealsize();
    var size_ref = (this.config.posrefer != window) ? {
        'width': this.config.posrefer.offsetWidth,
        'height': this.config.posrefer.offsetHeight
      } :
      this._getClientRange();
    var scr = (this.config.posrefer != window) ?
      this._getOffsetPos(this.config.posrefer) :
      this.config.mode == 'fixed' ? {
        top: 0,
        left: 0
      } : this._getWindowScroll();

    if (top == 'top') {
      realtop = scr.top;
    } else if (top == 'middle') {
      realtop = scr.top + parseInt((size_ref.height - size_real.height) / 2);
    } else if (top == 'bottom') {
      realtop = scr.top + (size_ref.height - size_real.height);
    } else {
      realtop = scr.top + parseInt(top, 10);
    }
    if (left == 'left') {
      realleft = scr.left;
    } else if (left == 'center') {
      realleft = scr.left + parseInt((size_ref.width - size_real.width) / 2);
    } else if (left == 'right') {
      realleft = scr.left + parseInt(size_ref.width - size_real.width);
    } else {
      realleft = scr.left + parseInt(left, 10);
    }

    this.config.pos.top = top;
    this.config.pos.left = left;
    this.dom.win.style.top = realtop + 'px';
    this.dom.win.style.left = realleft + 'px';

    return this;
  },
  rePos: function() {
    var pos = this.getPos();
    this.setPos(pos.top, pos.left);
    return this;
  },
  getTitle: function() {
    return this.config.title;
  },
  setTitle: function(_title) {
    var title = _title.toString();
    this.config.title = title;
    this.dom.wintitle.innerHTML = title;
    return this;
  },
  showTitle: function() {
    this.dom.wintitle.style.display = 'block';
    this.rePos();
    return this;
  },
  hideTitle: function() {
    this.dom.wintitle.style.display = 'none';
    this.rePos();
    return this;
  },
  showHandle: function() {
    this.dom.winclose.style.display = 'block';
    return this;
  },
  hideHandle: function() {
    this.dom.winclose.style.display = 'none';
    return this;
  },
  showMask: function() {
    this.config.showmask = true;
    if (this.status == 'hide') {
      return;
    }
    this.resizeMask();
    this.dom.winmask.style.display = 'block';
    return this;
  },
  hideMask: function() {
    this.dom.winmask.style.display = 'none';
    this.config.showmask = false;
    return this;
  },
  resizeMask: function() {
    var range1 = this._getScrollRange();
    var range2 = this._getClientRange();
    var range = range2.height > range1.height ? range2 : range1;
    this.dom.winmask.style.width = range.width + 'px';
    this.dom.winmask.style.height = range.height + 'px';
    return this;
  },
  getElements: function() {
    return this.dom;
  },
  setMaskstyle: function(color, opacity) {
    this.config.maskstyle.color = color;
    this.config.maskstyle.opacity = opacity;
    this.dom.winmask.style.backgroundColor = color;
    if (!document.all) {
      this.dom.winmask.style.opacity = opacity;
    } else {
      this.dom.winmask.style.filter = 'alpha(opacity=' + opacity * 100 +
        ')';
    }
    return this;
  },
  setzIndex: function(_zindex) {
    var zindex = parseInt(_zindex, 10);
    this.config.zindex = zindex;
    this.dom.win.style.zIndex = zindex;
    this.dom.winmask.style.zIndex = zindex;
    return this;
  },
  getzIndex: function() {
    return this.config.zindex;
  },
  setShowCallback: function(func) {
    if (typeof(func) == 'function') {
      this.config.onshow = func;
    } else {
      this.config.onshow = function() {};
    }
    return this;
  },
  setHideCallback: function(func) {
    if (typeof(func) == 'function') {
      this.config.onhide = func;
    } else {
      this.config.onhide = function() {};
    }
    return this;
  },
  setDestroyCallback: function(func) {
    if (typeof(func) == 'function') {
      this.config.ondestroy = func;
    } else {
      this.config.ondestroy = function() {};
    }
    return this;
  },
  setElements: function(elements) {
    this.elements = null;
    if (elements) {
      this.config.elements = elements.split(',');
    }
    return this;
  },
  showElements: function() {
    if (this.elements) {
      for (var i = 0, len = this.elements.length; i < len; i++) {
        var ele = this.elements[i];
        ele.style.visibility = 'visible';
      }
    }
    return this;
  },
  hideElements: function() {
    this.elements = [];
    var tags = this.config.elements;
    var i, len, ele;
    for (i = 0, len = tags.length; i < len; i++) {
      var tag = tags[i];
      var eles = document.getElementsByTagName(tag);
      for (var j = 0, lenj = eles.length; j < lenj; j++) {
        ele = eles[j];
        this.elements.push(ele);
      }
    }
    for (i = 0, len = this.elements.length; i < len; i++) {
      ele = this.elements[i];
      ele.style.visibility = 'hidden';
    }
    return this;
  },
  _getWindowScroll: function() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    return {
      'top': scrollTop,
      'left': scrollLeft
    };
  },
  _getScrollRange: function() {
    var w = 0,
      h = 0;
    w = document.documentElement.scrollWidth || document.body.scrollWidth;
    h = document.documentElement.scrollHeight || document.body.scrollHeight;
    return {
      'width': w,
      'height': h
    };
  },
  _getClientRange: function() {
    var w = 0,
      h = 0;
    w = document.documentElement.clientWidth || document.body.clientWidth;
    h = document.documentElement.clientHeight || document.body.clientHeight;
    return {
      'width': w,
      'height': h
    };
  },
  _getOffsetPos: function(o) {
    if (o.getBoundingClientRect) {
      var x = 0,
        y = 0;
      try {
        var box = o.getBoundingClientRect();
        var D = document.documentElement;
        x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D
          .clientLeft;
        y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
      } catch (e) {}
      return {
        'top': y,
        'left': x
      };
    } else {
      var pageX = function(o) {
        try {
          return o.offsetParent ? o.offsetLeft + pageX(o.offsetParent) :
            o.offsetLeft;
        } catch (e) {
          return 0;
        }
      };
      var pageY = function(o) {
        try {
          return o.offsetParent ? o.offsetTop + pageY(o.offsetParent) : o
            .offsetTop;
        } catch (e) {
          return 0;
        }
      };
      return {
        'top': pageY(o),
        'left': pageX(o)
      };
    }
  },
  _mergeConfig: function(target, source, deep) {
    target = target || {};
    var sType = typeof source,
      i = 1,
      options;
    if (sType === 'undefined' || sType === 'boolean') {
      deep = sType === 'boolean' ? source : false;
      source = target;
      target = this;
    }
    if (typeof source !== 'object' && Object.prototype.toString.call(source) !==
      '[object Function]')
      source = {};
    while (i <= 2) {
      options = i === 1 ? target : source;
      if (options !== null) {
        for (var name in options) {
          var src = target[name],
            copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
            target[name] = this.extend(src || (copy.length !== null ? [] : {}),
              copy, deep);
          } else if (copy !== undefined)
            target[name] = copy;
        }
      }
      i++;
    }
    return target;
  }
};

/**
 * @memeberof YE.Ajax
 * @desc 获取每次发布的文章篇数限制，目前限制每次发布只限一篇文章
 * @todo 如果后续接触限制需在此函数内添加ajax请求
 */
YE.Ajax.getArticleLimit = function() {
	var _this = this;
	_this.updateArticleLimit();
};

/**
 * @memeberof YE.Ajax
 * @desc 获取图片库素材
 * @param {string} target -  插入图片的区域(cover/editor)
 * @param {string} url - 接口url
 */
YE.Ajax.getGallery = function(target, url) {
  YE.Dialog.gallery("loading", target);
  var _url = url || YE.URL_AJAX_GET_GALLERY;
  $.ajax({
    url: _url,
    data: {
      ge_target: target
    },
    timeout: 5000,
    dataType: "jsonp",
    success: function(res) {
      if (!res || res.code !== "100") {
        YE.Dialog.gallery("error", target);
        return;
      }
      if (res.total === 0) {
        YE.Dialog.gallery("empty", target);
      } else {
        var content = res.data;
        YE.Dialog.gallery("content", target, content);
      }
    },
    error: function() {
      YE.Dialog.gallery("error", target);
    },
    complete: function(xhr, status) {
      if (status === "timeout") {
        YE.Dialog.gallery("error", target);
      }
    }
  });
};

/**
 * @memeberof YE.Ajax
 * @desc 获取草稿数据
 * @todo 考虑到Ajax时间不可预估，草稿数据直接写在模板里，此功能需要后台模板配合
 */
YE.Ajax.loadDraft = function() {
	var _this = this;
	if (typeof draft_article !== "undefined") {
		if (draft_article === null) {
			return;
		}
		YE.data_draft = [];
		YE.data_draft.push(draft_article);
		YE.updateDraft();
		return;
	}
	var _url = YE.config.domain + YE.URL_AJAX_GET_DRAFT;
	$.ajax({
		url: _url,
		type: "post",
		dataType: "jsonp",
		success: function(res) {
			if (!res || res.code !== "100") {
				YE.data_draft = null;
				return;
			}
			YE.data_draft = res.data;
			YE.updateDraft();
		},
		error: function() {
			YE.Util.log.error("获取草稿失败！");
		}
	});
};

/**
 * @memeberof YE.Ajax
 * @desc 发布文章
 */
YE.Ajax.sendPublish = function() {
  var _this = this;
  var article_id_string = "";
  var article_cover_string = "";
  var article_title_string = "";
  for (var o in _this.instances) {
    if (o !== "count") {
      article_id_string += _this.instances[o].data.articleId + "-|||-";
      article_cover_string += _this.instances[o].data.cover + "-|||-";
      article_title_string += _this.instances[o].data.title + "-|||-";
    }
  }
  _this.Dialog.uploading("发布中...");
  $.ajax({
    url: _this.URL_AJAX_PUBLISH,
    timeout: 10000,
    data: {
      'article_id_string': article_id_string,
      'article_title_string': article_title_string,
      'article_cover_string': article_cover_string,
      'article_num': _this.instances.count
    },
    type: "post",
    dataType: "jsonp",
    complete: function(xhr, status) {
      if (status === "timeout") {
        YE.Dialog.error("请求超时");
      }
    },
    error: function() {
      _this.dialog_uploading.hide();
      YE.Dialog.error('网络故障！');
    },
    success: function(res) {
      _this.dialog_uploading.hide();
      if (!res) {
        YE.Dialog.error("发布失败");
        return;
      }
      var dataobj = res.data;

      // 有错误
      if (res.code !== "100") {
        _this.Dialog.error(res.msg);
        return;
      } else {
        _this.isBindUnload = false;
        _this.Dialog.success('发布成功,正在跳转...', (res.data && res.data.url) ||
          YE.config.domain + '/u/pushmanage');
      }
    }
  });
};

/**
 * @desc 上传语音的回调函数
 * @param {object} data - 响应数据
 */
YE.Handler.afterUploadAudio = function(data) {
  // 上传后解锁
  YE.lock.uploadAudio = false;
  YE.res_status.uploadAudio = true;
  if (!data || data.code !== "100") {
    if (data.uploadtime) {
      var $item = $("#yeaudio_box_body_item-uploading-" + data.uploadtime);
      $item.removeClass("yeaudio_box_body_item-uploading").addClass(
        "yeaudio_box_body_item-error");
      $item.find(".audiocover").removeClass('audiocover-uploading').addClass(
        'audiocover-error').html("出错");
      $item.find(".ye_icon_delaudio-disable").removeClass(
        "ye_icon_delaudio-disable").addClass("ye_icon_delaudio");
    }
    return;
  }
  $('#qWindowBox_yeaudio').trigger("refresh");

};

/**
 * @desc 上传封面的回调函数
 * @param {string|number} id -  编辑器id
 * @param {object} data - 响应数据
 */
YE.Handler.afterUploadCV = function(id, data) {
  if (YE.dialog_uploading) {
    YE.dialog_uploading.hide();
  }

  if (!data || !id) {
    return;
  }

  if (id === YE.FAKE_ID) {
    return;
  }
  var self = YE.instances[id];
  self.res_status.uploadCV = true;
  if (data.code === "100") {
    self.$cover_preview_img.attr("src", data.data);
    self.$cover_preview_box.show();
    if (data.data && data.data !== "") {
      self.data.cover = data.data;
      self.status.cover = 1;
      self.UI.articlelist.updateCover.call(self);
      self.$cover_error.hide();
    } else {
      self.status.cover = "";
    }
  } else if (data.code === "001") {
    YE.Dialog.error("图片尺寸过大");
  } else {
    YE.Dialog.error("上传失败");
  }
  self.autosave();

};

/**
 * @desc 上传图片库的回调函数
 * @param {string|number} id -  编辑器id
 * @param {object} data - 响应数据
 */
YE.Handler.afterUploadGE = function(id, data) {
  YE.res_status.uploadGE = true;
  YE.lock.uploadAudio = false;
  if (!data || data.code !== "100") {
    $("#qWindowBox_yegallery .yegallery_gallery_item-fake .thumb_img").attr(
      "src", "/u/img/ykeditor/upload-error.jpg");
    $("#qWindowBox_yegallery .yegallery_gallery_item-fake .entry_name").css(
      "color", "#f00");
    return;
  }

  if (data.imgid) {
    if (data.type === "editor") {
      if (YE.checked_id.length >= YE.MAX_COUNT_GALLERY_CHECKED) {
        YE.checked_id.splice(0, 1);
      }
    } else if (data.type === "cover") {
      if (YE.checked_id.length !== 0) {
        YE.checked_id = [];
      }
    }
    YE.checked_id.push(data.imgid);
    YE.checked_img[data.imgid] = {
      src: data.data,
      w: data.width,
      h: data.height
    };
  }

  if (data.isfromgallery) {
    YE.Ajax.getGallery(data.type);
  }
};

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

/**
 * @desc 编辑器插件-添加视频
 */
YE.Plugins.video = function() {
  UE.registerUI('yevideo', function(editor, uiname) {

    var dialog = {
      layer: null,
      $layer_dom: null,
      all_video_url: YE.config.domain + YE.URL_AJAX_GET_VIDEO +
        "?tab=all_video",
      fav_video_url: YE.config.domain + YE.URL_AJAX_GET_VIDEO +
        "?tab=fav_video",
      other_video_url: YE.config.domain + YE.URL_AJAX_GET_VIDEO_BY_URL,
      isbinded: false,
      isbinded_other: false, // 视频其他页
      pagename: 'video', // 当前页面名称 . video || other
      other_video_id: null,
      init: function() {
        var _this = this;
        this.createlayer();
        this.setQWmain(_this.all_video_url);
        this.$layer_dom = $(this.layer.dom.winbox);
      },
      bind: function() {
        var _this = this;
        this.$layer_dom.bind('click', function(e) {
          _this.pageview(e);
        }).on("click", ".yevideo_item", function(e) {
          if ($(this).hasClass("yevideo_item-focused")) {
            return;
          } else {
            _this.$layer_dom.find(".yevideo_item").removeClass(
              "yevideo_item-focused");
            _this.$layer_dom.find(
              ".yevideo_item input[type=radio]").attr("checked",
              false);
            $(this).addClass("yevideo_item-focused");
            $(this).find("input[type=radio]")[0].checked = true;
            _this.$layer_dom.find(".item-control .ye_btn").removeClass(
              'ye_btn-disable');
          }
        });
        this.isbinded = true;
      },
      bindOtherView: function() {
        var _this = this;
        _this.$layer_dom.find(".item-control .ye_btn").addClass(
          'ye_btn-disable');
        this.$layer_dom.bind('click', function(e) {
          _this.PageOtherView(e);
        });
        this.isbinded_other = true;
      },
      pageview: function(e) {
        var $target = $(e.target);
        var _this = this;
        if ($target.attr("id") === "fav_video" && !$target.hasClass(
            "select")) {
          this.setQWmain(_this.fav_video_url);
          return;
        }
        if ($target.attr("id") === "all_video" && !$target.hasClass(
            "select")) {
          this.setQWmain(_this.all_video_url);
          return;
        }
        // 点到其他视频
        if ($target.attr("id") === "otherVideo" && !$target.hasClass(
            "select")) {
          this.setQWmain(_this.other_video_url);
          return;
        }
        // 点击到了分页
        if ($target.attr("pageurl") && $target.attr("pageurl").length !==
          0) {
          var pageurl = $target.attr("pageurl");
          this.setQWmain(pageurl);
        }
        // 点击到了完成
        if ($target.hasClass("form_btn_text") && $target.html() ===
          '完成' && this.pagename === 'video') {
          // 获取选中视频
          this.insertFlash();
        }
      },
      PageOtherView: function(e) {
        var target = Element.extend(Event.element(e));
        var _this = this;
        // 点击到视频
        if (target.getAttribute("id") == "select_video" && !target.hasClassName(
            "select")) {
          this.setQWmain(_this.all_video_url);
          return;
        }
        // 点击到了完成
        if (target.hasClassName("form_btn_text") && target.innerHTML ==
          '完成' && this.pagename == 'other') {
          // 获取选中视频
          if (!this.other_video_id) {
            $('#video_img').hide();
            $('#video_title').hide();
            $('#item-noResult').show();
            return;
          }
          this.insertFlash_other(this.other_video_id);
        }
      },
      showlayer: function() {
        if (this.layer !== null) {
          this.layer.show();
        }
        return this;
      },
      hidelayer: function() {
        if (this.layer !== null) {
          this.layer.hide();
        }
        return this;
      },
      createlayer: function() {
        if (this.layer === null) {
          this.layer = new YE.Util.Qwindow({
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
            }
          });
        }
      },
      insertFlash: function() {
        var $radio = this.$layer_dom.find(
          'input[type="radio"][name="video"]:checked');
        if (!$radio || $radio.length === 0) {
          alert('请选择视频');
          return;
        }
        var video_id = $radio.attr("encode_id");
        this.insertFlash_other(video_id);
      },
      insertFlash_other: function(video_id) {
        if (!video_id) {
          alert('视频选择有误！');
          return;
        }
        this.hidelayer();
        var src = 'http://player.youku.com/player.php/sid/' +
          video_id + '/v.swf';
        var html = '<embed  id="[ye_video_start]' + video_id +
          '[ye_video_end]" src="' + src +
          '" wmode="transparent" allowFullScreen="true" quality="high" width="100%" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash">';
        editor.execCommand("inserthtml", html);
        // 插入一个空白段落实现光标换行
        editor.execCommand('insertparagraph');
      },
      setLoading: function() {
        if (!this.layer) {
          this.createlayer();
        }
        var html = [
          '<div class="qWindowBox">',
          '<div class="loadingBox">',
          '<div class="loading"><img src="' + YE.config.domain +
          '/u/img/pushdy/loading_64.gif"></div>',
          '</div>',
          '</div>',
        ].join("");
        this.layer.setContent('html', html);
        this.showlayer();
      },
      setQWmain: function(url) {
        var html = "";
        var _this = this;
        _this.setLoading();
        $.ajax({
          url: url,
          type: "post",
          dataType: 'jsonp',
          timeout: 3000, //3s超时
          error: function() {
            _this.layer.hide();
            YE.Dialog.error('请求失败！');
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.error('请求超时！');
            } else if (!_this.isRes) {
              _this.layer.hide();
              YE.Dialog.error('网络故障！');
            }
          },
          success: function(res) {
            _this.isRes = true;
            if (res.code !== "100") {
              return;
            }
            if (url === _this.other_video_url) {
              _this.pagename = 'other';
            } else {
              _this.pagename = 'video';
            }
            _this.layer.setContent('html',
              '<div class="qWindowBox" id = "qWindowBox_yevideo"><div class="qWindowBox_yevideo_head">添加视频</div><div class="qWindowBox_yevideo_body">' +
              res.data + '</div></div>');
            // 内容获取后，开始绑定
            if (_this.pagename === 'video' && _this.isbinded ===
              false) {
              _this.bind();
            } else if (_this.pagename == 'other') {
              // 输入视频网址后
              $('#search_video').on('blur', function(e) {
                var video_url = $('#search_video').val();
                var params = {};
                params = {
                  'type': 'push_subscribe',
                  'act': 'getVideoByUrl',
                  'video_url': video_url
                };
                $.ajax({
                  url: YE.config.domain + '/u/',
                  type: "get",
                  data: params,
                  success: function(res) {
                    var data = JSON.parse(res);
                    _this.other_video_id = data.encode_id;
                    if (!_this.other_video_id || data ===
                      null || data < 0) {
                      $('#item-other').hide();
                      $('#item-noResult').show();
                    } else {
                      $('#video_img').html(
                        '<img src="' + data.thumburl_v2 +
                        '">');
                      $('#video_title').html(data.title);
                      $('#item-noResult').hide();
                      $('#item-other').show();
                      _this.$layer_dom.find(
                        ".item-control .ye_btn").removeClass(
                        'ye_btn-disable');
                    }
                  }
                });

              });
              if (_this.isbinded_other === false) {
                _this.bindOtherView();
              }
            }
          }
        });

        this.showlayer();

      }
    };

    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加视频",
      label: "添加视频",
      onclick: function() {
        var id = $(this.getDom()).parents('.ye_body_editor').attr(
          "id").split("_")[2];
        dialog.init(id);
      }
    });
    return btn;
  }, 0);
};

/**
 * @desc 编辑器插件-图片库
 */
YE.Plugins.image = function() {
  UE.registerUI('yeimage', function(editor, uiname) {
    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加图片",
      label: "添加图片",
      onclick: function() {
        YE.Ajax.getGallery("editor");
      }
    });
    return btn;
  }, 1);
};

/**
 * @desc 编辑器插件-添加链接
 */
YE.Plugins.link = function() {
  UE.registerUI('yelink', function(editor, uiname) {

    var dialog = {
      REG_URL: /^((http[s]{0,1}:\/\/.+?\.)|((.\w+\.)?))youku\.com\/?.*?/,
      layer: null,
      $layer_dom: null,
      $title: null,
      $title_close: null,
      $title_error: null,
      $url: null,
      $url_close: null,
      $url_error: null,
      checkFlag: true,
      isTitleValid: false,
      isUrlValid: false,
      $add_btn: null,
      binded: false,
      init: function() {
        this.createlayer();
        this.$layer_dom = $(this.layer.dom.winbox);

        this.$title = this.$layer_dom.find('input[name="linktitle"]');
        this.$title_close = this.$layer_dom.find(".act-close-title");
        this.$title_error = this.$layer_dom.find(".linktitle_error");

        this.$url = this.$layer_dom.find('input[name="linkurl"]');
        this.$url_close = this.$layer_dom.find(".act-close-url");
        this.$url_error = this.$layer_dom.find(".linkurl_error");

        this.$add_btn = this.$layer_dom.find('span[_for="add"]');


        this.bindlayer();
        this.showlayer();
      },
      createlayer: function() {
        if (this.layer !== null) {
          return this;
        }
        var _this = this;
        this.layer = new YE.Util.Qwindow({
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
            _this.clearInput();
            _this.hideError();
          }
        });
        var html = [
          '<div class="qWindowBox" id="qWindowBox_yelink">',
          '<div class="qWindowBox_yelink_head">添加链接</div>',
          '<div class="qWindowBox_yelink_body">',
          '<ul class="ye_ul ye_ul_yelink">',
          '<li class="mb30 yelink_item yelink_item_url">',
          '<p class="f_14 mb8">请输入链接地址</p>',
          '<div class="input-control">',
          '<div class="ye_icon ye_icon_close act-close-url" style="display: none;"></div>',
          '<input type="text" class="ye_input" name="linkurl">',
          '</div>',
          '<p class="linkurl_subtag f_12 colorGrey">视频链接被添加后，会以播放器形式出现</p>',
          '<span class="c_red linkurl_error" style="display:none">请输入链接地址</span>',
          '</li>',
          '<li class="mb30 yelink_item yelink_item_title">',
          '<p class="f_14 mb8">请输入链接标题</p>',
          '<div class="input-control">',
          '<div class="ye_icon ye_icon_close act-close-title" style="display: none;"></div>',
          '<input type="text" class="ye_input" name="linktitle">',
          '</div>',
          '<span class="c_red linktitle_error" style="display:none">请输入链接标题</span>',
          '</li>',
          '</ul>',
          '<div class="qWindowBox_yelink_act">',
          '<div class="ye_btn ye_btn_l ye_btnmaj_l ye_btn-disable">',
          '<span class="ye_btn_text" _for="add">完成</span>',
          '</div> ',
          '</div>',
          '</div>',
          '</div>',
        ].join("");
        this.layer.setContent('html', html);
        return this;
      },
      showlayer: function() {
        if (this.layer !== null) {
          this.layer.show();
        }
        return this;
      },
      hidelayer: function() {
        if (this.layer !== null) {
          this.layer.hide();
        }
        return this;
      },
      // 恢复layer为空
      clearlayer: function() {
        if (this.layer === null) {
          return this;
        }
      },
      bindlayer: function() {

        if (this.binded) {
          return;
        }

        this.binded = true;

        if (this.layer === null) {
          return this;
        }
        var _this = this;

        function hidetitle() {
          _this.$title_close.hide();
        }

        function hideurl() {
          _this.$url_close.hide();
        }

        this.$title_close.on('click', function() {
          _this.$title.val("");
          _this.$title_error.show();
        });
        this.$title.on('focus', function() {
          if (!UE.browser.ie) {
            _this.$title_close.show();
          }
        }).on('blur', function() {
          hidetitle();
          if (_this.$title.val() === "") {
            _this.$title_error.show();
          } else {
            _this.$title_error.hide();
            _this.isTitleValid = true;
          }
          _this.checkValid();
        });

        this.$url_close.on('click', function() {
          _this.$url.val("");
          _this.checkUrl();
        });
        this.$url.on('focus', function() {
          if (!UE.browser.ie) {
            _this.$url_close.show();
          }
        }).on('blur', function() {
          hideurl();
          _this.checkUrl();
          _this.checkValid();
        });

        this.$add_btn.on('click', function() {
          _this.insertLink();
        });

      },
      checkValid: function() {
        if (this.isTitleValid && this.isUrlValid) {
          this.$layer_dom.find(".qWindowBox_yelink_act .ye_btn").removeClass(
            'ye_btn-disable');
        } else {
          this.$layer_dom.find(".qWindowBox_yelink_act .ye_btn").addClass(
            'ye_btn-disable');
        }
      },
      clearInput: function() {
        var _this = this;
        _this.$title.val("");
        _this.$url.val("");
      },
      insertLink: function() {
        var ret_title = this.checktitle();
        var ret_url = this.checkUrl();
        if (ret_title === false || ret_url === false) {
          return;
        }

        var href = this.$url.val();
        if (href.indexOf('http://') == -1) {
          href = 'http://' + href;
        }
        var html = '<a href="' + href + '" target="_blank">' + this.$title
          .val() + '</a>';
        editor.execCommand('inserthtml', html);
        this.hidelayer();
        this.clearInput();
      },
      checktitle: function() {
        var titlelink = this.$title.val();
        if (titlelink.length === 0) {
          this.$title_error.html('请输入链接标题').show();
          return false;
        }
        this.$title_error.hide();
        return true;
      },
      checkUrl: function() {
        var urllink = this.$url.val();
        if (urllink.length === 0) {
          this.$url_error.html('请输入链接地址').show();
          return false;
        }
        if (!this.REG_URL.test(urllink)) {
          this.$url_error.html('请输入来自优酷网的链接地址').show();
          return false;
        }
        this.isUrlValid = true;
        this.$url_error.hide();
        return true;
      },
      hideError: function() {
        this.$url_error.hide();
        this.$title_error.hide();
      }
    };
    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加链接",
      label: "添加链接",
      onclick: function() {
        var id = $(this.getDom()).parents('.ye_body_editor').attr(
          "id").split("_")[2];
        dialog.init(id);
      }
    });
    return btn;
  }, 2);
};

/**
 * @desc 编辑器插件-投票
 */
YE.Plugins.vote = function() {
  UE.registerUI('yevote', function(editor, uiname) {
    var _class = "",
      _mpid = "";
    var $votebox = $("<div id='ye_votebox' style='display:none'></div>").appendTo(
      $(document.body));

    // 投票预览节点生成完毕后会触发
    $(window).on("voteinitial", function() {
      var html = "<div class='yevote_box' voteid='" + _mpid +
        "'><div  contenteditable='false'><div class='yevote_box_cover' onclick='return false;' contentEditable='false' enable='false'></div>" +
        $votebox.html() + "</div></div>";
      // 【important】以下两条语句的顺序不得调换
      editor.execCommand("insertparagraph");
      editor.execCommand('inserthtml', html);
      $votebox.html("");
      try {
        YE.dialog_cover.hide();
      } catch (e) {}
    }).on("getpluginfail", function() {
      try {
        YE.dialog_cover.hide();
        YE.Dialog.error("操作失败，请重试");
      } catch (e) {}
    });

    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加投票",
      label: "添加投票",
      onclick: function() {
        var u_id = get_username('all').userid;
        window.pluginPanel.launchVotePanel({
          callback: function(mpid) {
            YE.Dialog.cover();
            _class = "YK_interact_plugins_container_" + mpid +
              "_0_2_3_4";
            _mpid = mpid;
            var $box = $("." + _class);
            if ($box.length === 0) {
              $box = $("<div></div>").addClass(_class);
              $votebox.append($box);
            }
            window.pluginFrontEnd.createPlugin($box[0]);
          },
          create_id: u_id,
          //创建来源
          create_source: 3,
          // 创建投票投放的设备类型
          device: 5
        });
      }
    });
    return btn;
  }, 3);
};

/**
 * @desc 编辑器插件-语音库
 */
YE.Plugins.audio = function() {
  if (YE.limitStatus.enableInsertAudio) {
    var win_audio = {
      // 获取语音库列表
      URL_AJAX_GET_AUDIOS: YE.URL_AJAX_GET_AUDIOS,
      // 删除单条语音
      URL_AJAX_DEL_AUDIO: YE.URL_AJAX_DEL_AUDIO,
      // 编辑单条语音
      URL_AJAX_EDIT_AUDIO_TITLE: YE.URL_AJAX_EDIT_AUDIO_TITLE,
      // 上传语音
      URL_AJAX_UPLOAD_AUDIO: YE.URL_AJAX_UPLOAD_AUDIO,

      // 单个音频文件不能超过30M
      MAX_AUDIO_SIZE: 1024 * 1024 * 30,

      enableLockCLose: false,

      ueditor: null,

      init: function() {
        this.bind();
        soundManager.setup({
          url: "/u/js/ykeditor/libs/soundmanager/swf",
          flashVerson: 9,
          preferFlash: false,
          onready: function() {},
          ontimeout: function() {}
        });
      },

      charge: function(editor) {
        this.ueditor = editor;
        this.getAudios();
      },

      bind: function() {
        var _this = this;
        $(document).on("click", function() {
          // 点击标题编辑区以外的区域触发标题验证保存
          _this.editTitle();
        }).on("refresh", "#qWindowBox_yeaudio", function() {
          _this.getAudios();
        }).on("click", "#qWindowBox_yeaudio .yeaudio_box_body_item",
          function() {
            // 选定状态
            _this.editTitle();
            if ($(this).hasClass("yeaudio_box_body_item-uploading") ||
              $(this).hasClass("yeaudio_box_body_item-invalid") || $(
                this).hasClass("yeaudio_box_body_item-error") || $(this)
                .hasClass("yeaudio_box_body_item-chosen")) {
              return;
            }
            $("#qWindowBox_yeaudio .yeaudio_box_body_item").removeClass(
              "yeaudio_box_body_item-chosen");
            $(
              "#qWindowBox_yeaudio .yeaudio_box_body_item .yeaudio_item_radio"
            ).attr("checked", false);
            $(this).addClass("yeaudio_box_body_item-chosen");
            $(this).find('.yeaudio_item_radio')[0].checked = true;
            _this.enableInsertBtn();
          }).on("click", "#qWindowBox_yeaudio .act_editaudio", function(
          e) {
          // 编辑标题
          if (YE.lock.uploadAudio) {
            // 锁定状态不允许上传
            _this.showBlockAlert();
            return;
          }
          var ev = e || window.event;
          if (ev && ev.stopPropagation) {
            ev.stopPropagation();
          } else {
            ev.cancelBubble = true;
          }
          var id = $(this).parents('.yeaudio_box_body_item').attr(
            "audioid");
          if (!id) {
            return;
          }
          var $titlearea = $(this).parents('.yeaudio_box_body_item').find(
            ".yeaudio_item_title");
          var $title = $titlearea.find(".audiotitle");
          var originTitle = $title.html();
          if ($(this).hasClass('act_editaudio-active')) {
            var newTitle = $titlearea.find(".edit_textarea").val();
            if (newTitle.length === 0) {
              alert("请输入标题");
              return;
            } else if (newTitle.length > 14) {
              alert("标题字数超出限制");
              return;
            }
            $(this).removeClass("act_editaudio-active");
            $titlearea.removeClass("yeaudio_item_title-active");

            if (newTitle === originTitle) {
              return;
            }
            $title.html(newTitle);
            _this.editAudio(id, newTitle);
          } else {
            $(this).addClass("act_editaudio-active");
            $titlearea.addClass("yeaudio_item_title-active");
          }
        }).on("click", "#qWindowBox_yeaudio .audiotitle_editarea",
          function(e) {
            // 标题编辑区拦截click冒泡
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
          }).on("keyup blur change paste input",
          "#qWindowBox_yeaudio .edit_textarea",
          function(e) {
            // 编辑标题选框
            var _title = $.trim($(this).val());
            var _count = _title.length;
            var $countDom = $(this).siblings('.edit_num');
            $countDom.html(_count + "/14");
            if (_count > 14 || _count === 0) {
              $(this).addClass("ye_input-error");
              $countDom.addClass('edit_num-error');
            } else {
              $(this).removeClass("ye_input-error");
              $countDom.removeClass('edit_num-error');
            }
          }).on("click", "#qWindowBox_yeaudio .act_delaudio", function(
          e) {
          // 删除单条语音
          var ev = e || window.event;
          if (ev && ev.stopPropagation) {
            ev.stopPropagation();
          } else {
            ev.cancelBubble = true;
          }
          _this.editTitle();
          if (YE.lock.uploadAudio) {
            // 锁定状态不允许上传
            _this.showBlockAlert();
            return;
          }
          var $audioItem = $(this).parents('.yeaudio_box_body_item');
          if ($audioItem.hasClass('yeaudio_box_body_item-error')) {
            // 错误/屏蔽条目直接删除dom并刷新语音库
            $audioItem.remove();
            _this.getAudios();
          } else {
            var id = $(this).parents('.yeaudio_box_body_item').attr(
              "audioid");
            if (!id) {
              return;
            }
            try{
              soundManager.stop(id);
            }catch(ex){}
            $audioItem.remove();
            _this.delAudio(id);
          }
        }).on("click", "#qWindowBox_yeaudio .yeaudio_error_act",
          function(e) {
            // 请求出错，重新请求
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            _this.getAudios();
          }).on("change", "#qWindowBox_yeaudio .yeaudio_upload_file",
          function(e) {
            // 上传文件
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            _this.editTitle();
            // 加锁key只保证绑定一次事件
            if (!_this.enableLockCLose) {
              var closeBtn = $(this).parents(".ye_winbox").find(
                '.ye_winclose')[0];
              var fn = closeBtn.onclick;
              closeBtn.onclick = function() {
                // 上传过程中拦截弹层关闭行为
                if (YE.lock.uploadAudio) {
                  win_audio.showBlockAlert();
                  return;
                }
                if (fn) {
                  fn();
                }
              };
              YE.enableLockCLose = true;
            }
            if (YE.lock.uploadAudio) {
              // 锁定状态不允许上传
              _this.showBlockAlert();
              return;
            }

            var file = $(this).val();
            if (file === "") {
              return;
            }
            var isTypeValid = _this.checkAudioType(file);
            var isSizeValid = _this.checkAudioSize(this);
            if (!isTypeValid) {
              alert("文件格式错误");
            } else if (!isSizeValid) {
              alert("文件尺寸超出限制");
            } else {
              // 加锁
              YE.lock.uploadAudio = true;
              var _title = file.split('fakepath\\')[1] || file;
              var _timestamp = YE.Util.getTimestamp();
              var _action = YE.URL_AJAX_UPLOAD_AUDIO +
                "?callback=parent.YE.Handler.afterUploadAudio&uploadtime=" +
                _timestamp;
              var $uploadingBox = $(_this.uploadingBox(_title,
                _timestamp));
              var $container = $(
                "#qWindowBox_yeaudio .yeaudio_container");
              var $box = $container.find(".yeaudio_box");
              // 若语音库为空，则创建空列表
              if ($box.length === 0) {
                $container.html("");
                $box = $([
                  '<div class="yeaudio_box">',
                  '<ul class="yeaudio_box_head clearfix">',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_title">语音标题</li>',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_duration">时长</li>',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_uploaddate">上传日期</li>',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_act">操作</li>',
                  '</ul>',
                  '<ul class="yeaudio_box_body clearfix">',
                  '</ul>',
                  '</div>'
                ].join("")).appendTo($container);
              }
              $box.find(".yeaudio_box_body").prepend($uploadingBox);
              // 提交表单
              $("#yeaudio_upload_form").attr("action", _action).submit();
              setTimeout(function() {
                $uploadingBox.find(".progressbar_status").css(
                  "width", "95%");
              }, 0);

              // 添加响应标识监测
              YE.res_status.uploadGE = false;
              // 五分钟超时错误并解锁上传限制
              var timer = setTimeout(function() {
                if (YE.res_status.uploadGE) {
                  clearTimeout(timer);
                } else {
                  YE.res_status.uploadGE = true;
                  YE.lock.uploadAudio = false;
                  _this.showErrorItem($uploadingBox);
                }
              }, 300000);
            }
          }).on("click", "#qWindowBox_yeaudio .qPager_audio a",
          function() {
            // 翻页
            _this.editTitle();
            if (YE.lock.uploadAudio) {
              // 锁定状态不允许上传
              _this.showBlockAlert();
              return;
            }
            var _page = $(this).attr("_page");
            if (!_page) {
              return;
            }
            _this.getAudios(_page);
          }).on("click",
          "#qWindowBox_yeaudio .qWindowBox_yeaudio_act_btn",
          function(e) {
            // 点击完成按钮写入正文
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            _this.editTitle();

            if (YE.lock.uploadAudio) {
              // 锁定状态不允许上传
              _this.showBlockAlert();
              return;
            }
            if ($(this).hasClass("ye_btn-disable")) {
              return;
            }
            var chosenId = $(
              "#qWindowBox_yeaudio .yeaudio_box_body_item-chosen").attr(
              'audioid');
            var chosenTitle = $(
              "#qWindowBox_yeaudio .yeaudio_box_body_item-chosen").find(
              ".audiotitle").html();
            if (chosenId) {
              _this.insertAudio(chosenId, chosenTitle);
            }
          }).on("click",
          "#qWindowBox_yeaudio .yeaudio_item_title .audioimg",
          function(e) {
            // 试听
            _this.editTitle();
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            if ($(this).hasClass("audioimg-playing")) {
              $(this).removeClass("audioimg-playing");
              soundManager.pauseAll();
            } else {
              $("#qWindowBox_yeaudio .yeaudio_item_title .audioimg").removeClass(
                "audioimg-playing");
              $(this).addClass('audioimg-playing');
              var $item = $(this).parents(".yeaudio_box_body_item");
              var sURL = $item.attr("audiourl"),sId=$item.attr('audioid');
              soundManager.pauseAll();

              soundManager.createSound({
                id: sId,
                url: sURL
              }).play();
            }
          });
      },

      showLoading: function() {
        YE.Dialog.audio("loading");
      },

      // 上传期间锁定所有操作
      showBlockAlert: function() {
        alert("请等待上传完毕");
      },

      editTitle: function() {
        var _this = this;
        var $act = $("#qWindowBox_yeaudio .act_editaudio-active");
        if ($act.length !== 0) {
          $.each($act, function(i, v) {
            var $titlearea = $(v).parents('.yeaudio_box_body_item').find(
              ".yeaudio_item_title");
            var $title = $titlearea.find(".audiotitle");
            var newTitle = $titlearea.find(".edit_textarea").val();
            if (newTitle.length !== 0 && newTitle.length <= 14 &&
              newTitle !== $title.html()) {
              var id = $(v).parents('.yeaudio_box_body_item').attr(
                "audioid");
              $title.html(newTitle);
              _this.editAudio(id, newTitle);
            }
            $(v).removeClass("act_editaudio-active");
            $titlearea.removeClass("yeaudio_item_title-active");
          });
        }
      },

      getAudios: function(page, pagesize) {
        var _this = this;
        var _page = page || "1",
          _pagesize = pagesize || "4";
        _this.showLoading();
        $.ajax({
          url: _this.URL_AJAX_GET_AUDIOS,
          type: "get",
          timeout: 5000,
          dataType: "jsonp",
          data: {
            "page": _page,
            "pagesize": _pagesize
          },
          success: function(res) {
            if (!res || res.code !== "100") {
              YE.Dialog.audio("error");
              return;
            }
            if (res.total === 0) {
              YE.Dialog.audio("empty");
            } else {
              var content = res.data;
              YE.Dialog.audio("content", content);
            }
          },
          error: function() {
            YE.Dialog.audio("error");
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.audio("error");
            }
          }
        });
      },
      // 删除单条语音
      delAudio: function(audioId) {
        if (!audioId) {
          return;
        }
        var _this = this;
        $.ajax({
          url: _this.URL_AJAX_DEL_AUDIO,
          type: "get",
          timeout: 3000,
          data: {
            audioid: audioId
          },
          success: function(res) {
            if (!res) {
              YE.Dialog.audio("error");
              return;
            }
            var _res = JSON.parse(res);
            if (_res.code !== "100") {
              YE.Dialog.audio("error");
              return;
            }
            _this.getAudios();
          },
          error: function(res) {
            YE.Dialog.audio("error");
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.audio("error");
            }
          }
        });
      },
      // 编辑标题
      editAudio: function(audioId, title) {
        if (!audioId) {
          return;
        }
        var _this = this;
        $.ajax({
          url: _this.URL_AJAX_EDIT_AUDIO_TITLE,
          type: "get",
          timeout: 3000,
          data: {
            audioid: audioId,
            title: title
          },
          success: function(res) {
            if (!res) {
              YE.Dialog.audio("error");
              return;
            }
            var _res = JSON.parse(res);
            if (_res.code !== "100") {
              YE.Dialog.audio("error");
              return;
            }
          },
          error: function(res) {
            YE.Dialog.audio("error");
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.audio("error");
            }
          }
        });
      },
      // 写入正文
      insertAudio: function(audioId, audioTitle) {
        if (!audioId) {
          return;
        }
        var _this = this;
        var html = _this.fakeAudioBox(audioId, audioTitle);
        // 【important】以下两条语句的顺序不得调换
        _this.ueditor.execCommand("insertparagraph");
        _this.ueditor.execCommand("inserthtml", html);

        YE.dialog_audio.hide();
      },
      // 正文语音容器结构
      fakeAudioBox: function(audioId, audioTitle) {
        if (!audioId) {
          return;
        }
        var html = "<div class='yeaudio_box' audioid='[yk_audioId]" +
          audioId +
          "[\\yk_audioId]'><div contenteditable='false'><div class='yeaudio_box_cover' onclick='return false;' contenteditable=false enable=false></div>" +
          audioTitle + "</div></div>";
        return html;
      },
      // 上传语音loading提示item
      uploadingBox: function(title, stamp) {
        var html = [
          '<li class="yeaudio_box_body_item yeaudio_box_body_item-uploading" id="yeaudio_box_body_item-uploading-' +
          stamp + '">',
          '<input type="radio" class="yeaudio_item yeaudio_item_radio">',
          '<div class="yeaudio_item yeaudio_item_title">',
          '<div class="audiocover audiocover-uploading">上传中</div>',
          '<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">',
          '<p class="audiotitle">' + title + '</p>',
          '<div class="progressbar">',
          '<div class="progressbar_status"></div>',
          '</div>',
          '</div>',
          '<div class="yeaudio_item yeaudio_item_duration">--:--</div>',
          '<div class="yeaudio_item yeaudio_item_uploaddate">0000-00-00</div>',
          '<ul class="yeaudio_item yeaudio_item_act">',
          '<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>',
          '<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio-disable"></i></li>',
          '</ul>',
          '</li>'
        ].join("");
        return html;
      },
      showErrorItem: function(jqObj) {
        jqObj.removeClass("yeaudio_box_body_item-uploading").addClass(
          "yeaudio_box_body_item-error").find(".audiocover").removeClass(
          'audiocover-uploading').addClass('audiocover-error').html(
          "出错");
      },
      // 检查格式
      checkAudioType: function(file) {
        var filename = file;
        // 校验校验扩展名
        var extname = /\.[^\.]+$/.exec(filename)[0];
        extname = extname.toLowerCase();

        if (extname != '.mp3' && extname != '.wma' && extname != '.wav' &&
          extname != '.amr') {
          return false;
        }
        return true;
      },
      // 检查文件大小
      checkAudioSize: function(file) {
        var _this = this;
        var size = 0;
        size = (file.files && (file.files[0].size || file.files[0].fileSize)) ||
          (function() {
            try {
              var img = new Image();
              img.dynsrc = file.value;
              return img.fileSize;
            } catch (e) {
              return 0;
            }
          })();
        if (size > _this.MAX_AUDIO_SIZE) {
          return false;
        }
        return true;
      },
      // 激活完成按钮
      enableInsertBtn: function() {
        $("#qWindowBox_yeaudio .qWindowBox_yeaudio_act_btn").removeClass(
          "ye_btn-disable");
      },
      // 禁用完成按钮
      disableInsertBtn: function() {
        $("#qWindowBox_yeaudio .qWindowBox_yeaudio_act_btn").addClass(
          "ye_btn-disable");
      }
    };

    win_audio.init();

    UE.registerUI('yeaudio', function(editor, uiname) {
      var btn = new UE.ui.Button({
        name: uiname,
        title: "添加语音",
        label: "添加语音",
        onclick: function() {
          // 激活
          win_audio.charge(editor);
        }
      });
      return btn;
    }, 4);
  }
};

/**
 * @class
 * @desc 编辑器类
 * @param {string|number} timestamp - 时间戳，编辑器实例唯一标识
 * @param {object} opt - UEditor配置参数
 * @param {object} draft - 草稿数据
 * @param {boolean} isdisable - 是否激活状态，用于编辑多篇文章时使用
 */
var YKEditor = function(timestamp, opt, draft, isdisable) {
  var _this = this;

  // 是否完成创建的标识符
  _this.isComplete = false;
  // 是否为编辑状态
  _this.active = true;
  // 各模块是否具备post条件
  _this.status = {
    // title状态值：0空值；1符合规范；2超出字数限制
    title: 0,
    // summary状态值：0空值；1符合规范；2超出字数限制
    summary: 0,
    // cover状态值：0空值；1符合规范
    cover: 0,
    // content状态值：0空值；1符合规范
    content: 0,
    // 打赏标题：0空值；1符合规范；2超出字数限制
    donateTitle: 1,
    // 打赏感谢语：0空值；1符合规范；2超出字数限制
    donateFlag: 1
  };
  // 是否可提交储存
  _this.isAbleToPush = false;
  // 生成时间戳
  this.timestamp = timestamp;
  // 容器id
  this.id = "ykeditor_" + this.timestamp;
  // 配置参数
  this.opt = $.extend(opt, {
    timeout_uploadCV: 5000
  });

  // 文章数据
  this.data = {
    articleId: "",
    donateId: "",
    title: "",
    cover: "",
    summary: "",
    content: "",
    open_comment: "1",
    // 是否开启打赏：0否，1是
    open_donate: "0",
    donateTitle: "视频创作不容易，打个赏支持下吧",
    donateFlag: "感谢对我的赞助支持，你将出现在我的作品中，伴随我的创作"
  };
  // 正文内容长度
  this.content_html_length = 0;
  this.content_text_length = 0;

  // 上传反馈监控
  this.res_status = {
    uploadCV: false,
    uploadQW: false
  };

  this.editor_id = this.UI.render(timestamp, opt);

  // 编辑器区域尺寸修正
  this.UI.editor.restoreSize(this.editor_id);

  this.editor_opts = this.opt && this.opt.editor && YE.Util.mapOpts(opt.editor);
  this.ueditor = UE.getEditor(this.editor_id, this.editor_opts);
  this.ueditor.ready(function() {
    _this.selectAll();
    _this.updateLimitStatus();
    _this.isComplete = true;
    if (isdisable) {
      _this.disable();
    }
    if (draft && typeof draft !== "undefined") {
      _this.updateDraft(draft);
    }
    _this.UI.editor.restyle.call(_this);
    // 样式修正后再显示发布器
    YE.showBox();
    _this.UI.editor.doFixToolbar.call(_this);
    _this.bind();
  });


  return this;
};
/**
 * @namespace
 * @desc UI操作函数集
 */
YKEditor.prototype.UI = {};
/**
 * @namespace
 * @desc AJAX函数集
 */
YKEditor.prototype.Ajax = {};
/**
 * @desc 功能函数：获取各操作区dom
 */
YKEditor.prototype.selectAll = function() {
  this.$container = $("#" + this.id);
  // 左侧列表区
  this.$section_left = this.$container.find(".ye_section_left");
  this.$articlelist_box = this.$section_left.find(".ye_box_articlelist");
  this.$articlelist_title = this.$articlelist_box.find(
    ".ye_articlelist_title");
  this.$articlelist_img = this.$articlelist_box.find(".yk_img_article");

  // 右侧操作区
  this.$section_right = this.$container.find(".ye_section_right");

  // 标题操作区
  this.$title_box = this.$section_right.find(".ye_box_title");
  this.$title_input = this.$title_box.find(".ye_input_title");
  this.$title_count = this.$title_box.find(".ye_input_num_count");
  this.$title_error = this.$title_box.find(".ye_error");

  // 摘要操作区
  this.$summary_box = this.$section_right.find(".ye_box_summary");
  this.$summary_input = this.$summary_box.find(".ye_input_area_summary");
  this.$summary_count = this.$summary_box.find(".ye_area_num_count");
  this.$summary_error = this.$summary_box.find(".ye_error");

  // 封面编辑区
  this.$cover_box = this.$section_right.find(".ye_box_cover");
  this.$cover_form = this.$cover_box.find(".ye_upload_cover_form");
  this.$cover_input = this.$cover_box.find(".ye_upfile");
  this.$cover_error = this.$cover_box.find(".ye_error");
  this.$cover_preview_box = this.$cover_box.find(".ye_cover_preview");
  this.$cover_preview_img = this.$cover_preview_box.find(".ye_cover_mini");
  this.$cover_delete = this.$cover_preview_box.find(".ye_act_delete_cover");
  this.$cover_btn_gallery = this.$cover_box.find(".ye_cover_gallery");

  // 编辑器容器操作区
  this.$editor_box = this.$section_right.find(".ye_box_editor");
  this.$editor_subtitle = this.$editor_box.find(".ye_subtitle_autosave");
  this.$editor_ue = this.$editor_box.find(".edui-editor");
  this.$editor_toolbar = this.$editor_box.find(".edui-editor-toolbarbox");
  this.$editor_iframe = this.$editor_box.find(".edui-editor-iframeholder");
  this.$editor_error = this.$editor_box.find(".ye_error");

  // 开启/关闭评论操作区
  this.$opencomment_box = this.$section_right.find(".ye_box_opencomment");
  this.$opencomment = this.$opencomment_box.find(".ye_checkbox_opencomment");

  // 打赏操作区
  this.$donate_box = this.$section_right.find(".ye_box_donate");
  this.$donate_checkbox = this.$donate_box.find(".ye_checkbox_opendonate");
  this.$donate_input_title = this.$donate_box.find(".ye_input_donatetitle");
  this.$donate_input_flag = this.$donate_box.find(".ye_input_area_donateflag");
  this.$donate_count_title = this.$donate_box.find(
    ".donate_item_title .ye_input_num_count");
  this.$donate_count_flag = this.$donate_box.find(
    ".donate_item_flag .ye_input_num_count");
  this.$donate_contentbox = this.$donate_box.find(".ye_box_contentbox");
  this.$donate_hint_title = this.$donate_box.find(".ye_hint_donatetitle");
  this.$donate_hint_flag = this.$donate_box.find(".ye_hint_donateflag");
  this.$donate_error_title = this.$donate_box.find(".ye_error_donatetitle");
  this.$donate_error_flag = this.$donate_box.find(".ye_error_donateflag");

  // 发布按钮操作区
  this.$submit_box = this.$section_right.find(".ye_box_submit");
  this.$submit_btn = this.$submit_box.find(".ye_btn");
  this.$submit_status = this.$submit_box.find(".ye_status_submit");

};

/**
 * @desc 功能函数：检测文章是否符合type规定的post要求
 * @param {string} type - post的操作类型
 */
YKEditor.prototype.checkAbleToPost = function(type) {
  if (!type || type === "") {
    return false;
  }
  var _this = this;
  var result = false;
  switch (type) {
    // 自动保存的状态，只要标题/封面/正文任何一个模块不为空便可以post
    case "autosave":
      if (_this.status.title !== 0 || _this.status.cover !== 0 || _this.status
        .content !== 0 || _this.status.summary !== 0) {
        result = true;
      } else {
        result = false;
      }
      break;
      // 手动保存、预览和发布操作必须全部必填模块都符合规范,并且选填模块符合规范才可以post
    case "manual":
    case "preview":
    case "publish":
      // checkContent();
      if (_this.status.title !== 1 || _this.status.cover !== 1 || _this.status
        .content !== 1 || _this.status.summary !== 1) {
        result = false;
      } else {
        result = true;
      }
      break;
    default:
      break;
  }

  return result;
};

/**
 * @desc 功能函数：检测各模块是否符合规范并提示错误
 */
YKEditor.prototype.checkErrors = function() {
  var _this = this;

  function checkTitle() {
    switch (_this.status.title) {
      case 0:
        _this.$title_count.removeClass("c_red");
        _this.$title_error.html('请填写标题').show();
        _this.$title_input.addClass("ye_input-error");
        break;
      case 1:
        _this.$title_error.hide();
        _this.$title_input.removeClass("ye_input-error");
        _this.$title_count.removeClass("c_red");
        break;
      case 2:
        _this.$title_count.addClass("c_red");
        _this.$title_error.html("标题不能超过" + YE.MAX_COUNT_TITLE + "字").show();
        _this.$title_input.addClass("ye_input-error");
        break;
      default:
        break;
    }

  }

  function checkCover() {
    switch (_this.status.cover) {
      case 0:
        _this.$cover_error.show();
        break;
      case 1:
        _this.$cover_error.hide();
        break;
      default:
        break;
    }
  }

  function checkContent() {
    switch (_this.status.content) {
      case 0:
        _this.$editor_error.html('请填写正文').show();
        break;
      case 1:
        _this.$editor_error.hide();
        break;
      case 2:
        _this.$editor_error.html('正文字数多于' + YE.MAX_COUNT_CONTENT + '字').show();
        break;
      default:
        break;
    }
  }

  function checkSummary() {
    switch (_this.status.summary) {
      case 0:
        _this.$summary_count.addClass("c_red");
        _this.$summary_error.html("推荐理由不能为空").show();
        _this.$summary_input.addClass("ye_input-error");
        break;
      case 1:
        _this.$summary_error.hide();
        _this.$summary_input.removeClass("ye_input-error");
        _this.$summary_count.removeClass("c_red");
        break;
      case 2:
        _this.$summary_count.addClass("c_red");
        _this.$summary_error.html("推荐理由不能超过" + YE.MAX_COUNT_SUMMARY + "字").show();
        _this.$summary_input.addClass("ye_input-error");
        break;
      default:
        break;
    }
  }
  checkTitle();
  checkSummary();
  checkCover();
  checkContent();
  // 重新计算容器高度，以便发布操作区样式适配
  _this.UI.restyle.call(_this);
};
/**
 * @desc 将编辑器设为不可编辑状态
 */
YKEditor.prototype.disable = function() {
  this.$container.addClass('ykeditor-disable');
  this.active = false;
};
/**
 * @desc 恢复可编辑状态
 */
YKEditor.prototype.enable = function() {
  for (var o in YE.instances) {
    if (o !== "count") {
      YE.instances[o].disable();
    }
  }
  this.$container.removeClass('ykeditor-disable');
  this.active = true;
};
/**
 * @desc 写入草稿数据
 * @param {object} data - 草稿数据
 */
YKEditor.prototype.updateDraft = function(data) {
  var _this = this;
  var updataTitle = function() {
    if (_this.data.title) {
      _this.$title_input.val(_this.data.title);
      _this.$articlelist_title.val(_this.data.title);
      _this.$title_input.trigger("keyup");
    }
  };
  var updataSummary = function() {
    if (_this.data.summary) {
      _this.$summary_input.val(_this.data.summary);
      _this.$summary_input.trigger("keyup");
    }
  };
  var updataCover = function() {
    if (_this.data.cover) {
      _this.status.cover = 1;
      _this.$cover_preview_img.attr("src", _this.data.cover);
      _this.$cover_preview_box.show();
      _this.$articlelist_img.attr("src", _this.data.cover);
    }
  };
  var updataContent = function() {
    _this.ueditor.setContent(_this.data.content, false);
  };
  var updataOpencomment = function() {
    if (_this.data.open_comment === "1" || _this.data.open_comment === 1) {
      _this.$opencomment[0].checked = true;
    } else {
      _this.$opencomment[0].checked = false;
    }
  };
  _this.data.title = data.title;
  _this.data.summary = data.summary;
  _this.data.cover = data.picture;
  _this.data.content = data.content;
  _this.data.articleId = data.id;
  _this.data.open_comment = data.open_comment;

  updataTitle();
  updataSummary();
  updataCover();
  updataContent();
  updataOpencomment();
};

/**
 * memeberof YKEditor.prototype
 * @desc 自动保存触发条件：
 * 1. 各模块输入框blur；
 * 2. 封面上传/删除成功后；
 * 3. 编辑其他文章之前
 * @param {string} type - 保存类型（自动/手动）
 */

YKEditor.prototype.autosave = function(type) {
  var _this = this;
  if (!_this.enable) {
    // 非编辑状态下不触发自动储存
    return;
  }
  var _type = type || "auto";
  var isAbleToAutosave = false;
  switch (_type) {
    case "auto":
      isAbleToAutosave = _this.checkAbleToPost("autosave");
      if (isAbleToAutosave) {
        _this.Ajax.sendArticle.call(_this, "autosave");
      }
      break;
    case "manual":
      isAbleToAutosave = _this.checkAbleToPost("manual");
      if (isAbleToAutosave) {
        _this.Ajax.sendArticle.call(_this, "manual");
      } else {
        _this.showErrors();
      }
  }
};


/**
 *正文中放入打赏id，如果容器存在则替换为参数id
 */
YKEditor.prototype.updateDonateId = function() {
  var _this = this;
  var $html = $('<div>' + _this.ueditor.getContent() + '</div>');
  var $donateBox = $html.find(".donateBox_fake");
  if (_this.data.open_donate === "0") {
    // 移除donateID容器
    $donateBox.remove();
    // 修正内容写入编辑器
    _this.ueditor.setContent($html.html());
    if (YE.dialog_cover) {
      YE.dialog_cover.hide();
    }
    return;
  }
  if ($donateBox.length !== 0) {
    // 更新donateID
    $donateBox.html("[yk_donate]" + _this.data.donateId + "[/yk_donate]");
    // 修正内容写入编辑器
    _this.ueditor.setContent($html.html());
  } else {
    var html =
      "<div><span class='donateBox_fake' style='display:none;'>[yk_donate]" +
      _this.data.donateId + "[/yk_donate]</span></div>";
    _this.ueditor.execCommand("inserthtml", html);
  }
  YE.dialog_cover.hide();
};

/**
 *更新评论&打赏权限并显示/隐藏对应操作区
 */
YKEditor.prototype.updateLimitStatus = function() {
  var _this = this;
  if (YE.limitStatus.enableComment) {
    try {
      _this.$opencomment_box.show();
      _this.data.open_comment = "1";
      _this.$opencomment[0].checked = true;
    } catch (e) {}
  } else {
    _this.$opencomment_box.hide();
    _this.data.open_comment = "0";
    _this.$opencomment[0].checked = false;
  }
  if (YE.limitStatus.enableDonate) {
    try {
      _this.data.open_donate = "1";
      _this.$donate_box.show().addClass('ye_box_donate-open');
      _this.$donate_checkbox[0].checked = true;
      _this.$donate_input_title.val(_this.data.donateTitle);
      _this.$donate_input_flag.val(_this.data.donateFlag);
    } catch (e) {}
  } else {
    _this.data.open_donate = "0";
    _this.$donate_box.hide();
    _this.$donate_checkbox[0].checked = false;
  }
};

/**
 *错误提示
 *@instance:编辑器实例
 */
YKEditor.prototype.showErrors = function() {
  var _this = this;
  _this.enable();
  _this.checkErrors();
  switch (true) {
    // 标题为空
    case _this.status.title === 0:
      YE.Dialog.error("请填写标题");
      break;
      // 标题字数超标
    case _this.status.title === 2:
      YE.Dialog.error("标题字数请控制在" + YE.MAX_COUNT_TITLE + "字以内", {
        width: 270
      });
      break;
      // 摘要为空
    case _this.status.summary === 0:
      YE.Dialog.error("请填写推荐理由");
      break;
      // 摘要字数超标
    case _this.status.summary === 2:
      YE.Dialog.error("推荐理由字数请控制在" + YE.MAX_COUNT_SUMMARY + "字以内", {
        width: 300
      });
      break;
      // 封面为空
    case _this.status.cover === 0:
      YE.Dialog.error("请上传封面");
      break;
      // 正文为空
    case _this.status.content === 0:
      YE.Dialog.error("请填写正文");
      break;
      // 正文字数超标
    case _this.status.content === 2:
      YE.Dialog.error('正文字数请控制在' + YE.MAX_COUNT_CONTENT + '字以内', {
        width: 300
      });
      break;
    default:
      break;
  }
};

YKEditor.prototype.UI = {
  render: function(timestamp, opts) {
    var opt = opts || {};
    var container = ["<div class='ykeditor clearfix' id = 'ykeditor_" + timestamp + "'>"];
    var ye_box_editarea = ["<div class='ye_box ye_box_editarea clearfix'>"];
    var ye_section_left = ["<div class='ye_section ye_section_left clearfix'>"];
    var ye_section_right = ["<div class='ye_section ye_section_right clearfix'><ul class='ye_ul'>"];


    var editor_id = "editor_" + YE.id + "_" + timestamp;

    // 绘制左侧文章列表
    if (!opt.articlelist) {
      var articlelist = this.articlelist.render();
      ye_section_left.push(articlelist);
    }

    // 绘制右侧文章标题
    if (!opt.title) {
      var title = this.title.render();
      ye_section_right.push(title);
    }

    // 绘制右侧文章摘要
    if (!opt.summary) {
      var summary = this.summary.render();
      ye_section_right.push(summary);
    }

    // 绘制右侧封面上传
    if (!opt.cover) {
      var cover = this.cover.render(editor_id);
      ye_section_right.push(cover);
    }

    // 绘制右侧编辑器容器
    var editor = this.editor.render(editor_id);
    ye_section_right.push(editor);

      // 绘制右侧预览区域
    if (!opt.opencomment) {
      var opencomment = this.opencomment.render();
      ye_section_right.push(opencomment);
    }

    // 绘制右侧打赏区域
    if (!opt.donate) {
      var donate = this.donate.render();
      ye_section_right.push(donate);
    }

    // 左侧部分绘制完成
    ye_section_right.push("</ul></div>");
    ye_section_right = ye_section_right.join("");

    // 右侧部分绘制完成
    ye_section_left.push("</div>");
    ye_section_left = ye_section_left.join("");


    ye_box_editarea.push(ye_section_left);
    ye_box_editarea.push(ye_section_right);
    ye_box_editarea.push("</div>");
    ye_box_editarea = ye_box_editarea.join("");

    container.push(ye_box_editarea);
    container.push("</div>");
    container = container.join("");

    YE.$container.append($(container));

    return editor_id;
  },
  restyle: function(){}
};

/**
 * @desc UI-预览区
 */
YKEditor.prototype.UI.articlelist = {
  render: function() {
    var html = "";
    html += "<div class='ye_box ye_box_articlelist'>";
    html += "<div class='ye_body_entry'>";
    html += "<p class='ye_articlelist_title'>请填写标题</p>";
    html += "<div class='ye_articllist_info'>";
    html += "<span class='ye_icon ye_icon_readnum'></span>阅读数";
    html += "<span class='ye_icon ye_icon_commentnum'></span>评论数";
    html += "</div>";
    html += "</div>";
    html += "<div class='ye_body_image'>";
    html += "<div class='ye_cover ye_cover_img'>";
    html += "<div class='ye_act ye_act_editA'>";
    html += "<i class = 'ye_icon ye_icon_editA'></i>";
    html += "</div>";
    html += "<div class='ye_act ye_act_delA'>";
    html += "<i class = 'ye_icon ye_icon_delA'></i>";
    html += "</div>";
    html += "</div>";
    html += "<img class='yk_img yk_img_article' src=" + YE.config.emptyCV +
      ">";
    html += "</div>";
    html += "</div>";
    html += "<div class='ye_cover ye_cover_add' >+</div>";

    return html;
  },

  updateTitle: function() {
    var _this = this;
    if (_this.data && _this.data.title !== "") {
      this.$articlelist_title.html(_this.data.title);
    } else {
      this.$articlelist_title.html("请填写标题");
    }
  },

  updateCover: function() {
    var _this = this;
    if (_this.data && _this.data.cover && _this.data.cover !== "") {
      this.$articlelist_img.attr("src", _this.data.cover);
    } else {
      this.$articlelist_img.attr("src", YE.config.emptyCV);
    }
  }

};

/**
 * @desc UI-封面区
 */
YKEditor.prototype.UI.cover = {
  render: function(id) {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_cover'>";
    html +=
      "<div class='ye_head ye_head_cover'>封面<span class='ye_subtitle colorGrey f_12 ml8'>图片最大不可超过5M，建议尺寸640像素*360像素</span></div>";
    html += "<div class='ye_body ye_body_cover'>";
    html +=
      "<div class='ye_cover_upload  ye_btn ye_btn_middle ye_btnsub_middle'>";
    html += "<span class='ye_btn_text'>上传图片</span>";
    html += "<iframe name='ye_upload_cover_target_" + id +
      "' style='display:none;'></iframe>";
    html += "<form action='' target='ye_upload_cover_target_" + id +
      "' method='post' enctype='multipart/form-data' class='ye_upload_cover_form' id='ye_upload_cover_form_" +
      id + "'>";
    html += "<input type='file' name='upfile' class='ye_upfile' >";
    html += "</form>";
    html += "</div>";
    html +=
      "<div class='ye_cover_gallery  ye_btn ye_btn_middle ye_btnsub_middle'>";
    html += "<span class='ye_btn_text'>从图片库选择</span>";
    html += "</div>";
    html += "<div class='ye_error' >请上传封面</div>";
    html += "<div class='ye_cover_preview'>";
    html += "<img src= '' class='ye_cover_mini'>";
    html += "<span class='ml8 ye_act ye_act_delete_cover'>删除</span>";
    html += "</div>";
    html += "</div>";
    html += "</li>";

    return html;
  }
};

/**
 * @desc UI-打赏
 */
YKEditor.prototype.UI.donate = {
  render: function() {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_donate'>";
    html += "<div class='ye_body ye_body_donate'>";
    // checkbox
    html += "<div class='ye_donate_act f_12 mb8'>";
    html +=
      "<input type='checkbox' class='ye_checkbox ye_checkbox_opendonate'>";
    html +=
      "开启观众赏赐<i class='ye_icon ye_icon_tag_new'></i><span class = 'ye_subtitle colorGrey f_12 lh_12 ml20 ye_hint_donate'>暂不支持预览</span></div>";

    html += "<div class = 'ye_box ye_box_contentbox'>";

    html += "<div class = 'donate_item donate_item_title mb20'>";
    html +=
      "<h3 class='f_14 lh_14 mb10'>求赏赐标题<span class = 'ye_subtitle colorGrey f_12 lh_12 ml8'>观众会在赏赐前看到这段文字</span></h3>";
    html += "<div class='content mb8'>";
    html += "<div class='ye_input_num_count'>0/" + YE.MAX_COUNT_DONATETITLE +
      "</div>";
    html += "<input class='ye_input ye_input_donatetitle' >";
    html +=
      "<p class = 'ye_hint ye_hint_donatetitle colorGrey f_12 lh_12' style='display:none;'>视频创作不容易，打个赏支持下吧</p>";
    html += "</div>";
    html += "<p class='ye_error ye_error_donatetitle'>不能超过" + YE.MAX_COUNT_DONATETITLE +
      "字</p>";
    html += "</div>";

    html += "<div class = 'donate_item donate_item_flag'>";
    html +=
      "<h3 class='f_14 lh_14 mb10'>感谢语<span class = 'ye_subtitle colorGrey f_12 lh_12 ml8'>观众赏赐后，会看到这段文字</span></h3>";
    html += "<div class='content mb8'>";
    html += "<div class='ye_input_num_count'>0/" + YE.MAX_COUNT_DONATEFLAG +
      "</div>";
    html +=
      "<textarea class='ye_input ye_input_area ye_input_area_donateflag'></textarea>";
    html +=
      "<p class = 'ye_hint ye_hint_donateflag colorGrey f_12 lh_12' style='display:none;'>感谢对我的赞助支持，你将出现在我的作品中，伴随我的创作</p>";
    html += "</div>";
    html += "<p class='ye_error ye_error_donateflag'>不能超过" + YE.MAX_COUNT_DONATEFLAG +
      "字</p>";
    html += "</div>";

    html +=
      "<a class='ye_donate_proxy' href='http://c.youku.com/agreement' target='_blank'>优酷道长赏赐使用协议</a>";
    html += "</div>";
    html += "</div>";
    html += "</li>";
    return html;
  }
};

/**
 * @desc UI-编辑器正文区
 */
YKEditor.prototype.UI.editor = {
  render: function(id) {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_editor'>";
    html += "<div class='ye_editor' style = 'width:100%;'>";
    html += "<div class='ye_head ye_head_editor'>正文";
    html +=
      "<span class='ye_subtitle colorGrey ml8 ye_subtitle_autosave'>已自动保存</span>";
    html += "</div>";
    html += "<div class='ye_body ye_body_editor' id='" + id +
      "' style='width:100%;'></div>";
    html += "<div class='ye_error c_red'>请填写正文</div>";
    html += "</div>";
    html += "</li>";
    return html;
  },
  // ueditor容器尺寸修正
  restoreSize: function(id) {
    if (!id || !YE.REG_CHAR.test(id)) {
      return;
    }
    var $editor = $("#" + id);
    var width = $editor.width();
    var height = YE.opt.height || YE.config.editor.height;
    $editor.width(width - 2);
    $editor.height(height);
  },
  // 定制自定义工具栏样式
  restyle: function() {
    var $editor = this.$editor_ue;
    var $toolbar = this.$editor_toolbar;
    var $toolbar_gain = $('.edui-for-yeimage').parent('.edui-toolbar');
    var $toolbar_init = $('.edui-for-fontsize').parent('.edui-toolbar');
    $editor.addClass("ye_editor_ue");
    $toolbar.addClass('ye_editor_toolbar');
    $toolbar_gain.css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: '7px 0 0 3px',
      boxSizing: 'border-box',
      borderBottom: 'solid 1px #fff',
      height: '40px'
    });
    $toolbar_init.css({
      position: 'absolute',
      top: '40px',
      left: '5px',
      height: '30px',
      boxSizing: 'border-box',
      paddingTop: '4px'
    });
  },
  // 工具栏fix实现
  doFixToolbar: function() {
    var _this = this;

    var isHeaderFixed = YE.opt.ISHEADERFIXED,
      headerH = YE.opt.HEIGHT_HEADER;
    var $editor = this.$editor_ue;
    var $toolbar = this.$editor_toolbar;
    var _win = _this.$editor_iframe[0].contentWindow;
    var _offset = $editor.offset();
    var toolbar_h, editor_h,
      statusbar_h = 0;

    function doFix(e) {
      var _top;
      var _docTop = (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop,
        _docLeft = (document.documentElement && document.documentElement.scrollLeft) ||
        document.body.scrollLeft;
      var _containerWidth = $editor.css('width').split('px')[0];
      editor_h = parseInt($editor.css('height').split('px')[0]) + 2;
      _offset = $editor.offset();
      toolbar_h = parseInt($toolbar.css('height').split('px')[0]);

      var _bottom = _offset.top + editor_h - statusbar_h - toolbar_h;

      if (isHeaderFixed) {
        if (_docTop + headerH > _bottom) {
          _top = _bottom - _docTop;
        } else {
          _top = headerH;
        }
        _docTop += headerH;
      }

      if (_docTop > _offset.top) {
        $toolbar.css({
          position: 'fixed',
          border: '1px solid #CCCCCC',
          width: _containerWidth - 10 + "px",
          top: _top + 'px',
          left: _offset.left - _docLeft + "px",
          zIndex: 1000
        });
      } else {
        $toolbar.css({
          position: 'static',
          border: 'none',
          width: 'auto',
          borderBottom: '1px solid #CCCCCC'
        });
      }
    }
    doFix();
    $(window).on("scroll resize", doFix);
    $(_win).on("resize", doFix);
  }

};

/**
 * @desc UI-评论开关区
 */
YKEditor.prototype.UI.opencomment = {
  render: function() {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_opencomment'>";
    html += "<div class='ye_body ye_body_opencomment'>";
    html += "<span class='f_12'>";
    html +=
      "<input type='checkbox' class='ye_checkbox ye_checkbox_opencomment'>";
    html += "开启评论模块</span>";
    html += "</div>";
    html += "</li>";
    return html;
  }

};

/**
 * @desc UI-摘要区
 */
YKEditor.prototype.UI.summary = {
	render: function() {
		var html = "";
		html += "<li class='ye_li ye_box ye_box_summary'>";
		html += "<div class='ye_head ye_head_summary'>推荐理由";
		html += "<span class='ye_subtitle colorGrey ml8'>好的推荐理由可以带来更多的观看</span>";
		html += "</div>";
		html += "<div class='ye_body ye_body_summary'>";
		html += "<div class='ye_area_num_count'>0/40</div>";
		html +=
			"<textarea type='text' class='ye_input ye_input_area ye_input_area_summary'></textarea>";
		html += "</div>";
		html += "<div class='ye_error' >推荐理由不能超过40字</div>";
		html += "</li>";

		return html;
	}

};

/**
 * @desc UI-标题区
 */
YKEditor.prototype.UI.title = {
  render: function() {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_title'>";
    html += "<div class='ye_head ye_head_title'>标题</div>";
    html += "<div class='ye_body ye_body_title'>";
    html += "<div class='ye_input_num_count'>0/" + YE.MAX_COUNT_TITLE +
      "</div>";
    html += "<input type='text' class='ye_input ye_input_title'>";
    html += "</div>";
    html += "<div class='ye_error' >请填写标题</div>";
    html += "</li>";

    return html;
  }

};

/**
 * @desc 事件绑定代理函数
 */
YKEditor.prototype.bind = function() {
	this.bind_articlelist();
	this.bind_title();
	this.bind_summary();
	this.bind_cover();
	this.bind_editor();
	this.bind_opencomment();
	this.bind_donate();
	this.bind_extraFix();
};

/**
 * @desc 多篇文章切换编辑触发事件
 * @todo 目前暂未开放
 */
YKEditor.prototype.bind_articlelist = function() {
	var _this = this;
	this.$articlelist_box.on("click", ".ye_cover_img .ye_act_editA", function() {
		// 启用编辑时对当前正在编辑的文章触发一次自动保存
		YE.saveActive();
		YE.disableAll();
		_this.enable();
	}).on("click", ".ye_cover_img .ye_act_delA", function() {
		_this.Ajax.deleteArticle.call(_this);
	});
};

/**
 * @desc 封面操作的一系列事件绑定
 */
YKEditor.prototype.bind_cover = function() {
  var _this = this;
  // 上传图片的form表单提交地址
  _this.$cover_form.attr('action', YE.config.domain + YE.URL_UPLOAD_IMG +
    "?push_upload_type=cover&callback=parent.YE.Handler.afterUploadCV&ykeditor_id=" +
    _this.timestamp);
  // 检查图片格式是否合法
  function _checkImg() {
    var filename = _this.$cover_input.val();
    // 校验校验扩展名
    var extname = /\.[^\.]+$/.exec(filename)[0];
    extname = extname.toLowerCase();

    if (extname != '.png' && extname != '.jpg' && extname != '.jpeg' &&
      extname != '.gif') {
      return false;
    }
    return true;
  }
  // file控件onChange事件响应
  function onUpload() {
    var isValid = _checkImg();
    if (!isValid) {
      YE.Dialog.error("图片格式错误");
    } else {
      _this.$cover_form.submit();
      YE.Dialog.uploading();
      // 【important】表单提交后，原file控件删除并用其clone节点代替，参数true目的是为了保留原控件的事件监听
      // 此操作是为了解决重复图片无法上传问题
      _this.$cover_input.replaceWith(_this.$cover_input = _this.$cover_input.clone(
        true));
      // 上传超时提示
      var timer = setTimeout(function() {
        YE.dialog_uploading.hide();
        if (!_this.res_status.uploadCV) {
          YE.Dialog.error("上传超时");
        } else {
          clearTimeout(timer);
        }
      }, 5000);
    }
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
  }

  // 删除封面事件响应
  function onDelete() {
    _this.data.cover = "";
    _this.isCoverReady = false;
    _this.$cover_preview_box.hide();
    _this.$cover_preview_img.attr("src", "");
    _this.status.cover = 0;
    _this.UI.articlelist.updateCover.call(_this);
    _this.$cover_error.show();
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
    _this.autosave.call(_this);
  }
  // 打开图片库
  function openGallery() {
    YE.Ajax.getGallery("cover");
  }
  // file控件onChange事件监控
  _this.$cover_input.on("change", onUpload);
  // 删除封面图事件监控
  _this.$cover_delete.on("click", onDelete);
  // 图片库按钮
  this.$cover_btn_gallery.on("click", openGallery);
};

/**
 * @desc 打赏操作的一系列事件绑定
 */
YKEditor.prototype.bind_donate = function() {
  var _this = this;

  function onCheck() {
    if (_this.$donate_checkbox[0].checked) {
      _this.data.open_donate = "1";
      _this.$donate_box.addClass('ye_box_donate-open');
      _this.$donate_input_title.val(_this.data.donateTitle);
      _this.$donate_input_flag.val(_this.data.donateFlag);
      onTitleChange();
      onFlagChange();
    } else {
      _this.data.open_donate = "0";
      _this.$donate_box.removeClass('ye_box_donate-open');
      _this.updateDonateId();
    }
  }

  function onTitleChange() {
    var value = $.trim(_this.$donate_input_title.val());
    var formatedValue = YE.Util.textfilter(value, "script");
    if (formatedValue !== "") {
      _this.$donate_input_title.val(formatedValue);
      value = formatedValue;
    }
    var count = value.length;
    _this.data.donateTitle = value;
    _this.$donate_count_title.html(count + "/" + YE.MAX_COUNT_DONATETITLE);
    if (count > YE.MAX_COUNT_DONATETITLE) {
      _this.status.donateTitle = 2;
      _this.$donate_error_title.html("不能超过" + YE.MAX_COUNT_DONATETITLE + "字")
        .show();
      _this.$donate_input_title.addClass('ye_input-error');
      _this.$donate_count_title.addClass('c_red');
    } else if (count === 0) {
      _this.status.donateTitle = 0;
      _this.$donate_error_title.hide();
      _this.$donate_input_title.removeClass('ye_input-error');
      _this.$donate_count_title.removeClass('c_red');
    } else {
      _this.status.donateTitle = 1;
      _this.$donate_error_title.hide();
      _this.$donate_input_title.removeClass('ye_input-error');
      _this.$donate_count_title.removeClass('c_red');
    }
  }

  function onFlagChange() {
    var value = $.trim(_this.$donate_input_flag.val());
    var formatedValue = YE.Util.textfilter(value, "script");
    if (formatedValue !== "") {
      _this.$donate_input_flag.val(formatedValue);
      value = formatedValue;
    }
    var count = value.length;
    _this.data.donateFlag = value;
    _this.$donate_count_flag.html(count + "/" + YE.MAX_COUNT_DONATEFLAG);
    if (count > YE.MAX_COUNT_DONATEFLAG) {
      _this.status.donateFlag = 2;
      _this.$donate_error_flag.html("不能超过" + YE.MAX_COUNT_DONATEFLAG + "字").show();
      _this.$donate_input_flag.addClass('ye_input-error');
      _this.$donate_count_flag.addClass('c_red');
    } else if (count === 0) {
      _this.status.donateFlag = 0;
      _this.$donate_error_flag.hide();
      _this.$donate_input_flag.removeClass('ye_input-error');
      _this.$donate_count_flag.removeClass('c_red');
    } else {
      _this.status.donateFlag = 1;
      _this.$donate_error_flag.hide();
      _this.$donate_input_flag.removeClass('ye_input-error');
      _this.$donate_count_flag.removeClass('c_red');
    }
  }
  _this.$donate_checkbox.on("click", onCheck);
  _this.$donate_input_title.on("keyup blur change paste input", onTitleChange);
  _this.$donate_input_flag.on("keyup blur change paste input", onFlagChange);

};

/**
 * @desc 编辑内容操作的一系列事件绑定
 */
YKEditor.prototype.bind_editor = function() {
  var _this = this;

  function onContentchange() {
    _this.data.content = _this.ueditor.getContent();
    _this.content_html_length = _this.ueditor.getContentLength();
    _this.content_text_length = _this.ueditor.getContentLength(true);
    _checkEditor();
  }

  function autosave() {
    _this.autosave.call(_this);
  }

  function _checkEditor(isShowerror) {
    var show_view = isShowerror || true;

    function showError(errmsg) {
      if (!show_view) {
        return;
      }
      _this.$editor_error.html(errmsg).show();
    }

    function hideError() {
      _this.$editor_error.hide();
    }
    if (_this.content_text_length > YE.MAX_COUNT_CONTENT) {
      _this.status.content = 2;
      showError('正文字数多于' + YE.MAX_COUNT_CONTENT + '字');
    } else if (_this.content_html_length === 0 && _this.content_text_length ===
      0) {
      // 纯文本和html结构都为空即认为正文为空
      _this.status.content = 0;
      hideError();
    } else {
      _this.status.content = 1;
      hideError();
    }
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
  }
  this.ueditor.addListener("contentchange blur", onContentchange);
  this.ueditor.addListener("blur", autosave);
};

/**
 * @desc 解决编辑器内核功能缺陷
 */
YKEditor.prototype.bind_extraFix = function() {
  var _this = this;
  // 修复backspace&delete无法单独删除投票&语音容器bug
  this.ueditor.addListener("keydown", function(type, e) {
    var range, curDom, delDom;
    if (e.keyCode === 8 || e.which === 8) {
      // backspace
      range = this.selection.getRange();
      curDom = range.startContainer;
      // 光标定位至text节点时需要额外处理
      if (curDom.nodeType === 3) {
        var content = curDom.textContent || curDom.data;
        // 解决UTF-8 + BOM引起range定位错误的问题
        if ((content.length !== 1 && range.startOffset !== 1) || (content
            .length === 1 && range.startOffset === 1 && (curDom.parentNode
              .innerHTML !== "<br>" || curDom.parentNode.innerHTML !== ""
            ))) {
          return;
        } else {
          curDom = curDom.parentNode;
        }
      }
      $delDom = $(curDom).prev();
      if ($delDom.hasClass("yeaudio_box") || $delDom.hasClass(
          "yevote_box")) {
        range.selectNode($delDom[0]);
        range.deleteContents();
        return;
      }
    } else if (e.keyCode === 46 || e.which === 46) {
      // delete
      range = this.selection.getRange();
      curDom = range.startContainer;
      if (range.startOffset !== curDom.length) {
        return;
      }
      if (curDom.nodeType === 3) {
        curDom = curDom.parentNode;
      }
      $delDom = $(curDom).next();
      if ($delDom.hasClass("yeaudio_box") || $delDom.hasClass(
          "yevote_box")) {
        range.selectNode($delDom[0]);
        range.deleteContents();
        return;
      }
    }
  });
};

/**
 * @desc 评论开关操作的一系列事件绑
 */
YKEditor.prototype.bind_opencomment = function() {
	var _this = this;
	if (_this.data.open_comment === "1") {
		_this.$opencomment[0].checked = true;
	}

	function onCheck() {
		if (_this.$opencomment[0].checked) {
			_this.data.open_comment = "1";
		} else {
			_this.data.open_comment = "0";
		}
		_this.autosave.call(_this);
	}
	_this.$opencomment.on("click", onCheck);
};

/**
 * @desc 摘要操作的一系列事件绑定
 */
YKEditor.prototype.bind_summary = function() {
  var _this = this;
  /**
   *检测摘要字数是否符合规范
   */
  function _checkSummary(isShowerror) {
    var show_view = isShowerror || true;
    var value = $.trim(_this.$summary_input.val());
    var formatedValue = YE.Util.textfilter(value, "script");
    if (formatedValue !== "") {
      _this.$summary_input.val(formatedValue);
      value = formatedValue;
    }

    var count = value.length;
    // 显示错误,没有填写
    function showErrorView(msg) {
      if (!show_view) {
        return;
      }
      _this.$summary_error.hide();
      _this.$summary_count.addClass("c_red");
      if (count > YE.MAX_COUNT_SUMMARY) {
        _this.$summary_error.html("推荐理由不能超过" + YE.MAX_COUNT_SUMMARY + "字");
      } else if (count === 0) {
        _this.$summary_error.html("推荐理由不能为空");
      }
      _this.$summary_error.show();
      _this.$summary_input.addClass("ye_input-error");
    }
    // 隐藏错误
    function hideErrorView() {
      if (!show_view) {
        return;
      }
      _this.$summary_error.hide();
      _this.$summary_input.removeClass("ye_input-error");
      _this.$summary_count.removeClass("c_red");
    }
    // 同步提示数字
    function changeNumView() {
      _this.$summary_count.html(count + "/" + YE.MAX_COUNT_SUMMARY);
    }

    changeNumView();
    // 报错提示
    if (count > YE.MAX_COUNT_SUMMARY) {
      showErrorView();
      _this.status.summary = 2;
    } else if (count === 0) {
      hideErrorView();
      _this.status.summary = 0;
    } else {
      hideErrorView();
      _this.status.summary = 1;
    }
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
  }

  _this.$summary_input.on("keyup change input paste blur", _checkSummary);
};

/**
 * @desc 标题操作的一系列事件绑定
 */
YKEditor.prototype.bind_title = function() {
  var _this = this;

  /**
   *检测标题字数是否符合规范
   */
  function _checkTitle(isShowerror) {
    var show_error = isShowerror || true;
    var value = $.trim(_this.$title_input.val());
    var formatedValue = YE.Util.textfilter(value, "script");
    if (formatedValue !== "") {
      _this.$title_input.val(formatedValue);
      value = formatedValue;
    }
    var count = value.length;

    // 显示错误,没有填写
    function showErrorView(msg) {
      if (!show_error) {
        return;
      }
      if (count > YE.MAX_COUNT_TITLE) {
        _this.$title_error.hide();
        _this.$title_count.addClass("c_red");
        _this.$title_error.html("标题不能超过" + YE.MAX_COUNT_TITLE + "字");
      } else {
        _this.$title_count.removeClass("c_red");
        _this.$title_error.html('请填写标题');
      }
      _this.$title_error.show();
      _this.$title_input.addClass("ye_input-error");
    }
    // 隐藏错误
    function hideErrorView() {
      if (!show_error) {
        return;
      }
      _this.$title_error.hide();
      _this.$title_input.removeClass("ye_input-error");
      _this.$title_count.removeClass("c_red");
    }
    // 字数提示
    function changeNumView() {
      _this.$title_count.html(count + "/" + YE.MAX_COUNT_TITLE);
    }

    changeNumView();
    // 报错提示
    if (count > YE.MAX_COUNT_TITLE) {
      showErrorView();
      _this.status.title = 2;
    } else if (count === 0) {
      hideErrorView();
      _this.status.title = 0;
    } else {
      hideErrorView();
      _this.status.title = 1;
    }
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
    return value;
  }

  _this.$title_input.on("keyup blur change paste input", function() {
    var value = _checkTitle(true);
    _this.data.title = value;
    _this.UI.articlelist.updateTitle.call(_this);
  }).on("blur", function() {
    _this.autosave();
  });
};

/**
 * @desc 删除文章
 * @todo 目前暂未开放
 */
YKEditor.prototype.Ajax.deleteArticle = function() {
  var _this = this;
  YE.Dialog.uploading("删除中...");
  var _url = YE.config.domain + YE.URL_AJAX_DEL;
  $.ajax({
    url: _url,
    type: "post",
    dataType: "jsonp",
    timeout: 3000,
    data: {
      'article_id': _this.data.articleId
    },
    error: function() {
      YE.dialog_uploading.hide();
      YE.Dialog.error("网络故障！");
    },
    complete: function(xhr, status) {
      YE.dialog_uploading.hide();
      if (status === "timeout") {
        YE.Dialog.error("请求超时！");
      }
    },
    success: function(res) {
      // 有错误
      if (res.code != 100) {
        YE.Dialog.error(res.msg);
        return;
      }
      clearInterval(_this.timer_autosave);
      _this.$container.remove();
      delete YE.instances[_this.timestamp];
      YE.instances.count--;
    }
  });
};

/**
 * @desc 获取打赏ID
 */
YKEditor.prototype.Ajax.getDonateId = function() {
  var _this = this;
  if (_this.data.open_donate === "0") {
    YE.dialog_cover.hide();
    YE.$publish_btn.trigger('publish');
    return;
  }
  if (_this.status.donateTitle === 0) {
    YE.dialog_cover.hide();
    _this.$donate_error_title.html("标题不能为空").show();
    _this.$donate_input_title.addClass('ye_input-error');
    YE.Dialog.warning("求赏赐标题不能为空");
    if (_this.status.donateFlag === 0) {
      _this.$donate_input_flag.addClass('ye_input-error');
      _this.$donate_error_flag.html("感谢语不能为空").show();
    }
    return;
  } else if (_this.status.donateTitle === 2) {
    YE.dialog_cover.hide();
    YE.Dialog.warning("求赏赐标题字数太多");
    return;
  } else if (_this.status.donateFlag === 0) {
    YE.dialog_cover.hide();
    _this.$donate_input_flag.addClass('ye_input-error');
    _this.$donate_error_flag.html("感谢语不能为空").show();
    YE.Dialog.warning("求赏赐感谢语不能为空");
    return;
  } else if (_this.status.donateFlag === 2) {
    YE.dialog_cover.hide();
    YE.Dialog.warning("求赏赐感谢语字数太多");
    return;
  }

  var url = YE.URL_AJAX_GET_DONATEID;
  var u_icon = $('.yk-userlog-after-avatar').attr('src');
  var u_id = get_username('all').userid;
  var jsondata = {
    "create_id": u_id,
    "target_user_id": u_id,
    "create_source": 3,
    "cost_type": 1,
    "cost_set_type": 1,
    "target_user_icon": u_icon,
    "cost_set": "0.99,4.99,9.99",
    "title": _this.data.donateTitle,
    "send_letter": 1,
    "letter_message": _this.data.donateFlag
  };
  var params = {
    plugin_key: "reward",
    jsondata: JSON.stringify(jsondata)
  };

  $.ajax({
    url: url,
    type: "get",
    data: params,
    timeout: 3000,
    dataType: "jsonp",
    error: function() {
      YE.dialog_cover.hide();
      YE.Dialog.warning("网络不给力 请稍后再试");
    },
    complete: function(xhr, status) {
      YE.dialog_cover.hide();
      if (status === "timeout") {
        YE.Dialog.warning("网络不给力 请稍后再试");
      }
    },
    success: function(res) {
      YE.dialog_cover.hide();
      if (!res || res.error_code !== 0) {
        if (res && res.error_code == -6) {
          YE.Dialog.warning("标题包含敏感词!");
        } else if (res && res.error_code == -8) {
          YE.Dialog.warning("感谢语包含敏感词!");
        } else {
          YE.Dialog.warning("网络不给力 请稍后再试");
        }
        return;
      }

      _this.data.donateId = res.result.mpid;
      _this.updateDonateId();
      YE.$publish_btn.trigger('publish');
    }
  });
};

/**
 * @desc 获取预览数据
 */
YKEditor.prototype.Ajax.getPreview = function() {
  var _this = this;
  $("#qWindowBox_yepreview .preview_qcode_cover").hide();
  $.ajax({
    url: YE.URL_AJAX_GET_PREVIEW,
    data: {
      article_id: _this.data.articleId
    },
    type: "get",
    dataType: "jsonp",
    timeout: 3000,
    error: function(res) {
      YE.Dialog.error("预览生成失败");
    },
    complete: function(xhr, status) {
      if (YE.dialog_uploading) {
        YE.dialog_uploading.hide();
      }
      if (status === "timeout") {
        YE.Dialog.warning("网络不给力 请稍后再试");
      }
      _this.autosave();
    },
    success: function(res) {
      if (!res || !res.data) {
        YE.Dialog.error("预览生成失败");
      }
      var data = res.data;
      YE.Dialog.preview(data.qrcode, data.title, data.preview_url);
      // 二维码3分钟超时
      setTimeout(function() {
        $("#qWindowBox_yepreview .preview_qcode_cover").show();
      }, 600000);
    }
  });
};

/**
 * @desc 保存编辑内容
 */
YKEditor.prototype.Ajax.sendArticle = function(type) {
  var _this = this;
  _this.data.title = $.trim(_this.$title_input.val());
  _this.data.summary = $.trim(_this.$summary_input.val());
  _this.data.cover = _this.$cover_preview_img.attr("src");
  _this.data.content = _this.ueditor.getContent() || '';
  var article_params = {
    'title': _this.data.title,
    'summary': _this.data.summary,
    'cover': _this.data.cover,
    'content': _this.data.content,
    'open_comment': _this.data.open_comment
  };

  if (_this.data.articleId !== "") {
    article_params.article_id = _this.data.articleId;
  }
  // 自动保存 不需要
  if (type !== 'autosave') {
    YE.Dialog.uploading('保存中...');
  }
  // 清空投票html结构
  if (type === "publish" || type === 'preview') {
    article_params.content = YE.Util.clearVoteExtra(article_params.content);
  }

  $.ajax({
    url: _this.URL_AJAX_SEND,
    type: "post",
    dataType: "jsonp",
    data: article_params,
    success: function(res) {
      if (YE.dialog_uploading) {
        YE.dialog_uploading.hide();
      }
      if (!res) {
        return;
      }
      // 有错误
      if (res.code !== "100") {
        if (type !== 'autosave') {
          YE.Dialog.error(res.msg);
        }
        return;
      }
      _this.data.articleId = res.data;

      // 显示自动保存
      _this.$editor_subtitle.html('已自动保存 ' + YE.Util.format_date(new Date(),
        "yyyy-MM-dd hh:mm:ss")).show();

      if (type === 'preview') {
        YE.Dialog.uploading('预览生成中...');
        _this.Ajax.getPreview.call(_this);
      } else if (type === "publish") {
        YE.Ajax.sendPublish.call(YE);
      } else if (type === "manual") {
        YE.Dialog.success("保存成功");
      }
    },
    error: function() {
      if (YE.dialog_uploading) {
        YE.dialog_uploading.hide();
      }
      YE.Util.log.error('网络故障！');
      return false;
    }
  });
};

return YE;

})(jQuery);
