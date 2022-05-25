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
  //debugger;
  //공통영역
  // 체크박스, radio 등 공통 후처리
  postJobForDynamicCtrl();
  $("input[name=userDept]").val(getInfo("AppInfo.dpnm"));
  $("input[name=userName]").val(getInfo("AppInfo.usnm"));
  
  $("#Subject").css("height", "30px");

  //읽기 모드 일 경우
  if (getInfo("Request.templatemode") == "Read") {

      $('*[data-mode="writeOnly"]').each(function () {
          $(this).hide();
      });
     
      

  }
  else {
      $('*[data-mode="readOnly"]').each(function () {
          $(this).hide();
      });

      if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
      	document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
          document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);

          if (window.location.href.indexOf("RequestFormInstID") > -1) {
              getBiztripRequestDate();
          }
      }
      else {

      }
     
      
     
      
  }

  //setLabel과 setBodyContext 정리 후 상단으로 이동

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
          alert('제목을 입력하세요.');
          //SUBJECT.focus();
          return false;
      } else {
          return EASY.check().result;
      }
  }
}



function eventKey() {
  //***숫자만(콤마형식, 포커스시 콤마형식제거, 포커스아웃시 콤마형식
  $("input[gubun='numcomma']").css("ime-mode", "disabled").focus(function () {
      var n = $(this).val().replace(/,/gi, "");
      n = (n != "") ? parseInt(n, 10) + "" : "";
      $(this).val(n);
  }).keypress(function () {
      if (event.keyCode < 48 || event.keyCode > 57) { event.returnValue = false; }
  }).focusout(function () {
      eventKeyOut($(this), "numcomma");
  });
}

//function getBodyContext() {

//  //UpdateImageData(); //이미지 업로드
//  var sBodyContext = makeBodyContext();
//  return makeNode("BODY_CONTEXT", sBodyContext, null, false);
//}

//본문 XML로 구성
function makeBodyContext() {
	/*var sBodyContext = "";
  sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	
  var bodyContextObj = {};
	
	bodyContextObj["BodyContext"] = getFields("mField");
  
  return bodyContextObj;
}







function fn_c_sum_1() {
	var c_sum_1 = 0;
    var cost1 = parseInt($('#cost11').val() == "" ? 0 : $('#cost11').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost21').val() == "" ? 0 : $('#cost21').val().replace(/,/g, ""));
   
	c_sum_1 = cost1+cost2;
    $('#cost31').val(CnvtComma(c_sum_1));    
}

function fn_c_sum_2() {
	var c_sum_2 = 0;
    var cost1 = parseInt($('#cost12').val() == "" ? 0 : $('#cost12').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost22').val() == "" ? 0 : $('#cost22').val().replace(/,/g, ""));
   
	c_sum_2 = cost1+cost2;
    $('#cost32').val(CnvtComma(c_sum_2));    
}

function fn_c_sum_3() {
	var c_sum_3 = 0;
    var cost1 = parseInt($('#cost13').val() == "" ? 0 : $('#cost13').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost23').val() == "" ? 0 : $('#cost23').val().replace(/,/g, ""));
   
	c_sum_3 = cost1+cost2;
    $('#cost33').val(CnvtComma(c_sum_3)); 
    var cost3 = parseInt($('#cost34').val() == "" ? 0 : $('#cost34').val().replace(/,/g, ""));
    
    var c_sum_35 = c_sum_3 -cost3;
    
    $('#cost35').val(CnvtComma(c_sum_35))
    
}

function fn_set_add(){
	var cost1 = parseInt($('#cost14').val() == "" ? 0 : $('#cost14').val().replace(/,/g, ""));
	$('#cost24').val(CnvtComma(cost1));
	$('#cost34').val(CnvtComma(cost1)); 
	
	var cost2 = parseInt($('#cost33').val() == "" ? 0 : $('#cost33').val().replace(/,/g, ""));
	var cost3 = parseInt($('#cost34').val() == "" ? 0 : $('#cost34').val().replace(/,/g, "")); 
	
	var col_cal = 0;
	col_cal = cost2-cost3;
	
	$('#cost35').val(CnvtComma(col_cal));
}

function fn_cal_first(){
	console.log("fn_cal_first 실행 ");
	var cost1 = parseInt($('#cost13').val() == "" ? 0 : $('#cost13').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost14').val() == "" ? 0 : $('#cost14').val().replace(/,/g, ""));
	var cal_first =0;
	cal_first = cost1-cost2;
	$('#cost15').val(CnvtComma(cal_first));
	fn_cal_add();
}

function fn_cal_add(){
	console.log("fn_cal_add 실행 ");
	var cost1 = parseInt($('#cost15').val() == "" ? 0 : $('#cost15').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost23').val() == "" ? 0 : $('#cost23').val().replace(/,/g, ""));
	var cal_add =0;
	cal_add = cost1+cost2;
	$('#cost25').val(CnvtComma(cal_add));
}

function fn_cal_exat(){
	console.log("fn_cal_exat 실행 ");
	var cost1 = parseInt($('#cost34').val() == "" ? 0 : $('#cost34').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost35').val() == "" ? 0 : $('#cost35').val().replace(/,/g, ""));
	var cal_first =0;
	cal_exat = cost1-cost2;
	$('#cost35').val(CnvtComma(fn_cal_exat));
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




function calSDATEEDATE(obj) {
	var SDATE = $("#startDay").val().split('-');
    var EDATE = $("#closeDay").val().split('-');

    var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
    var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
    var tmpday = EOBJDATE - SOBJDATE;
    tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

    if (tmpday < 0) {
        
        Common.Warning("이전 일보다 전 입니다. 확인하여 주십시오.");
        $("#startDay").val("");
        $("#closeDay").val("");
    }
}