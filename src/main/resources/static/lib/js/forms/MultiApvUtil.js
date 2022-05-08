
//탭  세팅
function addTabClass(doctype){
	var maxtab = 10;
	var tabTitle = "";
	var hwpTemplate = "draft_Template";
	if (getInfo("FormInfo.FormPrefix") == "WF_FORM_SB_MULTI_AUDIT_DRAFT") maxtab = 12;
	
	if (getInfo("Request.templatemode") == "Write") {
		if(doctype == "audit"){ // 일상감사 검토서
			if($("#writeTab li[doctype=audit]").length > 0){
				//Common.Warning("검토서가 이미 추가되었습니다.");
				return false;
			}
		} else if(doctype == "opinion"){ // 일상감사 의견서
			if($("#writeTab li[doctype=opinion]").length > 0){
				//Common.Warning("의견서가 이미 추가되었습니다.");
				return false;
			}
		}
	}

	if(doctype == null) {
		doctype = 'normal';
	}
	
	if($("#writeTab li").length < maxtab){
		
		$("#writeTab li").attr('class','');
		var idx = $("#writeTab li").length + 1;

		switch(doctype){
			case "normal" : tabTitle = idx + "안"; hwpTemplate = "draft_Template"; break;
			case "audit" : tabTitle = "검토서"; hwpTemplate = "review_Template"; break;
			case "opinion" : tabTitle = "의견서"; hwpTemplate = "opinion_Template"; break;
		}
		
		var html = "";
		html = "<li class='on' idx='" + idx + "' style='width:70px;' doctype='" + doctype + "'><a onclick='javascript:changeTab(" + idx + ");' style='line-height:35px;'>" + tabTitle + "</a></li>"
		$("#writeTab").append(html);
		
		$("#ContentsLine").append("<div id='divWebEditorContainer" + idx + "' data-element-type='editor' idx='" + idx + "'></div>");
		$("#AttFileInfoList_Multi td").append("<div id='AttFileInfo" + idx + "'></div>");
		$("#tblFileList").append("<tbody id='fileInfo" + idx + "' style='background-color:white;'><tr id='trFileInfoBox" + idx + "' style='height:99%'><td colspan='4'><div class='dragFileBox'><span class='dragFile'>icn</span>" + Common.getDic("lbl_DragFile") + "</div></td></tr></tbody>");
		$("#divFileSelect").append("<input type='file' multiple name='FileSelect" + idx + "' id='FileSelect" + idx + "' onchange='javascript:FileSelect_onchangeMulti();' style='opacity:0;'/>");

		$("#DocLinkInfoList_Multi td").append("<div id='DocLinkInfo" + idx + "'></div>");
		
		var multirowIdx = idx - 1;
		if($(".multi-row")[multirowIdx] == null && getInfo("Request.templatemode") == "Write"){
			$('#btn_new_add').click();
			$(".multi-row input[name=MULTI_DOC_TYPE]")[multirowIdx].value = doctype;
		}
		LoadEditorHWP_Multi("divWebEditorContainer" + idx, idx, hwpTemplate, doctype);
		l_aObjFileListMultiArr[idx-1] = new Array();
		
		changeTab(idx);
	}

	if(getInfo("Request.mode") == "REDRAFT") {
		$(".tabLine").hide();
	}
}

//탭  세팅
function delTabClass(){
	if($("#writeTab li").length > 1){
		var idx = $("#writeTab li").length;
		$("#writeTab li[idx=" + idx + "]").remove();
		$("#divWebEditorContainer" + idx).remove();
		$('[id=AttFileInfo' + idx + ']').remove();
		$("#fileInfo" + idx).remove();
		$('[id=DocLinkInfo' + idx + ']').remove();
		
		$('#btn_new_del').click();
		l_aObjFileListMultiArr[idx-1] = null;
		changeTab(idx - 1);
	}
}

function delOpinion(){
	var idx = $('li[doctype=opinion]').attr('idx');
	if(idx != null){
		$("#writeTab li[idx=" + idx + "]").remove();
		$("#divWebEditorContainer" + idx).remove();
		$('[id=AttFileInfo' + idx + ']').remove();
		$("#fileInfo" + idx).remove();
		
		$('#btn_new_del').click();
		l_aObjFileListMultiArr[idx-1] = null;
		changeTab(idx - 1);
	}
}

function changeTab(idx){
	$("#writeTab li").attr('class','');
	$("#writeTab li[idx=" + idx + "]").attr('class','on');
	$('div [id^=divWebEditorContainer]').hide();
	$('div[id=divWebEditorContainer' + idx + ']').show();
	$('div[id^=AttFileInfo]').hide();
	$('div[id=AttFileInfo' + idx + ']').show();
	$('tbody[id^=fileInfo]').hide();
	$('tbody[id=fileInfo' + idx + ']').show();
	$('div[id^=DocLinkInfo]').hide();
	$('div[id=DocLinkInfo' + idx + ']').show();

    if (getInfo("Request.templatemode") != "Read") {
		if($('[name=MULTI_RECEIVER_TYPE]')[idx-1] != undefined && (formJson.BodyData.SubTable1 == undefined || formJson.BodyData.SubTable1[idx-1] == undefined)){
			$('#RecieveSelect').val($('[name=MULTI_RECEIVER_TYPE]')[idx].value);
		} else {
			$('#RecieveSelect').val(formJson.BodyData.SubTable1[idx-1].MULTI_RECEIVER_TYPE);
		}
    }
}

