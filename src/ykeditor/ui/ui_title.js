/**
 * @desc UI-标题区
 */
YKEditor.prototype.UI.title = {
  render: function() {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_title'>";
    html += "<div class='ye_head ye_head_title'>标题</div>";
    html += "<div class='ye_body ye_body_title'>";
    html += "<div class='ye_input_num_count'>0/" + YE.MAX_COUNT_TITLE +
      "</div>";
    html += "<input type='text' class='ye_input ye_input_title'>";
    html += "</div>";
    html += "<div class='ye_error' >请填写标题</div>";
    html += "</li>";

    return html;
  }

};
