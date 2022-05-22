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
        
        // <!--loadMultiRow_Read-->

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });
        

        // 에디터 처리
        // <!--AddWebEditor-->
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
        
//        get10Percent();
        calculate.init();
     
        // <!--loadMultiRow_Write-->
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

// 본문 XML로 구성
function makeBodyContext() {
    /*
	 * var sBodyContext = ""; sBodyContext = "<BODY_CONTEXT>" +
	 * getFields("mField") + "</BODY_CONTEXT>";
	 */
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
    return bodyContextObj;
}

/**
 * 전체 값의 몇 퍼센트(%) 구하기
 * @returns
 */

let calculate =  {
	// 초기회	
	init(){
		this.getSupplyPrice();
	},
	
	// 공급가격 element 동작
	getSupplyPrice() {
		let supplyPrice = document.getElementById("supplyPrice");
		supplyPrice.addEventListener('focusout', function(event){
			let currentPrice =  event.target.value;
			calculate.addVat(stringToNum(currentPrice))
		});
	},
	
	// 부가세 element 동작
	addVat(currentPrice) {
		let vat = document.getElementById("vat");
		
		// 값의 몇 퍼센트(%) 계산
		// 10%
		let currentVat = (currentPrice * 0.1);
		vat.value = convertComma(currentVat);
	
		calculate.setTotal(currentPrice, currentVat)
	},
	
	// 합계 element에 세팅
	setTotal(currentPrice, currentVat){
		let totalPrice = document.getElementById("totalPrice");
		totalPrice.value = convertComma((currentPrice + currentVat));
	}
}


/**
 * 콤마 추가 포맷 변형(123456 => 123,456)
 * @param num
 * @returns
 */
let convertComma = (num) => {
	const convertNumber = num.toLocaleString('ko-KR', option);
	return convertNumber;
}

/**
 * 콤마 추가시, 소수점 포맷
 */
const option = {
  maximumFractionDigits: 0
};

/**
 * 콤마 제거 (문자열 타입을 숫자로)
 */
let stringToNum = (obj) => {
	return Number(obj.replace(/\,/gi, ''));
}