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
    	  
    	  	console.log("1111" +formJson.BodyContext.ItemTbl);
	   		console.log("11112222" +formJson.BodyContext.ItemTbl.length);
	   		console.log("11113333" +JSON.stringify(formJson.BodyContext.ItemTbl));	   		
	   	
	   		
			XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'R', {enableSubMultirow: true});
			
			console.log("1111" +formJson.BodyContext.ItemTbl.length);
			if(formJson.BodyContext.ItemTbl.length != undefined){
				for(var i = 0; i < formJson.BodyContext.ItemTbl.length; i++){
					if(formJson.BodyContext.ItemTbl[i].subTbl != undefined)
						XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl[i].subTbl), 'json', document.getElementsByName("subTbl")[i+1], 'R');
				}					
			}else{
				XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl.subTbl), 'json', document.getElementsByName("subTbl")[1], 'R');
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
    if (bTempSave) {
        return true;
    } else {
        if (document.getElementById("Subject").value == '') {
            Common.Warning('제목을 입력하세요.');
            // SUBJECT.focus();
            return false;
        } else {
            return EASY.check().result;
        }
    }
}
function setBodyContext(sBodyContext) {
}

// 본문 XML로 구성
function makeBodyContext() {
	
    var bodyContextObj = {};
	
	// 에디터가 없을 떄
	bodyContextObj["BodyContext"] = getFields("mField");
	
	// 멀티로우 있을 때
	
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("ItemTbl", "rField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("MULTI_TABLE", "rField"));
	
    return bodyContextObj;
}




function onlyNumber(o) {
	$(o).val($(o).val().replace(/[^0-9]/g, ""));
}