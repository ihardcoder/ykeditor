/**
 * @desc UI-封面区
 */
YKEditor.prototype.UI.cover = {
  render: function(id) {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_cover'>";
    html +=
      "<div class='ye_head ye_head_cover'>封面<span class='ye_subtitle colorGrey f_12 ml8'>图片最大不可超过5M，建议尺寸640像素*360像素</span></div>";
    html += "<div class='ye_body ye_body_cover'>";
    html +=
      "<div class='ye_cover_upload  ye_btn ye_btn_middle ye_btnsub_middle'>";
    html += "<span class='ye_btn_text'>上传图片</span>";
    html += "<iframe name='ye_upload_cover_target_" + id +
      "' style='display:none;'></iframe>";
    html += "<form action='' target='ye_upload_cover_target_" + id +
      "' method='post' enctype='multipart/form-data' class='ye_upload_cover_form' id='ye_upload_cover_form_" +
      id + "'>";
    html += "<input type='file' name='upfile' class='ye_upfile' >";
    html += "</form>";
    html += "</div>";
    html +=
      "<div class='ye_cover_gallery  ye_btn ye_btn_middle ye_btnsub_middle'>";
    html += "<span class='ye_btn_text'>从图片库选择</span>";
    html += "</div>";
    html += "<div class='ye_error' >请上传封面</div>";
    html += "<div class='ye_cover_preview'>";
    html += "<img src= '' class='ye_cover_mini'>";
    html += "<span class='ml8 ye_act ye_act_delete_cover'>删除</span>";
    html += "</div>";
    html += "</div>";
    html += "</li>";

    return html;
  }
};
