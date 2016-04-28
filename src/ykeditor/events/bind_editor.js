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
