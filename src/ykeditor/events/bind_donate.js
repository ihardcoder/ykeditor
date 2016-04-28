/**
 * @desc 打赏操作的一系列事件绑定
 */
YKEditor.prototype.bind_donate = function() {
  var _this = this;

  function onCheck() {
    if (_this.$donate_checkbox[0].checked) {
      _this.data.open_donate = "1";
      _this.$donate_box.addClass('ye_box_donate-open');
      _this.$donate_input_title.val(_this.data.donateTitle);
      _this.$donate_input_flag.val(_this.data.donateFlag);
      onTitleChange();
      onFlagChange();
    } else {
      _this.data.open_donate = "0";
      _this.$donate_box.removeClass('ye_box_donate-open');
      _this.updateDonateId();
    }
  }

  function onTitleChange() {
    var value = $.trim(_this.$donate_input_title.val());
    var formatedValue = YE.Util.textfilter(value, "script");
    if (formatedValue !== "") {
      _this.$donate_input_title.val(formatedValue);
      value = formatedValue;
    }
    var count = value.length;
    _this.data.donateTitle = value;
    _this.$donate_count_title.html(count + "/" + YE.MAX_COUNT_DONATETITLE);
    if (count > YE.MAX_COUNT_DONATETITLE) {
      _this.status.donateTitle = 2;
      _this.$donate_error_title.html("不能超过" + YE.MAX_COUNT_DONATETITLE + "字")
        .show();
      _this.$donate_input_title.addClass('ye_input-error');
      _this.$donate_count_title.addClass('c_red');
    } else if (count === 0) {
      _this.status.donateTitle = 0;
      _this.$donate_error_title.hide();
      _this.$donate_input_title.removeClass('ye_input-error');
      _this.$donate_count_title.removeClass('c_red');
    } else {
      _this.status.donateTitle = 1;
      _this.$donate_error_title.hide();
      _this.$donate_input_title.removeClass('ye_input-error');
      _this.$donate_count_title.removeClass('c_red');
    }
  }

  function onFlagChange() {
    var value = $.trim(_this.$donate_input_flag.val());
    var formatedValue = YE.Util.textfilter(value, "script");
    if (formatedValue !== "") {
      _this.$donate_input_flag.val(formatedValue);
      value = formatedValue;
    }
    var count = value.length;
    _this.data.donateFlag = value;
    _this.$donate_count_flag.html(count + "/" + YE.MAX_COUNT_DONATEFLAG);
    if (count > YE.MAX_COUNT_DONATEFLAG) {
      _this.status.donateFlag = 2;
      _this.$donate_error_flag.html("不能超过" + YE.MAX_COUNT_DONATEFLAG + "字").show();
      _this.$donate_input_flag.addClass('ye_input-error');
      _this.$donate_count_flag.addClass('c_red');
    } else if (count === 0) {
      _this.status.donateFlag = 0;
      _this.$donate_error_flag.hide();
      _this.$donate_input_flag.removeClass('ye_input-error');
      _this.$donate_count_flag.removeClass('c_red');
    } else {
      _this.status.donateFlag = 1;
      _this.$donate_error_flag.hide();
      _this.$donate_input_flag.removeClass('ye_input-error');
      _this.$donate_count_flag.removeClass('c_red');
    }
  }
  _this.$donate_checkbox.on("click", onCheck);
  _this.$donate_input_title.on("keyup blur change paste input", onTitleChange);
  _this.$donate_input_flag.on("keyup blur change paste input", onFlagChange);

};
