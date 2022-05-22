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
        
        // 오늘 날짜 자동 입력
        getDate.today();
        
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

/**
 * 날짜 자동 입력
 */
let getDate = {
		
	// 오늘 날짜 자동 입력
	today() {
		
		let todayElement = document.getElementById("today");
		let today = new Date();
		let year = today.getFullYear();
		let month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
		let date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
		todayElement.value = (year + "년 " + month + "월 " + date + "일")
	},
	
	// 선택한 날짜 자동 입력
	setDate() {
		
        let startDt = document.getElementById("startDt");
        let wStartDt = document.getElementById("wStartDt");
       
        // focusOut시 데이터 바인딩 시간차이 때문에 Promise 사용
        startDt.addEventListener('focusout', function(event){
            new Promise(function(resolve, reject) {
                setTimeout(function() {                
                	resolve(event.target.value);
                }, 500);
            }).then(function (result) {
            	wStartDt.value = result;
            });
        });
	}
}



