/**
 * @desc 编辑器插件-添加链接
 */
YE.Plugins.link = function() {
  UE.registerUI('yelink', function(editor, uiname) {

    var dialog = {
      REG_URL: /^((http[s]{0,1}:\/\/.+?\.)|((.\w+\.)?))youku\.com\/?.*?/,
      layer: null,
      $layer_dom: null,
      $title: null,
      $title_close: null,
      $title_error: null,
      $url: null,
      $url_close: null,
      $url_error: null,
      checkFlag: true,
      isTitleValid: false,
      isUrlValid: false,
      $add_btn: null,
      binded: false,
      init: function() {
        this.createlayer();
        this.$layer_dom = $(this.layer.dom.winbox);

        this.$title = this.$layer_dom.find('input[name="linktitle"]');
        this.$title_close = this.$layer_dom.find(".act-close-title");
        this.$title_error = this.$layer_dom.find(".linktitle_error");

        this.$url = this.$layer_dom.find('input[name="linkurl"]');
        this.$url_close = this.$layer_dom.find(".act-close-url");
        this.$url_error = this.$layer_dom.find(".linkurl_error");

        this.$add_btn = this.$layer_dom.find('span[_for="add"]');


        this.bindlayer();
        this.showlayer();
      },
      createlayer: function() {
        if (this.layer !== null) {
          return this;
        }
        var _this = this;
        this.layer = new YE.Util.Qwindow({
          size: {
            width: 830,
            height: 590
          },
          posrefer: window,
          showhandle: true,
          showmask: true,
          elements: '',
          maskstyle: {
            'color': '#000',
            'opacity': 0.5
          },
          onhide: function() {
            _this.clearInput();
            _this.hideError();
          }
        });
        var html = [
          '<div class="qWindowBox" id="qWindowBox_yelink">',
          '<div class="qWindowBox_yelink_head">添加链接</div>',
          '<div class="qWindowBox_yelink_body">',
          '<ul class="ye_ul ye_ul_yelink">',
          '<li class="mb30 yelink_item yelink_item_url">',
          '<p class="f_14 mb8">请输入链接地址</p>',
          '<div class="input-control">',
          '<div class="ye_icon ye_icon_close act-close-url" style="display: none;"></div>',
          '<input type="text" class="ye_input" name="linkurl">',
          '</div>',
          '<p class="linkurl_subtag f_12 colorGrey">视频链接被添加后，会以播放器形式出现</p>',
          '<span class="c_red linkurl_error" style="display:none">请输入链接地址</span>',
          '</li>',
          '<li class="mb30 yelink_item yelink_item_title">',
          '<p class="f_14 mb8">请输入链接标题</p>',
          '<div class="input-control">',
          '<div class="ye_icon ye_icon_close act-close-title" style="display: none;"></div>',
          '<input type="text" class="ye_input" name="linktitle">',
          '</div>',
          '<span class="c_red linktitle_error" style="display:none">请输入链接标题</span>',
          '</li>',
          '</ul>',
          '<div class="qWindowBox_yelink_act">',
          '<div class="ye_btn ye_btn_l ye_btnmaj_l ye_btn-disable">',
          '<span class="ye_btn_text" _for="add">完成</span>',
          '</div> ',
          '</div>',
          '</div>',
          '</div>',
        ].join("");
        this.layer.setContent('html', html);
        return this;
      },
      showlayer: function() {
        if (this.layer !== null) {
          this.layer.show();
        }
        return this;
      },
      hidelayer: function() {
        if (this.layer !== null) {
          this.layer.hide();
        }
        return this;
      },
      // 恢复layer为空
      clearlayer: function() {
        if (this.layer === null) {
          return this;
        }
      },
      bindlayer: function() {

        if (this.binded) {
          return;
        }

        this.binded = true;

        if (this.layer === null) {
          return this;
        }
        var _this = this;

        function hidetitle() {
          _this.$title_close.hide();
        }

        function hideurl() {
          _this.$url_close.hide();
        }

        this.$title_close.on('click', function() {
          _this.$title.val("");
          _this.$title_error.show();
        });
        this.$title.on('focus', function() {
          if (!UE.browser.ie) {
            _this.$title_close.show();
          }
        }).on('blur', function() {
          hidetitle();
          if (_this.$title.val() === "") {
            _this.$title_error.show();
          } else {
            _this.$title_error.hide();
            _this.isTitleValid = true;
          }
          _this.checkValid();
        });

        this.$url_close.on('click', function() {
          _this.$url.val("");
          _this.checkUrl();
        });
        this.$url.on('focus', function() {
          if (!UE.browser.ie) {
            _this.$url_close.show();
          }
        }).on('blur', function() {
          hideurl();
          _this.checkUrl();
          _this.checkValid();
        });

        this.$add_btn.on('click', function() {
          _this.insertLink();
        });

      },
      checkValid: function() {
        if (this.isTitleValid && this.isUrlValid) {
          this.$layer_dom.find(".qWindowBox_yelink_act .ye_btn").removeClass(
            'ye_btn-disable');
        } else {
          this.$layer_dom.find(".qWindowBox_yelink_act .ye_btn").addClass(
            'ye_btn-disable');
        }
      },
      clearInput: function() {
        var _this = this;
        _this.$title.val("");
        _this.$url.val("");
      },
      insertLink: function() {
        var ret_title = this.checktitle();
        var ret_url = this.checkUrl();
        if (ret_title === false || ret_url === false) {
          return;
        }

        var href = this.$url.val();
        if (href.indexOf('http://') == -1) {
          href = 'http://' + href;
        }
        var html = '<a href="' + href + '" target="_blank">' + this.$title
          .val() + '</a>';
        editor.execCommand('inserthtml', html);
        this.hidelayer();
        this.clearInput();
      },
      checktitle: function() {
        var titlelink = this.$title.val();
        if (titlelink.length === 0) {
          this.$title_error.html('请输入链接标题').show();
          return false;
        }
        this.$title_error.hide();
        return true;
      },
      checkUrl: function() {
        var urllink = this.$url.val();
        if (urllink.length === 0) {
          this.$url_error.html('请输入链接地址').show();
          return false;
        }
        if (!this.REG_URL.test(urllink)) {
          this.$url_error.html('请输入来自优酷网的链接地址').show();
          return false;
        }
        this.isUrlValid = true;
        this.$url_error.hide();
        return true;
      },
      hideError: function() {
        this.$url_error.hide();
        this.$title_error.hide();
      }
    };
    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加链接",
      label: "添加链接",
      onclick: function() {
        var id = $(this.getDom()).parents('.ye_body_editor').attr(
          "id").split("_")[2];
        dialog.init(id);
      }
    });
    return btn;
  }, 2);
};
