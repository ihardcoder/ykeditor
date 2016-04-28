/**
 * @desc 规范日期格式
 * @param {object} dateobj - 日期Object
 * @param {string} fmt - 规范化格式
 */
YE.Util.format_date = function(dateobj, fmt) {
  var o = {
    "M+": dateobj.getMonth() + 1, //月份
    "d+": dateobj.getDate(), //日
    "h+": dateobj.getHours(), //小时
    "m+": dateobj.getMinutes(), //分
    "s+": dateobj.getSeconds(), //秒
    "q+": Math.floor((dateobj.getMonth() + 3) / 3), //季度
    "S": dateobj.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (dateobj.getFullYear() + "").substr(4 -
      RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +
        o[k]).substr(("" + o[k]).length)));
  return fmt;
};
