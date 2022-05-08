// 다국어 및 기초설정 조회 
Common.getDicList(["DOC_LEVEL_10", "DOC_LEVEL_20","DOC_LEVEL_30","lbl_apv_year_1","lbl_apv_year_3","lbl_apv_year_5","lbl_apv_year_7","lbl_apv_year_10"
                   ,"lbl_apv_permanence", "lbl_apv_docfoldername", "lbl_NoticePopup", "lbl_apv_formcreate_LCODE28", "lbl_apv_Confirm", "lbl_apv_agree"
                   , "lbl_apv_disagree", "msg_apv_198", "msg_apv_029" , "msg_apv_199", "msg_apv_201", "msg_apv_181", "msg_apv_202", "msg_ApprovalDeputyWarning"
                   , "lbl_apv_writer", "lbl_apv_ChargeDept_Rec" , "lbl_apv_open", "msg_apv_notask", "msg_apv_030", "lbl_apv_Charger", "lbl_apv_redraft", "lbl_apv_composing"
                   , "lbl_apv_Doc_back", "lbl_apv_Doc_cancel", "lbl_apv_Approve_cancel", "msg_apv_072", "msg_apv_203", "msg_apv_ieversionCheck", "lbl_apv_receipt_view"
                   , "lbl_apv_setschema_Circulation", "MsgApprovalState_ApprovalConsulted", "lbl_apv_OTransPV", "msg_apv_autoChkAgree", "msg_apv_autoChkApproval"
                   , "msg_apv_autoChkCC", "msg_apv_288", "msg_apv_391", "msg_apv_390", "msg_apv_197", "msg_apv_DeonModify", "msg_apv_054", "msg_apv_055"
                   , "msg_apv_ChargeConfirm", "msg_apv_changereview_01", "msg_apv_changereview_02", "lbl_apv_ChargeDept", "lbl_apv_circulation_sent"
                   , "msg_apv_confirm_usingstamp", "msg_Mail_WritingContentsMayDeleted", "msg_apv_117", "msg_AreYouDelete", "msg_ItsDone", "msg_apv_refreshList"
                   , "msg_apv_firstPage", "msg_apv_lastPage", "msg_apv_073", "btn_apv_approval2", "btn_apv_managedept", "initApvListCols", "lbl_apv_Approved", "lbl_apv_username"
                   , "lbl_dept", "lbl_sign", "lbl_apv_date", "lbl_ApprovalState", "btn_apv_recvedept", "lbl_apv_management", "lbl_apv_request2", "lbl_apv_charge", "lbl_apv_charge_apvline"
                   , "lbl_apv_charge_person", "gLabel_comment", "lbl_apv_authorize", "lbl_apv_substitue", "lbl_apv_bypass", "lbl_apv_review", "lbl_apv_normalapprove", "lbl_apv_approvdate"
                   , "lbl_apv_comment", "lbl_apv_tit_consent", "lbl_apv_reqdept", "lbl_apv_Propdept", "lbl_apv_Acceptdept", "lbl_apv_approver", "lbl_apv_DeptConsent", "lbl_apv_DeptConsent_2", "lbl_apv_DeptAssist", "lbl_apv_DeptAssist2"
                   , "lbl_apv_audit", "lbl_apv_ExtType", "lbl_apv_sign_none", "lbl_apv_dept_audit", "lbl_apv_recinfo_td2", "lbl_apv_ExtType_agree", "lbl_apv_ExtType_disagree", "lbl_apv_reject"
                   , "lbl_apv_hold", "lbl_apv_rejectedto", "lbl_preview", "lbl_apv_AddFile", "lbl_download_all"
                   , "msg_apv_057", "msg_apv_058", "msg_apv_059", "msg_apv_173"]);

Common.getBaseConfigList(["CheckApprovalEditorLoad", "EditorType", "MobileDocConverterURL", "RETURN_FMPF", "useHold", "VacationForm", "ApprovalLineMax_Table"
                          			, "ServerDateSimpleFormat", "CalenderDateFormat", "CalenderDateFormat", "DateFullFormat", "useWebhardAttach"]);

// 변수 정리 시작 

