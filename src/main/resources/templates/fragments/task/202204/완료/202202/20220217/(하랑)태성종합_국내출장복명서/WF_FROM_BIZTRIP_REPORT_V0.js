//양식별 다국어 정의 부분
var localLang_ko = {
    localLangItems: {
        selMessage: "●휴일이 포함된 연차를 사용할 경우 [추가]버튼을 이용하여 개별 입력하시기 바랍니다.",
        allVacDays: "총연차"

    }
};

var localLang_en = {
    localLangItems: {
        selMessage: "●vacation이 포함된 연차를 사용할 경우 [추가]버튼을 이용하여 개별 입력하시기 바랍니다.",
        allVacDays: "총연차"

    }
};

var localLang_ja = {
    localLangItems: {
        selMessage: "●休日이 포함된 연차를 사용할 경우 [추가]버튼을 이용하여 개별 입력하시기 바랍니다.",
        allVacDays: "총연차"

    }
};

var localLang_zh = {
    localLangItems: {
        selMessage: "●休日이 포함된 연차를 사용할 경우 [추가]버튼을 이용하여 개별 입력하시기 바랍니다.",
        allVacDays: "총연차"

    }
};

//양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    //debugger;
    //공통영역
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'R');
        }
        
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
        }
        
      //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO2 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 1 });
        }

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
        	document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);

            if (window.location.href.indexOf("RequestFormInstID") > -1) {
                getBiztripRequestDate();
            }
        }
        else {

        }
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
        }
        
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO2 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 1 });
        }
        
    }

    //setLabel과 setBodyContext 정리 후 상단으로 이동

}

function setLabel() {
   
}
function setFormInfoDraft() {
    
}


function checkForm(bTempSave) {
    if (bTempSave) {
        return true;
    } else {
        if (document.getElementById("Subject").value == '') {
            alert('제목을 입력하세요.');
            //SUBJECT.focus();
            return false;
        } else if (document.getElementById("SaveTerm").value == '') {
            alert('보존년한을 선택하세요.');
            return false;
        } else {
            return EASY.check().result;
        }
    }
}

function getBiztripRequestDate() {

	/*var connectionname = "FORM_INST_ConnectionString";
    var pXML = "SELECT FORM_INST_ID,SUBJECT,BODY_CONTEXT FROM [COVI_FLOW_FORM_INST].[dbo].[WF_FORM_INSTANCE] where FORM_INST_ID='" + CFN_GetQueryString("REQUEST_FIID") + "' ";
    var aXML = "";
    var sXML = "<Items><connectionname>" + connectionname + "</connectionname><xslpath></xslpath><sql><![CDATA[" + pXML + "]]></sql>" + aXML + "</Items>";

    var szURL = "../GetXMLQuery.aspx";
    CFN_CallAjax(szURL, sXML, function (data) {
        receiveHTTPState(data);
    }, false, "xml");*/
    
	CFN_CallAjax("/approval/legacy/getFormInstData.do", {"FormInstID":CFN_GetQueryString("RequestFormInstID")}, function (data){ 
		receiveHTTPState(data); 
	}, false, 'json');

}

function receiveHTTPState(dataresponseJson) {
    var jsonReturn = dataresponseJson;
    var errorNode = jsonReturn.error;
    
    if (errorNode!=null && errorNode!=undefined) {
        Common.Error("Desc: " + $(errorNode).text());
    } else {
        $.each(jsonReturn.Table,function (i, elm) {
            setBodyContext($.parseJSON(Base64.b64_to_utf8(elm.BodyContext)));
        });
    }
}

function eventKey() {
    //***숫자만(콤마형식, 포커스시 콤마형식제거, 포커스아웃시 콤마형식
    $("input[gubun='numcomma']").css("ime-mode", "disabled").focus(function () {
        var n = $(this).val().replace(/,/gi, "");
        n = (n != "") ? parseInt(n, 10) + "" : "";
        $(this).val(n);
    }).keypress(function () {
        if (event.keyCode < 48 || event.keyCode > 57) { event.returnValue = false; }
    }).focusout(function () {
        eventKeyOut($(this), "numcomma");
    });
}

//function getBodyContext() {

