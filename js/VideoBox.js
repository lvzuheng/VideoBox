//VideoBox可拖动窗口，用了jwplayer.js框架
//用法 VideoBox(div的ID,设置文件)；
//作用：div浮空，可拖动

var defaultSetting = {
	height: "240",
	width: "380",
	autostart: true,
	moveable: true
}
var mDownX;
var mDownY;
var mFlag = false;
var videoBoxCount = 0;

function VideoBox(div, iSetting) {
	var setting = initSetting(iSetting);
	var videoBox = initView(div, setting);
	return videoBox;
}

function initView(divId, setting) {
	var div;
	if(divId == null) {
		div = document.createElement("div");
		div.style.width = setting.width + "px";
		div.style.height = setting.height + "px";
		div.style.position = "absolute";
		div.style.left = (document.body.clientWidth - setting.width) / 2 + "px";
		div.style.top = (document.documentElement.clientHeight - setting.height) / 3 + "px";
		document.body.appendChild(div);
	} else {
		div = document.getElementById(divId);
	}
	var video_div = document.createElement("div");
	video_div.style.width = "100%";
	video_div.style.height = "100%";
	video_div.style.background = "wheat"
	video_div.id = "video_div_"+videoBoxCount;
	videoBoxCount = ++videoBoxCount;
	div.appendChild(video_div);
	setMoveFunction(div, setting);
	initVideoPlayer(video_div, setting);
	return div;
}

function setMoveFunction(div, setting) {
	if(!setting.moveable) {
		return;
	}
	if(div.style.left == "") {
		div.style.left = div.offsetLeft + "px";
	}
	if(div.style.top == "") {
		div.style.top = div.offsetTop + "px";
	}
	div.addEventListener("mousedown", function(e) {
		mFlag = true;
		mDownX = e.clientX;
		mDownY = e.clientY;
	});
	div.addEventListener("mousemove", function(e) {
		if(mFlag) {
			div.style.position = "absolute";
			var mX = e.clientX - mDownX;
			var mY = e.clientY - mDownY;
			mDownX = e.clientX;
			mDownY = e.clientY;
			div.style.left = parseInt(div.style.left) + mX + "px";
			div.style.top = parseInt(div.style.top) + mY + "px";
		}
	});
	div.addEventListener("mouseup", function(e) {
		mFlag = false;
	});
}

function initVideoPlayer(div, setting) {
	jwplayer(div).setup({
		file: setting.file,
		autostart: setting.autoplay,
		bufferlength: 10,
		height:setting.height,
		width:setting.width
	});
}

function initSetting(setting) {
	var mSetting = setting;
	if(mSetting.width == null) {
		mSetting.width = defaultSetting.width;
	}
	if(mSetting.height == null) {
		mSetting.height = defaultSetting.height;
	}
	if(mSetting.file == null) {
		mSetting.file = defaultSetting.file;
	}
	if(mSetting.autoplay == null) {
		mSetting.autoplay = defaultSetting.autoplay;
	}
	if(mSetting.moveable == null) {
		mSetting.moveable = defaultSetting.moveable;
	}
	return mSetting;
}