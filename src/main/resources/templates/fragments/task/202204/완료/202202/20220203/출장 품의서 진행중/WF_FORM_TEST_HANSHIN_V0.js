//양식별 다국어 정의 부분
/*
var localLang_ko = {
    localLangItems: {
        msg_lastconfirm: "출장비 정산 특이사항이 있습니다. 특이사항을 확인하셨습니까?",
        Traveler: "출장자",
        HeaderNm: "해외출장신청서",
        FunctionTeam: "소속",
        PositionTitle: "직책/직급",
        Name: "성명",
        Country: "출장국가",
        City: "출장도시",
        TravelPeriod: "출장일정",
        TotalPeriod: "전체일정",
        DepartureDate: "출발",
        ArrivalDate: "도착",
        BusinessPeriod: "업무일정",
        PurposeofTravel: "출장목적",
        TravelRouteEx: "(출발지 - 도착지 - 출발지) Seoul - 출장지 - Seoul",
        TravelRoute: "출장 순로",
        TravelExpensePlan: "계획액",
        Guideline: "회사출장규정",
        ExpensePlan: "계획액(단위:원)",
        ExpenseDetail: "비고",
        Hotel: "숙박비",
        MealGuideline: "조식:￦25,000/중식:￦35,000/석식:￦60,000",
        Meal: "식비",
        RoomChargeNight: "1박 당 금액",
        Won: "원",
        Transportation: "교통비",
        TransportationGuideline: "한국에서 발생하는 공항버스, 공항철도",
        PerDiem: "부대비",
        PerDiemGuideline: "\20,000/일",
        Visa: "비자",
        VisaGuideline: "복수비자 발급 시 예외사항에 사유 명시",
        Flight: "항공임",
        FlightGuideline: "직원: Economy<br>임원: 6hr 이하 Economy, 6hr 이상 Business",
        Total: "합계",
        Exceptions: "예외사항<br>합리적인<br>사유기재",
        Controller: "확인"
    }
};

var localLang_en = {
    localLangItems: {
        msg_lastconfirm: "출장비 정산 특이사항이 있습니다. 특이사항을 확인하셨습니까?",
        HeaderNm: "Oversea Travel Approval Form",
        Traveler: "Traveler",
        FunctionTeam: "Function/Team",
        PositionTitle: "Position/Title",
        Name: "Name",
        Country: "Country",
        City: "City",
        TravelPeriod: "Travel<br>Period",
        TotalPeriod: "Total<br>Period",
        DepartureDate: "Departure<br>Date",
        ArrivalDate: "Arrival<br>Date",
        BusinessPeriod: "Business<br>Period",
        PurposeofTravel: "Purpose<br>of Travel",
        TravelRouteEx: "(예시: Example)  Seoul - 출장지(Destination) - Seoul",
        TravelRoute: "Travel Route",
        TravelExpensePlan: "Travel Expense Plan",
        Guideline: "Guideline",
        ExpensePlan: "Expense Plan (KRW)",
        ExpenseDetail: "Expense Detail",
        Hotel: "Hotel",
        MealGuideline: "Breakfast:￦25,000/Lunch:￦35,000/Dinner:￦60,000",
        Meal: "Meal",
        RoomChargeNight: "Room Charge/Night",
        Won: "KRW",
        Transportation: "Transportation",
        TransportationGuideline: "Only for airport bus and <br>railload expenditures incurred in Korea",
        PerDiem: "Per Diem",
        PerDiemGuideline: "\20,000/day",
        Visa: "Visa",
        VisaGuideline: "Extra explanation required for multiple visa",
        Flight: "Flight",
        FlightGuideline: "Employees: Economy,<br>AVP and above: Economy(6hrs-), Business(6hrs+)",
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
    postJobForDynamicCtrl();

    if (getInfo("uslng") == "en") {
        $("#headname").text("Oversea Travel Approval Form");
    }

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read"){

        $('*[data-mode="writeOnly"]').each(function () {
            //직무대행 버튼 $('#spanBtnForDeputy').hide();
            //문서분류 버튼 $('#spanBtnForDocClass').hide();
            //휴가명 설명 $('#spanVacType').hide();
            $(this).hide();
        });
        
        if (JSON.stringify(formJson.BodyContext) != "{}" && formJson.BodyContext != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.bizTbl), 'json', '#bizTbl', 'R');
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
            //<span id="CommentList" data-mode="readOnly" ></span>
            $(this).hide();
        });

        if (formJson.Request.mode  == "DRAFT" || formJson.Request.mode  == "TEMPSAVE") {
        	
            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
	        document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
	        document.getElementById("InitiatorCodeDisplay").value = m_oFormMenu.getLngLabel(formJson.AppInfo.usid, false);
	        document.getElementById("InitiatedDate").value = formJson.AppInfo.svdt;
            
           // document.getElementById("USER_ID").value = m_oFormMenu.getLngLabel(getInfo("usid"), false);

        }
        if (JSON.stringify(formJson.BodyContext) != "{}" && JSON.stringify(formJson.BodyContext) != undefined) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.bizTbl), 'json', '#bizTbl', 'W');
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl), 'json', '#ItemTbl', 'W');
			if(formJson.BodyContext.ItemTbl.length != undefined){
				for(var i = 0; i < formJson.BodyContext.ItemTbl.length; i++)
					XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl[i].subTbl), 'json', document.getElementsByName("subTbl")[i+1], 'W');
			}else{
				XFORM.multirow.load(JSON.stringify(formJson.BodyContext.ItemTbl.subTbl), 'json', document.getElementsByName("subTbl")[1], 'W');
			}
        } else {
            XFORM.multirow.load('', 'json', '#bizTbl', 'W', { minLength: 1 });
            XFORM.multirow.load('', 'json', '#ItemTbl', 'W', { minLength: 1 });
        }
    }
    $("xformid_1").on("rowAdded", function () {
        $("bizTbl").removeClass("pattern-active");
        $("xformid_1 [name=freightFee]").removeClass("watch-value-active");
        EASY.pattern($("bizTbl"),true);
    });
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
        }
        else if (!($("#Chk_Agree_01").is(":checked"))) {
            Common.Warning('하단의 안내사항을 읽고 체크해 주세요.');
            return false;
        }
        else {
            return EASY.check().result;
        }
    }
}

function setBodyContext(sBodyContext) {

}

//본문 JSON으로 구성
/*function makeBodyContext() {
    var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";
    return sBodyContext;
}*/