function RecieveTypeChange(){
	var idx = $("#writeTab li.on").attr('idx');
	$('[name=MULTI_RECEIVER_TYPE]')[idx].value = $('#RecieveSelect').val();
	var HwpCtrl = $('[id=tbContentElement' + idx + '][doctype=normal]')[0];
	if(HwpCtrl == null) {
		HwpCtrl = $('[id=tbContentElement' + idx + 'Frame][doctype=normal]')[0].contentWindow.HwpCtrl;
	}

	$('#btRecieveIn, #btRecieveOut, #spanSender, #spanEtcSender').hide();
	
	if($('#RecieveSelect').val() == "Out"){
		$('#btRecieveOut').show();
	    HwpCtrl.PutFieldText('sendername', '코비젼대표이사장');
	} else if($('#RecieveSelect').val() == "In") {
		$('#btRecieveIn').show();
	    HwpCtrl.PutFieldText('sendername', getInfo('AppInfo.dpnm')+'장');
	} else {
		//$('#spanEtcSender').show();
		$('#spanSender').show();
	    HwpCtrl.PutFieldText('sendername', " ");
	}
}

function setReciever(obj){
	var gbn = "";
	if(obj.id == "btRecieveIn"){
		gbn = "In";
	} else if(obj.id == "btRecieveOut") {
		gbn = "Out";
	} else {
		gbn = "Etc";
	}
	if(gbn == "Etc"){
		if($('#spanEtcReceiver').css('display') == 'none'){
			$('#spanEtcReceiver').show();
		} else {
			$('#spanEtcReceiver').hide();
		}
	} else {
	    var oApproveStep;
		var iHeight = 580; 
		var iWidth = 1110;
		var sUrl = "/approval/multiReceiveline.do?gbn="+gbn;
		var sSize = "scrollbars=no,toolbar=no,resizable=no";
		
		CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);	
	}
}

/* 기초코드(발신명의)를 불러오기 */
function getSenderList() {
    // 그룹코드와 비사용중인 코드를 제외한 모든 코드를 가져옴.
    var oCodeList = Common.getBaseCode("DocSenderList");
    var Len = oCodeList.CacheData.length;
    var vCodeName = oCodeList.CacheData[0].Code;

    $("select[id=SenderSelect] option").remove();

    $("select[id=SenderSelect]").eq(0).append("<option value=''>선택</option>");
    for (var i = 0; i < Len; i++) {
        $("select[id=SenderSelect]").append("<option value='" + oCodeList.CacheData[i].Code + "'>" + oCodeList.CacheData[i].CodeName + "</option>");
    }
}

function SetEtcReceiver(obj){ 
	if(obj == null) return false;
	var idx = $("#writeTab li.on").attr('idx');
	
    var HwpCtrl = document.getElementById(g_id + idx);
	if(HwpCtrl == null) {
		HwpCtrl = document.getElementById(g_id + idx + "Frame").contentWindow.HwpCtrl;
	}
	
    var receiver = obj.value; 

    if(receiver.indexOf(',') > -1){
    	HwpCtrl.PutFieldText('recipient_single', "수신자참조");
    	HwpCtrl.PutFieldText('recipient_mul', receiver);
    	HwpCtrl.PutFieldText('recipient', "수신자");
    } else {
    	HwpCtrl.PutFieldText('recipient_single', receiver);
    	HwpCtrl.PutFieldText('recipient_mul', " ");
    	HwpCtrl.PutFieldText('recipient', " ");
    }
    HwpCtrl.PutFieldText('sendername', '코비젼대표이사장');
    
	$('[name=MULTI_RECEIVER_TYPE]')[idx].value = "Etc";
	$('[name=MULTI_RECEIVENAMES]')[idx].value = receiver;
	$('[name=MULTI_RECEIPTLIST]')[idx].value = receiver;
	document.getElementById("ReceiveNames").value = "";
	document.getElementById("ReceiptList").value = "";
	
	obj.value = '';
	$('#spanEtcReceiver').hide();
}

function SetSender(obj){
	var idx = $("#writeTab li.on").attr('idx');
	
    var HwpCtrl = document.getElementById(g_id + idx);
	if(HwpCtrl == null) {
		HwpCtrl = document.getElementById(g_id + idx + "Frame").contentWindow.HwpCtrl;
	}

	var sendercode = "";
	var sendername = ""; 
	if(obj.tagName == "SELECT"){
		sendercode = obj.value;
		sendername = (obj.value == "" ? (HwpCtrl.GetFieldText("recipient_single") == "내부결재" ? " " : getInfo('AppInfo.dpnm')+'장') : obj.options[obj.selectedIndex].text);
	} else if(obj.tagName == "INPUT"){
		sendername = obj.value;
	}
	if(sendercode == "Dept"){
		sendername = getInfo('AppInfo.dpnm')+'장';
	} else if (sendercode == "Empty"){
		sendername = " ";
	} else 	if(sendercode != "" && sendername == "감사"){
		sendername = getSenderInfo(sendercode);
	}
    HwpCtrl.PutFieldText('sendername', sendername);
	$('#spanSender').hide();
}

function getSenderInfo(sendercode){
	var sendername;
    try {
    	$.ajax({
    		async : false,
    		url:"getSenderInfo.do", 
    		data:  {
				"titlecd" : sendercode
			},
    		type:"post",
    		success:function (res) {
    			if(res.status == "SUCCESS"){
    				sendername = res.list[0].deptname + ' ' + res.list[0].displayname;
    			}
    		},
    		error:function(response, status, error){
				CFN_ErrorAjax("getSenderInfo.do", response, status, error);
			}
    	});
    } catch (e) {
        Common.Error(e.message);
    }
    return sendername;
}

