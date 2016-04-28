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
