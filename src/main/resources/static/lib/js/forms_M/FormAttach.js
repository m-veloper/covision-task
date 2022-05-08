/**
 * 파일 업로드 확인을 위한 임의 javascript 소스
 */

// 파일 컨트롤과 드래그 앤 드롭하여 추가한 파일 정보를 저장.

// 읽기모드일 경우 화면에 첨부목록 화면 세팅
function formDisplaySetFileInfo() {
	var fileInfoHtml = "";
	if(getInfo("FileInfos") != ""){
		var fileInfos = $.parseJSON(getInfo("FileInfos"));
	
		if (fileInfos.length > 0) {
			$(fileInfos).each(function(i, fileInfoObj) {
				var className = setFileIconClass($$(fileInfoObj).attr("Extention"));
				
				fileInfoHtml += "<dl class='excelData'><dt>";
				
				fileInfoHtml += "<a href='#' onclick='attachFileDownLoadCall("+ i + ")' >";
				fileInfoHtml += "<span class='" + className + "'>파일첨부</span>";
				fileInfoHtml += $$(fileInfoObj).attr("FileName");
				fileInfoHtml += "<span>(" + ConvertFileSizeUnit($$(fileInfoObj).attr("Size")) + ")</span>";
				fileInfoHtml += "</a>";
				
				fileInfoHtml += "</dt>";
				if (CFN_GetQueryString("listpreview") != "Y") {
					fileInfoHtml += "<dd>";
					fileInfoHtml += "<a class='previewBtn fRight' href='#ax' onclick='attachFilePreview(\"" + $$(fileInfoObj).attr("FileID") + "\",\"" + $$(fileInfoObj).attr("FileToken") + "\",\"" + $$(fileInfoObj).attr("Extention") + "\");'>" + coviDic.dicMap.lbl_preview + "</a>";
					fileInfoHtml += "</dd>";
				}
				fileInfoHtml += "</dl>";
			});
	
			$("#AttFileInfo").html(fileInfoHtml);
	
			if (fileInfos.length > 1) {
				// $("#AttFileInfo").append("<dl class='excelData'><dt></ dt><dd><a
				// class='totDownBtn' href='#ax'
				// onclick='Common.downloadAll($.parseJSON(getInfo(\"FileInfos\")));'
				// href='#ax'><span class='etcFile'>파일첨부</span>전체 다운로드
				// </a></dd></dl>");
				$("#TIT_ATTFILEINFO").html(coviDic.dicMap.lbl_apv_AddFile + "<br/><a class='totDownBtn' href='#ax' onclick='Common.downloadAll($.parseJSON(getInfo(\"FileInfos\")));' href='#ax'>" + coviDic.dicMap.lbl_download_all + "</a>");
			}
		}
	}
}

function attachFileDownLoadCall(index) {
	var fileInfoObj = $.parseJSON(getInfo("FileInfos"))[index];
	Common.fileDownLoad($$(fileInfoObj).attr("FileID"), $$(fileInfoObj).attr("FileName"), $$(fileInfoObj).attr("FileToken"));
}

function attachFileDownLoadCall_comment(fileid, filename, filetoken) {
	Common.fileDownLoad(fileid, filename, filetoken);
}

// 첨부파일 미리보기 (Synap)
function attachFilePreview(fileId, fileToken, extention) {
	extention = extention.toLowerCase();
	if (extention ==  "jpg" ||
			extention ==  "jpeg" ||
			extention ==  "png" ||
			extention ==  "tif" ||
			extention ==  "bmp" ||
			extention ==  "xls" ||
			extention ==  "xlsx" ||
			extention ==  "doc" ||
			extention ==  "docx" ||
			extention ==  "ppt" ||
			extention ==  "pptx" ||
			extention ==  "txt" ||
			extention ==  "pdf" ||
			extention ==  "hwp") {
		var url = Common.getBaseConfig("MobileDocConverterURL") + "?fid=filePreview" + fileId + "&fileType=URL&convertType=1&filePath=" + encodeURIComponent("" + location.protocol + "//" + location.host + Common.getBaseConfig("FilePreviewDownURL") + "?fileID=" + fileId + "&fileToken=" + encodeURIComponent(fileToken) + "&userCode=" + encodeURIComponent(Common.getSession("UR_Code"))) + "&sync=true&force=false";
		if ($("#filePreview").css('display') == 'none') {
			$("#filePreview").show();
			$("#formBox").css('width', '790px');
			$("#IframePreview").attr('src', url);
			window.moveTo(0, 0);
			if (window.screen.width < 1550) {
				window.resizeTo(window.screen.width, window.screen.height);
			}
			else {
				window.resizeTo(1550, window.screen.height);
			}
			$("#previewVal").val(fileId);
		} else {
			if ($("#previewVal").val() == fileId) {
				$("#filePreview").hide();
				$("#formBox").css('width', '');
				$("#IframePreview").attr('src', '');
				var centerplaceWidth = (window.screen.width / 2) - 385;
				if (window.screen.width < 1550) {
					window.resizeTo(790, window.screen.height);
					window.moveTo(centerplaceWidth, 0);
				}
				else {
					window.resizeTo(790, window.screen.height);
				}
			} else {
				$("#IframePreview").attr('src', url);
				$("#previewVal").val(fileId);
			}
		}
	} else {
		alert("변환이 지원되지않는 형식입니다.");
		return false;
	}
}