//    //UpdateImageData(); //이미지 업로드
//    var sBodyContext = makeBodyContext();
//    return makeNode("BODY_CONTEXT", sBodyContext, null, false);
//}

//본문 XML로 구성
function makeBodyContext() {
	/*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	
    var bodyContextObj = {};
	
	bodyContextObj["BodyContext"] = getFields("mField");
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO2", "rField"));
    
    return bodyContextObj;
}

function sumCost() {

    var tempCode = 0;
    var tmpData = 0;

    for (i = 1; i <= 3; i++) {
        tempCode = 0;
        tmpData = 0;
        for (var j = 1; j <= 5; j++) {
            tmpData = CnvtCommaRemove2(document.getElementById("a_cost_" + i + j)[0].value);
            if (isNaN(parseInt(tmpData))) {
                tempCode = tempCode;
                document.getElementById("a_cost_" + i + j)[0].value = "";
            }
            else { tempCode = tempCode + parseInt(tmpData); }
        }
        document.getElementById("a_cost_" + i + "6")[0].value = CnvtComma(tempCode);
    }

    for (var i = 1; i <= 6; i++) {
        tempCode = 0;
        tmpData = 0;
        for (j = 1; j <= 3; j++) {
            tmpData = CnvtCommaRemove2(document.getElementById("a_cost_" + j + i)[0].value);
            if (isNaN(parseInt(tmpData))) {
                tempCode = tempCode;
                document.getElementById("a_cost_" + j + i)[0].value = "";
            }
            else { tempCode = tempCode + parseInt(tmpData); }
        }
        document.getElementById("a_sum_" + i)[0].value = CnvtComma(tempCode);
    }
}

//문자X,숫자만!!
function checkInt(i) {

    var tmp = CnvtCommaRemove2(i.value);

    if (isNaN(parseInt(tmp))) {
        if (i.value == "") {
        }
        else {
            alert("숫자만 입력해 주세요!");
            i.focus();
            i.value = "";
        }
    }
    else {
        if (tmp != parseInt(tmp)) {
            alert("숫자만 입력해 주세요!");
            i.focus();
            i.value = "";
        }
        else {
            i.value = CnvtComma(tmp);
        }
    }
}

function CnvtCommaRemove2(strSrc) {
    return (strSrc.replace(/,/g, ""));
}
//몇박몇일 구하기 (HIW)
function SetDaysNights() {

    var vStartDate = $("input[id=SDATE]").val();
    var vEndDate = $("input[id=EDATE]").val();
    if (vStartDate != "" && vEndDate != "") {
        if ($("input[id=DAYS]") != undefined) {
            var arrDate1 = vStartDate.split("-");
            var arrDate2 = vEndDate.split("-");
            var vDate1 = new Date(arrDate1[0], arrDate1[1] - 1, arrDate1[2]).getTime();
            var vDate2 = new Date(arrDate2[0], arrDate2[1] - 1, arrDate2[2]).getTime();
            var vResult = (vDate2 - vDate1) / (1000 * 60 * 60 * 24);

            $("input[id=DAYS]").val(vResult + 1);
        }

        if ($("input[id=NIGHTS]") != undefined) {
            $("input[id=NIGHTS]").val(vResult);
        }
    }
}

/************************************************************************
함수명		: CnvtComma
작성목적	: 빠져나갈때 포맷주기(123456 => 123,456)
*************************************************************************/
function CnvtComma(num) {
    try {
        var ns = num.toString();
        var dp;

        if (isNaN(ns))
            return "";

        dp = ns.search(/\./);

        if (dp < 0) dp = ns.length;

        dp -= 3;

        while (dp > 0) {
            ns = ns.substr(0, dp) + "," + ns.substr(dp);
            dp -= 3;
        }
        return ns;
    }
    catch (ex) {
    }
}


function validateVacDate() {

    var sdt = $('#SDATE').val().replace(/-/g, '');
    var edt = $('#EDATE').val().replace(/-/g, '');

    if (Number(sdt) > Number(edt)) {
        Common.Warning("시작일은 종료일보다 먼저 일 수 없습니다.");
        $('#EDATE').val('')
    }

}