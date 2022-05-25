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

function fn_r1_sum() {
	var t1_r1_sum_1 = 0;
    var t1_cost1 = parseInt($('#T1_cost11').val() == "" ? 0 : $('#T1_cost11').val().replace(/,/g, ""));
    var t1_cost2 = parseInt($('#T1_cost12').val() == "" ? 0 : $('#T1_cost12').val().replace(/,/g, ""));
    var t1_cost3 = parseInt($('#T1_cost13').val() == "" ? 0 : $('#T1_cost13').val().replace(/,/g, ""));
    var t1_cost4 = parseInt($('#T1_cost14').val() == "" ? 0 : $('#T1_cost14').val().replace(/,/g, ""));
    var t1_cost5 = parseInt($('#T1_cost15').val() == "" ? 0 : $('#T1_cost15').val().replace(/,/g, ""));
    
   
    t1_r1_sum_1 = t1_cost1+t1_cost2+t1_cost3+t1_cost4+t1_cost5;
    
    var t2_r1_sum_1 = 0;
    var t2_cost1 = parseInt($('#T2_cost11').val() == "" ? 0 : $('#T2_cost11').val().replace(/,/g, ""));
    var t2_cost2 = parseInt($('#T2_cost12').val() == "" ? 0 : $('#T2_cost12').val().replace(/,/g, ""));
    var t2_cost3 = parseInt($('#T2_cost13').val() == "" ? 0 : $('#T2_cost13').val().replace(/,/g, ""));
    var t2_cost4 = parseInt($('#T2_cost14').val() == "" ? 0 : $('#T2_cost14').val().replace(/,/g, ""));
    var t2_cost5 = parseInt($('#T2_cost15').val() == "" ? 0 : $('#T2_cost15').val().replace(/,/g, ""));
    
   
    t2_r1_sum_1 = t2_cost1+t2_cost2+t2_cost3+t2_cost4+t2_cost5;
    
    var t3_r1_sum_1 = 0;
    var t3_cost1 = parseInt($('#T3_cost11').val() == "" ? 0 : $('#T3_cost11').val().replace(/,/g, ""));
    var t3_cost2 = parseInt($('#T3_cost12').val() == "" ? 0 : $('#T3_cost12').val().replace(/,/g, ""));
    var t3_cost3 = parseInt($('#T3_cost13').val() == "" ? 0 : $('#T3_cost13').val().replace(/,/g, ""));
    var t3_cost4 = parseInt($('#T3_cost14').val() == "" ? 0 : $('#T3_cost14').val().replace(/,/g, ""));
    var t3_cost5 = parseInt($('#T3_cost15').val() == "" ? 0 : $('#T3_cost15').val().replace(/,/g, ""));
    
   
    t3_r1_sum_1 = t3_cost1+t3_cost2+t3_cost3+t3_cost4+t3_cost5;
    
    var totSum = 0;
    totSum = t1_r1_sum_1+t2_r1_sum_1+t3_r1_sum_1;
    
   
    $('#rowSum1DailyTot').val(CnvtComma(totSum));
    console.log("row1 :" +totSum );
    fn_r5_sum();
}


