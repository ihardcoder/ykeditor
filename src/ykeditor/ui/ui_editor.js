/**
 * @desc UI-编辑器正文区
 */
YKEditor.prototype.UI.editor = {
  render: function(id) {
    var html = "";
    html += "<li class='ye_li ye_box ye_box_editor'>";
    html += "<div class='ye_editor' style = 'width:100%;'>";
    html += "<div class='ye_head ye_head_editor'>正文";
    html +=
      "<span class='ye_subtitle colorGrey ml8 ye_subtitle_autosave'>已自动保存</span>";
    html += "</div>";
    html += "<div class='ye_body ye_body_editor' id='" + id +
      "' style='width:100%;'></div>";
    html += "<div class='ye_error c_red'>请填写正文</div>";
    html += "</div>";
    html += "</li>";
    return html;
  },
  // ueditor容器尺寸修正
  restoreSize: function(id) {
    if (!id || !YE.REG_CHAR.test(id)) {
      return;
    }
    var $editor = $("#" + id);
    var width = $editor.width();
    var height = YE.opt.height || YE.config.editor.height;
    $editor.width(width - 2);
    $editor.height(height);
  },
  // 定制自定义工具栏样式
  restyle: function() {
    var $editor = this.$editor_ue;
    var $toolbar = this.$editor_toolbar;
    var $toolbar_gain = $('.edui-for-yeimage').parent('.edui-toolbar');
    var $toolbar_init = $('.edui-for-fontsize').parent('.edui-toolbar');
    $editor.addClass("ye_editor_ue");
    $toolbar.addClass('ye_editor_toolbar');
    $toolbar_gain.css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: '7px 0 0 3px',
      boxSizing: 'border-box',
      borderBottom: 'solid 1px #fff',
      height: '40px'
    });
    $toolbar_init.css({
      position: 'absolute',
      top: '40px',
      left: '5px',
      height: '30px',
      boxSizing: 'border-box',
      paddingTop: '4px'
    });
  },
  // 工具栏fix实现
  doFixToolbar: function() {
    var _this = this;

    var isHeaderFixed = YE.opt.ISHEADERFIXED,
      headerH = YE.opt.HEIGHT_HEADER;
    var $editor = this.$editor_ue;
    var $toolbar = this.$editor_toolbar;
    var _win = _this.$editor_iframe[0].contentWindow;
    var _offset = $editor.offset();
    var toolbar_h, editor_h,
      statusbar_h = 0;

    function doFix(e) {
      var _top;
      var _docTop = (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop,
        _docLeft = (document.documentElement && document.documentElement.scrollLeft) ||
        document.body.scrollLeft;
      var _containerWidth = $editor.css('width').split('px')[0];
      editor_h = parseInt($editor.css('height').split('px')[0]) + 2;
      _offset = $editor.offset();
      toolbar_h = parseInt($toolbar.css('height').split('px')[0]);

      var _bottom = _offset.top + editor_h - statusbar_h - toolbar_h;

      if (isHeaderFixed) {
        if (_docTop + headerH > _bottom) {
          _top = _bottom - _docTop;
        } else {
          _top = headerH;
        }
        _docTop += headerH;
      }

      if (_docTop > _offset.top) {
        $toolbar.css({
          position: 'fixed',
          border: '1px solid #CCCCCC',
          width: _containerWidth - 10 + "px",
          top: _top + 'px',
          left: _offset.left - _docLeft + "px",
          zIndex: 1000
        });
      } else {
        $toolbar.css({
          position: 'static',
          border: 'none',
          width: 'auto',
          borderBottom: '1px solid #CCCCCC'
        });
      }
    }
    doFix();
    $(window).on("scroll resize", doFix);
    $(_win).on("resize", doFix);
  }

};
