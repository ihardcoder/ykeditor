{literal}
<style type="text/css">
.win_list {
	list-style: none;
}
.win_item {
	margin: 10px 0;
}
.win_item input{
	padding: 5px;
	box-sizing: initial;
}
</style>

<div style="position: absolute;  top: 60px;  left: 850px;">
	<ul class="win_list">
		<li class="win_item">
			<input type="button" node_id="yevideo" value="添加视频" />
		</li>
		<li class="win_item">
			<input type="button" node_id="yelink" value="添加链接" />
		</li>
		<li class="win_item">
			<input type="button" node_id="yeaudio" value="添加语音" />
		</li>
		<li class="win_item">
			<input type="button" node_id="yegallery" value="图片库" />
		</li>
		<li class="win_item">
			<input type="button" node_id="yepreview" value="预览" />
		</li>
	</ul>
</div>

<script type="text/javascript">
	var win = new Qwindow({
        		size: {
        			width:830, 
        			height:590
        		}
    	});
	jQuery(".win_list").on("click",".win_item input",function(){
		var $btn = jQuery(this);
		var id = $btn.attr('node_id');
		var $node = jQuery("#" + id);
		 win.setContent('html', $node.html()).show();
	});
</script>
{/literal}
<!-- 添加视频弹层 -->
{include file="part_yevideo.tpl"}
<!-- 添加链接弹层 -->
{include file="part_yelink.tpl"}
<!-- 添加语音弹层 -->
{include file="part_yeaudio.tpl"}
<!-- 图片库弹层 -->
{include file="part_yegallery.tpl"}
<!-- 预览弹层 -->
{include file="part_preview.tpl"}