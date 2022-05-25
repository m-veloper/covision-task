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
    
    $("#eachPrice").val("0");
    
    XFORM.multirow.event('afterRowAdded', function ($rows) { 
     
    	console.log("행추가:"+$rows.attr("class"));
    });

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl1), 'json', '#personTbl1', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl2), 'json', '#personTbl2', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl3), 'json', '#personTbl3', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl4), 'json', '#personTbl4', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl5), 'json', '#personTbl5', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.carTbl), 'json', '#carTbl', 'R');
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
            
            $('#writer').val(m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false));
        }
     
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl1), 'json', '#personTbl1', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl2), 'json', '#personTbl2', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl3), 'json', '#personTbl3', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl4), 'json', '#personTbl4', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.personTbl5), 'json', '#personTbl5', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.carTbl), 'json', '#carTbl', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#personTbl1', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#personTbl2', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#personTbl3', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#personTbl4', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#personTbl5', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#carTbl', 'W', { minLength: 1 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("personTbl1", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("personTbl2", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("personTbl3", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("personTbl4", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("personTbl5", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("carTbl", "rField"));
    return bodyContextObj;
}

function ChangeOil(obj){	
    	if($(obj).val() == "1"){
    		$("#fuelEfficiency").val("10.8");
    	}else if($(obj).val() == "2"){
    		$("#fuelEfficiency").val("12.1");
    	}else if($(obj).val() == "3"){
    		$("#fuelEfficiency").val("8");
    	}else{
    		$("#fuelEfficiency").val("");    		
    	}
    	$("input[name=carFee1]").val( $("#fuelEfficiency").val());
    	$("input[name=carFee2]").val( $("#eachPrice").val()  );
    	
    	
    	fn_sum();
    	
}
function ChangeAvgOil(obj){	
	$("input[name=carFee1]").val( $("#fuelEfficiency").val());
	$("input[name=carFee2]").val( $("#eachPrice").val()  );
	
	fn_sum();
	
}

function fn_sum() {
    var price = 0;
    $('#carTbl').find(".multi-row").not(".pattern-skip").each(function (i) {
        price += parseInt($("input[name=carprice]").eq(i + 1).val() == "" ? 0 :$("input[name=carprice]").eq(i + 1).val().replace(/,/g, ""));
    });
    //$('#carTotal').val($("input[name=unitprice]").eq(1).val().substring(0, 1) + CnvtComma(price));
    
    $('#carTotal').val(CnvtComma(price));
}


/************************************************************************
함수명		: CnvtComma
작성목적	: 빠져나갈때 포맷주기(123456 => 123,456)
*************************************************************************/
function CnvtComma(num) {
    try {
        var ns = num.toString();
        var dp;

        if (isNaN(ns))
            return "";

        dp = ns.search(/\./);

        if (dp < 0) dp = ns.length;

        dp -= 3;

        while (dp > 0) {
            ns = ns.substr(0, dp) + "," + ns.substr(dp);
            dp -= 3;
        }
        return ns;
    }
    catch (ex) {
    }
}
XFORM.multirow.event('afterRowRemoved', function ($rows) { 
	fn_sum();
}); 
