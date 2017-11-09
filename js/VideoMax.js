var div;
var VideoArray = null;
var statusArray = null;
var function_reflush;
var function_onclose;

var default_setting = {
	file: null,
	autostart: true,
	bufferlength: 10,
	smoothing: false,
	events: {
		onComplete: function() { console.log("播放结束!!!"); },
		onVolume: function() { console.log("声音大小改变!!!"); },
		onReady: function() { console.log("准备就绪!!!"); },
		onPlay: function() { console.log("开始播放!!!"); },
		onPause: function() { console.log("暂停!!!"); },
		onBufferFull: function() { console.log("视频缓冲完成!!!"); },
		onBufferChange: function() { console.log("视频缓冲改变了啦啦啦啦!!!"); },
		onBuffer: function() { console.log("视频正在缓冲中？？？"); },
		onError: function(obj) { console.log("播放器出错!!!" + obj.message); },
		onFullscreen: function(obj) { if(obj.fullscreen) { console.log("全屏"); } else { console.log("非全屏"); } },
		onMute: function(obj) { console.log("静音/取消静音") }
	}
};

function VideoMax(divId, data, titleDate) {
	initview(data);
	div = createView(document.getElementById(divId), data);
	return this;
}

function initview(count) {
	initVideoManager(count);
}

function clear() {
	div.innerText = "";
}

function createView(parentDiv, count) {
	var parent_width = parentDiv.offsetWidth;
	var parent_height = parentDiv.offsetHeight;
	var middleDiv = document.createElement("div");
	middleDiv.style.width = "100%";
	middleDiv.style.height = "100%";
	middleDiv.style.display = "inline-block"
	middleDiv.style.padding = "2px"
	for(var i = 0; i < count; i++) {
		var childDiv = document.createElement("div");
		childDiv.style.width = (parent_width - 4) / Math.sqrt(count) * 0.99 + "px";
		childDiv.style.height = ((parent_height - 4) / Math.sqrt(count)) + "px";
		childDiv.style.margin = "0.1%";
		childDiv.style.float = "left";
		childDiv.id = "div_" + i;
		createTitle(childDiv);
		createVideo(childDiv);
		middleDiv.appendChild(childDiv);
	}
	parentDiv.appendChild(middleDiv);
	return parentDiv;
}

function makePlay(setting, data) {
	var divId;
	var index = statusArray.indexOf(0);
	if(index == -1) {
		divId = VideoArray[0];
	} else {
		divId = VideoArray[index];
		videoManager_set(divId, 1);
	}
	var video_div = document.getElementById(divId);
	var title_text = video_div.parentElement.childNodes[0].childNodes[0];
	title_text.innerHTML = data;
	var jw;
	if(setting != null) {
		setting.height = video_div.offsetHeight;
		setting.height = video_div.offsetWidth;
		jw = jwplayer(video_div).setup({
			file: setting.file,
			autostart: setting.autostart,
			bufferlength: setting.bufferlength,
			height: video_div.offsetHeight,
			width: video_div.offsetWidth,
		});
	} else {
		jw = jwplayer(video_div).setup(default_setting);
	}
	return jw;
}

function closePlay(parentdiv) {
	var videodiv = parentdiv.childNodes[1];
	var index = VideoArray.indexOf(videodiv.id);
	if(statusArray[index] == 1) {
		jwplayer(videodiv).stop();
		statusArray[index] = 0;
		onClosePlay(parentdiv.childNodes[0].childNodes[0].innerText);
		parentdiv.childNodes[0].childNodes[0].innerText = "";
	} else {
		alert("视频已经关闭!!!");
	}
}

function setOnClosePlay(fun){
	function_onclose = fun;
}

function onClosePlay(e){
	function_onclose(e);
}

function createTitle(parentDiv) {
	var childDiv = document.createElement("div");
	childDiv.style.position = "fixed";
	childDiv.style.zIndex="9999";
	childDiv.style.width = parentDiv.style.width;
	childDiv.style.height = "20px";
	childDiv.style.visibility = "hidden";
	var text_div = document.createElement("div");
	text_div.style.float = "left";
	text_div.style.height = "100%";
	text_div.style.textAlign = "center"
	childDiv.appendChild(text_div);

	var cancel_div = document.createElement("div");
	//		cancel_div.style.background = "brown";
	cancel_div.style.color = "antiquewhite"
	cancel_div.style.float = "right";
	cancel_div.style.cursor = "pointer";
	cancel_div.style.width = "20PX";
	cancel_div.style.height = "100%";
	cancel_div.innerText = "X";
	cancel_div.style.textAlign = "center";
	cancel_div.onclick = function() {
		closePlay(parentDiv);
	}
	childDiv.appendChild(cancel_div);
	var reflush_div = document.createElement("div");
	reflush_div.style.color = "antiquewhite";
	reflush_div.style.float = "right";
	reflush_div.style.cursor = "pointer";
	reflush_div.style.width = "20PX";
	reflush_div.style.height = "100%";
	reflush_div.innerText = "○";
	reflush_div.style.textAlign = "center";
	reflush_div.onclick = function() {
		reflushEvent();
	}
	childDiv.appendChild(reflush_div);
	parentDiv.appendChild(childDiv);

	parentDiv.onmouseover = function() {
		childDiv.style.visibility = "visible";
	}
	parentDiv.onmouseout = function() {
		childDiv.style.visibility = "hidden";
	}
}

function createVideo(parentDiv) {
	var childDiv = document.createElement("div");
	childDiv.style.width = "100%";
	childDiv.style.height = parseInt(parentDiv.style.height) + "px";
	childDiv.style.background = "black";
	childDiv.id = "video_" + parentDiv.id;
	parentDiv.appendChild(childDiv);
	videoManager_put(childDiv.id, 0);
}

function videoManager_get(divId) {
	var index = VideoArray.indexOf(divId);
	return status[index];
}

function videoManager_set(divId, status) {
	var index = VideoArray.indexOf(divId);
	statusArray[index] = status;
}

function videoManager_put(divId, status) {
	VideoArray[VideoArray.length] = divId;
	statusArray[statusArray.length] = status;
}

function initVideoManager() {
	VideoArray = new Array();
	statusArray = new Array();
}

function setReflush(fun) {
	this.function_reflush = fun;
}

function reflushEvent() {
	function_reflush();
}