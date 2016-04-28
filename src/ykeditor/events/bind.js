/**
 * @desc 事件绑定代理函数
 */
YKEditor.prototype.bind = function() {
	this.bind_articlelist();
	this.bind_title();
	this.bind_summary();
	this.bind_cover();
	this.bind_editor();
	this.bind_opencomment();
	this.bind_donate();
	this.bind_extraFix();
};