// --------------------------------------------- 첨부파일 컨트롤 -------------------------------------------------------
/**
 * 1. 개발지원에 있는 첨부파일 컨트롤 HTML 사용
 * 2. 스크립트단은 아래 함수들로 실행됨
 * 3. 서버단에서는 개발지원에 있는 submit 함수를 이용해서 컨트롤에서 Request에 있는 MultipartFile 로 받아서 처리.
 * 4. 컨트롤에서는 FileUtil.fileUpload 함수이용해서 첨부파일 저장
 */

var l_aObjFileListMulti = [];
var l_aObjFileListMultiArr = new Array(10);
l_aObjFileListMultiArr[0] = new Array();

// 파일추가 버튼
function AddFileMulti() {
	var idx = $("#writeTab li.on").attr('idx');
	// Iframe FileControl의 파일추가 버튼 클릭
	document.getElementById("FileSelect" + idx).click();
	l_aObjFileListMulti = l_aObjFileListMultiArr[idx];
}

//Iframe의 파일 컨트롤 값이 입력될때(파일 선택 시)
function FileSelect_onchangeMulti() {
	var idx = $("#writeTab li.on").attr('idx');
    // 파일 선택 시 파일명 중복 검사
    var nLength = document.getElementById("FileSelect" + idx).files.length;
    var oFileInfo = document.getElementById("FileSelect" + idx).files;
    var bCheck = false;
    var aObjFiles = [];
    var oldFileList = $('#fileInfo' + idx + ' [name=chkFile]');
    var configLimitSize = 10; //Common.getBaseConfig("FileUploadLimitSize");
    var fileSizeLimit = configLimitSize*1024*1024;
    
    var overSize = false;
    $(oFileInfo).each(function(idx, item){
    	if(item.size > fileSizeLimit){
    		overSize = true;
    	}
    });
    
    if(overSize){
    	Common.Warning(configLimitSize+"MB 이하의 파일만 업로드 가능합니다.");
    	return false;
    }
    
    if (oldFileList.length == 0) {
        readfilesMulti(document.getElementById("FileSelect" + idx).files, idx);
        SetFileInfoMulti(document.getElementById("FileSelect" + idx).files, idx);
    } else {
        for (var i = 0; i < nLength; i++) {
			for (var j = 0; j < oldFileList.length; j++) {
				if (oFileInfo[i].name == oldFileList[j].value.split(':')[1]) { // 중복됨
					bCheck = true;
					Common.Warning(Common.getDic("msg_AlreadyAddedFile"));
					break;
				} else { // 중복안됨
					bCheck = false;
				}
			}
            if (!bCheck) {
                aObjFiles.push(oFileInfo[i]);
            }
        }
        readfilesMulti(aObjFiles, idx);
        SetFileInfoMulti(aObjFiles, idx);
    }
}

// onDragEnter Event
function onDragEnterMulti(event) {
	event.preventDefault();
}

// onDragOver Event
function onDragOverMulti(event) {
	event.preventDefault();
}

// Drop Event
function onDropMulti(event) {
	var idx = $("#writeTab li.on").attr('idx');
	var file = event.dataTransfer.files;
	var aObjFileList = new Array();
	aObjFileList = event.dataTransfer.files;

	event.stopPropagation();
	event.preventDefault();

	// 파일 선택 시 파일명 중복 검사
	var nLength = aObjFileList.length;
	var oFileInfo = aObjFileList;
	var bCheck = false;
	var aObjFiles = [];
	var oldFileList = $('#fileInfo' + idx + ' [name=chkFile]');
    var configLimitSize = 10; //Common.getBaseConfig("FileUploadLimitSize");
    var fileSizeLimit = configLimitSize*1024*1024;
    
    var overSize = false;
    $(oFileInfo).each(function(idx, item){
    	if(item.size > fileSizeLimit){
    		overSize = true;
    	}
    });
    
    if(overSize){
    	Common.Warning(configLimitSize+"MB 이하의 파일만 업로드 가능합니다.");
    	return false;
    }

	if (oldFileList.length == 0) {
		readfilesMulti(aObjFileList, idx);
		SetFileInfoMulti(aObjFileList, idx);
	} else {
		for (var i = 0; i < nLength; i++) {
			for (var j = 0; j < oldFileList.length; j++) {
				if (oFileInfo[i].name == oldFileList[j].value.split(':')[1]) { // 중복됨
					bCheck = true;
					Common.Warning(Common.getDic("msg_AlreadyAddedFile"));
					break;
				} else { // 중복안됨
					bCheck = false;
				}
			}
			if (!bCheck) {
				aObjFiles.push(oFileInfo[i]);
			}
		}
		readfilesMulti(aObjFiles, idx);
		SetFileInfoMulti(aObjFiles, idx);
	}
}

// 파일정보 배열(l_aObjFileListMulti)에 추가
function readfilesMulti(files, idx) {
	for (var i = 0; i < files.length; i++) {
		l_aObjFileListMultiArr[idx-1].push(files[i]);
	}
}

// 파일 정보 히든필드에 셋팅
function SetFileInfoMulti(pObjFileInfo, idx) {
	var aObjFileInfo = new Array();
	aObjFileInfo = pObjFileInfo;
	var sFileInfo = "";
	var sFileInfoTemp = "";
	var nLength = aObjFileInfo.length;
	for (var i = 0; i < nLength; i++) {
		sFileInfo += aObjFileInfo[i].name + ":" + aObjFileInfo[i].size + ":" + "NEW" + ":" + "0" + ":" + "|";

		// hidFileSize 값 셋팅
		sFileInfoTemp += aObjFileInfo[i].name + ":" + aObjFileInfo[i].name.split(',')[aObjFileInfo[i].name.split(',').length - 1] + ":" + aObjFileInfo[i].size + "|";
	}

	// 목록에 바인딩
	DrawTableMulti(pObjFileInfo, idx);
}

