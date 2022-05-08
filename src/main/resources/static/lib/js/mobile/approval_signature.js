// 서명 관련 추가 시작

// 서명받기 영역 보이기
function mobile_signature_showSignature() {	
	_mobile_signature_api = $('.signature_EnDetail').signaturePad(_mobile_signature_options);

	$('#divSignature').css({
		"display" : ""
	});	
	
	var signboxWidth = 282;
	var signboxHeight = 240;
	
	$('#signbox').css({
		"width" : signboxWidth,
		"height": signboxHeight,
		"vertical-align" : "middle",
		"margin" : "auto"
	});

	var canvasWidth = 280;
	var canvasHeight = 240;
	
	document.getElementById("divCanvas").width = canvasWidth;
	document.getElementById("divCanvas").height = canvasHeight;
	document.getElementById("signpad").width = canvasWidth;
	document.getElementById("signpad").height = canvasHeight;
	
	
	$('#signpad').css({
		"vertical-align" : "middle",
		"margin" : "auto"
	});
}

function mobile_signature_getDisplayInfo() {
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }

    return size;
}

// 서명받기 영역 숨기기
function mobile_signature_closeSign() {
    $(".clearButton > a").click();
    $('#divSignature').css({ "display": "none" });
}

// SignaturePad 추가
var _mobile_signature_sig;
var _mobile_signature_api;
var _mobile_signature_options = {
    defaultAction: 'drawIt',
    penColour: '#000',
    lineWidth: 0,
    penWidth: 5
};

var _mobile_signature_options_display = {
    displayOnly: 'true',
    penColour: '#000',
    lineWidth: 0,
};

function toDataURL() {
	var canvas = document.getElementById('signpad');
	var myImage = document.getElementById('rstImg');
	myImage.src = canvas.toDataURL();
}

// 결재 사인 등록
function mobile_signature_uploadSignature() {
	var userCode = Common.getSession("USERID");
	var canvas = document.getElementById('signpad');
	var canvImgStr = canvas.toDataURL('image/png', 1.0);	// canvas.toDataURL()을 이용하여 base64 img string으로 변경
	
	$.ajax({
    	url: "/approval/admin/signUpload.do",
    	type: "post", 
    	data: {
    		logonID : userCode,
    		strImg : canvImgStr
    	},
    	success: function(data){
    		alert(mobile_comm_getDic("msg_completeRegistSign"));
    	},
    	error: function(response, status, error){
    		alert(mobile_comm_getDic("msg_errorRegistSign"));
    	}
    }); 
	mobile_common_void_reload();
}

// 결재 사인 삭제
function mobile_signature_deleteSignature(obj) {
	var userCode = Common.getSession("USERID");
	var fileName = $(obj).parent().find('a').find('p').text();

	$.ajax({
		url: "/approval/admin/deleteSignImage.do",
    	type: "post", 
    	data: {
    		UserCode : userCode,
    		FileName : fileName
    	},
    	success: function(data){
    		alert(mobile_comm_getDic("msg_completeDelSign"));
    	},
    	error: function(response, status, error){
    		alert(mobile_comm_getDic("msg_errorDelSign"));
    	}
    }); 
	mobile_common_void_reload();
}

function mobile_signature_changeUseSign(obj) {
	var userCode = Common.getSession("USERID");
	var fileName = $(obj).parent().find('a').find('p').text();
	
	$.ajax({
		url: "/approval/admin/changeUseSign.do",
    	type: "post", 
    	data: {
    		UserCode : userCode,
    		FileName : fileName
    	},
    	success: function(data){
    		alert(mobile_comm_getDic("msg_completeSetSign"));
    	},
    	error: function(response, status, error){
    		alert(mobile_comm_getDic("msg_errorSetSign"));
    	}
    }); 
	mobile_common_void_reload();
}

function mobile_common_void_reload() {
    location.href = location.href;
}
