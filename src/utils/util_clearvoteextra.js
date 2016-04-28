/**
 * @desc 清除投票控件
 */
YE.Util.clearVoteExtra = function(str) {
	var result = "";
	var $str = $("<div>" + str + "</div>");
	$str.find(".yevote_box").html("");
	result = $str.html();
	return result;
};
