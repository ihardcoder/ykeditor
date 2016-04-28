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
