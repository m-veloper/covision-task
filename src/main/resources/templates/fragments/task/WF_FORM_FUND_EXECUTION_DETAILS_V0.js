//양식별 다국어 정의 부분
var localLang_ko = {
  localLangItems: {}
};

var localLang_en = {
  localLangItems: {}
};

var localLang_ja = {
  localLangItems: {}
};

var localLang_zh = {
  localLangItems: {}
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
  } else {
    $('*[data-mode="readOnly"]').each(function () {
      $(this).hide();
    });

    // 에디터 처리
    //<!--AddWebEditor-->
    LoadEditor("divWebEditorContainer");

    if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

      document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
      document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
    }

    //<!--loadMultiRow_Write-->
    if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
      XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBL_WORK_INFO), 'json', '#TBL_WORK_INFO', 'W');
    } else {
      XFORM.multirow.load('', 'json', '#TBL_WORK_INFO', 'W', {minLength: 1});
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
      //SUBJECT.focus();
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

//본문 XML로 구성
function makeBodyContext() {
  /*var sBodyContext = "";
  sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/

  var bodyContextObj = {};
  var editorContent = {"tbContentElement": document.getElementById("dhtml_body").value};

  bodyContextObj["BodyContext"] = $.extend(editorContent, getFields("mField"));
  return bodyContextObj;
}


/**
 *  각 로우의 가격의 총합계를 구하는 함수
 */
let getTotlaPrice = (obj) => {
  let currentTotalPrice = document.getElementById("totalPrice");
  let price = Number(obj.value.replace(",", ""));
  let totalPrice = Number(currentTotalPrice.value) + price;
  currentTotalPrice.value = totalPrice;
}


/**
 * 원하는 데이블 로우 삭제하기
 * @param obj
 * @returns
 */
let deleteRow = (obj) => {
  let multiRowTemplates = $(obj).parent().parent();

  // 최근 총 합계 - 삭제 하려는 로우의 가격 = 총 합
  let currentTotalPrice = document.getElementById("totalPrice");
  let price = $(multiRowTemplates).find("#price").val();
  let totalPrice = Number(currentTotalPrice.value) - Number(price);
  currentTotalPrice.value = totalPrice;

  // 유사배열
  let trList = document.getElementsByClassName("multi-row");
  let trCount = trList.length;

  if (trCount <= 1) {
    // Common.Warning('삭제할 수 없습니다.');
    return false;
  } else {
    // 해당 로우 삭제
    multiRowTemplates.remove();
  }
}







