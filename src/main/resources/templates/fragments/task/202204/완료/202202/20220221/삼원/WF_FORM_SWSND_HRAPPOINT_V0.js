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
    var SubjectTitle = document.getElementById("Subject");
    
    SubjectTitle.addEventListener('change', function(event){
    	 $("#headname").text($("#Subject").val());
    });
    
    

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {
    	$("#headname").text($("#Subject").text());

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        //<!--loadMultiRow_Read-->
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO2', 'R');
        }
        var selectDiv = document.getElementById("selectDiv");
        console.log($('#selectDiv').text());
        
        var tblInfo = document.getElementById("TBLINFO");
    	var tblInfo1 = document.getElementById("TBLINFO1");
    	var tblInfo2 = document.getElementById("TBLINFO2");
    	
        
        
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
    	}
        
        
      //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
        }
        
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO1 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO1', 'W', { minLength: 1 });
        }
        
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO2 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 1 });
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
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO1 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO1', 'W', { minLength: 1 });
        }
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO2 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 1 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO1", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO2", "rField"));
    return bodyContextObj;
}
function ChangeTable(obj){
	
	
	var tblInfo = document.getElementById("TBLINFO");
	var tblInfo1 = document.getElementById("TBLINFO1");
	var tblInfo2 = document.getElementById("TBLINFO2");
	
	
	
    	if($(obj).val() == "임원인사"|| $(obj).val() == "정기인사"){

    		console.log("1,2"+$(obj).val());
    		$("select[name=div_table]").val($(obj).val());
    		$("select[name=div_table01]").val($(obj).val());
    		$("select[name=div_table02]").val($(obj).val());
    		
    		$("#selectDiv").val($(obj).val());
    		
    		
    		tblInfo.style.display = "block";
    		tblInfo1.style.display = "none";
    		tblInfo2.style.display = "none";
    		
    		
    	}else if($(obj).val() == "신규입사"){
    		console.log("9"+$(obj).val());
    		console.log($(obj).val());    		
    		$("select[name=div_table]").val($(obj).val());
    		$("select[name=div_table01]").val($(obj).val());
    		$("select[name=div_table02]").val($(obj).val());
    		
    		$("#selectDiv").val($(obj).val());
    		
    		tblInfo.style.display = "none";
    		tblInfo1.style.display = "none";
    		tblInfo2.style.display = "block";
    		
    		
    	}else{
    		
    		$("select[name=div_table]").val($(obj).val());
    		$("select[name=div_table01]").val($(obj).val());
    		$("select[name=div_table02]").val($(obj).val());
    		
    		$("#selectDiv").val($(obj).val());
    		
    		if($(obj).val() =="보직변경"){
    			$("#changeDeptTh").text("소속");	
    		}else if($(obj).val() =="직책변경"){
    			$("#changeDeptTh").text("직책");	
    		}else{
    			$("#changeDeptTh").text("현장");	
    		}
    		
    		tblInfo.style.display = "none";
    		tblInfo1.style.display = "block";
    		tblInfo2.style.display = "none";
    		
    		
    	}
    	
}
