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
        
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        }
        
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
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
        }
        //<!--loadMultiRow_Write-->
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
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
        // 필수 입력 필드 체크
    	if (document.getElementById("Subject").value == '') {
            Common.Warning('제목을 입력하세요.');
            //SUBJECT.focus();
            return false;
        }
        return EASY.check().result;
    }
}

// 직접 원가계 계산
function calDirect() {
	
	var sumDirect = 0; // 직접원가계 총액
	var salePrice = 1; // 매출액 
	var laborCost = 0; // 인건비
	// 매출액 
	if( $('#SALES_PRICE').val() ) {
		salePrice = parseInt( $('#SALES_PRICE').val() );
	}
	// 외주비 
	if( $('#OUT_SOURCING').val() ) {
		sumDirect += parseInt(  $('#OUT_SOURCING').val() );
	}
	// 인건비
	if( $('#LABOR_COST').val() ) {
		sumDirect +=  parseInt(  $('#LABOR_COST').val() );
		// 인건비 실행율
		laborCost = parseInt( $('#LABOR_COST').val() );
		$('#LABOR_PERCENT').val( ((laborCost/salePrice) * 100).toFixed(2) );
	}
	// 직접 경비 총액 구하기
	// 소계 실행율 계산위해 직접경비 금액 따로 더함 
	var sumSubTotalCost = 0;
	var directLength = document.getElementsByClassName('DIRECT_COST').length;
	
	for(var i=0; i<directLength; i++){
		if(  $('.DIRECT_COST').eq(i).val() ){
			console.log( $('.DIRECT_COST').eq(i).val()  );
			sumDirect += parseInt( $('.DIRECT_COST').eq(i).val() );
			sumSubTotalCost += parseInt( $('.DIRECT_COST').eq(i).val() );
		}
	}
	
	// 직접 원가계
	$('#DIRECT_TOTAL_PRICE').val(sumDirect);
	// 소계 실행율 계산
	$('#SUBTOTAL_PERCENT').val( ((sumSubTotalCost/salePrice) * 100).toFixed(2) );
	
}

// 직접 원가계 실행율 계산
function calOutSourcingPercent() {
	if( $('#OUT_SOURCING').val() ) {
		//외주비 실행율
		var cal = (parseInt( $('#OUT_SOURCING').val() ) / parseInt( $('#SALES_PRICE').val() ))*100 ;
		$('#OUT_SOURCING_PERCENT').val(cal.toFixed(2));
	}
	// 영업이익 계산
	var sumSaleProfit = 0;
	if( $('#SALES_PRICE').val() && !$('#EXE_BUDGET').val() ) {
		$('#SALES_PROFIT').val( $('#SALES_PRICE').val() ); 
	}
	
	if( $('#SALES_PRICE').val() && $('#EXE_BUDGET').val() ) {
		 sumSaleProfit = parseInt($('#SALES_PRICE').val()) -  parseInt($('#EXE_BUDGET').val());
		 $('#SALES_PROFIT').val(sumSaleProfit);
	}
	
}

// 부서 관리비 실행율 계산
function calDeptPercent() {
	if( $('#SALES_PRICE').val() ) {
		// 부서 관리비 실행율
		var cal = (parseInt( $('#DEPARTMENT_CARE').val() ) / parseInt( $('#SALES_PRICE').val() ) )*100 ;
		$('#DEPARTMENT_CARE_PERCENT').val(cal.toFixed(2));
	}
}

// 일반 관리비 실행율 계산
function calGeneralPercent() {
	if( $('#SALES_PRICE').val() ) {
		var cal = (parseInt( $('#GENERAL_CARE').val() ) / parseInt( $('#SALES_PRICE').val() ) )*100 ;
		$('#GENERAL_CARE_PERCENT').val( cal.toFixed(2) );
	}
}

// 직접 경비 실행율 계산 (매출 액 변경 시 )
function calPercentDirect() {
	
	// 매출액 값 변경시 직접경비 실행률 변경해주기
	var directLength =document.getElementsByClassName('DIRECT_COST').length;
	for(var i=0; i<directLength; i++){
		if(  $('.DIRECT_COST').eq(i).val() ){
			 $('.DIRECT_COST_PERCENT').eq(i).val( (parseInt ($('.DIRECT_COST').eq(i).val()) / parseInt( $('#SALES_PRICE').val() )*100).toFixed(2));
		}
	}
	// 매출액 값 변경 시 인건비 실행율 재 계산
	if(  $('#LABOR_COST').val() ) {
		$('#LABOR_PERCENT').val((( parseInt($('#LABOR_COST').val()) / parseInt( $('#SALES_PRICE').val()))*100).toFixed(2) );
	}
	// 매출액 값 변경 시 외주비 실행율 재 계산
	if( $('#OUT_SOURCING').val() ) {
		$('#OUT_SOURCING_PERCENT').val((( parseInt($('#OUT_SOURCING').val()) / parseInt( $('#SALES_PRICE').val()))*100).toFixed(2) );
	}
	// 매출액 값 변경 시 직접원가계 실행율 재 계산
	if( $('#DIRECT_TOTAL_PRICE').val() ) {
		$('#DIRECT_TOTAL_PERCENT').val((( parseInt($('#DIRECT_TOTAL_PRICE').val()) / parseInt( $('#SALES_PRICE').val()))*100).toFixed(2) );
	}
	// 매출액 값 변경 시 부서관리비 실행율 재 계산
	if( $('#DEPARTMENT_CARE').val() ) {
		$('#DEPARTMENT_CARE_PERCENT').val((( parseInt($('#DEPARTMENT_CARE').val()) / parseInt( $('#SALES_PRICE').val()))*100).toFixed(2) );
	}
	// 매출액 값 변경 시 일반관리비 실행율 재 계산
	if( $('#GENERAL_CARE').val() ) {
		$('#GENERAL_CARE_PERCENT').val((( parseInt($('#GENERAL_CARE').val()) / parseInt( $('#SALES_PRICE').val()))*100).toFixed(2) );
	}
	
}

// 영업이익 계산
function calSaleProfit() {
	var sumSaleProfit = 0;
	if( $('#SALES_PRICE').val() && !$('#EXE_BUDGET').val() ) {
		$('#SALES_PROFIT').val( $('#SALES_PRICE').val() ); 
	}
	
	if( $('#SALES_PRICE').val() && $('#EXE_BUDGET').val() ) {
		sumSaleProfit = parseInt($('#SALES_PRICE').val()) -  parseInt($('#EXE_BUDGET').val());
		 $('#SALES_PROFIT').val(sumSaleProfit);
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
    return bodyContextObj;
}

function fn_a_sum_1() {
    var a_sum_1 = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_1 += parseInt($("input[name=cost1]").eq(i + 1).val() == "" ? 0 :$("input[name=cost1]").eq(i + 1).val().replace(/,/g, ""));
    		
    });
   
    $('#a_sum_1').val(a_sum_1);
    fn_a_sum_3();
}

function fn_a_sum_2() {
    var a_sum_2 = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_2 += parseInt($("input[name=cost2]").eq(i + 1).val() == "" ? 0 :$("input[name=cost2]").eq(i + 1).val().replace(/,/g, ""));
    	  	
    });
   
    $('#a_sum_2').val(a_sum_2);
    fn_a_sum_3();
}

function fn_a_sum_3() {
    var a_sum_3 = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_3 += parseFloat($("input[name=cost3]").eq(i + 1).val() == "" ? 0 :$("input[name=cost3]").eq(i + 1).val().replace(/,/g, ""));
    	
    });
   
    $('#a_sum_3').val(a_sum_3);
}

