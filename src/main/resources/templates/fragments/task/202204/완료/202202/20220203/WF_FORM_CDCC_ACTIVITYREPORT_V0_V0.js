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

        //<!--loadMultiRow_Read-->
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
			XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'R', {enableSubMultirow: true});
			if(formJson.BodyContext.ItemTbl.length != undefined){
				for(var i = 0; i < formJson.BodyContext.ItemTbl.length; i++){
					if(formJson.BodyContext.ItemTbl[i].subTbl != undefined)
						XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl[i].subTbl), 'json', document.getElementsByName("subTbl")[i+1], 'W');
				}					
			}else{
				XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl.subTbl), 'json', document.getElementsByName("subTbl")[1], 'W');
			}
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
            document.getElementById("InitiatorCodeDisplay").value = m_oFormMenu.getLngLabel(formJson.AppInfo.usid, false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
     }

        
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'W');
			if(formJson.BodyContext.ItemTbl.length != undefined){
				for(var i = 0; i < formJson.BodyContext.ItemTbl.length; i++)
					XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl[i].subTbl), 'json', document.getElementsByName("subTbl")[i+1], 'W');
			}else{
				XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl.subTbl), 'json', document.getElementsByName("subTbl")[1], 'W');
			}
        } else {
            XFORM.multirow.load('', 'json', '#ItemTbl', 'W', { minLength: 1 });
        }
        
       
    }
}

function setLabel() {
}

function setFormInfoDraft() {
}

function checkForm(bTempSave) {
	
	var returnBol = true;
	
    if (bTempSave) {
        return true;
    } else {
    	if(formJson.Request.mode == "REDRAFT" && getInfo("Request.templatemode") == "Read"){    		
    		
    	}else if((formJson.Request.mode == "REDRAFT" && getInfo("Request.templatemode") != "Read") || (formJson.Request.mode == "RECAPPROVAL" && getInfo("Request.templatemode") != "Read")){ //쓰기모드
    		// if(!CheckMaterial()) return false;
    	}
      
    
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
	
    return bodyContextObj;
}


//한솔


function receiveHTTPState(dataresponseXML) {
	var xmlReturn = dataresponseXML.Table;
	var errorNode = dataresponseXML.error;
	if (errorNode != null && errorNode != undefined) {
		Common.Error("Desc: " + $(errorNode).text());
	} else {
		$(xmlReturn).each(function (i, elm) {
			SetData(elm.BodyContext);
		});
	}
}


function toNum(obj){
	return Number($(obj).val().toString().replace(/\,/gi, ''));
} 
function comma(obj,num) {
	var parts = obj.toString().replace(/\,/gi, '').split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if(parts.length > 1) {
    	parts[1] = parts[1].substring(0, num);
        return parts[0] + "." + parts[1];
    } else{
    	return parts[0];
    }    
}

function inputNumberFormat(obj) {
    obj.value = comma(obj.value);
}

//콤마 찍기
function comma(obj,num) {
	var parts = obj.toString().replace(/\,/gi, '').split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if(parts.length > 1) {
    	parts[1] = parts[1].substring(0, num);
        return parts[0] + "." + parts[1];
    } else{
    	return parts[0];
    }    
}

//input box 콤마달기
function inputNumberFormat(obj) {
    obj.value = comma(obj.value);
}

//콤마 붙은 문자 숫자로 변경
function toNum(obj){
	return Number($(obj).val().toString().replace(/\,/gi, ''));
} 
