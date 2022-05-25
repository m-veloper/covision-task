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
        
        // 부서/신청자이름 셋팅
        $("#dptReqNm").html(getInfo("AppInfo.dpnm") + "/" + getInfo("AppInfo.usnm"));

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
        
        // 부서/신청자이름 셋팅
        $("#dptReqNm").html(getInfo("AppInfo.dpnm") + "/" + getInfo("AppInfo.usnm"));
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


// 시간차 구하는 함수
function calDateTime(obj) {
    var tmpObj = obj;
    tmpObj = $(obj).closest("tr");
    
    // 시작 일자 및 시간 ~ 종료 일자 및 시간이 전부 선택됬을 때만 계산
    if ($(tmpObj).find("input[id=SDATE]").val() != "" && $(tmpObj).find("input[id=EDATE]").val() != "") {
        var start_day = $("#SDATE").val().split('-');
        var finish_day = $("#EDATE").val().split('-');

        var SOBJDATE = new Date(parseInt(start_day[0], 10), parseInt(start_day[1], 10) - 1, parseInt(start_day[2], 10));
        var EOBJDATE = new Date(parseInt(finish_day[0], 10), parseInt(finish_day[1], 10) - 1, parseInt(finish_day[2], 10));
        var tmpday = EOBJDATE - SOBJDATE;
        tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

        if (tmpday < 0) {
        	Common.Warning("종료일은 시작일보다 먼저 일 수 없습니다.");
        	$("#EDATE").val('');
        }
        
        else if ($(tmpObj).find("input[id=STIME]").val() != "" && $(tmpObj).find("input[id=ETIME]").val() != "") {
            var start_time = $("#STIME").val().split(':');
            var finish_time = $("#ETIME").val().split(':');
            var SOBJTIME = new Date(parseInt(start_day[0], 10), parseInt(start_day[1], 10) - 1, parseInt(start_day[2], 10), parseInt(start_time[0], 10), parseInt(start_time[1], 10), 0);
            var EOBJTIME = new Date(parseInt(finish_day[0], 10), parseInt(finish_day[1], 10) - 1, parseInt(finish_day[2], 10), parseInt(finish_time[0], 10), parseInt(finish_time[1], 10), 0);

            var gap = Math.round((EOBJTIME - SOBJTIME) / 1000);

            var D = Math.floor(gap / 86400);
            var H = Math.floor((gap - D * 86400) / 3600 % 3600) + (D * 24);
            var M = Math.floor((gap - H * 3600) / 60 % 60);

            $("#totPeriod").val(D + "일 (총 " + H + "시간 " + M + "분)");
        }
    }
}
