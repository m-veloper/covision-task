var MultiDownLoadString; //일괄다운로드용 문자열
var gFileArray = new Array();
var gFileNameArray = new Array();


// Dictionary 사용안함. 
//var dicFileInfo = new Dictionary();
////2006.12.05 by wolf upload UI 변경 
//// Dictionary 추가
//var dicFileInfoSize = new Dictionary();
//var dicFileInfoState = new Dictionary();
//var dicFileInfoUserName = new Dictionary();
//var dicFileInfoDeptName = new Dictionary();
////2006.12.05 by wolf upload UI 변경  End
//function makeDictionary(strFileInfo){
//	if(strFileInfo != ""){
//	    var m_oFileList = $.parseXML(strFileInfo);
//	    $(m_oFileList).find("file").each(function (i, elm) {
//	        addDictionary($(elm).attr("name"), $(elm).attr("location"), $(elm).attr("size"), $(elm).attr("state"), $(elm).attr("user_name"), $(elm).attr("dept_name")); //파일명, url 넘김, size, state 넘김
//	    });
//	}
//}

var g_maxFileSize_MB_Comma = setComma(_maxFileSize) + "MB";
var g_maxFileSize_KB_Comma = setComma(_maxFileSize * 1024) + "KB";

function setAttInfo() {
    /// <summary>
    /// ATTACH_FILE_INFO 업데이트 와 첨부파일 양식에 표시 (기존 funConfirm 함수와 합침)
    /// &#10; (getListXML_UX, G_displaySpnAttInfo 호출)
    /// </summary>

    var sFileInfo = getListXML_UX();

    if (sFileInfo != "") {  // 값이 없으면 기존 정보를 업데이트 하지 않는다.(기존 값 유지)

        document.getElementById("attach").value = sFileInfo;
        document.getElementById("ATTACH_FILE_INFO").value = sFileInfo;
        G_displaySpnAttInfo(false);
    }

}

function getListXML_UX() {
    /// <summary>
    /// 첨부파일의 OLD, DEL, NEW 항목 업데이트된 fileinfos 만들기 (2013-12-16 leesh)
    /// &#10; (추가 수정 항목을 CoviFileTrans 에서는 값을 받아오고, .NET Basic Upload 컨트롤은 이곳에서 만든다.)
    /// &#10; ★주의★ 루트가 fileinofs 이면 업로드 완료된 상태의 xml, fileinfo 이면 업로드 요청 xml 임.
    /// </summary>
    /// <returns type="String" >fileinfo XML String </returns>

    var retFileinfo = "";

    try {
        // [2014-10-01 modi] 첨부한 파일이 삭제가 되지 않아 수정(변경사항 없어도 업데이트)
        var oFileinfo = $.parseXML("<fileinfo></fileinfo>");
        var sFileList = "";             // 첨부 컨트롤에서 받은 파일 정보 (Test1.pdf:186199:NEW;Test2.pdf:270495:NEW;Test3.pdf:269017:NEW;)
        var bFileinfoDirty = false;     // 첨부 변경 여부

        if (document.getElementById("CoviUpload") != null) {        // CoviFileTrans 인 경우
            sFileList = document.getElementById("CoviUpload").GetFilesList();
        }
        else if (document.getElementById("m_divAttach") != null) {  //모바일 전용 업로드 사용
            var sNewFile = CFN_GetCtrlById("hidFileSize").value;
            var aFile = new Array();
            aFile = sNewFile.split('|');
            for (var i = 0; i < aFile.length - 1; i++) {    // 마지막 구분자 이후 제외

                var aItem = aFile[i].split(":");
                var sFileName = aItem[0];
                var sFileSize = aItem[1];

                sFileList += sFileName + ":" + sFileSize + ":NEW|";
            }
        }
        else {        // .NET 기본 업로드
            var sDeleteFront = CFN_GetCtrlById("hidDeleteFront").value;  // 삭제 파일 (Front)
            var sDeleteFile = CFN_GetCtrlById("hidDeleteFile").value;    // 삭제 파일 (Back)
            var sNewFile = CFN_GetCtrlById("hidFileSize").value;         // 추가 파일(최종 업로드한 파일-여러번 업로드할 경우.)

            // Back 에서 삭제한 것은 DEL 마크 한다.
            // Test2.pdf : 270495,
            if (sDeleteFile != "") {
                var aFile = new Array();

                //[2015-08-12 modi kh] 첨부파일명에 window 허용 문자 가능하도록 되어 구분자 변경
                //aFile = sDeleteFile.split(','); // 구분자 변경 확인 ( ; -> ,) (2013-12-11 leesh) // D:\No1\WebSite\Common\ExControls\None\FileUploadBasic_approval.js 의 DeleteFile 에서 구분자로 , 로 사용됨. 추후 구분자 변경 예졍
                aFile = sDeleteFile.split('|');

                for (var i = 0; i < aFile.length - 1; i++) { // 마지막 구분자 이후 제외
                    var aItem = aFile[i].split(":");
                    var sFileName = aItem[0];
                    var sFileSize = aItem[1];

                    sFileList += sFileName + ":" + sFileSize + ":DEL|";
                }
            }

            // 새파일은 추가(NEW) 한다.
            //Test1.pdf | pdf | 186199 | /20131218/iqxshk1zgp5b3mlah1k0m5sx/file/dd50984c-1c89-40a1-b548-b3e72e7d541b/Test1.pdf;
            //Test2.pdf | pdf | 270495 | /20131218/iqxshk1zgp5b3mlah1k0m5sx/file/dd50984c-1c89-40a1-b548-b3e72e7d541b/Test2.pdf;
            if (sNewFile != "") {
                var aFile = new Array();
                aFile = sNewFile.split('|');

                for (var i = 0; i < aFile.length - 1; i++) { // 마지막 구분자 이후 제외
                    var aItem = aFile[i].split(":");
                    var sFileName = aItem[0];
                    var sFileExt = aItem[1];
                    var sFileSize = aItem[2];
                    var sFilePath = aItem[3];

                    sFileList += sFileName + ":" + sFileSize + ":NEW|";
                }
            }

            // Front 에서 삭제한 것은 제거한다. (CANCLE 마크)
            // Test3.pdf,
            if (sDeleteFront != "") {
                var aFile = new Array();
                aFile = sDeleteFront.split('|');

                for (var i = 0; i < aFile.length - 1; i++) { // 마지막 구분자 이후 제외
                    var sFileName = aFile[i];

                    sFileList += sFileName + ":0:CANCLE|"; // 프론트 삭제는 CANCLE
                }
            }
        }

        if (sFileList != "") {  // 첨부 파일이 있다면.
            var strUserCode = getInfo("AppInfo.usid");
            var strUserName = getInfo("AppInfo.usnm").replace(/;/gi, "^");
            var strUserDeptName = getInfo("AppInfo.dpdn").replace(/;/gi, "^");

            if (document.getElementById("ATTACH_FILE_INFO").value == "") {
                oFileinfo = $.parseXML("<fileinfo></fileinfo>");
            }
            else {
                //미리 보기 등으로 fileinofs(업로드완료) 가 아닌 fileinfo(업로드요청) 값으로 이미 되어 있다면
                var fileinfo = /\<fileinfos\>(.*)\<\/fileinfos\>/.exec(document.getElementById("ATTACH_FILE_INFO").value);

                if (document.getElementById("ATTACH_FILE_INFO").value.indexOf("<fileinfos>") > -1 && fileinfo != null) {
                    var sfileinfos = fileinfo[1];

                    oFileinfo = $.parseXML(sfileinfos);
                }
                else {
                    oFileinfo = $.parseXML(document.getElementById("ATTACH_FILE_INFO").value);
                }
            }

            // CoviFileTrans 인 경우 NEW 항목을 초기화 하고 다시 등록한다.
            if (document.getElementById("CoviUpload") != null) {
                $(oFileinfo).find("file[state='NEW']").remove();
            }

            aFiles = sFileList.split('|');

            for (var i = 0; i < aFiles.length - 1; i++) {
                var aItem = new Array();
                aItem = aFiles[i].split(':');

                var sFileName = aItem[0];
                var sFileSize = aItem[1];
                var sFileState = aItem[2];
                var sLocation = strStorage + sFileName;

                switch (sFileState) {

                    case "DEL": // BACK 에서 삭제된 것
                        $(oFileinfo).find("file").each(function (i, elm) {   //위구문 주석처리후 루프문으로 변경 (2014-07-22 HIW)
                            if ($(elm).attr("state") == "OLD" && $(elm).attr("name") == sFileName) {
                                $(elm).remove();

                                bFileinfoDirty = true;
                            }
                        });

                        break;

                    case "NEW": // 추가 NEW
                        // 기존 노드에 없다면 노드 추가
                        var vIsSameFile = "";

                        $(oFileinfo).find("file").each(function (idx, elm) {
                            if ($(elm).attr("name") == sFileName) {
                                vIsSameFile = "Y";

                                // [2015-01-16 add]편집모드에서 같은 이름의 파일을 삭제하고 다시올리면 올라가지 않는 오류
                                for (var i = 0; i < aFiles.length - 1; i++) {
                                    if (aFiles[i].split(':')[0] == sFileName && aFiles[i].split(':')[2] == "DEL") {
                                        vIsSameFile = "";
                                    }
                                }
                            }
                        });

                        if (vIsSameFile != "Y") {
                            var oFile = oFileinfo.createElement("file");
                            oFile.setAttribute("name", sFileName);
                            oFile.setAttribute("storageid", "1");
                            oFile.setAttribute("id", sFileName);
                            oFile.setAttribute("location", sLocation);
                            oFile.setAttribute("user_name", strUserName);
                            oFile.setAttribute("dept_name", strUserDeptName);
                            oFile.setAttribute("size", sFileSize);
                            oFile.setAttribute("state", "NEW");

                            //크로스브라우징위해 위구문 주석처리하고 아래구문으로 대체 (2014-03-25 HIW)
                            if (CFN_XmlToString(oFileinfo).indexOf("<fileinfos>") > -1) {   //<fileinfos>가 있으면 업로드완료된 상태, 없으면 업로드요청 상태
                                $(oFileinfo).find("fileinfo").append(oFile);
                            }
                            else {
                                oFileinfo.documentElement.appendChild(oFile);
                            }

                            bFileinfoDirty = true;
                        }

                        break;

                    case "CANCLE": // FRONT 에서 삭제된 것 (CoviFlieTrans 에는 없는 항목)
                        $(oFileinfo).find("file[state='NEW'][name='" + sFileName + "']").remove();
                        bFileinfoDirty = true;

                        break;
                }
            }
        }   //if (sFileList != "") {  // 첨부 파일이 있다면.
        else {  //첨부파일 없으면 root만 리턴 빈값 리턴하면 목록 그리지 않으니까...(S-OIL)
            retFileinfo = "<fileinfo></fileinfo>";
        }

        if (bFileinfoDirty) {   // 변경사항이 있었다면 xml 리턴하고, 없다면 "" 리턴
            retFileinfo = CFN_XmlToString(oFileinfo);
        }

        // [2014-10-22 add] 마지막 1개 파일이 삭제가 되지 않아 수정
        if (document.getElementById("CoviUpload") == null) { // .NET 기본 컨트롤
            if ((retFileinfo == "<fileinfo/>" || retFileinfo == "<fileinfo></fileinfo>") && (sDeleteFront == "" && sDeleteFile == "")) {
                retFileinfo = "";
            }
        }
    }
    catch (ex) {
        throw ex
    }

    return retFileinfo;
}