// 첨부파일 정보 Row 추가
function DrawTableMulti(fileInfo, idx) {
	var aObjFileInfo = new Array();
	aObjFileInfo = fileInfo;
	var sFileInfo = "";

	for (var l = 0; l < aObjFileInfo.length; l++) {
		var sExtension = aObjFileInfo[l].name.split('.')[aObjFileInfo[l].name.split('.').length - 1];
		var sFileName = aObjFileInfo[l].name;
		var sFileSize = aObjFileInfo[l].size;
		var sFileType = "";
		sFileInfo += sFileName + ":" + sExtension + ":" + sFileSize + "|"; //":" + sFilePath +
	}

	var l_selObj = document.getElementById("fileInfo" + idx);
	var l_arrFile = "";
	if (sFileInfo != "" && sFileInfo != undefined)
		l_arrFile = sFileInfo.split("|"); // 새 파일 정보
	if (l_arrFile != "" && l_arrFile.length > 0) {
		$("#trFileInfoBox" + idx).hide();
	}
	if (l_arrFile != "") {
		if (l_selObj.rows[l_selObj.rows.length - 1].innerHTML.indexOf("colspan") > -1)
			l_selObj.deleteRow(l_selObj.rows.length - 1); //기본 줄이 있을 경우 제거처리
		for (var i = 0; i < l_arrFile.length - 1; i++) {
			var l_arrDetail = l_arrFile[i].split(':');
			var l_oRow = l_selObj.insertRow(l_selObj.rows.length);

			var l_oCell_1 = l_oRow.insertCell(l_oRow.cells.length);
			l_oCell_1.innerHTML = '<input name="chkFile" type="checkbox" value="' +'_0' + ':' + l_arrDetail[0] + ':NEW' + '" class="input_check">'; //+ l_arrDetail[3]

			var l_oCell_2 = l_oRow.insertCell(l_oRow.cells.length);
			l_oCell_2.innerHTML += '<span class=' + setFileIconClassMulti(l_arrDetail[1]) + '>파일첨부</span>';

			var l_oCell_3 = l_oRow.insertCell(l_oRow.cells.length);
			l_oCell_3.innerHTML = l_arrDetail[0];

			var l_oCell_4 = l_oRow.insertCell(l_oRow.cells.length);
			l_oCell_4.innerHTML += ConvertFileSizeUnitMulti(l_arrDetail[2]);
			l_oCell_4.className = "t_right";

			l_selObj.appendChild(l_oRow); //상단에서 객체 insertRow로 이미 추가됨
		}
	}
	setFormAttachFileInfoMulti(idx);
}

// 부모창의 파일삭제 버튼 클릭 시 선택한 파일 제거
function DeleteFileMulti() {
	var idx = $("#writeTab li.on").attr('idx');
	var l_selObj = document.getElementById("fileInfo" + idx);
	//var l_chk = document.getElementsByName("chkFile");
    var l_chk = $('#fileInfo' + idx + ' [name=chkFile]');
	document.getElementById("hidDeletFiles").value = "";

	if (l_chk.length <= 0) {
		return;
	}

	for (var i = l_chk.length - 1; i > -1; i--) {
		if (l_chk[i].checked) {
			document.getElementById("hidDeletFiles").value += l_chk[i].value.split(":")[1] + "|"; // 선택한 파일명

			if (l_chk[i].value.split(":")[2] == "OLD") {
				document.getElementById("hidDeleteFile").value += l_chk[i].value.split(":")[1] + "|";
			}

			l_selObj.deleteRow(i);
			if (l_selObj.rows.length < 1) {
				var l_oRow = l_selObj.insertRow(l_selObj.rows.length);
				l_oRow.setAttribute("id", "trFileInfoBox" + idx);
				l_oRow.setAttribute("height", "99%");

				var l_oCell_1 = l_oRow.insertCell(l_oRow.cells.length);
				l_oCell_1.innerHTML = '<td><div class="dragFileBox"><span class="dragFile">icn</span>' + Common.getDic("lbl_DragFile") + '</div></td>';
				l_oCell_1.setAttribute("colspan", "4");
				l_selObj.appendChild(l_oRow); //상단에서 객체 insertRow로 이미 추가됨
			}
		}
	}

	// 삭제한 파일
	var sDeletFiles = document.getElementById("hidDeletFiles").value.split("|");
	var nLength = sDeletFiles.length;
	l_aObjFileListMulti = l_aObjFileListMultiArr[idx-1];

	for (var i = 0; i < nLength - 1; i++) {
		for (var j = 0; j < l_aObjFileListMultiArr[idx-1].length; j++) {
			if (sDeletFiles[i] == l_aObjFileListMultiArr[idx-1][j].name) {
				l_aObjFileListMultiArr[idx-1].splice(j, 1);
				break;
			}
		}
	}

	var sFileInfo = "";
	var sFileInfoTemp = "";
	for (var i = 0; i < l_aObjFileListMulti.length; i++) {
		sFileInfo += l_aObjFileListMulti[i].name + ":" + l_aObjFileListMulti[i].size + ":NEW:0:|";
		sFileInfoTemp += l_aObjFileListMulti[i].name + ":" + l_aObjFileListMulti[i].name.split('.')[l_aObjFileListMulti[i].name.split('.').length - 1] + ":" + l_aObjFileListMulti[i].size + "|";
	}
	document.getElementById("hidFileSize").value = sFileInfoTemp;

	var idx = $("#writeTab li.on").attr('idx');
	//수정 부분 강제 change
	if (_ie) {
		var temp_input = $(document.getElementById("FileSelect" + idx));
		temp_input.replaceWith(temp_input.val('').clone(true));
	} else {
		document.getElementById("FileSelect" + idx).value = "";
	}
	$("#FileSelect" + idx).change();
}

