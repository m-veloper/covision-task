var arrDomainDataList = {}; //결재선정보보관

//가로양식은 여기서 정의 하세요.
function IsWideOpenFormCheck(fmpf) {
    var _return = false;
    try {
        /*switch (fmpf) {
            case "WF_FORM_VM":
            case "WF_FORM_EACCOUNT_LEGACY":
                _return = true;
                break;
            default:
                _return = false;
                break;
        }*/
    	
    	// 양식관리 및 기초설정에서 설정할 수 있도록 변경함.
    	if(Common.getBaseConfig("WideOpenFormprefix").toLowerCase().indexOf(fmpf.toLowerCase()) > -1) {
    		_return = true;
    	}
    } catch (e) { _return = false; }
    return _return;
}

// 목록 및 홈 화면에서 승인 및 반려
function approvalDoButtonAction(mode, subkind, taskId, actionMode, actionComment,forminstID, isMobile, processID, UserCode, signImage, isSerial, processName, apvToken, authKey, formID){
	
	var apvToken = apvToken || "";
	var authKey = authKey || "";
	
	//다국어 개별호출 -> 일괄호출
	Common.getDicList(["msg_apv_notask", "msg_apv_030"]);
	var sessionObj = Common.getSession(); //전체호출
	
	if(actionMode == "approved"){
		if(subkind == "T009" || subkind == "T004")
			actionMode = "AGREE";
		else
			actionMode = "APPROVAL";
	}else if(actionMode == "reject"){
		if(subkind == "T009" || subkind == "T004")
			actionMode = "DISAGREE";
		else
			actionMode = "REJECT";
	}
	
	if(subkind == "T009" || subkind == "T004"){		// 합의 및 협조
		mode = "PCONSULT";
	}else if((subkind == "C" || subkind == "AS") && approvalType == "DEPT"){
		mode = "SUBREDRAFT";
	}else if(subkind == "T016"){
		mode = "AUDIT";
	}else{
		if(processName == "Sub"){
			mode = "SUBAPPROVAL";
		}else{
			mode = "APPROVAL";
		}		
	}	
	
    var sJsonData = {};
    
    $.extend(sJsonData, {"mode": mode});
    $.extend(sJsonData, {"subkind": subkind});
    $.extend(sJsonData, {"taskID": taskId});
    $.extend(sJsonData, {"FormInstID": forminstID});
    $.extend(sJsonData, {"usid" : sessionObj["USERID"]});
    $.extend(sJsonData, {"actionMode": actionMode});
    $.extend(sJsonData, {"signimagetype" : signImage});
    $.extend(sJsonData, {"gloct" : ""});
    $.extend(sJsonData, {"actionComment": actionComment});
    $.extend(sJsonData, {"processName": processName}); //프로세스이름
    
    $.extend(sJsonData, {"g_authKey": authKey});
    $.extend(sJsonData, {"g_password": apvToken});
    $.extend(sJsonData, {"formID" : formID});
    
    if(isSerial) { // 연속결재 처리 todo
    	$.extend(sJsonData, {"actionComment_Attach": "[]"});	
    }
    else {
    	$.extend(sJsonData, {"actionComment_Attach": document.getElementById("ACTIONCOMMENT_ATTACH").value});
    }
    
    // 대결자가 결재하는 경우 결재선 변경
    var apvList = setDeputyList(mode, subkind, taskId, actionMode, actionComment,forminstID, isMobile, processID, UserCode);
    
    if(apvList != arrDomainDataList[processID]){
    	$.extend(sJsonData, {"processID" : processID});
    	$.extend(sJsonData, {"ChangeApprovalLine" : apvList});
    }
    
    var formData = new FormData();
    // 양식 기안 및 승인 정보
    formData.append("formObj", JSON.stringify(sJsonData));
	
	$.ajax({
		url:"/approval/draft.do",
		data: formData,
		type:"post",
		dataType : 'json',
		processData : false,
        contentType : false,
		success:function (res) {
			if (res.status == "SUCCESS" || (res.status == "FAIL" && res.message.indexOf("NOTASK")>-1)) {
				if(res.status == "FAIL"){
					res.message = coviDic.dicMap["msg_apv_notask"].replace(/(<([^>]+)>)/gi, "");
				}
				if(isMobile){
					alert(res.message);
					location.reload();
				} else if (isSerial) {
					callBackDoProcess();
				} else{
					Common.Inform(res.message, "Inform", function(){
						CoviMenu_GetContent(location.href.replace(location.origin, ""), false);
						setDocreadCount();
					});			//완료되었습니다.
				}
			}else{
				Common.Warning(coviDic.dicMap["msg_apv_030"] + " : " + res.message);			//오류가 발생했습니다.
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/draft.do", response, status, error);
		}
	});
}

function setDeputyList(mode, subkind, taskId, actionMode, actionComment, forminstID, isMobile, processID, UserCode) {//대결일 경우 처리
	try {
		var sessionObj = Common.getSession(); //전체호출
		var jsonApv = arrDomainDataList[processID];

        if (mode == "APPROVAL" || mode == "PCONSULT" || mode == "RECAPPROVAL" || mode == "SUBAPPROVAL" || mode == "AUDIT") { //기안부서결재선 및 수신부서 결재선
            var oFirstNode; //step에서 taskinfo select로 변경

            if (mode == "APPROVAL" || mode == "SUBAPPROVAL") {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step[routetype='approve']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
                
                if (mode == "SUBAPPROVAL" && oFirstNode.length == 0) {//mode가 supapproval이 approval로 들어옴
                	oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype!='approve']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step[routetype!='approve']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
                	//if (oFirstNode.length != 0) mode = "SUBAPPROVAL";//mode가 supapproval이 approval로 교체작업
                }
                if (oFirstNode.length == 0) { //편집 후 결재 시 대결 오류로 인하여 소스 추가
                    oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + sessionObj["USERID"] + "']>taskinfo[status='pending'][kind='substitute']");
                }
            } else if (mode == "RECAPPROVAL") {
                oFirstNode = $$(jsonApv).find("steps>division[divisiontype='receive']>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step[routetype='approve']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
                if (oFirstNode.length == 0) { //편집 후 결재 시 대결 오류로 인하여 소스 추가
                    oFirstNode = $$(jsonApv).find("steps>division[divisiontype='receive']>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + sessionObj["USERID"] + "']>taskinfo[status='pending'][kind='substitute']");
                }
            } else if (mode == "PCONSULT") {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step>ou>role>taskinfo:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])[status='pending']");
            } else if (mode == "AUDIT") {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype='audit']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'] > taskinfo[status='pending'],step[routetype='audit']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
            } else {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[unittype='ou'][routetype='receive']>ou>person[code!='" + sessionObj["USERID"] + "']>taskinfo[kind!='charge'][status='pending']");
            }
            if (oFirstNode.length != 0) {
                var m_bDeputy = true; var m_bApvDirty = true; var elmOU; var elmPerson;
                switch (mode) {
                    case "APPROVAL":
                    case "PCONSULT":
                    case "SUBAPPROVAL":
                    case "RECAPPROVAL":
                    case "AUDIT":
                        elmOU = $$(oFirstNode).parent().parent();
                        elmPerson = $$(oFirstNode).parent();
                        break;
                }
                var elmTaskInfo = $$(elmPerson).find("taskinfo");
                var skind = $$(elmTaskInfo).attr("kind");
                var sallottype = "serial";
                var elmStep = $$(elmOU).parent();
                try { if ($$(elmStep).attr("allottype") != null) sallottype = $$(elmStep).attr("allottype"); } catch (e) { }
                //taskinfo kind에 따라 처리  일반결재 -> 대결, 대결->사용자만 변환, 전결->전결, 기존사용자는 결재안함으로
                switch (skind) {
                    case "substitute": //대결
                        if (actionMode == "APPROVAL") {
                            $$(elmOU).attr("code", sessionObj["DEPTID"]);
                            $$(elmOU).attr("name", sessionObj["DEPTNAME"]);
                        }
                        $$(elmPerson).attr("code", sessionObj["USERID"]);
                        $$(elmPerson).attr("name", sessionObj["USERNAME"]);
                        $$(elmPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
                        $$(elmPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
                        $$(elmPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
                        $$(elmPerson).attr("oucode", sessionObj["DEPTID"]);
                        $$(elmPerson).attr("ouname", sessionObj["DEPTNAME"]);
                        $$(elmPerson).attr("sipaddress", sessionObj.UR_Mail);
                        $$(elmTaskInfo).attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                        break;
                    /*case "authorize"://전결 결재안함
                        $$(elmTaskInfo).attr("status", "completed");
                        $$(elmTaskInfo).attr("result", "skipped");
                        $$(elmTaskInfo).attr("kind", "skip");
                        $$(elmTaskInfo).remove("datereceived");
                        break;*/
                    case "consent": //합의 -> 후열
                    case "charge":  //담당 -> 후열
                    case "consult":
                    case "normal":  //일반결재 -> 후열
                    case "authorize"://전결 결재안함
                        $$(elmTaskInfo).attr("status", "inactive");
                        $$(elmTaskInfo).attr("result", "inactive");
                        $$(elmTaskInfo).attr("kind", "bypass");
                        $$(elmTaskInfo).remove("datereceived");
                        break;
                }
                if (skind == "authorize" || skind == "normal" || skind == "consent" || skind == "charge" || skind == "consult") {
                    var oStep = {};
                    var oOU = {};
                    var oPerson = {};
                    var oTaskinfo = {};
                    
                    $$(oTaskinfo).attr("status", "pending");
                    $$(oTaskinfo).attr("result", "pending");
                    //$$(oTaskinfo).attr("kind", (skind == "authorize") ? skind : "substitute");
                    $$(oTaskinfo).attr("kind", "substitute"); // 대결로 처리되는 경우 대결자 완료함에서 문서 열람이 가능해야 함!
                    $$(oTaskinfo).attr("datereceived",CFN_TransServerTime(CFN_GetLocalCurrentDate()));//timezone고려 new Date().format('yyyy-MM-dd HH:mm:ss')
                    
                    $$(oPerson).attr("code", sessionObj["USERID"]);
                    $$(oPerson).attr("name", sessionObj["USERNAME"]);
                    $$(oPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
                    $$(oPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
                    $$(oPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
                    $$(oPerson).attr("oucode", sessionObj["DEPTID"]);
                    $$(oPerson).attr("ouname", sessionObj["DEPTNAME"]);
                    $$(oPerson).attr("sipaddress", sessionObj.UR_Mail);
                    
                    if(mode == "SUBAPPROVAL") {
                    	$$(oPerson).attr("wiid", $$(elmPerson).attr("wiid"));
                    	$$(oPerson).attr("taskid", $$(elmPerson).attr("taskid"));
                    }
                    
                    $$(oPerson).append("taskinfo", oTaskinfo);
                    
                    $$(elmOU).append("person", oPerson);							// person이 object일 경우를 위해서 추가하여 배열로 만듬
                    
                    if(mode == "SUBAPPROVAL") {
                    	// todo: person의 index 구하는 방법 변경할 수 있으면 다른방법으로 교체할 것
                    	$$(elmOU).find("person").json().splice(parseInt(oFirstNode.parent().path().substr(oFirstNode.parent().path().lastIndexOf("/")+8, 1)), 0, oPerson);
                    } else {
                    	$$(elmOU).find("person").json().splice(0, 0, oPerson);			// 다시 앞에 추가
                    }
                    $$(elmOU).find("person").concat().eq($$(elmOU).find("person").concat().length-1).remove();			// 배열로 만들기 위해서 추가했던 person을 지움
                    
                    if (skind == 'charge') {
                        oFirstNode = oStep;
                        
                        var oStep = {};
                        var oOU = {};
                        var oPerson = {};
                        var oTaskinfo = {};
                        
                        $$(oStep).attr("unittype", "person");
                        $$(oStep).attr("routetype", "approve");
                        $$(oStep).attr("name", coviDic.dicMap.lbl_apv_writer);		//gLabel__writer);
                        
                        $$(oOU).attr("code", sessionObj["DEPTID"]);
                        $$(oOU).attr("name", sessionObj["DEPTNAME"]);
                        
                        $$(oPerson).attr("code", sessionObj["USERID"]);
                        $$(oPerson).attr("name", sessionObj["USERNAME"]);
                        $$(oPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
                        $$(oPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
                        $$(oPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
                        $$(oPerson).attr("oucode", sessionObj["DEPTID"]);
                        $$(oPerson).attr("ouname", sessionObj["DEPTNAME"]);
                        $$(oPerson).attr("sipaddress", sessionObj.UR_Mail);
                        
                        $$(oTaskinfo).attr("status", "complete");
                        $$(oTaskinfo).attr("result", "complete");
                        $$(oTaskinfo).attr("kind", "charge");
                        $$(oTaskinfo).attr("datereceived",CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                        $$(oTaskinfo).attr("datecompleted",CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                        
                        $$(oPerson).append("taskinfo", oTaskinfo);
                        
                        $$(oOU).append("person", oPerson);
                        
                        $$(oStep).append("ou", oOU);
                        
                        $$(jsonApv).find("steps>division").append("step", oStep);
                        $$(jsonApv).find("steps>division>step").json().splice(0, 0, oStep);
                        $$(jsonApv).find("steps>division>step").concat().eq($$(jsonApv).find("steps>division>step").concat().length-1).remove();
                    }
                }

                var oResult = $$(jsonApv).json();
                return JSON.stringify(oResult);
            }
            else {
            	return arrDomainDataList[processID];
            }
        }
        else if(mode == "REDRAFT") {
        	var oApvList = jsonApv;
        	var oCurrentOUNode = $$(oApvList).find("steps > division").children().find("[divisiontype='receive']").has(">taskinfo[status='pending']");
            if (oCurrentOUNode == null) {
            	var oDiv = {};
            	$$(oDiv).attr("taskinfo", {});
            	$$(oDiv).attr("step", {});
            	$$(oDiv).attr("divisiontype", "receive");
            	$$(oDiv).attr("name", coviDic.dicMap.lbl_apv_ChargeDept);
                $$(oDiv).attr("oucode", sessionObj["DEPTID"]);
                $$(oDiv).attr("ouname", sessionObj["DEPTNAME"]);
            	
                $$(oDiv).find("taskinfo").attr("status", "pending");
                $$(oDiv).find("taskinfo").attr("result", "pending");
                $$(oDiv).find("taskinfo").attr("kind", "receive");
                $$(oDiv).find("taskinfo").attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
            	
            	$$(oApvList).find("division").push(oDiv);
            	
                oCurrentOUNode = $$(oApvList).find("steps > division:has(>taskinfo[status='pending'])[divisiontype='receive']");
            }
            var oRecOUNode = $$(oCurrentOUNode).find("step").has("ou>taskinfo[status='pending']");
            if (oRecOUNode.length != 0 && $$(oRecOUNode).find("ou").hasChild("person").length == 0) $$(oCurrentOUNode).find("step").has("ou>taskinfo[status='pending']").remove();
            var oChargeNode = $$(oCurrentOUNode).find("step").has("ou>person>taskinfo[status='pending']");

            //담당 수신자 대결
            var isChkDeputy = false;

            if (oChargeNode.length != 0) {
                //담당 수신자 대결 S ----------------------------------------
                var objDeputyOU = $$(oApvList).find("steps>division[divisiontype='receive']>step>ou");
                var chkObjPersonNode = $$(objDeputyOU).find("person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']").find(">taskinfo[status='pending']");
                var chkObjRoleNode = $$(objDeputyOU).find("role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");

                if (0 < (chkObjPersonNode.length + chkObjRoleNode.length)) {
                    isChkDeputy = true;
                }
                //담당 수신자 대결 E -----------------------------------------
            	
                var oRecApprovalNode = $$(oCurrentOUNode).find("step>ou>person>taskinfo[status='inactive']");
                if (oRecApprovalNode.length != 0) {
                	for(var i=0; i<oRecApprovalNode.length; i++){
                		var RecApprovalNode = oRecApprovalNode.concat().eq(i);
                		oCurrentOUNode.concat().eq(0).remove(RecApprovalNode.parent().parent().parent());
                	}
                }

                //person의 takinfo가 inactive가 있는 경우 routetype을 변경함
                var nodesInactives = $$(oCurrentOUNode).find("step[routetype='receive']").has("ou > person > taskinfo[status='inactive']");

                $$(nodesInactives).each(function (i, nodesInactive) {
                    $$(nodesInactive).attr("unittype", "person");
                    $$(nodesInactive).attr("routetype", "approve");
                    $$(nodesInactive).attr("name", coviDic.dicMap.lbl_apv_ChargeDept);	
                });

            }
            
        	var oJFNode = $$(oCurrentOUNode).find("step").has("ou>role>taskinfo[status='pending'], ou>role>taskinfo[status='reserved']"); 
            var bHold = false; //201108 보류여부
            var oComment = null;
            if (oJFNode.length != 0) {
                var oHoldTaskinfo = $$(oJFNode).find("ou>role>taskinfo[status='reserved']");
                if (oHoldTaskinfo.length != 0) {
                    bHold = true;
                    oComment = $$(oHoldTaskinfo).find("comment").json();
                    
                    // 보류한 사용자와 로그인한 사용자가 다른 경우
                    if($$(oComment).attr("reservecode") != undefined && $$(oComment).attr("reservecode") != getInfo("AppInfo.usid")) {
                    	Common.Warning(coviDic.dicMap.msg_apv_holdOther); // 해당 양식은 다른 사용자가 보류한 문서입니다.
                    	bHold = false;
                	}
                }
                //$$(oCurrentOUNode).eq(0).remove($$(oJFNode).eq(0));
                $$(oCurrentOUNode).eq(0).remove("step");
            }

            $$(oCurrentOUNode).attr("oucode", sessionObj["DEPTID"]);
            $$(oCurrentOUNode).attr("ouname", sessionObj["DEPTNAME"]);
            
            $$(oCurrentOUNode).find("taskinfo").attr("status", "pending");
            $$(oCurrentOUNode).find("taskinfo").attr("result", "pending");
            
            var oStep = {};
            var oOU = {};
            var oPerson = {};
            var oTaskinfo = {};

            $$(oStep).attr("unittype", "person");
            $$(oStep).attr("routetype", "approve");
            $$(oStep).attr("name", coviDic.dicMap.lbl_apv_ChargeDept);
            
            $$(oOU).attr("code", sessionObj["DEPTID"]);
            $$(oOU).attr("name", sessionObj["DEPTNAME"]);
                        
            $$(oOU).attr("taskid", $$(oCurrentOUNode).find("step>ou").attr("taskid"));
			$$(oOU).attr("widescid", $$(oCurrentOUNode).find("step>ou").attr("widescid"));
			$$(oOU).attr("wiid", $$(oCurrentOUNode).find("step>ou").attr("wiid"));            
            
            $$(oPerson).attr("code", sessionObj["USERID"]);
            $$(oPerson).attr("name", sessionObj["USERNAME"]);
            $$(oPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
            $$(oPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
            $$(oPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
            $$(oPerson).attr("oucode", sessionObj["DEPTID"]);
            $$(oPerson).attr("ouname", sessionObj["DEPTNAME"]);
            $$(oPerson).attr("sipaddress", sessionObj.UR_Mail);
            
            $$(oTaskinfo).attr("status", (bHold == true ? "reserved" : "pending")); 
            $$(oTaskinfo).attr("result", (bHold == true ? "reserved" : "pending")); 
            $$(oTaskinfo).attr("kind", "charge");
            $$(oTaskinfo).attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
            if (bHold) $$(oTaskinfo).attr("comment", oComment); 
            
            $$(oPerson).append("taskinfo", oTaskinfo);
            
            $$(oOU).append("person", oPerson);
            
            $$(oStep).append("ou", oOU);
            
            // 조건 추가 - charge가 있는 경우에만 실행
            // receive division의 첫번째 step 교체
            if($$(oCurrentOUNode).find("step > ou > person > taskinfo[kind='charge']").length > 0) {                        
                $$(oCurrentOUNode).append("step", oStep);
                $$(oCurrentOUNode).find("step").concat().eq(0).remove();
            }
            else {
            	$$(oCurrentOUNode).append("step", oStep);
            }
            
            //담당 수신자 대결 S ---------------------------------------------
            if (isChkDeputy) {
            	//Common.Warning(coviDic.dicMap.msg_ApprovalDeputyWarning);
            	
                var objOriginalApprover = $$(oChargeNode).find('ou').find("person");
                $$(objOriginalApprover).attr('title', $$(objOriginalApprover).attr('title'));
                $$(objOriginalApprover).attr('level', $$(objOriginalApprover).attr('level'));
                $$(objOriginalApprover).attr('position', $$(objOriginalApprover).attr('position'));

                $$(objOriginalApprover).find('taskinfo').remove('datereceived');
                $$(objOriginalApprover).find('taskinfo').attr('kind', 'bypass');
                $$(objOriginalApprover).find('taskinfo').attr('result', 'inactive');
                $$(objOriginalApprover).find('taskinfo').attr('status', 'inactive');
                
                // [2015-05-28 modi] 현재 대결인 division에만 추가하도록
                //objDeputyOU = $(oApvList).find("steps > division[divisiontype='receive'] > step > ou");
                //objDeputyOU = $$(oApvList).find("steps>division").has("taskinfo[status='pending']").find("step>ou");
                //$$(objDeputyOU).append("person", $$(objOriginalApprover).json());
                
                // [2020-10-23] person 추가에서 step 추가로 변경
                $$(oChargeNode).attr("routetype", "approve");
                $$(oChargeNode).attr("name", "원결재자");
            	$$(oCurrentOUNode).append("step", $$(oChargeNode).json());
            }
            //담당 수신자 대결 E ----------------------------------------------

            var oResult = $$(oApvList).json();
            return JSON.stringify(oResult);              
        }
        else {
        	return arrDomainDataList[processID];
        }
    }
    catch (e) {
        alert(e.message);
    }
}

// 프로필 사진 경로 가져오기
function getProfileImagePath(userCodes){
	var returnObj = new Array();
	
	if(userCodes.split(";").length > 0){
		$.ajax({
			url:"/approval/user/getProfileImagePath.do",
			data: {
				"UserCodes" : userCodes
			},
			type:"post",
			dataType : 'json',
			async : false,
			success:function (res) {
				returnObj = res.data;
			},
			error:function(response, status, error){
				CFN_ErrorAjax("/approval/user/getProfileImagePath.do", response, status, error);
			}
		});	
	}
	
	return returnObj;
}

/*
개인결재함
미결함, 진행함 - 전체 개수
*/
function setDocreadCount(listType) {
	switch (listType) {
	case "USER":
		setDocReadCount_User();
		break;
	case "DEPT":
		setDocReadCount_Dept();
		break;
	case "jobFunction":
		setDocReadCount_jobFunction();
		break;
	default:
		setDocReadCount_User();
		setDocReadCount_Dept();
		break;
	}
}

function setDocReadCount_User(){
	//미결함
	$.ajax({
		url:"/approval/user/getApprovalCnt.do",
		type:"post",
		data:{
			businessData1 : "APPROVAL"
		},
		success:function (data) {
			if(data.status == "SUCCESS") {
				//메소드 호출마다 갱신되도록 수정
				approvalCnt = data.cnt;
				
				$("[data-menu-alias=ApprovalUser]").each(function(){
					if("Approval" == decodeURIComponent($(this).attr("data-menu-url")).split("&mode=")[1]){
						$(this).find("a>span>span").remove();
						var menuName = $(this).find("a>span").text();
						$(this).find("a>span").html(menuName + "<span class='fCol19abd8'>&nbsp;"+approvalCnt+"</span>");
						// 좌측 퀵 메뉴 영역의 count도 변경되도록 처리 (2019.06.14)
						$("#quickCnt_Approval").html(approvalCnt);
						
						return false;
					}
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getApprovalCnt.do", response, status, error);
		}
	});
	//진행함
	$.ajax({
		url:"/approval/user/getProcessCnt.do",
		type:"post",
		data:{
			businessData1 : "APPROVAL"
		},
		success:function (data) {
			if(data.status == "SUCCESS") {
				processCnt = data.cnt;
				
				$("[data-menu-alias=ApprovalUser]").each(function(){
					if("Process" == decodeURIComponent($(this).attr("data-menu-url")).split("&mode=")[1]){
						$(this).find("a>span>span").remove();
						var menuName = $(this).find("a>span").text();
						$(this).find("a>span").html(menuName + "<span class='fCol19abd8'>&nbsp;"+processCnt+"</span>");
						
						return false;
					}
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getProcessNotDocReadCnt.do", response, status, error);
		}
	});
	
	setDocreadCountCc("User");
}
function setDocReadCount_Dept(){
	//수신함
	$.ajax({
		url:"/approval/user/getDeptReceptionCnt.do",
		type:"post",
		success:function (data) {
			if(data.status == "SUCCESS") {
				receiveCnt = data.cnt;
				
				$("[data-menu-alias=ApprovalDept]").each(function(){
					if("Receive" == decodeURIComponent($(this).attr("data-menu-url")).split("&mode=")[1]){
						$(this).find("a>span>span").remove();
						var menuName = $(this).find("a>span").text();
						$(this).find("a>span").html(menuName + "<span class='fCol19abd8'>&nbsp;"+receiveCnt+"</span>");
						
						return false;
					}
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getDeptReceptionCnt.do", response, status, error);
		}
	});
	//진행함
	$.ajax({
		url:"/approval/user/getDeptProcessCnt.do",
		type:"post",
		success:function (data) {
			if(data.status == "SUCCESS") {
				processCnt = data.cnt;
				
				$("[data-menu-alias=ApprovalDept]").each(function(){
					if("DeptProcess" == decodeURIComponent($(this).attr("data-menu-url")).split("&mode=")[1]){
						$(this).find("a>span>span").remove();
						var menuName = $(this).find("a>span").text();
						$(this).find("a>span").html(menuName + "<span class='fCol19abd8'>&nbsp;"+processCnt+"</span>");
						
						return false;
					}
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getDeptProcessCnt.do", response, status, error);
		}
	});
	
	setDocreadCountCc("Dept");
}

/*
탭에 표시되는 함별  Count 
참조/회람함 - 읽지 않은 개수
*/
function setDocreadCountCc(listType) {
	
	if(listType == "User"){
		setDocReadCountCCUser();
	}
	else if(listType == "Dept"){
		setDocReadCountCCDept();
	}
	else{
		setDocReadCountCCUser();
		setDocReadCountCCDept();
	}
}

function setDocReadCountCCUser(){
	$.ajax({
		url:"/approval/user/getTCInfoNotDocReadCnt.do",
		type:"post",
		data:{
			businessData1 : "APPROVAL"
		},
		success:function (data) {
			if(data.status == "SUCCESS") {
				tcInfoCnt = data.cnt;
				
				$("[data-menu-alias=ApprovalUser]").each(function(){
					if("TCInfo" == decodeURIComponent($(this).attr("data-menu-url")).split("&mode=")[1]){
						$(this).find("a>span>span").remove();
						var menuName = $(this).find("a>span").text();
						$(this).find("a>span").html(menuName + "<span class='fCol19abd8'>&nbsp;"+tcInfoCnt+"</span>");
						
						return false;
					}
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getTCInfoNotDocReadCnt.do", response, status, error);
		}
	});
}
function setDocReadCountCCDept(){
	//참조/회람함
	$.ajax({
		url:"/approval/user/getDeptTCInfoNotDocReadCnt.do",
		type:"post",
		success:function (data) {
			if(data.status == "SUCCESS") {
				tcInfoCnt = data.cnt;
				
				$("[data-menu-alias=ApprovalDept]").each(function(){
					if("DeptTCInfo" == decodeURIComponent($(this).attr("data-menu-url")).split("&mode=")[1]){
						$(this).find("a>span>span").remove();
						var menuName = $(this).find("a>span").text();
						$(this).find("a>span").html(menuName + "<span class='fCol19abd8'>&nbsp;"+tcInfoCnt+"</span>");
						
						return false;
					}
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getDeptTCInfoNotDocReadCnt.do", response, status, error);
		}
	});
}