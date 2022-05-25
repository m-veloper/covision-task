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
    
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    var date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    
    var week = ['일', '월', '화', '수', '목', '금', '토'];
    var dayOfWeek = week[new Date(year+"-"+month+"-"+date).getDay()];
    
 
    
    var ymd = year + "년 "+ month + "월 " + date  + "일  " +dayOfWeek +"요일";
    
    $("#reqDay").val(ymd);
    $("#Subject").css("height", "30px");
    $("input[name=userDept]").val(getInfo("AppInfo.dpnm"));
    $("input[name=userName]").val(getInfo("AppInfo.usnm"));
    $("input[name=userPosition]").val(getInfo("AppInfo.uspn"));

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

        // 에디터 처리


        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
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
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
    $$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
    
    return bodyContextObj;
}

function fn_sum() {
    var price = 0;
    $('#TBLINFO').find(".multi-row").not(".pattern-skip").each(function (i) {
        price += parseInt($("input[name=REQ_TOTAL]").eq(i + 1).val() == "" ? 0 :$("input[name=REQ_TOTAL]").eq(i + 1).val().replace(/,/g, ""));
    });
    $('#REQ_TOTALPRICE').val($("input[name=REQ_PRICE]").eq(1).val().substring(0, 1) + CnvtComma(price));
    
    
}

/************************************************************************
함수명		: CnvtComma
작성목적	: 빠져나갈때 포맷주기(123456 => 123,456)
*************************************************************************/
function CnvtComma(num) {
    try {
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
    }
    catch (ex) {
    }


    postJobForDynamicCtrl();

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

        // 에디터 처리


        if (formJson.oFormData.mode == "DRAFT" || formJson.oFormData.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
        }
    }
}


function NumToHangul() {
	
    var isMinus = false;
    var chknum ="";
    
    chknum =$('#a_sum_1').val();
    console.log("chknum"+chknum);

    

    val = chknum;
    console.log("val" + val);
    var won = new Array();
    re = /^[1-9][0-9]*$/;
    num = val.toString().split(',').join('');
    
    console.log("num" + num);
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
            if (i % 4 != 0) won[i] = won[i].replace('일', '');
        }

        won = won.reverse().join('').replace(/-+/g, '');

        if (won.toString().substr(0, 1) == '십') {
            won = '일' + won;
        }
        console.log(won);

        if (isMinus){
        	 $("#requestAmt").val("-" + won+"원정 " + "( " +chknum +" )");
        }else{
        	 $("#requestAmt").val( won+"원정" + "( " +chknum +" )");
        }
    }
}