function fn_r2_sum() {
	var t1_r2_sum_1 = 0;
    var t1_cost1 = parseInt($('#T1_cost21').val() == "" ? 0 : $('#T1_cost21').val().replace(/,/g, ""));
    var t1_cost2 = parseInt($('#T1_cost22').val() == "" ? 0 : $('#T1_cost22').val().replace(/,/g, ""));
    var t1_cost3 = parseInt($('#T1_cost23').val() == "" ? 0 : $('#T1_cost23').val().replace(/,/g, ""));
    var t1_cost4 = parseInt($('#T1_cost24').val() == "" ? 0 : $('#T1_cost24').val().replace(/,/g, ""));
    var t1_cost5 = parseInt($('#T1_cost25').val() == "" ? 0 : $('#T1_cost25').val().replace(/,/g, ""));
    
   
    t1_r2_sum_1 = t1_cost1+t1_cost2+t1_cost3+t1_cost4+t1_cost5;
    
    var t2_r2_sum_1 = 0;
    var t2_cost1 = parseInt($('#T2_cost21').val() == "" ? 0 : $('#T2_cost21').val().replace(/,/g, ""));
    var t2_cost2 = parseInt($('#T2_cost22').val() == "" ? 0 : $('#T2_cost22').val().replace(/,/g, ""));
    var t2_cost3 = parseInt($('#T2_cost23').val() == "" ? 0 : $('#T2_cost23').val().replace(/,/g, ""));
    var t2_cost4 = parseInt($('#T2_cost24').val() == "" ? 0 : $('#T2_cost24').val().replace(/,/g, ""));
    var t2_cost5 = parseInt($('#T2_cost25').val() == "" ? 0 : $('#T2_cost25').val().replace(/,/g, ""));
    
   
    t2_r2_sum_1 = t2_cost1+t2_cost2+t2_cost3+t2_cost4+t2_cost5;
    
    var t3_r1_sum_1 = 0;
    var t3_cost1 = parseInt($('#T3_cost21').val() == "" ? 0 : $('#T3_cost21').val().replace(/,/g, ""));
    var t3_cost2 = parseInt($('#T3_cost22').val() == "" ? 0 : $('#T3_cost22').val().replace(/,/g, ""));
    var t3_cost3 = parseInt($('#T3_cost23').val() == "" ? 0 : $('#T3_cost23').val().replace(/,/g, ""));
    var t3_cost4 = parseInt($('#T3_cost24').val() == "" ? 0 : $('#T3_cost24').val().replace(/,/g, ""));
    var t3_cost5 = parseInt($('#T3_cost25').val() == "" ? 0 : $('#T3_cost25').val().replace(/,/g, ""));
    
   
    t3_r2_sum_1 = t3_cost1+t3_cost2+t3_cost3+t3_cost4+t3_cost5;
    
    var totSum = 0;
    totSum = t1_r2_sum_1+t2_r2_sum_1+t3_r2_sum_1;
    console.log("row2 :" +totSum );
    
    $('#rowSum2DailyTot').val(CnvtComma(totSum));
    fn_r5_sum();
}

