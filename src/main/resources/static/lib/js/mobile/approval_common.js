var _ShowLayerSize = {}; // 레이어 팝업원 원래 사이즈
var _ShowLayerPosition = {}; // 레이어 팝업원 원래 위치

var _CallBackMethod,
	_CallBackMethod2,
	_CallBackMethod3,
	_CallBackMethod4,
	_CallBackMethod5;

//---상수관련---------------------------------------------------------------------------------------------

//IE 브라우져 여부
var _ie = ((window.navigator.userAgent.indexOf("MSIE") != -1) ? true : ((window.navigator.userAgent.indexOf("Trident") != -1) ? true : false));
//IE 버젼
var _ieVer = ((window.navigator.userAgent.indexOf("MSIE 6") != -1) ? 6 : ((window.navigator.userAgent.indexOf("MSIE 7") != -1) ? 7 : ((window.navigator.userAgent.indexOf("Trident/4.0") != -1) ? 8 : ((window.navigator.userAgent.indexOf("Trident/5.0") != -1) ? 9 : ((window.navigator.userAgent.indexOf("Trident/6.0") != -1) ? 10 : ((window.navigator.userAgent.indexOf("Trident/7.0") != -1) ? 11 : 12))))));
//IE의 호환성 보기와 상관없는 IE의 원버젼 정보
var _ieOrgVer = ((window.navigator.userAgent.indexOf("Trident/4.0") != -1) ? 8 : ((window.navigator.userAgent.indexOf("Trident/5.0") != -1) ? 9 : ((window.navigator.userAgent.indexOf("Trident/6.0") != -1) ? 10 : ((window.navigator.userAgent.indexOf("Trident/7.0") != -1) ? 11 : _ieVer))));
//Firefox
var _firefox = ((window.navigator.userAgent.indexOf("Firefox") != -1) ? true : false);
//Safari
var _safari = ((window.navigator.userAgent.indexOf("Safari") != -1 && window.navigator.userAgent.indexOf("Chrome") == -1 && window.navigator.userAgent.indexOf("Mobile") == -1) ? true : false);
//Chrome
var _chrome = ((window.navigator.userAgent.indexOf("Chrome") != -1) ? true : false);
//Opera
var _opera = ((window.navigator.userAgent.indexOf("Opera") != -1) ? true : false);
//Android
var _android = ((window.navigator.userAgent.toLowerCase().indexOf("android") != -1) ? true : false);
//iPhone
var _iphone = ((window.navigator.userAgent.toLowerCase().indexOf("iphone") != -1) ? true : false);
//iPad
var _ipad = ((window.navigator.userAgent.toLowerCase().toLowerCase().indexOf("ipad") != -1) ? true : false);
//Mac
var _mac = ((window.navigator.userAgent.indexOf("Macintosh") != -1) ? true : false);
//coviHybrid
var _coviHybrid = ((window.navigator.userAgent.indexOf("COVI_HYBRID") != -1) ? true : false);

//Mobile 여부
var _mobile = ((window.navigator.userAgent.indexOf("Mobile") != -1) ? true : (_android ? true : (_iphone ? true : (_ipad ? true : ((window.navigator.userAgent.indexOf("COVI_HYBRID") != -1) ? true : false)))));

//운영체제
var _OS = ((window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) ? "WinXp" : ((window.navigator.userAgent.indexOf("Windows NT 5.2") != -1) ? "Win2003Svr" : ((window.navigator.userAgent.indexOf("Windows NT 5") != -1) ? "Win2000" : ((window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) ? "Win2008" : ((window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) ? "Win7" : ((window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) ? "Win8" : ((window.navigator.userAgent.indexOf("Windows NT 6.3") != -1) ? "Win8.1" : "OrderOS")))))))

//표준만 지원 여부(IE의 기능 비지원 여부) IE => false, Chrome/Firefox/Safari = true
var _dom = (document.getElementById && !document.all) ? true : false;
//HTML5 지원 여부(HTML5에서 sessionStorage를 지원함)
var _html5 = (window.sessionStorage) ? true : false;
//네스케이프 브라우져 여부
var _nn4 = (document.layers) ? true : false;

//해상도 정보
var _screenW = window.screen.width;
var _screenH = window.screen.height;
var _fixedWidth = 1024; //Width 최소고정값

//웹 사이트 경로 정보
var _HostName = window.location.hostname;             // 사이트 도메인  ex) www.No1.com
var _HostFullName = document.location.protocol + "//" + document.location.hostname;  //사이트 호스트 네임 Full ex) http://www.No1.com
var _DocPath = window.document.location.pathname;     // 현재 페이지 경로 ex) /WebSite/Main.aspx
var _QueryString = window.document.location.search;   // 현재 페이지 쿼리 스트링 ex) ?System=Portal
var _WebRoot = _DocPath.substring(0, _DocPath.indexOf("/", 2)).toUpperCase().replace("/", ""); // 현재 웹사이트 Root Name ex) WebSite

