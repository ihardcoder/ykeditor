/**
 * @desc 封面操作的一系列事件绑定
 */
YKEditor.prototype.bind_cover = function() {
  var _this = this;
  // 上传图片的form表单提交地址
  _this.$cover_form.attr('action', YE.config.domain + YE.URL_UPLOAD_IMG +
    "?push_upload_type=cover&callback=parent.YE.Handler.afterUploadCV&ykeditor_id=" +
    _this.timestamp);
  // 检查图片格式是否合法
  function _checkImg() {
    var filename = _this.$cover_input.val();
    // 校验校验扩展名
    var extname = /\.[^\.]+$/.exec(filename)[0];
    extname = extname.toLowerCase();

    if (extname != '.png' && extname != '.jpg' && extname != '.jpeg' &&
      extname != '.gif') {
      return false;
    }
    return true;
  }
  // file控件onChange事件响应
  function onUpload() {
    var isValid = _checkImg();
    if (!isValid) {
      YE.Dialog.error("图片格式错误");
    } else {
      _this.$cover_form.submit();
      YE.Dialog.uploading();
      // 【important】表单提交后，原file控件删除并用其clone节点代替，参数true目的是为了保留原控件的事件监听
      // 此操作是为了解决重复图片无法上传问题
      _this.$cover_input.replaceWith(_this.$cover_input = _this.$cover_input.clone(
        true));
      // 上传超时提示
      var timer = setTimeout(function() {
        YE.dialog_uploading.hide();
        if (!_this.res_status.uploadCV) {
          YE.Dialog.error("上传超时");
        } else {
          clearTimeout(timer);
        }
      }, 5000);
    }
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
  }

  // 删除封面事件响应
  function onDelete() {
    _this.data.cover = "";
    _this.isCoverReady = false;
    _this.$cover_preview_box.hide();
    _this.$cover_preview_img.attr("src", "");
    _this.status.cover = 0;
    _this.UI.articlelist.updateCover.call(_this);
    _this.$cover_error.show();
    // 重新计算容器高度，以便发布操作区样式适配
    _this.UI.restyle.call(_this);
    _this.autosave.call(_this);
  }
  // 打开图片库
  function openGallery() {
    YE.Ajax.getGallery("cover");
  }
  // file控件onChange事件监控
  _this.$cover_input.on("change", onUpload);
  // 删除封面图事件监控
  _this.$cover_delete.on("click", onDelete);
  // 图片库按钮
  this.$cover_btn_gallery.on("click", openGallery);
};