function fn_r3_sum() {
	var t1_r3_sum_1 = 0;
    var t1_cost1 = parseInt($('#T1_cost31').val() == "" ? 0 : $('#T1_cost31').val().replace(/,/g, ""));
    var t1_cost2 = parseInt($('#T1_cost32').val() == "" ? 0 : $('#T1_cost32').val().replace(/,/g, ""));
    var t1_cost3 = parseInt($('#T1_cost33').val() == "" ? 0 : $('#T1_cost33').val().replace(/,/g, ""));
    var t1_cost4 = parseInt($('#T1_cost34').val() == "" ? 0 : $('#T1_cost34').val().replace(/,/g, ""));
    var t1_cost5 = parseInt($('#T1_cost35').val() == "" ? 0 : $('#T1_cost35').val().replace(/,/g, ""));
    
   
    t1_r3_sum_1 = t1_cost1+t1_cost2+t1_cost3+t1_cost4+t1_cost5;
    
    var t2_r3_sum_1 = 0;
    var t2_cost1 = parseInt($('#T2_cost31').val() == "" ? 0 : $('#T2_cost31').val().replace(/,/g, ""));
    var t2_cost2 = parseInt($('#T2_cost32').val() == "" ? 0 : $('#T2_cost32').val().replace(/,/g, ""));
    var t2_cost3 = parseInt($('#T2_cost33').val() == "" ? 0 : $('#T2_cost33').val().replace(/,/g, ""));
    var t2_cost4 = parseInt($('#T2_cost34').val() == "" ? 0 : $('#T2_cost34').val().replace(/,/g, ""));
    var t2_cost5 = parseInt($('#T2_cost35').val() == "" ? 0 : $('#T2_cost35').val().replace(/,/g, ""));
    
   
    t2_r3_sum_1 = t2_cost1+t2_cost2+t2_cost3+t2_cost4+t2_cost5;
    
    var t3_r3_sum_1 = 0;
    var t3_cost1 = parseInt($('#T3_cost31').val() == "" ? 0 : $('#T3_cost31').val().replace(/,/g, ""));
    var t3_cost2 = parseInt($('#T3_cost32').val() == "" ? 0 : $('#T3_cost32').val().replace(/,/g, ""));
    var t3_cost3 = parseInt($('#T3_cost33').val() == "" ? 0 : $('#T3_cost33').val().replace(/,/g, ""));
    var t3_cost4 = parseInt($('#T3_cost34').val() == "" ? 0 : $('#T3_cost34').val().replace(/,/g, ""));
    var t3_cost5 = parseInt($('#T3_cost35').val() == "" ? 0 : $('#T3_cost35').val().replace(/,/g, ""));
    
   
    t3_r3_sum_1 = t3_cost1+t3_cost2+t3_cost3+t3_cost4+t3_cost5;
    
    var totSum = 0;
    totSum = t1_r3_sum_1+t2_r3_sum_1+t3_r3_sum_1;
    
    console.log("row3 :" +totSum );
    $('#rowSum3DailyTot').val(CnvtComma(totSum));
    fn_r5_sum();
}


function fn_r4_sum() {
	var t1_r4_sum_1 = 0;
    var t1_cost1 = parseInt($('#T1_cost41').val() == "" ? 0 : $('#T1_cost41').val().replace(/,/g, ""));
    var t1_cost2 = parseInt($('#T1_cost42').val() == "" ? 0 : $('#T1_cost42').val().replace(/,/g, ""));
    var t1_cost3 = parseInt($('#T1_cost43').val() == "" ? 0 : $('#T1_cost43').val().replace(/,/g, ""));
    var t1_cost4 = parseInt($('#T1_cost44').val() == "" ? 0 : $('#T1_cost44').val().replace(/,/g, ""));
    var t1_cost5 = parseInt($('#T1_cost45').val() == "" ? 0 : $('#T1_cost45').val().replace(/,/g, ""));
    
   
    t1_r4_sum_1 = t1_cost1+t1_cost2+t1_cost3+t1_cost4+t1_cost5;
    
    var t2_r3_sum_1 = 0;
    var t2_cost1 = parseInt($('#T2_cost41').val() == "" ? 0 : $('#T2_cost41').val().replace(/,/g, ""));
    var t2_cost2 = parseInt($('#T2_cost42').val() == "" ? 0 : $('#T2_cost42').val().replace(/,/g, ""));
    var t2_cost3 = parseInt($('#T2_cost43').val() == "" ? 0 : $('#T2_cost43').val().replace(/,/g, ""));
    var t2_cost4 = parseInt($('#T2_cost44').val() == "" ? 0 : $('#T2_cost44').val().replace(/,/g, ""));
    var t2_cost5 = parseInt($('#T2_cost45').val() == "" ? 0 : $('#T2_cost45').val().replace(/,/g, ""));
    
   
    t2_r4_sum_1 = t2_cost1+t2_cost2+t2_cost3+t2_cost4+t2_cost5;
    
    var t3_r3_sum_1 = 0;
    var t3_cost1 = parseInt($('#T3_cost41').val() == "" ? 0 : $('#T3_cost41').val().replace(/,/g, ""));
    var t3_cost2 = parseInt($('#T3_cost42').val() == "" ? 0 : $('#T3_cost42').val().replace(/,/g, ""));
    var t3_cost3 = parseInt($('#T3_cost43').val() == "" ? 0 : $('#T3_cost43').val().replace(/,/g, ""));
    var t3_cost4 = parseInt($('#T3_cost44').val() == "" ? 0 : $('#T3_cost44').val().replace(/,/g, ""));
    var t3_cost5 = parseInt($('#T3_cost45').val() == "" ? 0 : $('#T3_cost45').val().replace(/,/g, ""));
    
   
    t3_r4_sum_1 = t3_cost1+t3_cost2+t3_cost3+t3_cost4+t3_cost5;
    
    var totSum = 0;
    totSum = t1_r4_sum_1+t2_r4_sum_1+t3_r4_sum_1;
    
    console.log("row4 :" +totSum );
    $('#rowSum4DailyTot').val(CnvtComma(totSum));
    fn_r5_sum();
}


