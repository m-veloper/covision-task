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
        
      //<!--loadMultiRow_Read 시작-->
        if (JSON.stringify(formJson.BodyContext) != "{}") {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.sumTable), 'json', '#sumTable', 'R');            
        } else {
            XFORM.multirow.load('', 'json', '#sumTable', 'R');
        }
        //<!--loadMultiRow_Read 끝-->

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
     
        //<!--loadMultiRow_Write 시작-->
        if (JSON.stringify(formJson.BodyContext) != "{}") {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.sumTable), 'json', '#sumTable', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#sumTable', 'W', { minLength: 5 });
        }
        //<!--loadMultiRow_Write 끝-->
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("sumTable", "rField")); // multi-row 설정
    return bodyContextObj;
}


// 손익계산
function COST_CAL() {
    var tblobj = $("#sumTable"); //멀티로우 TABLE ID
    
    var total = 0; // 투입합계
    var proLost = 0; // 손익(기성-투입)
    var bEmpty = false;
    var bProEmpty = false;
    
    for (i = 4 ; i < tblobj[0].rows.length; i++) {
    	
    	if(isEmptyStr($(tblobj[0].rows[i]).find('input[name=materialCost]').val()) && isEmptyStr($(tblobj[0].rows[i]).find('input[name=laborCost]').val()) 
    			&& isEmptyStr($(tblobj[0].rows[i]).find('input[name=eqCost]').val()) 
    			&& isEmptyStr($(tblobj[0].rows[i]).find('input[name=playCost]').val())
    		)  bEmpty = true;
    	
    	let materialCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=materialCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=materialCost]').val());
		let laborCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=laborCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=laborCost]').val());
		let eqCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=eqCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=eqCost]').val());
		let playCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=playCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=playCost]').val());
        
		let totalCost = materialCost + laborCost + eqCost + playCost;
		
		
		if(!bEmpty) {
			$(tblobj[0].rows[i]).find('input[name=totalCost]').val(totalCost); //투입비 합계
		}
		bEmpty = false;
		
		
		if(isEmptyStr($(tblobj[0].rows[i]).find('input[name=materialCost]').val()) && isEmptyStr($(tblobj[0].rows[i]).find('input[name=totalCost]').val()))  bProEmpty = true;
		
		let madeAmt = isEmptyStr($(tblobj[0].rows[i]).find('input[name=madeAmt]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=madeAmt]').val());
		
		let proLostCost = madeAmt - totalCost;
		
		if(!bProEmpty) {
			$(tblobj[0].rows[i]).find('input[name=proLostCost]').val(proLostCost); //손익
		}
		bProEmpty = false;
    }
    
    col_sum();
}

// 컬럼별 합계 계산
function col_sum() {
	var tblobj = $("#sumTable"); //멀티로우 TABLE ID
	
	var madeAmt_sum = 0; //기성금액
	var materialCost_sum = 0; //재료비
	var laborCost_sum = 0; //노무비
	var eqCost_sum = 0; // 장비비
	var playCost_sum = 0; //경비
	var totalCost_sum = 0; // 계
	var proLostCost_sum = 0; //손익
	
	for (i = 4 ; i < tblobj[0].rows.length; i++) {
		let madeAmt = isEmptyStr($(tblobj[0].rows[i]).find('input[name=madeAmt]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=madeAmt]').val());
		let materialCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=materialCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=materialCost]').val());
		let laborCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=laborCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=laborCost]').val());
		let eqCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=eqCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=eqCost]').val());
		let playCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=playCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=playCost]').val());
		let totalCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=totalCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=totalCost]').val());
		let proLostCost = isEmptyStr($(tblobj[0].rows[i]).find('input[name=proLostCost]').val()) ? 0 : parseFloat($(tblobj[0].rows[i]).find('input[name=proLostCost]').val());
		
		madeAmt_sum += madeAmt;
		materialCost_sum += materialCost;
		laborCost_sum += laborCost;
		eqCost_sum += eqCost;
		playCost_sum += playCost;
		totalCost_sum += totalCost;
		proLostCost_sum += proLostCost;
	}
	
	
	$("#sumMadeAmt").val(madeAmt_sum);
	$("#sumMaterialCost").val(materialCost_sum);
	$("#sumLaborCost").val(laborCost_sum);
	$("#sumEqCost").val(eqCost_sum);
	$("#sumPlayCost").val(playCost_sum);
	$("#sumTotalCost").val(totalCost_sum);
	$("#sumProLostCost").val(proLostCost_sum);
	
	
	//COST_CAL();
	
}



XFORM.multirow.event('afterRowAdded', function ($rows) { 
    //$rows => 추가된 행
    //~추가버튼 클릭시 실행할 함수를 여기에 기재~
	COST_CAL();
});


XFORM.multirow.event('afterRowRemoved', function ($rows) { 
    //~삭제버튼 클릭시 실행할 함수를 여기에 기재~
	COST_CAL();
}); 
