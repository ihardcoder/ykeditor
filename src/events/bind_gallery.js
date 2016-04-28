/**
 * @desc 绑定图片库事件
 */
YE.Bind.gallery = function() {
  var CLASS_CHECKED = "yegallery_gallery_item-checked";

  // 当前激活状态编辑器
  var instance = null;
  var _target = "";
  var maxCount = 0;
  var _id = 0,
    _img = "",
    _index = 0,
    _html = "",
    $img = null;
  var uploading_dom = [
    '<li class="yegallery_gallery_item yegallery_gallery_item-fake">',
    '<div class="gallery_item_thumb">',
    '<div class="thumb_cover thumb_cover_checked"></div>',
    '<img class="thumb_img" src="/u/img/ykeditor/uploading.jpg">',
    '<span class="ye_icon ye_icon_close_cube"></span>',
    '</div>',
    '<div class="gallery_item_entry">',
    '<span class="entry_name">上传中...</span>',
    '</div>',
    '</li>'
  ].join("");
  // 检查图片格式是否合法
  function _checkImg(file) {
    var filename = file;
    // 校验校验扩展名
    var extname = /\.[^\.]+$/.exec(filename)[0];
    extname = extname.toLowerCase();

    if (extname != '.png' && extname != '.jpg' && extname != '.jpeg' &&
      extname != '.gif') {
      return false;
    }
    return true;
  }

  function countChecked() {
    // 区分封面与正文
    maxCount = YE.dialog_gallery.target === "cover" ? 1 : YE.MAX_COUNT_GALLERY_CHECKED;
    $("#qWindowBox_yegallery .qWindowBox_yegallery_slectedsum").html("已选" +
      YE.checked_id.length + "个，可选" + maxCount + "个");

    if (YE.checked_id.length !== 0) {
      $("#qWindowBox_yegallery .qWindowBox_yegallery_act_btn").removeClass(
        "ye_btn-disable");
    } else {
      $("#qWindowBox_yegallery .qWindowBox_yegallery_act_btn").addClass(
        "ye_btn-disable");
    }
  }

  $(document).on("click", "#qWindowBox_yegallery .yegallery_gallery_item",
    function(e) {
      // 区分封面与正文
      maxCount = YE.dialog_gallery.target === "cover" ? 1 : YE.MAX_COUNT_GALLERY_CHECKED;
      if ($(this).hasClass("yegallery_gallery_item-fake")) {
        return false;
      }
      if ($(this).hasClass("yegallery_gallery_item-checked")) {
        $(this).removeClass(CLASS_CHECKED);
        _id = $(this).attr("_id");
        _index = $.inArray(_id, YE.checked_id);
        YE.checked_id.splice(_index, 1);
      } else {
        if (maxCount === 1) {
          $("#qWindowBox_yegallery .yegallery_gallery_item").removeClass(
            CLASS_CHECKED);
          $(this).addClass(CLASS_CHECKED);
          YE.checked_id = [];
          _id = $(this).attr("_id");
          YE.checked_id.push(_id);
        } else {
          if (YE.checked_id.length < maxCount) {
            $(this).addClass(CLASS_CHECKED);
            _id = $(this).attr("_id");
            YE.checked_id.push(_id);
          }
        }
        $img = $(this).find(".thumb_img");
        YE.checked_img[_id] = {
          "src": $img.attr("src"),
          "w": $img.attr("_width") || "0",
          "h": $img.attr("_height") || "0"
        };
      }
      countChecked();
    }).on("click", "#qWindowBox_yegallery .qWindowBox_yegallery_act_btn",
    function(e) {
      // 未选图片不可操作
      if (YE.checked_id.length === 0 || $(this).hasClass("ye_btn-disable")) {
        return;
      }
      // 获取当前active的编辑器
      for (var o in YE.instances) {
        if (o !== "count") {
          if (YE.instances[o].active) {
            instance = YE.instances[o];
          }
        }
      }

      if (YE.dialog_gallery.target === "cover") {
        // 更新封面
        _img = YE.checked_img[YE.checked_id[0]].src;
        instance.$cover_preview_img.attr("src", _img);
        instance.$cover_preview_box.show();
        instance.data.cover = _img;
        instance.status.cover = 1;
        instance.UI.articlelist.updateCover.call(instance);
        instance.$cover_error.hide();
        instance.autosave();
      } else if (YE.dialog_gallery.target === "editor") {
        // 插入新图片之前要清空碎片内容
        _html = "";
        // 正文插入图片
        $.each(YE.checked_id, function(i, v) {
          _img = YE.checked_img[v].src;
          _html += "<img src=" + _img + " _width=" + YE.checked_img[v].w +
            " _height=" + YE.checked_img[v].h + ">";
        });
        instance.ueditor.execCommand("inserthtml", _html);
        instance.autosave();
      }

      YE.dialog_gallery.hide();
    }).on("click", "#qWindowBox_yegallery .ye_icon_close_cube", function(e) {
    // 删除单张图片
    var ev = e || window.event;
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    } else {
      ev.cancelBubble = true;
    }
    // 清空checked图片
    YE.checked_id = [];
    // 保存目标类型
    _target = YE.dialog_gallery.target;

    YE.Dialog.gallery("loading", _target);
    var _url = YE.URL_AJAX_DEL_GALLERYL + "?material_id=" + $(this).attr(
      "_id");
    $.ajax({
      url: _url,
      dataType: "jsonp",
      error: function() {
        YE.Dialog.gallery("error", _target);
      },
      complete: function(xhr, status) {
        if (status === "timeout") {
          YE.Dialog.gallery("error", _target);
        }
      },
      success: function(res) {
        if (!res || res.code !== "100") {
          YE.Dialog.gallery("error", _target);
        }
        YE.Ajax.getGallery(_target);
      }
    });

    return false;
  }).on("change",
    "#qWindowBox_yegallery .yegallery_upload_file, #yegallery_upload_form_empty .yegallery_upload_file_empty",
    function() {
      if ($(this).val() === "") {
        return;
      }
      var isValid = _checkImg($(this).val());
      if (!isValid) {
        alert("图片格式错误");
      } else {
        var filename = $(this).val().split('fakepath\\')[1];
        $("#qWindowBox_yegallery .yegallery_gallery_list").prepend(
          uploading_dom);
        $("#qWindowBox_yegallery .yegallery_gallery_item-fake .entry_name")
          .html(filename);
        if ($(this).hasClass("yegallery_upload_file_empty")) {
          $(".yegallery_gallery_empty").hide();
          $("#yegallery_upload_form_empty").submit();
        } else {
          $("#yegallery_upload_form").submit();
        }

        YE.res_status.uploadGE = false;
        var timer = setTimeout(function() {
          if (YE.res_status.uploadGE) {
            clearTimeout(timer);
          } else {
            $(
              "#qWindowBox_yegallery .yegallery_gallery_item-fake .thumb_img"
            ).attr("src", "/u/img/ykeditor/upload-error.jpg");
          }
        }, 10000);
      }
    }).on("click", "#qWindowBox_yegallery .qPager_gallery a", function() {
    var pager = $(this).attr("_page");
    if (pager) {
      var url = YE.URL_AJAX_GET_GALLERY + "?page=" + pager;
      // 保存目标类型
      _target = YE.dialog_gallery.target;
      YE.Ajax.getGallery(_target, url);
    }
  }).on("click", "#qWindowBox_yegallery .yegallery_gallery_error_act",
    function() {
      // 保存目标类型
      _target = YE.dialog_gallery.target;
      YE.Ajax.getGallery(_target);
    });
};
