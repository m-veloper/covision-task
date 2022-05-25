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
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.reqTbl), 'json', '#reqTbl', 'R');
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
            $("#lastDate").val(today.format("yyyy")+"년 "+today.format("MM")+"월 "+today.format("dd")+"일");
        }
     
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.reqTbl), 'json', '#reqTbl', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#reqTbl', 'W', { minLength: 1 });
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
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("reqTbl", "rField"));
    return bodyContextObj;
}

function numToKo(obj){
	if($(obj).closest("tr").find("input[name=vat]").val() == ''){
		$(obj).closest("tr").find("input[name=vat]").val(0);
	}
	koprice = NumToHangul($("#totalPrice").val());
	$("#koPrice").val("일금 "+koprice+"원정");
}


function NumToHangul(chknum) {
    var isMinus = false;

    if (chknum.indexOf('-') > -1) {
        chknum = chknum.substring(1, chknum.length);
        isMinus = true;
    }

    val = chknum;
    var won = new Array();
    re = /^[1-9][0-9]*$/;
    num = val.toString().split(',').join('');

    if (!re.test(num)) {
        return '0';
    }
    else {
        var price_unit0 = new Array('', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구');
        var price_unit1 = new Array('', '십', '백', '천');
        var price_unit2 = new Array('', '만', '억', '조', '경', '해', '시', '양', '구', '간', '정');
        for (i = num.length - 1; i >= 0; i--) {
            won[i] = price_unit0[num.substr(num.length - 1 - i, 1)];
            if (i > 0 && won[i] != '') {
                won[i] += price_unit1[i % 4];
            }
            if (i % 4 == 0) {
                won[i] += price_unit2[(i / 4)];
            }
        }
        for (i = num.length - 1; i >= 0; i--) {
            if (won[i].length == 2) won[i - i % 4] += '-';
            if (won[i].length == 1 && i > 0) won[i] = '';
           // if (i % 4 != 0) won[i] = won[i].replace('일', '');
        }

        won = won.reverse().join('').replace(/-+/g, '');

        if (won.toString().substr(0, 1) == '십') {
            won = '일' + won;
        }

        if (isMinus)
            return '-' + won;
        else
            return won;
    }
}