/** formmenu.js 용 리소스 파일 변수 Start  **/
/*function setGlobalVar() {
    //아래 함수에서 전역 변수 선언
    gLabel__close2 = formJson.oLang.lbl_apv_close2;
    gLabel__writer = formJson.oLang.lbl_apv_writer;
    gLabel__ChargeDept_Rec = formJson.oLang.lbl_apv_ChargeDept_Rec;
    gLabel__open = formJson.oLang.lbl_apv_open;
    gLabel__Charger = formJson.oLang.lbl_apv_Charger;
    gLabel__changeapprover = formJson.oLang.lbl_apv_changeapprover;
    gLabel__draft = formJson.oLang.lbl_apv_Draft;
    gLabel__redraft = formJson.oLang.lbl_apv_redraft;
    gLabel__app = formJson.oLang.lbl_apv_app;
    gLabel__Trans1 = formJson.oLang.lbl_apv_Trans1;
    gLabel__Trans2 = formJson.oLang.lbl_apv_Trans2;
    gLabel__jic = formJson.oLang.lbl_apv_jic;
    gLabel__composing = formJson.oLang.lbl_apv_composing;
    gLabel__Doc_back = formJson.oLang.lbl_apv_Doc_back;
    gLabel__Doc_cancel = formJson.oLang.lbl_apv_Doc_cancel;
    gLabel__Approve_cancel = formJson.oLang.lbl_apv_Approve_cancel;
    gLabel__Doc_OK = formJson.oLang.lbl_apv_Doc_OK;
    gLabel__recieve_apv = formJson.oLang.lbl_apv_recieve_apv;
    gLabel__receive = formJson.oLang.lbl_apv_receive;
    gLabel__inactive = formJson.oLang.lbl_apv_inactive;
    gLabel__ChargeDept = formJson.oLang.lbl_apv_ChargeDept;
    gLabel__circulation_sent = formJson.oLang.lbl_apv_circulation_sent;
    gLabel__personalSave = formJson.oLang.lbl_apv_personalSave;
    gLabel__recinfo_td2 = formJson.oLang.lbl_apv_recinfo_td2;
    gLabel_inactive = formJson.oLang.lbl_apv_inactive;
    gLabel_apvlinecomment = formJson.oLang.lbl_apv_apvlinecomment_01;
    gLabel_circulationviewcomment = formJson.oLang.lbl_apv_circulationviewcomment_01;
    *//** formmenu.js 용 리소스 파일 변수 End **//*

    gMessage28 = formJson.oLang.msg_apv_028;
    gMessage29 = formJson.oLang.msg_apv_029;
    gMessage54 = formJson.oLang.msg_apv_054;
    gMessage55 = formJson.oLang.msg_apv_055;
    gMessage57 = formJson.oLang.msg_apv_057;
    gMessage67 = formJson.oLang.msg_apv_067;
    gMessage70 = formJson.oLang.msg_apv_070;
    gMessage71 = formJson.oLang.msg_apv_071;
    gMessage72 = formJson.oLang.msg_apv_072;
    gMessage73 = formJson.oLang.msg_apv_073;
    gMessage74 = formJson.oLang.msg_apv_074;
    gMessage75 = formJson.oLang.msg_apv_075;
    gMessage77 = formJson.oLang.msg_apv_077;
    gMessage100 = formJson.oLang.msg_apv_100;
    gMessage170 = formJson.oLang.msg_apv_170;
    gMessage173 = formJson.oLang.msg_apv_173;
    gMessage181 = formJson.oLang.msg_apv_181;
    gMessage197 = formJson.oLang.msg_apv_197;
    gMessage198 = formJson.oLang.msg_apv_198;
    gMessage199 = formJson.oLang.msg_apv_199;
    gMessage200 = formJson.oLang.msg_apv_200;
    gMessage201 = formJson.oLang.msg_apv_201;
    gMessage202 = formJson.oLang.msg_apv_202;
    gMessage203 = formJson.oLang.msg_apv_203;
    gMessage204 = formJson.oLang.msg_apv_204;
    gMessage254 = formJson.oLang.msg_apv_254;
    gMessage255 = formJson.oLang.msg_apv_255;
    gMessage256 = formJson.oLang.msg_apv_256;
    gMessage257 = formJson.oLang.msg_apv_257;
    gMessage264 = formJson.oLang.msg_apv_264;
    gMessage288 = formJson.oLang.msg_apv_288;
    gMessage289 = formJson.oLang.msg_apv_289;

    gMessage324 = formJson.oLang.msg_apv_324;

    *//** formeditor.js 용 리소스 파일 변수 Start **//*
    g_imgBasePath = "";
    gLabel_approval = formJson.oLang.lbl_apv_approval;
    gLabel_reject = formJson.oLang.lbl_apv_reject;
    gLabel_rejectedto = formJson.oLang.lbl_apv_rejectedto;	// [2015-11-26 add]
    gLabel_charge = formJson.oLang.lbl_apv_charge;
    gLabel_charge_person = formJson.oLang.lbl_apv_charge_person;
    gLabel_authorize = formJson.oLang.lbl_apv_authorize;
    gLabel_review = formJson.oLang.lbl_apv_review;
    gLabel_substitue = formJson.oLang.lbl_apv_substitue;
    gLabel_year = formJson.oLang.lbl_apv_year;
    gLabel_month = formJson.oLang.lbl_apv_month;
    gLabel_day = formJson.oLang.lbl_apv_day;
    gLabel_auditdept = formJson.oLang.btn_apv_auditdept;
    gLabel_comment = formJson.oLang.lbl_apv_comment;
    gLabel_viewopinion = formJson.oLang.lbl_apv_viewopinion;
    gLabel_bypass = formJson.oLang.lbl_apv_bypass;
    gLabel_audit = formJson.oLang.lbl_apv_audit;
    gLabel_consent = formJson.oLang.lbl_apv_consent;
    gLabel_senddept = formJson.oLang.lbl_apv_send.toString() + formJson.oLang.lbl_apv_dept.toString();
    gLabel_reqdept = formJson.oLang.lbl_apv_reqdept;
    gLabel_receivedept = formJson.oLang.lbl_apv_receive.toString() + formJson.oLang.lbl_apv_dept.toString();
    gLabel_managedept = formJson.oLang.btn_apv_managedept;
    gLabel_recvedept = formJson.oLang.btn_apv_recvedept;		// [2015-02-05 add]
    gLabel_apv = formJson.oLang.lbl_apv_Approved;
    gLabel_gubun = formJson.oLang.lbl_apv_gubun;
    gLabel_state = formJson.oLang.lbl_apv_state;
    gLabel_username = formJson.oLang.lbl_apv_username;
    gLabel_jobtitle = formJson.oLang.lbl_apv_jobtitle;
    gLabel_approvdate = formJson.oLang.lbl_apv_approvdate;
    gLabel_oriapprover = formJson.oLang.lbl_apv_oriapprover;
    gLabel_comment = formJson.oLang.lbl_apv_comment;
    gLabel_disagree = formJson.oLang.lbl_apv_disagree;
    gLabel_agree = formJson.oLang.lbl_apv_agree;
    gLabel_reviewer = formJson.oLang.lbl_apv_reviewer;
    gLabel_dept = formJson.oLang.lbl_apv_dept;
    gLabel_jobposition = formJson.oLang.lbl_apv_jobposition;
    gLabel_reviewresult = formJson.oLang.lbl_apv_reviewresult;
    gLabel_reviewcomment = formJson.oLang.lbl_apv_comment;
    gLabel_writedept = formJson.oLang.lbl_apv_writedept;
    gLabel_approver = formJson.oLang.lbl_apv_approver;
    gLabel_Propdept = formJson.oLang.lbl_apv_Propdept;
    gLabel_Acceptdept = formJson.oLang.lbl_apv_Acceptdept;
    gLabel_assist = formJson.oLang.lbl_apv_assist;
    gLabel_send = formJson.oLang.lbl_apv_send;
    gLabel_receive = formJson.oLang.lbl_apv_receive;
    gLabel_approve = formJson.oLang.lbl_apv_normalapprove;
    gLabel_hold = formJson.oLang.lbl_apv_hold;
    gLabel_charge_apvline = formJson.oLang.lbl_apv_charge_apvline;
    gLabel_delete = formJson.oLang.lbl_apv_delete;
    gLabel_request = formJson.oLang.lbl_apv_request2;
    gLabel_management = formJson.oLang.lbl_apv_management;
    gLabel_file_delete = formJson.oLang.lbl_apv_file_delete;
    gLabel_investigation = formJson.oLang.lbl_apv_investigation;
    gLabel_Approved = formJson.oLang.lbl_apv_Approved;
    gLabel_year_1 = formJson.oLang.lbl_apv_year_1;
    gLabel_year_3 = formJson.oLang.lbl_apv_year_3;
    gLabel_year_5 = formJson.oLang.lbl_apv_year_5;
    gLabel_year_7 = formJson.oLang.lbl_apv_year_7;
    gLabel_year_10 = formJson.oLang.lbl_apv_year_10;
    gLabel_permanence = formJson.oLang.lbl_apv_permanence;
    gLabel_link_delete = formJson.oLang.lbl_apv_link_delete;
    gLabel_dept_audit = formJson.oLang.lbl_apv_dept_audit;
    gLabel_person_audit = formJson.oLang.lbl_apv_person_audit;
    gLabel_person_audit1 = formJson.oLang.lbl_apv_person_audit1
    gLabel_person_audit2 = formJson.oLang.lbl_apv_person_audit2
    gLabel_dept_audit2 = formJson.oLang.lbl_apv_dept_audit2;
    gLabel_ExtType = formJson.oLang.lbl_apv_ExtType;
    gLabel_ExtType1 = formJson.oLang.lbl_apv_ExtType_disagree;
    gLabel_ExtType2 = formJson.oLang.lbl_apv_ExtType_agree;
    gLabel_DeptConsent = formJson.oLang.lbl_apv_DeptConsent;
    gLabel_DeptAssist = formJson.oLang.lbl_apv_DeptAssist;
    gLabel_no = formJson.oLang.lbl_apv_no;
    gLabel_kind = formJson.oLang.lbl_apv_kind;
    gLabel_confirm = formJson.oLang.lbl_apv_Confirm;
    gLabel_reference = formJson.oLang.lbl_apv_share4list;
    gLabel_tit_consent = formJson.oLang.lbl_apv_tit_consent;
    gLabel_tit_approval2 = formJson.oLang.btn_apv_approval2;
    gLabel_Months = JSON.parse(formJson.oLang.lbl_apv_Months);
    gLabel_Days = JSON.parse(formJson.oLang.lbl_apv_Days);

    gLabel_AttachList = formJson.oLang.lbl_apv_AttachList;
    *//** formeditor.js 용 리소스 파일 변수 End **//*
}*/

//Draft 양식을 위한 입력값 초기화 처리
function initFieldForDraft(obj) {
    
    var findFormat;
    findFormat = 'input[data-type="mField"],';
    findFormat += 'input[data-type="dField"],';
    findFormat += 'input[data-type="smField"],';
    findFormat += 'textarea[data-type="mField"],';
    findFormat += 'textarea[data-type="smField"]';

    obj.find(findFormat).not('[type="hidden"]').each(function () {
        //alert($(this).prop('outerHTML'));
        //debugger;
        //var temp = $(this).prop('outerHTML');

        if ($(this).is("textarea")) {
            $(this).text('');
        }
        else {
            if ($(this).attr('value').indexOf('{{ doc.') > -1) {
                $(this).attr('value', '');
            }
        }

    });

    return obj;

}

function validateUnderscore(template) {

    var strRet, formDataString;

    strRet = template;
    
    var t = typeof(formJson);
    if (t == "object" || formJson != null) { 
    	    	
    	var n, v, json = [], arr = (formJson && formJson.constructor == Array); 
    	for (n in formJson) { 
    	     v = formJson[n]; 
    	     t = typeof(v); 
    	     if (formJson.hasOwnProperty(n)) { 
    	        	v = '"' + v + '"'; 
    	        	
    	            json.push((arr ? "" : '"' + n + '":') + String(v));
    	  	 } 
    	}
    	formDataString = (arr ? "[" : "{") + String(json) + (arr ? "]" : "}"); 
    }
    
    //오류 발생 
    //formDataString = JSON.stringify(formJson);
    
    //ie8에서 양식필드id 한글로 명명했을때 오류처리
    formDataString = formDataString.replace(/\\u([a-z0-9]{4})/g, function ($0, $1) { return unescape('%u' + $1) });

    // 정규식 처리
    //var myString = "something format_abc";
    var myRegEx = /.*?{{ doc.(.*?) }}.*?/g;
    // Get an array containing the first capturing group for every match
    var matches = getMatches(strRet, myRegEx, 1);

    for (var i = 0; i < matches.length; i++) {

        if (!checkKeyExistInJson(matches[i], formDataString)) {
            strRet = strRet.replace('{{ doc.' + matches[i] + ' }}', '');
            //console.log('{{ doc.' + matches[i] + ' }} is replaced.');
        }
    }

    return strRet;
}

function checkKeyExistInJson(key, targetString) {

    var bRet = false;

    /*var keys = [];
    keys = key.split('.');

    var tKey = keys[keys.length - 1];

    var doublePattern = "\"" + tKey + "\"";
    var singlePattern = "'" + tKey + "'";

    if (targetString.indexOf(doublePattern) > -1 || targetString.indexOf(singlePattern) > -1) {
        bRet = true;
    }*/
    
    if(getInfo(key) != undefined)
    	bRet = true;

    return bRet;
}


function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

function getDataForDynamicCtrl(target) {
    //debugger;
    var xmlRet = '';
    //rField 처리
    $(target).find('*[data-type="rField"]').each(function (i, fld) {
        var dataElmType = $(fld).attr('data-element-type');
        if (typeof dataElmType != 'undefined') {
            var elmName = $(fld).attr('name');
            //sel_t 처리, text를 저장
            if (dataElmType == 'sel_t') {
                if (typeof elmName != 'undefined') {
                    xmlRet += "<" + elmName + ">" + $(fld).find('option:selected').text() + "</" + elmName + ">";
                }
            }//sel_v 처리, value를 저장
            else if (dataElmType == 'sel_v') {
                if (typeof elmName != 'undefined') {
                    xmlRet += "<" + elmName + ">" + $(fld).find('option:selected').val() + "</" + elmName + ">";
                }
            }
        }
        

    });

    return xmlRet;
}

