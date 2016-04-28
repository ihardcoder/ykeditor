/**
 * @desc 上传图片库的回调函数
 * @param {string|number} id -  编辑器id
 * @param {object} data - 响应数据
 */
YE.Handler.afterUploadGE = function(id, data) {
  YE.res_status.uploadGE = true;
  YE.lock.uploadAudio = false;
  if (!data || data.code !== "100") {
    $("#qWindowBox_yegallery .yegallery_gallery_item-fake .thumb_img").attr(
      "src", "/u/img/ykeditor/upload-error.jpg");
    $("#qWindowBox_yegallery .yegallery_gallery_item-fake .entry_name").css(
      "color", "#f00");
    return;
  }

  if (data.imgid) {
    if (data.type === "editor") {
      if (YE.checked_id.length >= YE.MAX_COUNT_GALLERY_CHECKED) {
        YE.checked_id.splice(0, 1);
      }
    } else if (data.type === "cover") {
      if (YE.checked_id.length !== 0) {
        YE.checked_id = [];
      }
    }
    YE.checked_id.push(data.imgid);
    YE.checked_img[data.imgid] = {
      src: data.data,
      w: data.width,
      h: data.height
    };
  }

  if (data.isfromgallery) {
    YE.Ajax.getGallery(data.type);
  }
};
