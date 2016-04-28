/**
 * @desc UI-评论开关区
 */
YKEditor.prototype.UI.opencomment = {
  render: function() {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_opencomment'>";
    html += "<div class='ye_body ye_body_opencomment'>";
    html += "<span class='f_12'>";
    html +=
      "<input type='checkbox' class='ye_checkbox ye_checkbox_opencomment'>";
    html += "开启评论模块</span>";
    html += "</div>";
    html += "</li>";
    return html;
  }

};