function fn_r5_sum() {
	var t1_r5_sum_1 = 0;
    var t1_cost1 = parseInt($('#T1_cost51').val() == "" ? 0 : $('#T1_cost51').val().replace(/,/g, ""));
    var t1_cost2 = parseInt($('#T1_cost52').val() == "" ? 0 : $('#T1_cost52').val().replace(/,/g, ""));
    var t1_cost3 = parseInt($('#T1_cost53').val() == "" ? 0 : $('#T1_cost53').val().replace(/,/g, ""));
    var t1_cost4 = parseInt($('#T1_cost54').val() == "" ? 0 : $('#T1_cost54').val().replace(/,/g, ""));
    var t1_cost5 = parseInt($('#T1_cost55').val() == "" ? 0 : $('#T1_cost55').val().replace(/,/g, ""));
    
   
    t1_r5_sum_1 = t1_cost1+t1_cost2+t1_cost3+t1_cost4+t1_cost5;
    
    var t2_r5_sum_1 = 0;
    var t2_cost1 = parseInt($('#T2_cost51').val() == "" ? 0 : $('#T2_cost51').val().replace(/,/g, ""));
    var t2_cost2 = parseInt($('#T2_cost52').val() == "" ? 0 : $('#T2_cost52').val().replace(/,/g, ""));
    var t2_cost3 = parseInt($('#T2_cost53').val() == "" ? 0 : $('#T2_cost53').val().replace(/,/g, ""));
    var t2_cost4 = parseInt($('#T2_cost54').val() == "" ? 0 : $('#T2_cost54').val().replace(/,/g, ""));
    var t2_cost5 = parseInt($('#T2_cost55').val() == "" ? 0 : $('#T2_cost55').val().replace(/,/g, ""));
    
   
    t2_r5_sum_1 = t2_cost1+t2_cost2+t2_cost3+t2_cost4+t2_cost5;
    
    var t3_r5_sum_1 = 0;
    var t3_cost1 = parseInt($('#T3_cost51').val() == "" ? 0 : $('#T3_cost51').val().replace(/,/g, ""));
    var t3_cost2 = parseInt($('#T3_cost52').val() == "" ? 0 : $('#T3_cost52').val().replace(/,/g, ""));
    var t3_cost3 = parseInt($('#T3_cost53').val() == "" ? 0 : $('#T3_cost53').val().replace(/,/g, ""));
    var t3_cost4 = parseInt($('#T3_cost54').val() == "" ? 0 : $('#T3_cost54').val().replace(/,/g, ""));
    var t3_cost5 = parseInt($('#T3_cost55').val() == "" ? 0 : $('#T3_cost55').val().replace(/,/g, ""));
    
   
    t3_r5_sum_1 = t3_cost1+t3_cost2+t3_cost3+t3_cost4+t3_cost5;
    
    var totSum = 0;
    totSum = t1_r5_sum_1+t2_r5_sum_1+t3_r5_sum_1;
    
    console.log("row5 :" +totSum );
    $('#rowSumTotDailyTot').val(CnvtComma(totSum));
}


function totSum(obj) {
	console.log(obj);
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


