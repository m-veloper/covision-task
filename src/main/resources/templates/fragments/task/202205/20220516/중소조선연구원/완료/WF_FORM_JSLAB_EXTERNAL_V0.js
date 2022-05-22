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
    
	var m_objXML = getInfo("FileInfos");      //JSON 가져오기

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
       //******************** 양식 파일 내 첨부파일 함수 정리 시작 ***************************************************************************************************************************************/

        var MultiDownLoadString; //일괄다운로드용 문자열
        var gFileArray = new Array();
        var gFileNameArray = new Array();
        var attFiles, fileLoc, szAttFileInfo;
        var displayFileName;
        var re = /_N_/g;

        // 편집 모드인지 확인
        var bEdit = false;

        szAttFileInfo = "";
        MultiDownLoadString = "";
    
        //******************** 양식 파일 내 첨부파일 함수 정리  ***************************************************************************************************************************************/

		
    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        //<!--AddWebEditor-->
         // 에디터 처리
        LoadEditor("divWebEditorContainer");

        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
       		document.getElementById("InitiatedDate").value = formJson.AppInfo.svdt; // 재사용, 임시함에서 오늘날짜로 들어가게함.
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
	var editorContent = {"tbContentElement" : document.getElementById("dhtml_body").value};
	bodyContextObj["BodyContext"] = $.extend(editorContent, getFields("mField"));
    
    return bodyContextObj;
}