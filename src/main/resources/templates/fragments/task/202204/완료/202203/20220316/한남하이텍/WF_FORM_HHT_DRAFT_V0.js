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
        
        
      //<!--loadMultiRow_Read 시작-->
        if (JSON.stringify(formJson.BodyContext) != "{}") {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.sumTable), 'json', '#sumTable', 'R');            
        } else {
            XFORM.multirow.load('', 'json', '#sumTable', 'R');
        }
        //<!--loadMultiRow_Read 끝-->

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        //<!--AddWebEditor-->
        LoadEditor("divWebEditorContainer");
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
        
        //<!--loadMultiRow_Write 시작-->
        if (JSON.stringify(formJson.BodyContext) != "{}") {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.sumTable), 'json', '#sumTable', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#sumTable', 'W', { minLength: 5 });
        }
        //<!--loadMultiRow_Write 끝-->
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
	
	var editorContent = {"tbContentElement" : document.getElementById("dhtml_body").value};
	
	bodyContextObj["BodyContext"] = $.extend(editorContent, getFields("mField"));
	
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("sumTable", "rField")); // multi-row 설정
	
    return bodyContextObj;
}


// multi-row 단가*수량 = 금액 function
function COST_CAL() {
    var tblobj = document.getElementById("sumTable"); //멀티로우 TABLE ID
    var cost_sum = 0;
    var tex_sum = 0;
    var bEmpty = false;
    
    for (i = 3 ; i < tblobj.rows.length; i++) {
    	
    	// 값을 입력하지 않았을 경우 계산방지
    	if(isEmptyStr($(tblobj.rows[i]).find("input[name=amnt]").val()) && isEmptyStr($(tblobj.rows[i]).find("input[name=unit]").val())) {
    		bEmpty = true;
    	}
    	
        var cost = $(tblobj.rows[i]).find("input[name=amnt]").val() * $(tblobj.rows[i]).find("input[name=unit]").val()//수량 * 단가 = 금액
        
        if(!bEmpty) {
        	$(tblobj.rows[i]).find("input[name=cost]").val(cost); //수량 * 단가 = 금액
        }
        // 부가세 별도 표시시 추가해야됨
        // $(tblobj.rows[i]).find("input[name=TAX]").val(parseFloat(cost * 0.1)); 

        //cost_sum += parseFloat($(tblobj.rows[i]).find("input[name=cost]").val());
        //tex_sum += parseFloat($(tblobj.rows[i]).find("input[name=TAX]").val());
    }
    //$("#TOTAL_COST").val(cost_sum);
    //$("#TOTAL_TAX").val(tex_sum);
}