//ko(0)-한국어, en(1)-영어, ja(2)-일본어, zh(3)-중국어, e1(4)-추가 언어1, e2(5)-추가 언어2, e3(6)-추가 언어3, e4(7)-추가 언어4, e5(8)-추가 언어5, e6(9)-추가 언어6
var _LanguageIndex = { "ko": 0, "en": 1, "ja": 2, "zh": 3, "e1": 4, "e2": 5, "e3": 6, "e4": 7, "e5": 8, "e6": 9 }; // 다국어 인덱스 값

//사용자의 액션 수행 최종시간(특정 시간이 지난 후 화면을 잠그거나 하기 위함.) 
var _ActionTime = new Date();

//==== 공용자원 객체 ====> 값을 가져온 상태면 다시 가져오지 않게 사용자 세션/다국어 정보를 전역에 저장함.
//(스크립트에서 여러번 정보를 호출할때 계속 웹서비스를 호출하지 않고 객체를 먼져 뒤저서 있으면 보내줌)
var _Session = {};      // 세션정보
var _Dictionary = {};   // 다국어 정보
var _PgModule = {};     // 프로그램 모듈 정보
var _AppConfig = {};    // 어플리 케이션 설정정보
var _BaseConfig = {};   // 기초 설정 정보
var _BaseCode = {};     // 기초 코드 정보
var _MenuInfo = {};     // 메뉴 정보
var _TimeZoneTimeDiff = {}; // 타임존 코드에 대한 차이 시간
var _MobileScroll = {}; // 모바일 스크롤 객체
var _ShowLayerSize = {}; // 레이어 팝업원 원래 사이즈
var _ShowLayerPosition = {}; // 레이어 팝업원 원래 위치

var _RiseAjaxError = false; // Ajax호출시 네트워크/인증에 문제가 발생하였을 경우 Ajax 서비스가 호출되지 않도록 확인하는 처리를 위해

//==== 컨트롤 전역 ====>
//컨트롤 관련 
var _controlsPath = "smarts4j/covicore/resources/images/covision";		//"/Images/Images/Controls/";
var _lodingImage = "loding12.gif";
var _lodingImageHtml = "<center><img src='/smarts4j/covicore/resources/images/covision/loding12.gif' alt='Loading...' /></center>";
var _progressImage = "loding14.gif";

var l_aObjFileList = [];

//Base64
var Base64 = {
	utf8_to_b64 : function ( str ) {
		return window.btoa(unescape(encodeURIComponent( str )));
	},
	b64_to_utf8 : function ( str ) {
		return decodeURIComponent(escape(window.atob( str )));
	}
}