function setFormAttachFileInfoMulti(idx) {
	var strOldAttachFileInfo = $('#SubTable1 .multi-row').find('[name=MULTI_ATTACH_FILE]')[idx-1].value;
	var oldAttachFileInfoLength = 0;
	var oldAttachFileInfoArr = new Array();
	var formAttachFileInfoObj = {};
	var objArr = new Array();
	var fileSeq = 0;

	if (strOldAttachFileInfo != "" && strOldAttachFileInfo != undefined && strOldAttachFileInfo != "undefined") {
		oldAttachFileInfoLength = $$(strOldAttachFileInfo).json().FileInfos.length;
		oldAttachFileInfoArr = $$(strOldAttachFileInfo).json().FileInfos;
	}

	var fileInfos = (strOldAttachFileInfo != "" && strOldAttachFileInfo != undefined && strOldAttachFileInfo != "undefined") ? $.parseJSON(strOldAttachFileInfo).FileInfos : "";

	if ($("#fileInfo" + idx + " [name=chkFile]").length > 0) {
		$("#fileInfo" + idx + " [name=chkFile]").each(function(i, checkObj) {
			var obj = {};
			var strArrObj = $(checkObj).val().split(":");
			
			if (strArrObj[2] == "OLD" || strArrObj[2] == "REUSE") {
				$(fileInfos).each(function(j, oldObj) {
					// 유지되는 파일은 파일정보를 그대로 가진다.
					if (oldObj.SavedName == strArrObj[3]) {
						objArr.push(oldObj);
						fileSeq++;
					}
				});
			} else if (strArrObj[2] == "NEW") {
				var strFormInstID = getInfo("FormInstanceInfo.FormInstID") == undefined ? "" : getInfo("FormInstanceInfo.FormInstID");
				
				$$(obj).append("ID", strFormInstID + "_" + fileSeq);
				$$(obj).append("FileName", strArrObj[1]);
				$$(obj).append("Type", strArrObj[2]);
				$$(obj).append("AttachType", strArrObj[4]); //webhard or normal
				$$(obj).append("UserCode", getInfo("AppInfo.usid"));
				
				if(strArrObj[4] == "webhard"){
					$$(obj).append("SavedName", strArrObj[3]); 
				}
				
				objArr.push(obj);
			}
		});
	}

	if (objArr.length > 0) {
		$$(formAttachFileInfoObj).append("FileInfos", objArr);
		$('#SubTable1 .multi-row').find('[name=MULTI_ATTACH_FILE]')[idx-1].value = JSON.stringify($$(formAttachFileInfoObj).json());
	} else {
		$("#AttachFileInfo").val("");
		$('#SubTable1 .multi-row').find('[name=MULTI_ATTACH_FILE]')[idx-1].value = "";
	}
}

function clearDeleteFrontMulti() {
	document.getElementById("hidDeleteFront").value = "";
}

//파일 아이콘 class 타입 구별
function setFileIconClassMulti(extention) {
	var strReturn = "";

	if (extention == "xls" || extention == "xlsx") {
		strReturn = "exCel";
	} else if (extention == "jpg" || extention == "JPG" || extention == "png" || extention == "PNG" || extention == "bmp") {
		strReturn = "imAge";
	} else if (extention == "doc" || extention == "docx") {
		strReturn = "woRd";
	} else if (extention == "ppt" || extention == "pptx") {
		strReturn = "pPoint";
	} else if (extention == "txt") {
		strReturn = "teXt";
	} else {
		strReturn = "etcFile";
	}

	return strReturn;
}

// 파일 사이즈의 값 변환
function ConvertFileSizeUnitMulti(pSize) {
	var nSize = 0;
	var sUnit = "Byte";

	nSize = pSize;
	if (nSize >= 1024) {
		nSize = nSize / 1024;
		sUnit = "KB";
	}
	if (nSize >= 1024) {
		nSize = nSize / 1024;
		sUnit = "MB";
	}
	if (nSize >= 1024) {
		nSize = nSize / 1024;
		sUnit = "GB";
	}
	if (nSize >= 1024) {
		nSize = nSize / 1024;
		sUnit = "TB";
	}
	var sReturn = (Math.round(nSize) + (Math.round(nSize) - nSize)).toFixed(1) + sUnit;
	return sReturn;
}

