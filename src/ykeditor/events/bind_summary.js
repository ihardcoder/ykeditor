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
