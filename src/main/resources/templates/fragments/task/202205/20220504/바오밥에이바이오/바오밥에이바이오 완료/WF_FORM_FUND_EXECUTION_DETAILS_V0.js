//양식별 다국어 정의 부분
var localLang_ko = {
  localLangItems: {}
};

var localLang_en = {
  localLangItems: {}
};

var localLang_ja = {
  localLangItems: {}
};

var localLang_zh = {
  localLangItems: {}
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
    if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
        XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBL_WORK_INFO), 'json', '#TBL_WORK_INFO', 'R');
    }

    
  } else {
    $('*[data-mode="readOnly"]').each(function () {
      $(this).hide();
    });

    // 에디터 처리
    //<!--AddWebEditor-->
    LoadEditor("divWebEditorContainer");

    if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

      document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
      document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
    }

    //<!--loadMultiRow_Write-->
    if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
      XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBL_WORK_INFO), 'json', '#TBL_WORK_INFO', 'W');
    } else {
      XFORM.multirow.load('', 'json', '#TBL_WORK_INFO', 'W', {minLength: 1});
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
      SUBJECT.focus();
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

//본문 XML로 구성
function makeBodyContext() {
  /*var sBodyContext = "";
  sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBL_WORK_INFO", "rField"));
	return bodyContextObj;
}




/**
 *  각 로우의 가격의 총합계를 구하는 함수
 */
let getTotlaPrice = () => {
	
	let totalPrice = 0;
	
	let currentTotalPrice = document.getElementById("totalPrice");
	let priceList = document.querySelectorAll(".multi-row input[name=price]");
	 Array.from(priceList).forEach(function(el) {
		
		// null이 아니면 합계 계산
		if(!checkNull(removeComma(el.value))){
			totalPrice += parseInt( removeComma(el.value));
		}
	});
	
   currentTotalPrice.value = convertComma(totalPrice);
}


/**
 * 원하는 데이블 로우 삭제하기
 * @param obj
 * @returns
 */
let deleteRow = (obj) => {
  let multiRowTemplates = $(obj).parent().parent();

  // 유사배열
  let trList = document.getElementsByClassName("multi-row");
  let trCount = trList.length;

  // 1개 이상 부터 삭제 가능
  if (trCount <= 1) {
    return false;
  } else {
	  

    // 해당 로우 삭제
    multiRowTemplates.remove();
    
    // 가격 합계 호출
    getTotlaPrice();
  
  }
}

let deleteBtn = () => {
	
	  // 유사배열
	  let trList = document.getElementsByClassName("multi-row");
	  let trCount = trList.length;
	  
	  
	  // 1개 이상 부터 삭제 가능
	  if (trCount <= 1) {
	    return false;
	  }
	  
	  // 가격 합계 호출
	  setTimeout(function() {
		  getTotlaPrice();
	  }, 200);
}

/**
 * 콤마 추가 포맷 변형(123456 => 123,456)
 * @param num
 * @returns
 */
let convertComma = (num) => {
	const convertNumber = num.toLocaleString('ko-KR');
	return convertNumber;
}

/**
 * 콤마 삭제 포맷 변형(123,456 => 123456)
 * @param num
 * @returns
 */
let removeComma = (num) => {
	const number = num.replace(/,/g, "");
	return number;
}

/**
 * null 체크
 * @param value
 * @returns
 */
let checkNull = (value) => {
	if(value === ""){
		return true
	}else if(value === null){
		return true
	}else if(value === undefined){
		return true
	}else if(value === NaN){
		return true
	}else{
		return false
	}
}







