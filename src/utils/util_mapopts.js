/**
 * @desc 将ykeditor定义的参数映射为UEditor参数，名称对应参照{@link YE.options}对象
 * @param {object} opt - 原始配置参数
 * @see {@link YE.options}
 */
YE.Util.mapOpts = function(opt) {
  if (!opt || Object.prototype.toString.call(opt) !== "[object Object]") {
    return;
  }
  var reference = YE.options;
  var result = {};
  for (var o in opt) {
    result[reference[o]] = opt[o];
  }

  return result;
};
