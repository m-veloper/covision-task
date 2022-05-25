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
        
        //<!--loadMultiRow_Read-->
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        }
        /*
         * 20220225 양식 분할로 숨김처리
        var selectDiv = document.getElementById("selectDiv");
        console.log($('#selectDiv').text());
        
        var tblInfo = document.getElementById("TBLINFO");
    	
       
        
        if($('#selectDiv').text() == "임원인사"|| $('#selectDiv').text() == "정기인사"){
        	
        	console.log($('#selectDiv').text());
    		
    		
    		tblInfo.style.display = "";
    		tblInfo1.style.display = "none";
    		tblInfo2.style.display = "none";
    		
    		
    	}else if($('#selectDiv').text() == "신규입사"){
    		
    		tblInfo.style.display = "none";
    		tblInfo1.style.display = "none";
    		tblInfo2.style.display = "";
    		
    		
    	}else{
    		
    		tblInfo.style.display = "none";
    		tblInfo1.style.display = "";
    		tblInfo2.style.display = "none";
    	}*/
        
        
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
        if($("#headname").val() !=""){
        	$("#headname").text($("#Subject").val());
        }
        

        // 에디터 처리
        //<!--AddWebEditor-->
        
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
	bodyContextObj["BodyContext"] = getFields("mField");
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
    return bodyContextObj;
}


function ChangeTable(obj){
	var tblInfo = document.getElementById("TBLINFO");
	//var tblInfo = document.getElementById("TBLINFO");
	//console.log($(obj).val());
	
	$("select[name=div_table02]").val($(obj).val());
	
}
