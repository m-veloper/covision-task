// 전자결재 승인/반려 생체인증
var _mobile_fido_inputValue = "";

var _mobile_fido_timer;
var _mobile_fido_checktimer;

var _mobile_fido_logonID = "";
var _mobile_fido_authType = "";
var _mobile_fido_authKey = "";
var _mobile_fido_authToken = "";

function mobile_fido_requestCheckFido() {
	mobile_fido_checkFido();
}

function mobile_fido_checkFido() {
	mobile_comm_showload();
	
	// parameter 값 설정
	var userCode = Common.getSession("USERID");
	
	_mobile_fido_logonID = userCode;
	_mobile_fido_authType = "approval";

	// FIDO 요청
	$.ajax({
				url : "/covicore/control/fido.do",
				type : "post",
				async : false,
				data : {
					"logonID" : _mobile_fido_logonID,
					"authType" : _mobile_fido_authType,
					"reqMode" : "ReqAuth"
				},
				success : function(data) {
					if (data.status == "SUCCESS") {
						_mobile_fido_authKey = data.authKey;
						_mobile_fido_authToken = encodeURIComponent(data.authToken);
						_mobile_fido_inputValue = "FIDO||" + _mobile_fido_authKey + "||" + _mobile_fido_authToken;

						var counter = 120; // 2분 제한

						// Interval 설정
						_mobile_fido_timer = setInterval(function() {
							if (counter < 0) {
								mobile_fido_cancelFido();
							} else {
								var minutes = Math.floor(counter / 60);
								var seconds = counter - (minutes * 60);
							}
							;
							counter -= 1;
						}, 1000);

						_mobile_fido_checktimer = setInterval("mobile_fido_confirmAuth('interval')",
								5000);
					} else {
						mobile_fido_closeFido();
					}
				},
				error : function(response, status, error) {
//					CFN_ErrorAjax("/covicore/control/fido.do", response,
//							status, error);
				}
			});
}

function mobile_fido_checkAuth() {
	mobile_comm_showload();
	
	// parameter 값 설정
	var userCode = Common.getSession("USERID");
	
	_mobile_fido_logonID = userCode;
	_mobile_fido_authType = "approval";

	// FIDO 요청
	$.ajax({
				url : "/covicore/control/fido.do",
				type : "post",
				async : false,
				data : {
					"logonID" : _mobile_fido_logonID,
					"authType" : _mobile_fido_authType,
					"authKey" : _mobile_fido_authKey,
					"authToken" : _mobile_fido_authToken,
					"reqMode" : "CheckAuth" // CheckAuth? AuthCheck?
				},
				success : function(data) {
					if (data.status == "SUCCESS") {
						_mobile_fido_authKey = data.authKey;
					} else {
						mobile_fido_closeFido();
					}
				},
				error : function(response, status, error) {
//					CFN_ErrorAjax("/covicore/control/fido.do", response,
//							status, error);
				}
			});
}

function mobile_fido_cancelFido() {
	if (_mobile_fido_authKey != undefined) {

		$.ajax({
			url : "/covicore/control/fido.do",
			type : "post",
			data : {
				"logonID" : _mobile_fido_logonID,
				"authKey" : _mobile_fido_authKey,
				"authType" : _mobile_fido_authType,
				"authToken" : _mobile_fido_authToken,
				"reqMode" : "CancelAuth"
			},
			success : function(data) {
				if (data.status != "SUCCESS") {
					mobile_fido_closeFido();
				}
			},
			error : function(response, status, error) {
//				CFN_ErrorAjax("/covicore/control/fido.do", response, status,
//						error);
			}
		});
	}
}

function mobile_fido_confirmAuth(callType) { // interval(5초에 한번 호출)
	if (_mobile_fido_authKey != undefined) {

		$.ajax({
					url : "/covicore/control/fido.do",
					type : "post",
					data : {
						"logonID" : _mobile_fido_logonID,
						"authKey" : _mobile_fido_authKey,
						"authType" : _mobile_fido_authType,
						"authToken" : _mobile_fido_authToken,
						"reqMode" : "ReadAuth"
					},
					success : function(data) {
						if (data.status == "SUCCESS") {
							if (data.resMessage.toUpperCase() == "SUCC") {
								if (callType == "user") {
									mobile_fido_closeFido();
									alert("<spring:message code='Cache.msg_CertificationSuccess'/>");
									if (opener) {
										opener.mobile_fido_fidoCallBack();
									} else {
										parent.mobile_fido_fidoCallBack();
									}
								} else { // interval
									mobile_fido_closeFido();
									if (opener) {
										opener.mobile_fido_fidoCallBack();
									} else {
										parent.mobile_fido_fidoCallBack();
									}
								}
								mobile_comm_hideload(); // 로딩바 hide
							} else if (data.resMessage.toUpperCase() == "FAIL") {
								alert(mobile_comm_getDic("msg_fido03"));
								clearInterval(_mobile_fido_timer);
								clearInterval(_mobile_fido_checktimer);
								mobile_comm_hideload(); // 로딩바 hide
							} else if (data.resMessage.toUpperCase() == "CHECK") {
								mobile_fido_closeFido();
								mobile_comm_hideload(); // 로딩바 hide
								alert(mobile_comm_getDic("msg_errorBiometrics") +" : "
										+ "<spring:message code='Cache.msg_CertificationDup'/>");
							} else if (callType == 'user'
									&& data.resMessage.toUpperCase() == "REQ") {
								alert(mobile_comm_getDic("msg_errorBiometrics") +" : "
										+ "<spring:message code='Cache.msg_CertificationProceed'/>");
							}
						} else {
							alert(mobile_comm_getDic("msg_errorBiometrics") + " : " + data.resMessage);
						}
					},
					error : function(response, status, error) {
//						CFN_ErrorAjax("/covicore/control/fido.do", response,
//								status, error);
					}
				});
	}
}

function mobile_fido_closeFido() {
	clearInterval(_mobile_fido_timer);
	clearInterval(_mobile_fido_checktimer);
}

function mobile_fido_fidoCallBack() {
	var l_ActiveModule = mobile_approval_getActiveModule();
	var viewMode;
	
	if($.mobile.activePage.attr("id").indexOf("write") > -1) {
		viewMode = "write";
	} else {
		viewMode = "view";
	}
	
	alert("["+ mobile_comm_getDic("WebPartBizSection_Approval") +"] " + mobile_comm_getDic("msg_completebiometrics")); // [전자결재] 생체 인증이 완료되었습니다.

	$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").attr("disabled", "disabled");
	document.getElementById(l_ActiveModule + "_" + viewMode + "_inputpassword").placeholder = mobile_comm_getDic("lbl_completeBiometrics"); // 생체 인증 완료
}