function getListXML_UX_Basic() {
    /// <summary>
    /// .net 기본 업로드 후 호출되는 함수
    /// &#10; (addDictionary, setAttInfo 호출)
    /// </summary>

    // Dictionary 사용안함.
    //var nowFile = new Array();
    //nowFile = CFN_GetCtrlById("hidFileSize").value.split(':');
    //for (var j = 0; j < nowFile.length - 1; j++) {
    //    var aryNow = new Array();
    //    aryNow = nowFile[j].split('|');
    //    addDictionary(aryNow[0], strStorage + aryNow[0], aryNow[2], 'NEW', getInfo("AppInfo.usnm").replace(/;/gi, "^"), getInfo("AppInfo.dpdn").replace(/;/gi, "^"));
    //}

    setAttInfo();
}

function clearDeleteFront() {
    /// <summary>
    /// Non ActiceX 에서 파일 추가, 삭제, 재추가시 첨부가 사라지는 문제점 해결
    /// &#10; ( hidDeleteFront 컨트롤에서 값이 남아 있어서 문제가 됨. )
    /// &#10; 값을 초기화 하여 조치. (2013-12-18 leesh)
    /// </summary>

    // ActiceX 인 경우에 첨부 UI 를 바로 업데이트 하지 않는다.(추가할때도 바로 업데이트가 안되므로 일관성 유지)
    if (document.getElementById("CoviUpload") == null) {
        //setAttInfo();	// [2015-09-30 modi] 무조건 기안/임시저장/승인 등 저장행위시에만 UI에 추가되도록 수정
    }

    CFN_GetCtrlById("hidDeleteFront").value = "";
}


function getFormInfoExtAttachXML() {
    if (document.getElementById("ATTACH_FILE_INFO").value != "") {
        var r, res;
        var s = document.getElementById("ATTACH_FILE_INFO").value;
        res = /^^^/i;
        attFiles = s.replace(res, "");
        var szAttFileInfo = "";
        var m_oFileList = $.parseXML(attFiles);
        var slocation;
        $(m_oFileList).find("fileinfo > file").each(function (i, elm) {
            slocation = $(elm).attr("location");
            szAttFileInfo += makeNode("path", getInfo("BaseConfig.attpath") + slocation.substring(slocation.toUpperCase().indexOf("ATTACH") + 7).replace("/", "\\"));
        });
        return szAttFileInfo;
    } else { return ""; }
}



function attFile() {//DEXTUploadX
    var aAttFile = document.getElementById("ATTACH_FILE_INFO").value.split("^^^");
    var sAttFile = aAttFile[m_ibIdx];
    var attach = (sAttFile != null) ? sAttFile.replace("%", "%25").replace("&", "%26").replace("#", "%23").replace("+", "%2B") : "";
    makeDictionary(document.getElementById("ATTACH_FILE_INFO").value);

    var szPath = "../FileAttach/fileuploadX.aspx";
    var rgParams = null;
    rgParams = new Array();
    rgParams["objMessage"] = window;

    var szFont = "FONT-FAMILY: 'gulim';font-size:9px;";
    var nWidth = 400;
    var nHeight = 300;

    CFN_OpenWindow(szPath, "fileattach", 390, 250, "fix"); //2007.03.29
}

