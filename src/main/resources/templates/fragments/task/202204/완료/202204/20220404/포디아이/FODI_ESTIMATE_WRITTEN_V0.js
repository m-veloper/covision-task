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
        
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.supTbl), 'json', '#supTbl', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.supTermTbl), 'json', '#supTermTbl', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.staTbl), 'json', '#staTbl', 'R');
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
            
            $('#Subject').val(getInfo('FormInfo.FormName').split(";")[0]);
        }
     
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.supTbl), 'json', '#supTbl', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.supTermTbl), 'json', '#supTermTbl', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.staTbl), 'json', '#staTbl', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#supTbl', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#supTermTbl', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#staTbl', 'W', { minLength: 1 });
        }
        
        setCompanyInfo();
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("supTbl", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("supTermTbl", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("staTbl", "rField"));
	
    return bodyContextObj;
}

function toNum(obj){
	return Number(obj.replace(/\,/gi, ''));
}

//20220404 삭제시 자동계산 로직 추가
XFORM.multirow.event('afterRowRemoved', function ($rows) { 
	setTotPrice();
}); 


function setCompanyInfo(){
	console.log("setCompanyInfo()");
	code = $("#comName option:selected").val();
	
	if(code == "shinwon1"){
		$("#comNum").val("114-86-72995");
		$("#status").val("도소매");
		$("#industry").val("가전제품 ,전자제품");
		$("#place").val("서울특별시 구로구 디지털로 272, 한신it타워 707호");
        $("#contract").val("02-537-4700");
        $("#faxnum").val("02-537-3166");
	}else if(code  == "shinwon2"){
		$("#comNum").val("610-86-35445");
		$("#status").val("도매 및 소매업");
		$("#industry").val("핸드폰 ,디지털기기, 전자제품");
		$("#place").val("서울특별시 구로구 디지털로 272, 한신it타워 706호");
        $("#contract").val("02-861-3300");
        $("#faxnum").val("02-537-3166");
	}
/*    else if(code == "shinwon3"){
		$("#comNum").val(3);
		$("#status").val(3);
		$("#industry").val(3);
		$("#place").val(3);
	}else if(code == "shinwon4"){
		$("#comNum").val(4);
		$("#status").val(4);
		$("#industry").val(4);
		$("#place").val(4);
	}*/
}
/* 20220404 합계 계산로직 변경*/
function setPrice(obj){
	price = $(obj).closest("tr").find("input[name=price]").val();
	
	if(price != '' ){
		price = toNum(price) ;
		
		cost = parseFloat(Math.floor(price/11*10) ); // 공급가액
		vat = parseFloat(Math.ceil(price/11*1) );  //세액
		
		
		$(obj).closest("tr").find("input[name=cost]").val(cost);
		$(obj).closest("tr").find("input[name=vat]").val(vat);
		
		total = 0;
		$(".rprice").each(function(i, v){
			total += toNum($(v).val());
		});
		
		$("#total").val(total);
		EASY.formatter($(obj).closest("tr").find("input[name=price]"));
		EASY.formatter($("#total"));
	}
}
/* 20220404 기존 가격 합계 계산로직
function setPrice(obj){
	count = $(obj).closest("tr").find("input[name=count]").val();
	cost = $(obj).closest("tr").find("input[name=cost]").val();
	
	if(count != '' && cost != ''){
		price = toNum(count) * toNum(cost);
		$(obj).closest("tr").find("input[name=price]").val(price);
		
		total = 0;
		$(".rprice").each(function(i, v){
			total += toNum($(v).val());
		});
		
		$("#total").val(total);
		EASY.formatter($(obj).closest("tr").find("input[name=price]"));
		EASY.formatter($("#total"));
	}
}*/

//20220404 삭제시 자동계산 로직 추가
function setTotPrice(){
	total = 0;
	$(".rprice").each(function(i, v){
		total += toNum($(v).val());
	});
	
	$("#total").val(total);
	EASY.formatter($(obj).closest("tr").find("input[name=price]"));
	EASY.formatter($("#total"));
}