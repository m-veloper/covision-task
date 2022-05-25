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


//multi-row 합계 function
function COST_CAL() {
    var tblobj = document.getElementById("sumTable"); //멀티로우 TABLE ID
    var cost_sum = 0;
    var tex_sum = 0;
    
    for (i = 3 ; i < tblobj.rows.length; i++) {
        //var cost = $(tblobj.rows[i]).find("input[name=amnt]").val() * $(tblobj.rows[i]).find("input[name=unit]").val()//수량 * 단가 = 금액
        //$(tblobj.rows[i]).find("input[name=cost]").val(cost); //수량 * 단가 = 금액
        
        // 부가세 별도 표시시 추가해야됨
        // $(tblobj.rows[i]).find("input[name=TAX]").val(parseFloat(cost * 0.1));
    	
    	// 비어있는 필드는 NaN으로 간주하기 때문에 number체크 해줘야됨
    	if(!isNaN(parseFloat($(tblobj.rows[i]).find("input[name=cost]").val()))) {
    		cost_sum += parseFloat($(tblobj.rows[i]).find("input[name=cost]").val());
    	}
        //tex_sum += parseFloat($(tblobj.rows[i]).find("input[name=TAX]").val());
    }
    $("#totalCost").val(cost_sum);
    
    if(!isNaN(cost_sum)){
    	//합계금액 숫자 => 한글
        NumToHangul();
    }
    //$("#TOTAL_TAX").val(tex_sum);
}

//합계금액 숫자 => 한글 function
function NumToHangul() {
	
    var isMinus = false;
    var chknum ="";
    
    chknum =$('#totalCost').val();

    val = chknum;
    console.log("val" + val);
    var won = new Array();
    re = /^[1-9][0-9]*$/;
    num = val.toString().split(',').join('');
    
    console.log("num" + num);
    if (!re.test(num)) {
        return '0';
    }
    else {
        var price_unit0 = new Array('', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구');
        var price_unit1 = new Array('', '십', '백', '천');
        var price_unit2 = new Array('', '만', '억', '조', '경', '해', '시', '양', '구', '간', '정');
        for (i = num.length - 1; i >= 0; i--) {
            won[i] = price_unit0[num.substr(num.length - 1 - i, 1)];
            if (i > 0 && won[i] != '') {
                won[i] += price_unit1[i % 4];
            }
            if (i % 4 == 0) {
                won[i] += price_unit2[(i / 4)];
            }
        }
        for (i = num.length - 1; i >= 0; i--) {
            if (won[i].length == 2) won[i - i % 4] += '-';
            if (won[i].length == 1 && i > 0) won[i] = '';
            if (i % 4 != 0) won[i] = won[i].replace('일', '');
        }

        won = won.reverse().join('').replace(/-+/g, '');

        if (won.toString().substr(0, 1) == '십') {
            won = '일' + won;
        }

        if (isMinus){
        	 $("#amtToHangul").val("일금" + "-" + won+"원정 ");
        }else{
        	 $("#amtToHangul").val("일금" + won+"원정");
        }
        
        $("#amtToNumber").val($('#totalCost').val());
    }
}


// 행추가 후 이벤트
XFORM.multirow.event('afterRowAdded', function ($rows) { 
    //$rows => 추가된 행
    //~추가버튼 클릭시 실행할 함수를 여기에 기재~
	COST_CAL();
});

// 행삭제 후 이벤트
XFORM.multirow.event('afterRowRemoved', function ($rows) { 
    //~삭제버튼 클릭시 실행할 함수를 여기에 기재~
	COST_CAL();
}); 
