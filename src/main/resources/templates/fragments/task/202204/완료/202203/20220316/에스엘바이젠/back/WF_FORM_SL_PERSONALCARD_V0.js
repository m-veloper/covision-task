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



//수량, 단가에 따른 금액 계산
function fn_sum_test(pObj) {
    var m_index = $("input[name='" + pObj.name + "']").index(pObj);
    
    //$(obj).closest("tr").find("input[name=UserName]").val();
    
    //var carkmDistance = parseFloat($("input[name='carkm']").eq(m_index).val());
    //var carFee1Price = parseFloat($("input[name='carFee1']").eq(m_index).val());
    //var carFee2Price = parseFloat($("input[name='carFee2']").eq(m_index).val());
    //var carTollPrice = parseFloat($("input[name='carToll']").eq(m_index).val());
    
    var carkmDistance = parseFloat($(pObj).closest("tr").find("input[name=carkm]").val() == "" ? 0 :$(pObj).closest("tr").find("input[name=carkm]").val());
    var carFee1Price = parseFloat($(pObj).closest("tr").find("input[name=carFee1]").val() == "" ? 0 :$(pObj).closest("tr").find("input[name=carFee1]").val());
    var carFee2Price = parseFloat($(pObj).closest("tr").find("input[name=carFee2]").val() == "" ? 0 :$(pObj).closest("tr").find("input[name=carFee2]").val());
    var carTollPrice = parseFloat($(pObj).closest("tr").find("input[name=carToll]").val() == "" ? 0 :$(pObj).closest("tr").find("input[name=carToll]").val());
    
    
   var totalPrice= Math.ceil(carkmDistance/carFee1Price*carFee2Price+carTollPrice);
    
    console.log("carkmDistance" + carkmDistance);
    console.log("carFee1Price" + carFee1Price);
    console.log("carFee2Price" + carFee2Price);
    console.log("carTollPrice" + carTollPrice);
    console.log("totalPrice" + totalPrice);
    
    
    $(pObj).closest("tr").find("input[name=carprice]").val(totalPrice);
   //($("input[name='carprice']").eq(m_index).val(totalPrice));
   
   
   fn_sum();
    
    /*
    var currentRowPrice = parseInt($("input[name='REQ_PRICE']").eq(m_index).val()) * parseInt($("input[name='REQ_EA']").eq(m_index).val());
    var totalPrice = 0;
    
    $("input[name='REQ_TOTAL']").eq(m_index).val(currentRowPrice);
    
    $('#TBLINFO').find(".multi-row").find("input[name='REQ_TOTAL']").each(function (i, obj) {
    	totalPrice += parseInt($(obj).val() == "" ? 0 :$(obj).val());
    });
    
    $('#REQ_TOTALPRICE').val(totalPrice);*/
}