//값의 배열 여부를 조사하여, 배열이 아닐 경우 배열로 리턴
function validateArray(obj) {
    var ret = [];

    if (!$.isArray(obj)) {
        ret.push(obj);
    }
    else {
        ret = obj;
    }

    return ret;
}

function postJobForDynamicCtrl() {
    //refactoring - 성능 고려
    //data-element-type 속성을 가진(rField와 stField는 공통 컴포넌트에서 처리)
    var $selectedElms = $('#editor').find('[data-element-type]').not('[data-type="rField"],[data-type="stField"]')
    if ($selectedElms.length > 0) {
        $selectedElms.each(function (idx, elm) {
            var $elm = $(elm);
            var dataElmType = $elm.attr("data-element-type");
            var dataType = $elm.attr("data-type");

            //alert(dataElmType + ', ' + dataType);
            switch (dataElmType) {

                case "chk_d":
                    postChkJob($elm, dataElmType, dataType);
                    break;

                case "chk_v":
                    postChkJob($elm, dataElmType, dataType);
                    break;

                case "sel_d_v":
                    postSelJob($elm, dataElmType, dataType);
                    break;

                case "sel_d_t":
                    postSelJob($elm, dataElmType, dataType);
                    break;

                case "rdo_d":
                    postRdoJob($elm, dataElmType, dataType);
                    break;

                case "rdo_v":
                    postRdoJob($elm, dataElmType, dataType);
                    break;

                case "editor":
                    postEditorJob($elm);
                    break;

                case "textarea_linebreak":
                    postTextareaJob($elm, dataElmType, dataType);
                    break;

            }
        });
    }

}

function postTextareaJob(elm, dataElmType, dataType) {
    var txtData;
    txtData = postDataJob(elm, dataElmType, dataType);

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {
        if (txtData != "" && typeof txtData != 'undefined') {
            //[2015-10-28 modi kh] modify textarea space format style s -----
            txtData = txtData.replace(/ /g, '&nbsp;');
            $(elm).css('display', 'inline-block');
            //e -------------------------------------------------------------

            elm.html(txtData.replace(/\n/gi, "<br \/>"));
        }
    }
    else {//임시 저장 처리

    }

}

function postDataJob(elm, dataElmType, dataType) {
    var retData;

    //data 처리
    try {
        switch (dataType) {
            case "mField":
                if (typeof formJson.BodyContext != 'undefined') {
                    // 체크박스의 경우
                    if (dataElmType.indexOf('chk') > -1) {
                        retData = validateArray(formJson.BodyContext[getNodeName(elm)]);
                    }
                    else if (dataElmType.indexOf('sel_d_t') > -1) {
                        retData = {};
                        retData["VALUE"] = formJson.BodyContext[getNodeName(elm)];
                        retData["TEXT"] = formJson.BodyContext[getNodeName(elm) + '_TEXT'];
                    }
                    else if (dataElmType.indexOf('rdo_v') > -1) {
                        retData = {};
                        retData["VALUE"] = formJson.BodyContext[getNodeName(elm)];
                        retData["TEXT"] = formJson.BodyContext[getNodeName(elm) + '_TEXT'];
                    }
                    else {
                        retData = formJson.BodyContext[getNodeName(elm)];
                    }
                }
                break;
            case "dField":
                if (typeof formJson.oFormData != 'undefined') {
                    // 체크박스의 경우
                    if (dataElmType.indexOf('chk') > -1) {
                        retData = validateArray(removeSeperatorForSingle(formJson.oFormData[getNodeName(elm)]));
                    }
                    else {
                        retData = formJson.oFormData[getNodeName(elm)];
                    }
                }
                break;
            case "smField": 
            	if (formJson.BodyData != null) {
                    // 체크박스의 경우
                    if (dataElmType.indexOf('chk') > -1) {
                        retData = validateArray(removeSeperatorForSingle(formJson.BodyData.MainTable[getNodeName(elm)]));
                    } else if (dataElmType.indexOf('sel_d_t') > -1) {			// [2015-01-28] smField select text
                        retData = {};
                        retData["VALUE"] = formJson.BodyData.MainTable[getNodeName(elm)];
                        retData["TEXT"] = elm.find("option[value='" + retData["VALUE"] + "']").text();
                    } else {
                        retData = formJson.BodyData.MainTable[getNodeName(elm)];
                    }
                }
                break;
            default:
                retData = "";
                break;
        }
    } catch (e) {
        alert("error at postDataJob : " + e.message);
    }

    return (retData == null) ? "" : retData;
}

function postEditorJob(elm) {
	if(getInfo("ExtInfo.UseHWPEditYN") == "Y") return;
	
    //읽기 처리
    if (getInfo("Request.templatemode") == "Read" && getInfo("FormInfo.FormPrefix") == "WF_FORM_EXTERNAL") {
        var replaceHtml = '';
        replaceHtml += '<table class="table_form_info_draft" cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 5px; table-layout: fixed; min-height: 350px;">';
        replaceHtml += '    <tr>';
        replaceHtml += '        <td width="100%" height="100%" id="{0}" valign="top" style="padding:13px;padding-right:27px"></td>';
        replaceHtml += '    </tr>';
        replaceHtml += '</table>';

        //replacewith
        elm.replaceWith(replaceHtml.f("tbContentElement"));
        //editor 내용 set
        setEditor();
    }
    else if (getInfo("Request.templatemode") == "Read") {
        var replaceHtml = '';
        replaceHtml += '<table class="table_form_info_draft" cellpadding="0" cellspacing="0" style="margin-top: 5px; table-layout: fixed; min-height: 580px; width:100%; border:hidden;">';
        replaceHtml += '    <tr>';
        replaceHtml += '        <td width="100%" height="100%" id="{0}" valign="top" style="padding:0px"></td>';// style="padding:13px;padding-right:27px"
        replaceHtml += '    </tr>';
        replaceHtml += '</table>';

        //replacewith
        elm.replaceWith(replaceHtml.f("tbContentElement"));
        //editor 내용 set
        setEditor();
    }
}

function postRdoJob(elm, dataElmType, dataType) {

    var rdoData;
    rdoData = postDataJob(elm, dataElmType, dataType);

    //읽기 처리
    if (getInfo("Request.templatemode") == "Read") {

        if (dataElmType == "rdo_d") {
            // radio 처리, rdo_d
            elm.find('input:radio').each(function () {
                // input radio -> span
                var replaceHtml = "<span>";
                if (rdoData != "" && typeof rdoData != 'undefined') {
                    // [2016-09-09 leesm] BC카드 Radio 분산으로 인해 Array로 데이터가 구성되므로 추가함
                    if (rdoData instanceof Array) {
                        if (rdoData[0] != "") {
                            if (rdoData[0] == $(this).val()) {
                                replaceHtml += "●";
                            }
                            else {
                                replaceHtml += "○";
                            }
                        }
                        else {
                            replaceHtml += "○";
                        }
                    }
                    else {
                        if (rdoData == $(this).val()) {
                            replaceHtml += "●";
                        }
                        else {
                            replaceHtml += "○";
                        }
                    }
                }
                else {
                    replaceHtml += "○";
                }
                replaceHtml += "</span>&nbsp;";

                //replacewith
                $(this).replaceWith(replaceHtml);

            });

        }
        else if (dataElmType == "rdo_v") {
            // radio 처리, rdo_v
            var replaceHtml = "<span>";
            if (rdoData != "" && typeof rdoData != 'undefined') {

                if (rdoData.hasOwnProperty('TEXT')) {
                    replaceHtml += typeof rdoData.TEXT != 'undefined' ? rdoData.TEXT : '';
                }
                else {
                    replaceHtml += rdoData;
                }
            }
            replaceHtml += "</span>";
            elm.replaceWith(replaceHtml);
        }

    } else {
        //임시저장 처리
        // select 처리
        if (rdoData != "" && typeof rdoData != 'undefined') {
            var rdoValue;
            if (rdoData.hasOwnProperty('VALUE')) {
                rdoValue = rdoData.VALUE;
            }
            else {
                rdoValue = rdoData;
            }

            if (typeof rdoValue != 'undefined') {
                elm.find('input:radio').each(function () {

                    if (rdoValue.indexOf($(this).val()) > -1) {
                        $(this).attr("checked", true);
                    }

                });
            }

        }

    }

}

