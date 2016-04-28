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
