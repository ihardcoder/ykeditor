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
