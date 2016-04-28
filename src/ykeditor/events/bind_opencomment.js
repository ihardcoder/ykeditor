/**
 * @desc 评论开关操作的一系列事件绑
 */
YKEditor.prototype.bind_opencomment = function() {
	var _this = this;
	if (_this.data.open_comment === "1") {
		_this.$opencomment[0].checked = true;
	}

	function onCheck() {
		if (_this.$opencomment[0].checked) {
			_this.data.open_comment = "1";
		} else {
			_this.data.open_comment = "0";
		}
		_this.autosave.call(_this);
	}
	_this.$opencomment.on("click", onCheck);
};