// 편집모드일 경우, 기존 파일 정보를 첨부파일 컨트롤 화면에 세팅
function controlDisplaySetFIleInfo() {
	var fileInfoHtml = "";
	var fileInfos = $.parseJSON(getInfo("FileInfos"));

	if ($("#AttachFileInfo").val() != "") {
		var attachInfos = $.parseJSON($("#AttachFileInfo").val());

		// 재사용, 임시저장일 경우 정보에 new로 변경
		if ((getInfo("Request.mode") == "DRAFT" && getInfo("Request.gloct") == "COMPLETE") || (getInfo("Request.mode") == "DRAFT" && getInfo("Request.gloct") == "REJECT") || (getInfo("Request.mode") == "TEMPSAVE")) {
			$$(attachInfos).find("FileInfos").concat().attr("Type", "REUSE");
			$("#AttachFileInfo").val(JSON.stringify($$(attachInfos).json()));
			setInfo("FormInstanceInfo.AttachFileInfo", JSON.stringify($$(attachInfos).json()));
		}
	}

	if (fileInfos.length > 0) {
		$("#trFileInfoBox").hide();

		$(fileInfos).each(function(i, fileInfoObj) {
			var className = setFileIconClass($$(fileInfoObj).attr("Extention"));
			
			fileInfoHtml += "<tr>";
			fileInfoHtml += '<td><input name="chkFile" type="checkbox" value="'+ $$(fileInfoObj).attr("MessageID") + '_' + $$(fileInfoObj).attr("Seq") + ":" + $$(fileInfoObj).attr("FileName") + ":OLD:" + $$(fileInfoObj).attr("SavedName") + '" class="input_check"></td>';
			fileInfoHtml += '<td><span class=' + className + '>파일첨부</span></td>';
			fileInfoHtml += "<td>" + $$(fileInfoObj).attr("FileName") + "</td>";
			fileInfoHtml += '<td class="t_right">' + ConvertFileSizeUnit($$(fileInfoObj).attr("Size")) + '</td>';
			fileInfoHtml += "</tr>";
		});

		$("#fileInfo").html(fileInfoHtml);
	}
	
	if(coviCmn.configMap.useWebhardAttach == "Y" && Common.getExtensionProperties("isUse.webhard") == "Y"){
		$("#webhardAttach").show();
	}
	
	if(fileInfos.length > 0) setSeqInfo();
}

// formInstance의 attachfileinfo 컬럼 값을 세팅
function setFormAttachFileInfo() {

	var strOldAttachFileInfo = getInfo("FormInstanceInfo.AttachFileInfo");
	var oldAttachFileInfoLength = 0;
	var oldAttachFileInfoArr = new Array();
	var formAttachFileInfoObj = {};
	var objArr = new Array();
	var fileSeq = 0;

	if (strOldAttachFileInfo != "" && strOldAttachFileInfo != undefined) {
		oldAttachFileInfoLength = $$(strOldAttachFileInfo).json().FileInfos.length;
		oldAttachFileInfoArr = $$(strOldAttachFileInfo).json().FileInfos;
	}

	var fileInfos = $.parseJSON(getInfo("FileInfos"));

	if ($("[name=chkFile]").length > 0) {
		$("[name=chkFile]").each(function(i, checkObj) {
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
		$("#AttachFileInfo").val(JSON.stringify($$(formAttachFileInfoObj).json()));
	} else {
		$("#AttachFileInfo").val("");
	}
}