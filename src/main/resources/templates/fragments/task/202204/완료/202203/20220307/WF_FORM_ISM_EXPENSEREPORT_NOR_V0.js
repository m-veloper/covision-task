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
    $("input[name=userDept]").val(getInfo("AppInfo.dpnm"));
    $("input[name=userName]").val(getInfo("AppInfo.usnm"));
    var endDate  = new Date();
    var newYear = endDate.getFullYear();
	var newMonth = endDate.getMonth()+1 < 10 ? "0"+(endDate.getMonth()+1) : endDate.getMonth()+1;
	var newDate = endDate.getDate() < 10 ? "0"+endDate.getDate() : endDate.getDate();
	
	$("#writeDate").val(newYear + "-" + newMonth + "-" + newDate);

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
	var real = parseInt($('#realAmt').val() == "" ? 0 :$('#realAmt').val().replace(/,/g, "").substring(1));
	var vat = parseInt(real*0.1);
	var sum= real+vat;
	
	console.log(real);
	console.log(vat);
	console.log(sum);
	
	$('#vatAmt').val($('#realAmt').val().substring(0, 1)+CnvtComma(vat));
	$('#totAmt').val($('#realAmt').val().substring(0, 1)+ CnvtComma(sum));
	
}

function fn_sum1() {
	console.log($('#realAmt').val());
	console.log($('#realAmt').val().replace(/,/g, "").substring(1));
	
	//var real = parseInt($('#realAmt').val() == "" ? 0 :$('#realAmt').val().replace(/,/g, "").substring(1));
	//var vat = parseInt(real*0.1);
	//var sum= real+vat;
	
	
	
	//$('#vatAmt').val($("input[name=realAmt]").eq(1).val().substring(0, 1)+ CnvtComma(vat));
	//$('#totAmt').val($("input[name=realAmt]").eq(1).val().substring(0, 1)+ CnvtComma(sum));
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
//차량 선택
function openPopup() {
	CFN_OpenWindow("http://gw.ismedia.co.kr/bbs/read_bbs.aspx?bbs_num=1&sfind=&sfindsdate=&sfindedate=&sfindtype=subject&sfiltertype=ALL&sorderby=+ref+DESC%2c+re_step+ASC%2c+reg_date+DESC%2c+num+DESC&num=6946&curPage=1", "", 1080, 420, "");
}