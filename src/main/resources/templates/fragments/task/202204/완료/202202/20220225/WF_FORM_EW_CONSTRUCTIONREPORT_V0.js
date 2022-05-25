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
    $("#Subject").css("height", "30px");
    $("#itemName21").val("생수");
    $("#itemName22").val("난방연료");
    $("#itemName23").val("지게차");
    $("#itemName24").val("폐기물");
    
    $("#unit21").val("L");
    $("#unit22").val("L");
    $("#unit23").val("hr");
    $("#unit24").val("대");
    

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        if (typeof formJson.BodyContext != 'undefined') {
            //멀티로우
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'R');
            
        }
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
        }
        
      //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO1 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO1', 'W', { minLength: 1 });
        }
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO2 != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 1 });
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
            

       
			if (formJson.Request.mode == "DRAFT" && formJson.Request.gloct == "") {
	            
				var today = new Date();
				$("#InitiatorDate").val(today.format("yyyy-MM-dd"));
	            
			} else {
				 if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
			            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
		        } else {
		            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 4 });
		        }
		        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO1 != null) {
		            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'W');
		        } else {
		            XFORM.multirow.load('', 'json', '#TBLINFO1', 'W', { minLength: 4 });
		        }
		        
		        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO2 != null) {
		            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'W');
		        } else {
		            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 4 });
		        }
			    
			}        
        }
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 4 });
            $("input[name=workComment1]").eq(1).val("금일작업내용");
        }
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO1), 'json', '#TBLINFO1', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO1', 'W', { minLength: 4 });
            $("input[name=workComment2]").eq(1).val("금일안전교육내용");
        }
        
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO2), 'json', '#TBLINFO2', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO2', 'W', { minLength: 4 });
            $("input[name=constructName3]").eq(1).val("용역");
            $("input[name=constructName3]").eq(2).val("직영");
            $("input[name=constructName3]").eq(3).val("직원(설계)");
            $("input[name=constructName3]").eq(4).val("직원(시공)");
            
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO1", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO2", "rField"));
	
	
    return bodyContextObj;
}

function calSDATEEDATE() {
    // 현재 객채(input) 에서 제일 가까이 있는 tr을 찾음
    //   var tmpObj = $(obj).closest("tr");
	
	// BaseCode 가져오는 방식 변경에 따라 소스 수정함.
	//var selectType = $$(oCodeList).find("CacheData").concat().has("[Code="+$(obj).parent().find("select").val()+"]").attr("Reserved3");
		
		if($("#Start_Date").val()!=""){
	        var SYDATE = $("input[id=Start_Date]").val().split('년 ');
	        var SMDATE = SYDATE[1].split('월 ');
	        var SDDATE = SMDATE[1].split('일');
		}
		if($("#End_Date").val()!=""){
	        var EYDATE = $("input[id=End_Date]").val().split('년 ');
	        var EMDATE = EYDATE[1].split('월 ');
	        var EDDATE = EMDATE[1].split('일');
		}
		if($("#Start_Date").val()!="" && $("#End_Date").val()!=""){
	        var SOBJDATE = new Date(parseInt(SYDATE[0], 10), parseInt(SMDATE[0], 10) - 1, parseInt(SDDATE[0], 10));
	        var EOBJDATE = new Date(parseInt(EYDATE[0], 10), parseInt(EMDATE[0], 10) - 1, parseInt(EDDATE[0], 10));
	        var tmpday = EOBJDATE - SOBJDATE;
	        tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);
	        
	        $("#Total_Day").val((tmpday+1));
		    EASY.triggerFormChanged();
		    if (tmpday < 0) {
		        alert("이전 일보다 전 입니다. 확인하여 주십시오.");
		        $(mobj).find("input[id=End_Date]").val("");
		        $(mobj).find("input[id=Total_Day]").val("");
		    }
		}
}

