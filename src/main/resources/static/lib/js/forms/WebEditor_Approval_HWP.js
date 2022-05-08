
//0.TextArea, 1.DHtml, 2.TagFree, 3.XFree, 4.TagFree/XFree, 5.Activesquare, 6.CrossEditor, 7.ActivesquareDefault/CrossEditor
var g_id = "tbContentElement";
var gx_id = "tbContentElement";
var g_editorTollBar = '0'; // 웹에디터 툴바 타입 설정 : 0-모든 툴바 표시 , 1-위쪽 툴바만 표시, 2-아래쪽 툴바만 표시
var g_heigth = "600";

var EditorType = "HWP"
document.write("<script type=\"text/javascript\" src=\"/covicore/resources/script/Hwp/HwpCtrl.js\"></script>");

var hidContentText = "";
var hidContentMime = "";
var hidContentHtml = "";
var hidContentImage = "";

function EditorGetContent() {
    //switch (Common.GetBaseConfig('EditorType')) {
    switch (EditorType) {
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
        case "HWP":
            hidContentMime = document.getElementById("tbContentElement").MIMEValue();
            hidContentHtml = document.getElementById("tbContentElement").HtmlValue();
            break;
    }
}

