/**
 * @memeberof YE.Ajax
 * @desc 获取草稿数据
 * @todo 考虑到Ajax时间不可预估，草稿数据直接写在模板里，此功能需要后台模板配合
 */
YE.Ajax.loadDraft = function() {
	var _this = this;
	if (typeof draft_article !== "undefined") {
		if (draft_article === null) {
			return;
		}
		YE.data_draft = [];
		YE.data_draft.push(draft_article);
		YE.updateDraft();
		return;
	}
	var _url = YE.config.domain + YE.URL_AJAX_GET_DRAFT;
	$.ajax({
		url: _url,
		type: "post",
		dataType: "jsonp",
		success: function(res) {
			if (!res || res.code !== "100") {
				YE.data_draft = null;
				return;
			}
			YE.data_draft = res.data;
			YE.updateDraft();
		},
		error: function() {
			YE.Util.log.error("获取草稿失败！");
		}
	});
};
