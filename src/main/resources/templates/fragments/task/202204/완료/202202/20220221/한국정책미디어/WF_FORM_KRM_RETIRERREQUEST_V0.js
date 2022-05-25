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
    $("input[name=userDept]").val(getInfo("AppInfo.dpnm"));
    $("input[name=userName]").val(getInfo("AppInfo.usnm"));
    $("input[name=userPosition]").val(getInfo("AppInfo.uspn"));
    $("input[name=requestPerson]").val(getInfo("AppInfo.usnm"));
    
    $("#Subject").css("height", "30px");
    
    
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    var date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    
    
    var ymd = year + "년 "+ month + "월 " + date + "일 " ;
    
    
    $("#reqDay").val(ymd);
    $("#Subject").css("height", "30px");
    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {
    	
    	 $("#enterDay").attr("readonly",true);
    	 $("#retirementDay").attr("readonly",true);
    	 $("#birthDay").attr("readonly",true);
		 	 

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
        if (document.getElementById("Subject").value == '') {
            Common.Warning('제목을 입력하세요.');
            //SUBJECT.focus();
            return false;
        } else if (document.getElementById("enterDay").value == '') {
            Common.Warning('입사일을 입력하세요.');
            return false;
        } else if (document.getElementById("retirementDay").value == '') {
            Common.Warning('퇴사일을 입력하세요.');
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
	$$(bodyContextObj["BodyContext"]).append("Subject", document.getElementById("Subject").value); 
	$$(bodyContextObj["BodyContext"]).append("UserCode", Common.getSession('USERID')); 
	$$(bodyContextObj["BodyContext"]).append("CompanyCode", Common.getSession('DN_Code')); 
    return bodyContextObj;
}

var objTxtSelect;


function calSDATEEDATE(id) {
	var ENTDATE ="";
	var RETDATE ="";
	console.log(id);
	if(id == "enterDay" ) {
		 ENTDATE = $("#enterDay").val().split('-');
		 if($("#retirementDay").val() ==""||$("#retirementDay").val() =="undefined"){
			 $("#retirementDay").val($("#enterDay").val());
			 RETDATE = $("#enterDay").val().split('-');			 
		 }else{
			 
			 RETDATE = $("#retirementDay").val().split('-'); 
		 }
		
	     
	}else if(id == "retirementDay") {
		RETDATE = $("#retirementDay").val().split('-'); 
		
		 if($("#enterDay").val() ==""||$("#enterDay").val() =="undefined"){
			 $("#enterDay").val($("#retirementDay").val());
			 ENTDATE = $("#retirementDay").val().split('-');
			 
		 }else{
			 ENTDATE = $("#enterDay").val().split('-');
		 }
		
	}
	

    var SOBJDATE = new Date(parseInt(ENTDATE[0], 10), parseInt(ENTDATE[1], 10) - 1, parseInt(ENTDATE[2], 10));
    var EOBJDATE = new Date(parseInt(RETDATE[0], 10), parseInt(RETDATE[1], 10) - 1, parseInt(RETDATE[2], 10));
    var tmpday = EOBJDATE - SOBJDATE;
    tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

    if (tmpday < 0) {
        alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        if(id == "enterDay" ) {
        	$("#enterDay").val(RETDATE[0] + "-" +RETDATE[1] +"-"+RETDATE[2] );
        }else if (id == "retirementDay"){
        	$("#retirementDay").val(ENTDATE[0] + "-" +ENTDATE[1] +"-"+ENTDATE[2] );
        	
        }
    }else{
    	
    	if(parseInt(RETDATE[1], 10) >= parseInt(ENTDATE[1], 10)){
    		$("#continueTime").val((parseInt(RETDATE[0], 10) -parseInt(ENTDATE[0], 10)) +"년 " + (parseInt(RETDATE[1], 10) -parseInt(ENTDATE[1], 10)) + "월");
    	}else{
    		$("#continueTime").val((parseInt(RETDATE[0], 10) -parseInt(ENTDATE[0], 10)-1) +"년 " + (parseInt(RETDATE[1], 10) -parseInt(ENTDATE[1], 10) +12) + "월");
    	}
    	
    	
    	
    }
}



function setFormData(){

	
}

function onlyNumber(o) {
	$(o).val($(o).val().replace(/[^0-9]/g, ""));
}
