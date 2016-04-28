<div id="yegallery" style="display: none;">
	<div class="qWindowBox" id="qWindowBox_yegallery">
		<div class="qWindowBox_yegallery_head">从图片库选择</div>
		<div class="qWindowBox_yegallery_body">
			<div class="yegallery_upload">
				<span>建议尺寸：640 x 360 px</span>
				<div class='ye_btn yegallery_upload_btn'>
					<span class="ye_btn_text">本地上传</span>
					<iframe id="yegallery_upload_iframe" style="display:none;"></iframe>
					<form method="post" enctype="multipart/form-data" action="" target="yegallery_upload_iframe" id="yegallery_upload_form">
						<input type="file" class="yegallery_upload_file">
					</form>
				</div>
			</div>
			<div class="yegallery_gallery">
				<!-- loading -->
				<div class="yegallery_gallery_loading" >
					<i class="ye_loading-64"></i>
				</div>
				<!-- 加载失败 -->
				<div class="yegallery_gallery_error">
					<i class="ye_icon ye_icon_error"></i>
					<p class="yegallery_gallery_error_hint">加载失败，请检查网络状况或<span class="yegallery_gallery_error_act">刷新</span></p>
				</div>
				<!-- 图片库为空 -->
				<div class="yegallery_gallery_empty">
					<i class="ye_icon ye_icon_notice_blue"></i>
					<p class="yegallery_gallery_empty_hint">没有图片，请<span class="yegallery_gallery_empty_act">本地上传</span>图片</p>
					<form method="post" enctype="multipart/form-data" action="" target="yegallery_upload_iframe" id="yegallery_upload_form_empty">
						<input type="file" class="yegallery_upload_file yegallery_upload_file_empty">
					</form>
				</div>
				<!-- 图片容器 -->
				<div class="yegallery_gallery_box">
					<ul class="yegallery_gallery_list clearfix">
						<li class="yegallery_gallery_item yegallery_gallery_item-checked">
							<div class="gallery_item_thumb">
								<div class="thumb_cover thumb_cover_checked"></div>
								<img class="thumb_img" src="http://r4.ykimg.com/0515000055B57BBB67BC3D022B0F3914">
								<span class="ye_icon ye_icon_close_cube"></span>
							</div>
							<div class="gallery_item_entry">
								<span class="entry_name">图122332</span>
							</div>
						</li>
						<li class="yegallery_gallery_item">
							<div class="gallery_item_thumb">
								<div class="thumb_cover thumb_cover_checked"></div>
								<img class="thumb_img" src="/u/img/ykeditor/blank.jpg">
								<span class="ye_icon ye_icon_close_cube"></span>
							</div>
							<div class="gallery_item_entry">
								<span class="entry_name">图122332</span>
							</div>
						</li>
						<li class="yegallery_gallery_item">
							<div class="gallery_item_thumb">
								<div class="thumb_cover thumb_cover_checked"></div>
								<img class="thumb_img" src="/u/img/ykeditor/uploading.jpg">
								<span class="ye_icon ye_icon_close_cube"></span>
							</div>
							<div class="gallery_item_entry">
								<span class="entry_name">图122332</span>
							</div>
						</li>
						<li class="yegallery_gallery_item">
							<div class="gallery_item_thumb">
								<div class="thumb_cover thumb_cover_checked"></div>
								<img class="thumb_img" src="/u/img/ykeditor/upload-error.jpg">
								<span class="ye_icon ye_icon_close_cube"></span>
							</div>
							<div class="gallery_item_entry">
								<span class="entry_name">图122332</span>
							</div>
						</li>
						<li class="yegallery_gallery_item">
							<div class="gallery_item_thumb">
								<div class="thumb_cover thumb_cover_checked"></div>
								<img class="thumb_img" src="/u/img/ykeditor/download-error.jpg">
								<span class="ye_icon ye_icon_close_cube"></span>
							</div>
							<div class="gallery_item_entry">
								<span class="entry_name">图122332</span>
							</div>
						</li>
						{section name='loopname' loop=3}
						<li class="yegallery_gallery_item">
							<div class="gallery_item_thumb">
								<div class="thumb_cover thumb_cover_checked"></div>
								<img class="thumb_img" src="http://r4.ykimg.com/0515000055B57BBB67BC3D022B0F3914">
								<span class="ye_icon ye_icon_close_cube"></span>
							</div>
							<div class="gallery_item_entry">
								<span class="entry_name">图122332</span>
							</div>
						</li>
						{/section}
					</ul>
					
					<div class="qPager qPager_gallery" >
						<ul class="turn">
							<li class="pre" title="上一页">
							<span><em class="ico_pre"></em>上一页</span></li>
							<li class="next" title="下一页">
							<a href="#"><em class="ico_next"></em>下一页</a>
							</li>
						</ul>
						<ul class="pages">
							<li class="current"><span>1</span></li>
							<li><a href="#">2</a></li>
							<li><a href="#">3</a></li>
							<li><a href="#">4</a></li>
							<li><a href="#">5</a></li>
							<li><a href="#">6</a></li>
							<li><a href="#">7</a></li>
							<li><a href="#">8</a></li>
							<li><a href="#">9</a></li>
							<li class="pass">...</li>
							<li><a href="#">25</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="qWindowBox_yegallery_act">
				<span class="qWindowBox_yegallery_slectedsum">已选1个，可选5个</span>
				<div class="ye_btn ye_btn_l ye_btnmaj_l qWindowBox_yegallery_act_btn">
					<span class="ye_btn_text" _for="add">完成</span>
				</div> 
			</div>
		</div>
	</div>
</div>