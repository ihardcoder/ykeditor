/**
 * @desc 编辑器插件-图片库
 */
YE.Plugins.image = function() {
  UE.registerUI('yeimage', function(editor, uiname) {
    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加图片",
      label: "添加图片",
      onclick: function() {
        YE.Ajax.getGallery("editor");
      }
    });
    return btn;
  }, 1);
};
