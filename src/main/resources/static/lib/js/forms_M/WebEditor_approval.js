
//0.TextArea, 1.DHtml, 2.TagFree, 3.XFree, 4.TagFree/XFree, 5.Activesquare, 6.CrossEditor, 7.ActivesquareDefault/CrossEditor
var g_id = "tbContentElement";
var gx_id = "tbContentElement";
var g_editorTollBar = '0'; // 웹에디터 툴바 타입 설정 : 0-모든 툴바 표시 , 1-위쪽 툴바만 표시, 2-아래쪽 툴바만 표시
var g_heigth = "400";

var hidContentText = "";
var hidContentMime = "";
var hidContentHtml = "";
var hidContentImage = "";
Common.getBaseConfigList(["EditorType"]);//일괄호출

function EditorGetContent() {
    switch (coviCmn.configMap["EditorType"]) {
        case "0":
            hidContentText = document.getElementById("tbContentElement").value;
            break;
        case "1":
            break;
        case "2":
            document.getElementById("tbContentElement").ActiveTab = "1";
            hidContentMime = document.getElementById("tbContentElement").MIMEValue();
            hidContentHtml = document.getElementById("tbContentElement").HtmlValue();
            break;
        case "3":
            var dom = document.getElementById('xFreeFrame').contentWindow.tbContentElement.getDom();
            var imgs = dom.getElementsByTagName("img");

            var imgInfo = "";

            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                var imgPath = img.src;
                imgInfo += imgPath + "|";
            }
            if (imgInfo.length > 0) {
                imgInfo = imgInfo.substr(0, (imgInfo.length - 1));
            }
            
            hidContentHtml = document.getElementById('xFreeFrame').contentWindow.tbContentElement.getHtmlValue();
            hidContentImage = imgInfo;
            hidContentMime = hidContentHtml;
            break;
        case "4":
            if (_ie) {
                document.getElementById("tbContentElement").ActiveTab = "1";
                hidContentMime = document.getElementById("tbContentElement").MIMEValue();
                hidContentHtml = document.getElementById("tbContentElement").HtmlValue();
            }
            else {
                var dom = document.getElementById('xFreeFrame').contentWindow.tbContentElement.getDom();
                var imgs = dom.getElementsByTagName("img");

                var imgInfo = "";

                for (var i = 0; i < imgs.length; i++) {
                    var img = imgs[i];
                    var imgPath = img.src;
                    imgInfo += imgPath + "|";
                }
                if (imgInfo.length > 0) {
                    imgInfo = imgInfo.substr(0, (imgInfo.length - 1));
                }
                
                hidContentHtml = document.getElementById('xFreeFrame').contentWindow.tbContentElement.getHtmlValue();
                hidContentImage = imgInfo;
                hidContentMime = hidContentHtml;
            }
            break;
        case "5":
            break;
        case "6":
            break;
        case "7":
            break;
    }
}

// setEditor로 대체
/*
function EditorSetContent() {
    
    switch (Common.GetBaseConfig('EditorType')) {
        case "0":
            document.getElementById("txtareaBody").value = l_ContentText;
            break;
        case "1":
            break;
        case "2":
            if (getInfo("BODY_CONTEXT") != undefined) {     //기안,임시저장으로 저장된 값 setting
                //setBodyContext(getInfo("BODY_CONTEXT"));
                setEditor(formJson.BODY_CONTEXT.tbContentElement["#cdata-section"]);
                try { G_displaySpnDocLinkInfo(); } catch (e) { }

            } else {//양식 생성 시 입력한 본문내역 조회            
                if (getInfo("fmbd") != undefined) {
                    try { var dom = document.tbContentElement.getDom(); dom.body.innerHTML = getInfo("fmbd"); } catch (e) { }
                }
            }
            if (document.tbContentElement.ActiveTab > 0) window.setTimeout(setTagFreeBug, 500);
            break;
        case "3":
            if (getInfo("BODY_CONTEXT") != undefined) {
                //setBodyContext(getInfo("BODY_CONTEXT"));
                setEditor(formJson.BODY_CONTEXT.tbContentElement["#cdata-section"]);
                try { G_displaySpnDocLinkInfo(); } catch (e) { }
            } else {
                if (getInfo("fmbd") != undefined) {
                    try { tbContentElement.SetHtmlValue(getInfo("fmbd")); } catch (e) { }
                }
            }
            clearInterval(timerID);
            break;
        case "4":
            if (_ie) {
                if (getInfo("BODY_CONTEXT") != undefined) {     //기안,임시저장으로 저장된 값 setting
                    //editor에 대한 set 처리
                    //setBodyContext(getInfo("BODY_CONTEXT"));
                    setEditor(formJson.BODY_CONTEXT.tbContentElement["#cdata-section"]);
                    try { G_displaySpnDocLinkInfo(); } catch (e) { }
                    
                } else {//양식 생성 시 입력한 본문내역 조회            
                    if (getInfo("fmbd") != undefined) {
                        try { var dom = document.tbContentElement.getDom(); dom.body.innerHTML = getInfo("fmbd"); } catch (e) { }
                    }
                }
                if (document.tbContentElement.ActiveTab > 0) window.setTimeout(setTagFreeBug, 500);
            }
            else {
                if (getInfo("BODY_CONTEXT") != undefined) {
                    //setBodyContext(getInfo("BODY_CONTEXT"));
                    setEditor(formJson.BODY_CONTEXT.tbContentElement["#cdata-section"]);
                    try { G_displaySpnDocLinkInfo(); } catch (e) { }
                } else {
                    if (getInfo("fmbd") != undefined) {
                        try { tbContentElement.SetHtmlValue(getInfo("fmbd")); } catch (e) { }
                    }
                }
                clearInterval(timerID);
            }
            break;
        case "5":
            break;
        case "6":
            break;
        case "7":
            break;
    }
}
*/
