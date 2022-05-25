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

// 양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();

    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        // <!--AddWebEditor-->
        LoadEditor("divWebEditorContainer");

        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
            
            if(formJson.Request.mode == "DRAFT" ){
            	var Name = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
            	SetSubject(Name);
            }
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
            // SUBJECT.focus();
            return false;
        } else if (document.getElementById("SaveTerm").value == '') {
            Common.Warning('보존년한을 선택하세요.');
            return false;
        } else {
            return EASY.check().result;
        }
    }
}
function setBodyContext(sBodyContext) {
}

// 본문 XML로 구성
function makeBodyContext() {
	
    var bodyContextObj = {};
	
	// 에디터가 없을 떄
	bodyContextObj["BodyContext"] = getFields("mField");
	
    return bodyContextObj;
}

//제목 지정하기
function SetSubject(Name){
	
	//날짜 바인딩
    var today = new Date();
	$("#Subject").val("[" + CFN_GetDicInfo(getInfo("FormInfo.FormName")) + "]" + "_" + CFN_GetDicInfo(getInfo("AppInfo.usnm")) + "_" + 
            		today.format("yyMMdd") + "_요청내용");
    var year = today.getFullYear();
    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    var date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    var dateStr = year.toString().substr(2) + month + date;
	console.log(formJson.FormInfo.FormName);
	var FormName = formJson.FormInfo.FormName;
	var title = FormName.split(";")[0];
	
}

function ChangeValue1(obj){
	var viewInfo = document.getElementById("selectUser1");
	
    	if($(obj).val() == "6"){    		
    		 $("input[name=div_user_input1]").val("V");
    		 viewInfo.readOnly=false;
    	}else{
    		$("input[name=div_user_input1]").val("N");    		
    		viewInfo.readOnly=true;
    	}
}

function ChangeValue2(obj){
	var viewInfo = document.getElementById("selectUser2");
	
    	if($(obj).val() == "6"){    		
    		 $("input[name=div_user_input2]").val("V");
    		 viewInfo.readOnly=false;
    	}else{
    		$("input[name=div_user_input2]").val("N");    		
    		viewInfo.readOnly=true;
    	}
}


function ChangeValue3(obj){
	var viewInfo = document.getElementById("selectUser3");
	
    	if($(obj).val() == "6"){    		
    		 $("input[name=div_user_input3]").val("V");
    		 viewInfo.readOnly=false;
    	}else{
    		$("input[name=div_user_input3]").val("N");    		
    		viewInfo.readOnly=true;
    	}
}

