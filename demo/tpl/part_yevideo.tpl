<div id="yevideo" style="display: none;">
<div class="qWindowBox" id="qWindowBox_yevideo">
    <div class="qWindowBox_yevideo_head">添加视频</div>
    <div class="qWindowBox_yevideo_body">
    <div class="tit clearfix">
        <div class="f_r" style="display:none;">
            <div class="icon-close" id="icon-close"></div>
            <input class="search" placeholder="疯狂的投资" onfocus="$(this).parent().find('#icon-close').show()" onblur="$(this).parent().find('#icon-close').hide()" type="text"/>
        </div>
        <div>
            <a href="javascript:;" class="myvideo select">我的视频</a>
            <a href="javascript:;" class="othervideo">别人的视频</a>
        </div>
    </div>
    <div class="item-layout clearfix" tab-value="myvideo">
        <div class="item-left">
            <dl>
                <dt><a href="" class="myupload select">我上传的</a></dt>
                <dt><a href="" class="mycollect">我收藏的</a></dt>
            </dl>
        </div>
        <div class="item-right">
            <ul class="ye_ul yevideo_list">
                <li class="yevideo_item yevideo_item-focused">
                    <div class="items-layout">
                        <div class="items radio"><input type="radio" name="video" value="320041685" encode_id="XMTI4MDE2Njc0MA==" onclick="pushSubscribe.addData(this);"></div>
                        <div class="items-left"><img src="http://g2.ykimg.com/0100641F46559D0EA398722B58682434B5CF4B-1898-DF7A-393B-FF7650E98937" style="width:80px;height=60px;"></div>
                        <div class="items">
                            <div class="item-title">（转载）【MC动画】《我的三体》宣传片（转载）</div>
                            <div class="item-date">2015-07-14 16:19:22</div>
                        </div>
                    </div>
                </li>
                {section name="loopname" loop=10}
                <li class="yevideo_item">
                    <div class="items-layout">
                        <div class="items radio"><input type="radio" name="video" value="320041685" encode_id="XMTI4MDE2Njc0MA==" onclick="pushSubscribe.addData(this);"></div>
                        <div class="items-left"><img src="http://g2.ykimg.com/0100641F46559D0EA398722B58682434B5CF4B-1898-DF7A-393B-FF7650E98937" style="width:80px;height=60px;"></div>
                        <div class="items">
                            <div class="item-title">（转载）【MC动画】《我的三体》宣传片（转载）</div>
                            <div class="item-date">2015-07-14 16:19:22</div>
                        </div>
                    </div>
                </li>
                {/section}
            </ul>
            <div class="qWindowBox-pages">
                <a href="javascript:void(0);" pageurl="" class="current">1</a>
                <a href="javascript:void(0);" pageurl="" class="disable">上一页</a>
                <a href="javascript:void(0);" pageurl="" class="disable">下一页</a>
            </div>
            <div class="item-noResult" style="display: none;">没有找到相关内容</div>
        </div>
    </div>
    <div class="item-layout clearfix" tab-value="othervideo" style="display: none;">
        <div class="search-box">
            <p class="colorGrey">请输入视频链接地址</p>
            <input class="search" id="search_video" type="text">
        </div>
        <div class="item-other" id="item-other" style="display: none;">
            <div class="item-other-list">
                <div class="img" id="video_img"></div>
                <div class="tit" id="video_title" vid=""></div>
            </div>
        </div>
        <div class="item-noResult" id="item-noResult" style="">
            没有找到视频
            <p class="c_gray">请检查链接是否正确</p>
        </div>
        <div class="loadingBox" id="loadingBox" style="display:none;">
            <div class="loading"><img src="/u/img/pushdy/loading_64.gif"></div>  
        </div>
    </div>
    <div class="item-control t_c">
        <div class="ye_btn ye_btn-disable ye_btn_l form_btn form_btn_l form_btnmaj_l"><span class="ye_btn_text form_btn_text">完成</span></div>
    </div>
    </div>
</div>
</div>
{literal}
<script type="text/javascript">
    (function($){    
        $(document).on("click",".qWindowBox_yevideo_body .myvideo",function(){
            $(this).addClass("select");
            $(".othervideo").removeClass("select");
            $("[tab-value=myvideo]").show();
            $("[tab-value=othervideo]").hide();
        }).on("click",".qWindowBox_yevideo_body .othervideo",function(){
            $(this).addClass("select");
            $(".myvideo").removeClass("select");
            $("[tab-value=othervideo]").show();
            $("[tab-value=myvideo]").hide();
        });
    })(jQuery);
</script>

{/literal}