function postSelJob(elm, dataElmType, dataType) {
    var selData = '';

    selData = postDataJob(elm, dataElmType, dataType);

    //읽기 처리
    if (getInfo("Request.templatemode") == "Read") {
        if (dataElmType == "sel_d_v") {         //특수한 경우 처리, SAVE_TERM, DOC_LEVEL
            var nodeName = getNodeName(elm);

            var replaceHtml = "<span>";

            if (nodeName == "SaveTerm") {
                replaceHtml += getSaveTerm(getInfo("FormInstanceInfo.SaveTerm"));
            }
            else if (nodeName == "DocLevel") {
                replaceHtml += getDocLevel(getInfo("FormInstanceInfo.DocLevel"));
            }
            else {
                if (selData != "" && typeof selData != 'undefined' && selData != null) {
                    if (selData != '0') {
                        replaceHtml += selData;
                    }
                }
            }

            replaceHtml += "</span>&nbsp;";

            //replacewith
            elm.replaceWith(replaceHtml);
        }
        else if (dataElmType == "sel_d_t") {
            var replaceHtml = "";

            replaceHtml += "<span>";

            if (selData != "" && typeof selData != 'undefined' && selData != null) {
                if (selData.hasOwnProperty('TEXT')) {
                    if (selData.VALUE != '0') {
                        if (typeof selData.TEXT != 'undefined') {
                            replaceHtml += selData.TEXT == null ? '' : selData.TEXT;
                        }
                        else {
                            replaceHtml += '';
                        }
                    }
                }
                else {
                    if (selData != '0') {
                        replaceHtml += selData;
                    }
                }
            }
            replaceHtml += "</span>&nbsp;";

            elm.replaceWith(replaceHtml);
        }

    }
    else {      //임시저장 처리
        if (selData != null && selData != "" && typeof selData != 'undefined') {        // select 처리
            var selValue;

            if (selData.hasOwnProperty('VALUE')) {
                selValue = selData.VALUE;
            }
            else {
                selValue = selData;
            }

            if (typeof selValue != 'undefined') {
                elm.find('option[value="' + selValue + '"]').attr('selected', true);
            }
        }
    }
}

function postChkJob(elm, dataElmType, dataType) {

    var chkData;
    chkData = postDataJob(elm, dataElmType, dataType);

    //읽기 처리
    if (getInfo("Request.templatemode") == "Read") {

        if (dataElmType == "chk_d") {

            elm.find('input:checkbox').each(function () {
                // input checkbox -> span
                var replaceHtml = "<span>";
                if (chkData != "" && typeof chkData != 'undefined') {

                    if ($.inArray($(this).val(), chkData) > -1) {
                        replaceHtml += "■";
                    }
                    else {
                        replaceHtml += "□";
                    }
                }
                else {
                    replaceHtml += "□";
                }

                replaceHtml += "</span>&nbsp;";

                //replacewith
                $(this).replaceWith(replaceHtml);
            });

        }
        else if (dataElmType == "chk_v") {

            // input checkbox -> span
            var replaceHtml = "<span>";

            if (chkData != "" && typeof chkData != 'undefined') {

                for (var i = 0; i < chkData.length; i++) {
                    replaceHtml += chkData[i];
                    if (i != (chkData.length - 1)) {
                        replaceHtml += ", ";
                    }
                }

            }
            replaceHtml += "</span>&nbsp;";

            //replacewith
            elm.replaceWith(replaceHtml);
        }

    } else {
        //임시저장 처리
        if (chkData != "" && typeof chkData != 'undefined') {
            elm.find('input:checkbox').each(function () {

                if ($.inArray($(this).val(), chkData) > -1) {
                    $(this).attr("checked", true);
                }

            });
        }
    }

}

function removeSeperatorForSingle(obj) {
    var ret;

    if (typeof obj != 'undefined' && obj != null) {
        if (obj.indexOf('|') > -1) {
            ret = obj.split('|');
        }
        else {
            ret = obj;
        }
    }
    
    return ret;
}

// json object의 값에 구분자를 포함한 경우 배열로 변환하는 함수
function removeSeperatorForMultiRow(jsonObj) {

    if (typeof jsonObj != 'undefined' && jsonObj != null) {
        //배열 형태이면 each를 두번
        if ($.isArray(jsonObj)) {
            $.each(jsonObj, function () {
            	var $row = this;
            	$.each(this, function (k, v) {
            		if (typeof v != 'undefined' && v != null) {
            			if (v.indexOf('|') > -1) {
            				var tempArr = v.split('|');
            				$row[k] = tempArr;
            			}
            		}
                });
            });
        }
        else {
            $.each(jsonObj, function (k, v) {
                //구분자 처리 가능한 값 '|'
                if (typeof v != 'undefined' && v != null) {
                    var $row = this;
                    if (v.indexOf('|') > -1) {
                        var tempArr = v.split('|');
                        $row[k] = tempArr;
                    }
                }
            });
        }
    }
    
    return jsonObj;
}

//특정 data 처리를 위한 함수
function commonDataChanger() {
    // 재사용 시 data 처리
    if (getInfo("Request.reuse") == "Y" || getInfo("Request.reuse") == "P") {
        if (getInfo("Request.mode") != "DRAFT" && getInfo("Request.mode") != "TEMPSAVE" && getInfo("Request.readtype") != "preview") { // 미리보기 창 예외
            setInfo("FormInstanceInfo.FormInstID", "");		// 비사용 getInfo("fiid_reuse"));
            setInfo("REPLY", "");
            setInfo("ProcessInfo.ProcessID", "");		// 비사용 getInfo("piid_spare"));
            setInfo("ProcessInfo.ProcessDescription", "");
            setInfo("Request.mode", "DRAFT");
            setInfo("Request.loct", "DRAFT");
            //document.getElementById("APVLIST").value = "";
            setInfo("FormInstanceInfo.DocNo", "");
            setInfo("FormInstanceInfo.ReceiveNo", "");
            setInfo("FormInstanceInfo.InitiatorID", getInfo("AppInfo.usid"));
            setInfo("FormInstanceInfo.InitiatorName", getInfo("AppInfo.usnm"));
            setInfo("FormInstanceInfo.InitiatorUnitID", getInfo("AppInfo.dpid_apv"));
            setInfo("FormInstanceInfo.InitiatorUnitName", getInfo("AppInfo.dpdn_apv"));
            setInfo("Request.workitemID", ""); //201107 재사용으로 임시저장 시 결재선 저장을 위해 처리
            //의견부분 삭제 
            setInfo("JWF_Comment", "");
            //document.getElementById("APVLIST").value = getApvListReUse();
            //setInfo("ApprovalLine", document.getElementById("APVLIST").value);
            var reuseApv = getApvListReUse();
            //setInfo("APVLIST", reuseApv);
            setInfo("ApprovalLine", reuseApv);
        }

    } else if (getInfo("Request.reuse") == "YH") { //회신옵션 추가 20150129
        var oldSubject = getInfo("FormInstanceInfo.Subject");
        //formJson.BodyContext.tbContentElement["#cdata-section"] = "<HTML><HEAD><META content='text/html; charset=utf-8' http-equiv='Content-Type'/><META name='GENERATOR' content='ActiveSquare'/></HEAD><BODY style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[" + getInfo("FormInstanceInfo.Subject") + "] 에 대한 회신의 건</P><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</P><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 귀 부서의 업무협조에 감사드립니다.</P><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2. [" + getInfo("FormInstanceInfo.DocNo") + "]에 대해 아래와 같이 회신 하오니 업무에 참고 바랍니다.</P><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt' align='center'>- 아&nbsp;&nbsp;&nbsp;&nbsp; 래 -</P></BODY></HTML>";
        formJson.BodyContext.tbContentElement["#cdata-section"] = "<HTML><HEAD><META content='text/html; charset=utf-8' http-equiv='Content-Type'/><META name='GENERATOR' content='ActiveSquare'/></HEAD><BODY style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 귀 부서의 업무협조에 감사드립니다.</P><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt'>&nbsp;&nbsp;&nbsp;&nbsp; 2. [" + getInfo("FormInstanceInfo.DocNo") + "]에 대해 아래와 같이 회신 하오니 업무에 참고 바랍니다.</P><P style='FONT-FAMILY: 바탕체; FONT-SIZE: 11pt' align='center'>- 아&nbsp;&nbsp;&nbsp;&nbsp; 래 -</P></BODY></HTML>";
        if (getInfo("Request.readtype") != 'preview') { setInfo("SUBJECT", "[" + getInfo("FormInstanceInfo.Subject") + "] 에 대한 회신의 건"); }

        //회신용 재기안지에 발신부서 정보를 수신부서에 넣기 
        var receiptList = getInfo("FormInstanceInfo.InitiatorUnitID") + "|" + "X" + "@@";  //부서코드|N@@ 
        setInfo("RECEIPT_LIST", receiptList);

        var receiptListName = "0:" + getInfo("FormInstanceInfo.InitiatorUnitID") + ":" + XFN_ReplaceAllChars(getInfo("FormInstanceInfo.InitiatorUnitName"), ";", "^") + ":X:";  //0:A90:감사팀^Auditing Team^^^^^^^^:X:
        setInfo("RECEIVE_NAMES", receiptListName);

        //        document.getElementsByName("RECEIPT_LIST")[0].value = receiptList;
        //        document.getElementsByName("RECEIVE_NAMES")[0].value = receiptListName;

        //수신처 다시 Display
        //$("input[name=recipient]").val(initRecList("R"));
        var vRecipient = receiptListName.split(":")[2].split("^")[0];  //수신처명
        $("input[name=recipient]").val(vRecipient);

        //BODY_CONTEXT에 특정필드값 재대입
        var oXML = $.parseXML(getInfo("BodyContext"));
        $(oXML).find("recipient").text(vRecipient);  //수신처명

        var linkSubject = "";
        linkSubject = getInfo("ProcessInfo.ProcessID") + "@@@" + getInfo("FormInfo.FormPrefix") + "@@@" + oldSubject + "@@@" + getInfo("FormInstanceInfo.DocNo");
        $(oXML).find("REJECTDOCLINKS").text(linkSubject.replace(/&quot;/gi, '"').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));  //원문서
        formJson.BodyContext.REJECTDOCLINKS = linkSubject.replace(/&quot;/gi, '"').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
        setInfo("BODY_CONTEXT", CFN_XmlToString(oXML));

        setInfo("FormInstanceInfo.FormInstID", getInfo("FormInstanceInfo.fiid_spare")); setInfo("fiid_spare", getInfo("FormInstanceInfo.FormInstID"));
        setInfo("ProcessInfo.ProcessID", ""); 	//비사용 getInfo("piid_spare")); 
        setInfo("ProcessInfo.ProcessDescription", ""); setInfo("Request.mode", "DRAFT"); setInfo("Request.loct", "DRAFT");
        //        document.getElementById("APVLIST").value = "";
        setInfo("FormInstanceInfo.DocNo", ""); setInfo("FormInstanceInfo.ReceiveNo", ""); setInfo("FormInstanceInfo.InitiatorID", getInfo("AppInfo.usid")); setInfo("FormInstanceInfo.InitiatorName", getInfo("AppInfo.usnm")); setInfo("FormInstanceInfo.InitiatorUnitID", getInfo("AppInfo.dpid_apv")); setInfo("FormInstanceInfo.InitiatorUnitName", getInfo("AppInfo.dpdn_apv"));
        setInfo("Request.workitemID", ""); //201107 재사용으로 임시저장 시 결재선 저장을 위해 처리
        setInfo("pfsk", "");    //수신부서에 도착하고 완료되지 않은 문서에서도 회신버튼 동작하도록 하기 위하여 추가, 담당자만 지정시 pfsk가 T008이어서 mode가 REDRAFT로 변경되고 있었음
        setInfo("JWF_Comment", "<WF_COMMENT></WF_COMMENT>");

        var reuseApv = '<steps initiatorcode="' + getInfo("AppInfo.usid") + '" initiatoroucode="' + getInfo("AppInfo.dpid_apv") + '" status="inactive"></steps>';
        setInfo("APVLIST", reuseApv);
        setInfo("ApprovalLine", reuseApv);
        setDomainData(); //기본결재선 조회
        var BodyXml = $.parseXML(getInfo("BodyContext"));
        $(BodyXml).find("INITIATOR_OU_DP").text(m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false));
        $(BodyXml).find("INITIATOR_DP").text(m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false));

        setInfo("BODY_CONTEXT", CFN_XmlToString(BodyXml));
    }else if(CFN_GetQueryString("RequestFormInstID") != "" && CFN_GetQueryString("RequestFormInstID") != "undefined"){
    	var reuseApv = getApvListReUse();
        setInfo("ApprovalLine", reuseApv);
    }

    // 히스토리 기능을 위한 데이터 변환
    if (gIsHistoryView == 'true') {
        //히스토리 버젼이 0인 경우는 최종 버젼
        if (gHistoryRev != '0') {
            var editedData;
            if (parent != null) {
                editedData = parent.sFormJson;
                if (editedData != '' || editedData != null) {
                    setHistoryData(editedData, gHistoryRev);
                }
            }

        }

    }
    
}

