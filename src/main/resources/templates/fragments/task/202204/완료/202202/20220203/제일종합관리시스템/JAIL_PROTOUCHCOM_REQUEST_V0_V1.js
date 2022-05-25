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
        
        // 멀티로우 처리
        
        if (typeof formJson.BodyContext != 'undefined') {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.MULTI_TABLE02), 'json', '#MULTI_TABLE02', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.MULTI_TABLE03), 'json', '#MULTI_TABLE03', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#MULTI_TABLE02', 'R');
            XFORM.multirow.load('', 'json', '#MULTI_TABLE03', 'R');
        }

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });
        
        // 멀티로우 처리
        if (typeof formJson.BodyContext != 'undefined') {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.MULTI_TABLE02), 'json', '#MULTI_TABLE02', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.MULTI_TABLE03), 'json', '#MULTI_TABLE03', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#MULTI_TABLE02', 'W', { minLength: 1, maxLength: 10 });
            XFORM.multirow.load('', 'json', '#MULTI_TABLE03', 'W', { minLength: 4, maxLength: 10 });
        }
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
          /*  XFORM.multirow.load('', 'json', '#MULTI_TABLE03', 'W', { minLength: 4, maxLength: 10 });*/
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
	// 멀티로우 있을 때
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("MULTI_TABLE02", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("MULTI_TABLE03", "rField"));
	
    return bodyContextObj;
}

//버튼 추가
function plusBtn(obj){
	if(obj == "MinusBtn"){
		$("#MinusBtn").trigger("click");
		
	}else {
		$("#addbtn").trigger("click");
	}
}

//계약금액 변경 시 수식
function checkValue(){
	console.log("checkValue() 진입");
	//정규식 코드
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	//테이블1 계약금액
	var ContPrice = document.getElementsByName("ContPrice");
	//테이블2 계약금액
	var ContPrice02 = document.getElementsByName("ContPrice02");
	//테이블2 수수료율
	var ChargePer = document.getElementsByName("ChargePer");
	//테이블2 수수료
	var Charge = document.getElementsByName("Charge");
	
	for(var i=1; i <= ContPrice.length-1; i++){
		if(ContPrice[i].value != ''){
			ContPrice02[i].value = ContPrice[i].value.replaceAll(",", "").toString().replace(regexp, ',');
			if(ChargePer[i].value != ''){
				var ChargeValue = parseInt(ContPrice02[i].value.replaceAll(",", ""));
				var result = ChargeValue * (ChargePer[i].value / 100);
				Charge[i].value = result.toString().replace(regexp, ',');
			} else {
				ChargePer[i].value = '';
			}
			
		} else {
			ContPrice02[i].value = '';
		}
	}
}

//수수료율 계산 수식
function vauelChange(obj, stringId){
	
		if(stringId == 'ChargePer'){
			var change = $(obj).val() / 100;
			var ContPrice02 = $(obj).closest("tr").find("input[name='ContPrice02']");
			var Charge = $(obj).closest("tr").find("input[name='Charge']");
			var ContPrice02Value = parseInt(ContPrice02.val().replaceAll(",", ""));
			var tax = ContPrice02Value * change;
			Charge.val(tax);
		}else if(stringId == 'Charge'){
			//수수료가 입력 되었을 때
			var ContPrice02 = $(obj).closest("tr").find("input[name='ContPrice02']");
			var ChargePer = $(obj).closest("tr").find("input[name='ChargePer']");
			var ContPrice02Value = parseInt(ContPrice02.val().replaceAll(",", ""));
			var tax = (($(obj).val() / ContPrice02Value)* 100).toFixed(2);
			ChargePer.val(tax);
		}
		
}