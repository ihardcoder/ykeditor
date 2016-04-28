YKEditor.prototype.UI = {
  render: function(timestamp, opts) {
    var opt = opts || {};
    var container = ["<div class='ykeditor clearfix' id = 'ykeditor_" + timestamp + "'>"];
    var ye_box_editarea = ["<div class='ye_box ye_box_editarea clearfix'>"];
    var ye_section_left = ["<div class='ye_section ye_section_left clearfix'>"];
    var ye_section_right = ["<div class='ye_section ye_section_right clearfix'><ul class='ye_ul'>"];


    var editor_id = "editor_" + YE.id + "_" + timestamp;

    // 绘制左侧文章列表
    if (!opt.articlelist) {
      var articlelist = this.articlelist.render();
      ye_section_left.push(articlelist);
    }

    // 绘制右侧文章标题
    if (!opt.title) {
      var title = this.title.render();
      ye_section_right.push(title);
    }

    // 绘制右侧文章摘要
    if (!opt.summary) {
      var summary = this.summary.render();
      ye_section_right.push(summary);
    }

    // 绘制右侧封面上传
    if (!opt.cover) {
      var cover = this.cover.render(editor_id);
      ye_section_right.push(cover);
    }

    // 绘制右侧编辑器容器
    var editor = this.editor.render(editor_id);
    ye_section_right.push(editor);

      // 绘制右侧预览区域
    if (!opt.opencomment) {
      var opencomment = this.opencomment.render();
      ye_section_right.push(opencomment);
    }

    // 绘制右侧打赏区域
    if (!opt.donate) {
      var donate = this.donate.render();
      ye_section_right.push(donate);
    }

    // 左侧部分绘制完成
    ye_section_right.push("</ul></div>");
    ye_section_right = ye_section_right.join("");

    // 右侧部分绘制完成
    ye_section_left.push("</div>");
    ye_section_left = ye_section_left.join("");


    ye_box_editarea.push(ye_section_left);
    ye_box_editarea.push(ye_section_right);
    ye_box_editarea.push("</div>");
    ye_box_editarea = ye_box_editarea.join("");

    container.push(ye_box_editarea);
    container.push("</div>");
    container = container.join("");

    YE.$container.append($(container));

    return editor_id;
  },
  restyle: function(){}
};
