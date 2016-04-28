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
