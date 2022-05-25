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
    
  //기안자 정보 바인딩
    $("input[name=UserCode]").val(Common.getSession("UR_Code"));
    $("input[name=CompanyCode]").val(Common.getSession("DN_Code"));
    $("input[name=UserName]").val(Common.getSession("UR_Name"));
    
    
    //날짜 바인딩
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    var date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    
    $("#ReqDate").val(year + "-" + month + "-" + date);

    // 읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });

        // 멀티로우 처리
        
        if (typeof formJson.BodyContext != 'undefined') {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.MULTI_TABLE), 'json', '#MULTI_TABLE', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#MULTI_TABLE', 'R');
        }
    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        // <!--AddWebEditor-->
        LoadEditor("divWebEditorContainer");

        // 멀티로우 처리
        if (typeof formJson.BodyContext != 'undefined') {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.MULTI_TABLE), 'json', '#MULTI_TABLE', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#MULTI_TABLE', 'W', { minLength: 1, maxLength: 10 });
        }

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
	
	// 멀티로우 있을 때
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("MULTI_TABLE", "rField"));
	
    return bodyContextObj;
}


function checkValue(obj){
	var index = $(obj).index() - 1;
	var GoodsFax = $("input[name='GoodsFax']").eq(index);
	console.log('input[name=GoodsFax' + GoodsFax );
	//GoodsFax = GoodsFax || 0; 
	
	if(GoodsFax.val() == '' || GoodsFax.val() == ' ') {
		GoodsFax.val(0);
	}
	EASY.triggerFormChanged();//합계가 안되었을 때 새로고침
}

//합산 함수
function addSum(){
	var price = 0;
	var price01 = 0;
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	var GoodsFax = document.getElementsByName("GoodsFax");
	var GoodsPrice02 = document.getElementsByName("GoodsPrice02");
	
	for(var i=1; i < GoodsFax.length; i++){
		if(GoodsFax[i].value == ""){
			price += 0;
		}else {
			price += parseInt(GoodsFax[i].value.replaceAll(",", ""));
		}
	}
	for(var i=1; i < GoodsPrice02.length; i++){
		if(GoodsPrice02[i].value == ""){
			price01 += 0;
		}else {
			price01 += parseInt(GoodsPrice02[i].value.replaceAll(",", ""));
		}
	}
	//합계 테이블에 입력
	var priceStr = price.toString().replace(regexp, ',');
	var priceStr01 = price01.toString().replace(regexp, ',');
	document.getElementById("Total02").value = priceStr;
	document.getElementById("Total01").value = priceStr01;
}