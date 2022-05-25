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
    
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    var date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    
    $("input[name=requestDay]").val(year + "." + month + "." + date);
    

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.equipmentTbl), 'json', '#equipmentTbl', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'R');
        }
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.equipmentTbl != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.equipmentTbl), 'json', '#equipmentTbl', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#equipmentTbl', 'W', { minLength: 1 });
        }
        
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.ItemTbl != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#ItemTbl', 'W', { minLength: 1 });
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
        if (formJson.BodyContext != null && formJson.BodyContext.equipmentTbl != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.equipmentTbl), 'json', '#equipmentTbl', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#equipmentTbl', 'W', { minLength: 1 });
        }
        
        if (formJson.BodyContext != null && formJson.BodyContext.ItemTbl != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#ItemTbl', 'W', { minLength: 1 });
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
        if (document.getElementById("Subject").value == '') {
            Common.Warning('제목을 입력하세요.');
            //SUBJECT.focus();
            return false;
        } 
        
        else {
            return EASY.check().result;
        }
    }
}
function setBodyContext(sBodyContext) {
}

//본문 XML로 구성
function makeBodyContext() {
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
    $$(bodyContextObj["BodyContext"]).append(getMultiRowFields("equipmentTbl", "rField"));
    $$(bodyContextObj["BodyContext"]).append(getMultiRowFields("ItemTbl", "rField"));
    
    return bodyContextObj;
}
function fn_sum() {
    var price = 0;
    $('#equipmentTbl').find(".multi-row").not(".pattern-skip").each(function (i) {
        price += parseInt($("input[name=REQ_TOTAL]").eq(i + 1).val() == "" ? 0 :$("input[name=REQ_TOTAL]").eq(i + 1).val().replace(/,/g, "").substring(1));
    });
    $('#REQ_TOTALPRICE').val($("input[name=REQ_PRICE]").eq(1).val().substring(0, 1) + CnvtComma(price));
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