/**
 * xml -> json
 */
function setHistoryData(eData, eRev) {
    setInfo("Request.mode", "COMPLETE");
    setInfo("Request.loct", "COMPLETE");
    var jsonFormJSON = $.parseJSON(eData);
    //var FormNodes = jsonFormJSON.documentElement.childNodes;
    $$(jsonFormJSON).find("NewDataSet>Table").concat().each(function (i, elm) {
        setInfo($$(elm).attr("FieldName"), $$(elm).attr("ModValue"));
    });
}

function setHistoryMenu() {
//히스토리 보기 시 메뉴영역 그리지 않는다.
//    document.getElementById("divMenu").style.display = "none";
//    document.getElementById("divMenu02").style.display = "none";
//    //document.getElementById("AppLine").style.display = "none";
//    document.getElementById("secrecy").style.display = "none";

    initForm();
    var m_oApvList = $.parseJSON(getInfo("ApprovalLine"));
    //setInlineApvList(m_oApvList);
    var ApvLines = __setInlineApvList(m_oApvList);
    drawFormApvLinesAll(ApvLines);
}

//읽기 / 쓰기 양식 통합처리를 위한 공통 변환 함수
function commonReplace() {
    var fld;
    var l_editor = "#editor";
    
    //select 처리
    $(l_editor).find('select[data-type="mField"], select[data-type="dField"]').each(function (i, fld) {

        var attrs = {};
        attrs["id"] = $(fld).attr('id');
        attrs["data-type"] = "tField";
        attrs["data-model"] = $(fld).attr('id');
        
        changeElementType($(fld), "span", attrs);
    });

    //input, textarea 처리

}

//Element type을 newType에 new attribute로 바꾸는 함수
function changeElementType(elm, newType, newAttrs, newInnerHtml) {
    elm.replaceWith(function () {
        return $("<" + newType + "/>", newAttrs).append($(this).contents()).html(newInnerHtml);
    });
}

// array null 체크
function checkNullForArray(arr) {
    var newArray = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != "" && arr[i] != null) {
            newArray.push(arr[i]);
        }
    }

    return newArray;
}

// jQuery string.format 처리
// 사용법 'this is {0}'.f('apple') => this is apple
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

