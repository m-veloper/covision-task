

/*!
 * 
 * 
 * SmartS4j / MobileOffice / 모바일 결재 js 파일
 * 함수명 : mobile_approval_...
 * 
 * 
 */


/*!
 * 
 * 페이지별 init 함수
 * 
 */

var g_ActiveModule = "";

//결재 목록 페이지
$(document).on('pageinit', '#approval_list_page', function () {
	g_ActiveModule = "approval";
	
	if($("#approval_list_page").attr("IsLoad") != "Y"){
		$("#approval_list_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_ListInit()",10);
	}
});


//결재 상세보기 페이지 (init-상단 정보 표시/show-원문영역 표시)
$(document).on('pageinit', '#approval_view_page', function () {
	g_ActiveModule = "approval";
	
	if($("#approval_view_page").attr("IsLoad") != "Y"){
		setTimeout("mobile_approval_ViewInit()",10);
		setTimeout("mobile_comm_showwatermark()",10);
	}	
});

$(document).on('pageshow', '#approval_view_page', function () {	
	if($("#approval_view_page").attr("IsLoad") != "Y"){
		$("#approval_view_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_getView(_mobile_approval_view)",10);	
	}
});


//결재 작성 페이지
$(document).on('pageinit', '#approval_write_page', function () {
	g_ActiveModule = "approval";
	
	if($("#approval_write_page").attr("IsLoad") != "Y"){
		$("#approval_write_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_WriteInit()",10);
	} else if($("#approval_write_page").attr("IsEventLoad") != "Y") {
		$("#approval_write_page").attr("IsEventLoad", "Y");
		EASY.init();
	}
});

//결재 미리보기 페이지(iframe)
$(document).on('pageinit', '#approval_preview_page', function () {
	g_ActiveModule = "approval";
	
	if($("#approval_preview_page").attr("IsLoad") != "Y"){
		setTimeout("mobile_approval_ViewInit()",10);
		setTimeout("mobile_comm_showwatermark()",10);
	}	
});

$(document).on('pageshow', '#approval_preview_page', function () {	
	if($("#approval_preview_page").attr("IsLoad") != "Y"){
		$("#approval_preview_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_getView(_mobile_approval_view)",10);
	}
});

//결재 문서분류 페이지
$(document).on('pageinit', '#approval_select_page', function () {
	g_ActiveModule = "approval";
	
	if($("#approval_select_page").attr("IsLoad") != "Y"){
		$("#approval_select_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_SelectInit()",10);
	}
});

//서명 등록 페이지
$(document).on('pageinit', '#approval_signature_page', function () {
	if($("#approval_signature_page").attr("IsLoad") != "Y"){
		$("#approval_signature_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_SignInit()",10);
		// Android 새로고침 막기
		if(mobile_comm_isAndroidApp()) {
			window.covimoapp.SetPullToRefresh(false);
		}
	}
});

//대결 설정 페이지
$(document).on('pageinit', '#approval_deputy_page', function () {
	if($("#approval_deputy_page").attr("IsLoad") != "Y"){
		$("#approval_deputy_page").attr("IsLoad", "Y");
		setTimeout("mobile_approval_DeputyInit()",10);
	}
});

/*!
 * 
 * 전자결재 공통
 * 
 */

var lang = mobile_comm_getSession("lang");

// 전자결재/e-Accounting 여부
function mobile_approval_getActiveModule() {
	if(!g_ActiveModule) {
		g_ActiveModule = $.mobile.activePage.attr("id").split("_")[0];
	}

	return g_ActiveModule;
}

// 결재문서 제목 내 일부 특수문자에 대한 치환
function mobile_approval_replaceCharacter(pStr) {
	var retValue = pStr;
	try {
		retValue = pStr.replace(/\\/gi, "￦").replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/\'/g,"&#39;");
	} catch(e) {
	}
	return retValue;
}

// 결재문서 본문 데이터 내 일부 특수문자에 대한 치환
function mobile_approval_replaceContent(pStr) {
	var retValue = pStr.replace(/\\n/gi, "").replace(/\\/gi, "￦");
	
	return retValue;
}

/*!
 * 
 * 결재 목록
 * 
 */

var _mobile_approval_list = {
	
	// 리스트 조회 초기 데이터
	MenuID: '',			//메뉴ID
	Page: 1,			//조회할 페이지
	PageSize: 10,		//페이지당 건수
	SearchText: '',		//검색어
	SearchType: 'all',	//검색 타입
	WriteYN: 'N',		//작성권한. 기본은 N //TODO: 권한처리
	
	// 페이징을 위한 데이터
	Loading: false,		//데이터 조회 중
	TotalCount: -1,		//전체 건수
	RecentCount: 0,		//현재 보여지는 건수
	EndOfList: false,	//전체 리스트를 다 보여줬는지
	
	//스크롤 위치 고정
	OnBack: false,		//뒤로가기로 왔을 경우
	Scroll: 0,			//스크롤 위치
	
	Mode: "", 			//결재함 Mode
	ListType: "list",	//결재함 Type(list: 일반 리스트, search: 검색 리스트)
	ListMode: "normal"  //결재함 Mode(normal: 일반 리스트, docSelect: 문서연결 리스트)
};

function mobile_approval_ListInit(){	
	// 1. 파라미터 셋팅
	if (mobile_comm_getQueryString('menuid') != 'undefined') {
		_mobile_approval_list.MenuID = mobile_comm_getQueryString('menuid');
    } else {
    	if(mobile_comm_getQueryString('menucode') != 'undefined') {
    		_mobile_approval_list.MenuID = mobile_comm_getBaseConfig(mobile_comm_getQueryString('menucode'));
    	}
    }
	if (mobile_comm_getQueryString('page') != 'undefined') {
		_mobile_approval_list.Page = mobile_comm_getQueryString('page');
    } else {
    	_mobile_approval_list.Page = 1;
    }
	if (mobile_comm_getQueryString('searchtext') != 'undefined') {
		_mobile_approval_list.SearchText = mobile_comm_getQueryString('searchtext');
    } else {
    	
    	if(window.sessionStorage.getItem("ApprovalSearchText") != undefined && window.sessionStorage.getItem("ApprovalSearchText") != ""	)
		{
    		_mobile_approval_list.SearchTexte = window.sessionStorage.getItem("ApprovalSearchText");
		}
		else {
			_mobile_approval_list.SearchText = '';
		}
    	
    }
	if (mobile_comm_getQueryString('onback') != 'undefined') {
		_mobile_approval_list.OnBack = mobile_comm_getQueryString('onback');
    } else {
    	_mobile_approval_list.OnBack = false;
    }
	if (mobile_comm_getQueryString('scroll') != 'undefined') {
		_mobile_approval_list.Scroll = mobile_comm_getQueryString('scroll');
    } else {
    	_mobile_approval_list.Scroll = 0;
    }
	if (mobile_comm_getQueryString('mode') != 'undefined') {
		_mobile_approval_list.Mode = mobile_comm_getQueryString('mode');
    } else {
    	_mobile_approval_list.Mode = '';
    }
	
	if(window.sessionStorage.getItem("approval_isDocSelect") != null && window.sessionStorage.getItem("approval_isDocSelect") != "" && window.sessionStorage.getItem("approval_isDocSelect") == "Y") {
		_mobile_approval_list.Mode = $("#approval_list_type").val();
		_mobile_approval_list.ListMode = "docSelect";
		$("#approval_list_header_normal").hide();
		$("#approval_list_header_docSelect").show();
		$("#approval_list_type").show();
		$("#approval_list_header").children("a").remove(); //이상한 a 태그가 추가되는 현상 임시 조치

		if(_mobile_approval_write.FormID == "") { //_mobile_approval_write 전역 변수 값 사라지는 현상 임시 조치
			_mobile_approval_write = JSON.parse(window.sessionStorage.getItem("_mobile_approval_write"));
		}
	} else {
    	if(_mobile_approval_list.Mode == "") {
    		if(window.sessionStorage.getItem("ApprovalSelectBox") != undefined && window.sessionStorage.getItem("ApprovalSelectBox") != ""	)
    		{
    			_mobile_approval_list.Mode = window.sessionStorage.getItem("ApprovalSelectBox");
    		}
    		else {
    			_mobile_approval_list.Mode = "Approval";
    		}
    		
    	}
    	if(window.sessionStorage.getItem("ApprovalListType") != undefined && window.sessionStorage.getItem("ApprovalListType") != ""	)
		{
			_mobile_approval_list.ListMode = window.sessionStorage.getItem("ApprovalListType");
		}
		else {
			_mobile_approval_list.ListMode = "normal";
		}
    	
    	if(_mobile_approval_list.ListMode == "search") {
    		$("#approval_list_header_normal").hide();
    		$("#approval_list_searchlist").show();
    		$("#approval_div_search").show()
    		$("#approval_search_input").val(_mobile_approval_list.SearchText);
    	} else {
			$("#approval_list_header_normal").show();
    	}
    	$("#approval_list_header_docSelect").hide();
		$("#approval_list_type").hide();
	}
	
	_mobile_approval_list.TotalCount = -1;
	_mobile_approval_list.RecentCount = 0;
	_mobile_approval_list.EndOfList = false;
	
	if(_mobile_approval_list.ListMode == "normal") {
		//TODO: 뒤로가기로 왔을 경우 파라미터 처리
		//setTimeout(function () {
			try {
				var arrHistoryData = new Array();
				try {
			        JSON.parse(window.sessionStorage["mobile_history_data"]).length;
			        arrHistoryData = JSON.parse(window.sessionStorage.getItem("mobile_history_data"));
			    } catch (e) {
			    	arrHistoryData = new Array();
			    }
				if(arrHistoryData.length > 0) {
					
					var prev = arrHistoryData[parseInt(window.sessionStorage["mobile_history_index"])];					
					
					if(prev.indexOf("/view.do") > -1 || prev.indexOf("/write.do") > -1) {
						(mobile_comm_getQueryStringForUrl(prev, 'listmode') != "undefined") ? _mobile_approval_list.Mode = mobile_comm_getQueryStringForUrl(prev, 'listmode'):"";
						(mobile_comm_getQueryStringForUrl(prev, 'totalcount') != "undefined") ? _mobile_approval_list.TotalCount = mobile_comm_getQueryStringForUrl(prev, 'folderid'):"";
						(mobile_comm_getQueryStringForUrl(prev, 'page') != "undefined") ? _mobile_approval_list.Page = mobile_comm_getQueryStringForUrl(prev, 'page'):"";
						(mobile_comm_getQueryStringForUrl(prev, 'searchtext') != "undefined") ? _mobile_approval_list.SearchText = mobile_comm_getQueryStringForUrl(prev, 'searchtext'):"";
						_mobile_approval_list.OnBack = true;
						
						if(parseInt(window.sessionStorage["mobile_history_index"]) < arrHistoryData.length) {
							arrHistoryData = arrHistoryData.splice(0, parseInt(window.sessionStorage["mobile_history_index"]));
							window.sessionStorage["mobile_history_data"] = JSON.stringify(arrHistoryData);
						}
					}
				}
			} catch(e) {
			}
		//}, 10);
		
		// 2. 상단메뉴
		//setTimeout(function () {
			
			// 좌측메뉴 표시
			$('#approval_list_topmenu').html(mobile_approval_getTopMenuHtml(ApprovalMenu));	//ApprovalMenu - 서버에서 넘겨주는 좌측메뉴 목록
			$("#approval_list_topmenu").find("li").each(function() { 
				if($(this).attr("mode") == _mobile_approval_list.Mode) 
					$(this).find("a").addClass("selected") 
			});
			
			if(_mobile_approval_list.Mode == "TempSave") {
				$("#approval_search_input").attr("placeholder", mobile_comm_getDic("msg_apv_searchByTitle"));
				_mobile_approval_list.SearchType = "Subject";
			} else {
				$("#approval_search_input").attr("placeholder", mobile_comm_getDic("msg_apv_searchBy"));
				_mobile_approval_list.SearchType = "all";
			}
			
			// 결재함 트리 조회 및 표시
			//mobile_approval_getTreeData(_mobile_approval_list, 'LIST');
			
			if(mobile_comm_getBaseConfig("useMobileApprovalWrite") == "Y") //TODO: DN_ID
				$("#approval_list_btn_write").show();
			else
				$("#approval_list_btn_write").hide();
			
	    //}, 20);

		// 3. 글 목록 조회
		//setTimeout(function () {
			mobile_approval_getList(_mobile_approval_list);		
	    //}, 30);
		
		// 4. 버튼 영역 표시
		//setTimeout(function () {
			mobile_approval_getDropmenuList(_mobile_approval_list);
	    //}, 40);
	} else {
		// 3. 글 목록 조회
		mobile_approval_getList(_mobile_approval_list);	
	}
	//$("meta[name=viewport]").attr("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi, viewport-fit=cover");
	
	g_ActiveModule = "";
}

// 결재함 새로고침
function mobile_approval_reload() {
	 mobile_comm_showload(); 
	 //setTimeout(function() {
			_mobile_approval_list.ListType = 'list';
			_mobile_approval_list.SearchText = '';
			_mobile_approval_list.Page = 1;
			$('#approval_list_list').html("");
			
			mobile_approval_getList(_mobile_approval_list);
			mobile_approval_showAllChk();
	 //}, 10);
	 //setTimeout(function() {
		 mobile_comm_hideload();
	 //}, 20);
}

//상단메뉴(PC 좌측메뉴) 그리기
function mobile_approval_getTopMenuHtml(approvalmenu) {	
	var l_ActiveModule = mobile_approval_getActiveModule();
	var sBusinessData1 = l_ActiveModule.toUpperCase(); // 전자결재 결재함, e-Accounting 비용결재함 구분
	
	var sHtml = "";
	var nSubLength = 0;
	var sALink = "";
	var sLeftMenuID = "";
	var sIconClass = "";
	var mTotalCnt = new Object();
	
	
	var url = "/approval/mobile/approval/getNotDocReadCnt.do";
	
	$.ajax({
		url: url,
		data: {
			businessData1: sBusinessData1
		},
		type: "post",
		async:false,
		success: function (response) {
			if(response.status == "SUCCESS") {
				mTotalCnt["Approval"] = response.user_apvNDRCnt;
				mTotalCnt["Process"] = response.user_prcNDRCnt;
				mTotalCnt["TCInfo"] = response.user_tcNDRCnt;
				mTotalCnt["Receive"] = response.dept_rcvNDRCnt;
				mTotalCnt["DeptProcess"] = response.dept_prcNDRCnt;
				mTotalCnt["DeptTCInfo"] = response.dept_tcNDRCnt;
			}
		},
		error: function (response, status, error){
			mobile_comm_ajaxerror(url, response, status, error);
		}
	});
	
	sHtml +="<ul class=\"h_tree_menu_wrap\">";
	$(approvalmenu).each(function (i, data){
		/* TODO: 기초설정값(mobileApprovalTopMenu) - 모바일에서 사용할 상단메뉴
		   값 예시: ApprovalUser;ApprovalDept;BizDoc ... 구분자(;)
		   	var topMenu = mobile_comm_getBaseConfig("mobileApprovalTopMenu", "0");
			if(topMenu.indexOf(data.Reserved1) < 0) {
				return;
			}
		*/
		if(data.Reserved1 != "ApprovalUser" && data.Reserved1 != "ApprovalDept") {
			return;
		}
		
		nSubLength = data.Sub.length;
		
		sALink = "";
		switch(data.IconClass.replace("approvalMenu", "")) {
		case "01": sIconClass = "t_ico_my"; break;
		case "02": sIconClass = "t_ico_department"; break;
		case "03": sIconClass = "t_ico_setting"; break;
		case "04": sIconClass = "t_ico_approval"; break;
		case "05": sIconClass = "t_ico_documents"; break;
		case "06": sIconClass = "t_ico_folder"; break;
		default: sIconClass = "t_ico_app"; break;
		}
		
		sHtml += "<li mode=\"" + mobile_comm_getQueryStringForUrl(data.URL, 'mode') + "\" displayname=\"" + data.DisplayName + "\">";
		sHtml += "    <div class=\"h_tree_menu\">";
		if(nSubLength > 0) {
			
			sALink = "javascript: mobile_approval_openclose('li_sub_" + data.MenuID + "', 'span_menu_" + data.MenuID + "');";
			
			sHtml += "    <ul class=\"h_tree_menu_list\">";
			sHtml += "        <li>";
			sHtml += "            <a onclick=\"" + sALink + "\" class=\"t_link not_tree\">";
			sHtml += "                <span id=\"span_menu_" + data.MenuID + "\" class=\"t_ico_open\"></span><span class=\"" + sIconClass + "\"></span>";
			sHtml += "                " + data.DisplayName; //mobile_comm_getDicInfo(data.MultiDisplayName, lang);
			sHtml += "            </a>";
			sHtml += "        </li>";
			sHtml += "    </ul>";
		} else {
			
			sALink = "javascript: mobile_approval_ChangeMenu('" + mobile_comm_getQueryStringForUrl(data.URL, 'mode') + "', this);";
			
			sHtml += "    <a onclick=\"" + sALink + "\" class=\"t_link\">";
			sHtml += "        <span class=\"" + sIconClass + "\"></span>";
			sHtml += "        " + data.DisplayName;
			sHtml += "    </a>";
		}
		sHtml += "    </div>";
		sHtml += "</li>";
		
		if(nSubLength > 0) {
			sHtml += "<li id=\"li_sub_" + data.MenuID + "\">";
			sHtml += "    <ul class=\"sub_list\">";

			var sMode = "";
			$(data.Sub).each(function (j, subdata){
				sMode = mobile_comm_getQueryStringForUrl(subdata.URL, 'mode');				
				if(sMode.toUpperCase() == "TEMPSAVE" && mobile_comm_getBaseConfig("useMobileApprovalWrite") != "Y") {
					return;
				}
				sALink = "javascript: mobile_approval_ChangeMenu('" + sMode + "', this);";
				
				sHtml += "    <li mode=\"" + sMode + "\" displayname=\"" + subdata.DisplayName + "\">";
				sHtml += "        <a onclick=\"" + sALink + "\" class=\"t_link\">";
				sHtml += "            <span class=\"t_ico_board\"></span>";
				sHtml += "            " + subdata.DisplayName; //mobile_comm_getDicInfo(subdata.MultiDisplayName, lang);
				if(sMode == "Approval" || sMode == "Receive" || sMode.indexOf("Process") > -1 || sMode.indexOf("TCInfo") > -1) {
					sHtml += "        <span class=\"txt_comment\">(" + mTotalCnt[sMode] + ")</span>";
				}
				sHtml += "        </a>";
				sHtml += "    </li>";
			});
			sHtml += "    </ul>";
			sHtml += "</li>";
		}
	});
	
	sHtml +="</ul>";
	
	return sHtml;
}

//상단 메뉴명 셋팅
function mobile_approval_getTopMenuName() {
	var oTopMenu = $('#approval_list_topmenu');
	var sTopMenu = $(oTopMenu).find("li").filter(":eq(0)").text();
	$(oTopMenu).find("li[displayname]").each(function (){
		if($(this).attr('mode') == _mobile_approval_list.Mode) {
			sTopMenu = $(this).attr('displayname');
			return false;
		}
	});
	
	//$('#approval_list_title').html(sTopMenu + "<i class=\"arr_menu\"></i>");
	//$('#board_list_title').html("<span class=\"Tit\">"+ sTopMenu + "</span>");
	$('#approval_list_title').html("<span class=\"Tit\">" + sTopMenu + "</span>");
}

//하위 메뉴/트리 열고 닫기
function mobile_approval_openclose(liId, iconId) {
	var oli = $('#' + liId);
	var ocon = $('#' + iconId);
	if($(ocon).hasClass('t_ico_open')){		
		$(ocon).removeClass('t_ico_open').addClass('t_ico_close');
		$(oli).hide();
	} else {
		$(ocon).removeClass('t_ico_close').addClass('t_ico_open');
		$(oli).show();
	}
}

//메뉴 변경
function mobile_approval_ChangeMenu(mode, obj) {
	
	if(mode == undefined || mode == 'undefined' || mode == '') {
		mode = "Approval";
	}
	
	mobile_approval_ChangeFolder(mode);
	
	// 현재선택한 메뉴에 대한 선택 정보 저장, 검색정보 초기화, 리스트 모드 초기화
	window.sessionStorage.setItem("ApprovalSelectBox", mode);
	window.sessionStorage.setItem("ApprovalSearchText", "");
	window.sessionStorage.setItem("ApprovalListType", "");
	
	// 현재 선택된 상단 메뉴 selected 표시
	$("a.t_link").removeClass("selected");
	$(obj).addClass("selected");	
	
	// 결재함 변경 후 전체선택 영역 재설정
	$("#approval_list_div_allchk").hide();
	$("#approval_list_chkcnt").html("");
	
}

//결재함 변경
function mobile_approval_ChangeFolder(mode) {
	
	if(mode == undefined || mode == 'undefined' || mode == '') {
		mode = _mobile_approval_list.Mode;
	}
	
	_mobile_approval_list.Mode = mode;
	_mobile_approval_list.SearchText = '';
	_mobile_approval_list.Page = 1;
	_mobile_approval_list.ListType = 'list';
	_mobile_approval_list.EndOfList = false;
	
	if(_mobile_approval_list.Mode == "TempSave") {
		$("#approval_search_input").attr("placeholder", mobile_comm_getDic("msg_apv_searchByTitle"));
		_mobile_approval_list.SearchType = "Subject";
	} else {
		$("#approval_search_input").attr("placeholder", mobile_comm_getDic("msg_apv_searchBy"));
		_mobile_approval_list.SearchType = "all";
	}
	
	mobile_approval_getList(_mobile_approval_list);
	mobile_approval_getDropmenuList(_mobile_approval_list);
}

//결재 목록 조회
function mobile_approval_getList(params) {
	var l_ActiveModule = mobile_approval_getActiveModule();
	var sBusinessData1 = l_ActiveModule.toUpperCase(); // 전자결재 결재함, e-Accounting 비용결재함 구분
	
	mobile_comm_TopMenuClick('approval_list_topmenu',true);
    $('#approval_list_more').hide();
	
    // 문서연결 팝업인 경우 현재 실행중인 모듈 상관없이 전자결재 리스트 조회
    if(window.sessionStorage.getItem("approval_isDocSelect") != null && window.sessionStorage.getItem("approval_isDocSelect") != "" && window.sessionStorage.getItem("approval_isDocSelect") == "Y") {
    	sBusinessData1 = "APPROVAL";
    }
    
	var url = "/approval/mobile/approval/getMobileApprovalListData.do";
	var paramdata = {
		userID: mobile_comm_getSession("USERID"),
		deptID: mobile_comm_getSession("GR_Code"),
		mode: params.Mode,
		titleNm: "",
		userNm: "", //mobile_comm_getSession("USERNAME"),
		pageNo: params.Page,
		pageSize: params.PageSize,
		searchType: params.SearchType,
		searchWord: params.SearchText,
		businessData1: sBusinessData1
	};
	var listname = "";
	
	$.ajax({
		url: url,
		data: paramdata,
		type: "post",
		async: false,
		success: function (response) {
			if(response.status == "SUCCESS") {
				
				_mobile_approval_list.TotalCount = response.page.listCount; //response.totalcount;
				
				var sHtml = "";
				if(params.ListMode == "normal") {
					sHtml = mobile_approval_getListHtml(response.list);
				} else if(params.ListMode == "docSelect") {
					sHtml = mobile_approval_getDocListHtml(response.list);
				}
				
				if(_mobile_approval_list.ListType == "search") {
					listname = "approval_list_searchlist";
				} else {
					listname = "approval_list_list";
				}
				
				if(params.Page == 1) {
					$('#' + listname).html(sHtml);
				} else {
					$('#' + listname).append(sHtml);
				}
				
				if (Math.min((_mobile_approval_list.Page) * _mobile_approval_list.PageSize, _mobile_approval_list.TotalCount) == _mobile_approval_list.TotalCount) {
					_mobile_approval_list.EndOfList = true;
	                $('#approval_list_more').hide();
	            } else {
	                $('#approval_list_more').show();
	            }
				
				//mobile_comm_hideload();
			}
		},
		error: function (response, status, error){
			mobile_comm_ajaxerror(url, response, status, error);
		}
	});
	
	if(params.ListMode == "normal") {
		// 메뉴명 셋팅
		mobile_approval_getTopMenuName();
	}
	
	//checkbox show
	$('#' + listname).trigger("create");
}

var _mobile_approval_profileImagePath = mobile_comm_noperson();

