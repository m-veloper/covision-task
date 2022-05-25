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
    /*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
	
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("equipmentTbl", "rField"));
    $$(bodyContextObj["BodyContext"]).append(getMultiRowFields("ItemTbl", "rField"));
    
    return bodyContextObj;
}

