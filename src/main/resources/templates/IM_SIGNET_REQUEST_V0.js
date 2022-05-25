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

// 양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();

    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        // <!--AddWebEditor-->
        LoadEditor("divWebEditorContainer");

        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }

	if (formJson.Request.mode == "DRAFT"){
	    SetSubject();
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
        } else if (document.getElementById("SaveTerm").value == '') {
            Common.Warning('보존년한을 선택하세요.');
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
	
    return bodyContextObj;
}

//조직도
var objTxtSelect;
function OpenWinEmployee(szObject) {
	objTxtSelect = document.getElementById(szObject);
	console.log("OpenWinEmployee함수 진입")
	objTxtSelect.value = "";
	 
	var sType = "B1";
	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=Requester_CallBack&type=" + sType,"<spring:message code='Cache.lbl_apv_org'/>",1000,580,"");
}

var Name;

function Requester_CallBack(pStrItemInfo) {
	var oJsonOrgMap =  $.parseJSON(pStrItemInfo);
	
	if(oJsonOrgMap.item.length < 1) return;
	
	var I_User = oJsonOrgMap.item[0];
	console.log(I_User);
	objTxtSelect.value = CFN_GetDicInfo(I_User.DN);
	$("#Team").val(I_User.RGNM.split(";")[0]);//팀
	SetSubject();
}
 
//제목 지정하기
function SetSubject(){
	
	//날짜 바인딩
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    var date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    var dateStr = year + month + date;
    
	var Team = $("#Team").val();//팀
	Name = $("#Name").val();//이름
	var title = "[인감날인요청서]";
	var Subject = title + "_"  + Name + "_" + dateStr + "_";
		$("#Subject").val("");
		$("#Subject").val(Subject + $("#Subject").val());
	
}