//목록 그리기
function mobile_approval_getListHtml(apvlist) {
	var sHtml = "";
	
	var sUrl = "";
	var sEmer = "";
	var sSec = "";
	var sFile = "";
	var sDate = "";
	var sName = "";
	var sSubject = "";
	var sRead = "";
	var bUseTotalApproval = mobile_comm_getBaseConfig("useTotalApproval");
	
	if(apvlist.length > 0) {
		$(apvlist).each(function (i, apvitem){
			//미결함
			//ProcessID,WorkItemID,PerformerID,FormPrefix,InitiatorID,InitiatorName,InitiatorUnitID,InitiatorUnitName,UserCode,UserName,SubKind,ProcessDescriptionID,
			//FormInstID,FormID,FormName,FormSubject,IsSecureDoc,IsFile,FileExt,IsComment,ApproverCode,ApproverName,ApprovalStep,ApproverIPAddress,
			//IsReserved,ReservedGubun,ReservedTime,Priority,IsModify,Reserved1,Reserved2,Created,FormSubKind,TaskID,ReadDate,ExtInfo
			
			//완료함
			//ProcessArchiveID,PerformerID,WorkitemArchiveID,FormPrefix,InitiatorID,InitiatorName,InitiatorUnitID,InitiatorUnitName,UserCode,UserName,SubKind,ProcessDescriptionArchiveID,
			//FormInstID,FormID,FormName,FormSubject,IsSecureDoc,IsFile,FileExt,IsComment,DocNo,ApproverCode,ApproverName,ApprovalStep,ApproverSIPAddress,
			//IsReserved,ReservedGubun,ReservedTime,Priority,IsModify,Reserved1,Reserved2,EndDate,FormSubKind,ExtInfo
			
			//임시함
			//FormTempInstBoxID,FormInstID,FormID,SchemaID,FormInstTableName,UserCode,FormPrefix,CreatedDate,SubKind,Subject,Kind,FormName,FormSubject

			var sUrl_Module = "approval";
			var archived = "false";
			var g_mode = _mobile_approval_list.Mode;
			var mode = "";
			var gloct = "";
			var subkind = "";
			var userID = "";
			var gotoUrl = "view";
			var bAccount = false;
			
			apvitem.FormSubject = mobile_approval_replaceCharacter(apvitem.FormSubject);
			apvitem.Subject = mobile_approval_replaceCharacter(apvitem.Subject);
			
			switch (g_mode){
				//개인함
				case "PreApproval" 		: mode = "PREAPPROVAL"; gloct = "PREAPPROVAL"; subkind="T010"; userID=apvitem.UserCode; break; // 예고함
				case "Approval" 		: mode = "APPROVAL"; gloct = "APPROVAL"; subkind=apvitem.FormSubKind; userID=apvitem.UserCode; break;    // 미결함
				case "Process" 			: mode = "PROCESS"; gloct = "PROCESS"; subkind=apvitem.FormSubKind; userID=apvitem.UserCode; break;		// 진행함
				case "Complete" 		: mode = "COMPLETE"; gloct = "COMPLETE"; subkind=apvitem.FormSubKind; archived="true"; userID=apvitem.UserCode; break;	// 완료함
				case "Reject" 			: mode = "REJECT"; gloct = "REJECT";  subkind=apvitem.FormSubKind; archived="true"; userID=apvitem.UserCode; break;		// 반려함
				case "TempSave" 		: mode = "TEMPSAVE"; gloct = "TEMPSAVE"; gotoUrl="write"; break;	// 임시함
				case "TCInfo" 			: mode = "COMPLETE"; gloct = "TCINFO"; subkind=apvitem.FormSubKind; break;		// 참조/회람함
				//부서함
				case "DeptComplete"		: mode = "COMPLETE"; gloct = "DEPART"; subkind="A"; archived="true"; userID = apvitem.UserCode; break; // 완료함
				case "SenderComplete" 	: mode = "COMPLETE"; gloct = "DEPART"; subkind="S"; archived="true"; userID = apvitem.UserCode; break;    // 발신함
				case "Receive" 			: mode = "REDRAFT"; gloct = "DEPART"; subkind=apvitem.FormSubKind; userID = apvitem.UserCode; break;		// 수신함
				case "ReceiveComplete" 	: mode = "COMPLETE"; gloct = "DEPART"; subkind="REQCMP"; archived="true"; userID = apvitem.UserCode; break;	// 수신처리함
				case "DeptTCInfo" 		: mode = "COMPLETE"; gloct = "DEPART"; subkind=apvitem.FormSubKind; userID = apvitem.ReceiptID; break;		// 참조/회람함
				case "DeptProcess" 		: mode = "PROCESS"; gloct = "DEPART"; subkind=apvitem.FormSubKind; userID = apvitem.UserCode; break;	// 진행함
			}
			
			// 통합결재 사용 시 e-Accounting 조회 여부 체크
			if(bUseTotalApproval == "Y" && apvitem.BusinessData1 == "ACCOUNT") {
				bAccount = true;
				sUrl_Module = "account";
			}
			
			sUrl = "/" + sUrl_Module + "/mobile/" + sUrl_Module + "/" + gotoUrl + ".do";
			sUrl += "?mode=" + mode;
			if(bAccount) {
				sUrl += "&expAppID=" + apvitem.BusinessData2;	//비용 결재문서의 경비신청서 키값
				sUrl += "&isTotalApv=" + bUseTotalApproval;		//통합결재 내 조회여부
				sUrl += "&taskID="+ apvitem.TaskID; 			//승인 요청할 활성 TaskID
			}
			if(mode != "TEMPSAVE") {
				var processID = (apvitem.ProcessID == undefined ? apvitem.ProcessArchiveID : apvitem.ProcessID);
				processID = (processID == undefined ? '' : processID);
				var workitemID = (apvitem.WorkItemID == undefined ? apvitem.WorkitemArchiveID : apvitem.WorkItemID);
				workitemID = (workitemID == undefined ? '' : workitemID);
				var performerID = apvitem.PerformerID;
				performerID = (performerID == undefined ? '' : performerID);
				var processDescriptionID = (apvitem.ProcessDescriptionID == undefined ? apvitem.ProcessDescriptionArchiveID : apvitem.ProcessDescriptionID);
				processDescriptionID = (processDescriptionID == undefined ? '' : processDescriptionID);
				
				sUrl += "&processID=" + processID;
				sUrl += "&workitemID=" + workitemID;
				sUrl += "&performerID=" + performerID;
				sUrl += "&processdescriptionID=" + processDescriptionID;
			}
			sUrl += "&userCode=" + userID;
			sUrl += "&gloct=" + gloct;
			sUrl += "&formID=" + (apvitem.FormID == undefined ? '' : apvitem.FormID);
			sUrl += "&forminstanceID=" + apvitem.FormInstID;
			if(mode == "TEMPSAVE") {
				sUrl += "&formtempID=" + apvitem.FormTempInstBoxID;
				sUrl += "&forminstancetablename=" + apvitem.FormInstTableName;
				sUrl += "&open_mode=" + mode;
			}
			sUrl += "&archived=" + archived;
			sUrl += "&subkind=" + subkind;			
			sUrl += "&formPrefix=" + apvitem.FormPrefix;
			sUrl += "&isMobile=Y";
			sUrl += "&admintype=&usisdocmanager=true&listpreview=N";	
			sUrl += "&page=" + _mobile_approval_list.Page;
			sUrl += "&totalcount=" + _mobile_approval_list.TotalCount;
			sUrl += "&listmode=" + g_mode;
			sUrl += "&searchtext=" + _mobile_approval_list.SearchText;
			
			sFile = "";
			sEmer = "";
			sSec = "";
			sDate = "";
			sName = "";
			sRead = "read";
			
			if(apvitem.IsFile == "Y") {
				sFile = "<span class=\"ico_file_clip\"></span>";
			}
			if(apvitem.Priority == "5") {
				sEmer = "<span class=\"flag_cr01\">" + mobile_comm_getDic("lbl_apv_surveyUrgency") + "</span>"; //긴급
			}
			if(apvitem.IsReserved == "Y") {
				sEmer += "<span class=\"flag_cr01\">" + mobile_comm_getDic("lbl_apv_hold") + "</span>"; //보류
			}
			if(apvitem.IsSecureDoc == "Y") {
				sSec = "<span class=\"ico_lock02\"></span>";
			}
			if(apvitem.ReadDate == "") {
				sRead = "unread";
			}
			if(_mobile_approval_list.Mode != "TempSave") {
				sDate += "<span class=\"date\">";
				if(g_mode == "PreApproval" || g_mode == "Approval" || g_mode == "Receive" || g_mode == "DeptProcess") { //예고함, 미결함, 부서수신함, 진행함(부서)
					sDate += mobile_comm_getDateTimeString2('list', apvitem.Created);
				} else if(g_mode == "Process") { //진행함 (개인)					
					sDate += mobile_comm_getDateTimeString2('list', apvitem.Finished);
				} else if(g_mode.indexOf("Complete") > -1 || _mobile_approval_list.Mode == "Reject") { //완료함/반려함, 부서완료함/발신함/수신처리함
					sDate += mobile_comm_getDateTimeString2('list', apvitem.EndDate);
				} else if(g_mode.indexOf("TCInfo") > -1) { //참조/회람함 (부서, 개인)
					sDate += mobile_comm_getDateTimeString2('list', apvitem.RegDate);
				}
				sDate += "</span>";
			}			
			//임시함은 Date X
			
			if(g_mode != "TempSave") {
				sName = "<span class=\"\">" + apvitem.InitiatorName + "</span>";
				sSubject = apvitem.FormSubject;
			} else {
				sSubject = apvitem.Subject;
			}
			
			if((g_mode == "Approval" || g_mode == "Receive" || g_mode.indexOf("TCInfo") > -1) && (apvitem.ReadDate == null || apvitem.ReadDate == '0000-00-00 00:00:00'))
				sSubject = "<strong>" + sSubject + "</strong>";
			
			sHtml += "<li>";

			if(mode == "APPROVAL" || mode == "RECEIVE" || g_mode.toUpperCase().indexOf("TCINFO") > -1 || mode == "REJECT" || mode == "TEMPSAVE") {
				sHtml += "	<div class=\"checkbox\">";
				if(mode == "TEMPSAVE" || (apvitem.ExtInfo != undefined && (apvitem.ExtInfo.UseBlocApprove == "Y" || apvitem.ExtInfo.UseBlocCheck == "Y"))) {
					sHtml += "	<input type=\"checkbox\" name=\"approval_list_chkbox\" value='" + JSON.stringify(apvitem) + "' id=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\" onchange=\"mobile_approval_showAllChk();\">";
				} else {
					sHtml += "	<input type=\"checkbox\" name=\"approval_list_chkbox\" value='" + JSON.stringify(apvitem) + "' id=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\" disabled=\"disabled\">";
				}
				sHtml += "		<label for=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\"></label>";
				sHtml += "	</div>";
			} else {
				sHtml += "	<div class=\"checkbox\" style=\"display: none;\">";
				sHtml += "		<input type=\"checkbox\" name=\"approval_list_chkbox\" value='" + JSON.stringify(apvitem) + "' id=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\" disabled=\"disabled\">";
				sHtml += "		<label for=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\"></label>";
				sHtml += "	</div>";
			}
			
			if(g_mode != "TempSave") {
				sHtml += "	<div class=\"staff_list\">";
				sHtml += "		<a onclick=\"mobile_approval_showDetailList(this);\" class=\"open staff\">";
				
				sHtml += "			<span class=\"photo\" style=\"background-image:url('" + apvitem.PhotoPath + "'), url('" + _mobile_approval_profileImagePath + "');\"></span>";
				
	            sHtml += "			<span class=\"arr\"></span>";
	            sHtml += "		</a>";
			} else {
				sHtml += "	<div class=\"staff_list\" style=\"width: 10px;\">";
			}
        	sHtml += "	</div>";
			
			sHtml += "	<div class=\"txt_area\">";	//TODO: 결재문서로 이동
			sHtml += "	  <a href=\"javascript: mobile_approval_goView('" + sUrl + "', '" + apvitem.FormPrefix + "');\">";
			sHtml += "		<p class=\"title "+ sRead +"\">" + sEmer + sSec + sSubject + sFile + "</p>";
			sHtml += "		<div class=\"list_info\">";
			sHtml += "			<span class=\"point_cr\">" + apvitem.SubKind + "</span>";
			sHtml += sName;	//TODO: 홍길등 팀장> 직급?표시해야 함??
			sHtml += sDate;
			sHtml += "			<span>" + mobile_comm_getDicInfo(apvitem.FormName) + "</span>"; //임시
			//sHtml += "				<span class=\"name\">" + apvitem.FormName + "</span>";
			sHtml += "		</div>";
			sHtml += "	  </a>";
			sHtml += "	</div>";
			sHtml += "</li>";
			
			// 결재 현황 상세 조회
			sHtml += "<li class=\"approval_line\"><div class=\"scr_h\"></div></li>";
		});
	} else {
		sHtml += "<div class=\"no_list\">";
		sHtml += "    <p>" + mobile_comm_getDic("msg_NoDataList") + "</p>";//조회할 목록이 없습니다.
		sHtml += "</div>";
	}
	
	return sHtml;
}

//목록 그리기(문서연결)
function mobile_approval_getDocListHtml(apvlist) {
	var sHtml = "";
	
	var sDate = "";
	var sName = "";
	var sSubject = "";
	var bUseTotalApproval = mobile_comm_getBaseConfig("useTotalApproval");
	
	if(apvlist.length > 0) {
		$(apvlist).each(function (i, apvitem){
			var sUrl_Module = "approval";
			var archived = "false";
			var g_mode = _mobile_approval_list.Mode;
			var mode = "";
			var gloct = "";
			var subkind = "";
			var userID = "";
			var gotoUrl = "view";
			var bAccount = false;
			var sUrl = ""; 
			
			switch (g_mode){
				//개인함
				case "Complete" 		: mode = "COMPLETE"; gloct = "COMPLETE"; subkind=apvitem.FormSubKind; archived="true"; userID=apvitem.UserCode; break;	// 완료함
				case "TCInfo" 			: mode = "COMPLETE"; gloct = "TCINFO"; subkind=apvitem.FormSubKind; break;		// 참조/회람함
				//부서함
				case "DeptComplete"		: mode = "COMPLETE"; gloct = "DEPART"; subkind="A"; archived="true"; userID = apvitem.UserCode; break; // 완료함
				case "ReceiveComplete" 	: mode = "COMPLETE"; gloct = "DEPART"; subkind="REQCMP"; archived="true"; userID = apvitem.UserCode; break;	// 수신처리함
				case "DeptTCInfo" 		: mode = "COMPLETE"; gloct = "DEPART"; subkind=apvitem.FormSubKind; break;		// 참조/회람함
			}
			
			// 통합결재 사용 시 e-Accounting 조회 여부 체크
			if(bUseTotalApproval == "Y" && apvitem.BusinessData1 == "ACCOUNT") {
				bAccount = true;
				sUrl_Module = "account";
			}
			
			sUrl = "/" + sUrl_Module + "/mobile/" + sUrl_Module + "/" + gotoUrl + ".do";
			sUrl += "?mode=" + mode;
			if(bAccount) {
				sUrl += "&expAppID=" + apvitem.BusinessData2;	//비용 결재문서의 경비신청서 키값
				sUrl += "&isTotalApv=" + bUseTotalApproval;		//통합결재 내 조회여부
			}
			sUrl += "&processID=" + (apvitem.ProcessID == undefined ? apvitem.ProcessArchiveID : apvitem.ProcessID);
			sUrl += "&workitemID=" + (apvitem.WorkItemID == undefined ? apvitem.WorkitemArchiveID : apvitem.WorkItemID);
			sUrl += "&performerID=" + apvitem.PerformerID;
			sUrl += "&processdescriptionID=" + (apvitem.ProcessDescriptionID == undefined ? apvitem.ProcessDescriptionArchiveID : apvitem.ProcessDescriptionID);			
			sUrl += "&userCode=" + userID;
			sUrl += "&gloct=" + gloct;
			sUrl += "&formID=" + apvitem.FormID;
			sUrl += "&forminstanceID=" + apvitem.FormInstID;
			sUrl += "&archived=" + archived;
			sUrl += "&subkind=" + subkind;			
			sUrl += "&formPrefix=" + apvitem.FormPrefix;
			sUrl += "&isMobile=Y";
			sUrl += "&admintype=&usisdocmanager=true&listpreview=N";	
			sUrl += "&page=" + _mobile_approval_list.Page;
			sUrl += "&totalcount=" + _mobile_approval_list.TotalCount;
			sUrl += "&listmode=" + g_mode;
			sUrl += "&searchtext=" + _mobile_approval_list.SearchText;
			
			sDate = "";
			sName = "";
			
			if(_mobile_approval_list.Mode != "TempSave") {
				sDate += "<span class=\"date\">";
				if(g_mode.indexOf("Complete") > -1) { //완료함, 부서완료함/수신처리함
					sDate += mobile_comm_getDateTimeString2('list', CFN_TransLocalTime(apvitem.EndDate));
				} else if(g_mode.indexOf("TCInfo") > -1) { //참조/회람함 (부서, 개인)
					sDate += mobile_comm_getDateTimeString2('list', CFN_TransLocalTime(apvitem.RegDate));
				}
				sDate += "</span>";
			}
			
			sName = "<span class=\"\">" + apvitem.InitiatorName + "</span>" + "<span class=\"\">" + apvitem.InitiatorUnitName + "</span>";
			sSubject = mobile_approval_replaceCharacter(apvitem.FormSubject);
			
			sHtml += "<li>";

			sHtml += "	<div class=\"checkbox\">";
			sHtml += "		<input type=\"checkbox\" name=\"approval_list_chkbox\" value='" + JSON.stringify(apvitem) + "' id=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\" onchange=\"mobile_approval_showAllChk();\">";
			sHtml += "		<label for=\"chk_" + g_mode + "_" + _mobile_approval_list.Page + "_" + i + "\"></label>";
			sHtml += "	</div>";
			
			sHtml += "	<div class=\"staff_list\">";
			sHtml += "		<a onclick=\"mobile_approval_showDetailList(this);\" class=\"open staff\">";
			
			sHtml += "			<span class=\"photo\" style=\"background-image:url('" + apvitem.PhotoPath + "'), url('" + _mobile_approval_profileImagePath + "');\"></span>"; //apvitem.
			
            sHtml += "			<span class=\"arr\"></span>";
            sHtml += "		</a>";
        	sHtml += "	</div>";
			
			sHtml += "	<div class=\"txt_area\">";	//TODO: 결재문서로 이동
			sHtml += "	  <a href=\"javascript: mobile_comm_go('" + sUrl + "', 'Y');\">";
			sHtml += "		<p class=\"title\">" + sSubject + "</p>";
			sHtml += "		<div class=\"list_info\">";
			sHtml += "			<span class=\"point_cr\">" + apvitem.SubKind + "</span>";
			sHtml += sName;	//TODO: 홍길등 팀장> 직급?표시해야 함??
			sHtml += sDate;
			sHtml += "			<span>" + apvitem.FormName + "</span>"; //임시
			sHtml += "		</div>";
			sHtml += "	  </a>";
			sHtml += "	</div>";
			sHtml += "</li>";
		});
	} else {
		sHtml += "<div class=\"no_list\">";
		sHtml += "    <p>" + mobile_comm_getDic("msg_NoDataList") + "</p>"; //조회할 목록이 없습니다.
		sHtml += "</div>";
	}
	
	return sHtml;
}

//전체선택 div show or hide
function mobile_approval_showAllChk() {
	$("#approval_list_div_allchk").hide();
	var cnt = 0;
	var obj = $("input[type=checkbox][name=approval_list_chkbox]");
	var objcnt = obj.length;
	for(var i = 0; i < objcnt; i++) {
		if($(obj).eq(i).is(":checked")) {
			$("#approval_list_div_allchk").show();
			if(_mobile_approval_list.ListMode == "docSelect") $(".r_drop_menu").hide();
			else $(".r_drop_menu").show();
			cnt++;
		}
	}
	if(cnt != 0) {
		$("#approval_list_chkcnt").html(cnt);
		if($("#approval_list_list").find("input[type=checkbox][name=approval_list_chkbox]:not([disabled=disabled])").length > cnt) {
			$("#approval_list_allchk").prop("checked", false).checkboxradio('refresh');
		} else {
			$("#approval_list_allchk").prop("checked", true).checkboxradio('refresh');
		}
	}
}

//전체선택 checkbox change
function mobile_approval_checkAll(obj) {
	if($(obj).is(":checked")) {
		$("#approval_list_list").find("input[type=checkbox][name=approval_list_chkbox]:not([disabled=disabled])").prop("checked", true).checkboxradio('refresh');
	} else {
		$("#approval_list_list").find("input[type=checkbox][name=approval_list_chkbox]").prop("checked", false).checkboxradio('refresh');
	}
	mobile_approval_showAllChk();
}

//더보기 클릭
function mobile_approval_nextlist () {
	
	if (!_mobile_approval_list.EndOfList) {
		_mobile_approval_list.Page++;

		mobile_approval_getList(_mobile_approval_list);
		mobile_approval_showAllChk();
    } else {
        $('#approval_list_more').hide();
    }
}

//스크롤 더보기
function mobile_approval_list_page_ListAddMore() {
	mobile_approval_nextlist();
}

function mobile_approval_goView(pUrl, pFormPrefix) {
	if(pFormPrefix == "WF_FORM_DRAFT_HWP" || pFormPrefix == "WF_FORM_DRAFT_HWP_MULTI") {
		alert(mobile_comm_getDic("msg_checkhancom")); // 아래한글 양식은 PC에서만 확인 가능합니다.
	} else {		
		mobile_comm_showload();
		// 결재문서 조회 팝업
		mobile_comm_go(pUrl, "Y");
	}
}

//작성 버튼 클릭
function mobile_approval_clickwrite(pFormPrefix) {
	var sUrl = "/approval/mobile/approval/write.do?open_mode=DRAFT";
	
	// 양식을 지정하여 작성창을 여는 경우
	if(pFormPrefix) {
		sUrl += "&formPrefix=" + pFormPrefix;
	}
	
	if(_mobile_approval_write.FormID != '') {
		_mobile_approval_write = {			
			Mode: 'DRAFT',		//새로 작성인지 수정인지 등등(CREATE/REPLY/UPDATE/REVISION/MIGRATE)
			ApvLineMode: 'approval',	//결재선 모드(결재:approval, 참조:tcinfo, 배포:distribution)
			OpenMode: 'DRAFT',	//작성 페이지 open mode(DRAFT: 기안, APVLIST: 결재선, TEMPSAVE: 임시함, MODIFY: 편집)
			ListMode: 'Approval',
			ProcessID: "",			//Process ID
			WorkitemID: "",			//WorkItem ID
			PerformerID: "",			//Performer ID
			ProcessDescriptionID: "",
			UserCode: "",
			Gloct: "",
			FormID: "",			//Form ID
			FormInstID: "",
			FormTempID: "",
			FormInstTableName: "",
			Archived: "",
			SubKind: "",
			FormPrefix: "",			//Form Prefix
			IsMobile: "",
			
			Config: {}
		};
	}
	isLoad = "N";
	isApvMod = "Y";
	mobile_comm_go(sUrl, "Y");
}

//결재선/편집/재사용 버튼 클릭
function mobile_approval_clickmodify(open_mode) {
	window.sessionStorage["open_mode"] = open_mode;
	
	var sUrl = "/approval/mobile/approval/write.do";
	if(open_mode == "MODIFY") {
		var isApvLineChg = "N";
		if(getInfo("ApprovalLine") != $("#APVLIST").val()){
			isApvLineChg = "Y";
		}
		isLoad = "N";
		//sUrl += "?" + location.href.split("?")[1].replace("#", "").replace("&editMode=", "").replace("&editMode=N", "").replace("&reuse=", "") + "&editMode=Y&reuse=&isApvLineChg="+isApvLineChg;
		sUrl += "?" + $("#approval_view_page").attr("data-url").split("?")[1].replace("#", "").replace("&editMode=", "").replace("&editMode=N", "").replace("&reuse=", "") + "&editMode=Y&reuse=&isApvLineChg="+isApvLineChg;
		
		alert(mobile_comm_getDic("msg_board_donotSaveInlineImage"));
		mobile_comm_back(sUrl);
	} else {
		sUrl = $("#approval_view_page").attr("data-url").replace("view.do", "write.do")+"&editMode=N&isApvLineChg=N";
		
		if(open_mode == "REUSE") {
			isLoad = "N";
			sUrl = sUrl.replace("&reuse=", "&reuse=Y");
		}
		
		mobile_comm_go(sUrl, 'Y');
	}
}

//드롭메뉴(PC 버튼 영역) 조회
function mobile_approval_getDropmenuList(params) {
	$("#approval_list_dropmenuitems").empty();
	$("#approval_list_dropmenu").closest("div").css("display", "").closest("div").removeClass("show");	
	var sHtml = "";
	if(params.Mode.toUpperCase() == "APPROVAL") {
		sHtml += "<li><a onclick=\"mobile_approval_batchApproval('APPROVAL');\">" + (mobile_comm_getDic("btn_apv_blocApprove") == "" ? "일괄결재" : mobile_comm_getDic("btn_apv_blocApprove")) + "</a></li>"; //일괄결재
		sHtml += "<li><a onclick=\"mobile_approval_doDocRead();\">" + (mobile_comm_getDic("lbl_apv_ReadCheck") == "" ? "읽음확인" : mobile_comm_getDic("lbl_apv_ReadCheck")) + "</a></li>"; //읽음확인
	}
	if(params.Mode.toUpperCase() == "RECEIVE") {
		sHtml += "<li><a onclick=\"mobile_approval_batchApproval('DEPT');\">" + (mobile_comm_getDic("btn_apv_blocReceipt") == "" ? "일괄접수" : mobile_comm_getDic("btn_apv_blocReceipt")) + "</a></li>"; //일괄접수
		sHtml += "<li><a onclick=\"javascript: alert('" + mobile_comm_getDic("msg_com_furtherDev") + "');\">" + (mobile_comm_getDic("btn_apv_blocApvline") == "" ? "일괄결재선" : mobile_comm_getDic("btn_apv_blocApvline")) + "</a></li>"; //일괄결재선
		sHtml += "<li><a onclick=\"javascript: alert('" + mobile_comm_getDic("msg_com_furtherDev") + "');\">" + (mobile_comm_getDic("btn_apv_blocCharge") == "" ? "일괄담당자" : mobile_comm_getDic("btn_apv_blocCharge")) + "</a></li>"; //일괄담당자
		sHtml += "<li><a onclick=\"mobile_approval_doDocRead();\">" + (mobile_comm_getDic("lbl_apv_ReadCheck") == "" ? "읽음확인" : mobile_comm_getDic("lbl_apv_ReadCheck"))  + "</a></li>"; //읽음확인
	}
	if(params.Mode.toUpperCase().indexOf("TCINFO") > -1) {
		sHtml += "<li><a onclick=\"mobile_approval_doDocRead();\">" + (mobile_comm_getDic("lbl_apv_ReadCheck") == "" ? "읽음확인" : mobile_comm_getDic("lbl_apv_ReadCheck")) + "</a></li>"; //읽음확인
	}
	if(params.Mode.toUpperCase() == "REJECT" || params.Mode.toUpperCase() == "TEMPSAVE") {
		sHtml += "<li><a onclick=\"mobile_approval_deleteCheck('" + params.Mode + "');\">" + (mobile_comm_getDic("btn_apv_delete") == "" ? "삭제" : mobile_comm_getDic("btn_apv_delete")) + "</a></li>"; //삭제
	}
	if(sHtml != "")
		$("#approval_list_dropmenuitems").append(sHtml);
	else
		$("#approval_list_dropmenu").closest("div").css("display", "none");
}

function mobile_approval_clickDropmenu(obj) {
	if($(obj).closest("div").hasClass("show"))
		$(obj).closest("div").removeClass("show");
	else
		$(obj).closest("div").addClass("show");
}

/*!
 * 
 * 결재 현황
 * 
 */

//결재 현황 상세 조회
function mobile_approval_showDetailList(obj){
	if($(obj).closest('li').hasClass("show")) {
		$(obj).closest('li').removeClass("show");
	} else {
		$(obj).closest('li').addClass("show");
		
		var apvitem = JSON.parse($(obj).closest(".staff_list").siblings(".checkbox").find("input[type=checkbox]").val());
		var selectParams = {"ProcessID": apvitem.ProcessID == undefined ? apvitem.ProcessArchiveID : apvitem.ProcessID, "FormInstID":  apvitem.FormInstID};
		$.ajax({
			url:"/approval/mobile/approval/getDomainListData.do",
			type:"post",
			data: selectParams,
			async:false,
			success:function (data) {
				var dataobj = JSON.stringify(data.list[0].DomainDataContext);
				var objGraphicList = ApvGraphicView.getGraphicData(dataobj);
				$(obj).closest("li").next("li.approval_line").find("div.scr_h").html(ApvGraphicView.getGraphicHtml(objGraphicList));
			},
			error:function(response, status, error){
				mobile_comm_ajaxerror("/approval/mobile/approval/getDomainListData.do", response, status, error);
			}
		});
	}
}

