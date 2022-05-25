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
        
        if (JSON.stringify(formJson.BodyContext.request_Tbl) != "{}" && formJson.BodyContext.request_Tbl != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl), 'json', '#request_Tbl', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl', 'R');
        }       
        if (JSON.stringify(formJson.BodyContext.request_Tbl1) != "{}" && formJson.BodyContext.request_Tbl1 != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl1), 'json', '#request_Tbl1', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl1', 'R');
        }
        if (JSON.stringify(formJson.BodyContext.request_Tbl2) != "{}" && formJson.BodyContext.request_Tbl2 != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl2), 'json', '#request_Tbl2', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl2', 'R');
        }
        if (JSON.stringify(formJson.BodyContext.request_Tbl3) != "{}" && formJson.BodyContext.request_Tbl3 != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl3), 'json', '#request_Tbl3', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl3', 'R');
        }
        if (JSON.stringify(formJson.BodyContext.request_Tbl4) != "{}" && formJson.BodyContext.request_Tbl4 != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl4), 'json', '#request_Tbl4', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl4', 'R');
        }
        
        if (JSON.stringify(formJson.BodyContext.request_Tbl5) != "{}" && formJson.BodyContext.request_Tbl5 != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl5), 'json', '#request_Tbl5', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl5', 'R');
        }
        if (JSON.stringify(formJson.BodyContext.request_Tbl6) != "{}" && formJson.BodyContext.request_Tbl6 != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl6), 'json', '#request_Tbl6', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl6', 'R');
        }
        if (JSON.stringify(formJson.BodyContext.request_Tbl7) != "{}" && formJson.BodyContext.request_Tbl7 != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl7), 'json', '#request_Tbl7', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl7', 'R');
        }
        if (JSON.stringify(formJson.BodyContext.request_Tbl8) != "{}" && formJson.BodyContext.request_Tbl8 != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl8), 'json', '#request_Tbl8', 'R');
        }else{
        	XFORM.multirow.load('', 'json', '#request_Tbl8', 'R');
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
            

       
			if (formJson.Request.mode == "DRAFT" && formJson.Request.gloct == "") {
	            
				var today = new Date();
				$("#InitiatorDate").val(today.format("yyyy-MM-dd"));
	            
			} else {
			    if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl), 'json', '#request_Tbl', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl1), 'json', '#request_Tbl1', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl2), 'json', '#request_Tbl2', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl3), 'json', '#request_Tbl3', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl4), 'json', '#request_Tbl4', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl5), 'json', '#request_Tbl5', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl6), 'json', '#request_Tbl6', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl7), 'json', '#request_Tbl7', 'W');
			    	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl8), 'json', '#request_Tbl8', 'W');
			    	

			    }
			    
			}        
        }
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl), 'json', '#request_Tbl', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl1), 'json', '#request_Tbl1', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl2), 'json', '#request_Tbl2', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl3), 'json', '#request_Tbl3', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl4), 'json', '#request_Tbl4', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl5), 'json', '#request_Tbl5', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl6), 'json', '#request_Tbl6', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl7), 'json', '#request_Tbl7', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.request_Tbl8), 'json', '#request_Tbl8', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#request_Tbl', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl1', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl2', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl3', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl4', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl5', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl6', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl7', 'W', { minLength: 0 });
            XFORM.multirow.load('', 'json', '#request_Tbl8', 'W', { minLength: 0 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl1", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl2", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl3", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl4", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl5", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl6", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl7", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("request_Tbl8", "rField"));
	
	
    return bodyContextObj;
}

function calSDATEEDATE() {
    // 현재 객채(input) 에서 제일 가까이 있는 tr을 찾음
    //   var tmpObj = $(obj).closest("tr");
	
	// BaseCode 가져오는 방식 변경에 따라 소스 수정함.
	//var selectType = $$(oCodeList).find("CacheData").concat().has("[Code="+$(obj).parent().find("select").val()+"]").attr("Reserved3");
		
		if($("#Start_Date").val()!=""){
	        var SYDATE = $("input[id=Start_Date]").val().split('년 ');
	        var SMDATE = SYDATE[1].split('월 ');
	        var SDDATE = SMDATE[1].split('일');
		}
		if($("#End_Date").val()!=""){
	        var EYDATE = $("input[id=End_Date]").val().split('년 ');
	        var EMDATE = EYDATE[1].split('월 ');
	        var EDDATE = EMDATE[1].split('일');
		}
		if($("#Start_Date").val()!="" && $("#End_Date").val()!=""){
	        var SOBJDATE = new Date(parseInt(SYDATE[0], 10), parseInt(SMDATE[0], 10) - 1, parseInt(SDDATE[0], 10));
	        var EOBJDATE = new Date(parseInt(EYDATE[0], 10), parseInt(EMDATE[0], 10) - 1, parseInt(EDDATE[0], 10));
	        var tmpday = EOBJDATE - SOBJDATE;
	        tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);
	        
	        $("#Total_Day").val((tmpday+1));
		    EASY.triggerFormChanged();
		    if (tmpday < 0) {
		        alert("이전 일보다 전 입니다. 확인하여 주십시오.");
		        $(mobj).find("input[id=End_Date]").val("");
		        $(mobj).find("input[id=Total_Day]").val("");
		    }
		}
}



//콤마 붙은 문자 숫자로 변경
function toNum(obj){
	return Number($(obj).val().toString().replace(/\,/gi, ''));
}