/**
 * @desc 上传封面的回调函数
 * @param {string|number} id -  编辑器id
 * @param {object} data - 响应数据
 */
YE.Handler.afterUploadCV = function(id, data) {
  if (YE.dialog_uploading) {
    YE.dialog_uploading.hide();
  }

  if (!data || !id) {
    return;
  }

  if (id === YE.FAKE_ID) {
    return;
  }
  var self = YE.instances[id];
  self.res_status.uploadCV = true;
  if (data.code === "100") {
    self.$cover_preview_img.attr("src", data.data);
    self.$cover_preview_box.show();
    if (data.data && data.data !== "") {
      self.data.cover = data.data;
      self.status.cover = 1;
      self.UI.articlelist.updateCover.call(self);
      self.$cover_error.hide();
    } else {
      self.status.cover = "";
    }
  } else if (data.code === "001") {
    YE.Dialog.error("图片尺寸过大");
  } else {
    YE.Dialog.error("上传失败");
  }
  self.autosave();

};