var ApvGraphicView = {
	conf: {
	  "debug": false
	},
	target: function($clicked){
	  return $clicked.closest('tr').next();
	},
	getGraphicData: function (apvList, isSetPhoto) {
		
	  // 기본값 true
	  if(isSetPhoto == undefined)
	    isSetPhoto = true;
		
	  var oApvList = JSON.parse(apvList);
	  var $$_elmList = $$(oApvList).find("steps > division");
	  var divisions = [];
	  var me = this;
	
	  $$_elmList.concat().each(function (index_div, $$_odiv) {
	    var $$_osteps = $$_odiv.find("step").concat();
	    var $$_ohiddensteps = $$_odiv.find("step > taskinfo[visible='n']");
	    var hiddenStepsCount = $$_ohiddensteps.valLength();
	    var steps=[];
	    var stepslength = $$_osteps.length;
	    
	    $$_osteps.each(function (index_step, $$_ostep) {
	      var step = {
	    	divisiontype: $$_odiv.attr("divisiontype"),
	        allottype: $$_ostep.attr('allottype'),
	        unittype: $$_ostep.attr('unittype'),
	        routetype: $$_ostep.attr('routetype'),
	        substeps: []
	      };
	      
	      if($$_ostep.attr('unittype') == "person") {
	    	  step["person_taskinfo_kind"] = $$_ostep.find("person>taskinfo").attr("kind");
	      }
	
	      step['kind'] = me.getStepTitle(step);
	
	      var $$_osteptaskinfo = $$_ostep.find("taskinfo");
	      if ($$_osteptaskinfo.exist() && $$_osteptaskinfo.attr("visible") != 'n' && $$_osteptaskinfo.attr("kind") != "bypass") {
	        var steproutetype = $$_ostep.attr("routetype");
	        var stepunittype = $$_ostep.attr("unittype");
	        var assureouvisible = false;
	
	        if (steproutetype == "notify") {
	          return;
	        } else {
	          if (stepunittype == "ou" && (steproutetype == "assist" || steproutetype == "consult" || steproutetype == "receive" || steproutetype == "audit")) {
	            assureouvisible = true;
	          }
	          if(index_div == 1 && stepslength == 1 && $$_ostep.find("role").length > 0){			// 담당업무함일 경우 부서처럼 처리
	          	assureouvisible = true;
	          }
	          var $$_oous = $$_ostep.find("ou");
	          var $$_ohiddenoous = $$_ostep.find("ou > taskinfo[visible='n']");
	
	          $$_ostep.find("ou").concat().each(function (index_ou, $$_oou) {
	            var substep = {
	          	dpath:'',
	              photo:'',
	              name:'',
	              comment: "",
	              dept:'',
	              date: '',
	              state: '',
	              signImage: '',
	              substeps: []
	            };
	
	            var $$_ooutaskinfo = $$_oou.find(">taskinfo").length != 0 ? $$_oou.find(">taskinfo") : $$_oou.find("taskinfo");
	            var personRoleCount = $$_oou.find("person,role").valLength();
	            var $$_ohiddenpersons = $$_oou.find("person>taskinfo[visible='n'], role>taskinfo[visible='n']");
	            var hiddenPersonsCount = $$_ohiddenpersons.valLength();
	            var cntvisibleperson = personRoleCount - hiddenPersonsCount;
	
	            if (assureouvisible) {
	              var displayname = "";
	              var code = "";
	              var stepUnitType;
	
	              displayname = $$_oou.attr("name");
	              code = $$_oou.attr("code");
	
	              if ($$_oou.parent().nodename() == "step") {
	                stepUnitType = $$_oou.parent().attr("unittype");
	              }
	
	              substep['name'] = me.getDisplayName(displayname);
	              substep['dept'] = '';
	              substep['date'] = me.getDate($$_ooutaskinfo);
	              substep['state'] = me.getState($$_ooutaskinfo);
	              
	              if(substep['state'] == 'wait'){
	              	substep['waitCircle'] = 'cirBlue';
	              }else if($$_ooutaskinfo.attr("result") == "rejected" && substep['state'] == 'no'){
	              	substep['waitCircle'] = 'cirRed';
	              }else{
	              	substep['waitCircle'] = 'cirCle';
	              }
	              
	              substep['comment'] = $$_ooutaskinfo.children('comment').text();
	              substep['code'] = code;
	              substep['photo'] = '';//me.getPhotoPath(code, stepUnitType);
	              substep['signImage'] = '';
	              substep['index_total'] = '';
	              substep['dpath'] = $$_oou.path();
	              
	              //내부 결재선
	              var persons = $$_oou.find("person, role").concat();
	              var oSubsteps = me.getSubSteps(persons, step, index_div);
	              substep['position'] = '';
	              substep['substeps'] = substep['substeps'].concat(oSubsteps.substeps);
	
	              step.substeps.push(substep);
	
	              if(substep['state']=='wait') step.state = 'wait';
	              
	            } else {
	
	              var persons = $$_oou.find("person, role").concat();
	
	              var oSubsteps = me.getSubSteps(persons, step, index_div);
	              if(oSubsteps.stepstate=='wait') step.state = 'wait';
	
	              step.substeps = step.substeps.concat(oSubsteps.substeps);
	            }
	          });
	        }
	      }
	      steps.push(step);
	    });
	    divisions.push({steps: steps});
	  });
	    
	  // 사용자 프로필 이미지 한번에 조회하여 세팅
	  if(isSetPhoto){
		  var userCodes = "";
		  var tempDivision = {};
		  $$(tempDivision).append("division", divisions);
		  var codeArr = $$(tempDivision).find("division").concat().find("steps").concat().find("substeps").concat().attr("code");

		  if(codeArr.length > 0){
			  $(codeArr).each(function(){
				  userCodes += this + ";";
			  });
			  var photoPathObj = mobile_approval_getProfileImagePath(userCodes);
			  $(photoPathObj).each(function(i, photo){
				  $$(tempDivision).find("division").concat().find("steps").concat().find("substeps[code="+photo.UserCode+"]").concat().each(function(j, substep){
					  $$(substep).attr("photo", photo.PhotoPath);
				  });
			  });
		  }
	  }
	
	  if(this.conf.debug && window.console) {
	    //console.log('apvList===>', apvList);
	    //console.log('divisions===>', divisions);
	  }
	
	
	  return divisions;
	
	},
	getSubSteps: function($$_opersons, oStep, index_div){
	  var me = this;
	  var substeps = [];
	  var stepstate = '';
	  $$_opersons.each(function (index_person, $$_operson) {
	
	    var index_total = index_div + 1;
	
	    var $$_otaskinfo = $$_operson.find("taskinfo");
	
	    if ($$_otaskinfo.attr("visible") != 'n') {
	      //get substep
	      var substep = me.getSubStep($$_operson, $$_otaskinfo);
	      substep['index_total'] = index_total;
	
	      if(substep['state']=='wait') stepstate = 'wait';
	
	      substeps.push(substep);
	    }
	  });
	
	  return {
	    substeps: substeps,
	    stepstate: stepstate
	  };
	},
	getSubStep: function($$_operson, $$_otaskinfo){
	
	  var me = this;
	  var substep = {
	    dpath:'',
	    photo:'',
	    name:'',
	    comment: "",
	    dept:'',
	    date: '',
	    state: '',
	    signImage: ''
	  };

	  var displayname = "";
	  var title = "";
	  var position = "";
	  var oudisplayname = "";
	  var code = "";
	
	  substep["dpath"]=$$_operson.path();
	  
	  //role인경우 처리
	  if ($$_otaskinfo.valLength() == 0) {
	    $$_otaskinfo = $$_operson.parent().find("taskinfo");
	    $$_operson = $$_operson.parent();
	  }
	
	  var oroleperson = null;
	  if ($$_operson.nodename() == "role") {
	    displayname = $$_operson.attr("name");
	    oudisplayname = $$_operson.attr("ouname");
	    code = $$_operson.attr("code");
	  } else {
	    displayname = $$_operson.attr("name");
	    title = $$_operson.attr("title");
	    position = $$_operson.attr("position");
	    oudisplayname = $$_operson.attr("ouname");
	    code = $$_operson.attr("code");
	  }
	
	  var stepUnitType;
	  if ($$_operson.parent().parent().nodename() == "step") {
	    stepUnitType = $$_operson.parent().parent().attr("unittype");
	  }
	  // 그래픽 가져오기
	  //substep['name'] = me.getDisplayName(displayname);
	  substep['name'] = mobile_comm_getDicInfo(me.getDisplayName(displayname));
	  substep['dept'] = mobile_comm_getDicInfo(oudisplayname);
	  substep['title'] = title;
	  substep['position'] = position.split(";")[1]+"("+mobile_comm_getDicInfo(oudisplayname)+")";
	  substep['date'] = me.getDate($$_otaskinfo);
	  substep['state'] = me.getState($$_otaskinfo);
	
	  if(substep['state'] == 'wait'){
	    substep['waitCircle'] = 'cirBlue';
	  }else if($$_otaskinfo.attr("result") == "rejected" && substep['state'] == 'no'){
	  	substep['waitCircle'] = 'cirRed';
	  }else{
	    substep['waitCircle'] = 'cirCle';
	  }
	  
	  substep['code'] = code;
	  substep['photo'] = '';//me.getPhotoPath(code, stepUnitType);
	  substep['signImage'] = '';
	
	  return substep;
	},
	getDisplayName: function (displayname){
	
	  return mobile_comm_getDicInfo(displayname);
	},
	getState: function ($$_itemtaskinfo){
	  var state = '';
	  var result = $$_itemtaskinfo.attr('result');
	  if(result === 'completed' ){
	    state = 'yes';
	  } else if(result === 'rejected' || result === 'disagreed' ){
	    state = 'no';
	  } else if(result === 'pending' || result === 'reserved'){
	    state = 'wait';
	  } else {
	    state = 'inactive';
	  }
	  return state;
	},
	getDate: function ($$_itemtaskinfo){
	  //for debugging
	  if (typeof $$_itemtaskinfo === 'undefined' ||
	    $$_itemtaskinfo.attr("datecompleted") == "" ||
	    $$_itemtaskinfo.attr("datecompleted") == null ||
	    $$_itemtaskinfo.attr("datecompleted") == undefined) {
	    return "";
	  } else {
	    return mobile_comm_getDateTimeString2("MM-dd HH:mm", CFN_TransLocalTime($$_itemtaskinfo.attr("datecompleted")));
	  }
	
	  //@to-do - MM-DD hh/mm 형식 반환
	},
	//결재선 step 상단 표시명
	getStepTitle: function (step){
		// 한국어 하드코딩 => 다국어 처리
		  
		var namemap = {
	      allottype: {
	        serial : mobile_comm_getDic('lbl_apv_serial'), 							// 순차
	        parallel : mobile_comm_getDic('lbl_apv_parallel') 						// 병렬
	      },
	      unittype: {
	        ou : mobile_comm_getDic('lbl_apv_dept'), 								// 부서
	        person: mobile_comm_getDic('lbl_apv_person') 							// 개인
	      },
	      routetype: {
	      	approve : {
	    		normal : mobile_comm_getDic('lbl_apv_normalapprove'),				// 일반결재
	    		consent : mobile_comm_getDic('lbl_apv_investigation'),				// 검토
	    		authorize : mobile_comm_getDic('lbl_apv_authorize'),				// 전결
	    		substitute : mobile_comm_getDic('lbl_apv_substitue'),				// 대결
	    		review : mobile_comm_getDic('lbl_apv_review'),						// 후결
	    		bypass : mobile_comm_getDic('lbl_apv_bypass'),						// 후열
	    		charge_send : mobile_comm_getDic('lbl_apv_Draft'),					// 기안
	    		charge_receive : mobile_comm_getDic('lbl_apv_receive'),				// 수신
	    		skip : mobile_comm_getDic('lbl_apv_NoApprvl'),						// 결재안함
	    		confirm : mobile_comm_getDic('lbl_apv_Confirm'),					// 확인
	    		reference : mobile_comm_getDic('lbl_apv_share4list')				// 참조
	    	},
	        consult : mobile_comm_getDic('lbl_apv_tit_consent'), 					// 합의
	        receive : mobile_comm_getDic('lbl_apv_Acceptdept'), 					// 수신부서
	        assist : mobile_comm_getDic('lbl_apv_reject_consent'), 					// 협조
	        
	        // 부서
	        serial_consult_ou : mobile_comm_getDic('lbl_apv_DeptConsent'), 			// 순차합의
	        parallel_consult_ou : mobile_comm_getDic('lbl_apv_DeptConsent_2'), 		// 병렬합의
	        serial_assist_ou : mobile_comm_getDic('lbl_apv_DeptAssist'), 			// 순차협조
	        parallel_assist_ou : mobile_comm_getDic('lbl_apv_DeptAssist2'), 		// 병렬협조
	        
	        // 개인
	        serial_consult_person : mobile_comm_getDic('btn_apv_consultors'), 		// 순차합의
	        parallel_consult_person : mobile_comm_getDic('btn_apv_consultors_2'), 	// 병렬합의
	        serial_assist_person : mobile_comm_getDic('lbl_apv_assist'), 			// 순차협조
	        parallel_assist_person : mobile_comm_getDic('lbl_apv_assist_2') 		// 병렬협조
	      }
	    }

	    var display = "";
		if(step.routetype == "approve") {
	    	var person_taskinfo_kind;
	    		
	    	if(Array.isArray(step.person_taskinfo_kind)) {
	    		person_taskinfo_kind = step.person_taskinfo_kind[0];
	    	} else {
	    		person_taskinfo_kind = step.person_taskinfo_kind;
	    	}
	    	
	    	if(step.person_taskinfo_kind == "charge") {
	        	display = namemap['routetype'][step.routetype][person_taskinfo_kind + "_" + step.divisiontype];
	    	} else {
	        	display = namemap['routetype'][step.routetype][person_taskinfo_kind];
	    	}
	    } else if(step.routetype == "consult" || step.routetype == "assist") // 합의, 협조인 경우
	    	display = namemap['routetype'][step.allottype + "_" + step.routetype + "_" + step.unittype];
	    else
	    	display = namemap['routetype'][step.routetype];
	    
	    return display;

	},
	getGraphicHtml: function (step){
		var sHtml = "";
		
		for(var i = 0 ; i < step.length ; i++) {
			if(i > 0) {
				sHtml += "<span class=\"ico_next_step\"></span>";
			}
			
			for(var j = 0; j < step[i].steps.length; j++) {
				var steps = step[i].steps[j];
				var date = "&nbsp;";
				
				if(j > 0) {
					//if(steps.kind.indexOf("병렬") > -1) {
					if(steps.kind == mobile_comm_getDic("lbl_apv_DeptConsent_2") || steps.kind == mobile_comm_getDic("lbl_apv_DeptAssist2")
			        		  || steps.kind == mobile_comm_getDic("btn_apv_consultors_2") || steps.kind == mobile_comm_getDic("lbl_apv_assist_2") ){
						sHtml += "<span class=\"ico_parall\"></span>";
					} else {
						sHtml += "<span class=\"ico_next_step\"></span>";
					}
				}
				
				sHtml += "<dl>";
				sHtml += "	<dt class=\"cate\">" + steps.kind + "</dt>";
				sHtml += "	<dd class=\"staff\">";
				sHtml += "		<span class=\"photo\" style=\"background-image:url('" + steps.substeps[0].photo + "'), url('" + _mobile_approval_profileImagePath + "');\"></span>";
				
				if(steps.substeps[0].date != undefined && steps.substeps[0].date != "") {
					if(steps.kind.indexOf("합의") > -1) {
						if(steps.substeps[0].state === 'yes')
							sHtml += "		<span class=\"checked cirOk\"></span>"; //cirOk
						else if(steps.substeps[0].state === 'no')
							sHtml += "		<span class=\"checked cirNon\"></span>"; //cirNon
						
					} else {
						if(steps.substeps[0].state === 'yes')
							sHtml += "		<span class=\"checked cirOkFull\"></span>"; //cirOkFull
						else if(steps.substeps[0].state === 'no')
							sHtml += "		<span class=\"checked cirNonFull\"></span>"; //cirNonFull
					}
				}
				
				sHtml += "	</dd>";
				sHtml += "	<dd class=\"name\">" + steps.substeps[0].name + "</dd>";
				
				if(steps.substeps[0].date != "") {
					date = CFN_TransLocalTime(steps.substeps[0].date);
				}
				
				sHtml += "	<dd class=\"date\">" + date + "</dd>";
				sHtml += "</dl>";
			}
		}

		return sHtml;
	}
}

/*!
 * 
 * 결재 검색
 * 
 */

// 결재 검색 버튼 click
function mobile_approval_searchInput() {
	$("#approval_div_search").css("display", "block");
}

// 결재 검색 enter key press
function mobile_approval_searchEnter(e) {
	if(e.keyCode === 13) {
		mobile_approval_search();
	}
	
	return false;
}

// 검색 실행
function mobile_approval_search(){
	if($("#approval_search_input").val() == "") {
		alert(mobile_comm_getDic("msg_EnterSearchword"));
	} else {
		
		mobile_comm_showload();
		
		$("#approval_list_list").css("display", "none");
		$("#approval_list_searchlist").css("display", "block").html("");
		
		_mobile_approval_list.SearchText = $("#approval_search_input").val();
		// 현재선택한 메뉴에 대한 선택 정보 저장
		window.sessionStorage.setItem("ApprovalSearchText", $("#approval_search_input").val());
		
		window.sessionStorage.setItem("ApprovalListType", "search");
		_mobile_approval_list.ListType = "search";
		_mobile_approval_list.Page = 1;
						
		mobile_approval_getList(_mobile_approval_list);
		
		mobile_comm_hideload();
	}
}

// 결재 검색 닫기
function mobile_approval_changeDisplay() {
	$("#approval_list_searchlist").css("display", "none");
	$("#approval_list_list").css("display", "block");
	mobile_approval_resetSearchInput();
}

// 결재 검색 input reset
function mobile_approval_resetSearchInput() {
	$("#approval_search_input").val("");
	_mobile_approval_list.SearchText = "";
	_mobile_approval_list.ListType = "list";
	window.sessionStorage.setItem("ApprovalSearchText", "");
	window.sessionStorage.setItem("ApprovalListType", "");
	mobile_approval_ListInit();
}

/*!
 * 
 * 결재 상세보기
 * 
 */

var _mobile_approval_view = {
		
	// 결재 상세 조회 초기 데이터
	Mode: '',			//Mode-결재함 모드(Approval, TempSave 등)
	Page: 1,			//Page
	TotalCount: "",		//TotalCount
	ProcessID: "",			//Process ID
	WorkitemID: "",			//WorkItem ID
	PerformerID: "",			//Performer ID
	ProcessDescriptionID: "",
	UserCode: "",
	Gloct: "",
	FormID: "",			//Form ID
	FormInstID: "",
	FormTempID: "",
	FormInstTableName: "",
	Archived: "",
	SubKind: "",
	FormPrefix: "",			//Form Prefix
	IsMobile: "",
	
	ActionType: "",		//결재행위(승인, 반려 등)
	ListMode: ""
};
var isLoad = "N";			 //결재문서 재로드 방지

var btDisplay = {}; //버튼 display 여부

