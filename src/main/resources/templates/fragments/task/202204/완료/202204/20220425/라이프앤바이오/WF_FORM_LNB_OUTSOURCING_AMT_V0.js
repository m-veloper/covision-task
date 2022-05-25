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
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        }
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });


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
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
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
    
    return bodyContextObj;
}



function fn_setTax1(obj) {
	var price = 0;
	
	outsourcingFee = $(obj).closest("tr").find("input[name=outsourcingFee]").val();
	nowRow = $("input[name=outsourcingFee]").index(obj);
	
	var srOutsourcingFee = $(obj).closest("tr").find("input[name=outsourcingFee]").val() == "" ? 0 : $(obj).closest("tr").find("input[name=outsourcingFee]").val().replace(/,/g, "");
	var srTaxPercent = $(obj).closest("tr").find("input[name=taxPercent]").val() == "" ? 0 : $(obj).closest("tr").find("input[name=taxPercent]").val().replace(/,/g, "");
	var srOwnerTax = parseInt(srOutsourcingFee*srTaxPercent/100);
	var srLocalTax = parseInt(srOutsourcingFee*srTaxPercent/1000);
	var srPayAmt = srOutsourcingFee-srOwnerTax-srLocalTax ;
	
	
	
	$("input[name=ownerTax]").eq(nowRow).val(CnvtComma(srOwnerTax) );        	
	
	$("input[name=localTax]").eq(nowRow).val(CnvtComma(srLocalTax) );	
	$("input[name=payAmt]").eq(nowRow).val(CnvtComma(srPayAmt) );	
}


function fn_setTax2(obj) {
	var price = 0;
	
	outsourcingFee = $(obj).closest("tr").find("input[name=outsourcingFee]").val();
	nowRow = $("input[name=taxPercent]").index(obj);
	
	var srOutsourcingFee = $(obj).closest("tr").find("input[name=outsourcingFee]").val() == "" ? 0 : $(obj).closest("tr").find("input[name=outsourcingFee]").val().replace(/,/g, "");
	var srTaxPercent = $(obj).closest("tr").find("input[name=taxPercent]").val() == "" ? 0 : $(obj).closest("tr").find("input[name=taxPercent]").val().replace(/,/g, "");
	var srOwnerTax = parseInt(srOutsourcingFee*srTaxPercent/100);
	var srLocalTax = parseInt(srOutsourcingFee*srTaxPercent/1000);
	var srPayAmt = srOutsourcingFee-srOwnerTax-srLocalTax ;
	
	
	
	$("input[name=ownerTax]").eq(nowRow).val(CnvtComma(srOwnerTax) );        	
	
	$("input[name=localTax]").eq(nowRow).val(CnvtComma(srLocalTax) );	
	$("input[name=payAmt]").eq(nowRow).val(CnvtComma(srPayAmt) );	
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