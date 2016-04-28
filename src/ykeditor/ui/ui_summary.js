/**
 * @desc UI-摘要区
 */
YKEditor.prototype.UI.summary = {
	render: function() {
		var html = "";
		html += "<li class='ye_li ye_box ye_box_summary'>";
		html += "<div class='ye_head ye_head_summary'>推荐理由";
		html += "<span class='ye_subtitle colorGrey ml8'>好的推荐理由可以带来更多的观看</span>";
		html += "</div>";
		html += "<div class='ye_body ye_body_summary'>";
		html += "<div class='ye_area_num_count'>0/40</div>";
		html +=
			"<textarea type='text' class='ye_input ye_input_area ye_input_area_summary'></textarea>";
		html += "</div>";
		html += "<div class='ye_error' >推荐理由不能超过40字</div>";
		html += "</li>";

		return html;
	}

};
