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

    $("#docNumber").val($("#DocNo").val());
    
    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl2), 'json', '#ItemTbl2', 'R');
        }
	//하단 첨부파일 영역 안 보이게
        $("#tbLinkInfo").css("display","none");
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
     
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl2), 'json', '#ItemTbl2', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#ItemTbl', 'W', { minLength: 20 });
            XFORM.multirow.load('', 'json', '#ItemTbl2', 'W', { minLength: 20 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("ItemTbl", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("ItemTbl2", "rField"));
    return bodyContextObj;
}

function clickItem(){
	$("#itemAdd").click();
}
function clickDelItem(){
	$("#itemDel").click();
}

function setCopyReqNum(obj){
	reqNum = $(obj).closest("tr").find("input[name=reqNum]").val();
	nowRow = $("input[name=reqNum]").index(obj);
	
	$("input[name=reqNum2]").eq(nowRow).val(reqNum);
}

function setCopyItem(obj){
	item = $(obj).closest("tr").find("input[name=item]").val();
	nowRow = $("input[name=item]").index(obj);
	
	$("input[name=item2]").eq(nowRow).val(item);
}

function setCopyVol(obj){
	Vol = $(obj).closest("tr").find("input[name=Vol]").val();
	nowRow = $("input[name=Vol]").index(obj);
	
	
	$("input[name=Vol2]").eq(nowRow).val(Vol);
}

function setCopyQty(obj){
	qty = $(obj).closest("tr").find("input[name=qty]").val();
	subtotal = $(obj).closest("tr").find("input[name=subtotal]").val();
	nowRow = $("input[name=qty]").index(obj);
	
	$("input[name=qty2]").eq(nowRow).val(qty);
	$("input[name=subtotal2]").eq(nowRow).val(subtotal);
}

function setCopyUnitPrice(obj){
	unitprice = $(obj).closest("tr").find("input[name=unitprice]").val();
	subtotal = $(obj).closest("tr").find("input[name=subtotal]").val();
	nowRow = $("input[name=unitprice]").index(obj);
	
	
	$("input[name=unitpirce2]").eq(nowRow).val(unitprice);
	$("input[name=subtotal2]").eq(nowRow).val(subtotal);
}

function setCopysubtotal(obj){
	subtotal = $(obj).closest("tr").find("input[name=subtotal]").val();
	
	
	nowRow = $("input[name=subtotal]").index(obj);
	

	
	$("input[name=subtotal2]").eq(nowRow).val(subtotal);
}
function setCopyTotal(obj){
	$("#total2").val($("#total").val());
}

function CopyEtc(){
	$("#etcArea2").val($("#etcArea").val());
}



function fn_sum() {
    var price = 0;
    $('#ItemTbl').find(".multi-row").not(".pattern-skip").each(function (i) {
        price += parseInt($("input[name=subtotal]").eq(i + 1).val() == "" ? 0 :$("input[name=subtotal]").eq(i + 1).val().replace(/,/g, "").substring(1));
    });
    $('#total').val($("input[name=unitprice]").eq(1).val().substring(0, 1) + CnvtComma(price));
    
    $("#total2").val($("input[name=unitprice]").eq(1).val().substring(0, 1) + CnvtComma(price));
}

function fn_sum_qty() {
    var sumQty = 0;
    $('#ItemTbl').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sumQty += parseInt($("input[name=qty]").eq(i + 1).val() == "" ? 0 :$("input[name=qty]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#Voltotal').val(sumQty);
    fn_sum();
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