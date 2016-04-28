/**
 * @desc 编辑器插件-语音库
 */
YE.Plugins.audio = function() {
  if (YE.limitStatus.enableInsertAudio) {
    var win_audio = {
      // 获取语音库列表
      URL_AJAX_GET_AUDIOS: YE.URL_AJAX_GET_AUDIOS,
      // 删除单条语音
      URL_AJAX_DEL_AUDIO: YE.URL_AJAX_DEL_AUDIO,
      // 编辑单条语音
      URL_AJAX_EDIT_AUDIO_TITLE: YE.URL_AJAX_EDIT_AUDIO_TITLE,
      // 上传语音
      URL_AJAX_UPLOAD_AUDIO: YE.URL_AJAX_UPLOAD_AUDIO,

      // 单个音频文件不能超过30M
      MAX_AUDIO_SIZE: 1024 * 1024 * 30,

      enableLockCLose: false,

      ueditor: null,

      init: function() {
        this.bind();
        soundManager.setup({
          url: "/u/js/ykeditor/libs/soundmanager/swf",
          flashVerson: 9,
          preferFlash: false,
          onready: function() {},
          ontimeout: function() {}
        });
      },

      charge: function(editor) {
        this.ueditor = editor;
        this.getAudios();
      },

      bind: function() {
        var _this = this;
        $(document).on("click", function() {
          // 点击标题编辑区以外的区域触发标题验证保存
          _this.editTitle();
        }).on("refresh", "#qWindowBox_yeaudio", function() {
          _this.getAudios();
        }).on("click", "#qWindowBox_yeaudio .yeaudio_box_body_item",
          function() {
            // 选定状态
            _this.editTitle();
            if ($(this).hasClass("yeaudio_box_body_item-uploading") ||
              $(this).hasClass("yeaudio_box_body_item-invalid") || $(
                this).hasClass("yeaudio_box_body_item-error") || $(this)
                .hasClass("yeaudio_box_body_item-chosen")) {
              return;
            }
            $("#qWindowBox_yeaudio .yeaudio_box_body_item").removeClass(
              "yeaudio_box_body_item-chosen");
            $(
              "#qWindowBox_yeaudio .yeaudio_box_body_item .yeaudio_item_radio"
            ).attr("checked", false);
            $(this).addClass("yeaudio_box_body_item-chosen");
            $(this).find('.yeaudio_item_radio')[0].checked = true;
            _this.enableInsertBtn();
          }).on("click", "#qWindowBox_yeaudio .act_editaudio", function(
          e) {
          // 编辑标题
          if (YE.lock.uploadAudio) {
            // 锁定状态不允许上传
            _this.showBlockAlert();
            return;
          }
          var ev = e || window.event;
          if (ev && ev.stopPropagation) {
            ev.stopPropagation();
          } else {
            ev.cancelBubble = true;
          }
          var id = $(this).parents('.yeaudio_box_body_item').attr(
            "audioid");
          if (!id) {
            return;
          }
          var $titlearea = $(this).parents('.yeaudio_box_body_item').find(
            ".yeaudio_item_title");
          var $title = $titlearea.find(".audiotitle");
          var originTitle = $title.html();
          if ($(this).hasClass('act_editaudio-active')) {
            var newTitle = $titlearea.find(".edit_textarea").val();
            if (newTitle.length === 0) {
              alert("请输入标题");
              return;
            } else if (newTitle.length > 14) {
              alert("标题字数超出限制");
              return;
            }
            $(this).removeClass("act_editaudio-active");
            $titlearea.removeClass("yeaudio_item_title-active");

            if (newTitle === originTitle) {
              return;
            }
            $title.html(newTitle);
            _this.editAudio(id, newTitle);
          } else {
            $(this).addClass("act_editaudio-active");
            $titlearea.addClass("yeaudio_item_title-active");
          }
        }).on("click", "#qWindowBox_yeaudio .audiotitle_editarea",
          function(e) {
            // 标题编辑区拦截click冒泡
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
          }).on("keyup blur change paste input",
          "#qWindowBox_yeaudio .edit_textarea",
          function(e) {
            // 编辑标题选框
            var _title = $.trim($(this).val());
            var _count = _title.length;
            var $countDom = $(this).siblings('.edit_num');
            $countDom.html(_count + "/14");
            if (_count > 14 || _count === 0) {
              $(this).addClass("ye_input-error");
              $countDom.addClass('edit_num-error');
            } else {
              $(this).removeClass("ye_input-error");
              $countDom.removeClass('edit_num-error');
            }
          }).on("click", "#qWindowBox_yeaudio .act_delaudio", function(
          e) {
          // 删除单条语音
          var ev = e || window.event;
          if (ev && ev.stopPropagation) {
            ev.stopPropagation();
          } else {
            ev.cancelBubble = true;
          }
          _this.editTitle();
          if (YE.lock.uploadAudio) {
            // 锁定状态不允许上传
            _this.showBlockAlert();
            return;
          }
          var $audioItem = $(this).parents('.yeaudio_box_body_item');
          if ($audioItem.hasClass('yeaudio_box_body_item-error')) {
            // 错误/屏蔽条目直接删除dom并刷新语音库
            $audioItem.remove();
            _this.getAudios();
          } else {
            var id = $(this).parents('.yeaudio_box_body_item').attr(
              "audioid");
            if (!id) {
              return;
            }
            try{
              soundManager.stop(id);
            }catch(ex){}
            $audioItem.remove();
            _this.delAudio(id);
          }
        }).on("click", "#qWindowBox_yeaudio .yeaudio_error_act",
          function(e) {
            // 请求出错，重新请求
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            _this.getAudios();
          }).on("change", "#qWindowBox_yeaudio .yeaudio_upload_file",
          function(e) {
            // 上传文件
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            _this.editTitle();
            // 加锁key只保证绑定一次事件
            if (!_this.enableLockCLose) {
              var closeBtn = $(this).parents(".ye_winbox").find(
                '.ye_winclose')[0];
              var fn = closeBtn.onclick;
              closeBtn.onclick = function() {
                // 上传过程中拦截弹层关闭行为
                if (YE.lock.uploadAudio) {
                  win_audio.showBlockAlert();
                  return;
                }
                if (fn) {
                  fn();
                }
              };
              YE.enableLockCLose = true;
            }
            if (YE.lock.uploadAudio) {
              // 锁定状态不允许上传
              _this.showBlockAlert();
              return;
            }

            var file = $(this).val();
            if (file === "") {
              return;
            }
            var isTypeValid = _this.checkAudioType(file);
            var isSizeValid = _this.checkAudioSize(this);
            if (!isTypeValid) {
              alert("文件格式错误");
            } else if (!isSizeValid) {
              alert("文件尺寸超出限制");
            } else {
              // 加锁
              YE.lock.uploadAudio = true;
              var _title = file.split('fakepath\\')[1] || file;
              var _timestamp = YE.Util.getTimestamp();
              var _action = YE.URL_AJAX_UPLOAD_AUDIO +
                "?callback=parent.YE.Handler.afterUploadAudio&uploadtime=" +
                _timestamp;
              var $uploadingBox = $(_this.uploadingBox(_title,
                _timestamp));
              var $container = $(
                "#qWindowBox_yeaudio .yeaudio_container");
              var $box = $container.find(".yeaudio_box");
              // 若语音库为空，则创建空列表
              if ($box.length === 0) {
                $container.html("");
                $box = $([
                  '<div class="yeaudio_box">',
                  '<ul class="yeaudio_box_head clearfix">',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_title">语音标题</li>',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_duration">时长</li>',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_uploaddate">上传日期</li>',
                  '<li class="yeaudio_box_head_item yeaudio_box_head_item_act">操作</li>',
                  '</ul>',
                  '<ul class="yeaudio_box_body clearfix">',
                  '</ul>',
                  '</div>'
                ].join("")).appendTo($container);
              }
              $box.find(".yeaudio_box_body").prepend($uploadingBox);
              // 提交表单
              $("#yeaudio_upload_form").attr("action", _action).submit();
              setTimeout(function() {
                $uploadingBox.find(".progressbar_status").css(
                  "width", "95%");
              }, 0);

              // 添加响应标识监测
              YE.res_status.uploadGE = false;
              // 五分钟超时错误并解锁上传限制
              var timer = setTimeout(function() {
                if (YE.res_status.uploadGE) {
                  clearTimeout(timer);
                } else {
                  YE.res_status.uploadGE = true;
                  YE.lock.uploadAudio = false;
                  _this.showErrorItem($uploadingBox);
                }
              }, 300000);
            }
          }).on("click", "#qWindowBox_yeaudio .qPager_audio a",
          function() {
            // 翻页
            _this.editTitle();
            if (YE.lock.uploadAudio) {
              // 锁定状态不允许上传
              _this.showBlockAlert();
              return;
            }
            var _page = $(this).attr("_page");
            if (!_page) {
              return;
            }
            _this.getAudios(_page);
          }).on("click",
          "#qWindowBox_yeaudio .qWindowBox_yeaudio_act_btn",
          function(e) {
            // 点击完成按钮写入正文
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            _this.editTitle();

            if (YE.lock.uploadAudio) {
              // 锁定状态不允许上传
              _this.showBlockAlert();
              return;
            }
            if ($(this).hasClass("ye_btn-disable")) {
              return;
            }
            var chosenId = $(
              "#qWindowBox_yeaudio .yeaudio_box_body_item-chosen").attr(
              'audioid');
            var chosenTitle = $(
              "#qWindowBox_yeaudio .yeaudio_box_body_item-chosen").find(
              ".audiotitle").html();
            if (chosenId) {
              _this.insertAudio(chosenId, chosenTitle);
            }
          }).on("click",
          "#qWindowBox_yeaudio .yeaudio_item_title .audioimg",
          function(e) {
            // 试听
            _this.editTitle();
            var ev = e || window.event;
            if (ev && ev.stopPropagation) {
              ev.stopPropagation();
            } else {
              ev.cancelBubble = true;
            }
            if ($(this).hasClass("audioimg-playing")) {
              $(this).removeClass("audioimg-playing");
              soundManager.pauseAll();
            } else {
              $("#qWindowBox_yeaudio .yeaudio_item_title .audioimg").removeClass(
                "audioimg-playing");
              $(this).addClass('audioimg-playing');
              var $item = $(this).parents(".yeaudio_box_body_item");
              var sURL = $item.attr("audiourl"),sId=$item.attr('audioid');
              soundManager.pauseAll();

              soundManager.createSound({
                id: sId,
                url: sURL
              }).play();
            }
          });
      },

      showLoading: function() {
        YE.Dialog.audio("loading");
      },

      // 上传期间锁定所有操作
      showBlockAlert: function() {
        alert("请等待上传完毕");
      },

      editTitle: function() {
        var _this = this;
        var $act = $("#qWindowBox_yeaudio .act_editaudio-active");
        if ($act.length !== 0) {
          $.each($act, function(i, v) {
            var $titlearea = $(v).parents('.yeaudio_box_body_item').find(
              ".yeaudio_item_title");
            var $title = $titlearea.find(".audiotitle");
            var newTitle = $titlearea.find(".edit_textarea").val();
            if (newTitle.length !== 0 && newTitle.length <= 14 &&
              newTitle !== $title.html()) {
              var id = $(v).parents('.yeaudio_box_body_item').attr(
                "audioid");
              $title.html(newTitle);
              _this.editAudio(id, newTitle);
            }
            $(v).removeClass("act_editaudio-active");
            $titlearea.removeClass("yeaudio_item_title-active");
          });
        }
      },

      getAudios: function(page, pagesize) {
        var _this = this;
        var _page = page || "1",
          _pagesize = pagesize || "4";
        _this.showLoading();
        $.ajax({
          url: _this.URL_AJAX_GET_AUDIOS,
          type: "get",
          timeout: 5000,
          dataType: "jsonp",
          data: {
            "page": _page,
            "pagesize": _pagesize
          },
          success: function(res) {
            if (!res || res.code !== "100") {
              YE.Dialog.audio("error");
              return;
            }
            if (res.total === 0) {
              YE.Dialog.audio("empty");
            } else {
              var content = res.data;
              YE.Dialog.audio("content", content);
            }
          },
          error: function() {
            YE.Dialog.audio("error");
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.audio("error");
            }
          }
        });
      },
      // 删除单条语音
      delAudio: function(audioId) {
        if (!audioId) {
          return;
        }
        var _this = this;
        $.ajax({
          url: _this.URL_AJAX_DEL_AUDIO,
          type: "get",
          timeout: 3000,
          data: {
            audioid: audioId
          },
          success: function(res) {
            if (!res) {
              YE.Dialog.audio("error");
              return;
            }
            var _res = JSON.parse(res);
            if (_res.code !== "100") {
              YE.Dialog.audio("error");
              return;
            }
            _this.getAudios();
          },
          error: function(res) {
            YE.Dialog.audio("error");
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.audio("error");
            }
          }
        });
      },
      // 编辑标题
      editAudio: function(audioId, title) {
        if (!audioId) {
          return;
        }
        var _this = this;
        $.ajax({
          url: _this.URL_AJAX_EDIT_AUDIO_TITLE,
          type: "get",
          timeout: 3000,
          data: {
            audioid: audioId,
            title: title
          },
          success: function(res) {
            if (!res) {
              YE.Dialog.audio("error");
              return;
            }
            var _res = JSON.parse(res);
            if (_res.code !== "100") {
              YE.Dialog.audio("error");
              return;
            }
          },
          error: function(res) {
            YE.Dialog.audio("error");
          },
          complete: function(xhr, status) {
            if (status === "timeout") {
              YE.Dialog.audio("error");
            }
          }
        });
      },
      // 写入正文
      insertAudio: function(audioId, audioTitle) {
        if (!audioId) {
          return;
        }
        var _this = this;
        var html = _this.fakeAudioBox(audioId, audioTitle);
        // 【important】以下两条语句的顺序不得调换
        _this.ueditor.execCommand("insertparagraph");
        _this.ueditor.execCommand("inserthtml", html);

        YE.dialog_audio.hide();
      },
      // 正文语音容器结构
      fakeAudioBox: function(audioId, audioTitle) {
        if (!audioId) {
          return;
        }
        var html = "<div class='yeaudio_box' audioid='[yk_audioId]" +
          audioId +
          "[\\yk_audioId]'><div contenteditable='false'><div class='yeaudio_box_cover' onclick='return false;' contenteditable=false enable=false></div>" +
          audioTitle + "</div></div>";
        return html;
      },
      // 上传语音loading提示item
      uploadingBox: function(title, stamp) {
        var html = [
          '<li class="yeaudio_box_body_item yeaudio_box_body_item-uploading" id="yeaudio_box_body_item-uploading-' +
          stamp + '">',
          '<input type="radio" class="yeaudio_item yeaudio_item_radio">',
          '<div class="yeaudio_item yeaudio_item_title">',
          '<div class="audiocover audiocover-uploading">上传中</div>',
          '<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">',
          '<p class="audiotitle">' + title + '</p>',
          '<div class="progressbar">',
          '<div class="progressbar_status"></div>',
          '</div>',
          '</div>',
          '<div class="yeaudio_item yeaudio_item_duration">--:--</div>',
          '<div class="yeaudio_item yeaudio_item_uploaddate">0000-00-00</div>',
          '<ul class="yeaudio_item yeaudio_item_act">',
          '<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>',
          '<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio-disable"></i></li>',
          '</ul>',
          '</li>'
        ].join("");
        return html;
      },
      showErrorItem: function(jqObj) {
        jqObj.removeClass("yeaudio_box_body_item-uploading").addClass(
          "yeaudio_box_body_item-error").find(".audiocover").removeClass(
          'audiocover-uploading').addClass('audiocover-error').html(
          "出错");
      },
      // 检查格式
      checkAudioType: function(file) {
        var filename = file;
        // 校验校验扩展名
        var extname = /\.[^\.]+$/.exec(filename)[0];
        extname = extname.toLowerCase();

        if (extname != '.mp3' && extname != '.wma' && extname != '.wav' &&
          extname != '.amr') {
          return false;
        }
        return true;
      },
      // 检查文件大小
      checkAudioSize: function(file) {
        var _this = this;
        var size = 0;
        size = (file.files && (file.files[0].size || file.files[0].fileSize)) ||
          (function() {
            try {
              var img = new Image();
              img.dynsrc = file.value;
              return img.fileSize;
            } catch (e) {
              return 0;
            }
          })();
        if (size > _this.MAX_AUDIO_SIZE) {
          return false;
        }
        return true;
      },
      // 激活完成按钮
      enableInsertBtn: function() {
        $("#qWindowBox_yeaudio .qWindowBox_yeaudio_act_btn").removeClass(
          "ye_btn-disable");
      },
      // 禁用完成按钮
      disableInsertBtn: function() {
        $("#qWindowBox_yeaudio .qWindowBox_yeaudio_act_btn").addClass(
          "ye_btn-disable");
      }
    };

    win_audio.init();

    UE.registerUI('yeaudio', function(editor, uiname) {
      var btn = new UE.ui.Button({
        name: uiname,
        title: "添加语音",
        label: "添加语音",
        onclick: function() {
          // 激活
          win_audio.charge(editor);
        }
      });
      return btn;
    }, 4);
  }
};
