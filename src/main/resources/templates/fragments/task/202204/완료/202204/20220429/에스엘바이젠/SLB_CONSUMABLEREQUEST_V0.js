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
    $('#tblFormSubject').hide();
    

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        $('*[name=REQ_DivInputName]').each(function () {
            $(this).css("display", "block");
        });
        
        //<!--loadMultiRow_Read-->
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 2 });


        }

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
     
        //<!--loadMultiRow_Write-->
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
    /*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	
    var bodyContextObj = {};
	var editorContent = {"tbContentElement" : document.getElementById("dhtml_body").value};
	
	
	bodyContextObj["BodyContext"] = $.extend(editorContent, getFields("mField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
    return bodyContextObj;
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

function COST_CAL() {
    var tblobj = document.getElementById("TBLINFO"); //멀티로우 TABLE ID
    var cost_sum = 0;
    var tex_sum = 0;
    
    for (i = 3 ; i < tblobj.rows.length; i++) {
    	
    	// 값을 입력하지 않았을 경우 계산방지
    	
    	if($(tblobj.rows[i]).find("input[name=SUPPLY_PRICE]").val() != undefined) {
    		if(isEmptyStr($(tblobj.rows[i]).find("input[name=SUPPLY_PRICE]").val())) {
    			cost_sum += 0;
    		} else {
    			cost_sum += parseFloat($(tblobj.rows[i]).find("input[name=SUPPLY_PRICE]").val());
    		}
    	}
    }
    
    $(tblobj).find("input[name=REQ_TOTAL]").val(cost_sum  + tex_sum );
}
function initDivInput(obj, id){
	if(id =="2"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div2] option:checked").text()); 
	}else if(id =="3"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div3] option:checked").text()); 
	}
	
}

//link popup 
function fn_click(pObj){
	
	
	$(pObj).closest("tr").find("input[name=Att_Link]").val()
	
	
	if(getInfo("Request.templatemode") == "Read"){
		var url = $(pObj).closest("tr").find("span[name=Att_Link]").text();
		
		
		if(url.substring(0,4) !=="http"){
			window.open("https://" + url,"", "width=1500, height=900, resize=yes ");
		}else{
			window.open(url, "", "width=1500, height=900, resize=yes ");
		}
		
	}
	if ((formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") && $(pObj).closest("tr").find("input[name=Att_Link]").val() !=""){
		var url = $(pObj).closest("tr").find("input[name=Att_Link]").val();
		
		
		if(url.substring(0,4) !=="http"){
			window.open("https://" + url,"", "width=1500, height=900, resize=yes ");
		}else{
			window.open(url, "", "width=1500, height=900, resize=yes ");
		}
		
	}

}


//multi-row 행추가 후 이벤트
XFORM.multirow.event('afterRowAdded', function ($rows) { 
	COST_CAL();
});

// multi-row 행삭제 후 이벤트
XFORM.multirow.event('afterRowRemoved', function ($rows) { 
	COST_CAL();
}); 
