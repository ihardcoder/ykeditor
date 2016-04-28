/**
 * @memeberof YE.Ajax
 * @desc 获取每次发布的文章篇数限制，目前限制每次发布只限一篇文章
 * @todo 如果后续接触限制需在此函数内添加ajax请求
 */
YE.Ajax.getArticleLimit = function() {
	var _this = this;
	_this.updateArticleLimit();
};
