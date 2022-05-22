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

    //******************** 양식 프로세스가 대외공문 또는 재직증명서 선택시 시작  ***************************************************************************************************************************************/
    $("#Subject").val("위 임 장");
    $('#tblFormSubject').hide();

    $("#btOTrans").val("위임장출력"); //출력버튼
    $('#btPreView').hide();
    //******************** 양식 프로세스가 대외공문 또는 재직증명서 선택시 끝***************************************************************************************************************************************/

    // 완료모드 일 경우
    if (formJson.Request.mode == "COMPLETE") {
        showElementByReadMode();
    }


    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {


        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });



        //******************** 양식 파일 내 첨부파일 함수 정리 시작 ***************************************************************************************************************************************/

        // 편집 모드인지 확인
        var bEdit = false;

        //******************** 양식 파일 내 첨부파일 함수 정리  끝***************************************************************************************************************************************/

        // 읽기 모드일 때 숨길 엘리먼트
        hideElementByReadMode();
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
        // 오늘 날짜 자동 입력
        getDate.today();

        // 쓰기 모드일 때 숨길 엘리먼트
        hideElementByWriteMode();

        // 선택 날짜 자동 입력
        getDate.setDate();
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


/**
 * 읽기 모드일 때 숨길 엘리먼트
 */
let hideElementByReadMode = () => {
    // 결재 기안 영역
//	$("#divFormApvLines").hide();

    // 공통 작성자, 작성부서, 문서번호, 문서분류, 보안등급, 보존년한 table
    $(".fsbTop").hide();
//	$("#bodytable_content > table:nth-child(41)").hide();

    // 공통 제목 input
//	$('#tblFormSubject').hide();

    // 공통 연관문서 table
    $("#tbLinkInfo").hide();

    // 공통  첨부목록
//	$("#attachTitle").hide();

    // 공통  첨부목록 에디터
//	$("#tbFormAttach").hide();

}


/**
 * 읽기 모드일 때 보일 엘리먼트
 */
let showElementByReadMode = () => {

    // 문서 타이틀
    $("#titleDiv").css("display", "block");

    // 문서 번호
    $("#doc_complet_no").css("display", "block");
    const docNo = formJson.FormInstanceInfo.DocNo
    $("#docNo").text(docNo);
}

/**
 * 쓰기 모드일 때 숨길 엘리먼트
 */
let hideElementByWriteMode = () => {

    // 직인 숨기기
//	$("#ImgSeal").hide();
}

/**
 * 날짜 자동 입력
 */
let getDate = {

    // 오늘 날짜 자동 입력
    today() {

        let todayElement = document.getElementById("today");
        let today = new Date();
        let year = today.getFullYear();
        let month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
        let date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
        todayElement.value = (year + "년 " + month + "월 " + date + "일")
    }
}




