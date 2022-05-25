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
    $("#Subject").css("height", "30px");

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



function calSDATEEDATE(obj) {
	var SDATE = $("#startDay").val().split('-');
    var EDATE = $("#closeDay").val().split('-');

    var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
    var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
    var tmpday = EOBJDATE - SOBJDATE;
    tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

    if (tmpday < 0) {
        
        Common.Warning("이전 일보다 전 입니다. 확인하여 주십시오.");
        $("#startDay").val("");
        $("#closeDay").val("");
    }
}
function fn_sum1() {
	var cost1 = parseInt($('#a_cost_11').val() == "" ? 0 : $('#a_cost_11').val().replace(/,/g, ""));
	var cost2 = parseInt($('#a_cost_21').val() == "" ? 0 : $('#a_cost_21').val().replace(/,/g, ""));
	var cost3 = parseInt($('#a_cost_31').val() == "" ? 0 : $('#a_cost_31').val().replace(/,/g, ""));
	var cost4 = parseInt($('#a_cost_41').val() == "" ? 0 : $('#a_cost_41').val().replace(/,/g, ""));
	var cost5 = parseInt($('#a_cost_51').val() == "" ? 0 : $('#a_cost_51').val().replace(/,/g, ""));
	var sum = 0;
	sum = cost1+cost2+cost3+cost4+cost5;
	
	
	$('#a_sum_1').val(sum);
	fn_sum3();
}

function fn_sum2() {
	var cost1 = parseInt($('#a_cost_12').val() == "" ? 0 : $('#a_cost_12').val().replace(/,/g, ""));
	var cost2 = parseInt($('#a_cost_22').val() == "" ? 0 : $('#a_cost_22').val().replace(/,/g, ""));
	var cost3 = parseInt($('#a_cost_32').val() == "" ? 0 : $('#a_cost_32').val().replace(/,/g, ""));
	var cost4 = parseInt($('#a_cost_42').val() == "" ? 0 : $('#a_cost_42').val().replace(/,/g, ""));
	var cost5 = parseInt($('#a_cost_52').val() == "" ? 0 : $('#a_cost_52').val().replace(/,/g, ""));
	var sum = 0;
	sum = cost1+cost2+cost3+cost4+cost5;
	
	
	$('#a_sum_2').val(sum);
	fn_sum3();
}

function fn_rowSub(costRow) {
	
	var sub =0;
	var cost1 =0;
	var cost2 =0;
	if(costRow =="cost1"){
		cost1 = parseInt($('#a_cost_11').val() == "" ? 0 : $('#a_cost_11').val().replace(/,/g, ""));
		cost2 = parseInt($('#a_cost_12').val() == "" ? 0 : $('#a_cost_12').val().replace(/,/g, ""));
		sub =cost1 -cost2;
		$('#a_cost_13').val(CnvtComma(sub));
	}else if(costRow =="cost2"){
		cost1 = parseInt($('#a_cost_21').val() == "" ? 0 : $('#a_cost_21').val().replace(/,/g, ""));
		cost2 = parseInt($('#a_cost_22').val() == "" ? 0 : $('#a_cost_22').val().replace(/,/g, ""));
		sub =cost1 -cost2;
		$('#a_cost_23').val(CnvtComma(sub));
	}else if(costRow =="cost3"){
		cost1 = parseInt($('#a_cost_31').val() == "" ? 0 : $('#a_cost_31').val().replace(/,/g, ""));
		cost2 = parseInt($('#a_cost_32').val() == "" ? 0 : $('#a_cost_32').val().replace(/,/g, ""));
		sub =cost1 -cost2;
		$('#a_cost_33').val(CnvtComma(sub));
	}else if(costRow =="cost4"){
		cost1 = parseInt($('#a_cost_41').val() == "" ? 0 : $('#a_cost_41').val().replace(/,/g, ""));
		cost2 = parseInt($('#a_cost_42').val() == "" ? 0 : $('#a_cost_42').val().replace(/,/g, ""));
		sub =cost1 -cost2;
		$('#a_cost_43').val(CnvtComma(sub));
	}else if(costRow =="cost5"){
		cost1 = parseInt($('#a_cost_51').val() == "" ? 0 : $('#a_cost_51').val().replace(/,/g, ""));
		cost2 = parseInt($('#a_cost_52').val() == "" ? 0 : $('#a_cost_52').val().replace(/,/g, ""));
		sub =cost1 -cost2;
		$('#a_cost_53').val(CnvtComma(sub));
	}
	var sub =0;
	var cost3 =0;
	var cost4 =0;
	cost3 = parseInt($('#a_sum_1').val() == "" ? 0 : $('#a_sum_1').val().replace(/,/g, ""));
	cost4 = parseInt($('#a_sum_2').val() == "" ? 0 : $('#a_sum_2').val().replace(/,/g, ""));
	sumsub =cost3 -cost4;
	$('#a_sum_4').val(CnvtComma(sumsub));
	 
	
	
	
	
}

function fn_sum3() {
	var cost1 = parseInt($('#a_sum_1').val() == "" ? 0 : $('#a_sum_1').val().replace(/,/g, ""));
	var cost2 = parseInt($('#a_sum_2').val() == "" ? 0 : $('#a_sum_2').val().replace(/,/g, ""));
	var sum = 0;
	sum = (cost2/cost1)*100;
	
	
	$('#a_sum_3').val(sum);
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
