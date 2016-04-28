/**
 * @desc UI-打赏
 */
YKEditor.prototype.UI.donate = {
  render: function() {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_donate'>";
    html += "<div class='ye_body ye_body_donate'>";
    // checkbox
    html += "<div class='ye_donate_act f_12 mb8'>";
    html +=
      "<input type='checkbox' class='ye_checkbox ye_checkbox_opendonate'>";
    html +=
      "开启观众赏赐<i class='ye_icon ye_icon_tag_new'></i><span class = 'ye_subtitle colorGrey f_12 lh_12 ml20 ye_hint_donate'>暂不支持预览</span></div>";

    html += "<div class = 'ye_box ye_box_contentbox'>";

    html += "<div class = 'donate_item donate_item_title mb20'>";
    html +=
      "<h3 class='f_14 lh_14 mb10'>求赏赐标题<span class = 'ye_subtitle colorGrey f_12 lh_12 ml8'>观众会在赏赐前看到这段文字</span></h3>";
    html += "<div class='content mb8'>";
    html += "<div class='ye_input_num_count'>0/" + YE.MAX_COUNT_DONATETITLE +
      "</div>";
    html += "<input class='ye_input ye_input_donatetitle' >";
    html +=
      "<p class = 'ye_hint ye_hint_donatetitle colorGrey f_12 lh_12' style='display:none;'>视频创作不容易，打个赏支持下吧</p>";
    html += "</div>";
    html += "<p class='ye_error ye_error_donatetitle'>不能超过" + YE.MAX_COUNT_DONATETITLE +
      "字</p>";
    html += "</div>";

    html += "<div class = 'donate_item donate_item_flag'>";
    html +=
      "<h3 class='f_14 lh_14 mb10'>感谢语<span class = 'ye_subtitle colorGrey f_12 lh_12 ml8'>观众赏赐后，会看到这段文字</span></h3>";
    html += "<div class='content mb8'>";
    html += "<div class='ye_input_num_count'>0/" + YE.MAX_COUNT_DONATEFLAG +
      "</div>";
    html +=
      "<textarea class='ye_input ye_input_area ye_input_area_donateflag'></textarea>";
    html +=
      "<p class = 'ye_hint ye_hint_donateflag colorGrey f_12 lh_12' style='display:none;'>感谢对我的赞助支持，你将出现在我的作品中，伴随我的创作</p>";
    html += "</div>";
    html += "<p class='ye_error ye_error_donateflag'>不能超过" + YE.MAX_COUNT_DONATEFLAG +
      "字</p>";
    html += "</div>";

    html +=
      "<a class='ye_donate_proxy' href='http://c.youku.com/agreement' target='_blank'>优酷道长赏赐使用协议</a>";
    html += "</div>";
    html += "</div>";
    html += "</li>";
    return html;
  }
};