function attFile2() {
    /// <summary>
    /// ATTACH_FILE_INFO 에서 hidOldFile 정보 가져오기.(로딩시 1회만 호출)
    /// </summary>

    var strphygicalName = "";
    var strlocation = "";
    var strINIListFiles = "";
    var strINIList = "";

    var strURL = "";

    if (document.getElementById("ATTACH_FILE_INFO").value != "") {
        var r, res;
        var s = document.getElementById("ATTACH_FILE_INFO").value;
        res = /^^^/i;
        attFiles = s.replace(res, "");

        var m_oFileList = $.parseXML(attFiles);
        $(m_oFileList).find("file").each(function (i, elm) {
            var tmplocation = $(elm).attr("location");
            strlocation += tmplocation.substring(0, tmplocation.lastIndexOf("/") + 1);
            strlocation += ":" + $(elm).attr("name") + "|";

            //20120207 by ssuby .net 기본 Upload Control 사용에 따른 파일확장자, 경로 정보 추가
            var filename = $(elm).attr("name");
            var fileurl = $(elm).attr("location");
            filename = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
            // fileurl = fileurl.replace("http://" + _HostName + "/GWStorage", "");
            fileurl = fileurl.replace(document.location.protocol + "//" + _HostName + "/GWStorage", "");
            //20120207 by ssuby .net 기본 Upload Control 사용에 따른 파일확장자, 경로 정보 추가

            strINIListFiles = strINIListFiles + $(elm).attr("location").substring($(elm).attr("location").lastIndexOf("/") + 1, $(elm).attr("location").length) + ":" + $(elm).attr("size") + ":" + $(elm).attr("user_name") + ":" + $(elm).attr("dept_name") + "|";
            //strINIList = strINIList + $(elm).attr("name") + ":" + $(elm).attr("size") + ":" + $(elm).attr("user_name") + ":" + $(elm).attr("dept_name") + ";";

            //20120207 by ssuby .net 기본 Upload Control 사용에 따른 파일확장자, 경로 정보 추가
            strINIList = strINIList + $(elm).attr("name") + ":" + $(elm).attr("size") + ":" + $(elm).attr("user_name") + ":" + $(elm).attr("dept_name") + ":" + filename + ":" + fileurl + "|";
        });
    }

    CFN_GetCtrlById("hidOldFile").value = strINIList;

}

//[HTML5 첨부 파일 컨트롤 적용]
function fnSlvTransIfIe(strURL, strINIListFiles) {
    //try {
    //    if (_ie) {//이민지(2010-05-28): IE 인 경우에는 CoviUpload 실행
    //        frAttachFiles.location = strURL;
    //    }
    //    else {//이민지(2010-05-28): 다른 브라우저인 경우에는 CoviSilverlightTrans 실행
    //        fnCoviSlvTransTmp(strINIListFiles);
    //    }
    //}
    //catch (e) {
    //}
}

//[HTML5 첨부 파일 컨트롤 적용]
function fnCoviSlvTransTmp(strINIListFiles) {//이민지(2010-04-14): CoviSilverlightTrans용 영역을 처리하는 함수를 추가함.

    //var nav = null;
    //var AgControl = null;
    //var version = "3.0.50106.0"; // The Silverlight version to test for
    //try {
    //    nav = navigator.plugins["Silverlight Plug-In"];
    //    AgControl = new ActiveXObject("AgControl.AgControl");
    //}
    //catch (e) {
    //}
    //if (nav == null && AgControl == null) {
    //    var sHtmS = 'DIV';
    //    var oDocS = top.frames[1].document;
    //    oDvS = oDocS.createElement(sHtmS);
    //    var oTmpS = oDocS.body.children[0];
    //    oDocS.body.insertBefore(oDvS, oTmpS);
    //    sHtmS = 'z-Index: 9999;';
    //    oDvS.style.cssText = sHtmS;
    //    sHtmS = '<object style="z-index:9999;"><a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration:none;"><img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style:none"></a></object>';
    //    oDvS.innerHTML = sHtmS;
    //    alert("Silverlight 로고를 클릭하여 플러그인을 먼저 설치한 후 재시도 해 주십시오.");
    //}
    //else {
    //    var sHtm = '';
    //    var oDv = null, oDoc = null, oTmp = null, sINIListFiles = '', iFrameWidth = '', sleft = '', iFrameHeight = '', stop = '', sSrc = '';
    //    var sHtm0 = '';
    //    var oDv0 = null, oDoc0 = null, oTmp0 = null, iFrameWidth0 = '', iFrameHeight0 = '';
    //    sSrc = '/WebSite/Approval/FileAttach/fileupload4Slv.aspx?mod=SlvTrans&INIListFiles=' + strINIListFiles + '&"';//alert(strINIListFiles);
    //    sgINIListFiles = strINIListFiles;//이민지(2011.01.10) :기존 파일의 쿼리스트링 전송으로 인해 인코딩 문제가 발생 - 수정위해 추가
    //    oDv = document.getElementById('dvSilverlightTransWrap');
    //    if (oDv != null) {//이미 레이어가 만들어져 있으면
    //        oDv.src = '';//해당 레이어를 재사용하고
    //        return;//함수를 탈출함.
    //    }

    //    iFrameWidth0 = this.document.body.scrollWidth - 38;
    //    iFrameHeight0 = this.parent.document.body.scrollHeight;
    //    oDoc0 = top.frames[1].document;
    //    sHtm0 = 'DIV';
    //    oDv0 = oDoc0.createElement(sHtm0);
    //    oTmp0 = oDoc0.body.children[0];
    //    oDoc0.body.insertBefore(oDv0, oTmp0);
    //    sHtm0 = 'position: absolute; left: 0px; top:0px; margin: 0px; padding: 0px; width:' + iFrameWidth0 + '; height: ' + iFrameHeight0 + '; z-Index: 998; backgroundColor:#FFFFFF;  filter:alpha(opacity=1);';
    //    oDv0.style.cssText = sHtm0;
    //    sHtm0 = '<iframe frameborder="0" noframe src="/WebSite/Approval/FileAttach/ApprovalSlvTrans.htm" width="' + iFrameWidth0 + 'px" height="' + iFrameHeight0 + 'px" onclick="javascript:fnCOPMSlvWarn();" style="border: none; margin: 0px; padding: 0px; width: ' + iFrameWidth0 + '; height: ' + iFrameHeight0 + 'px;"></iframe>';
    //    oDv0.id = 'dvSilverlightTransWrapWrap';
    //    oDv0.innerHTML = sHtm0;

    //    iFrameWidth = this.document.body.offsetWidth;
    //    iFrameHeight = this.parent.document.body.scrollHeight;
    //    sleft = (iFrameWidth - 568) / 2;
    //    stop = (iFrameHeight - 344) / 2;
    //    oDoc = top.frames[1].document;
    //    sHtm = 'DIV';
    //    oDv = oDoc.createElement(sHtm);
    //    oTmp = oDoc.body.children[0];
    //    oDoc.body.insertBefore(oDv, oTmp);
    //    //sHtm = 'position: absolute; left:'+sleft+'; top:' + stop + '; margin: 0px; padding: 0px; width: 790px; height: 500px; z-Index: 999;';
    //    sHtm = 'position: absolute; left:' + sleft + '; top:' + stop + '; margin: 0px; padding: 0px; width: 583px; height: 353px; z-Index: 999;';
    //    oDv.style.cssText = sHtm;
    //    sINIListFiles = escape(strINIListFiles);
    //    sHtm = '<iframe frameborder="0" noframe src="' + sSrc + '" allowTransparency="true" style="border: none; margin: 0px; padding: 0px; width: 100%; height: 100%;"></iframe>';
    //    oDv.id = 'dvSilverlightTransWrap'
    //    oDv.innerHTML = sHtm;//alert(sHtm);
    //}
}

