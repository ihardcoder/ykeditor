/**
 * @desc 获取打赏ID
 */
YKEditor.prototype.Ajax.getDonateId = function() {
  var _this = this;
  if (_this.data.open_donate === "0") {
    YE.dialog_cover.hide();
    YE.$publish_btn.trigger('publish');
    return;
  }
  if (_this.status.donateTitle === 0) {
    YE.dialog_cover.hide();
    _this.$donate_error_title.html("标题不能为空").show();
    _this.$donate_input_title.addClass('ye_input-error');
    YE.Dialog.warning("求赏赐标题不能为空");
    if (_this.status.donateFlag === 0) {
      _this.$donate_input_flag.addClass('ye_input-error');
      _this.$donate_error_flag.html("感谢语不能为空").show();
    }
    return;
  } else if (_this.status.donateTitle === 2) {
    YE.dialog_cover.hide();
    YE.Dialog.warning("求赏赐标题字数太多");
    return;
  } else if (_this.status.donateFlag === 0) {
    YE.dialog_cover.hide();
    _this.$donate_input_flag.addClass('ye_input-error');
    _this.$donate_error_flag.html("感谢语不能为空").show();
    YE.Dialog.warning("求赏赐感谢语不能为空");
    return;
  } else if (_this.status.donateFlag === 2) {
    YE.dialog_cover.hide();
    YE.Dialog.warning("求赏赐感谢语字数太多");
    return;
  }

  var url = YE.URL_AJAX_GET_DONATEID;
  var u_icon = $('.yk-userlog-after-avatar').attr('src');
  var u_id = get_username('all').userid;
  var jsondata = {
    "create_id": u_id,
    "target_user_id": u_id,
    "create_source": 3,
    "cost_type": 1,
    "cost_set_type": 1,
    "target_user_icon": u_icon,
    "cost_set": "0.99,4.99,9.99",
    "title": _this.data.donateTitle,
    "send_letter": 1,
    "letter_message": _this.data.donateFlag
  };
  var params = {
    plugin_key: "reward",
    jsondata: JSON.stringify(jsondata)
  };

  $.ajax({
    url: url,
    type: "get",
    data: params,
    timeout: 3000,
    dataType: "jsonp",
    error: function() {
      YE.dialog_cover.hide();
      YE.Dialog.warning("网络不给力 请稍后再试");
    },
    complete: function(xhr, status) {
      YE.dialog_cover.hide();
      if (status === "timeout") {
        YE.Dialog.warning("网络不给力 请稍后再试");
      }
    },
    success: function(res) {
      YE.dialog_cover.hide();
      if (!res || res.error_code !== 0) {
        if (res && res.error_code == -6) {
          YE.Dialog.warning("标题包含敏感词!");
        } else if (res && res.error_code == -8) {
          YE.Dialog.warning("感谢语包含敏感词!");
        } else {
          YE.Dialog.warning("网络不给力 请稍后再试");
        }
        return;
      }

      _this.data.donateId = res.result.mpid;
      _this.updateDonateId();
      YE.$publish_btn.trigger('publish');
    }
  });
};
