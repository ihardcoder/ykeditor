/**
 * @desc 绑定发布事件
 */
YE.Bind.publish = function() {
  var _this = this;
  // 检查打赏内容是否符合规范
  var getDonateId = function() {
    YE.Dialog.cover();
    for (var o in _this.instances) {
      if (o !== "count") {
        _this.instances[o].Ajax.getDonateId.call(_this.instances[o]);
      }
    }
  };
  // 检查是否可发布
  var checkPublish = function() {
    if (_this.limitStatus.publish_limit === 0) {
      _this.$publish_status.parent().addClass("ye_status_publish-error");
      return;
    }
    var isAbleToPublish = false;
    for (var o in _this.instances) {
      if (o !== "count") {
        isAbleToPublish = _this.instances[o].checkAbleToPost("publish");
        if (!isAbleToPublish) {
          _this.instances[o].showErrors();
          return;
        }
      }
    }
    if (isAbleToPublish) {
      _this.Dialog.confirm("发布后将无法修改，确认发布么？", function() {
        if (!_this.limitStatus.enableDonate) {
          onPublish();
        } else {
          getDonateId();
        }
      });
    }
  };
  // 过滤站外资源并储存过滤后的每篇文章
  var onPublish = function() {
    for (var o in _this.instances) {
      if (o !== "count") {
        var formated = _this.Util.formatLinks.call(_this.instances[o]);
        if (formated) {
          _this.instances[o].ueditor.setContent(_this.instances[o].data.content);
        }
        if (_this.instances[o].active) {
          _this.instances[o].Ajax.sendArticle.call(_this.instances[o],
            "publish");
        }
      }
    }
  };
  // 预览
  var onPreview = function() {
    var self;
    for (var o in _this.instances) {
      if (o !== "count") {
        if (_this.instances[o].active) {
          self = _this.instances[o];
          break;
        }
      }
    }
    var isAbleToPreview = self.checkAbleToPost("preview");
    if (isAbleToPreview) {
      var formated = YE.Util.formatLinks.call(self);
      if (formated) {
        YE.Dialog.confirm("站外链接将被过滤，是否继续？", function() {
          self.ueditor.setContent(self.data.content);
          self.Ajax.sendArticle.call(self, "preview");
        });
      } else {
        self.Ajax.sendArticle.call(self, "preview");
      }
    } else {
      self.showErrors();
    }
  };
  // 手动保存
  var onSave = function() {
    for (var o in _this.instances) {
      if (o !== "count") {
        if (_this.instances[o].active) {
          _this.instances[o].autosave("manual");
          break;
        }
      }
    }
  };

  _this.$publish_btn.on("click", checkPublish);
  _this.$publish_btn.on("publish", onPublish);
  _this.$publish_preview.on("click", onPreview);
  _this.$publish_save.on("click", onSave);
};
