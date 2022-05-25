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
        
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'R');
            
        }


    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리


        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 3 });
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 3 });
            
            $("input[name=localDiv]").eq(1).val("교통비");
            $("input[name=localDiv]").eq(2).val("일비");
            $("input[name=localDiv]").eq(3).val("숙박비");
            
            $("input[name=abordDiv]").eq(1).val("교통비");
            $("input[name=abordDiv]").eq(2).val("일비");
            $("input[name=abordDiv]").eq(3).val("숙박비");
        }




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
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
    $$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
    $$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO2", "rField"));
    
    return bodyContextObj;
}

function fn_sum1() {
    var price = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
        price += parseInt($("input[name=localAtm]").eq(i + 1).val() == "" ? 0 :$("input[name=localAtm]").eq(i + 1).val().replace(/,/g, ""));
    });
    //$('#carTotal').val($("input[name=unitprice]").eq(1).val().substring(0, 1) + CnvtComma(price));
    
    $('#localTotal').val(CnvtComma(price));
}

function fn_sum2() {
    var price = 0;
    $('#TBLINFO2').find(".multi-row").not(".pattern-skip").each(function (i) {
        price += parseInt($("input[name=abordAtm]").eq(i + 1).val() == "" ? 0 :$("input[name=abordAtm]").eq(i + 1).val().replace(/,/g, ""));
    });
    //$('#carTotal').val($("input[name=unitprice]").eq(1).val().substring(0, 1) + CnvtComma(price));
    
    $('#abordTotal').val(CnvtComma(price));
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
XFORM.multirow.event('afterRowRemoved', function ($rows) { 
	fn_sum1();
	fn_sum2();
}); 



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

function validateVacDate() {

    var sdt = $('#SDATE').val().replace(/-/g, '');
    var edt = $('#EDATE').val().replace(/-/g, '');

    if (Number(sdt) > Number(edt)) {
        Common.Warning("시작일은 종료일보다 먼저 일 수 없습니다.");
        $('#EDATE').val('')
    }
}


function addSum(){
	var price = 0;
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	
	var TranPrice02 = document.getElementById("TranPrice02");
	var DayPrice02 = document.getElementById("DayPrice02");
	var OrignPrice = document.getElementById("OrignPrice");
	
	
	DayPrice02Val = DayPrice02.value.DayPrice02.replace(regexp, ',');
	DayPrice02Val = DayPrice02.value.DayPrice02.replace(regexp, ',');
	OrignPriceVal = DayPrice02.value.DayPrice02.replace(regexp, ',');
	
	
}