function attFile3() {
    var aAttFile = document.getElementById("ATTACH_FILE_INFO").value.split("^^^");
    var sAttFile = aAttFile[m_ibIdx];
    var attach = (sAttFile != null) ? sAttFile.replace("%", "%25").replace("&", "%26").replace("#", "%23").replace("+", "%2B") : "";
    makeDictionary(document.getElementById("ATTACH_FILE_INFO").value);

    var szPath = "../FileAttach/fileupload4Net.aspx";
    var rgParams = null;
    rgParams = new Array();
    rgParams["objMessage"] = window;

    var szFont = "FONT-FAMILY: 'gulim';font-size:9px;";
    var nWidth = 400;
    var nHeight = 300;

    CFN_OpenWindow(szPath, "fileattach", 390, 250, "fix"); //2007.03.29
}

// Dictionary 사용안함. 
//function addDictionary(strKey, fileInfo, filesize, filestate, username, deptname) {
//	var key = strKey;
//	if(key.indexOf("attachEvent") > -1){
//	}else{
//	    if (dicFileInfo.Exists(key) == false) {	
//	        dicFileInfo.Add(key, fileInfo); 
//	        dicFileInfoSize.Add(key, filesize);
//	        dicFileInfoState.Add(key, (filestate == null ? "OLD" : filestate)); 
//	        dicFileInfoUserName.Add(key, username); 
//	        dicFileInfoDeptName.Add(key, deptname); 
//	    }
//	}
//}


function receiveFileHTTP(sMethod, sURL, sText) {
    CFN_CallAjax(sURL, sText, function (xmlReturn) {
        var errorNode = $(xmlReturn).find("response > error");
        if ($(errorNode).length > 0) {
            throw new Error(-1, $(errorNode).text());
        } else {
            var sFileInfo = "";
            if ($(xmlReturn).find("response > fileinfos").length > 0) {
                sFileInfo = CFN_XmlToString($(xmlReturn).find("response > fileinfos")[0]);
            }
            switch (getInfo("Request.mode")) {
                case "ADMIN":
                case "APPROVAL":
                case "DRAFT":
                case "TEMPSAVE":
                    //document.getElementById("ATTACH_FILE_INFO").value = $(xmlReturn).find("response > fileinfos")[0].xml;
                    document.getElementById("ATTACH_FILE_INFO").value = sFileInfo;
                    m_bFileSave = true;
                    break;
                case "RECAPPROVAL":
                case "PCONSULT":
                case "CHARGE":
                case "SUBAPPROVAL":
                case "REDRAFT":
                    document.getElementById("ATTACH_FILE_INFO").value = sFileInfo;
                    m_bFileSave = true;
                    break;
                case "TRANS": setFormInfoDictionary(xmlReturn.documentElement.childNodes);
                    break;
                case "SIGN":
                    break;
                case "ADMINEDMS": alert(gMessage204); //"결재문서 생성이 완료되었습니다."
                    if (m_bTabForm) { parent.closeFormbyForm(); } else { top.close(); }
                    //parent.refreshList();
                    break;
                case "COMPLETE":
                    alert(Common.getDic("msg_apv_117"));
                    break;
                default:
                    break;
            }
        }
    }, false, "xml");
}

//2013.12.26 메일보내기에 넘겨 줄 첨부파일 정보
function AttachFileBody(sFileinfo) {
    var oFileList, oFileinfo, oFileName, oFileExt;
    var oFileInfoList = "";
    oFileList = $.parseXML(sFileinfo);
    oFileinfo = $(oFileList).find("fileinfos");
    $(oFileinfo).find("fileinfo > file").each(function (i, elm) {
        oFileName = $(elm).attr("name");
        oFileExt = oFileName.split(".");
        oFileInfoList += oFileName + ":" + $(elm).attr("size") + ":" + $(elm).attr("state") + ":1:" + oFileExt[1] + ":" + $(elm).attr("location") + "|";
    });
    return oFileInfoList;
}

function XFN_FileUpload() {
    if (getInfo("Request.templatemode") == "Write") {
        if (false == ChkIsValidationCheck(false)) {
            alert(Common.getDic("msg_203"));

            return false;
        } else {
            setAttInfo();
        }
    }

    return true;
}

//[HTML5 첨부 파일 컨트롤 적용]
function XFN_FileSave() {
    if (Common.GetBaseConfig('FileAttachType') == '5' && typeof FileReader == 'function') {
        if (false == ChkIsValidationCheck(false)) {     //FrontStorage File Save
            alert(Common.getDic("msg_203"));
        }
        else {
            if (ChkIsValidationCheck_After()) {
                fn_FileSaveProcess();
            }
            else {
                alert(Common.getDic("msg_203"));
            }
        }
    }
    else {
        fn_FileSaveProcess();
    }
}

//[HTML5 첨부 파일 컨트롤 적용] - function XFN_FileSave() 분리
function fn_FileSaveProcess() {
    if (document.getElementById("ATTACH_FILE_INFO").value != '' && '<fileinfo></fileinfo>' != document.getElementById("ATTACH_FILE_INFO").value) {      //첨부파일 존재시 수행
        if (document.getElementById("ATTACH_FILE_INFO").value.indexOf("</fileinfos>") == -1 && document.getElementById("ATTACH_FILE_INFO").value.indexOf("<fileinfo />") == -1) {
            m_bFileSave = false;

            //[2014-12-03 modi] 버전별 파라미터 수정
            if ((_ieVer == "7" || _ieVer == "8") && document.getElementById("ATTACH_FILE_INFO").value.indexOf("</fileinfos>") != -1) {
                try {
                    var sFiles = "<request>";
                    sFiles += document.getElementById("ATTACH_FILE_INFO").value;
                    sFiles += "<fiid>" + getInfo("FormInstanceInfo.FormInstID") + "</fiid>";
                    sFiles += "<fmpf>" + getInfo("FormInfo.FormPrefix") + "</fmpf>";
                    sFiles += "</request>";
                    evalXML(sFiles);

                    var sURL = "/WebSite/Approval/FileAttach/fnMoveFilegetFileInfo.aspx";
                    receiveFileHTTP("POST", sURL, sFiles);
                }
                catch (e) {
                    disableBtns(false);
                }
            }
            else if (document.getElementById("ATTACH_FILE_INFO").value.indexOf("</fileinfos>") == -1) {
                try {
                    var sFiles = "<request>";
                    sFiles += "<fileinfos>" + document.getElementById("ATTACH_FILE_INFO").value + "</fileinfos>";
                    sFiles += "<fiid>" + getInfo("FormInstanceInfo.FormInstID") + "</fiid>";
                    sFiles += "<fmpf>" + getInfo("FormInfo.FormPrefix") + "</fmpf>";
                    sFiles += "</request>";
                    evalXML(sFiles);

                    var sURL = "/WebSite/Approval/FileAttach/fnMoveFilegetFileInfo.aspx";
                    receiveFileHTTP("POST", sURL, sFiles);
                } catch (e) {
                    disableBtns(false);
                }
            }
            else {
                m_bFileSave = true;
            }
        }
        else {
            m_bFileSave = true;
        }
    }
    //경비결재 첨부파일 처리
    if (typeof fn_FileSaveProcessEvidence == "function" ) {
        fn_FileSaveProcessEvidence();
    }
}