function mobile_approval_ViewInit(){
	//window.location.reload();
	mobile_approval_formjsonload();	// formjson 데이터 parsing.
	
	if(getInfo("Request.readtype") != "preview") {
		if(window.sessionStorage["open_mode"] != undefined) {
			window.sessionStorage.removeItem("open_mode")
		}
	
		if(window.sessionStorage["processid"] != undefined) {
			window.sessionStorage.removeItem("processid")
		}
	
		if(window.sessionStorage["apvlist"] != undefined) {
			window.sessionStorage.removeItem("apvlist")
		}
	}
	
	// 1. 파라미터 셋팅
	if (mobile_comm_getQueryString('mode', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.Mode = mobile_comm_getQueryString('mode', 'approval_view_page');
	} else {
		_mobile_approval_view.Mode = 'Approval';
	}
	if (mobile_comm_getQueryString('page', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.Page = mobile_comm_getQueryString('page', 'approval_view_page');
    } else {
    	_mobile_approval_view.Page = 1;
    }
	if (mobile_comm_getQueryString('totalcount', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.TotalCount = mobile_comm_getQueryString('totalcount', 'approval_view_page');
    } else {
    	_mobile_approval_view.TotalCount = '';
    }
	if (mobile_comm_getQueryString('processID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.ProcessID = mobile_comm_getQueryString('processID', 'approval_view_page');
    } else {
    	_mobile_approval_view.ProcessID = '';
    }
	if (mobile_comm_getQueryString('workitemID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.WorkitemID = mobile_comm_getQueryString('workitemID', 'approval_view_page');
    } else {
    	_mobile_approval_view.WorkitemID = '';
    }
	if (mobile_comm_getQueryString('performerID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.PerformerID = mobile_comm_getQueryString('performerID', 'approval_view_page');
    } else {
    	_mobile_approval_view.PerformerID = '';
    }
	if (mobile_comm_getQueryString('processdescriptionID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.ProcessDescriptionID = mobile_comm_getQueryString('processdescriptionID', 'approval_view_page');
    } else {
    	_mobile_approval_view.ProcessDescriptionID = '';
    }
	if (mobile_comm_getQueryString('userCode', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.UserCode = mobile_comm_getQueryString('userCode', 'approval_view_page');
    } else {
    	_mobile_approval_view.UserCode = '';
    }
	if (mobile_comm_getQueryString('gloct', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.Gloct = mobile_comm_getQueryString('gloct', 'approval_view_page');
    } else {
    	_mobile_approval_view.Gloct = '';
    }
	if (mobile_comm_getQueryString('formID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.FormID = mobile_comm_getQueryString('formID', 'approval_view_page');
    } else {
    	_mobile_approval_view.FormID = '';
    }
	if (mobile_comm_getQueryString('forminstanceID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.FormInstID = mobile_comm_getQueryString('forminstanceID', 'approval_view_page');
    } else {
    	_mobile_approval_view.FormInstID = '';
    }
	if (mobile_comm_getQueryString('formtempID', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.FormTempID = mobile_comm_getQueryString('formtempID', 'approval_view_page');
    } else {
    	_mobile_approval_view.FormTempID = '';
    }
	if (mobile_comm_getQueryString('forminstancetablename', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.FormInstTableName = mobile_comm_getQueryString('forminstancetablename', 'approval_view_page');
    } else {
    	_mobile_approval_view.FormInstTableName = '';
    }
	if (mobile_comm_getQueryString('archived', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.Archived = mobile_comm_getQueryString('archived', 'approval_view_page');
    } else {
    	_mobile_approval_view.Archived = '';
    }
	if (mobile_comm_getQueryString('subkind', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.SubKind = mobile_comm_getQueryString('subkind', 'approval_view_page');
    } else {
    	_mobile_approval_view.SubKind = '';
    }
	if (mobile_comm_getQueryString('formPrefix', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.FormPrefix = mobile_comm_getQueryString('formPrefix', 'approval_view_page');
    } else {
    	_mobile_approval_view.FormPrefix = '';
    }
	if (mobile_comm_getQueryString('isMobile', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.IsMobile = mobile_comm_getQueryString('isMobile', 'approval_view_page');
    } else {
    	_mobile_approval_view.IsMobile = '';
    }
	if (mobile_comm_getQueryString('listmode', 'approval_view_page') != 'undefined') {
		_mobile_approval_view.ListMode = mobile_comm_getQueryString('listmode', 'approval_view_page');
    } else {
    	_mobile_approval_view.ListMode = 'Approval';
    }

	//setTimeout(function() {
		
//		var returnVal = mobile_approval_formjsonload();
//		if(returnVal != undefined && !returnVal) {
//			mobile_comm_back();
//			return;
//		}
		
	var processdes = processdesJson[0];
	var forminstance = forminstanceJson[0];
	if(processdes != undefined && processdes != null && processdes != "") {
		$('#approval_view_formname').html(mobile_comm_getDicInfo(processdes.FormName));
		
		$('#approval_view_formsubject').html(
			(processdes.Priority == "5" ? "<span class=\"flag_cr01\">" + mobile_comm_getDic("lbl_apv_surveyUrgency") + "</span>" : "") + //긴급 
			(processdes.IsReserved == "Y" ? "<span class=\"flag_cr01\">" + mobile_comm_getDic("lbl_apv_hold") + "</span>" : "") + //보류
			(processdes.IsSecureDoc == "Y" ? "<i class=\"ico_secret\"></i>" : "") +
			mobile_approval_replaceCharacter(processdes.FormSubject)
		);
		
		$('#approval_view_initiatorphoto').attr("style", "background-image:url('" + mobile_approval_getUserPotoPath(forminstance.InitiatorID, forminstance.PhotoPath) + "'), url('" + _mobile_approval_profileImagePath + "');");
		
		$('#approval_view_initiatorname').html(mobile_comm_getDicInfo(forminstance.InitiatorName, lang));				
		$('#approval_view_initiatedate').html(mobile_comm_getDateTimeString2('view', CFN_TransLocalTime(forminstance.InitiatedDate)));
	} else {
		$('#approval_view_formname').html(mobile_comm_getDicInfo(getInfo("FormInfo.FormName")));
		$('#approval_view_formsubject').html(getInfo("FormInstanceInfo.Subject"));
		$('.post_title').css("padding-bottom", "0px");
		$('#approval_view_initiatorphoto').hide();
		$('#approval_view_initiatorname').hide();
		$('#approval_view_initiatedate').hide();
	}
	//}, 10);
	
	//의견 toggle setting
	
	// 결재암호 사용 여부
	if (getInfo("Request.readtype") != 'preview') {
		// 미리보기가 아닌 경우에만 실행하도록 처리
		var g_UsePWDCheck = getInfo("SchemaContext.scWFPwd.isUse"); //결재암호 사용, 스키마 설정값 사용으로 변경 2012-01-02

		if (g_UsePWDCheck == "Y" && mobile_approval_chkCommentWrite($("#approval_view_inputpassword").val())){
			$(".approval_comment").addClass("secret");
		    document.getElementById("approval_view_inputpassword").focus();
		} else {
			$(".approval_comment").removeClass("secret");
			
		}
	}
	// PC용 전체 다운로드 버튼 감추기
	$(".totDownBtn").hide();
	//$("meta[name=viewport]").attr("content", "width=device-width, initial-scale=1.0, maximum-scale=3.0, minimum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi, viewport-fit=cover");
}

function mobile_approval_formload() {
	var oFormBody;
	var objType;
	var templateHtml;
	
	if(strErrorMsg != "") {
		alert(strErrorMsg);
		return false;
	}

    //underscore binding 시작 부분
    //escape 문자 설정
    _.templateSettings = {
        variable: "doc",
        interpolate: /\{\{(.+?)\}\}/g,      // print value: {{ value_name }}
        evaluate: /\{%([\s\S]+?)%\}/g,   // excute code: {% code_to_execute %}
        escape: /\{%-([\s\S]+?)%\}/g
    }; // excape HTML: {%- <script> %} prints &lt;script&gt;

    if(typeof(formJson) != "object") {
	    formJson = Base64.b64_to_utf8(formJson);
	    formJson = JSON.parse(formJson);
        formJson = $.extend({}, formJson, returnLangUsingLangIdx(gLngIdx)); // 양식 내 json 다국어 추가
    }
    
    if (getInfo("Request.readtype") == 'preview') {
    	setPreViewData();
    }

    // Grab the HTML out of our template tag and pre-compile it.
    //var templateHtml = $("script.template").html();
    if (getInfo("Request.templatemode") == "Write") {
    	objType = "write";
    }
    else if (getInfo("Request.readtype") == "preview") {
    	objType = "preview";
    }
    else {
    	objType = "view";
    }
    
	oFormBody = $("div[id='approval_" + objType + "_page']").find("#FormBody");
    templateHtml = $(oFormBody).html();

    //template 내의 underscore 구문의 정합성을 체크하는 부분
    //underscore binding 부분은 {{ doc.~~ }} 형태를 준수 할 것
    templateHtml = validateUnderscore(templateHtml);

    var templateObject = $(templateHtml);
    var template = _.template(
        templateHtml
    );

    $(oFormBody).html(
        template(formJson)
    );

    if (m_oInfoSrc != null && gIsHistoryView != 'true') {
        try {
            //미리보기 후 처리
            //신세계 Layer 수정 적용
            //2016-06-08
            //YJYOO
            var openerLoc = m_oInfoSrc.location.href.toString();
            if (openerLoc.indexOf('preview.do') > -1 && getInfo("Request.readtype") == 'preview') {
            	setPreViewPostRendering();
                //양식 별 후처리에 대한 부분을 고려한 호출
                postRenderingForTemplate();
            }
            else {
                postLoad();
            }
        } catch (e) { postLoad(); }
    }
    
    $(".wordTop").css("display", "none");
    $(".wordLayout").css("zoom", "0.5");
    $(".wordCont").css("position", "relative").css("top", "0px");    
    
    // 조회 구분에 따른 컴포넌트 처리
    if (getInfo("Request.templatemode") == "Write") {
    	mobile_approval_datepickerLoad();
    }
    else {
        $(".multi-row-add").each(function() {
        	$(this).parent().hide();
        });
        $(".multi-row-del").each(function() {
        	$(this).parent().hide();
        });
        
        $("select").each(function(){
        	$(this).parents(".ui-select").html($(this).find("option:selected").text());
        });
    }
	
    //삭제 하지 말 것
    EASY.init(); // - required!!!
    
    //모바일에서 원문영역 깨짐 보완
    $('#tbContentElement').find('p').each(function() {
		$(this).css('line-height', 'normal');
	});
	$('#tbContentElement > div > table').css('width','');
	
	//에디터 내 인라인이미지 및 링크 변환 처리
	mobile_comm_replacebodyinlineimg($('#tbContentElement'));
	mobile_comm_replacebodylink($('#tbContentElement'));
    
    $(oFormBody).show();

    isLoad = "Y";
}

function mobile_approval_datepickerLoad() {
	$( ".input_date" ).attr('class', 'input_date').datepicker({
		dateFormat : 'yy-mm-dd',
		dayNamesMin : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	});
}

function mobile_approval_formjsonload() {
	
	if(strErrorMsg != "") {
		alert(strErrorMsg);
		return false;
	}

    if(typeof(formJson) != "object") {
	    formJson = Base64.b64_to_utf8(formJson);
	    formJson = JSON.parse(formJson);
    }
    mobile_comm_hideload();
}

function postLoad() {
	//편집모드에서 제목 특수기호 < > " 처리
	// [16-02-24] kimhs, 관리자에서 읽기미리보기 시 지정된 SUBJECT가 없어 조건 추가
	if (getInfo("FormInstanceInfo.Subject") != undefined && (getInfo("Request.editmode") == 'Y' || getInfo("Request.templatemode") == "Read")) {
		setInfo("FormInstanceInfo.Subject", getInfo("FormInstanceInfo.Subject").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
		$("#Subject").val(getInfo("FormInstanceInfo.Subject"));
	}

	if (formJson.AppInfo.usid != null || formJson.AppInfo.usid != '') {
		initOnloadformmenu();
  
		initOnloadformedit();

		//양식 별 후처리에 대한 부분을 고려한 호출
		postRenderingForTemplate();

        if (getInfo("Request.templatemode") == "Write") {
        	mobile_approval_loadCheckBoxAndRadio();
        	mobile_approval_editAttachFileInfo();
        }
	}
}

//결재문서 view
function mobile_approval_getView(params) {
	
	var returnVal = mobile_approval_formload();
	if(returnVal != undefined && !returnVal) {
		mobile_comm_back();
		return;
	}
	
//	 2. 첨부처리 (approval_view_fileArea)				
	var fileInfo = $.parseJSON(getInfo("FileInfos"));
	$("#approval_view_fileArea").html(mobile_comm_downloadhtml(fileInfo));
	
	// 3. 승인/반려 처리
	$("#approval_view_buttonarea").html("");
	
	var sBtnHtml = "";
	var strApproval = mobile_comm_getDic("lbl_apv_Approved"); //승인
	var strReject = mobile_comm_getDic("lbl_apv_reject"); //반려

	if(getInfo("Request.mode") == "PCONSULT" && getInfo("Request.subkind") == "T009") {
		strApproval = mobile_comm_getDic("lbl_apv_agree"); //합의
		strReject = mobile_comm_getDic("lbl_apv_disagree"); //거부		
	}

	var tempDeptDraft = btDisplay.btDeptDraft; //재기안 버튼 display 여부 파악 순서가 PC와 다르기 때문에 임시 처리
	btDisplay = initBtn();
	btDisplay.btDeptDraft = tempDeptDraft;
	
	if(btDisplay.btApproved == "Y") {
		if(btDisplay.btReject == "N") {
			sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'approved');\" class=\"btn_approval full\"><i class=\"ico\"></i>" + strApproval + "</a>";
		} else {
			sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'approved');\" class=\"btn_approval\"><i class=\"ico\"></i>" + strApproval + "</a>";
			sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'reject');\" class=\"btn_return\"><i class=\"ico\"></i>" + strReject + "</a>"; 
		}
	} else {
		if(btDisplay.btReject == "Y") {
			sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'reject');\" class=\"btn_return full\"><i class=\"ico\"></i>" + strReject + "</a>";					
		}
	}
	$("#approval_view_buttonarea").html(sBtnHtml);
	if(sBtnHtml == "") $("#approval_view_buttonarea").hide(); 
	$("#FormBody").css('margin-bottom', '20px');
	
	//FormFooter 내 결재문서의견만 표시하고, 첨부파일/연결문서 정보는 remove
	$("#formBox").find("#AttFileInfoList").remove();
	
	/*$("#TIT_DOC_LEVEL").next("td").find("div.ui-select").removeClass("ui-select");
	$("#TIT_SAVE_TERM").next("td").find("div.ui-select").removeClass("ui-select");*/
	
	//div에서 ui-select 클래스로 인한 select box 값 보이지 않는 오류 수정
	//주의: 결재 작성 사용 시에 작성/조회 화면 확인 필요 
	$("div.ui-select").each(function(i, obj) {
		$(obj).css("display", "inline-block");
		$(obj).removeClass("ui-select");
	});
	
	//data-pettern이 currency인 항목에 컴마 표시되도록 추가
	$("span[data-pattern=currency]").each(function(i, obj) {
		$(obj).text(mobile_comm_addComma($(obj).text()));
	});
	
	//첨부파일 미리보기 버튼 제거
	$("a.previewBtn").remove();
	
	//모바일-PC css 충돌 관련 오류 수정
	$("a.ico_file").css("width", "auto");
	
	if(m_oInfoSrc.location.href.toString().indexOf("preview.do") > -1) {
		parent.mobile_comm_hideload();
		parent.$("#IframeDiv").show();
		
		//미리보기 시 iframe 내 조회되는 웹용 하단메뉴 숨김 처리
		$(".BmenuWrap").hide();
	}
}

//승인, 반려(FormMenu) 버튼 클릭
function mobile_approval_clickbtn(obj, type) {
	var pageObj;
	var viewMode;
	var l_ActiveModule = mobile_approval_getActiveModule();

	if(obj == undefined || obj === '') {
		obj = $(".btn_approval");
	}
	
	if(getInfo("Request.templatemode") == "Write" || (l_ActiveModule != "approval" && $.mobile.activePage.attr("id").indexOf("write") > -1)) {
		pageObj = window["_mobile_" + l_ActiveModule + "_write"];
		viewMode = "write";
	} else {
		pageObj = window["_mobile_" + l_ActiveModule + "_view"];
		viewMode = "view";
	}

	if(type != 'toggle') {
		var commentHeight = 152;
		var commentPlaceHolder = "";
		
		switch(type) {
		case "draft":
			commentPlaceHolder = mobile_comm_getDic("lbl_apv_Draft");	//기안
			break;
		case "approved":
			commentPlaceHolder = $(".btn_approval").text();	//승인
			break;
		case "reject":
			commentPlaceHolder = $(".btn_return").text();	//반려
			break;
		case "hold":
			commentPlaceHolder = mobile_comm_getDic("lbl_apv_hold");	//보류
			break;
		default:
				break;
		}
		
		// 결재 타입에 따른 placeholder 세팅
		if(commentPlaceHolder) {
			commentPlaceHolder += " " + mobile_comm_getDic("msg_apv_161");
			$('#' + l_ActiveModule + '_' + viewMode + '_inputcomment').attr("placeholder", commentPlaceHolder);
		}
		
		var _usePWDCheck = getInfo("SchemaContext.scWFPwd.isUse");
		
		if(_usePWDCheck == undefined && l_ActiveModule == "account"){
			if(viewMode == "write")
				_usePWDCheck = pageObj.ExpenceFormInfo.SchemaContext.scWFPwd.isUse;
			else 
				_usePWDCheck = pageObj.SchemaContext.scWFPwd.isUse;
		}
		
		if (_usePWDCheck == "Y" && mobile_approval_chkCommentWrite($("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").val())){
			$(".secret").show();
			$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").val("");
			$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").show();
			
			commentHeight += 46;
			if(useFIDO == "Y") {
				$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").css('width', 'calc(100% - 125px)');
				$("#fido_btn").show();
			} else {
				$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").css('width', '100%');
				$("#fido_btn").hide();
			}
		}
		
		pageObj.ActionType = type;
		
		if($('.fixed_btm_wrap').hasClass('open')) {
			$("#" + l_ActiveModule + "_" + viewMode + "_buttonarea").show();
		} else {
			$("#" + l_ActiveModule + "_" + viewMode + "_buttonarea").hide();
		}
		$(obj).parents().addClass('open');
		$('#' + l_ActiveModule + '_' + viewMode + '_commentarea').animate({height: commentHeight+"px"});	
	} else {
		var _usePWDCheck = getInfo("SchemaContext.scWFPwd.isUse");
		
		if(_usePWDCheck == undefined && l_ActiveModule == "account"){
			if(viewMode == "write")
				_usePWDCheck = pageObj.ExpenceFormInfo.SchemaContext.scWFPwd.isUse;
			else 
				_usePWDCheck = pageObj.SchemaContext.scWFPwd.isUse;
		}
		
		$(obj).parent().animate(
			{height:"0"},
			{complete : function(){
					$(obj).parents().removeClass('open'); 
					$("#" + l_ActiveModule + "_" + viewMode + "_buttonarea").show();
					if (_usePWDCheck == "Y" && mobile_approval_chkCommentWrite($("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").val())){
						$(".secret").hide();
						$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").val("");
						$("#" + l_ActiveModule + "_" + viewMode + "_inputpassword").hide();
						$("#fido_btn").hide();
					}
				}
			}
		);
	}
}

function mobile_approval_showExtMenu() {
	if($("#approval_view_dropMenuBtn").hasClass("show")) {
		$("#approval_view_dropMenuBtn").removeClass("show");
	} else {
		var cnt = 0;
		var sHtml = "";
		if($("#approval_view_dropMenuBtn").find(".exmenu_layer").length > 0) {
			$("#approval_view_dropMenuBtn").addClass("show");
		} else {
			var btnArr = [];
			btnArr.push("btModify;" + mobile_comm_getDic("btn_apv_modify")); //편집
			btnArr.push("btHold;" + mobile_comm_getDic("lbl_apv_hold")); //보류
			//btnArr.push("btRejectedto;" + mobile_comm_getDic("lbl_apv_rejectedto); //지정반송
			btnArr.push("btLine;" + mobile_comm_getDic("lbl_apv_approver")); //결재선
			btnArr.push("btDeptLine;" + mobile_comm_getDic("lbl_apv_approver")); //재기안결재선
			btnArr.push("btForward;" + mobile_comm_getDic("btn_apv_forward")); //전달
			btnArr.push("btWithdraw;" + mobile_comm_getDic("btn_apv_Withdraw")); //회수
			btnArr.push("btAbort;" + mobile_comm_getDic("btn_apv_cancel")); //취소
			btnArr.push("btApproveCancel;" + mobile_comm_getDic("btn_CancelApproval")); //승인취소
			btnArr.push("btReUse;" + mobile_comm_getDic("btn_apv_reuse")); //재사용
			btnArr.push("btDeptDraft;" + mobile_comm_getDic("btn_apv_redraft")); //재기안
			btnArr.push("btApprovedlast;" + mobile_comm_getDic("btn_apv_preApproved")); //선승인(예고함)
			btnArr.push("btRejectlast;" + mobile_comm_getDic("lbl_apv_prereject")); //선반려(예고함)
			
			sHtml += "<div class=\"exmenu_layer\">";
			sHtml += "	<ul class=\"exmenu_list\">";
			var btnlength = btnArr.length;
			for(var i = 0; i < btnlength; i++) {
				var id = btnArr[i].split(';')[0];
				var value = btnArr[i].split(';')[1];
				
				if(btDisplay[id] == "N") continue; 
				
				//승인, 반려, 출력 버튼 팝업 메뉴 X
				if(mobile_comm_getBaseConfig("useMobileApprovalWrite") != "Y" && (id == "btReUse" || id == "btModify")) { 
				}
				//결재선, 편집, 재사용, 재기안 - write 호출
				else if(id == "btLine" || id == "btDeptLine" || id == "btReUse" || id == "btModify") {
					var open_mode = ((id == "btLine" || id == "btDeptLine") ? "APVLIST" : id.replace("bt", "").toUpperCase());
					
					var isDisplay = false;
					//결재선 버튼은 무조건 표시 / 편집, 재사용 버튼은 설정값에 따라 표시
					if(id == "btLine" || id == "btDeptLine")
						isDisplay = true;
					else if(formJson.ExtInfo.MobileFormYN != undefined && formJson.ExtInfo.MobileFormYN == "Y" && mobile_comm_getBaseConfig("useMobileApprovalWrite") == "Y")
						isDisplay = true;
					
					if(isDisplay) {
						sHtml += "<li><a class=\"btn\" onclick=\"mobile_approval_clickmodify('" + open_mode + "');\" value=\"" + value + "\">" + value + "</a></li>";
						cnt++;
					}
				}
				//보류, 지정반송, 취소 - 의견 작성란
				else if(id == "btHold" || id == "btRejectedto" || id == "btAbort" || id == "btDeptDraft" || id == "btApprovedlast" || id == "btRejectlast") {
					var type = id.replace("bt", "").toLowerCase();
					sHtml += "<li><a class=\"btn\" onclick=\"mobile_approval_clickbtn('', '" + type + "');\" value=\"" + value + "\">" + value + "</a></li>";
					cnt++;
				}
				else {
					sHtml += "<li><a class=\"btn\" id=\"" + id + "\" onclick=\"doButtonAction('" + id + "');\" value=\"" + value + "\">" + value + "</a></li>";
					cnt++;
				}
			}
			sHtml += "	</ul>";
			sHtml += "</div>";
			
			if(cnt > 0) {
				$("#approval_view_dropMenuBtn").addClass("show").append(sHtml);				
			}
		}
	}
}

function mobile_approval_showAttach() {
	if($(".acc_link").hasClass("show")) {
		$(".acc_link").removeClass("show");
	} else {
		$(".acc_link").addClass("show");
	}
}

function mobile_approval_openOrg(sMode) {
	var sCallType = "Select"; //SelectUser:사용자 선택(3열-1명만),Select:그룹 선택(3열-1개만)
    switch (sMode) {
        case "charge": case "ChangeReview": case "deputy": sCallType = "SelectUser"; break;
        case "chargegroup": sCallType = "Select"; break;

        default: break;
    }
    
    var sUrl = "/covicore/mobile/org/list.do";
	window.sessionStorage["mode"] = sCallType;
	window.sessionStorage["multi"] = "N";
	window.sessionStorage["callback"] = "mobile_approval_setOrg('"+sMode+"');";
	
	mobile_comm_go(sUrl, 'Y');
}

function mobile_approval_setOrg(sMode) {
	var pStrItemInfo = '{"item":[' + window.sessionStorage["userinfo"] + ']}';
	var oJSON = $.parseJSON(pStrItemInfo);
	if(sMode == "deputy") {
		mobile_approval_deputy_setDelegator(oJSON);
	} else {
		insertToList(oJSON);
	}
}

/*!
 * 
 * 결재 작성
 * 
 */

var _mobile_approval_write = {
	
	Mode: 'DRAFT',		//새로 작성인지 수정인지 등등(CREATE/REPLY/UPDATE/REVISION/MIGRATE)
	ApvLineMode: 'approval',	//결재선 모드(결재:approval, 참조:tcinfo, 배포:distribution)
	OpenMode: 'DRAFT',	//작성 페이지 open mode(DRAFT: 기안, APVLIST: 결재선, TEMPSAVE: 임시함, MODIFY: 편집)
	ListMode: 'Approval',
	ProcessID: "",			//Process ID
	WorkitemID: "",			//WorkItem ID
	PerformerID: "",			//Performer ID
	ProcessDescriptionID: "",
	UserCode: "",
	Gloct: "",
	FormID: "",			//Form ID
	FormInstID: "",
	FormTempID: "",
	FormInstTableName: "",
	Archived: "",
	SubKind: "",
	FormPrefix: "",			//Form Prefix
	IsMobile: "",
	
	Config: {}
};
var isApvMod = "Y"; //결재선 편집모드: Y / 결재선 조회모드 : N

function mobile_approval_WriteInit () {
	if (mobile_comm_getQueryString('mode', "approval_write_page") != 'undefined') {
		_mobile_approval_write.Mode = mobile_comm_getQueryString('mode', "approval_write_page");
	} else {
		_mobile_approval_write.Mode = 'DRAFT';
	}
	if (mobile_comm_getQueryString('open_mode', "approval_write_page") != 'undefined') {
		_mobile_approval_write.OpenMode = mobile_comm_getQueryString('open_mode', "approval_write_page");
	} else if (window.sessionStorage['open_mode'] != 'undefined' && window.sessionStorage['open_mode'] != '') {
		_mobile_approval_write.OpenMode = window.sessionStorage['open_mode'];
    } else {
		_mobile_approval_write.OpenMode = 'DRAFT';
	}
	if (mobile_comm_getQueryString('listmode', "approval_write_page") != 'undefined') {
		_mobile_approval_view.ListMode = mobile_comm_getQueryString('listmode', "approval_write_page");
    } else {
    	_mobile_approval_view.ListMode = 'Approval';
    }
	if (mobile_comm_getQueryString('processID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.ProcessID = mobile_comm_getQueryString('processID', "approval_write_page");
    } else {
    	_mobile_approval_write.ProcessID = '';
    }
	if (mobile_comm_getQueryString('workitemID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.WorkitemID = mobile_comm_getQueryString('workitemID', "approval_write_page");
    } else {
    	if (_mobile_approval_write.WorkitemID == '') _mobile_approval_write.WorkitemID = '';
    }
	if (mobile_comm_getQueryString('performerID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.PerformerID = mobile_comm_getQueryString('performerID', "approval_write_page");
    } else {
    	if (_mobile_approval_write.PerformerID == '') _mobile_approval_write.PerformerID = '';
    }
	if (mobile_comm_getQueryString('processdescriptionID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.ProcessDescriptionID = mobile_comm_getQueryString('processdescriptionID', "approval_write_page");
    } else {
    	if (_mobile_approval_write.ProcessDescriptionID == '') _mobile_approval_write.ProcessDescriptionID = '';
    }
	if (mobile_comm_getQueryString('userCode', "approval_write_page") != 'undefined') {
		_mobile_approval_write.UserCode = mobile_comm_getQueryString('userCode', "approval_write_page");
    } else {
    	if (_mobile_approval_write.UserCode == '') _mobile_approval_write.UserCode = '';
    }
	if (mobile_comm_getQueryString('gloct', "approval_write_page") != 'undefined') {
		_mobile_approval_write.Gloct = mobile_comm_getQueryString('gloct', "approval_write_page");
    } else {
    	if (_mobile_approval_write.Gloct == '') _mobile_approval_write.Gloct = '';
    }
	if (mobile_comm_getQueryString('formID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.FormID = mobile_comm_getQueryString('formID', "approval_write_page");
    } else {
    	if (_mobile_approval_write.FormID == '') _mobile_approval_write.FormID = '';
    }
	if (mobile_comm_getQueryString('forminstanceID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.FormInstID = mobile_comm_getQueryString('forminstanceID', "approval_write_page");
    } else {
    	if (_mobile_approval_write.forminstanceID == '') _mobile_approval_write.FormInstID = '';
    }
	if (mobile_comm_getQueryString('formtempID', "approval_write_page") != 'undefined') {
		_mobile_approval_write.FormTempID = mobile_comm_getQueryString('formtempID', "approval_write_page");
    } else {
    	if (_mobile_approval_write.FormTempID == '') _mobile_approval_write.FormTempID = '';
    }
	if (mobile_comm_getQueryString('forminstancetablename', "approval_write_page") != 'undefined') {
		_mobile_approval_write.FormInstTableName = mobile_comm_getQueryString('forminstancetablename', "approval_write_page");
    } else {
    	if (_mobile_approval_write.FormInstTableName == '') _mobile_approval_write.FormInstTableName = '';
    }
	if (mobile_comm_getQueryString('archived', "approval_write_page") != 'undefined') {
		_mobile_approval_write.Archived = mobile_comm_getQueryString('archived', "approval_write_page");
    } else {
    	if (_mobile_approval_write.Archived == '') _mobile_approval_write.Archived = '';
    }
	if (mobile_comm_getQueryString('subkind', "approval_write_page") != 'undefined') {
		_mobile_approval_write.SubKind = mobile_comm_getQueryString('subkind', "approval_write_page");
    } else {
    	if (_mobile_approval_write.SubKind == '') _mobile_approval_write.SubKind = '';
    }
	if (mobile_comm_getQueryString('formPrefix', "approval_write_page") != 'undefined') {
		_mobile_approval_write.FormPrefix = mobile_comm_getQueryString('formPrefix', "approval_write_page");
    } else {
    	if (_mobile_approval_write.FormPrefix == '') _mobile_approval_write.FormPrefix = '';
    }
	if (mobile_comm_getQueryString('isMobile', "approval_write_page") != 'undefined') {
		_mobile_approval_write.IsMobile = mobile_comm_getQueryString('isMobile', "approval_write_page");
    } else {
    	if (_mobile_approval_write.IsMobile == '') _mobile_approval_write.IsMobile = '';
    }
	
	if(_mobile_approval_write.OpenMode == "TEMPSAVE") {
		isLoad = "N";
	}
	
	if (mobile_comm_getQueryString('isNotify', "approval_write_page") == 'Y') {
		_mobile_approval_write.FormID = getInfo("FormInfo.FormID");
		_mobile_approval_write.FormInstID = getInfo("FormInstanceInfo.FormInstID");
    }
	
	if(_mobile_approval_write.OpenMode != "APVLIST") {
    	isApvMod = "Y";
    	
		mobile_approval_getDefaultInfo();

		mobile_approval_getFormList();	
		mobile_approval_write_clickTab($("#approval_write_tabmenu").find("li.step02").find("a"), 'menu', 'Y');
		
		if(_mobile_approval_write.OpenMode == "DRAFT") {
			if(_mobile_approval_write.FormPrefix != "") {
				// 특정 양식을 지정하여 작성창을 여는 경우
				$("#approval_write_formList > option[formprefix='" + _mobile_approval_write.FormPrefix + "']").attr("selected", "selected");
				$("#approval_write_formList").prop("disabled", true);
			}
			else {
				// 최초 작성 시 1번째 양식으로 바인딩
				$("#approval_write_formList > option").eq(0).attr("selected", "selected");
			}
			
			mobile_approval_selectForm($("#approval_write_formList"));
		}
		else if(_mobile_approval_write.OpenMode == "TEMPSAVE" || _mobile_approval_write.OpenMode == "MODIFY" || _mobile_approval_write.OpenMode == "REUSE") {
			$("#approval_write_formList").val(_mobile_approval_write.FormID);
			mobile_approval_selectForm($("#approval_write_formList"));

			// 원래 로직
			$("#approval_write_formList").prop("disabled", true);
			$("#approval_write_header").children("a").remove();
			if(_mobile_approval_write.OpenMode == "MODIFY") {
				$("#approval_write_header").find(".utill").find("a").hide();
				$("#approval_write_btn_completeMod").show();
			}
		}
	} else {
		var oApproveStep;
		
		mobile_approval_formjsonload();	// formjson 데이터 parsing.
		
	    if (getInfo("Request.mode") == "APPROVAL") {
	        var jsonApv = JSON.parse($("#APVLIST").val());
	        oApproveStep = $$(jsonApv).find("steps>division").has("taskinfo[status='pending']").find(">step").has("ou>person[code='" + getInfo("AppInfo.usid") + "']").has("ou>person>taskinfo[status='pending'])");
	    }
	    if ((getInfo("Request.loct") == "MONITOR") || (getInfo("Request.loct") == "PREAPPROVAL") || (getInfo("Request.loct") == "PROCESS") || (getInfo("Request.loct") == "REVIEW") || (getInfo("Request.loct") == "COMPLETE") || (getInfo("Request.mode") == "REJECT") || (getInfo("Request.mode") == "JOBDUTY") || (getInfo("Request.mode") == "PCONSULT") || getInfo("Request.subkind") == "T019" || getInfo("Request.subkind") == "T005"|| getInfo("Request.subkind") == "T018") { //20110318확인결재추가-확인결재자 결재선변경권한없음
	    	isApvMod = "N";
	    } else if (oApproveStep && oApproveStep.attr("routetype") == "approve" && oApproveStep.attr("allottype") == "parallel") {		// 동시결재자 결재선변경 방지 [2015-11-24]
	    	isApvMod = "N";
	    } else {
	    	isApvMod = "Y";
	    }
	    
		$("#approval_write_tabmenu").find("li:not('.step03')").hide();
		mobile_approval_write_clickTab($("#approval_write_tabmenu").find("li.step03").find("a"), 'menu');
		var oWriteHeader = $("#approval_write_header");
		$(oWriteHeader).find(".pg_tit").text(mobile_comm_getDic("lbl_ApprovalLine")); //결재선
		$(oWriteHeader).find(".utill").find("a").hide();
		$(oWriteHeader).children("a").remove(); //이상한 a 태그가 추가되는 현상 임시 조치
		$("#approval_write_btn_completeApv").show();

	    if(isApvMod == "N") {
	    	$(".ico_add_wh").parent().hide();
	    	$(".ico_reload").parent().hide();
	    	$("#approval_write_btn_completeApv").hide();
	    	
	    	//조회모드일 경우 결재유형을 select -> p 로 변경
	    	$("#approval_write_wraptype").find("li.person").each(function(i, obj){
	    		var selectedText = $(obj).find("select").find("option:selected").text();
	    		$(obj).prepend("<p class='name' style='margin: 14px 0;'>" + selectedText + "</p>");
	    		$(obj).find("select").remove();
	    	});
	    }
	}
	
	// 결재암호 사용 여부
	var g_UsePWDCheck = getInfo("SchemaContext.scWFPwd.isUse"); //결재암호 사용, 스키마 설정값 사용으로 변경 2012-01-02
	
	if (g_UsePWDCheck == "Y" && mobile_approval_chkCommentWrite($("#approval_write_inputpassword").val())){
		$(".approval_comment").addClass("secret");
	    document.getElementById("approval_write_inputpassword").focus();
	} else {
		$(".approval_comment").removeClass("secret");
	}
    
    if($(".ui-dialog").length > 0) {
    	$("#approval_write_btn_closeDialog").show();
    	$("#approval_write_btn_back").hide();
    } else {
    	$("#approval_write_btn_back").show();
    	$("#approval_write_btn_closeDialog").hide();
    }
}

// 양식선택 - 결재 양식 가져오기
function mobile_approval_getFormList() {
	var sHtml = "";
	var Params = {
			FormClassID : "",
			viewAll : "T", // 임시로 T로 박는다.
			entCode : "",
			deptCode : "",
			FormName : "",
	};

	$.ajax({
		url:"/approval/mobile/approval/getFormListData.do",
		type:"post",
		data:Params,
		async:false,
		success:function (data) {
			$("#approval_write_formList").empty();
			var cnt = data.list.length;
			for(var i=0; i< cnt; i++){
				if(data.list[i].ExtInfo.MobileFormYN != undefined && data.list[i].ExtInfo.MobileFormYN == "Y") {
					var formDesc = Base64.b64_to_utf8(data.list[i].FormDesc);
	
					$("#approval_write_formList").append($('<option>', {
						value: data.list[i].FormID,
						text: mobile_comm_getDicInfo(data.list[i].FormName),
						formPrefix: data.list[i].FormPrefix 
					}));
				}
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getFormListData.do", response, status, error);
		}
	});
}

// 양식선택 - 양식 선택 시 선택정보 전역변수에 저장
function mobile_approval_selectForm(obj) {
	var pFormID = $(obj).find("option:selected").val();
	var pFormPrefix = $(obj).find("option:selected").attr("formPrefix");
	
	// 제목 세팅
	if(_mobile_approval_write.OpenMode == "DRAFT") {
		$("#approval_write_Subject").val("");
	    $("#approval_write_Subject").removeAttr("readonly");
		mobile_approval_changeSelectBox($("#approval_write_Subject"));
	}
	
	if(_mobile_approval_write.FormID != pFormID) {
		$("#approval_write_formList").find("li").removeClass("on");
		$(obj).parent().addClass("on");
		_mobile_approval_write.FormID = pFormID;
		_mobile_approval_write.FormPrefix = pFormPrefix;
		
		mobile_approval_getFormInfo();
	}
}

// 세부항목 - 기본 정보 가져오기
function mobile_approval_getDefaultInfo() {
	$("#approval_write_InitiatorDisplay").html('<span class="label">' + mobile_comm_getDic("lbl_apv_initiator") + '</span>' + mobile_comm_getSession("USERNAME")); //작성자
	$("#approval_write_InitiatorOUDisplay").html('<span class="label">' + mobile_comm_getDic("lbl_WriterDept") + '</span>' + mobile_comm_getSession("DEPTNAME")); //작성부서
}

// 세부항목 - Form 가져오기 
function mobile_approval_getFormInfo() {
	if(_mobile_approval_write.FormID != "") {		
		var Params = {
			mode : _mobile_approval_write.Mode,
			processID : _mobile_approval_write.ProcessID,
			workitemID : _mobile_approval_write.WorkitemID,
			performerID : _mobile_approval_write.PerformerID,
			processdescriptionID : _mobile_approval_write.ProcessDescriptionID,
			userCode : _mobile_approval_write.UserCode,
			gloct : _mobile_approval_write.Gloct,
			formID : _mobile_approval_write.FormID,
			forminstanceID : _mobile_approval_write.FormInstID,
			subkind : _mobile_approval_write.SubKind,
			formtempID : _mobile_approval_write.FormTempID,
			forminstancetablename : _mobile_approval_write.FormInstTableName,
			archived : _mobile_approval_write.Archived,
			formPrefix : _mobile_approval_write.FormPrefix,
			isMobile : _mobile_approval_write.IsMobile,
			editMode : (_mobile_approval_write.OpenMode == "MODIFY" ? 'Y' : 'N')
		};
		
		$.ajax({
			url:"/approval/mobile/approval/getFormInfo.do",
			type:"post",
			data:Params,
			async:false,
			success:function (data) {	
				gFormFavoriteYN = data.strFormFavoriteYN; 
				strApvLineYN = data.strApvLineYN; 
				strErrorMsg = data.strErrorMsg; 
				strSuccessYN = data.strSuccessYN; 
			
				formJson = data.formJson; 
				
				if(strSuccessYN == false){
					alert(strErrorMsg);
					if(strErrorMsg == mobile_comm_getDic("msg_apv_formLoadErrorMsg")) //양식의 파일이 없거나, 오류가 발생하였습니다.
						mobile_comm_back();
					//else
					//	mobile_approval_write_clickTab($(".step01>a"), 'menu');
				} else {
					$("#approval_write_strMenuTempl").html(data.strMenuTempl);
					$("#approval_write_strApvLineTempl").html(data.strApvLineTempl);
					$("#approval_write_strCommonFieldsTempl").html(data.strCommonFieldsTempl);
					$("#approval_write_strHeaderTempl").html(data.strHeaderTempl);
					$("#approval_write_strBodyTempl").html(data.strBodyTempl).trigger("create");
					$("#approval_write_strFooterTempl").html(data.strFooterTempl);
					$("#approval_write_strAttachTempl").html(data.strAttachTempl);
					$("#approval_write_header").before("<script type='text/javascript'>" + data.strBodyTemplJS + "</script>").before(data.strEditorSrc);					
					
					mobile_approval_formload();
					
					$("#approval_write_strHeaderTempl").css("display", "none");					
				}
			},
			error:function(response, status, error){
				mobile_comm_ajaxerror("/approval/getFormInfo.do", response, status, error);
			}
		});
		
		if(strSuccessYN != false) {
			//결재선 가져오기
			mobile_approval_getApprovalLine();
		}	    
	}
}

// 세부항목 - 문서분류 선택 팝업 open
function mobile_approval_openDocClassPopup() {
	window.sessionStorage["_mobile_approval_write"] = JSON.stringify(_mobile_approval_write);
	mobile_comm_go("/approval/mobile/approval/select.do", 'Y');
}

//세부항목 - 문서분류 선택 팝업 close
function mobile_approval_closeDocClass() {
	mobile_comm_back();
	
	$("#approval_write_btn_back").show();
	$("#approval_write_btn_closeDialog").hide();
}

// 세부항목 - 연관문서 선택 팝업 open
function mobile_approval_addDocLink() {
	window.sessionStorage["approval_isDocSelect"] = "Y";
	window.sessionStorage["_mobile_approval_write"] = JSON.stringify(_mobile_approval_write);
	
	$("#approval_list_page").remove();
	
	mobile_comm_go("/approval/mobile/approval/list.do", 'Y');
}

//세부항목 - 연관문서 선택 팝업 close
function mobile_approval_closeDocLink() {
	window.sessionStorage["approval_isDocSelect"] = "N";
	mobile_comm_back();
	
	$("#approval_write_btn_back").show();
	$("#approval_write_btn_closeDialog").hide();
}

//세부항목 - 연관문서 결재함 변경
function mobile_approval_changeListType(pObj) {
	_mobile_approval_list.Mode = $(pObj).val();
	_mobile_approval_list.Page = 1;
	mobile_approval_getList(_mobile_approval_list);
	$("#approval_list_chkcnt").html("");
}

//세부항목 - 연관문서 선택
function mobile_approval_selectLinkedDoc() {
	var param = "";
	var bStore = "false";
	
	if(_mobile_approval_list.Mode.indexOf("Store") > -1) {
		bStore = "true";
	}
	
	$("input[type=checkbox][name=approval_list_chkbox]:checked").each(function(i, obj) {
		var chkObj = JSON.parse($(obj).val());
		
		param += (chkObj.ProcessArchiveID == undefined ? chkObj.ProcessID : chkObj.ProcessArchiveID) + "@@@" 
			+ chkObj.FormPrefix + "@@@" 
			+ chkObj.FormSubject + "@@@" 
			+ chkObj.FormInstID + "@@@" 
			+ bStore + "@@@"
			+ chkObj.BusinessData1 + "@@@"
			+ chkObj.BusinessData2;
		
		if($("input[type=checkbox][name=approval_list_chkbox]:checked").length-1 != i){
			param += "^^^";
		}
	});
	
	// 모듈(전자결재, e-Accounting)에 따른 데이터 리턴
	if(window.sessionStorage.getItem("account_docLink_receiptID") != null && window.sessionStorage.getItem("account_docLink_receiptID") != "") {
		mobile_account_setLinkedDoc(param);
	}
	else {
		mobile_approval_setLinkedDoc(param);
	}
	
	mobile_approval_closeDocLink();
}

//세부항목 - 선택된 연관문서 바인딩
function mobile_approval_setLinkedDoc(param) {
	if(param != "" && param != undefined) {
		var sHtml = "";
		
		var docs = param.split("^^^");
		var cnt = docs.length;
		for(var i = 0; i < cnt; i++) {
			var doc = docs[i];
			var pid = doc.split("@@@")[0];
			var fname = doc.split("@@@")[2];
			var obj = $("#approval_write_DocLinkInfo");
			$(obj).find("a").each(function (i, obj) {
				if($(obj).attr("value") == pid) {
					pid = "duplicate";
				}
			});
			if(pid != "duplicate")
				sHtml += "<a onclick='mobile_approval_delLinkedDoc(this); deletedocitem(this);' class='btn_add_docs ui-link' value='" + pid + "'>" + fname + "</a>";
		}
		
		$(obj).append(sHtml).show();		
		$("#label_DocLinkInfo").hide();
		
		InputDocLinks(param); //FormBody 함수
	}
}

//세부항목 - 연관문서 삭제
function mobile_approval_delLinkedDoc(pObj) {
	$("#DocLinkInfo").find("input[id='chkDoc'][name='_" + $(pObj).attr("value") + "']").prop("checked", true); //양식의 실제 연관문서 영역
	$(pObj).remove();
	if($("#approval_write_DocLinkInfo").html() == "") {
		$("#approval_write_DocLinkInfo").hide();	
		$("#label_DocLinkInfo").show();
	}
}

//세부항목 - 보안등급 및 보존년한 변경 시 값 바인딩
function mobile_approval_changeSelectBox(pObj) {
	var id = $(pObj).attr("id").replace("approval_write_", "");
	$("#" + id).val($(pObj).val());
}

// 결재선 - 결재선 가져오기
function mobile_approval_getApprovalLine(apv_type) {

	var sHtml = "";  //결재
	var scHtml = ""; //참조
	var sdHtml = ""; //배포
	var apvlist = JSON.parse($("#APVLIST").val());
	var l_ActiveModule = mobile_approval_getActiveModule();
	var l_ActivePageObj = window["_mobile_" + l_ActiveModule + "_write"];

	// 편집 불가능한 경우 버튼 영역 전체 숨김 처리
	if(isApvMod == "N") {
		$("#" + l_ActiveModule + "_write_div_approval").find(".btn_wrap").hide();
		$("#" + l_ActiveModule + "_write_div_tcinfo").find(".btn_wrap").hide();
		$("#" + l_ActiveModule + "_write_div_distribution").find(".btn_wrap").hide();
	}
	
	// 결재선 편집인 경우 초기화 버튼 숨김 처리
	if(typeof l_ActivePageObj == "object" && l_ActivePageObj.OpenMode == "APVLIST") {
		$("#" + l_ActiveModule + "_write_div_approval").find(".btn_wrap > a:has(.ico_reload)").hide();
		$("#" + l_ActiveModule + "_write_div_tcinfo").find(".btn_wrap > a:has(.ico_reload)").hide();
		$("#" + l_ActiveModule + "_write_div_distribution").find(".btn_wrap > a:has(.ico_reload)").hide();
	}
	
	// 결재
	if(apv_type == undefined || apv_type == "approval") {
		var d_length = apvlist.steps.division.length == undefined ? 1 : apvlist.steps.division.length;
		
		// division
		for(var i = 0; i < d_length; i++) {
			var division = (apvlist.steps.division[i] == undefined ? apvlist.steps.division : apvlist.steps.division[i]);
			var s_length = division.step.length == undefined ? 1 : division.step.length;
	
			if(i != 0) {
				sHtml += "<li class=\"arr\"><span></span></li>";
			}
			
			// step
			for(var j = 0; j < s_length; j++) {
				var step = (division.step[j] == undefined ? division.step : division.step[j]);
				var o_length = step.ou.length == undefined ? 1 : step.ou.length;
				
				// ou
				for(var k = 0 ; k < o_length ; k++) {
					var ou = (step.ou[k] == undefined ? step.ou : step.ou[k]);
					var temp = mobile_approval_getOuChildByType(ou);
					var type = "";
					var displayname = "";
                    var displayBypass = "";
					
					if(ou.person != undefined) {
						type = "person";
					} else {
						type = "dept";
					}
					var code = "";
					if (temp != null && temp !== undefined) {
						code = temp.code;
					}
					
					var name = mobile_comm_getDicInfo(temp.name, lang);
					var position = (type == "person" ? mobile_comm_getDicInfo(temp.position.split(";")[1], lang) : "");
					
					if(step.unittype == "person") {
						if(step.routetype == "consult") displayname = mobile_comm_getDic("lbl_apv_consent"); //개인합의
						else if(step.routetype == "assist") displayname = mobile_comm_getDic("lbl_apv_reject_consent"); //개인협조
						else if(step.routetype == "receive") displayname = mobile_comm_getDic("lbl_apv_charge_approve"); //담당결재
						else if(step.routetype == "audit") displayname = mobile_comm_getDic("lbl_apv_watch"); //감시
						else if(step.routetype == "approve" && step.name == "reference") displayname = mobile_comm_getDic("lbl_apv_share4list"); //참조
						else displayname = step.name;
						
						if (temp.taskinfo.kind == 'bypass') {
                            if ($$(step).find("person > taskinfo[kind='charge'], person > taskinfo[kind='substitute']").length >= 1 || step.name == "원결재자") {
                            	displayBypass = "style=\"display: none;\"";
                            }
                        }
					} else if(step.unittype == "ou") {
						if(step.routetype == "consult") displayname = mobile_comm_getDic("lbl_apv_DeptConsent"); //부서합의
						else if(step.routetype == "assist") displayname = mobile_comm_getDic("lbl_apv_DeptAssist"); //부서협조
						else if(step.routetype == "receive") displayname = mobile_comm_getDic("lbl_apv_charge_approve"); //담당결재
						else if(step.routetype == "audit") displayname = mobile_comm_getDic("lbl_apv_watch"); //감시
						else displayname = temp.name;
					}
					
					if(j != 0) {
						sHtml += "<li class=\"arr\" " + displayBypass + "><span></span></li>";
					}

					sHtml += "<li class=\"person\" id=\"approval_write_ApvList" + i + "_" + j + "_" + k + "\" " + displayBypass + ">";
					
					if(isApvMod == "Y" && (temp.taskinfo && temp.taskinfo.status != "pending" && temp.taskinfo.kind != "charge" && temp.taskinfo.datecompleted == undefined)) {
						var kind = temp.taskinfo.kind;
						
						sHtml += "	<select onchange=\"javascript: mobile_approval_changeApvSelect(this);\">";
						//sHtml += "		<option unittype=\"" + step.unittype + "\" routetype=\"" + step.routetype + "\" allottype=\"" + (step.allottype != undefined ? step.allottype : "") + "\" kind=\"" + kind + "\" name=\"" + displayname + "\" selected>" + displayname + "</option>";
						sHtml += mobile_approval_getApvTypeSelectOption(i, step.unittype, step.routetype, (step.allottype != undefined ? step.allottype : ""), kind, displayname);
						sHtml += "	</select>";
					}
					else {
						sHtml += "	<p class=\"name\" style=\"margin-bottom: 13px;\">" + displayname + "</p>";
					}
					
					sHtml += "	<a>";
					sHtml += "		<div class=\"image\">";
					if(type == "person") {
						var tempImgPath = mobile_approval_getProfileImagePath(code)[0];
						if(tempImgPath == undefined || tempImgPath == null)
							tempImgPath = "";
						else
							tempImgPath = tempImgPath.PhotoPath;
						sHtml += " 		<span class=\"photo\" style=\"background-image:url('" + tempImgPath + "'), url('" + _mobile_approval_profileImagePath + "')\">";
					}
					else {
						sHtml += " 		<span class=\"photo\" style=\"background-image:url('../../images/theme/blue/ico_folder.png')\">";
					}
					if(isApvMod == "N" || temp.taskinfo.status == "pending" || temp.taskinfo.kind == "charge") {
						
					} else if(temp.taskinfo.datecompleted == undefined) {
						sHtml += "		<span class=\"del\" onclick=\"javascript: mobile_approval_delApvUser(this);\"></span>";
					}
					sHtml += "		</div>";
					sHtml += "		<p class=\"name\">" + name + " " + position + "</p>";
					if(temp.taskinfo.datecompleted != undefined)
						sHtml += "	<p class=\"name\">" + formatDate(temp.taskinfo.datecompleted, "H") + "</p>";
					sHtml += "	</a>";
					if(isApvMod == "N" || temp.taskinfo.status == "pending" || temp.taskinfo.kind == "charge") {
					
					}
					else if(temp.taskinfo.datecompleted == undefined) {
						sHtml += "	<div class=\"btn_area\">";
						sHtml += "		<a onclick=\"javascript: mobile_approval_moveApvUser('prev', this);\" class=\"prev\"></a>";
						sHtml += "		<a onclick=\"javascript: mobile_approval_moveApvUser('next', this);\" class=\"next\"></a>";
						sHtml += "	</div>";
					}
					
					sHtml += "</li>";
				}
			}
		}
		$("#" + l_ActiveModule + "_write_approvalList").html(sHtml);
	}

	// 참조
	if(getInfo("SchemaContext.scCC.isUse") == "Y") {
		$("#" + l_ActiveModule + "_write_tabtype").find("li").eq(1).show();
		if(apv_type == undefined || apv_type == "tcinfo") {
			if(apvlist.steps.ccinfo != undefined) {
				var c_length = apvlist.steps.ccinfo.length == undefined ? 1 : apvlist.steps.ccinfo.length;
				
				for(var i = 0; i < c_length; i++) {
					var ccinfo = (apvlist.steps.ccinfo[i] == undefined ? apvlist.steps.ccinfo : apvlist.steps.ccinfo[i]);
					var ou = ccinfo.ou;
					var temp = null;
					var type = "";
					if(ou.person != undefined || ou.role != undefined) {
						type = "person";
						if(ou.person != undefined) {
							temp = JSON.parse(JSON.stringify(ou.person));
							if(ou.person.length > 1) {
								temp = JSON.parse(JSON.stringify(ou.person[ou.person.length-1]))
							}
						} else if(ou.role != undefined) {
							temp = JSON.parse(JSON.stringify(ou.role));
							if(ou.role.length > 1) {
								temp = JSON.parse(JSON.stringify(ou.role[ou.role.length-1]))
							}						
						}
					} else {
						type = "dept";
						temp = JSON.parse(JSON.stringify(ou));
					}
					
					var code = "";
					if (temp != null && temp !== undefined) {
						code = temp.code;
					}
					var name = mobile_comm_getDicInfo(temp.name);
					var position = " " + (type == "person" ? mobile_comm_getDicInfo(temp.position.split(";")[1]) : "");
					
					if(i != 0) {
						scHtml += "<li class=\"arr\"><span></span></li>";
					}
					scHtml += "<li class=\"person\" id=\"approval_write_CCList" + i + "\">";
					scHtml += "	<select onchange=\"javascript: mobile_approval_changeCCSelect(this);\">";
					if(getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y" && _mobile_approval_write.OpenMode == "DRAFT")
						scHtml += "	<option value=\"Y\" " + (ccinfo.beforecc == "y" ? "selected" : "") + ">" + mobile_comm_getDic("btn_apv_CReference") + "</option>"; //사전참조
					scHtml += "		<option value=\"N\" " + (ccinfo.beforecc == undefined ? "selected" : "") + ">" + mobile_comm_getDic("btn_apv_AReference") + "</option>"; //사후참조
					scHtml += "	</select>";
					scHtml += "	<a>";
					scHtml += "		<div class=\"image\">";
					if(type == "person") {
						var tempImgPath = mobile_approval_getProfileImagePath(code)[0];
						if(tempImgPath == undefined || tempImgPath == null)
							tempImgPath = "";
						else
							tempImgPath = tempImgPath.PhotoPath;
						scHtml += " 		<span class=\"photo\" style=\"background-image:url('" + tempImgPath + "'), url('" + _mobile_approval_profileImagePath + "')\">";
					}
					else {
						scHtml += " 		<span class=\"photo\" style=\"background-image:url('../../images/theme/blue/ico_folder.png')\">";
					}
					if(isApvMod != "N")
						scHtml += "		<span class=\"del\" onclick=\"javascript: mobile_approval_delApvUser(this);\"></span>";
					scHtml += "		</div>";
					scHtml += "		<p class=\"name\">" + name + position + "</p>";
					scHtml += "	</a>";
					scHtml += "</li>";
				}
				
				$("#" + l_ActiveModule + "_write_tcinfoList").html(scHtml).parents("div.approval_h").show();				
			} else {
				$("#" + l_ActiveModule + "_write_tcinfoList").parents("div.approval_h").hide();
			}
		}
	} else {
		$("#" + l_ActiveModule + "_write_tabtype").find("li").eq(1).hide();
	}

	// 배포
	if(getInfo("SchemaContext.scIPub.isUse") == "Y") {
		$("#" + l_ActiveModule + "_write_tabtype").find("li").eq(2).show();
		if(apv_type == undefined || apv_type == "distribution") {
			if($("#ReceiveNames").val() != "") {
				var r_length = $("#ReceiveNames").val().split(";").length;
				
				for(var i = 0; i < r_length; i++) {
					var receive = $("#ReceiveNames").val().split(";")[i];
					
					if(receive != "") {
						var info = receive.split(":");
			
						var type = info[0] == "0" ? "dept" : "person";
						var code = info[1];
						var name = info[2].replace(/&amp^/gi, "&").split("^")[0];
						var position = ""; //TODO: type이 user일 때 position 넘겨주기(어떻게..?) 
						var hasChild = info[3];				
						
						if(i != 0) {
							sdHtml += "<li class=\"arr\"><span></span></li>";
						}
						sdHtml += "<li class=\"person\" id=\"approval_write_RecList" + i + "\">";
						if(hasChild != "X" && type == "dept") {
							sdHtml += "	<select onchange=\"javascript: mobile_approval_changeRecSelect(this);\">";
							sdHtml += "		<option value=\"Y\" " + (hasChild == "Y" ? "selected" : "") + ">" + mobile_comm_getDic("lbl_apv_recinfo_td2") + "</option>"; //하위부서 포함
							sdHtml += "		<option value=\"N\" " + (hasChild == "N" ? "selected" : "") + ">" + mobile_comm_getDic("lbl_apv_recinfo_td3") + "</option>"; //하위부서 미포함
							sdHtml += "	</select>";
						}
						sdHtml += "	<a>";
						sdHtml += "		<div class=\"image\">";
						if(type == "person") {
							var tempImgPath = mobile_approval_getProfileImagePath(code)[0];
							if(tempImgPath == undefined || tempImgPath == null)
								tempImgPath = "";
							else
								tempImgPath = tempImgPath.PhotoPath;
							sdHtml += " 		<span class=\"photo\" style=\"background-image:url('" + tempImgPath + "'), url('" + _mobile_approval_profileImagePath + "')\">";
						}
						else {
							sdHtml += " 		<span class=\"photo\" style=\"background-image:url('../../images/theme/blue/ico_folder.png')\">";
						}
						if(isApvMod != "N")
							sdHtml += "		<span class=\"del\" onclick=\"javascript: mobile_approval_delApvUser(this);\"></span>";
						sdHtml += "		</div>";
						sdHtml += "		<p class=\"name\">" + name + position + "</p>";
						sdHtml += "	</a>";
						sdHtml += "</li>";
					}
				}
				
				$("#" + l_ActiveModule + "_write_distributionList").html(sdHtml);
				$("#" + l_ActiveModule + "_write_distributionList").parents("div.approval_h").show();
			} else {
				$("#" + l_ActiveModule + "_write_distributionList").parents("div.approval_h").hide();
			}
		}
	} else {
		$("#" + l_ActiveModule + "_write_tabtype").find("li").eq(2).hide();
	}
}

// 결재선 - 결재 유형 옵션
// [2020-02-03 MOD] 병렬 관련 옵션 미사용 처리(추후 보완 예정)
function mobile_approval_getApvTypeSelectOption(division, unittype, routetype, allottype, kind, name) {
	var sHtml = "";
	allottype = allottype == undefined ? "" : allottype;
	if(unittype == "person" && !(routetype == "approve" && kind == "charge" && name == "기안자")) {
		if ((routetype == "approve" && kind == "normal" && name == "일반결재")) {
			sHtml += "<option unittype=\"person\" routetype=\"approve\" allottype=\"\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_normalapprove") + "\" selected>" + mobile_comm_getDic("lbl_apv_normalapprove") + "</option>"; //일반결재, 일반결재	
		}
		
		if(division == "0") {
			if (getInfo("SchemaContext.scPAdt.isUse") == "Y" && getInfo("SchemaContext.scPAdt.value") == "")  {
				if(routetype == "audit" && name == "개인감사") {
					sHtml += "<option unittype=\"person\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_person_audit") + "\" selected>" + mobile_comm_getDic("btn_apv_person_audit") + "</option>"; //개인감사, 개인감사
				} else {
					sHtml += "<option unittype=\"person\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_person_audit") + "\">" + mobile_comm_getDic("btn_apv_person_audit") + "</option>"; //개인감사, 개인감사
				}
			}
				
		    if (getInfo("SchemaContext.scPAdt1.isUse") == "Y" && getInfo("SchemaContext.scPAdt1.value") == "") {
		    	if (routetype == "audit" && name == "개인준법") {
		    		sHtml += "<option unittype=\"person\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_person_audit1") + "\" selected>" + mobile_comm_getDic("btn_apv_person_audit1") + "</option>"; //개인준법, 개인준법
		    	} else {
		    		sHtml += "<option unittype=\"person\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_person_audit1") + "\">" + mobile_comm_getDic("btn_apv_person_audit1") + "</option>"; //개인준법, 개인준법
		    	}
		    }
		    
		    //if (getInfo("SchemaContext.scPAgr.isUse") == "Y" && !(routetype == "consult" && allottype == "parallel")) 
		    	//sHtml += "<option unittype=\"person\" routetype=\"consult\" allottype=\"parallel\" kind=\"consult\" name=\"" + mobile_comm_getDic("lbl_apv_Par") + "\">" + mobile_comm_getDic("lbl_apv_consent") + "</option>"; //병렬합의, 개인합의
		    
		    
		    if (getInfo("SchemaContext.scPAgrSEQ.isUse") == "Y") {
		    	if(routetype == "consult" && allottype == "serial") {
		    		sHtml += "<option unittype=\"person\" routetype=\"consult\" allottype=\"serial\" kind=\"consult\" name=\"" + mobile_comm_getDic("lbl_apv_Seq") + "\" selected>" + mobile_comm_getDic("lbl_apv_consent") + "</option>"; //순차합의, 개인합의
		    	} else {
		    		sHtml += "<option unittype=\"person\" routetype=\"consult\" allottype=\"serial\" kind=\"consult\" name=\"" + mobile_comm_getDic("lbl_apv_Seq") + "\">" + mobile_comm_getDic("lbl_apv_consent") + "</option>"; //순차합의, 개인합의
		    	}
		    }
		    
		    //if (getInfo("SchemaContext.scPCoo.isUse") == "Y" && !(routetype == "assist" && allottype == "parallel"))
		    	//sHtml += "<option unittype=\"person\" routetype=\"assist\" allottype=\"parallel\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_Par") + "\">" + mobile_comm_getDic("lbl_apv_reject_consent") + "</option>"; //병렬합의, 개인협조
		    
		    if (getInfo("SchemaContext.scPCooPL.isUse") == "Y") {
		    	if (routetype == "assist" && allottype == "serial") {
		    		sHtml += "<option unittype=\"person\" routetype=\"assist\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_Seq") + "\" selected>" + mobile_comm_getDic("lbl_apv_reject_consent") + "</option>"; //순차합의, 개인협조
		    	} else {
		    		sHtml += "<option unittype=\"person\" routetype=\"assist\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_Seq") + "\">" + mobile_comm_getDic("lbl_apv_reject_consent") + "</option>"; //순차합의, 개인협조
		    	}
		    }
		}
	    /*if (getInfo("SchemaContext.scPRec.isUse") == "Y")
	    	sHtml += "<option unittype=\"person\" routetype=\"receive\" allottype=\"\" kind=\"\">담당결재</option>"; //divisiontype = "receive"
	    if (getInfo("SchemaContext.scPConfirm.isUse") == "Y")
	    	sHtml += "<option unittype=\"person\" routetype=\"approve\" allottype=\"\" kind=\"\">확인자</option>";
	    if (getInfo("SchemaContext.scPShare.isUse") == "Y")
	    	sHtml += "<option unittype=\"person\" routetype=\"approve\" allottype=\"\" kind=\"\">참조자</option>";*/
	} else if(unittype == "ou"){
		if(division == "0") {
		    if (getInfo("SchemaContext.scDAdt1.isUse") == "Y" && getInfo("SchemaContext.scDAdt1.value") == "") {
		    	if (routetype == "audit" && name == "audit_dept") {
		    		sHtml += "<option unittype=\"ou\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_dept_audit") + "\" selected>" + mobile_comm_getDic("btn_apv_dept_audit") + "</option>"; //부서감사, 부서감사
		    	} else {
		    		sHtml += "<option unittype=\"ou\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_dept_audit") + "\">" + mobile_comm_getDic("btn_apv_dept_audit") + "</option>"; //부서감사, 부서감사
		    	}
		    }
		    	
		    if (getInfo("SchemaContext.scDAdt.isUse") == "Y" && getInfo("SchemaContext.scDAdt.value") == "") {
		    	if (routetype == "audit" && name == "audit_law_dept") {
		    		sHtml += "<option unittype=\"ou\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_dept_audit1") + "\" selected>" + mobile_comm_getDic("btn_apv_dept_audit1") + "</option>"; //부서준법, 부서준법
		    	} else {
		    		sHtml += "<option unittype=\"ou\" routetype=\"audit\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("btn_apv_dept_audit1") + "\">" + mobile_comm_getDic("btn_apv_dept_audit1") + "</option>"; //부서준법, 부서준법
		    	}
		    }
		    	
		    //if (getInfo("SchemaContext.scDAgr.isUse") == "Y" && !(routetype == "consult" && allottype == "parallel"))
		    	//sHtml += "<option unittype=\"ou\" routetype=\"consult\" allottype=\"parallel\" kind=\"consult\" name=\"" + mobile_comm_getDic("btn_apv_consultdept") + "\">" + mobile_comm_getDic("btn_apv_consultdept") + "</option>"; //부서합의, 부서합의
		    
		    if (getInfo("SchemaContext.scDAgrSEQ.isUse") == "Y") {
		    	if (routetype == "consult" && allottype == "serial") {
		    		sHtml += "<option unittype=\"ou\" routetype=\"consult\" allottype=\"serial\" kind=\"consult\" name=\"" + mobile_comm_getDic("btn_apv_consultdept") + "\" selected>" + mobile_comm_getDic("btn_apv_consultdept") + "</option>"; //부서합의, 부서합의
		    	} else {
		    		sHtml += "<option unittype=\"ou\" routetype=\"consult\" allottype=\"serial\" kind=\"consult\" name=\"" + mobile_comm_getDic("btn_apv_consultdept") + "\">" + mobile_comm_getDic("btn_apv_consultdept") + "</option>"; //부서합의, 부서합의
		    	}
		    }
		    	
		    //if (getInfo("SchemaContext.scDCooPL.isUse") == "Y" && !(routetype == "assist" && allottype == "parallel"))
		    	//sHtml += "<option unittype=\"ou\" routetype=\"assist\" allottype=\"parallel\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_DAsist") + "\">" + mobile_comm_getDic("lbl_apv_DeptAssist") + "</option>"; //협조부서, 부서협조
		    
		    if (getInfo("SchemaContext.scDCoo.isUse") == "Y" && !(routetype == "assist" && allottype == "serial")) {
		    	if (routetype == "assist" && allottype == "serial") {
		    		sHtml += "<option unittype=\"ou\" routetype=\"assist\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_DAsist") + "\" selected>" + mobile_comm_getDic("lbl_apv_DeptAssist") + "</option>"; //협조부서, 부서협조
		    	} else {
		    		sHtml += "<option unittype=\"ou\" routetype=\"assist\" allottype=\"serial\" kind=\"normal\" name=\"" + mobile_comm_getDic("lbl_apv_DAsist") + "\">" + mobile_comm_getDic("lbl_apv_DeptAssist") + "</option>"; //협조부서, 부서협조
		    	}
		    }
		    	
		}
	    /*if (getInfo("SchemaContext.scDRec.isUse") == "Y")
	    	sHtml += "<option unittype=\"ou\" routetype=\"receive\" allottype=\"\" kind=\"\">수신처</option>";*/
	}
	
	return sHtml;
}

// 결재선 - 결재선 이동
function mobile_approval_moveApvUser(pMode, obj) {
	var l_ActiveModule = mobile_approval_getActiveModule();
	var d_num = $(obj).parents("li").attr("id").replace("approval_write_ApvList", "").split("_")[0];
	var s_num = $(obj).parents("li").attr("id").replace("approval_write_ApvList", "").split("_")[1];
	var apvlist = JSON.parse($("#APVLIST").val());
	var last1 = 0;
	var last2 = 0;
	var division1 = null;
	var division2 = null;
	var target_step = null;
	var target_step_taskinfo = null;
	
	if(apvlist.steps.division.length == undefined) {
		division1 = apvlist.steps.division;
		last1 = division1.step.length != undefined ? division1.step.length-1 : 0;
	} else {
		division1 = apvlist.steps.division[0];
		division2 = apvlist.steps.division[1];
		last1 = division1.step.length != undefined ? division1.step.length-1 : 0;
		last2 = division2.step.length != undefined ? division2.step.length-1 : 0;	
	}
	
	// 발신/수신에 따른 체크
	if(d_num == "0") {
		if(s_num == "0") {
			alert(mobile_comm_getDic("msg_apv_ApvLineMoveCheck1")); //해당 사용자는 기안자이므로 이동 불가합니다.
			return false;
		} else {
			if(s_num == "1" && pMode == "prev") {
				alert(mobile_comm_getDic("msg_apv_ApvLineMoveCheck2")); //해당 사용자는 최초 결재자이므로 이동 불가합니다.
				return false;
			} else if(s_num == last1 && pMode == "next") {
				alert(mobile_comm_getDic("msg_apv_ApvLineMoveCheck3")); //해당 사용자는 최종 결재자이므로 이동 불가합니다.
				return false;
			} else {
				var temp_num = Number(s_num);
				var curr_step = JSON.parse(JSON.stringify(division1.step[temp_num]));
				
				if(pMode == "prev") {
					target_step = JSON.parse(JSON.stringify(division1.step[temp_num-1]));
					division1.step[temp_num] = target_step;
					division1.step[temp_num-1] = curr_step;
				} else if(pMode == "next") { 
					target_step = JSON.parse(JSON.stringify(division1.step[temp_num+1]));
					division1.step[temp_num] = target_step;
					division1.step[temp_num+1] = curr_step;
				}
			}
		}
	} else if(d_num == "1") {
		if(s_num == "0" && pMode == "prev") {
			alert(mobile_comm_getDic("msg_apv_ApvLineMoveCheck2")); //해당 사용자는 최초 결재자이므로 이동 불가합니다.
			return false;
		} else if(s_num == last2 && pMode == "next") {
			alert(mobile_comm_getDic("msg_apv_ApvLineMoveCheck3")); //해당 사용자는 최종 결재자이므로 이동 불가합니다.
			return false;
		} else {
			var temp_num = Number(s_num);
			
			if (division2 == null) {
				alert(mobile_comm_getDic("msg_apv_030")); // 오류가 발생했습니다.
				return false;
			}
			
			var curr_step = JSON.parse(JSON.stringify(division2.step[temp_num]));
			
			if(pMode == "prev") {
				target_step = JSON.parse(JSON.stringify(division2.step[temp_num-1]));
				division2.step[temp_num] = target_step;
				division2.step[temp_num-1] = curr_step;
			} else if(pMode == "next") {
				target_step = JSON.parse(JSON.stringify(division2.step[temp_num+1]));
				division2.step[temp_num] = target_step;
				division2.step[temp_num+1] = curr_step;
			}
		}
	}
	
	if (target_step == null) {
		alert(mobile_comm_getDic("msg_apv_030")); // 오류가 발생했습니다.
		return false;
	}
	
	// person/role/ou 리턴
	var oOu = target_step.ou.length == undefined ? target_step.ou : target_step.ou[o_num];
	target_step_taskinfo = mobile_approval_getOuChildByType(oOu).taskinfo;

	// 이동 가능 여부 체크
	if(target_step_taskinfo.status == "pending" || target_step_taskinfo.kind == "charge" || target_step_taskinfo.datecompleted) {
		return false;
	}
	
	// 변경된 결재선 적용
	$("#APVLIST").val(JSON.stringify(apvlist));
	
	mobile_approval_getApprovalLine("approval");
}

// 결재선 - 결재선 추가
function mobile_approval_addApprovalLine(pMode) {
	_mobile_approval_write.ApvLineMode = pMode;
	
	var sUrl = "/covicore/mobile/org/list.do";
	
	// 기안부서 내 결재선 편집하는 경우 이외에 사용자에 한하여 추가 가능
	if(getInfo("Request.mode") == "DRAFT" || getInfo("Request.mode") == "APPROVAL") {
		// [2020-02-03 MOD] 병렬 관련 옵션 미사용 처리(추후 보완 예정)
		if(getInfo("SchemaContext.scDAdt1.isUse") == "Y" || getInfo("SchemaContext.scDAdt.isUse") == "Y" || getInfo("SchemaContext.scDAgrSEQ.isUse") == "Y" || getInfo("SchemaContext.scDCoo.isUse") == "Y") {
			window.sessionStorage["mode"] = "Select";
		}
		else {
			window.sessionStorage["mode"] = "SelectUser";
		}
		
	} else {
		window.sessionStorage["mode"] = "SelectUser";
	}
	
	window.sessionStorage["multi"] = "Y";
	window.sessionStorage["callback"] = "mobile_approval_setApprovalLine();";
	window.sessionStorage["userinfo"] = null;
	mobile_comm_go(sUrl, 'Y');
}


// 결재선 - 결재선 추가 callback
function mobile_approval_setApprovalLine() {
	var l_ActiveModule = mobile_approval_getActiveModule();
	var l_ActivePageObj = window["_mobile_" + l_ActiveModule + "_write"];
	
	mobile_comm_showload();
	
	//[결재선] 탭 선택
	mobile_approval_write_clickTab($("#" + l_ActiveModule + "_write_tabmenu").find("li.step03").find("a"), 'menu');
	
	//Form ID를 통해 선택된 양식 on class 부여
	if(typeof l_ActivePageObj == "object" && l_ActivePageObj.FormID) {
		$("#" + l_ActiveModule + "_write_form_" + l_ActivePageObj.FormID).addClass("on");
	}
	
	var userinfos = JSON.parse("[" + window.sessionStorage["userinfo"] + "]");
	var apvlist = JSON.parse($("#APVLIST").val());
	
	//결재
	if(l_ActivePageObj.ApvLineMode == "approval") {
		$(userinfos).each(function(i, userinfo) {
			var new_step = null;
			var division = null;
			
			if($$(apvlist).find("steps>division>taskinfo[status=pending]").parent().length > 0) {
				division = $$(apvlist).find("steps>division>taskinfo[status=pending]").parent().json();
			} else {
				division = apvlist.steps.division[0] == undefined ? apvlist.steps.division : apvlist.steps.division[0];
			}
			
			if(division.step.length == undefined) {
				new_step = JSON.parse(JSON.stringify(division.step));
			} else {
				new_step = JSON.parse(JSON.stringify(division.step[division.step.length-1]));
			}
			
			if(userinfo.itemType == "user") {
				new_step.name = "일반결재";
				new_step.unittype = "person";
				new_step.routetype = "approve";
				
		        if(new_step.allottype != undefined)
		        	delete new_step.allottype;
		        if(new_step.taskinfo != undefined)
		        	delete new_step.taskinfo;
			
				new_step.ou.code = userinfo.RG;
				new_step.ou.name = mobile_comm_getDicInfo(userinfo.RGNM, lang);
		        
				if(new_step.ou.person == undefined)
					new_step.ou.person = {};
				
				new_step.ou.person.oucode = userinfo.RG;
				new_step.ou.person.ouname = mobile_comm_getDicInfo(userinfo.RGNM, lang);
				new_step.ou.person.code = userinfo.AN;
				new_step.ou.person.name = mobile_comm_getDicInfo(userinfo.DN, lang);
				
				var position = userinfo.PO.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.PO.split("&")[1], lang);
				var title = userinfo.TL.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.TL.split("&")[1], lang);
				var level = userinfo.LV.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.LV.split("&")[1], lang);
				
				new_step.ou.person.position = position;
				new_step.ou.person.title = title;
				new_step.ou.person.level = level;
				
				if(new_step.ou.person == undefined || new_step.ou.person.taskinfo == undefined)
					new_step.ou.person.taskinfo = {};
				
				new_step.ou.person.taskinfo.status = "inactive";
				new_step.ou.person.taskinfo.result = "inactive";
				new_step.ou.person.taskinfo.kind = "normal";
				
				if(new_step.ou.person.taskinfo.datereceived != undefined)
		        	delete new_step.ou.person.taskinfo.datereceived;
				
				if(new_step.ou.widescid != undefined) delete new_step.ou.widescid;
				if(new_step.ou.taskid != undefined) delete new_step.ou.taskid;
				if(new_step.ou.pfid != undefined) delete new_step.ou.pfid;
				if(new_step.ou.wiid != undefined) delete new_step.ou.wiid;
				
			} else if(userinfo.itemType == "group"){
				if (getInfo("SchemaContext.scDAgrSEQ.isUse") == "Y" ) {
					// 부서합의(순차)
					new_step.name = "부서합의";
					new_step.routetype = "consult";
				} else if (getInfo("SchemaContext.scDCoo.isUse") == "Y") {
					// 부서협조(순차)
					new_step.name = "부서협조";
					new_step.routetype = "assist";
				} else if (getInfo("SchemaContext.scDAdt1.isUse") == "Y") {
					// 부서감사
					new_step.name = "audit_dept";
					new_step.routetype = "audit";
				} else if (getInfo("SchemaContext.scDAdt.isUse") == "Y") {
					// 부서준법
					new_step.name = "audit_law_dept";
					new_step.routetype = "audit";
				}
				
				new_step.unittype = "ou";
				new_step.allottype = "serial"; // [2020-02-03 MOD] 병렬 관련 옵션 미사용 처리(추후 보완 예정)
				
				if(new_step.taskinfo == undefined)
					new_step.taskinfo = {};
				
				new_step.taskinfo.status = "inactive";
				new_step.taskinfo.result = "inactive";
				new_step.taskinfo.kind = "normal";
				
				new_step.ou.code = userinfo.AN;
				new_step.ou.name = mobile_comm_getDicInfo(userinfo.DN, lang);
				
				if(new_step.ou.taskinfo == undefined)
					new_step.ou.taskinfo = {};
				
				new_step.ou.taskinfo.status = "inactive";
				new_step.ou.taskinfo.result = "inactive";
				new_step.ou.taskinfo.kind = "normal";
				
				if(new_step.ou.widescid != undefined) delete new_step.ou.widescid;
				if(new_step.ou.taskid != undefined) delete new_step.ou.taskid;
				if(new_step.ou.pfid != undefined) delete new_step.ou.pfid;
				if(new_step.ou.wiid != undefined) delete new_step.ou.wiid;			
				if(new_step.ou.person != undefined) delete new_step.ou.person;
			}
			
			if(division.step.length == undefined) {
				var temp_step = JSON.parse(JSON.stringify(division.step));
				var temp_array = [];
				temp_array.push(temp_step);
				temp_array.push(new_step);
				delete division.step;
				division.step = temp_array;			
			} else {
				division.step.push(new_step);
			}
			
			$("#APVLIST").val(JSON.stringify(apvlist));
		});
		
		mobile_approval_getApprovalLine("approval");
		
	}
	//참조
	else if(l_ActivePageObj.ApvLineMode == "tcinfo") {
		$(userinfos).each(function(i, userinfo) {
			var new_ccinfo = null;
			
			if(apvlist.steps.ccinfo != undefined) {
				if(apvlist.steps.ccinfo.length == undefined) {
					new_ccinfo = JSON.parse(JSON.stringify(apvlist.steps.ccinfo));
				} else {
					new_ccinfo = JSON.parse(JSON.stringify(apvlist.steps.ccinfo[apvlist.steps.ccinfo.length-1]));
				}
				
				new_ccinfo.belongto = "sender";
				new_ccinfo.datereceived = "";
				if(new_ccinfo.beforecc != undefined)
					delete new_ccinfo.beforecc;
				
				if(userinfo.itemType == "user") {		
					new_ccinfo.ou.code = userinfo.RG;
					new_ccinfo.ou.name = mobile_comm_getDicInfo(userinfo.RGNM, lang);
			        
					if(new_ccinfo.ou.person == undefined)
						new_ccinfo.ou.person = {};
					
					new_ccinfo.ou.person.oucode = userinfo.RG;
					new_ccinfo.ou.person.ouname = mobile_comm_getDicInfo(userinfo.RGNM, lang);
					new_ccinfo.ou.person.code = userinfo.AN;
					new_ccinfo.ou.person.name = mobile_comm_getDicInfo(userinfo.DN, lang);
					
					var position = userinfo.PO.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.PO.split("&")[1], lang);
					var title = userinfo.TL.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.TL.split("&")[1], lang);
					var level = userinfo.LV.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.LV.split("&")[1], lang);
					
					new_ccinfo.ou.person.position = position;
					new_ccinfo.ou.person.title = title;
					new_ccinfo.ou.person.level = level;
					new_ccinfo.ou.person.sipaddress = userinfo.EM;
				} else if(userinfo.itemType == "group"){
					new_ccinfo.ou.code = userinfo.AN;
					new_ccinfo.ou.name = mobile_comm_getDicInfo(userinfo.DN, lang);
					
					if(new_ccinfo.ou.person != undefined)
			        	delete new_ccinfo.ou.person;
				}
				
				if(apvlist.steps.ccinfo.length == undefined) {
					var temp_ccinfo = JSON.parse(JSON.stringify(apvlist.steps.ccinfo));
					var temp_array = [];
					temp_array.push(temp_ccinfo);
					temp_array.push(new_ccinfo);
					delete apvlist.steps.ccinfo;
					apvlist.steps.ccinfo = temp_array;
					
				} else {
					apvlist.steps.ccinfo.push(new_ccinfo);
				}
			} else {
				new_ccinfo = {};
				
				new_ccinfo.belongto = "sender";
				new_ccinfo.datereceived = "";
				new_ccinfo.ou = {};
				
				if(userinfo.itemType == "user") {					
					new_ccinfo.ou.code = userinfo.RG;
					new_ccinfo.ou.name = mobile_comm_getDicInfo(userinfo.RGNM, lang);
			        
					new_ccinfo.ou.person = {};
					
					new_ccinfo.ou.person.oucode = userinfo.RG;
					new_ccinfo.ou.person.ouname = mobile_comm_getDicInfo(userinfo.RGNM, lang);
					new_ccinfo.ou.person.code = userinfo.AN;
					new_ccinfo.ou.person.name = mobile_comm_getDicInfo(userinfo.DN, lang);
					
					var position = userinfo.PO.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.PO.split("&")[1], lang);
					var title = userinfo.TL.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.TL.split("&")[1], lang);
					var level = userinfo.LV.split("&")[0] + "_" + mobile_comm_getSession("DN_ID") + ";" + mobile_comm_getDicInfo(userinfo.LV.split("&")[1], lang);
					
					new_ccinfo.ou.person.position = position;
					new_ccinfo.ou.person.title = title;
					new_ccinfo.ou.person.level = level;
					new_ccinfo.ou.person.sipaddress = userinfo.EM;
				} else if(userinfo.itemType == "group"){
					new_ccinfo.ou.code = userinfo.AN;
					new_ccinfo.ou.name = mobile_comm_getDicInfo(userinfo.DN, lang);
				}
				
				apvlist.steps.ccinfo = new_ccinfo;
			}
			
			$("#APVLIST").val(JSON.stringify(apvlist));
		});
		mobile_approval_getApprovalLine("tcinfo");
	}
	//배포
	else if(l_ActivePageObj.ApvLineMode == "distribution") {
		$(userinfos).each(function(i, userinfo) {
			var recList = "";
			if($("#ReceiveNames").val() != "") recList += ";";
			
			var type = userinfo.itemType == "user" ? "1" : "0";
			var code = userinfo.AN;
			var name = mobile_comm_getDicInfo(userinfo.DN, lang);
			var hasChild = "X";
			if(type == "0") if(userinfo.hasChild != "0") hasChild = "N"; 
			
			recList += type + ":" + code + ":" + name + ":" + hasChild; 
			
			$("#ReceiveNames").val($("#ReceiveNames").val() + recList);
		});
		mobile_approval_getApprovalLine("distribution");
	}
	
	if(l_ActivePageObj.OpenMode != "APVLIST" || isApvMod == "N") {
		$("#approval_write_btn_completeApv").hide();
	}
	
	mobile_comm_hideload();
}

// 결재선 - 결재선 삭제
function mobile_approval_delApvUser(obj) {
	var l_ActiveModule = mobile_approval_getActiveModule();
	var remove_li = $(obj).parents("li");
	
	//결재
	if(_mobile_approval_write.ApvLineMode == "approval") {
		var d_num = $(remove_li).attr("id").replace("approval_write_ApvList", "").split("_")[0]; //division
		var s_num = $(remove_li).attr("id").replace("approval_write_ApvList", "").split("_")[1]; //step
		var apvlist = JSON.parse($("#APVLIST").val());
		
		var division = apvlist.steps.division[d_num] == undefined ? apvlist.steps.division : apvlist.steps.division[d_num];
		var step = division.step[s_num] == undefined ? division.step : division.step[s_num];
		if(division.step[s_num] == undefined && s_num == 0) {
			apvlist.steps.division.splice(d_num, 1);
			$("#APVLIST").val(JSON.stringify(apvlist));
		}
		else {
			division.step.splice(s_num, 1);
			$("#APVLIST").val(JSON.stringify(apvlist));
		}
		
		mobile_approval_getApprovalLine("approval");
	}
	//참조
	else if(_mobile_approval_write.ApvLineMode == "tcinfo") {
		var c_num = $(remove_li).attr("id").replace("approval_write_CCList", "");
		var apvlist = JSON.parse($("#APVLIST").val());
		
		if(apvlist.steps.ccinfo.length != undefined)
			apvlist.steps.ccinfo.splice(c_num, 1);
		else
			delete apvlist.steps.ccinfo;
		$("#APVLIST").val(JSON.stringify(apvlist));
		
		mobile_approval_getApprovalLine("tcinfo");	
	}
	//배포
	else if(_mobile_approval_write.ApvLineMode == "distribution") {
		var r_num = $(remove_li).attr("id").replace("approval_write_RecList", "");
		var receive = $("#ReceiveNames").val().split(";")[r_num];
		var slice = "";
		if($("#ReceiveNames").val().indexOf(";") > -1)
			slice = ";";
		
		if(r_num == "0")
			$("#ReceiveNames").val($("#ReceiveNames").val().replace((receive + slice), ""));
		else
			$("#ReceiveNames").val($("#ReceiveNames").val().replace((slice + receive), ""));
		
		mobile_approval_getApprovalLine("distribution");
	}
}

// 결재선 - 결재 Select Box Change(결재 유형 변경)
function mobile_approval_changeApvSelect(obj) {
	var apvlist = JSON.parse($("#APVLIST").val());
	
	var d_num = $(obj).parent().attr("id").replace("approval_write_ApvList", "").split("_")[0];
	var s_num = $(obj).parent().attr("id").replace("approval_write_ApvList", "").split("_")[1];
	
	var unittype = $(obj).find("option:selected").attr("unittype");
	var routetype = $(obj).find("option:selected").attr("routetype");
	var allottype = $(obj).find("option:selected").attr("allottype");
	var kind = $(obj).find("option:selected").attr("kind");
	var name = $(obj).find("option:selected").attr("name");

	var bCreateStepTaskinfo = false;
	
	if(d_num == "0") {		
		var division = apvlist.steps.division.length == undefined ? apvlist.steps.division : apvlist.steps.division[d_num];
		var step = division.step.length == undefined ? division.step : division.step[s_num];
		step.routetype = routetype;
		step.name = name;
		if(allottype != "" && allottype != undefined) {
			step.allottype = allottype;
			bCreateStepTaskinfo = true;
		}
		if(unittype == "person") {
			step.ou.person.taskinfo.kind = kind;

			if(step.taskinfo != undefined) {
	        	delete step.taskinfo;
			}
		} else if(unittype == "ou") {
			step.taskinfo.kind = kind;
			step.ou.taskinfo.kind = kind;
		}

		if(bCreateStepTaskinfo) {
			if(step.taskinfo == undefined) {
				step.taskinfo = {};
			}
			
			step.taskinfo.status = "inactive";
			step.taskinfo.result = "inactive";
			step.taskinfo.kind = routetype;
		}
	}
	
	$("#APVLIST").val(JSON.stringify(apvlist));
}

// 결재선 - 참조 Select Box Change(사전/사후 참조)
function mobile_approval_changeCCSelect(obj) {
	var apvlist = JSON.parse($("#APVLIST").val());
	
	if(apvlist.steps.ccinfo != undefined) {
		var selected = $(obj).find("option:selected").val();
		var num = $(obj).parent().attr("id").replace("approval_write_CCList", "");
		var ccinfo = apvlist.steps.ccinfo.length == undefined ? apvlist.steps.ccinfo : apvlist.steps.ccinfo[num];
		if(selected == "Y" && ccinfo.beforecc == undefined) { //사전참조 선택 & beforecc가 undefined일 때 
			ccinfo.beforecc = "y";
		} else {
			delete ccinfo.beforecc;
		}
	}
	
	$("#APVLIST").val(JSON.stringify(apvlist));
}

// 결재선 - 배포 Select Box Change(하위부서 포함/미포함)
function mobile_approval_changeRecSelect(obj) {
	//"0:RD02:연구2팀:X;1:dhkim:김덕화:X;0:RD:기술연구소:Y"
	
	var selected = $(obj).find("option:selected").val(); //Y
	var num = $(obj).parent().attr("id").replace("approval_write_RecList", ""); //0
	
	var receive = $("#ReceiveNames").val().split(";")[num]; //0:RD02:연구2팀:X
	var new_receive = receive.replace(receive.split(":")[3], "") + selected; //0:RD02:연구2팀: + Y
	
	$("#ReceiveNames").val($("#ReceiveNames").val().replace(receive, new_receive));
}

//결재선 - 사용자/부서 여부에 따른 step 하위 ou 또는  person/role 리턴
function mobile_approval_getOuChildByType(pOu) {
	var ou = pOu;
	var retObj = null;
	
	if(ou.person != undefined || ou.role != undefined) {
		if(ou.person != undefined) {
			retObj = JSON.parse(JSON.stringify(ou.person));
			if(ou.person.length > 1) {
				retObj = JSON.parse(JSON.stringify(ou.person[ou.person.length-1]))
			}
		} else if(ou.role != undefined) {
			retObj = JSON.parse(JSON.stringify(ou.role));
			if(ou.role.length > 1) {
				retObj = JSON.parse(JSON.stringify(ou.role[ou.role.length-1]))
			}						
		}
	} else {
		retObj = JSON.parse(JSON.stringify(ou));
	}
	
	return retObj;
}

// 결재선 - 결재선 초기화
function mobile_approval_resetApprovalLine(pMode) {
	
	if(confirm(mobile_comm_getDic("msg_apv_resetApvLine"))) {
		var apvlist = JSON.parse($("#APVLIST").val());
		
		if(pMode == "approval") { //결재
			var division = null;
			if(apvlist.steps.division.length != undefined) {
				delete apvlist.steps.division[1];
				division = apvlist.steps.division[0];
			} else {
				division = apvlist.steps.division;
			}
			if(division.step.length != undefined) {
				var temp_step = division.step[0];
				delete apvlist.steps.division.step;
				apvlist.steps.division.step = temp_step;
			}
			
			$("#APVLIST").val(JSON.stringify(apvlist));
		} else if(pMode == "tcinfo") { //참조
			delete apvlist.steps.ccinfo;
			$("#APVLIST").val(JSON.stringify(apvlist));
		} else if(pMode == "distribution") { //배포
			$("#ReceiveNames").val("");
		}
	
		mobile_approval_getApprovalLine(pMode);
	}
}

// 미리보기 - 미리보기 가져오기
function mobile_approval_getPreview() {
	//1. 바디 컨텍스트 => getInfo("BodyContext") 묶어주기
	//TODO: 임시로 formJson 값과 APVLIST 값을 window.sessionStorage에 저장, 추후 더 좋은 방안을 찾아 변경 예정
	window.sessionStorage["formjson"] = JSON.stringify(getFormJSON());
	window.sessionStorage["apvlist"] = $("#APVLIST").val();
	window.sessionStorage["IsPreview"] = "Y";
	mobile_approval_setPreviewIframe();
}

function mobile_approval_setPreviewIframe() {
	strPiid_List = "";
	strWiid_List = "";
	strFiid_List = "";
	strPtid_List = "";
	
	var archived = "false";
	
	document.IframeFrom.target = "Iframe";
  	document.IframeFrom.action = "/approval/mobile/approval/preview.do";
  	//
  	document.IframeFrom.processID.value = _mobile_approval_write.ProcessID;
  	document.IframeFrom.workitemID.value = _mobile_approval_write.WorkitemID;
  	document.IframeFrom.performerID.value = _mobile_approval_write.PerformerID;
  	document.IframeFrom.processdescriptionID.value = _mobile_approval_write.ProcessDescriptionID;
  	document.IframeFrom.subkind.value = _mobile_approval_write.Subkind;
  	document.IframeFrom.formtempinstboxID.value = "";
  	document.IframeFrom.forminstanceID.value = _mobile_approval_write.FormInstID;
  	document.IframeFrom.formID.value = _mobile_approval_write.FormID;
  	document.IframeFrom.forminstancetablename.value = _mobile_approval_write.FormInstTableName;
  	document.IframeFrom.mode.value = _mobile_approval_write.Mode;
  	document.IframeFrom.gloct.value = _mobile_approval_write.Gloct;
  	document.IframeFrom.userCode.value = _mobile_approval_write.UserCode;
  	document.IframeFrom.archived.value = archived;
  	document.IframeFrom.Readtype.value = "preview";
  	//
  	document.IframeFrom.submit();
}

// 임시저장
function mobile_approval_tempsave() {
	if(_mobile_approval_write.FormID == "")
		alert(mobile_comm_getDic("msg_apv_504")); //양식을 선택하세요!
	else if(formJson == "")
		alert(mobile_comm_getDic("msg_apv_writeDetailItem")); //세부항목을 작성해주세요.
	else
		doButtonAction('btSave');
}

// 기안
function mobile_approval_draft() {
	if(_mobile_approval_write.FormID == "") {
		alert(mobile_comm_getDic("msg_apv_504")); //양식을 선택하세요!
	}
	else if(formJson == "") {
		alert(mobile_comm_getDic("msg_apv_writeDetailItem")); //세부항목을 작성해주세요.
	}
	else if($("#approval_write_Subject").val() == "") {
		alert(mobile_comm_getDic("msg_apv_028")); //제목을 입력하세요.
	}
	else {
		mobile_approval_clickbtn($(".txt_area"), 'draft');
	}
}

// 결재선 편집
function mobile_approval_completeApv() {
	if(_mobile_approval_write.FormID == "")
		alert(mobile_comm_getDic("msg_apv_504")); //양식을 선택하세요!
	else {
		initApvList();
		//setInfo("ApprovalLine", document.getElementById("APVLIST").value);
		window.sessionStorage["apvlist"] = document.getElementById("APVLIST").value;
		window.sessionStorage["processid"] = _mobile_approval_view.ProcessID;
		mobile_comm_back();
	}
}

// 내용 편집
function mobile_approval_completeMod() {
	if(_mobile_approval_write.FormID == "")
		alert(mobile_comm_getDic("msg_apv_504")); //양식을 선택하세요!
	else {
		$("#approval_write_buttonarea").html("");
		
		var sBtnHtml = "";
		var strApproval = mobile_comm_getDic("lbl_apv_Approved"); //승인
		var strReject = mobile_comm_getDic("lbl_apv_reject"); //반려

		if(getInfo("Request.mode") == "PCONSULT" && getInfo("Request.subkind") == "T009") {
			strApproval = mobile_comm_getDic("lbl_apv_agree"); //합의
			strReject = mobile_comm_getDic("lbl_apv_disagree"); //거부		
		}

		var tempDeptDraft = btDisplay.btDeptDraft; //재기안 버튼 display 여부 파악 순서가 PC와 다르기 때문에 임시 처리
		btDisplay = initBtn();
		btDisplay.btDeptDraft = tempDeptDraft;
		
		if(btDisplay.btApproved == "Y") {
			if(btDisplay.btReject == "N") {
				sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'approved');\" class=\"btn_approval full\"><i class=\"ico\"></i>" + strApproval + "</a>";
			} else {
				sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'approved');\" class=\"btn_approval\"><i class=\"ico\"></i>" + strApproval + "</a>";
				sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'reject');\" class=\"btn_return\"><i class=\"ico\"></i>" + strReject + "</a>"; 
			}
		} else {
			if(btDisplay.btReject == "Y") {
				sBtnHtml += "<a onclick=\"mobile_approval_clickbtn(this, 'reject');\" class=\"btn_return full\"><i class=\"ico\"></i>" + strReject + "</a>";					
			}
		}
		$("#approval_write_buttonarea").html(sBtnHtml);
		if(sBtnHtml != "") $("#approval_write_buttonarea").show(); 
	}
}