function fn_sum_todayTotal1() {
    var sum = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sum += parseInt($("input[name=todayTotal1]").eq(i + 1).val() == "" ? 0 :$("input[name=todayTotal1]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#todayTotalSum1').val(CnvtComma(sum));
    fn_sum_rowTotalSum1();
    
}

function fn_sum_todayUse1() {
    var sum = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sum += parseInt($("input[name=todayUse1]").eq(i + 1).val() == "" ? 0 :$("input[name=todayUse1]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#todayUseSum1').val(CnvtComma(sum));
    fn_sum_rowTotalSum1();
    
}

function fn_sum_rowTotalSum1() {
    var sum = 0;
    
    var cost1 = parseInt($('#todayTotalSum1').val() == "" ? 0 : $('#todayTotalSum1').val().replace(/,/g, ""));
	var cost2 = parseInt($('#todayUseSum1').val() == "" ? 0 : $('#todayUseSum1').val().replace(/,/g, ""));
	
	sum = cost1+cost2; 
   
    $('#rowTotalSum1').val(CnvtComma(sum));
    fn_Total1();
    fn_Total2();
    fn_Total3();
    
}


function fn_sum_todayTotal2() {
    var sum = 0;
    $('#TBLINFO1').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sum += parseInt($("input[name=todayTotal2]").eq(i + 1).val() == "" ? 0 :$("input[name=todayTotal2]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#todayTotalSum2').val(CnvtComma(sum));
    fn_sum_rowTotalSum2();
}

function fn_sum_todayUse2() {
    var sum = 0;
    $('#TBLINFO1').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sum += parseInt($("input[name=todayUse2]").eq(i + 1).val() == "" ? 0 :$("input[name=todayUse2]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#todayUseSum2').val(CnvtComma(sum));
    fn_sum_rowTotalSum2();
    
}

function fn_sum_rowTotalSum2() {
    var sum = 0;
    
    var cost1 = parseInt($('#todayTotalSum2').val() == "" ? 0 : $('#todayTotalSum2').val().replace(/,/g, ""));
	var cost2 = parseInt($('#todayUseSum2').val() == "" ? 0 : $('#todayUseSum2').val().replace(/,/g, ""));
	
	sum = cost1+cost2; 
   
    $('#rowTotalSum2').val(CnvtComma(sum));
    fn_Total1();
    fn_Total2();
    fn_Total3();
    
}


function fn_sum_todayTotal3() {
    var sum = 0;
    $('#TBLINFO2').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sum += parseInt($("input[name=todayTotal3]").eq(i + 1).val() == "" ? 0 :$("input[name=todayTotal3]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#todayTotalSum3').val(CnvtComma(sum));
    fn_sum_rowTotalSum3();
}

function fn_sum_todayUse3() {
    var sum = 0;
    $('#TBLINFO2').find(".multi-row").not(".pattern-skip").each(function (i) {
    	sum += parseInt($("input[name=todayUse3]").eq(i + 1).val() == "" ? 0 :$("input[name=todayUse3]").eq(i + 1).val().replace(/,/g, ""));
    });
   
    $('#todayUseSum3').val(CnvtComma(sum));
    fn_sum_rowTotalSum3();
    
}

function fn_sum_rowTotalSum3() {
    var sum = 0;
    
    var cost1 = parseInt($('#todayTotalSum3').val() == "" ? 0 : $('#todayTotalSum3').val().replace(/,/g, ""));
	var cost2 = parseInt($('#todayUseSum3').val() == "" ? 0 : $('#todayUseSum3').val().replace(/,/g, ""));
	
	sum = cost1+cost2; 
   
    $('#rowTotalSum3').val(CnvtComma(sum));
    fn_Total1();
    fn_Total2();
    fn_Total3();
    
}

function fn_Total1() {
	var cost1 = parseInt($('#todayTotalSum1').val() == "" ? 0 : $('#todayTotalSum1').val().replace(/,/g, ""));
	var cost2 = parseInt($('#todayTotalSum2').val() == "" ? 0 : $('#todayTotalSum2').val().replace(/,/g, ""));
	var cost3 = parseInt($('#todayTotalSum3').val() == "" ? 0 : $('#todayTotalSum3').val().replace(/,/g, ""));
	
	sum = cost1+cost2+cost3; 
	$('#todayTotalSum4').val(CnvtComma(sum));
}

function fn_Total2() {
	var cost1 = parseInt($('#todayUseSum1').val() == "" ? 0 : $('#todayUseSum1').val().replace(/,/g, ""));
	var cost2 = parseInt($('#todayUseSum2').val() == "" ? 0 : $('#todayUseSum2').val().replace(/,/g, ""));
	var cost3 = parseInt($('#todayUseSum3').val() == "" ? 0 : $('#todayUseSum3').val().replace(/,/g, ""));
	
	sum = cost1+cost2+cost3; 
	$('#todayUseSum4').val(CnvtComma(sum));
	
	
}

function fn_Total3() {
	var cost1 = parseInt($('#rowTotalSum1').val() == "" ? 0 : $('#rowTotalSum1').val().replace(/,/g, ""));
	var cost2 = parseInt($('#rowTotalSum2').val() == "" ? 0 : $('#rowTotalSum2').val().replace(/,/g, ""));
	var cost3 = parseInt($('#rowTotalSum3').val() == "" ? 0 : $('#rowTotalSum3').val().replace(/,/g, ""));
	
	sum = cost1+cost2+cost3; 
	$('#rowTotalSum4').val(CnvtComma(sum));
	
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

//콤마 붙은 문자 숫자로 변경
function toNum(obj){
	return Number($(obj).val().toString().replace(/\,/gi, ''));
}


function dtladdClick(){
	$('#btnDtlAdd').trigger('click'); 
}

function dtldelClick(){
	$('#btnDtlDelSel').trigger('click'); 
}