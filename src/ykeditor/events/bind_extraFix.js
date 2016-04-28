/**
 * @desc 解决编辑器内核功能缺陷
 */
YKEditor.prototype.bind_extraFix = function() {
  var _this = this;
  // 修复backspace&delete无法单独删除投票&语音容器bug
  this.ueditor.addListener("keydown", function(type, e) {
    var range, curDom, delDom;
    if (e.keyCode === 8 || e.which === 8) {
      // backspace
      range = this.selection.getRange();
      curDom = range.startContainer;
      // 光标定位至text节点时需要额外处理
      if (curDom.nodeType === 3) {
        var content = curDom.textContent || curDom.data;
        // 解决UTF-8 + BOM引起range定位错误的问题
        if ((content.length !== 1 && range.startOffset !== 1) || (content
            .length === 1 && range.startOffset === 1 && (curDom.parentNode
              .innerHTML !== "<br>" || curDom.parentNode.innerHTML !== ""
            ))) {
          return;
        } else {
          curDom = curDom.parentNode;
        }
      }
      $delDom = $(curDom).prev();
      if ($delDom.hasClass("yeaudio_box") || $delDom.hasClass(
          "yevote_box")) {
        range.selectNode($delDom[0]);
        range.deleteContents();
        return;
      }
    } else if (e.keyCode === 46 || e.which === 46) {
      // delete
      range = this.selection.getRange();
      curDom = range.startContainer;
      if (range.startOffset !== curDom.length) {
        return;
      }
      if (curDom.nodeType === 3) {
        curDom = curDom.parentNode;
      }
      $delDom = $(curDom).next();
      if ($delDom.hasClass("yeaudio_box") || $delDom.hasClass(
          "yevote_box")) {
        range.selectNode($delDom[0]);
        range.deleteContents();
        return;
      }
    }
  });
};
