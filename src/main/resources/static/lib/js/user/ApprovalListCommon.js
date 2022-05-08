
var g_commentAttachList = [];

var strPiid_List = "";
var strWiid_List = "";
var strFiid_List = "";
var strPtid_List = "";
var strBizData2_List = "";
var strTaskID_List = "";
var strKind_List = "";

//개별호출 일괄호출처리
Common.getDicList(["msg_blocApprove","msg_127","msg_apv_003","msg_apv_508","lbl_apv_ApvPwd_Check","msg_PasswordChange_02","msg_ScriptApprovalError","lbl_apv_ChargeDept","msg_apv_319","msg_BatchApprovalResult","msg_apv_alert_006","msg_apv_003","msg_blocCheck","msg_apv_093","msg_apv_279","msg_ExcelDownMessage","lbl_apv_gubun","lbl_apv_subject","lbl_DraftDept","lbl_apv_writer","lbl_RepeateDate","lbl_FormNm","msg_selectretireuser","msg_238","msg_NoDataList","lbl_apv_searchcomment_chang","lbl_apv_userfoldertitle","btn_apv_userfolderadd","btn_apv_userfolderadd","lbl_apv_userfolder_2","btn_apv_folderEdit","lbl_handover","msg_RUHandover","lbl_RequestUserAuth","lbl_Biometrics"]);
var SessionObj = Common.getSession();

	/**
	 * 새로고침
	 */
	function Refresh(){
		CoviMenu_GetContent(location.href.replace(location.origin, ""), false);
	}

	/**
	 * 사용자 전자결재 비밀번호 확인
	 * @param strPassword
	 * @returns {Boolean}
	 */
	function chkCommentWrite(strPassword){
		var returnval = false;
		$.ajax({
			url:"/approval/chkCommentWrite.do",
			type:"post",
			data: {
				"ur_code" : SessionObj["USERID"],
				"password" : strPassword
			},
			async:false,
			success:function (res) {				
				if(res){					
					returnval = true;					
				} else {					
					returnval = false;
				}
			},
			error:function(response, status, error){
				CFN_ErrorAjax("/approval/chkCommentWrite.do", response, status, error);
			}
		});
		return returnval;
	}
	
	/**
	 * 일괄결재
	 * @param gridObj
	 * @param approvalType
	 * @param buttonType
	 */
	function BatchApproval(gridObj, approvalType, useFido){
		strPiid_List = "";
		strWiid_List = "";
		strFiid_List = "";
		strPtid_List = "";
		strKind_List = "";
		
		strBizData2_List = "";
		strTaskID_List = "";
		
		//일괄 결재 사용을 하지 않는 문서는 체크 제외
		var excludeItem = false;
		$.each(gridObj.getCheckedListWithIndex(1), function(idx,obj){
			if(typeof obj.item.ExtInfo == 'undefined'  || obj.item.ExtInfo.UseBlocApprove != 'Y'){
				excludeItem = true;
				gridObj.checkedColSeq(1,false,obj.index);
			}
		});
		
		var msgConfirm = '';
		var msgWarning = '';

		if(excludeItem){
			msgConfirm += coviDic.dicMap["msg_blocApprove"];  	//일괄결재를 지원하지 않는 양식은 항목에서 제외됩니다.
			msgWarning += coviDic.dicMap["msg_blocApprove"];  	//일괄결재를 지원하지 않는 양식은 항목에서 제외됩니다.
			
			msgConfirm += "\n";
			msgWarning += "\n";
		}
		msgConfirm += coviDic.dicMap["msg_127"];  // 처리 하시겠습니까?
		msgWarning += coviDic.dicMap["msg_apv_003"]; //선택된 항목이 없습니다.
		
		// 체크된 항목 확인
		//var checkApprovalList = gridObj.getCheckedList(0);
		var checkApprovalList = gridObj.getCheckedList(1);
		if(checkApprovalList.length == 0){
			Common.Warning(msgWarning);
		}else if(checkApprovalList.length > 0){
			if(confirm(msgConfirm)){				// 처리 하시겠습니까?
				// 결재 비밀번호 사용여부
				if(chkCommentWrite("")){
					Common.Password(coviDic.dicMap["msg_apv_508"], null, coviDic.dicMap["lbl_apv_ApvPwd_Check"], function (apvToken) {
						if (apvToken) {
							if (apvToken.indexOf("e1Value:") > -1) { //생체인증 처리  
								this.fidoCallBack = function(){
									switchBatchApproval(checkApprovalList, approvalType,apvToken,this.g_authKey);
								}
								Common.open("", "checkFido", coviDic.dicMap["lbl_RequestUserAuth"], "/covicore/control/checkFido.do?logonID="+SessionObj["UR_Code"]+"&authType=Approval", "400px", "510px", "iframe", true, null, null, true); //사용자 본인인증 요청
							}else{
								if(chkCommentWrite(apvToken)){
									// 결재 진행
									switchBatchApproval(checkApprovalList, approvalType,apvToken);
								}else{
									// 비밀번호 틀림
									Common.Warning(coviDic.dicMap["msg_PasswordChange_02"]);
								}
							}
						}
					});
					
					  // 생체인증 버튼 제어
                    if (useFido == "Y") {
                        setTimeout(function () {
                            var oTargetObj = $("#alert_container").find("#popup_e1")
                            $(oTargetObj).find("strong").text(coviDic.dicMap["lbl_Biometrics"]);
                            $(oTargetObj).show();
                        }, 350);
                    }
				}else{
					switchBatchApproval(checkApprovalList, approvalType);
				}
			}
		}else{
			Common.Warning(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
		}
	}
	
	/**
	 * 담당업무함, 부서수신함에서 호출했을 경우, 결재선 변경 필요
	 * @param approvalList
	 * @param approvalType
	 */
	function switchBatchApproval(approvalList, approvalType,apvToken,authKey){
		
		var apvToken = apvToken || "";
		var authKey = authKey || "";
		
		if(approvalType == "JOBFUNCTION" || approvalType == "DEPT"){
			var processIDs = new Array();
			
			var oApprovalList = {"approvalList" : approvalList};
			
			//부서수신함에서 합의, 협조는 제외 (TODO 부서협조 접수, 반려 스키마 체크시 개발 필요)
			var length = $$(oApprovalList).find("approvalList").concat().length;
			if(approvalType == "DEPT"){
				var oRemove = $$(oApprovalList).find("approvalList").concat().has("[FormSubKind=C],[FormSubKind=AS]");
				for(var i=0; i<oRemove.length; i++){
					$$(oApprovalList).find("approvalList").remove($$(oRemove).eq(0).index());
				}
			}
			
			if($$(oApprovalList).find("approvalList").concat().length > 0)
				processIDs = $$(oApprovalList).find("approvalList").concat().attr("ProcessID");
			
			// 체크항목 결재선 조회
			if($$(oApprovalList).find("approvalList").concat().length > 0){
				$.ajax({
					url:"/approval/getBatchApvLine.do",
					data: {
						"processIDArr" : processIDs.toString()
					},
					type:"post",
					success:function (res) {
						if(res.length > 0){
							// 각 데이터에 결재선 데이터 포함
							$(res).each(function(i, obj){
								var oApvList = obj.DomainDataContext;
								var formSubKind = $$(oApprovalList).find("approvalList[ProcessID='"+$$(obj).attr("ProcessID")+"']").attr("FormSubKind");
								
								if(formSubKind == "R" || formSubKind == "T008"){		// 수신
									var oCurrentOUNode = $$(oApvList).find("steps > division").children().find("[divisiontype='receive']").has(">taskinfo[status='pending']");
									
									var oRecOUNode = $$(oCurrentOUNode).find("step").has(">ou>taskinfo[status='pending']");	//$$(oCurrentOUNode).find("step:has(ou>taskinfo[status='pending'])");
			                        if (oRecOUNode.length != 0) $$(oCurrentOUNode).find("step").has(">ou>taskinfo[status='pending']").remove();
									
									var oJFNode = $$(oCurrentOUNode).find("step").has("ou>role>taskinfo[status='pending'], ou>role>taskinfo[status='reserved']"); //201108
			                        var bHold = false; //201108 보류여부
			                        var oComment = null;
			                        if (oJFNode.length != 0) {
			                            var oHoldTaskinfo = $$(oJFNode).find("ou>role>taskinfo[status='reserved']");
			                            if (oHoldTaskinfo.length != 0) {
			                                bHold = true;
			                                oComment = $$(oHoldTaskinfo).find("comment").clone();
			                            }
			                            $$(oCurrentOUNode).eq(0).remove("step");
			                        }
		
			                        var deptID = SessionObj["DEPTID"];
			                        var deptName = SessionObj["DEPTNAME"];
		
			                        $$(oCurrentOUNode).attr("oucode", deptID);		// 부서 id
			                        $$(oCurrentOUNode).attr("ouname", deptName);		// 부서 명
			                        
			                        $$(oCurrentOUNode).find("[taskinfo]").attr("status", "pending");
			                        $$(oCurrentOUNode).find("[taskinfo]").attr("result", "pending");
			                        
			                        var oStep = {};
			                        var oOU = {};
			                        var oPerson = {};
			                        var oTaskinfo = {};
		
			                        $$(oStep).attr("unittype", "person");
			                        $$(oStep).attr("routetype", "approve");
			                        $$(oStep).attr("name", coviDic.dicMap["lbl_apv_ChargeDept"]);	//gLabel__ChargeDept);
			                        
			                        $$(oOU).attr("code", deptID);		// 부서 id
			                        $$(oOU).attr("name", deptName);		// 부서 명
			                        
			                        $$(oPerson).attr("code", SessionObj["USERID"]);		// 사용자 id
			                        $$(oPerson).attr("name", SessionObj["USERNAME"]);		// 사용자 명
			                        $$(oPerson).attr("position", SessionObj["UR_JobPositionCode"] + ";" + SessionObj["UR_JobPositionName"]);							// position 코드;position 명
			                        $$(oPerson).attr("title", SessionObj["UR_JobTitleCode"] + ";" + SessionObj["UR_JobTitleName"]);				// title 코드;title 명
			                        $$(oPerson).attr("level", SessionObj["UR_JobLevelCode"] + ";" + SessionObj["UR_JobLevelName"]);								// level 코드;level 명
			                        $$(oPerson).attr("oucode", deptID);			// 부서 id
			                        $$(oPerson).attr("ouname", deptName);		// 부서 명
			                        $$(oPerson).attr("sipaddress", SessionObj["UR_Mail"]);		// 사용자 이메일
			                        
			                        $$(oTaskinfo).attr("status", (bHold == true ? "reserved" : "pending")); //201108
			                        $$(oTaskinfo).attr("result", (bHold == true ? "reserved" : "pending")); //201108
			                        $$(oTaskinfo).attr("kind", "charge");
			                        $$(oTaskinfo).attr("datereceived", XFN_getDateTimeString("yyyy-MM-dd HH:mm:ss", new Date()));			// 현재 시각
			                        if (bHold) $$(oTaskinfo).append(oComment); //201108
			                        
			                        $$(oPerson).append("taskinfo", oTaskinfo);
			                        
			                        $$(oOU).append("person", oPerson);
			                        
			                        $$(oStep).append("ou", oOU);
			                        
			                        $$(oCurrentOUNode).append("step", oStep);
			                        
								}/*else if(formSubKind == "AS"){		// 부서협조
									//TODO
								}*/
								
		                        $$(oApprovalList).find("approvalList[ProcessID='"+$$(obj).attr("ProcessID")+"']").append("ApvLine", oApvList);
							});
							approvalList = $$(oApprovalList).find("approvalList").json();
							doEngineBatchApproval(approvalList, approvalType, apvToken, authKey);
						}else{
							Common.Inform(coviDic.dicMap["msg_apv_319"]);
							
							setDocreadCount(approvalType);
							
							if(typeof(setAccountDocreadCount) != "undefined") {
								setAccountDocreadCount();
							}
							
							if(typeof(setSubMenu) != "undefined") {
								setSubMenu();
							}
							
							ListGrid.reloadList();
						}
					},
					error:function(response, status, error){
						CFN_ErrorAjax("/approval/getBatchApvLine.do", response, status, error);
					}
				});
			}else{
				Common.Inform(coviDic.dicMap["msg_apv_319"]);
				ListGrid.reloadList();
			}
		}else{
			var processIDs = new Array();
			
			var oApprovalList = {"approvalList" : approvalList};			
			if($$(oApprovalList).find("approvalList").concat().length > 0)
				processIDs = $$(oApprovalList).find("approvalList").concat().attr("ProcessID");
			
			// 체크항목 결재선 조회
			if($$(oApprovalList).find("approvalList").concat().length > 0){
				$.ajax({
					url:"/approval/getBatchApvLine.do",
					data: {
						"processIDArr" : processIDs.toString()
					},
					type:"post",
					success:function (res) {
						if(res.length > 0){
							// 각 데이터에 결재선 데이터 포함
							$(res).each(function(i, obj){
								arrDomainDataList[$$(obj).attr("ProcessID")] = obj.DomainDataContext;
							});
							
							doEngineBatchApproval(approvalList, approvalType, apvToken, authKey);
						}else{
							Common.Inform(coviDic.dicMap["msg_apv_319"]);
							
							setDocreadCount(approvalType);
							
							if(typeof(setAccountDocreadCount) != "undefined") {
								setAccountDocreadCount();
							}
							
							if(typeof(setSubMenu) != "undefined") {
								setSubMenu();
							}
							
							ListGrid.reloadList();
						}
					},
					error:function(response, status, error){
						CFN_ErrorAjax("/approval/getBatchApvLine.do", response, status, error);
					}
				});
			}else{
				Common.Inform(coviDic.dicMap["msg_apv_319"]);
				ListGrid.reloadList();
			}
		}
	}

	// 일괄결재 진행
	var doEngineBatchApprovalCnt = 0;
	var errorCnt = 0;
	/**
	 * 일괄결재 진행
	 * @param approvalList
	 * @param approvalType
	 */
	
	function doEngineBatchApproval(approvalList, approvalType, apvToken, authKey){
		doEngineBatchApprovalCnt =0;
		errorCnt = 0;
		
		// 일괄결재 API 호출
		Common.Progress();
		
		var sSign = getUserSignInfo(SessionObj["USERID"]);
		$(approvalList).each(function(i, obj){
			var actionMode = "";
			var subkind = obj.FormSubKind;
			var taskId = obj.TaskID;
			var mode = "APPROVAL";
			
			if(subkind == "T009" || subkind == "T004"){		// 합의 및 협조
				actionMode = "AGREE";
				mode = "PCONSULT";
			}else if((subkind == "C" || subkind == "AS" || subkind == "AD") && approvalType == "DEPT"){
				actionMode = "REDRAFT";
				mode = "SUBREDRAFT";
			}else if(subkind == "T016"){
				actionMode = "APPROVAL";
				mode = "AUDIT";
			}else if(subkind == "T008"){
				actionMode = "APPROVAL";
				mode = "REDRAFT";
			}else{
				actionMode = "APPROVAL";
				if(obj.ProcessName == "Sub"){
					mode = "SUBAPPROVAL";
				}else{
					mode = "APPROVAL";
				}
			}
			
		    var sJsonData = {};
		    
		    $.extend(sJsonData, {"mode": mode});
		    $.extend(sJsonData, {"subkind": subkind});
		    $.extend(sJsonData, {"taskID": taskId});
	    	$.extend(sJsonData, {"FormInstID" : obj.FormInstID});
		    $.extend(sJsonData, {"actionMode": actionMode});
		    $.extend(sJsonData, {"actionComment": ""});
		    $.extend(sJsonData, {"actionComment_Attach": "[]"});
		    $.extend(sJsonData, {"signimagetype" : sSign});
		    $.extend(sJsonData, {"gloct" : ""});
		    $.extend(sJsonData, {"isBatch": "Y"}); // 일괄결재 표시여부
		    $.extend(sJsonData, {"processName": obj.ProcessName}); //프로세스이름
		    $.extend(sJsonData, {"g_password" : apvToken});
		    $.extend(sJsonData, {"g_authKey" : authKey});
		    $.extend(sJsonData, {"formID" : obj.FormID});
		    
		    if(obj.ApvLine != undefined){
		    	$.extend(sJsonData, {"processID" : obj.ProcessID});
		    	$.extend(sJsonData, {"ChangeApprovalLine" : obj.ApvLine});
		    }
		    
		    // 대결자가 결재하는 경우 결재선 변경
		    if(arrDomainDataList[obj.ProcessID] != null && arrDomainDataList[obj.ProcessID] != undefined) {
		    	var apvList = setDeputyList(mode, subkind, taskId, actionMode, "", obj.FormInstID, "N", obj.ProcessID, obj.UserCode);
			    
			    if(apvList != arrDomainDataList[obj.ProcessID]){
			    	$.extend(sJsonData, {"processID" : obj.ProcessID});
			    	$.extend(sJsonData, {"ChangeApprovalLine" : apvList});
			    }	
		    }
		    
		    var formData = new FormData();
		    // 양식 기안 및 승인 정보
		    formData.append("formObj", JSON.stringify(sJsonData));
			
			setTimeout(function(){
				$.ajax({
					url:"/approval/draft.do",
					data: formData,
					type:"post",
					dataType : 'json',
					processData : false,
			        contentType : false,
					success:function (res) {
						++doEngineBatchApprovalCnt;
						if((res.status == "FAIL" && res.message.indexOf("NOTASK")<0) || res.status == "FAIL")
							errorCnt++;
						
						if(doEngineBatchApprovalCnt == approvalList.length){
							if(errorCnt > 0)
								Common.Warning(coviDic.dicMap["msg_BatchApprovalResult"].replace("{0}", approvalList.length).replace("{1}", errorCnt));
							else
								Common.Inform(coviDic.dicMap["msg_apv_alert_006"]);
							
							setDocreadCount(approvalType == "DEPT" ? approvalType : "USER");
							
							if(typeof(setAccountDocreadCount) != "undefined") {
								setAccountDocreadCount();
							}
							
							if(typeof(setSubMenu) != "undefined") {
								setSubMenu();
							}
							
							ListGrid.reloadList();
							
							if(ListGrid.page.pageSize * (ListGrid.page.pageNo-1) == (ListGrid.page.listCount-1) ){
								$("input[id=AXPaging][value="+(ListGrid.page.pageNo-1)+"]").click();
							}
						}
					},
					error:function(response, status, error){
						CFN_ErrorAjax("/approval/draft.do", response, status, error);
					}
				});
			}, 500);
		});
		
		if($(approvalList).length == 0){
			Common.Inform(coviDic.dicMap["msg_apv_319"]);
			
			setDocreadCount(approvalType == "DEPT" ? approvalType : "USER");
			
			if(typeof(setAccountDocreadCount) != "undefined") {
				setAccountDocreadCount();
			}
			
			if(typeof(setSubMenu) != "undefined") {
				setSubMenu();
			}
			
			ListGrid.reloadList();
		}
	}
	
	var g_dicFormInfo = new Dictionary();
	g_dicFormInfo.Add("Request.mode","DEPTLIST");
	g_dicFormInfo.Add("CLSYS","approval");
	g_dicFormInfo.Add("etid","A1");
	/*if(CFN_GetQueryString("CLSYS").toLowerCase() == "approval") {
		function getInfo(sKey) { try { return g_dicFormInfo.item(sKey); } catch (e) { Common.Warning(gMessage254 + sKey + gMessage255); } } //"양식정보에 없는 키값["+sKey+"]입니다."
	}*/
	
	// 일괄결재선
	var batchApvLineGrid;
	/**
	 * 일괄결재선
	 * @param approvalList
	 */
	function BatchApvLine(approvalList){
		
		//일괄 결재 사용을 하지 않는 문서는 체크 제외
		var excludeItem = false;
		$.each(approvalList.getCheckedListWithIndex(1), function(idx,obj){
			if(typeof obj.item.ExtInfo == 'undefined'  || obj.item.ExtInfo.UseBlocApprove != 'Y'){
				excludeItem = true;
				approvalList.checkedColSeq(1,false,obj.index);
			}
		});
		
		var msgWarning = '';

		if(excludeItem){
			msgWarning += coviDic.dicMap["msg_blocApprove"];  	//일괄결재를 지원하지 않는 양식은 항목에서 제외됩니다.
			msgWarning += "\n";
		}
		msgWarning += coviDic.dicMap["msg_apv_003"]; //선택된 항목이 없습니다.
		
		var checkApprovalList = approvalList.getCheckedList(1);
		if(checkApprovalList.length == 0){
			Common.Warning(msgWarning);
		}else if(checkApprovalList.length > 0){

			batchApvLineGrid = checkApprovalList;
			
			var strApvListBATCH = {};
			
			var deptID = SessionObj["DEPTID"];
	        var deptName = SessionObj["DEPTNAME"];
			
	        var oSteps = {};
			var oTaskInfo = {};
			var oDivision = {};
			var oStep = {};
			var oOu = {};
			var oPerson = {};
			var oPTaskInfo = {};
			
			$$(oTaskInfo).attr("kind", "receive");
			$$(oTaskInfo).attr("result", "pending");
			$$(oTaskInfo).attr("status", "pending");
			
			$$(oDivision).append("taskinfo", $$(oTaskInfo).json());
			
			$$(oStep).attr("name", "담당부서");
			$$(oStep).attr("unittype", "person");
			$$(oStep).attr("routetype", "approve");
			
			$$(oOu).attr("name", deptName);
			$$(oOu).attr("code", deptID);
			
			$$(oPerson).attr("code", SessionObj["USERID"]);		// 사용자 id
	        $$(oPerson).attr("name", SessionObj["USERNAME"]);		// 사용자 명
	        $$(oPerson).attr("position", SessionObj["UR_JobPositionCode"] + ";" + SessionObj["UR_JobPositionName"]);							// position 코드;position 명
	        $$(oPerson).attr("title", SessionObj["UR_JobTitleCode"] + ";" + SessionObj["UR_JobTitleName"]);				// title 코드;title 명
	        $$(oPerson).attr("level", SessionObj["UR_JobLevelCode"] + ";" + SessionObj["UR_JobLevelName"]);								// level 코드;level 명
	        $$(oPerson).attr("oucode", deptID);			// 부서 id
	        $$(oPerson).attr("ouname", deptName);		// 부서 명
	        $$(oPerson).attr("sipaddress", SessionObj["UR_Mail"]);		// 사용자 이메일
			
	        $$(oPTaskInfo).attr("kind", "charge");
			$$(oPTaskInfo).attr("result", "pending");
			$$(oPTaskInfo).attr("status", "pending");
			$$(oPTaskInfo).attr("datereceived", XFN_getDateTimeString("yyyy-MM-dd HH:mm:ss", new Date()));			// 현재 시각
			
			$$(oPerson).append("taskinfo", $$(oPTaskInfo).json());
	        
			$$(oOu).append("person", $$(oPerson).json());
			
			$$(oStep).append("ou", $$(oOu).json());
			
			$$(oDivision).append("step", $$(oStep).json());
			
			$$(oDivision).attr("name", "수신");
			$$(oDivision).attr("divisiontype", "receive");
			
			$$(oSteps).append("division", $$(oDivision).json());
			
			$$(strApvListBATCH).append("steps", $$(oSteps).json());
			
			document.getElementById("APVLIST").value = JSON.stringify($$(strApvListBATCH).json());
			
		    var iHeight = 580;
		    var iWidth = 1110;
		    var sSize = "fix";
		    
		    var sUrl = "/approval/approvalline.do";
		    CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
		}
	}
	
	/**
	 * 일괄결재선 조직도에서 확인 버튼
	 * @param approvalType
	 */
	function goBatchApvLine(approvalType){
		//if(confirm(coviDic.dicMap["msg_127"))){				// 처리 하시겠습니까?
			// 결재 비밀번호 사용여부
			if(chkCommentWrite("")){
				Common.Password(coviDic.dicMap["msg_apv_508"], null, coviDic.dicMap["lbl_apv_ApvPwd_Check"], function (apvToken) {
					if (apvToken) {
						if(chkCommentWrite(apvToken)){
							// 결재 진행
							switchBacthApvLine(batchApvLineGrid, approvalType,apvToken,this.g_authKey);
						}else{
							// 비밀번호 틀림
							Common.Warning(coviDic.dicMap["msg_PasswordChange_02"]);
						}
                    }
				});
			}else{
				switchBacthApvLine(batchApvLineGrid, approvalType);
			}
		//}
	}
	
	/**
	 * 일괄결재선 결재선 수정
	 * @param approvalList
	 * @param approvalType
	 */
	function switchBacthApvLine(approvalList, approvalType, apvToken, authKey){

		var apvToken = apvToken || "";
		var authKey = authKey || "";
		
		if(approvalType == "DEPT"){
			var processIDs = new Array();
			
			$(approvalList).each(function(i,obj){
				processIDs.push($$(obj).attr("ProcessID"));
			});
			
			// 체크항목 결재선 조회
			$.ajax({
				url:"/approval/getBatchApvLine.do",
				data: {
					"processIDArr" : processIDs.toString()
				},
				type:"post",
				success:function (res) {
					if(res.length > 0){
						// 각 데이터에 결재선 데이터 포함
						var oApprovalList = {"approvalList" : approvalList};
						$(res).each(function(i, obj){
							var oApvList = obj.DomainDataContext;
							var addApvList = $.parseJSON(document.getElementById("APVLIST").value);

							var formSubKind = $$(oApprovalList).find("approvalList[ProcessID='"+$$(obj).attr("ProcessID")+"']").attr("FormSubKind");
							
							if(formSubKind == "R"){				//부서수신
								$$(oApvList).find("division[processID='"+$$(obj).attr("ProcessID")+"']").find("step").remove();
								$$(oApvList).find("division[processID='"+$$(obj).attr("ProcessID")+"']").append("step", $$(addApvList).find("step").json());
							}else if(formSubKind == "C" || formSubKind == "AS"){		//부서합의
								var oStep;
								
								oStep = $$(addApvList).find("step>ou>person");
								
								// 재기안자 정보 수정
								$$(oStep).concat().eq(0).find("taskinfo").attr("result", "inactive");
								$$(oStep).concat().eq(0).find("taskinfo").attr("status", "inactive");
								$$(oStep).concat().eq(0).find("taskinfo").remove("datereceived");
								
								$$(oApvList).find("division").find("step>ou[code='"+SessionObj["DEPTID"]+"']").has("taskinfo[result=pending]").append("person", $$(oStep).json());
							}else{
								
							}
							
	                        $$(oApprovalList).find("approvalList[ProcessID='"+$$(obj).attr("ProcessID")+"']").append("ApvLine", oApvList);
						});
						approvalList = $$(oApprovalList).find("approvalList").json();
						doEngineBatchApproval(approvalList, approvalType, apvToken, authKey);
					}else{
						Common.Inform(coviDic.dicMap["msg_apv_319"]);
						
						setDocreadCount(approvalType);
						
						if(typeof(setAccountDocreadCount) != "undefined") {
							setAccountDocreadCount();
						}
						
						if(typeof(setSubMenu) != "undefined") {
							setSubMenu();
						}
						
						ListGrid.reloadList();
					}
				},
				error:function(response, status, error){
					CFN_ErrorAjax("/approval/getBatchApvLine.do", response, status, error);
				}
			});
		}else{
			doEngineBatchApproval(approvalList, approvalType, apvToken, authKey);
		}
	}

	/**
	 * 일괄확인
	 * @param gridObj
	 */
	function BatchCheck(gridObj){
		strPiid_List = "";
		strWiid_List = "";
		strFiid_List = "";
		strPtid_List = "";
		strKind_List = "";
		
		strBizData2_List = "";
		strTaskID_List = "";
		
		var str_mode = g_mode.toUpperCase();
		
		var excludeItem = false;
		
		if (document.getElementById("bstored") != null && document.getElementById("bstored").value == "true") {
		} else {
		$.each(gridObj.getCheckedListWithIndex(1), function(idx,obj){
			if(typeof obj.item.ExtInfo == 'undefined'  || obj.item.ExtInfo.UseBlocCheck != 'Y'){
				excludeItem = true;
				gridObj.checkedColSeq(1,false,obj.index);
			}
		});
		}
		
		var msgWarning = '';
		if(excludeItem){
			msgWarning += coviDic.dicMap["msg_blocCheck"];		//일괄확인을 지원하지 않는 양식은 항목에서 제외됩니다.
			msgWarning += "\n";
		}
		msgWarning += coviDic.dicMap["msg_apv_003"];			//선택된 항목이 없습니다.
		
		// 체크된 항목 확인
		//var checkCheckList = gridObj.getCheckedList(0);
		var checkCheckList = gridObj.getCheckedList(1);
		if(checkCheckList.length == 0){
			Common.Warning(msgWarning);
		}else if(checkCheckList.length > 0){
			// 양식 오픈
			for(var i = 0; i < checkCheckList.length; i++){
				//if(mnid_chk == "477" || mnid_chk == "478" || mnid_chk == "479" || mnid_chk == "483"){
				if(str_mode == "PREAPPROVAL" || str_mode == "APPROVAL" || str_mode == "PROCESS" || str_mode == "TCINFO" || str_mode == "DEPTTCINFO"){
					strPiid_List += checkCheckList[i].ProcessID == "undefined" || checkCheckList[i].ProcessID == undefined ? ";" : checkCheckList[i].ProcessID + ";";
					strWiid_List += checkCheckList[i].WorkItemID == "undefined" || checkCheckList[i].WorkItemID == undefined ? ";" : checkCheckList[i].WorkItemID + ";";
				}else{
					strPiid_List += checkCheckList[i].ProcessArchiveID == "undefined" || checkCheckList[i].ProcessArchiveID == undefined ? ";" : checkCheckList[i].ProcessArchiveID + ";";
					strWiid_List += checkCheckList[i].WorkitemArchiveID == "undefined" || checkCheckList[i].WorkitemArchiveID == undefined ? ";" : checkCheckList[i].WorkitemArchiveID + ";";
				}
				
				if(str_mode == "DEPTTCINFO") {
					strPtid_List += checkCheckList[i].ReceiptID == "undefined" || checkCheckList[i].ReceiptID == undefined ? ";" : checkCheckList[i].ReceiptID + ";";
				} else {
					strPtid_List += checkCheckList[i].UserCode == "undefined" || checkCheckList[i].UserCode == undefined ? ";" : checkCheckList[i].UserCode + ";";
				}

				
				strFiid_List += checkCheckList[i].FormInstID == "undefined" || checkCheckList[i].FormInstID == undefined ? ";" : checkCheckList[i].FormInstID + ";";
				/*strPtid_List += checkCheckList[i].UserCode == "undefined" || checkCheckList[i].UserCode == undefined ? ";" : checkCheckList[i].UserCode + ";";*/
				strKind_List += checkCheckList[i].FormSubKind == "undefined" || checkCheckList[i].FormSubKind == undefined ? ";" : checkCheckList[i].FormSubKind + ";";
				
				strBizData2_List += checkCheckList[i].BusinessData2 == "undefined" || checkCheckList[i].BusinessData2 == undefined ? ";" : checkCheckList[i].BusinessData2 + ";";
				strTaskID_List += checkCheckList[i].TaskID == "undefined" || checkCheckList[i].TaskID == undefined ? ";" : checkCheckList[i].TaskID + ";";
			}
			
			var mode = "";
			var ProcessID = strPiid_List.split(";")[0];
			var WorkItemID = strWiid_List.split(";")[0];
			var FormInstID = strFiid_List.split(";")[0];
			var userID = "";
			var UserCode = strPtid_List.split(";")[0];
			var Kind = strKind_List.split(";")[0];
			
			var BizData2 = strBizData2_List.split(";")[0];
			var TaskID = strTaskID_List.split(";")[0];
			
			var archived = "false";
			var bstored = "false";
			
			//switch (mnid_chk){
			switch (str_mode){
				case "PREAPPROVAL" : 		// 예고함
					mode="PREAPPROVAL";
					gloct = "PREAPPROVAL";
					userID=UserCode;
					break;
				case "APPROVAL" :    // 미결함
					mode="APPROVAL";
					gloct = "APPROVAL";
					userID=UserCode;
					break;
				case "PROCESS" :		// 진행함
					mode="PROCESS";
					gloct = "PROCESS";
					userID=UserCode;
					break;
				case "COMPLETE" : 	// 완료함
					mode="COMPLETE"; 
					gloct = "COMPLETE"; 
					archived="true"; 
					userID=UserCode; 
					if (document.getElementById("bstored") != null && document.getElementById("bstored").value == "true") {
						bstored = "true";
					}
					break;
				case "REJECT" : 		// 반려함
					mode="REJECT"; 
					gloct = "REJECT";
					archived="true"; 
					userID=UserCode; 
					break;
				case "TCINFO" :		// 참조/회람함 
					mode="COMPLETE";
					gloct = "TCINFO";
					archived = "";
					userID=UserCode;
if (document.getElementById("bstored") != null && document.getElementById("bstored").value == "true") {
						bstored = "true";
					}
					break;
				case "DEPTTCINFO" :		// 참조/회람함 
					mode="COMPLETE";
					gloct = "DEPART";
					archived = "";
					userID=UserCode;
					if (document.getElementById("bstored") != null && document.getElementById("bstored").value == "true") {
						bstored = "true";
					}
					break;
				case "DEPTCOMPLETE":	// 부서 참조/회람함(이관함)
					mode="COMPLETE"; 
					gloct = "COMPLETE"; 
					archived="true"; 
					userID=UserCode;
					if (document.getElementById("bstored") != null && document.getElementById("bstored").value == "true") {
						bstored = "true";
					}
					break;
			}
			var width = 1070; //일괄확인 가로양식으로 띄우기

			if(excludeItem){
				Common.Warning(coviDic.dicMap["msg_blocCheck"],"Warning",function(ret){	//일괄확인을 지원하지 않는 양식은 항목에서 제외됩니다.
					CFN_OpenWindow("/approval/approval_Form.do?mode="+mode+"&processID="+ProcessID+"&workitemID="+WorkItemID+"&userCode="+userID+"&gloct="+gloct+"&forminstanceID="+FormInstID+"&admintype=&archived="+archived+"&usisdocmanager=true&listpreview=N"+"&subkind="+Kind+"&ExpAppID="+BizData2+"&taskID="+TaskID, "", width, (window.screen.height - 100), "resize");
				}); 
			}else{
				CFN_OpenWindow("/approval/approval_Form.do?mode="+mode+"&processID="+ProcessID+"&workitemID="+WorkItemID+"&userCode="+userID+"&gloct="+gloct+"&forminstanceID="+FormInstID+"&admintype=&archived="+archived+"&usisdocmanager=true&listpreview=N"+"&subkind="+Kind+"&ExpAppID="+BizData2+"&taskID="+TaskID+"&bstored="+bstored, "", width, (window.screen.height - 100), "resize");
			}
		}else{
			Common.Error(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
		}
	}
	
	/**
	 * 삭제
	 */
	function DeleteCheck(gridObj,type){
		// 체크된 항목 확인
		var checkCheckList 		= gridObj.getCheckedList(1);
		var FormInstIdTemp 		= []; //임시함Form인서트아이디
		var FormInstId 	   		= "";
		var FormInstBoxIdTemp 	= []; //임시함Form인서트박스아이디
		var FormInstBoxId 		= "";
		var WorkItemIdTemp 		= []; //반려함Form인서트박스아이디
		var WorkItemId 			= "";
		//
		if(checkCheckList.length == 0){
			Common.Warning(coviDic.dicMap["msg_apv_003"]);				//선택된 항목이 없습니다.
		}else if(checkCheckList.length > 0){
			//
			if(type == "TempSave"){ //임시함
				for(var i = 0; i < checkCheckList.length; i++){
					FormInstIdTemp.push(checkCheckList[i].FormInstID)
					FormInstBoxIdTemp.push(checkCheckList[i].FormTempInstBoxID)
				}
				FormInstId = FormInstIdTemp.join(",");
				FormInstBoxId = FormInstBoxIdTemp.join(",");
				//
			}else{ //반려함
				for(var i = 0; i < checkCheckList.length; i++){
					WorkItemIdTemp.push(checkCheckList[i].WorkitemArchiveID);
				}
				WorkItemId = WorkItemIdTemp.join(",");
			}
			Common.Confirm(coviDic.dicMap["msg_apv_093"], "Inform", function (result) {
				if (result) {
					$.ajax({
						url:"/approval/deleteTempSaveList.do",
						type:"post",
						data:{
			 				"FormInstId":FormInstId,
			 				"FormInstBoxId":FormInstBoxId,
			 				"WorkItemId":WorkItemId,
			 				"type":type
							},
						async:false,
						success:function (res) {
							ListGrid.reloadList(); //Grid만 reload되도록 변경
						},
						error:function(response, status, error){
							CFN_ErrorAjax("/approval/deleteTempSaveList.do", response, status, error);
						}
					});
				}
			});
		}else{
			Common.Error(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
		}
	}
	
	/* 엑셀저장 */
	/**
	 * 함 엑설저장
	 * @param selectParams
	 * @param headerData
	 * @param listCount
	 */
	function ExcelDownLoad(selectParams, headerData, listCount){
		var queryID = "";
		var title = "";
		
		switch (g_mode.toUpperCase()){
		case "APPROVAL":									// 개인 - 미결함
			queryID = "selectApprovalListExcel";
			title = "ApprovalBoxList";
			break;
		case "PROCESS":										// 개인 - 진행함
			queryID = "selectProcessListExcel";
			title = "ProcessBoxList";
			break;
		case "COMPLETE":									// 개인 - 완료함
			queryID = "selectCompleteListExcel";
			if (typeof(g_submode) != "undefined" && g_submode == "Admin") // 2020-12-02 이관문서)
				queryID = "selectCompleteListExcelStoreAdmin";
			title = "CompleteBoxList";
			break;
		case "REJECT":											// 개인 - 반려함
			queryID = "selectRejectListExcel";
			title = "RejectBoxList";
			break;
		case "TCINFO":										// 개인 - 참조회람함
			queryID = "selectTCInfoListExcel";
			title = "TCInfoBoxList";
			break;
		case "RECEXHIBIT":									// 개인 - 수신공람함
			queryID = "selectReceiveExhibitListExcel";
			title = "RecExhibitBoxList";
			break;
		case "DEPTCOMPLETE":					// 부서 - 완료함
			queryID = "selectDeptDraftCompleteListExcel";		
			title = "DeptDraftCompleteBoxList";
			break;
		case "SENDERCOMPLETE":					// 부서 - 발신함
			queryID = "selectDeptSenderCompleteListExcel";
			title = "DeptSenderCompleteBoxList";
			break;
		case "RECEIVE":								// 부서 - 수신함
			queryID = "selectDeptReceiveListExcel";
			title = "DeptReceiveBoxList";
			break;
		case "RECEIVECOMPLETE":					// 부서 - 수신처리함
			queryID = "selectDeptReceiveCompleteListExcel";
			title = "DeptReceiveCompleteBoxList";
			break;
		case "DEPTTCINFO":									// 부서 - 참조회람함
			queryID = "selectDeptTCInfoListExcel";
			title = "DeptTCInfoBoxList";
			break;
		case "DEPTPROCESS":					// 부서 - 진행함
			queryID = "selectDeptReceiveProcessListExcel";
			title = "DeptReceiveProcessBoxList";
			break;
		case "DEPTRECEXHIBIT":					// 부서 - 수신공람함
			queryID = "selectDeptReceiveExhibitListExcel";
			title = "DeptReceiveExhibitBoxList";
			break;
		case "JOBAPPROVAL":								// 담당업무 - 미결함
			queryID = "selectJobFunctionApprovalListExcel";
			title = "JobFunction_ApprovalList";
			break;
		case "JOBPROCESS":								// 담당업무 - 진행함
			queryID = "selectJobFunctionProcessListExcel";
			title = "JobFunction_ProcessList";
			break;
		case "JOBCOMPLETE":								// 담당업무 - 완료함
			queryID = "selectJobFunctionCompleteListExcel";
			title = "JobFunction_CompleteList";
			break;
		case "JOBREJECT":									// 담당업무 - 반려함
			queryID = "selectJobFunctionRejectListExcel";
			title = "JobFunction_RejectList";
			break;
		case "AUDITDEPT":									// 감사함
			queryID = "selectAuditDeptCompleteListExcel";
			title = "AuditDeptCompleteBoxList";
			break;
		case "BIZDOCPROCESS":								// 업무문서함 - 진행함
			queryID = "selectBizDocProcessListExcel";
			title = "BizDoc_ProcessList";
			break;
		case "BIZDOCCOMPLETE":								// 업무문서함 - 완료함
			queryID = "selectBizDocCompleteListExcel";
			title = "BizDoc_CompleteList";
			break;
		}
		
		if(listCount == 0){
			Common.Warning(coviDic.dicMap["msg_apv_279"]);							//저장할 문서가 없습니다.
		}else if(listCount > 0){
			if(confirm(coviDic.dicMap["msg_ExcelDownMessage"])){
				location.href = "/approval/user/approvalListExcelDownload.do?"
					+"selectParams="+encodeURIComponent(JSON.stringify(selectParams))
					+"&queryID="+queryID
					+"&title="+title
					+"&approvalListType="+approvalListType
					+"&headerkey="+encodeURIComponent(headerData[0])
					+"&headername="+encodeURIComponent(encodeURIComponent(headerData[1]))			// 한글 깨짐 문제 때문에 두번 encode
					+"&bstored="+bstored; // 이관문서
			}
		}else{
			Common.Error(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
		}
	}

	
	/**
	 * 엑셀 저장시 필요한 헤더값 저장
	 * 반드시 Grid의 Header 변수는 jsp 의 스크립트에서 전역 변수로 "headerData"로 선언해야 함
	 */
	function getHeaderDataForExcel(){
		var returnArr = new Array();
		var headerKey = "";
		var headerName = "";
		
		//Grid List 내부에 이미지와 상세정보가 제목 내부에 표시될경우 header의 정보를 참조하지 않음
		if($(".listinfo").length>0){
			//if(mnid==479){
			if(g_mode.toUpperCase() == "PROCESS"){
				headerKey = "SubKind,FormSubject,InitiatorUnitName,InitiatorName,Finished,FormName,";
			}else{
				headerKey = "SubKind,FormSubject,InitiatorUnitName,InitiatorName,Created,FormName,";
			}
			headerName = String.format("{0};{1};{2};{3};{4};{5};",coviDic.dicMap["lbl_apv_gubun"],coviDic.dicMap["lbl_apv_subject"],coviDic.dicMap["lbl_DraftDept"],coviDic.dicMap["lbl_apv_writer"],coviDic.dicMap["lbl_RepeateDate"],coviDic.dicMap["lbl_FormNm"]);
		} else {
			for(var i=0;i<headerData.length; i++){
				if(headerData[i].key != "showInfo"){
					if(headerData[i].formatter != "checkbox"){
						headerKey += headerData[i].key + ",";
						headerName += headerData[i].label + ";";
					}
				}
			}
		}
		
		returnArr.push(headerKey.slice(0,-1));
		returnArr.push(headerName);
		return returnArr;
	}
	/**
	 * 엑셀 저장시 필요한 헤더값 저장
	 * 반드시 Grid의 Header 변수는 jsp 의 스크립트에서 전역 변수로 "headerData"로 선언해야 함
	 */
	function getHeaderDataForExcel_Eac(){
		var returnArr = new Array();
		var headerKey = "";
		var headerName = "";
		if($(".listinfo").length>0)
		{
			if(g_mode.toUpperCase() == "PROCESS"){
				headerKey = "SubKind,FormSubject,InitiatorUnitName,InitiatorName,Finished,FormName,";
			}else{
				headerKey = "SubKind,FormSubject,InitiatorUnitName,InitiatorName,Created,FormName,";
			}
			headerName = String.format("{0};{1};{2};{3};{4};{5};",coviDic.dicMap["lbl_apv_gubun"],coviDic.dicMap["lbl_apv_subject"],coviDic.dicMap["lbl_DraftDept"],coviDic.dicMap["lbl_apv_writer"],coviDic.dicMap["lbl_RepeateDate"],coviDic.dicMap["lbl_FormNm"]);
			
		}
		
		for(var i=0;i<headerData.length; i++){
			if(headerKey.indexOf(headerData[i].key)>-1)
				continue;
			if(headerData[i]['showExcel']){//true
				if(headerData[i].formatter != "checkbox"){
					headerKey += headerData[i].key + ",";
					headerName += headerData[i].label + ";";
				}
			}
		}
		
		returnArr.push(headerKey.slice(0,-1));
		returnArr.push(headerName);
		return returnArr;
	}
	
	//탭 구조일 경우 처리
	var _func = $;
	if($("#tab").css("display") != "none" && $(".l-contents-tabs").css("display") != undefined && $(".l-contents-tabs").css("display") != "none") {
		_func = accountCtrl.getInfoStr;
	}

	/* 검색 관련 세팅 함수 */
	/* approvalListType :
			개인결재함 - user
			부서결재함 - dept
			담당업무함 - jobFunction
			감사문서함 - auditDept
			업무문서함 - bizDoc
			개인폴더함 - userFolder
			관리자:결재문서관리툴 - listAdmin
	 */
	/**
	 * 조회할 때 필요한 Parameter 세팅
	 * @param gridObj
	 */
	function setSelectParams(gridObj){
		
		var seGroupID = _func("#seGroupID");
		var hiddenGroupWord = _func("#hiddenGroupWord");
		var DeputyFromDate = _func("#DeputyFromDate");
		var DeputyToDate = _func("#DeputyToDate");		
		var seSearchID = _func("#seSearchID");
		var searchInput = _func("#searchInput");
		var lowDept = _func("#lowDept");
		
		if(DeputyFromDate.length == 0) {
			DeputyFromDate = _func("#"+g_mode+"DeputyFromDate");
			DeputyToDate = _func("#"+g_mode+"DeputyToDate");
		}
		
		var sePersonID = _func("#sePersonID");
		var titleNm = _func("#titleNm");
		var userNm = _func("#userNm");
		var selectDateType = _func("#selectDateType");
		
		var seFuncId = _func("#seFuncId");
		
		var searchGroupType = (typeof(schFrmSeGroupID) != "undefined" && schFrmSeGroupID != "") ? schFrmSeGroupID : seGroupID.attr("value");
		if (typeof(schFrmSeGroupWord) != "undefined" && schFrmSeGroupWord != "") {
			hiddenGroupWord.val(schFrmSeGroupWord);
		}
		var searchGroupWord = searchGroupType == "all" ? "" : hiddenGroupWord.val();
		var startDate = (typeof(schFrmDeputyFromDate) != "undefined" && schFrmDeputyFromDate != "") ? schFrmDeputyFromDate : DeputyFromDate.val();
		var endDate = (typeof(schFrmDeputyToDate) != "undefined" && schFrmDeputyToDate != "") ? schFrmDeputyToDate : DeputyToDate.val();
		
		// 검색 UI 변경으로 인해 수정
		//var searchType = (typeof(schFrmSeSearchID) != "undefined" && schFrmSeSearchID != "") ? schFrmSeSearchID : seSearchID.attr("value");
		//var searchWord = (typeof(schFrmSearchInput) != "undefined" && schFrmSearchInput != "") ? schFrmSearchInput : searchInput.val();
		
		// 상세검색 열림 여부
		var searchType = "";
		var searchWord = "";
		
		if (_func('#DetailSearch').css('display') == "none") { // all
			searchType = "all";
			searchWord = _func("#searchInput").val();
		} else if (_func('#DetailSearch').css('display') == "block"){ // 상세검색
			searchType = seSearchID.attr("value");
			searchWord = _func("#titleNm").val();
		} else { // _func('#DetailSearch').length == 0, 업무문서함 등 개인&부서결재함 제외
			searchType = (typeof(schFrmSeSearchID) != "undefined" && schFrmSeSearchID != "") ? schFrmSeSearchID : seSearchID.attr("value");
			searchWord = (typeof(schFrmSearchInput) != "undefined" && schFrmSearchInput != "") ? schFrmSearchInput : searchInput.val();
		}
		
		var sortKey = gridObj.nowSortHeadObj==undefined ? "": gridObj.nowSortHeadObj.key //gridObj.nowSortHeadObj.key;
		var sortDirec = gridObj.nowSortHeadObj==undefined ? "": gridObj.nowSortHeadObj.sort;
		var isCheckSubDept = null;
		if(lowDept.prop('checked') == true){
			isCheckSubDept = 1;
		}else{
			isCheckSubDept = 0;
		}
		
		var businessData1 = "APPROVAL";
		if(location.search.split("&")[0].indexOf("CLSYS") > -1) { 
			businessData1 = location.search.split("&")[0].replace("?CLSYS=", "").toUpperCase();
		}
		
		
		//겸직자 법인별 조회 요건 사용 시 처리
		var approvallistCompanyCode;
		if(Common.getBaseConfig("IsUseAddJobApprovalList") == "Y"){
			if(_func("#selCompanyCode").attr("value") == "undefined" || _func("#selCompanyCode").attr("value") == undefined || _func("#selCompanyCode").attr("value") == ""){
				approvallistCompanyCode = "";
			}else{
				approvallistCompanyCode = _func("#selCompanyCode").attr("value");
			}
		}else{
			approvallistCompanyCode="";
		}

		selectParams = {
				"searchType":searchType,
				"searchWord":searchWord,
				"searchGroupType":searchGroupType,
				"searchGroupWord":searchGroupWord,
				"startDate":startDate,
				"endDate":endDate,
				"sortColumn":sortKey,
				"sortDirection":sortDirec,
				"isCheckSubDept":isCheckSubDept,
				"bstored":bstored, // 이관문서 여부
				"businessData1":businessData1,
				"companyCode" : approvallistCompanyCode,
				"submode" : (typeof(g_submode) == "undefined" ? "" : g_submode) // 20210126 이관문서
			};
		if(approvalListType=="user"){
			if(g_mode == "user"){ // 관리자-전자결재-사용자문서보기
				selectParams.userID = _func("#userId").val();
				selectParams.adminYn = ""; //관리자-전자결재-사용자문서보기(구분값 관리자페이지에서는 삭제된 데이터가 보여야함) //[수정] 관리자 페이지에서도 사용자문서보기에서는  보이면 안됨
			}else{ //사용자-전자결재-개인결재함
				var userID = sePersonID.attr("value");
				if(typeof userID == "string" && userID.indexOf(";") > -1){
					userID = userID.split(";")[0];
				}
				if(userID == "undefined" || userID == undefined || userID == "all")
					userID = SessionObj["USERID"];
				
				selectParams.userID = userID;
				
				//selectParams.titleNm = (typeof(schFrmTitleNm) != "undefined" && schFrmTitleNm != "") ? schFrmTitleNm : titleNm.val();
				//selectParams.userNm = (typeof(schFrmUserNm) != "undefined" && schFrmUserNm != "") ? schFrmUserNm : userNm.val();
				
				selectParams.selectDateType = selectDateType.val();
			}
		}else if(approvalListType=="dept"){
			if(g_mode == "dept"){ //관리자-전자결재-부서문서보기
				selectParams.deptID = _func("#deptId").val();
				selectParams.adminYn = ""; //관리자-전자결재-부서문서보기(구분값 관리자페이지에서는 삭제된 데이터가 보여야함) //[수정] 관리자 페이지에서도 사용자문서보기에서는  보이면 안됨
			}else{ //사용자-전자결재-부서결재함
				var deptID = _func("#seDeptID").attr("value");
				if(deptID == "undefined" || deptID == undefined || deptID == "all"){
					deptID = SessionObj["ApprovalParentGR_Code"];
				}else{
					deptID = deptID.split(";")[0];
					
					var sDate = _func("#seDeptID").attr("value").split(";")[1];
					var eDate = _func("#seDeptID").attr("value").split(";")[2];
					
					if(sDate == "0000.00.00")
						sDate = "";
					if(eDate == "0000.00.00")
						eDate = "";

					
					if(sDate != undefined && eDate != undefined){
						if(startDate == undefined || startDate == "" || endDate == undefined || endDate == ""){
							selectParams.startDate = sDate;
							selectParams.endDate = eDate;
						}else if(startDate != undefined && startDate != "" && endDate != undefined && endDate != ""){
							if(startDate < sDate || endDate > eDate){
								Common.Warning("해당 부서에 대해서 조회 가능한 기간은 " + sDate + " 부터 " + eDate + " 까지 입니다.");
								
								selectParams.startDate = sDate;
								selectParams.endDate = eDate;
							}
						}
					}
				}
				
				selectParams.deptID = deptID;
				
				//selectParams.titleNm = (typeof(schFrmTitleNm) != "undefined" && schFrmTitleNm != "") ? schFrmTitleNm : _func("#titleNm").val();
				//selectParams.userNm = (typeof(schFrmUserNm) != "undefined" && schFrmUserNm != "") ? schFrmUserNm : _func("#userNm").val();
				
				selectParams.selectDateType = _func("#selectDateType").val();
			}
		}else if(approvalListType=="jobFunction"){
			viewsrchTop = "330";
			srchTop = "205";
			selectParams.jobFunctionCode = (typeof(schFrmJobFunctionId) != "undefined" && schFrmJobFunctionId != "") ? schFrmJobFunctionId : seFuncId.attr('value');
		}else if(approvalListType=="auditDept"){
			viewsrchTop = "330";
			srchTop = "160";
			
			if (typeof(schFrmDeptID) != "undefined"  && schFrmDeptID != "") {
				_func("#checkDeptId").val(schFrmDeptID);
			}
			selectParams.deptID = _func("#checkDeptId").val();
		}else if(approvalListType=="bizDoc"){
			viewsrchTop = "330";
			srchTop = "205";
			selectParams.bizDocCode = (typeof(schFrmSeBizID) != "undefined" && schFrmSeBizID != "") ? schFrmSeBizID : _func("#seBizID").attr("value");
		}else if(approvalListType=="userFolder"){
			selectParams.userID = SessionObj["USERID"];
			selectParams.folderId = _func("#folderId").val();
			selectParams.folderMode = _func("#folderMode").val();
		}else if(approvalListType=="listAdmin"){
			selectParams.selectEntinfoListData = _func("#selectEntinfoListData").val(); // 계열사코드
			selectParams.selectSearchTypeDate = _func("#selectSearchTypeDate").val(); // 날짜코드
			selectParams.selectSearchTypeDoc = _func("#selectSearchTypeDoc").val(); // 문서코드
		}
	}

	// select box 세팅
	/* mode :
		예고함 - PreApproval
		미결함 - Approval
		진행함 - Process
		완료함 - Complete
		반려함 - Reject
		임시함 - TempSave
		참조/회람함 - TCInfo
		부서완료함 - DeptComplete 
		부서발신함 - SenderComplete 
		부서수신함 - Receive
		부서수신완료함 - DeptReceiveComplete
		부서진행함 - DeptReceiveProcess
		부서참조/회람함 - DeptTCInfo
		담당업무함 - jobFunction
		개인폴더함 - userFolder
		url : 그룹별 검색할 때 데이터 가져오는 URL
	*/
	/**
	 * 함 Select Box 세팅
	 * @param gridObj
	 * @param mode
	 * @param url
	 */
	function setSelect(gridObj, mode, url){
		var groupHtml;
		var searchHtml;
		
		var selectGroupType = _func("#selectGroupType");
		var selectSearchType = _func("#selectSearchType");
				
		// 20210126 이관문서함에서 사용
		var bstored = "false";
		if (document.getElementById("bstored") != null && document.getElementById("bstored").value.toLowerCase() == "true") {
			bstored = document.getElementById("bstored").value.toLowerCase();
		}
		
		$.ajax({
			url:"/approval/user/getApprovalListSelectData.do",
			type:"post",
			data:{"filter": "selectGroupType", "mode":mode},
			async:false,
			success:function (data) {			
				groupHtml = "<span class=\"selTit\" ><a id=\"seGroupID\" onclick=\"clickSelectBox(this);\" value=\""+data.list[0].optionValue+"\" class=\"up\">"+data.list[0].optionText+"</a></span>"
				groupHtml += "<div class=\"selList\" style=\"width:95px;display: none;\">";
				$(data.list).each(function(index){
					// 20210126 이관문서쪽 수정 : 이관문서일때 FormPrefix 는 WF_MIGRATION 으로 고정되어 있어서 다른 양식이라도 하나로 인식됨.
					if (this.optionValue == "FormPrefix" && bstored == "true")
						groupHtml += "<a class=\"listTxt\" value=\"FormName\" onclick=\"clickGroupSelectBoxList(this);\" id=\""+"grp_FormName\">"+this.optionText+"</a>"
					else if (this.optionValue == "InitiatorUnitID" && bstored == "true")
						groupHtml += "<a class=\"listTxt\" value=\"InitiatorUnitName\" onclick=\"clickGroupSelectBoxList(this);\" id=\""+"grp_InitiatorUnitName\">"+this.optionText+"</a>"
					else
					groupHtml += "<a class=\"listTxt\" value=\""+this.optionValue+"\" onclick=\"clickGroupSelectBoxList(this);\" id=\""+"grp_"+this.optionValue+"\">"+this.optionText+"</a>"
				});
				groupHtml += "</div>";
				selectGroupType.html(groupHtml);	
			},
			error:function(response, status, error){
				CFN_ErrorAjax("/approval/user/getApprovalListSelectData.do", response, status, error);
			}
		});

		$.ajax({
			url:"/approval/user/getApprovalListSelectData.do",
			type:"post",
			data:{"filter": "selectSearchType", "mode":mode},
			async:false,
			success:function (data) {
				searchHtml = "<span class=\"selTit\" ><a id=\"seSearchID\" onclick=\"clickSelectBox(this);\" value=\""+data.list[0].optionValue+"\" class=\"up\">"+data.list[0].optionText+"</a></span>"
				searchHtml += "<div class=\"selList\" style=\"width:100px;display: none;\">";
				$(data.list).each(function(index){
					// 20210126 이관문서쪽 수정 : 이관문서일때 본문내용 알 수 없음
					if (this.optionValue == "BodyContextOrg" && bstored == "true") { }
					else
					searchHtml += "<a class=\"listTxt\" value=\""+this.optionValue+"\" onclick=\"clickSelectBox(this);\" id=\""+"sch_"+this.optionValue+"\">"+this.optionText+"</a>"
				});
				
				searchHtml += "</div>";
				selectSearchType.html(searchHtml);
			},
			error:function(response, status, error){
				CFN_ErrorAjax("/approval/user/getApprovalListSelectData.do", response, status, error);
			}
		});

	}

	/***
	 * 그룹별 Select Box
	 * @param pObj
	 */
	function clickGroupSelectBoxList(pObj){
		clickSelectBox(pObj);
		
		ListGrid.bindGrid({page:{pageNo:1,pageSize:10,pageCount:1},list:[]});
		setGroupType(ListGrid, groupUrl);
	}
	
	/* mode :
		사용자문서보기 - user
		부서문기보기 - dept
	*/
	/**
	 * select box 세팅 // 관리자-전자결재-사용자문서확인
	 * @param gridObj
	 * @param mode
	 */
	function setSelectAdmin(gridObj, mode){
		_func("#selectSearchTypeAdmin").bindSelect({
			reserveKeys: {
				options: "list",
				optionValue: "TypeCode",
				optionText: "DisplayName"
			},
			ajaxUrl: "/approval/user/getApprovalListSelectData.do",
			ajaxPars: {"filter": "selectSearchTypeAdmin", "mode":mode},
			ajaxAsync:false,
			onchange: function(){
				trace("change : " + Object.toJSON(this));
				if(mode == "user"){
					if(_func("#userId").val() == ""){
						Common.Warning(coviDic.dicMap["msg_selectretireuser"]);
						return false;
					}
					g_listMode = _func("#selectSearchTypeAdmin").val();
					setGrid();
				}else{
					if(_func("#deptId").val() == ""){
						Common.Warning(coviDic.dicMap["msg_238"]);
						return false;
					}
					g_listMode = _func("#selectSearchTypeAdmin").val();
					setGrid();
				}
			},
		});
	}
	
	/**
	 * 그룹별 보기 Select Box 클릭했을 경우
	 * @param gridObj
	 * @param url
	 */
	function setGroupType(gridObj, url){
		setSelectParams(gridObj);
		
		var groupLiestDiv = _func("#groupLiestDiv");
		var groupLiestArea = _func("#groupLiestArea");
		var DetailSearch = _func("#DetailSearch");
		
		if(selectParams.searchGroupType != "all"){
			var lang = SessionObj["lang"];
			groupLiestDiv.show();
			groupLiestArea.empty();
			
			$.ajax({
				url:url,
				data:selectParams,
				type:"post",
				async: false,
				success: function (res) {					
					if(res.list.length == 0){
						groupLiestArea.css('text-align','center');
						groupLiestArea.append(coviDic.dicMap["msg_NoDataList"]);				//조회할 목록이 없습니다
						ListGrid.bindGrid({page:{pageNo:1,pageSize:10,pageCount:1},list:[]});
					}else if(res.list.length > 0){
						$(res.list).each(function(index){
							groupLiestArea.append("<li><a onclick='setSearchGroupWord(\""+this.fieldID+"\");' id='fieldName_" + this.fieldID + "'>"+CFN_GetDicInfo(this.fieldName,lang)+" ("+this.fieldCnt+")</a></li>");
						});
					}else{
						Common.Error(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
					}
				},
				error:function(response, status, error){
					CFN_ErrorAjax(url, response, status, error);
				}
			});
			groupLiestArea.show();
			//$('#DetailSearch').hide();
			//DetailSearch.removeClass("active");
			
		}else{
			groupLiestDiv.hide();
			groupLiestArea.empty();
			
			try {
				if(accountCtrl.getViewPageDivID().indexOf("JobFunction") > -1 && typeof(setApprovalListData_JF) == "function") {
					setApprovalListData_JF();			
				} else {
					setApprovalListData();
				}	
			} catch(e) {
				setApprovalListData();
			}			
		}
		
		$(".contbox").css('top', $(".content").height());
	}

	/**
	 * 검색 값 Validation Check
	 * @returns {Boolean}
	 */
	function searchValueValidationCheck(){
		var searchType = _func("#seSearchID").attr("value");
		var searchWord = _func("#searchInput").val();
		var searchGroupType = _func("#seGroupID").attr("value");
		var startDate = _func("#startdate").val();
		var endDate = _func("#enddate").val();

		if(searchType=="" && searchWord !=""){
			Common.Warning(coviDic.dicMap["lbl_apv_searchcomment_chang"]);					//검색조건을 선택하세요
			return false;
		}
		return true;
	}

	/**
	 * 개인결재함 특정 사용자 보기 SelectBox 데이터
	 */
	function setSelectPerson(){
		var searchGroupType = null;
		var searchGroupWord = null;
		var deptID;
		var deptHtml;
		
		var selectPerson = _func("#selectPerson");
		
		$.ajax({
			url:"/approval/user/getPersonDirectorOfPerson.do",
			type:"post",
			data:{
				"UserCode":SessionObj["USERID"],
				"EntCode":SessionObj["DN_Code"]
			},
			async:false,
			success:function (data) {
				if(data.list != undefined &&data.list.length > 0){
					selectPerson.show();
					deptHtml = "<span class=\"selTit\" ><a id=\"sePersonID\" onclick=\"clickSelectBox(this);\" value=\""+data.list[0].UserCode+"\" class=\"up\">"+data.list[0].UserName+"</a></span>"
					deptHtml += "<div class=\"selList\" style=\"width:105px;display: none;\">";
					$(data.list).each(function(index){
						var value = this.UserCode;
						/*
						if(this.ViewStartDate != undefined && this.ViewStartDate != "")
							value += ";" + this.ViewStartDate;
						if(this.ViewEndDate != undefined && this.ViewEndDate != "")
							value += ";" + this.ViewEndDate;
						*/
						deptHtml += "<a class=\"listTxt\" value=\""+value+"\" onclick=\"clickPersonSelectBoxList(this);\" id=\""+this.UserCode+"\">"+CFN_GetDicInfo(this.UserName)+"</a>";
					});
					deptHtml += "</div>";
					selectPerson.html(deptHtml);
				}else{
					selectPerson.hide();
				}
			},
			error:function(response, status, error){
				CFN_ErrorAjax("/approval/user/getPersonDirectorOfPerson.do", response, status, error);
			}
		});
	}
	
	/**
	 * 부서결재함 특정 부서 보기 SelectBox 데이터
	 */
	function setSelectDept(){
		var searchGroupType = null;
		var searchGroupWord = null;
		var deptID;
		var deptHtml;
		$.ajax({
			url:"/approval/user/getPersonDirectorOfUnitData.do",
			type:"post",
			data:{
				"UserCode":SessionObj["USERID"],
				"UnitCode":SessionObj["DEPTID"],
				"EntCode":SessionObj["DN_Code"]
			},
			async:false,
			success:function (data) {
				if(data.list != undefined &&data.list.length > 0){
					_func("#selectDept").show();
					deptHtml = "<span class=\"selTit\" ><a id=\"seDeptID\" onclick=\"clickSelectBox(this);\" value=\""+data.list[0].UnitCode+"\" class=\"up\">"+data.list[0].UnitName+"</a></span>"
					deptHtml += "<div class=\"selList\" style=\"width:105px;display: none;\">";
					$(data.list).each(function(index){
						var value = this.UnitCode;
//						if(this.ViewStartDate != undefined && this.ViewStartDate != "")
//							value += ";" + this.ViewStartDate;
//						if(this.ViewEndDate != undefined && this.ViewEndDate != "")
//							value += ";" + this.ViewEndDate;
						
						deptHtml += "<a class=\"listTxt\" value=\""+value+"\" onclick=\"clickDeptSelectBoxList(this);\" id=\""+this.UnitCode+"\">"+CFN_GetDicInfo(this.UnitName)+"</a>";
					});
					deptHtml += "</div>";
					_func("#selectDept").html(deptHtml);
				}else{
					_func("#selectDept").hide();
				}
			},
			error:function(response, status, error){
				CFN_ErrorAjax("/approval/user/getPersonDirectorOfUnitData.do", response, status, error);
			}
		});
	}

	/**
	 * 특정 사용자 보기 SelectBox
	 * @param pObj
	 */
	function clickPersonSelectBoxList(pObj){
		var searchGroupType = null;
		var searchGroupWord = null;
		
		clickSelectBox(pObj);
		
		var searchGroupType = (typeof (schFrmSeGroupID) != "undefined" && schFrmSeGroupID != "") ? schFrmSeGroupID
				: $("#seGroupID").attr("value");
			clickSelectBox($("#seGroupID"));
			clickGroupSelectBoxList($("#selectGroupType").find(".selList > a[value='"+searchGroupType+"']").get(0));

		
		_func("#groupLiestDiv").hide();
		//$('#DetailSearch').hide();
		_func('#DetailSearch').removeClass("active");
		ListGrid.bindGrid({page:{pageNo:1,pageSize:10,pageCount:1},list:[]});
		var userID = "";
		if(_func("#sePersonID").attr("value") != 'all'){
			userID = _func("#sePersonID").attr("value");
			if(userID.indexOf(";") > -1){
				userID = userID.split(";")[0];
			}
		}else if(_func("#sePersonID").attr("value") == "undefined" || _func("#sePersonID").attr("value") == undefined || _func("#sePersonID").attr("value") == "all"){
			userID = SessionObj["USERID"];
		}
		selectParams = {
				"searchGroupType":searchGroupType,
				"searchGroupWord":searchGroupWord,
				"userID":userID,
				"mode":g_mode,
				"bstored":bstored
			};
		_func("#groupLiestArea").hide();
		_func("#groupLiestArea").empty();
		
		var startDate = _func("#sePersonID").attr("value").split(";")[1];
		var endDate = _func("#sePersonID").attr("value").split(";")[2];
		
		if(startDate == "0000.00.00")
			startDate = "";
		if(endDate == "0000.00.00")
			endDate = "";
		
		if(startDate != undefined && startDate != "" && endDate != undefined && endDate != ""){
			$$(selectParams).attr("startDate", startDate.split(" ")[0]);
			$$(selectParams).attr("endDate", endDate.split(" ")[0]);
		}
		
		if(searchValueValidationCheck()){		// 공통 함수
			var url = "/approval/user/getApprovalListData.do";
			
			ListGrid.bindGrid({						//
				ajaxUrl:url,
				ajaxPars: selectParams,
				onLoad: function(){
					$('.gridBodyTable > tbody > tr > td').css('background', 'white');
					$('.AXGrid').css('overflow','visible');
					
					coviInput.init();
					setGridCount();
					if(ListGrid.getCheckedList(1).length<=0){ //일괄 승인시 최상위 체크 박스가 유지되는 문제 해결
						ListGrid.checkedColSeq(1, false);
					}
				}
			});
		}
	}
	
	/**
	 * 특정 부서 보기 SelectBox
	 * @param pObj
	 */
	function clickDeptSelectBoxList(pObj){
		var searchGroupType = null;
		var searchGroupWord = null;
		
		clickSelectBox(pObj);
		
		var searchGroupType = (typeof (schFrmSeGroupID) != "undefined" && schFrmSeGroupID != "") ? schFrmSeGroupID
				: $("#seGroupID").attr("value");
			clickSelectBox($("#seGroupID"));
		clickGroupSelectBoxList($("#selectGroupType").find(".selList > a[value='"+searchGroupType+"']").get(0));
		
		_func("#groupLiestDiv").hide();
		//$('#DetailSearch').hide();
		_func('#DetailSearch').removeClass("active");
		ListGrid.bindGrid({page:{pageNo:1,pageSize:10,pageCount:1},list:[]});
		
		var deptID = _func("#seDeptID").attr("value").split(";")[0];
		if(deptID == "undefined" || deptID == undefined || deptID == "all"){
			deptID = SessionObj["ApprovalParentGR_Code"];
		}
		
		selectParams = {
				"searchGroupType":searchGroupType,
				"searchGroupWord":searchGroupWord,
				"deptID":deptID,
				"mode":g_mode,
				"bstored":bstored
			};
		
		var startDate = _func("#seDeptID").attr("value").split(";")[1];
		var endDate = _func("#seDeptID").attr("value").split(";")[2];
		
		if(["0000.00.00","0000-00-00"].indexOf(startDate) > -1 )			
			startDate = "";
		if(["0000.00.00","0000-00-00"].indexOf(endDate) > -1 )
			endDate = "";
		
		if(startDate != undefined && startDate != "" && endDate != undefined && endDate != ""){
			$$(selectParams).attr("startDate", startDate);
			$$(selectParams).attr("endDate", endDate);
		}
			
		_func("#groupLiestArea").hide();
		_func("#groupLiestArea").empty();
		
		var url = "/approval/user/getDeptApprovalListData.do";
		
		if(searchValueValidationCheck()){		// 공통 함수
			ListGrid.bindGrid({						//
				ajaxUrl:url,
				ajaxPars: selectParams,
				onLoad: function(){
					$('.gridBodyTable > tbody > tr > td').css('background', 'white');
					$('.AXGrid').css('overflow','visible');
					
					coviInput.init();
					setGridCount();
					if(ListGrid.getCheckedList(1).length<=0){ //일괄 승인시 최상위 체크 박스가 유지되는 문제 해결
						ListGrid.checkedColSeq(1, false);
					}
				}
			});
		}
	}

	/**
	 * 복사버튼
	 */
	function onClickFolderListPopup(){
		Common.open("","onClickFolderListPopup",coviDic.dicMap["lbl_apv_userfoldertitle"],"/approval/user/UserFolderListAddPopup.do?&mode=copy","500px","470px","iframe",true,null,null,true);
	}

	/**
	 * 새로운폴더버튼
	 */
	function onClickNewFolderPop(){
		Common.open("","onClickFolderListPopup",coviDic.dicMap["btn_apv_userfolderadd"],"/approval/user/UserNewFolderAddPopup.do?&type=1Lv","350px","150px","iframe",true,null,null,true);
	}
	
	/**
	 * 새로운 하위폴더버튼
	 */
	function onClick2LvNewFolderPop(FolderID){		
		Common.open("","onClickFolderListPopup",coviDic.dicMap["btn_apv_userfolderadd"],"/approval/user/UserNewFolderAddPopup.do?&type=2Lv&FolderID="+FolderID+"","350px","150px","iframe",true,null,null,true);
	}

	/**
	 * 폴더이동
	 * @param gridObj
	 * @returns {Boolean}
	 */
	function onClickMoveFolderPop(gridObj){
		var checkApprovalList = gridObj.getCheckedList(0);
		if(checkApprovalList.length == 0){
			Common.Warning(coviDic.dicMap["msg_apv_003"]);				//선택된 항목이 없습니다.
			return false;
		}
		
		Common.open("","onClickMoveFolderPop",coviDic.dicMap["lbl_apv_userfolder_2"],"/approval/user/UserFolderListAddPopup.do?&mode=move","500px","465px","iframe",true,null,null,true);
	}

	/**
	 * 폴더명 수정버튼
	 * @param gridObj
	 * @returns {Boolean}
	 */
	function onClickUpdtFolderPop(gridObj){
		var checkApprovalList = gridObj.getCheckedList(0);
		if(checkApprovalList.length == 0){
			Common.Warning(coviDic.dicMap["msg_apv_003"]);				//선택된 항목이 없습니다.
			return false;
		}
		if(checkApprovalList.length > 1){
			Common.Warning(coviDic.dicMap["msg_apv_326"]);
			return false;
		}
		//
		Common.open("","onClickUpdtFolderPop",coviDic.dicMap["btn_apv_folderEdit"],"/approval/user/UserUpdtFolderAddPopup.do","350px","130px","iframe",true,null,null,true);
	}
	
	function getUserSignInfo(usercode){
		var retVal = "";
		
		$.ajax({
		    url: "/approval/user/getUserSignInfo.do",
		    type: "POST",
		    data: {
				"UserCode" : usercode
			},
			async:false,
		    success: function (res) {
		    	if(res.status == 'SUCCESS'){
		    		retVal = res.data;
		    	} else if(res.status == 'FAIL'){
		    		Common.Error(res.message);
		    	}
	        },
	        error:function(response, status, error){
				CFN_ErrorAjax("getUserSignInfo.do", response, status, error);
			}
		});
		
		return retVal;
	}
	
	function SerialApproval(businessData1) {
		CFN_OpenWindow("/approval/approval_SerialApprovalForm.do?businessData1="+businessData1, "", 1200, (window.screen.height - 100), "scroll");
	}

	function openFileList_comment(pObj, idx, pGubun){
		if(!axf.isEmpty($(pObj).parent().find('.file_box').html())){
			$(pObj).parent().find('.file_box').remove();
			return false;
		}
		$('.file_box').remove();
		
		var vHtml = "<ul class='file_box'>";
		vHtml += "<li class='boxPoint'></li>";
		for(var i=0; i<g_commentAttachList[idx].length;i++){
			vHtml += "<li><a onclick='attachFileDownLoadCall_comment("+g_commentAttachList[idx][i].id+", \"" + g_commentAttachList[idx][i].savedname + "\", \"" + g_commentAttachList[idx][i].FileToken + "\")'>"+g_commentAttachList[idx][i].name+"</a></li>";
		}
		
		vHtml += "</ul>";
		$(pObj).parent().append(vHtml);
	}
	
	function attachFileDownLoadCall_comment(fileid, filename, filetoken) {
		Common.fileDownLoad(fileid, filename, filetoken);
	}
	
	// 6개월 기간 체크
	function getCurrentSixMonth(pEDay) {
		var newDate = new Date();
		var strSDay;
		var strEDay;
		var yy;
		var mm;
		var dd;
		var returnDay;
			
		strEDay = pEDay;

		var arr_pEDay = pEDay.split('-');

		yy = arr_pEDay[0];
		mm = arr_pEDay[1];
		dd = arr_pEDay[2];

		if (mm * 1 < 7) {
			yy = ((yy * 1) - 1) + '';
			if (((mm * 1) + 6) < 10) {
				mm = '0' + ((mm * 1) + 6);
			} else {
				mm = ((mm * 1) + 6) + '';
			}
		} else {
			mm = '0' + ((mm * 1) - 6);
		}

		strSDay = yy + "-" + mm + "-" + dd;

		return returnDay = strSDay + "^" + strEDay;
	}
	
	function openHandoverPopup(gridObj){
		var checkCheckList 		= gridObj.getCheckedList(1);
		var FormInstIdTemp 		= []; //임시함Form인서트아이디
		var FormInstId 	   		= "";
		var FormInstBoxIdTemp 	= []; //임시함Form인서트박스아이디
		var FormInstBoxId 		= "";
		
		if(checkCheckList.length == 0){
			Common.Warning(coviDic.dicMap["msg_apv_003"]);				//선택된 항목이 없습니다.
		}else if(checkCheckList.length > 0){
			for(var i = 0; i < checkCheckList.length; i++){
				FormInstIdTemp.push(checkCheckList[i].FormInstID)
				FormInstBoxIdTemp.push(checkCheckList[i].FormTempInstBoxID)
			}
			FormInstId = FormInstIdTemp.join(",");
			FormInstBoxId = FormInstBoxIdTemp.join(",");
			
			Common.open("","onClickHandoverPopup",coviDic.dicMap["lbl_handover"],"/approval/user/HandoverPopup.do?FormInstId="+FormInstId+"&FormInstBoxId="+FormInstBoxId,"450px","200px","iframe",true,null,null,true);
		}else{
			Common.Error(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
		}
	}
	/**
	 * 회람지정 (20210126 이관함 기능 추가)
	 * @param gridObj
	 */
	function ListCirculation(gridObj){
		strPiid_List = "";
		strWiid_List = "";
		strFiid_List = "";
		
		var str_mode = g_mode.toUpperCase();
		
		// 이관문서는 양식별 일괄확인 여부 필요 없음
//		var excludeItem = false;
//		$.each(gridObj.getCheckedListWithIndex(1), function(idx,obj){
//			if(typeof obj.item.ExtInfo == 'undefined'  || obj.item.ExtInfo.UseBlocCheck != 'Y'){
//				excludeItem = true;
//				gridObj.checkedColSeq(1,false,obj.index);
//			}
//		});
		
		var msgWarning = '';
		msgWarning += coviDic.dicMap["msg_apv_003"]; //선택된 항목이 없습니다.
		
		// 체크된 항목 확인
		var checkCheckList = gridObj.getCheckedList(1);
		if(checkCheckList.length == 0){
			Common.Warning(msgWarning);
		}else if(checkCheckList.length > 0){
			// 양식 오픈
			for(var i = 0; i < checkCheckList.length; i++){
				//if(mnid_chk == "477" || mnid_chk == "478" || mnid_chk == "479" || mnid_chk == "483"){
				if(str_mode == "PREAPPROVAL" || str_mode == "APPROVAL" || str_mode == "PROCESS" || str_mode == "TCINFO" || str_mode == "DEPTTCINFO"){
					strPiid_List += checkCheckList[i].ProcessID == "undefined" || checkCheckList[i].ProcessID == undefined ? ";" : checkCheckList[i].ProcessID + ";";
					strWiid_List += checkCheckList[i].WorkItemID == "undefined" || checkCheckList[i].WorkItemID == undefined ? ";" : checkCheckList[i].WorkItemID + ";";
				}else{
					strPiid_List += checkCheckList[i].ProcessArchiveID == "undefined" || checkCheckList[i].ProcessArchiveID == undefined ? ";" : checkCheckList[i].ProcessArchiveID + ";";
					strWiid_List += checkCheckList[i].WorkitemArchiveID == "undefined" || checkCheckList[i].WorkitemArchiveID == undefined ? ";" : checkCheckList[i].WorkitemArchiveID + ";";
				}

				strFiid_List += checkCheckList[i].FormInstID == "undefined" || checkCheckList[i].FormInstID == undefined ? ";" : checkCheckList[i].FormInstID + ";";
			}
			
			// 목록에서 선택한 항목이 하나일 경우 ID를 붙여주고 여러개일경우 ID를 비우고 참조/회람함을 연다.
			var ProcessID = strPiid_List.split(";").length == 2 ? strPiid_List.split(";")[0] : "";
			var WorkItemID = strWiid_List.split(";").length == 2 ? strWiid_List.split(";")[0] : "";
			var FormInstID = strFiid_List.split(";").length == 2 ? strFiid_List.split(";")[0] : "";
			g_CirculationFiid = strFiid_List;
			g_CirculationPiid = strPiid_List;
			g_CirculationWiid = strWiid_List;

			var width = 1000;
			var height = 580;
			var url = "../goCirculationMgrListpage.do?piid=" + ProcessID + "&fiid=" + FormInstID
					+ "&openDo=Circulate&openType=C&pState=528"
					+ "&bstored=true&callType=List";
			
			CFN_OpenWindow(url, "", width, height, "fix");
		}else{
			Common.Error(coviDic.dicMap["msg_ScriptApprovalError"]);			// 오류 발생
		}
	}