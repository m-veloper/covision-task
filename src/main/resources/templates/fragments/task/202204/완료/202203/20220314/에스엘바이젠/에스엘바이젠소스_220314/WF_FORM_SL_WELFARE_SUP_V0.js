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

//multi-row 합계 function
function COST_CAL() {
    var tblobj = document.getElementById("sumTable"); //멀티로우 TABLE ID
    
    var cost_sum = 0; //총수량 sum
    
    // 비어있는 필드는 NaN으로 간주하기 때문에 number체크 해줘야됨
	if(!isNaN(parseFloat($(tblobj).find("input[name=reqAmt]").val()))) {
		cost_sum += parseFloat($(tblobj).find("input[name=reqAmt]").val());
	}
	if(!isNaN(parseFloat($(tblobj).find("input[name=reqAmt_2]").val()))) {
		cost_sum += parseFloat($(tblobj).find("input[name=reqAmt_2]").val());
	}
	if(!isNaN(parseFloat($(tblobj).find("input[name=reqAmt_3]").val()))) {
		cost_sum += parseFloat($(tblobj).find("input[name=reqAmt_3]").val());
	}
	if(!isNaN(parseFloat($(tblobj).find("input[name=reqAmt_4]").val()))) {
		cost_sum += parseFloat($(tblobj).find("input[name=reqAmt_4]").val());
	}
	if(!isNaN(parseFloat($(tblobj).find("input[name=reqAmt_5]").val()))) {
		cost_sum += parseFloat($(tblobj).find("input[name=reqAmt_5]").val());
	}
    
    $("#sumQnt").val(cost_sum);
}