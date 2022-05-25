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

      if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
      	document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
          document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);

          if (window.location.href.indexOf("RequestFormInstID") > -1) {
              getBiztripRequestDate();
          }
      }
      else {

      }
      if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
          XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
      } else {
          XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
  
  return bodyContextObj;
}





function fn_a_sum_1() {
    var a_sum_1 = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_1 += parseInt($("input[name=cost1]").eq(i + 1).val() == "" ? 0 :$("input[name=cost1]").eq(i + 1).val().replace(/,/g, ""));
    		
    });
   
    $('#a_sum_1').val(CnvtComma(a_sum_1));
    fn_a_sum_2();
    fn_a_sum_3();
    fn_a_sum_4();
    fn_a_sub();
}

function fn_a_sum_2() {
    var a_sum_2 = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_2 += parseInt($("input[name=cost2]").eq(i + 1).val() == "" ? 0 :$("input[name=cost2]").eq(i + 1).val().replace(/,/g, ""));
    	  	
    });
   
    $('#a_sum_2').val(CnvtComma(a_sum_2));
}

function fn_a_sum_3() {
    var a_sum_3 = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
    	a_sum_3 += parseInt($("input[name=cost3]").eq(i + 1).val() == "" ? 0 :$("input[name=cost3]").eq(i + 1).val().replace(/,/g, ""));
    	
    });
   
    $('#a_sum_3').val(CnvtComma(a_sum_3));
    $('#cost6').val(CnvtComma(a_sum_3));
    
    
}

function fn_a_sum_4() {
    var a_sum_4 = 0;
    var cost1 = parseInt($('#cost5').val() == "" ? 0 : $('#cost5').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost6').val() == "" ? 0 : $('#cost6').val().replace(/,/g, ""));
   
	a_sum_4 = cost1+cost2;
    $('#cost7').val(CnvtComma(a_sum_4));    
}


function fn_a_sub() {
    var sub1 = 0;
    var cost1 = parseInt($('#cost7').val() == "" ? 0 : $('#cost7').val().replace(/,/g, ""));
	var cost2 = parseInt($('#cost4').val() == "" ? 0 : $('#cost4').val().replace(/,/g, ""));
   
	sub1 = cost2-cost1;
    $('#cost8').val(CnvtComma(sub1));    
}


function delRow(){
	
	
	len = document.getElementById("TBLINFO").rows.length;
	console.log(len);
	if(len>5){
		document.getElementById("TBLINFO").deleteRow(document.getElementById("TBLINFO").rows.length - 2);
		fn_a_sum_1();
	}
	
	
	
	
	//len = $("#planTbl .tbody tr").length
	//if(len > 1)	$("#planTbl .tbody tr").eq(len-2).remove();
}


/************************************************************************
함수명		: CnvtComma
작성목적	: 빠져나갈때 포맷주기(123456 => 123,456)
*************************************************************************/
function CnvtComma(num) {
    try {
    	if(num>0){
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
    	}else if(num<0){
    		var ns = num.toString();
            var dp;
            console.log(ns.substring(1));
            ns = ns.substring(1);

            if (isNaN(ns))
                return "";

            dp = ns.search(/\./);

            if (dp < 0) dp = ns.length;

            dp -= 3;

            while (dp > 0) {
                ns = ns.substr(0, dp) + "," + ns.substr(dp);
                dp -= 3;
            }
            ns="-"+ns;
            return ns;
    		
    	}
        
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