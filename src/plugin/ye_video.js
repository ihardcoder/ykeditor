/**
 * @desc 编辑器插件-添加视频
 */
YE.Plugins.video = function() {
  UE.registerUI('yevideo', function(editor, uiname) {

    var dialog = {
      layer: null,
      $layer_dom: null,
      all_video_url: YE.config.domain + YE.URL_AJAX_GET_VIDEO +
        "?tab=all_video",
      fav_video_url: YE.config.domain + YE.URL_AJAX_GET_VIDEO +
        "?tab=fav_video",
      other_video_url: YE.config.domain + YE.URL_AJAX_GET_VIDEO_BY_URL,
      isbinded: false,
      isbinded_other: false, // 视频其他页
      pagename: 'video', // 当前页面名称 . video || other
      other_video_id: null,
      init: function() {
        var _this = this;
        this.createlayer();
        this.setQWmain(_this.all_video_url);
        this.$layer_dom = $(this.layer.dom.winbox);
      },
      bind: function() {
        var _this = this;
        this.$layer_dom.bind('click', function(e) {
          _this.pageview(e);
        }).on("click", ".yevideo_item", function(e) {
          if ($(this).hasClass("yevideo_item-focused")) {
            return;
          } else {
            _this.$layer_dom.find(".yevideo_item").removeClass(
              "yevideo_item-focused");
            _this.$layer_dom.find(
              ".yevideo_item input[type=radio]").attr("checked",
              false);
            $(this).addClass("yevideo_item-focused");
            $(this).find("input[type=radio]")[0].checked = true;
            _this.$layer_dom.find(".item-control .ye_btn").removeClass(
              'ye_btn-disable');
          }
        });
        this.isbinded = true;
      },
      bindOtherView: function() {
        var _this = this;
        _this.$layer_dom.find(".item-control .ye_btn").addClass(
          'ye_btn-disable');
        this.$layer_dom.bind('click', function(e) {
          _this.PageOtherView(e);
        });
        this.isbinded_other = true;
      },
      pageview: function(e) {
        var $target = $(e.target);
        var _this = this;
        if ($target.attr("id") === "fav_video" && !$target.hasClass(
            "select")) {
          this.setQWmain(_this.fav_video_url);
          return;
        }
        if ($target.attr("id") === "all_video" && !$target.hasClass(
            "select")) {
          this.setQWmain(_this.all_video_url);
          return;
        }
        // 点到其他视频
        if ($target.attr("id") === "otherVideo" && !$target.hasClass(
            "select")) {
          this.setQWmain(_this.other_video_url);
          return;
        }
        // 点击到了分页
        if ($target.attr("pageurl") && $target.attr("pageurl").length !==
          0) {
          var pageurl = $target.attr("pageurl");
          this.setQWmain(pageurl);
        }
        // 点击到了完成
        if ($target.hasClass("form_btn_text") && $target.html() ===
          '完成' && this.pagename === 'video') {
          // 获取选中视频
          this.insertFlash();
        }
      },
      PageOtherView: function(e) {
        var target = Element.extend(Event.element(e));
        var _this = this;
        // 点击到视频
        if (target.getAttribute("id") == "select_video" && !target.hasClassName(
            "select")) {
          this.setQWmain(_this.all_video_url);
          return;
        }
        // 点击到了完成
        if (target.hasClassName("form_btn_text") && target.innerHTML ==
          '完成' && this.pagename == 'other') {
          // 获取选中视频
          if (!this.other_video_id) {
            $('#video_img').hide();
            $('#video_title').hide();
            $('#item-noResult').show();
            return;
          }
          this.insertFlash_other(this.other_video_id);
        }
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
      createlayer: function() {
        if (this.layer === null) {
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
            }
          });
        }
      },
      insertFlash: function() {
        var $radio = this.$layer_dom.find(
          'input[type="radio"][name="video"]:checked');
        if (!$radio || $radio.length === 0) {
          alert('请选择视频');
          return;
        }
        var video_id = $radio.attr("encode_id");
        this.insertFlash_other(video_id);
      },
      insertFlash_other: function(video_id) {
        if (!video_id) {
          alert('视频选择有误！');
          return;
        }
        this.hidelayer();
        var src = 'http://player.youku.com/player.php/sid/' +
          video_id + '/v.swf';
        var html = '<embed  id="[ye_video_start]' + video_id +
          '[ye_video_end]" src="' + src +
          '" wmode="transparent" allowFullScreen="true" quality="high" width="100%" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash">';
        editor.execCommand("inserthtml", html);
        // 插入一个空白段落实现光标换行
        editor.execCommand('insertparagraph');
      },
      setLoading: function() {
        if (!this.layer) {
          this.createlayer();
        }
        var html = [
          '<div class="qWindowBox">',
          '<div class="loadingBox">',
          '<div class="loading"><img src="' + YE.config.domain +
          '/u/img/pushdy/loading_64.gif"></div>',
          '</div>',
          '</div>',
        ].join("");
        this.layer.setContent('html', html);
        this.showlayer();
      },
      setQWmain: function(url) {
        var html = "";
        var _this = this;
        _this.setLoading();
        $.ajax({
          url: url,
          type: "post",
          dataType: 'jsonp',
          timeout: 3000, //3s超时
          error: function() {
            _this.layer.hide();
            YE.Dialog.error('请求失败！');
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.error('请求超时！');
            } else if (!_this.isRes) {
              _this.layer.hide();
              YE.Dialog.error('网络故障！');
            }
          },
          success: function(res) {
            _this.isRes = true;
            if (res.code !== "100") {
              return;
            }
            if (url === _this.other_video_url) {
              _this.pagename = 'other';
            } else {
              _this.pagename = 'video';
            }
            _this.layer.setContent('html',
              '<div class="qWindowBox" id = "qWindowBox_yevideo"><div class="qWindowBox_yevideo_head">添加视频</div><div class="qWindowBox_yevideo_body">' +
              res.data + '</div></div>');
            // 内容获取后，开始绑定
            if (_this.pagename === 'video' && _this.isbinded ===
              false) {
              _this.bind();
            } else if (_this.pagename == 'other') {
              // 输入视频网址后
              $('#search_video').on('blur', function(e) {
                var video_url = $('#search_video').val();
                var params = {};
                params = {
                  'type': 'push_subscribe',
                  'act': 'getVideoByUrl',
                  'video_url': video_url
                };
                $.ajax({
                  url: YE.config.domain + '/u/',
                  type: "get",
                  data: params,
                  success: function(res) {
                    var data = JSON.parse(res);
                    _this.other_video_id = data.encode_id;
                    if (!_this.other_video_id || data ===
                      null || data < 0) {
                      $('#item-other').hide();
                      $('#item-noResult').show();
                    } else {
                      $('#video_img').html(
                        '<img src="' + data.thumburl_v2 +
                        '">');
                      $('#video_title').html(data.title);
                      $('#item-noResult').hide();
                      $('#item-other').show();
                      _this.$layer_dom.find(
                        ".item-control .ye_btn").removeClass(
                        'ye_btn-disable');
                    }
                  }
                });

              });
              if (_this.isbinded_other === false) {
                _this.bindOtherView();
              }
            }
          }
        });

        this.showlayer();

      }
    };

    var btn = new UE.ui.Button({
      name: uiname,
      title: "添加视频",
      label: "添加视频",
      onclick: function() {
        var id = $(this.getDom()).parents('.ye_body_editor').attr(
          "id").split("_")[2];
        dialog.init(id);
      }
    });
    return btn;
  }, 0);
};
