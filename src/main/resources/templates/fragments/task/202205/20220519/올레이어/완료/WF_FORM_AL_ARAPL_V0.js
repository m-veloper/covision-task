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

    
    // 완료모드 일 경우
    if (formJson.Request.mode == "COMPLETE") {
    	showElementByReadMode.show();
	}

    
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
        getDate.today()
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


/**
 * 읽기 모드일 때 보일 엘리먼트
 */
let showElementByReadMode = {
	
	// 이미지 영역 보이기
	show(){
		$(".sign-img").css("display", "block");
		showElementByReadMode.getData();
	},
	// 기안 후 이미지 데이터 가져와서 img 태그에 세팅하기
	getData(){
		
		const ceo = formJson.ApprovalLine.steps.division.step[0].ou.person.taskinfo.customattribute1;
		const worker = formJson.ApprovalLine.steps.division.step[1].ou.person.taskinfo.customattribute1;
		
		// 서비스 하기
		$("#ceoSign").attr("src", ceo);
		$("#workerSign").attr("src", worker);
		
		// 테스트 하기
//		$("#ceoSign").attr("src", "https://t1.daumcdn.net/cfile/blog/212074375301C90327");
//		$("#workerSign").attr("src", "https://t1.daumcdn.net/cfile/blog/212074375301C90327");

//		const taskinfo = formJson.ApprovalLine.steps.division.step;
//		const result = taskinfo.map(x => {
//			console.log(x.ou.person.taskinfo.customattribute1);
//		});
	}
}

let setSignImg = () => {
	
}