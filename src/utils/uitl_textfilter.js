/**
 * @desc 过滤script标签以防止XSS注入
 * @param {string} value - 待过滤的text
 * @param {string} type - 过滤类型
 */
YE.Util.textfilter = function(value, type) {
	var regScript = /(<(s|S)cript>)|(<\/(s|S)cript>)/g;
	var result = "";
	switch (type) {
		case "script":
			result = value.replace(regScript, "script");
			if (result === value) {
				result = "";
			}
			break;
	}

	return result;
};
