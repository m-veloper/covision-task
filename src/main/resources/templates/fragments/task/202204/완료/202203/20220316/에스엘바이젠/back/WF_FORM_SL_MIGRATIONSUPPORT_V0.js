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


//양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();
    $("input[name=reqName]").val(getInfo("AppInfo.usnm"));
    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        //<!--loadMultiRow_Read-->

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
     
        //<!--loadMultiRow_Write-->
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
    return bodyContextObj;
}


function fn_sum() {
	console.log($('#reqSelfMoveAmt').val() );
	console.log($('#reqFamilyMoveAmt').val() );
	console.log($('#reqHouseMonthlyAmt').val() );
	console.log($('#reqHouseAmt').val() );
	console.log($('#publicTransportAmt').val() );
	console.log($('#reqOilAmt').val() );
	
	var reqSelfMoveAmt 		= parseInt($('#reqSelfMoveAmt').val() == "" ? 0 : $('#reqSelfMoveAmt').val().replace(/,/g, ""));
	var reqFamilyMoveAmt 	= parseInt($('#reqFamilyMoveAmt').val() == "" ? 0 : $('#reqFamilyMoveAmt').val().replace(/,/g, ""));
	var reqHouseMonthlyAmt 	= parseInt($('#reqHouseMonthlyAmt').val() == "" ? 0 : $('#reqHouseMonthlyAmt').val().replace(/,/g, ""));
	var reqHouseAmt 		= parseInt($('#reqHouseAmt').val() == "" ? 0 : $('#reqHouseAmt').val().replace(/,/g, ""));
	var publicTransportAmt 	= parseInt($('#publicTransportAmt').val() == "" ? 0 : $('#publicTransportAmt').val().replace(/,/g, ""));
	var reqOilAmt	 		= parseInt($('#reqOilAmt').val() == "" ? 0 : $('#reqOilAmt').val().replace(/,/g, ""));
	var sumAmt = 0;
	sumAmt = reqSelfMoveAmt + reqFamilyMoveAmt +reqHouseMonthlyAmt +reqHouseAmt+publicTransportAmt+ reqOilAmt;
	
	
	$('#sumAmt').val(CnvtComma(sumAmt));
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

