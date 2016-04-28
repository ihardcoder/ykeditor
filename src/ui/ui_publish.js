/**
 * @desc 发布操作区UI
 */
YE.UI.publish = {

  render: function() {
    var html = "<div class='ye_box ye_box_publish' style='display:none;'>";
    html += "<div class='ye_body ye_body_publish'>";
    html += "<div class='ye_btn ye_btn_large ye_btnsub_large ye_act_save'>";
    html += "<span class='ye_btn_text'>保存</span>";
    html += "</div>";
    html +=
      "<div class='ye_btn ye_btn_large ye_btn_grey ml20 ye_act_preview'>";
    html += "<span class='ye_btn_text'>预览</span>";
    html += "</div>";
    html +=
      "<div class='ye_btn ye_btn_large ye_btn_grey ml20 ye_act_publish'>";
    html += "<span class='ye_btn_text'>发布</span>";
    html +=
      "<div class='ml8 f_14 c_gray ye_status_publish'><i class='ye_icon ye_icon_arrow_yellow_l'></i><span class='ye_status_publish_hint'>今天还剩1次发布机会</span></div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    this.$publish_box = $(html).insertAfter(this.$container);
    this.$publish_btn = this.$publish_box.find(".ye_act_publish");
    this.$publish_status = this.$publish_box.find(".ye_status_publish_hint");
    this.$publish_preview = this.$publish_box.find(".ye_act_preview");
    this.$publish_save = this.$publish_box.find(".ye_act_save");
  },
  // 根据接口数据修改是否可发布以及可发布文章数目
  updateStatus: function(callback) {
    var _this = YE;
    var url = YE.config.domain + YE.URL_AJAX_GET_PUBLISHLIMIT;
    $.ajax({
      url: url,
      type: "post",
      dataType: "jsonp",
      success: function(res) {
        if (!res || res.code !== "100" || res.data === 0) {
          YE.UI.publish.disable.call(YE);
          return;
        }
        if (res.code === "100" && res.data !== 0) {
          // 【important】评论和打赏只储存状态，不更新dom，由每个编辑器实例生成后再更新
          YE.limitStatus.enableDonate = res.data.donate_limit;
          YE.limitStatus.enableInsertAudio = res.data.audio_limit;
          YE.limitStatus.publish_limit = res.data.publish_limit;
          YE.limitStatus.enableComment = res.data.comment_limit;
          if (YE.limitStatus.publish_limit === 0) {
            YE.UI.publish.disable.call(YE, YE.limitStatus.publish_limit);
          } else {
            YE.UI.publish.enable.call(YE, YE.limitStatus.publish_limit);
          }
          // _this.$publish_box.show();
          if (callback) {
            callback();
          }
        }
      },
      error: function() {
        YE.Util.log.error("用户数据获取出错");
        YE.UI.publish.disable.call(YE);
      }
    });
  },
  // 设置为不可发布状态
  disable: function() {
    var _this = this;
    _this.$publish_btn.addClass('ye_btn-disable');
    _this.$publish_status.html("今天还剩0次发布机会");
  },
  // 设置为可发布状态
  enable: function(count) {
    var _this = this;
    _this.$publish_btn.removeClass('ye_btn-disable');
    _this.$publish_status.html("今天还剩" + count + "次发布机会");
  }
};
