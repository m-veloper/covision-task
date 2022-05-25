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

            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTblP), 'json', '#tTblP', 'R');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTbl), 'json', '#tTbl', 'R');
            
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
            
            today = new Date();
            $("#wDate").val(today.getFullYear()+"년 "+(today.getMonth()+1)+"월 "+today.getDate()+"일 ");
            $("#wName").val(getInfo("AppInfo.usnm"));
        }
     
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
        	XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTblP), 'json', '#tTblP', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.tTbl), 'json', '#tTbl', 'W');
            
        } else {
        	XFORM.multirow.load('', 'json', '#tTblP', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#tTbl', 'W', { minLength: 1 });
            
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("tTblP", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("tTbl", "rField"));
    return bodyContextObj;
}

function setSubject(){
	 if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
			document.getElementById("Subject").value = "";
			document.getElementById("Subject").value += "(";
			var datestr = "";
			/*
			$("input[name=_MULTI_VACATION_SDT]").each(function (i, sobj){
				var sd = $(sobj).val();
				var ed = $("input[name=_MULTI_VACATION_EDT]").eq(i).val();
				if(sd != "" && ed != ""){
					if (datestr != "") datestr += "/";
					datestr += sd;
					if (sd != ed) datestr += "~"+ed;
					
				}			
			});
			*/ 
			var sd = $("#sDate").val().replace("년 ","-").replace("월 ","-").replace("일","");
			var ed = $("#eDate").val().replace("년 ","-").replace("월 ","-").replace("일","");		
			
			if(sd != "" && ed != ""){
				if(sd == ed){
					datestr = sd+"";
				}else {
					datestr = sd+"~"+ed;
				}
			}				
			document.getElementById("Subject").value += datestr + ") "; 
			document.getElementById("Subject").value += CFN_GetDicInfo(getInfo("AppInfo.usnm"))+"("+getInfo("AppInfo.uspn")+")" + " - " + CFN_GetDicInfo(getInfo("FormInfo.FormName"));
	     
	}	
}

function calSDATEEDATE(){
	if($("#sDate").val() != "" && $("#eDate").val() != ""){
		 var SDATE = $("#sDate").val().replace('년 ','-').replace('월','-').replace('일','-').split('-');
	     var EDATE = $("#eDate").val().replace('년 ','-').replace('월','-').replace('일','-').split('-');

	     var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
	     var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
	     var tmpday = EOBJDATE - SOBJDATE;
	     tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);
	    
	     
	     if (tmpday < 0) {
            Common.Warning('이전 일보다 전 입니다. 확인하여 주십시오.');
           
            $("#sDate").val("");
            $("#eDate").val("");
        }
        else {
        	 $("#days").val((tmpday+1));
		     setSubject(); 
        }
	    
	}     
}
