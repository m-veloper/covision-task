//양식별 다국어 정의 부분
var localLang_ko = {
    localLangItems: {
    }
};

var localLang_en = {
    localLangItems: {
    }
};

var localLang_ja = {
    localLangItems: {
    }
};

var localLang_zh = {
    localLangItems: {
    }
};

var objTxtSelect;


//양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        //<!--loadMultiRow_Read 시작-->
        if (JSON.stringify(formJson.BodyContext) != "{}") {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.sumTable), 'json', '#sumTable', 'R');            
        } else {
            XFORM.multirow.load('', 'json', '#sumTable', 'R');
        }
        //<!--loadMultiRow_Read 끝-->

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        //<!--AddWebEditor-->
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
     
      //<!--loadMultiRow_Write 시작-->
        if (JSON.stringify(formJson.BodyContext) != "{}") {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.sumTable), 'json', '#sumTable', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#sumTable', 'W', { minLength: 1 });
        }
        //<!--loadMultiRow_Write 끝-->
    }
}

function setLabel() {
}

function setFormInfoDraft() {
}

function checkForm(bTempSave) {
    if (bTempSave) {
        return true;
    } else {
        // 필수 입력 필드 체크
        return EASY.check().result;
    }
}

function setBodyContext(sBodyContext) {
}

//본문 XML로 구성
function makeBodyContext() {
    /*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("sumTable", "rField")); // multi-row 설정
    return bodyContextObj;
}

function OpenWinEmployee(szObject) {	
	objTxtSelect = document.getElementById(szObject);
    objTxtSelect.value = "";
    
	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=Requester_CallBack&type=B1","",1000,580,"");
}

function Requester_CallBack(pStrItemInfo) {
   var oJsonOrgMap = $.parseJSON(pStrItemInfo);
   var I_User = oJsonOrgMap.item[0];
	
   if(I_User != undefined){
    if (getInfo("AppInfo.usid") != I_User.AN) {
        objTxtSelect.value = CFN_GetDicInfo(I_User.DN);
        document.getElementById("DEPUTY_CODE").value = I_User.UserCode; //유져코드
        document.getElementById("DEPUTY_NAME").value = I_User.UserCode; //성명
        
        
        document.getElementById("ExGroupName").value = I_User.ExGroupName; //소속
        document.getElementById("PO").value = I_User.PO// 직위
    }
   }
}


function calSDATEEDATE(obj) {
    var tmpObj = obj;
    while (tmpObj.tagName != "TR") {
        tmpObj = tmpObj.parentNode; //??????????????
    }
    if ($(tmpObj).find("input[id=SDATE]").val() != "" && $(tmpObj).find("input[id=EDATE]").val() != "") {
        var SDATE = $(tmpObj).find("input[id=SDATE]").val().split('-');
        var EDATE = $(tmpObj).find("input[id=EDATE]").val().split('-');

        console.log(SDATE);
        console.log(EDATE);
        
        var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
        var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
        var tmpday = EOBJDATE - SOBJDATE;
        
        tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);
        
        if (tmpday < 0) {
            alert("이전 일보다 전 입니다. 확인하여 주십시오.");
            $(tmpObj).find("input[id=SDATE]").val("");
            $(tmpObj).find("input[id=EDATE]").val("");
        }
        else {
            //$("#CALNIGHT").val(tmpday);
            $("#CALDAY").val(tmpday + 1);
        }
    }
}


XFORM.multirow.event('afterRowAdded', function ($rows) { 
});