function XFN_GetFileExt() {
    var l_ReturnExt = "";
    if (document.getElementById("ATTACH_FILE_INFO").value != "") {
        var r, res;
        var s = document.getElementById("ATTACH_FILE_INFO").value;
        res = /^^^/i;
        attFiles = s.replace(res, "");
        var fState;
        var m_oFileList;
        if (attFiles.indexOf("</fileinfos>") < 0) {
            m_oFileList = $.parseXML("<fileinfos>" + attFiles + "</fileinfos>");
        } else {
            m_oFileList = $.parseXML(attFiles);
        }
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = m_oFileList.documentElement;
        var elmList = $(elmRoot).find("fileinfo > file");
        var l_ext = "";
        $(elmRoot).find("fileinfo > file").each(function (i, elm) {
            var filename = $(elm).attr("name");
            l_ext += "|" + filename.substring(filename.lastIndexOf('.') + 1, filename.length);
        });
        if (l_ext.length > 0) l_ext = l_ext.substring(1, l_ext.length); // 맨앞 ; 빼기
        if (l_ext.indexOf("|") > -1) { l_ReturnExt = "multifile"; } else { l_ReturnExt = l_ext; }
    }
    return l_ReturnExt;
}

function G_displaySpnAttInfo(bRead) {//수정본
    var attFiles, fileLoc, szAttFileInfo;
    var displayFileName;
    var re = /_N_/g;
    var bReadOnly = false;
    if (bRead != null) bReadOnly = bRead;
    // 편집 모드인지 확인
    var bEdit = false;
    //	if(String(window.location).indexOf("_read.htm") > -1){
    //	    bEdit = false
    //	}else{
    //	    bEdit = true;
    //	}
    szAttFileInfo = "";
    MultiDownLoadString = "";

    if (document.getElementById("ATTACH_FILE_INFO").value != "") {

        //alert(document.getElementById("ATTACH_FILE_INFO").value);

        var r, res;
        var s = document.getElementById("ATTACH_FILE_INFO").value;
        res = /^^^/i;
        attFiles = s.replace(res, "");
        var fState;
        var m_oFileList;
        if (attFiles.indexOf("</fileinfos>") < 0) {
            m_oFileList = $.parseXML("<fileinfos>" + attFiles + "</fileinfos>");
        } else {
            m_oFileList = $.parseXML(attFiles);
        }
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = m_oFileList.documentElement;
        if (elmRoot != null) {
            szAttFileInfo = "";
            elmList = $(elmRoot).find("fileinfo > file");
            $(elmRoot).find("fileinfo > file").each(function (i, elm) {
                var filename = $(elm).attr("name");
                var filesize = $(elm).attr("size");
                var limitSize = (filesize == null) ? "0" : (parseInt(filesize) / 1024);
                displayFileName = $(elm).attr("name").substring(0, $(elm).attr("name").lastIndexOf("."));
                displayFileName = displayFileName.replace(re, "&");
                if ($(elm).attr("state") != null) {
                    fState = $(elm).attr("state");
                }
                else {
                    fState = "";
                }

                if (bEdit) {
                    szAttFileInfo += '<input type=\"checkbox\" id=\"chkFile\" name=\"chkFile\" value=\"' + $(elm).attr("name") + '\" style=\"vertical-align:middle;\">';
                } else {//편집모드가 아닐때만 다중다운로드 문자열 생성
                    //[2015-07-22 modi kh] CoviFileTrans string format
                    MultiDownLoadString += $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B")
			                                + "|" + $(elm).attr("name").replace(new RegExp("\\+", "g"), "%2B")
			                                + "|" + filesize
                                            + "*";
                    //+ "`";
                }

                //////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////
                if ($(elm).attr("location").indexOf(".") > -1) {
                    if (bReadOnly) {
                        //szAttFileInfo +=  displayFileName;
                        if (bReadOnly == "display") {//이민지(2010-05-06): 파일 용량을 MB 이상도 표현하기 위해 수정
                            if (limitSize >= 1024) {
                                limitSize = limitSize / 1024;
                                limitSize = parseFloat(limitSize).toFixed(3);
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                szAttFileInfo += "<b>" + $(elm).attr("name") + " (" + limitSize + "MB)" + "</b>&nbsp;";
                            }
                            else {
                                szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                szAttFileInfo += "<b>" + $(elm).attr("name") + " (" + limitSize + "KB)" + "</b>&nbsp;";
                            }
                        }
                        else {
                            szAttFileInfo += displayFileName;
                        }
                    }
                    else {
                        if (getInfo("Request.loct") == "TEMPSAVE" || getInfo("Request.mode") == "ADMINEDMS") //2006.10
                        {
                            if (navigator.userAgent.toString().toUpperCase().indexOf("ANDROID", 0) > -1 || navigator.userAgent.toString().toUpperCase().indexOf("IPHONE", 0) > -1 || navigator.userAgent.toString().toUpperCase().indexOf("IPAD", 0) > -1) {
                                try {
                                    if (Common.GetBaseConfig('MobileUseDocConverter') == "Y") {
                                        var Size = 0;
                                        if (limitSize >= 1024) {
                                            Size = limitSize / 1024;
                                            Size = parseFloat(Size).toFixed(3);
                                        }
                                        var strURL = ("http://" + Common.GetAppConfig("SiteName_Mobile") + $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B"));
                                        var strConvertURL = Common.GetBaseConfig("MobileDocConverterURL") + "?url=" + strURL;

                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                        + "<a href=\"#\" onclick=\"window.open('" + strConvertURL + "','window','');return false;\"  >" + $(elm).attr("name");
                                        if (limitSize > 0) {
                                            if (limitSize >= 1024)
                                                szAttFileInfo += " (" + Size + "MB)" + "</a></p>";
                                            else
                                                szAttFileInfo += " (" + parseFloat(limitSize).toFixed(3) + "KB)";

                                        }
                                        szAttFileInfo += "</a></p>"
                                    }
                                    else {
                                        if (limitSize >= 1024) {
                                            limitSize = limitSize / 1024;
                                            limitSize = parseFloat(limitSize).toFixed(3);
                                            szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                        + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name")
                                        + " (" + limitSize + "MB)" + "</a></p>";
                                        }
                                        else {
                                            szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                        + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name");
                                            if (limitSize > 0) {
                                                szAttFileInfo += " (" + parseFloat(limitSize).toFixed(3) + "KB)";
                                            }
                                            szAttFileInfo += "</a></p>"
                                        }
                                    }
                                } catch (e) { }
                            }
                            else {
                                if (limitSize >= 1024) {
                                    limitSize = limitSize / 1024;
                                    limitSize = parseFloat(limitSize).toFixed(3);
                                    szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                    + "<a href=\"javascript:PopListSingleForm(\'" + String(i) + "\');\"  >" + $(elm).attr("name")
                                    + " (" + limitSize + "MB)" + "</a></p>";
                                }
                                else {
                                    szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                    + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name")
                                    + " (" + parseFloat(limitSize).toFixed(3) + "KB)" + "</a></p>";
                                }
                                gFileArray[i] = $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B"); // +":" + filesize;
                                gFileNameArray[i] = $(elm).attr("name");
                            }
                        }
                        else {
                            if (fState == "" || fState == "OLD") {
                                //2013.11.13 미리보기 화면 첨부파일 보이게 분기 추가(a태그삭제)
                                if (getInfo("Request.readtype") == "preview") {
                                    if (limitSize >= 1024) {
                                        limitSize = limitSize / 1024;
                                        limitSize = parseFloat(limitSize).toFixed(3);
                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									    + $(elm).attr("name")
									    + " (" + limitSize + "MB)" + "</p>";
                                    }
                                    else {
                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                        + $(elm).attr("name");
                                        if (limitSize > 0) {
                                            szAttFileInfo += " (" + parseFloat(limitSize).toFixed(3) + "KB)";
                                        }
                                        szAttFileInfo += "</p>";
                                    }
                                } else {
                                    /*
                                    * 안드로이드 또는 IOS에서 첨부파일 다운로드시 URL 호출 방식 변경
                                    * Date : 2015-10-25 
                                    * Written By yjyoo
                                    */
                                    if (navigator.userAgent.toString().toUpperCase().indexOf("ANDROID", 0) > -1 || navigator.userAgent.toString().toUpperCase().indexOf("IPHONE", 0) > -1 || navigator.userAgent.toString().toUpperCase().indexOf("IPAD", 0) > -1) {
                                        try {
                                            if (Common.GetBaseConfig('MobileUseDocConverter') == "Y") {
                                                var Size = 0;
                                                if (limitSize >= 1024) {
                                                    Size = limitSize / 1024;
                                                    Size = parseFloat(Size).toFixed(3);
                                                }
                                                var strURL = ("http://" + Common.GetAppConfig("SiteName_Mobile") + $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B"));
                                                var strConvertURL = Common.GetBaseConfig("MobileDocConverterURL") + "?url=" + strURL;

                                                szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                                + "<a href=\"#\" onclick=\"window.open('" + strConvertURL + "','window','');return false;\"  >" + $(elm).attr("name");
                                                if (limitSize > 0) {
                                                    if (limitSize >= 1024)
                                                        szAttFileInfo += " (" + Size + "MB)" + "</a></p>";
                                                    else
                                                        szAttFileInfo += " (" + parseFloat(limitSize).toFixed(3) + "KB)";

                                                }
                                                szAttFileInfo += "</a></p>"

                                                //szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                                //+ "<a href=\"javascript:window.HybridApp.FlDn('" + document.location.protocol + "//" + Common.GetBaseConfig('WebServerDomain') + $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B") + "','" + filename.substring(filename.lastIndexOf('.') + 1, filename.length) + "');\"  >" + $(elm).attr("name")
                                                //+ " (" + limitSize + "MB)" + "</a></p>";
                                            }
                                            else {
                                                if (limitSize >= 1024) {
                                                    limitSize = limitSize / 1024;
                                                    limitSize = parseFloat(limitSize).toFixed(3);
                                                    szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                                + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name")
                                                + " (" + limitSize + "MB)" + "</a></p>";
                                                }
                                                else {
                                                    szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                                + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name");
                                                    if (limitSize > 0) {
                                                        szAttFileInfo += " (" + parseFloat(limitSize).toFixed(3) + "KB)";
                                                    }
                                                    szAttFileInfo += "</a></p>"
                                                }
                                            }
                                        } catch (e) { }
                                    }
                                    else {

                                        if (limitSize >= 1024) {
                                            limitSize = limitSize / 1024;
                                            limitSize = parseFloat(limitSize).toFixed(3);
                                            szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                        + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name")
                                        + " (" + limitSize + "MB)" + "</a></p>";
                                        }
                                        else {
                                            szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
                                        + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name");
                                            if (limitSize > 0) {
                                                szAttFileInfo += " (" + parseFloat(limitSize).toFixed(3) + "KB)";
                                            }
                                            szAttFileInfo += "</a></p>"
                                        }
                                    }
                                } //분기 종료
                                gFileArray[i] = $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B"); // +":" + filesize;
                                gFileNameArray[i] = $(elm).attr("name");
                            }
                            else if (fState == "NEW") {
                                //2013.11.13 미리보기 화면 첨부파일 보이게 분기 추가(a태그삭제)
                                if (getInfo("Request.readtype") == "preview") {
                                    if (limitSize >= 1024) {
                                        limitSize = limitSize / 1024;
                                        limitSize = parseFloat(limitSize).toFixed(3);
                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									    + $(elm).attr("name")
									    + " (" + limitSize + "MB)" + "</p>";
                                    }
                                    else {
                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									    + $(elm).attr("name")
									    + " (" + parseFloat(limitSize).toFixed(3) + "KB)" + "</p>"; //TARGET=\"_blank\"
                                    }
                                } else {
                                    if (limitSize >= 1024) {
                                        limitSize = limitSize / 1024;
                                        limitSize = parseFloat(limitSize).toFixed(3);
                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									    + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name")
									    + " (" + limitSize + "MB)" + "</a></p>";
                                    }
                                    else {
                                        szAttFileInfo += "<p style='padding-bottom:2pt;'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length))
									    + "<a href=\"javascript:PopListSingleForm('" + String(i) + "');\"  >" + $(elm).attr("name")
									    + " (" + parseFloat(limitSize).toFixed(3) + "KB)" + "</a></p>"; //TARGET=\"_blank\"
                                    }
                                } //분기 종료
                                gFileArray[i] = $(elm).attr("location").replace(new RegExp("\\+", "g"), "%2B"); // +":" + filesize;
                                gFileNameArray[i] = $(elm).attr("name");
                            }
                            else {//삭제일경우
                                szAttFileInfo += "";
                                gFileArray[i] = "";
                                gFileNameArray[i] = "";
                            }
                        }
                    }
                }
                else {
                    if (limitSize >= 1024) {
                        limitSize = limitSize / 1024;
                        limitSize = parseFloat(limitSize).toFixed(3);
                        // 2012.11.20 myungwan.jin@samyang.com 첨부파일 Download Page 변경
                        //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"" + m_KMWebAttURL + $(elm).attr("location") + "\" target = \"_blank\" ><b>" + $(elm).attr("name") + " (" + limitSize + " MB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                        szAttFileInfo += "<span style='cursor:pointer;' onclick='attFileDownLoad(\"" + getInfo("FormInstanceInfo.DocLevel") + "\", \"" + $(elm).attr("location") + "\", \"" + $(elm).attr("name") + "\");'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<b>" + $(elm).attr("name") + " (" + limitSize + " MB)" + "</b></span><br/>"; //TARGET=\"_blank\"
                    }
                    else {
                        limitSize = parseFloat(limitSize).toFixed(2); // 2012.11.16 myungwan.jin@samyang.com KB 표시할 때, 소수점 둘째자리까지 표기하도록 추가
                        // 2012.11.20 myungwan.jin@samyang.com 첨부파일 Download Page 변경
                        //szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<a href=\"" + m_KMWebAttURL + $(elm).attr("location") + "\" target = \"_blank\" ><b>" + $(elm).attr("name") + " (" + limitSize + "KB)" + "</b></a>&nbsp;"; //TARGET=\"_blank\"
                        szAttFileInfo += "<span style='cursor:pointer;' onclick='attFileDownLoad(\"" + getInfo("FormInstanceInfo.DocLevel") + "\", \"" + $(elm).attr("location") + "\", \"" + $(elm).attr("name") + "\");'>" + getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;<b>" + $(elm).attr("name") + " (" + limitSize + " KB)" + "</b></span><br/>"; //TARGET=\"_blank\"
                    }
                }
                //////////////////////////////////////////////////////////////////////////////

                //   2012-01-13 by ssuby 첨부파일 구분자 ','가 들어가 파일 간격이 너무 벌어져 주석 처리
                //                if (i < elmList.length - 1)
                //                    szAttFileInfo += ", ";
            }
			);
            //2006.12.05 by wolf upload UI 변경
            // 편집 모드인지 확인해서 편집모드이면 삭제버튼 display
            // 첨부 UI 공통 사용으로 아래 소스 삭제
            //if (bEdit) {
            //    if (document.getElementById("ATTACH_FILE_INFO").value != "") {
            //        m_oFormMenu.makeDictionary(document.getElementById("ATTACH_FILE_INFO").value);
            //        szAttFileInfo += "<a href='javascript:deleteitemFile();'><img src='/GWImages/Common/attachicon/del.gif' border='0' style='vertical-align:middle;' /></a>";
            //    }
            //}
        }
        //debugger;
        if (MultiDownLoadString != "") {
            //multi download 작업시 제거 20111212
            if (bReadOnly == "display") {
                document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = "첨부파일";
            } else {
                if (window.ActiveXObject === undefined) {
                } else {
                    if (m_oFormMenu.gFileAttachType == "1") { //시스템 사용 첨부파일 컴포턴트 0 : CoviFileTrans, 1:DEXTUploadX
                        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = "<a href='javascript:DownloadDEXTUpload(window);'>첨부파일<img src='/Images/images/Board/data_disks.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
                    } else {
                        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = "<a href='javascript:DownloadCOVIUpload();' style='font-weight:bold;'>" + Common.getDic("lbl_apv_AddFile") + "<img src='/Images/images/Board/data_disks.gif' width='12' height='13' hspace='7' align='absmiddle'  border='0' /></a>";
                    }
                }
            }
        }
        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        if (parent.frames.document.getElementById("fileview") != null) {
            parent.frames.document.getElementById("fileview").document.getElementById("AttFileInfo").innerHTML = document.getElementById("AttFileInfo").innerHTML; parent.frames.document.getElementById("fileview").setMultiDownLoad(MultiDownLoadString);
        }
    } else {

        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        if (parent.frames.document.getElementById("fileview") != null) {
            parent.frames.document.getElementById("fileview").document.getElementById("AttFileInfo").innerHTML = document.getElementById("AttFileInfo").innerHTML; parent.frames.document.getElementById("fileview").setMultiDownLoad(MultiDownLoadString);
        }
    }
    if (window.ActiveXObject === undefined) document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = m_oFormMenu.gLabel_AttachList;

    if ($("#div_filePreview").length > 0) {
        if (gFileArray.length > 0) {
            //첨부파일 미리보기 만들기
            $("#div_filePreview").show();
            for (var i = 0 ; i < gFileArray.length ; i++) {
                //이미지 및 pdf만 표시

                var filename = gFileNameArray[i];
                switch (filename.substring(filename.lastIndexOf('.') + 1, filename.length).toLowerCase()) {
                    case "jpg":
                    case "jpeg":
                    case "jpe":
                    case "jfif":
                    case "gif":
                    case "tif":
                    case "tiff":
                    case "png":
                    case "ico":
                    case "bmp":
                    case "dib":
                    case "html":
                    case "htm":
                        $('<iframe>', {
                            src: gFileArray[i],
                            id: 'fileview_img',
                            frameborder: 0,
                            scrolling: 'no',
                            style: "width:600px;height:100%;overflow-y:hidden;",
                            title: gFileNameArray[i],
                            onload: "resizeFilePreviewIframe(this)"
                        }).appendTo('#div_filePreview');
                        break;
                    case "pdf":
                        $('<iframe>', {
                            src: gFileArray[i],
                            id: 'fileview_pdf',                    
                            style: "width:720px;height:720px;",
                        }).appendTo('#div_filePreview');
                        break;
                }
            }
        }
    }
}
//파일미리보기 iframe onload이벤트에서 size 재조정
function resizeFilePreviewIframe(fr) {
    var height = $(fr.contentDocument).height();
    $(fr).height(height);
}
function PopListSingleForm(SingleDownLoadString) {
    //[2015-07-20 add kh] prevent XSS
    //PopListSingle_Approval(gFileNameArray[parseInt(SingleDownLoadString)], gFileArray[parseInt(SingleDownLoadString)].replace("http://" + _HostName, ""));
    PopListSingle_Approval(getInfo('fiid'), gFileArray[parseInt(SingleDownLoadString)].replace(document.location.protocol + "//" + _HostName, ""));
}

//Multi download - use CoviFileTransfer control
function DownloadCOVIUpload() {
    var winstyle = "height=360, width=275, status=no, resizable=no, help=no, scroll=no";
    var winpath = "/WebSite/Common/ExControls/FileDownload/FileDownloadCoviTrans_Approval.aspx";

    //[2015-07-20 modi kh] prevent XSS 
    //var path = winpath + "?FileInfo=" + escape(MultiDownLoadString);    //한글파일명 처리
    var path = winpath + "?fiid=" + getInfo('fiid');

    window.open(path, 'CoviDownLoad', winstyle);
}

function DownloadDEXTUpload(oWindows) {
    var winstyle = "dialogHeight:445px;dialogWidth:445px;status:no;resizable:no;help:no;scroll:no";
    var winpath = "/WebSite/Common/ExControls/FileDownload/FileDownloadCoviTrans_Approval.aspx";
    var rgParams = new Array();

    rgParams["oWin"] = oWindows;
    rgParams["oList"] = MultiDownLoadString;

    return oWindows.showModalDialog(winpath, rgParams, winstyle);
}

//첨부경로이미지 
function getAttachImage(image) {
    var imageurl = "";
    image = image.toLowerCase();
    if (image == "alz" || image == "asf" || image == "asp" || image == "avi" ||
        image == "bmp" || image == "cab" || image == "css" || image == "csv" ||
        image == "dll" || image == "doc" || image == "exe" ||
        image == "zip" || image == "doc" || image == "ppt" || image == "dll" ||
        image == "htm" || image == "html" || image == "inf" || image == "iso" ||
         image == "js" || image == "lzh" || image == "mid" ||
        image == "mp3" || image == "mpeg" || image == "mpg" || image == "pdf" ||
        image == "rar" || image == "reg" || image == "sys" || image == "txt" ||
        image == "htm" || image == "html" || image == "inf" || image == "iso" ||
        image == "vbs" || image == "wav" || image == "wma" || image == "wmv" ||
        image == "xls" || image == "xml" || image == "zip" || image == "xlsx"
        || image == "docx" || image == "pptx" || image == "hwp") {
        // imageurl = "<img src='http://" + _HostName + "/Images/Images/Board/data_" + image + ".gif'  class='img_align4' />";
        imageurl = "<img src='" + document.location.protocol + "//" + _HostName + "/Images/Images/Board/data_" + image + ".gif'  class='img_align4' />";
        //    }else if(image == "jpg" || image == "gif"  ){
        //        imageurl = "<img src='/Images/Images/Board/data_img.gif' style='vertical-align:middle;' />";
    }
    else {
        // imageurl = "<img src='http://" + _HostName + "/Images/Images/Board/data_disk.gif'  class='img_align4' />";
        imageurl = "<img src='" + document.location.protocol + "//" + _HostName + "/Images/Images/Board/data_disk.gif'  class='img_align4' />";
    }
    return imageurl;
}

// 첨부 UI 공통 사용으로 아래 함수 삭제
//function deleteitemFile() {
//    deleteitem();
//}

function G_displaySpnAttInfo_Mail() {//수정본
    var attFiles, fileLoc, szAttFileInfo;
    var displayFileName;
    var re = /_N_/g;

    szAttFileInfo = "";
    MultiDownLoadString = "";

    if (document.getElementById("ATTACH_FILE_INFO").value != "") {
        var r, res;
        var s = document.getElementById("ATTACH_FILE_INFO").value;
        res = /^^^/i;
        attFiles = s.replace(res, "");

        var fState;
        var m_oFileList = $.parseXML(attFiles);
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = $(m_oFileList).find("fileinfos");
        if (elmRoot.length > 0) {
            elmList = $(elmRoot).find("fileinfo > file");

            szAttFileInfo = "&nbsp;&nbsp;";

            $(elmRoot).find("fileinfo > file").each(function (i, elm) {
                var filename = $(elm).attr("name");
                var filesize = $(elm).attr("size");
                var limitSize = m_oFormMenu.FormatStringToNumber(parseInt(filesize) / 1024);

                displayFileName = $(elm).attr("name").substring(0, $(elm).attr("name").lastIndexOf("."));
                displayFileName = displayFileName.replace(re, "&");
                //////////////////////////////////////////////////////////////////////////////
                if (elm.getAttribute("location").indexOf(".") > -1) {
                    szAttFileInfo += getAttachImage(filename.substring(filename.lastIndexOf('.') + 1, filename.length)) + "&nbsp;" + elm.getAttribute("name") + "&nbsp;";
                }
                //////////////////////////////////////////////////////////////////////////////

                if (i < elmList.length - 1) szAttFileInfo += "| ";
            });
        }
        document.getElementById("AttFileInfo").innerHTML = szAttFileInfo;
        document.getElementById("AttFileInfo").parentNode.children[0].innerHTML = m_oFormMenu.gLabel_AttachList;
    }
}


/* 사용 안되는 함수
//첨부파일 읽기 확인시 사용
function makearray(n) {
this.length = n;
for (var i = 0; i < n; i++)
this[i] = 0;
return this;
}
//첨부파일 읽기 확인시 사용
function readcheck(i) { readCheck[i] = "1"; }

*/


//파일 다운로드 관련 함수 추가
//covidownload컴포넌트 관련
function downloadfile() {
    var szURL = "../FileAttach/download.aspx";
    var strphygicalName = "";
    var strlocation = ""
    //ATTACH_FILE_INFO에서 업로드 파일 정보를 가져온다

    if (document.all['ATTACH_FILE_INFO'].value != "") {
        var r, res;
        var s = document.all['ATTACH_FILE_INFO'].value;

        res = /^^^/i;
        attFiles = s.replace(res, "");
        var m_oFileList = $.parseXML(attFiles);
        var elmRoot, elmList, elm, elmTaskInfo;
        elmRoot = $(m_oFileList).find("fileinfos");
        if (elmRoot != null) {
            szAttFileInfo = "";
            $(elmRoot).find("fileinfo > file").each(function (i, elm) {
                if ($(elm).attr("location").indexOf("/FrontStorage/") == -1) {
                    if ($(elm).attr("state") != "DEL") {
                        strphygicalName = strphygicalName + $(elm).attr("location").substring($(elm).attr("location").lastIndexOf("/") + 1, $(elm).attr("location").length) + ":" + $(elm).attr("size") + "|";
                        strlocation = $(elm).attr("location").substring(0, $(elm).attr("location").lastIndexOf("/") + 1);
                    }
                }
            });
        }
    }
    //phygicalName 
    //파일명:사이즈; 
    szURL = szURL + "?phygicalName=" + escape(strphygicalName);
    //location
    //파일 업로드한 경로 backstorage
    //단 앞에 서버 명은 없음으로download.aspx 에서 처리한다
    szURL = szURL + "&location=" + strlocation;

    CoviWindow(szURL, '', '280', '363', 'fix');
}
//다운로드 관련 창을 띄우기 위해서
//cfl.js에 있는 것과 같다 
//하지만 인클루드가 안되서리 결국 넣어 주었다

//<!-- 첨부파일 갯수, 용량 표시해주기위해 추가 시작! 20140407 박한 -->

// 함수 내로 이동
function setSizeDesc() {
    g_maxFileSize_MB_Comma = setComma(_maxFileSize) + "MB";
    g_maxFileSize_KB_Comma = setComma(_maxFileSize * 1024) + "KB";

    document.getElementById("f_ck_sp").innerHTML = "전체 <font color='red'>0</font>개 ㅣ 전체용량 <font color='red'>0</font>MB / " + g_maxFileSize_MB_Comma;
}

function fileListChk() {
    if (document.getElementById("CoviUpload") != null) {
        var fileSize = 0;
        var fileCnt = 0;
        var fileList = document.getElementById("CoviUpload").GetFilesList();
        var fileList_varr = fileList.split('|');
        for (var i = 0; i < fileList_varr.length - 1; i++) {
            fileSize_varr = fileList_varr[i].split(':');
            if (fileSize_varr[2] != "DEL") {
                fileSize += Math.ceil(parseInt(fileSize_varr[1]) / 1024);
                fileCnt++;
            }
        }

        if ((fileSize >= 1024) || (fileSize == 0)) {
            var fileSize_MB_arr = (Math.ceil((fileSize / 1024) * 10) / 10).toString().split('.');
            var fileSize_MB_Comma = setComma(fileSize_MB_arr[0]);
            if (fileSize_MB_arr[1] != undefined) fileSize_MB_Comma = fileSize_MB_Comma + "." + fileSize_MB_arr[1];
            fileSize_MB_Comma += "MB";
            document.getElementById("f_ck_sp").innerHTML = "전체 <font color='red'>" + fileCnt + "</font>개 ㅣ 전체용량 <font color='red'>" + fileSize_MB_Comma + "</font> / " + g_maxFileSize_MB_Comma;
        }
        else {
            var fileSize_KB_Comma = setComma(fileSize) + "KB";
            document.getElementById("f_ck_sp").innerHTML = "전체 <font color='red'>" + fileCnt + "</font>개 ㅣ 전체용량 <font color='red'>" + fileSize_KB_Comma + "</font> / " + g_maxFileSize_KB_Comma;
        }
    }
}

function setComma(setnum) {
    var str = setnum.toString();
    var ret_str = "";
    for (i = 1; i <= str.length; i++) {
        if (i > 1 && (i % 3) == 1)
            ret_str = str.charAt(str.length - i) + "," + ret_str;
        else
            ret_str = str.charAt(str.length - i) + ret_str;
    }
    return ret_str;
}

//<!-- 첨부파일 갯수, 용량 표시해주기위해 추가 끝! 20140407 박한 -->