//validation 체크
function mobile_approval_draftvalidation() {	
	return true;
}

//탭 선택
function mobile_approval_write_clickTab(obj, target, isPageLoad) {
	var value = $(obj).parent().attr("value");
	//if((value != "approval_write_div_formSelect" && _mobile_approval_write.FormID != "") || value == "approval_write_div_formSelect") {
		$("#approval_write_tab" + target).find("li").removeClass("on");
		$("#approval_write_wrap" + target).children().removeClass("on");
		
		$(obj).parent().addClass('on');
		$("#" + value).addClass("on");
		
		//target : menu
		if(value == "approval_write_div_detailItem" || value == "approval_write_div_approvalLine" || value == "approval_write_div_preview") {
			if(typeof(getInfo) == 'undefined' || getInfo("FormInfo.FormID") != _mobile_approval_write.FormID || isLoad == "N") {
				mobile_approval_getFormInfo();
			} else if($("#APVLIST").val() != "" && value == "approval_write_div_approvalLine") {
				mobile_approval_getApprovalLine();
			}
			
			if(value == "approval_write_div_preview") {
				mobile_comm_showload();
				$("#IframeDiv").hide();
				mobile_approval_getPreview();
			}
			
			if(formJson != undefined && formJson != "" && value == "approval_write_div_detailItem" && (_mobile_approval_write.OpenMode == "MODIFY" || _mobile_approval_write.OpenMode == "TEMPSAVE" || _mobile_approval_write.OpenMode == "REUSE")) {
				if(formJson.FormInstanceInfo.DocClassID != "" && formJson.FormInstanceInfo.DocClassName != "") {
					$("#approval_write_DocClassID").val(formJson.FormInstanceInfo.DocClassID); //문서분류 ID
					$("#approval_write_DocClassName").html(formJson.FormInstanceInfo.DocClassName); //문서분류 이름
				}
				
				$("#approval_write_Subject").val(formJson.FormInstanceInfo.Subject); //제목
				mobile_approval_setLinkedDoc(formJson.FormInstanceInfo.DocLinks); //연결문서
				$("#approval_write_DocLevel").val(formJson.FormInstanceInfo.DocLevel); //보안등급
				$("#approval_write_SaveTerm").val(formJson.FormInstanceInfo.SaveTerm); //보존년한
			} else if(_mobile_approval_write.OpenMode == "DRAFT") {
				if(isPageLoad == 'Y') {
					mobile_comm_uploadhtml();
				}
			}
		}
		
		//targe : type
		if(value == "approval_write_div_approval") _mobile_approval_write.ApvLineMode = "approval";
		if(value == "approval_write_div_tcinfo") _mobile_approval_write.ApvLineMode = "tcinfo";
		if(value == "approval_write_div_distribution") _mobile_approval_write.ApvLineMode = "distribution";
//	} else {
//		alert(mobile_comm_getDic("msg_apv_504")); //양식을 선택하세요!
//	}
}