// 읽기모드일 경우 화면에 첨부목록 화면 세팅
function formDisplaySetFileInfoMulti() {
	if(getInfo('BodyData.SubTable1') != '' && formJson.BodyData.SubTable1 != undefined){
		$(formJson.BodyData.SubTable1).each(function(idx, item){
			var fileInfoHtml = "";
			var fileInfos = "";
			if(item.MULTI_ATTACH_FILE != null && item.MULTI_ATTACH_FILE != "" && item.MULTI_ATTACH_FILE != "undefined"){
				var multiAttachFile = Base64.b64_to_utf8(item.MULTI_ATTACH_FILE.replace(/\"/gi, '').replace(/\\\\/gi, ''));
				fileInfos = typeof(multiAttachFile) == "string" ? $.parseJSON(multiAttachFile).FileInfos : multiAttachFile.FileInfos;
			}
	
			if (fileInfos != undefined && fileInfos.length > 0) {
				$("#trFileInfoBox").hide();
				var formIdx = "";
				$(fileInfos).each(function(i, fileInfoObj) {
					var className = setFileIconClass($$(fileInfoObj).attr("Extention"));
					formIdx = $$(fileInfoObj).attr("ObjectID");
					
					fileInfoHtml += "<dl class='excelData'><dt>";
					
					fileInfoHtml += "<a href='#' onclick='MultiattachFileDownLoadCall("+ (formIdx-1) + ", "+ i + ")' >";
					fileInfoHtml += "<span class='" + className + "'>파일첨부</span>";
					fileInfoHtml += $$(fileInfoObj).attr("FileName");
					fileInfoHtml += "<span>(" + ConvertFileSizeUnit($$(fileInfoObj).attr("Size")) + ")</span>";
					fileInfoHtml += "</a>";
					
					fileInfoHtml += "</dt>";
					if (CFN_GetQueryString("listpreview") != "Y") {
						fileInfoHtml += "<dd>";
						fileInfoHtml += "<a class='previewBtn fRight' href='#ax' onclick='attachFilePreview(\"" + $$(fileInfoObj).attr("FileID").trim() + "\",\"" + $$(fileInfoObj).attr("Extention") + "\");'>" + Common.getDic("lbl_preview") + "</a>";
						fileInfoHtml += "</dd>";
					}
					fileInfoHtml += "</dl>";
				});
				
				$("#AttFileInfo" + formIdx).html(fileInfoHtml);
				if(formIdx != undefined){
					$("#TIT_ATTFILEINFO" + formIdx).html(Common.getDic("lbl_apv_AddFile") + "<br/><a class='totDownBtn' href='#ax' onclick='Common.downloadAll(" + fileInfos + ");' href='#ax'>" + Common.getDic("lbl_download_all") + "</a>");
				}
			}
		});
	}
}

// 읽기모드일 경우 화면에 연결문서 목록 세팅
function formDisplaySetDocLinkInfoMulti() {
	if(getInfo('BodyData.SubTable1') != '' && formJson.BodyData.SubTable1 != undefined){
		$(formJson.BodyData.SubTable1).each(function(idx, item){
			var docLinkInfos = "";
			if(item.MULTI_LINK_DOC != null && item.MULTI_LINK_DOC != "" && item.MULTI_LINK_DOC != "undefined"){
				docLinkInfos = item.MULTI_LINK_DOC;
			}
	
			if (docLinkInfos != undefined && docLinkInfos != "") {
				if(document.getElementsByName("MULTI_LINK_DOC").length > 1) {
					document.getElementsByName("MULTI_LINK_DOC")[idx+1].value = docLinkInfos;
				}
				G_displaySpnDocLinkInfoMulti(idx+1);
			}
		});
	}
}

function MultiattachFileDownLoadCall(tabidx, index) {
	var fileInfoObj = null;
	if(formJson.BodyData.SubTable1 != undefined) {
		if(getInfo("Request.gloct") == "TEMPSAVE"){
			fileInfoObj = $.parseJSON(formJson.BodyData.SubTable1[tabidx].MULTI_ATTACH_FILE).FileInfos[index];
		
		} else {
			fileInfoObj = formJson.BodyData.SubTable1[tabidx].MULTI_ATTACH_FILE.FileInfos[index];
			//fileInfoObj = JSON.parse(formJson.BodyData.SubTable1[tabidx].MULTI_ATTACH_FILE).FileInfos[index]
		}
		Common.fileDownLoad($$(fileInfoObj).attr("FileID").trim(), $$(fileInfoObj).attr("FileName"));
	}
}
//--------------------------------------------- 첨부파일 컨트롤 끝 ------------------------------------------------------- 

function checkForm_HWPMulti(){
    var isSenderEmpty = false;
    var isSubjectEmpty = false;
    var isBodyEmpty = false;
    var isSenderCheck = false;
    $('[id^=tbContentElement][doctype=normal]').each(function(idx, item){
    	HwpCtrl = $(item)[0];
		if(HwpCtrl.GetFieldText == undefined) {
			HwpCtrl = $(item)[0].contentWindow.HwpCtrl;
		}
        var sender = HwpCtrl.GetFieldText("sendername");
        var subject = HwpCtrl.GetFieldText("SUBJECT");
        var body = HwpCtrl.GetFieldText("BODY");
        var reciever = HwpCtrl.GetFieldText("recipient_single");
        
        if(subject.trim() == ""){
        	isSubjectEmpty = true;
        }
        if(sender.trim() == "" && $(".multi-row input[name=MULTI_RECEIVENAMES]")[idx] != null && $(".multi-row input[name=MULTI_RECEIVENAMES]")[idx].value != ""){
        	isSenderEmpty = true;
        }
        if(body == ""){
        	isBodyEmpty = true;
        }
        if(reciever == "내부결재" && sender.trim() != ""){
        	isSenderCheck = true;
        }
    });
    
	if(isSenderEmpty){
	    Common.Warning("발신명의가 입력되지 않았습니다.");
	    return false;
	}
	if(isSenderCheck){
	    Common.Warning("발신명의를 확인해 주시기 바랍니다.");
	    return false;
	}
	if(isSubjectEmpty){
	    Common.Warning("제목이 입력되지 않았습니다.");
	    return false;
	}
	/*if(isBodyEmpty){ // 이미지만 붙여넣기 하여 기안시 빈값체크됨
	    Common.Warning("본문이 입력되지 않았습니다.");
	    return false;
	}*/
	return true;
}

function insertChiefsign(empno){	
	var imgUrl = getUserSignInfo(empno);
	
	if(imgUrl != "" && imgUrl != null){
		imgUrl = Common.getBaseConfig('SignImagePath') + '/' + imgUrl; 
		if(formJson.BodyData.SubTable1 != undefined) {
			$(formJson.BodyData.SubTable1).each(function(idx, item){
				if(this.MULTI_RECEIVER_TYPE == "In" && this.MULTI_RECEIVENAMES != null && this.MULTI_RECEIVENAMES != ""){
					var result = null;
					var HwpCtrl = $('#'+g_id+(idx+1))[0];
					if(HwpCtrl == null) {
						HwpCtrl = $('#'+g_id+(idx+1)+"Frame")[0].contentWindow.HwpCtrl;
					}
					HwpCtrl.MoveToField("chief_sign", true, true, false);
					HwpCtrl.PutFieldText("chief_sign", "   "); // 이미지 삽입 전 공백 삽입(이미지만 삽입시 출력/미리보기시 이미지 사라짐)
					result = HwpCtrl.InsertPicture(imgUrl, true, 1, false, false, 0, 20, 20);
					HwpCtrl.MoveToField("BODY", true, true, false);
					if(typeof $(result) != "object"){
						//Common.Error("직인 지정중 오류가 발생하였습니다.");
						result = null;
						HwpCtrl.PutFieldText("isStamp", " ");
						return false;
					} else {
						HwpCtrl.PutFieldText("isStamp", "Y");
					}
				}
			});
		}
	}
}

function drawApvLineHWP(){
	$("[id^=tbContentElement][doctype=normal]").each(function(idx, item){
		HwpCtrl = $(item)[0];
		if(HwpCtrl.PutFieldText == undefined) {
			HwpCtrl = $(item)[0].contentWindow.HwpCtrl;
		}
		for(var i=0; i <= 8; i++){
			HwpCtrl.PutFieldText("ap" + i + "_position", " ");
			HwpCtrl.PutFieldText("apb" + i + "_sign", " ");
		}
		for(var j=0; j <= 7; j++){
			HwpCtrl.PutFieldText("as" + j + "_position", " ");
			HwpCtrl.PutFieldText("as" + j + "_sign", " ");
		}
	});

	if(getInfo("FormInfo.FormPrefix") == "WF_FORM_SB_MULTI_AUDIT_DRAFT"){
		$("[id^=tbContentElement][doctype=audit]").each(function(idx, item){
			HwpCtrl = $(item)[0];
			if(HwpCtrl.PutFieldText == undefined) {
				HwpCtrl = $(item)[0].contentWindow.HwpCtrl;
			}
			for(var i=0; i <= 4; i++){
				HwpCtrl.PutFieldText("ap" + i + "_position", " ");
				HwpCtrl.PutFieldText("apb" + i + "_sign", " ");
			}
		});
	}

	m_oApvList = JSON.parse($('#APVLIST').val());//document.getElementById("APVLIST").value
    oApvList = m_oApvList;
    
    var draftDept = "";
    if(oApvList.steps.division == null){
    	return false;
    }
    if(oApvList.steps.division[0] != null && oApvList.steps.division.length > 1){
    	draftDept = oApvList.steps.division[0].step;
    } else {
    	draftDept = oApvList.steps.division.step;
    }
    
	$("[id^=tbContentElement][doctype=normal]").each(function(idx, item){
	    HwpCtrl = $(item)[0];
		if(HwpCtrl.PutFieldText == undefined) {
			HwpCtrl = $(item)[0].contentWindow.HwpCtrl;
		}
	    var apvseq = 1;
	    var asiseq = 1;
	    
		//$(oApvList.steps.division.step).each(function(i, apline){
	    $(draftDept).each(function(i, apline){
			if(apline.unittype == "person" && apline.routetype != "assist" && apvseq <= 8){
				//HwpCtrl.GetFieldText("ap" + (apvseq) + "_position");
				HwpCtrl.PutFieldText("ap" + (apvseq) + "_position", apline.ou.person.title.split(';')[1]);
				if(apline.ou.person.taskinfo.datecompleted != null && apline.ou.person.taskinfo.status == "completed"){
					HwpCtrl.PutFieldText("apb" + (apvseq) + "_sign", apline.ou.person.name.split(';')[0]);
					
					if(draftDept.length == (i+1)){
						if(apline.ou.person.taskinfo.status == "completed"){
							var strKind = "";
							var strDate = "";
						    switch (apline.ou.person.taskinfo.kind) {
						        case "substitute": strKind = coviDic.dicMap["lbl_apv_substitue"]; break;
						        case "authorize": strKind = coviDic.dicMap["lbl_apv_authorize"]; break;
						        case "bypass": strKind = coviDic.dicMap["lbl_apv_bypass"]; break;
						        case "review": strKind = coviDic.dicMap["lbl_apv_review"]; break;
						        default : strKind = coviDic.dicMap["lbl_apv_sign_approval"]; break;
						    }
						    strDate = formatDate(apline.ou.person.taskinfo.datecompleted, 'SB');
							//HwpCtrl.PutFieldText("ap" + (apvseq) + "_type", strKind);
							//HwpCtrl.PutFieldText("ap" + (apvseq) + "_date", strDate);
							HwpCtrl.PutFieldText("apb" + (apvseq) + "_sign", strKind + " " + strDate + String.fromCharCode(0x0D) + apline.ou.person.name.split(';')[0]);

							insertChiefsign(apline.ou.person.code); // 대내발송 문서일 경우 발신부서장 서명 삽입
						}
					}
				}
				apvseq++;
			} else if(apline.unittype == "person" && apline.routetype == "assist" && asiseq <= 7){
				if(apline.allottype == "parallel"){
					$(apline.ou).each(function(pidx, pitem){
						if(asiseq <= 7){
							HwpCtrl.PutFieldText("as" + (asiseq) + "_position", pitem.person.title.split(';')[1]);
							if(pitem.person.taskinfo.datecompleted != null){
								HwpCtrl.PutFieldText("as" + (asiseq) + "_sign", pitem.person.name.split(';')[0]);
							}
							asiseq++;
						}
					});
				} else {
					HwpCtrl.PutFieldText("as" + (asiseq) + "_position", apline.ou.person.title.split(';')[1]);
					if(apline.ou.person.taskinfo.datecompleted != null){
						HwpCtrl.PutFieldText("as" + (asiseq) + "_sign", apline.ou.person.name.split(';')[0]);
					}
					asiseq++;
				}
			}
		});
	});
	
	if(getInfo("FormInfo.FormPrefix") == "WF_FORM_SB_MULTI_AUDIT_DRAFT"){
		$("[id^=tbContentElement][doctype=audit]").each(function(idx, item){
		    HwpCtrl = $(item)[0];
			if(HwpCtrl.PutFieldText == undefined) {
				HwpCtrl = $(item)[0].contentWindow.HwpCtrl;
			}
		    var apvseq = 1;
			$(draftDept).each(function(i, apline){
				if(apline.unittype == "ou" && apline.routetype == "assist" && apline.name == "일상감사" && apvseq <= 4){
					$(apline.ou.person).each(function(j, auditLine){
						HwpCtrl.PutFieldText("ap" + (apvseq) + "_position", auditLine.title.split(';')[1]);
						if(auditLine.taskinfo.datecompleted != null){
							HwpCtrl.PutFieldText("ap" + (apvseq) + "_sign", auditLine.name.split(';')[0]);
							
							//if(oApvList.steps.division.step.length == (i+1)){
								var strKind = "";
								var strDate = "";
							    switch (auditLine.taskinfo.kind) {
						        	case "charge": strKind = "담당"; break;
							        case "authorize": strKind = coviDic.dicMap["lbl_apv_authorize"]; break;
							        case "substitute": strKind = coviDic.dicMap["lbl_apv_substitue"]; break;
							        case "bypass": strKind = coviDic.dicMap["lbl_apv_bypass"]; break;
							        case "review": strKind = coviDic.dicMap["lbl_apv_review"]; break;
							        default : strKind = coviDic.dicMap["lbl_apv_sign_approval"]; break;
							    }
							    strDate = formatDate(auditLine.taskinfo.datecompleted, 'SB');
								HwpCtrl.PutFieldText("ap" + (apvseq) + "_date", strDate);
							//}
							if(apline.ou.person.length == (j+1)){
								HwpCtrl.PutFieldText("ap" + (apvseq) + "_type", strKind);
								$("[id^=tbContentElement][doctype=normal]").each(function(idx, item){
									HwpCtrl = $(item)[0];
									if(HwpCtrl.PutFieldText == undefined) {
										HwpCtrl = $(item)[0].contentWindow.HwpCtrl;
									}
									HwpCtrl.PutFieldText("audit_pil", "일상감사필");
									HwpCtrl.PutFieldText("audit_date", strDate);
									HwpCtrl.PutFieldText("audit_sign", auditLine.name.split(';')[0]);
								});
							}
						}
						apvseq++;
					});
				}
			});
		});
	}
}

function InputHWPContentMulti() {
	var idx = $("#writeTab li.on").attr('idx');

	var HwpCtrl = document.getElementById(g_id + idx);
	if(HwpCtrl == null) {
		HwpCtrl = document.getElementById(g_id + idx + "Frame").contentWindow.HwpCtrl;
	}
	HwpCtrl.MoveToField("BODY", true, true, false);
	HwpCtrl.Run("InsertFile");
}

function OpenDocInfoPopup() {
	var idx = $("#writeTab li.on").attr('idx');
	
	var iHeight = 600; 
	var iWidth = 500;
	var sUrl = "form/goGovDocInfoWritePopup.do?idx=" + idx;
	var sSize = "scrollbars=yes,toolbar=no,resizable=yes";
	
	CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);	
}

function OpenDocInfoPopup_Dist() {
	var formInstID = getInfo("FormInstanceInfo.FormInstID");
	var processID = getInfo("Request.processID");
	var deptCode = getInfo("AppInfo.dpid_apv");
	
	var iHeight = 600; 
	var iWidth = 500;
	var sUrl = "form/goGovDocInfoWritePopup.do?idx=dist&formInstID="+formInstID+"&processID="+processID+"&deptCode="+deptCode;
	var sSize = "scrollbars=yes,toolbar=no,resizable=yes";
	
	CFN_OpenWindow(sUrl, "", iWidth, iHeight, sSize);	
}

function setGovDocInfo(pObj) {
	var idx = $("#writeTab li.on").attr('idx');
	
	for(let key in pObj) {
		document.getElementsByName("MULTI_"+key)[idx].value = pObj[key];
	}
	
	var objEditor = document.getElementById(g_id + idx);
	if(objEditor == null) {
		objEditor = document.getElementById(g_id + idx + "Frame").contentWindow.HwpCtrl;
	}
	$(objEditor)[0].PutFieldText('SUBJECT', document.getElementsByName("MULTI_TITLE")[idx].value);
}