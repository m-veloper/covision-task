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
        
        //<!--loadMultiRow_Read-->
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBL_WORK_INFO), 'json', '#TBL_WORK_INFO', 'R');
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
            $("#DeptName").val(m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false));
            $("#Todays").val(getTodayDate());
            
        }
     
        //<!--loadMultiRow_Write-->
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBL_WORK_INFO), 'json', '#TBL_WORK_INFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBL_WORK_INFO', 'W', { minLength: 1 });
        }
    }
}

function setLabel() {
}

function setFormInfoDraft() {
}

function checkForm(bTempSave) {
	if (document.getElementById("Subject").value == "") {
		document.getElementById("Subject").value = CFN_GetDicInfo(getInfo("AppInfo.usnm")) + " - " + CFN_GetDicInfo(getInfo("FormInfo.FormName"));
    }
	
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBL_WORK_INFO", "rField"));
	return bodyContextObj;
}

function calYear(){
	var str = $("#SDate").val().split('.');
	var str1 = $("#EDate").val().split('.');
	
		$("#year").val(str[0]);
}

function calWorkTime(obj) {
	var sObj = $(obj).closest("tr").find("input[name=StartTime]").val().replace(":", "");
	var eObj = $(obj).closest("tr").find("input[name=EndTime]").val().replace(":", "");
	var idleTime = 0;
	
	if(sObj != "" && eObj != ""){
		if (sObj <= eObj) {
			var sObjTime = parseInt(sObj.substring(0, 2) * 3600) + parseInt(sObj.substring(2) * 60);
			var eObjTime = parseInt(eObj.substring(0, 2) * 3600) + parseInt(eObj.substring(2) * 60);
			
			var gap = eObjTime - sObjTime - (idleTime == "" ? 0 : parseInt(idleTime * 60));
			var h = "";
			var m = "";
			
			h = Math.floor(gap/3600);
			
			$(obj).closest("tr").find("input[name=WorkTime]").val(h);
			
			calTotalTime();
		}
		else{
			Common.Warning("시작시간은 종료시간보다 앞에 있을 수 없습니다.");
			return false;
		}
	}
}

//신청시간 합계 계산
function calTotalTime() {
	var sum = 0;
	var h = "";
	var m = "";
	
	$("input[name=WorkTime]").each(function(i, obj){
		if($(obj).val() != "") {
			var time = $(obj).val().replace(":", "");
			sum += parseInt(time.substring(0, 2) * 3600) + parseInt(time.substring(2) * 60);
		}
    });

	h = Math.floor(sum/3600);
	
	$("#TotalTime").val(h);
}

function getTodayDate(){
	 var today = new Date();
	 var dd = today.getDate();
	 var mm = today.getMonth() + 1;
	 var yyyy = today.getFullYear();
	 
	 if (dd < 10) {
	        dd = '0' + dd
	    }
	    if (mm < 10) {
	        mm = '0' + mm
	    }
	 var str = yyyy+'년 '+mm+'월 '+dd +'일';
	 return str;	 
}

function settingSDate(){
	var sdate = $("#SDate").val().split('.');
	var text = sdate[1]+'월 '+sdate[2]+'일';
	$("#S_Date").val(text);	
}

function settingEDate(){
	var edate = $("#EDate").val().split('.');
	var text = edate[1]+'월 '+edate[2]+'일';
	$("#E_Date").val(text);	
}