//작성 내 show 클래스 추가/삭제
function mobile_approval_write_showORhide(obj) {
	var oDetailInfo = $(obj).next(".detail_info");
	
	if($(obj).hasClass("infos_close")) {
		$(obj).removeClass("infos_close");
		$(obj).addClass("infos_open");
		$(oDetailInfo).hide();
	} else {
		$(obj).removeClass("infos_open");
		$(obj).addClass("infos_close");
		$(oDetailInfo).show();
	}
}

//결재 작성 끝


/*!
 * 
 * 문서 분류 시작
 * 
 */

function mobile_approval_SelectInit() {
	
	mobile_approval_setDocClassList();
	
	$("#approval_select_header").children("a").remove(); //이상한 a 태그가 추가되는 현상 임시 조치
	
	if(_mobile_approval_write.FormID == "") { //_mobile_approval_write 전역 변수 값 사라지는 현상 임시 조치
		_mobile_approval_write = JSON.parse(window.sessionStorage.getItem("_mobile_approval_write"));
	}
}

//문서분류 목록 세팅
function mobile_approval_setDocClassList() {
	$("#approval_select_docClassList").html("");
	$.ajax({
			url:"/approval/admin/getFolderPopup.do",
			type:"POST",
			data:{
				"EntCode": mobile_comm_getSession("DN_Code")
			},
			success:function (data) {
				if(data.status == "SUCCESS") {
					var sHtml = mobile_approval_setDocClassListHtml(data.list);
					$('#approval_select_docClassList').html(sHtml).trigger("create");
				}
			},
			error:function(response, status, error){
				mobile_comm_ajaxerror("/groupware/mobile/resource/getResourceTreeList.do", response, status, error);
			}
		});
}