//Form Data 쪽 처리를 위해 추가한 함수
//json string 내의 parsing시 오류를 일으키는 문자 제거 -> 인코딩으로 주석
/*
function validateJsonStr(jsonStr) {
    return jsonStr
        .replace(/[\\]/g, '/')
        //.replace(/[\"]/g, '\\"')
        //.replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '')
        .replace(/[\f]/g, '')
        .replace(/[\n]/g, '')
        .replace(/[\r]/g, '')
        .replace(/[\t]/g, '');
}
*/
function escapeHtml(text) {
	if(typeof(text) == "string"){
	  return text
	      .replace(/&/g, "&amp;")
	      .replace(/</g, "&lt;")
	      .replace(/>/g, "&gt;")
	      .replace(/"/g, "&quot;")
	      .replace(/'/g, "&#039;");
	}else{
		return text;
	}
}

function decodeJsonObj(json) {
    var decodedObj = {};

    for (var key in json) {

        if (json[key] != null || json[key] != "") {

            var tempObj = {};
            var subJson = json[key];
            for (var subKey in subJson) {
                if (subJson[subKey] != null || subJson[subKey] != "") {
                    try {
                        tempObj[subKey] = Base64.decode(subJson[subKey]);
                    } catch (e) {
                        tempObj[subKey] = e.toString();
                    }
                }
            }

            decodedObj[key] = tempObj;
        }
    }

    return decodedObj;
}

//json object 병합
function mergeJsonObj(json1, json2) {
    var merged = {};
    for (var i in json1) {
        if (json1.hasOwnProperty(i))
            merged[i] = json1[i];
    }
    for (var i in json2) {
        if (json2.hasOwnProperty(i))
            merged[i] = json2[i];
    }

    return merged;
}

// Changes XML to JSON
function xmlToJson(xml) {

    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

//언어index 분기 처리
function returnLangUsingLangIdx(langIdx) {
    /*
    case "KO": szReturn = "0"; break;
    case "EN": szReturn = "1"; break;
    case "JA": szReturn = "2"; break;
    case "ZH": szReturn = "3"; break;
    
    */
    var retObj;

    switch (langIdx) {
        case 0:
            retObj = localLang_ko;
            break;
        case 1:
            retObj = localLang_en;
            break;
        case 2:
            retObj = localLang_ja;
            break;
        case 3:
            retObj = localLang_zh;
            break;
    }

    return retObj;
}

function LoadEditor(elm) {
    //전자결재 양식이 Write 모드일때 BaseConfig의 에디터 로딩체크 기능 실행 여부 확인
    //Date : 2016-03-24
    //Author : YJYOO
    if (coviCmn.configMap.CheckApprovalEditorLoad == null || coviCmn.configMap.CheckApprovalEditorLoad.toUpperCase() == "" || coviCmn.configMap.CheckApprovalEditorLoad.toUpperCase() == "N") {
        //debugger;
        //0.TextArea, 1.DHtml, 2.TagFree, 3.XFree, 4.TagFree/XFree, 5.Activesquare, 6.CrossEditor, 7.ActivesquareDefault/CrossEditor
        //g_id = "tbContentElement";
        //gx_id = "tbContentElement";
        //g_editorTollBar = '0'; // 웹에디터 툴바 타입 설정 : 0-모든 툴바 표시 , 1-위쪽 툴바만 표시, 2-아래쪽 툴바만 표시
        //g_heigth = "400";

        //editor 영역
        switch (coviCmn.configMap.EditorType) {
            case "0":
                $('#' + elm).html('<textarea id=\"' + g_id + '\" name=\"' + g_id + '\" style="width: 98%; height: ' + g_heigth + 'px;"></textarea>');
                break;
            case "1":
                break;
            case "2":
                //eHtml += '<script src="/WebSite/Common/ExControls/TagFree/tweditor.js" type="text/javascript"></script>';
                //eHtml += '<script language="javascript" for="' + g_id + '" event="OnControlInit">EditorSetContent();</script>';
                $('#' + elm).html(LoadtweditorForApproval())
                    .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');
                break;
            case "3":
                //eHtml += '<script src="/WebSite/Common/ExControls/XFree/XFreeEditor.js" type="text/javascript"></script>';
                $('#' + elm).append('<div id="hDivEditor" style="width: 100%; height:100%;"></div>')
                    .append('<iframe id="xFreeFrame" src="/WebSite/Approval/Forms/Templates/common/XFree.html" marginwidth="0" frameborder="0" scrolling="no" ></iframe>');

                //setTimeout("setEditor()", 1000);
                timerXFree = setInterval("setXFreeWhenAvailable()", 500);
                break;
            case "4":
                if (_ie) {
                    //eHtml += '<script src="/WebSite/Common/ExControls/TagFree/tweditor.js" type="text/javascript"></script>';
                    //eHtml += '<script language="javascript" for="' + g_id + '" event="OnControlInit">EditorSetContent();</script>';

                    $('#' + elm).html(LoadtweditorForApproval())
                        .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');
                }
                else {
                    //eHtml += '<script src="/WebSite/Common/ExControls/XFree/XFreeEditor.js" type="text/javascript"></script>';
                    //iFrame 방식
                    $('#' + elm).append('<div id="hDivEditor" style="width: 100%; height:100%;"></div>')
                        .append('<iframe id="xFreeFrame" src="/WebSite/Approval/Forms/Templates/common/XFree.html" marginwidth="0" frameborder="0" scrolling="no" ></iframe>');

                    //기존 방식 -> 화면 초기화 문제점 발생
                    //LoadXFreeEditor();

                    //setTimeout("setEditor()", 1000);
                    //[2015-06-26 modi kh] XFree Design에 기본 양식 포맷 내용 안보이는 현상 수정 - interval 100 -> 500
                    timerXFree = setInterval("setXFreeWhenAvailable()", 500);
                }
                break;
            case "5":
                break;
            case "6":
                break;
            case "7":
                break;
            case "8":
                // TODO: DEXT5 Test by Kyle 2015-07-30
                // DEXT5 Editor Loading
                //$('#' + elm)
                //        .append('<script type="text/javascript" src="/covicore/resources/script/Dext5/js/dext5editor.js"></script>')
                //        .append('<iframe id="dext5Frame" src="' + Common.getGlobalProperties("editor.path") +'Dext5.html" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="600" ></iframe>')
                //        .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');//width="730" height="600"
                coviEditor.loadEditor(
                		elm,
        			{
        				editorType : "dext5",
        				containerID : 'tbContentElement',
        				frameHeight : '600',
        				focusObjID : '',
        				onLoad: function(){
        					setEditor();
        				}
        			}
        		);
                //setTimeout("setEditor()", 1000);
                break;
            case "9":
                // TODO: DEXT5 Test by Kyle 2015-08-04
                // ChEditor Loading
                $('#' + elm)
                        .append('<script type="text/javascript" src="/WebSite/Common/ExControls/Cheditor/cheditor.js"></script>')
                        .append('<iframe id="cheditorFrame" src="/WebSite/Approval/Forms/Templates/common/Cheditor.html" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="500" ></iframe>')
                        .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');//width="730" height="600"
                break;
            case "10":
                coviEditor.loadEditor(
                		elm,
        			{
        				editorType : "synap",
        				containerID : 'tbContentElement',
        				frameHeight : '600',
        				focusObjID : '',
        				onLoad: function(){
        					setEditor();
        				}
        			}
        		);
                break;
            default:
                break;
        }
    }
    else {
        //debugger;
        //0.TextArea, 1.DHtml, 2.TagFree, 3.XFree, 4.TagFree/XFree, 5.Activesquare, 6.CrossEditor, 7.ActivesquareDefault/CrossEditor
        //g_id = "tbContentElement";
        //gx_id = "tbContentElement";
        //g_editorTollBar = '0'; // 웹에디터 툴바 타입 설정 : 0-모든 툴바 표시 , 1-위쪽 툴바만 표시, 2-아래쪽 툴바만 표시
        //g_heigth = "400";

        //editor 영역
        switch (coviCmn.configMap.EditorType) {
            case "0":
                $('#' + elm).html('<textarea id=\"' + g_id + '\" name=\"' + g_id + '\" style="width: 98%; height: ' + g_heigth + 'px;"></textarea>');
                break;
            case "1":
                break;
            case "2":
                //eHtml += '<script src="/WebSite/Common/ExControls/TagFree/tweditor.js" type="text/javascript"></script>';
                //eHtml += '<script language="javascript" for="' + g_id + '" event="OnControlInit">EditorSetContent();</script>';
                $('#' + elm).html(LoadtweditorForApproval())
                    .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');
                break;
            case "3":
                //eHtml += '<script src="/WebSite/Common/ExControls/XFree/XFreeEditor.js" type="text/javascript"></script>';
                $('#' + elm).append('<div id="hDivEditor" style="width: 100%; height:100%;"></div>')
                    .append('<iframe id="xFreeFrame" src="/WebSite/Approval/Forms/Templates/common/XFree.html" marginwidth="0" frameborder="0" scrolling="no" ></iframe>');

                //setTimeout("setEditor()", 1000);
                //timerXFree = setInterval("setXFreeWhenAvailable()", 500);
                break;
            case "4":
                if (_ie) {
                    //eHtml += '<script src="/WebSite/Common/ExControls/TagFree/tweditor.js" type="text/javascript"></script>';
                    //eHtml += '<script language="javascript" for="' + g_id + '" event="OnControlInit">EditorSetContent();</script>';

                    $('#' + elm).html(LoadtweditorForApproval())
                        .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');
                }
                else {
                    //eHtml += '<script src="/WebSite/Common/ExControls/XFree/XFreeEditor.js" type="text/javascript"></script>';
                    //iFrame 방식
                    $('#' + elm).append('<div id="hDivEditor" style="width: 100%; height:100%;"></div>')
                        .append('<iframe id="xFreeFrame" src="/WebSite/Approval/Forms/Templates/common/XFree.html" marginwidth="0" frameborder="0" scrolling="no" ></iframe>');

                    //기존 방식 -> 화면 초기화 문제점 발생
                    //LoadXFreeEditor();

                    //setTimeout("setEditor()", 1000);
                    //[2015-06-26 modi kh] XFree Design에 기본 양식 포맷 내용 안보이는 현상 수정 - interval 100 -> 500
                    //timerXFree = setInterval("setXFreeWhenAvailable()", 500);
                }
                break;
            case "5":
                break;
            case "6":
                break;
            case "7":
                break;
            case "8":
                // TODO: DEXT5 Test by Kyle 2015-07-30
                // DEXT5 Editor Loading
                $('#' + elm)
                        .append('<script type="text/javascript" src="/WebSite/Common/ExControls/dext5editor/js/dext5editor.js"></script> ')
                        .append('<iframe id="dext5Frame" src="/WebSite/Approval/Forms/Templates/common/Dext5.html" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="600" ></iframe>')
                //.append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);function dext_editor_loaded_event(editor) {Common.AlertClose();}</script>');//width="730" height="600"
                        .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');//width="730" height="600"

                break;
            case "9":
                // TODO: DEXT5 Test by Kyle 2015-08-04
                // ChEditor Loading
                $('#' + elm)
                        .append('<script type="text/javascript" src="/WebSite/Common/ExControls/Cheditor/cheditor.js"></script>')
                        .append('<iframe id="cheditorFrame" src="/WebSite/Approval/Forms/Templates/common/Cheditor.html" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="500" ></iframe>')
                        .append('<script language="javascript" for="' + g_id + '" event="OnControlInit">setTimeout("setEditor()", 1000);</script>');//width="730" height="600"
                break;
            default:
                break;
        }
        //LoadEditor 호출 이후 Loading 창 발생
        if (coviCmn.configMap.EditorType == "2" || coviCmn.configMap.EditorType == "3" || coviCmn.configMap.EditorType == "4" || coviCmn.configMap.EditorType == "8") {
            Common.Loading("Loading...", function () {
                editorStatusCheck();
            }, 300);
        }
    }
}

/*
* Editor 정상 로딩 여부 확인(TagFree / XFREE)
* Date : 2016-03-21
* Author : YJYOO
*/
function editorStatusCheck() {
    if (getInfo("BaseConfig.editortype") == "2") {//2.TagFree
        if (document.tbContentElement == null || document.tbContentElement.ActiveTab == undefined || document.tbContentElement.ActiveTab < 0) {
            setTimeout("editorStatusCheck()", 500);
        }
        else {
            Common.AlertClose();
            return true;
        }
    }
    else if (getInfo("BaseConfig.editortype") == "3") {//3.XFree
        if (document.getElementById('xFreeFrame').contentWindow == undefined || document.getElementById('xFreeFrame').contentWindow.isLoaded == undefined || !document.getElementById('xFreeFrame').contentWindow.isLoaded) {
            setTimeout("editorStatusCheck()", 500);
        }
        else {
            setTimeout("setEditor()", 500);
            Common.AlertClose();
            return true;
        }

    }
    else if (getInfo("BaseConfig.editortype") == "4") {//4.TagFree/XFree
        if (_ie) {
            if (document.tbContentElement == null || document.tbContentElement.ActiveTab == undefined || document.tbContentElement.ActiveTab < 0) {
                setTimeout("editorStatusCheck()", 500);
            }
            else {
                Common.AlertClose();
                return true;
            }
        }
        else {
            if (document.getElementById('xFreeFrame').contentWindow == undefined || document.getElementById('xFreeFrame').contentWindow.isLoaded == undefined || !document.getElementById('xFreeFrame').contentWindow.isLoaded) {
                setTimeout("editorStatusCheck()", 500);
            }
            else {
                setTimeout("setEditor()", 500);
                Common.AlertClose();
                return true;
            }
        }
    }
}

//XFree 에디터 data를 set하는 부분, try/catch 구문으로 에디터의 onload 시점을 판단
var timerXFree;
var timerXfreeCnt = 0;
function setXFreeWhenAvailable() {

    timerXfreeCnt++;

    try {
        // 기존의 var tempVal = document.getElementById('xFreeFrame').contentWindow.tbContentElement.getHtmlValue(); 부분을 주석처리함
        // Tagfree 사로 부터 Xfree 에디터가 로딩 완료되면 발생되는 onLoad 이벤트에서 할당받는 변수를 사용하도록 Guide함
        //var tempVal = document.getElementById('xFreeFrame').contentWindow.tbContentElement.getHtmlValue();
        if (document.getElementById('xFreeFrame').contentWindow.isLoaded){
            clearInterval(timerXFree);
            timerXfreeCnt = 0;
            setTimeout("setEditor()", 500);
        }
        else {
            if (timerXfreeCnt == 10) {
                clearInterval(timerXFree);
                timerXfreeCnt = 0;
            }
        }
    } catch (e) {
        if (timerXfreeCnt == 10) {
            clearInterval(timerXFree);
            timerXfreeCnt = 0;
        }
    }

}

//---------------------------- 이하 기존 함수-------------------------------------------------------



function event_false(oBtn) {
    return false;
}

function DocLink() {
    // var iWidth = 784; iHeight = 580 - 34; sSize = "fix";
    //var iWidth = 784; iHeight = 580 - 14; sSize = "fix";

    //[2015-12-08 modi kh] 연결문서 하단 버튼 안보임으로 인하여 팝업창 높이 조절
    //var iWidth = 784 + 10; iHeight = 580 + 18; sSize = "fix";
	var iWidth = 840; iHeight = 660; sSize = "fix";

    var sUrl = "goDocListSelectPage.do";		//"/WebSite/Approval/DocList/DocListSelect.aspx";
    if (openMode == "L" || openMode == "P") {
        var nLeft = (screen.width - iWidth) / 2;
        var nTop = (screen.height - iHeight) / 2;
        var sWidth = iWidth.toString() + "px";
        var sHeight = iHeight.toString() + "px";
        parent.Common.ShowDialog("btDocLink", "DivPop_" + openID, $("#btDocLink").text(), sUrl + "?openID=" + openID, sWidth, sHeight, "iframe-ifNoScroll");    // 레이블 수정 필요.
    } else {
        if (location.href.indexOf("/Approval/ApprovalWrite") > -1) {
            return Common.ShowDialog("btDocLink", "DivPop_" + openID, "연관문서", sUrl + "?openID=" + openID, iWidth, iHeight, "iframe-ifNoScroll");
        } else {
            CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);
        }
    }

}

/*프로세스 메뉴얼 기능 비사용
 * //프로세스 메뉴얼 연결 200801 by sunny
function ProcessLink() {
    //기본 연결 프로세스 메뉴얼이 있는 경우 자동 연결
    //2개 이상일 경우 하단의 프로세스 메뉴얼 활성화 및 link 제공
    //기본이 없는 경우 사용자 선택 창 open
    if (getInfo("scPMV") != "") {
        if (getInfo("scPMV").split("^").length > 1) {
            InputPMLinks(getInfo("scPMV"));
        } else {
            var aForm = getInfo("scPMV").split(";");
            var pmid = aForm[0];
            var pmnm = aForm[1];
            // var FormUrl = "http://" + document.location.host + "/CoviBPM/COVIBPMNet/BPD/Common/BPDefiner/ProcessPool/ProcessMapView.aspx";
            var FormUrl = document.location.protocol + "//" + document.location.host + "/CoviBPM/COVIBPMNet/BPD/Common/BPDefiner/ProcessPool/ProcessMapView.aspx";
            var strNewFearture = ModifyWindowFeature('width=800,height=600');
            window.open(FormUrl + "?ProcessID=" + pmid + "&Popup=true", '', strNewFearture);
            //window.open(FormUrl+"?ProcessID="+pmid+"&Popup=true",'','width=800,height=600');					
        }
    } else {
        var rgParams = null;
        rgParams = new Array();

        var szFont = "FONT-FAMILY: '굴림';font-size:9px;";
        var nWidth = 640;
        var nHeight = 540;
        var szURL = "/CoviBPM/COVIBPMNet/BPD/Admin/BPDefiner/Organization/OrganizationAuthority.aspx?System=APPROVAL";
        var szParam = "";
        if (PMLINKS.value != "") {
            var array = PMLINKS.value.split("^");
            for (var i = 0; i < array.length ; i++) {
                if (szParam != "") {
                    szParam += "^";
                }
                szParam += array[i].split(";")[0];
            }
            if (szParam != "") szURL = szURL + "&Check=" + szParam;
        }
        var vRetval = window.showModalDialog(szURL, rgParams, szFont + "dialogHeight:" + nHeight + "px;dialogWidth:" + nWidth + "px;status:no;resizable:yes;help:no;");
        if (vRetval != null) {
            PMLINKS.value = vRetval;
            InputPMLinks();
        }
    }
}*/

//주석 정리 : KJW : 2014.04.24 : XFORM PRJ.
//임시메모 divTempMemp의 focus() 이벤트에 연결
function dragApp() {
    document.oncontextmenu = function () { return true; }
    document.onselectstart = function () { return true; }
    document.ondragstart = function () { return true; }
}

function FormatStringToNumber(sValue) {
    return parseInt(sValue);
}

//아래 함수 정리 필요 formmenu.js 2018줄에서 사용
function gotoFolder(strFolderURL, strFolderName) {
    /*
    try {
        if (strFolderName != undefined) {
            strFolderURL += "&location_name=" + escape(strFolderName);
        }

        if (opener.name == "rightFrame") {
            opener.location.href = strFolderURL;
        } else if (opener.parent.name == "rightFrame") {  // 프레임안에 하나 더 감싸여 있을 경우
            opener.parent.location.href = strFolderURL;
        }
    } catch (e) {  }
    */
}

function cTagreSize() {
    var obj_r = document.getElementById('pTag');
    var obj_c = document.getElementById('cTag');
    var obj_l = document.getElementById('lTag');
    var obj_lf = document.getElementById('lTag_f');
    var obj_aside = document.getElementById('divAside');
    var cHeight = $('.con_in').height() + 50;
    var oPHeight = 0;
    if (eval(obj_l) && obj_l.offsetHeight > cHeight) {
        if (eval(obj_r)) {
            if (obj_l.offsetHeight > obj_r.offsetHeight) {
                oPHeight = obj_l.offsetHeight;
            } else {
                oPHeight = obj_r.offsetHeight;
            }
        } else {
            oPHeight = obj_l.offsetHeight;
        }
    } else if (eval(obj_r) && eval(obj_c)) {
        if (cHeight > obj_r.offsetHeight) {
            oPHeight = cHeight;
        } else {
            oPHeight = obj_r.offsetHeight;
        }
    } else if (eval(obj_c)) {
        oPHeight = cHeight;
    }

    if (eval(obj_aside)) {
        if (obj_aside.offsetHeight > oPHeight) {
            oPHeight = obj_aside.offsetHeight;
        }
    }

    if (eval(obj_l)) { obj_l.style.height = oPHeight + "px"; }
    if (eval(obj_lf)) { obj_lf.style.height = oPHeight + "px"; }
    if (eval(obj_c)) { obj_c.style.height = oPHeight + "px"; }
    if (eval(obj_r)) { obj_r.style.height = oPHeight + "px"; }
}

//회람현황 입력
function settingTCINFO() {

    var strflag = false;
    var sItems = "<request>";
    var sUrl;
    sUrl = "../Circulation/Circulation_Read_Update.aspx";

    sItems += makeNode("fiid", getInfo("FormInstanceInfo.FormInstID"))
            + makeNode("sendid", "")
            + makeNode("type", getInfo("Request.gloct"))
            + makeNode("receipt_id", getInfo("AppInfo.usid"))
            + makeNode("receipt_name", getInfo("AppInfo.usnm"))
            + makeNode("receipt_ou_id", getInfo("AppInfo.dpid"))
            + makeNode("receipt_ou_name", getInfo("AppInfo.dpnm"))
            + makeNode("receipt_state", "")
            + makeNode("receipt_date", "")
            + makeNode("read_date", "")
            + makeNode("piid", getInfo("ProcessInfo.ProcessID"))
            + makeNode("sender_id", getInfo("FormInstanceInfo.InitiatorID"))
            + makeNode("sender_name", getInfo("FormInstanceInfo.InitiatorName"))
            + makeNode("sender_ou_id", getInfo("FormInstanceInfo.InitiatorUnitID"))
            + makeNode("sender_ou_name", getInfo("FormInstanceInfo.InitiatorUnitName"), null, true)
            + makeNode("fmnm", getInfo("FormInfo.FormName"), null, true)
            + makeNode("subject", getInfo("FormInstanceInfo.Subject"))
            + makeNode("link_url", getInfo("ProcessInfo.ProcessDescription"), null, true)
            + makeNode("send_date", getInfo("FormInstanceInfo.InitiatedDate"))
    ;
    sItems += "</request>";
    //alert(sUrl);
    CFN_CallAjax(sUrl, sItems, function (data) {

    }, true, "xml");
}

//회람현황 입력 by Mail
function settingTCINFO_Mail() {

    var strflag = false;
    var sItems = "<request>";
    var sUrl;
    sUrl = "../Circulation/Circulation_Read_Update.aspx";

    sItems += makeNode("fiid", getInfo("FormInstanceInfo.FormInstID"))
            + makeNode("sendid", "")
            + makeNode("type", "TCINFO")
            + makeNode("receipt_id", getInfo("AppInfo.usid"))
            + makeNode("receipt_name", getInfo("AppInfo.usnm"))
            + makeNode("receipt_ou_id", getInfo("AppInfo.dpid"))
            + makeNode("receipt_ou_name", getInfo("AppInfo.dpnm"))
            + makeNode("receipt_state", "")
            + makeNode("receipt_date", "")
            + makeNode("read_date", "")
            + makeNode("piid", getInfo("ProcessInfo.ProcessID"))
            + makeNode("sender_id", getInfo("FormInstanceInfo.InitiatorID"))
            + makeNode("sender_name", getInfo("FormInstanceInfo.InitiatorName"))
            + makeNode("sender_ou_id", getInfo("FormInstanceInfo.InitiatorUnitID"))
            + makeNode("sender_ou_name", getInfo("FormInstanceInfo.InitiatorUnitName"), null, true)
            + makeNode("fmnm", getInfo("FormInfo.FormName"), null, true)
            + makeNode("subject", getInfo("FormInstanceInfo.Subject"))
            + makeNode("link_url", getInfo("ProcessInfo.ProcessDescription"), null, true)
            + makeNode("send_date", getInfo("FormInstanceInfo.InitiatedDate"))
    ;
    sItems += "</request>";
    //alert(sUrl);
    CFN_CallAjax(sUrl, sItems, function (data) {

    }, true, "xml");
}

//로딩이미지 토글하기
function ToggleLoadingImage() {
    if ($('#divLoading').is(':hidden')) {
        $('#loading_overlay').show();
        $('#divLoading').show();
    }
    else {
        $('#divLoading').hide();
        $('#loading_overlay').hide();
    }
}

function initOnloadformmenu_notelist() {
    if (getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "TEMPSAVE") {
        document.getElementById("btDocListSave").style.display = "";
    }

    if (getInfo("Request.loct") == "DRAFT" || getInfo("Request.loct") == "TEMPSAVE") {
        if (getInfo("scCAt4") == "0") {
            document.getElementById("btDocLinked").style.display = "";
            document.getElementById("btDocLink").style.display = "";
        }
    }

    if (getInfo("Request.loct") == "COMPLETE") {
        document.getElementById("btOTrans").style.display = "";
    }

    m_oFormEditor = window.document;//parent.editor
    m_oFormReader = window.document;//parent.redear

    if (admintype != "ADMIN" && getInfo("Request.loct") == "APPROVAL" && (getInfo("Request.mode") == "APPROVAL" || getInfo("Request.mode") == "PCONSULT" || getInfo("Request.mode") == "RECAPPROVAL"))
    { setApvList(); }
    else { document.getElementById("APVLIST").value = getInfo("ApprovalLine"); }
}



//json object로 대체
//getInfo, setInfo 대체 방안
// sKey = $.level1.level2		ex) $.BodyContext.InitiatorDisplay
function getInfo(sKey) {
  try {
	  sKey = "$."+sKey;
      //return formJson.oFormData[sKey];
	  var isExitJsonValue = jsonPath(formJson, sKey).length == undefined ? false : true;
      var formJsonValue = isExitJsonValue ? jsonPath(formJson, sKey)[0] : jsonPath(formJson, sKey);
      
      if (formJsonValue === false && isExitJsonValue === false) {
    	  
    	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
    	  return undefined;
    	  
      }else if (formJsonValue.constructor === "".constructor) {
    	  
    	  return formJsonValue;
    	  
      }else if (formJsonValue.constructor === [].constructor || formJsonValue.constructor === {}.constructor || formJsonValue.constructor === true.constructor) {
          
    	  return JSON.stringify(formJsonValue);
    	  
      }else {
    	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
    	  return undefined;
      }

  }catch (e) {
	  /*비사용
	   * alert(Message254 + sKey + gMessage255);//"양식정보에 없는 키값["+sKey+"]입니다."*/
	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
	  return undefined;
  }
}

function setInfo(sKey, sValue, sException) {
  try {
      //formJson.oFormData[sKey] = sValue;
	  var sKeyArr = sKey.split('.');
	  
	  switch(sKeyArr.length){
	  case 0:
    	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
		  return undefined;
	  default:
		  var findKey = sKey.replace(/\./g, ">");					// Jsoner 라이브러리를 통해 찾을 수 있게 변경
	  	  if($$(formJson).find(findKey).exist())					// 해당 키값이 있을 경우 formJson에 값을 세팅해줌
	  		  $$(formJson).find(findKey).parent().attr(sKeyArr[sKeyArr.length-1], sValue);
	  	  else{															// 해당 키값이 없을 경우, formJson에 상위 구조를 만들어준 후 값을 세팅
	  		  var strKey = "";
	  		  if(sKeyArr.length == 1){
	  			  $$(formJson).attr(sKeyArr[0], sValue);
	  		  }
	  		  $(sKeyArr).each(function(i, key){
	  			 strKey += ">"+key;
	  			 var val;
	  			 if(!$$(formJson).find(strKey).exist()){
	  				 if(i != sKeyArr.length-1)
	  					val = {};
	  				 else
	  					val = sValue;
	  				 $$(formJson).find(strKey.substring(0, strKey.lastIndexOf('>'))).attr(key, val);
	  			 }
	  		  });
	  	  }
	  		  
		  break;
	  }
  } catch (e) {
      if (sException == null) {
    	  /*비사용
    	   * alert(Message254 + sKey + gMessage255);//"양식정보에 없는 키값["+sKey+"]입니다."*/
    	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
    	  return undefined;
      }
  }
}

function checkSingleDocRead(opener){
	var checkDocRead = 0;
	var doc_param = {};
	var doc_url = "";
	
	doc_param["ProcessID"] = getInfo('Request.processID');
	doc_param["FormInstID"] = getInfo('Request.forminstanceID');
	
	if(opener.mnid == 483){			//개인함 - 참조/회람
		doc_url = "user/selectApprovalTCInfoSingleDocRead.do";
	} else if(opener.mnid == 489){	//부서함 - 참조/회람
		doc_url = "user/selectDeptTCInfoSingleDocRead.do";
	} else {						//개인함 - 미결함, 부서함 - 수신함
		doc_url = "user/selectSingleDocreadData.do";
	}
		
	$.ajax({
		url: doc_url,
		data : doc_param,
		type:"post",
		async:false,
		success:function (data) {
			//메소드 호출마다 갱신되도록 수정
			checkDocRead = data.cnt;
		},
		error:function(response, status, error){
			CFN_ErrorAjax(doc_url, response, status, error);
		}
	});
	return checkDocRead;
}


function setSubjectHighlight(){
	
	//Form load 완료후 정상작동시 UnreadCount 갱신
	var openerObj;
	
	if(typeof opener != 'undefined' && opener != null){ //팝업 호출시 opener window 여부 확인
		openerObj = opener;
	}else if(typeof top != 'undefined' && top != null){ //미리보기시 top window 여부 확인
		openerObj = top;
	}else{
		return;
	}
	
	//페이지 갱신 method 확인
   	if(typeof openerObj.setDocreadCount !== 'undefined' && typeof openerObj.setDocreadCount === "function" && openerObj.setDocreadCount != null){
   		openerObj.setDocreadCount();

   		var readCnt = checkSingleDocRead(openerObj);
    	if(readCnt==0){
    		return;
   		}
   		var parent_formSubject = ".taTit[onclick^=onClick][onclick*=Button][onclick*=\\\"" + getInfo('Request.processID') + "\\\"]";
    	
    	if(getInfo('Request.workitemID') != ""){
    		parent_formSubject += "[onclick*=\\\"" + getInfo('Request.workitemID')+ "\\\"]";
    	}
    	if(getInfo('Request.performerID') != ""){
    		parent_formSubject += "[onclick*=\\\"" + getInfo('Request.performerID')+ "\\\"]";
    	}
    	if(getInfo('Request.userCode') != ""){    
    	    parent_formSubject += "[onclick*=\\\"" + getInfo('Request.userCode')+ "\\\"]";
    	}
    	
    	//단순히 인덱스로 구분하는 것이 아니라 제목으로 구분하고 css설정을 바꿔야 하기 때문에 regular expression을 이용하여 직접 접근 시도
	   	if(openerObj.$(parent_formSubject).css("font-weight") > 400){
	   		openerObj.$(parent_formSubject).css("font-weight", "400");
	   	}
   	}
    	
}










//한글 기안기 추가