function jsonPath(obj, expr, arg) {
  var P = {
     resultType: arg && arg.resultType || "VALUE",
     result: [],
     normalize: function(expr) {
        var subx = [];
        return expr.replace(/[\['](\??\(.*?\))[\]']|\['(.*?)'\]/g, function($0,$1,$2){return "[#"+(subx.push($1||$2)-1)+"]";})  /* http://code.google.com/p/jsonpath/issues/detail?id=4 */
                   .replace(/'?\.'?|\['?/g, ";")
                   .replace(/;;;|;;/g, ";..;")
                   .replace(/;$|'?\]|'$/g, "")
                   .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
     },
     asPath: function(path) {
        var x = path.split(";"), p = "$";
        for (var i=1,n=x.length; i<n; i++)
           p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
        return p;
     },
     store: function(p, v) {
        if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
        return !!p;
     },
     trace: function(expr, val, path) {
        if (expr !== "") {
           var x = expr.split(";"), loc = x.shift();
           x = x.join(";");
           if (val && val.hasOwnProperty(loc))
              P.trace(x, val[loc], path + ";" + loc);
           else if (loc === "*")
              P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
           else if (loc === "..") {
              P.trace(x, val, path);
              P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
           }
           else if (/^\(.*?\)$/.test(loc)) // [(expr)]
              P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
           else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
              P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"), v instanceof Array ? v[m] : v, m)) P.trace(m+";"+x,v,p); }); // issue 5 resolved
           else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
              P.slice(loc, x, val, path);
           else if (/,/.test(loc)) { // [name1,name2,...]
              for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                 P.trace(s[i]+";"+x, val, path);
           }
        }
        else
           P.store(path, val);
     },
     walk: function(loc, expr, val, path, f) {
        if (val instanceof Array) {
           for (var i=0,n=val.length; i<n; i++)
              if (i in val)
                 f(i,loc,expr,val,path);
        }
        else if (typeof val === "object") {
           for (var m in val)
              if (val.hasOwnProperty(m))
                 f(m,loc,expr,val,path);
        }
     },
     slice: function(loc, expr, val, path) {
        if (val instanceof Array) {
           var len=val.length, start=0, end=len, step=1;
           loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
           start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
           end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
           for (var i=start; i<end; i+=step)
              P.trace(i+";"+expr, val, path);
        }
     },
     eval: function(x, _v, _vname) {
        try { return $ && _v && eval(x.replace(/@/g, "_v")); }
        catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
     }
  };

  var $ = obj;
  if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
     P.trace(P.normalize(expr).replace(/^\$;?/,""), obj, "$");  // issue 6 resolved
     return P.result.length ? P.result : false;
  }
}

function CFN_GetCtrlById(pId) {
	return document.getElementById(eval("id_" + pId));
}

//서버시간을 자신의 타임존 시간으로 변환하여 반환함.
//pLocalFormat - 임력하지 않으면 로컬 포멧으로 변환하여 반환함.
function CFN_TransLocalTime(pServerTime, pLocalFormat) {
	var l_InputYear, l_InputMonth, l_InputDay, l_InputHH, l_InputMM, l_InputSS;  // 입력 년월일시분초
	var l_TimeZone, l_ZoneHH, l_ZoneMM, l_ZoneSS, l_Minus, l_UR_TimeZone;  // 타임존 시분초 +- 여부
	var l_StringDate, l_StringTime, l_DateFormat = "", l_DateFormatCount;  // 입력 날짜, 입력 시간, 입력날짜 형식, 입력한 값 길이
	
	var l_ReturnString = "";
	
	l_DateFormatCount = pServerTime.length;
	
	// 1. 날짜(2011-01-04)와 시간(09:12, 08:12:12)이 같이 들어와야 한다.
	if (pServerTime.indexOf(" ") == -1) {
	   if (pServerTime.length == 10) {
	       pServerTime += " 00:00:00";
	   } else {
	       return pServerTime;
	   }
	}
	
	l_StringDate = pServerTime.split(' ')[0];
	l_StringTime = pServerTime.split(' ')[1];
	
	// 2. 날짜 형식은 "-", ".", "/"을 받는다.
	// 입력 포멧 확인
	if (l_StringDate.indexOf(".") > -1) { l_DateFormat = "."; }
	if (l_StringDate.indexOf("-") > -1) { l_DateFormat = "-"; }
	if (l_StringDate.indexOf("/") > -1) { l_DateFormat = "/"; }
	
	if (l_DateFormat == "") {
	   return pServerTime;
	}
	l_StringDate = l_StringDate.replace(/-/g, "");
	l_StringDate = l_StringDate.replace(/\./g, "");
	l_StringDate = l_StringDate.replace(/\//g, "");
	l_StringTime = l_StringTime.replace(/:/g, "");
	
	// 3. 시간은 시분까지는 들어와야 한다.(초는 없어도 됨.)
	if (l_StringDate.length != 8 || l_StringTime.length < 4) {
	   return pServerTime;
	}
	
	// 형식에 맞게 숫자를 체워줌
	l_StringTime = CFN_PadRight(l_StringTime, 6, "0");
	
	// 입력받은 일시 분해
	l_InputYear = l_StringDate.substring(0, 4);
	l_InputMonth = l_StringDate.substring(4, 6) - 1; // 월은 1을 빼줘야 함.
	l_InputDay = l_StringDate.substring(6, 8);
	l_InputHH = l_StringTime.substring(0, 2);
	l_InputMM = l_StringTime.substring(2, 4);
	l_InputSS = l_StringTime.substring(4, 6);
	
	// 시간 형식 체크
	var l_InputDate = new Date(l_InputYear, l_InputMonth, l_InputDay, l_InputHH, l_InputMM, l_InputSS);
	if (l_InputDate.getFullYear() != l_InputYear || l_InputDate.getMonth() != l_InputMonth || l_InputDate.getDate() != l_InputDay ||
	   l_InputDate.getHours() != l_InputHH || l_InputDate.getMinutes() != l_InputMM || l_InputDate.getSeconds() != l_InputSS) {
	   return pServerTime;
	}
	
	if(mobile_comm_getBaseConfig("useTimeZone") == "Y"){
		 // 자신의 타임존 시간 가져오기(세션에 정의된 타임존 값을 가져옴.)
		 if (typeof _UR_TimeZone == "undefined") {
		     l_UR_TimeZone = mobile_comm_getSession("UR_TimeZone");
		 } else {
		     l_UR_TimeZone = _UR_TimeZone;
		 }
		 l_Minus = l_UR_TimeZone.substring(0, 1);
		 l_TimeZone = l_UR_TimeZone.replace("-", "").replace(":", "").replace(":", "");
		 l_ZoneHH = l_TimeZone.substring(0, 2);
		 l_ZoneMM = l_TimeZone.substring(2, 4);
		 l_ZoneSS = l_TimeZone.substring(4, 6);
		
		 var l_TimeZoneTime = (parseInt(l_ZoneHH, 10) * 3600000) + (parseInt(l_ZoneMM, 10) * 60000) + (parseInt(l_ZoneSS, 10) * 1000)
		
		 if (l_Minus == "-") {
		     l_InputDate.setTime(l_InputDate.getTime() - l_TimeZoneTime);
		 } else {
		     l_InputDate.setTime(l_InputDate.getTime() + l_TimeZoneTime);
		 }
		
		 l_ReturnString = CFN_PadLeft(l_InputDate.getFullYear(), 4, "0") + l_DateFormat +
	     	CFN_PadLeft(l_InputDate.getMonth() + 1, 2, "0") + l_DateFormat +
	     	CFN_PadLeft(l_InputDate.getDate(), 2, "0") + ' ' +
	     	CFN_PadLeft(l_InputDate.getHours(), 2, "0") + ':' +
	     	CFN_PadLeft(l_InputDate.getMinutes(), 2, "0") + ':' +
	     	CFN_PadLeft(l_InputDate.getSeconds(), 2, "0");
	
	}    
	
	if (pLocalFormat == undefined || pLocalFormat == "") {
	   // 포멧을 지정하지 않을 경우 원래 요청한 (로컬 표준포멧의)형식으로 반환
	   pLocalFormat = "yyyy-MM-dd HH:mm:ss";
	   l_ReturnString = pLocalFormat
	   .replace("yyyy", CFN_PadLeft(l_InputDate.getFullYear(), 4, "0"))
	   .replace("MM", CFN_PadLeft(l_InputDate.getMonth() + 1, 2, "0"))
	   .replace("dd", CFN_PadLeft(l_InputDate.getDate(), 2, "0"))
	   .replace("HH", CFN_PadLeft(l_InputDate.getHours(), 2, "0"))
	   .replace("mm", CFN_PadLeft(l_InputDate.getMinutes(), 2, "0"))
	   .replace("ss", CFN_PadLeft(l_InputDate.getSeconds(), 2, "0"));
	   l_ReturnString = l_ReturnString.substr(0, l_DateFormatCount);
	}
	else // 사용자가 포멧을 지정하여 요청하면 요청한 데로 반환
	{
	   l_ReturnString = pLocalFormat
	   .replace("yyyy", CFN_PadLeft(l_InputDate.getFullYear(), 4, "0"))
	   .replace("MM", CFN_PadLeft(l_InputDate.getMonth() + 1, 2, "0"))
	   .replace("dd", CFN_PadLeft(l_InputDate.getDate(), 2, "0"))
	   .replace("HH", CFN_PadLeft(l_InputDate.getHours(), 2, "0"))
	   .replace("mm", CFN_PadLeft(l_InputDate.getMinutes(), 2, "0"))
	   .replace("ss", CFN_PadLeft(l_InputDate.getSeconds(), 2, "0"));
	}
	
	return l_ReturnString;
}

//지정한 컨테이너 안의 특정 class를 준 하위 텍스트의 타임죤 처리
function CFN_TransLocalTimeContainer(pContainerID, pTargetClass) {
 $("#" + pContainerID).each(function () {
     $(this).find("." + pTargetClass).each(function () {
         $(this).text(CFN_TransLocalTime($(this).text()))
         $(this).removeClass(pTargetClass);
     });
 });
}

// 오늘 날짜에 해당하는 Local시간 문자열을 리턴
function CFN_GetLocalCurrentDate(pLocalFormat) {
    var toTime = new Date();
    var hour = toTime.getTimezoneOffset() / 60;    

    // GMT(그리니치 표준시) 런던(GMT + 0) 시간 구하기
    var calGmtHour = toTime.setHours(toTime.getHours() + hour);
    var calGmt = new Date(calGmtHour);
	
	var strGmt = calGmt.getFullYear() + '-' + CFN_PadLeft(calGmt.getMonth() + 1, 2, "0") + '-' + CFN_PadLeft(calGmt.getDate(), 2, "0") + ' ' 
				+ CFN_PadLeft(calGmt.getHours(), 2, "0") + ':' + CFN_PadLeft(calGmt.getMinutes(), 2, "0") + ':' + CFN_PadLeft(calGmt.getSeconds(), 2, "0");
	
	return CFN_TransLocalTime(strGmt, pLocalFormat);
}

//왼쪽에 특정문자를 채워 반환
function CFN_PadLeft(pString, pCount, pPadChar) {
	var l_PadString = '';
	pString = pString.toString();

	if (pString.length < pCount) {
		for (var i = 0; i < pCount - pString.length; i++) {
			l_PadString += pPadChar;
		}
	}
	return l_PadString + pString;
}

//오른쪽에 특정문자를 채워 반환
function CFN_PadRight(pString, pCount, pPadChar) {
	var l_PadString = '';
	pString = pString.toString();

	if (pString.length < pCount) {
		for (var i = 0; i < pCount - pString.length; i++) {
			l_PadString += pPadChar;
		}
	}
	return pString + l_PadString;
}

//Call Ajax - Param, Type url, param, callbackFunc, bAsync, dataTP
function CFN_CallAjax(pUrl, pParam, pCallBack, pAsync, pDataType) {
    if (pDataType == null || pDataType == "") {
        pDataType = "html";
    }
    if(_RiseAjaxError) {
        return;
    } else {
        $.ajax({
            url: pUrl,
            data: pParam,
            dataType: pDataType,
            type: "POST",
            async: pAsync,
            success: function (result) {
                try {
                    pCallBack(result);
                } finally {
                    result = null;
                }
            },
            error : function (response, status, error) {
                mobile_comm_ajaxerror(pUrl, response, status, error);
            }
        });
    }
}

//천단위에 컴마 찍기
function CFN_AddComma(objValue) {
	var objTempDot = "";
	var objTemp = "";
	var objTempValue = '';
	var objFlag = '';
	if (objValue.indexOf(".") > -1) {
		objTemp = objValue.split(".")[0];
		objTempDot = objValue.split(".")[1];
	} else {
		objTemp = objValue;
	}

	objTemp = objTemp.replace(/,/g, '');
	if (objTemp.charAt(0) == '-') {
		objFlag = 'Y';
		objTemp = objTemp.substring(1);
	}

	if (objTemp.length > 3) {
		var tempV1 = objTemp.substring(0, objTemp.length % 3);
		var tempV2 = objTemp.substring(objTemp.length % 3, objTemp.length);

		if (tempV1.length != 0) {
			tempV1 += ',';
		}
		objTempValue += tempV1;

		for (var i = 0; i < tempV2.length; i++) {
			if (i % 3 == 0 && i != 0) {
				objTempValue += ',';
			}
			objTempValue += tempV2.charAt(i);
		}
	} else {
		objTempValue = objTemp;
	}

	if (objFlag == 'Y') {
		objTempValue = '-' + objTempValue;
	}

	if (objTempDot != "") {
		objTempValue = objTempValue + "." + objTempDot;
	}
	return objTempValue;
}

//받은 입력값 특수문자 변환 처리2
function XFN_ChangeOutputValue(pValue) {
    var strReturenValue = "";
    strReturenValue = pValue.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&apos;/gi, '\'').replace(/&nbsp;/gi, ' ');
    return strReturenValue;
}

//문자열 Local Date Format을 서버 포멧으로 단순변환
function XFN_TransDateServerFormat(pLocalDate) {
    var l_strResult = "";
    var l_strServerDateFormat = "";
    var l_strLocalFormat = "";
    var l_strCheckDate = "";
    if (typeof _ServerDateSimpleFormat == "undefined") {
        l_strServerDateFormat = mobile_comm_getBaseConfig("ServerDateSimpleFormat");
    } else {
        l_strServerDateFormat = _ServerDateSimpleFormat;
    }
    if (typeof _CalenderDateFormat == "undefined") {
        l_strLocalFormat = mobile_comm_getBaseConfig("CalenderDateFormat");
    } else {
        l_strLocalFormat = _CalenderDateFormat;
    }

    //2016.01.29 다양한 포맷에 대응하도록 수정
    var s_DateFormat = "";   //서버 포맷 연결자

    // 입력 포멧 확인
    if (l_strServerDateFormat.indexOf(".") > -1) { s_DateFormat = "."; }
    if (l_strServerDateFormat.indexOf("-") > -1) { s_DateFormat = "-"; }
    if (l_strServerDateFormat.indexOf("/") > -1) { s_DateFormat = "/"; }

    if (pLocalDate.indexOf(".") > -1) { pLocalDate = pLocalDate.replace(/\./g, s_DateFormat); }
    if (pLocalDate.indexOf("-") > -1) { pLocalDate = pLocalDate.replace(/\-/g, s_DateFormat);; }
    if (pLocalDate.indexOf("/") > -1) { pLocalDate = pLocalDate.replace(/\//g, s_DateFormat); }

    if (pLocalDate != "") {
        l_strCheckDate = l_strServerDateFormat.replace("yyyy", pLocalDate.substr(l_strServerDateFormat.indexOf("yyyy"), 4)).replace("MM", pLocalDate.substr(l_strServerDateFormat.indexOf("MM"), 2)).replace("dd", pLocalDate.substr(l_strServerDateFormat.indexOf("dd"), 2));
        if (pLocalDate.length == 10) {
            if (l_strCheckDate != pLocalDate) {
                l_strResult = l_strServerDateFormat.replace("yyyy", pLocalDate.substr(l_strLocalFormat.indexOf("yyyy"), 4)).replace("MM", pLocalDate.substr(l_strLocalFormat.indexOf("MM"), 2)).replace("dd", pLocalDate.substr(l_strLocalFormat.indexOf("dd"), 2));
            } else {
                l_strResult = l_strCheckDate;
            }
        } else if (pLocalDate.length > 10) {
            if (l_strCheckDate != pLocalDate.substr(0,10)) {
                l_strResult = l_strServerDateFormat.replace("yyyy", pLocalDate.substr(l_strLocalFormat.indexOf("yyyy"), 4)).replace("MM", pLocalDate.substr(l_strLocalFormat.indexOf("MM"), 2)).replace("dd", pLocalDate.substr(l_strLocalFormat.indexOf("dd"), 2));
            } else {
                l_strResult = l_strCheckDate;
            }
            l_strResult += pLocalDate.substr(10, pLocalDate.length - 10);
        } else {
            l_strResult = pLocalDate;
        }
    }

    return l_strResult;
}

//문자열 Server Format을 Local Date Format으로 단순변환
function XFN_TransDateLocalFormat(pServerDate, pLocalFormat) {
    var l_strResult = "";
    var l_strServerDateFormat = "";
    var l_strCheckDate = "";
    if (typeof _ServerDateSimpleFormat == "undefined") {
        l_strServerDateFormat = mobile_comm_getBaseConfig("ServerDateSimpleFormat");
    } else {
        l_strServerDateFormat = _ServerDateSimpleFormat;
    }
    if (pLocalFormat == undefined || pLocalFormat == "") {
        if (typeof _CalenderDateFormat == "undefined") {
            pLocalFormat = mobile_comm_getBaseConfig("CalenderDateFormat");
        } else {
            pLocalFormat = _CalenderDateFormat;
        }
    }
    //2016.01.29 다양한 포맷에 대응하도록 수정
    var l_DateFormat = "";   //로컬 포맷 연결자

    // 입력 포멧 확인
    if (pLocalFormat.indexOf(".") > -1) { l_DateFormat = "."; }
    if (pLocalFormat.indexOf("-") > -1) { l_DateFormat = "-"; }
    if (pLocalFormat.indexOf("/") > -1) { l_DateFormat = "/"; }

    if (pServerDate.indexOf(".") > -1) { pServerDate = pServerDate.replace(/\./g, l_DateFormat); }
    if (pServerDate.indexOf("-") > -1) { pServerDate = pServerDate.replace(/\-/g, l_DateFormat); }
    if (pServerDate.indexOf("/") > -1) { pServerDate = pServerDate.replace(/\//g, l_DateFormat); }

    if (pServerDate != "") {

        l_strCheckDate = pLocalFormat.replace("yyyy", pServerDate.substr(pLocalFormat.indexOf("yyyy"), 4)).replace("MM", pServerDate.substr(pLocalFormat.indexOf("MM"), 2)).replace("dd", pServerDate.substr(pLocalFormat.indexOf("dd"), 2));

        if (pServerDate.length == 10) {
            if (l_strCheckDate != pServerDate) {
                l_strResult = pLocalFormat.replace("yyyy", pServerDate.substr(l_strServerDateFormat.indexOf("yyyy"), 4)).replace("MM", pServerDate.substr(l_strServerDateFormat.indexOf("MM"), 2)).replace("dd", pServerDate.substr(l_strServerDateFormat.indexOf("dd"), 2));
            } else {
                l_strResult = l_strCheckDate;
            }
        } else if (pServerDate.length > 10) {
            if (l_strCheckDate != pServerDate.substr(0, 10)) {
                l_strResult = pLocalFormat.replace("yyyy", pServerDate.substr(l_strServerDateFormat.indexOf("yyyy"), 4)).replace("MM", pServerDate.substr(l_strServerDateFormat.indexOf("MM"), 2)).replace("dd", pServerDate.substr(l_strServerDateFormat.indexOf("dd"), 2));
            } else {
                l_strResult = l_strCheckDate;
            }
            l_strResult += pServerDate.substr(10, pServerDate.length - 10);
        } else {
            l_strResult = pServerDate;
        }
    }

    return l_strResult;
}


function arrayCompare(arrayA, arrayB){
	if (arrayA.length != arrayB.length) { return false; }
    // sort modifies original array
    // (which are passed by reference to our method!)
    // so clone the arrays before sorting
    var a = jQuery.extend(true, [], arrayA);
    var b = jQuery.extend(true, [], arrayB);
    a.sort(); 
    b.sort();
    for (var i = 0, l = a.length; i < l; i++) {
        if (a[i] !== b[i]) { 
            return false;
        }
    }
    return true;
}

var Common = {};
var g_ErrorMessage;
var g_ErrorSeq=0;

// 기타 양식 내 Common 및 XEasy 관련
Common.Error = function(message, title, callback) {
	if (g_ErrorMessage.indexOf(message) == -1) {
	     if (g_ErrorSeq > 0) {
	         g_ErrorMessage += "<strong>"+ g_ErrorSeq +") </strong> " + message + "<br />";
	     } else {
	         g_ErrorMessage += message + "<br />";
	     }
	 } else {
	     g_ErrorMessage += ".";
	 }

	 ++g_ErrorSeq;
	 setTimeout(function () { $.alerts.error(g_ErrorMessage, title, callback); }, 350);
	 setTimeout(function () { g_ErrorMessage = ""; g_ErrorSeq = 0; }, 1000);
};

Common.Warning = function (message, title, callback) {
	setTimeout(function () { $.alerts.warning(message, title, callback); }, 350);
};

// PC 다운로드 모바일 용다운로드로 변경
Common.fileDownLoad = function (pFileID, pFileName, pFileToken) {
	mobile_comm_getFile(pFileID, pFileName, pFileToken);
};

var mobile_approvalCache = {
	timeout : 3600000*2, // 60 minutes
	// timeout: 60000, // 1 minutes
	data : {}, // @type {{_: number, data: {}}}
	remove : function(key) {
		if(mobile_approvalCache.isLocalStorage()){
			sessionStorage.removeItem(key);
		} else {
			delete mobile_approvalCache.data[key];	
		}
	},
	removeAll : function(){
		mobile_approvalCache.data = {};
		sessionStorage.clear();
		localStorage.clear();
	},
	exist : function(key) {
		if(mobile_approvalCache.isLocalStorage()){
			var sessionStoragedItem = JSON.parse(sessionStorage.getItem(key));
			return !!sessionStorage.getItem(key) && ((new Date().getTime() - sessionStoragedItem._) < mobile_approvalCache.timeout);
		} else {
			return !!mobile_approvalCache.data[key] && ((new Date().getTime() - mobile_approvalCache.data[key]._) < mobile_approvalCache.timeout);	
		}
	},
	get : function(key) {
		if(mobile_approvalCache.isLocalStorage()){
			var sessionStoragedItem = JSON.parse(sessionStorage.getItem(key));
			return sessionStoragedItem.data;
		} else {
			return mobile_approvalCache.data[key].data;	
		}
	},
	set : function(key, cachedData, callback) {
		if(mobile_approvalCache.isLocalStorage()){
			sessionStorage.removeItem(key);
			var sessionStoragedItem = {
				_ : new Date().getTime(),
				data : cachedData
			}
			sessionStorage.setItem(key, JSON.stringify(sessionStoragedItem))
		} else {
			mobile_approvalCache.remove(key);
			mobile_approvalCache.data[key] = {
				_ : new Date().getTime(),
				data : cachedData
			};
		}
		
		if ($.isFunction(callback))
			callback(cachedData);
	},
	isLocalStorage : function(){
		var test = 'test';
	    try {
	        sessionStorage.setItem(test, test);
	        sessionStorage.removeItem(test);
	        return true;
	    } catch(e) {
	        return false;
	    }
	}
};

Common.getBaseCode = function(pStrGroupCode) {
	if (pStrGroupCode == undefined || pStrGroupCode == null) return;
	
	var jsonData = {};
	jsonData["key"] = pStrGroupCode;
	
	var returnData = "";
	if (mobile_approvalCache.exist("CODE_"+pStrGroupCode)) {
		returnData = mobile_approvalCache.get("CODE_"+pStrGroupCode);
	} else {
		$.ajax({
			url : "/covicore/common/getbasecode.do",
			data : jsonData,
			type : "post",
			async : false,
			success : function(res) {
				returnData = res.value;
				mobile_approvalCache.set("CODE_"+pStrGroupCode, returnData, "");
			},
			error:function(response, status, error){
				mobile_comm_ajaxerror("/covicore/common/getbasecode.do", response, status, error);
			}
		});
	}
	
	return returnData;
};

Common.getBaseConfig = function(pKey, pDN_ID) {
	return mobile_comm_getBaseConfig(pKey, pDN_ID);
};
Common.getBaseConfigList = function(pConfigArray) {
	return mobile_comm_getBaseConfigList(pConfigArray);
};
Common.getBaseCode = function(pCodeGroup){
	return mobile_comm_getBaseCode(pCodeGroup);
};
Common.getBaseCodeList = function(pCodeArray){
	return mobile_comm_getBaseCodeList(pCodeArray);
};
Common.getDic = function(pStr, pDicType, pLocale) {
	return mobile_comm_getDic(pStr);
};
Common.getDicList = function(pDicArray, pDicType, pLocale){
	return mobile_comm_getDicList(pDicArray, pDicType, pLocale);
};
Common.getDicAll = function(pDicArray, pDicType, pLocale){
	return mobile_comm_getDicAll(pStr, pDicType, pLocale);
};
Common.getSession= function(pKey){
	return mobile_comm_getSession(pKey);
};

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
	var theString = arguments[0];
	
	// start with the second argument (i = 1)
	for (var i = 1; i < arguments.length; i++) {
		// "gm" = RegEx options for Global search (more than one instance)
		var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
		theString = theString.replace(regEx, arguments[i]);
    }
	return theString;
};

var mobile_approvalUserPotoPathArr = {};

// 결재 사용자 이미지 정보 조회
function mobile_approval_getUserPotoPath(pUserCode, pPotoPath){
	var returnPotoPath = "";
	if(mobile_approvalUserPotoPathArr[pUserCode] != null && mobile_approvalUserPotoPathArr[pUserCode] != "" && mobile_approvalUserPotoPathArr[pUserCode] != "Y") { 
		return mobile_approvalUserPotoPathArr[pUserCode];
	} else {
		if(pPotoPath != undefined && pPotoPath != null && pPotoPath != ""){
			mobile_approvalUserPotoPathArr[pUserCode] = pPotoPath;
		} else {
			mobile_approvalUserPotoPathArr[pUserCode] = mobile_approval_getProfileImagePath(pUserCode)[0].PhotoPath;
		}
		returnPotoPath = mobile_approvalUserPotoPathArr[pUserCode];
	}
	
	return returnPotoPath;
}

//프로필 사진 경로 가져오기
function mobile_approval_getProfileImagePath(userCodes){
	var returnObj = new Array();
	
	if(userCodes.split(";").length > 0){
		$.ajax({
			url:"/approval/user/getProfileImagePath.do",
			data: {
				"UserCodes" : userCodes
			},
			type:"post",
			dataType : 'json',
			async : false,
			success:function (res) {
				returnObj = res.data;
			},
			error:function(response, status, error){
				alert("/approval/user/getProfileImagePath.do", response, status, error);
			}
		});	
	}
	
	return returnObj;
}

//// 전자결재 승인/반려 생체인증
//
//function mobile_approval_checkFido(){
//	if (($("#fidoid").val() == "아이디") || ($("#fidoid").val() == "ID") ||($("#fidoid").val() == "")) {
//    	Common.Warning("<spring:message code='Cache.msg_enter_ID'/>","ERROR");
//	}else{
//		var userCode = Common.getSession("USERID");
//		alert("여기까지");
//		//Common.open("", "checkFido", "사용자 본인인증 요청", "/covicore/control/checkFido.do?logonID="+userCode+"&authType=Approval", "200px", "255px", "iframe", true, null, null, true); //사용자 본인인증 요청
//		
//		// 프로그레스바 띄워놓고
//		mobile_comm_showload();
//		init();
//		// fido.do 로 직접 연결
////		
////		mobile_comm_hideload();		
////		mobile_comm_back();
//	}
//}
//
//function init(){
//	//parameter 값 설정
//	g_logonID = emptyDefault(CFN_GetQueryString("logonID"), "");
// 	g_authType = emptyDefault(CFN_GetQueryString("authType"), "");
// 	
//	// FIDO 요청
//	$.ajax({
//		url: "/covicore/control/fido.do",
//		type: "post", 
//		async: false, 
//		data: {
//			"logonID": g_logonID, 
//			"authType": g_authType,
//			"reqMode": "ReqAuth"
//		},
//		success: function(data){
//			if(data.status =="SUCCESS"){
//			  g_authKey = data.authKey;
//			  g_authToken = encodeURIComponent(data.authToken);
//			  var counter = 300;  //5분 
//			  
//			  //Interval 설정
//			  g_i_fidoTimer = setInterval(function(){
//		          if(counter < 0) {
//		        		clearInterval(g_i_fidoTimer);
//		        		clearInterval(g_i_fidoCheck);
//		        		cancelFido(data.authKey);
//		        		$('#fidoImg').html("<div style='width: 65px;height: 65px;margin: 0 auto;text-align: center;'><span style='display: inline-block;height: 65px;float: left;'><img src='/HtmlSite/smarts4j_n/covicore/resources/images/common/fido_img_mobile02.png'></span></div>");
//		          		$("#resultMsg").html("본인인증에<br>실패하였습니다.");  /* <font color='red' style='font-size: 18px;'>본인인증에 실패하였습니다.</font><br>본인인증을 다시 시도하여 주십시오. */
//		          		$("#description").html("본인인증을 다시 시도하여 주십시요.");
//		          		$("#imgDiv").attr("style", "padding: 62px 0;");
//		          		$("#fidoCount").hide();
//		          		$("#confirmBtn").hide();
//		          		$("#cancelBtn").attr("onclick", "closePopup(); return false;");
//		          } else {
//		        	  var minutes = Math.floor(counter/60); 
//		        	  var seconds = counter - (minutes*60);
//		        	  
//		              $('#countdown').html("<strong style='font-size:36px; color:#4abde1;'>" + minutes + "</strong><spring:message code='Cache.lbl_Minutes'/>&nbsp;<strong style='font-size:36px; color:#4abde1;'>" + seconds +"</strong><spring:message code='Cache.lbl_Sec'/>"); /*분 초*/
//		          };
//		          counter -= 1;
//		      }, 1000);
//			  
//			  g_i_fidoCheck = setInterval("confirmAuth('interval')", 5000);
//
//			}else{
//				parent.Common.Error(data.resMessage, "Error", function(){
//					closePopup()
//				})
//			}				  
//		},
//		error: function(response, status, error){
//		     CFN_ErrorAjax("/covicore/control/fido.do", response, status, error);
//		}
//	}); 
//}
//
//function emptyDefault(value, defaultVal){
//	if(value=="undefined" || value=="null" || value==undefined || value == null){
//		return defaultVal;
//	}else{
//		return value;
//	}
//}
//
//function fidoCallBack(){
//	setCookieData('fido');
//	 alert("[모바일 결재] 본인 인증되었습니다.");
//	 
//	 var result = "fido_success";
//	 document.getElementById("approval_view_inputpassword_new").value = result;
//	 //document.getElementById("fido_btn").style = "display:none";
//	 document.getElementById("approval_view_inputpassword_new").placeholder = "생체 인증 완료";
//}
//
//function setCookieData(type){ //undefined or fido
//	if($("#checkID").prop("checked")){
//		var loginVal; 
//		
//		if(type == "fido"){
//			loginVal = $("#fidoid").val();
//		}else{
//			loginVal = $("#id").val();
//		}
//		
//		coviCmn.setCookie("loginId", loginVal, 1);			
//	}else{			
//		coviCmn.setCookie("loginId", "", 1);
//	}
//	
//	//사용언어 설정 저장
//	coviCmn.setCookie("langCode", $('#langList').val(), 1);
//}	