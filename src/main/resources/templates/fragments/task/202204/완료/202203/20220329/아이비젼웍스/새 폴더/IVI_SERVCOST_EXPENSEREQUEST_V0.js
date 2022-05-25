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
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info), 'json', '#tbl_info', 'R');
        }
    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        //<!--AddWebEditor-->
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
        	
        	
        	 $('#calDiv').val("업무경비");

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
     
        //<!--loadMultiRow_Write-->
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info), 'json', '#tbl_info', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#tbl_info', 'W', { minLength: 1 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("tbl_info", "rField"));
	
    return bodyContextObj;
}

function calTotDays(obj) {
	
	var objtr = $(obj).closest("tr");
	if($(objtr).find("input[name=SDate]").val() != "" && $(objtr).find("input[name=EDate]").val() != ""){
		var sDate = parseInt($(objtr).find("input[name=SDate]").val().replace(/[^0-9]/g, ''));
		var eDate = parseInt($(objtr).find("input[name=EDate]").val().replace(/[^0-9]/g, ''));
		
		var subDate = eDate - sDate;
		
		$(objtr).find("input[name=TotDays]").val(subDate+1);
		EASY.triggerFormChanged();
		
        if(subDate < 0){ // 시작일 > 종료일
        	alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        	$(objtr).find("input[name=SDate]").val("");
        	$(objtr).find("input[name=EDate]").val("");
        	$(objtr).find("input[name=TotDays]").val("");
        } else if(subDate == 0){ // 시작일 == 종료일 -> 시간체크 필요
        	
        	if($(objtr).find("input[name=STime]").val() != "" && $(objtr).find("input[name=ETime]").val() != ""){
        		var sTime = parseInt($(objtr).find("input[name=STime]").val().replace(/[^0-9]/g, ''));
        		var eTime = parseInt($(objtr).find("input[name=ETime]").val().replace(/[^0-9]/g, ''));
        		var subTime = sTime - eTime;
        		if(subTime > 0){
        			alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        			$(objtr).find("input[name=STime]").val("");
                	$(objtr).find("input[name=ETime]").val("");
        		}
        	}
        }
	}
}


function fn_a_sum() {
    var a_sum_1 = 0;
    $('#tbl_info').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_1 += parseInt($("input[name=cost]").eq(i + 1).val() == "" ? 0 :$("input[name=cost]").eq(i + 1).val().replace(/,/g, ""));
    		
    });
    
   
    $('#a_sum_1').val(CnvtComma(a_sum_1));
    $('#calTotal').val(CnvtComma(a_sum_1));
    
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
	fn_a_sum();
}); 


