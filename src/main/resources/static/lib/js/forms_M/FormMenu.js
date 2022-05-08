/// <reference path="../../Base/Controls/jquery-last-vsdoc.js" />
/// <reference path="Form.aspx" />

var m_evalJSON; // var m_evalXML;
var g_szAcceptLang = "ko";
var m_sReqMode;
var m_oFormEditor;
var m_cvtXML = $.parseXML("<root></root>");
var m_bApvDirty = false;
var m_bFrmExtDirty = false;
var m_bFrmInfoDirty = false;
var m_sOPubDocNO = "";
var m_sAddList = "";
var m_ibIdx = 0;
var m_bDeputy = false;
var m_oFormReader;
var m_bFileSave = true;
var m_CmtBln = true;
var m_ApvChangeMode = "";		// 결재선변경 모드값
var m_wfid = "";                // 현재결재자사번
var m_RejectDocLink = "";       // 반송 원문서 필요 정보
var m_bTabForm = false;         // 탭형태로 양식 open 여부
var m_FixApvLineData = null;    // 지정결재선 필요 정보
var m_FixApvLineCTData = "";    // 지정결재선 Controller 필요 정보
var m_FixApvLineDAF = null;     // 지정결재선 DAF 필요 정보
var sgINIListFiles = "";        // 기존 파일의 쿼리스트링 전송으로 인해 인코딩 문제가 발생
var m_inkClicked = "";
var sLastComment = "";
var m_TempSave = false;
var m_TempSaveInfo = false;     // 임시저장시 subject 자동 입력 되었는지 여부
var m_bTempFlag = false;        // 임시로 flag 사용(공통)
var m_sTempString = "";         // 임시로 string 사용(공통)
var gIsSAP = "";                // SAP연동양식여부(2013-10-14 HIW)

// 대성 선결재 위해서 추가함
var m_ActiveTaskId = "";
var m_ApvPersonObj = {};
var m_ApvPersonCnt = 0;

var a, ua = navigator.userAgent;

this.agent = {
    safari: ((a = ua.split('AppleWebKit/')[1]) ? (a.split('(')[0]).split('.')[0] : 0) >= 412,
    konqueror: ((a = ua.split('Konqueror/')[1]) ? a.split(';')[0] : 0) >= 3.4,
    mozes: ((a = ua.split('Gecko/')[1]) ? a.split(" ")[0] : 0) >= 20011128,
    opera: (!!window.opera) && (document.body.style.opacity == ""),
    msie: (!!window.ActiveXObject) ? (!!(new ActiveXObject("Microsoft.XMLHTTP"))) : (navigator.appName == 'Microsoft Internet Explorer') ? true : false
} // safari, konqueror, opera url 한글 인코딩 처리를 위해추가

var btoUtf = ((this.agent.safari || this.agent.konqueror || this.agent.opera) ? false : true);
var sessionObjFormMenu = Common.getSession(); // 전체호출

function initOnloadformmenu() {
	
    if ('DELETE_TARGET_DEPART' == getInfo("Request.gloct")) {
        $('#btPreserveDateUpdate').show();
    }


    gIsSAP = GetIsLegacyForm();     // SAP연동양식여부

    /*
	 * 기록물철 비사용 if (getInfo("Request.templatemode") == "Read" &&
	 * getInfo("SchemaContext.scRecDoc.isUse") == "Y") { //스키마에서 "기록물철사용"인 경우
	 * GetRecFolderName(); //해당문서의 기록물철폴더명 나타내기 }
	 */

    // 재사용버튼 클릭으로 들어오는 경우 처리
    // Forms.js commonDataChanger()로 재사용시 데이터 처리 이동
    // 회신옵션 추가
    if (getInfo("Request.reuse") == "Y" || getInfo("Request.reuse") == "P" || getInfo("Request.reuse") == "YH") {
        if (getInfo("Request.mode") != "DRAFT" && getInfo("Request.mode") != "TEMPSAVE") {
            // 반송함에서 재사용할 경우 원문서 경로 포함시키기
			// getInfo("ProcessInfo.ProcessDescription")
            if (getInfo("Request.mode") == "REJECT" && getInfo("Request.loct") == "REJECT") {
                m_RejectDocLink = getInfo("Request.workitemID") + "@@@" + getPIDC() + ";" + getInfo("ProcessInfo.ProcessID") + ";" + "" + "@@@" + getInfo("FormInstanceInfo.Subject") + "@@@" + getInfo("FormInstanceInfo.DocNo");
            }

            m_sReqMode = "DRAFT";
        }

        document.getElementById("btReUse").style.display = "none"; 
        document.getElementById("btPrint").style.display = "none"; 
        document.getElementById("btCommentView").style.display = "none"; 
        document.getElementById("btCirculate").style.display = "none"; 
        document.getElementById("btCirculate_View").style.display = "none";
        document.getElementById("btHistory").style.display = "none";
        document.getElementById("btReceiptView").style.display = "none";
        document.getElementById("btPcSave").style.display = "none"; 
        document.getElementById("btPrintView").style.display = "none";
        document.getElementById("btMailSend").style.display = "none";

        // 연결문서 & 업무메뉴얼 연결
        if (getInfo("Request.loct") != "DRAFT" && getInfo("Request.loct") != "TEMPSAVE") {
        }
        else {
            document.getElementById("btDocLinked").style.display = "";
        }

        if (g_szEditable) {
            document.getElementById("btDocLinked").style.display = "";
            document.getElementById("btPreView").style.display = ""; 
        }

        // 회신옵션 추가
        if (getInfo("Request.reuse") == "YH") {   // 협조전을 수신부서에서 회신하는 경우
            // 수신부서 부서완료함에서 회신을 했는지 확인
            checkReturnForm();

            if (bReturnForm) {
                // 회신용 재기안지에 현재 기안의 Process Instance ID 넣기
                setInfo("REPLY_PARENT_FORM_INST_ID", getInfo("FormInstanceInfo.FormInstID"));
                // 회신용 재기안지는 회신기능이 적용되지 않도록 조치
                setInfo("scReply", "0");

                // 수신현황버튼제어
                document.getElementById("btReceiptView").style.display = "none";

                initBtn();

                // 회신 Menu 정리
                document.getElementById("btCirculate").style.display = "none"; document.getElementById("btCirculate_View").style.display = "none";
                document.getElementById("btHistory").style.display = "none";
                /* 추가의견 */ 
                document.getElementById("btComment").style.display = "none";
                document.getElementById("btReUse").style.display = "none"; 
            }
        }
    }

    if (getInfo("Request.loct") != "DRAFT" && getInfo("Request.loct") != "TEMPSAVE") {
    }
    else {
        document.getElementById("btDocLinked").style.display = "";
        // 전결규정 Common.getBaseConfig("IS_RULEAPV") == "Y" ??
        var ruleitemlist = getInfo("ExtInfo.RuleItemLists");
        if (ruleitemlist != "" && ruleitemlist != "[]" && ruleitemlist != undefined) {
            document.getElementById("btnRuleApv").style.display = "";
        }
    }

    if (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE") {
        g_szEditable = true;
    }
    else if (getInfo("Request.editmode") == "Y") {
        g_szEditable = true;
    }

    if (g_szEditable) {
        document.getElementById("btDocLinked").style.display = "";
        document.getElementById("btPreView").style.display = "";
    }

    if (document.location.href.toUpperCase().indexOf("/FORMS/FORMTAB.ASPX") > -1) {
        m_bTabForm = true; divMenu.childNodes[1].style.width = "990px";
    }

    if (getInfo("SchemaContext.scCMB.isUse") == null || getInfo("SchemaContext.scCMB.isUse") == "N") {
        m_oFormEditor = window.document;// parent.editor
        m_oFormReader = window.document;// parent.redear

        if (admintype != "ADMIN" && getInfo("Request.loct") == "APPROVAL"
            && (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "RECAPPROVAL")) {
            setApvList();
        }
        else {
            document.getElementById("APVLIST").value = getInfo("ApprovalLine");
        }

        $("#RecDeptList").val(getInfo("FormInstanceInfo.ReceiveNames"));

        /* 비사용 if (getInfo("SchemaContext.scSign.isUse") == "Y") { */
            document.getElementById("SIGNIMAGETYPE").value = getInfo("AppInfo.usit");
        /* } */

        initBtn();

        if ((getInfo("Request.loct") == "MONITOR") || (getInfo("Request.loct") == "PREAPPROVAL") || (getInfo("Request.loct") == "PROCESS") || (getInfo("Request.loct") == "COMPLETE") && (getInfo("Request.mode") != "REJECT")) {
            if ((getInfo("Request.loct") == "PROCESS") && (getInfo("Request.mode") == "PROCESS" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "RECAPPROVAL" || getInfo("Request.mode") == "SUBAPPROVAL" || getInfo("Request.mode") == "AUDIT") && getInfo("FormInstanceInfo.InitiatorID") == getInfo("AppInfo.usid") && getInfo("Request.subkind") == "T006") {
            	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                var elmRoot = $(m_evalJSON).find("steps");
                var elmList = $$(elmRoot).find("division>step>ou>person").has("taskinfo[kind!='charge'])");
                var strDate;

                $$(m_evalJSON).find("division>step>ou>person").has("taskinfo[kind!='charge']").each(function (i, elm) {
                    var elmTaskInfo = $$(elm).find("taskinfo");
                    if ($$(elmTaskInfo).attr("datecompleted") != null) {
                        strDate = $$(elmTaskInfo).attr("datecompleted");
                    }
                });

                // 사용자 문서 조회 및 수정
                // 관리자 모드가 아닐때
                if (admintype != "ADMIN") {
                    if (strDate == null) {
                        if (getInfo("Request.gloct") != "DEPART") {					// 부서진행함
																					// - 조건
																					// 없이
																					// 실행하던걸
																					// if추가하여
																					// 안에
																					// 넣음
                            document.getElementById("btWithdraw").style.display = ""; // 회수
                        }

                        // 수신처 담당자가 pending 상태일 때는 회수 안됨,수신처 수신함에 pending 일 경우
						// 회수 안됨
                        elmList = $$(m_evalJSON).find("division").has("taskinfo[status='pending']").find("[divisiontype='receive'] > step > ou");

                        if (elmList.length > 0) {
                            document.getElementById("btWithdraw").style.display = "none"; // 회수
                        }

                    } else if (strDate != null && getInfo("SchemaContext.scDraftCancel.isUse") == "Y") {
                        if ($$(m_evalJSON).find("division[divisiontype='receive']>step>ou>person[code = '" + getInfo("AppInfo.usid") + "']").has("taskinfo[kind = 'charge'])").concat().length == 0) {
                            document.getElementById("btAbort").style.display = "";		 // 진행 중
																							// 문서도
																							// 취소가
																							// 됨
                        }
                    }
                }
                // 강제합의
                var elmAssist = $(m_evalJSON).find("division:has(taskinfo[status='pending']) > step[routetype='assist'][@unittype='ou']:has(taskinfo[status='pending'])");
                if (elmAssist.length > 0 && getInfo("SchemaContext.scForcedConsent.isUse") == "Y") {
                    if (addDate("d", getInfo("SchemaContext.scForcedConsent.value"), getInfo("FormInstanceInfo.InitiatedDate"), "-") <= getInfo("AppInfo.svdt").substring(0, 10)) {
                        document.getElementById("btForcedConsent").style.display = "";
                    }
                }
                // 합의부서 삭제 -
                elmAssist = $(m_evalJSON).find("division:has(taskinfo[status='pending']) > step:has(taskinfo[status='pending'])[routetype='assist'][unittype='ou'] > ou:has(taskinfo[status='pending'])");
                if (getInfo("SchemaContext.scDCooRemove.isUse") == "Y" && elmAssist.length > 0) {
                    var bPendigOUs = false;

                    $(m_evalJSON).find("division:has(taskinfo[status='pending']) > step:has(taskinfo[status='pending'])[routetype='assist'][unittype='ou'] > ou:has(taskinfo[status='pending'])").each(function (i, elmaOU) {
                        var elmaPerson = $(elmaOU).find("person");
                        if (elmaPerson.length == 0) {
                            bPendigOUs = true;
                        }
                    });
                }
            }
        }
        if (getInfo("Request.subkind") == "MONITOR") {
            document.getElementById("btRecDept").style.display = "none"; document.getElementById("btPrint").style.display = "none"; document.getElementById("btReUse").style.display = "none"; document.getElementById("btCirculate").style.display = "none";
            switch (getInfo("Request.loct")) {
                case "PREAPPROVAL": document.getElementById("btMonitor").style.display = "none"; break;
                case "COMPLETE": document.getElementById("btMonitor").style.display = ""; break; // "미확인
																									// 닫기"
            }
        }

        // 승인취소 버튼 활성화, 본인 결재 다음에 일반 결재가 있으면서 결재를 하지 않았을 경우 해당
        if (getInfo("SchemaContext.scApproveCancel.isUse") == "Y"
            && getInfo("Request.loct") == "PROCESS"
            && (getInfo("Request.userCode") == getInfo("AppInfo.usid") || getInfo("dptid") == getInfo("AppInfo.usid"))
            && (getInfo("Request.subkind") == "T000" || getInfo("Request.subkind") == "T004" || getInfo("Request.subkind") == "T016" || getInfo("Request.subkind") == "T017")
            && (getInfo("Request.mode") == "PROCESS" || getInfo("Request.mode") == "SUBAPPROVAL" || getInfo("Request.mode") == "RECAPPROVAL" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "AUDIT")
           ) {
        	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
            var elmRoot = $(m_evalJSON).find("steps");
            var elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step>ou>person>taskinfo[kind!='charge'][kind!='bypass'][kind!='review'][kind!='skip'], >step>ou>role>taskinfo[kind!='charge'][kind!='bypass'][kind!='review'][kind!='skip']");
            var strDate;
            var bCompleted = false; // 사용자 결재완료여부
            var bWICancel = false;  // 승인취소 버튼 활성화 여부

            // jQuery.fn.reverse = [].reverse;
            // $(elmList.concat().json()).reverse().each(function (i,
			// elmTaskInfo) { //foreach거꾸로하기
            for(var i=elmList.concat().length; i>0; i--){
            	var elmTaskInfo = elmList.concat().eq(i-1);
                var elm = $$(elmTaskInfo).parent();
                if ($$(elmTaskInfo).attr("status") == "inactive") {      // 문서를
																			// 받지
																			// 않은
																			// 경우
                } else {
                    if ($$(elmTaskInfo).attr("status") == 'reserved') {  // 보류
                        bCompleted = true;
                        bWICancel = false;
                        break;
                        // return false;
                    } else if ($$(elmTaskInfo).attr("status") == 'pending') {    // 대기
																					// 일반결재일때만
																					// 승인취소가능
                        if ((($$(elm).parent()).parent()).attr("routetype") == "approve") {
                            bCompleted = false;
                        } else if ((($$(elm).parent()).parent()).attr("routetype") == "assist") {
                            bCompleted = false;
                        } else if ((($$(elm).parent()).parent()).attr("routetype") == "consult") {
                            bCompleted = false;
                        } else if ((($$(elm).parent()).parent()).attr("routetype") == "audit") {
                            bCompleted = false;
                        } else {
                            bWICancel = false;
                            break;
                        }
                    } else if (bCompleted == false && $$(elmTaskInfo).attr("datecompleted") != null) {
                        if ($$(elm).parent().attr("wiid") == getInfo("Request.workitemID")) {
                            bWICancel = true;
                            break;
                        }

                        else {
                            bWICancel = false;
                            break;
                        }
                    } else {
                        bWICancel = false;
                        break;
                    }
                }
            }

            // 병렬협조자일때
        	if ($$(m_evalJSON).find("division").has("taskinfo[status='pending']").find("step[allottype='parallel']").has("taskinfo[status='completed']").has("ou > person").has("taskinfo[wiid='" + getInfo("Request.workitemID") + "'][status='pending']").length > 0) {
        		bWICancel = true;
        	} else if ($$(m_evalJSON).find("division").has("taskinfo[status='pending']").find("step[allottype='parallel']").has("taskinfo[status='completed']").has("ou > person").has("taskinfo[wiid='" + getInfo("Request.workitemID") + "']").next().find("ou > person > taskinfo[status='pending']").length > 0) {
        		// 병렬협조자일때
        		bWICancel = true;
        	}
            
            if (getInfo("Request.mode") == "SUBAPPROVAL") {
                elmList = $$(m_evalJSON).find("division").has("taskinfo[status='pending']").find(">step>ou").has("taskinfo[piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find(">person>taskinfo[kind!='charge'][kind!='bypass'][kind!='review'][kind!='skip']");
                if (elmList.length > 0) {
                    bCompleted = false;
                    jQuery.fn.reverse = [].reverse;
                    for(var i=elmList.concat().length; i>0; i--){
                    	var elmTaskInfo = elmList.concat().eq(i-1);
                        var elm = $$(elmTaskInfo).parent();
                        if ($$(elmTaskInfo).attr("status") == "inactive") {// 문서를
																			// 받지
																			// 않은
																			// 경우
                        } else {
                            if ($$(elmTaskInfo).attr("status") == 'reserved') {// 보류
                                bCompleted = true;
                                break;
                            } else if ($$(elmTaskInfo).attr("status") == 'pending') {// 대기
																						// 일반결재일때만
																						// 승인취소가능
                                if (($$(elm).parent()).attr("routetype") != "approve") {
                                    bWICancel = false;
                                    break;
                                } else {
                                    bCompleted = false;
                                }
                            } else if (bCompleted == false && $$(elmTaskInfo).attr("datecompleted") != null && $$(elm).parent().attr("wiid") == getInfo("Request.workitemID")) {
                                bWICancel = true;
                                break;
                            } else {
                                bWICancel = false;
                                break;
                            }
                        }
                    }
                } else {
                    bWICancel = false;
                }
            }

            // 수신처 담당자가 pending 상태일 때는 회수 안됨
            elmList = $$(m_evalJSON).find("division[divisiontype='receive']").has("taskinfo[status='pending']").find(">step>ou>person").has("taskinfo[kind='normal']");
            if (elmList.length > 0) {
                elmList = $$(m_evalJSON).find("division[divisiontype='receive']").has("taskinfo[status='pending']").find(">step>ou>person").has("taskinfo[kind='charge']");
                if (elmList.length == 0) {
                    bWICancel = false;
                }
            }
            // 수신처 수신함에 pending 일 경우 회수 안됨
            elmList = $$(m_evalJSON).find("division[divisiontype='receive']").has("taskinfo[status='pending']").find(">step>ou");
            if (elmList.length > 0) {
                elmList = $$(m_evalJSON).find("division[divisiontype='receive']").has("taskinfo[status='pending']").find(">step>ou>person").has("taskinfo[kind='charge']");
                if (elmList.length == 0) {
                    bWICancel = false;
                }
            }
            if (bWICancel) {
                document.getElementById("btApproveCancel").style.display = "";
            }
        }

       /*
		 * if (getInfo("Request.reuse") != "N") setTimeout(commentOpen, 1000);
		 * 임의로 주석
		 */

        if (getInfo("Request.reuse") == "N") document.getElementById("btModify").style.display = "none";

        // 현결재자 변경 후 후결 셋팅
        if (getInfo("SchemaContext.scChangeReview.isUse") == "Y") // 특정 양식만
        {
            if (getInfo("Request.subkind") == "T006") // 기안자
            {
                if (getInfo("Request.loct") == "PROCESS" && getInfo("Request.mode") == "PROCESS") { // 진행함에서
																									// 현재결재자가
																									// 일반결재일
																									// 경우
                    var m_evalXMLChangeReview = $.parseXML(document.getElementById("APVLIST").value);
                    var elmRootChangeReview = $(m_evalXMLChangeReview).find("steps");

                    var elmApprover = $(elmRootChangeReview).find("division[divisiontype='send']:has(>taskinfo[status = 'pending' ]) > step > ou > person:has(taskinfo[kind='normal'][status='pending'])");
                    if (elmApprover.length == 1) document.getElementById("btApproverChangeReview").style.display = "";
                }

                if (getInfo("Request.loct") == "PROCESS" && getInfo("Request.mode") == "PCONSULT") { // 진행함에서
																										// 현재결재자가
																										// 협조일
																										// 경우
                    var m_evalXMLChangeDeputy = $.parseXML(document.getElementById("APVLIST").value);
                    var elmRootChangeDeputy = $(m_evalXMLChangeDeputy).find("steps");

                    var elmApprover = $(elmRootChangeDeputy).find("division[divisiontype='send']:has(>taskinfo[status = 'pending' ]) > step[routetype='consult']:has(>taskinfo[status = 'pending' ]) > ou > person:has(taskinfo[kind='consult'][status='pending'])");
                }
            }
        }
    } else {
        // 사용자 문서 조회 및 수정
        // 관리자 모드가 아닐때
        if (admintype != "ADMIN") {
            // Legacy일경우
            switch (getInfo("Request.loct")) {
                case "DRAFT":
                    document.getElementById("btDraft").style.display = "";	// "기안하기"
                    // document.getElementById("btLine").style.display = "";
					// //"결재선관리"
                    break;
                // default:
                    // document.getElementById("btLine").style.display = "";
					// //"결재선관리"
                    // break;
            }
        }
    }

    // 도움말 팝업
    try {
        if ((getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE") && getInfo("ExtInfo.UseDocHelpApproval") == "Y") {
            $("#trHelpApproval").css("display", "");
            document.getElementById("HelpApproval").innerHTML = getInfo("FormInfo.FormHelperContext");
        }
        if (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE") {
            setTimeout("helpOpen('popup');", 100);
        }
    } catch (e) {
    }    

    // 연속결재 특정 버튼 hide
    if (CFN_GetQueryString("bserial") == "true") {
        try {
        	$(".topWrap").find("input[name=cbBTN]").each(function () {
                var id = $(this).attr("id");
                switch (id) {
                    case "btApproved":
                    case "btReject":
                    // case "btRejectedto":
                    // case "btRejectedtoDept":
                    case "btHold":
                    case "btSerialCancel":
                        break;
                    default:
                        $(this).hide();
                        break;
                }
            });
        } catch (e) {

        }
    }

    // 양식팝업창 title 변경
    document.getElementsByTagName('title')[0].text = _strAppName + " - " + CFN_GetDicInfo(getInfo("FormInfo.FormName"));
}

// 양식에 필요한 정보 팝업(팝업공지, 양식도움말 등을 띄운다)
function helpOpen(type) {
    var sTitle = "";
    if (type == "popup") {
        if (getInfo("ExtInfo.UseDocPopupApproval") != "Y") {
            return;
        } else {
            sTitle = coviDic.dicMap.lbl_NoticePopup;
        }
    } else if (type == "popupbtn") {
        if (getInfo("ExtInfo.UseDocPopupBtn") != "Y") {
            return;
        } else {
            sTitle = coviDic.dicMap.lbl_NoticePopup;
        }
    } else if (type == "help") {
        if (getInfo("ExtInfo.UseDocHelpApproval") != "Y") {
            return;
        } else {
            sTitle = coviDic.dicMap.lbl_apv_formcreate_LCODE28;
        }
    } else {
        return;
    }
    var sUrl2 = "form/goHelpPopup.do?type=" + type;
    var iHeight = 400; var iWidth = 600;

    var nLeft = (screen.width - iWidth) / 2;
    var nTop = (screen.height - iHeight) / 2;
    var sWidth = iWidth.toString() + "px";
    var sHeight = iHeight.toString() + "px";
    var sLeft = nLeft.toString() + "px";
    var sTop = nTop.toString() + "px";

    CFN_OpenWindow(sUrl2, "", iWidth, iHeight, "resize");
}

function commentOpen() {// 미결 혹은 재기안으로 문서를 열 경우 의견이 있는 경우 의견 창 display
	if (getInfo("Request.loct") == "APPROVAL" || getInfo("Request.loct") == "REDRAFT") {
        m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
        var elmRoot = $$(m_evalJSON).find("steps");
        var elmList = $$(elmRoot).find("division > step > ou > person > taskinfo > comment,division > step > ou > role > taskinfo > comment");
        if (elmList.length > 0) {
            // 의견이 있을 경우 깜빡이게 처리
            $("#btCommentView").attr("class", "opinion_view");
        }
    }
}
function setApvDirty() { m_bApvDirty = true; }

function setApvChangeMode(pMode) { m_ApvChangeMode = pMode; }	// 결재선변경 모드

// setPreView 함수 분리
function setPreViewData() {
    try {
        // if (CFN_GetQueryString("openID") == getInfo("FormInfo.FormID"))
		// {//Layer popup 실행일 경우 queryString으로 openID를 넘김
        if (CFN_GetQueryString("editMode") == 'Y' && CFN_GetQueryString("CFN_OpenWindowName") == 'undefined') {// Layer
																												// popup
																												// 실행일
																												// 경우
																												// 완료함,
																												// 편집함에서
																												// 미리보기
																												// 할 경우
            openID = CFN_GetQueryString("openID");
            if ($("#" + openID + "_if", parent.document).length > 0) {
                m_oInfoSrc = $("#" + openID + "_if", parent.document)[0].contentWindow;
                var formJsonObj = m_oInfoSrc.getFormJSON().FormData;

            }
        } else if (openMode == "L") {// Layer popup 실행일 경우 queryString으로
										// openID를 넘김
            var openID = getInfo("FormInfo.FormID");
            if ($("#" + openID + "_if", parent.document).length > 0) {
                m_oInfoSrc = $("#" + openID + "_if", parent.document)[0].contentWindow;
                var formJsonObj = m_oInfoSrc.getFormJSON().FormData;
            }
        } else {
        	if(opener != null) {
        		var formJsonObj = opener.getFormJSON().FormData;
        	} else if(window.sessionStorage["formjson"] != undefined && _mobile) {
        		var formJsonObj = JSON.parse(window.sessionStorage["formjson"]).FormData;
        	}
        }
        if (!formJsonObj.hasOwnProperty("BodyContext") || $.isEmptyObject(formJsonObj.BodyContext)) {
        	$.extend(formJsonObj, makeNode("BodyContext", getInfo("BodyContext")));
        }
        
        $.each(formJsonObj, function(key, value) {
        	// 속도이슈 문제로 예외처리함.
        	if(key == "BodyContext" || key == "BodyData"){
        		// setInfo(key, value);
        	}else{
        		setInfo("FormInstanceInfo."+key, value);
        	}
        });
        
        if(typeof formJsonObj.BodyContext != "undefined") {
        	setInfo("BodyContext", formJsonObj.BodyContext);
        }
        if(typeof formJsonObj.BodyData != "undefined") {
        	setInfo("BodyData", formJsonObj.BodyData);
        }
        
        if(formJson.BodyContext.HTMLBody != undefined){
        	$("#legacyFormDiv").html(formJson.BodyContext.HTMLBody);
        }

    } catch (e) {
        alert(e.message);
    }

}

function setPreViewPostRendering() {
    try {
        setInfo("FormInstanceInfo.InitiatedDate", getInfo("AppInfo.svdt"));
        g_szEditable = false;
        setInfo("Request.mode", "COMPLETE");
        setInfo("Request.loct", "COMPLETE");


        if (CFN_GetQueryString("openID") == getInfo("FormInfo.FormID") || CFN_GetQueryString("editMode") == 'Y' && CFN_GetQueryString("CFN_OpenWindowName") == 'undefined') {
            document.getElementById("APVLIST").value = m_oInfoSrc.document.getElementById("APVLIST").value;

        } else {
        	if(opener != null)
        		document.getElementById("APVLIST").value = opener.document.getElementById("APVLIST").value;
        	else if(_mobile && window.sessionStorage["apvlist"] != undefined)
        		document.getElementById("APVLIST").value = window.sessionStorage["apvlist"];
        }

        initOnloadformedit();

        var aBtn = document.getElementsByName("cbBTN");
        for (var i = 0; i < aBtn.length; i++) {
            aBtn[i].style.display = "none";
        }

        // 대외공문 미리보기 창,readtype = print 조건 추가
        if (getInfo("Request.readtype") != "Pubpreview" && getInfo("Request.readtype") != "Print") {
            document.getElementById("btPrint").style.display = "";
            if (getInfo("SchemaContext.scOPub.isUse") == "Y") { // 버튼 위치 이동
                // 대외공문 기안시 보여줄 버튼 추가
                document.getElementById("btOTrans").style.display = "";
            }
        }else if (getInfo("Request.readtype") == "Pubpreview" || getInfo("Request.readtype") == "Print") {
            // 대외공문미리보기 일경우 양식명, 결재선, 참고정보 display:none;
            document.getElementById("divMenu02").style.display = "none";
            document.getElementById("formlogo").style.display = "none";
            document.getElementById("AppLine").style.display = "none";
            document.getElementById("AppLineListType").style.display = "none";
            document.getElementById("AssistLine").style.display = "none";
            document.getElementById("tbLinkInfo").style.display = "none";
        }

        document.getElementById("btExitPreView").style.display = "";
    } catch (e) {
        alert(e.message);
    }
}

// 미리보기 창에서 하던 함수를 수정함
function setPreView() {
    var formJsonObj = opener.getFormJSON();
    if (!formJsonObj.hasOwnProperty("BodyContext") || $.isEmptyObject(formJsonObj.BodyContext)) {
    	$.extend(formJsonObj, makeNode("BodyContext", getInfo("BodyContext")));
    }
    
    $.each(formJsonObj, function(key, value) {
    	if(key == "BodyData"){
    		setInfo(key, JSON.stringify(value));
    	}else{
    		setInfo(key, value);
    	}
    });

    setInfo("FormInstanceInfo.InitiatedDate", getInfo("AppInfo.svdt"));
    g_szEditable = false;
    setInfo("Request.mode", "COMPLETE");
    setInfo("Request.loct", "COMPLETE");
    document.getElementById("APVLIST").value = opener.document.getElementById("APVLIST").value;

    initOnloadformedit();

    var aBtn = document.getElementsByName("cbBTN");

    for (var i = 0; i < aBtn.length; i++) {
        aBtn[i].style.display = "none";
    }
    
    // 대외공문 미리보기 창,readtype = print 조건 추가
    if (getInfo("Request.readtype") != "Pubpreview" && getInfo("Request.readtype") != "Print") {
        document.getElementById("btPrint").style.display = "";
        if (getInfo("SchemaContext.scOPub.isUse") == "Y") { // 버튼 위치 이동
            // 대외공문 기안시 보여줄 버튼 추가
            document.getElementById("btOTrans").style.display = "";
        }
	    } else if (getInfo("Request.readtype") == "Pubpreview" || getInfo("Request.readtype") == "Print") {
        // 대외공문미리보기 일경우 양식명, 결재선, 참고정보 display:none;
        document.getElementById("divMenu02").style.display = "none";
        document.getElementById("formlogo").style.display = "none";
        document.getElementById("AppLine").style.display = "none";
        document.getElementById("AppLineListType").style.display = "none";
        document.getElementById("AssistLine").style.display = "none";
        document.getElementById("tbLinkInfo").style.display = "none";
    }

    document.getElementById("btExitPreView").style.display = "";

    clearInterval(timerID);
}

function setOpenWindowData() {
    try {
        // 작성창 조회창 구분에 따른 값 가져오기 처리
        if (getInfo("Request.templatemode") == "Write") {
            var formJsonObj = getFormJSON();
            
            if (!formJsonObj.hasOwnProperty("BodyContext") || $.isEmptyObject(formJsonObj.BodyContext)) {
            	$.extend(formJsonObj, makeNode("BodyContext", getInfo("BodyContext")));
            }
            
            $.each(formJsonObj, function(key, value) {
            	if(key == "BodyData"){
            		setInfo(key, JSON.stringify(value));
            	}else{
            		setInfo(key, value);
            	}
            });
            
        }
    } catch (e) {
        alert(e.message);
    }
}

function setOpenWindowPostRendering() {
    try {
        document.getElementById("APVLIST").value = $("textarea[name=APVLIST]", opener.document).val();  // HIW

        initOnloadformedit();

        if (opener.openID != null && opener.openMode == "L") {
            opener.parent.Common.Close(opener.openID);
        } else {
            // 작성이외의 LayerPopup에서 새창 떳을때 opener가 사라져, destination 상실 보완
            if (opener.location.href.toUpperCase().indexOf("/APPROVAL/FORMS/FORMWRITE.ASPX") > -1) {
                opener.document.location.href = "/WebSite/Approval/FormList/FormList.aspx?system=Approval&alias=Form&mnid=74"; // 결재문서
																																// 작성
																																// 페이지
            }
            else {
                opener.openID = getInfo("FormInfo.FormID") + getInfo("ProcessInfo.ProcessID") + getInfo("FormInstanceInfo.FormInstID");
                opener.parent.Common.Close(opener.openID);
            }
        }
    } catch (e) {
        alert(e.message);
    }
}

// 분리
function setOpenWindow() {
    // 작성창 조회창 구분에 따른 값 가져오기 처리
    if (getInfo("Request.templatemode") == "Write") {
    	var formJsonObj = getFormJSON();
    	

        if (!formJsonObj.hasOwnProperty("BodyContext") || $.isEmptyObject(formJsonObj.BodyContext)) {
        	$.extend(formJsonObj, makeNode("BodyContext", getInfo("BodyContext")));
        }
        
        $.each(formJsonObj, function(key, value) {
        	if(key == "BodyData"){
        		setInfo(key, JSON.stringify(value));
        	}else{
        		setInfo(key, value);
        	}
        });

        document.getElementById("APVLIST").value = $("textarea[name=APVLIST]", opener.document).val();  // HIW

        initOnloadformedit();
    }
    clearInterval(timerID1);
    if (opener.openID != null && opener.openMode == "L") {
        opener.parent.Common.Close(opener.openID);
    } else {
        // 작성이외의 LayerPopup에서 새창 떳을때 opener가 사라져, destination 상실 보완
        if (opener.location.href.toUpperCase().indexOf("/APPROVAL/FORMS/FORMWRITE.ASPX") > -1) {
            opener.document.location.href = "/WebSite/Approval/FormList/FormList.aspx?system=Approval&alias=Form&mnid=74"; // 결재문서
																															// 작성
																															// 페이지
        }
        else {
            // 20120125 By ssuby 새창열릴때 기존 reload대신 opner인 Layer창만 닫는 처리로 변경
            opener.openID = getInfo("FormInfo.FormID") + getInfo("ProcessInfo.ProcessID") + getInfo("FormInstanceInfo.FormInstID");
            opener.parent.Common.Close(opener.openID);
        }
    }
}
function initBtn() {
    if (getInfo("Request.readtype") == "preview") // 미리보기 창인지 검증
    {
        document.getElementById("btHistory").style.display = "none"; /*
																		 * document.getElementById("li_btHistory").style.display =
																		 * "none";
																		 */ /*
																																			 * 게시발송
																																			 * 버튼
																																			 * 비사용
																																			 * document.getElementById("btBBS").style.display =
																																			 * "none";
																																			 */ /*
																																																					 * 메일보내기(btMail)
																																																					 * 버튼
																																																					 * 비사용
																																																					 * document.getElementById("btMail").style.display =
																																																					 * "none";
																																																					 */
        try { document.getElementById("btPreView").style.display = "none";  } catch (e) { }

        return;
    }

    // readtype = print 조건 추가
    if (getInfo("Request.readtype") == "Pubpreview" || getInfo("Request.readtype") == "Print") // 대외공문
																								// 미리보기
																								// 창인지
																								// 검증
    {
        document.getElementById("btHistory").style.display = "none";
        try {
            document.getElementById("btPreView").style.display = "none";
            document.getElementById("btPM").style.display = "none";
        } catch (e) { }

        return;
    }

    if (getInfo("ExtInfo.UseDocPopupBtn") == "Y") {
    	document.getElementById("btDocPopup").style.display = "";
    }
    
    var strRecDept = (getDisplayMode(getInfo("Request.mode"), 'scIPub') == "none") ? "none" : getDisplayMode(getInfo("Request.mode"), 'scDeployBtn');
    var strPrint = "none";
    document.getElementById("chk_urgent").disabled = true; document.getElementById("chk_secrecy").disabled = true;
    
    switch (getInfo("Request.loct")) {
        case "ADMIN":
        	// 관리자 내용변경 체크에 따른 표시
        	if(getInfo("SchemaContext.scADMCHBis.isUse") == "Y") {
        		document.getElementById("btModify").style.display = ""; // 문서편집
        	}
            if (getInfo("Request.editmode") == "Y") {
                // 관리자모드이고 편집모드이면 저장 버튼 보인다.
                document.getElementById("btchangeSave").style.display = "";
                document.getElementById("btModify").style.display = "none";
            }
            break;
        case "PUB":
            document.getElementById("btPrint").style.display = "";
            break;
        case "PREAPPROVAL":
            // [2019-02-20 MOD] gbhwang 예고함 선결재 기능 추가 관련
            var oApvList = $.parseJSON(document.getElementById("APVLIST").value);
            var lastApproverCode = $$(oApvList).find("steps>division[divisiontype='send']>step[routetype='approve']").last().find("person").attr("code");
            
            // 최종결재자 중 허용된 사용자에 한하여 선결재 기능 사용 가능
            if(Common.getBaseConfig("PreApproverCode").indexOf(getInfo("AppInfo.usid")) > -1 && lastApproverCode == getInfo("AppInfo.usid")) {
                document.getElementById("btApprovedLast").style.display = "";
                document.getElementById("btRejectLast").style.display = "";
            }
        case "PROCESS":

        case "COMPLETE":
            if (getInfo("Request.loct") == "COMPLETE" && getInfo("Request.subkind") != "T010") { /*
																									 * document.getElementById("li_btCirculate").style.display =
																									 * "";
																									 */ document.getElementById("btCirculate").style.display = ""; document.getElementById("btCirculate_View").style.display = ""; /*
																																																																								 * document.getElementById("li_btCirculate_View").style.display =
																																																																								 * "";
																																																																								 */ }
            if (getInfo("Request.loct") == "COMPLETE") {
                document.getElementById("btPcSave").style.display = ""; document.getElementById("btMailSend").style.display = (bMailUse == "True") ? "" : "none"

            };
            // (본사운영) 휴가취소신청서
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_VACATION_REQUEST2" && formJson.BodyContext.InitiatorCodeDisplay == getInfo("AppInfo.usid"))
            	document.getElementById("btVacationCancle").style.display = ""; // 휴가취소신청서
            
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_VACATION_TEST" && formJson.BodyContext.InitiatorCodeDisplay == getInfo("AppInfo.usid"))
            	document.getElementById("btVacationCancleTest").style.display = ""; // 휴가취소신청서
                        
            if (getInfo("FormInfo.IsUse") == "N") {
                document.getElementById("btReUse").style.display = "none";
            }
            /*
			 * else if (getInfo("FormInstanceInfo.InitiatorID") ==
			 * getInfo("AppInfo.usid")) { if ('COMPLETE' ==
			 * getInfo("Request.loct") && getInfo("Request.gloct") != "") {
			 * //완료함에서만 재사용 버튼 보여주기
			 * document.getElementById("btReUse").style.display = ""; } }
			 */

            /*
			 * 기록물철목록이동 버튼 비사용 if (getInfo("Request.loct") == "COMPLETE") {
			 * //기록물철목록에서 열람한 문서일경우 문서이동,삭제 (2013-10-14 HIW) try { if
			 * (opener.location.href.indexOf("ListRecord.aspx") > -1) {
			 * document.getElementById("btMoveRecDoc").style.display = ""; } }
			 * catch (e) { } }
			 */

            if (getInfo("Request.gloct") == "SHARER") document.getElementById("btShared").style.display = "";
            
            if (getInfo("SchemaContext.scOPub.isUse") == "Y" && getInfo("Request.loct") == "COMPLETE") {   // [2018-10-01
																											// yjlee]
																											// 완료함에서만
																											// 대외공문
																											// 보여주도록
																											// 변경
                // 대외공문 완료함에서 보여줄 버튼
                document.getElementById("btOTrans").style.display = "";
            }

            // (본사운영) 발주 버튼
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_ORDER" && (getInfo("Request.gloct") == "BizDoc" || getInfo("Request.gloct") == "JOBFUNCTION")) {
                // 발주품의 완료함에서 보여줄 버튼
                document.getElementById("btPurchaseOrder").style.display = "";
            }

            // (본사운영) 외주 버튼
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_OUTSOURCING" && (getInfo("Request.gloct") == "BizDoc" || getInfo("Request.gloct") == "JOBFUNCTION")) {
                document.getElementById("btPrintContract").style.display = "";
            }

            // (본사운영) 라이선스 버튼
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_License") {
                document.getElementById("btPrintLicense").style.display = "";
            }

            // 회신옵션 수정
            if (getInfo("SchemaContext.scReply.isUse") == "Y") { // 회신옵션
            	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                var elmRoot = $(m_evalJSON).find("steps");
                var elmRouCount = $(elmRoot).find("division[divisiontype='receive'][oucode='" + getInfo("AppInfo.dpid_apv") + "']").length;
                if (elmRouCount > 0) {
                    document.getElementById("btReplyHeoyJo").style.display = "";
                }
            }
        case "CANCEL":
        case "JOBDUTY":
        case "REVIEW":
        case "REJECT":
            displayBtn("none", "none", "none", "none", "", "none", "none", "none", "none", "none", "none", "none", "none", getInfo("Request.loct") == "COMPLETE" ? "" : "none", "none", "none", "");
            strPrint = "";
            document.getElementById("btPrintView").style.display = "none";
            /*
			 * if (!_ie) { document.getElementById("btPrintView").style.display =
			 * "none"; } else {
			 * document.getElementById("btPrintView").style.display = ""; }
			 */
            document.getElementById("btPrint").style.display = strPrint; // 출력
            if ((getInfo("Request.gloct") == "COMPLETE" || getInfo("Request.loct") == "REJECT") && getInfo("FormInstanceInfo.InitiatorID") == getInfo("AppInfo.usid")) {
            	 // document.getElementById("btReUse").style.display = "";
                 // (본사운영) 출장복명서 작성 (btBizrip)
                if (getInfo("FormInfo.FormPrefix") == "WF_FROM_BIZTRIP_REQUEST") document.getElementById("btBizrip").style.display = "";

                // 수신부서 재사용 버튼
               /*
				 * if ('' !== document.getElementById("APVLIST").value) {
				 * m_evalJSON =
				 * $.parseJSON(document.getElementById("APVLIST").value); var
				 * elmRoot = $(m_evalJSON).find("steps"); var elmRouCount =
				 * $(elmRoot).find("division[divisiontype='receive'][oucode='" +
				 * getInfo("AppInfo.dpid_apv") +
				 * "']:has(taskinfo[status='rejected'])").length;
				 * 
				 * if (elmRouCount > 0) {
				 * document.getElementById("btReUse").style.display = ""; }
				 *  }
				 */

                // 집행계획서 작성 버튼 (본사운영 - 수주보고 양식)
                if (getInfo("FormInfo.FormPrefix") == "WF_FORM_CONTRACT_DRAT") document.getElementById("btnExecPlan").style.display = "";
            }
            if (getInfo("FormInfo.IsUse") == "N") { document.getElementById("btReUse").style.display = "none"; }

            document.getElementById("btCommentView").style.display = "";

            if ((getInfo("Request.loct") == "COMPLETE") && getInfo("Request.mode") == "COMPLETE") { if (getInfo("SchemaContext.scIPub.isUse") == "Y" || getInfo("SchemaContext.scOPub.isUse") == 'Y') { document.getElementById("btReceiptView").style.display = ""; /*
																																																																		 * document.getElementById("li_btReceiptView").style.display =
																																																																		 * "";
																																																																		 */ } }

            // 의견버튼 추가 : 완료된 문서에 기안자+결재자에 한해서 의견 추가
            if ((getInfo("Request.loct") == "COMPLETE" && 
            	 getInfo("Request.mode") == "COMPLETE") && 
            	 getInfo("SchemaContext.scCmtAdd.isUse") == "Y" && 
            	 (getInfo("Request.subkind") == "T000" || getInfo("Request.subkind") == "T004" || getInfo("Request.subkind") == "T006" || getInfo("Request.subkind") == "T009" || getInfo("Request.subkind") == "T016")) {document.getElementById("btComment").style.display = ""; document.getElementById("btCommentView").style.display = ""; /*
																																																																																				 * document.getElementById("li_btCommentView").style.display =
																																																																																				 * "";
																																																																																				 */ }
            
            // 연동 양식 재사용 버튼 숨김처리
            if (getInfo("Request.isLegacy") == "Y") {
            	document.getElementById("btReUse").style.display = "none";
            }

            break;
        case "DRAFT":
            /*
			 * 기록물철분류 선택 버튼 비사용 if (getInfo("SchemaContext.scRecDoc.isUse") ==
			 * "Y" && gIsSAP != "Y") { //기록물철 사용인 경우 if (getInfo("Request.loct") ==
			 * "DRAFT") { //최초기안시에만 [기록물철분류선택]버튼 보이게 try {
			 * document.getElementById("btSelRecDoc").style.display = ""; }
			 * catch (e) { } } }
			 */
        case "PREDRAFT":
        case "TEMPSAVE":
            displayBtn("", "none", getDisplayMode(getInfo("Request.mode"), 'scEdms'), "none", "", strRecDept, "none", "none", "none", "", "none", "", "", "none", "none", "", "");
            if (getInfo("ExtInfo.UseApproveSecret") == "Y") {
                document.getElementById("chk_secrecy").checked = true;
                document.getElementById("chk_secrecy").value = "1";
                document.getElementById("chk_secrecy").disabled = true;
            } else {
                document.getElementById("chk_secrecy").disabled = false;
            }
            document.getElementById("chk_urgent").disabled = false;
            /* 추가의견 */
            document.getElementById("btComment").style.display = "none"; 
            document.getElementById("btHistory").style.display = "none"; 

            // 즐겨찾기 여부 확인을 Ajax 처리하지 않고 서버에서 변수로 처리
            if (gFormFavoriteYN == "Y") {
                document.getElementById("favorformadd").style.display = "none";
                document.getElementById("favorformdelete").style.display = "";
            } else {
                document.getElementById("favorformadd").style.display = "";
                document.getElementById("favorformdelete").style.display = "none";
            }

            /*
			 * 예약발송, 예약배포(스키마) 비사용 //예약발송,배포 활성화 if (getInfo("scReserved") ==
			 * "1" || getInfo("scDistribute") == "1") { if
			 * (getInfo("Request.readtype") == "preview" ||
			 * getInfo("Request.templatemode") == "Read") {
			 * document.getElementById("reserved").style.display = "none"; }
			 * else { document.getElementById("reserved").style.display = ""; } }
			 */

            /*
			 * 기록물철분류 선택 버튼 비사용 if (getInfo("SchemaContext.scRecDoc.isUse") ==
			 * "Y" && gIsSAP != "Y") { //기록물철 사용인 경우 if (getInfo("Request.loct") ==
			 * "TEMPSAVE") { //최초기안시에만 [기록물철분류선택]버튼 보이게 try {
			 * document.getElementById("btSelRecDoc").style.display = ""; }
			 * catch (e) { } } }
			 */
            break;
        case "REDRAFT":
            // 회신옵션 수정
            if (getInfo("SchemaContext.scReply.isUse") == "Y") { // 협조전에만 회신
																	// 버튼 나오게 수정
                m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                var elmRoot = $(m_evalJSON).find("steps");
                var elmRouCount = $(elmRoot).find("division[divisiontype='receive'] > step > ou[code='" + getInfo("AppInfo.dpid_apv") + "'] > taskinfo[status='pending']").length;
                if (elmRouCount > 0) {
                    document.getElementById("btReplyHeoyJo").style.display = "";
                }
            }
        case "SHARER":
        case "APPROVAL":
            switch (getInfo("Request.mode")) {
                case "SHARER":
                case "APPROVAL": // 일반결재
                    displayBtn("none", "none", "none", "none", "", strRecDept, "", "none", "none", "none", "", "none", "none", "none", "none", "none", ""); // 모든
																																							// 결재자
																																							// 첨부파일
																																							// 추가
                    document.getElementById("btCommentView").style.display = ""; 

                    // 스키마 체크, 배포 부서에서 편집 X
                    // 동시결재 시 스크립트 오류 발생하여 주석처리함(수신부서는 REDRAFT, RECAPPROVAL일 때
					// 탐)
                    // if (getInfo("SchemaContext.scCHBis.isUse") == "Y" &&
					// !(getInfo("ProcessInfo.ProcessName").indexOf("Basic") >
					// -1 &&
					// $$(formJson.ApprovalLine).find("division").has("taskinfo[status=pending]").has("step>ou[taskid="+getInfo("ProcessInfo.TaskID")+"]").index()
					// > 0)) {
                    if (getInfo("SchemaContext.scCHBis.isUse") == "Y") {
                        if (!fn_GetReview()) { document.getElementById("btModify").style.display = ""; }
                    } else {
                        document.getElementById("btModify").style.display = "none";
                    }
                    if (getInfo("SchemaContext.scTransfer.isUse") == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid")) document.getElementById("btForward").style.display = ""; // 전달버튼
																																																// 활성화
                    break;
                case "AUDIT": // 감사
                case "PCONSULT": // 개인합의
                    document.getElementById("btCommentView").style.display = ""; 
                    displayBtn("none", "none", "none", "none", "", "none", "", "none", "none", "none", "", "none", "none", "", "", "none", "");
                    if (getInfo("SchemaContext.scTransfer.isUse") == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid")) document.getElementById("btForward").style.display = ""; // 전달버튼
																																																// 활성화
                    break;
                case "RECAPPROVAL": // 수신결재
                    document.getElementById("btCommentView").style.display = ""; 
                    document.getElementById("btModify").style.display = (getInfo("SchemaContext.scRCHBis.isUse") == "Y") ? "" : "none";
                    displayBtn("none", "none", "none", "none", "none", "none", "", "none", "", "none", "", "none", "none", "none", "none", "none", ""); // 모든
																																						// 결재자
																																						// 첨부파일
																																						// 추가

                    if (getInfo("SchemaContext.scTransfer.isUse") == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid")) document.getElementById("btForward").style.display = ""; // 전달버튼
																																																// 활성화

                    // 회신옵션 수정
                    if (getInfo("SchemaContext.scReply.isUse") == "Y") { // 협조전에만
																			// 회신
																			// 버튼
																			// 나오게
																			// 수정
                    	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                        document.getElementById("btReplyHeoyJo").style.display = "";
                    }
                    break;
                case "SUBAPPROVAL": // 부서합의내결재
                    if (getInfo("SchemaContext.scTransfer.isUse") == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid")) document.getElementById("btForward").style.display = ""; // 전달버튼
																																																// 활성화
                    displayBtn("none", "none", "none", "none", "none", "none", "", "none", "", "none", "", "none", "none", "", "", "none", ""); break;
                case "DEPART": // 부서
                    break;
                case "CHARGE": // 담당자
                    document.getElementById("btCommentView").style.display = ""; 
                    displayBtn("none", "none", "none", "none", "none", "none", "", "none", "none", "none", "", "none", "none", "", "", "none", ""); break;
                case "REDRAFT": // 재기안
                    var sdisplay = "";
                    var sAttDisplay = "";
                    if (getInfo("Request.subkind") == "T008") {
                        displayBtn("none", "none", "none", "none", "", "none", "", "none", "none", "none", "", (getInfo("SchemaContext.scCHBis.isUse") == "Y") ? "" : "none", "none", "none", "none", "", "");
                    } else {
                        sAttDisplay = "";
                        // 문서관리자 권한 설정
                        if (getInfo("SchemaContext.scRec.isUse") == "Y") {
                            sdisplay = "none";
                            sAttDisplay = "none";
                            if (getInfo("AppInfo.usismanager") == "true" || getInfo("Request.usisdocmanager") == "true") { // ||
																															// getInfo("dpisdocmanager")
																															// ==
																															// "false")
																															// { -
																															// dpisdocmanager
																															// 비사용
                                if (getInfo("Request.userCode") == getInfo("ProcessInfo.UserCode")) {
                                    document.getElementById("btRec").style.display = "";
                                    document.getElementById("btReject").style.display = "";
                                } else {
                                    document.getElementById("btRec").style.display = "none";
                                }
                            }
                        }
                        if (getInfo("SchemaContext.scRecBtn.isUse") == "Y") { sdisplay = ""; sAttDisplay = ""; document.getElementById("btCharge").style.display = ""; }
                        if (getInfo("Request.loct") == "REDRAFT" && getInfo("Request.mode") == "REDRAFT") {// 신청서
																											// 수신함
																											// 조회 시
                            displayBtn("none", "none", "none", "none", "none", "none", "", "none", "", "none", "", "none", "none", "none", "none", "", ""); // 모든
																																							// 결재자
																																							// 첨부파일
																																							// 추가

                            {   // 수신함 편집 버튼 클릭시 재기안 버튼 처리
                            	var m_evalJSON_receive = $.parseJSON(document.getElementById("APVLIST").value);
                                var elmRoot_receive = $$(m_evalJSON_receive).find("steps");
                                var elmRouCount_receive = $$(elmRoot == undefined ? {} : elmRoot ).find("division[divisiontype='receive'][oucode='" + getInfo("AppInfo.dpid_apv") + "']>ou>person>taskinfo[kind != 'charge']").length;
                                if (elmRouCount_receive > 0) {
                                    document.getElementById("btReUse").style.display = "";
                                }
                            }
                            // 문서관리자 권한 설정
                            if (getInfo("AppInfo.usismanager") == "true" || getInfo("Request.usisdocmanager") == "true"){ // ||
																															// getInfo("dpisdocmanager")
																															// ==
																															// "false")
																															// { -
																															// dpisdocmanager
																															// 비사용
                                if (getInfo("SchemaContext.scRecBtn.isUse") == "Y") document.getElementById("btCharge").style.display = "";
                                document.getElementById("btLine").style.display = "none";
                                document.getElementById("btDeptLine").style.display = "";
                                if (getInfo("SchemaContext.scRCHBis.isUse") == "Y") { btModify.style.display = ""; } 
                            } else {
                                document.getElementById("btCharge").style.display = "none";
                                document.getElementById("btLine").style.display = "none";
                                document.getElementById("btDeptLine").style.display = "none";
                            }
                        } else {
                            displayBtn("none", "none", "none", "none", "none", "none", "none", "none", sdisplay, "none", "none", sAttDisplay, "none", "", "", "", "");
                        }
                    }
                    document.getElementById("btCommentView").style.display = "";
                    document.getElementById("btModify").style.display = (getInfo("SchemaContext.scRCHBis.isUse") == "Y") ? "" : "none";
                    if (getInfo("SchemaContext.scTransfer.isUse") == "Y" && getInfo("SchemaContext.pdefname.value").indexOf('Draft') == -1 && getInfo("Request.userCode") == getInfo("AppInfo.dpid")) document.getElementById("btForward").style.display = ""; // 전달버튼
																																																																// 활성화

                    // 회신옵션 수정
                    if (coviCmn.configMap.RETURN_FMPF != undefined && coviCmn.configMap.RETURN_FMPF.indexOf(getInfo("FormInfo.FormPrefix")) > -1) { // 협조전에만
																																					// 회신
																																					// 버튼
																																					// 나오게
																																					// 수정
                    	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                        var elmRoot = $(m_evalJSON).find("steps");
                        var elmRouCount = $(elmRoot).find("division[divisiontype='receive'] > step > ou[code='" + getInfo("AppInfo.dpid_apv") + "'] > taskinfo[status='pending']").length;
                        if (elmRouCount > 0) {
                            document.getElementById("btReplyHeoyJo").style.display = "";
                        }
                    }
                    break;
                case "SUBREDRAFT": // 합의재기안
                    document.getElementById("btCharge").style.display = ""; 
                    if (getInfo("SchemaContext.scTransfer.isUse") == "Y") document.getElementById("btForward").style.display = "";
                    displayBtn("none", "none", "none", "none", "none", "none", "none", "none", "", "none", "none", "none", "none", "none", "", "", "");
                    if (getInfo("AppInfo.usismanager") == "true" || getInfo("Request.usisdocmanager") == "true"){ // ||
																													// getInfo("dpisdocmanager")
																													// ==
																													// "false")
																													// { -
																													// dpisdocmanager
																													// 비사용
                        if (getInfo("SchemaContext.scTransfer.isUse") == "Y") document.getElementById("btForward").style.display = "";
                        if (getInfo("SchemaContext.scRecBtn.isUse") == "Y") document.getElementById("btCharge").style.display = "";
                        else document.getElementById("btCharge").style.display = "none";
                        document.getElementById("btLine").style.display = "none"; // "결재선관리"
                        if (getInfo("SchemaContext.scRecAssist.isUse") == "Y") {
                            sdisplay = "none";
                            sAttDisplay = "none";
                            if (getInfo("Request.userCode") == getInfo("ProcessInfo.UserCode")) {
                                document.getElementById("btRec").style.display = "";
                                document.getElementById("btReject").style.display = "";
                            } else {
                                document.getElementById("btRec").style.display = "none";
                            }
                        }
                        displayBtn("none", "none", "none", "none", "none", "none", "none", "none", "", "none", "none", "none", "none", "none", "", "", "");
                    } else if (getInfo("Request.subkind") == "T008") {
                        document.getElementById("btCharge").style.display = "";
                        document.getElementById("btLine").style.display = "none"; // "결재선관리"
                        displayBtn("none", "none", "none", "none", "none", "none", "none", "none", "", "none", "none", "none", "none", "none", "", "", "");
                    } else {
                        document.getElementById("btCharge").style.display = "none";
                        document.getElementById("btLine").style.display = "none";
                        document.getElementById("btDeptLine").style.display = "none";
                    }
                    break;
                /*
				 * 시행문변환 관련 비사용 case "TRANS": //변환 displayBtnTrans(); break;
				 */
            }

            if (getInfo("Request.templatemode") == "Write") {
                document.getElementById("btModify").style.display = "none";
            }

            // 확인결재추가
            if (getInfo("Request.subkind") == "T019") document.getElementById("btModify").style.display = "none";
            // 후결추가
            if (getInfo("Request.subkind") == "T005") {
                document.getElementById("btHold").style.display = "none"; document.getElementById("btRejectedto").style.display = "none"; document.getElementById("btForward").style.display = "none";
                document.getElementById("btModify").style.display = "none";
            }
            break;
    }
    if (getInfo("Request.loct") == "CCINFO") {
        document.getElementById("btPcSave").style.display = "";
    }
    if (getInfo("SchemaContext.scSecrecy.isUse") == "Y") { document.getElementById("secrecy").style.display = ""; }
       
    /*
	 * 예약발송, 예약배포(스키마) 비사용 //예약발송.배포 설정 if
	 * (getInfo("ProcessInfo.ProcessDescription.IsReserved") == "1") {
	 * document.getElementById("chk_reserved").checked = true;
	 * 
	 * var oSelect = document.getElementById("select_reserved"); var oOption =
	 * document.createElement("OPTION"); oSelect.add(oOption); if
	 * (getInfo("ProcessInfo.ProcessDescription.ReservedGubun") != undefined) {
	 * oOption.value = getInfo("ProcessInfo.ProcessDescription.ReservedGubun");
	 * document.getElementById("select_reserved").value = oOption.value; }
	 * 
	 * if (getInfo("ProcessInfo.ProcessDescription.ReservedTime") != undefined) {
	 * var tempTime, tempHourMin; tempTime =
	 * getInfo("ProcessInfo.ProcessDescription.ReservedTime"); tempTime =
	 * tempTime.split(" "); tempHourMin = tempTime[1].split(":");
	 * 
	 * document.getElementById("ReservedTime").value = tempTime[0];
	 * document.getElementById("selThisHour").value = tempHourMin[0];
	 * document.getElementById("selThisMin").value = tempHourMin[1]; } }
	 */

    // 수신 시에 담당자지정 버튼은 스키마에 담당자 또는 담당부서가 지정되어 있는 경우에 한함.
    // 다중 수신 시에 타부서 담당자로 담당자를 지정하는 경우에는 지정된 담당자가 자신이 처리해야할
    // 수신부서 정보를 찾아오지 못하기 때문(자신이 처리해야 할 수신부서 정보는 자신이 속한 결재조직의
    // 코드로 찾아옴).
    if (getInfo("Request.mode") == "REDRAFT" && (getInfo("SchemaContext.scChgr.isUse") == "Y" || getInfo("SchemaContext.scChgrOU.isUse") == "Y")) {
        // btCharge.style.display = "";
    }

    // 관리자
    if (admintype == "ADMIN") {
        switch (getInfo("Request.loct")) {
            case "PREAPPROVAL":
            case "APPROVAL":
            case "PROCESS":
                if (getInfo("Request.mode") == "PROCESS") {
                	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                    var elmRoot = $(m_evalJSON).find("steps");
                    var strDate;
                    // 합의부서 삭제 -
                    var elmAssist = $(elmRoot).find("division:has(taskinfo[status='pending']) > step:has(taskinfo[status='pending'])[routetype='assist'][unittype='ou'] > ou:has(taskinfo[status='pending'])");
                    if (getInfo("SchemaContext.scDCooRemove.isUse") == "Y" && elmAssist.length > 0) {
                        var bPendigOUs = false;
                        $(elmAssist).each(function (ia, elmaOU) {
                            var elmaPerson = $(elmaOU).find("person");
                            if (elmaPerson.length == 0) {
                                bPendigOUs = true; return false;
                            }
                        });
                    }
                } else {
                	// 결재선변경
                    if (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "RECAPPROVAL" || getInfo("Request.mode") == "SUBAPPROVAL") {
                        // if(getInfo("Request.userCode")==getInfo("ProcessInfo.UserCode"))
						// btForward.style.display = "";
                    }
                }
                /*
				 * 기안취소(관리자)버튼 비사용
				 * document.getElementById("btAdminAbort").style.display = "";
				 */// 관리자
																								// 강제
																								// 취소 -
																								// 진행 중
																								// 문서도
																								// 취소가
																								// 됨
                break;

        }
        document.getElementById("btModify").style.display = "";// 문서편집
        /*
		 * 문서삭제 버튼 비사용 document.getElementById("btDeleteDoc").style.display =
		 * "";
		 */// 문서삭제
        if (((getInfo("Request.loct") == "COMPLETE" && getInfo("Request.mode") == "COMPLETE")) || (getInfo("Request.loct") == "REDRAFT")) { if (getInfo("SchemaContext.scIPub.isUse") == "Y" || getInfo("SchemaContext.scOPub.isUse") == 'Y') { document.getElementById("btReceiptView").style.display = ""; /*
																																																																												 * document.getElementById("li_btReceiptView").style.display =
																																																																												 * "";
																																																																												 */ } }

        // hjw modi 관리자>사용자문서보기에서 버튼 숨기기
        document.getElementById("btPreList").style.display = "none";        // 이전
        document.getElementById("btNextList").style.display = "none";       // 다음
        document.getElementById("btModify").style.display = "none";         // 편집
        document.getElementById("btMailSend").style.display = "none";  // 메일보내기
        /* 추가의견 */
        document.getElementById("btComment").style.display = "none";  // 의견
        /* document.getElementById("li_btCirculate").style.display = "none"; */  // 회람
        document.getElementById("btMailSend").style.display = "none";  // 메일보내기
        document.getElementById("btReUse").style.display = "none";  // 재사용
        /*
		 * 문서삭제 버튼 비사용 document.getElementById("btDeleteDoc").style.display =
		 * "none";
		 */ // 재사용
        document.getElementById("btReplyHeoyJo").style.display = "none";  // 회신
    }

    if ((admintype == "ADMIN") && (getInfo("Request.loct") == "APPROVAL" || getInfo("Request.loct") == "REDRAFT") && (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "SUBREDRAFT" || getInfo("Request.mode") == "SUBAPPROVAL" || getInfo("Request.mode") == "RECAPPROVAL")) {
        document.getElementById("btForward").style.display = "";
    }

    if (openMode == "L" || openMode == "P" || CFN_GetQueryString("listpreview") == "Y") document.getElementById("btNewFormWindow").style.display = "";
    if (getInfo("Request.readtype") == "openwindow") // 새창보기
    {
        return;
    }
    
    // e-Accounting 증빙 미리보기(모아보기) 버튼 display
    if(getInfo("FormInfo.FormPrefix").indexOf("WF_FORM_EACCOUNT_LEGACY") > -1) {
    	document.getElementById("btEvidPreview").style.display = "";
    }

    try {
        if (openMode == "L") {
            if (openID != "") {// Layer popup 실행
                var openID = CFN_GetQueryString("openID");
                if ($("#" + openID + "_if", parent.document).length > 0) {
                    m_oInfoSrc = $("#" + openID + "_if", parent.document)[0].contentWindow;
                } else { // 바닥 popup
                    m_oInfoSrc = parent;
                }
            } else {
                m_oInfoSrc = top.opener;
            }

            if (m_oInfoSrc.location.href.toUpperCase().indexOf("/APPROVAL_APPROVALLIST.DO") > -1) {
                if (m_oInfoSrc.strPiid_List != "") {
                    document.getElementById("btPreList").style.display = "";
                    document.getElementById("btNextList").style.display = "";
                }
            }

        }
        else if (opener != null && admintype != "ADMIN") {   // hjw modi
																// 관리자>사용자문서보기에서
																// 버튼 숨기기
            if (opener.location.href.toUpperCase().indexOf("/APPROVAL_APPROVALLIST.DO") > -1) {
                if (opener.strPiid_List != "") {
                    document.getElementById("btPreList").style.display = "";
                    document.getElementById("btNextList").style.display = "";
                }
            }
            // 20210126 이관문서 일괄확인
            if (opener.location.href.toUpperCase().indexOf("/APPROVAL_STOREAPPROVALLIST.DO") > -1 || opener.location.href.toUpperCase().indexOf("/APPROVAL_STOREDEPTDRAFTCOMPLETELIST.DO") > -1) {
				if (opener.strPiid_List != "") {
					document.getElementById("btPreList").style.display = "";
					document.getElementById("btNextList").style.display = "";
				}
			}
        }
    } catch (e) { }
}
function displayBtn(sDraft, schangeSave, sDoc, sPost, sLine, sRecDept, sAction, sDeptDraft, sDeptLine, sSave, sMail, sAttach, sPreview, sCommand, sRec, sTempMemo, sInfo) {
    document.getElementById("btDraft").style.display = sDraft;// "기안하기"
    document.getElementById("btLine").style.display = "none";// "결재선관리"
    document.getElementById("btRecDept").style.display = sRecDept;// "수신처지정"
    document.getElementById("btDeptDraft").style.display = sDeptDraft; // "재기안"
    document.getElementById("btDeptLine").style.display = sDeptLine; // "내부결재선관리"
    if (getInfo("Request.isTempSaveBtn") != "N") {
        document.getElementById("btSave").style.display = sSave; // "임시저장"
    } else {
        document.getElementById("btSave").style.display = "none"; // "임시저장"
    }

    document.getElementById("btPreView").style.display = sPreview;// "미리보기"

    if (g_szEditable) document.getElementById("btPreView").style.display = "";

    // 기밀문서 권한 지정
    if (getInfo("ProcessInfo.ProcessDescription.IsSecureDoc") == "Y") {
        document.getElementById("chk_secrecy").checked = true;
    }

    // document.getElementById("urgent").style.display = "";//긴급결재 기안시 지정
    if (getInfo("ProcessInfo.ProcessDescription.Priority") == "5") document.getElementById("chk_urgent").checked = true;	// 긴급결재
																															// 기안시
																															// 지정

    if (sAction == "")
    {
        var bReviewr = fn_GetReview();
        if (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT") {
        	// if (getInfo("Request.subkind") == "T008" &&
			// getInfo("SchemaContext.scChrRedraft.isUse") == "Y") { //담당자
			// 재기안이고, 1인결재가 가능한 경우 결재버튼 활성화
        	if (getInfo("Request.subkind") == "T008" ) { // 담당자 재기안 경우 결재버튼
															// 활성화
                document.getElementById("btApproved").style.display = "";
                if (!bReviewr) document.getElementById("btReject").style.display = "";
            }
        } else {
            // 확인결재추가
            if (getInfo("Request.subkind") == "T019" || getInfo("Request.subkind") == "T005" || getInfo("Request.subkind") == "T020") {// 확인결재
            	document.getElementById("btApproved").value = coviDic.dicMap.lbl_apv_Confirm;
                document.getElementById("btApproved").style.display = "";
            } else {
                document.getElementById("btApproved").style.display = "";
                if (!fn_GetReview()) document.getElementById("btReject").style.display = "";
            }
        }
        switch (getInfo("Request.mode")) {
            case "AUDIT":
                if (coviCmn.configMap.useHold == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid")) { document.getElementById("btHold").style.display = ""; }
                if (getInfo("SchemaContext.scRJTO.isUse") == "Y" && fn_checkrejectedtoA()) { document.getElementById("btRejectedto").style.display = ""; }
                break;
            case "PCONSULT":
                if (getInfo("Request.subkind") == "T009") {
                	document.getElementById("btApproved").value = coviDic.dicMap.lbl_apv_agree;
                    document.getElementById("btReject").value = coviDic.dicMap.lbl_apv_disagree;
                }
                if (getInfo("SchemaContext.scRJTO.isUse") == "Y" && fn_checkrejectedtoA()) { document.getElementById("btRejectedto").style.display = ""; }

                if (coviCmn.configMap.useHold == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid") && getInfo("Request.subkind") != "T019") { document.getElementById("btHold").style.display = ""; }
                break;
            case "SUBAPPROVAL": // 합의부서내 결재
                if (getInfo("SchemaContext.scRJTO.isUse") == "Y" && fn_checkrejectedtoA()) { document.getElementById("btRejectedto").style.display = ""; }

                if (coviCmn.configMap.useHold == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid") && getInfo("Request.subkind") != "T019") { document.getElementById("btHold").style.display = ""; }
                if (getInfo("SchemaContext.scRJTODept.isUse") == "Y") { if (!bReviewr) document.getElementById("btRejectedtoDept").style.display = ""; } // 2013.12.18
																																							// 부서내반송
																																							// 버튼
																																							// display
                break;
            case "RECAPPROVAL": // 수신부서내 결재
                if (getInfo("SchemaContext.scRJTO.isUse") == "Y" && fn_checkrejectedtoA()) { if (!bReviewr) document.getElementById("btRejectedto").style.display = ""; }
                if (getInfo("SchemaContext.scRJTODept.isUse") == "Y") { if (!bReviewr) document.getElementById("btRejectedtoDept").style.display = ""; }

                if (coviCmn.configMap.useHold == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid") && getInfo("Request.subkind") != "T019") { if (!bReviewr) document.getElementById("btHold").style.display = ""; }
                break;
            case "APPROVAL":
                if (getInfo("SchemaContext.scRJTO.isUse") == "Y" && fn_checkrejectedtoA()) { if (!bReviewr) document.getElementById("btRejectedto").style.display = ""; }

                if (coviCmn.configMap.useHold == "Y" && getInfo("Request.userCode") == getInfo("AppInfo.usid") && getInfo("Request.subkind") != "T019") { if (!bReviewr) document.getElementById("btHold").style.display = ""; }
                break;
            case "CHARGE":
                break;
            case "REDRAFT":
                if (coviCmn.configMap.useHold == "Y" && getInfo("Request.subkind") == "T008" && getInfo("Request.loct") == "APPROVAL" && getInfo("Request.gloct") == "JOBFUNCTION") { document.getElementById("btHold").style.display = ""; }
                break;
        }
    }
    if (getInfo("Request.loct") == "REVIEW" && getInfo("Request.mode") == "APPROVAL") {
        /*
		 * 공람자 스키마 비사용 if (getInfo("scReviewV") == "1") {//공람결재
		 * $("#btApproved").css({ "display": "" });
		 * $("#spanbtApproved").html(gLabel_confirm); } else {//공람열람 var sItems = "<request>";
		 * sItems += "<item wiid=\"" + getInfo("Request.workitemID") + "\"
		 * ptid=\"" + getInfo("Request.userCode") + "\" pfid=\"" +
		 * getInfo("pfid") + "\" pfsk=\"" + getInfo("Request.subkind") + "\"
		 * usid=\"" + getInfo("Request.userCode") + "\" />"; sItems += "</request>";
		 * CFN_CallAjax("../InstMgr/switchWI2Complete.aspx", sItems, function
		 * (data) { receiveGeneralQuery(data); }, false, "xml"); }
		 */
    }
    // 사용자 문서 조회 및 수정
    if (admintype == "ADMIN") {
        if (getInfo("Request.loct") == "PREAPPROVAL" || getInfo("Request.loct") == "APPROVAL" || getInfo("Request.loct") == "PROCESS" || getInfo("Request.loct") == "COMPLETE" || getInfo("Request.loct") == "REJECT") {
            document.getElementById("btModify").style.display = "";	// 편집버튼 활성화

            switch (getInfo("Request.mode")) {
                case "PREAPPROVAL": // 예고함
                    break;
                case "PROCESS":			// 진행함
                    if (getInfo("Request.gloct") != "DEPART") {		// 부서진행함 -
																	// 조건 없이
																	// 실행하던걸
																	// if추가하여 안에
																	// 넣음
                        btWithdraw.style.display = "none";
                    }
                    break;
                case "COMPLETE":		// 완료함
                    break;
                case "REJECT":			// 부결함
                    break;
            }
        }
    }

    /*
	 * feedback 비사용 //feedback 사용 if (getInfo("feedback") == "1") {
	 * document.getElementById("chk_feedback").checked = true;
	 * document.getElementById("selfeedback").value = getInfo("selfeedback"); }
	 */
}

function getDisplayMode(sReadMode, sSchemaOption) {// 스키마 옵션에 따른 버튼 활성화
	if (getInfo("SchemaContext."+sSchemaOption+"isUse") == "Y") { return ""; } else { return "none"; }
}
function disableBtns(bDisable) {
    if (document.getElementById("btDraft") != null) {
        document.getElementById("btDraft").disabled = bDisable;
        document.getElementById("btPrint").disabled = bDisable;
    }
}
// 1인결재 및 담당자 추가 관련 수정
function evaluateForm() {
    var truthBeTold = false;
    var ck = 0;
    
    switch (getInfo("FormInfo.FormPrefix")) {
        case "DRAFT":
        case "OUTERPUBLISH":
            if ((getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "DRAFT") && document.getElementById("Subject").value == "") {
                Common.Warning(gMessage28); return false; // "제목을 입력하세요."
            }
            
        case "REQUEST":
        default:
            // 첨부파일 처리
        	if(getInfo("Request.editmode") == "Y" || getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "DRAFT")
        		setFormAttachFileInfo();

            if (m_sReqMode != "TEMPSAVE" && m_sReqMode != "APPROVE" && m_sReqMode != "DEPTDRAFT") {
            	/*
				 * 기록물철 비사용 if (getInfo("Request.mode") == "DRAFT" ||
				 * getInfo("Request.mode") == "TEMPSAVE") { //==== 기록물철관련 추가
				 * ======================= if
				 * (getInfo("SchemaContext.scRecDoc.isUse") == "Y" && gIsSAP !=
				 * "Y") { //기록물철 사용인 경우 if ($('#hidRecDocFolderID').val() == "") {
				 * Common.Warning(Common.getDic("msg_SelRecDocCate"), "",
				 * function () { //기록물철 분류를 선택하세요 OpenRecDocFolder(); }); return
				 * false; } }
				 * //============================================================== }
				 */
                
                m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                var elmRoot = $$(m_evalJSON).find("steps");
                var elmList;
                
                if (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE") {
                    elmList = $$(elmRoot).find("division").has("taskinfo[status='inactive']").find(">step[routetype='approve']>ou>person,>step[routetype='approve']>ou>role").has("taskinfo[kind!='charge']");
                } else if (getInfo("Request.mode") == "REDRAFT") {
                    if (m_sReqMode == "CHARGE") {
                        elmList = $$(elmRoot).find("division[divisiontype='receive']>step");
                    } else {
                        elmList = $$(elmRoot).find("division[divisiontype='receive']>step[routetype='approve']>ou>person,division[divisiontype='receive']>step[routetype='approve']>ou>role").has("taskinfo[kind!='charge']");
                    }
                } else if (getInfo("Request.mode") == "SUBREDRAFT") {
                	if (m_sReqMode == "CHARGE") {
                        elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step>ou").has("taskinfo[processID='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "'],[execid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']");
                    } else {
                        elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step>ou").has("taskinfo[processID='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "'],[execid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find(">person,>role").has("taskinfo[kind!='charge']");
                    }
                } else {
                    elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step[routetype='approve']>ou>person,>step[routetype='approve']>ou>role").has("taskinfo[kind!='charge']");
                }
                

                if (elmList.length == 0 && admintype != "ADMIN") {
                    // 임시저장시 1인결재일 가능
                    if (getInfo("SchemaContext.scChrDraft.isUse") == "Y" && (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE")) {
                        if (!confirm(coviDic.dicMap.msg_apv_198)) return false;
                    } else if (getInfo("SchemaContext.scChrRedraft.isUse") == "Y" && getInfo("Request.mode") == "REDRAFT") {
                        if (!confirm(coviDic.dicMap.msg_apv_198)) return false;
                    } else {
                        Common.Warning(coviDic.dicMap.msg_apv_029); // "결재선이
																	// 지정되지
																	// 않았습니다."
                        return false;
                    }
                }
                	
                var ck = 0;
                if(getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_OUTSOURCING" && getInfo("Request.mode") == "DRAFT" ){
               	 
                    $("input[name^='unitPrice']").each(function (){
                    	
	                   	 if($(this).hasClass("pattern-active") && (this.value =="" || this.value == null )){
	                   		 ck = 1;
	                   	 }
                    });
                 }
               
                 if(ck == "1"){
              	 	Common.Warning("단가를 입력하세요"); return false; 
                 }
                
                // 예약배포/예약기안시 validation 체크 (10분이후 시간부터만 가능하도록)
                /*
				 * 예약 비사용 if (getInfo("Request.mode") == "DRAFT" &&
				 * (getInfo("scReserved") || getInfo("scDistribute"))) { if
				 * ($("#chk_reserved").is(":checked")) {
				 * 
				 * if ($("#ReservedTime").val() == "") { alert("예약 날짜를
				 * 입력해주세요."); return false; }
				 * 
				 * var objToday, todayYear, todayMonth, todayDay, todayHour,
				 * todayMinute, tmpTodayStr, tmpReservedStr; objToday = new
				 * Date(Date.parse(new Date()) + 1000 * 60 * 10);
				 * 
				 * todayYear = objToday.getFullYear() + "";
				 * 
				 * todayMonth = objToday.getMonth() + 1; todayMonth =
				 * (todayMonth < 10) ? "0" + todayMonth : todayMonth + "";
				 * 
				 * todayDay = objToday.getDate(); todayDay = (todayDay < 10) ?
				 * "0" + todayDay : todayDay + "";
				 * 
				 * todayHour = objToday.getHours(); todayHour = (todayHour < 10) ?
				 * "0" + todayHour : todayHour + "";
				 * 
				 * todayMinute = objToday.getMinutes(); todayMinute =
				 * (todayMinute < 10) ? "0" + todayMinute : todayMinute + "";
				 * 
				 * tmpTodayStr = todayYear + todayMonth + todayDay + todayHour +
				 * todayMinute;
				 * 
				 * tmpReservedStr = $("#ReservedTime").val().replace(/-/g,
				 * "").replace(/\./g, "") + $("#selThisHour").val() +
				 * $("#selThisMin").val();
				 * 
				 * if (tmpReservedStr <= tmpTodayStr) { alert("현재 시간으로부터 10분 이후
				 * 시간에만 예약 가능 합니다."); return false; } }
				 *  }
				 */

                var elmRecList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step[routetype='approve']>ou>person,>step[routetype='approve']>ou>role").has("taskinfo[kind!='charge']");
                if (getInfo("SchemaContext.scDRec.isUse") == "Y" && (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "APPROVAL")) {
                    var elmOu = $$(elmRoot).find("division>step[routetype='receive']>ou");
                    if (elmOu.length == 0) {
                        if (confirm(coviDic.dicMap.msg_apv_199)) return checkForm((m_sReqMode == "TEMPSAVE" ? true : false)); // "경유부서
																																// 없이
																																// 진행하시겠습니까?"
                    } else {
                        //
                    }
                }

                if (getInfo("SchemaContext.scPRec.isUse") == "Y" && (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "APPROVAL")) {
                    var elmOu = $$(elmRoot).find("division>step[routetype='receive']>ou>person");

                    if (elmOu.length == 0) {
                        if (getInfo("SchemaContext.scPRec.value") == "select") {
                            if (!confirm(coviDic.dicMap.msg_apv_201)) return false; // "담당자
																					// 지정없이
																					// 진행하시겠습니까?"
                        } else {
                            if (getInfo("SchemaContext.scDRec.isUse") == "Y" && (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "APPROVAL")) {
                                elmOu = $$(elmRoot).find("division>step[routetype='receive']");
                                if (elmOu.length == 0) {
                                    alert(coviDic.dicMap.msg_apv_181); // "담당자를
																		// 지정하십시요"
                                    return false;
                                }
                            } else {
                                alert(coviDic.dicMap.msg_apv_181); // "담당자를
																	// 지정하십시요"
                                return false;
                            }
                        }
                    } else {
                        // 담당업무를 1개만 지정하도록 수정
                        var elmReceive = $$(elmRoot).find("division>step[unittype='person'][routetype='receive']");

                        // 한번에 두개 이상의 담당업무를 지정 할 경우 Check
                        if (elmReceive.length > 0) {
                            var ouReceive = $$(elmReceive).concat().eq(0).find("person");
                        }
                    }
                }
                // 문서이관 관련 check
                if (getInfo("SchemaContext.scEdmsLegacy.isUse") == "Y" && m_sReqMode == "DRAFT" && (document.getElementById("DocLevel").value == "" || document.getElementById("SaveTerm").value == "" || document.getElementById("DocClassName").value == "")) {
                    Common.Warning(coviDic.dicMap.msg_apv_202); // "문서관리시스템 이관을
																// 위한 문서정보를
																// 입력하십시오."
                    return false;
                }
                if((getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT") && getInfo("Request.editmode") != "Y")
                	return true;
                else
                	return checkForm((m_sReqMode == "TEMPSAVE" ? true : false));
                break;
            } else {
                // 수신부서 1인결재 확인
                if ((m_sReqMode == "APPROVE" || m_sReqMode == "DEPTDRAFT") && (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT")
                    && document.getElementById("ACTIONINDEX").value != "REJECT" && document.getElementById("ACTIONINDEX").value != "RESERVE" && document.getElementById("ACTIONINDEX").value != "REJECTTO") { // [2015-07-21
																																																				// han
																																																				// modi]
																																																				// 부서수신함/담당업무함
																																																				// 관련
																																																				// 조건추가
																																																				// (dobuttoncase
																																																				// 에서
																																																				// m_sReqMode=approve로
																																																				// 넘어와서)
                	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                    var elmRoot = $$(m_evalJSON).find("steps");
                    var elmList;

                    if (getInfo("Request.mode") == "REDRAFT") {
                        if (m_sReqMode == "CHARGE") {
                            elmList = $$(elmRoot).find("division[divisiontype='receive']>step");
                        } else {
                            elmList = $$(elmRoot).find("division[divisiontype='receive']>step[routetype='approve']>ou>person,division[divisiontype='receive']>step[routetype='approve']>ou>role").has("taskinfo[kind!='charge']");
                        }
                    } else if (getInfo("Request.mode") == "SUBREDRAFT") {
                        if (m_sReqMode == "CHARGE") {
                            elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step>ou").has("taskinfo[processID='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "'],[execid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']");
                        } else {
                            elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step>ou").has("taskinfo[processID='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "'],[execid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find(">person,>role").has("taskinfo[kind!='charge']");
                        }
                    } else {
                        elmList = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step[routetype='approve']>ou>person,>step[routetype='approve']>ou>role").has("taskinfo[kind!='charge']");
                    }

                    if (elmList.length == 0 && admintype != "ADMIN") {
                    	if (getInfo("Request.mode") == "REDRAFT" && (getInfo("SchemaContext.scChrRedraft.isUse") == "Y" || getInfo("Request.subkind") == "T008")) {
                            if (!confirm(coviDic.dicMap.msg_apv_198)) return false;
                        } else {
                            Common.Warning(coviDic.dicMap.msg_apv_029); // "결재선이
																		// 지정되지
																		// 않았습니다."
                            return false;
                        }
                    }
                }

                if (getInfo("Request.editmode") == "Y") {
                    return checkForm((m_sReqMode == "TEMPSAVE" ? true : false));
                } else {
                    if (getInfo("SchemaContext.scCheckApproval.isUse") == "Y") {
                        return checkForm((m_sReqMode == "TEMPSAVE" ? true : false));
                    }

                    return true;
                }
            }
    }
}

function getDefaultJSON(sReqMode) {
    var jsonObj = {};
    $.extend(jsonObj, makeNode("processID", (m_sReqMode == "TEMPSAVE" ||  m_sReqMode == "DRAFT" ? "" : getInfo("ProcessInfo.ProcessID"))));				// $.extend(jsonObj,
																																						// makeNode("processID",
																																						// (m_sReqMode
																																						// ==
																																						// "TEMPSAVE"
																																						// ? ""
																																						// :
																																						// null)));
    $.extend(jsonObj, makeNode("parentprocessID", (m_sReqMode == "TEMPSAVE" ||  m_sReqMode == "DRAFT" ? "" : getInfo("ProcessInfo.ParentProcessID"))));
    $.extend(jsonObj, makeNode("processName", (m_sReqMode == "TEMPSAVE" ||  m_sReqMode == "DRAFT" ? "" : getInfo("ProcessInfo.ProcessName"))));
    
    // 기안 취소 / 회수 일 경우 현재 pending 인 결재자의 taskid 넘기기
    if(sReqMode == "ABORT" || sReqMode == "WITHDRAW" || sReqMode == "APPROVECANCEL"){
    	var taskid = "";
    	var apvLineObj = $.parseJSON(getInfo("ApprovalLine"));
    	
    	var ou = $$(apvLineObj).find("division>step>ou").has("taskinfo[status='pending'],[status='reserved']").concat().eq(0);
    	var unittype = $$(ou).parent().attr("unittype");
    	
    	if(unittype == "ou" && $$(ou).find("person").has("taskinfo[status='pending'],[status='reserved']").concat().eq(0).length > 0)
    		taskid = $$(ou).find("person").has("taskinfo[status='pending'],[status='reserved']").concat().eq(0).attr("taskid");
    	else
    		taskid = $$(ou).attr("taskid");
    	
    	$.extend(jsonObj, makeNode("taskID", taskid));
    	
    }else{
    	$.extend(jsonObj, makeNode("taskID", getInfo("ProcessInfo.TaskID") == undefined ? "" : getInfo("ProcessInfo.TaskID")));
    }
	
    $.extend(jsonObj, makeNode("processDefinitionID", getInfo("SchemaContext.pdef.value")));
	$.extend(jsonObj, makeNode("subkind", getInfo("Request.subkind")));
	$.extend(jsonObj, makeNode("performerID"));
	$.extend(jsonObj, ((getInfo("Request.subkind") == "T008" && getInfo("Request.mode") != "DRAFT") ? makeNode("mode", "REDRAFT") : makeNode("mode", getInfo("Request.mode"))));
	$.extend(jsonObj, makeNode("gloct", getInfo("Request.gloct")));
	$.extend(jsonObj, makeNode("dpid", getInfo("AppInfo.dpid")));
	$.extend(jsonObj, makeNode("usid", getInfo("AppInfo.usid")));
	$.extend(jsonObj, makeNode("sabun"));
	$.extend(jsonObj, makeNode("dpid_apv", getInfo("AppInfo.dpid_apv")));
	$.extend(jsonObj, makeNode("dpdn_apv", (getInfo("AppInfo.dpdn_apv") == undefined ? "" : getInfo("AppInfo.dpdn_apv")).replace("&", "&amp;")));
	$.extend(jsonObj, makeNode("usdn", getInfo("AppInfo.usnm")));
	$.extend(jsonObj, makeNode("dpdsn")); 
	$.extend(jsonObj, makeNode("FormID", getInfo("FormInfo.FormID"))); 
	$.extend(jsonObj, makeNode("FormName", getInfo("FormInfo.FormName"))); 
	$.extend(jsonObj, makeNode("FormPrefix", getInfo("FormInfo.FormPrefix")));
	$.extend(jsonObj, makeNode("BodyType", getInfo("FormInfo.BodyType")));
	$.extend(jsonObj, makeNode("Revision", getInfo("FormInfo.Revision"))); 
	$.extend(jsonObj, makeNode("FormInstID", getInfo("FormInstanceInfo.FormInstID"))); 
	$.extend(jsonObj, makeNode("formtempID")); 
	$.extend(jsonObj, makeNode("UserCode"));
	$.extend(jsonObj, makeNode("SchemaID", getInfo("FormInfo.SchemaID")));
	$.extend(jsonObj, makeNode("FileName", getInfo("FormInfo.FileName"))); 
	$.extend(jsonObj, makeNode("FormTempInstBoxID", getInfo("Request.formtempID")));
	$.extend(jsonObj, makeNode("FormInstID_response"));
	$.extend(jsonObj, makeNode("FormInstID_spare"));
	$.extend(jsonObj, makeNode("editMode", getInfo("Request.editmode")));
		
	$.extend(jsonObj, {"ProcessDescription" : getFormInfosJSON()});
	$.extend(jsonObj, {"ApprovalLine" : getApvList()});
	
    if (getInfo("Request.subkind") == "T005" || getInfo("Request.subkind") == "T018") {
    } else {
    	$.extend(jsonObj, (m_bFrmExtDirty ? { "FormInfoExt" : getFormInfoExtJSON()} : { "FormInfoExt" : {}})); // T005
																												// 후결,
																												// T018
																												// 공람
    }
    
    $.extend(jsonObj, {"AttachFileSeq" : $("#hidFileSeq").val()});
	
    return jsonObj;
}

/** * xml -> json * */
function setForwardApvList(elmRoot) {// 전달일 경우 처리
    try {
        var jsonApv = $.parseJSON(getInfo("ApprovalLine"));
        if (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "RECAPPROVAL" || getInfo("Request.mode") == "SUBAPPROVAL") { // 기안부서결재선
																																														// 및
																																														// 수신부서
																																														// 결재선
            var oFirstNode;
            if (admintype == "ADMIN") {
                if (getInfo("Request.mode") == "APPROVAL") {
                    oFirstNode = $$(jsonApv).find("steps>division>step[routetype='approve']").find(">ou>person[code='" + getInfo("Request.userCode") + "']>taskinfo[status='pending'], >ou>role:has(person[code='" + getInfo("Request.userCode") + "'])>taskinfo[status='pending']");
                } else if (getInfo("Request.mode") == "PCONSULT") {
                    oFirstNode = $$(jsonApv).find("steps>division>step").has("taskinfo[status='pending']").find(">ou>person[code='" + getInfo("Request.userCode") + "']>taskinfo[status='pending'], >ou>role:has(person[code='" + getInfo("Request.userCode") + "'])>taskinfo[status='pending']");
                } else if (getInfo("Request.mode") == "SUBAPPROVAL") {
                    oFirstNode = $$(jsonApv).find("steps>division>step").has("taskinfo[status='pending']").find("ou").has("taskinfo[piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find(">person[code='" + getInfo("Request.userCode") + "']>taskinfo[status='pending'], >role:has(person[code='" + getInfo("Request.userCode") + "'])>taskinfo[status='pending']");
                } else {
                    oFirstNode = $$(jsonApv).find("steps>division>step[unittype='ou'][routetype='receive']>ou>person[code='" + getInfo("AppInfo.usid") + "']>taskinfo[kind!='charge'][status='pending']");
                }
            } else {
                if (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "RECAPPROVAL") {
                    oFirstNode = $$(jsonApv).find("steps>division>step[routetype='approve']>ou").find(">person[code='" + getInfo("Request.userCode") + "']>taskinfo[status='pending'], > role:has(person[code='" + getInfo("Request.userCode") + "'])>taskinfo[status='pending']");
                } else if (getInfo("Request.mode") == "PCONSULT") {
                    oFirstNode = $$(jsonApv).find("steps>division>step:has(taskinfo[status='pending'])>ou").find(">person[code='" + getInfo("Request.userCode") + "'][code='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'], >role:has(person[code='" + getInfo("Request.userCode") + "'][code='" + getInfo("AppInfo.usid") + "'])>taskinfo[status='pending']");
                } else if (getInfo("Request.mode") == "SUBAPPROVAL") {
                    oFirstNode = $$(jsonApv).find("steps>division>step:has(taskinfo[status='pending'])>ou").has("taskinfo[piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find(">person[code='" + getInfo("Request.userCode") + "'][code='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'], >role:has(person[code='" + getInfo("Request.userCode") + "'][code='" + getInfo("AppInfo.usid") + "'])>taskinfo[status='pending']");
                } else {
                    oFirstNode = $$(jsonApv).find("steps>division>step[unittype='ou'][routetype='receive']>ou>person[code='" + getInfo("AppInfo.usid") + "']>taskinfo[kind!='charge'][status='pending']");
                }
            }
            if (oFirstNode.length > 0) {
                m_bDeputy = true; 
                m_bApvDirty = true; 
                var elmOU; 
                var elmPerson; 
                var elmInactivePerson;
                
                switch (getInfo("Request.mode")) {
                    case "APPROVAL":
                    case "PCONSULT":
                        //
                        break;
                    case "SUBAPPROVAL":
                        elmInactivePerson = $$(elmOU).find("person").has("taskinfo[status='inactive']");
                        break;
                    case "RECAPPROVAL":
                        //
                        break;
                }
                elmOU = $$(oFirstNode).parent().parent();
                elmPerson = $$(oFirstNode);

                var elmTaskInfo = $$(elmPerson).find("taskinfo");
                var skind = $$(oFirstNode).attr("kind");
                // taskinfo kind 현재 결재자의 kind=conveyance, 다음 결재자는 원결재자의 kind를
				// 받는다.
                $$(oFirstNode).attr("status", "completed");
                $$(oFirstNode).attr("result", "completed");
                $$(oFirstNode).attr("kind", "conveyance");
                $$(oFirstNode).attr("datecompleted", getInfo("AppInfo.svdt"));
                if (admintype == "ADMIN") {
                    $$(oFirstNode).attr("visible", "n");
                }
                // 전달받은 사용자 결재선 생성
                var oStep = {};
                var oOU = {};
                var oPerson = {};
                var oTaskinfo = {};
                
                $$(oTaskinfo).attr("status", "pending");
                $$(oTaskinfo).attr("result", "pending");
                $$(oTaskinfo).attr("kind", skind);
                $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                
                $$(oPerson).attr("code", $$(elmRoot).find("item").concat().eq(0).attr("AN"));
                $$(oPerson).attr("name", $$(elmRoot).find("item").concat().eq(0).attr("DN"));
                $$(oPerson).attr("position", $$(elmRoot).find("item").concat().eq(0).attr("PO").replace("&", ";"));
                $$(oPerson).attr("title", $$(elmRoot).find("item").concat().eq(0).attr("TL").replace("&", ";"));
                $$(oPerson).attr("level", $$(elmRoot).find("item").concat().eq(0).attr("LV").replace("&", ";"));
                $$(oPerson).attr("oucode", $$(elmRoot).find("item").concat().eq(0).attr("RG"));
                $$(oPerson).attr("ouname", $$(elmRoot).find("item").concat().eq(0).attr("RGNM"));
                $$(oPerson).attr("sipaddress", $$(elmRoot).find("item").concat().eq(0).attr("SIP"));
                
                if (getInfo("Request.mode") == "RECAPPROVAL" || getInfo("Request.mode") == "SUBAPPROVAL") {
                    if (elmInactivePerson != null) {
                    	$$(elmOU).append("people", oPerson);
                        $$(elmOU).find("people").json().splice(0, 0, oPerson);
                        $$(elmOU).find("people").concat().eq($$(elmOU).find("people").concat().length-1).remove();
                        
                        // $$(elmOU).insertBefore(oPerson, elmInactivePerson);
                        $$(oPerson).append("taskinfo", oTaskinfo);
                    } else {
                        $$(elmOU).append("person", oPerson);
                        $$(oPerson).append("taskinfo", oTaskinfo);
                    }
                } else {
                    $$(elmOU).append("person", oPerson);
                    $$(oPerson).append("taskinfo", oTaskinfo);
                }
                
                var oResult = $$(jsonApv);

                document.getElementById("APVLIST").value = JSON.stringify(oResult.json());
                
            } else { document.getElementById("APVLIST").value = getInfo("ApprovalLine"); }
        } else if((getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT") && document.getElementById("ACTIONINDEX").value == "FORWARD"){		// 수신부서
																																										// 전달
        	var oFirstNode;
        	
        	if(getInfo("Request.mode") == "REDRAFT"){
        		oFirstNode = $$(jsonApv).find("steps>division>step").has("[routetype='receive'],[routetype='approve']").find("ou[code='" + getInfo("AppInfo.dpid") + "']").has("taskinfo[status='pending']");
        	}else if(getInfo("Request.mode") == "SUBREDRAFT"){
        		oFirstNode = $$(jsonApv).find("steps>division").find("step").has("[routetype='assist'],[routetype='consult']").find(">ou[code='" + getInfo("AppInfo.dpid") + "']").has(">taskinfo[status='pending']");
        	}
        	
        	$$(oFirstNode).attr("code", document.getElementById("CHARGEID").value);
        	$$(oFirstNode).attr("name", document.getElementById("CHARGENAME").value);
        	
        	document.getElementById("APVLIST").value = JSON.stringify($$(jsonApv).json());
        	
        } else if((getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT") && document.getElementById("ACTIONINDEX").value == "CHARGE"){		// 부서
																																										// 수신 시
																																										// 담당자
																																										// 설정
        	
        	var pendingOU;
        	
        	if(getInfo("Request.mode") == "REDRAFT"){
        		pendingOU = $$(jsonApv).find("steps>division>step").has("[routetype='receive'],[routetype='approve']").find("ou[code='" + getInfo("AppInfo.dpid") + "']").has("taskinfo[status='pending']");
        		
        		$$(pendingOU).remove("wiid");
        		$$(pendingOU).remove("widescid");
        		$$(pendingOU).remove("taskid");
        		$$(pendingOU).remove("pfid");
        		
        		$$(pendingOU).parent().attr("unittype", "person");
        		$$(pendingOU).parent().attr("routetype", "approve");
        	}else if(getInfo("Request.mode") == "SUBREDRAFT"){
        		pendingOU = $$(jsonApv).find("steps>division").find("step").has("[routetype='assist'],[routetype='consult']").find(">ou[code='" + getInfo("AppInfo.dpid") + "']").has(">taskinfo[status='pending']");
        	}
    		var chargePerson = {};
    		var chargeTaskinfo = {};
    		
    		$$(chargeTaskinfo).attr("status", "pending");
            $$(chargeTaskinfo).attr("result", "pending");
            $$(chargeTaskinfo).attr("kind", "charge");
            $$(chargeTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
            
            $$(chargePerson).attr("code", $$(elmRoot).find("item").concat().eq(0).attr("AN"));
            $$(chargePerson).attr("name", $$(elmRoot).find("item").concat().eq(0).attr("DN"));
            $$(chargePerson).attr("position", $$(elmRoot).find("item").concat().eq(0).attr("PO").replace("&", ";"));
            $$(chargePerson).attr("title", $$(elmRoot).find("item").concat().eq(0).attr("TL").replace("&", ";"));
            $$(chargePerson).attr("level", $$(elmRoot).find("item").concat().eq(0).attr("LV").replace("&", ";"));
            $$(chargePerson).attr("oucode", $$(elmRoot).find("item").concat().eq(0).attr("RG"));
            $$(chargePerson).attr("ouname", $$(elmRoot).find("item").concat().eq(0).attr("RGNM"));
            $$(chargePerson).attr("sipaddress", $$(elmRoot).find("item").concat().eq(0).attr("SIP"));
            
            $$(chargePerson).append("taskinfo", chargeTaskinfo);
            
            $$(pendingOU).append("person", chargePerson);
        	
        	document.getElementById("APVLIST").value = JSON.stringify($$(jsonApv).json());
        	
        }else { document.getElementById("APVLIST").value = getInfo("ApprovalLine"); }
    } catch (e) { alert(e.message); }
}


/**
 * xml -> json
 */
function setApvList() {// 대결일 경우 처리
    try {
        var jsonApv = $.parseJSON(getInfo("ApprovalLine"));

        if (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "RECAPPROVAL") { // 기안부서결재선
																																			// 및
																																			// 수신부서
																																			// 결재선
            var oFirstNode; // step에서 taskinfo select로 변경

            if (getInfo("Request.mode") == "APPROVAL") {
                oFirstNode = $$(jsonApv).find("steps>division>step[routetype='approve']>ou>person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'], steps>division>step[routetype='approve']>ou>role:has(person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "'])");
                if (oFirstNode.length == 0) { // 편집 후 결재 시 대결 오류로 인하여 소스 추가
                    oFirstNode = $$(jsonApv).find("steps>division>step[routetype='approve']>ou>person[code='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'][kind='substitute']");
                }
            }
            else if (getInfo("Request.mode") == "RECAPPROVAL") {
                oFirstNode = $$(jsonApv).find("steps>division[divisiontype='receive']>step[routetype='approve']>ou>person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'], steps>division[divisiontype='receive']>step[routetype='approve']>ou>role:has(person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "'])");
                if (oFirstNode.length == 0) { // 편집 후 결재 시 대결 오류로 인하여 소스 추가
                    oFirstNode = $$(jsonApv).find("steps>division[divisiontype='receive']>step[routetype='approve']>ou>person[code='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'][kind='substitute']");
                }
            }
            else if (getInfo("Request.mode") == "PCONSULT") {
                oFirstNode = $$(jsonApv).find("steps>division>step>ou>person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "']>taskinfo[status='pending'], steps>division>step>ou>role>taskinfo:has(person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "'])[status='pending']");
            } else if (getInfo("Request.mode") == "AUDIT") {
                oFirstNode = $$(jsonApv).find("steps>division>step[routetype='audit']>ou>person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "'] > taskinfo[status='pending'], steps>division>step[routetype='audit']>ou>role:has(person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "'])");
            } else {
                oFirstNode = $$(jsonApv).find("steps>division>step[unittype='ou'][routetype='receive']>ou>person[code!='" + getInfo("AppInfo.usid") + "']>taskinfo[kind!='charge'][status='pending']");
            }
            if (oFirstNode.length != 0) {
            	Common.Warning(coviDic.dicMap.msg_ApprovalDeputyWarning);
            	
                m_bDeputy = true; m_bApvDirty = true; var elmOU; var elmPerson;
                switch (getInfo("Request.mode")) {
                    case "APPROVAL":
                    case "PCONSULT":
                        elmOU = $$(oFirstNode).parent().parent();
                        elmPerson = $$(oFirstNode).parent();
                        break;
                    case "RECAPPROVAL":
                        elmOU = $$(oFirstNode).parent().parent();
                        elmPerson = $$(oFirstNode).parent();
                        break;
                }
                var elmTaskInfo = $$(elmPerson).find("taskinfo");
                var skind = $$(elmTaskInfo).attr("kind");
                var sallottype = "serial";
                var elmStep = $$(elmOU).parent();
                try { if ($$(elmStep).attr("allottype") != null) sallottype = $$(elmStep).attr("allottype"); } catch (e) { }
                // taskinfo kind에 따라 처리 일반결재 -> 대결, 대결->사용자만 변환, 전결->전결, 기존사용자는
				// 결재안함으로
                // [19-08-19] kimhs, 전결을 유지하는 경우 원결재자가 완료함에서 문서 열람 불가함. 대결로
				// 변경처리함.
                switch (skind) {
                    case "substitute": // 대결
                        if (getInfo("Request.mode") == "APPROVAL") {
                            $$(elmOU).attr("code", getInfo("AppInfo.dpid_apv"));
                            $$(elmOU).attr("name", getInfo("AppInfo.dpdn_apv"));
                        }
                        $$(elmPerson).attr("code", getInfo("AppInfo.usid"));
                        $$(elmPerson).attr("name", getInfo("AppInfo.usnm"));
                        $$(elmPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                        $$(elmPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                        $$(elmPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
                        $$(elmPerson).attr("oucode", getInfo("AppInfo.dpid"));
                        $$(elmPerson).attr("ouname", getInfo("AppInfo.dpnm"));
                        $$(elmPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
                        $$(elmTaskInfo).attr("datereceived", getInfo("AppInfo.svdt"));
                        break;
                    /*
					 * case "authorize"://전결 결재안함 $$(elmTaskInfo).attr("status",
					 * "completed"); $$(elmTaskInfo).attr("result", "skipped");
					 * $$(elmTaskInfo).attr("kind", "skip");
					 * $$(elmTaskInfo).remove("datereceived"); break;
					 */
                    case "consent": // 합의 -> 후열
                    case "charge":  // 담당 -> 후열
                    case "consult":
                    case "normal":  // 일반결재 -> 후열
                    case "authorize":// 전결 결재안함
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
                    // $$(oTaskinfo).attr("kind", (skind == "authorize") ? skind
					// : "substitute");
                    $$(oTaskinfo).attr("kind", "substitute"); // 대결로 처리되는 경우
																// 대결자 완료함에서 문서
																// 열람이 가능해야 함!
                    $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                    
                    $$(oPerson).attr("code", getInfo("AppInfo.usid"));
                    $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
                    $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                    $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                    $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
                    $$(oPerson).attr("oucode", getInfo("AppInfo.dpid"));
                    $$(oPerson).attr("ouname", getInfo("AppInfo.dpnm"));
                    $$(oPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
                    
                    $$(oPerson).append("taskinfo", oTaskinfo);
                    
                    $$(elmOU).append("person", oPerson);							// person이
																					// object일
																					// 경우를
																					// 위해서
																					// 추가하여
																					// 배열로
																					// 만듬
                    $$(elmOU).find("person").json().splice(0, 0, oPerson);			// 다시
																					// 앞에
																					// 추가
                    $$(elmOU).find("person").concat().eq($$(elmOU).find("person").concat().length-1).remove();			// 배열로
																														// 만들기
																														// 위해서
																														// 추가했던
																														// person을
																														// 지움
                    
                    if (skind == 'charge') {
                        oFirstNode = oStep;
                        
                        var oStep = {};
                        var oOU = {};
                        var oPerson = {};
                        var oTaskinfo = {};
                        
                        $$(oStep).attr("unittype", "person");
                        $$(oStep).attr("routetype", "approve");
                        $$(oStep).attr("name", coviDic.dicMap.lbl_apv_writer);		// gLabel__writer);
                        
                        $$(oOU).attr("code", getInfo("AppInfo.dpid_apv"));
                        $$(oOU).attr("name", getInfo("AppInfo.dpdn_apv"));
                        
                        $$(oPerson).attr("code", getInfo("AppInfo.usid"));
                        $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
                        $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                        $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                        $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
                        $$(oPerson).attr("oucode", getInfo("AppInfo.dpid"));
                        $$(oPerson).attr("ouname", getInfo("AppInfo.dpnm"));
                        $$(oPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
                        
                        $$(oTaskinfo).attr("status", "complete");
                        $$(oTaskinfo).attr("result", "complete");
                        $$(oTaskinfo).attr("kind", "charge");
                        $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                        $$(oTaskinfo).attr("datecompleted", getInfo("AppInfo.svdt"));
                        
                        $$(oPerson).append("taskinfo", oTaskinfo);
                        
                        $$(oOU).append("person", oPerson);
                        
                        $$(oStep).append("ou", oOU);
                        
                        $$(jsonApv).find("steps>division").append("step", oStep);
                        $$(jsonApv).find("steps>division>step").json().splice(0, 0, oStep);
                        $$(jsonApv).find("steps>division>step").concat().eq($$(jsonApv).find("steps>division>step").concat().length-1).remove();
                        
                        // $$(jsonApv).find("steps>division").insertBefore(oStep,
						// elmStep);
                    }
                }

                var oResult = $$(jsonApv).json();

                document.getElementById("APVLIST").value = JSON.stringify(oResult);
            }
            else {
                document.getElementById("APVLIST").value = getInfo("ApprovalLine");
            }
        }
        else {
            document.getElementById("APVLIST").value = getInfo("ApprovalLine");
        }
    }
    catch (e) {
        alert(e.message);
    }
}

// xml -> json
function getApvList() {
	var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
	
    if (m_sReqMode == "RECREATE" && getInfo("SchemaContext.scRec.isUse") == "Y") {
        var oFirstNode = $$(jsonApv).find("steps>division").has("taskinfo[status='pending']").has("[divisiontype='receive'][oucode='" + getInfo("AppInfo.dpid_apv") + "']");
        if (oFirstNode.length == 0) {
        	
        	var oDiv = {};
            var oStep = {};
            var oOU = {};
            var oTaskinfo = {};
            
            $$(oTaskinfo).attr("status", "pending");
            $$(oTaskinfo).attr("result", "pending");
            $$(oTaskinfo).attr("kind", "normal");
            $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
            
            $$(oOU).append("taskinfo", oTaskinfo);
            
            $$(oOU).attr("code", getInfo("AppInfo.dpid_apv"));
            $$(oOU).attr("name", getInfo("AppInfo.dpdn_apv"));
            
            $$(oStep).append("ou", oOU);
            
            $$(oStep).attr("unittype", "person");// ou
            $$(oStep).attr("routetype", "approve"); // receive
            $$(oStep).attr("name", coviDic.dicMap.lbl_apv_ChargeDept_Rec);		
            
            $$(oDiv).append("step", oStep);
            $$(jsonApv).find("steps").append("division", oDiv);
            
            oFirstNode = $$(jsonApv).find("steps>division").has("taskinfo[status='pending']").has("[divisiontype='receive'][oucode='" + getInfo("AppInfo.dpid_apv") + "']").find(">step>ou");
        }
        if ($$(oFirstNode).find("person[code='" + getInfo("AppInfo.usid") + "']>taskinfo[kind='charge']") == null) {
        	
        	var oPerson = {};
            var oTaskinfo = {};
            
            $$(oTaskinfo).attr("status", "pending");
            $$(oTaskinfo).attr("result", "pending");
            $$(oTaskinfo).attr("kind", "charge");
            $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
            
            $$(oPerson).append("taskinfo", oTaskinfo);
            
            $$(oPerson).attr("code", getInfo("AppInfo.usid"));
            $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
            $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
            $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
            $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
            $$(oPerson).attr("oucode", getInfo("AppInfo.dpid"));
            $$(oPerson).attr("ouname", getInfo("AppInfo.dpnm"));
            $$(oPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
            
            $$(jsonApv).find("steps>division").has("taskinfo[status='pending'][divisiontype='receive'][oucode='" + getInfo("AppInfo.dpid_apv") + "']").find(">step>ou)").append("person", oPerson);
            
        }

        /*
		 * 비사용 if (getInfo("Request.subkind") == "RE") {//공람으로 저장일 경우 다음 결재자 삭제
		 * var oApprovalNode =
		 * $$(jsonApv).find("steps>division").has("taskinfo[status='pending'])[divisiontype='receive'][oucode='" +
		 * getInfo("AppInfo.dpid_apv") +
		 * "']").find(">step").has(">ou>person>taskinfo[kind!='charge']"); if
		 * (oApprovalNode.length > 0) { oApprovalNode.each(function (i, elm) {
		 * $$(jsonApv).find("steps>division").has("taskinfo[status='pending']").has("[divisiontype='receive'][oucode='" +
		 * getInfo("AppInfo.dpid_apv") + "']").removeChild(elm); }); }
		 * $(jsonApv).find("apvlist > steps >
		 * division:has(taskinfo[status='pending'])[divisiontype='receive'][oucode='" +
		 * getInfo("AppInfo.dpid_apv") + "'] > step > ou > person[code='" +
		 * getInfo("AppInfo.usid") + "'] >
		 * taskinfo[kind='charge']").attr("visible", "n"); }
		 */
    }
    // 결재선 임시 저장 관련 수정 - 기안자만 있는 경우 넘기지 결재선을 넘기지 않는다.
    // 회수 및 기안취소 포함
    if (m_sReqMode == "TEMPSAVE" || m_sReqMode == "WITHDRAW" || m_sReqMode == "ABORT") {
        var oFirstNodeList = $$(jsonApv).find("steps>division>step>ou>person");
        // 기안자만 있는 경우 초기화 시키는데, 그럴경우 추가된 참조자도 사라짐.*/
        var oCurrentDivNode = $$(jsonApv).find("steps>division[divisiontype='send']");
        var oChargeNode = $$(oCurrentDivNode).find("step").has("ou>person>taskinfo[kind='charge']");
        
        if (oChargeNode.length != 0)
        	$$(oCurrentDivNode).find("step").has("ou>person>taskinfo[kind='charge']").concat().eq(0).remove();
        
        var oCurrentDivTaskinfo = $$(oCurrentDivNode).find("taskinfo");
        $$(oCurrentDivTaskinfo).attr("status", "inactive");
        $$(oCurrentDivTaskinfo).attr("result", "inactive");
        
        try { $$(oCurrentDivTaskinfo).remove("datereceived"); } catch (e) { }
        try { $$(oCurrentDivTaskinfo).remove("datecompleted"); } catch (e) { }
        try { $$(oCurrentDivTaskinfo).remove("customattribute1"); } catch (e) { }
        try { $$(oCurrentDivTaskinfo).remove("wiid"); } catch (e) { }
        try { $$(oCurrentDivTaskinfo).remove("mobileType"); } catch (e) { }
        try { $$(oCurrentDivNode).find("step").concat().find("person").concat().find("taskinfo>comment").remove(); } catch (e) { }
        
        // 그외 노드의 경우 status result datereceived
        /*
		 * var oTaskinfos = $$(oCurrentDivNode).find("step>ou>person>taskinfo");
		 * $$(oTaskinfos).each(function (i, elm) { $$(elm).attr("status",
		 * "inactive"); $$(elm).attr("result", "inactive");
		 * $$(elm).remove("datereceived"); $$(elm).remove("datecompleted");
		 * $$(elm).remove("mobilegubun"); }); oTaskinfos =
		 * $$(oCurrentDivNode).find("step>taskinfo");
		 * $$(oTaskinfos).each(function (i, elm) { $$(elm).attr("status",
		 * "inactive"); $$(elm).attr("result", "inactive");
		 * $$(elm).remove("datereceived"); $$(elm).remove("datecompleted"); });
		 * 
		 * $$(oCurrentDivNode).find("step>ou").concat().each(function(i, elm){
		 * $$(elm).remove("widescid"); $$(elm).remove("pfid");
		 * $$(elm).remove("taskid"); $$(elm).remove("wiid"); });
		 */
        
        $$(oCurrentDivNode).find("step").concat().each(function(i, elm){
        	if ($$(elm).attr("unittype") == "ou") {
                var oOU = $$(elm).find("ou");
                $$(oOU).concat().each(function (i, ouNode) {
                    $$(ouNode).children().remove();
                	
                    var newOuTaskinfo = {};
                    
                    if ($$(elm).attr("routetype") == "consult") { $$(newOuTaskinfo).attr("kind", "consult"); }
                    else if ($$(elm).attr("routetype") == "assist") { $$(newOuTaskinfo).attr("kind", "assist"); }
                    else { $$(newOuTaskinfo).attr("kind", "normal"); }

                    $$(ouNode).append("taskinfo", newOuTaskinfo);
                });
                $$(elm).find("taskinfo").remove("datereceived");
            }
        	
        	var oOU = $$(elm).find("ou").concat();
        	
        	$$(oOU).concat().each(function(i, ouObj){
	        	// 엔진에서 작성되는 값들 지우기
		        $$(ouObj).remove("pfid");
		        $$(ouObj).remove("taskid");
		        $$(ouObj).remove("widescid");
		        $$(ouObj).remove("wiid");
		
		        // division/step/ou/taskinfo
		        var oOUTaskinfo = $$(ouObj).find("taskinfo");
		        if ($$(oOUTaskinfo).length != 0) {
		            $$(oOUTaskinfo).attr("status", "inactive");
		            $$(oOUTaskinfo).attr("result", "inactive");
		            $(oOUTaskinfo).attr("datereceived", "");
		
		            if ($$(oOUTaskinfo).attr("datecompleted")) { $$(oOUTaskinfo).remove("datecompleted"); }
		            if ($$(oOUTaskinfo).attr("wiid")) { $$(oOUTaskinfo).remove("wiid"); }
		
		            if ($$(oOUTaskinfo).find("comment").concat().eq(0)) { $$(oOUTaskinfo).find("comment").remove(); }
		            if ($$(oOUTaskinfo).find("comment_fileinfo").concat().eq(0)) { $$(oOUTaskinfo).find("comment_fileinfo").remove(); }
		            
		            $$(oOUTaskinfo).remove("datereceived");
		        }
		        // division/step/person/taskinfo
		        var oPersonTaskinfo = $$(ouObj).find("person>taskinfo");
		        if ($$(oPersonTaskinfo).length != 0) {
		            $$(oPersonTaskinfo).attr("status", "inactive");
		            $$(oPersonTaskinfo).attr("result", "inactive");
		            if ($$(oPersonTaskinfo).attr("kind") == "charge") $$(oPersonTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
		            else $$(oPersonTaskinfo).attr("datereceived", "");
		            
		            if ($$(oPersonTaskinfo).attr("datecompleted")) { $$(oPersonTaskinfo).remove("datecompleted"); }
		            if ($$(oPersonTaskinfo).attr("wiid")) { $$(oPersonTaskinfo).remove("wiid"); }
		            if ($$(oPersonTaskinfo).attr("customattribute1")) { $$(oPersonTaskinfo).remove("customattribute1"); }
		            if ($$(oPersonTaskinfo).attr("mobileType")) { $$(oPersonTaskinfo).remove("mobileType"); }
		
		            if ($$(oPersonTaskinfo).find("comment").concat().eq(0).json()) { $$(oPersonTaskinfo).find("comment").remove(); }
		            if ($$(oPersonTaskinfo).find("comment_fileinfo").concat().eq(0).json()) { $$(oPersonTaskinfo).find("comment_fileinfo").remove(); }
		        }
        	});
        });
        
        // 참조 셋팅
        var oCcinfo = $$(jsonApv).find("steps>ccinfo");
        try {
        	if(oCcinfo.exist()){
	            $$(oCcinfo).concat().each(function (i, elm) {
	                $$(elm).attr("datereceived", "");
	            });
        	}
        } catch (e) { }
    }
    return jsonApv;
}

/**
 * xml -> json
 */
function getApvListReUse() {
    var jsonApv = $.parseJSON(getInfo("ApprovalLine"));
    var elmRoot = $$(jsonApv).find("steps");
    
    $$(elmRoot).attr("status", "inactive");

    if ($$(elmRoot).attr("datecreated")) { $$(elmRoot).remove("datecreated"); }
    if ($$(elmRoot).attr("datecompleted")) { $$(elmRoot).remove("datecompleted"); }
    if ($$(elmRoot).attr("result")) { $$(elmRoot).remove("result"); }

    var elmList = $$(elmRoot).find("division").concat().eq(0);  // 기안부서만(:first-child)
    var oCCinfo = $$(elmRoot).find("ccinfo").concat();   // 참조

    // 지정반려 시 필요없는 결재선 지우기
    $$(elmList).find("step").has("ou>person>taskinfo[rejectee='y'])").remove();
    
    // 엔진에서 작성되는 값들 지우기
    $$(elmList).remove("processDescID");
    $$(elmList).remove("processID");

    // division/taskinfo
    var oDivTaskinfo = $$(elmList).find("taskinfo");
    $$(oDivTaskinfo).attr("status", "inactive");
    $$(oDivTaskinfo).attr("result", "inactive");
    $$(oDivTaskinfo).attr("datereceived", "");
    if ($$(oDivTaskinfo).attr("datecompleted")) { $$(oDivTaskinfo).remove("datecompleted"); }

    $$(elmRoot).children().remove().append("division", $$(elmList).json()); // 모두
																			// 지우고
																			// 기안부서만
																			// 남김.

    // division/step
    var oDivStep = $$(elmRoot).find("division>step");
    $$(oDivStep).concat().each(function (j, elm2) {
        // 기안자가 겸직변경 했을 경우를 대비해 결재선 재정비
        // division/step/ou
        var oOU = $$(elm2).find("ou").concat();
        
        if ($$(oOU).length == 1 && j == 0 && $$(oOU).find("person>taskinfo").attr("kind") == "charge") {
            $$(oOU).attr("code", getInfo("AppInfo.dpid_apv"));    // 겸직처리를 위해
																	// 수정
            $$(oOU).attr("name", getInfo("AppInfo.dpdn_apv"));    // 겸직처리를 위해
																	// 수정

            // division
            $$(oOU).closest("division").attr("oucode", getInfo("AppInfo.dpid_apv"));
            $$(oOU).closest("division").attr("ouname", getInfo("AppInfo.dpdn_apv"));

            // steps
            $$(elmRoot).attr("initiatoroucode", getInfo("AppInfo.dpid_apv"));
            
            var oPerson = $$(oOU).find("person");
            $$(oPerson).attr("code", getInfo("AppInfo.usid"));
            $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
            $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
            $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
            $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
            $$(oPerson).attr("oucode", getInfo("AppInfo.dpid_apv"));  // 겸직처리를
																		// 위해 수정
            $$(oPerson).attr("ouname", getInfo("AppInfo.dpdn_apv"));  // 겸직처리를
																		// 위해 수정
        }
        
        // 부서협조/합의인 경우 ou 하위 결재선 삭제후 ou taskinfo 생성
        if ($$(elm2).attr("unittype") == "ou") {
            var oOU = $$(elm2).find("ou");
            $$(oOU).concat().each(function (i, ouNode) {
                $$(ouNode).children().remove();
            	
                var newOuTaskinfo = {};
                
                if ($$(elm2).attr("routetype") == "consult") { $$(newOuTaskinfo).attr("kind", "consult"); }
                else if ($$(elm2).attr("routetype") == "assist") { $$(newOuTaskinfo).attr("kind", "assist"); }
                else { $$(newOuTaskinfo).attr("kind", "normal"); }

                $$(ouNode).append("taskinfo", newOuTaskinfo);
            });
            $$(elm2).find("taskinfo").remove("datereceived");
        }
        
    	$$(oOU).concat().each(function(i, ouObj){
	        // 엔진에서 작성되는 값들 지우기
	        $$(ouObj).remove("pfid");
	        $$(ouObj).remove("taskid");
	        $$(ouObj).remove("widescid");
	        $$(ouObj).remove("wiid");
	
	        // division/step/ou/taskinfo
	        var oOUTaskinfo = $$(ouObj).find("taskinfo");
	        if ($$(oOUTaskinfo).length != 0) {
	            $$(oOUTaskinfo).attr("status", "inactive");
	            $$(oOUTaskinfo).attr("result", "inactive");
	            $(oOUTaskinfo).attr("datereceived", "");
	
	            if ($$(oOUTaskinfo).attr("datecompleted")) { $$(oOUTaskinfo).remove("datecompleted"); }
	            if ($$(oOUTaskinfo).attr("wiid")) { $$(oOUTaskinfo).remove("wiid"); }
	
	            if ($$(oOUTaskinfo).find("comment").concat().eq(0)) { $$(oOUTaskinfo).find("comment").remove(); }
	            if ($$(oOUTaskinfo).find("comment_fileinfo").concat().eq(0)) { $$(oOUTaskinfo).find("comment_fileinfo").remove(); }
	            
	            $$(oOUTaskinfo).remove("datereceived");
	        }
	        // division/step/person/taskinfo
	        var oPersonTaskinfo = $$(ouObj).find("person>taskinfo");
	        if ($$(oPersonTaskinfo).length != 0) {
	            $$(oPersonTaskinfo).attr("status", "inactive");
	            $$(oPersonTaskinfo).attr("result", "inactive");
	            if ($$(oPersonTaskinfo).attr("kind") == "charge") $$(oPersonTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
	            else $$(oPersonTaskinfo).attr("datereceived", "");
	            
	            if ($$(oPersonTaskinfo).attr("datecompleted")) { $$(oPersonTaskinfo).remove("datecompleted"); }
	            if ($$(oPersonTaskinfo).attr("wiid")) { $$(oPersonTaskinfo).remove("wiid"); }
	            if ($$(oPersonTaskinfo).attr("customattribute1")) { $$(oPersonTaskinfo).remove("customattribute1"); }
	            if ($$(oPersonTaskinfo).attr("mobileType")) { $$(oPersonTaskinfo).remove("mobileType"); }
	
	            if ($$(oPersonTaskinfo).find("comment").concat().eq(0).json()) { $$(oPersonTaskinfo).find("comment").remove(); }
	            if ($$(oPersonTaskinfo).find("comment_fileinfo").concat().eq(0).json()) { $$(oPersonTaskinfo).find("comment_fileinfo").remove(); }
	        }
        });
    });

    if(oCCinfo.exist()){
    	$$(oCCinfo).attr("datereceived", "");
        // 참조 부서 추가
        $$(elmRoot).append("ccinfo", oCCinfo.json());
    }

    // 대결자 결재로 인해 후열된 원결재자 결재선 복귀
    var bypassElmList = $$(elmRoot).find("division>step>ou>person>taskinfo[kind='bypass']"); // 후열
    $$(bypassElmList).attr("kind", "normal"); // kind bypass -> normal
    var duputyElmList = $$(elmRoot).find("division>step>ou>person>taskinfo[kind='substitute']"); // 대결자삭제
    duputyElmList.parent().remove();

    // 재사용결재선 퇴직자
    // 임의 주석
	if (chkAbsent(elmRoot) == false) {
        $$(elmRoot).find("division>step>ou>person>taskinfo[kind!='charge']").parent().remove();
    }
    var returnObj = {"steps" : elmRoot.json()};
    return returnObj;
}

function getFormInfosJSON() {
    var forminfos = getProcessDescription();
    return forminfos;
}

function getProcessDescription() {
    var m_oFormInfos = {
    		"FormInstID" : "",
    		"FormID" : getInfo("FormInfo.FormID"),
    		"FormName" : getInfo("FormInfo.FormName"), 
    		"FormSubject" :  ((document.getElementById("Subject") == undefined) ? getInfo("FormInstanceInfo.Subject") : document.getElementById("Subject").value),
    		"IsSecureDoc" : (document.getElementById("chk_secrecy").checked == true) ? "Y" : "N",
    		"IsFile" : "",
    		"FileExt" : "",
    		"IsComment" : "",					// 임의로 N
    		"ApproverCode" : "",
    		"ApproverName" : "",
    		"ApprovalStep" : "",
    		"ApproverSIPAddress" : "",
    		"IsReserved" : "N",
    		"ReservedGubun" : "",
    		"ReservedTime" : "",
    		"Priority" : (document.getElementById("chk_urgent").checked == true) ? "5" : "3",
    		"IsModify" : "N"
    	};
    
    // 첨부파일 유무 확인
    var sIsFile = "N";
    if (document.getElementById("AttachFileInfo").value != "") {
        var oIsFile = $.parseJSON(document.getElementById("AttachFileInfo").value);
        sIsFile = (oIsFile.FileInfos != undefined && oIsFile.FileInfos.length > 0) ? "Y" : "N";													// 첨부파일
																																				// JSON
																																				// 형태가
																																				// 변함됨에
																																				// 따라
																																				// 변경
    }
    m_oFormInfos.IsFile = sIsFile;
    
    // 첨부파일 확장자
    m_oFormInfos.FileExt = "";		/* XFN_GetFileExt() */					// 첨부파일(FormAttach.js)
																			// 소스
																			// 생성된
																			// 이후
																			// 수정

    // 의견갯수
    var iCommentCount = "N";
    if (document.getElementById("APVLIST").value != "") {
        iCommentCount = $$($.parseJSON(document.getElementById("APVLIST").value)).find("step").concat().find("comment").length > 0 ? "Y" : "N";
    }
    m_oFormInfos.IsComment = iCommentCount;
    
    return m_oFormInfos;
}

function getFormInfoExtJSON() {
    var forminfoext = {};
    
    /* 각 양식으로 내려보낼것 forminfoext = m_oFormEditor.getFormInfoExtXML(); */
       
    $.extend(forminfoext, makeNode("scOPub", (getInfo("SchemaContext.scOPub.isUse") == 'Y' ? "True" : "False")));	/* 대외공문 */
    $.extend(forminfoext, makeNode("scIPub", (getInfo("SchemaContext.scIPub.isUse") == "Y" ? "True" : "False")));
    
   /*
	 * 특정 양식값 비사용 + makeNode("innerpost", (getInfo("FormInfo.FormPrefix") ==
	 * 'WF_PUBLIC_BOARD' ? "True" : "False"));
	 */
    // 각 부서함들 저장여부 설정
    $.extend(forminfoext, makeNode("scABox", getInfo("SchemaContext.scABox.isUse")));
    $.extend(forminfoext, makeNode("scSBox", getInfo("SchemaContext.scSBox.isUse")));
    $.extend(forminfoext, makeNode("scRPBox", getInfo("SchemaContext.scRPBox.isUse")));
    $.extend(forminfoext, makeNode("scJFBox", getInfo("SchemaContext.scJFBox.isUse")));
    $.extend(forminfoext, makeNode("scJFBoxV", getInfo("SchemaContext.scJFBox.value")));
    $.extend(forminfoext, makeNode("scAutoReview", getInfo("SchemaContext.scAutoReview.isUse")));
    
    /* 합의함 저장(스키마) 비사용 + makeNode("scCBox", getInfo("scCBox")) */ /*
																 * 합의처리함 저장(스키마)
																 * 비사용+
																 * makeNode("scCPBox",
																 * getInfo("scCPBox"))
																 */ /*
																																 * 일상감사수신함
																																 * 저장(스키마)
																																 * 비사용 +
																																 * makeNode("scGARBox",
																																 * getInfo("scGARBox"))
																																 */
    /* 일상감사처리함 사용(스키마) 비사용 + makeNode("scGAPBox", getInfo("scGAPBox")) */ /*
																		 * 재경감사처리함
																		 * 저장(스키마)
																		 * 비사용 +
																		 * makeNode("scSAPBox",
																		 * getInfo("scSAPBox"))
																		 */ /*
																																			 * 특별감사수신함
																																			 * 저장(스키마)
																																			 * 비사용 +
																																			 * makeNode("scSARBox",
																																			 * getInfo("scSARBox"))
																																			 */ /*
																																																				 * 특별감사처리함
																																																				 * 저장(스키마)
																																																				 * 비사용 +
																																																				 * makeNode("scFAPBox",
																																																				 * getInfo("scFAPBox"))
																																																				 */
    
    if (getInfo("SchemaContext.scOPub.isUse") == 'Y' && getInfo("SchemaContext.scOPub.value") != "") {
    	$.extend(forminfoext, makeNode("outerpub_doctype", getInfo("SchemaContext.scOPub.value")));
    }

    if (getInfo("SchemaContext.scIPub.isUse") == "Y" || getInfo("SchemaContext.scOPub.isUse") == 'Y') {
    	$.extend(forminfoext, makeNode("scAutoReview", makeNode("ReceiptList", (getInfo("SchemaContext.scOPub.isUse") == '1' ? "" : document.getElementById("ReceiptList").value))));
    } else { 
    	$.extend(forminfoext, makeNode("ReceiptList", ""));
    }

    // (본사운영) 대외공문품의서 s
    if (getInfo("FormInfo.FormPrefix") == "WF_FORM_EXTERNAL") {
        var strRegistratorName = "";
        try {
            if (getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "DRAFT") {
                strRegistratorName = $("#NO").val();
            } else {
                strRegistratorName = $("#NO").html();
            }
            $.extend(forminfoext, makeNode("RegistratorName", ((strRegistratorName != "") ? strRegistratorName : '')));
        }
        catch (ex) { }
    }
    
    $.extend(forminfoext, makeNode("IsUseDocNo", getInfo("SchemaContext.scDNum.isUse") == "Y" ? "True" : "False"));
    
    // "수신공문품의서" 발신번호,발신처(기안자 입력) e
    /*
	 * 특정양식값 makeNode("sealauthority", m_sReqMode == "SIGN" ?
	 * (getInfo("AppInfo.dpid_apv") + ';' + getInfo("AppInfo.dpdsn")) : '')
	 */
    /*
	 * 문서이관> EDMS연동(스키마) 비사용 + makeNode("scEdms", getInfo("scEdms") == '1' ?
	 * "True" : "False")
	 */
    /*
	 * 문서이관> EDMS연동(스키마) 비사용 + makeNode("scEdmsLegacy", getInfo("scEdmsLegacy") ==
	 * '1' ? "True" : "False")
	 */ // 2006.08추가
																											// by
																											// sunny
    /* 문서종류 (스키마) 비사용 + makeNode("docclass", getInfo("scDocClassV")) */
   
    var sdocinfo = {}; /* makeNode("outerpubdocno", m_sOPubDocNO) */ // 외부공문번호
																	// 넣어줄것
    
    $.extend(sdocinfo, makeNode("DocNo", (document.getElementById("DocNo") == undefined) ? '' : document.getElementById("DocNo").value));
    $.extend(sdocinfo, makeNode("ReceiveNo", (document.getElementById("ReceiveNo") == undefined) ? '' : getReceiveNo())); 
    $.extend(sdocinfo, makeNode("dpdsn", getInfo("AppInfo.dpdsn"))); 
    $.extend(sdocinfo, makeNode("DocClassID", (document.getElementById("DocClassID") == undefined) ? '' : document.getElementById("DocClassID").value));
    $.extend(sdocinfo, makeNode("DocClassName", (document.getElementById("DocClassName") == undefined) ? '' : document.getElementById("DocClassName").value));
    $.extend(sdocinfo, makeNode("SaveTerm", (document.getElementById("SaveTerm") == undefined) ? '' : document.getElementById("SaveTerm").value));
    $.extend(sdocinfo, makeNode("AppliedYear", (document.getElementById("AppliedDate") == undefined) ? '' : getFiscalYear(document.getElementById("AppliedDate").value)));
    $.extend(sdocinfo, makeNode("AppliedDate", (document.getElementById("AppliedDate") == undefined) ? '' : document.getElementById("AppliedDate").value));
    $.extend(sdocinfo, makeNode("DocLevel", (document.getElementById("DocLevel") == undefined) ? '' : document.getElementById("DocLevel").value));
    $.extend(sdocinfo, makeNode("IsPublic", (document.getElementById("IsPublic") == undefined) ? '' : ((document.getElementById("IsPublic").value == coviDic.dicMap.lbl_apv_open) ? 'Y' : 'N')));
    $.extend(sdocinfo, makeNode("deptcode", getInfo("AppInfo.dpid")));
    $.extend(sdocinfo, makeNode("deptpath", getInfo("AppInfo.grfullname")));
    
    $.extend(sdocinfo, makeNode("AttachFile", ""));
    /*
	 * + "<attach>" + (m_sReqMode == "TEMPSAVE" ? "" :
	 * getFormInfoExtAttachXML()) + "</attach>"
	 */	// 첨부파일path.
																									// 첨부파일(FormAttach.js)
																									// 소스
																									// 생성된
																									// 이후
																									// 수정
    
    /*
	 * + makeNode("circulation", (getInfo("SchemaContext.scOPub.isUse") == '1' ?
	 * '1' : '1'))
	 */
    /*
	 * 필드가 없음 + makeNode("sentunitname",
	 * (document.getElementById("SENT_OU_NAME") == undefined) ? '' :
	 * document.getElementById("SENT_OU_NAME").value)
	 */
    /*
	 * 필드가 없음 + makeNode("regcomment",
	 * (document.getElementById("REGISTRATION_COMMENT") == undefined) ? '' :
	 * document.getElementById("REGISTRATION_COMMENT").value);
	 */
    /*
	 * 사업장 코드 비사용 +makeNode("sel_entpart",
	 * (document.getElementById("SEL_ENTPART") == undefined) ? '' :
	 * document.getElementById("SEL_ENTPART").value);
	 */
    
    $.extend(forminfoext, {"DocInfo" : sdocinfo});

    $.extend(forminfoext, makeNode("JFID", getJFID()));			// 담당자처리
    /*
	 * 비사용 (스키마 없음) + makeNode("IsChargeConfirm", (getInfo("scChgrConf") == '1' ?
	 * 'true' : 'false'))//담당자 확인
	 */
    $.extend(forminfoext, makeNode("ChargeOU", getChargeOU()));
    $.extend(forminfoext, makeNode("ChargePerson", getChargePerson()));
    $.extend(forminfoext, makeNode("rejectedto", (getInfo("SchemaContext.scRJTO.isUse") == "Y" ? 'true' : 'false')));
    
    /*
	 * 필드가 없음 $.extend(forminfoext, makeNode("WORKREQUEST_ID",
	 * (document.getElementById("WORKREQUEST_ID") == undefined) ? '' :
	 * document.getElementById("WORKREQUEST_ID").value));
	 */
    /*
	 * 레포트 생성(스키마) 비사용 + makeNode("MakeReport", (getInfo("scMRPT") == '1' ?
	 * getInfo("scMRPTV") : ''))
	 */
    /*
	 * 필드가 없음 + makeNode("parentfiid",
	 * (document.getElementById("REPLY_PARENT_FORM_INST_ID") == undefined) ? "" :
	 * document.getElementById("REPLY_PARENT_FORM_INST_ID").value)
	 */
    $.extend(forminfoext, makeNode("IsLegacy", (getInfo("SchemaContext.scLegacy.isUse") == "Y" ? getInfo("SchemaContext.scLegacy.value") : "")));
    
    $.extend(forminfoext, makeNode("entcode", (document.getElementById("EntCode") == undefined) ? getInfo("FormInstanceInfo.EntCode") : document.getElementById("EntCode").value));
    $.extend(forminfoext, makeNode("entname", (document.getElementById("EntName") == undefined) ? getInfo("FormInstanceInfo.EntName") : document.getElementById("EntName").value));
    $.extend(forminfoext, makeNode("docnotype", getInfo("SchemaContext.scDNum.value")));
    $.extend(forminfoext, makeNode("ConsultOK", (getInfo("SchemaContext.scConsultOK.isUse") == "Y" ? 'true' : 'false')));
    $.extend(forminfoext, makeNode("IsSubReturn", (getInfo("SchemaContext.scDCooReturn.isUse") == "Y" ? 'true' : 'false')));
    /*
	 * 모바일결재(스키마) 비사용+ makeNode("IsMobile", (getInfo("scMobile") == "1" ? 'true' :
	 * 'false'))
	 */
    $.extend(forminfoext, makeNode("IsDeputy", (gDeputyType == "T" ? 'true' : 'false')));
    /*
	 * 자동결재선 (스키마) 비사용 + makeNode("scAutoCmm", getInfo("scAutoCmm")) +
	 * makeNode("scAutoCmmV", getInfo("scAutoCmmV"))
	 */
    
    $.extend(forminfoext, makeNode("IsReUse", getInfo("Request.reuse")));
    $.extend(forminfoext, makeNode("scDocBoxRE", getInfo("SchemaContext.scDocBoxRE.isUse")));
    $.extend(forminfoext, makeNode("nCommitteeCount", "2"));
    
    /* 기록물철 비사용 + makeNode("RecDocFolderKind", $("#hidRecDocFolderKind").val()) */   // SAP양식여부(SAP양식:SAP
																					// ,
																					// 일반양식:GW)
    /* 기록물철 비사용 + makeNode("RecDocFolderID", $("#hidRecDocFolderID").val()) */   // 기록물철
																				// 분류폴더ID
    
    $.extend(forminfoext, makeNode("IsReserved", "False"));		/*
																 * 예약 비사용
																 * (document.getElementById("chk_reserved").checked ==
																 * true) ?
																 * "True" :
																 * "False"));
																 */		// 예약여부
    $.extend(forminfoext, makeNode("scASSBox", getInfo("SchemaContext.scASSBox.isUse")));			// 개인합의
																									// 부서함저장
    $.extend(forminfoext, makeNode("scPreDocNum", getInfo("SchemaContext.scPreDocNum.isUse")));			// 문서번호선발번
    
    /*
	 * 예약발송, 예약배포(스키마) 비사용 if (document.getElementById("chk_reserved").checked ==
	 * true) { forminfoext += makeNode("ReservedGubun",
	 * document.getElementById("select_reserved").value) //예약발송,배포 구분 +
	 * makeNode("ReservedTime", document.getElementById("ReservedTime").value + " " +
	 * document.getElementById("selThisHour").value + ":" +
	 * document.getElementById("selThisMin").value); //예약일자,시간 }
	 */
    // 문서번호발번정규식추가 2019.08.26
    $.extend(forminfoext, makeNode("scDNumExt", (getInfo("SchemaContext.scDNumExt.isUse")=="Y")?getInfo("SchemaContext.scDNumExt.value"):''));

    return forminfoext;
}

function getJFID() {
    var _return = "";
    if (getInfo("SchemaContext.scChgr.isUse") == "Y") {
        _return = getInfo("SchemaContext.scChgr.value");
    } else if (getInfo("SchemaContext.scChgrEnt.isUse") == "Y") {
        if (getInfo("SchemaContext.scChgrEnt.value") != "") {
            var sEtId = (document.getElementById("EntCode") == undefined) ? getInfo("FormInstanceInfo.EntCode") : document.getElementById("EntCode").value;
            var oChgrEntV = $.parseJSON(getInfo("SchemaContext.scChgrEnt.value"));
            if ($$(oChgrEntV).attr("ENT_" + sEtId) != undefined) {
                _return = $$(oChgrEntV).attr("ENT_" + sEtId);
            }
        }
    } else if (getInfo("SchemaContext.scChgrReg.isUse") == "Y") {
        if (getInfo("SchemaContext.scChgrReg.value") != "") {
        	var oChgrRegV = $.parseJSON(getInfo("SchemaContext.scChgrReg.value"));
            if ($$(oChgrRegV).attr("REG_" + getInfo("AppInfo.regionid")) != undefined) {
                _return = $$(oChgrRegV).attr("REG_" + getInfo("AppInfo.regionid"));
            }
        }
    }

    return _return;
}
function getChargeOU() {
    var _return = "";
    if (getInfo("SchemaContext.scChgrOU.isUse") == "Y") {
        _return = getInfo("SchemaContext.scChgrOU.value");
    } else if (getInfo("SchemaContext.scChgrOUEnt.isUse") == "Y") {
        if (getInfo("SchemaContext.scChgrOUEnt.value") != "") {
            var sEtId = (document.getElementById("EntCode") == undefined) ? getInfo("FormInstanceInfo.EntCode") : document.getElementById("EntCode").value;
            var oChgrOUEntV = $.parseJSON(getInfo("SchemaContext.scChgrOUEnt.value"));
            if ($$(oChgrOUEntV).find("ENT_" + sEtId + " > item").length > 0) {
            	$$(oChgrOUEntV).find("ENT_" + sEtId + ">item").concat().each(function (i, element) {
            		if (i > 0) _return += "^";
            		_return += $$(element).attr("AN") + "@" + $$(element).attr("DN");
            	});
            }
            
        }
    } else if (getInfo("SchemaContext.scChgrOUReg.isUse") == "Y") {
        if (getInfo("SchemaContext.scChgrOUReg.value") != "") {
        	var oChgrOURegV = $.parseJSON(getInfo("SchemaContext.scChgrOUReg.value"));
            if ($(oChgrOURegV).find("REG_" + getInfo("AppInfo.regionid") + " > items > item").length > 0) {
                $(oChgrOURegV).find("REG_" + getInfo("AppInfo.regionid") + " > items > item").each(function (i, element) {
                    if (i > 0) _return += "^";
                    _return += $(element).find("AN").text() + "@" + $(element).find("DN").text();
                });
            }
        }
    }
    return _return;
}
function getChargePerson() {
    var _return = "";
    if (getInfo("SchemaContext.scChgrPerson.isUse") == "Y") {
        var chargePersonValue = getInfo("SchemaContext.scChgrPerson.value");
        var retChgrPerson = '';
        
        if ('' != chargePersonValue) {
        	
        	var oChargePerson = $.parseJSON(chargePersonValue.split("@@")[2]);

            if ($$(oChargePerson).find('item').length > 0) {
                $$(oChargePerson).find('item').each(function (i, element) {
                    if (i > 0) {
                        retChgrPerson += "^";
                    }

                    retChgrPerson += $$(element).attr('AN')
                        + '@' + $$(element).attr('DN')
                        + '@' + $$(element).attr('GR_Code')
                    ;
                });
            }
        }

        _return = retChgrPerson;
    }
    return _return;
}
function getFiscalYear(sApplyDate) {
    var sFiscalYear = "";
    sFiscalYear = sApplyDate.substring(0, 4)
    return sFiscalYear;
}

// 엔진 호출 후 스크립트 처리 (구 receiveProcessHTTP, fnformmenuCallBack 함수 처리 등)
function callProcessEndScriptFunction(res, sReqMode) {
	// 오류 발생했을 경우에만 버튼 활성화되도록 위치 옮김
	// 의견 팝업이 2번 뜨는 현상 발생 방지
	// disableBtns(false);
	ToggleLoadingImage();
	if (res.status == "SUCCESS" || (res.status == "FAIL" && res.message.indexOf("NOTASK")>-1)) {
		if(res.status == "FAIL"){
			res.message = coviDic.dicMap.msg_apv_notask;
			disableBtns(false);
		}
		if (CFN_GetQueryString("isMobile") == "Y" || _mobile) {
			alert(res.message);
			window.location.href = "list.do?mode=Approval";			// 새로운 모바일
																	// URL
			// window.location.href =
			// "mobile/MobileApprovalList.do?mode=Approval";
		}else{
			Common.Inform(res.message, 'Information Dialog', function() { 
				// if (sReqMode != "DRAFT" && sReqMode != "TEMPSAVE") {
				if(getInfo("Request.mode") != "DRAFT"){
					if (CFN_GetQueryString("listpreview") == "Y") { // 결재함 새로고침
						var parentObj = parent.parent;
						parentObj.CoviMenu_GetContent(parentObj.location.href.replace(parentObj.location.origin, ""),false);
					} else if (CFN_GetQueryString("openMode") == "B") {
						opener.parent.parent.location.reload();
						Common.Close();
					} else if(opener != undefined && opener.setDocreadCount != undefined && opener.ListGrid != undefined && opener.location.href.toLowerCase().indexOf("home.do") == -1){
						var isEnd = false;
						if (opener.strPiid_List != '' && opener.strPiid_List != undefined) { // 일괄
																								// 확인
																								// 처리
							isEnd = true;
							if (!fnGoPreNextList('btNextList')) {
								isEnd = fnGoPreNextList('btPreList');
							}
							opener.strPiid_List = opener.strPiid_List.replace(getInfo("Request.processID") + ";", "");
							opener.strWiid_List = opener.strWiid_List.replace(getInfo("Request.workitemID") + ";", "");
							opener.strFiid_List = opener.strFiid_List.replace(getInfo("Request.forminstanceID") + ";", "");
							opener.strPtid_List = opener.strPtid_List.replace(getInfo("Request.userCode") + ";", "");
						} 
						
						// 함별 카운트가 실시간으로 변경되면 해당 switch문 제거
						/*
						 * switch (formJson.Request.gloct) { case "APPROVAL":
						 * case "PREAPPROVAL": case "PROCESS": case "COMPLETE":
						 * case "REJECT": case "TEMPSAVE": case "TCINFO": //
						 * 개인결재함 opener.setDocreadCount('USER');
						 * //opener.setSubMenu(); break; case "DEPART": // 부서함
						 * opener.setDocreadCount('DEPT');
						 * //opener.setSubMenu(); break; case "JOBFUNCTION": //
						 * 담당업무함 opener.setDocreadCount(); }
						 */
						
						opener.setDocreadCount();
						
						opener.ListGrid.reloadList(); // Grid만 reload되도록 변경
						
						if(opener.ListGrid.page.pageSize * (opener.ListGrid.page.pageNo-1) == (opener.ListGrid.page.listCount-1) ){
							opener.$("input[id=AXPaging][value="+(opener.ListGrid.page.pageNo-1)+"]").click();
						}
						
						if (!isEnd) {
							Common.Close();
						}
					}else{
						if(opener.setDocreadCount != undefined) {
							opener.setDocreadCount();
						}
						opener.CoviMenu_GetContent(opener.location.href.replace(opener.location.origin, ""),false);		// opener.location.reload();
						Common.Close();
					}
				}else{
					if(sReqMode == "DRAFT")
						opener.setDocreadCount('USER');
					
					if(CFN_GetQueryString("CFN_OpenWindowName") != "undefined")
						Common.Close();
					else
						window.close();
				}
			}); // 완료되었습니다.
		}
	}else {
		disableBtns(false);
		if (CFN_GetQueryString("isMobile") == "Y" || _mobile) {
			alert(coviDic.dicMap.msg_apv_030 + " : " + res.message);
		}else{
			Common.Error(coviDic.dicMap.msg_apv_030 + " : " + res.message); // 오류가
																			// 발생했습니다.
		}
	}
}


/*
 * event_noop() moved to form.refactor.deleted.js by KJW : 2014.04.22 : XFORM
 * PRJ.
 */

var _AutoCmm = false;
function requestProcess(sReqMode) {
    m_sReqMode = sReqMode;
    requestProcessDetail(sReqMode);
}
function requestProcessReserve(){
	var sAddage;
	
	$.extend(sAddage, makeNode("actionMode", document.getElementById("ACTIONINDEX").value));
    
	var defaultJSON;
    var sJsonData;
    
    defaultJSON = getDefaultJSON();
    
    // 보류 결재선 수정
    var apvListTemp = defaultJSON.ApprovalLine;
    
    $$(apvListTemp).find("step>ou").concat().find("taskinfo[result=pending]").concat().each(function(i, elm){
    	if(getInfo("Request.userCode") == $$(elm).parent().attr("code")){
    		$$(elm).attr("result", "reserved");
    		$$(elm).attr("status", "reserved");
    		
    		$$(elm).attr("comment", {"#text" : document.getElementById("ACTIONCOMMENT").value });
    		
    		$$(elm).find("comment").attr("relatedresult", "reserved");
    	}
    });
    
    defaultJSON.ApprovalLine = apvListTemp;
    
    sJsonData= $.extend(defaultJSON, sAddage);
    
    var formData = new FormData();
    // 양식 기안 및 승인 정보
    formData.append("formObj", JSON.stringify(sJsonData));
    
    try {
    	$.ajax({
    		url:"/approval/reserve.do",
    		data: formData,
    		type:"post",
    		dataType : 'json',
    		processData : false,
	        contentType : false,
    		success:function (res) {
    			// 성공했을 경우 보류 알림 발송
    			ToggleLoadingImage();
    			sendReservedMessage(res, apvListTemp);
    			callProcessEndScriptFunction(res);
    		},
    		error:function(response, status, error){
    			ToggleLoadingImage();
				CFN_ErrorAjax("reserve.do", response, status, error);
			}
    	});
    } catch (e) {
        Common.Error(e.message);
    }
}

// 보류 시 알림 발송 함수
function sendReservedMessage(res, apvList){
	if(res.status == "SUCCESS"){
		var MessageInfo = new Array();
		var ApproveCode = $$(apvList).find("step>ou").concat().has("taskinfo[result=reserved]").find("person").attr("code");
		
		$$(apvList).find("step>ou").concat().find("taskinfo[result=pending],[result=completed]").concat().each(function(i, elm){
			var messageInfoObj = {};
			
			$$(messageInfoObj).attr("UserId", $$(elm).parent().attr("code"));
			$$(messageInfoObj).attr("Subject", getInfo("FormInstanceInfo.Subject"));
			$$(messageInfoObj).attr("Initiator", getInfo("FormInstanceInfo.InitiatorID"));
			$$(messageInfoObj).attr("Status", "HOLD");
			$$(messageInfoObj).attr("ProcessId", $$(elm).parent().parent().parent().parent().attr("processID"));
			$$(messageInfoObj).attr("WorkitemId", $$(elm).parent().parent().attr("wiid"));
			$$(messageInfoObj).attr("FormInstId", getInfo("FormInstanceInfo.FormInstID"));
			$$(messageInfoObj).attr("FormName", getInfo("FormInfo.FormName")); 
			$$(messageInfoObj).attr("Type", "UR");
			
			$$(messageInfoObj).attr("ApproveCode", ApproveCode);
			
			MessageInfo.push(messageInfoObj);
		});
		
		$.ajax({
    		url:"legacy/setmessage.do",
    		data: {
    			"MessageInfo" : JSON.stringify(MessageInfo)
    		},
    		type:"post",
    		dataType : "json",
    		success:function (res) {
    		},
    		error:function(response, status, error){
				CFN_ErrorAjax("legacy/setmessage.do", response, status, error);
			}	
    	});
	}
}

function requestProcessDetail(sReqMode) {
    try {
        disableBtns(true);
        ToggleLoadingImage();
        /* var sTargetURL = "submitForm.aspx"; */
        var sTargetURL = "draft.do";
        var sMsgTitle;
        var sAddage = {};
        var aReqForm = getInfo("FormInfo.FormPrefix").split("_");
        m_bFileSave = true;
        

        // XForm 저장연동
        var writelink_count = 0;        // XForm 저장연동 여부
        var extdatatype = "";
        var boolerror = false;
                

        // 데이터베이스 연동
        $('*[ext-data-type1="writelink_d_text"]').each(function () {            
            writelink_count = writelink_count + 1;
            extdatatype = "writelink_d_text";
        });        
        if (writelink_count > 0) {
            boolerror = fn_writelink(extdatatype);
            // 에러발생 시 승인처리 안됨
            if (boolerror) {
                return;
            }
            writelink_count = 0;            
        }
        
        // 웹서비스 연동
        $('*[ext-data-type1="writelink_w_text"]').each(function () {            
            writelink_count = writelink_count + 1;
            extdatatype = "writelink_w_text";
        });
        if (writelink_count > 0) {
            boolerror = fn_writelink(extdatatype);
            // 에러발생 시 승인처리 안됨
            if (boolerror) {
                return;
            }
            writelink_count = 0;            
        }

        // SAP 연동
        $('*[ext-data-type1="writelink_s_text"]').each(function () {            
            writelink_count = writelink_count + 1;
            extdatatype = "writelink_s_text";
        });
        if (writelink_count > 0) {
            boolerror = fn_writelink(extdatatype);
            // 에러발생 시 승인처리 안됨
            if (boolerror) {
                return;
            }
            writelink_count = 0;
        }
        

        switch (sReqMode) {
            case "DRAFT": // "기안"
                sMsgTitle = coviDic.dicMap.lbl_apv_charge_apvline;

                // XFN_FileSave(); 첨부파일(FormAttach.js) 소스 생성된 이후 수정

                $.extend(sAddage, makeNode("Priority", (document.getElementById("chk_urgent").checked == true) ? "5" : "3"));
                $.extend(sAddage, makeNode("actionMode", document.getElementById("ACTIONINDEX").value));
                $.extend(sAddage, makeNode("actionComment", document.getElementById("ACTIONCOMMENT").value));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("signimagetype", document.getElementById("SIGNIMAGETYPE").value));
                
                $.extend(sAddage, getFormJSON());
                
                m_bFrmExtDirty = true;

                break;
            case "CHANGEAPV": // "결재선변경"
                sMsgTitle = gLabel__changeapprover;

                m_bFileSave = true;
                sTargetURL = "ReassignApvList.aspx";
                sAddage = getChangeFormXML() + makeNode("PIID", getInfo("ProcessInfo.ProcessID")) + makeNode("admintype", admintype);

                m_bFrmExtDirty = true;
                break;
            case "BYPASS": // "결재선변경"
                sMsgTitle = gLabel__changeapprover;

                m_bFileSave = true;
                sTargetURL = "ReassignApvList.aspx";
                sAddage = makeNode("PIID", getInfo("ProcessInfo.ProcessID")) + makeNode("wfid", m_wfid) + makeNode("name", "", null, true);

                m_bFrmExtDirty = true;
                break;
            case "FORWARD":		// 전달
            case "CHARGE": // "담당자 지정"
                sMsgTitle = coviDic.dicMap.lbl_apv_Charger;	
                var szdoclisttype = "2";
                if (getInfo("SchemaContext.scChgr.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrEnt.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrReg.isUse") == "Y"
                    || getInfo("SchemaContext.scDRec.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrOU.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrOUEnt.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrOUReg.isUse") == "Y") {
                	szdoclisttype = "6";
                }
                
                $.extend(sAddage, makeNode("actionMode", document.getElementById("ACTIONINDEX").value));
                $.extend(sAddage, makeNode("actionComment", ""));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("CHARGEID", document.getElementById("CHARGEID").value));
                $.extend(sAddage, makeNode("CHARGENAME", document.getElementById("CHARGENAME").value));
                $.extend(sAddage, makeNode("CHARGEOUID", document.getElementById("CHARGEOUID").value));
                
                if((getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT") && document.getElementById("ACTIONINDEX").value == "CHARGE"){
                	$.extend(sAddage, getChangeFormJSON());
                }
                
                // 전달의 경우 performer 및 결재선 정보를 update하며, 이력은 결재선을 통해 확인할 수 있음.
                if(document.getElementById("ACTIONINDEX").value == "FORWARD"){
                	$.extend(sAddage, makeNode("WorkitemID", getInfo('Request.workitemID')));

                	sTargetURL = "forward.do";
                }
                
                m_bFrmExtDirty = true;
                break;
            case "RECREATE": // "재기안"
                sMsgTitle = coviDic.dicMap.lbl_apv_redraft;	
                var szdoclisttype = "2";
                if (getInfo("SchemaContext.scChgr.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrEnt.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrReg.isUse") == "Y"
                    || getInfo("SchemaContext.scDRec.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrOU.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrOUEnt.isUse") == "Y"
                    || getInfo("SchemaContext.scChgrOUReg.isUse") == "Y"
                    || getInfo("SchemaContext.scPRec.isUse") == "Y") {
                    szdoclisttype = "6";
                }

                // XFN_FileSave();

                if (document.getElementById("SIGNIMAGETYPE").value == "") {
                    document.getElementById("SIGNIMAGETYPE").value = getInfo("AppInfo.usit");
                }

                $.extend(sAddage, makeNode("Priority", (document.getElementById("chk_urgent").checked == true) ? "5" : "3"));
                $.extend(sAddage, makeNode("dpid", getInfo("AppInfo.dpid")));
                $.extend(sAddage, makeNode("dpid_apv", getInfo("AppInfo.dpid")));
                $.extend(sAddage, makeNode("dpdsn", getInfo("AppInfo.dpdsn")));
                $.extend(sAddage, makeNode("actionMode", document.getElementById("ACTIONINDEX").value));
                $.extend(sAddage, makeNode("actionComment", document.getElementById("ACTIONCOMMENT").value));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("signimagetype", document.getElementById("SIGNIMAGETYPE").value));
                /*
				 * 비사용 $.extend(sAddage, makeNode("isissuedocno",
				 * getIsIssueDocNo()));
				 */
                $.extend(sAddage, makeNode("doclisttype", szdoclisttype));
                $.extend(sAddage, /*
									 * ((getInfo("REQ_RESPONSE") == "Y") ?
									 * getFormJSON() :
									 */ getChangeFormJSON()/* ) */);
                $.extend(sAddage, makeNode("islast", getIsLast())); 

                m_bFrmExtDirty = true;
                if (getInfo("REQ_RESPONSE") == "Y") m_bFrmInfoDirty = true;
                break;
            case "APPROVE": // "결재"
                sMsgTitle = coviDic.dicMap.btn_apv_approval2;

                // XFN_FileSave(); 첨부파일(FormAttach.js) 소스 생성된 이후 수정
                
                // $.extend(sAddage, makeNode("Priority",
				// (document.getElementById("chk_urgent").checked == true) ? "5"
				// : "3"));
                $.extend(sAddage, makeNode("usem", getInfo("AppInfo.usem")));				// 이메일
                $.extend(sAddage, makeNode("dpid", getInfo("AppInfo.dpid")));
                $.extend(sAddage, makeNode("dpid_apv", getInfo("AppInfo.dpid_apv")));
                $.extend(sAddage, makeNode("dpdsn",  getInfo("AppInfo.dpdsn")));
                $.extend(sAddage, makeNode("usid", getInfo("AppInfo.usid")));
                $.extend(sAddage, makeNode("usdn", getInfo("AppInfo.usnm")));
                $.extend(sAddage, makeNode("deputy", (m_bDeputy) ? "true" : "false"));
                $.extend(sAddage, makeNode("actionMode", document.getElementById("ACTIONINDEX").value));
                $.extend(sAddage, makeNode("actionComment", document.getElementById("ACTIONCOMMENT").value));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("signimagetype", document.getElementById("SIGNIMAGETYPE").value));
                /*
				 * 비사용 $.extend(sAddage, makeNode("isissuedocno",
				 * getIsIssueDocNo()));
				 */
                $.extend(sAddage, makeNode("doclisttype", "1"));
                // if(CFN_GetQueryString("isMobile") != "Y"){
                	$.extend(sAddage, getChangeFormJSON());
                	$.extend(sAddage, makeNode("islast", getIsLast()));
                // }
                
                if (getInfo("Request.mode") == 'APPROVAL' || getInfo("Request.mode") == 'RECAPPROVAL' /*
																										 * 비사용 ||
																										 * getIsIssueDocNo() ==
																										 * "true"
																										 */) m_bFrmExtDirty = true; // 결재,수신결재일경우만넘김

                m_bFrmExtDirty = true;
                m_bFrmInfoDirty = true;
                //
                
                /*
				 * 자동결재(스키마) 비사용 m_evalJSON =
				 * $.parseJSON(document.getElementById("APVLIST").value); var
				 * elmRoot = $$(m_evalJSON).find("steps"); var oRecSteps =
				 * $$(elmRoot).find("division:has(taskinfo[status='pending'])[divisiontype='receive'] >
				 * step > ou > person >
				 * taskinfo[kind!='review'][kind!='bypass'][kind!='skip' ]"); // )
				 * or (@routetype!='review' and @unittype='ou' and
				 * taskinfo/@status='inactive')) or @status='inactive' ] var
				 * oinaciveRecSteps =
				 * $$(elmRoot).find("division:has(taskinfo[status='pending'])[divisiontype='receive'] >
				 * step[routetype!='review'][unittype='person'] > ou > person >
				 * taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='inactive'],
				 * division:has(taskinfo[status='pending'])[divisiontype='receive'] >
				 * step[routetype!='review'][unittype='ou'] >
				 * ou:has(taskinfo[status='inactive']) > person >
				 * taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='inactive']");
				 * 
				 * if (getInfo("scAutoCmm") == "1" && oRecSteps.length ==
				 * getInfo("scAutoCmmV") && oinaciveRecSteps.length == 1) {
				 * Common.Confirm(gMessage324, "Confirmation Dialog", function
				 * (result) { if (result) { } else { _AutoCmm = true; } }); }
				 */

                /*
				 * 임의 주석 if (sLastComment != "") { var eml =
				 * $(m_evalJSON).find("steps >
				 * division:has(taskinfo[status='pending']) >
				 * step[routetype='approve'] > ou > person[code='" +
				 * getInfo("AppInfo.usid") + "'] > taskinfo[status='pending']");
				 * //결재선에 <comment> 추가 후 의견 저장 var oComment = $.parseXML("<root><commentLast><![CDATA[" +
				 * sLastComment + "]]></commentLast></root>"); var
				 * oCommentNode = $(oComment).find("root > commentLast"); if
				 * (eml.length > 0) { var emlComment =
				 * $(eml).find("commentLast"); if ($(emlComment).length > 0) {
				 * var delemlComment = eml[0].removeChild(emlComment[0]); }
				 * $(eml).append($(oCommentNode)); }
				 * document.getElementById("APVLIST").value =
				 * JSON.stringify($(m_evalJSON)[0]); }
				 */
                break;
            case "TEMPSAVE": // "임시함"
            	
            	// XFN_FileSave();

                sMsgTitle = coviDic.dicMap.lbl_apv_composing;
                sTargetURL = "tempSave.do";
                
                $.extend(sAddage, makeNode("FileName", getInfo("FormInfo.FileName")));
                $.extend(sAddage, getFormJSON());
                
                if (m_TempSaveInfo == true) {
                    document.getElementById("Subject").value = "";
                }
                
                m_TempSaveInfo = false;
                m_TempSave = true;
                m_bFrmExtDirty = true;
                break;
            case "WITHDRAW": // "결재문서 회수"
                sMsgTitle = coviDic.dicMap.lbl_apv_Doc_back;
                
                $.extend(sAddage, makeNode("usid", getInfo("AppInfo.usid")));
                $.extend(sAddage, makeNode("actionComment", document.getElementById("ACTIONCOMMENT").value));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("actionMode", "WITHDRAW"));
                $.extend(sAddage, getInfoBodyContext());
                break;
            case "ABORT": // "결재문서 취소"
                sMsgTitle = coviDic.dicMap.lbl_apv_Doc_cancel;
                
                $.extend(sAddage, makeNode("usid", getInfo("AppInfo.usid")));
                $.extend(sAddage, makeNode("actionComment", document.getElementById("ACTIONCOMMENT").value));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("actionMode", "ABORT"));
                $.extend(sAddage, getInfoBodyContext());
                break;
            case "APPROVECANCEL": // "승인 취소"
                sMsgTitle = coviDic.dicMap.lbl_apv_Approve_cancel;
                
                $.extend(sAddage, makeNode("usid", getInfo("AppInfo.usid")));
                $.extend(sAddage, makeNode("actionComment", document.getElementById("ACTIONCOMMENT").value));
                $.extend(sAddage, makeNode("actionComment_Attach", document.getElementById("ACTIONCOMMENT_ATTACH").value));
                $.extend(sAddage, makeNode("actionMode", "APPROVECANCEL"));
                // $.extend(sAddage, getInfoBodyContext());
                break;
            case "MONITOR": // "결재문서 확인"
                sMsgTitle = gLabel__Doc_OK;
                sTargetURL = "../InstMgr/switchMonitorOK.aspx";
                break;
            case "DELETEDOC":   // 결재문서삭제
                sMsgTitle = "결재문서 삭제";
                m_bFileSave = true; sTargetURL = "../InstMgr/switchFT2Del.aspx";
                if (getInfo("Request.mode") == "TEMPSAVE") {// 회수문서 삭제
                    sAddage = makeNode("item", getInfo("Request.formtempID"))
                    + makeNode("fitn", getInfo("Request.forminstancetablename"))
                    /*
					 * 기간연동(스키마) 비사용 + makeNode("IsLegacy", (getInfo("scLegacy") ==
					 * "1" ? getInfo("scLegacyV") : 'false'))
					 */
                    + makeNode("deltype", "WITHDRAW")
                    + getInfoBodyContext();
                } else if (getInfo("Request.mode") == "COMPLETE" && getInfo("Request.loct") == "REJECT") {
                    sAddage = makeNode("item", getInfo("ProcessInfo.ProcessID"))
                    /*
					 * 기간연동(스키마) 비사용 + makeNode("IsLegacy", (getInfo("scLegacy") ==
					 * "1" ? getInfo("scLegacyV") : 'false'))
					 */
                    + makeNode("deltype", "REJECT")
                    + getInfoBodyContext();
                }
                else {
                    sAddage = makeNode("usid")
                    + makeNode("DOC_NO", (document.getElementById("DOC_NO") == undefined) ? "" : document.getElementById("DOC_NO").value)
                    /*
					 * 비사용 (스키마 없음) + makeNode("OfficialDocNo",
					 * getInfo("scOfficialDocNo"))
					 */;
                }
                break;
            case "FORCEDCONSENT": // 강제합의-미구현
                sMsgTitle = "결재문서 삭제";
                m_bFileSave = true; sTargetURL = "../InstMgr/ForcedConsent.aspx";
                sAddage = makeNode("usid");
                 sAddage = makeNode("PARENT_PROCESS_ID", getInfo("ProcessInfo.ParentProcessID"));
                break;
            case "CHANGEREVIEW": // 현결재자 변경 후 후결 셋팅 -미구현
                m_sReqMode = "CHANGEREVIEW"
                sMsgTitle = "";
                sAddage = makeNode("ChangeReviewXml", document.getElementById("CHANGEREVIEWXML").value, null, false);
                sAddage += makeNode("ChangeReview", m_bTempFlag, null, false);
                sTargetURL = "../InstMgr/switchWI2ReassignNReview.aspx";
                break;
            case "DOCLISTSAVE": // 문서대장 등록-미구현
                XFN_FileSave();
                sAddage = getFormJSON() + getDocListXml();
                m_sReqMode = "DOCLISTSAVE"
                sTargetURL = "RegisterDocumentList.aspx";
                break;
            default:
                alert("[" + sReqMode + "]" + coviDic.dicMap.msg_apv_072); // 는
																			// 지정되지
																			// 않은
																			// 모드입니다.
                return;
        }
        try {
            if (m_bFileSave == true) {
                if (getInfo("Request.mode") == "PREDRAFT") { setInfo("Request.mode", "DRAFT"); }

                var defaultJSON;
                var sJsonData;
                /*
				 * 비사용 if (_AutoCmm) { defaultJSON = defaultJSON.replace("<scAutoCmm>1", "<scAutoCmm>0"); }
				 */
                
                defaultJSON = getDefaultJSON(sReqMode);
                sJsonData= $.extend(defaultJSON, sAddage);
                
                var formData = new FormData();
                // 양식 기안 및 승인 정보
                formData.append("formObj", JSON.stringify(sJsonData));
                
                // 파일정보
                for (var i = 0; i < l_aObjFileList.length; i++) {
                    if (typeof l_aObjFileList[i] == 'object') {
                        formData.append("fileData[]", l_aObjFileList[i]);
                    }
                }
                
                if(sTargetURL.indexOf("/approval/") < 0)
                	sTargetURL = "/approval/" + sTargetURL;
                
                try {
                	$.ajax({
                		url:sTargetURL,
                		data: formData,
                		type:"post",
                		dataType : 'json',
                		processData : false,
            	        contentType : false,
                		success:function (res) {
                			callProcessEndScriptFunction(res, sReqMode);
                		},
                		error:function(response, status, error){
                			disableBtns(false);
                			ToggleLoadingImage();
            				CFN_ErrorAjax(sTargetURL, response, status, error);
            			}	
                	});
                } catch (e) {
                	disableBtns(false);
                    Common.Error(e.message);
                }
            } else {
                disableBtns(false);
                Common.Error(coviDic.dicMap.msg_apv_203); // "첨부파일이 정상적으로 처리되지
															// 않았습니다."
            }
        } catch (e) {
            disableBtns(false);
            Common.Error(coviDic.dicMap.msg_apv_073 + "\nDesc:" + e.message + "\nError number: " + e.stack); // "저장하지
																												// 못했습니다."
            ToggleLoadingImage()
        }
    } catch (e) {
    	Common.Error("Desc:" + e.message + "\nError number: " + e.stack);
    	ToggleLoadingImage();
    }
}

/*-------------------------------------------------------
 메뉴 버튼 이벤트 분기 처리 함수 : KJW : 2014.04.23 : XFORM PRJ.
---------------------------------------------------------*/

// 메뉴 이벤트 분기 처리 오브젝트 : KJW : 2014.04.23 : XFORM PRJ.
var doButtonCase = {};

// 메뉴 이벤트 공통 처리 오브젝트 : KJW : 2014.04.23 : XFORM PRJ.
var doButtonDefault = {
    sUrl: "",
    iWidth: "640",
    iHeight: "480",
    sSize: "fix",
    formNm: "", // not used
    m_evalJSON: "",
    elmlength: 0, // not used
    commentCount: 0, // not used
    elmComment: "",
    preProcess: function () {
        this.formNm = getInfo("FormInfo.FormPrefix")
        var filename = getInfo("FormInfo.FileName");
        if (typeof filename === 'undefined' || filename == '') return;

        if (getInfo("Request.templatemode") == "Read") {

            var m_evalJSON, elmlength, commentCount, elmComment;

            if ('' != document.getElementById("APVLIST").value) {
            	m_evalJSON = $.parseJSON(document.getElementById("APVLIST").value);
                elmlength = 
                	$$(m_evalJSON).find("steps > division > step").length;

                for (k = 0; k < elmlength; k++) {
                    commentCount = 0;
                    elmComment = $$(m_evalJSON).find("steps > division > step > ou > person > taskinfo > comment");
                    if (elmComment != null) { ++commentCount; }
                }

                this.m_evalJSON = m_evalJSON;
                this.elmlength = elmlength;
                this.commentCount = commentCount;
                this.elmComment = elmComment;
            }
        }
    }

}

var printDiv;
// 메뉴 이벤트 처리 Main function : KJW : 2014.04.23 : XFORM PRJ.
// 의견창 타이틀
var commentPopupTitle = '';
var commentPopupButtonID = '';
var commentPopupReturnValue = false;

function doButtonAction(obj) {
    commentPopupTitle = $(obj).val();		// $(obj).find('span').eq(0).text();
    commentPopupButtonID = $(obj).attr("id");

    // 연속결재의 경우 바로 실행하지 않고 클릭한 버튼 값을 저장한다.
    if (CFN_GetQueryString("bserial") == "true" && $(".topWrap").find("#" + $(obj).attr('id')).length > 0) {
        parent.setStateSerialApprovalList($(obj).attr('id'), $(obj).val(), getInfo("mode"));
    } else {
	    if (obj.id == "btApproved") {
	        if (!chkWARCOMMENT()) {
	            return;
	        }
	    }
	    // clone object
	    var baseVariableObject = jQuery.extend(true, {}, doButtonDefault);
	
	
	    // case 전 공통 처리
	    baseVariableObject.preProcess();
	
	    if (typeof _ieOrgVer === 'undefined') return;
	
	    if (_ieOrgVer < 8) {
	        Common.Warning(coviDic.dicMap.msg_apv_ieversionCheck);
	        return;
	    }
	
	    try {
	        // 버튼 분기 처리 함수 호출
	        if (typeof doButtonCase[obj.id] === 'function') {
	            // 필요한 경우 return 값 반환하여 처리
	            var ret = doButtonCase[obj.id]($(obj), baseVariableObject);
	        } else {
	            // console.log(obj.id + ' : case not defined');
	        }
	
	        // 분기 처리 후 공통 처리
	        doButtonPostProcess(baseVariableObject);
	
	    } catch (e) {
	        alert(e.description);
	        throw e;
	    }
    }

}

// 메뉴 이벤트 분기 처리 후 공통 처리 함수 : KJW : 2014.04.23 : XFORM PRJ.
function doButtonPostProcess(retVariableObject) {
    var sUrl = retVariableObject.sUrl,
        iWidth = retVariableObject.iWidth,
        iHeight = retVariableObject.iHeight,
        sSize = retVariableObject.sSize,
        formNm = retVariableObject.formNm,
        m_evalJSON = retVariableObject.m_evalJSON,
        elmlength = retVariableObject.elmlength,
        commentCount = retVariableObject.commentCount,
        elmComment = retVariableObject.elmComment;
    
    $('#result2').append('POST > iWidth:' + iWidth).append('<br>');

    if (sUrl != null && sUrl != '') {
        if (sUrl.indexOf("ApvlineMgr") > -1) {
            // alert('ApvlineMgr');
            if (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "REDRAFT") { iWidth = 1019; iHeight = 643; }
            else { iWidth = 800; iHeight = 643; }
            if (openMode == "L" || openMode == "P") {
                var nLeft = (screen.width - iWidth) / 4;
                var nTop = (screen.height - iHeight) / 4;
                var sWidth = iWidth.toString() + "px";
                var sHeight = iHeight.toString() + "px";

                if (sUrl.indexOf('\?') > -1) // 파라미터 여러개일 경우 &로 연결
                    parent.Common.ShowDialog("btLine", "btLine" + getInfo("FormInstanceInfo.FormInstID"), $("#btLine").text() + "|||" + gLabel_apvlinecomment, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");
                else
                    parent.Common.ShowDialog("btLine", "btLine" + getInfo("FormInstanceInfo.FormInstID"), $("#btLine").text() + "|||" + gLabel_apvlinecomment, sUrl + "?openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");
            } else {
                CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
            }
        } else if (sUrl.indexOf("ApvInfo") > -1) {
            if (openMode == "L" || openMode == "P") {
                var nLeft = (screen.width - iWidth) / 4;
                var nTop = (screen.height - iHeight) / 4;
                var sWidth = iWidth.toString() + "px";
                var sHeight = iHeight.toString() + "px";

                parent.Common.ShowDialog("btLine", "DivPop_" + openID, $("#btLine").text(), sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																									// 수정
																																									// 필요.
            } else {
                CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
            }
        } else if (sUrl.indexOf("comment_view") > -1) {
            if (openMode == "L" || openMode == "P") {

                // 의견창위치 화면 중앙으로 맞추기
                var nLeft = (screen.width - iWidth) / 2;
                var nTop = (screen.height - iHeight) / 2;
                var sWidth = iWidth.toString() + "px";
                var sHeight = iHeight.toString() + "px";
                parent.Common.ShowDialog("btCommentView", "DivPop_" + openID, $("#btCommentView").text(), sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																												// 수정
																																												// 필요.
            } else {
                CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
            }
        } else if (sUrl.indexOf("ApvActBasic") > -1) {
            if (openMode == "L" || openMode == "P" || navigator.userAgent.toString().indexOf("COVI_HYBRID", 0) > -1) {
                var nLeft = (screen.width - iWidth) / 2;
                var nTop = (screen.height - iHeight) / 2;
                var sWidth = iWidth.toString() + "px";
                var sHeight = iHeight.toString() + "px";
                var sActIndx = "";
                var sTitle = ""
                if (document.getElementById("ACTIONINDEX").value == "") { sActIndx = "" }
                else { sActIndx = document.getElementById("ACTIONINDEX").value; }
                if (sActIndx == "reject") { sTitle = $("#btReject").text(); }
                else { sTitle = $("#btApproved").text(); }

                if (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE") {
                    parent.Common.ShowDialog("btapproved", "DivPop_btapproved", sTitle, sUrl + "&openID=" + openID + "&actionIndx=" + sActIndx, sWidth, sHeight, "iframe-ifNoScroll");    // 기안,
																																															// 임시저장
																																															// 시
																																															// openID
																																															// 처리용
                } else {
                    if (sUrl.indexOf("?") > -1) {
                        parent.Common.ShowDialog("btapproved", "DivPop_btapproved", sTitle, sUrl + "&openID=" + openID + "&actionIndx=" + sActIndx, sWidth, sHeight, "iframe-ifNoScroll");    // 승인
																																																// 등의
																																																// openID
																																																// 처리 용
                    } else {
                        parent.Common.ShowDialog("btapproved", "DivPop_btapproved", sTitle, sUrl + "?openID=" + openID + "&actionIndx=" + sActIndx, sWidth, sHeight, "iframe-ifNoScroll");    // 승인
																																																// 등의
																																																// openID
																																																// 처리 용
                    }
                }
            } else {
                // 모바일에서 기안할 경우 레이어팝업으로 변경
                if (document.location.href.indexOf("/WebSite/Mobile/Approval/ApprovalWrite.aspx") > -1) {
                    if (sUrl.indexOf("?") > -1) {
                        Common.ShowDialog("", "divApvActBasic", "의견", sUrl + "&IsMobile=Y&actionIndx=" + sActIndx, iWidth, iHeight, "iframe-ifNoScroll");
                    } else {
                        Common.ShowDialog("", "divApvActBasic", "의견", sUrl + "?IsMobile=Y&actionIndx=" + sActIndx, iWidth, iHeight, "iframe-ifNoScroll");
                    }
                } else {
                    CFN_OpenWindow(sUrl, "CommentWrite", iWidth, iHeight, sSize);
                }
            }
        } else if (sUrl.indexOf("comment_") > -1
                   || sUrl.indexOf("CirculationMgr") > -1
                   || sUrl.indexOf("Circulation_Read_View") > -1
                   || sUrl.indexOf("ReceiptList") > -1
                   || sUrl.indexOf("HistoryList") > -1
                   || sUrl.indexOf("selectOUs") > -1
                   || sUrl.indexOf("ApvprocessDraft") > -1) {
            if (openMode == "L" || openMode == "P") {
                var nLeft = (screen.width - iWidth) / 2;
                var nTop = (screen.height - iHeight) / 2;
                var sWidth = iWidth.toString() + "px";
                var sHeight = iHeight.toString() + "px";
                if (sUrl.indexOf("ReceiptList") > -1) {
                    parent.Common.ShowDialog("", "DivPop_ReceiptList", coviDic.dicMap.lbl_apv_receipt_view, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																													// 수정
																																													// 필요.
                } else if (sUrl.indexOf("HistoryList") > -1) {
                    parent.Common.ShowDialog("", "DivPop_ReceiptList", $("#btHistory").text(), sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 히스트로
																																										// 제목
																																										// 필요.
                } else if (sUrl.indexOf("comment_") > -1) {
                    parent.Common.ShowDialog("", "DivPop_" + openID, coviDic.dicMap.lbl_apv_comment, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 완료함_의견
																																											// 제목
																																											// 필요.
                } else if (sUrl.indexOf("CirculationMgr") > -1) {   
                    parent.Common.ShowDialog("", "DivPop_" + openID, coviDic.dicMap.lbl_apv_setschema_Circulation, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 완료함_회람
																																															// 제목
																																															// 필요.
                } else if (sUrl.indexOf("Circulation_Read_View") > -1) {
                    parent.Common.ShowDialog("", "DivPop_" + openID, coviDic.dicMap.MsgApprovalState_ApprovalConsulted, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 완료함_참조/회람
																																																// 제목
																																																// 필요.
                }
                else {
                    if (sUrl.indexOf("?") > -1) {
                        parent.Common.ShowDialog("", "DivPop_" + openID, commentPopupTitle, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																									// 수정
																																									// 필요.
                    } else {
                        parent.Common.ShowDialog("", "DivPop_" + openID, commentPopupTitle, sUrl + "?openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																									// 수정
																																									// 필요.ReSize
                    }
                }
            } else {
                CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
            }
        } else {
            if (openMode == "L" || openMode == "P") {
                var nLeft = (screen.width - iWidth) / 2;
                var nTop = (screen.height - iHeight) / 2;
                var sWidth = iWidth.toString() + "px";
                var sHeight = iHeight.toString() + "px";
                if (sUrl.indexOf("ReceiptList") > -1) {
                    parent.Common.ShowDialog("", "DivPop_ReceiptList", commentPopupTitle, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																								// 수정
																																								// 필요.
                } else {
                    if (sUrl == "Print.do" || sUrl == "PrintForm.do") {
                        CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
                    }else if (sUrl.indexOf("Pubpreview") > -1) { 
                        parent.Common.ShowDialog("", "DivPop_" + openID, coviDic.dicMap.lbl_apv_OTransPV, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 대외공문
																																												// 미리보기
                    } else if (sUrl.indexOf("?") > -1) {
                        parent.Common.ShowDialog("", "DivPop_" + openID, commentPopupTitle, sUrl + "&openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																									// 수정
																																									// 필요.
                    } else {
                        parent.Common.ShowDialog("", "DivPop_" + openID, commentPopupTitle, sUrl + "?openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블
																																									// 수정
																																									// 필요.ReSize
                    }
                }
            } else {
            	CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
            }
            // CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
        }
    }

}

/*-------------------------------------------------------
 메뉴 버튼 이벤트 분기 처리 함수 : KJW : 2014.04.23 : XFORM PRJ.
--------------------------------------------------------- 
[버튼 이벤트 처리 방법] 
버튼이 추가되면 아래의 구문을 추가한다.
기존의 switch case 에 정의되는 것이 독립한 함수로 분화한 형태로 사용.

doButtonCase['버튼 아이디'] = function (oBtn, oVar) {
    // 처리 구문
}
--------------------------------------------------------- 
[파라미터]
oBtn :	이벤트가 발생한 개체로 jquery 개체.
		예) oBtn.css('border', 'solid 1px #f00');

oVar :	버튼 이벤트 처리에 사용되는 공통 variable을 담은 오브젝트. 
		아래는 참조 가능한 속성

		sUrl : "",
		iWidth : "640",
		iHeight : "480",
		sSize : "fix",
		formNm : "",
		m_evalXML : "",
		elmlength : 0,
		commentCount : 0,
		elmComment : "",
		preProcess : function()
--------------------------------------------------------------
 분기 처리 함수 <시작> : KJW : 2014.04.23 : XFORM PRJ.
-------------------------------------------------------------*/
doButtonCase['bt_receive_cc'] = function (oBtn, oVar) {// 수신/참조
    receiveOpen();
}

doButtonCase['btreceive'] = function (oBtn, oVar) {// 수신
    oVar.iWidth = 400; oVar.iHeight = 400;
    receiveOpen();
}

doButtonCase['btCC'] = function (oBtn, oVar) {// 참조
    oVar.iWidth = 400; oVar.iHeight = 400;
    ccOpen();
}

doButtonCase['btCirculate'] = function (oBtn, oVar) {// 회람
	oVar.iWidth = 1027; oVar.iHeight = 585;
    oVar.sUrl = "goCirculationMgrListpage.do?piid="+getInfo("ProcessInfo.ProcessID") + "&fiid=" + getInfo("FormInstanceInfo.FormInstID") + "&openDo=Circulate&openType=C&pState=528&bstored=true";
}

doButtonCase['bt_receive_cc_circulation'] = function (oBtn, oVar) {// 수신/참조/회람
    oVar.sUrl = "/WebSite/Approval/Circulation/CirculationMgr.aspx?piid=" + getInfo("ProcessInfo.ProcessID") + "&fiid=" + getInfo("FormInstanceInfo.FormInstID") + "&openDo=Circulate&openType=0&pState=528";
    oVar.iWidth = 980; oVar.iHeight = 680 - 34; oVar.sSize = "fix";
}

/**
 * xml -> json
 */
doButtonCase['btDraft'] = function (oBtn, oVar) {// 기안하기
    
    // 합의자 체크
    if (getInfo("AutoApprovalLine.Agree.autoChk") == "Y") {
        if (getInfo("AutoApprovalLine.Agree.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.Agree.WorkedApprovalLine") != undefined) {
            var oAutoLineAgree = $.parseJSON(getInfo("AutoApprovalLine.Agree.WorkedApprovalLine"));
            if ($$(oAutoLineAgree).find("step").concat().length > 0) {
                var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
                var oAppList = $$(jsonApv).find("steps>division[divisiontype='send']>step[routetype='assist'][unittype='person'], steps>division[divisiontype='send']>step[routetype='consult'][unittype='person']");
                for (var i = 0; i < $$(oAppList).find("ou>person").concat().length; i++) {
                    var oChkNode = $$(oAutoLineAgree).find("step>ou").has("person>[code='" + $$(oAppList).find("ou>person").concat().eq(i).attr("code") + "']");
                    if (oChkNode.length > 0) {
                        $$(oChkNode).remove();
                    }
                }
                if ($$(oAutoLineAgree).find("step>ou>person").concat().length > 0) {
                    var sAlert = "[";
                    $$(oAutoLineAgree).find("step>ou>person").concat().each(function(i, elm){
                    	if (i > 0) sAlert += ", ";
                        sAlert += getLngLabel(elm.attr("name"), false);
                        sAlert += " " + getLngLabel(elm.attr("position"), true);
                    });
                    
                    sAlert += "]";
                    sAlert = coviDic.dicMap.msg_apv_autoChkAgree.replace("{0}", sAlert);
                    alert(sAlert);
                    return;
                }
            }
        }
    }
    // 결재자 체크
    if (getInfo("AutoApprovalLine.Approval.autoChk") == "Y") {
        if (getInfo("AutoApprovalLine.Approval.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.Approval.WorkedApprovalLine") != undefined) {
            var oAutoLineApproval = $.parseJSON(getInfo("AutoApprovalLine.Approval.WorkedApprovalLine"));
            if ($$(oAutoLineApproval).find("step").concat().length > 0) {
                var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
                var oAppList = $$(jsonApv).find("steps>division[divisiontype='send']>step[name!='reference'][routetype='approve'][unittype='person']");
                for (var i = 0; i < $$(oAppList).concat().length; i++) {
                    var oChkNode = $$(oAutoLineApproval).find("step").concat().has("ou > person[code='" + $$($$(oAppList).concat().eq(i)).find("ou > person").attr("code") + "']");
                    if (oChkNode.length > 0) {
                        // $$(oChkNode).remove();
                    	$$(oAutoLineApproval).find("step").remove(oChkNode.index());
                    }
                }
                if ($$(oAutoLineApproval).find("step").concat().length > 0) {
                    var sAlert = "[";
                    for (var i = 0; i < $$(oAutoLineApproval).find("step").concat().length; i++) {
                        if (i > 0) sAlert += ", ";
                        sAlert += getLngLabel($$($$(oAutoLineApproval).find("step").concat().eq(i)).find("ou > person").attr("name"), false);
                        sAlert += " " + getLngLabel($$($$(oAutoLineApproval).find("step").concat().eq(i)).find("ou > person").attr("position"), true);
                    }
                    sAlert += "]";
                    sAlert = coviDic.dicMap.msg_apv_autoChkApproval.replace("{0}", sAlert);
                    alert(sAlert);
                    return;
                }
            }
        }
    }
    // 참조자 체크
    if (getInfo("AutoApprovalLine.CCAfter.autoChk") == "Y") {
        if (getInfo("AutoApprovalLine.CCAfter.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.CCAfter.WorkedApprovalLine") != undefined) {
            var oAutoLineCC = $.parseJSON(getInfo("AutoApprovalLine.CCAfter.WorkedApprovalLine"));
            if ($$(oAutoLineCC).find("ccinfo").concat().length > 0) {
                var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
                var oAppList = $$(jsonApv).find("steps > ccinfo > ou > person");
                for (var i = 0; i < $$(oAppList).concat().length; i++) {
                    var oChkNode = $$(oAutoLineCC).find("ccinfo").has("ou > person[code='" + $$($$(oAppList).concat().eq(i)).attr("code") + "']");
                    if (oChkNode.length > 0) {
                        // $$(oChkNode).remove();
                    	$$(oAutoLineCC).find("ccinfo").remove(oChkNode.index());
                    }
                }
                oAppList = $$(jsonApv).find("steps > ccinfo > ou").not("person");
                for (var i = 0; i < $$(oAppList).concat().length; i++) {
                    var oChkNode = $$(oAutoLineCC).find("ccinfo").has("ou[code='" + $$($$(oAppList).concat().eq(i)).attr("code") + "']").not("person");
                    if (oChkNode.length > 0) {
                    	// $$(oChkNode).remove();
                    	$$(oAutoLineCC).find("ccinfo").remove(oChkNode.index());
                    }
                }
                if ($$(oAutoLineCC).find("ccinfo").concat().length > 0) {
                    var sAlert = "[";
                    for (var i = 0; i < $$(oAutoLineCC).find("ccinfo").concat().length; i++) {
                        if (i > 0) sAlert += ", ";
                        if ($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou > person").length == 0) {
                            sAlert += getLngLabel($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou").attr("name"), false);
                        } else {
                            sAlert += getLngLabel($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou > person").attr("name"), false);
                            sAlert += " " + getLngLabel($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou > person").attr("position"), true);
                        }
                    }
                    sAlert += "]";
                    sAlert = coviDic.dicMap.msg_apv_autoChkCC.replace("{0}", sAlert);
                    alert(sAlert);
                    return;
                }
            }
        }
    }
    // 참조자 체크(사전)
    if (getInfo("AutoApprovalLine.CCBefore.autoChk") == "Y") {
        if (getInfo("AutoApprovalLine.CCBefore.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.CCBefore.WorkedApprovalLine") != undefined) {
            var oAutoLineCC = $.parseJSON(getInfo("AutoApprovalLine.CCBefore.WorkedApprovalLine"));
            if ($$(oAutoLineCC).find("ccinfo").concat().length > 0) {
                var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
                var oAppList = $$(jsonApv).find("steps > ccinfo > ou > person");
                for (var i = 0; i < $$(oAppList).concat().length; i++) {
                    var oChkNode = $$(oAutoLineCC).find("ccinfo").has("ou > person[code='" + $$($$(oAppList).concat().eq(i)).attr("code") + "']");
                    if (oChkNode.length > 0) {
                    	// $$(oChkNode).remove();
                    	$$(oAutoLineCC).find("ccinfo").remove(oChkNode.index());
                    }
                }
                oAppList = $$(jsonApv).find("steps > ccinfo > ou").not("person");
                for (var i = 0; i < $$(oAppList).concat().length; i++) {
                    var oChkNode = $$(oAutoLineCC).find("ccinfo").has("ou[code='" + $$($$(oAppList).concat().eq(i)).attr("code") + "']").not("person");
                    if (oChkNode.length > 0) {
                    	// $$(oChkNode).remove();
                    	$$(oAutoLineCC).find("ccinfo").remove(oChkNode.index());
                    }
                }
                if ($$(oAutoLineCC).find("ccinfo").concat().length > 0) {
                    var sAlert = "[";
                    for (var i = 0; i < $$(oAutoLineCC).find("ccinfo").concat().length; i++) {
                        if (i > 0) sAlert += ", ";
                        if ($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou > person").length == 0) {
                            sAlert += getLngLabel($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou").attr("name"), false);
                        } else {
                            sAlert += getLngLabel($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou > person").attr("name"), false);
                            sAlert += " " + getLngLabel($$($$(oAutoLineCC).find("ccinfo").concat().eq(i)).find("ou > person").attr("position"), true);
                        }
                    }
                    sAlert += "]";
                    sAlert = coviDic.dicMap.msg_apv_autoChkCC.replace("{0}", sAlert);
                    alert(sAlert);
                    return;
                }
            }
        }
    }
    m_sReqMode = "DRAFT";
    
    // CommentWrite.do
    if (evaluateForm()) {
    	if(_mobile) {
    		var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
            var eml = $$(jsonApv).find("steps>division[divisiontype='send']>step>ou>person>taskinfo[kind='charge']");
            if (document.getElementById("ACTIONCOMMENT").value != "") {
            	// 결재선에 <comment> 추가 후 의견 저장
            	var oComment = { "comment" : {"#text" : document.getElementById("ACTIONCOMMENT").value} } ;
            	var oCommentNode = oComment.comment;
            	if (eml.length > 0) {
            		var emlComment = $$(eml).find("comment");
            		if ($$(emlComment).length > 0) {
            			$$(emlComment).remove();
            		}
            		$$(eml).append("comment", oCommentNode);
            	}
                
            	document.getElementById("APVLIST").value = JSON.stringify($$(jsonApv).concat().eq(0).json());
            }
            if(getInfo("AppInfo.usit") != ""){
            	$$(eml).attr("customattribute1", getInfo("AppInfo.usit"));
            	document.getElementById("APVLIST").value = JSON.stringify($$(jsonApv).concat().eq(0).json());
            }
            requestProcess("DRAFT");
    	} else {
 		    var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 349, "resize");
		    
		    var commonWritePopupOnload = function(){
		    	commonWritePopup.$("input#commentOK").click(function(){
	    			if(commentPopupReturnValue){
	    				var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
	    				var eml = $$(jsonApv).find("steps>division[divisiontype='send']>step>ou>person>taskinfo[kind='charge']");
	    				if (document.getElementById("ACTIONCOMMENT").value != "") {
	    					// 결재선에 <comment> 추가 후 의견 저장
	    					var oComment = { "comment" : {"#text" : document.getElementById("ACTIONCOMMENT").value} } ;
	    					var oCommentNode = oComment.comment;
			                if (eml.length > 0) {
			                	var emlComment = $$(eml).find("comment");
			                	if ($$(emlComment).length > 0) {
			                		$$(emlComment).remove();
			                	}
			                	$$(eml).append("comment", oCommentNode);
			                }
			                   
			                document.getElementById("APVLIST").value = JSON.stringify($$(jsonApv).concat().eq(0).json());
	    				}
	    				if(getInfo("AppInfo.usit") != ""){
	    					$$(eml).attr("customattribute1", getInfo("AppInfo.usit"));
	    					document.getElementById("APVLIST").value = JSON.stringify($$(jsonApv).concat().eq(0).json());
	    				}
	    				requestProcess("DRAFT");
	    			}
		    	});
		    };
	    	
	    	var pollTimer = window.setInterval(function() {
	    	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
	    	        window.clearInterval(pollTimer);
	    	        commonWritePopupOnload();
	    	    }
	    	}, 200);
    	}
    }
    
}

/*
 * 결재선 변경 버튼 비사용 doButtonCase['btChgApv'] = function (oBtn, oVar) {//결재선변경
 * changeApvList(); }
 */

doButtonCase['btLine'] = function (oBtn, oVar) {// 결재선관리
    // 동시결재자 결재선변경 방지
	// user/ApprovalDetailList.do?FormInstID=358&ProcessID=1365162
   
    var oApproveStep;
    if (getInfo("Request.mode") == "APPROVAL") {
        var jsonApv = $.parseJSON(document.getElementById("APVLIST").value);
        oApproveStep = $$(jsonApv).find("steps>division").has("taskinfo[status='pending']").find(">step").has("ou>person[code='" + getInfo("AppInfo.usid") + "']").has("ou>person>taskinfo[status='pending'])");
    }

    if ((getInfo("Request.loct") == "MONITOR") || (getInfo("Request.loct") == "PREAPPROVAL") || (getInfo("Request.loct") == "PROCESS") || (getInfo("Request.loct") == "REVIEW") || (getInfo("Request.loct") == "COMPLETE") || (getInfo("Request.mode") == "REJECT") || (getInfo("Request.mode") == "JOBDUTY") || (getInfo("Request.mode") == "PCONSULT") || getInfo("Request.subkind") == "T019" || getInfo("Request.subkind") == "T005") { // 20110318확인결재추가-확인결재자
																																																																																																											// 결재선변경권한없음
        oVar.iHeight = 310; oVar.iWidth = 690;
        oVar.sUrl = "user/ApprovalDetailList.do?ProcessID=" + getInfo("ProcessInfo.ProcessID") + "&FormInstID=" + getInfo("FormInstanceInfo.FormInstID");
        oVar.sSize = "scroll";
    } else if (oApproveStep && oApproveStep.attr("routetype") == "approve" && oApproveStep.attr("allottype") == "parallel") {		// 동시결재자
																																	// 결재선변경
																																	// 방지
																																	// [2015-11-24]
        oVar.iHeight = 310; oVar.iWidth = 690;
        oVar.sUrl = "user/ApprovalDetailList.do?ProcessID=" + getInfo("ProcessInfo.ProcessID") + "&FormInstID=" + getInfo("FormInstanceInfo.FormInstID");
        oVar.sSize = "scroll";
    } else {
    	oVar.iHeight = 580; oVar.iWidth = 1110;
    	oVar.sUrl = "/approval/approvalline.do";
    	oVar.sSize = "scrollbars=no,toolbar=no,resizable=no";
    }
}

doButtonCase['btRecDept'] = function (oBtn, oVar) {// 결재선관리
    oVar.sUrl = "/WebSite/Approval/ApvlineMgr/ApvDeployMgr.aspx?AllCompany=Y";
}

doButtonCase['btDeptDraft'] = function (oBtn, oVar) {// 재기안 기안과 UI 통일
    m_sReqMode = "DEPTDRAFT";
    if (evaluateForm()) {
    	var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 549, "resize");
	    /*
		 * ie 에서 unload가 동작하지 않음 $(commonWritePopup).unload(function(){
		 * if(commentPopupReturnValue){
		 * document.getElementById("ACTIONINDEX").value = "REDRAFT";
		 * //"approve"; requestProcess("RECREATE"); } });
		 */
    	
    	var commonWritePopupOnload = function(){
    		commonWritePopup.$("input#commentOK").click(function(){
    			if(commentPopupReturnValue){
    				document.getElementById("ACTIONINDEX").value = "REDRAFT";		// "approve";
    			    requestProcess("RECREATE");
    		       }
		    });
    	};
    	
    	var pollTimer = window.setInterval(function() {
    	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
    	        window.clearInterval(pollTimer);
    	        commonWritePopupOnload();
    	    }
    	}, 200);
    }
}

doButtonCase['btCharge'] = function (oBtn, oVar) {// 재기안담당자 지정
	document.getElementById("ACTIONINDEX").value = "CHARGE";
    m_sAddList = 'charge'; Open_Forward(m_sAddList);
}

doButtonCase['btDeptLine'] = function (oBtn, oVar) {// 재기안결재선관리
	CFN_OpenWindow("/approval/approvalline.do","ApprovalLineMgr",1100,580,"scrollbars=no,toolbar=no,resizable=no"); 
}

doButtonCase['menu2'] = function (oBtn, oVar) {// 첨부..
    if (gFileAttachType == "1") { // 시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans,
									// 1:DEXTUploadX
        attFile(); oVar.iWidth = 480; oVar.iHeight = 326;
    } else {
        attFile2(); oVar.iWidth = 480; oVar.iHeight = 326;
    }
}

doButtonCase['btPreView'] = function (oBtn, oVar) {// 미리보기
	// 첨부파일 세팅
	// setFormAttachFileInfo();
	
    (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? oVar.sSize = "scroll" : oVar.sSize = "fix";

    oVar.iWidth = 790;
    // 가로양식
    if (IsWideOpenFormCheck(getInfo("FormInfo.FormPrefix"))) {
        oVar.iWidth = 1070;
    }
    oVar.iHeight = window.screen.height - 82;
    oVar.sUrl = String(document.location.href);
    oVar.sUrl = oVar.sUrl.replace("FormWrite", "Form"); // 바닥 작성창에서 Open할 경우
    if (oVar.sUrl.lastIndexOf("#") == (oVar.sUrl.length - 1)) { oVar.sUrl = oVar.sUrl.substring(0, oVar.sUrl.lastIndexOf("#")); } // url에
																																	// #이
																																	// 포함되어
																																	// 있음
																																	// 제거처리
    oVar.sUrl = oVar.sUrl + "&Readtype=preview";
    if(CFN_GetQueryString("openID") != "undefined" ){
        oVar.sUrl = oVar.sUrl.split('&');
        oVar.sUrl = oVar.sUrl[0] + oVar.sUrl[1] + oVar.sUrl[2] + oVar.sUrl[3];
    }
}

doButtonCase['btPrint'] = function (oBtn, oVar) {// 인쇄
    /*
	 * if (oVar.elmComment.length == 0) { try {
	 * document.getElementById("CommentList").style.display = "none"; } catch
	 * (e) { } } else { if (confirm(coviDic.dicMap.msg_apv_288.replace(/\\n/g,
	 * '\n'))) {//"의견을 포함하여 인쇄하시겠습니까?\n [확인]->[의견포함],\n [닫기]->[의견미포함]" try {
	 * document.getElementById("CommentList").style.display = ""; } catch (e) { } }
	 * else { try { document.getElementById("CommentList").style.display =
	 * "none"; } catch (e) { } } }
	 */
    m_CmtBln = false;
    bPresenceView = false;
    // __displayApvList(oVar.m_evalJSON);
    // printDiv = "<html><body>" + getBodyHTML() + "</body></html>";
    printDiv = getMigHtml();
	printDiv = "<html><body style='padding-top: 30px;'>" + printDiv + "</body></html>";
	
    if (!_ie) {
        oVar.iWidth = 1000; oVar.iHeight = 700;
    } else {
        oVar.iWidth = 100; oVar.iHeight = 100;
    }

    gPrintType = "0";

    if (gPrintType == "0") {
        oVar.sUrl = "form/Print.do";
    } else if (gPrintType == "1") {
        m_oFormReader.print_part('editor');
    }
    m_CmtBln = true;
    bPresenceView = true;
    // __displayApvList(oVar.m_evalJSON);
}

doButtonCase['btPrintView'] = function (oBtn, oVar) {// 인쇄미리보기
    if (!_ie && (getInfo("FormInfo.FormPrefix") == "OFFICAL_DOCUMENT_02" || getInfo("FormInfo.FormPrefix") == "OFFICAL_DOCUMENT_01")) {
        alert("[대외공문]인쇄는 IE 에서만 지원 가능합니다.");
    } else {

        if (getInfo("SchemaContext.scOPub.isUse") == "Y") {
            try {
                if (document.getElementById("rowcnt_doc").value != "0") {
                    document.getElementById("ADD_rowCnt_Doc").style.height = (document.getElementById("rowcnt_doc").value * 50) + "px";
                }
            } catch (e) { }
            try { document.getElementById("CommentList").style.display = "none"; document.getElementById("CCLine").style.display = "none"; } catch (e) { }

            printDiv = "<html><body>" + getBodyHTML() + "</body></html>";

        }else {
            if (oVar.elmComment.length == 0) {
                try { document.getElementById("CommentList").style.display = "none"; } catch (e) { }
            } else {
                if (confirm(coviDic.dicMap.msg_apv_288.replace(/\\n/g, '\n'))) {// "의견을
																				// 포함하여
																				// 인쇄하시겠습니까?\n
																				// [확인]->[의견포함],\n
																				// [닫기]->[의견미포함]"
                    try { document.getElementById("CommentList").style.display = ""; } catch (e) { }
                } else {
                    try { document.getElementById("CommentList").style.display = "none"; } catch (e) { }
                }
            }

            printDiv = "<html><body>" + getBodyHTML() + "</body></html>";
        }

        m_CmtBln = false;
        m_oFormEditor.bPresenceView = false;
        __displayApvList(oVar.m_evalJSON);
        oVar.iWidth = 800; oVar.iHeight = 700;

        gPrintType = "0";
        if (gPrintType == "0") {
            oVar.sUrl = "form/PrintForm.do";
        } else if (gPrintType == "1") {
            m_oFormReader.print_part('editor');
        }
        m_CmtBln = true;
        m_oFormEditor.bPresenceView = true;
        __displayApvList(oVar.m_evalJSON);
        // displayApvList(oVar.m_evalJSON);
    }

}
// (본사운영) 외주 버튼
doButtonCase['btPrintContract'] = function (oBtn, oVar) {// 발주, 외주 인쇄미리보기
    doButtonCase['btPurchaseOrder'](oBtn, oVar);
}

// (본사운영) 발주 버튼
doButtonCase['btPurchaseOrder'] = function (oBtn, oVar) {// 발주, 외주 인쇄미리보기
    /*
	 * if (!_ie && (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_ORDER" ||
	 * getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_OUTSOURCING")) {
	 * alert("[발주품의]인쇄는 IE 에서만 지원 가능합니다."); } else {
	 */

        if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_ORDER" || getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_OUTSOURCING") {
            try {
                if (document.getElementById("rowcnt_doc").value != "0") {
                    document.getElementById("ADD_rowCnt_Doc").style.height = (document.getElementById("rowcnt_doc").value * 50) + "px";
                }
            } catch (e) { }
            try { document.getElementById("CommentList").style.display = "none"; document.getElementById("CCLine").style.display = "none"; } catch (e) { }

            printDiv = "<html><body>" + getBodyHTML() + "</body></html>";

        }
        else {
            if (oVar.elmComment.length == 0) {
                try { document.getElementById("CommentList").style.display = "none"; } catch (e) { }
            } else {
                if (confirm(coviDic.dicMap.msg_apv_288.replace(/\\n/g, '\n'))) {// "의견을
																				// 포함하여
																				// 인쇄하시겠습니까?\n
																				// [확인]->[의견포함],\n
																				// [닫기]->[의견미포함]"
                    try { document.getElementById("CommentList").style.display = ""; } catch (e) { }
                } else {
                    try { document.getElementById("CommentList").style.display = "none"; } catch (e) { }
                }
            }

            printDiv = "<html><body>" + getBodyHTML() + "</body></html>";
        }

        m_CmtBln = false;
        bPresenceView = false;
        __displayApvList(oVar.m_evalJSON);
        oVar.iWidth = 800; oVar.iHeight = 700;

        gPrintType = "0";
        if (gPrintType == "0") {
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_ORDER") {
            	CoviWindow("/approval/goOrder.do", "Order", "800", "700", "scroll");
            }
            else if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_OUTSOURCING") {
            	CoviWindow("/approval/goOutsourcing.do", "Outsourcing", "800", "700", "scroll");
            }
        } else if (gPrintType == "1") {
            m_oFormReader.print_part('editor');
        }
        m_CmtBln = true;
        bPresenceView = true;
        __displayApvList(oVar.m_evalJSON);
    // }
}

// (본사운영) 라이선스 버튼 비사용
doButtonCase['btPrintLicense'] = function (oBtn, oVar) {// 라이센스 인쇄미리보기
    if (!_ie && (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_License")) {
        alert("[라이센스]인쇄는 IE 에서만 지원 가능합니다.");
    } else {

        if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_License") {
            try {
                if (document.getElementById("rowcnt_doc").value != "0") {
                    document.getElementById("ADD_rowCnt_Doc").style.height = (document.getElementById("rowcnt_doc").value * 50) + "px";
                }
            } catch (e) { }
            try { document.getElementById("CommentList").style.display = "none"; document.getElementById("CCLine").style.display = "none"; } catch (e) { }

            printDiv = "<html><body>" + getBodyHTML() + "</body></html>";

        }
        else {
            if (oVar.elmComment.length == 0) {
                try { document.getElementById("CommentList").style.display = "none"; } catch (e) { }
            } else {
                if (confirm(coviDic.dicMap.msg_apv_288.replace(/\\n/g, '\n'))) {// "의견을
																				// 포함하여
																				// 인쇄하시겠습니까?\n
																				// [확인]->[의견포함],\n
																				// [닫기]->[의견미포함]"
                    try { document.getElementById("CommentList").style.display = ""; } catch (e) { }
                } else {
                    try { document.getElementById("CommentList").style.display = "none"; } catch (e) { }
                }
            }

            printDiv = "<html><body>" + getBodyHTML() + "</body></html>";
        }

        m_CmtBln = false;
        m_oFormEditor.bPresenceView = false;
        __displayApvList(oVar.m_evalJSON);
        oVar.iWidth = 800; oVar.iHeight = 700;

        gPrintType = "0";
        if (gPrintType == "0") {
            if (getInfo("FormInfo.FormPrefix") == "WF_FORM_DRAFT_License") {
            	CoviWindow("/approval/goSoftwareView.do", "Software", "700", "900", "scroll");
            }
        } else if (gPrintType == "1") {
            m_oFormReader.print_part('editor');
        }
        m_CmtBln = true;
        m_oFormEditor.bPresenceView = true;
        __displayApvList(oVar.m_evalJSON);
    }
}

doButtonCase['btHistory'] = function (oBtn, oVar) {// 히스토리
    var vwidth = 790;
    // 가로양식
    if (IsWideOpenFormCheck(getInfo("FormInfo.FormPrefix"))) {
        vwidth = 1070;
    }

    oVar.iWidth = 857;
    var vheight = (window.screen.height - 100);
    oVar.iHeight = vheight;
    oVar.sSize= "scroll";
    
    oVar.sUrl = "goHistoryListPage.do?ProcessID=" + getInfo("ProcessInfo.ProcessID") + "&FormInstID=" + getInfo("FormInstanceInfo.FormInstID") + "&FormPrefix=" + getInfo("FormInfo.FormPrefix") + "&Revision=" + getInfo("FormInfo.Revision");
    
}

/*
 * 게시발송 버튼 비사용 doButtonCase['btBBS'] = function (oBtn, oVar) { var rtnBBS =
 * GetFolderSelect(); // 게시판 선택 SiteRefence/js/Utilty.js
 * 
 * if (rtnBBS == undefined) { return; } if (rtnBBS != null & rtnBBS[0] != "") {
 * rtnBBS = "<BBS><ID_FOLDER>" + rtnBBS[0] + "</ID_FOLDER>" + "<NAME_FORDER>" +
 * rtnBBS[1] + "</NAME_FORDER>" + "<SUBJECT>" +
 * getInfo("FormInstanceInfo.Subject") + "</SUBJECT><HTML_BODY><![CDATA[" +
 * document.getElementById("bodytable").innerHTML + "]]></HTML_BODY></BBS>";
 * CFN_CallAjax("SendBBS.aspx", rtnBBS, function (data) { receiveBBSHTTP(data); },
 * false, "xml"); } }
 */

doButtonCase['btSave'] = function (oBtn, oVar) {// 임시저장
    if (document.getElementById("Subject").value == "") {
        var subject = CFN_GetDicInfo(getInfo("AppInfo.usnm")) + " - " + CFN_GetDicInfo(getInfo("FormInfo.FormName"));
        document.getElementById("Subject").value = subject;
        m_TempSaveInfo = true;
        m_TempSave = true;
    }
    setFormAttachFileInfo();
    
    m_sReqMode = "TEMPSAVE";
    requestProcess("TEMPSAVE");
}

doButtonCase['btModify'] = function (oBtn, oVar) {// 수정
	var isApvLineChg = "N";
	// 결재선이 수정되었을 경우 마킹값 넘김
	if(getInfo("ApprovalLine") != $("#APVLIST").val()){
		isApvLineChg = "Y";
	}
	
    var submitForm = document.createElement("FORM");
    document.body.appendChild(submitForm);
    submitForm.method = "POST";
    submitForm.name = "DocModify";
    var newElement = document.createElement("TEXTAREA");
    submitForm.appendChild(newElement);
    newElement.id = 'DocModifyApvLine';
    newElement.name = 'DocModifyApvLine';
    newElement.value = document.getElementById("APVLIST").value;
    newElement.style.display = 'none';
    submitForm.target = "_self";
    submitForm.action = window.location.href.replace("#", "").replace("&editMode=", "").replace("&editMode=N", "").replace("&reuse=", "") + "&editMode=Y&reuse=&isApvLineChg="+isApvLineChg;
    submitForm.submit();
}

doButtonCase['btchangeSave'] = function (oBtn, oVar) {// 수정저장
	setFormAttachFileInfo();
    changeFormdata();
}

doButtonCase['btECNMail'] = function (oBtn, oVar) {// ECN 전자메일변환
    sendECNMail();
}

doButtonCase['btTrans'] = function (oBtn, oVar) {// 내부결재선관리
    if (getInfo("SchemaContext.scIPub.isUse") == "Y") {
        Common.Confirm(gMessage100, "Confirmation Dialog", function (result) { // "의견을
																				// 포함하여
																				// 인쇄하시겠습니까?\n
																				// [확인]->[의견포함],\n
																				// [닫기]->[의견미포함]"
            m_oFormEditor.initEnforceForm();
        });
    } else { m_oFormEditor.initEnforceForm(); }
}

doButtonCase['btOTrans'] = function (oBtn, oVar) {// 대외공문변환
	/*
	 * if (!_ie && getInfo("FormInfo.FormPrefix") == "WF_FORM_EXTERNAL"){
	 * //(getInfo("FormInfo.FormPrefix") == "OFFICAL_DOCUMENT_02" ||
	 * getInfo("FormInfo.FormPrefix") == "OFFICAL_DOCUMENT_01")) {
	 * alert("[대외공문]인쇄는 IE 에서만 지원 가능합니다."); return false; }
	 */
    try {
        if (document.getElementById("rowcnt_doc").value != "0") {
            document.getElementById("ADD_rowCnt_Doc").style.height = (document.getElementById("rowcnt_doc").value * 50) + "px";
        }
    } catch (e) { }
    try {
        document.getElementById("CommentList").style.display = "none"; 
        document.getElementById("CCLine").style.display = "none";
        document.getElementById("AssistLine").style.display = "none";
        document.getElementById("AppLine").style.display = "none";
        
        // 리스트형 결재선인 경우 대비
        document.getElementById("AppLineListType").style.display = "none";
    } catch (e) { }

    printDiv = "<html><body>" + getBodyHTML("PUB") + "</body></html>";

    m_CmtBln = false;
    bPresenceView = false;
    if (CFN_GetQueryString("menukind") != "notelist") __displayApvList(oVar.m_evalJSON);  // __displayApvList(oVar.m_evalXML);

    oVar.sSize = "fix";
    oVar.iWidth = 810;
    oVar.iHeight = window.screen.height - 82

    gPrintType = "0";

    if (gPrintType == "0") {
        oVar.sUrl = "form/PrintForm.do";
    } else if (gPrintType == "1") {
        m_oFormReader.print_part('editor');
    }
    m_CmtBln = true;
    bPresenceView = true;
    if (CFN_GetQueryString("menukind") != "notelist") __displayApvList(oVar.m_evalJSON); // __displayApvList(oVar.m_evalXML);
}

doButtonCase['btAdd'] = function (oBtn, oVar) {// 일괄기안 안건추가
    m_oFormEditor.AddBody();
}

doButtonCase['btDelete'] = function (oBtn, oVar) {// 일괄기안 안건삭제
    m_oFormEditor.DeleteBody();
}

doButtonCase['btWithdraw'] = function (oBtn, oVar) {// 회수
	if(CFN_GetQueryString("isMobile") == "Y" || _mobile) {
		if(confirm(mobile_comm_getDic("msg_apv_391"))) {
			requestProcess("WITHDRAW");
		} else {
			return;
		}
	} else {
	    Common.Confirm(coviDic.dicMap.msg_apv_391, "Confirmation Dialog", function (result) {
	        if (result) {
	            requestProcess("WITHDRAW");
	        }
	        else {
	            return;
	        }
	    });
	}
}

doButtonCase['btAbort'] = function (oBtn, oVar) {// 취소

	if(CFN_GetQueryString("isMobile") == "Y" || _mobile) {
		requestProcess("ABORT");	
	} else {
		var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 349, "resize");
	    /*
		 * ie 에서 unload가 동작하지 않음 $(commonWritePopup).unload(function(){
		 * if(commentPopupReturnValue){ requestProcess("ABORT"); } });
		 */
		
		var commonWritePopupOnload = function(){
			commonWritePopup.$("input#commentOK").click(function(){
				if(commentPopupReturnValue){
					requestProcess("ABORT");
				}
		    });
		};
		
		var pollTimer = window.setInterval(function() {
		    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
		        window.clearInterval(pollTimer);
		        commonWritePopupOnload();
		    }
		}, 200);		
	}
}

doButtonCase['btApproveCancel'] = function (oBtn, oVar) {// 승인취소
	if(CFN_GetQueryString("isMobile") == "Y" || _mobile) {
		if(confirm(mobile_comm_getDic("msg_apv_390"))) {
			document.getElementById("ACTIONINDEX").value = "approve";
			requestProcess("APPROVECANCEL");
		} else {
			return;
		}
	} else {
	    Common.Confirm(coviDic.dicMap.msg_apv_390, "Confirmation Dialog", function (result) {
	        if (result) {
	            document.getElementById("ACTIONINDEX").value = "approve";
	            requestProcess('APPROVECANCEL');
	        }
	        else {
	            return;
	        }
	    });
	}
}
doButtonCase['btMonitor'] = function (oBtn, oVar) {// 현황
    requestProcess("MONITOR");
}

doButtonCase['btRec'] = function (oBtn, oVar) {// 접수
    document.getElementById("ACTIONINDEX").value = "APPROVAL";		// "approve";
    requestProcess("RECREATE");
}

doButtonCase['btReUse'] = function (oBtn, oVar) {// 재사용
    if (window.location.href.substr(-1) === "#") {
        // script 실행후 url뒤에 붙어있는 #제거
    	window.location.href = window.location.href.substring(0, window.location.href.length - 1).replace("&editMode=", "").replace("&editMode=N", "").replace("&reuse=", "") + "&editMode=Y&reuse=Y";
    } else {
    	window.location.href = window.location.href.replace("&editMode=", "").replace("&editMode=N", "").replace("&reuse=", "") + "&editMode=Y&reuse=Y";
    }
    return false;
}

// (본사운영) 출장복명서 작성 (btBizrip)
doButtonCase['btBizrip'] = function (oBtn, oVar) {
    window.location.href = "approval_Form.do?formPrefix=WF_FROM_BIZTRIP_REPORT&mode=DRAFT&RequestFormInstID=" + getInfo("FormInstanceInfo.FormInstID");
}

// (본사운영) 프로젝트 집행계획서 작성
doButtonCase['btnExecPlan'] = function (oBtn, oVar) {
    window.location.href = "approval_Form.do?formPrefix=WF_FORM_PROJECT_EXECPLAN&mode=DRAFT&RequestFormInstID=" + getInfo("FormInstanceInfo.FormInstID");
}

// (본사운영) 휴가취소 신청서 버튼
doButtonCase['btVacationCancle'] = function (oBtn, oVar) {

    var VacationCancelForm = coviCmn.configMap.VacationForm.toString().split("^")[0];

    var strURL = "approval_Form.do?formPrefix=" + VacationCancelForm + "&mode=DRAFT&RequestFormInstID=" + getInfo("FormInstanceInfo.FormInstID");

    var iWidth = 790;
    var iHeight = window.screen.height - 82;

    CFN_OpenWindow(strURL, "VacForm", iWidth, iHeight, "fix");
}

// (본사테스트) 휴가취소 신청서 버튼(테스트)
doButtonCase['btVacationCancleTest'] = function (oBtn, oVar) {
	var VacationCancelForm = 'WF_FORM_VACATIONCANCEL_TEST';
	
    var strURL = "approval_Form.do?formPrefix=" + VacationCancelForm + "&mode=DRAFT&RequestFormInstID=" + getInfo("FormInstanceInfo.FormInstID");

    var iWidth = 790;
    var iHeight = window.screen.height - 82;

    CFN_OpenWindow(strURL, "VacForm", iWidth, iHeight, "fix");
}

doButtonCase['btReplyHeoyJo'] = function (oBtn, oVar) {// 회신(협조전)
    window.location.href = window.location.href + "&editMode=Y&reuse=YH";
}

doButtonCase['btEDMSAttach'] = function (oBtn, oVar) {// EDMS 첨부--미구현
    var szURL = document.location.protocol + "//" + "172.20.2.152/KPlusWebMaeil/Medison/Cabinet/FindKnowledge.aspx"; CoviWindow(szURL, '', '800', '600', 'resize');
}

doButtonCase['btReceiptView'] = function (oBtn, oVar) {// 수신현황조회
    oVar.iHeight = 473; oVar.iWidth = 840;
    oVar.sSize = "scrollbars=no";
    
    oVar.sUrl = "goReceiptReadListPage.do?ParentProcessID=" + getInfo("ProcessInfo.ProcessID") + "&ProcessID=" + getInfo("ProcessInfo.ProcessID") + "&FormInstID=" + getInfo("FormInstanceInfo.FormInstID"); // +
																																																				// "&getInfoValue="
																																																				// +
																																																				// getInfoValue;
}

doButtonCase['btForward'] = function (oBtn, oVar) {// 문서전달
    // window.open의 경우 예외 처리
    if (openMode == "L" || openMode == "P") {
        Common.Confirm(coviDic.dicMap.msg_apv_197, "Confirmation Dialog", function (result) {		// gMessage197
            if (result) {
                if ((getInfo("Request.loct") == "REDRAFT") && (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT")) { m_sAddList = 'chargegroup'; } else { m_sAddList = 'charge'; } addList(m_sAddList);
            }
            else {

            }
        });
    } else {
    	if(CFN_GetQueryString("isMobile") != "Y" && !_mobile){
	        Common.Confirm(coviDic.dicMap.msg_apv_197, "Confirmation Dialog", function (result) {		// gMessage197
	            if (result) {
	                if ((getInfo("Request.loct") == "REDRAFT") && (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT")) { m_sAddList = 'chargegroup'; } else { m_sAddList = 'charge'; }
	                document.getElementById("ACTIONINDEX").value = "FORWARD";
	                Open_Forward(m_sAddList);
	            }
	            else {
	
	            }
	        });
    	} else {
    		if(confirm(mobile_comm_getDic("msg_apv_197"))) {
    			if ((getInfo("Request.loct") == "REDRAFT") && (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT")) { m_sAddList = 'chargegroup'; } else { m_sAddList = 'charge'; }
                document.getElementById("ACTIONINDEX").value = "FORWARD";
                mobile_approval_openOrg(m_sAddList);
    		}
    	}
    }
}

doButtonCase['btApproved'] = function (oBtn, oVar) {// 승인
    m_sReqMode = "APPROVE";
    
    if(getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBAPPROVAL" || getInfo("Request.mode") == "RECAPPROVAL")
    	document.getElementById("ACTIONINDEX").value = "APPROVAL";		// "approve";
	else if(getInfo("Request.mode") == "PCONSULT")
		document.getElementById("ACTIONINDEX").value = "AGREE";
    
    if(CFN_GetQueryString("isMobile") != "Y"){
	    if (evaluateForm()) {
	    	var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 549, "resize");
	    	
	    	var commonWritePopupOnload = function(){
	    		commonWritePopup.$("input#commentOK").click(function(){
			    	if(commentPopupReturnValue){
			    		requestProcess("APPROVE");
			    	}
			    });
	    	};
	    	
	    	var pollTimer = window.setInterval(function() {
	    	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
	    	        window.clearInterval(pollTimer);
	    	        commonWritePopupOnload();
	    	    }
	    	}, 200);
	    }
	}else{
        requestProcess("APPROVE");
	}
}

doButtonCase['btReject'] = function (oBtn, oVar) {// 반려
	if(getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT")
		m_sReqMode = "CHARGE";
	else
		m_sReqMode = "APPROVE";
    
	if(getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT" || getInfo("Request.mode") == "SUBAPPROVAL" || getInfo("Request.mode") == "RECAPPROVAL")
    	document.getElementById("ACTIONINDEX").value = "REJECT";		 // "reject";
	else if(getInfo("Request.mode") == "PCONSULT")
		document.getElementById("ACTIONINDEX").value = "DISAGREE";
    
    if(CFN_GetQueryString("isMobile") != "Y"){
	    if (evaluateForm()) {
	    	var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 549, "resize");
	    	
	    	var commonWritePopupOnload = function(){
	    		commonWritePopup.$("input#commentOK").click(function(){
	    			if(commentPopupReturnValue){
	    				requestProcess("APPROVE");
	    		    }
	    	    });
	    	};
	    	
	    	var pollTimer = window.setInterval(function() {
	    	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
	    	        window.clearInterval(pollTimer);
	    	        commonWritePopupOnload();
	    	    }
	    	}, 200);
	    }
    }else{
    	requestProcess("APPROVE");
    }
    // 반려
}

// 대성, 최종결재자 사전승인
doButtonCase['btApprovedLast'] = function (oBtn, oVar) {// 승인
	m_sReqMode = "APPROVAL";

	var m_evalJSON_tmp = $.parseJSON(document.getElementById("APVLIST").value);
    var elmRoot = $(m_evalJSON_tmp).find("steps");
    m_ApvPersonObj = $$(elmRoot).find("division>step>ou>person").has("taskinfo[status='pending'], taskinfo[status='inactive']");
	
    m_ApvPersonCnt = m_ApvPersonObj.length - 1;
	
    var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 549, "resize");
	
	var commonWritePopupOnload = function(){
		commonWritePopup.$("input#commentOK").click(function(){
	    	if(commentPopupReturnValue){
	    		autoAllApproved();
	    	}
	    });
	};
	
	var pollTimer = window.setInterval(function() {
	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
	        window.clearInterval(pollTimer);
	        commonWritePopupOnload();
	    }
	}, 200);
}

doButtonCase['btRejectLast'] = function (oBtn, oVar) {// 반려
	m_sReqMode = "REJECT";
	
	// 선반려의 경우, 최종결재자 이전은 승인, 최종결재자는 반려처리한다.
	var m_evalJSON_tmp = $.parseJSON(document.getElementById("APVLIST").value);
    var elmRoot = $(m_evalJSON_tmp).find("steps");
    m_ApvPersonObj = $$(elmRoot).find("division>step>ou>person").has("taskinfo[status='pending'], taskinfo[status='inactive']");
	
    m_ApvPersonCnt = m_ApvPersonObj.length - 1;
    
    var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 549, "resize");
	
	var commonWritePopupOnload = function(){
		commonWritePopup.$("input#commentOK").click(function(){
	    	if(commentPopupReturnValue){
	    		autoAllApproved();
	    	}
	    });
	};
	
	var pollTimer = window.setInterval(function() {
	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
	        window.clearInterval(pollTimer);
	        commonWritePopupOnload();
	    }
	}, 200);
}

doButtonCase['btHold'] = function (oBtn, oVar) {// 보류
    m_sReqMode = "RESERVE";
    document.getElementById("ACTIONINDEX").value = "RESERVE";	// "reserve";
    if(CFN_GetQueryString("isMobile") != "Y"){
		var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 349, "resize");
		
		var commonWritePopupOnload = function(){
			commonWritePopup.$("input#commentOK").click(function(){
				if(commentPopupReturnValue){
					// requestProcess("RESERVE");
					requestProcessReserve();
			    }
		    });
		};
		
		var pollTimer = window.setInterval(function() {
		    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
		        window.clearInterval(pollTimer);
		        commonWritePopupOnload();
		    }
		}, 200);
    } else {
		requestProcessReserve();    	
    }
}

doButtonCase['btRejectedto'] = function (oBtn, oVar) {// 지정반송
    m_sReqMode = "APPROVE";
    document.getElementById("ACTIONINDEX").value = "REJECTTO"; // "rejectedto";
    // 지정반송가능여부 체크 if (fn_checkrejectedtoA())
    if (evaluateForm()) {
    	var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 543, "resize");
    	
    	var commonWritePopupOnload = function(){
    		commonWritePopup.$("input#commentOK").click(function(){
    			if(commentPopupReturnValue){
    				requestProcess("APPROVE");
    		    }
    	    });
    	};
    	
    	var pollTimer = window.setInterval(function() {
    	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
    	        window.clearInterval(pollTimer);
    	        commonWritePopupOnload();
    	    }
    	}, 200);
    } else {
        document.getElementById("ACTIONINDEX").value = "";
    }
}

/*
 * 재기안회수 버튼 비사용 doButtonCase['btRedraftWithdraw'] = function (oBtn, oVar) { var
 * sNextWiid = "";
 * 
 * var connectionname = "INST_ConnectionString"; var pXML =
 * "dbo.usp_wf_getworkitemRedraftWithdraw"; var aXML = "<param><name>PROCESS_ID</name><type>varchar</type><length>50</length><value><![CDATA[" +
 * getInfo("ProcessInfo.ProcessID") + "]]></value></param>"; aXML += "<param><name>WORKITEM_ID</name><type>varchar</type><length>50</length><value><![CDATA[" +
 * getInfo("Request.workitemID") + "]]></value></param>"; var sXML = "<Items><connectionname>" +
 * connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" +
 * pXML + "]]></sql><type>sp</type>" + aXML + "</Items>"; var szURL =
 * "../GetXMLQuery.aspx"; CFN_CallAjax(szURL, sXML, function (data) { var
 * xmlReturn = data; var errorNode = $(xmlReturn).find("error"); if
 * (errorNode.length > 0) { Common.Error("Desc: " + $(errorNode).text()); } else {
 * var sWI_ID_COUNT = $(xmlReturn).find("Table").find("WI_ID_COUNT").text(); var
 * sPF_SUB_KIND = $(xmlReturn).find("Table1").find("PF_SUB_KIND").text(); if
 * (sWI_ID_COUNT == "0" && sPF_SUB_KIND == "T000") sNextWiid =
 * $(xmlReturn).find("Table1").find("WI_ID").text(); } }, false, "xml"); if
 * (sNextWiid != "") setInfo("Request.workitemID", sNextWiid); m_sReqMode =
 * "APPROVE"; if (evaluateForm()) { document.getElementById("ACTIONINDEX").value =
 * "rejectedtodept"; oVar.iHeight = 230; oVar.iWidth = 500; oVar.sUrl =
 * "/WebSite/Approval/ApvProcess/ApvActBasic.aspx"; } }
 */

doButtonCase['btRejectedtoDept'] = function (oBtn, oVar) {// 부서 내 반송(수신함으로)
	m_sReqMode = "APPROVE";
    document.getElementById("ACTIONINDEX").value = "REJECTTODEPT"; // "rejectedtodept";
    
    if (evaluateForm()) {
    	var commonWritePopup = CFN_OpenWindow("CommentWrite.do", "", 540, 549, "resize");
    	
    	var commonWritePopupOnload = function(){
    		commonWritePopup.$("input#commentOK").click(function(){
    			if(commentPopupReturnValue){
    				requestProcess("APPROVE");
    		    }
    	    });
    	};
    	
    	var pollTimer = window.setInterval(function() {
    	    if (commonWritePopup.document.getElementById("commentOK") != null || commonWritePopup.document.getElementById("commentOK") != undefined) {
    	        window.clearInterval(pollTimer);
    	        commonWritePopupOnload();
    	    }
    	}, 200);
    } else {
        document.getElementById("ACTIONINDEX").value = "";
    }
}

/* 추가의견 */
doButtonCase['btComment'] = function (oBtn, oVar) {
	CFN_OpenWindow("CommentWrite.do?reqType="+"completeComment", "", 540, 549, "resize");
}

doButtonCase['btCommentView'] = function (oBtn, oVar) {
    oVar.iHeight = 617; oVar.iWidth = 540;
    $("#btCommentView").attr("class", "");
    oVar.sUrl = "goCommentViewPage.do";
    /*
	 * feedback 비사용 //feedback추가2010.12 if (getInfo("feedback") == "1") {
	 * oVar.sUrl += "&feedback=" + getInfo("feedback"); }
	 */
}

doButtonCase['btCirculate_View'] = function (oBtn, oVar) {
    oVar.iHeight = 473; oVar.iWidth = 1040;
    oVar.sUrl = "goCirculationReadListPage.do?FormInstID=" + getInfo("FormInstanceInfo.FormInstID") + "&bstored=true";
}

// PC저장 차후수행
doButtonCase['btPcSave'] = function (oBtn, oVar) {
	return PcSave(oVar, false);
//	
// // 양식 특정함수 포함된 내역 빼기
// bDisplayOnly = true;
// bPresenceView = false;
// initApvList();
//
// printDiv = getBodyHTML("PcSave");
// /*
// * if (!_ie) { oVar.iWidth = 1000; oVar.iHeight = 700; } else { oVar.iWidth =
// * 100; oVar.iHeight = 100; }
// */
// if (IsWideOpenFormCheck(getInfo("FormInfo.FormPrefix")) == true) {
// oVar.iWidth = 1070;
// } else {
// oVar.iWidth = 790;
// }
// oVar.iHeight = 350;
//
// var fileName = getInfo("FormInstanceInfo.Subject");
//
// if (fileName == "") {
// fileName = getInfo("FormInfo.FormName");
// } else {
// fileName += "_" + getInfo("FormInstanceInfo.DocNo");
// }
//
// oVar.sUrl = "form/PrintPdf.do?filename=" + encodeURIComponent(fileName)
// + "&fiid=" + getInfo("FormInstanceInfo.FormInstID");
//
// // 다시 올려주기
// bDisplayOnly = false;
// bPresenceView = true;
// initApvList();
    
    // return PcSave(false);
}

/*
 * 기안취소(관리자) 비사용 doButtonCase['btAdminAbort'] = function (oBtn, oVar) {//관리자
 * 강제기안취소200808 requestProcess("WITHDRAW"); }
 */

/*
 * 문서삭제 버튼 비사용 doButtonCase['btDeleteDoc'] = function (oBtn, oVar) {//문서삭제200808
 * requestProcess("DELETEDOC"); }
 */

doButtonCase['btForcedConsent'] = function (oBtn, oVar) {// 강제합의200808
    Common.Confirm(gMessage77, "Confirmation Dialog", function (result) {
        if (result) {
            forcedConsent();
        } else {
            return;
        }
    });
}

doButtonCase['btCSR'] = function (oBtn, oVar) {	 // 우리투자증권 CSR요청서 검토의견입력 버튼 :
													// 2008.09.26 백승찬 대리
    document.getElementById("bodycontext_review").style.display = "";
}


/*
 * 합의부서삭제 버튼 비사용 doButtonCase['btDCooRemove'] = function (oBtn, oVar) {//합의부서 삭제
 * oVar.iHeight = 275 - 34; oVar.iWidth = 294; oVar.sUrl =
 * "/WebSite/Approval/ApvProcess/selectOUs.aspx"; }
 */

/*
 * 대외공문 기안시 미리보기 버튼 비사용 doButtonCase['btOTransPV'] = function (oBtn, oVar) {
 * //대외공문 미리 보기 oVar.sSize = "fix"; oVar.iWidth = 790; //가로양식 if
 * (IsWideOpenFormCheck(getInfo("FormInfo.FormPrefix"))) { oVar.iWidth = 1070; }
 * oVar.iHeight = window.screen.height - 82; //oVar.sUrl="PreView.aspx";
 * oVar.sUrl = String(document.location.href); oVar.sUrl =
 * oVar.sUrl.replace("FormWrite", "Form"); //바닥 작성창에서 Open할 경우 if
 * (oVar.sUrl.lastIndexOf("#") == (oVar.sUrl.length - 1)) { oVar.sUrl =
 * oVar.sUrl.substring(0, oVar.sUrl.lastIndexOf("#")); } //url에 #이 포함되어 있음 제거처리
 * oVar.sUrl = oVar.sUrl + "&Readtype=Pubpreview"; }
 */

/*
 * 대외공문 메일발송 버튼 비사용 doButtonCase['btOTransMail'] = function (oBtn, oVar) {
 * //다음다이렉트 특수기능 대외공문 완료시 메일 발송 --> 일반메일 보내기로 변경 대외공문 포맷으로 변경작업 필요
 * oVar.m_evalXML = $.parseXML(document.getElementById("APVLIST").value);
 * m_oFormEditor.bFileView = false; m_oFormEditor.bPresenceView = false;
 * m_oFormEditor.sCommentHtml = ""; m_oFormEditor.bCommentViewFirst = true;
 * displayApvList(oVar.m_evalXML); //첨부파일 경로 넣어주기 Igate 양식 첨부파일 display 살리기 var
 * beforeStyle = ""; var eTR =
 * document.getElementById("DocLinkInfo").parentElement; while (eTR.tagName !=
 * "TABLE") { eTR = eTR.parentElement; }
 * 
 * G_displaySpnAttInfo_Mail(); G_displaySpnDocLinkInfo_Mail(); var beforeStyle =
 * eTR.style.display; eTR.style.display = "none";
 * document.getElementById("AppLine").parentElement.parentElement.style.display =
 * "none";
 * document.getElementById("tdforminfo").parentElement.parentElement.style.display =
 * "none";
 * 
 * sMailBody = "<style>"; try { for (var i = 0; i <
 * document.styleSheets.length; i++) { sMailBody +=
 * getStyle(document.styleSheets[i].href); } } catch (e) { } sMailBody += "</style>";
 * sMailBody += "<P>&nbsp;</P><P>&nbsp;</P><BR/>" +
 * document.getElementById("bodytable").innerHTML; eTR.style.display =
 * beforeStyle; m_oFormEditor.bPresenceView = false; //true;
 * m_oFormEditor.bFileView = true; m_oFormEditor.sCommentHtml = "";
 * m_oFormEditor.bCommentViewFirst = true; displayApvList(oVar.m_evalXML);
 * m_oFormEditor.G_displaySpnAttInfo(false);
 * m_oFormEditor.G_displaySpnDocLinkInfo();
 * document.getElementById("AppLine").parentElement.parentElement.style.display =
 * "";
 * document.getElementById("tdforminfo").parentElement.parentElement.style.display =
 * ""; sendMail(); }
 */

doButtonCase['btMailSend'] = function(oBtn, oVar) {
	// SendMailInBody(); // 2013.12.26 메일보내기 추가
	PcSave(oVar, true);
	CallBackSendMailInBody();
}


/*
 * feedback 비사용 //추가 의견 안내 메일 발송으로 인한 수정 2006.09 sunny
 * doButtonCase['btCommentFeedback'] = function (oBtn, oVar) {//Feedback의견 var
 * sKind = "feedback";
 * 
 * oVar.iHeight = 260; oVar.iWidth = 600; oVar.sUrl =
 * "../Comment/comment_feedback.aspx?piid=" + getInfo("ProcessInfo.ProcessID") +
 * "&form_inst_id=" + getInfo("FormInstanceInfo.FormInstID") + "&user_id=" +
 * getInfo("AppInfo.usid") + "&kind=" + sKind + "&mode=" +
 * getInfo("Request.mode") + "&user_name=" + escape(getInfo("AppInfo.usnm")); }
 */

doButtonCase['btShared'] = function (oBtn, oVar) {  // 참조 확인 버튼 Event
    fnShared();
}
/*
 * 직인 기능 비사용 직인관련 버튼 액션 추가 // doButtonCase['btDeptAdd'] = function (oBtn, oVar)
 * {// 대외 수신처 필요없을듯 하여 일단 주석처리합니다. // oVar.iWidth = 900; oVar.iHeight = 620; //
 * oVar.sUrl = "/COVINet/COVIFlowNetGov/GovAddress/ApvRdptListMgr.htm"; //
 * break; doButtonCase['btStampSelect'] = function (oBtn, oVar) {//직인선택 var
 * strSelectedStampInfo = "";
 * 
 * strSelectedStampInfo = popupGovStampSelectList(); strSelectedStampInfo =
 * strSelectedStampInfo.split(";");
 * 
 * document.getElementById("StampID").value = strSelectedStampInfo[0]; //StampID }
 * 
 * doButtonCase['btStampInsert'] = function (oBtn, oVar) {//직인삽입 //debugger; var
 * iGovStampCount = parseInt(getInfo("GovStampCount")); var strStampSrc =
 * getInfo("GovStampSrc");
 * 
 * if (iGovStampCount == 0) { //직인이 없으면 알림 alert("직인이 등록되지 않았습니다."); } else { if
 * (confirm("직인을 포함하시겠습니까?")) { if (strStampSrc != undefined && strStampSrc !=
 * "") { //직인이 있으면 본문에 이미지 삽입 m_oFormEditor.document.getElementById("seal").src =
 * "/COVINet/BackStorage/Stamp/" + strStampSrc;
 * m_oFormEditor.document.getElementById("seal").style.display = "";
 * document.getElementById("btStampRemoved").style.display = ""; } } else {
 * m_oFormEditor.document.getElementById("seal").src = "";
 * m_oFormEditor.document.getElementById("seal").style.display = "none";
 * document.getElementById("btStampRemoved").style.display = "none"; } } if
 * (getInfo("GovReceiver") != "") { //전자문서 수신처가 있을때만 전자문서 발송버튼 보이기
 * document.getElementById("btGovSend").style.display = ""; }
 * document.getElementById("btPrint").style.display = ""; //인쇄 버튼 활성화 }
 * 
 * doButtonCase['btStampRemove'] = function (oBtn, oVar) {//직인삭제
 * m_oFormEditor.document.getElementById("seal").src = "";
 * m_oFormEditor.document.getElementById("seal").style.display = "none";
 * document.getElementById("btGovSend").style.display = "none";
 * document.getElementById("btPrint").style.display = "none"; //인쇄 버튼 비활성화
 * document.getElementById("btGovStampRemove").style.display = "none"; }
 */

doButtonCase['btApproverChangeReview'] = function (oBtn, oVar) {// btApproverChangeReview
    m_sAddList = 'ChangeReview';
    Open_Forward(m_sAddList);
}

/*
 * 대결자로 지정 비사용 doButtonCase['btApproverChangeDeputy'] = function (oBtn, oVar)
 * {//2013.07 메리츠 yu2mi btApproverChangeDeputy oVar.iHeight = 300; oVar.iWidth =
 * 400; oVar.sUrl = "/WebSite/Approval/Custom/ChangeList.aspx?piid=" +
 * getInfo("ProcessInfo.ProcessID") + "&form_inst_id=" +
 * getInfo("FormInstanceInfo.FormInstID"); }
 */

doButtonCase['btPreList'] = function (oBtn, oVar) {
    fnGoPreNextList('btPreList');
}

doButtonCase['btNextList'] = function (oBtn, oVar) {
    fnGoPreNextList('btNextList');
}

doButtonCase['btDocListSave'] = function (oBtn, oVar) {// 문서대장 저장
    if (document.getElementById("Subject").value == "") {
        var subject = CFN_GetDicInfo(getInfo("AppInfo.usnm")) + " - " + CFN_GetDicInfo(getInfo("FormInfo.FormName"));
        document.getElementById("Subject").value = subject;
    }
    // 첨부파일 처리
    if (XFN_FileUpload() == false)
        return;

    m_sReqMode = "DOCLISTSAVE";
    requestProcess("DOCLISTSAVE");
}

// 보존년한 변경
doButtonCase['btPreserveDateUpdate'] = function (oBtn, oVar) {
    var iHeight = 250;
    var iWidth = 50;
    var sSize = 'noresize';
    var sUrl = "/WebSite/Approval/Forms/PreserveDateUpdate.aspx";

    CFN_OpenWindow(sUrl, "PreserveDate", iWidth, iHeight, sSize);
}

doButtonCase['btExitPreView'] = function (oBtn, oVar) {  // 기존 미리보기 창의
															// top.colose 에서 레이어
															// 팝업 or 윈도우 팝업을 구분
															// 하여 닫기
    if (CFN_GetQueryString("openID") == getInfo("FormInfo.FormID") || (CFN_GetQueryString("editMode") == 'Y') && CFN_GetQueryString("CFN_OpenWindowName") == 'undefined') {
        var openName = CFN_GetQueryString("openID");
        parent.Common.Close("DivPop_" + openName);
    } else {
        window.close();
    }
}

doButtonCase['btnRuleApv'] = function (oBtn, oVar) {  //
    oVar.iHeight = 400; oVar.iWidth = 1000;
    oVar.sUrl = "/approval/getApprovalLinePopup.do";
}

doButtonCase['btOTrans2'] = function (oBtn, oVar) {
    oVar.sUrl = String(document.location.href);
    oVar.sUrl = oVar.sUrl.replace("FormWrite", "Form"); // 바닥 작성창에서 Open할 경우
    if (oVar.sUrl.lastIndexOf("#") == (oVar.sUrl.length - 1)) { oVar.sUrl = oVar.sUrl.substring(0, oVar.sUrl.lastIndexOf("#")); } // url에
																																	// #이
																																	// 포함되어
																																	// 있음
																																	// 제거처리
	
    oVar.sSize = "fix";
    oVar.iWidth = 790;
	
    oVar.iHeight = window.screen.height - 82; 
	
    oVar.sUrl = oVar.sUrl + "&ReadType=Print&editMode=P";
	
    m_CmtBln = true;
    bPresenceView = true;
    // displayApvLine(oVar.m_evalXML);
}

doButtonCase['btGovRecDept'] = function (oBtn, oVar) {// 대외수신처관리
    /*
	 * oVar.iHeight = 643; oVar.iWidth = 1019; oVar.sUrl =
	 * "/WebSite/Approval/GovDocs/GovAddress/ApvDeployMgr.aspx?itemnum=999";
	 */
	alert("추후 개발 예정입니다.");
}

doButtonCase['btEvidPreview'] = function (oBtn, oVar) {
	// e-Accounting 증빙 미리보기 영역 show/hide
	evidPreviewEAccount();
}

/*-----------------------------------------------------------
 분기 함수 <끝> : KJW : 2014.04.23 : XFORM PRJ.
-------------------------------------------------------------*/

function Open_Forward(sMode) {
    var sCallType = "B1"; // B1:사용자 선택(3열-1명만),C1:그룹 선택(3열-1개만)
    var sTarget = "U"; // U:사용자,D:부서
    switch (sMode) {
        case "charge": sCallType = "B1"; break;
        case "chargegroup": sCallType = "C1"; sTarget = "D"; break;
        case "ChangeReview": sCallType = "B1"; break;

        default: break;
    }
    if (openMode == "L") {
    	parent._CallBackMethod2 = OrgMap_CallBack_Form;
    	parent.Common.open("","orgmap_pop","<spring:message code='Cache.lbl_DeptOrgMap'/>","/covicore/control/goOrgChart.do?callBackFunc=_CallBackMethod2&szObject=&type="+sCallType+"&setParamData=_setParamdata","1060px","580px","iframe",true,null,null,true); 
    } else {
    	_CallBackMethod2 = OrgMap_CallBack_Form;
    	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=_CallBackMethod2&szObject=&type="+sCallType+"&setParamData=_setParamdata", "", "1060px", "580px");
    }
}
/*
 * CoviWindow(fileName,windowName,theWidth,theHeight,etcParam) moved to
 * form.refactor.deleted.js by KJW : 2014.04.22 : : XFORM PRJ.
 */

// 결재선변경
function changeApvList() {
    try {
        requestProcess("CHANGEAPV");
    } catch (e) {
        alert("Error number: " + e.number);
    }
}
// 강제합의
function forcedConsent() {
    try {
        requestProcess("FORCEDCONSENT");
    } catch (e) {
        alert("Error number: " + e.number);
    }
}
function changeFormdata() {
	var jsonObj = {};
    var formJsonObj = getChangeFormJSON();
    
    $.extend(jsonObj, makeNode("actionMode", ""));
    $.extend(jsonObj, makeNode("actionComment", ""));
    $.extend(jsonObj, makeNode("adminType", "ADMIN"));
    $.extend(jsonObj, getDefaultJSON());
    $.extend(jsonObj, formJsonObj);

    var formData = new FormData();
    // 양식 기안 및 승인 정보
    formData.append("formObj", JSON.stringify(jsonObj));
    
    // 파일정보
    for (var i = 0; i < l_aObjFileList.length; i++) {
    	// alert(typeof l_aObjFileList[i]);
        if (typeof l_aObjFileList[i] == 'object') {
            formData.append("fileData[]", l_aObjFileList[i]);
        }
    }
    
    try {
    	$.ajax({
    		url:"draft.do",
    		data: formData,
    		type:"post",
    		dataType : 'json',
    		processData : false,
	        contentType : false,
    		success:function (res) {
    			if(res.status == "SUCCESS")
    				Common.Inform(coviDic.dicMap.msg_apv_DeonModify, "Information", function(){
    					Common.Close();
    					opener.CoviMenu_GetContent(opener.location.href.replace(opener.location.origin, ""),false);	// opener.location.reload();
    				});
    		},
    		error:function(response, status, error){
				CFN_ErrorAjax("draft.do", response, status, error);
			}
    	});
    } catch (e) {
        Common.Error(e.message);
    }
}

function addList(sMode) {
    var sCallType = "B1";
    switch (sMode) {
        case "charge": sCallType = "B1"; break;
        case "chargegroup": sCallType = "C1"; break;
        default: sCallType = "C1"; break;
    }

    // 공통 조직도로 변경 XFN_OrgMapShowApproval(PORTAL) => XFN_OrgMapShow(APPROVAL)

    if (openID != "") {
        parent.XFN_OrgMapShow("btn_PAdtForm", "DivLayerForm", "txtItem", openID, "OrgMap_CallBack_Form", sCallType, "Y", "Y", "U", "Approval", "", "");
    } else {
        XFN_OrgMapShow_WindowOpen("btn_PAdtForm", "DivLayerForm", "txtItem", "div_setwfschema", "OrgMap_CallBack_Form", sCallType, "Y", "Y", "U", "Approval", "", "");
    }


}

function OrgMap_CallBack_Form(pStrItemInfo) {
    var oJSON = $.parseJSON(pStrItemInfo);
    insertToList(oJSON);
}

function insertToList(oList) {
    if (m_sAddList == 'receive') {
        var aRecDept = document.getElementById("RecDeptList").value.split("@");
        aRecDept[document.getElementById("iBody").selectedIndex] = JSON.stringify(oList);	 // CFN_XmlToString(oList);
																								// //(new
																								// XMLSerializer()).serializeToString(oList);
        var sRecDept = "";
        for (var i = 0; i < aRecDept.length; i++) { sRecDept += '@' + aRecDept[i]; }
        if (sRecDept.length > 1) sRecDept = sRecDept.substring(1);
        document.getElementById("RecDeptList").value = sRecDept;
        document.getElementById("ReceiveNames").value = document.getElementById("RecDeptList").value;
        var m_oRecList = $.parseJSON(aRecDept[document.getElementById("iBody").selectedIndex]);
        setInlineRecList(m_oRecList);

        document.getElementById("ReceiptList").value = m_oFormEditor.DeCodeRecList(document.getElementById("RecDeptList").value);
        m_bFrmExtDirty = true;
    } else if (m_sAddList == 'charge' || m_sAddList == 'chargegroup') {
        var m_oChargeList = oList;
        var elmRoot = $$(m_oChargeList);
        var elmlist = $$(m_oChargeList).find("item");
        if (elmlist.length == 0) {
            Common.Inform(coviDic.dicMap.msg_apv_054); // '담당자를 지정하십시요.'
            return false;
        } else if (elmlist.length > 1) {
        	Common.Inform(coviDic.dicMap.msg_apv_055); // "담당업무는 1개만 지정 가능 합니다.
														// \n담당업무를 다시 지정해 주십시요."
            return false;
        } else {
            try { document.getElementById("CHARGEID").value = $$(elmRoot).find("item").concat().eq(0).attr("AN"); } catch (e) { }
            try { document.getElementById("CHARGENAME").value = $$(elmRoot).find("item").concat().eq(0).attr("DN"); } catch (e) { }
            try { document.getElementById("CHARGEOUID").value = $$(elmRoot).find("item").concat().eq(0).attr("RG"); } catch (e) { }
            
            setForwardApvList(elmRoot);
            
            var actionKind = "";
            var changeApvLineObj = getChangeFormJSON();
            if($$(changeApvLineObj).attr("ChangeApprovalLine") != "" && $$(changeApvLineObj).attr("ChangeApprovalLine") != undefined){
            	if((getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "SUBREDRAFT") && document.getElementById("ACTIONINDEX").value == "CHARGE"){
            		actionKind = "CHARGE";
            	}else{
            		actionKind = "FORWARD";
            	}
            }else{
            	actionKind = "CHARGE";
            }
            	
            var confirmMessage = CFN_GetDicInfo(document.getElementById("CHARGENAME").value) + " " + coviDic.dicMap.msg_apv_ChargeConfirm; // "
																																			// 담당자로
																																			// 지정
																																			// 하시겠습니까?";
																																			// //
            if(CFN_GetQueryString("isMobile") == "Y" || _mobile) {
            	if(confirm(confirmMessage)) 
            		requestProcess(actionKind);
            } else {
	            Common.Confirm(confirmMessage, "Confirmation Dialog", function (result) {
	                if (result) {
	                    requestProcess(actionKind);
	                }
	            });
            }
        }
    } else if (m_sAddList == 'ChangeReview') {
        var elmRoot = $$(oList).find("items");
        var elmlist = $$(elmRoot).find("item");
        if (elmlist.length == 0) {
        	Common.Inform(coviDic.dicMap.msg_apv_changereview_01); // '선택한 사람이
																	// 없습니다.'
            return false;
        } else {
            try { document.getElementById("CHANGEREVIEWXML").value = JSON.stringify(elmRoot[0]) } catch (e) { }

            setForwardApvList(elmRoot);

            var confirmMessage = coviDic.dicMap.msg_apv_changereview_02; // "원
																			// 결재자를
																			// 후결로
																			// 추가
																			// 하시겠습니까?";
																			// //
            Common.Confirm(confirmMessage, "Confirmation Dialog", function (result) {
                m_bTempFlag = result;
                requestProcess('CHANGEREVIEW');
            });
        }
    } else if (m_sAddList == 'request' || m_sAddList == 'study') {
        var m_oRequestList = oList;
        var elmRoot = $$(m_oRequestList).find("items");
        var elmlist = $$(elmRoot).find("item");
        if (elmlist.length == 0) {
        	Common.Inform(coviDic.dicMap.msg_apv_054); // '담당자를 지정하십시요.'
            return false;
        } else if (elmlist.length > 1) {
        	Common.Inform(coviDic.dicMap.msg_apv_055); // "담당업무는 1개만 지정 가능 합니다.
														// \n담당업무를 다시 지정해 주십시요."
            return false;
        } else { setRequestPersonInfo(elmRoot, false, m_sAddList); }
    }
}

function setFormInfoDictionary(elmList) {
    var elmnode;
    for (var i = 0; i < elmList.length; i++) {
        elmnode = elmList.nextNode();
        setInfo(elmnode.nodeName, elmnode.text);
    }
}

function getHasReceiveno() {
    var sRtn = "false";
    // 신청서-담당업무확정에 대해서는 수신대장 보관하지 않음
    if (getInfo("SchemaContext.scChgr.isUse") == "Y") { sRtn = "false"; } else { sRtn = "true"; }
    return sRtn;
}
var szformgubun = "";

function setDomainData() {
    /* 자동 결재선 처리, 서버에서 진행됨 */
	
	/* 서버에서 만든 자동결재선 데이터 가져오기 처리 */
	var data = {};
	if(getInfo("WorkedAutoApprovalLine") != undefined)
		var data = getInfo("WorkedAutoApprovalLine");
	/* 자동결재선 데이터를 파라미터로 넘김 */
	receiveApvHTTP(data);
}
function receiveApvHTTP(responseJSONdata) {
    if ($$(responseJSONdata) != null) {
        var errorNode = $$(responseJSONdata).find("error");
        if ($(errorNode).length > 0) {
            alert("Desc: " + errorNode.val());
        } else {
            var elmList = $$(responseJSONdata).find("steps");
            if (getInfo("Request.mode") == 'DRAFT' || getInfo("Request.mode") == "TEMPSAVE" || getInfo("Request.mode") == "REDRAFT" || (getInfo("Request.mode") == "SUBREDRAFT" && getInfo("SchemaContext.scRecAssist.isUse") == "Y")) {
                var oApvList = $.parseJSON(document.getElementById("APVLIST").value);
                if (oApvList == null) {
                    alert(gMessage75); // "결재선 지정 오류"
                } else {
                    m_bApvDirty = true;
                    var oGetApvList = {};
                    if ($$(responseJSONdata).find("steps").exist()) {
                        // 결재선 내 & 문자열로 인해 오류 발생으로 수정함
                        oGetApvList = $.parseJSON(responseJSONdata.replace(/&/gi, '&amp;'));
                    }
                    var oCurrentOUNode;
                    if (getInfo("Request.mode") == "REDRAFT") {
                        // 담당부서 - 담당부서 및 담당업무 결재선 삭제할것 그 후로 기안자 결재선 입력할것
                        /*
						 * oCurrentOUNode = $$(oApvList).find("steps >
						 * division:has(>taskinfo[status='pending'])[divisiontype='receive']");
						 */
                    	oCurrentOUNode = $$(oApvList).find("steps > division").children().find("[divisiontype='receive']").has(">taskinfo[status='pending']");
                        if (oCurrentOUNode == null) {
                        	var oDiv = {};
                        	$$(oDiv).attr("taskinfo", {});
                        	$$(oDiv).attr("step", {});
                        	$$(oDiv).attr("divisiontype", "receive");
                        	$$(oDiv).attr("name", coviDic.dicMap.lbl_apv_ChargeDept);
                            $$(oDiv).attr("oucode", getInfo("AppInfo.dpid_apv"));
                            $$(oDiv).attr("ouname", getInfo("AppInfo.dpdn_apv"));
                        	
                            $$(oDiv).find("taskinfo").attr("status", "pending");
                            $$(oDiv).find("taskinfo").attr("result", "pending");
                            $$(oDiv).find("taskinfo").attr("kind", "receive");
                            $$(oDiv).find("taskinfo").attr("datereceived", getInfo("AppInfo.svdt"));
                        	
                        	$$(oApvList).find("division").push(oDiv);
                        	
                            oCurrentOUNode = $$(oApvList).find("steps > division:has(>taskinfo[status='pending'])[divisiontype='receive']");
                        }
                        var oRecOUNode = $$(oCurrentOUNode).find("step").has("ou>taskinfo[status='pending']");	// $$(oCurrentOUNode).find("step:has(ou>taskinfo[status='pending'])");
                        if (oRecOUNode.length != 0 && $$(oRecOUNode).find("ou").hasChild("person").length == 0) $$(oCurrentOUNode).find("step").has("ou>taskinfo[status='pending']").remove();
                        /*
						 * var oChargeNode =
						 * $$(oCurrentOUNode).find("step:has(ou>person>taskinfo[status='pending'])");
						 */
                        var oChargeNode = $$(oCurrentOUNode).find("step").has("ou>person>taskinfo[status='pending']");

                        // 담당 수신자 대결
                        var isChkDeputy = false;

                        if (oChargeNode.length != 0) {
                            // 담당 수신자 대결 S
							// ----------------------------------------
                            var objDeputyOU = $$(oApvList).find("steps>division[divisiontype='receive']>step>ou");
                            var chkObjNode = $$(objDeputyOU).find("person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "' ]>taskinfo[status='pending'], role:has(person[code='" + getInfo("Request.userCode") + "'][code!='" + getInfo("AppInfo.usid") + "'])");

                            if (0 < chkObjNode.length) {
                                isChkDeputy = true;
                            }
                            // 담당 수신자 대결 E
							// -----------------------------------------
                        	
                            var oRecApprovalNode = $$(oCurrentOUNode).find("step>ou>person>taskinfo[status='inactive']");
                            if (oRecApprovalNode.length != 0) {
                            	for(var i=0; i<oRecApprovalNode.length; i++){
                            		var RecApprovalNode = oRecApprovalNode.concat().eq(i);
                            		oCurrentOUNode.concat().eq(0).remove(RecApprovalNode.parent().parent().parent());
                            	}
                            	
                                /*
								 * $$(oRecApprovalNode).each(function (i,
								 * RecApprovalNode) {
								 * oCurrentOUNode[0].removeChild(RecApprovalNode.parentNode.parentNode.parentNode);
								 * });
								 */
                            }

                            // person의 takinfo가 inactive가 있는 경우 routetype을 변경함
                            var nodesInactives = $$(oCurrentOUNode).find("step[routetype='receive']").has("ou > person > taskinfo[status='inactive']");

                            $$(nodesInactives).each(function (i, nodesInactive) {
                                $$(nodesInactive).attr("unittype", "person");
                                $$(nodesInactive).attr("routetype", "approve");
                                $$(nodesInactive).attr("name", coviDic.dicMap.lbl_apv_ChargeDept);	
                            });

                        }else{
                        	var oJFNode = $$(oCurrentOUNode).find("step").has("ou>role>taskinfo[status='pending'], ou>role>taskinfo[status='reserved']"); 
                            var bHold = false; // 201108 보류여부
                            var oComment = null;
                            if (oJFNode.length != 0) {
                                var oHoldTaskinfo = $$(oJFNode).find("ou>role>taskinfo[status='reserved']");
                                if (oHoldTaskinfo.length != 0) {
                                    bHold = true;
                                    oComment = $$(oHoldTaskinfo).find("comment").clone();
                                }
                                // $$(oCurrentOUNode).eq(0).remove($$(oJFNode).eq(0));
                                $$(oCurrentOUNode).eq(0).remove("step");
                            }

                            $$(oCurrentOUNode).attr("oucode", getInfo("AppInfo.dpid_apv"));
                            $$(oCurrentOUNode).attr("ouname", getInfo("AppInfo.dpdn_apv"));
                            
                            $$(oCurrentOUNode).find("taskinfo").attr("status", "pending");
                            $$(oCurrentOUNode).find("taskinfo").attr("result", "pending");
                            
                            var oStep = {};
                            var oOU = {};
                            var oPerson = {};
                            var oTaskinfo = {};

                            $$(oStep).attr("unittype", "person");
                            $$(oStep).attr("routetype", "approve");
                            $$(oStep).attr("name", coviDic.dicMap.lbl_apv_ChargeDept);
                            
                            $$(oOU).attr("code", getInfo("AppInfo.dpid_apv"));
                            $$(oOU).attr("name", getInfo("AppInfo.dpdn_apv"));
                            
                            $$(oPerson).attr("code", getInfo("AppInfo.usid"));
                            $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
                            $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                            $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                            $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
                            $$(oPerson).attr("oucode", getInfo("AppInfo.dpid"));
                            $$(oPerson).attr("ouname", getInfo("AppInfo.dpnm"));
                            $$(oPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
                            
                            $$(oTaskinfo).attr("status", (bHold == true ? "reserved" : "pending")); 
                            $$(oTaskinfo).attr("result", (bHold == true ? "reserved" : "pending")); 
                            $$(oTaskinfo).attr("kind", "charge");
                            $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                            if (bHold) $$(oTaskinfo).append(oComment); 
                            
                            $$(oPerson).append("taskinfo", oTaskinfo);
                            
                            $$(oOU).append("person", oPerson);
                            
                            $$(oStep).append("ou", oOU);
                            
                            $$(oCurrentOUNode).append("step", oStep);
                        }
                        
                        // 담당 수신자 대결 S
						// ---------------------------------------------
                        /*
						 * if (isChkDeputy) {
						 *  // [2015-05-28 modi] 현재 대결인 division에만 추가하도록
						 * //objDeputyOU = $(oApvList).find("steps >
						 * division[divisiontype='receive'] > step > ou");
						 * objDeputyOU = $(oApvList).find("steps >
						 * division:has(>taskinfo[status='pending']) > step >
						 * ou");
						 * 
						 * var objOriginalApprover = $(oChargeNode[0]).find('ou >
						 * person'); $(objOriginalApprover).attr('title',
						 * $(objOriginalApprover).attr('title').replace(/&/g,
						 * ';')); $(objOriginalApprover).attr('level',
						 * $(objOriginalApprover).attr('level').replace(/&/g,
						 * ';')); $(objOriginalApprover).attr('position',
						 * $(objOriginalApprover).attr('position').replace(/&/g,
						 * ';'));
						 * 
						 * $(objOriginalApprover).find('taskinfo').removeAttr('datereceived');
						 * $(objOriginalApprover).find('taskinfo').attr('kind',
						 * 'bypass');
						 * $(objOriginalApprover).find('taskinfo').attr('result',
						 * 'inactive');
						 * $(objOriginalApprover).find('taskinfo').attr('status',
						 * 'inactive');
						 * 
						 * $(objDeputyOU).append($(objOriginalApprover)); }
						 */
                        // 담당 수신자 대결 E
						// ----------------------------------------------

                        // 퇴직자 및 인사정보 최신 적용을 위해 추가 예외사항생기더라도 기안/재기안자 결재선 디스플레이
                        document.getElementById("APVLIST").value = JSON.stringify(oApvList);

                        var nodesAllItems;
                        nodesAllItems = $$(oGetApvList).find("steps > division").children().find("[divisiontype='receive']").has(">taskinfo[status='pending']").has("step");

                        // 퇴직자 체크 및 인사정보 체크
                        if ((getInfo("Request.mode") == "REDRAFT") && getInfo("SchemaContext.scPRecA.isUse") == "Y" && getInfo("SchemaContext.scPRecA.value") != "" && getInfo("Request.templatemode") == "Read") {		// 재기안시
																																																						// 수신결재자
																																																						// 자동
																																																						// 지정
                        	
                        	var sChgrPersonJSON = getInfo("SchemaContext.scPRecA.value");
                            var oCharPerson = $.parseJSON(sChgrPersonJSON);

                            var oStepR;
                            var oOUR;
                            var oPersonR;
                            var oTaskinfoR;

                            $$(oCharPerson).find("item").each(function (apvIdx, apvItem) {
                            	oStepR = {};
                                oOUR = {};
                                oPersonR = {};
                                oTaskinfoR = {};

                                $$(oStepR).attr("unittype", "person");
                                $$(oStepR).attr("routetype", "approve");
                                $$(oStepR).attr("name", "Normal");
                                
                                $$(oOUR).attr("code", $$(apvItem).attr("RG"));
                                $$(oOUR).attr("name", $$(apvItem).attr("RGNM"));
                                
                                $$(oPersonR).attr("code", $$(apvItem).attr("AN"));
                                $$(oPersonR).attr("name", $$(apvItem).attr("DN"));
                                $$(oPersonR).attr("position", $$(apvItem).attr("PO"));
                                $$(oPersonR).attr("title", $$(apvItem).attr("TL"));
                                $$(oPersonR).attr("level", $$(apvItem).attr("LV"));
                                $$(oPersonR).attr("oucode", $$(apvItem).attr("RG"));
                                $$(oPersonR).attr("ouname", $$(apvItem).attr("RGNM"));
                                $$(oPersonR).attr("sipaddress", $$(apvItem).attr("MSN_SipAddress"));
                                
                                $$(oTaskinfoR).attr("status", "inactive");
                                $$(oTaskinfoR).attr("result", "inactive");
                                $$(oTaskinfoR).attr("kind", $(apvItem).attr("type"));
                                
                                $$(oPersonR).append("taskinfo", oTaskinfoR);
                                
                                $$(oOUR).append("person", oPersonR);
                                
                                $$(oStepR).append("ou", oOUR);
                                
                                $$(oApvList).find("steps>division[divisiontype='receive']").has(">taskinfo[status='pending']").append("step", oStepR);
                            });

                        } /*
							 * 지정결재선 비사용 else if ((getInfo("Request.mode") ==
							 * "REDRAFT") &&
							 * getInfo("SchemaContext.scRCDTApvLine.isUse") ==
							 * "Y" &&
							 * getInfo("SchemaContext.scRCDTApvLine.value") !=
							 * "") {//재기안에서 문서를 열면서 담당부서자동결재선 적용여부 확인
							 * m_FixApvLineData =
							 * $$(responseJSONdata).find("response > item >
							 * signinform")[0]; oApvList =
							 * $.parseXML(setFixApvLineREDRAFT(oApvList,
							 * oCurrentOUNode)); }
							 */
                        else {
                            if (nodesAllItems.length > 0) {
                                var oSteps = $$(oGetApvList).find("steps");
                                var oCheckSteps = chkAbsent(oSteps);

                                if (oCheckSteps) {
                                    // 담당 대결자 체크 필요
                                    // 1. 중복으로 들어가는 문제 검토 필요 (주석 처리)
                                    // 2. chkAbsent(oSteps) 함수에서 퇴직자 정보 체크 한다 -
									// 아래 appendChild 확인 필요
                                    // 3. 담당수신자 지정 후 담당수신자를 대결 지정시 아래 로직을 거치면
									// 중복으로 결재자가 들어간다

                                    $$(oSteps).find("division").concat().has(">taskinfo[status='pending']").find("[divisiontype='receive'] > step[unittype='person']").has("ou>person>taskinfo[kind!='charge']").each(function (i, enodeItem) {
                                        $$(oApvList).find("division[divisiontype='receive']").append("step", enodeItem.json());
                                    });
                                }
                            }
                            if (nodesAllItems.length > 0) {
                                document.getElementById("btDeptDraft").style.display = "inline";
                            }
                        }
                    } else if (getInfo("Request.mode") == "SUBREDRAFT") {
                        oCurrentOUNode = $$(oApvList).find("steps>division").has(">taskinfo[status='pending']");
                        var oOU = $$(oCurrentOUNode).find("step>ou").has("[code='" + getInfo("AppInfo.dpid") + "']").has("taskinfo[status='pending']");

                        var oPerson = {};
                        var oTaskinfo = {};

                        $$(oPerson).attr("code", getInfo("AppInfo.usid"));
                        $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
                        $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                        $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                        $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
                        $$(oPerson).attr("oucode", getInfo("AppInfo.dpid"));
                        $$(oPerson).attr("ouname", getInfo("AppInfo.dpnm"));
                        $$(oPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
                        $$(oTaskinfo).attr("status", "inactive"); 
                        $$(oTaskinfo).attr("result", "inactive");
                        $$(oTaskinfo).attr("kind", "charge");
                        $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                        
                        $$(oPerson).append("taskinfo", oTaskinfo)
                        
                        $$(oOU).append("person", oPerson);
                    }else {
                        if (getInfo("Request.reuse") != "Y" && (CFN_GetQueryString("RequestFormInstID") == "" || CFN_GetQueryString("RequestFormInstID") == "undefined" )) {
                            if (getInfo("AppInfo.dpid") != getInfo("AppInfo.dpid_apv")) 
                            	$(oApvList).find("steps").attr("initiatoroucode", getInfo("AppInfo.dpid_apv"));
                            
                            var oSteps = {};
                            var oDiv = {};
                            var oDivTaskinfo = {};
                            var oStep = {};
                            var oOU = {};
                            var oPerson = {};
                            var oTaskinfo = {};
                            
                            $$(oDiv).attr("divisiontype", "send");
                            $$(oDiv).attr("name", coviDic.dicMap.lbl_apv_circulation_sent);
                            $$(oDiv).attr("oucode", getInfo("AppInfo.dpid_apv"));
                            $$(oDiv).attr("ouname", getInfo("AppInfo.dpdn_apv"));
                            
                            $$(oDivTaskinfo).attr("status", "inactive");
                            $$(oDivTaskinfo).attr("result", "inactive");
                            $$(oDivTaskinfo).attr("kind", "send");
                            $$(oDivTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                            
                            $$(oDiv).attr("taskinfo", oDivTaskinfo);
                            
                            $$(oStep).attr("unittype", "person");
                            $$(oStep).attr("routetype", "approve");
                            $$(oStep).attr("name", coviDic.dicMap.lbl_apv_writer);
                            
                            $$(oOU).attr("code", getInfo("AppInfo.dpid_apv"));
                            $$(oOU).attr("name", getInfo("AppInfo.dpdn_apv"));
                            
                            $$(oPerson).attr("code", getInfo("AppInfo.usid"));
                            $$(oPerson).attr("name", getInfo("AppInfo.usnm"));
                            $$(oPerson).attr("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                            $$(oPerson).attr("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                            $$(oPerson).attr("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
                            $$(oPerson).attr("oucode", getInfo("AppInfo.dpid"));
                            $$(oPerson).attr("ouname", getInfo("AppInfo.dpnm"));
                            $$(oPerson).attr("sipaddress", getInfo("AppInfo.ussip"));
                            
                            $$(oTaskinfo).attr("status", "inactive");
                            $$(oTaskinfo).attr("result", "inactive");
                            $$(oTaskinfo).attr("kind", "charge");
                            $$(oTaskinfo).attr("datereceived", getInfo("AppInfo.svdt"));
                            
                            $$(oPerson).attr("taskinfo", oTaskinfo);
                            
                            $$(oOU).attr("person", oPerson);
                            
                            $$(oStep).attr("ou", oOU);
                            
                            $$(oDiv).attr("step", oStep);
                            
                            $$(oSteps).attr("division", oDiv);
                            
                            oApvList = {"steps" : oSteps};
                            
                            $("#APVLIST").val(JSON.stringify(oApvList));
                        }
                        oCurrentOUNode = $$(oApvList).find("steps > division").has("taskinfo[status='inactive']").concat().eq(0);

                       /*
						 * 자동결재선(스키마) 비사용 //지정결재선을 사용하는 경우 결재선 생성을 달리함 if
						 * (getInfo("scCDTApvLine") == "1" &&
						 * getInfo("scCDTApvLineV") != "") { m_FixApvLineData =
						 * $(responseJSONdata).find("response > item >
						 * signinform")[0]; oApvList =
						 * $.parseXML(setFixApvLine(oApvList, oCurrentOUNode)); }
						 * else {
						 */
                        
                            /*
							 * // 합의를 사용하지 않는 기안에는 합의가 없음 // 개인결재선 -> 기본결재선(*)
							 * 정보 var sPath = "", sPathOU = ""; if
							 * (getInfo("SchemaContext.scPCoo.isUse") == "Y" ||
							 * getInfo("SchemaContext.scPCooPL.isUse") == "Y") {
							 * sPath = "or @routetype='assist'"; } if
							 * (getInfo("SchemaContext.scPAgr.isUse") == "Y" ||
							 * getInfo("SchemaContext.scPAgrSEQ.isUse") == "Y") {
							 * sPath = sPath + " or @routetype='consult'"; } if
							 * (getInfo("SchemaContext.scPAdt.isUse") == "Y") {
							 * sPath = sPath + " or @routetype='audit'"; }
							 * //개인감사 추가 if
							 * (getInfo("SchemaContext.scDAdt.isUse") == "Y") {
							 * sPathOU = sPathOU + " @routetype='audit'"; }
							 * //부서감사 추가 if
							 * (getInfo("SchemaContext.scDCoo.isUse") == "Y") {
							 * sPathOU += ((sPathOU != "") ? " or " : "") + "
							 * @routetype='assist'"; } //부서협조 추가 if
							 * (getInfo("SchemaContext.scDAgr.isUse") == "Y") {
							 * sPathOU += ((sPathOU != "") ? " or " : "") + "
							 * @routetype='consult'"; } //부서합의 추가
							 */

                            var nodesAllItems = $$(oGetApvList).find("steps>division[divisiontype='send']>step");
                            if (nodesAllItems.exist() > 0) {
                                var oSteps = $$(oGetApvList).find("steps").concat().eq(0);
                                // var oCheckSteps = true;//chkAbsent(oSteps);
                                var oCheckSteps = chkAbsent(oSteps);
                                if (oCheckSteps) {
                                    $$(oSteps).find("division[divisiontype='send']>step").has("[unittype='person'],[unittype='role'],[unittype='ou']").each(function (i, enodeItem) {
                                        $$(oApvList).find("division[divisiontype='send']").append("step", enodeItem.json());
                                    });
                                }
                            }
                            // 다시 확인
                            /*
							 * var nodesAllItems2 = $$(oGetApvList).find("steps >
							 * division[divisiontype='send'] > step"); if
							 * (nodesAllItems2.exist() > 0) { var oSteps =
							 * $$(oGetApvList).find("steps").concat().eq(0);
							 * $$(oSteps).find("division[divisiontype='send']>step[unittype='role']").each(function
							 * (i, enodeItem) {
							 * $$(oApvList).find("division[divisiontype='send']").append("step",
							 * enodeItem.json()); }); }
							 */

                            
                            // 부서장결재단계사용. 임시저장, 편집, 재사용시 진행하지 않음
                            if(getInfo("Request.mode") == "DRAFT" && getInfo("Request.reuse") != "Y"){
                            var nodesAllItems3 = $$(oGetApvList).find("steps > step[unittype='role']");
                            if (nodesAllItems3.length > 0) {
                                var oSteps = $$(oGetApvList).find("steps").concat().eq(0);
                                nodesAllItems3.each(function (i, enodeItem) {
                                    $$(oApvList).find("division[divisiontype='send']").append("step", enodeItem.json());
                                });
                            }
                            }

                            // 양식 결재선에 수신처.
                            if (getInfo("SchemaContext.scDRec.isUse") == "Y" || getInfo("SchemaContext.scPRec.isUse") == "Y") {
                                if (getInfo("SchemaContext.scPRec.value") != "") {
                                    var aScPRecV = getInfo("SchemaContext.scPRec.value").split("@@");
                                    var sChgrPersonJson = "";
                                    if (aScPRecV.length > 2) {
                                        sChgrPersonJson = aScPRecV[2];
                                    }
                                    var oCharPerson = $.parseJSON(sChgrPersonJson);
                                    
                                    var oDivR = {};
                                    var oDivTaskinfoR = {};
                                    var oStepR = {};
                                    var oOUR = {};
                                    var oPersonR = {};
                                    var oTaskinfoR = {};
                                    
                                    $$(oDivR).attr("divisiontype", "receive");
                                    $$(oDivR).attr("name", "담당결재");
                                    $$(oDivR).attr("oucode", $$(oCharPerson).find("item").concat().eq(0).attr("RG"));				// $$(oDivR).attr("oucode",
																																	// $$(oCharPerson).find("item>RG").concat().eq(0).text());
                                    $$(oDivR).attr("ouname", $$(oCharPerson).find("item").concat().eq(0).attr("RGNM"));		 // $$(oDivR).attr("ouname",
																																// $$(oCharPerson).find("item>RGNM").concat().eq(0).text());
                                    
                                    $$(oDivTaskinfoR).attr("status", "inactive");
                                    $$(oDivTaskinfoR).attr("result", "inactive");
                                    $$(oDivTaskinfoR).attr("kind", "receive");
                                    
                                    $$(oDivR).append("taskinfo", oDivTaskinfoR);
                                    
                                    $$(oStepR).attr("unittype", "person");
                                    $$(oStepR).attr("routetype", "receive");
                                    $$(oStepR).attr("name", "담당결재");
                                    
                                    // 공통 조직도 데이터 변경되면 수정 필요
                                    $$(oOUR).attr("code", $$(oCharPerson).find("item").concat().eq(0).attr("RG"));
                                    $$(oOUR).attr("name", $$(oCharPerson).find("item").concat().eq(0).attr("RGNM"));
                                    
                                    $$(oPersonR).attr("code", $$(oCharPerson).find("item").concat().eq(0).attr("AN"));
                                    $$(oPersonR).attr("name", $$(oCharPerson).find("item").concat().eq(0).attr("DN"));
                                    $$(oPersonR).attr("position", $$(oCharPerson).find("item").concat().eq(0).attr("PO"));
                                    $$(oPersonR).attr("title", $$(oCharPerson).find("item").concat().eq(0).attr("TL"));
                                    $$(oPersonR).attr("level", $$(oCharPerson).find("item").concat().eq(0).attr("LV"));
                                    $$(oPersonR).attr("oucode", $$(oCharPerson).find("item").concat().eq(0).attr("RG"));
                                    $$(oPersonR).attr("ouname", $$(oCharPerson).find("item").concat().eq(0).attr("RGNM"));
                                    $$(oPersonR).attr("sipaddress", $$(oCharPerson).find("item").concat().eq(0).attr("SIP"));
                                    
                                    $$(oTaskinfoR).attr("status", "inactive");
                                    $$(oTaskinfoR).attr("result", "inactive");
                                    $$(oTaskinfoR).attr("kind", "normal");
                                    
                                    $$(oPersonR).append("taskinfo", oTaskinfoR);
                                    
                                    $$(oOUR).append("person", oPersonR);
                                    
                                    $$(oStepR).append("ou", oOUR);
                                    
                                    $$(oDivR).append("step", oStepR);
                                    
                                    $$(oApvList).find("steps").append("division", oDivR);
                                    
                                } else {
                                    $$(oGetApvList).find("steps>division[divisiontype='receive']").has("step[routetype='receive']").has("step[unittype='ou'],[unittype='person']").each(function (i, enodeItem) {
                                        $$(enodeItem).find("person>taskinfo").attr("result", "inactive");
                                        $$(enodeItem).find("person>taskinfo").attr("status", "inactive");
                                        $$(enodeItem).find("person>taskinfo").remove("datereceived");
                                        $$(enodeItem.children().concat().eq(0)).attr("result", "inactive");
                                        $$(enodeItem.children().concat().eq(0)).attr("status", "inactive");
                                        $$(enodeItem.children().concat().eq(0)).remove("datereceived");
                                        // $$(oApvList).append(enodeItem.key(),
										// enodeItem);
                                        $$(oApvList).find("steps").append("division", enodeItem.json());
                                    });
                                }
                            }
                            // 참조자 출력
                            $$(oGetApvList).find("steps > ccinfo").concat().each(function (i, enodeItem) {
                                $$(oApvList).find("steps").append("ccinfo", enodeItem.json());
                            });
                        /* } */
                            
                        // 재사용 인 경우에는 자동참조 등 자동결재선 뿌리지 않음(중복되기 때문)
                        if(getInfo("Request.reuse") != "Y" && getInfo("Request.mode") != "TEMPSAVE") {    
	                        // 자동합의자
	                        if (getInfo("AutoApprovalLine.Agree.autoSet") == "Y") {
	                            if (getInfo("AutoApprovalLine.Agree.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.Agree.WorkedApprovalLine") != undefined) {
	                                var oAutoLineAgree = $.parseJSON(getInfo("AutoApprovalLine.Agree.WorkedApprovalLine"));
	                                if ($$(oAutoLineAgree).find("step").length > 0) {
	                                    var oAppList = $$(oApvList).find("steps>division[divisiontype='send']>step[routetype='assist'][unittype='person'], steps>division[divisiontype='send']>step[routetype='consult'][unittype='person']");
	                                    for (var i = 0; i < $$(oAppList).length; i++) {
	                                        var oChkNode = $$(oAutoLineAgree).find("step").has("ou>person[code='" + $$($$(oAppList).concat().eq(i)).find("ou > person").attr("code") + "']");
	                                        if (oChkNode.length > 0) {
	                                            $$(oChkNode).remove();
	                                        }
	                                    }
	                                    
	                                    // 기안자 (taskinfo가 charge) 바로 뒤에 자동합의자
										// 데이터 넣기 위함 - 시작
	                                    var tempChargeObj = {"step" : $$(oApvList).find("steps>division>step").has("ou>person>taskinfo[kind='charge']").json()};
	                                    var tempChargePath = "";
	                                    
	                                    if($$(tempChargeObj.step).exist()){
	                                    	tempChargePath = $$(oApvList).find("steps>division>step").has("ou>person>taskinfo[kind='charge']").concat().eq(0).path();
	                                    	$$(tempChargeObj).append("step", $$(oAutoLineAgree).find("step").json());
	                                    	
	                                    	$$(oApvList).find("steps>division>step").has("ou>person>taskinfo[kind='charge']").remove();
	                                    	
	                                    	if($$(oApvList).find(tempChargePath.replace(/\//gi, ">")).parent().find("step").length > 0)		// 기존
																																			// 결재선이
																																			// 기안자외에
																																			// 결재선이
																																			// 있을
																																			// 경우
	                                    		$$(oApvList).find(tempChargePath.replace(/\//gi, ">")).parent().find("step").json().splice(0, 0, $$(tempChargeObj).find("step").json()[0], $$(tempChargeObj).find("step").json()[1]);
	                                    	else		// 기존 결재선이 기안자 외에 결재선이
														// 없을 경우
	                                    		$$(oApvList).find(tempChargePath.replace(/\//gi, ">").replace("division>step", "division")).append("step", $$(tempChargeObj).find("step").json());
	                                    }
	                                    // 기안자 (taskinfo가 charge) 바로 뒤에 자동합의자
										// 데이터 넣기 위함 - 끝
	                                }
	                            }
	                        }
	                        // 자동결재자
	                        if (getInfo("AutoApprovalLine.Approval.autoSet") == "Y") {
	                            if (getInfo("AutoApprovalLine.Approval.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.Approval.WorkedApprovalLine") != undefined) {
	                                var oAutoLineApproval = $.parseJSON(getInfo("AutoApprovalLine.Approval.WorkedApprovalLine"));
	                                if ($$(oAutoLineApproval).find("step").length > 0) {
	                                    var oAppList = $$(oApvList).find("steps>division[divisiontype='send']>step[name!='reference'][routetype='approve'][unittype='person']");
	                                    for (var i = 0; i < $$(oAppList).length; i++) {
	                                        var oChkNode = $$(oAutoLineApproval).find("step").has("ou > person[code='" + $$($$(oAppList).concat().eq(i)).find("ou > person").attr("code") + "']");
	                                        if (oChkNode.length > 0) {
	                                        	// $$(oChkNode).remove();
	                                        	$$(oAutoLineApproval).find("step").remove(oChkNode.index());
	                                        }
	                                    }
	                                    $$(oAutoLineApproval).find("step").concat().each(function(i, elm){
	                                    	$$(oApvList).find("steps>division[divisiontype='send']").append("step", elm.json());
	                                    });
	                                }
	                            }
	                        }
	                        // 자동참조자
	                        if (getInfo("AutoApprovalLine.CCAfter.autoSet") == "Y") {
	
	                            if (getInfo("AutoApprovalLine.CCAfter.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.CCAfter.WorkedApprovalLine") != undefined) {
	                                var oAutoLineCC = $.parseJSON(getInfo("AutoApprovalLine.CCAfter.WorkedApprovalLine"));
	                                if ($$(oAutoLineCC).find("ccinfo").length > 0) {
	                                    $$(oApvList).find("steps>ccinfo[belongto='sender']").each(function (i, elm) {
	                                        var oChkNode = $$(oAutoLineCC).find("ccinfo[belongto='sender']").has(">ou>person[code='" + $$(elm).find("ou > person").attr("code") + "']");
	                                        if (oChkNode.length > 0) {
	                                        	// $$(oChkNode).remove();
	                                        	$$(oAutoLineCC).find("step").remove(oChkNode.index());
	                                        }
	                                        var oChkNode = $$(oAutoLineCC).find("ccinfo[belongto='sender']").has("> ou[code='" + $(elm).find("ou").attr("code") + "']");
	                                        if (oChkNode.length > 0) {
	                                        	// $$(oChkNode).remove();
	                                        	$$(oAutoLineCC).find("step").remove(oChkNode.index());
	                                        }
	                                    });
	                                    
	                                    $$(oAutoLineCC).find("ccinfo").concat().attr("datereceived", "");
	                                    
	                                    $$(oAutoLineCC).find("ccinfo").concat().each(function(i, elm){
	                                    	$$(oApvList).find("steps").append("ccinfo", elm.json());
	                                    });
	                                }
	                            }
	                        }
	                        // 자동참조자(사전)
	                        if (getInfo("AutoApprovalLine.CCBefore.autoSet") == "Y") {
	                            if (getInfo("AutoApprovalLine.CCBefore.WorkedApprovalLine") != "" && getInfo("AutoApprovalLine.CCBefore.WorkedApprovalLine") != undefined) {
	                                var oAutoLineCC = $.parseJSON(getInfo("AutoApprovalLine.CCBefore.WorkedApprovalLine"));
	                                if ($$(oAutoLineCC).find("ccinfo").length > 0) {
	                                    $$(oApvList).find("steps>ccinfo[belongto='sender'][beforecc='y']").each(function (i, elm) {
	                                        var oChkNode = $$(oAutoLineCC).find("ccinfo[belongto='sender'][beforecc='y']").has(">ou>person[code='" + $$(elm).find("ou > person").attr("code") + "']");
	                                        if (oChkNode.length > 0) {
	                                        	// $$(oChkNode).remove();
	                                        	$$(oAutoLineCC).find("step").remove(oChkNode.index());
	                                        }
	                                        var oChkNode = $$(oAutoLineCC).find("ccinfo[belongto='sender'][beforecc='y']").has(">ou[code='" + $(elm).find("ou").attr("code") + "']");
	                                        if (oChkNode.length > 0) {
	                                        	// $$(oChkNode).remove();
	                                        	$$(oAutoLineCC).find("step").remove(oChkNode.index());
	                                        }
	                                    });
	                                    
	                                    $$(oAutoLineCC).find("ccinfo").concat().attr("datereceived", "");
	                                    
	                                    $$(oAutoLineCC).find("ccinfo").concat().each(function(i, elm){
	                                    	$$(oApvList).find("steps").append("ccinfo", elm.json());
	                                    });
	                                }
	                            }
	                        }
                        }

                        /*
						 * 비사용 //인사평가 1차, 2차평가자 조회 //BaseConfig에서 대상 양식
						 * formprefix설정 if
						 * (getIncludeFormPrefix(Common.getBaseConfig("EvaluationFormPrefix").trim(),
						 * '^')) {
						 * 
						 * //1차, 2차평가자 조회 var pXML =
						 * "dbo.PE_EvaluatorAssessList_R"; var aXML = "<param><name>EmployeeID</name><type>VarChar</type><length>10</length><value><![CDATA[" +
						 * getInfo("AppInfo.usid") + "]]></value></param>";
						 * var sXML = "<Items><connectionname>COVI_FLOW_SI_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" +
						 * pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
						 * var szURL = "/WebSite/Approval/getXMLQuery.aspx";
						 * 
						 * CFN_CallAjax(szURL, sXML, function (data) { var tb =
						 * $(data).find("Table"); tb.each(function (i, elm) {
						 * var oStep = oApvList.createElement("step"); var oOu =
						 * oApvList.createElement("ou"); var oPerson =
						 * oApvList.createElement("person"); var oTaskinfo =
						 * oApvList.createElement("taskinfo");
						 * 
						 * oStep.setAttribute("name", "일반결재");
						 * oStep.setAttribute("routetype", "approve");
						 * oStep.setAttribute("unittype", "person");
						 * oDiv.appendChild(oStep);
						 * 
						 * oOu.setAttribute("name",
						 * $(elm).find("ExGroupName").text());
						 * oOu.setAttribute("code",
						 * $(elm).find("GR_Code").text());
						 * oStep.appendChild(oOu);
						 * 
						 * oPerson.setAttribute("name",
						 * $(elm).find("ExDisplayName").text());
						 * oPerson.setAttribute("code",
						 * $(elm).find("UR_Code").text());
						 * oPerson.setAttribute("title",
						 * $(elm).find("jobTitle").text());
						 * oPerson.setAttribute("level",
						 * $(elm).find("jobLevel").text());
						 * oPerson.setAttribute("position",
						 * $(elm).find("jobPosition").text());
						 * oPerson.setAttribute("ouname",
						 * $(elm).find("ExGroupName").text());
						 * oPerson.setAttribute("oucode",
						 * $(elm).find("GR_Code").text());
						 * oPerson.setAttribute("sipaddress",
						 * $(elm).find("EX_PrimaryMail").text());
						 * oOu.appendChild(oPerson);
						 * 
						 * oTaskinfo.setAttribute("kind", "normal");
						 * oTaskinfo.setAttribute("result", "inactive");
						 * oTaskinfo.setAttribute("status", "inactive");
						 * oPerson.appendChild(oTaskinfo);
						 * 
						 * $('#EVALUATOR_ID').val($(elm).find("EvaluatorID").text());
						 * 
						 * $(oApvList).find("division").append($(oStep)); });
						 * 
						 * //결재자 수 제한 setInfo('scCHLimitV', 2);
						 *  }, false, "xml"); }
						 */
                    }

                    document.getElementById("APVLIST").value = JSON.stringify(oApvList);
                    
                    initApvList();
                }
            }
        }
    }
}

// 긴급결재
function chk_urgent_onclick() {
    document.getElementById("chk_urgent").value = (document.getElementById("chk_urgent").checked == true) ? "1" : "0";
}
// 기밀문서
function chk_secrecy_onclick() {
    document.getElementById("chk_secrecy").value = (document.getElementById("chk_secrecy").checked == true) ? "1" : "0";
}
/*
 * 예약발송, 예약배포(스키마) 비사용 //예약발송,배포 function chk_reserved_onclick() {
 * $("#chk_reserved").val((document.getElementById("chk_reserved").checked ==
 * true) ? "1" : "0"); if (document.getElementById("chk_reserved").checked ==
 * true) { $("#reservedchk").css({ "display": "" }); var sDics =
 * "lbl_apv_setschema_scReserved:lbl_apv_setschema_scDistribute"; var sDic =
 * sDics.split(":"); if (getInfo("scReserved") == "1" && getInfo("scDistribute") ==
 * "1") { for (var i = 0; i < 2; i++) { makeOption(sDic[i]); } } else { if
 * (getInfo("scReserved") == "1") { makeOption(sDic[0]); } else {
 * makeOption(sDic[1]); } } } else { $("#reservedchk").css({ "display": "none"
 * }); makeOption("del"); } }
 */
/*
 * 예약발송, 예약배포(스키마) 비사용 //예약발송,배포 옵션 생성 function makeOption(str) { var oSelect =
 * document.getElementById("select_reserved"); if (str == "del") {
 * oSelect.length = 0; } else { var oOption = document.createElement("OPTION");
 * oSelect.add(oOption); oOption.text = Common.getDic(str); oOption.value =
 * Common.getDic(str); } return; }
 */

// 회신 (추가 : 2008.08.05 백승찬 대리)
function chk_reform_onclick() {
    document.getElementById("chk_reform").value = (document.getElementById("chk_reform").checked == true) ? "1" : "0";
    document.getElementsByName("REPLY")[0].value = document.getElementById("chk_reform").value;
}
function receiveGeneralQuery(dataresponseXML) {
    var errorNode = $(dataresponseXML).find("response > error");
    if (errorNode.length > 0) {
        alert("Desc: " + $(errorNode).text());
    }
}

/*
 * toUTF8(szInput) moved to form.refactor.deleted.js by KJW : 2014.04.22 : :
 * XFORM PRJ.
 */

/* 메일 작성창 open - 미구현 */
var rg_Mailbox;
var szApvBodyCtx = "";
function sendMail() { OpenNewMsg("sendmail"); }
function OpenNewMsg(code) {
    mailform.action = g_szBaseURL + "/WebSite/Approval/Popup/EmailWrite.aspx";

    var szwidth = 800;
    var szheight = 690;
    calcWindowLocation(szwidth, szheight);
    var windowName = new String(Math.round(Math.random() * 100000));

    CFN_OpenWindow("", windowName, szwidth, szheight, "");

    // 문서 키값 넘기기
    mailform.PIID.value = getInfo("ProcessInfo.ProcessID");
    mailform.FIID.value = getInfo("FormInstanceInfo.FormInstID");
    // 제목 넘기기
    mailform.Subject.value = getInfo("FormInstanceInfo.Subject");
    // 본문 넘기기
    mailform.HTMLBody.value = encode(sMailBody);

    // 본문 넘기기 전 sMailBody base64로 인코딩 hichang 끝
    // 첨부파일 처리
    // 데이터포멧 : 파일경로1|파일명1|파일사이즈1?파일경로2|파일명2|파일사이즈2? - 파일사이즈 단위(byte)
    // 예)
	// \GWStorage\BOARD\1155\AttachFile\200907\1649_소프트웨어사용인증서.ppt|소프트웨어사용인증서.ppt|313856?
    var szAttFileInfo = "";
    if (getInfo("FormInstanceInfo.AttachFileInfo") != "") {
        var r, res;
        var s = getInfo("FormInstanceInfo.AttachFileInfo");
        res = /^^^/i;
        attFiles = s.replace(res, "");
        var fState;
        var m_oFileList;
        if (attFiles.indexOf("</fileinfos>") < 0) {
            m_oFileList = $.parseXML("<fileinfos>" + attFiles + "</fileinfos>");
        } else {
            m_oFileList = $.parseXML(attFiles);
        }
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = $(m_oFileList).find("fileinfos");
        var fmurl = getInfo("BaseConfig.fmurl").replace("EDMS", "") + "ATTACH/";
        var attpath = getInfo("BaseConfig.attpath");
        if (elmRoot != null) {
            szAttFileInfo = "";
            $(elmRoot).find("fileinfo > file").each(function (i, elm) {
                var filename = $(elm).attr("name");
                var filesize = $(elm).attr("size");
                var fileurl = $(elm).attr("location");
                var filepath = fileurl.replace(fmurl, attpath).replace("/", "\\");
                filepath = filepath.substring(filepath.indexOf("\\\\") + 1, filepath.length);
                filepath = filepath.substring(filepath.indexOf("\\") + 1, filepath.length);
                filepath = filepath.substring(filepath.indexOf("\\"), filepath.length);

                szAttFileInfo += filepath + "|" + filename + "|" + filesize;
                if (i < $(elmRoot).find("fileinfo > file").length - 1)
                    szAttFileInfo += "?";
            });
        }
    }
    document.mailform.attachfiles.value = encode(szAttFileInfo);

    mailform.target = windowName;
    mailform.submit();
}
// 본문 넘기기 전 sMailBody base64로 인코딩 시작
var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function encode(decStr) {
    decStr = escape(decStr);
    var bits, dual, i = 0, encOut = '';
    while (decStr.length >= i + 3) {
        bits =
            (decStr.charCodeAt(i++) & 0xff) << 16 |
            (decStr.charCodeAt(i++) & 0xff) << 8 |
            decStr.charCodeAt(i++) & 0xff;
        encOut +=
            base64s.charAt((bits & 0x00fc0000) >> 18) +
            base64s.charAt((bits & 0x0003f000) >> 12) +
            base64s.charAt((bits & 0x00000fc0) >> 6) +
            base64s.charAt((bits & 0x0000003f));
    }
    if (decStr.length - i > 0 && decStr.length - i < 3) {
        dual = Boolean(decStr.length - i - 1);
        bits =
            ((decStr.charCodeAt(i++) & 0xff) << 16) |
            (dual ? (decStr.charCodeAt(i) & 0xff) << 8 : 0);
        encOut +=
            base64s.charAt((bits & 0x00fc0000) >> 18) +
            base64s.charAt((bits & 0x0003f000) >> 12) +
            (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
    }
    return encOut;
}
// 본문 넘기기 전 sMailBody base64로 인코딩 끝

// 본문 넘기기 전 sMailBody base64로 디코딩 시작
function decode(encStr) {
    var bits, decOut = '', i = 0;
    for (; i < encStr.length; i += 4) {
        bits =
            (base64s.indexOf(encStr.charAt(i)) & 0xff) << 18 |
            (base64s.indexOf(encStr.charAt(i + 1)) & 0xff) << 12 |
            (base64s.indexOf(encStr.charAt(i + 2)) & 0xff) << 6 |
            base64s.indexOf(encStr.charAt(i + 3)) & 0xff;
        decOut += String.fromCharCode(
            (bits & 0xff0000) >> 16, (bits & 0xff00) >> 8, bits & 0xff);
    }
    if (encStr.charCodeAt(i - 2) == 61)
        undecOut = decOut.substring(0, decOut.length - 2);
    else if (encStr.charCodeAt(i - 1) == 61)
        undecOut = decOut.substring(0, decOut.length - 1);
    else undecOut = decOut;
    return unescape(undecOut);
}
// 본문 넘기기 전 sMailBody base64로 디코딩 끝
var theLeft;
var theTop;
function calcWindowLocation(theWidth, theHeight) {
    var objNewWin;

    var x = theWidth;
    var y = theHeight;

    theLeft = window.screen.width / 2 - x / 2;
    theTop = window.screen.height / 2 - y / 2 - 20;
}

function requestTempSaveProcess(sReqMode) {
    m_sReqMode = sReqMode;
    try {
        disableBtns(true);
        if (evaluateForm()) {
            var sTargetURL = "submitForm.aspx";
            var sMsgTitle;
            var sAddage;
            switch (sReqMode) {
                case "TEMPSAVE":
                    sMsgTitle = gLabel__personalSave; // "개인 저장함"

                    var sFiid = getInfo("FormInstanceInfo.FormInstID"); setInfo("FormInstanceInfo.FormInstID", getInfo("FormInstanceInfo.fiid_spare")); setInfo("fiid_spare", sFiid);// setInfo("Request.mode","REJECT");
                    setInfo("Request.mode", "DRAFT"); setInfo("Request.loct", "DRAFT");
                    sTargetURL = "../TempSave/saveForm.aspx";
                    var sFormXml = getFormJSON();
                    if (!formJsonObj.hasOwnProperty("BodyContext") || $.isEmptyObject(formJsonObj.BodyContext)) {
                        /*
						 * formJsonObj = formJsonObj.replace("</formdata>",
						 * ""); formJsonObj += makeNode("BodyContext",
						 * getInfo("BodyContext")); formJsonObj += "</formdata>";
						 */
                    	$.extend(formJsonObj, makeNode("BodyContext", getInfo("BodyContext")));
                    }
                    sAddage = makeNode("fmfn") + sFormXml;
                    m_bFrmExtDirty = true;
                    break;
            }
            try {

                // 관리자에 의한 강제취소 처리시작
                var szusidback = "";
                if (admintype == "ADMIN") {
                    szusidback = getInfo("AppInfo.usid");
                    setInfo("usid", getInfo("FormInstanceInfo.InitiatorID"));
                }

                var sText = "<request>" + getDefaultJSON() + sAddage + makeNode("fiid_spare") + "</request>";
                CFN_CallAjax(sTargetURL, sText, function (data) {
                    receiveGeneralQuery(data);
                }, false, "xml");

                if (admintype == "ADMIN" && szusidback != "") {
                    setInfo("usid", szusidback);
                }
                // 관리자에 의한 강제취소 처리 끝
            } catch (e) {
                disableBtns(false);
                Common.Error(gMessage73 + "\nDesc:" + e.description + "\nError number: " + e.number); // "저장하지
																										// 못했습니다."
            }
        } else {
            disableBtns(false);
        }
    } catch (e) { alert(e.description); }
}

function chkAbsent(oSteps) {
    var elmUsers;
    var sUsers = "";
    $$(oSteps).find("division > step > ou > person").each(function (i, $$) {
        if (sUsers.length > 0) {
            var szcmpUsers = ";" + sUsers + ";";
            if (szcmpUsers.indexOf(";" + $$.attr("code") + ";") == -1) { sUsers += ";" + $$.attr("code"); }
        } else {
            sUsers += $$.attr("code");
        }
    });
    
    var bReturn = false;
    
    $.ajax({
    	type:"POST",
    	url:"apvline/checkAbsentMember.do",
    	async:false,
    	data:{
    		"users":sUsers
    	},
    	success : function(data){
              var sAbsentResult = "";
              var sResult = "";
              var oChkAbsentNode;
    		  $$(oSteps).find("division>step>ou>person").each(function (i, oUser) {
    			  if($$(oUser).concat().length <= 1) { // 대결자 있는 경우 퇴사자로 인식하여
														// 예외처리
	    			  sAbsentResult += m_oFormMenu.getLngLabel(oUser.attr("name").toString(), false) + ",";
	    			  sResult += m_oFormMenu.getLngLabel(oUser.attr("name").toString(), false) + ",";
	                  $(data.list).each(function (idx, oChkAbsentNode) {
	                      if (oChkAbsentNode.PERSON_CODE == oUser.attr("code")) {
	                          if (oChkAbsentNode.UNIT_CODE == oUser.attr("oucode")) {
	                              oUser.attr("oucode", oChkAbsentNode.UNIT_CODE);
	                              oUser.attr("ouname", oChkAbsentNode.UNIT_NAME);
	                              oUser.attr("position", oChkAbsentNode.JOBPOSITION_Z);
	                              oUser.attr("title", oChkAbsentNode.JOBTITLE_Z);
	                              oUser.attr("level", oChkAbsentNode.JOBLEVEL_Z);
	                              sResult = sResult.replace(getLngLabel(oUser.attr("name"), false) + ",", "");
	                          }
	
	                          sAbsentResult = sAbsentResult.replace(getLngLabel(oUser.attr("name"), false) + ",", "");
	                      } else {// 퇴직자
	                      }
	                  });
    			  }
              });
    		  if (sAbsentResult != "") {
                  Common.Warning(coviDic.dicMap.msg_apv_057 + '\n\n' + coviDic.dicMap.msg_apv_359 + " : " + sAbsentResult.substring(0, sResult.length - 1)); // 선택된
																																								// 결재선에
																																								// 퇴직자가
																																								// 포함되어
																																								// 적용이
																																								// 되지
																																								// 않습니다.\n\n퇴직자
																																								// :
																																								// 슈퍼관리자
                  bReturn = false;
              } else {
                  if (sResult != "") {
                      alert(coviDic.dicMap.msg_apv_173 + '\n\n' + coviDic.dicMap.msg_apv_358 + " : " + sResult.substring(0, sResult.length - 1)); // 선택한
																																					// 개인
																																					// 결재선의
																																					// 부서/인사정보가
																																					// 최신정보와
																																					// 일치하지
																																					// 않아
																																					// 제외됩니다.\n\n제외
																																					// 대상자
																																					// :
																																					// 슈퍼관리자
                      bReturn = false;
                  } else {
                      bReturn = true;
                  }
              }
    	},
    	error:function(response, status, error){
			CFN_ErrorAjax("apvline/checkAbsentMember.do", response, status, error);
		}
    	
    });
   
    return bReturn;
}

// 후결여부 체크
function fn_GetReview() {
    /*
	 * var m_apvXML = $.parseXML(document.getElementById("APVLIST").value); var
	 * oReviewNode = $(m_apvXML).find("steps > division > step > ou >
	 * person:has(taskinfo[kind='review'][status='pending'])"); if
	 * (oReviewNode.length != 0) { if (getInfo("AppInfo.usid") ==
	 * $(oReviewNode).attr("code")) { return true } } return false;
	 */
	
	var m_apvJSON = $.parseJSON(document.getElementById("APVLIST").value);
    var oReviewNode = $$(m_apvJSON).find("steps>division>step>ou>person").has("taskinfo[kind='review'][status='pending'])");
    if (oReviewNode.length != 0) {
        if (getInfo("AppInfo.usid") == $(oReviewNode).attr("code")) {
            return true
        }
    }
    return false;
}
// 후결여부 체크
// 최종결재여부 체크
function getIsLast() {
    var sRtn = "";
    var m_oApvList = $.parseJSON(document.getElementById("APVLIST").value);

    var oPendingSteps = $$(m_oApvList).find("steps > division > step > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='pending'],steps > division > step > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='reserved']");
    var oinActiveSteps = $$(m_oApvList).find("steps > division > step > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='inactive']");
    if ((oPendingSteps.length == 1) && (oinActiveSteps.length == 0)) {
        sRtn = "true";
    } else {
        sRtn = "false";
    }
    if (sRtn == "false") {
        switch (getInfo("Request.mode")) {
            case "PCONSULT":
                if (getInfo("Request.mode") == "PCONSULT" && getInfo("Request.subkind") == "T004" && document.getElementById("ACTIONINDEX").value == 'REJECT') { // 합의
																																									// 반려
																																									// 가능
                    sRtn = "true";
                }
                break;
            default:
                if (document.getElementById("ACTIONINDEX").value == 'REJECT') { // 결재
																				// 반려
																				// 가능
                    sRtn = "true";
                }
                break;
        }
    }
    return sRtn;
}
// 양식 내역 보내기
function getInfoBodyContext() {
    var formJsonObj = getFormJSON();
    if (!formJsonObj.hasOwnProperty("BodyContext") || $.isEmptyObject(formJsonObj.BodyContext)) {
        /*
		 * formJsonObj = formJsonObj.replace("</formdata>", ""); formJsonObj +=
		 * makeNode("BodyContext", getInfo("BodyContext")); formJsonObj += "</formdata>";
		 */
    	$.extend(formJsonObj, makeNode("BodyContext", getInfo("BodyContext")));
    }
    return formJsonObj;
}

function receiveBBSHTTP(responseXMLdata) {
    var xmlReturn = responseXMLdata;

    var errorNode = $(xmlReturn).find("response> error");
    if (errorNode.length > 0) {
        throw new Error(-1, $(errorNode).text());
    } else {
        alert(gMessage170); // "완료되었습니다."
    }
}

function insertToList4ApvLine(oApvList, oCurrentOUNode, oSrcDoc) {
    m_oXSLProcessor.input = chkDuplicateApprover(oSrcDoc, oApvList);
    m_oXSLProcessor.addParameter("steptype", "division");
    m_oXSLProcessor.addParameter("divisiontype", "send");

    m_oXSLProcessor.addParameter("unittype", "person");
    m_oXSLProcessor.addParameter("routetype", "approve");
    m_oXSLProcessor.addParameter("allottype", "serial");
    m_oXSLProcessor.addParameter("referencename", gLabel_approve);
    m_oXSLProcessor.addParameter("childvisible", "");
    m_oXSLProcessor.transform();
    var oTargetDoc = $.parseXML(m_oXSLProcessor.output);

    var oChildren = $(oTargetDoc).find("steps > division > step");
    var xpathCur;
    var oSelectedElm;
    $(oTargetDoc).find("steps > division > step").each(function (x, elm) {
        $(oCurrentOUNode).append($(elm))

    });
}

function chkDuplicateApprover(oSrcDoc, m_oApvList) {
    var oSrcDocList = $(oSrcDoc).find("item");
    var bDelete = false;
    $(oSrcDocList).each(function (i, item) {
        var xPathDelete1 = '';
        var xPathDelete2 = '';
        var xPathDelete3 = '';
        var xPathDelete4 = '';
        xPathDelete1 = "steps > division:has(taskinfo[status='inactive'] > step> ou > person";
        xPathDelete2 = "steps > division:has(taskinfo[status='pending'] > step> ou > person";
        xPathDelete3 = "steps > division:has(taskinfo[status='inactive'] > step> ou > role";
        xPathDelete4 = "steps > division:has(taskinfo[status='pending'] > step> ou > role";
        xPathDelete1 += "[code='" + $(item).find("AN").text() + "'][name='" + $(item).find("DN").text() + "' ]";
        xPathDelete2 += "[code='" + $(item).find("AN").text() + "'][name='" + $(item).find("DN").text() + "' ]";
        xPathDelete3 += "[code='" + $(item).find("AN").text() + "'][name='" + $(item).find("DN").text() + "' ]";
        xPathDelete4 += "[code='" + $(item).find("AN").text() + "'][name='" + $(item).find("DN").text() + "' ]";
        if ($(m_oApvList).find(xPathDelete1, xPathDelete2, xPathDelete3, xPathDelete4).length != 0) {
            $(oSrcDoc).find("items").removeChild(item);
            bDelete = true;
        }
    });
    return oSrcDoc;
}

/*
 * 지정결재선 비사용 //담당업무함 지정결재선 셋팅 function setFixApvLineREDRAFT(oApvList,
 * oCurrentOUNode) { //m_FixApvLineData ; requester 지정 결재선 정보 //<NewDataSet>
 * //Table : 지정결재선 //Table1 : controller //지정결재선 추가
 * 
 * m_oXSLProcessor = makeProcessor("../ApvLineMgr/ApvlineGen.xsl");
 * 
 * var m_objXMLMember = $.parseXML(m_FixApvLineData.xml);
 * 
 * var m_objXML; var m_oMemberXSLProcessor =
 * makeProcessor("../Address/org_memberqueryfixapvline.xsl");
 * m_oMemberXSLProcessor.addParameter("type", "fix");
 * m_oMemberXSLProcessor.input = m_objXMLMember;
 * m_oMemberXSLProcessor.transform(); m_objXML =
 * $.parseXML(m_oMemberXSLProcessor.output);
 * 
 * var m_XMLDOM = $.parseXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
 * 
 * var m_oParent = $(m_XMLDOM).find("selected > user"); var elmList =
 * $(m_objXML).find("response > addresslist > item"); $(elmList).each(function
 * (i, elm) { $(m_oParent).append(elm); });
 * 
 * m_objXML = $.parseXML(CFN_XmlToString(m_oParent));
 * insertToList4ApvLine(oApvList, oCurrentOUNode, m_objXML);
 * 
 * return CFN_XmlToString(oApvList); }
 */

function chkManager(szusid, szdeptid) {
    var pXML = " EXEC dbo.usp_CheckMANAGER '" + szdeptid + "','" + szusid + "' ";
    var sXML = "<Items><connectionname>ORG_ConnectionString</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql></Items>";
    var szURL = "../address/getXMLQuery.aspx?Type=searchMember";
    var bReturn = false;
    CFN_CallAjax(szURL, sXML, function (data) {
        var errorNode = $(data).find("response > error");
        if (errorNode.length > 0) {
            bReturn = false;
        } else {
            if ($(data).find("ROOT").text() == "") {
                bReturn = false;
            } else {
                bReturn = true;
            }
        }
        receiveHTTP(data);
    }, false, "xml");
    return (bReturn == true ? "Y" : "N");
}

// 지정결재선 셋팅 끝


function getBodyHTML(mode) {
    var sBodyHTML = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'><style>";
    try {
        var strBodyTable = document.getElementById("bodytable").cloneNode(true);
        if (mode != null && mode == "PUB") {
            // 대외공문출력양식
            $(strBodyTable).html("<div class='draft_page'><span id='editor'>" + $("#bodytable_content").html() + "</span></div>");
            $(strBodyTable).find("#logoTB").attr("style", "display:"); // 상단
																		// 회사명
            $(strBodyTable).find("#TableBlowCompanyInformation").attr("style", "display:"); // 하단
																							// 직인란
            // 직인가져오기
            var strSealPath = "";
            strSealPath = getUsingOfficailSeal();
            if (getInfo("ApprovalLine") == "") { // 본사용 : 수기등록한 문서는 직인 안찍어줌
                $(strBodyTable).find("#ImgSeal").attr("style", "display:none");
            } else if (strSealPath != "") {
                /*
				 * $(strBodyTable).find("#ImgSeal").attr("src",
				 * getInfo("BaseConfig.sealpath") + '\\' + strSealPath); //가져온
				 * 직인 경로 삽입
				 */            
            	$(strBodyTable).find("#ImgSeal").attr("src", strSealPath); // 가져온
																			// 직인
																			// 경로
																			// 삽입
            } else {
                // 선택된 직인이 없을때
                alert(coviDic.dicMap.msg_apv_confirm_usingstamp);
                $(strBodyTable).find("#ImgSeal").attr("style", "display:none");
            }
        } else if (mode == "Print") {
            $(strBodyTable).html($("#printdoc").html());
        } else {
        	$(strBodyTable).find("> div > span").html($("#bodytable_content").html());
        	$(strBodyTable).find("#AttFileInfoList").find("dd").hide(); // 미리보기
																		// 버튼 숨김
        	$(strBodyTable).find("#AttFileInfoList").find("a.totDownBtn").hide(); // 전체받기
																					// 버튼
																					// 숨김
        	$(strBodyTable).find("#AttFileInfoList").find("span").each(function(i, obj) { if($(obj).attr("class") != "") $(obj).hide(); }); // 파일
																																			// 아이콘
																																			// 숨김
        }
        $(strBodyTable).find("span[data-element-type='textarea_linebreak']").css('display', 'block'); // 출력 시
																										// textarea
																										// 다음
																										// 장으로
																										// 넘어가는
																										// 현상있어서
																										// 수정함.
        
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].href != null && document.styleSheets[i].href.indexOf('approval_form') > -1) {
                if ($.browser.msie == true && parseFloat($.browser.version) <= 8) // ie8
																					// 이하일때
                    sBodyHTML += getStyle(document.styleSheets[i].href, i);
                else
                    sBodyHTML += getStyleChrome(document.styleSheets[i]);
            }
        }
    } catch (e) { alert(e.description); }
    
    if (mode == "PcSave") {
    	sBodyHTML = "";
    	sBodyHTML += strBodyTable.innerHTML;
	} else if(mode == "Mail"){
		// 20210126 이관문서 중에 html 인 문서도 있어서 분기 처리
		if (document.getElementById("frmHTML").src.indexOf(".mht") > -1) {
			frmHtml = strBodyTable.innerHTML;
		}
		else {
			// var tempBody =
			// document.getElementById("frmHTML").contentWindow.document.body.cloneNode(true);
			var printDiv = "";
			printDiv = getMigHtml();
			frmHtml = printDiv;
		}
		sBodyHTML += ".form_box {-ms-overflow-style: none;scrollbar-width: none;} .form_box::-webkit-scrollbar {display: none;}";
		sBodyHTML += 'html,body,form {width:100%;}body {width:100%; margin:0; padding:0; font-size:13px; line-height:14px; font-family:"Nanum Gothic", "맑은 고딕", "Malgun Gothic"; color:#222;}table{border-collapse:collapse;}fieldset,img {border:0 none}h1,h2,h3,h4,h5,h6{font-size:100%; font-weight:normal;}q:before,q:after{content:"";} /*인용구 "" 없애기*/a{text-decoration:none; color:#222;}a:hover{text-decoration:none;}img,input{border:0;}img,input,select{vertical-align:middle;}textarea {font-family:"Nanum Gothic", "맑은 고딕", "Malgun Gothic"; font-size:13px; border:1px solid #c6c6c6; border-radius:3px;}input::-ms-clear{display:none;}.wrap {width:100%; min-width:1120px;}.header {position:fixed; top:0px; clear:both; width:100%; min-width:1280px; height:45px; background:#ffffff; border-bottom:1px solid #cccccc; z-index:30;}.layout {width:100%; margin:0px; padding:0px;  z-index:20;}.container {z-index:20; margin-top:46px;  float:left; width:100%;  margin-left: -285px;}.con_layout {margin-right:41px; width:auto; margin-left: 290px;}.con_layout_f {margin-right:60px; margin-left:290px; width:auto;}.content {float:left; width:100%; margin-left:236px;}.content_f {margin-left:0; float:left; width:100%;}.lmb_box {position:relative; width:217px; float:left; padding:0px 0px 0px 0px; margin-left:-217px; }.slide_menu {position:absolute; top:12px; left:25px; display:inline-block; width:23px; height:20px; }.content_in { z-index:2; /*float:left;*/ padding:0px; /*width:100%;*/ }.conin { overflow:hidden; overflow-x:hidden;  overflow-y:auto; padding-right:40px; }.topFixed {background:#fff; z-index:100; display:inline-block; width:100%; position:relative; margin-top:17px;}.approval_wrap .con_layout { margin-left:109px;}.approval_wrap .content {margin-left:350px;}.approval_wrap .header {display:none;}.approval_wrap .container {margin-top:0px; margin-left:-309px;}.approval_wrap .content_in {margin-left:-20px; margin-right:40px;}.contbox { position:absolute;  bottom:1px; left:130px; right:40px; min-width:874px;}.approval_wrap .lmb_box {width:90px; height:100%;position:fixed; background-color:#222f3e; box-shadow:3px 3px 5px #ccc;margin-left:-150px;z-index:300;}.approval_wrap .r_box {display:none;}.approval_wrap .lmb_wrap {text-align:center;}.approval_wrap .lmb_menu {margin:15px 0px 0px 0px; padding:0px;}.ml5 {margin-left:5px !important;} .ml10 {margin-left:10px !important;} .ml15 {margin-left:15px !important;}.ml20 {margin-left:20px !important;} .ml25 {margin-left:25px !important;} .ml30 {margin-left:30px !important;}.ml30 {margin-left:40px !important;} .ml30 {margin-left:50px !important;} .mr5 {margin-right:5px !important;}.mr10 {margin-right:10px !important;} .mr15 {} .mr20 {margin-right:20px !important;}.mr25 {margin-right:25px !important;} .mr30 {margin-right:30px !important;} .mr40 {margin-right:40px !important;}.mr50 {margin-right:50px !important;} .mt5 {margin-top:5px !important;} .mt10 {margin-top:10px !important;}.mt15 {margin-top:15px !important;} .mt20 {margin-top:20px !important;} .mt25 {margin-top:25px !important;}.mt30 {margin-top:30px !important;} .mt40 {margin-top:40px !important;} .mt50 {margin-top:50px !important;}.mt90 {margin-top:90px !important;} .mt100 {margin-top:100px !important;} .mb5 {margin-bottom:5px !important;}.mb10 {margin-bottom:10px !important;} .mb15 {margin-bottom:15px !important;} .mb20 {margin-bottom:20px !important;}.mb25 {margin-bottom:25px !important;} .mb30 {margin-bottom:30px !important;} .mb40 {margin-bottom:40px !important;}.mb50 {margin-bottom:50px !important;} .mtm5 {margin-top:-5px !important;} .mtm10 {margin-top:-10px !important;}.mtm15 {margin-top:-15px !important;} .mtm20 {margin-top:-20px !important;} .mtm25 {margin-top:-25px !important;}.mtm30 {margin-top:-30px !important;} .mtm40 {margin-top:-40px !important;} .mtm50 {margin-top:-50px !important;}.fLeft {float:left !important;} .fRight {float:right !important; margin:0px 5px 0px 0px; padding:0px;} .tCenter {text-align:center !important;}select {border:1px solid #c6c6c6; height:30px; color:#222; border-radius:3px; color:#333; box-shadow:none !important;-webkit-appearance: none;-moz-appearance: none;appearance: none;padding-right: 15px;background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-slide-down-arrow02.png) no-repeat right center #fff;}select::-ms-expand {display:none;}select.input-required {background-image: url(data:image/gif;base64,R0lGODlhBQAFAIABAP8AAP///yH5BAEAAAEALAAAAAAFAAUAAAIIhH+RCuHtQgEAOw==), url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-slide-down-arrow02.png);background-repeat: no-repeat, no-repeat;background-position: left top, right center}.searchBg {height:20px !important;}.AXInput {height:20px !important;}input {margin:0px; padding:0px;height:28px; color:#333;border: 1px solid #c6c6c6;border-radius:3px !important; box-shadow:none !important;text-indent:6px;}.black {color:#222 !important;}.listinfo {margin-top:3px;}.listinfo .poRela {margin-top:-2px;}.poRela {position:relative; vertical-align:middle; width:70px; margin-top:4px;}.taPoRela {position:relative; vertical-align:middle; width:90px; height:58px; margin-top:4px;}.cirPro {border-radius:50%; width:40px; height:40px; left:50%; top:50%; overflow:hidden; display:inline-block; border:1px solid #dcdcdc;}.cirPro img { width:100%;}.cirCle {border-radius:50%; width:50px; height:50px; left:50%; top:50%; overflow:hidden; display:inline-block; border:1px solid #dcdcdc;}.cirBlue {border-radius:50%; width:50px; height:50px; left:50%; top:50%; overflow:hidden; display:inline-block; border:2px solid #419de8;}.borderNon {border:none !important;}.signTable {width:100%;}.signTable td {padding:0;}.btnAdmin {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -340px -10px; text-indent:-20000px; width:33px; height:29px; display:block; border:none !important;}.AXTabsLarge {overflow:visible; width:100%;}.userInfo {float:right; font-size:13px; color:#777777; margin-top:-35px;}.userInfo li {list-style:none; display:inline-block; float:left; padding-left:8px; vertical-align:middle;}.userInfo li:first-child {margin-top:-10px;}.userInfo li:last-child {margin-top:-6px; z-index:80;}.userInfo text {padding:0 10px;}.userInfo span {color:#39546c;}.btn_group {width:100%; padding-top:7px; background-color:#fff; line-height:26px; vertical-align:middle; margin-bottom:-3px;}.btn_group.mb10 { border-bottom:1px solid #acaeb2; padding-bottom:8px; padding-top:0px;}.taTit {font-size:13px;white-space:nowrap; overflow:hidden; line-height:22px; text-overflow:ellipsis; width:100%;}.tableTxt {display:inline-block; height:20px; clear:both;}.tableStyle .subject {text-align:left; line-height:19px; color:#222;}.tableStyle .subject .lGry {color:#888; margin:0px;}.listinfo {display:block;}.listinfo li:first-child {background:none; padding-left:0px;}.listinfo li:last-child { }.listinfo li {list-style:none; float:left; line-height:18px; padding-right:8px; padding-left:8px;  font-size:12px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/line_list.gif) no-repeat left 5px; color:#888;}.tableStyle .listinfo li {float:left; padding:0 6px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/line_list.gif) no-repeat right 4px; color:#888;}.tableStyle .listinfo li:first-child {padding-left:0;}.tableStyle .listinfo li:last-child {background:none;}.linePlus tr:first-child td, .linePlus tr:first-child th, .linePlus tr:last-child th  {border-top:1px solid #c3d7df;border-bottom:1px solid #c3d7df;}.linePlus .edit_con_wrap table td, th {border:0px;}.linePlus td,  .linePlus th {border-right:1px solid #c3d7df;}.linePlus td:first-child, .linePlus th:first-child {border-left:1px solid #c3d7df;}.tableStyle { width:100%;table-layout:fixed;z-index:50;word-break:break-all; }.tableStyle thead {border-top:1px solid #d2d7de;}.tableStyle.topline { border-top:0;}.tableStyle thead th , .tableStyle tbody th  { height:40px;border-bottom:1px solid #d2d7de;font-size:13px;font-weight:bold;color:#000;background:#f1f6f9;}.tableStyle thead td , .tableStyle tbody td { color:#000;border-bottom:1px solid #c3d7df;padding:5px;height:20px;position:relative;}.tableStyle.hover tr:hover { background:#f7f7f7;cursor:pointer;}.tableStyle tr.openApp td {padding:10px !important;}.openApp:hover td { background:none !important;}.tableStyle.hover tbody tr:hover td a.subject { color:#e9002d;text-decoration:underline;cursor:pointer;border-bottom:1px solid #d2d7de}.tableStyle thead tr:last-child td , .tableStyle thead tr:last-child th {border-bottom:1px solid #eaecef;}/*.tableStyle tbody tr:last-child td , .tableStyle tbody tr:last-child th {border-bottom:1px solid #eaecef;}*/.tableStyle.line { border-right:1px solid #eff2f4;}.tableStyle.line thead th , .tableStyle.line thead td ,.tableStyle.line tbody th , .tableStyle.line tbody td {border-left:1px solid #eff2f4;}.tableStyle tbody td label , .tableStyle tfoot td label { margin-right:10px;}.tableStyle tbody td label input , .tableStyle tfoot td label input { margin-right:5px;/*vertical-align:-1px;*/}.t-info { font-size:13px;color:#888;margin-left:10px;}.required { border:1px solid #ef9b92;}.tableStyle tbody td.datet { text-align:right;font-size:12px;color:#999;}.tableStyle thead th.subject {height:50px;font-size:16px;}.tableStyle a.t_more {float:left;}.textArea { width:98%;padding:1%;border:0;outline:none;}.listSubject {text-align:left; font-size:14px; color:#222; vertical-align:top;}.listSubject img {vertical-align:bottom; padding-left:1px;}.icnDel {padding:4px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -90px -40px; width:24px; height:24px; text-indent:-20000px; display:block;}.AXanchorDateHandle {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/app_calendar.png) no-repeat center center !important;}.formIcn {display:inline-block; float:right; margin:50px 18px 16px 0; position:absolute; right:0px;}.formIcn li {list-style:none; float:left; padding:0 8px 0 4px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/line_right.png) no-repeat right 2px; font-size:12px; color:#404e5d;}.formIcn li:last-child {background:none;}.formIcn li span {display:none;}.formIcn li a {padding:10px;}.icnSave {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -53px -544px; padding-left:21px;}.icnComm {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -113px -544px; padding-left:21px;}.icnView {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -173px -544px; padding-left:21px;}.icnSend {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -233px -544px; padding-left:21px;}.icnList {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -293px -544px; padding-left:21px;}.icnReceipt {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -354px -544px; padding-left:20px;}.icnHistory {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -413px -543px; padding-left:20px;}.mainbox { position:absolute; /*bottom:0px;*/ left:110px; right:0px; bottom:3px; top:104px;}.main_list {float:left; width:478px; border:1px solid #dedede; overflow-y:auto;}.timeLine {margin:0 0px 0px 29px; height:769px; overflow:auto;}.myList {margin:0; padding:0; }.boxin_view {max-width:668px; left:480px; right:0px; position:absolute;  height:774px; overflow-y:auto;  overflow-x:hidden; border-top:1px solid #dedede; }.layoutHam {margin:-3px 0 0 0; list-style:none; padding:0; }.layoutHam li {list-style:none; }.layoutHam .hamBox {float:left; width:334px; height:386px; border-bottom:1px solid #dedede; border-right:1px solid #dedede;  margin:0 0 -1px -1px;}.mainUser {display:inline-block; margin:19px 0 0 29px; width:420px; padding-bottom:17px; border-bottom:1px solid #eeeeee;}.mainUser li {list-style:none; float:left; padding-right:8px;}.mainUser li:last-child {padding-right:0;}.top_n_menu .mainPro {width:50px; height:50px;}.top_n_menu .subUser dt {margin-top:-5px;}.top_n_menu .userName {margin-top:-5px;}.top_n_menu .userTeam { margin-top:12px;}.top_main .mainPro {width:50px; height:50px;}.top_main .subUser dt {margin-top:-5px;}.top_main .userName {margin-top:-5px;}.top_main .userTeam { margin-top:12px;}.mainPro {border-radius:50%; width:40px; height:40px; left:50%; top:50%; overflow:hidden; display:inline-block; border:1px solid #dcdcdc;}.mainPro02 {border-radius:50%; width:50px; height:50px; left:50%; top:50%; overflow:hidden; display:inline-block; border:1px solid #dcdcdc;}.mainAdmin {margin-top:5px; display:none;}.mainAdmin a {width:35px; height:35px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat 0px -666px; border-radius:50%; border:1px solid #d6d6d6; text-indent:-20000px; display:inline-block;}.subUser {display:block;  padding:11px 15px 17px 0px; height:38px; line-height:38px; border-bottom:1px solid #222; margin:0px;}.subUser dt {float:left; padding-right:13px; margin-top:0px;}.subUser dd {float:left; padding-right:8px;}.subUser dd:last-child {padding-right:0; float:right;}.rightMenu {padding-top:0px; margin:0px;}.rightMenu > li {list-style:none; float:left; color:#666; padding:0 8px; font-size:12px; background: url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/line_right.png) no-repeat right center;}.rightMenu > li a { color:#666;}.rightMenu > li:last-child {background:none; padding-right:0;}.subLang {position:absolute; line-height:20px; margin-top:3px;}.userName {color:#444; font-weight:bold; margin:0; font-size:12px; text-overflow:ellipsis; white-space:nowrap; width:110px; overflow:hidden;}.userName span {font-size:14px;}.userTeam {margin:19px 0 0 -4px; position:absolute; /*left:69px;*/ left:110px; color:#666; font-size:12px; text-overflow:ellipsis; white-space:nowrap; width:110px; overflow:hidden;}.topLang {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat 36px -244px; padding-right:13px;}.topLogout {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -480px -688px; padding-left:20px; vertical-align:middle;}.myTitle {display:inline-block; width:420px; height:22px; font-size:19px; color:#000; margin:21px 0 10px 0;}.myMore{width:55px; height:35px; display:inline-block; text-indent:-20000px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat 11px -835px; float:right; margin:-10px 0 0 0;}.myDD {width:100%;}.mTime {width:420px; text-align:center; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dot_gry.png) repeat-x 0 65%;}.mTime span {display:inline-block; background:#fff; padding:4px 10px; margin:12px 0 5px 0; font-size:11px; color:#617180;}.mComment, .mComplete, .mArrive, .mReturn {width:420px; margin-bottom:2px;}.mComment td {background:#f3f6fa; padding:13px 22px; line-height:19px;}.mComment th {width:100px; background:#626f7e; text-align:center;  font-weight:bold; color:#fff; padding-top:7%;}.mComment th span {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/bg_comm.png) no-repeat center 5px; padding:40px 5px 0 5px;}.mComplete td {background:#f3f6fa; padding:13px 22px; line-height:19px;}.mComplete th {width:100px; background:#70b0e0; text-align:center;  font-weight:bold; color:#fff; padding-top:7%;}.mComplete th span {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/bg_compl.png) no-repeat center 5px; padding:40px 5px 0 5px;}.mArrive td {background:#f3f6fa; padding:13px 22px; line-height:19px;}.mArrive th {width:100px; background:#70c1b6; text-align:center;  font-weight:bold; color:#fff; padding-top:7%;}.mArrive th span {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/bg_arriv.png) no-repeat center 5px; padding:40px 5px 0 5px;}.mReturn td {background:#f3f6fa; padding:13px 22px; line-height:19px;}.mReturn th {width:100px; background:#e58076; text-align:center;  font-weight:bold; color:#fff; padding-top:7%;}.mReturn th span {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/bg_return.png) no-repeat center 5px; padding:40px 5px 0 5px;}.mLine {padding:0;}.mTit {font-size:14px; color:#444; margin-bottom:1px;}.tBlue {color:#0089e8; font-weight:bold;}.mName {color:#888; font-size:13px;}.mClock {color:#888; font-size:12px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -484px -893px; padding-left:15px;}.hamTit {margin:-4px 29px 17px 29px; height:25px;}.boxScroll {float:left; width:305px; height:305px; margin-left:29px; overflow:auto;}.boxScroll ul:last-child { margin-bottom:0 !important;}.hamTxt {font-size:20px; color:#000; padding-top:4px; float:left;}.mNum {border-radius:50%; display:inline-block; width:26px; height:22px; padding-top:4px; background:#43a8fa; color:#fff; text-align:center; margin-left:8px; font-size:12px;}.mMore {width:55px; height:35px; display:inline-block; text-indent:-20000px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat 11px -835px; float:right; margin:-3px 0 0 0;}.AXanchorSelectorHandleContainer {display:none;}.AXTree_none .AXTreeScrollBody .AXTreeBody .treeBodyTable tbody tr td .bodyNode .bodyNodeIcon {display:none;}.smSave {text-indent:0;display:inline-block;position:relative;background:#566472 !important;outline:0;border:1px solid #566472;color:#fff;min-width:30px;height:26px;padding:0px 5px 1px 5px;border-radius:3px;font-size:13px;line-height:26px;text-align:center;vertical-align:middle;cursor:pointer;box-sizing:content-box;}.bgPop {display:inline-block; width:100%; margin:10px 0px 0px 0px; padding:10px 0; text-align:center; background:#f1f6f9;}.editList {position:relative; margin:5px 10px; display:inline-block;}.editList dt {float:left; margin-right:5px; line-height:30px;}.editList dd {margin:0px 5px 0px 0px; float:left;}.editList dd:first-child {mragin-left:0 !important;}.inputDel {position:absolute; margin-left:-30px; text-indent:-20000px; display:inline-block; width:30px; height:30px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat 1px -265px; }.borderLine {border:1px solid #e4e4e4;}.treeBox {display:inline-block; width:100%; margin:0px;}.treeTop {background:#f8f8f8; border-bottom:1px solid #e4e4e4;}.treeBot {width:100%; overflow:auto; margin:0px;}.mar10{margin:10px;}.treeBtn {padding:10px;}.gianList01 li {list-style:none; height:26px;}.mlm {margin-left:-1px !important;}.sEdit {width:46px; height:20px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -165px -393px; border:none !important; margin:100px 0 0 -95px;}.radioBtn {display:inline-block; vertical-align:middle; margin:0px; padding:0px;}.radioBtn dt {display:inline-block; margin-right:-1px; float:left; height:29px; line-height:29px; min-width:56px; border:1px solid #c6c6c6; padding:0px 5px 0 5px; border-radius:3px 0px 0px 3px; color:#444444; background:#fff; text-indent:0 !important; cursor:pointer;}.radioBtn dd {display:inline-block; margin:0px; height:29px; line-height:29px; min-width:56px; border:1px solid #c6c6c6; padding:0px 5px 0 5px; border-radius:0px 3px 3px 0px; color:#444444; background:#fff; text-indent:0 !important; cursor:pointer;}.radioBtn dd input {margin-right:3px;}.AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tbody tr.noListTr td { border-bottom:0px; background-color:#fff;}.AXGrid .AXgridScrollBody{border-bottom:0px;}.AXGrid .AXgridScrollBody .AXGridColHead .colHeadTable tbody tr td .colHeadTdCheck { padding-top:6px !important;}.AXGrid .AXgridPageBody {border-top:1px solid #ccc;}.AXGrid .AXgridScrollBody .AXGridColHead .colHeadTable tbody tr td .colHeadTdText { font-weight:bold;}.coviGrid .AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tbody tr.line1 td {height:30px;}.coviGrid .AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tbody tr.line0 td {height:30px;}.coviGrid .AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tbody tr td { background:none; border-bottom:1px solid #ededed;}.AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tbody tr td {border-bottom:1px solid #ededed;}.coviGrid .AXGrid .AXgridScrollBody .AXGridColHead .colHeadTable tbody tr td .colHeadTdText {padding-top:4px !important; font-size:12px;}.coviGrid .AXGrid .tdRelBlock { height:30px !important;}.coviGrid .AXGrid .AXgridScrollBody .AXGridColHead .colHeadTable tbody tr td { height:30px !important;}.AXGrid .AXgridScrollBody { border-top:1px solid #acaeb2;}.coviGrid .AXGrid .AXgridScrollBody .AXGridColHead { border-bottom:0px;}.tabCont {margin:0px 15px 0px 15px;}.coviGrid .listLinePlus { width:100% !important; table-layout:fixed;}.coviGrid .listLinePlus thead th {border-top:1px solid #acaeb2; height:30px; background-color:#f9f9f9; border-bottom:1px solid #dedede; font-weight:bold; font-size:12px; color:#5e5e5e;}.coviGrid .listLinePlus td {border-bottom:1px solid #dedede; padding:7px 0px 7px 0px; vertical-align:middle; background-color:#fff;}.appProList { display:inline-flex; white-space:nowrap; width:auto; border:1px solid #dedede; border-radius:5px;}.top_n_menu {position:fixed; z-index:200; min-width:900px; background-color:#fff; padding-top:17px; margin-top:-17px; right:0px; left:90px; padding-left:40px; padding-right:40px; padding-bottom:20px;}.top_main {position:fixed; z-index:200; max-width:1148px; background-color:#fff; padding-top:17px; margin:-17px 0 0 -20px; right:0px; left:90px; padding-left:40px; padding-right:40px;}.top_main > .subUser {min-width:782px; border-bottom:1px solid #222 !important; line-height:38px;}.comment {display:inline-block; width:18px; height:16px; text-indent:-20000px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -218px -7px; margin:1px 0 0 2px;}.bgDot { white-space:nowrap;display:inline-block; height:20px; text-indent:10px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -493px -850px;}.daeLeft {display:inline-block; width:63%; min-width:600px; border:1px solid #e8e8e8; box-shadow:1px 1px 4px #ccc; border-radius:3px;}.daeTop {font-size:14px; font-weight:bold; height:44px; border-bottom:1px solid #d8dde3; padding-left:43px; line-height:42px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -462px -972px #fafbfd}.daeBot {width:100%; margin:0px; padding:0px;}.swOn {text-indent:0; border:none !important; cursor:pointer; width:35px; height:22px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -336px -602px; margin-left:8px;}.swOff {text-indent:0; border:none !important; cursor:pointer; width:35px; height:22px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -379px -602px; margin-left:8px;}.daeLine {margin:15px;}.daeLine dd {line-height:34px; margin:0 10px 0 0;}.daeLine dt {line-height:34px; width:15%; margin:0 10px 0 0; height:20px; text-indent:10px; float:left; display:inline-block; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -493px -850px;}.daeR {width:12%; float:right; text-indent:10px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -493px -850px;}.daeLine dd:last-child {width:81%; margin-bottom:15px; float:left;}.adSearch {width:150px; float:left;}.searchBtn {position:absolute; display:inline-block; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -3px -162px !important; margin:3px 0px 0 -30px; text-indent:-20000px; width:30px; height:30px;}.adDate {width:100px;}.adTArea {width:100%;}.pwRight {float:right; display:inline-block; min-width:290px; width:36%; min-width:280px; border:1px solid #e8e8e8; box-shadow:1px 1px 4px #ccc; border-radius:3px;}.pwTop {font-size:14px; font-weight:bold; height:44px; border-bottom:1px solid #d8dde3; padding-left:43px; line-height:42px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -462px -937px #fafbfd}.pwBot {width:100%; margin:0px; padding:0px;}.adLayout { margin:0px; padding:0px;}.pwLine {margin:0px; padding:0px;}.pwLine dt {width:18%; float:left; margin:15px 0 15px 15px;}.pwLine dd {width:55%; float:right; text-align:right; margin:15px 15px 15px 0;}.pwLine dt,.pwLine dd {display:inline-block; line-height:34px;}.adWrap {min-width:980px;}.adPw {width:100%}.adSound {display:inline-block; margin-top:15px; width:100%; padding-bottom:20px; border:1px solid #e8e8e8; box-shadow:1px 1px 4px #ccc; border-radius:3px; margin-bottom:10px;}.sounTop {font-size:14px; font-weight:bold; height:44px; border-bottom:1px solid #d8dde3; padding-left:43px; line-height:42px; background:url("/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png") no-repeat -462px -1010px #fafbfd}.rouBtn {font-size:12px; line-height:25px; padding:2px 13px 6px 14px; margin:-1px 0 0 8px; background:#51a9f0; color:#fff; vertical-align:middle; border-radius:15px; height:21px; display:inline-block;}.rouBtn input {margin:-1px 3px 0 0;}.sounBot {width:100%; margin:0px; padding:0px;}.adLayout li {list-style:none; display:inline-block; width:50%; float:left;}.adTWrap01 {padding:20px 20px 0px 20px;}.adTWrap02 {padding:20px 40px 0px 20px;}.adTWrap03 {padding:20px 20px 15px 40px;}.adTWrap04 {padding:20px 40px 30px 20px;}.soundTable {width:100%; border-top:1px solid #dcdcdc;}.soundTable th {font-size:13px; text-align:left;  font-weight:normal; border-bottom:1px solid #dcdcdc; border-right:1px solid #dcdcdc; padding:5px 8px; line-height:20px; height:20px; width:155px;}.soundTable td {font-size:12px; color:#666; border-bottom:1px solid #dcdcdc; padding:5px 8px; line-height:20px; height:20px; vertical-align:middle;}.soundTable th > span {float:left;}.soundTable th > input {float:right;}.soundTable td > input {margin:0 6px 0 15px;}.icnDate {position:absolute; display:inline-block; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat 0px -1px !important; font-size:0; margin:3px 0px 0 -30px; text-indent:-20000px; width:30px; height:30px;}.t_padding .icnDate {margin-top:0;}.t_padding .searchBtn {margin-top:0;}.dateSel {line-height:34px;}.bodyMenu {margin:93px 0 10px 0;}.tPadd {padding:20px;}.polTree { margin:0px; padding:0px;}.polTop {padding:10px 0px 10px 0px; border-bottom:1px solid #e8e8e8;}.polTree > dt {line-height:40px; border-bottom:1px solid #e8e8e8; padding:0px 3px 0px 0px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -389px -1169px; color:#222; font-weight:bold; clear:both;}.polTree > dt > input {vertical-align:top; margin-top:5px;}.polWidth {height:40px; text-indent:-20000px; display:inline-block; padding-left:34px;}.polName01 {width:113px; display:inline-block; line-height:18px; margin-top:10px; word-break:break-all;}.polName02 {word-break:break-all;}.polPlus {float:right; width:30px; height:30px; margin:5px 0px 0 0; text-indent:-20000px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -433px -1070px;}.polTree > dd {width:100%; border-bottom:1px solid #e8e8e8; margin:0px; padding:0px;}.polSub  {padding:5px 0px 5px 20px; margin:0px;}.polSub li {list-style:none; }.polSub li > input {vertical-align:top; margin:0px; padding:0px;}.polSub li a {line-height:24px; word-break:break-all; width:127px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -468px -1148px; padding:0px 0 0px 33px; display:inline-block;}.tView {width:30px; line-height:28px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -326px -466px; text-indent:-20000px; display:inline-block; margin-right:2px;}.tEllip {width:100%; display:inline-block; text-overflow:ellipsis; white-space:nowrap; word-break:break-all; overflow:hidden;}.signWrap {position:relative; float:left; width:140px; margin:32px 24px;border:2px solid #d8dde3;}.signWrap:hover {position:relative; width:140px; border:2px solid #5cacec; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/sign_delete.png) no-repeat right top;}.signBox {font-size:13px; color:#666; margin:0px; padding:0px;}.signBox li {list-style:none; display:inline-block; width:140px; border-bottom:1px solid #d8dde3; height:30px; line-height:30px; text-align:center; color:#666;}.sigFill {height:120px !important; line-height:120px !important;}.signBox li:last-child {border-bottom:none !important; font-size:12px;}.stand {position:absolute; left:-1px; top:-1px; width:41px; height:21px; line-height:21px; display:inline-block; background:#5cacec; color:#fff; font-size:12px; text-align:center;}.signDel {position:absolute; right:0; top:0; width:21px; height:21px; text-indent:-20000px;}.signAdd {display:inline-block; margin:32px 24px; width:142px; height:213px;  text-align:center; line-height:200px;border:2px solid #d8dde3; background:#fcfcfc; text-align:center;}.signAdd a {display:inline-block;width:80px; height:80px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat 0px -1114px; text-indent:-20000px; margin-top:72px;}.popSign { border:1px solid #d8dde3; width:140px; background:#fff;}.signPopL {float:left; width:170px;}.signPopR {display:inline-block; float:left; text-align:left; margin-top:26px; line-height:26px;}.btnAdd {display:inline-block;	height:30px; padding:1px 7px 2px 15px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -472px -1070px #fff; border:1px solid #cbd4d9; color:#000; border-radius:3px; font-size:13px; text-align:center; cursor:pointer;}.btnEra {display:inline-block;	height:30px; width:33px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -262px -394px #fff; border:1px solid #cbd4d9; border-radius:3px 0px 0px 3px !important; cursor:pointer; text-indent:-20000px; margin-right:-4px;}.btnDel {display:inline-block;	height:30px; width:33px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -322px -393px #fff; border:1px solid #cbd4d9; border-radius:0px !important; cursor:pointer; text-indent:-20000px; margin-right:-5px;}.btnRefr {display:inline-block;	height:30px; width:33px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -379px -392px #fff; border:1px solid #cbd4d9; border-radius:0px 3px 3px 0px !important; cursor:pointer; text-indent:-20000px;}.selBox {position:relative; display:inline-block; min-width:49px; color:#444; font-size:13px; line-height:24px; margin-right:18px; vertical-align:middle;}.selTit a {position:relative; width:100%; display:inline-block; height:26px; padding:2px 8px 0px 8px; border-radius:3px; border:1px solid #c6c6c6;  background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-slide-down-arrow02.png) no-repeat right center #fff; z-index:2; cursor:pointer;}.selTit a:hover {border:1px solid #777;}.selTit a.down {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-slide-down-arrow04.png) no-repeat right center #fff;}.selList {position:absolute; display:block; margin-top:-1px; border-radius:0px 0 3px 3px; border:1px solid #c6c6c6; background:#fff; cursor:pointer; white-space:nowrap; z-index:8;}.selList .select {background:#f5f5f5; color:#444;}.listTxt {display:block; color:#666; padding:1px 8px; text-decoration:none !important;}.listTxt:hover {background:#59abee; color:#fff;}.addDataBtn {margin:5px 10px; border-bottom:1px solid #ddd; padding-bottom:10px;}.addData {margin:5px 10px;}.addData dl {line-height:25px; display:block; height:26px; padding:0 10px;}.addData dl:hover {background:#f1faff;}.addData dt {display:inline-block; float:left; line-height:20px; width:70%;}.addData dt input {border-color:#c6c6c6 !important;}.addData dd {display:inline-block; float:right; text-align:right; width:29%;}.exCel {display:inline-block; width:24px; height:24px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -84px -840px; text-indent:-20000px; margin:2px 0px 0 5px;}.pPoint {display:inline-block; width:24px; height:24px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -84px -861px; text-indent:-20000px; margin:2px 0px 0 5px;}.woRd {display:inline-block; width:24px; height:24px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -84px -884px; text-indent:-20000px; margin:2px 0px 0 5px;}.etcFile {display:inline-block; width:24px; height:24px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -140px -840px; text-indent:-20000px; margin:2px 0px 0 5px;}.teXt {display:inline-block; width:24px; height:24px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -140px -862px; text-indent:-20000px; margin:2px 0px 0 5px;}.imAge {display:inline-block; width:24px; height:24px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -140px -884px; text-indent:-20000px; margin:2px 0px 0 5px;}.fileHover {width:100%; border:none !important;}.fileHover td {padding:0px !important; border:none !important;}.fileHover tr td:first-child {padding-left:10px !important;}.fileHover tr td:last-child {padding-right:10px !important;}.fileHover tr:hover {background:#f1faff; cursor:pointer;}.t_right {text-align:right !important;}.excelData {margin:5px 0px; clear:both; line-height:29px;}.excelData dd {float:right; margin:0px 0px 2px 0px;}.excelData dt {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -460px -324px; line-height:21px; float:left; width:70%; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;}.excelData dt span {font-size:13px; color:#888888;}.table_th_f {z-index:1; margin-top:-1px;}.table_td_f {}.rightFixed { height:40px; background:#fff; padding:10px 20px 0 24px; display:none;}.xbar {width: 4px; height: 100%; bottom: 0px; background-color:#fff; border-left:1px solid #d2d7de; border-right:1px solid #d2d7de; position: absolute; cursor: ew-resize; z-index:2;}.gridBodyTr.gridBodyMarker .bodyTd { background-color:#f6fafb !important;}.gridBodyTr.gridBodyMarker .bodyNode.bodyTdText { background-color:#f6fafb;}.appProList { background-color:#fff;}.content_in a { cursor:pointer;}.btn_group.job_wrap { margin-bottom:6px;}.btn_group.bizdoc_wrap { margin-bottom:6px;}.btn_group.Audit_wrap { margin-top:-7px;}.topstit_n { font-size:12px; color:#666; vertical-align:middle; margin-left:12px;  padding-left:15px;background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/topstit.png) no-repeat left 2px;}.AXanchorSwitchBox.on { height:18px !important; width:33px !important;}.AXanchorSwitchBox{ height:18px !important; width:33px !important;}.AXanchorSwitchBox .AXanchorSwitchHandle { width:16px  !important; height:16px  !important; top:1px !important; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-switch.png) no-repeat 0px !important;}.AXanchorSwitchBox.on .AXanchorSwitchHandle { width:16px  !important; height:16px  !important; top:1px !important; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-switch.png) no-repeat 0px !important;}.AXanchorSwitchBox.on { background-color:#727c8c !important; border-color:#727c8c !important}.AXanchor { float:right;}.daeTop .AXanchor { margin-top:12px; margin-right:15px;}.pwTop .AXanchor { margin-top:12px; margin-right:15px;}.popBox { margin-top:0px;}.fRight .AXInput.W85 { width:100px;}.AXanchorSelect .selectBoxArrow.on {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/dx-slide-down-arrow04.png) center center no-repeat;}.appBox .AXTree_none .AXTreeScrollBody .AXTreeBody .treeBodyTable { width:auto !important; }.appBox .treeScrollContent{ width:auto !important;}.dragFileBox {width:100%; height:117px; line-height:40px; text-align:center; display:inline-block; padding-top:9px;}.dragFile {width:30px; height:30px; margin-top:36px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -472px -812px; display:inline-block; text-indent:-20000px;}.AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable thead tr td .bodyTdCheckBox, .AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tbody tr td .bodyTdCheckBox, .AXGrid .AXgridScrollBody .AXGridBody .gridBodyTable tfoot tr td .bodyTdCheckBox { height:23px;}.gridLine05 {width:100%; height:200px; overflow:auto; margin-bottom:10px;}.gridLine10 {width:100%; height:400px; overflow:auto; margin-bottom:10px;}.ly_close {width:30px; height:27px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/ico_pop.png) no-repeat -119px -10px;}.ly_close:hover {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/ico_pop.png) no-repeat -255px -10px;}.ly_close img {display:none;}.alert_header_ico {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -460px -206px !important;}.layer_alert .alert_header {background:#3a4450 !important;}.layer_alert .alert_content {border:1px solid #222 !important;}.t_padding {margin:20px 40px;}.t_padding > table {width:100%;}.linePlus th {border-top:1px solid #c3d7df !important;}.AXButton {font-size:12px; text-indent:0; text-indent:0; background:#fff !important; border:1px solid #c6c6c6; color:#444; min-width:54px; height:26px; padding:0px 4px 2px 4px; border-radius:3px;}.AXButton:hover{border:1px solid #777; color:#222 !important; background:#fff !important;}.form_wrap { width:100%;}.wordCont { position:absolute; top:80px; bottom:0px; width:100%;}.form_box { width:100%; overflow:auto; display:block; height:100%;}.apptit_h2 {color:#3b3b3b; font-size:27px; font-weight:bold; margin:10px 0 30px 0; display:block; text-align:center;}.apptit_h3 {width:100%; display:block; color:#fff; background-color:#636d7e; height:24px; line-height:24px; padding:5px 0px 5px 0px; margin:4px 0;}.apptit_h3 span {padding-left:23px; display:inline-block; font-weight:bold; font-size:14px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -448px -445px;}.fileAdd {display:inline-block; text-indent:0; border-radius:20px !important; border:1px solid #fff; padding:0px 10px 1px 25px; height:28px; color:#fff; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -135px -906px #636d7e; float:right; margin:-2px 16px 0 0; font-size:12px; cursor:pointer;}.apptit_h4 {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -460px -410px; padding-left:24px; color:#333333; line-height:25px; font-weight:bold;}.titIcn {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -447px -363px; margin:0px; padding:6px 0 6px 32px; float:left; color:#444; font-size:14px; font-weight:bold; line-height:16px; text-align:left;}.persTable td.on {background:#fff; font-weight:bold; border-right:1px solid #d3d8df; font-size:14px;}.persTable td.off {font-weight:bold; border-right:1px solid #d3d8df; font-size:14px;}.persTable td:last-child {border-right:none;}.titBtn {border:none !important;display:inline-block;position:relative;height:20px;margin:0;padding:1px 8px 3px 3px;background:#419de8;color:#fff;border-radius:3px;outline:0;font-size:13px;text-align:center;vertical-align:middle;box-sizing:content-box;cursor:pointer;}.previewBtn {display:inline-block;position:relative;height:22px;margin:0;padding:1px 5px 2px 25px !important;border:1px solid #c6c6c6;border-radius:3px;outline:0;color:#444444;font-size:13px;line-height:22px;vertical-align:middle;cursor:pointer;box-sizing:content-box;background:#fff url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -3px -164px !important;}.previewBtn:hover {border:1px solid #777;}.staron, .staroff {position:absolute; right:0; top:0;}.staron a {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -430px -90px; width:47px; height:48px; display:block; text-indent:-20000px;}.staroff a {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -370px -90px; width:47px; height:48px; display:block; text-indent:-20000px;}.boxStyle {width:100%; border-collapse:collapse; border-spacing:0;}.boxStyle thead td , .boxStyle tbody td { color:#404e5d;border:1px solid #cfd5dc;font-size:13px;background:#fff;line-height:18px;}.boxStyle a {display:block; padding:14px;width:33%; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;}.boxStyle td:hover , .boxStyle a:hover { background:#4497dc;color:#fff !important;cursor:pointer;}iframe.paperView {border:1px;}.wordTop {border-bottom:1px solid #cfd5dc; background:#f3f7f9; display:inline-block; z-index:100; width:100%; }.topWrap { padding:10px 20px;}.wordCheck {position:absolute; right:0; top:12px; margin-right:40px; }.borLine {border:1px solid #eaeaea;}.zoominout { position:absolute; left:50%; margin:-25px 0 0 -25px; z-index:105;}.plus {border-radius:0 !important; position:absolute; display:block; text-indent:-20000px; z-index:105; width:25px; height:25px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -341px -51px; cursor:pointer;}.minus {border-radius:0 !important; position:absolute; display:block; text-indent:-20000px; z-index:105; width:25px; height:25px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -371px -51px; margin-left:25px; cursor:pointer;}.wordView {position:relative; text-align:center;}.zoominout li {list-style:none; float:left; display:inline-block;}.zoominout li:last-child {margin-left:-1px;}.wordLayout td:first-child {}.wordLeft {padding:20px;}.wordLayout {width:100%; min-width:600px;}.wordRight p {text-align:center; margin-top:25px;}.wordForm input {height:22px;}.wordForm select {height:24px;}.wordForm {float:right; margin-bottom:5px;}.signArea {height:65px !important; font-style:italic; font-size:15px; font-weight:bold;}.signArea02 {height:92px !important; font-style:italic; font-size:15px; font-weight:bold;}.appTree {float:left; width:189px; margin-right:10px; border:1px solid #d3d8df; padding:10px; height:470px; }.appTreeTop {position:absolute; width:209px; height:40px;}.appTreeBot {margin-top:42px; z-index:100; overflow:auto; height:430px;}.appTree .treeBodyTable input {margin-right:4px; margin-left:-20px !important;}.appLinebox {clear:both;}.appList {float:left; width:276px; height:491px; border-left:1px solid #d3d8df; border-right:1px solid #d3d8df; border-bottom:1px solid #d3d8df; overflow:auto;}.appInfo {float:left; width:450px; height:233px; margin:0px 0 10px 0;  border:1px solid #d3d8df;}#Apvlist {height:197px; overflow-y:auto;}.appInfo02 {float:left; width:450px; height:433px; margin:0px 0 10px 0; overflow:auto; border:1px solid #d3d8df;}.appPers {float:right; width:209px; height:433px; margin:56px 0px 0 0; border:1px solid #d3d8df; overflow-y:auto; overflow-x:hidden;}.appInfoBot {float:left; width:450px; height:188px; overflow:auto; border:1px solid #d3d8df; margin-bottom:10px;}.treeSelect {width:190px;}.appListTop {position:absolute; width:276px; height:40px;}.appListBot {margin-top:42px; width:100%; z-index:100; overflow:auto; height:449px;}.appListBot td {height:50px !important;}.appBtn {position:relative; float:left; width:109px; text-align:center; margin-top:156px;}.appTab {float:left; width:452px;}.popBtn {clear:both; width:100%; border-top:1px solid #b9c2cc; text-align:right; padding:15px 0px 15px 0px;}.appBox {/*height:609px;*/ margin:10px;}.AXTree_none .AXTreeScrollBody {border:none !important;}.AXTree_none .AXTreeScrollBody .AXTreeBody .treeBodyTable tbody tr td .bodyTdText {padding:1px 8px;}.appBtnSend {float:left; width:109px; margin-top:176px; text-align:center;}.appBtnSend02 {float:left; width:109px; margin-top:88px; text-align:center;}.appTab {float:left; width:452px;}.appOpen {position:absolute; right:0; top:50%; margin-top:-34px; width:20px; height:68px; display:block; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -430px -10px; text-indent:-20000px; z-index:105;}.appClose {position:absolute; right:220px; top:50%; margin-top:-34px; width:20px; height:68px; display:block; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -460px -10px; text-indent:-20000px; z-index:105;}.appTab .AXTabsLarge {margin-top:10px !important;}.listTitle {width:430px; border-bottom:1px solid #eaecef; background:#f8f8f8; height:26px; padding:9px 0 0 20px;}.infoTable td {height:40px !important;}.infoTable thead td {height:33px !important; background:#f8f8f8; padding:2px 0 0 20px;}.infoTable tbody tr:last-child td {border-bottom:1px solid #e9e9e9 !important;}.infoTable thead {border-top:none !important;}.infoTableBot td {height:30px !important;}.infoTableBot thead td {height:33px !important; background:#f8f8f8; padding:2px 0 0 20px;}.infoTableBot tbody tr:last-child td {border-bottom:1px solid #e9e9e9 !important;}.infoTableBot thead {border-top:none !important;}.persTable td {height:26px !important;}.persTable thead td {height:33px !important; background:#f8f8f8; padding:2px 0 0 20px;}.persTable tbody tr:last-child td {border-bottom:1px solid #e9e9e9 !important;}.persTable thead {border-top:none !important;}.persTable tr.persOn {background:#f8f8f8;}.btnWArea { background:#fff; z-index:105; width:430px; height:26px; padding:10px 20px 0 0; }.btnWArea02 {position:absolute; background:#fff; z-index:105; width:430px; height:26px; padding:10px 20px 0 0; bottom:77px;}.sendRight {background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -352px -479px; padding-right:18px; float:right; font-size:12px; color:#555;}.moreEnd {position:absolute; right:0px; background:url(/HtmlSite/smarts4j_n/covicore/resources/images/theme/icn_png.png) no-repeat -181px -84px; width:30px; text-indent:-20000px;}.form_wrap .conin_view {  border-right:0px;}.wordView { padding:20px;}';
		sBodyHTML += "</style>";
		sBodyHTML += "<body topmargin='0' leftmargin='0' scroll='auto' align='center' class='approval_form'>";
		sBodyHTML += frmHtml + "</body></html>";
	} else {
		sBodyHTML += "</style></head><body topmargin='0' leftmargin='0' scroll='auto' align='center' class='approval_form'>" + strBodyTable.innerHTML + "</body></html>";
	}

    return sBodyHTML;
}

// ie8을 제외한 ie9, ie10, chrome등에서 현재페이지에서 사용하는 스타일 가져오기
function getStyleChrome(sheet) {
    var style = "";
    var rules = sheet.rules || sheet.cssRules;
    for (var r = 0; r < rules.length; r++) {
        style += rules[r].cssText;
    }
    return style;
}

function getStyle(sURL, index) {
    var objStyle = "";
    if (document.styleSheets[index].cssText != null) {
        objStyle += document.styleSheets[index].cssText
    }
    return objStyle.replace("undefined", "");
}

// 직인가져오기
function getUsingOfficailSeal() {
	var sealPath = "";
	
	CFN_CallAjax("/approval/legacy/getGovUsingStamp.do", {"entCode":getInfo("AppInfo.etid")}, function (data){ 
    	var jsonData = data;
    	if(jsonData.error != undefined && jsonData.error != null){
    		Common.Error("Desc: " + jsonData.error);
    	}else{
    		if(jsonData.Table[0] != undefined) {
    			sealPath = jsonData.Table[0].FileInfo;
    		}
    	}
    },false,'json');
	
    return sealPath;
}

// 수신부서 부서완료함에서 회신을 했는지 확인(회신버튼 클릭시)
function checkReturnForm() {
    var pXML = "usp_wf_ReturnFormCheck";
    var aXML = "<param><name>reserved1</name><type>varchar</type><length>34</length><value><![CDATA[" + getInfo("FormInstanceInfo.FormInstID") + "]]></value></param>";
    var connectionname = "INST_ConnectionString";
    var sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
    var szURL = "../getXMLQuery.aspx";

    CFN_CallAjax(szURL, sXML, function (data) {
        receiveHTTPReturnForm(data);
    }, false, "xml");
}

function receiveHTTPReturnForm(responseXMLdata) {
    var xmlReturn = responseXMLdata;
    var elmlist = $(xmlReturn).find("response > NewDataSet > Table > CNT");
    var iCount = $(elmlist).text();

    if (iCount > 0) {
        bReturnForm = false;
    }
    else {
        bReturnForm = true;
    }
}

// 합의부서 시작
function requestProcessDCooAbort(szOUs) {
    try {
        var sTargetURL = "../InstMgr/DeleteAssistOUs.aspx";
        var sText = "<request>" + getDefaultJSON() + szOUs + "</request>";
        evalXML(sText);
        CFN_CallAjax(sTargetURL, sText, function (data) {
            receiveGeneralQuery(data);
            fnformmenuCallBack(gMessage170);
        }, true, "xml");
    } catch (e) {
        alert(gMessage73 + "\n" + e.description + "\nError number: " + e.number); // sMsgTitle+"하지
																					// 못했습니다.
    }
}

/*
 * 날짜 가감 함수 사용예 : 2009-01-01 에 3 일 더하기 ==> addDate("d", 3, "2009-01-01", "-");
 */
function addDate(pInterval, pAddVal, pYyyymmdd, pDelimiter) {
    var yyyy;
    var mm;
    var dd;
    var cDate;
    var oDate;
    var cYear, cMonth, cDay;

    if (pDelimiter != "") {
        pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");
    }

    yyyy = pYyyymmdd.substr(0, 4);
    mm = pYyyymmdd.substr(4, 2);
    dd = pYyyymmdd.substr(6, 2);

    if (pInterval == "yyyy") {
        yyyy = (yyyy * 1) + (pAddVal * 1);
    } else if (pInterval == "m") {
        mm = (mm * 1) + (pAddVal * 1);
    } else if (pInterval == "d") {
        dd = (dd * 1) + (pAddVal * 1);
    }

    cDate = new Date(yyyy, mm - 1, dd) // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가
										// 만들어짐.
    cYear = cDate.getFullYear();
    cMonth = cDate.getMonth() + 1;
    cDay = cDate.getDate();

    cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
    cDay = cDay < 10 ? "0" + cDay : cDay;

    if (pDelimiter != "") {
        return cYear + pDelimiter + cMonth + pDelimiter + cDay;
    } else {
        return cYear + cMonth + cDay;
    }
}
/* 지정 반송 check */
function fn_checkrejectedtoA() {
	if (getInfo("Request.subkind") == "T000") {
		var m_oApvList = $.parseJSON(document.getElementById("APVLIST").value);
		var elmRoot = $$(m_oApvList).find("steps");
		
		var oApprovedSteps;
		if (getInfo("Request.mode") == "RECAPPROVAL") {
			// oApprovedSteps =
			// $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step[routetype='approve']
			// > ou > person >
			// taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='completed'][kind!='charge']
			// , > step[routetype='approve'] > ou > role >
			// taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='completed'][kind!='charge']
			// ");
			oApprovedSteps = $$(elmRoot).find("division").has("taskinfo[status='pending']").find("> step[routetype='approve'] > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='completed']");
		} else if (getInfo("Request.mode") == "SUBAPPROVAL") { // /ou[taskinfo/@status='pending']/person[taskinfo/@kind='normal'
																// and
																// taskinfo/@status='inactive']
			oApprovedSteps = $$(elmRoot).find("division").has("taskinfo[status='pending']").find(">step").has("taskinfo[status='pending']").find("ou").has("taskinfo[status='pending'][piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find("> person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][kind!='conveyance'][status='completed']");
		} else {
			oApprovedSteps = $$(elmRoot).find("division").has("taskinfo[status='pending']").find("> step[routetype='approve'] > ou > person > taskinfo[kind!='charge'][kind!='review'][kind!='bypass'][kind!='skip'][status='completed']");
		}
		
		if (getInfo("SchemaContext.scRJTO.isUse") == "Y" && getInfo("SchemaContext.scRJTO.value") != "") {
			var iRJCnt = 0;
			var oRJSteps;
			
			if (getInfo("Request.mode") == "RECAPPROVAL") {
				oRJSteps = $$(elmRoot).find("division").has("taskinfo[status='pending']").find("> step[routetype='approve'] > ou > person > taskinfo[@rejectee='y']");
			} else if (getInfo("Request.mode") == "SUBAPPROVAL") {
				oRJSteps = $$(elmRoot).find("division").has("taskinfo[status='pending']").find("> step[routetype='consult'] > ou").has("taskinfo[status='pending'][piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").find("> person > taskinfo[rejectee='y'], > role > taskinfo[rejectee='y']");
			} else {
				oRJSteps = $$(elmRoot).find("division").has("taskinfo[status='pending']").find("step[routetype='approve']>ou").find("> person > taskinfo[rejectee='y'] , role > taskinfo[rejectee='y'] ")
			}
			
			iRJCnt = oRJSteps.length;
			if (iRJCnt >= parseInt(getInfo("SchemaContext.scRJTO.value"))) {
				return false;
			}
		}
		if (oApprovedSteps.length == 0) {
			return false;
		} else {
			var iApvCNT = 0;
			var szCode = "";
			var szName = "";
			
			$$(oApprovedSteps).concat().each(function (i, oTaskInfo) {
				var oStep = oTaskInfo.parent().parent().parent();
				if ($$(oStep).attr("allottype") != "parallel") {
					if ($$(oTaskInfo).attr("rejectee") != 'y') {
						iApvCNT++;
						szCode = $$(oTaskInfo).attr("wiid");
					}
				}
			});
			if (iApvCNT > 0) {
				return true;
			} else {
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 새창으로 띄우기 */
function openNewFormWindow() {
    var sSize = "scroll"; var iWidth = 790; var iHeight = window.screen.availHeight - 100; // sUrl="PreView.aspx";
    var sUrl = String(document.location.href);
    sUrl = sUrl.replace("FormWrite", "Form"); // 바닥 작성창에서 Open할 경우
    // sUrl = sUrl.replace("openMode=L", "openMode=W"); //
    // sUrl = sUrl.replace("openMode=P", "openMode=W"); //
    if (sUrl.lastIndexOf("#") == (sUrl.length - 1)) { sUrl = sUrl.substring(0, sUrl.lastIndexOf("#")); } // url에
																											// #이
																											// 포함되어
																											// 있음
																											// 제거처리
    if (sUrl.lastIndexOf("openMode=") == -1) { sUrl = sUrl + "&openMode=B"; }
    
    // 미리보기 파라미터 제거
    sUrl = sUrl.replace("&listpreview=Y", "");
    
    // sUrl = sUrl + "&Readtype=openwindow";
    // mode = DRAFT
    var mode = CFN_GetQueryString("mode");
    if(mode == "DRAFT"){
        Common.Confirm(coviDic.dicMap.msg_Mail_WritingContentsMayDeleted, 'Confirmation Dialog', function (result) {
        if (result) {
            CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);  // 윈도우팝업창으로
																// 띄울것이므로 현재창에서
																// 바로띄움(HIW)
    } else {
            self.close();
    }
    });
    } else {
        CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
    }
}


function print_part(frame) {

    if (AUTO_OBJECT == 2) { objectRun(); }

    try {
        Printmade.Run(DEFAULT_OPTION + " /fid:'" + frame + "'");
    }
    catch (e) {
        alert(ERR_MSG);
    }

}

// 즐겨찾기 버튼 저장 이벤트 추가 시작
function favorform(szmode) {
	var url;
	var FormID = getInfo("FormInfo.FormID");
	
	if(szmode == "delete"){
		url = "user/removetFavoriteUsedFormListData.do";
	}else if(szmode == "insert"){
		url = "user/addFavoriteUsedFormListData.do";
	}			
	var Params = {
			userCode : sessionObjFormMenu["USERID"],
			formID : FormID
	};	
	
	$.ajax({
		url:url,
		type:"post",
		data:Params,
		async:false,
		success:function (data) {
			if (szmode == "insert") {
				document.getElementById("favorformadd").style.display = "none";
                document.getElementById("favorformdelete").style.display = "";
            } else {
                document.getElementById("favorformadd").style.display = "";
                document.getElementById("favorformdelete").style.display = "none";
            }
			
			Common.Inform(coviDic.dicMap.msg_apv_117);
			opener.CoviMenu_GetContent(opener.location.href.replace(opener.location.origin, ""),false);	// opener.location.reload();
		},
		error:function(response, status, error){
			CFN_ErrorAjax(url, response, status, error);
		}
	});

}

function receiveGeneralQuery_favorform(dataresponseXML) {
    var xmlReturn = dataresponseXML;
    var errorNode = $(xmlReturn).find("response > error");
    if (errorNode.length > 0) {
        Common.Error("Desc: " + $(errorNode).text());
        return;
    }
    else {
        Common.Inform(coviDic.dicMap.msg_117, 'Information Dialog', function (result) {// 성공적으로
																						// 저장되었습니다.....
            display_favoritBtn();

        });
    }
}

function display_favoritBtn() {
    var sItems = "<request>";
    sItems += "<usid>" + getInfo("AppInfo.usid") + "</usid>";
    var sUrl = "favorform_view.aspx";
    sItems += "</request>";

    CFN_CallAjax(sUrl, sItems, function (data) {
        receivefavorform_view(data);
    }, true, "xml");
}

function receivefavorform_view(dataresponseXML) {
    var xmlReturn = dataresponseXML;
    var errorNode = $(xmlReturn).find("response > strFMID");

    // 즐겨찾기 버튼 (비)활성화 추가 시작
    var szfmid = null;
    var bExist = false;
    szfmid = getInfo("FormInfo.FormID");


    if (errorNode.length == 0) {
        bExist = false;

    } else {
        var favor_value = errorNode.text().split("^");
        for (var i = 0; i < favor_value.length; i++) {
            if (szfmid == favor_value[i])
                bExist = true;
        }
    }

    if (bExist) {
        document.getElementById("favorformadd").style.display = "none";
        document.getElementById("favorformdelete").style.display = "";
    } else {
        document.getElementById("favorformadd").style.display = "";
        document.getElementById("favorformdelete").style.display = "none";
    }
    // 즐겨찾기 버튼 (비)활성화 추가 끝
}
// 즐겨찾기 버튼 이벤트 추가 끝

// 결재하기 창을 보여 줄지 말지 확인
var sSingimg = "";
function openApvActBasic(sAction) {

    var _return = false;
    return true;

    var connectionname = "ORG_ConnectionString";
    var pXML = "dbo.usp_PersonSetting_R";
    var aXML = "<param><name>PERSON_CODE</name><type>varchar</type><length>50</length><value><![CDATA[" + getInfo("AppInfo.usid") + "]]></value></param>";
    var sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
    var szURL = "../GetXMLQuery.aspx";
    var bActMSS = "N";
    var bIsPWD = "N";
    CFN_CallAjax(szURL, sXML, function (data) {
        var xmlReturn = data;
        var errorNode = $(xmlReturn).find("error");
        if (errorNode.length > 0) {
            Common.Error("Desc: " + $(errorNode).text());
        } else {
            bActMSS = $(xmlReturn).find("Table").find("ACT_MESSAGE_BOX_VIEW").text();
            bIsPWD = $(xmlReturn).find("Table").find("APPROVAL_PWD_IS_USE").text();
            sSingimg = $(xmlReturn).find("Table1").find("FILE_NAME").text();
        }
    }, false, "xml");

    // 1. [환경 설정]에 "결재시 확인팝업"이 "Y" 무조건 뜸
    if (bActMSS == "Y") {
        _return = true;
    }

    // 2. 결재비밀번호 입력 설정된 경우 뜸
    if (bIsPWD == "Y") {
        _return = true;
    }

    // 3. 최종결재자일경우 : 지시사항을 입력받기 위해 무조건 뜸
    if (getIsLast() == "true") {
        _return = true;
    }

    // 4. 서명이 2개 이상인 사용자일 경우 뜸

    return _return;
}

function fnShared() {
    var connectionname = "INST_ConnectionString";
    var pXML = "dbo.usp_wf_update_shareddate";
    var aXML = "<param><name>wiid</name><type>varchar</type><length>50</length><value><![CDATA[" + getInfo("Request.workitemID") + "]]></value></param>";
    var sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
    var szURL = "../GetXMLQuery.aspx";
    CFN_CallAjax(szURL, sXML, function (data) {
        var xmlReturn = data;
        var errorNode = $(xmlReturn).find("error");
        if (errorNode.length > 0) {
            Common.Error("Desc: " + $(errorNode).text());
        } else {
            fnformmenuCallBack(gMessage170);
        }
    }, false, "xml");
}

// 기록물철문서 이동(2013-10-14 HIW)
function fnMoveFolder() {
    var vSelPIIDs = "'" + getInfo("ProcessInfo.ProcessID") + "'";
    var sUrl = "/WebSite/Approval/Record/Client/DocBoxTreeSelect.aspx?mode=move&location=Doc&SelPIID=" + vSelPIIDs;

    var popwidth = 340;  // 팝업창 가로넓이
    var popheight = 400;  // 팝업창 세로넓이
    var height = screen.height;
    var width = screen.width;
    var left = width / 2 - (popwidth / 2);
    var top = height / 2 - (popheight / 2);

    window.open(sUrl, "OpenRecDocFolder", "toolbar=no,location=no,statusbar=no,menubar=no,scrollbars=yes,resizable=no,width=" + popwidth + ",height=" + popheight + ",left=" + left + ",top=" + top);
}

// 기록물철문서 삭제(2013-10-14 HIW)
function fnDeleteDoc() {

    Common.Confirm(coviDic.dicMap.msg_AreYouDelete, "Confirmation Dialog", function (result) {  // 삭제하시겠습니까?
        if (result) {
            try {
                // 선택한 문서 PIID들
                var vSelPIIDs = "'" + getInfo("ProcessInfo.ProcessID") + "'";
                var sPIIDsXML = "<request><PIIDs><![CDATA[" + vSelPIIDs + "]]></PIIDs></request>";
                evalXML2(sPIIDsXML);  // 유효성검사

                var url = "/WebSite/Approval/Record/CallBack.aspx";
                var param = "CODE=02";
                var objXML = DoCallback2(url, param, null, sPIIDsXML);

                var result = objXML.responseXML;
                var elmRoot = result.documentElement;

                if (result.xml == "") {
                    alert("[Error]\n\r\n\r" + objXML.responseText);
                    return false;
                }
                if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
                    alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
                    return false;
                }
                else {
                    Common.Warning(coviDic.dicMap.msg_ItsDone, "", function () {  // 처리되었습니다

                        opener.queryGetData();
                        self.close();
                    });

                }
            }
            catch (e) {
                alert(e.message);
            }
        }
    });

}

// 기록물철 분류팝업창 띄우기 (2013-10-14 HIW)
function OpenRecDocFolder() { 
    var popwidth = 340;  // 팝업창 가로넓이
    var popheight = 400;  // 팝업창 세로넓이
    var height = screen.height;
    var width = screen.width;
    var left = width / 2 - (popwidth / 2);
    var top = height / 2 - (popheight / 2);
    var sUrl = "/WebSite/Approval/Record/Client/DocBoxTreeSelect.aspx";  // HIW

    if (openMode == "L") { // 레이어 변경 작업 fmid openid
        sUrl = "/WebSite/Approval/Record/Client/DocBoxTreeSelect.aspx?openID=" + getInfo("FormInfo.FormID");
        parent.Common.ShowDialog("", "DivPop_", 'OpenRecDocFolder', sUrl , 340, 400, "iframe-ifNoScroll");
        // window.open(sUrl, "OpenRecDocFolder",
		// "toolbar=no,location=no,statusbar=no,menubar=no,scrollbars=yes,resizable=no,width="
		// + popwidth + ",height=" + popheight + ",left=" + left + ",top=" +
		// top);
    } else {
        // CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
        window.open(sUrl, "OpenRecDocFolder", "toolbar=no,location=no,statusbar=no,menubar=no,scrollbars=yes,resizable=no,width=" + popwidth + ",height=" + popheight + ",left=" + left + ",top=" + top);

    }
}

// SAP연동양식여부 구하기 (2013-10-14 HIW)
function GetIsLegacyForm() {
    var vIsSAP = "N";
    switch (getInfo("FormInfo.FormPrefix")) {
        case "MM10":
            vIsSAP = "Y"; break;
        case "MM20":
            vIsSAP = "Y"; break;
        case "MM40":
            vIsSAP = "Y"; break;
        case "JV10":
            vIsSAP = "Y"; break;
        case "FI10":
            vIsSAP = "Y"; break;
        case "FI20":
            vIsSAP = "Y"; break;
        case "FM10":
            vIsSAP = "Y"; break;
        case "FM20":
            vIsSAP = "Y"; break;
        case "FM30":
            vIsSAP = "Y"; break;

    }
    return vIsSAP;
}

// 해당문서의 기록물철폴더명 나타내기(2013-10-14 HIW)
function GetRecFolderName() {

    var url = "/WebSite/Approval/Record/CallBack.aspx";
    var param = "CODE=04&PIID=" + getInfo("ProcessInfo.ProcessID");

    var xml = DoCallback(url, param);
    var result = xml.responseXML;

    var elmRoot = result.documentElement;
    // debugger;
    if (SelectSingleNode(elmRoot, "result") != "SUCEESS") {
        alert("[Error]\n\r\n\r" + SelectSingleNode(elmRoot, "result"));
        return;
    }
    else {
        var vFolderNm = "";

        try {
            $(elmRoot).find("Table").each(function (i) {

                vFolderNm = $(this).find("FOLDER_NM").text();
            });

            if (vFolderNm != "") {
                $("#spnRecdocFolderNm").text(vFolderNm);
                $("#trRecDocFolderNm").show();
            }

        } catch (e) {
            alert(e.message);
        }
    }
}

// 2013.12.26 메일보내기 추가
function SendMailInBody() {
    ToggleLoadingImage();
    PcSave(true);
}

// 2013.12.26 메일보내기 추가
function CallBackSendMailInBody(strMailPDFInfo) {
    var strSubject = getInfo("FormInstanceInfo.Subject"); // 제목
    var l_editor = "#editor";
    var strHTML = "";
    strHTML += "<link type='text/css' rel='stylesheet' href='/HtmlSite/smarts4j_n/approval/resources/css/approval/approval_form.css' />"
    strHTML += $(l_editor).html();

    var strFileinfo = document.getElementById("ATTACH_FILE_INFO").value;
    if (strFileinfo != "") {
        strFileinfo = AttachFileBody(strFileinfo);
    }
    ToggleLoadingImage();
    XFN_PopupMailWrite("MailWirtePop", "APPROVAL", "", "", "", strSubject, "", "HTML", strMailPDFInfo + strFileinfo);
}

// 연동재실행팝업
function fnRerunAction() {
    var szURL = "/WebSite/ZAdmin/OperSystem/Approval/CfAdmin/Interlock_ReruntAction.aspx"/*
																							 * ?docid=" +
																							 * $("#" +
																							 * id_hidPIID).val()
																							 */;
    CFN_OpenWindow(szURL, '', 650, 403, "scroll")

}

function fnGoPreNextList(objid) {
    var sPiid = "";
    var sWiid = "";
    var sFiid = "";
    var sPtid = "";
    var sMeggage = "";
    var sCount = "";

    if(opener.strPiid_List == ""){
    	Common.Warning(coviDic.dicMap.msg_apv_refreshList, "Warning", function(){ Common.Close(); });
    }else{
	    if (openMode == "L") {
	        var aPiid_List = m_oInfoSrc.strPiid_List.split(";");
	        var aWiid_List = m_oInfoSrc.strWiid_List.split(";");
	        var aFiid_List = m_oInfoSrc.strFiid_List.split(";");
	        var aPtid_List = m_oInfoSrc.strPtid_List.split(";");
	    } else {
	        var aPiid_List = opener.strPiid_List.split(";");
	        var aWiid_List = opener.strWiid_List.split(";");
	        var aFiid_List = opener.strFiid_List.split(";");
	        var aPtid_List = opener.strPtid_List.split(";");
	    }
	    
	    var nPoint = 0;
	    var nTotal = aWiid_List.length - 1;
	
	    for (i = 0; i < nTotal; i++) {
	        if (aWiid_List[i] == "" || aWiid_List[i] == "0") {
	            if (aPiid_List[i] == getInfo("ProcessInfo.ProcessID")) {
	                nPoint = i;
	                i = nTotal;
	            }
	        } else {
	            if ('TCINFO' == getInfo("Request.gloct") && 'COMPLETE' == getInfo("Request.loct")) {   // [2016-01-25
																										// modi
																										// kh]
																										// 개인결재함
																										// >
																										// 참조/회람함
																										// 에는
																										// piid
																										// 값만
																										// 존재
																										// 하므로
																										// 일괄확인
																										// 시
																										// piid로
																										// 체크
																										// 한다
	                if (aPiid_List[i] == getInfo("ProcessInfo.ProcessID")) {
	                    nPoint = i;
	                    i = nTotal;
	                }
	            }
	            else {
	                if (aWiid_List[i] == getInfo("Request.workitemID")) {
	                    nPoint = i;
	                    i = nTotal;
	                }
	            }
	        }
	    }
	    if (objid == "btPreList") {
	        if (nPoint == 0) sMeggage = coviDic.dicMap.msg_apv_firstPage;
	        else {
	            sPiid = aPiid_List[nPoint - 1].toLowerCase();
	            sWiid = aWiid_List[nPoint - 1].toLowerCase();
	            sFiid = aFiid_List[nPoint - 1].toLowerCase();
	            sPtid = aPtid_List[nPoint - 1].toLowerCase();
	            sCount = String(nPoint + 1 - 1) + "/" + String(nTotal);
	        }
	
	    } else if (objid == "btNextList") {
	        if (nPoint == nTotal - 1) sMeggage = coviDic.dicMap.msg_apv_lastPage;
	        else {
	            sPiid = aPiid_List[nPoint + 1].toLowerCase();
	            sWiid = aWiid_List[nPoint + 1].toLowerCase();
	            sFiid = aFiid_List[nPoint + 1].toLowerCase();
	            sPtid = aPtid_List[nPoint + 1].toLowerCase();
	            sCount = String(nPoint + 1 + 1) + "/" + String(nTotal);
	        }
	    }
	    if (sMeggage != ""){ Common.Warning(sMeggage); return false;}
	    else if (sPiid != "") {
	
	        if (openMode == "L") {
	            m_oInfoSrc.sNowPiis = sPiid;
	            document.location.href = window.location.href.substring(0, window.location.href.indexOf("?")) +"?"+window.location.href.substring(window.location.href.indexOf("?")+1).replace(CFN_GetQueryString("processID"), sPiid).replace(CFN_GetQueryString("workitemID"), sWiid).replace(CFN_GetQueryString("forminstanceID"), sFiid).replace("userCode=" + CFN_GetQueryString("userCode"), "userCode=" + sPtid).replace("editMode=" + CFN_GetQueryString("editMode"), "editMode=N").replace("#", "").replace("&scount=" + CFN_GetQueryString("scount"), "") + "&scount=" + sCount;
	        } else {
	
	            opener.sNowPiis = sPiid;
	            document.location.href = window.location.href.substring(0, window.location.href.indexOf("?")) +"?"+window.location.href.substring(window.location.href.indexOf("?")+1).replace(CFN_GetQueryString("processID"), sPiid).replace(CFN_GetQueryString("workitemID"), sWiid).replace(CFN_GetQueryString("forminstanceID"), sFiid).replace("userCode=" + CFN_GetQueryString("userCode"), "userCode=" + sPtid).replace("editMode=" + CFN_GetQueryString("editMode"), "editMode=N").replace("#", "").replace("&scount=" + CFN_GetQueryString("scount"), "") + "&scount=" + sCount;
	        }
	    }
	    return true;
    }
}

// moved from formedit.js : KJW 2014.04.21 : XFORM PRJ.
function DeCodeRecList(sRecList) {
    var r, res, sRecDept;
    var s = sRecList;
    res = /@/i;
    sRecDept = s.replace(res, "");
    m_oRecList = $.parseXML("<groups>" + sRecDept + "</groups>");
    var elmList = $(m_oRecList).find("groups > group");
    sRecDept = "";
    if (elmList.length != 0) {
        $(m_oRecList).each(function (i, elm) {
            sRecDept += "@";
            var sRecDeptNode = "";
            $(elm).find("item > AN").each(function (j, elmnode) {
                sRecDeptNode += ";" + $(elmnode).text();
            });
            if (sRecDeptNode.length > 0) sRecDeptNode = sRecDeptNode.substring(1);
            sRecDept += sRecDeptNode;
        });
        if (sRecDept.length > 0) sRecDept = sRecDept.substring(1);
    }
    if (sRecList.length > 1) {// 수신처지정없음
        if (sRecList.substr(0, 1) == '@') sRecDept = "@" + sRecDept;
    }
    return sRecDept;
}
function getDocListXml() {
    var returnXml = "";
    var sDocListType = "3";
    if (CFN_GetQueryString("doclisttype") != null) sDocListType = CFN_GetQueryString("doclisttype");

    if (sDocListType == "10") {
        returnXml += makeNode("OwnerUnitCode", getInfo("AppInfo.etid"), null, true);
        returnXml += makeNode("DocumentUnitCode", getInfo("AppInfo.etid"), null, true);
        returnXml += makeNode("UnitAbbreviation", "", null, true);
        returnXml += makeNode("CategoryNumber", "", null, true);
        returnXml += makeNode("DocListType", sDocListType, null, true);
        returnXml += makeNode("RegistrationComment", "", null, true);
        returnXml += makeNode("RegistratorName", document.getElementById("NO").value, null, true); // NO
        returnXml += makeNode("RegistratorCode", getInfo("AppInfo.usid"), null, true);
        returnXml += makeNode("SentByUnitName", getInfo("AppInfo.dpnm"), null, true);
        returnXml += makeNode("SentByUnitCode", getInfo("AppInfo.dpid"), null, true);
        returnXml += makeNode("ReceivedByUnitName", "", null, true);
        returnXml += makeNode("ReceivedByUnitCode", "", null, true);
        returnXml += makeNode("DocumentSubject", document.getElementById("Subject").value, null, true);
        returnXml += makeNode("PersonInChargeName", "", null, true);
        returnXml += makeNode("PersonInChargeCode", "", null, true);
        returnXml += makeNode("ApprovedDate", getInfo("AppInfo.svdt"), null, true);
        returnXml += makeNode("InitiatorName", getInfo("AppInfo.usnm"), null, true);
        returnXml += makeNode("InitiatorCode", getInfo("AppInfo.usid"), null, true);
        returnXml += makeNode("EffectuatedDate", getInfo("AppInfo.svdt"), null, true);
        returnXml += makeNode("EffectuationMethod", "", null, true);
    }
    return returnXml;
}

function chkWARCOMMENT() {
    var retResult = true;
    if (document.getElementById("WARCOMMENT") != undefined) {
        if (getIsLastApprover("receive")) {
            if (document.getElementById("WARCOMMENT").innerHTML != "") {
                if (window.confirm(formJson.localLangItems.msg_lastconfirm)) {
                    result = true;
                }
                else {
                    result = false;
                }
                document.getElementById("LASTCONFIRM").value = result;
                var tmpName = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
                if (result == 'false') {
                    tmpName = "";
                }
                retResult = UpdateLastApproval(result, tmpName);
            }
        }
    }
    else {
        retResult = true;
    }
    return retResult;
}

function UpdateLastApproval(result, tmpName) {
    var flg = true;
    var sUrl = "/WebSite/Approval/Controls/ApprovalWebservice.asmx";
    var oResult = CFN_CallAjaxJson(sUrl + "/checkUpdateLastApproval", "{LASTCONFIRM:'" + result + "', LASTAPPROVER:'" + tmpName + "', FIID:'" + getInfo("FormInstanceInfo.FormInstID") + "'}", false, null);

    var oRsltJSON = $.parseJSON(oResult);
    var rText = oRsltJSON.d.toString();
    if (rText.split(":")[0] == "E") {

        alert(rText.split(":")[1]);
        flg = false;
    }
    else {
        if (rText != "S:성공") {

        }
    }
    return flg;
}

function getIsLastApprover(pKind) {   // pKind: send(기안부서), receive(수신부서)
    var sRtn = "";
    var m_oApvList = $.parseXML(getInfo("ApprovalLine"));

    var oPendingSteps = $(m_oApvList).find("steps > division[divisiontype='" + pKind + "'] > step > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='pending'],steps > division > step > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='reserved']");
    var oinActiveSteps = $(m_oApvList).find("steps > division[divisiontype='" + pKind + "'] > step > ou > person > taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='inactive']");
    if ((oPendingSteps.length == 1) && (oinActiveSteps.length == 0)) {
        sRtn = "true";
    } else {
        sRtn = "false";
    }
    if (sRtn == "false") {
        switch (getInfo("Request.mode")) {
            case "PCONSULT":
                if (getInfo("Request.mode") == "PCONSULT" && getInfo("Request.subkind") == "T004" && document.getElementById("ACTIONINDEX").value == 'reject') { // 합의
																																									// 반려
																																									// 가능
                    sRtn = "true";
                }
                break;
            default:
                if (document.getElementById("ACTIONINDEX").value == 'reject') { // 결재
																				// 반려
																				// 가능
                    sRtn = "true";
                }
                break;
        }
    }
    return sRtn;
}

function getIncludeFormPrefix(formStr, gubun) {
    var arrForms = formStr.split(gubun);
    var check = false;
    for (i = 0; i < arrForms.length; i++) {
        if (arrForms[i] == getInfo("FormInfo.FormPrefix")) {
            check = true;
            break;
        }
    }
    return check;
}


// XForm 저장연동 (장용욱:20160323)
function fn_writelink(extdatatype) {
    var bLastApprovalYN = false;    // 마지막 결재자인지 여부
    var bErrorYN = false;

    var m_oApvList = $.parseXML(document.getElementById("APVLIST").value);

    // 후결(review), 후열(bypass), 결재안함(skip) 아니고 상태가 대기(pending) 이거나 보류(reserved)
	// 인것
    var oPendingSteps = $(m_oApvList).find("steps > division > step:has(taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='pending']), steps > division > step:has(taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='reserved'])");
    // 후결(review), 후열(bypass), 결재안함(skip) 아니고 상태가 비활성화(inactive)
    var oinActiveSteps = $(m_oApvList).find("steps > division > step:has(taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='inactive'])");

    // 대기(pending), 보류(reserved) 상태가 1개 이고, 비활성화(inactive) 상태가 0개 일 경우
    if ((oPendingSteps.length == 1) && (oinActiveSteps.length == 0)) {
        bLastApprovalYN = true;
    }

    // 1인결재 : 대기(pending), 보류(reserved) 상태가 0개 이고, 비활성화(inactive) 상태가 1개 일 경우
    if ((oPendingSteps.length == 0) && (oinActiveSteps.length == 1)) {
        bLastApprovalYN = true;
    }

    // Request 담당업무 : division 수가 담당업무 수보다 작을 경우에는 마지막 결재자가 아님
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scChgr.isUse") == "Y" && getInfo("SchemaContext.scChgr.value") != "") {                    
            if ($(m_oApvList).find("steps > division").length < (getInfo("SchemaContext.scChgr.value").split('^').length + 1)) {
                bLastApprovalYN = false;
            }
        }
    }

    // Request 담당업무함 계열사별 지정 : division 수가 담당업무함 계열사별 지정 수보다 작을 경우에는 마지막 결재자가 아님
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scChgrEnt.isUse") == "Y" && getInfo("SchemaContext.scChgrEnt.value") != "") {
            if ($(m_oApvList).find("steps > division").length < (getInfo("SchemaContext.scChgrEnt.value").split('^').length + 1)) {
                bLastApprovalYN = false;
            }
        }
    }

    // Request 담당업무함 사업장별 지정 : division 수가 담당업무함 사업장별 지정 수보다 작을 경우에는 마지막 결재자가 아님
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scChgrReg.isUse") == "Y" && getInfo("SchemaContext.scChgrReg.value") != "") {
            if ($(m_oApvList).find("steps > division").length < (getInfo("SchemaContext.scChgrReg.value").split('^').length + 1)) {
                bLastApprovalYN = false;
            }
        }
    }

    // Request 담당부서사용 : division 수가 담당부서사용 수보다 작을 경우에는 마지막 결재자가 아님
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scChgrOU.isUse") == "Y" && getInfo("SchemaContext.scChgrOU.value") != "") {
            if ($(m_oApvList).find("steps > division").length < (getInfo("SchemaContext.scChgrOU.value").split('^').length + 1)) {
                bLastApprovalYN = false;
            }
        }
    }

    // Request 담당부서 계열사별 지정 : division 수가 담당부서 계열사별 지정 수보다 작을 경우에는 마지막 결재자가 아님
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scChgrOUEnt.isUse") == "Y" && getInfo("SchemaContext.scChgrOUEnt.value") != "") {
            if ($(m_oApvList).find("steps > division").length < (getInfo("SchemaContext.scChgrOUEnt.value").split('^').length + 1)) {
                bLastApprovalYN = false;
            }
        }
    }

    // Request 담당수신자사용 : division 수가 담당수신자사용 작을 경우에는 마지막 결재자가 아님
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scChgrPerson.isUse") == "Y" && getInfo("SchemaContext.scChgrPerson.value") != "") {
            if ($(m_oApvList).find("steps > division").length < (getInfo("SchemaContext.scChgrPerson.value").split('^').length + 1)) {
                bLastApprovalYN = false;
            }
        }
    }

    // 협조문서는 기안부서 최종 결재선에서 연동 수신처 결재시는 제외
    // 배포사용, 배포그룹사용
    if (bLastApprovalYN) {
        if (getInfo("SchemaContext.scIPub.isUse") == "Y" || getInfo("SchemaContext.scGRec.isUse") == "") {                    
            if ($(m_oApvList).find("division[divisiontype='send']:has(>taskinfo[status='completed'])").length > 0) {
                bLastApprovalYN = false;
            }
        }
    }

    // alert(bLastApprovalYN);
    // alert(document.getElementById("ACTIONINDEX").value);
    // return;
            
    // 최종승인자 일 경우
    if (bLastApprovalYN) {
        if (extdatatype == "writelink_d_text") {
            if (document.getElementById("ACTIONINDEX").value == 'approve') {
                var strXml = "<params>";
                $('*[ext-data-type1="writelink_d_text"]').each(function (i, item) {
                    // 연결정보
                    var strConnectString = $(this).attr('ext-data-type2');

                    var strTable = $(this).attr('ext-data-type3');
                    var strField = $(this).attr('ext-data-type4');


                    // JSON 파라미터 "'", "\" 처리 -> [2016-06-13] kimhs, hidden 값 가져올
					// 수 있도록 처리
                    strValue = $(this).text() == "" ? $(this).val() : $(this).text();
                    strValue = strValue.replace(/'/g, "!!!!@@@@####^^^^");
                    strValue = strValue.replace(/\\/g, "!!!!@@@@####&&&&");

                    // var bodyContext = $.parseXML("<?xml version='1.0'
					// encoding='utf-8'?>" + getInfo("BodyContext"));
                    // strValue = $(bodyContext).find(strField).text();

                    // JSON 파라미터 구성
                    strXml = strXml + "<param>";
                    strXml = strXml + "<connect>" + strConnectString + "</connect>";
                    strXml = strXml + "<tablename>" + strTable + "</tablename>";
                    strXml = strXml + "<columnname>" + strField + "</columnname>";
                    strXml = strXml + "<columnvalue><![CDATA[" + strValue + "]]></columnvalue>";
                    strXml = strXml + "</param>";
                });
                var strXml = strXml + "</params>";

                if (strXml != "<params></params>") {
                    CFN_PageMethodJSON_Url("/WebSite/Approval/Forms/Templates/xform/xform_database.aspx", "SetDataInsert", "{strXml:'" + strXml
                        + "'}", false, function (pResult, pContext) {
                            if (pResult != "") {
                                if (pResult.d.indexOf('ERROR') == 0) {
                                    alert(pResult.d);
                                    bErrorYN = true;
                                }
                            }
                        });
                }
            }
        } else if (extdatatype == "writelink_w_text") {
            if (document.getElementById("ACTIONINDEX").value == 'approve') {
                var strXml = "<params>";

                // (본사운영) 프로젝트코드신청서 양식
                // [16-07-18] kimhs, 프로젝트 코드신청서 코드 발번 분기
                if (getInfo("FormInfo.FormPrefix") == "WF_FORM_PROJECTCODE") {
                    var projectNo = -1;
                    var selectJobNo = 0;
                    var subjectType = "";
                    if (getInfo("Request.templatemode") == "Read") { // 읽기모드
                        subjectType = formJson.BodyContext.SUBJECT_TYPE;
                    }
                    else { // 쓰기모드
                        subjectType = $("#SUBJECT_TYPE option:selected").val();
                    }

                    switch (subjectType) {
                        case "P":
                            selectJobNo = 3; // 299번 등록 후 300번대로 사용.
												// 400번 초과시는 추가 정책 설정 필요) (2016/02/12
												// 300번대 사용 중)
                            break;
                        case "R":
                            selectJobNo = 4;
                            break;
                        case "C":
                            selectJobNo = 6;
                            break;
                        case "S":
                            selectJobNo = 7;
                            break;
                        case "G":
                            selectJobNo = 1;
                            break;
                    }

                    var pXML = "USP_JOBNO_GENERATE";
                    var aXML = "<param><name>JOBNOINPUT</name><type>int</type><length>50</length><value><![CDATA[" + selectJobNo + "]]></value></param>";
                    var connectionname = "COVI_FLOW_SI_ConnectionString";
                    var sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql><type>sp</type>" + aXML + "</Items>";
                    var szURL = "../getXMLQuery.aspx";

                    CFN_CallAjax(szURL, sXML, function (data) {
                        var xmlReturn = data;
                        var elmlist = $(xmlReturn).find("response > NewDataSet > Table");

                        projectNo = $(elmlist).find("RESULT").text();
                    }, false, "xml");

                    // JSON 파라미터 구성
                    strXml = strXml + "<param>";
                    strXml = strXml + "<connect>" + $("#pStrJobtype").attr('ext-data-type2') + "</connect>";
                    strXml = strXml + "<tablename>" + $("#pStrJobtype").attr('ext-data-type3') + "</tablename>";
                    strXml = strXml + "<columnname>pStrJobcode</columnname>";
                    strXml = strXml + "<columnvalue><![CDATA[" + projectNo + "]]></columnvalue>";
                    strXml = strXml + "</param>";
                }

                $('*[ext-data-type1="writelink_w_text"]').each(function (i, item) {
                    // 연결정보
                    var strConnectString = $(this).attr('ext-data-type2');

                    var strTable = $(this).attr('ext-data-type3');
                    var strField = $(this).attr('ext-data-type4');


                    // JSON 파라미터 "'", "\" 처리 -> [2016-06-13] kimhs, hidden 값 가져올
					// 수 있도록 처리
                    strValue = $(this).text() == "" ? $(this).val() : $(this).text();
                    strValue = strValue.replace(/'/g, "!!!!@@@@####^^^^");
                    strValue = strValue.replace(/\\/g, "!!!!@@@@####&&&&");

                    // var bodyContext = $.parseXML("<?xml version='1.0'
					// encoding='utf-8'?>" + getInfo("BodyContext"));
                    // strValue = $(bodyContext).find(strField).text();

                    // JSON 파라미터 구성
                    strXml = strXml + "<param>";
                    strXml = strXml + "<connect>" + strConnectString + "</connect>";
                    strXml = strXml + "<tablename>" + strTable + "</tablename>";
                    strXml = strXml + "<columnname>" + strField + "</columnname>";
                    strXml = strXml + "<columnvalue><![CDATA[" + strValue + "]]></columnvalue>";
                    strXml = strXml + "</param>";
                });
                var strXml = strXml + "</params>";

                if (strXml != "<params></params>") {
                    CFN_PageMethodJSON_Url("/WebSite/Approval/Forms/Templates/xform/xform_webservice.aspx", "SetDataInsert", "{strXml:'" + strXml
                        + "'}", false, function (pResult, pContext) {
                            if (pResult != "") {
                                if (pResult.d.indexOf('ERROR') == 0) {
                                    alert(pResult.d);
                                    bErrorYN = true;
                                }
                            }
                        });

                    if (getInfo("FormInfo.FormPrefix") == "WF_FORM_PROJECTCODE" && projectNo == '-1') { // 프로젝트
																										// 코드
																										// 번호대가
																										// 넘어갔을
																										// 시
                        Common.Warning('해당 업무타입으로 신청할 수 없습니다.\n담당자에게 문의해주세요.');
                        bErrorYN = true;
                    }
                }
            }
        } else if (extdatatype == "writelink_s_text") {
            if (document.getElementById("ACTIONINDEX").value == 'approve') {
                var strXml = "<params>";
                $('*[ext-data-type1="writelink_s_text"]').each(function (i, item) {
                    // 연결정보
                    var strConnectString = $(this).attr('ext-data-type2');

                    var strTable = $(this).attr('ext-data-type3');
                    var strField = $(this).attr('ext-data-type4');


                    // JSON 파라미터 "'", "\" 처리 -> [2016-06-13] kimhs, hidden 값 가져올
					// 수 있도록 처리
                    strValue = $(this).text() == "" ? $(this).val() : $(this).text();
                    strValue = strValue.replace(/'/g, "!!!!@@@@####^^^^");
                    strValue = strValue.replace(/\\/g, "!!!!@@@@####&&&&");

                    // var bodyContext = $.parseXML("<?xml version='1.0'
					// encoding='utf-8'?>" + getInfo("BodyContext"));
                    // strValue = $(bodyContext).find(strField).text();

                    // JSON 파라미터 구성
                    strXml = strXml + "<param>";
                    strXml = strXml + "<connect>" + strConnectString + "</connect>";
                    strXml = strXml + "<tablename>" + strTable + "</tablename>";
                    strXml = strXml + "<columnname>" + strField + "</columnname>";
                    strXml = strXml + "<columnvalue><![CDATA[" + strValue + "]]></columnvalue>";
                    strXml = strXml + "</param>";
                });
                var strXml = strXml + "</params>";

                if (strXml != "<params></params>") {
                    CFN_PageMethodJSON_Url("/WebSite/Approval/Forms/Templates/xform/xform_sap.aspx", "SetDataInsert", "{strXml:'" + strXml
                        + "'}", false, function (pResult, pContext) {
                            if (pResult != "") {
                                if (pResult.d.indexOf('ERROR') == 0) {
                                    alert(pResult.d);
                                    bErrorYN = true;
                                }
                            }
                        });
                }
            }
        }
    }

    return bErrorYN;
}
function getLngLabel(szLngLabel, szType, szSplit) {
    var rtnValue = "";
    if(szLngLabel != undefined){
	    if (szSplit != null) {
	        var ary = szLngLabel.split(";");
	        if (szSplit) { ary = szLngLabel.split(szSplit); }
	        var sValue02 = "";
	        for (var i = 0; i < ary.length; i++) {
	            sValue02 = sValue02 + ary[i] + ";";
	        }
	        if (szType) {
	            sValue02 = szLngLabel.substring(sValue.indexOf(";") + 1);
	        }
	        return CFN_GetDicInfo(sValue02);
	    } else {
	        var sValue02 = szLngLabel;
	        if (szType) {
	
	        	sValue02 = szLngLabel.substring(szLngLabel.indexOf(";") + 1);
	        }
	        return CFN_GetDicInfo(sValue02);
	    }
    }else{
    	return "";
    }
}

// 대성: 수동 결재 함수 추가 - 관리자 소스 복사함 ==========================================
function autoAllApproved() {
	Common.Progress();
	
	getActTasks();
	
	setTimeout(function() {
		var taskID = m_ActiveTaskId;
		if(taskID != "") {
			var sAction = "";
			var sComment = "";
			var sSign = "";
			
			if(m_sReqMode == "REJECT" && m_ApvPersonCnt == 0) { // 최종 반려자.
				sAction = "REJECT";
			}
			else {
				sAction = "APPROVAL";
			}
			
			if(m_ApvPersonCnt == 0) { // 최종결재자는 서명이미지가 보여야 함.
				sSign = getUserSignInfo(m_ApvPersonObj.concat().eq(m_ApvPersonObj.length - 1).attr("code")); // 최종결재자는
																												// 싸인이
																												// 필요함.
				sComment = Base64.utf8_to_b64(document.getElementById("ACTIONCOMMENT").value);
			}
			else {
				// sSign = "nosign"; // 서명이미지와 사용자명 표시하지 않는 경우에 활성화
				sSign = getUserSignInfo(m_ApvPersonObj.concat().eq(m_ApvPersonObj.length - m_ApvPersonCnt).attr("code")); // 최종결재자는
																															// 싸인이
																															// 필요함.
				sComment = Base64.utf8_to_b64("");
			}
			
			// 일반결재
		    var sJsonData = {};
		    
		    $.extend(sJsonData, {"mode": "APPROVAL"});
		    $.extend(sJsonData, {"subkind": "T006"});
		    $.extend(sJsonData, {"taskID": taskID});
	    	$.extend(sJsonData, {"FormInstID" : getInfo("FormInstanceInfo.FormInstID")});
		    $.extend(sJsonData, {"actionMode": sAction});
		    $.extend(sJsonData, {"actionComment": sComment});
		    $.extend(sJsonData, {"signimagetype" : sSign});
		    
		    var formData = new FormData();
		    // 양식 기안 및 승인 정보
		    formData.append("formObj", JSON.stringify(sJsonData));
		        
		    callRestAPI(formData);
		} 
		else {
			parent.Common.Inform(Common.getDic("msg_apv_alert_006"), "Information", function(){
    			opener.location.reload();
    			Common.Close();
    		}); // 성공하였습니다.
		}
    }, 500);
}

// get tasks
function getActTasks(){
	$.ajax({
	    url: "admin/getacttasks.do",
	    type: "POST",
	    data: {
			"piid" : getInfo("ProcessInfo.ProcessID")
		},
		async:false,
	    success: function (res) {
	    	if(res.list != undefined) {
	    		getActTasksSuccessCallback(res.list.data);
	    	}
	    	else {
	    		m_ActiveTaskId = "";	
	    	}
        },
        error:function(response, status, error){
			CFN_ErrorAjax("getacttasks.do", response, status, error);
		}
	});
	
}

function getActTasksSuccessCallback(data){
	m_ActiveTaskId = "";
	$.each(data,function(i,obj) {
		m_ActiveTaskId = validateJsonVal(obj.id);
		return false; // 1개씩 처리함.
	});
}

// 엔진 호출하기
function callRestAPI(formData){
	$.ajax({
		url:"draft.do",
		data: formData,
		type:"post",
		dataType : 'json',
		processData : false,
        contentType : false,
	    success: function (res) {
	    	if(res.status == 'SUCCESS'){
	    		m_ApvPersonCnt--;
	    		autoAllApproved();
	    	} else if(res.status == 'FAIL'){
	    		Common.Error(res.message);
	    	}
	    },
	    error:function(response, status, error){
			CFN_ErrorAjax("draft.do", response, status, error);
		}
	});
}

function getUserSignInfo(usercode){
	var retVal = "";
	
	$.ajax({
	    url: "user/getUserSignInfo.do",
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

function validateJsonVal(val){
	var ret;
	if (typeof(val) != 'undefined' && val != null)
	{
	    ret = val;
	} else {
		ret = '';
	}
	
	return ret;
}

// 20210126 이관문서 결재문서 PC저장
function PcSave(oVar, bmail) {
	// 양식 특정함수 포함된 내역 빼기
	bDisplayOnly = true;
	bPresenceView = false;
	
	printDiv = getMigHtml();
	
	if (IsWideOpenFormCheck(getInfo("FormInfo.FormPrefix")) == true) {
		oVar.iWidth = 1070;
	} else {
		oVar.iWidth = 790;
	}

	oVar.iHeight = 350;

	var fileName = getInfo("FormInstanceInfo.Subject");

	if (fileName == "") {
		fileName = getInfo("FormInfo.FormName");
	} else if (getInfo("FormInstanceInfo.DocNo") != "") {
		fileName += "_" + getInfo("FormInstanceInfo.DocNo");
	}

	if (bmail) {
		// 팝업 띄우지 않고 ajax 호출
		oVar.sUrl = "";
		if (document.getElementById("frmHTML").src.indexOf(".mht") > -1) {
			$.ajax({
				url : "downloadMHT.do",
				type : "post",
				data : {
					"fileName" : encodeURIComponent(fileName),
					"path" : getInfo('FormInstanceInfo.BodyContext'),
					"type" : "Mail"
				},
				async : false,
				success : function(data) {
					if (data.status == "SUCCESS") {
						setInfo("savePdfInfo", data);
					}
				},
				error : function(response, status, error) {
					CFN_ErrorAjax("common/createPdf.do", response, status, error);
				}
			});
		} else {
			$.ajax({
				url : "common/createPdf.do",
				type : "post",
				data : {
					"filename" : encodeURIComponent(fileName),
					"fiid" : getInfo("FormInstanceInfo.FormInstID"),
					"txtHtml" : printDiv.replace("<thead>", "").replace(
							"min-height", "height")
				},
				async : false,
				success : function(data) {
					if (data.status == "SUCCESS") {
						setInfo("savePdfInfo", data);
					}
				},
				error : function(response, status, error) {
					CFN_ErrorAjax("common/createPdf.do", response, status, error);
				}
			});
		}
	} else {
		if (document.getElementById("frmHTML").src.indexOf(".mht") > -1) {
			$("form[name=formPCSave]").remove();
			$("iframe[name=iframePCSave]").remove();

			var PDFForm = $('<form name="formPCSave"></form>');
			PDFForm.attr("method", "post");
			PDFForm.attr("action", "downloadMHT.do");
			PDFForm.attr("target", "iframePCSave");
			PDFForm.appendTo('body');

			var PDF_txtHtml = $('<textarea name="txtHtml" id="txtHtml" style="display:none;"></textarea>');
			var PDF_filename = $('<input type="hidden" name="fileName" id="fileName" value="' + fileName + '"/>');
			var PDF_path = $('<input type="hidden" name="path" id="path" value="' + getInfo('FormInstanceInfo.BodyContext') + '"/>');
			var PDF_type = $('<input type="hidden" name="type" id="type" value="Download"/>');
			$(PDF_txtHtml).val(printDiv.replace("<thead>", "").replace("min-height", "height"));

			$('<iframe name="iframePCSave" width="0" height="0" frameborder="0" scrolling="no" style="margin-top:0"></iframe>').appendTo('body');
			PDFForm.append(PDF_txtHtml).append(PDF_filename).append(PDF_path).append(PDF_type);
			PDFForm.submit();
		} else {
			// 20210126 이관함 다운로드 시 mht 로 다운로드로 변경
			$("form[name=formPCSave]").remove();
			$("iframe[name=iframePCSave]").remove();
	
			var PDFForm = $('<form name="formPCSave"></form>');
			PDFForm.attr("method", "post");
			PDFForm.attr("action", "common/printPdf.do");
			PDFForm.attr("target", "iframePCSave");
			PDFForm.appendTo('body');
	
			var PDF_txtHtml = $('<textarea name="txtHtml" id="txtHtml" style="display:none;"></textarea>');
			var PDF_filename = $('<input type="hidden" name="filename" id="filename" value="' + fileName + '"/>');
			var PDF_fiid = $('<input type="hidden" name="fiid" id="fiid" value="' + getInfo("FormInstanceInfo.FormInstID") + '"/>');
			$(PDF_txtHtml).val(printDiv.replace("<thead>", "").replace("min-height", "height"));
	
			$('<iframe name="iframePCSave" width="0" height="0" frameborder="0" scrolling="no" style="margin-top:0"></iframe>').appendTo('body');
			PDFForm.append(PDF_txtHtml).append(PDF_filename).append(PDF_fiid);
			PDFForm.submit();
		}
	}

	bDisplayOnly = false;
	bPresenceView = true;
	return false;
}

// 20210126 이관문서 메일보내기
function CallBackSendMailInBody() {
	window.open("/mail/bizcard/goMailWritePopup.do?" + "callBackFunc=mailWritePopupCallback" + "&callMenu=" + "Approval" + "&userMail=" + Common.getSession("UR_Mail") + "&inputUserId=" + Common.getSession("DN_Code") + "_" + Common.getSession("UR_Code") + "&popup=Y", "ApprovalWritePopup", "height=800, width=1000, resizable=yes");
}

// 20210126 이관문서 메일보내기에 넘겨 줄 첨부파일 정보(본문 pdf + 기존 첨부)
function getAttachFileBody() {
	var result = {};
	var arrFileInfo = new Array();
	var strOS = Common.getGlobalProperties("Globals.OsType");
	var attachRootPath = "";

	if (strOS == "UNIX") {
		attachRootPath = Common.getGlobalProperties("attachUNIX.path");
	} else {
		attachRootPath = Common.getGlobalProperties("attachWINDOW.path");
	}

	var baseSavePath = attachRootPath + Common.getBaseConfig("ApprovalMigAttach_SavePath");
	var strFileinfo = getInfo("FormInstanceInfo.AttachFileInfo");

	if (strFileinfo != "" && strFileinfo != undefined) {
		var oFileinfo = $.parseJSON(getInfo("FileInfos"));
		$(oFileinfo).each(function(j, obj) {
			var oFileInfoList = {};
			oFileInfoList.fileName = obj.FileName;
			oFileInfoList.saveFileName = obj.SavedName;
			oFileInfoList.savePath = baseSavePath + obj.FilePath;
			oFileInfoList.fileSize = obj.Size;
			oFileInfoList.status = "SUCCESS";
			arrFileInfo.push(oFileInfoList);
		});
	}

	var objPdfInfo = $.parseJSON(getInfo("savePdfInfo"));
	objPdfInfo.fileName = decodeURIComponent(objPdfInfo.fileName);
	arrFileInfo.push(objPdfInfo); // pdf 정보

	result.subject = getInfo("FormInstanceInfo.Subject");
	result.AttachFileInfo = arrFileInfo; // array 안에 json
	return result;
}

// 20210126 이관문서 mht 인 경우 본문 내용 추출
function getMigHtml() {
	var printDiv = "";
	var tempBody = null;

	// mht 문서에 따라 분기 처리 후 따로 작업해주어야 함
	if (document.getElementById("frmHTML").contentWindow.document.getElementById("Table1") != null)
		printDiv = document.getElementById("frmHTML").contentWindow.document.getElementById("Table1").outerHTML;
	else if (document.getElementById("frmHTML").contentWindow.document.getElementById("bodyInnerDiv") != null)
		printDiv = document.getElementById("frmHTML").contentWindow.document.getElementById("bodyInnerDiv").outerHTML;
	else if (document.getElementById("frmHTML").contentWindow.document.getElementById("mainAppForm") != null) {
		$('#frmHTML').contents().find('#download_wrapper').remove();
		printDiv = document.getElementById("frmHTML").contentWindow.document.getElementById("mainAppForm").outerHTML;		
	} else {
		tempBody = document.getElementById("frmHTML").contentWindow.document.body.cloneNode(true);
		
//		if ($(tempBody).find("div#bodytable").length > 0) {
//			// 가운데 정렬 시켜주기
//			$(tempBody).find("div#bodytable").css("margin", "auto");
//		} else {
//			// 가운데 정렬 시켜주기
//			var oTb = $(tempBody).find("table:first");
//			while (oTb.length > 0) {
//				$(oTb).css("margin", "auto");
//				oTb = $(oTb).next();
//			}
//		}
//		
//		// inline 이미지 절대경로로 변경
//		var imgs = $(tempBody).find("img");
//		$.each(imgs, function() {
//			if (this.src.indexOf("ApprovalMig") > -1) {
//				$(this).attr("src", this.src);
//			}
//		});
		printDiv = "<div style='padding-top: 50px'>" + tempBody.innerHTML + "</div>";
	}
	
	// 불필요한 태그 제외
	printDiv = printDiv.replace(/<(meta)([^>]*)>/gi,"");
	printDiv = printDiv.replace(/<(link)([^>]*)>/gi,"");
	printDiv = printDiv.replace(/<(o:p)([^>]*)>/gi,"");
	// printDiv = printDiv.replace(/<(img)([^>]*)>/gi,"");
	printDiv = printDiv.replace(/<(iframe)([^>]*)>/gi,"");
	printDiv = printDiv.replace(/<(!--)([^>]*)>/gi,"");
	printDiv = printDiv.replace(/<o:p[^>]*>((\n|\r|.)*?)<\/o:p>/img, "");
	printDiv = printDiv.replace(/<script[^>]*>((\n|\r|.)*?)<\/script>/img, "");
	
	return printDiv;
}