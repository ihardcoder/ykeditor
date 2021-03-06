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
