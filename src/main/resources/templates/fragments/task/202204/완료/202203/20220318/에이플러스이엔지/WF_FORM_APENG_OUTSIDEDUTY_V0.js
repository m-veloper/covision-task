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
    return bodyContextObj;
}

//신청시간 체크
function chkWorkTime(obj) {
	
	var sObj  = $("input[name=startTime]").val();
	var eObj  = $("input[name=endTime]").val();
	
	
	
	if(sObj !="" && eObj ==""){
		$("input[name=endTime]").val(sObj);
	}
	else if(sObj =="" && eObj !=""){
		$("input[name=startTime]").val(eObj);
	}
	sObj = sObj.replace(":", "");
	eObj = eObj.replace(":", "");
	
	
	console.log("시작시간 :" + sObj);
	console.log("종료시간 :" + eObj);
	
	if(sObj != "" && eObj != "") {
		var sObjTime = parseInt(sObj.substring(0, 2) * 3600) + parseInt(sObj.substring(2) * 60);
		var eObjTime = parseInt(eObj.substring(0, 2) * 3600) + parseInt(eObj.substring(2) * 60);
		
		if(sObjTime > eObjTime){
			Common.Warning("출발시간은 도착예정시간 보다 먼저일 수 없습니다.");
			$("input[name=startTime]").val(null);
			$("input[name=endTime]").val(null);
		}
	}
	/*
	
	var sObj = $(obj).closest("tr").find("input[name=startTime]").val().replace(":", "");
	var eObj = $(obj).closest("tr").find("input[name=endTime]").val().replace(":", "");
	
	if(sObj != "" && eObj != "") {
		var sObjTime = parseInt(sObj.substring(0, 2) * 3600) + parseInt(sObj.substring(2) * 60);
		var eObjTime = parseInt(eObj.substring(0, 2) * 3600) + parseInt(eObj.substring(2) * 60);
		
		if(sObjTime > eObjTime){
			Common.Warning("출발시간은 도착예정시간 보다 먼저일 수 없습니다.");
			$(obj).closest("tr").find("input[name=startTime]").val(null);
			$(obj).closest("tr").find("input[name=endTime]").val(null);
		}
	}*/
}