function mobile_approval_setDocClassListHtml(pData) {
	
	//pData - 트리 전체 데이터 Array
	//루트를 조회
	var arrRoot = new Array();
	try {
		var cnt = pData.length;
		for(var i = 0; i < cnt; i++) {
			if(pData[i]["pno"] == "0" || pData[i]["pno"] == "") {
				arrRoot.push(pData[i]);
			}
		}
	} catch(e) {
		arrRoot = null;
	}
	
	var sHtml = "";
	
	var iDepth = 0;
	var sALink = "";
	
	$(arrRoot).each(function (j, root) {
		var FolderID = root.no;
		sALink = "javascript: mobile_approval_openclose('ul_sub_" + FolderID + "', 'span_menu_" + FolderID + "');";
		
		sHtml += "<li>";
		sHtml += "	<div class=\"h_tree_menu\">";
		sHtml += "		<ul class=\"h_tree_menu_list\">";
		sHtml += "    		<li>";
		sHtml += "        		<a href=\"" + sALink + "\" class=\"t_link\"><span id=\"span_menu_" + FolderID + "\" class=\"t_ico_open\"></span>" + root.nodeName + "</a>";
		sHtml += mobile_approval_setDocClassListHtmlRecursive(pData, "pno", FolderID, iDepth + 1);
		sHtml += "    		</li>";
		sHtml += "		</ul>";
		sHtml += "	</div>";
		sHtml += "</li>";
	});
	
	return sHtml;
}
function mobile_approval_setDocClassListHtmlRecursive(pData, pParentNode, pParentValue, pDepth) {
	
	var sHtml = "";
	
	if(pData == null) {
		return sHtml;
	}
	
	var arrSub = new Array();
	try {
		var cnt = pData.length;
		for(var i = 0; i < cnt; i++) {
			if(pData[i][pParentNode] == pParentValue) {
				arrSub.push(pData[i]);
			}
		}
	} catch(e) {
		arrSub = null;
	}
	
	var sRdo = "";
	var sOpen = "";
	var sALink = "";
	
	sHtml += "<ul id=\"ul_sub_" + pParentValue + "\" class=\"sub_list\">";
	$(arrSub).each(function (j, sub) {
		var FolderID = sub.no;
		if(FolderID != pParentValue) {
			sHtml += "    <li folderid=\"" + FolderID + "\" nodeName=\"" + sub.nodeName + "\">";
			
			if(sub.chk == "N" && sub.rdo == "N") {
				sALink = "mobile_approval_openclose('ul_sub_" + FolderID + "', 'span_menu_" + FolderID + "');";
				sHtml += "	<p onclick=\"" + sALink + "\" class=\"t_link\"><span id=\"span_menu_" + FolderID + "\" class=\"t_ico_open\"></span>" + sub.nodeName + "</p>";
			} else if(sub.chk == "N" && sub.rdo == "Y") {
				sHtml += "	<p class=\"t_link\">";
				sHtml += "		<input type=\"radio\" name=\"approval_select_rdo\" id=\"approval_select_rdo_" + FolderID + "\" value=\"" + FolderID + "\">";
				sHtml += "		<label for=\"approval_select_rdo_" + FolderID + "\">" + sub.nodeName + "</label>";
				sHtml += "	</p>";
			}
			sHtml += mobile_approval_setDocClassListHtmlRecursive(pData, "pno", FolderID, pDepth + 1);
			sHtml += "    </li>";
		}
	});
	sHtml += "</ul>";
	
	return sHtml;
	
}

//하위 메뉴/트리 열고 닫기
function mobile_approval_openclose(liId, iconId) {
	if($('#' + iconId).hasClass('t_ico_open')){		
		$('#' + iconId).removeClass('t_ico_open').addClass('t_ico_close');		
		
		$('#' + liId).hide();
	} else {		
		$('#' + iconId).removeClass('t_ico_close').addClass('t_ico_open');		
		
		$('#' + liId).show();
	}
}

//선택한 문서분류 저장 후 이전 페이지로 돌아감
function mobile_approval_saveSelectedDocClass(){
	var obj = $("#approval_select_docClassList").find("li").find("input[type=radio]:checked");
	var docClassId = $(obj).val();
	var docClassName = $(obj).siblings("label").html();
	$("#approval_write_DocClassID").val(docClassId);
	$("#approval_write_DocClassName").html(docClassName);
	
	$("#DocClassID").val(docClassId); //양식 dField
	$("#DocClassName").val(docClassName); //양식 dField
	
	//이전 페이지로 되돌아감
	mobile_approval_closeDocClass();
}

/*!
 * 
 * 문서 분류 끝
 * 
 */


/*!
 * 
 * 결재 내부 로직
 * 
 */

/**
 * 사용자 전자결재 비밀번호 확인
 * @param strPassword
 * @returns {Boolean}
 */
function mobile_approval_chkCommentWrite(strPassword){
	var returnval = false;
	$.ajax({
		url:"/approval/mobile/approval/chkCommentWrite.do",
		type:"post",
		data: {
			"ur_code" : mobile_comm_getSession("USERID"),
			"password" : strPassword
		},
		async:false,
		success:function (res) {				
			if(res){					
				returnval = true;					
			} else {					
				returnval = false;
			}
		},
		error:function(response, status, error){
			mobile_comm_ajaxerror("/approval/mobile/approval/chkCommentWrite.do", response, status, error);
		}
	});
	return returnval;
}

/**
 * 일괄결재
 * @param gridObj
 * @param approvalType
 * @param buttonType
 */
function mobile_approval_batchApproval(mode){
	strPiid_List = "";
	strWiid_List = "";
	strFiid_List = "";
	strPtid_List = "";
	strKind_List = "";
	
	var msgConfirm = '';
	var msgWarning = '';
	var l_ActiveModule = mobile_approval_getActiveModule();

	msgConfirm += mobile_comm_getDic("msg_127");  // 처리 하시겠습니까?
	msgWarning += mobile_comm_getDic("msg_apv_003"); //선택된 항목이 없습니다.
	
	// 체크된 항목 확인
	//var checkApprovalList = gridObj.getCheckedList(0);
	var checkApprovalList = []; 
	var checked = $("#" + l_ActiveModule + "_list_list").find("input[type=checkbox]:checked");
	var checkcnt = checked.length;
	for(var i = 0; i < checkcnt; i++) {
		if($(checked).eq(i).val() != "") 
			checkApprovalList[i] = JSON.parse($(checked).eq(i).val());
	}
	if(checkApprovalList.length == 0){
		alert(msgWarning);
	}else if(checkApprovalList.length > 0){
		if(confirm(msgConfirm)){				// 처리 하시겠습니까?
			// 결재 비밀번호 사용여부
			if(mobile_approval_chkCommentWrite("")){
				var apvToken = prompt(mobile_comm_getDic("msg_apv_508").replace("<br>", "\n").replace(/(<([^>]+)>)/ig,""), "");  //일괄결재를 위해 결재암호를 입력해주세요.\n <font color="red">결재암호입력</font>				
				if (apvToken) {
					if(mobile_approval_chkCommentWrite(apvToken)){
						// 결재 진행
						mobile_approval_switchBatchApproval(checkApprovalList, mode, apvToken);
					}else{
						// 비밀번호 틀림
						alert(mobile_comm_getDic("msg_PasswordChange_02"));
					}
				}
			}else{
				mobile_approval_switchBatchApproval(checkApprovalList, mode);
			}
		}
	}else{
		alert(mobile_comm_getDic("msg_ScriptApprovalError"));			// 오류 발생
	}
}
var arrmobileDomainDataList = {};
/**
 * 담당업무함, 부서수신함에서 호출했을 경우, 결재선 변경 필요
 * @param approvalList
 * @param approvalType
 */
function mobile_approval_switchBatchApproval(approvalList, approvalType, apvToken){
	var apvToken = apvToken || "";
	var signImage = getUserSignInfo(mobile_comm_getSession("USERID"));
	
	if(approvalType == "JOBFUNCTION" || approvalType == "DEPT"){
		var processIDs = new Array();
		
		var oApprovalList = {"approvalList" : approvalList};

		//부서수신함에서 합의, 협조는 제외 (TODO 부서협조 접수, 반려 스키마 체크시 개발 필요)
		var length = $$(oApprovalList).find("approvalList").concat().length;
		if(approvalType == "DEPT"){
			var oRemove = $$(oApprovalList).find("approvalList").concat().has("[FormSubKind=C],[FormSubKind=AS]");
			for(var i=0; i<oRemove.length; i++){
				$$(oApprovalList).find("approvalList").remove($$(oRemove).eq(0).index());
			}
		}
		
		if($$(oApprovalList).find("approvalList").concat().length > 0)
			processIDs = $$(oApprovalList).find("approvalList").concat().attr("ProcessID");
		
		// 체크항목 결재선 조회
		if($$(oApprovalList).find("approvalList").concat().length > 0) {
			$.ajax({
				url:"/approval/mobile/approval/getBatchApvLine.do",
				data: {
					"processIDArr" : processIDs.toString()
				},
				type:"post",
				success:function (res) {
					if(res.length > 0){
						// 각 데이터에 결재선 데이터 포함
						$(res).each(function(i, obj){
							var oApvList = obj.DomainDataContext;
							var formSubKind = $$(oApprovalList).find("approvalList[ProcessID='"+$$(obj).attr("ProcessID")+"']").attr("FormSubKind");
							
							if(formSubKind == "R" || formSubKind == "T008"){		// 수신
								var oCurrentOUNode = $$(oApvList).find("steps > division").children().find("[divisiontype='receive']").has(">taskinfo[status='pending']");
								
								var oRecOUNode = $$(oCurrentOUNode).find("step").has(">ou>taskinfo[status='pending']");	//$$(oCurrentOUNode).find("step:has(ou>taskinfo[status='pending'])");
		                        if (oRecOUNode.length != 0) $$(oCurrentOUNode).find("step").has(">ou>taskinfo[status='pending']").remove();
								
								var oJFNode = $$(oCurrentOUNode).find("step").has("ou>role>taskinfo[status='pending'], ou>role>taskinfo[status='reserved']"); //201108
		                        var bHold = false; //201108 보류여부
		                        var oComment = null;
		                        if (oJFNode.length != 0) {
		                            var oHoldTaskinfo = $$(oJFNode).find("ou>role>taskinfo[status='reserved']");
		                            if (oHoldTaskinfo.length != 0) {
		                                bHold = true;
		                                oComment = $$(oHoldTaskinfo).find("comment").clone();
		                            }
		                            $$(oCurrentOUNode).eq(0).remove("step");
		                        }

		                        var deptID = mobile_comm_getSession("DEPTID");
		                        var deptName = mobile_comm_getSession("DEPTNAME");

		                        $$(oCurrentOUNode).attr("oucode", deptID);		// 부서 id
		                        $$(oCurrentOUNode).attr("ouname", deptName);		// 부서 명
		                        
		                        $$(oCurrentOUNode).find("[taskinfo]").attr("status", "pending");
		                        $$(oCurrentOUNode).find("[taskinfo]").attr("result", "pending");
		                        
		                        var oStep = {};
		                        var oOU = {};
		                        var oPerson = {};
		                        var oTaskinfo = {};

		                        $$(oStep).attr("unittype", "person");
		                        $$(oStep).attr("routetype", "approve");
		                        $$(oStep).attr("name", mobile_comm_getDic("lbl_apv_ChargeDept"));	//gLabel__ChargeDept);
		                        
		                        $$(oOU).attr("code", deptID);		// 부서 id
		                        $$(oOU).attr("name", deptName);		// 부서 명
		                        
		                        $$(oPerson).attr("code", mobile_comm_getSession("USERID"));		// 사용자 id
		                        $$(oPerson).attr("name", mobile_comm_getSession("USERNAME"));		// 사용자 명
		                        $$(oPerson).attr("position", mobile_comm_getSession("UR_JobPositionCode") + ";" + mobile_comm_getSession("UR_JobPositionName"));							// position 코드;position 명
		                        $$(oPerson).attr("title", mobile_comm_getSession("UR_JobTitleCode") + ";" + mobile_comm_getSession("UR_JobTitleName"));				// title 코드;title 명
		                        $$(oPerson).attr("level", mobile_comm_getSession("UR_JobLevelCode") + ";" + mobile_comm_getSession("UR_JobLevelName"));								// level 코드;level 명
		                        $$(oPerson).attr("oucode", deptID);			// 부서 id
		                        $$(oPerson).attr("ouname", deptName);		// 부서 명
		                        $$(oPerson).attr("sipaddress", mobile_comm_getSession("UR_Mail"));		// 사용자 이메일
		                        
		                        $$(oTaskinfo).attr("status", (bHold == true ? "reserved" : "pending")); //201108
		                        $$(oTaskinfo).attr("result", (bHold == true ? "reserved" : "pending")); //201108
		                        $$(oTaskinfo).attr("kind", "charge");
		                        $$(oTaskinfo).attr("datereceived", mobile_comm_getDateTimeString("yyyy-MM-dd HH:mm:ss", new Date()));			// 현재 시각
		                        if (bHold) $$(oTaskinfo).append(oComment); //201108
		                        
		                        $$(oPerson).append("taskinfo", oTaskinfo);
		                        
		                        $$(oOU).append("person", oPerson);
		                        
		                        $$(oStep).append("ou", oOU);
		                        
		                        $$(oCurrentOUNode).append("step", oStep);
		                        
							}/*else if(formSubKind == "AS"){		// 부서협조
								//TODO
							}*/
							
	                        $$(oApprovalList).find("approvalList[ProcessID='"+$$(obj).attr("ProcessID")+"']").append("ApvLine", oApvList);
						});
						approvalList = $$(oApprovalList).find("approvalList").json();
						mobile_approval_doEngineBatchApproval(approvalList, approvalType, signImage, apvToken);
					}else{
						alert(mobile_comm_getDic("msg_apv_319"));
						mobile_approval_reload();
					}
				},
				error:function(response, status, error){
					CFN_ErrorAjax("/approval/mobile/approval/getBatchApvLine.do", response, status, error);
				}
			});
		} else {
			alert(mobile_comm_getDic("msg_apv_319"));
			mobile_approval_reload();
		}
	} else {
		var processIDs = new Array();
		
		var oApprovalList = {"approvalList" : approvalList};		
		if($$(oApprovalList).find("approvalList").concat().length > 0)
			processIDs = $$(oApprovalList).find("approvalList").concat().attr("ProcessID");
		
		// 체크항목 결재선 조회
		if($$(oApprovalList).find("approvalList").concat().length > 0){
			$.ajax({
				url:"/approval/mobile/approval/getBatchApvLine.do",
				data: {
					"processIDArr" : processIDs.toString()
				},
				type:"post",
				success:function (res) {
					if(res.length > 0){
						// 각 데이터에 결재선 데이터 포함
						$(res).each(function(i, obj){
							arrmobileDomainDataList[$$(obj).attr("ProcessID")] = obj.DomainDataContext;
						});
						
						mobile_approval_doEngineBatchApproval(approvalList, approvalType, signImage, apvToken);
					}else{
						alert(mobile_comm_getDic("msg_apv_319"));

						mobile_approval_reload();
					}
				},
				error:function(response, status, error){
					CFN_ErrorAjax("/approval/mobile/approval/getBatchApvLine.do", response, status, error);
				}
			});
		}else{
			alert(mobile_comm_getDic("msg_apv_319"));
			
			mobile_approval_reload();
		}		
		
	}
}

//일괄결재 진행
var doEngineBatchApprovalCnt = 0;
var errorCnt = 0;
/**
 * 일괄결재 진행
 * @param approvalList
 * @param approvalType
 */
function mobile_approval_doEngineBatchApproval(approvalList, approvalType, signImage, apvToken){
	var l_ActiveModule = mobile_approval_getActiveModule();
	
	doEngineBatchApprovalCnt = 0;
	errorCnt = 0;
	
	// 일괄결재 API 호출
	mobile_comm_showload();
	
	$(approvalList).each(function(i, obj){
		var actionMode = "";
		var subkind = obj.FormSubKind;
		var taskId = obj.TaskID;
		var mode = "APPROVAL";
		
		if(subkind == "T009" || subkind == "T004"){		// 합의 및 협조
			actionMode = "AGREE";
			mode = "PCONSULT";
		}else if((subkind == "C" || subkind == "AS" || subkind == "AD") && approvalType == "DEPT"){
			actionMode = "REDRAFT";
			mode = "SUBREDRAFT";
		}else if(subkind == "T016"){
			actionMode = "APPROVAL";
			mode = "AUDIT";
		}else if(subkind == "T008"){
			actionMode = "APPROVAL";
			mode = "REDRAFT";
		}else{
			actionMode = "APPROVAL";
			if(obj.ProcessName == "Sub"){
				mode = "SUBAPPROVAL";
			}else{
				mode = "APPROVAL";
			}
		}
		
	    var sJsonData = {};
	    
	    $.extend(sJsonData, {"mode": mode});
	    $.extend(sJsonData, {"subkind": subkind});
	    $.extend(sJsonData, {"taskID": taskId});
    	$.extend(sJsonData, {"FormInstID" : obj.FormInstID});
	    $.extend(sJsonData, {"actionMode": actionMode});
	    $.extend(sJsonData, {"actionComment": ""});
	    $.extend(sJsonData, {"actionComment_Attach": "[]"});
	    $.extend(sJsonData, {"signimagetype" : signImage});
	    $.extend(sJsonData, {"gloct": ""});
	    $.extend(sJsonData, {"isMobile": "Y"});
	    $.extend(sJsonData, {"isBatch": "Y"}); // 일괄결재 표시여부
	    $.extend(sJsonData, {"processName": obj.ProcessName}); //프로세스이름
	    $.extend(sJsonData, {"formID" : obj.FormID});
	    
	    if(obj.ApvLine != undefined){
	    	$.extend(sJsonData, {"ChangeApprovalLine" : obj.ApvLine});
	    }
	    
	    // 대결자가 결재하는 경우 결재선 변경
	    if(arrmobileDomainDataList[obj.ProcessID] != null && arrmobileDomainDataList[obj.ProcessID] != undefined) {
	    	var apvList = mobile_approval_setDeputyList(mode, subkind, taskId, actionMode, "", obj.FormInstID, "N", obj.ProcessID, obj.UserCode);
		    
		    if(apvList != arrmobileDomainDataList[obj.ProcessID]){
		    	$.extend(sJsonData, {"processID" : obj.ProcessID});
		    	$.extend(sJsonData, {"ChangeApprovalLine" : apvList});
		    }	
	    }	    
	    
	    $.extend(sJsonData, {"g_authKey" : _mobile_fido_authKey});
	    $.extend(sJsonData, {"g_password" : apvToken});
	    
	    var formData = new FormData();
	    // 양식 기안 및 승인 정보
	    formData.append("formObj", JSON.stringify(sJsonData));
		
		//setTimeout(function(){
			$.ajax({
				url:"/approval/mobile/approval/draft.do",
				data: formData,
				type:"post",
				dataType : 'json',
				processData : false,
		        contentType : false,
				success:function (res) {
					++doEngineBatchApprovalCnt;
					if((res.status == "FAIL" && res.message.indexOf("NOTASK")<0) || res.status == "FAIL")
						errorCnt++;
					
					if(doEngineBatchApprovalCnt == approvalList.length){
						if(errorCnt > 0)
							alert(mobile_comm_getDic("msg_BatchApprovalResult").replace("{0}", approvalList.length).replace("{1}", errorCnt));
						else
							alert(mobile_comm_getDic("msg_apv_alert_006"));
						
						mobile_comm_hideload();
						window["mobile_" + l_ActiveModule + "_reload"]();
					}
				},
				error:function(response, status, error){
					mobile_comm_ajaxerror("/approval/mobile/approval/draft.do", response, status, error);
				}
			});
		//}, 500);
	});
	
	if($(approvalList).length == 0){
		alert(mobile_comm_getDic("msg_apv_319"));
		
		mobile_comm_hideload()
		window["mobile_" + l_ActiveModule + "_reload"]();
	}
}

//읽음 확인
function mobile_approval_doDocRead() {
	var l_ActiveModule = mobile_approval_getActiveModule();
	var checkApprovalList = []; 
	var checked = $("#" + l_ActiveModule + "_list_list").find("input[type=checkbox]:checked");
	var checkcnt = checked.length;
	
	for(var i = 0; i < checkcnt; i++) {
		if($(checked).eq(i).val() != "") 
			checkApprovalList[i] = JSON.parse($(checked).eq(i).val());
	}
	
	if (checkApprovalList.length == 0) {
		alert(mobile_comm_getDic("lbl_Mail_NoSelectItem"));
		return;
	} else if (checkApprovalList.length > 0) {
		var confirmResult = confirm(mobile_comm_getDic("msg_Mail_SelectedItemRead"));
		if (confirmResult) {
	    	var paramArr = new Array();
	    	
			$(checkApprovalList).each(function(i, v) {
				if (typeof(v.ReadDate) == "undefined" || v.ReadDate == "") {
					var str = v.ProcessID + "|" + v.FormInstID + "|" + v.Kind;
					paramArr.push(str);
				}
			});
	    	
	    	mobile_comm_showload();
			
			if (paramArr.length > 0) {
		    	var mode;
		    	
		    	if(l_ActiveModule == "approval") {
		    		mode = _mobile_approval_list.Mode;
		    	}
		    	else if(l_ActiveModule == "account") {
		    		mode = _mobile_account_list.Mode.split("_")[1];
		    	}
		    	
				$.ajax({
					url:"/approval/mobile/approval/docRead.do",
					type:"post",
					data:{
						  "mode" : mode, 
						  "paramArr" : paramArr
					},
					async:false,
					success:function (data) {
						//TODO reload
						/*if (_mobile_approval_list.Mode == "TCInfo") {
							setDocreadCountCc();
						}*/
						mobile_comm_hideload();
						window["mobile_" + l_ActiveModule + "_reload"]();
					},
					error:function(response, status, error){
						mobile_comm_ajaxerror("/approval/mobile/approval/docRead.do", response, status, error);
					}
				});
			} else {
				alert(mobile_comm_getDic("msg_ReadProcessingError"));
				mobile_comm_hideload();
				window["mobile_" + l_ActiveModule + "_reload"]();
			}
		} else {
			return false;
		}
	} else {
		alert(mobile_comm_getDic("msg_ScriptApprovalError"));
	}
}

/**
 * 삭제
 */
function mobile_approval_deleteCheck(type){
	// 체크된 항목 확인
	var checkCheckList = []; 
	var checked = $("#approval_list_list").find("input[type=checkbox]:checked");
	var checkcnt = checked.length;
	for(var i = 0; i < checkcnt; i++) {
		if($(checked).val() != "") 
			checkCheckList[i] = JSON.parse($(checked).val());
	}
	var FormInstIdTemp 		= []; //임시함Form인서트아이디
	var FormInstId 	   		= "";
	var FormInstBoxIdTemp 	= []; //임시함Form인서트박스아이디
	var FormInstBoxId 		= "";
	var WorkItemIdTemp 		= []; //반려함Form인서트박스아이디
	var WorkItemId 			= "";
	var checklistcnt = checkCheckList.length;
	if(checklistcnt == 0){
		alert(mobile_comm_getDic("msg_apv_003"));				//선택된 항목이 없습니다.
	}else if(checklistcnt > 0){
		if(type == "TempSave"){ //임시함
			for(var i = 0; i < checklistcnt; i++){
				FormInstIdTemp.push(checkCheckList[i].FormInstID)
				FormInstBoxIdTemp.push(checkCheckList[i].FormTempInstBoxID)
			}
			FormInstId = FormInstIdTemp.join(",");
			FormInstBoxId = FormInstBoxIdTemp.join(",");
		}else{ //반려함
			for(var i = 0; i < checklistcnt; i++){
				WorkItemIdTemp.push(checkCheckList[i].WorkitemArchiveID);
			}
			WorkItemId = WorkItemIdTemp.join(",");
		}
		var result = confirm(mobile_comm_getDic("msg_apv_093"));
		if (result) {
			$.ajax({
				url:"/approval/mobile/approval/deleteTempSaveList.do",
				type:"post",
				data:{
	 				"FormInstId":FormInstId,
	 				"FormInstBoxId":FormInstBoxId,
	 				"WorkItemId":WorkItemId,
	 				"type":type
					},
				async:false,
				success:function (res) {
					alert(mobile_comm_getDic("msg_apv_170")); //완료되었습니다.
					mobile_approval_reload();
				},
				error:function(response, status, error){
					mobile_comm_ajaxerror("/approval/mobile/approval/deleteTempSaveList.do", response, status, error);
				}
			});
		}
	}else{
		alert(mobile_comm_getDic("msg_ScriptApprovalError"));			// 오류 발생
	}
}

// 결재 시 결재 진행 관련 버튼 disabled 처리
function mobile_approval_disableBtns(bDisabled, bToggle) {
	var viewMode;
	
	if(getInfo("Request.templatemode") == "Write") {
		viewMode = "write";
	} else {
		viewMode = "view";
	}
	
	// 버튼 비활성화 여부 확인
	if(bDisabled) {
		$("#approval_" + viewMode + "_btn_OK").hide();
	}
	else {
		$("#approval_" + viewMode + "_btn_OK").show();
	}
	
	// 의견 입력 영역 토글 실행 여부 확인
	if(bToggle) {
		mobile_approval_toggleCommentArea();
	}
}

//결재 시 의견 입력 영역 토글 실행
function mobile_approval_toggleCommentArea() {
	mobile_approval_clickbtn($(".btn_toggle"), 'toggle');
}

function mobile_approval_doOK() {
	var fidoUse = false;
	mobile_comm_showload();
	
	setTimeout("mobile_approval_doOK_exec()",300);
}

function mobile_approval_doOK_exec() {
	// 생체인증 여부 확인
	var checkType = [];
	var pageObj;
	var viewMode;
	
	checkType = _mobile_fido_inputValue.split("||");
	
	if(getInfo("Request.templatemode") == "Write") {
		pageObj = _mobile_approval_write;
		viewMode = "write";
	} else {
		pageObj = _mobile_approval_view;
		viewMode = "view";
	}

	// 중복 엔진 호출을 막기 위한 버튼 숨김 처리
	mobile_approval_disableBtns(true, false);

	// comment 팝업이 따로 없기 때문에 여기서 구현
	if (getInfo("SchemaContext.scWFPwd.isUse") == "Y" && mobile_approval_chkCommentWrite("")){
		if(checkType[0] == "FIDO") {	// 생체 인증 성공 시, input value FIDO||_||_ 체크) {
			mobile_fido_checkAuth(); // 생체인증 검증 (authKey, authToken)
		} else {
			if($("#approval_" + viewMode + "_inputpassword").val()==""){	// 비밀번호를 입력하지 않은 경우
				alert(mobile_comm_getDic("msg_apv_enterApvPwd")); // msg : "결재 비밀번호를 입력해주세요."
				$("#approval_" + viewMode + "_btn_OK").show();
				mobile_comm_hideload();	
				return false;
			}
			if(!mobile_approval_chkCommentWrite($("#approval_" + viewMode + "_inputpassword").val())){	// 비밀번호를 잘못 입력한 경우
				alert(mobile_comm_getDic("msg_apv_wrongPwdReEnter")); // msg : "잘못된 비밀번호입니다. 다시 입력해주세요."
				$("#approval_" + viewMode + "_btn_OK").show();
				mobile_comm_hideload();	
				return false;
			}
		}
	}
	

	if ((pageObj.ActionType == "reject"
			|| pageObj.ActionType == "abort"
			|| pageObj.ActionType == "hold"
			|| pageObj.ActionType == "rejectedto" || pageObj.ActionType == "rejectlast")
			&& $("textarea#approval_" + viewMode + "_inputcomment").val() == "") {
		alert(mobile_comm_getDic("msg_apv_064"));
		$("#approval_" + viewMode + "_btn_OK").show();
		mobile_comm_hideload();
		return;
	} else if (_mobile_approval_view.ActionType == "hold" && !mobile_approval_checkRereserve()) {
		mobile_comm_hideload();
		return;
	} else {
		if (pageObj.ActionType == "rejectedto") {
			// setRJTApvList(); //TODO: 지정반려 일단 보류
		}

		var txtComment = Base64.utf8_to_b64($("textarea#approval_" + viewMode + "_inputcomment").val());
		document.getElementById("ACTIONCOMMENT").value = txtComment;
		commentPopupReturnValue = true; //FormMenu 전역변수
	}
	
	mobile_approval_toggleCommentArea();
	
	var txtComment = Base64.utf8_to_b64($("textarea#approval_" + viewMode + "_inputcomment").val());
	document.getElementById("ACTIONCOMMENT").value = txtComment;
	commentPopupReturnValue = true; //FormMenu 전역변수
	
	var target_id = "bt" + pageObj.ActionType.charAt(0).toUpperCase() + pageObj.ActionType.slice(1); // approved => btApproved
	doButtonAction(target_id);
	
	//setTimeout(function() {
	//}, 100);
}

