/**
 * @desc 编辑器插件-投票
 */
YE.Plugins.vote = function() {
  UE.registerUI('yevote', function(editor, uiname) {
    var _class = "",
      _mpid = "";
    var $votebox = $("<div id='ye_votebox' style='display:none'></div>").appendTo(
      $(document.body));

    // 投票预览节点生成完毕后会触发
    $(window).on("voteinitial", function() {
      var html = "<div class='yevote_box' voteid='" + _mpid +
        "'><div  contenteditable='false'><div class='yevote_box_cover' onclick='return false;' contentEditable='false' enable='false'></div>" +
        $votebox.html() + "</div></div>";
      // 【important】以下两条语句的顺序不得调换
      editor.execCommand("insertparagraph");
      editor.execCommand('inserthtml', html);
      $votebox.html("");
      try {
        YE.dialog_cover.hide();
      } catch (e) {}
    }).on("getpluginfail", function() {
      try {
        YE.dialog_cover.hide();
        YE.Dialog.error("操作失败，请重试");
      } catch (e) {}
    });

    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加投票",
      label: "添加投票",
      onclick: function() {
        var u_id = get_username('all').userid;
        window.pluginPanel.launchVotePanel({
          callback: function(mpid) {
            YE.Dialog.cover();
            _class = "YK_interact_plugins_container_" + mpid +
              "_0_2_3_4";
            _mpid = mpid;
            var $box = $("." + _class);
            if ($box.length === 0) {
              $box = $("<div></div>").addClass(_class);
              $votebox.append($box);
            }
            window.pluginFrontEnd.createPlugin($box[0]);
          },
          create_id: u_id,
          //创建来源
          create_source: 3,
          // 创建投票投放的设备类型
          device: 5
        });
      }
    });
    return btn;
  }, 3);
};
