/**
 * @desc 多篇文章切换编辑触发事件
 * @todo 目前暂未开放
 */
YKEditor.prototype.bind_articlelist = function() {
	var _this = this;
	this.$articlelist_box.on("click", ".ye_cover_img .ye_act_editA", function() {
		// 启用编辑时对当前正在编辑的文章触发一次自动保存
		YE.saveActive();
		YE.disableAll();
		_this.enable();
	}).on("click", ".ye_cover_img .ye_act_delA", function() {
		_this.Ajax.deleteArticle.call(_this);
	});
};
