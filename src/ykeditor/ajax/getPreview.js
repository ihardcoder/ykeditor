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
