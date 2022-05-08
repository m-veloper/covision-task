///* CoviInkComment 관련 함수 시작 By ssuby 2011-12-19 */
//Ink작성창 생성
function fnShowInkWriter() {
    
    //sivlerlignt app의 유무 조사
    var silverAppCnt = $('#silverObjInkWrite').length;

    if (silverAppCnt == 0) {
        //silverlight가 생성될 target Div, 해당위치는 bodytable의 위치와 겹쳐서, 생성되는 silverlight obj의 ID 
        fnMakeInkWriteApp('divInkWriteContainer', '#bodytable', 'silverObjInkWrite');
    }
    else {
        $('#divInkWriteContainer').toggle();
    }
}

//잉크보기창 생성
function fnShowInkViewer() {

    //sivlerlignt app의 유무 조사
    var silverAppCnt = $('#silverObjInkView').length;

    if (silverAppCnt == 0) {
        //silverlight가 생성될 target Div, 해당위치는 bodytable의 위치와 겹쳐서, 생성되는 silverlight obj의 ID
        fnMakeInkViewApp('divInkViewContainer', '#bodytable', 'silverObjInkView');
    }
    else {
        $('#divInkViewContainer').toggle();
    }
}

//저장된 파일이름을 보관하는 전역변수
var savedInkFileName = '';
//저장 후 파일명 반환받기
function fnPassDataFromWriteAppToForm(fileName) {
    savedInkFileName = fileName;
}

//저장을 위한 기본 정보 전달
function fnPassDataFromFormToWriteApp() {

    var uID = getInfo("usid");
    //alert(uID);
    var obj = document.getElementById('silverObjInkWrite');
    //전달하는 ID값은 특수문자를 제거한 형태, div ID 값
    obj.content.WriteScriptKey.GetData(uID.replace(/[^a-zA-Z 0-9]+/g, ''), 'divInkWriteContainer');
    
}

//보기를 위한 기본 정보 전달
function fnPassDataFromFormToViewApp() {

    var uID = getInfo("usid");
    //alert(uID);
    var obj = document.getElementById('silverObjInkView');
    //전달하는 ID값은 특수문자를 제거한 형태, div ID 값
    obj.content.ViewScriptKey.GetData(uID.replace(/[^a-zA-Z 0-9]+/g, ''), 'divInkViewContainer');

}

//보기를 위한 ink 정보 전달
function fnSendData() {
    var viewObj = document.getElementById('silverObjInkView');
    var _fiid = g_dicFormInfo.item("fiid");
    var strName = '';
    var strKind = '';
    var strDate = '';
    var strPath = '';

    //WebMethod 호출로 Data 가져오는 방식으로 변경
    $.ajax({
        type: "POST",
        url: "/WebSite/Approval/Controls/ApprovalWebService.asmx/GetCommentForInkView",
        data: "{'fiid': '" + _fiid + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var commentObj = JSON.parse(result.d);
            $.each(commentObj, function (i, item) {
                //Validation 처리가 필요한 부분
                //이름은 다국어처리, kind 한글명칭으로 변경, 날짜 Timezone 처리
                strName += CFN_GetDicInfo(item.UserName.split("@")[0]) + ';';
                strKind += item.Kind + ';';
                strDate += item.InsertDate + ';';
                strPath += "http://" + _HostName + item.SavePath + ';';
                //20120208 by ssuby 서버경로를 바라보기 위해 hostname추가
            });
            //가져온 data를 silverlight로 전달
            viewObj.content.ViewScriptKey.InputData(strName, strDate, strKind, strPath);
            //silverlight datagrid 생성
            viewObj.content.ViewScriptKey.MakeCommentGrid();
        },
        error: function () {
            alert('Error : Get Comment For Ink View');
        }
    });
}

//작성하는 silverlight 생성
function fnMakeInkWriteApp(divID, targetElm, silverID) {
    var html = "";
    html += "<div id='" + divID + "'>";
    html += "<object id='" + silverID + "' data='data:application/x-silverlight-2,' type='application/x-silverlight-2' width='100%' height='100%'>";
    html += "<param name='source' value='/WebSite/Approval/InkComment/CoviInkComment.xap'/>";
    html += "<param name='onError' value='onSilverlightError' />";
    html += "<param name='Windowless' value='true' />";
    html += "<param name='background' value='transparent' />";
    html += "<param name='minRuntimeVersion' value='4.0.50826.0' />";
    html += "<param name='autoUpgrade' value='true' />";
    html += "<param name='enablehtmlaccess' value='true' />";
    html += "<a href='http://go.microsoft.com/fwlink/?LinkID=149156&v=4.0.50826.0' style='text-decoration:none'>";
    html += "<img src='http://go.microsoft.com/fwlink/?LinkId=161376' alt='Get Microsoft Silverlight' style='border-style:none'/>";
    html += "</a></object><iframe id='_sl_historyFrame' style='visibility:hidden;height:0px;width:0px;border:0px'></iframe>";
    html += "</div>";

    var $targetElm = $(targetElm);
    $('body').append(html);
    
    var divW = $targetElm.width() + 2;
    var divH = $targetElm.height() + 30;
    var divT = $targetElm.position().top + 10;
    var divL = $targetElm.position().left;

    $('#' + divID).css({ 'position': 'absolute', 'width': divW, 'height': divH, 'top': divT, 'left': divL, 'z-index': '1000'});
}

