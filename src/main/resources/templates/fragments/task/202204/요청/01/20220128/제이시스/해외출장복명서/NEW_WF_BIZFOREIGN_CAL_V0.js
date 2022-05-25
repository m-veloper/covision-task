//양식별 다국어 정의 부분
/*var localLang_ko = {
    localLangItems: {
        msg_lastconfirm: "출장비 정산 특이사항이 있습니다. 특이사항을 확인하셨습니까?",
        Traveler: "출장자",
        FunctionTeam: "소속",
        PositionTitle: "직책/직급",
        Name: "성명",
        Country: "출장국가",
        City: "출장도시",
        TravelPeriod: "출장일정",
        TotalPeriod: "전체일정",
        PlanedPeriod: "예정",
        ActualPeriod: "실제",
        BusinessPeriod: "업무일정",
        PurposeofTravel: "출장목적",
        ReimbursementRequests: "여비정산",
        TravelRoute: "출장 순로",
        PrereimbursedExpense: "기처리액",
        ExpenseforReimbursementRequest: "정산신청액",
        TotalTravelExpense: "총정산액",
        ExpenseDetail: "사용 상세내역 기재",
        Hotel: "숙박비",
        RoomChargeNight: "1박 당 금액",
        KRW: "원",
        Meal: "식비",
        Transportation: "교통비",
        PerDiem: "부대비",
        Flight: "항공임",
        Visa: "비자",
        Total: "합계",
        Exceptions: "예외사항<br>합리적인<br>사유기재",
        Controller: "확인"
    }
};

var localLang_en = {
    localLangItems: {
        msg_lastconfirm: "출장비 정산 특이사항이 있습니다. 특이사항을 확인하셨습니까?",
        Traveler: "Traveler",
        FunctionTeam: "Function/Team",
        PositionTitle: "Position/Title",
        Name: "Name",
        Country: "Country",
        City: "City",
        TravelPeriod: "Travel<br>Period",
        TotalPeriod: "Total<br>Period",
        PlanedPeriod: "Planed<br>Period",
        ActualPeriod: "Actual<br>Period",
        BusinessPeriod: "Business<br>Period",
        PurposeofTravel: "Purpose<br>of Travel",
        ReimbursementRequests: "Reimbursement Requests",
        TravelRoute: "Travel Route",
        PrereimbursedExpense: "Pre-reimbursed<br>Expense",
        ExpenseforReimbursementRequest: "Expense for<br>Reimbursement<br>Request",
        TotalTravelExpense: "Total Travel Expense",
        ExpenseDetail: "Expense Detail",
        Hotel: "Hotel",
        RoomChargeNight: "Room Charge/<br>Night",
        KRW: "KRW",
        Meal: "Meal",
        Transportation: "Transportation",
        PerDiem: "Per Diem",
        Flight: "Flight",
        Visa: "Visa",
        Total: "Total",
        Exceptions: "Exceptions",
        Controller: "Controller"
    }
};

var localLang_ja = {
    localLangItems: {
        selMessage: "●休日이 포함된 연차를 사용할 경우 [추가]버튼을 이용하여 개별 입력하시기 바랍니다.",
        allVacDays: "총연차"

    }
};

var localLang_zh = {
    localLangItems: {
        selMessage: "●休日이 포함된 연차를 사용할 경우 [추가]버튼을 이용하여 개별 입력하시기 바랍니다.",
        allVacDays: "총연차"

    }
};*/

//양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    //debugger;
    //공통영역
    // 체크박스, radio 등 공통 후처리

    if (formJson.Request.mode == "DRAFT") {
        EASY.init();
        $("#MoneySymbol").val("$");
        //XEasy.triggerFormChanged();//.trigger("click");
    }
    postJobForDynamicCtrl();

    $("[id*=Symbol_Ko]").each(function (i, item) {
        $(item).val("￦");
    });

    if (getInfo("uslng") == "en") {
        $("#headname").text("Oversea Travel Expense Approval Form");
    }

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            //직무대행 버튼 $('#spanBtnForDeputy').hide();
            //문서분류 버튼 $('#spanBtnForDocClass').hide();
            //휴가명 설명 $('#spanVacType').hide();
            $(this).hide();
        });
    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            //<span id="CommentList" data-mode="readOnly" ></span>
            $(this).hide();
        });

        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
            document.getElementById("InitiatedDate").value = m_oFormMenu.getLngLabel(formJson.AppInfo.svdt.substring(0, 10), false);
            document.getElementById("InitiatorCodeDisplay").value = m_oFormMenu.getLngLabel(formJson.AppInfo.usid, false);
            //document.getElementById("USER_ID").value = m_oFormMenu.getLngLabel(getInfo("usid"), false);


        }
        else {

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
        if (document.getElementById("SaveTerm").value == '') {
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
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
    
    return bodyContextObj;
}

var objTxtSelect;
function OpenWinEmployee(szObject) {
   objTxtSelect = document.getElementById(szObject);
   /*
    var sType = "B1";
    var sGroup = "N";
    var sTarget = "Y";
    var sCompany = "Y";
    var sSearchType = "";
    var sSearchText = "";
    var sSubSystem = "";
    XFN_OrgMapShow_WindowOpen("REQUEST_TEAM_LEADER", "bodytable_content", objTxtSelect.id, openID, "Requester_CallBack", sType, sGroup, sCompany, sTarget, sSubSystem, sSearchType, sSearchText);*/
    
	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=Requester_CallBack&type=B1","<spring:message code='Cache.lbl_apv_org'/>",1000,580,"");
}

function Requester_CallBack(pStrItemInfo) {
	var oJsonOrgMap =  $.parseJSON(pStrItemInfo);
	 
	if(oJsonOrgMap.item.length < 1){
		return;
	}
	
	var I_User = oJsonOrgMap.item[0];

//    if (getInfo("AppInfo.usid") != I_User.AN) {
        objTxtSelect.value = CFN_GetDicInfo(I_User.DN);

        var deptName = CFN_GetDicInfo(I_User.RGNM);

        var position = CFN_GetDicInfo(I_User.PO.split('&')[1]);

        $("#BiztripDept").val(deptName);
        $("#BiztripPosition").val(position);
//    }
//    else {
//        alert('직무대행자로 본인이 선택되었습니다.\r\n다시 선택하세요');
//        OpenWinEmployee('DEPUTY_NAME');
//    }
}

function calSDATEEDATE(id) {
	if(id == "AllSdate_Scedule" || id == "AllEdate_Scedule") {
		var SDATE = $("#AllSdate_Scedule").val().split('-');
	    var EDATE = $("#AllEdate_Scedule").val().split('-');
	} else if(id == "AllSdate_Real" || id == "AllEdate_Real") {
		var SDATE = $("#AllSdate_Real").val().split('-');
	    var EDATE = $("#AllEdate_Real").val().split('-');
	} else if(id == "WorkSdate_Scedule" || id == "WorkEdate_Scedule") { 
		var SDATE = $("#WorkSdate_Scedule").val().split('-');
	    var EDATE = $("#WorkEdate_Scedule").val().split('-');
	} else {
		var SDATE = $("#WorkSdate_Real").val().split('-');
	    var EDATE = $("#WorkEdate_Real").val().split('-');
	}
	

    var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
    var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
    var tmpday = EOBJDATE - SOBJDATE;
    tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

    if (tmpday < 0) {
        alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        $("#" + id).val("");
    }
}