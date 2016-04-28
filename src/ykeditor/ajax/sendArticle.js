/**
 * @desc 保存编辑内容
 */
YKEditor.prototype.Ajax.sendArticle = function(type) {
  var _this = this;
  _this.data.title = $.trim(_this.$title_input.val());
  _this.data.summary = $.trim(_this.$summary_input.val());
  _this.data.cover = _this.$cover_preview_img.attr("src");
  _this.data.content = _this.ueditor.getContent() || '';
  var article_params = {
    'title': _this.data.title,
    'summary': _this.data.summary,
    'cover': _this.data.cover,
    'content': _this.data.content,
    'open_comment': _this.data.open_comment
  };

  if (_this.data.articleId !== "") {
    article_params.article_id = _this.data.articleId;
  }
  // 自动保存 不需要
  if (type !== 'autosave') {
    YE.Dialog.uploading('保存中...');
  }
  // 清空投票html结构
  if (type === "publish" || type === 'preview') {
    article_params.content = YE.Util.clearVoteExtra(article_params.content);
  }

  $.ajax({
    url: _this.URL_AJAX_SEND,
    type: "post",
    dataType: "jsonp",
    data: article_params,
    success: function(res) {
      if (YE.dialog_uploading) {
        YE.dialog_uploading.hide();
      }
      if (!res) {
        return;
      }
      // 有错误
      if (res.code !== "100") {
        if (type !== 'autosave') {
          YE.Dialog.error(res.msg);
        }
        return;
      }
      _this.data.articleId = res.data;

      // 显示自动保存
      _this.$editor_subtitle.html('已自动保存 ' + YE.Util.format_date(new Date(),
        "yyyy-MM-dd hh:mm:ss")).show();

      if (type === 'preview') {
        YE.Dialog.uploading('预览生成中...');
        _this.Ajax.getPreview.call(_this);
      } else if (type === "publish") {
        YE.Ajax.sendPublish.call(YE);
      } else if (type === "manual") {
        YE.Dialog.success("保存成功");
      }
    },
    error: function() {
      if (YE.dialog_uploading) {
        YE.dialog_uploading.hide();
      }
      YE.Util.log.error('网络故障！');
      return false;
    }
  });
};
