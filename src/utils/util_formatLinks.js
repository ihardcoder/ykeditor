/**
 * @desc 过滤编辑内容中的站外链接
 */
YE.Util.formatLinks = function() {
  var _this = this;
  var content = _this.data.content || "";
  var isInvalidLink = false;
  if (content !== "") {
    var $dom = $("<div>" + content + "</div>");
    var $links = $dom.find("a"),
      // $imgs = $dom.find("img"),
      $iframes = $dom.find("iframe");
    // 链接
    if ($links.length !== 0) {
      $.each($links, function(index, link) {
        var href = $(link).attr("href");
        if (href) {
          // 修复IE自动转换mailto url
          if (UE.browser.ie && YE.REG_LINK_MAIL.test(href)) {
            isInvalidLink = true;
            $(link).replaceWith($("<span>" + $(link).html() + "</span>"));
          } else {
            if (!YE.REG_LINK.test(href)) {
              isInvalidLink = true;
              $(link).attr("href", "http://www.youku.com/");
            }
          }
        }
      });
    }
    // 图片
    // if ($imgs.length !== 0) {
    //   $.each($imgs, function(index,img) {
    //     var src = $(img).attr("src");
    //     if (!YE.REG_IMG.test(src)) {
    //       isInvalidLink = true;
    //       $(img).remove();
    //     }
    //   });
    // }
    // iframe
    if ($iframes.length !== 0) {
      $.each($iframes, function(index, iframe) {
        var src = $(iframe).attr("src");
        if (!YE.REG_LINK.test(src)) {
          isInvalidLink = true;
          $(iframe).attr("src", "");
        }
      });
    }
    if (isInvalidLink) {
      _this.data.content = $dom.html();
    }
  }
  return isInvalidLink;
};