//보류에 대한 처리
function mobile_approval_checkRereserve() {
	m_oApvList = $("#APVLIST").val();
    var oApprovedSteps = $$(m_oApvList).find("steps>division>step[routetype!='review']>ou").find(">person:has(taskinfo[status='reserved']), >ou>role:has(taskinfo[status='reserved'])");
    if(getInfo("Request.gloct") == "JOBFUNCTION" && oApprovedSteps.length == 0){
        oApprovedSteps = $$(m_oApvList).find("division>step[routetype='receive']>ou> role").has("taskinfo[status='reserved']");
    }
    if (oApprovedSteps.length > 0){
	    alert(mobile_comm_getDic("msg_apv_065"));//"결재 보류는 단 1회만 가능합니다."
	    return false;
    }else{
	    return true;
    }
}

//전자결재 > 설정 페이지 이동
function mobile_approval_settingApproval() {
	mobile_comm_go("/approval/mobile/approval/setting.do", 'N');
}

function mobile_approval_regSignature() {
	mobile_comm_go("/approval/mobile/approval/signature.do", 'N');
}

// 결재 사인 등록 페이지 init
function mobile_approval_SignInit() {
	
	//mobile_approval_setDocClassList();
	
	$("#approval_signature_header").children("a").remove(); //이상한 a 태그가 추가되는 현상 임시 조치
	var sessionObj = null; //전체호출
	sessionObj = mobile_comm_getSession(); //전체호출
	
		$.ajax({
			url:"/approval/user/getUserSignList.do",
			type:"post",
			async:false,
			success:function (data) {
				/* alert("success"); */
				$("#signature_view_wrap").empty();
				
				var sBackStoragePath =  mobile_comm_getBaseConfig("BackStorage");
				
				 $(data.list).each(function(index){
					 var signTitle = this.FileName;
					 var signImagePath = this.FilePath;
					 if(this.FilePath.indexOf(sBackStoragePath) > -1) {
						 
					 } else {
						 signImagePath = sBackStoragePath + signImagePath;
					 }
					 
					 var html = "";
					 if (this.IsUse == "Y") {
						 html = "<div class='signature_viewbox use'>"
							 + "<a onclick=\"mobile_signature_changeUseSign(this);\" class='titbox ui-link'>"
							 + "<p class='signature_viewbox_tit' id='signatureTitle' value='"+ signTitle +"'>" + signTitle +"</p>"
							 + "<span class='signaturebox'>"
							 + "<img src=" + signImagePath + "></span><span class='inuse'>"+ mobile_comm_getDic("approval_inUse") /*사용 중*/ +"</span></a>"
							 + "<a onclick=\"mobile_signature_deleteSignature(this);\" class='topH_close ui-link' value='"+ signTitle +"'><span class='Hicon'>삭제</span></a>"
							 + "</div>";
					 }
					else {
						html = "<div class='signature_viewbox'>"
						 + "<a onclick=\"mobile_signature_changeUseSign(this);\" class='titbox ui-link'>"
						 + "<p class='signature_viewbox_tit' id='signatureTitle' value='"+ signTitle +"'>" + signTitle +"</p>"
						 + "<span class='signaturebox'>"
						 + "<img src='" + signImagePath + "'></span></a>"
						 + "<a onclick=\"mobile_signature_deleteSignature(this);\" class='topH_close ui-link' value='"+ signTitle +"'><span class='Hicon'>삭제</span></a>"
						 + "</div>";			 
					}
				   $("#signature_view_wrap").append(html);
				});
			},
			error:function(response, status, error){
				alert("fail");
				CFN_ErrorAjax("/approval/user/getUserSignList.do", response, status, error);
			}
		});
}

function mobile_approval_setDeputyList(mode, subkind, taskId, actionMode, actionComment, forminstID, isMobile, processID, UserCode) {//대결일 경우 처리
	try {
		var sessionObj = mobile_comm_getSession(); //전체호출
		var jsonApv = arrmobileDomainDataList[processID];

        if (mode == "APPROVAL" || mode == "PCONSULT" || mode == "RECAPPROVAL" || mode == "SUBAPPROVAL" || mode == "AUDIT") { //기안부서결재선 및 수신부서 결재선
            var oFirstNode; //step에서 taskinfo select로 변경

            if (mode == "APPROVAL" || mode == "SUBAPPROVAL") {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step[routetype='approve']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
                
                if (mode == "SUBAPPROVAL" && oFirstNode.length == 0) {//mode가 supapproval이 approval로 들어옴
                	oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype!='approve']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step[routetype!='approve']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
                	//if (oFirstNode.length != 0) mode = "SUBAPPROVAL";//mode가 supapproval이 approval로 교체작업
                }
                if (oFirstNode.length == 0) { //편집 후 결재 시 대결 오류로 인하여 소스 추가
                    oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + sessionObj["USERID"] + "']>taskinfo[status='pending'][kind='substitute']");
                }
            } else if (mode == "RECAPPROVAL") {
                oFirstNode = $$(jsonApv).find("steps>division[divisiontype='receive']>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step[routetype='approve']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
                if (oFirstNode.length == 0) { //편집 후 결재 시 대결 오류로 인하여 소스 추가
                    oFirstNode = $$(jsonApv).find("steps>division[divisiontype='receive']>taskinfo[status=pending]").parent().find("step[routetype='approve']>ou>person[code='" + sessionObj["USERID"] + "']>taskinfo[status='pending'][kind='substitute']");
                }
            } else if (mode == "PCONSULT") {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']>taskinfo[status='pending'],step>ou>role>taskinfo:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])[status='pending']");
            } else if (mode == "AUDIT") {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[routetype='audit']>ou>person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'] > taskinfo[status='pending'],step[routetype='audit']>ou>role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");
            } else {
                oFirstNode = $$(jsonApv).find("steps>division>taskinfo[status=pending]").parent().find("step[unittype='ou'][routetype='receive']>ou>person[code!='" + sessionObj["USERID"] + "']>taskinfo[kind!='charge'][status='pending']");
            }
            if (oFirstNode.length != 0) {
                var m_bDeputy = true; var m_bApvDirty = true; var elmOU; var elmPerson;
                switch (mode) {
                    case "APPROVAL":
                    case "PCONSULT":
                    case "SUBAPPROVAL":
                    case "RECAPPROVAL":
                    case "AUDIT":
                        elmOU = $$(oFirstNode).parent().parent();
                        elmPerson = $$(oFirstNode).parent();
                        break;
                }
                var elmTaskInfo = $$(elmPerson).find("taskinfo");
                var skind = $$(elmTaskInfo).attr("kind");
                var sallottype = "serial";
                var elmStep = $$(elmOU).parent();
                try { if ($$(elmStep).attr("allottype") != null) sallottype = $$(elmStep).attr("allottype"); } catch (e) { }
                //taskinfo kind에 따라 처리  일반결재 -> 대결, 대결->사용자만 변환, 전결->전결, 기존사용자는 결재안함으로
                switch (skind) {
                    case "substitute": //대결
                        if (actionMode == "APPROVAL") {
                            $$(elmOU).attr("code", sessionObj["DEPTID"]);
                            $$(elmOU).attr("name", sessionObj["DEPTNAME"]);
                        }
                        $$(elmPerson).attr("code", sessionObj["USERID"]);
                        $$(elmPerson).attr("name", sessionObj["USERNAME"]);
                        $$(elmPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
                        $$(elmPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
                        $$(elmPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
                        $$(elmPerson).attr("oucode", sessionObj["DEPTID"]);
                        $$(elmPerson).attr("ouname", sessionObj["DEPTNAME"]);
                        $$(elmPerson).attr("sipaddress", sessionObj["UR_Mail"]);
                        $$(elmTaskInfo).attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                        break;
                    /*case "authorize"://전결 결재안함
                        $$(elmTaskInfo).attr("status", "completed");
                        $$(elmTaskInfo).attr("result", "skipped");
                        $$(elmTaskInfo).attr("kind", "skip");
                        $$(elmTaskInfo).remove("datereceived");
                        break;*/
                    case "consent": //합의 -> 후열
                    case "charge":  //담당 -> 후열
                    case "consult":
                    case "normal":  //일반결재 -> 후열
                    case "authorize"://전결 결재안함
                        $$(elmTaskInfo).attr("status", "inactive");
                        $$(elmTaskInfo).attr("result", "inactive");
                        $$(elmTaskInfo).attr("kind", "bypass");
                        $$(elmTaskInfo).remove("datereceived");
                        break;
                }
                if (skind == "authorize" || skind == "normal" || skind == "consent" || skind == "charge" || skind == "consult") {
                    var oStep = {};
                    var oOU = {};
                    var oPerson = {};
                    var oTaskinfo = {};
                    
                    $$(oTaskinfo).attr("status", "pending");
                    $$(oTaskinfo).attr("result", "pending");
                  //$$(oTaskinfo).attr("kind", (skind == "authorize") ? skind : "substitute");
                    $$(oTaskinfo).attr("kind", "substitute"); // 대결로 처리되는 경우 대결자 완료함에서 문서 열람이 가능해야 함!
                    $$(oTaskinfo).attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                    
                    $$(oPerson).attr("code", sessionObj["USERID"]);
                    $$(oPerson).attr("name", sessionObj["USERNAME"]);
                    $$(oPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
                    $$(oPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
                    $$(oPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
                    $$(oPerson).attr("oucode", sessionObj["DEPTID"]);
                    $$(oPerson).attr("ouname", sessionObj["DEPTNAME"]);
                    $$(oPerson).attr("sipaddress", sessionObj["UR_Mail"]);

                    if(mode == "SUBAPPROVAL") {
                    	$$(oPerson).attr("wiid", $$(elmPerson).attr("wiid"));
                    	$$(oPerson).attr("taskid", $$(elmPerson).attr("taskid"));
                    }
                    
                    $$(oPerson).append("taskinfo", oTaskinfo);
                    
                    $$(elmOU).append("person", oPerson);							// person이 object일 경우를 위해서 추가하여 배열로 만듬
                    
                    if(mode == "SUBAPPROVAL") {
                    	// todo: person의 index 구하는 방법 변경할 수 있으면 다른방법으로 교체할 것
                    	$$(elmOU).find("person").json().splice(parseInt(oFirstNode.parent().path().substr(oFirstNode.parent().path().lastIndexOf("/")+8, 1)), 0, oPerson);
                    } else {
                    	$$(elmOU).find("person").json().splice(0, 0, oPerson);			// 다시 앞에 추가
                    }
                    $$(elmOU).find("person").concat().eq($$(elmOU).find("person").concat().length-1).remove();			// 배열로 만들기 위해서 추가했던 person을 지움
                    
                    if (skind == 'charge') {
                        oFirstNode = oStep;
                        
                        var oStep = {};
                        var oOU = {};
                        var oPerson = {};
                        var oTaskinfo = {};
                        
                        $$(oStep).attr("unittype", "person");
                        $$(oStep).attr("routetype", "approve");
                        $$(oStep).attr("name", mobile_comm_getDic("lbl_apv_writer"));		//gLabel__writer);
                        
                        $$(oOU).attr("code", sessionObj["DEPTID"]);
                        $$(oOU).attr("name", sessionObj["DEPTNAME"]);
                        
                        $$(oPerson).attr("code", mobile_comm_getSession["USERID"]);
                        $$(oPerson).attr("name", sessionObj["USERNAME"]);
                        $$(oPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
                        $$(oPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
                        $$(oPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
                        $$(oPerson).attr("oucode", sessionObj["DEPTID"]);
                        $$(oPerson).attr("ouname", sessionObj["DEPTNAME"]);
                        $$(oPerson).attr("sipaddress", sessionObj["UR_Mail"]);
                        
                        $$(oTaskinfo).attr("status", "complete");
                        $$(oTaskinfo).attr("result", "complete");
                        $$(oTaskinfo).attr("kind", "charge");
                        $$(oTaskinfo).attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                        $$(oTaskinfo).attr("datecompleted", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
                        
                        $$(oPerson).append("taskinfo", oTaskinfo);
                        
                        $$(oOU).append("person", oPerson);
                        
                        $$(oStep).append("ou", oOU);
                        
                        $$(jsonApv).find("steps>division").append("step", oStep);
                        $$(jsonApv).find("steps>division>step").json().splice(0, 0, oStep);
                        $$(jsonApv).find("steps>division>step").concat().eq($$(jsonApv).find("steps>division>step").concat().length-1).remove();
                    }
                }

                var oResult = $$(jsonApv).json();
                return JSON.stringify(oResult);
            }
            else {
            	return arrmobileDomainDataList[processID];
            }
        }
        else if(mode == "REDRAFT") {
        	var oApvList = jsonApv;
        	var oCurrentOUNode = $$(oApvList).find("steps > division").children().find("[divisiontype='receive']").has(">taskinfo[status='pending']");
            if (oCurrentOUNode == null) {
            	var oDiv = {};
            	$$(oDiv).attr("taskinfo", {});
            	$$(oDiv).attr("step", {});
            	$$(oDiv).attr("divisiontype", "receive");
            	$$(oDiv).attr("name", mobile_comm_getDic("lbl_apv_ChargeDept"));
                $$(oDiv).attr("oucode", sessionObj["DEPTID"]);
                $$(oDiv).attr("ouname", sessionObj["DEPTNAME"]);
            	
                $$(oDiv).find("taskinfo").attr("status", "pending");
                $$(oDiv).find("taskinfo").attr("result", "pending");
                $$(oDiv).find("taskinfo").attr("kind", "receive");
                $$(oDiv).find("taskinfo").attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
            	
            	$$(oApvList).find("division").push(oDiv);
            	
                oCurrentOUNode = $$(oApvList).find("steps > division:has(>taskinfo[status='pending'])[divisiontype='receive']");
            }
            var oRecOUNode = $$(oCurrentOUNode).find("step").has("ou>taskinfo[status='pending']");
            if (oRecOUNode.length != 0 && $$(oRecOUNode).find("ou").hasChild("person").length == 0) $$(oCurrentOUNode).find("step").has("ou>taskinfo[status='pending']").remove();
            var oChargeNode = $$(oCurrentOUNode).find("step").has("ou>person>taskinfo[status='pending']");

            //담당 수신자 대결
            var isChkDeputy = false;

            if (oChargeNode.length != 0) {
                //담당 수신자 대결 S ----------------------------------------
                var objDeputyOU = $$(oApvList).find("steps>division[divisiontype='receive']>step>ou");
                var chkObjPersonNode = $$(objDeputyOU).find("person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "']").find(">taskinfo[status='pending']");
                var chkObjRoleNode = $$(objDeputyOU).find("role:has(person[code='" + UserCode + "'][code!='" + sessionObj["USERID"] + "'])");

                if (0 < (chkObjPersonNode.length + chkObjRoleNode.length)) {
                    isChkDeputy = true;
                }
                //담당 수신자 대결 E -----------------------------------------
            	
                var oRecApprovalNode = $$(oCurrentOUNode).find("step>ou>person>taskinfo[status='inactive']");
                if (oRecApprovalNode.length != 0) {
                	for(var i=0; i<oRecApprovalNode.length; i++){
                		var RecApprovalNode = oRecApprovalNode.concat().eq(i);
                		oCurrentOUNode.concat().eq(0).remove(RecApprovalNode.parent().parent().parent());
                	}
                }

                //person의 takinfo가 inactive가 있는 경우 routetype을 변경함
                var nodesInactives = $$(oCurrentOUNode).find("step[routetype='receive']").has("ou > person > taskinfo[status='inactive']");

                $$(nodesInactives).each(function (i, nodesInactive) {
                    $$(nodesInactive).attr("unittype", "person");
                    $$(nodesInactive).attr("routetype", "approve");
                    $$(nodesInactive).attr("name", mobile_comm_getDic("lbl_apv_ChargeDept"));	
                });

            }
            
        	var oJFNode = $$(oCurrentOUNode).find("step").has("ou>role>taskinfo[status='pending'], ou>role>taskinfo[status='reserved']"); 
            var bHold = false; //201108 보류여부
            var oComment = null;
            if (oJFNode.length != 0) {
                var oHoldTaskinfo = $$(oJFNode).find("ou>role>taskinfo[status='reserved']");
                if (oHoldTaskinfo.length != 0) {
                    bHold = true;
                    oComment = $$(oHoldTaskinfo).find("comment").json();
                    
                    // 보류한 사용자와 로그인한 사용자가 다른 경우
                    if($$(oComment).attr("reservecode") != undefined && $$(oComment).attr("reservecode") != getInfo("AppInfo.usid")) {
                    	alert(mobile_comm_getDic("msg_apv_holdOther")); // 해당 양식은 다른 사용자가 보류한 문서입니다.
                    	bHold = false;
                	}
                }
                //$$(oCurrentOUNode).eq(0).remove($$(oJFNode).eq(0));
                $$(oCurrentOUNode).eq(0).remove("step");
            }

            $$(oCurrentOUNode).attr("oucode", sessionObj["DEPTID"]);
            $$(oCurrentOUNode).attr("ouname", sessionObj["DEPTNAME"]);
            
            $$(oCurrentOUNode).find("taskinfo").attr("status", "pending");
            $$(oCurrentOUNode).find("taskinfo").attr("result", "pending");
            
            var oStep = {};
            var oOU = {};
            var oPerson = {};
            var oTaskinfo = {};

            $$(oStep).attr("unittype", "person");
            $$(oStep).attr("routetype", "approve");
            $$(oStep).attr("name", mobile_comm_getDic("lbl_apv_ChargeDept"));
            
            $$(oOU).attr("code", sessionObj["DEPTID"]);
            $$(oOU).attr("name", sessionObj["DEPTNAME"]);
                        
            $$(oOU).attr("taskid", $$(oCurrentOUNode).find("step>ou").attr("taskid"));
			$$(oOU).attr("widescid", $$(oCurrentOUNode).find("step>ou").attr("widescid"));
			$$(oOU).attr("wiid", $$(oCurrentOUNode).find("step>ou").attr("wiid"));      
            
            $$(oPerson).attr("code", sessionObj["USERID"]);
            $$(oPerson).attr("name", sessionObj["USERNAME"]);
            $$(oPerson).attr("position", sessionObj["UR_JobPositionCode"] + ";" + sessionObj["UR_JobPositionName"]);
            $$(oPerson).attr("title", sessionObj["UR_JobTitleCode"] + ";" + sessionObj["UR_JobTitleName"]);
            $$(oPerson).attr("level", sessionObj["UR_JobLevelCode"] + ";" + sessionObj["UR_JobLevelName"]);
            $$(oPerson).attr("oucode", sessionObj["DEPTID"]);
            $$(oPerson).attr("ouname", sessionObj["DEPTNAME"]);
            $$(oPerson).attr("sipaddress", sessionObj.UR_Mail);
            
            $$(oTaskinfo).attr("status", (bHold == true ? "reserved" : "pending")); 
            $$(oTaskinfo).attr("result", (bHold == true ? "reserved" : "pending")); 
            $$(oTaskinfo).attr("kind", "charge");
            $$(oTaskinfo).attr("datereceived", CFN_TransServerTime(CFN_GetLocalCurrentDate()));
            if (bHold) $$(oTaskinfo).attr("comment", oComment); 
            
            $$(oPerson).append("taskinfo", oTaskinfo);
            
            $$(oOU).append("person", oPerson);
            
            $$(oStep).append("ou", oOU);
            
            // 조건 추가 - charge가 있는 경우에만 실행
            // receive division의 첫번째 step 교체
            if($$(oCurrentOUNode).find("step > ou > person > taskinfo[kind='charge']").length > 0) {                        
                $$(oCurrentOUNode).append("step", oStep);
                $$(oCurrentOUNode).find("step").concat().eq(0).remove();
            }
            else {
            	$$(oCurrentOUNode).append("step", oStep);
            }
            
            //담당 수신자 대결 S ---------------------------------------------
            if (isChkDeputy) {
            	//Common.Warning(coviDic.dicMap.msg_ApprovalDeputyWarning);
            	
                var objOriginalApprover = $$(oChargeNode).find('ou').find("person");
                $$(objOriginalApprover).attr('title', $$(objOriginalApprover).attr('title'));
                $$(objOriginalApprover).attr('level', $$(objOriginalApprover).attr('level'));
                $$(objOriginalApprover).attr('position', $$(objOriginalApprover).attr('position'));

                $$(objOriginalApprover).find('taskinfo').remove('datereceived');
                $$(objOriginalApprover).find('taskinfo').attr('kind', 'bypass');
                $$(objOriginalApprover).find('taskinfo').attr('result', 'inactive');
                $$(objOriginalApprover).find('taskinfo').attr('status', 'inactive');
                
                // [2015-05-28 modi] 현재 대결인 division에만 추가하도록
                //objDeputyOU = $(oApvList).find("steps > division[divisiontype='receive'] > step > ou");
                //objDeputyOU = $$(oApvList).find("steps>division").has("taskinfo[status='pending']").find("step>ou");
                //$$(objDeputyOU).append("person", $$(objOriginalApprover).json());
                
                // [2020-10-23] person 추가에서 step 추가로 변경
                $$(oChargeNode).attr("routetype", "approve");
                $$(oChargeNode).attr("name", "원결재자");
            	$$(oCurrentOUNode).append("step", $$(oChargeNode).json());
            }
            //담당 수신자 대결 E ----------------------------------------------

            var oResult = $$(oApvList).json();
            return JSON.stringify(oResult);              
        }
        else {
        	return arrmobileDomainDataList[processID];
        }
    }
    catch (e) {
        alert(e.message);
    }
}

function mobile_approval_regDeputySetting() {
	mobile_comm_go("/approval/mobile/approval/deputy.do", 'N');
}

//결재 대결 설정 페이지 Init
function mobile_approval_DeputyInit() {

	$.ajax({
		type:"POST",
		url:"/approval/user/getPersonSetting.do",
		success:function (data) {
			var item = data.list[0];
			
			if(item.UseDeputy == "Y") {
				$("#approval_deputy_switch").trigger("click");
				
				$("#approval_deputy_content").find("[id^=approval_deputy_]").each(function(i, obj){ 
					var key = $(obj).attr("id").replace("approval_deputy_", "");
					$(obj).val(item[key]);
				});
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/getPersonSetting.do", response, status, error);
		}
	});
	
	// datepicker
	$(".dates_apv_wrap").attr("style", "width: 100%;table-layout: fixed;display: table;height: 48px;line-height: 33px;border-bottom: 1px solid #ddd;");
	
	$(".dates_date").datepicker({
		dateFormat : 'yy-mm-dd',
		dayNamesMin : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	});
	
}

//대결사용여부 trigger
function mobile_approval_deputy_trigger(obj) {
	if($(obj).hasClass("on")){
		$(obj).removeClass("on");
		$(obj).parent().removeClass("active");
		//입력된 값 초기화 후 숨김처리
		$("#approval_deputy_inputarea").find("[id^=approval_deputy_]").each(function(i, obj){ 
			$(obj).val("");
		});
		$("#approval_deputy_inputarea").hide();
	} else {
		$(obj).addClass("on");
		$(obj).parent().addClass("active");
		$("#approval_deputy_inputarea").show();
	}
}

//대결자 설정
function mobile_approval_deputy_setDelegator(oJSON) {
	var userCode = oJSON.item[0].AN;
	var userName = mobile_comm_getDicInfo(oJSON.item[0].DN);
	
	$("#approval_deputy_DeputyCode").val(userCode);
	$("#approval_deputy_DeputyName").val(userName);
}

//시작일-종료일 체크
function mobile_approval_deputy_chkDateValidation(from) {
	//날짜 입력값 유효성 검사 추가
	if(from == "SD" || from == "ED") {
		try {
			var dtCheck = new Date($("#approval_deputy_DeputyFromDate").val());
			if(from == "ED") {
				dtCheck = new Date($("#approval_deputy_DeputyToDate").val());
			}
			if((dtCheck.getDate() + "") == "NaN") {
				alert(mobile_comm_getDic("msg_InValidDateInput"));		//날짜 입력값이 잘못 되었습니다.
				
				if(from == "SD") {
					var date = new Date();
					$("#approval_deputy_DeputyFromDate").val(mobile_approval_SetDateFormat(date, '-'));
				} else if(from == "ED") {
					$("#approval_deputy_DeputyToDate").val($("#approval_deputy_DeputyFromDate").val());
				}
				
				return false;
			}
		} catch (e) {
			alert(mobile_comm_getDic("msg_InValidDateInput"));		//날짜 입력값이 잘못 되었습니다.
			return false;
		}
	}
	
	var start_date = new Date($("#approval_deputy_DeputyFromDate").val());
	var end_date = new Date($("#approval_deputy_DeputyToDate").val());
	
	if(start_date.getTime() > end_date.getTime()) { //시작일이 종료일보다 큰 경우
		$("#approval_deputy_DeputyToDate").val($("#approval_deputy_DeputyFromDate").val());
	}
}

//날짜 형식 바꿈
function mobile_approval_ReplaceDate(dateStr) {
    var regexp = /\./g;

    if (typeof dateStr == "string") {
    	if (dateStr.indexOf("-") > -1) {
            regexp = /-/g;
        } else if (dateStr.indexOf(".") > -1) {
            regexp = /\./g;
        } else if (dateStr.indexOf("/") > -1) {
            regexp = /\//g;
        }
        
        return dateStr.replace(regexp, "/");
    } else {
        var tempDate = new Date(dateStr);
        
        dateStr = tempDate.getFullYear() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + " " + mobile_comm_AddFrontZero(tempDate.getHours(), 2) + ":" + mobile_comm_AddFrontZero(tempDate.getMinutes(), 2);
        
        return dateStr;
    }
}

//날짜 포멧 변환
function mobile_approval_SetDateFormat(pDate, pType) {
	var formattedDate = '';
	var date = new Date(mobile_approval_ReplaceDate(pDate));

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}

	switch (pType) {
	case '.': formattedDate = year + '.' + month + '.' + day; break;
	case '/': formattedDate = year + '/' + month + '/' + day; break;
	case '-': formattedDate = year + '-' + month + '-' + day; break;
	case '': formattedDate = year.toString() + month.toString() + day.toString(); break;
	}
	
	return formattedDate;
}

//대결 설정 저장
function mobile_approval_deputy_save() {
	var inputParams = {}; 
	
	$("#approval_deputy_inputarea").find("[id^=approval_deputy_]").each(function(i, obj){ 
		var key = $(obj).attr("id").replace("approval_deputy_", ""); 
		var value = $(obj).val(); 
		inputParams[key] = value; 
	});
	
	inputParams.DeputyYN = $("#approval_deputy_switch").hasClass("on") ? "Y" : "N";
	inputParams.ApprovalPassword = "";
	inputParams.ApprovalAlarm = "";
	inputParams.IsMobile = "Y";
	
    if (inputParams.DeputyYN == "Y" && (inputParams.DeputyName == "" && inputParams.DeputyOption != "P")){
    	alert(mobile_comm_getDic("msg_apv_344")); // 대결자를 입력하십시오.
    	return false;
    }
	if (inputParams.DeputyYN == "Y" && (inputParams.DeputyFromDate == "" || inputParams.DeputyToDate == "")) {
    	alert(mobile_comm_getDic("msg_apv_334")); // 대결기간을 입력하십시오.
        return false;
    }
    if (inputParams.DeputyYN == "Y" && inputParams.DeputyReason == "") {
    	alert(mobile_comm_getDic("msg_apv_262")); // 대결사유를 입력하여 주십시오.
        return false;
    }
    if (inputParams.DeputyCode == mobile_comm_getSession("USERID")){
    	alert(mobile_comm_getDic("msg_no_self_deputy")); // 스스로를 대결자로 지정할 수 없습니다.
        return false;
    }
    if (inputParams.DeputyYN == "Y" && inputParams.DeputyOption == ""){
    	alert(mobile_comm_getDic("msg_apv_selectDeputyOption")); // 대결 옵션을 선택하여 주시기 바랍니다.
        return false;
    }
    
    $.ajax({
		type:"POST",
		url:"/approval/user/updateUserSetting.do",
		data:inputParams,
		success:function (data) {
			if(data.result=="ok" && data.cnt >= 1){
				alert(mobile_comm_getDic("msg_apv_331")); //저장되었습니다.
				mobile_comm_back();
			}else{
				Common.Inform(mobile_comm_getDic("msg_apv_394")); //존재하지 않는 사용자입니다.
				mobile_comm_back();
			}
		},
		error:function(response, status, error){
			CFN_ErrorAjax("/approval/user/updateUserSetting.do", response, status, error);
		}
	});
}

//결재 내부 로직 끝