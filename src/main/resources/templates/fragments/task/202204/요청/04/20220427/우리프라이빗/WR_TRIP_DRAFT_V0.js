	
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
    
    // 읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
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

//몇박몇일 구하기 (HIW)
function SetDaysNights() {

    var vStartDate = $("input[id=SDATE]").val();
    var vEndDate = $("input[id=EDATE]").val();
    if (vStartDate != "" && vEndDate != "") {
        if ($("input[id=DAYS]") != undefined) {
            var arrDate1 = vStartDate.split("-");
            var arrDate2 = vEndDate.split("-");
            var vDate1 = new Date(arrDate1[0], arrDate1[1] - 1, arrDate1[2]).getTime();
            var vDate2 = new Date(arrDate2[0], arrDate2[1] - 1, arrDate2[2]).getTime();
            var vResult = (vDate2 - vDate1) / (1000 * 60 * 60 * 24);

            $("input[id=DAYS]").val(vResult + 1);
        }

        if ($("input[id=NIGHTS]") != undefined) {
            $("input[id=NIGHTS]").val(vResult);
        }
    }
}

function validateVacDate() {

    var sdt = $('#SDATE').val().replace(/-/g, '');
    var edt = $('#EDATE').val().replace(/-/g, '');

    if (Number(sdt) > Number(edt)) {
        Common.Warning("시작일은 종료일보다 먼저 일 수 없습니다.");
        $('#EDATE').val('')
    }
}


function addSum(){
	var price = 0;
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	
	var TranPrice02 = document.getElementById("TranPrice02");
	var DayPrice02 = document.getElementById("DayPrice02");
	var OrignPrice = document.getElementById("OrignPrice");
	
	
	DayPrice02Val = DayPrice02.value.DayPrice02.replace(regexp, ',');
	DayPrice02Val = DayPrice02.value.DayPrice02.replace(regexp, ',');
	OrignPriceVal = DayPrice02.value.DayPrice02.replace(regexp, ',');
	
	
}