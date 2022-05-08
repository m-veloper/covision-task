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
    $("input[name=reqDept]").val(getInfo("AppInfo.dpnm"));
    $("input[name=managerName1]").val(getInfo("AppInfo.usnm"));

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        //<!--loadMultiRow_Read-->
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {

            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTblTop), 'json', '#tTblTop', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTblBottom), 'json', '#tTblBottom', 'R');
            
        }


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
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTblTop), 'json', '#tTblTop', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTblBottom), 'json', '#tTblBottom', 'W');
            
        } else {
        	XFORM.multirow.load('', 'json', '#tTblTop', 'W', { minLength: 5 });
            XFORM.multirow.load('', 'json', '#tTblBottom', 'W', { minLength: 5 });
            
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
    /*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("tTblTop", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("tTblBottom", "rField"));
    return bodyContextObj;
}

function dtladdClick(){
	$('#btnDtlAdd').trigger('click'); 
}

function dtldelClick(){
	$('#btnDtlDelSel').trigger('click'); 
}