//보기를 위한 silverlight 생성
function fnMakeInkViewApp(divID, targetElm, silverID) {
    var html = "";
    html += "<div id='" + divID + "' class='silverApp'>";
    html += "<object id='" + silverID + "' data='data:application/x-silverlight-2,' type='application/x-silverlight-2' width='100%' height='100%'>";
    html += "<param name='source' value='/WebSite/Approval/InkComment/CoviInkCommentViewer.xap'/>";
    html += "<param name='onError' value='onSilverlightError' />";
    html += "<param name='Windowless' value='true' />";
    html += "<param name='background' value='transparent' />";
    html += "<param name='minRuntimeVersion' value='4.0.50826.0' />";
    html += "<param name='autoUpgrade' value='true' />";
    html += "<param name='enablehtmlaccess' value='true' />";
    html += "<a href='http://go.microsoft.com/fwlink/?LinkID=149156&v=4.0.50826.0' style='text-decoration:none'>";
    html += "<img src='http://go.microsoft.com/fwlink/?LinkId=161376' alt='Get Microsoft Silverlight' style='border-style:none'/>";
    html += "</a></object><iframe id='_sl_historyFrame' style='visibility:hidden;height:0px;width:0px;border:0px'></iframe>";
    html += "</div>";

    var $targetElm = $(targetElm);
    $('body').append(html);

    var divW = $targetElm.width() + 2;
    var divH = $targetElm.height() + 30;
    var divT = $targetElm.position().top + 10;
    var divL = $targetElm.position().left;

    $('#' + divID).css({ 'position': 'absolute', 'width': divW, 'height': divH, 'top': divT, 'left': divL, 'z-index': '999' });
}

//실버라이트 오류처리
function onSilverlightError(sender, args) {
    var appSource = "";
    if (sender != null && sender != 0) {
        appSource = sender.getHost().Source;
    }

    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;

    if (errorType == "ImageError" || errorType == "MediaError") {
        return;
    }

    var errMsg = "Unhandled Error in Silverlight Application " + appSource + "\n";

    errMsg += "Code: " + iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";

    if (errorType == "ParserError") {
        errMsg += "File: " + args.xamlFile + "     \n";
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n";
    }
    else if (errorType == "RuntimeError") {
        if (args.lineNumber != 0) {
            errMsg += "Line: " + args.lineNumber + "     \n";
            errMsg += "Position: " + args.charPosition + "     \n";
        }
        errMsg += "MethodName: " + args.methodName + "     \n";
    }

    throw new Error(errMsg);
}

/* CoviInkComment 관련 함수 끝 By ssuby 2011-12-19 */

//하단 부분은 silverlight 설치 여부를 위해 차후 주석을 살려야 함
////InkComment 관련 전역변수
//var igApvActBasicCnt = 0;
//var objWriteRun = null;
//var objViewRun = null;

//function MakeInkCommentCtrl() {
//    //조용욱(2010-11-05): 최초 로드시 InkComment작성창 생성
//    var bReady = false;
//    //실버라이트 컨트롤이 설치 된 경우
//    if (CheckSilverlightInstalled()) {
//        try {
//            //            setTimeout(InitInkWrite, 1000);
//            //            setTimeout(InitInkView, 1000);
//            window.setTimeout("InitInkWrite()", 1000);
//            window.setTimeout("InitInkView()", 1000);
//            bReady = true;
//        }
//        catch (e) {
//        }
//        if (bReady) {
//        }
//        else {
//           alert('Not yet');
//            objWriteRun = window.setInterval("InitInkWrite()", 200);
//            objViewRun = window.setInterval("InitInkView()", 200);

//            igApvActBasicCnt++;

//            if (igApvActBasicCnt > 50) {
//                clearInterval(objWriteRun);
//                clearInterval(objViewRun);
//            }
//        }
//    }
//    else {
//        //alert('실버라이트 RunTime을 설치하시기 바랍니다.');
////        btInkWrite.style.display = "none";
////        btInkView.style.display = "none";

//        document.getElementById("btInkWrite").display = "none"; 
//        document.getElementById("btInkView").display = "none";
//    }
//}
////실버라이트 Runtime설치 여부 Check
//function CheckSilverlightInstalled() {
//    var isSilverlightInstalled = false;
//    try {
//        try {
//            var slControl = new ActiveXObject('AgControl.AgControl')//IE
//            if (slControl.IsVersionSupported("4.0")) {
//                isSilverlightInstalled = true;
//            }
//        }
//        catch (e) {
//            if (navigator.plugins["Silverlight Plug-In"]) //FF&Safari
//            {
//                isSilverlightInstalled = true;
//            }
//        }
//    }
//    catch (e) { }
//    return isSilverlightInstalled;
//}


/*


个*/