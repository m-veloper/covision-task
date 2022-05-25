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



//조직도 기본정보
var _hrInfo ;

var lang = Common.getSession('lang');
function getMultiLangBySs(multiLang){
	return lang=="ko"?multiLang.split(";")[0]:lang=="en"?multiLang.split(";")[1]:lang=="ja"?multiLang.split(";")[2]:lang=="zh"?multiLang.split(";")[3]:multiLang.split(";")[0];
}

//양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();
    
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    
    
    $("input[name=writeDate]").val(year + "년 " + month +"월 " + day +"일 ");
    
    $("input[name=writeDay]").val("작성일");
    
    $("input[name=userDept]").val(getInfo("AppInfo.dpnm"));
    $("input[name=userName]").val(getInfo("AppInfo.usnm"));
    $("input[name=userPosition]").val(getInfo("AppInfo.uspn"));

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
        	if(document.getElementById("Subject").value == ''){
        		
        	}
        	
        		

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
        if (document.getElementById("Subject").value == '') {
            Common.Warning('제목을 입력하세요.');
            //SUBJECT.focus();
            return false;
        } else {  
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
	$$(bodyContextObj["BodyContext"]).append("Subject", document.getElementById("Subject").value); 
	$$(bodyContextObj["BodyContext"]).append("UserCode", Common.getSession('USERID')); 
	$$(bodyContextObj["BodyContext"]).append("CompanyCode", Common.getSession('DN_Code')); 
    return bodyContextObj;
}




function onlyNumber(o) {
	$(o).val($(o).val().replace(/[^0-9]/g, ""));
}

function setFormData(){

	
}

function onlyNumber(o) {
	$(o).val($(o).val().replace(/[^0-9]/g, ""));
}

//신청시간 체크
function chkWorkTime1(obj) {
	var sObj = $(obj).closest("tr").find("input[name=orgStartTime]").val().replace(":", "");
	var eObj = $(obj).closest("tr").find("input[name=orgEndTime]").val().replace(":", "");
	
	if(sObj != "" && eObj != "") {
		var sObjTime = parseInt(sObj.substring(0, 2) * 3600) + parseInt(sObj.substring(2) * 60);
		var eObjTime = parseInt(eObj.substring(0, 2) * 3600) + parseInt(eObj.substring(2) * 60);
		
		if(sObjTime > eObjTime){
			Common.Warning("시작시간은 종료시간보다 먼저일 수 없습니다.");
			$(obj).closest("tr").find("input[name=orgStartTime]").val(null);
			$(obj).closest("tr").find("input[name=orgEndTime]").val(null);
		}
	}
	
}
function chkWorkTime2(obj) {
	var sObj = $(obj).closest("tr").find("input[name=modStartTime]").val().replace(":", "");
	var eObj = $(obj).closest("tr").find("input[name=modEndTime]").val().replace(":", "");
	
	if(sObj != "" && eObj != "") {
		var sObjTime = parseInt(sObj.substring(0, 2) * 3600) + parseInt(sObj.substring(2) * 60);
		var eObjTime = parseInt(eObj.substring(0, 2) * 3600) + parseInt(eObj.substring(2) * 60);
		
		if(sObjTime > eObjTime){
			Common.Warning("시작시간은 종료시간보다 먼저일 수 없습니다.");
			$(obj).closest("tr").find("input[name=modStartTime]").val(null);
			$(obj).closest("tr").find("input[name=modEndTime]").val(null);
		}
	}
}
