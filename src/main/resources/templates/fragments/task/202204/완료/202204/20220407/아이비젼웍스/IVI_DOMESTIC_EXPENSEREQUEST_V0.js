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
    
    $("input[name=multi_button1]").val("+추가");
    $("input[name=multi_button2]").val("-삭제");
   
    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        //<!--loadMultiRow_Read-->
        //console.log(formJson.BodyContext);
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
			XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info_top), 'json', '#tbl_info_top', 'R', {enableSubMultirow: true});
			if(formJson.BodyContext.tbl_info_top.length != undefined){
				for(var i = 0; i < formJson.BodyContext.tbl_info_top.length; i++){
					if(formJson.BodyContext.tbl_info_top[i].tbl_info != undefined)
						XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info_top[i].tbl_info), 'json', document.getElementsByName("tbl_info")[i+1], 'R');
				}					
			}else{
				XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info_top.tbl_info), 'json', document.getElementsByName("tbl_info")[1], 'R');
			}
      }
    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        //<!--AddWebEditor-->
        //console.log(formJson.BodyContext);
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
        	
        	

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
     
        //<!--loadMultiRow_Write-->
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info_top), 'json', '#tbl_info_top', 'W');            
            
  			if(formJson.BodyContext.tbl_info_top.length != undefined){
  				for(var i = 0; i < formJson.BodyContext.tbl_info_top.length; i++)
  					XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info_top[i].tbl_info), 'json', document.getElementsByName("tbl_info")[i+1], 'W');
  			}else{
  				XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tbl_info_top.tbl_info), 'json', document.getElementsByName("tbl_info")[1], 'W');
  			}
        } else {
            XFORM.multirow.load('', 'json', '#tbl_info_top', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', document.getElementsByName("tbl_info"), 'W', { minLength: 1 });
            //XFORM.multirow.load('', 'json', document.getElementsByName("tbl_info"), 'W', { minLength: 1 });
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
	    

    var bodyContextObj = {};
	
	// 에디터가 없을 떄
	bodyContextObj["BodyContext"] = getFields("mField");
	
	// 멀티로우 있을 때	
	$$(bodyContextObj["BodyContext"]).append(getDoubleMultiRowFields("tbl_info_top", "tbl_info", "rField"));
	
	
    return bodyContextObj;
}


//중첩 멀티로우 테이블
function getDoubleMultiRowFields(objName, subName, Fields) {
	var $$_sText = $$({});
  $$_sText = getMultiRowFieldsNotChildren(objName, Fields);
  var multirowTmplCnt = $$_sText[objName].length;
	
  if(multirowTmplCnt > 0){
  	for(var iTblSeq = 1; iTblSeq <= multirowTmplCnt; iTblSeq++){
  		$$_sText[objName][iTblSeq-1][subName] = getMultiRowFieldsForName(objName, subName, iTblSeq, Fields)[subName];
  	}
  }else if(multirowTmplCnt == undefined){
  	$$_sText[objName][subName] = getMultiRowFieldsForName(objName, subName, 1, Fields)[subName];
  }
	return $$_sText;
}

function getMultiRowFieldsNotChildren(objName, Fields){
	var $$_sText = $$({});
  var $rows;
  var iRowSeq = 0;
  if (Fields == null) Fields = "rField";
  //template가 복수인 경우
  var $table = $("#" + objName);
  var multirowTmplCnt = $table.find('.multi-row-template').not('.multi-row-children').length;
  var parentTmplCnt = $table.find("[class*=multi-row-template][class*=multi-row-parent]").length;
  multirowTmplCnt = multirowTmplCnt - parentTmplCnt;
//  ($table.find('.multi-row-template').not('.multi-row-children').length == undefined) ? 0 : $table.find('.multi-row-template').not('.multi-row-children').length;
  
  //:nth-child(3n+1)
//  if (multirowTmplCnt == 1) {
  	multirowTmplCnt = multirowTmplCnt + parentTmplCnt;
      $rows = $table.find('.multi-row').not('.multi-row-children');
      $.each($rows, function () {//
          ++iRowSeq;
          var $row = $(this);
          $$_sText.append(objName,makeMultiRowXml($row, Fields, iRowSeq.toString()));
      });

  return $$_sText.json();
}

function getMultiRowFieldsForName(parentId, objName, TblSeq, Fields) {
  var $$_sText = $$({});
  var $rows;
  var iRowSeq = 0;
  if (Fields == null) Fields = "rField";
  //template가 복수인 경우
  var $table = $("#" + parentId).find("table[class*=multi-row-table][name=" + objName + "]").eq(TblSeq);
  var multirowTmplCnt =  $table.find(".multi-row-template").length;

  //:nth-child(3n+1)
  if (multirowTmplCnt == 1) {
      $rows = $table.find('.multi-row');
      $.each($rows, function () {//
          ++iRowSeq;
          var $row = $(this);
          $$_sText.append(objName,makeMultiRowXml($row, Fields, iRowSeq.toString()));
      });
  } else { //multi-template
      $rows = $table.find('.multi-row').nth(multirowTmplCnt + 'n');
      $.each($rows, function () {//
          ++iRowSeq;
          var $row = $(this);
          var rows = $row.nextAll().andSelf().slice(0, multirowTmplCnt);
          $$_sText.append(objName,makeMultiRowXml(rows, Fields, iRowSeq.toString()));
      });
  }

  return $$_sText.json();
}

function calTotDays(obj) {
	
	var objtr = $(obj).closest("tr");
	if($(objtr).find("input[name=SDate]").val() != "" && $(objtr).find("input[name=EDate]").val() != ""){
		var sDate = parseInt($(objtr).find("input[name=SDate]").val().replace(/[^0-9]/g, ''));
		var eDate = parseInt($(objtr).find("input[name=EDate]").val().replace(/[^0-9]/g, ''));
		
		var subDate = eDate - sDate;
		
		$(objtr).find("input[name=TotDays]").val(subDate+1);
		EASY.triggerFormChanged();
		
        if(subDate < 0){ // 시작일 > 종료일
        	alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        	$(objtr).find("input[name=SDate]").val("");
        	$(objtr).find("input[name=EDate]").val("");
        	$(objtr).find("input[name=TotDays]").val("");
        }
	}
}


function fn_a_sum(obj) {
	
	var objtr = $(obj).closest("tr");
    
	cost = $(objtr).closest("tr").find("input[name=cost]").val();
	
	if(cost != '' ){
		cost = toNum(cost) ;
		total = 0;
		$(objtr).parent().parent().find(".rprice").each(function(i, v){
			total += toNum($(v).val());
		});
		
		$(objtr).parent().parent().parent().find("input[name=a_sum_1]").val(CnvtComma(total));		
	}
	
	
	fn_tot();
}

function fn_tot(){
		
	total = 0;
	$(".rprice").each(function(i, v){
		total += toNum($(v).val());
	});
	//console.log(total);	
	$("#calTotal").val(CnvtComma(total));
}
function toNum(obj){
	return Number(obj.replace(/\,/gi, ''));
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
XFORM.multirow.event('afterRowRemoved', function () { 	
	var table = $("#tbl_info_top table");
    table.each(function(  ){
    	var total =0;
   		$(this).find(".rprice").each(function(i, v){
	   			total += toNum($(v).val());   			
	   			var objtr = $(this).closest("tr");
	   			$(objtr).parent().parent().parent().find("input[name=a_sum_1]").val(CnvtComma(total));
	   		});
		});
	fn_tot();
	
}); 
function delRow(){
	
	lenMain = $("table[name=tbl_info]").length;
	lenSub = $("input[name=BizArea]").length;
	
	if(lenMain > 2){
		$("table[name=tbl_info]").eq(lenMain-1).parent().remove();
	}
	if(lenSub > 2){
		$("input[name=BizArea]").eq(lenSub-1).closest("tr").remove();
	}
	
	//len = $("#planTbl .tbody tr").length
	//if(len > 1)	$("#planTbl .tbody tr").eq(len-2).remove();
}
