/**
 * @desc 绑定预览弹层事件
 */
YE.Bind.preview = function() {
	var _this = this;
	$(document).on("click", "#qWindowBox_yepreview .preview_qcode_cover",
		function(e) {
			for (var o in _this.instances) {
				if (o !== "count") {
					if (_this.instances[o].active) {
						_this.instances[o].Ajax.getPreview.call(_this.instances[o]);
						return false;
					}
				}
			}
		});
};
