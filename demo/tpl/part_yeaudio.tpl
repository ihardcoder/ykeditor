<div id="yeaudio" style="display: none;">
	<div class="qWindowBox" id="qWindowBox_yeaudio">
		<div class="qWindowBox_yeaudio_head">添加语音</div>
		<div class="qWindowBox_yeaudio_body">
			<div class="yeaudio_upload">
				<span>格式支持mp3\wma\wav\amr，文件大小不超过30MB，语音建议30分钟以内</span>
				<div class='ye_btn yeaudio_upload_btn'>
					<span class="ye_btn_text">上传语音</span>
					<iframe id="yeaudio_upload_iframe" style="display:none;"></iframe>
					<form method="post" enctype="multipart/form-data" action="" target="yeaudio_upload_iframe" id="yeaudio_upload_form">
						<input type="file" class="yeaudio_upload_file" accept=".mp3,.wma,.wav,.amr">
					</form>
				</div>
			</div>
			<div class="yeaudio_container">
				<!-- loading -->
				<div class="yeaudio_loading" >
					<i class="ye_loading-64-white"></i>
				</div>
				<!-- 加载失败 -->
				<div class="yeaudio_error">
					<i class="ye_icon ye_icon_error"></i>
					<p class="yeaudio_error_hint">加载失败，请检查网络状况或<span class="yeaudio_error_act">刷新</span></p>
				</div>
				<!-- 语音库为空 -->
				<div class="yeaudio_empty">
					<i class="ye_icon ye_icon_notice_blue"></i>
					<p class="yeaudio_empty_hint">没有图片，请<span class="yeaudio_empty_act">上传语音</span></p>
					<form method="post" enctype="multipart/form-data" action="" target="yeaudio_upload_iframe" id="yeaudio_upload_form_empty">
						<input type="file" class="yeaudio_upload_file yeaudio_upload_file_empty" accept=".mp3,.wma,.wav,.amr">
					</form>
				</div>
				<!-- 语音库 -->
				<div class="yeaudio_box">
						<ul class="yeaudio_box_head clearfix">
							<li class="yeaudio_box_head_item yeaudio_box_head_item_title">语音标题</li>
							<li class="yeaudio_box_head_item yeaudio_box_head_item_duration">时长</li>
							<li class="yeaudio_box_head_item yeaudio_box_head_item_uploaddate">上传日期</li>
							<li class="yeaudio_box_head_item yeaudio_box_head_item_act">操作</li>
						</ul>
						<ul class="yeaudio_box_body clearfix">
							<!-- 正常状态 -->
							<li class="yeaudio_box_body_item">
								<input type="radio" class="yeaudio_item yeaudio_item_radio">
								<div class="yeaudio_item yeaudio_item_title">
									<div class="audiocover">上传中</div>
									<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">
									<p class="audiotitle">我是标题</p>
								</div>
								<div class="yeaudio_item yeaudio_item_duration">02:33</div>
								<div class="yeaudio_item yeaudio_item_uploaddate">2015-06-18</div>
								<ul class="yeaudio_item yeaudio_item_act">
									<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>
									<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio"></i></li>
								</ul>
							</li>
							<!-- 屏蔽状态 -->
							<li class="yeaudio_box_body_item yeaudio_box_body_item-invalid">
								<input type="radio" class="yeaudio_item yeaudio_item_radio">
								<div class="yeaudio_item yeaudio_item_title">
									<div class="audiocover audiocover-invalid">已屏蔽</div>
									<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">
									<p class="audiotitle">我是标题</p>
								</div>
								<div class="yeaudio_item yeaudio_item_duration">02:33</div>
								<div class="yeaudio_item yeaudio_item_uploaddate">2015-06-18</div>
								<ul class="yeaudio_item yeaudio_item_act">
									<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>
									<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio"></i></li>
								</ul>
							</li>
							<!-- 选中状态 -->
							<li class="yeaudio_box_body_item yeaudio_box_body_item-chosen">
								<input type="radio" class="yeaudio_item yeaudio_item_radio">
								<div class="yeaudio_item yeaudio_item_title">
									<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">
									<p class="audiotitle">我是标题</p>
								</div>
								<div class="yeaudio_item yeaudio_item_duration">02:33</div>
								<div class="yeaudio_item yeaudio_item_uploaddate">2015-06-18</div>
								<ul class="yeaudio_item yeaudio_item_act">
									<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>
									<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio"></i></li>
								</ul>
							</li>
							<!-- 上传出错 -->
							<li class="yeaudio_box_body_item yeaudio_box_body_item-error" style="display:none;">
								<input type="radio" class="yeaudio_item yeaudio_item_radio">
								<div class="yeaudio_item yeaudio_item_title">
									<div class="audiocover audiocover-error">出错</div>
									<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">
									<p class="audiotitle">我是标题</p>
								</div>
								<div class="yeaudio_item yeaudio_item_duration">--:--</div>
								<div class="yeaudio_item yeaudio_item_uploaddate">0000-00-00</div>
								<ul class="yeaudio_item yeaudio_item_act">
									<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>
									<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio"></i></li>
								</ul>
							</li>
							<!-- 上传中 -->
							<li class="yeaudio_box_body_item yeaudio_box_body_item-uploading">
								<input type="radio" class="yeaudio_item yeaudio_item_radio">
								<div class="yeaudio_item yeaudio_item_title">
									<div class="audiocover audiocover-uploading">上传中</div>
									<img src="/u/img/ykeditor/audioimg.png" alt="" class="audioimg">
									<p class="audiotitle">我是标题</p>
									<div class="progressbar">
										<div class="progressbar_status"></div>
									</div>
								</div>
								<div class="yeaudio_item yeaudio_item_duration">--:--</div>
								<div class="yeaudio_item yeaudio_item_uploaddate">0000-00-00</div>
								<ul class="yeaudio_item yeaudio_item_act">
									<li class="act_editaudio"><i class="ye_icon ye_icon_editaudio"></i></li>
									<li class="act_delaudio"><i class="ye_icon ye_icon_delaudio-disable"></i></li>
								</ul>
							</li>
						</ul>
				</div>
				<div class="qPager qPager_audio">
			                <ul class="turn">
							<li class="pre" title="上一页">
								<span><em class="ico_pre"></em>上一页</span>
							</li>
					            <li class="next" title="下一页">
						            	<a href="javascript:void(0)" _page="2"><em class="ico_next"></em>下一页</a>
					            </li>
				        </ul>
				        <ul class="pages">
		    				<li class="current"><span>1</span></li>
		    				<li><a href="javascript:void(0)" _page="2">2</a></li>
		    				<li><a href="javascript:void(0)" _page="3">3</a></li>
		    				<li><a href="javascript:void(0)" _page="4">4</a></li>
		    				<li><a href="javascript:void(0)" _page="5">5</a></li>
		    				<li><a href="javascript:void(0)" _page="6">6</a></li>
				        </ul>
				    </div>
			</div>
			<div class="qWindowBox_yeaudio_act">
				<div class="ye_btn ye_btn_l ye_btnmaj_l qWindowBox_yeaudio_act_btn ye_btn-disable">
					<span class="ye_btn_text" _for="add">完成</span>
				</div> 
			</div>
		</div>
	</div>
</div>