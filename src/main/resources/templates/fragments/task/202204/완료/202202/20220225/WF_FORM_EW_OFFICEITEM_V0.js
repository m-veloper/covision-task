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
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 5 });
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
