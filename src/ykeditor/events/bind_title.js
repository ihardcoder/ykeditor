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
