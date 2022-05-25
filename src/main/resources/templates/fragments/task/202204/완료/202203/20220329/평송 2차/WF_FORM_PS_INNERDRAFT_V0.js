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
	
	
	
	 $("#headname").hide();
	 
	
    $("#RECEIVE").val($("#ReceiveNo").val()); //문서번호
    $("#COMNAME").val(Common.getBaseConfig("APV_EXTERNAL_NAME"));	// 주 식 회 사   코 비 젼
    $("#HOMENUM").val(Common.getBaseConfig("APV_EXTERNAL_ADD"));	// 서울 마포 매봉산로 37, DMC산학협력연구센터 11층
    $("#TEL").val(Common.getBaseConfig("APV_EXTERNAL_TEL"));		// 02-6965-3100


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

        // [19-08-13] kimhs, 본사 운영 에디터 본문에 첨부명 직접 입력할 시 중복되어 주석처리함.
        $("#HALL").css("display", "none");
        /*if (getInfo("FileInfos") != undefined && getInfo("FileInfos")!="[]") {
            var r, res;
            var s = getInfo("FileInfos");
            res = /^^^/i;
            attFiles = s.replace(res, "");    
            var result = "";
            var m_oFileList;

            
            m_oFileList = $.parseJSON(attFiles);
            
            var elmRoot, elmList, elm, elmTaskInfo;
            elmRoot = m_oFileList;
           
            szAttFileInfo = "";           
            $.each($.parseJSON(getInfo("FileInfos")),function(i,elm){

              var filename = elm.FileName;
              result += filename + "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
              $("#ATTACH").html(result);

              var filesize = elm.Size;
              //   result += filesize+")"+"<br/>";
              //   $("#ATTACH").html(result);

              var limitSize = (filesize == null) ? "0" : (parseInt(filesize) / 1024);
              displayFileName = elm.FileName.substring(0, elm.FileName.lastIndexOf("."));
              displayFileName = displayFileName.replace(re, "&");
           
         	});         
        }
        else { // 첨부파일 없으면 가리기
            $("#HALL").css("display", "none");
        }*/

        

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

            document.getElementById("TODAY").value = getInfo("AppInfo.svdt").split(' ')[0]; ;
            document.getElementById("AD").value = getInfo("AppInfo.usnm").split(';')[0];
            //document.getElementById("EMAIL").value = getInfo("AppInfo.ussip");

       }
     
       $("#HALL").css("display", "none");
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