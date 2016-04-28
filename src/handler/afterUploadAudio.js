/**
 * @desc 上传语音的回调函数
 * @param {object} data - 响应数据
 */
YE.Handler.afterUploadAudio = function(data) {
  // 上传后解锁
  YE.lock.uploadAudio = false;
  YE.res_status.uploadAudio = true;
  if (!data || data.code !== "100") {
    if (data.uploadtime) {
      var $item = $("#yeaudio_box_body_item-uploading-" + data.uploadtime);
      $item.removeClass("yeaudio_box_body_item-uploading").addClass(
        "yeaudio_box_body_item-error");
      $item.find(".audiocover").removeClass('audiocover-uploading').addClass(
        'audiocover-error').html("出错");
      $item.find(".ye_icon_delaudio-disable").removeClass(
        "ye_icon_delaudio-disable").addClass("ye_icon_delaudio");
    }
    return;
  }
  $('#qWindowBox_yeaudio').trigger("refresh");

};
