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
    
    $("input[name=writeDate]").val(year + "년 " + month +"월" + day +"일");
    
    $("input[name=writeDay]").val("작성일");

    $("input[name=writePerson]").val(getInfo("AppInfo.usnm"));
    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {
    	
    	 $("#enterDay").attr("readonly",true);
    	 $("#retirementDay").attr("readonly",true);
    	 $("#enterDeptDay").attr("readonly",true);
    	 $("#writeDay").attr("readonly",true);
    	 $("#writeDate").attr("readonly",true);
    		 

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
        }else if (document.getElementById("enterDeptDay").value == '') {
            Common.Warning('부서 전입일을 입력하세요.');
            return false;
        }else if (document.getElementById("specificComment1").value == '') {
            Common.Warning('퇴직 사유 구체적 내용을 입력하세요.');
            return false;
        }else if (document.getElementById("otherRequest").value == '') {
            Common.Warning('기타 요청사항을 입력하세요.');
            return false;
        }else if (document.getElementById("proposal").value == '') {
            Common.Warning('건의사항을 입력하세요.');
            return false;
        }else if (document.getElementById("Applydate").value == '') {
            Common.Warning('인수일자를 입력하세요.');
            return false;
        }
        else if (document.getElementById("transitionPerson_NAME").value == '') {
            Common.Warning('인수자를 입력하세요.');
            return false;
        }
        else if (document.getElementById("confirmPerson_NAME").value == '') {
            Common.Warning('확인자를 입력하세요.');
            return false;
        } else if (document.getElementById("writePerson").value == '') {
            Common.Warning('작성자를 입력하세요.');
            return false;
        } else if (document.getElementById("confirmPerson").value == '') {
            Common.Warning('결제자를 입력하세요.');
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
function OpenWinEmployee(szObject) {	
	objTxtSelect = document.getElementById(szObject);
    objTxtSelect.value = "";
    
	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=Requester_CallBack&type=B1","",1000,580,"");
}

function Requester_CallBack(pStrItemInfo) {
   var oJsonOrgMap = $.parseJSON(pStrItemInfo);
   var I_User = oJsonOrgMap.item[0];
	
   if(I_User != undefined){
    if (getInfo("AppInfo.usid") != I_User.AN) {
        objTxtSelect.value = CFN_GetDicInfo(I_User.DN);
        document.getElementById("transitionPerson_CODE").value = I_User.UserCode;
    }
    else {
        alert('인수자로 본인이 선택되었습니다.\r\n다시 선택하세요');
        //OpenWinEmployee();
    }
   }
}

function OpenWinEmployee2(szObject) {	
	objTxtSelect = document.getElementById(szObject);
    objTxtSelect.value = "";
    
	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=Requester_CallBack2&type=B1","",1000,580,"");
}

function Requester_CallBack2(pStrItemInfo) {
   var oJsonOrgMap = $.parseJSON(pStrItemInfo);
   var I_User = oJsonOrgMap.item[0];
	
   if(I_User != undefined){
    if (getInfo("AppInfo.usid") != I_User.AN) {
        objTxtSelect.value = CFN_GetDicInfo(I_User.DN);
        document.getElementById("confirmPerson_CODE").value = I_User.UserCode;
    }
    else {
        alert('확인자로 본인이 선택되었습니다.\r\n다시 선택하세요');
        //OpenWinEmployee();
    }
   }
}

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
