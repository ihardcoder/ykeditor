/**
 * @desc UI-预览区
 */
YKEditor.prototype.UI.articlelist = {
  render: function() {
    var html = "";
    html += "<div class='ye_box ye_box_articlelist'>";
    html += "<div class='ye_body_entry'>";
    html += "<p class='ye_articlelist_title'>请填写标题</p>";
    html += "<div class='ye_articllist_info'>";
    html += "<span class='ye_icon ye_icon_readnum'></span>阅读数";
    html += "<span class='ye_icon ye_icon_commentnum'></span>评论数";
    html += "</div>";
    html += "</div>";
    html += "<div class='ye_body_image'>";
    html += "<div class='ye_cover ye_cover_img'>";
    html += "<div class='ye_act ye_act_editA'>";
    html += "<i class = 'ye_icon ye_icon_editA'></i>";
    html += "</div>";
    html += "<div class='ye_act ye_act_delA'>";
    html += "<i class = 'ye_icon ye_icon_delA'></i>";
    html += "</div>";
    html += "</div>";
    html += "<img class='yk_img yk_img_article' src=" + YE.config.emptyCV +
      ">";
    html += "</div>";
    html += "</div>";
    html += "<div class='ye_cover ye_cover_add' >+</div>";

    return html;
  },

  updateTitle: function() {
    var _this = this;
    if (_this.data && _this.data.title !== "") {
      this.$articlelist_title.html(_this.data.title);
    } else {
      this.$articlelist_title.html("请填写标题");
    }
  },

  updateCover: function() {
    var _this = this;
    if (_this.data && _this.data.cover && _this.data.cover !== "") {
      this.$articlelist_img.attr("src", _this.data.cover);
    } else {
      this.$articlelist_img.attr("src", YE.config.emptyCV);
    }
  }

};