//본문 JSON으로 구성
function makeBodyContext() {
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("bizTbl", "rField"));
	return bodyContextObj;
}

var empobj;
function OpenWinEmployee(obj) {
	empobj=obj;
	objTr = $(obj).closest("tr");
	$(objTr).find("input[name=BiztripDept]").val("");
	$(objTr).find("input[name=BiztripPosition]").val("");
	$(objTr).find("input[name=BiztripName]").val("");
    
	CFN_OpenWindow("/covicore/control/goOrgChart.do?callBackFunc=Requester_CallBack&type=B9","<spring:message code='Cache.lbl_apv_org'/>",1000,580,"");
}

function Requester_CallBack(pStrItemInfo) {
var oJsonOrgMap = $.parseJSON(pStrItemInfo);
	
	$.each(oJsonOrgMap.item, function(i, v) {
		console.log(v);
		if(i == 0) {
			$(objTr).find("input[name=BiztripName]").val(CFN_GetDicInfo(v.DN));
			$(objTr).find("input[name=BiztripDept]").val(v.RGNM.split(";")[0]);
			$(objTr).find("input[name=BiztripPosition]").val(v.po.split(";")[1]);
		} else {
			XFORM.multirow.addRow($('#bizTbl'));
			
			var addTr = $('#bizTbl').find(".multi-row").last();
			$(addTr).find("input[name=BiztripName]").val(CFN_GetDicInfo(v.DN));
			$(addTr).find("input[name=BiztripDept]").val(v.RGNM.split(";")[0]);
			$(addTr).find("input[name=BiztripPosition]").val(v.po.split(";")[1]);
		}
	});

}

function calScheduleSDATEEDATE(obj) {
	var SDATE = $("#AllSceduleSdate").val().split('-');
    var EDATE = $("#AllSceduleEdate").val().split('-');

    var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
    var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
    var tmpday = EOBJDATE - SOBJDATE;
    tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

    if (tmpday < 0) {
        alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        $(obj).val("");
    }
}

function calWorkSDATEEDATE(obj) {
	var SDATE = $("#WorkSdate").val().split('-');
    var EDATE = $("#WorkEdate").val().split('-');

    var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
    var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
    var tmpday = EOBJDATE - SOBJDATE;
    tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);

    if (tmpday < 0) {
        alert("이전 일보다 전 입니다. 확인하여 주십시오.");
        $(obj).val("");
    }
}