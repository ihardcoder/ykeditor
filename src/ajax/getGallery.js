/**
 * @memeberof YE.Ajax
 * @desc 获取图片库素材
 * @param {string} target -  插入图片的区域(cover/editor)
 * @param {string} url - 接口url
 */
YE.Ajax.getGallery = function(target, url) {
  YE.Dialog.gallery("loading", target);
  var _url = url || YE.URL_AJAX_GET_GALLERY;
  $.ajax({
    url: _url,
    data: {
      ge_target: target
    },
    timeout: 5000,
    dataType: "jsonp",
    success: function(res) {
      if (!res || res.code !== "100") {
        YE.Dialog.gallery("error", target);
        return;
      }
      if (res.total === 0) {
        YE.Dialog.gallery("empty", target);
      } else {
        var content = res.data;
        YE.Dialog.gallery("content", target, content);
      }
    },
    error: function() {
      YE.Dialog.gallery("error", target);
    },
    complete: function(xhr, status) {
      if (status === "timeout") {
        YE.Dialog.gallery("error", target);
      }
    }
  });
};
