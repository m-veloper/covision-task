/**
 * 결재선 지정 스크립트
 */
//# sourceURL=ApvlineManager.js

//getInfo 변경으로 수정
function getInfo(sKey) {
    try {
        if ('function' == typeof (m_oInfoSrc.getInfo) || 'object' == typeof (m_oInfoSrc.getInfo)) {
            return m_oInfoSrc.getInfo(sKey);
        }
        else {
            return m_oInfoSrc.g_dicFormInfo.item(sKey);
        }
    }
    catch (e) {
    	return undefined;
    }
}

function selectButton(obj){
	//선택된 버튼 text변경 
	$('#btnSelect').attr("value",obj.innerText);
	 
	var btnSelect = document.getElementById("btnSelect");
	$('#btnSelect').attr("onclick","doButtonAction(document.getElementById('"+obj.id+"'))");
	
	btnSelect.click();
	//버튼 리스트 숨김
	$('#dvCommonList').hide();
}

//---------------------------------------------------------------------------------

var standalone_mode = true; //JAL
var m_sApvMode;
var m_oInfoSrc;
var m_oFormMenu;
var m_oFormEditor;
var m_modeless = null;
var m_selectedDistRow = null;
var m_selectedDistRowId = null;
var m_RecDept = '';

JsonQuery.prototype.remove = function(key){
	  var realArray;
	  //obj > json=array > json(object)
	  if(this.invalid()) return this;
	  var jsoners, objects, oParents;
	  //키 삭제
	  if(key !== undefined && key !== ''){

	    var re = new RegExp(/^\d+$/);
	    var isIndex = re.test(key) === true;

	    var keys = [];
	    keys.push(key);

	    this.each(function(i, $$){
	      jsoners = $$.pack.jsoner;
	      if(isIndex){
	        deleteIndex(jsoners[0], key);
	        refreshJsonerLength(jsoners[0]);
	      }else{
	        deleteNode(jsoners, keys);
	      }
	    });
	    
	  } else {
	    //선택항목의 부모노드에서 키를 삭제
	    //삭제후 부모노드를 반환
		var pathArray = [];
	    this.each(function(i, $$){
	      var keys = [];
	      var selfJsoners = $$.pack.jsoner;
	      var lastNodeIndex = getLastNodeIndex(selfJsoners[0].path);
	      if(lastNodeIndex === ''){
	        jsoners = $$.parent().pack.jsoner;
	        keys = getKeys(selfJsoners);
	        deleteNode(jsoners, keys);
	      }else{
	    	jsoners = $$.parentArray().pack.jsoner;
	        realArray = $$.parent().find($$.nodename()).concat();
	        pathArray.push($$.path());
	        //deleteIndex(jsoners[0], lastNodeIndex);
	        //refreshJsonerLength(jsoners[0]);
	        console.log('index[' + lastNodeIndex + '] removed');
	      }
	    });
	    if(pathArray.length>=1){
	    	deleteArray(jsoners[0],realArray,pathArray);
	    }
	    //jsoners = this.parent().pack.jsoner;
	    //keys = getKeys(this.pack.jsoner);
	    //deleteNode(jsoners, keys);
	  }

	  return (new Jsoner(jsoners, this.root));  

	  function deleteIndex(jsoner, i){
	    jsoner.json.splice(i,1);
		//delete jsoner.json[i];
	  }
	  
	  function deleteArray(jsoners,realArray,pathArray){
		  jsoners.json.splice(0,jsoners.json.length);
		  
		  realArray.concat().each(function(i,obj){
			  if(!pathArray.includes(obj.path())){
				  jsoners.json.push(obj.json());
			  }
		  });
	  }
	  
	  function refreshJsonerLength(jsoner){
	  	if(Array.isArray(jsoner.json)){
	    	jsoner.length = jsoner.json.length;
	    }
	  }

	  function getKeys(jsoners){
	    var keys = [];
	    for(var i=0;i<jsoners.length;i++){
	      keys.push(jsoners[i]['node']);
	    }
	    return keys;
	  }
	  function deleteNode(jsoners, keys){
	    var key;
	    for(var i=0; i<jsoners.length; i++){
	      deleteSingleNode(jsoners[i], keys);
	    }  
	  }
	  function deleteSingleNode(jsoner, keys){
	    for(var j=0; j<keys.length; j++){
	      var key = keys[j];
	      delete jsoner.json[key];
	    }  
	  }
	  function getLastNodeIndex(path){
	    var arrSelfpath = path.split('/');
	    var selfnode = arrSelfpath[arrSelfpath.length-1];
	    if (selfnode.indexOf('[') < 0) return '';  
	    
	    var regExp = /\[([^)]+)\]/;
	    var matches = regExp.exec(selfnode);
	    return matches[1];
	  }
	}

//*페이지 로딩시 버튼 및 결재선 초기화
function initialize() {
	//parent -> opener
    if (openID != "") {//Layer popup 실행
        if ($("#" + openID + "_if", opener.document).length > 0) {
            m_oInfoSrc = $("#" + openID + "_if", opener.document)[0].contentWindow;
        } else { //바닥 popup
            m_oInfoSrc = opener;
        }
    } else {
        m_oInfoSrc = top.opener;
    }
    
    if (m_oInfoSrc == null) {
        m_oInfoSrc = opener.monitorList;
        if (m_oInfoSrc == null) {
            if (opener.location.href.toUpperCase().indexOf("LISTDEPT") > 0) { m_oInfoSrc = parent; }
            else { m_oInfoSrc = parent.ifrDL; }
        }
        m_oFormMenu = m_oInfoSrc;
        m_oFormEditor = m_oInfoSrc;
        m_sApvMode = getInfo("Request.mode")
        if (getInfo("Request.mode") == "READ") { trButton.style.display = "none"; }
    } else {
        m_sApvMode = getInfo("Request.mode");
        if (m_sApvMode == "CFADMIN") {
        	document.getElementById("btnOpen").style.display = "none";
        	document.getElementById("btnClose").style.display = "none";
        	document.getElementById("divApvLineMgrSub").style.display = "none";
        }
        m_oFormMenu = m_oInfoSrc;
        m_oFormEditor = m_oInfoSrc;
    }
    
    if (m_oInfoSrc != null){
    	initButtons(); //list를 그리고 생기는 버튼은 조작할 수 없어서 리스트 그리고 난 후로 위치 변경
    } 
    //changeTab("tPersonDeployList");
    return true;
}

//*버튼 초기화
function initButtons() {
    if (iItemNum < 999) {
        m_RecDept = m_oFormEditor.document.getElementsByName("ST_RECLINEOPD")[iItemNum].value;
    } else {
        m_RecDept = m_oFormEditor.document.getElementById("RECEIVEGOV_NAMES").value;
    }

    //배포처 size 키우기
    if (getInfo("SchemaContext.scIPub.isUse") == "Y") {
        chkAction(mType);
        $("#divtPersonDeployList").attr("style", "display:;");
        if (getInfo("SchemaContext.scGRec.isUse") == "Y") {
            $("#divtDeployList").attr("style", "display:;"); //park
        }
    }

    switch (m_sApvMode) {
	    case "REDRAFT":
	        $("#divtApvLine").attr("style", "display:;");
	        $("#groupTreeDiv").attr("style", "display:none;");//추가
	        $("#btnClose").attr("style", "display:;");
	        $("#divApvLineMgrSub").css({ "display": "block" });
	        break;
	    case "DRAFT":
	    	$("#groupTreeDiv").attr("style", "display:none;");
	    	$("#btnClose").attr("style", "display:;");
	    	$("#divApvLineMgrSub").css({ "display": "block" });
	}
}

function setApvList() {
    //배포처 관련 시작
    var sRec0 = "";
    var sRec1 = "";
    var sRec2 = "";    
    if (iItemNum < 999) {
    	m_oFormEditor.document.getElementsByName("ST_RECLINEOPD")[iItemNum].value = m_RecDept;
        m_oFormEditor.initGovListMulti_V1(iItemNum);
    } else {
    	m_oFormEditor.document.getElementById("RECEIVEGOV_NAMES").value = m_RecDept;
    	
    	var sReceiveGovInfo = "";

        for (var i = 0; i < m_RecDept.split(";").length; i++) {
            if (m_RecDept.split(";")[i] != '') {
                if (sReceiveGovInfo == "") {
                    sReceiveGovInfo = m_RecDept.split(";")[i].split(":")[13];
                } else {
                    sReceiveGovInfo += ", " + m_RecDept.split(";")[i].split(":")[13];
                }
            }
        }
        
        if(m_oFormEditor.document.getElementById("RECEIVEGOV_INFO").nodeName == "SPAN") {
        	m_oFormEditor.document.getElementById("RECEIVEGOV_INFO").innerHTML = sReceiveGovInfo;
        } else {
        	m_oFormEditor.document.getElementById("RECEIVEGOV_INFO").value = sReceiveGovInfo;
        }
    }
    
    if (openID == "L") {
        Common.Close();
    } else if (openID != "" && parent.length > 0) {
    	parent.Common.Close("btLine" + getInfo("FormInstanceInfo.FormInstID"));
    } else {
    	window.close();
    }
}
function joinAttrs(elmList, sAttrName) {
    if (elmList.length == 0) return "";
    var sJoin = "";
    var elm = elmList.nextNode();
    while (elm != null) {
        sJoin += (sJoin == "" ? "" : ";") + elm.getAttribute(sAttrName);
        elm = elmList.nextNode();
    }
    elmList.reset();
    return sJoin;
}
function doButtonAction(obj) {
    var bSetDirty = false;
    
    switch (obj.id) {
        case "btGroup": bSetDirty = true; addGroup(); break;
        case "btOK": setApvList(); break;
        case "btExit": if (openID != "" && parent.length > 0) { parent.Common.Close("btLine" + getInfo("FormInstanceInfo.FormInstID")); } else { window.close(); } break;
        case "btRecDept": addRecDept(); break;
        case "btDeleteRec": delList(); break;
        case "btUpDeploy": bSetDirty = true; moveUpDownDeploy("UP"); break;
        case "btDownDeploy": bSetDirty = true; moveUpDownDeploy("DOWN"); break;

    }
    if (bSetDirty) try { if (m_oFormMenu.contentWindow) { m_oFormMenu.contentWindow.setApvDirty(); } else { m_oFormMenu.setApvDirty(); } } catch (e) { }
}

var g_szAcceptLang = "ko";

/*************************************************************************
함수명 : containsCharsOnly
기  능 : 특정문자가 존재하는지 체크
인  수 : input, chars - 객체, 찾고자하는 문자
리턴값 : 존재하면 true
**************************************************************************/
function containsCharsOnly(input, chars) {
    for (var inx = 0; inx < input.length; inx++) {
        if (chars.indexOf(input.charAt(inx)) == -1)
            return false;
    }
    return true;
}

/*************************************************************************
함수명 : isNumber
기  능 : 입력값이 숫자인지를 체크
인  수 : input - 입력값
리턴값 : 숫자 true , 숫자외문자 false
**************************************************************************/
function isNumber(input) {
    var chars = "0123456789";
    if (input == "") return false;
    return containsCharsOnly(input, chars);
}

function get_choiseIdOrName(IdName) {
    var tmpValue = "";
    if (m_oFormMenu.contentWindow) {
        tmpValue = m_oFormMenu.contentWindow.document.getElementsByName(IdName)[0].value;
    }
    else {
        tmpValue = m_oFormMenu.children.item(IdName).value;
    }
    return tmpValue;
}
function set_choiseIdOrName(IdName) {
    var tmpobj;
    if (m_oFormMenu.contentWindow) {
        tmpobj = m_oFormMenu.contentWindow.document.getElementsByName(IdName)[0];
    }
    else {
        tmpobj = m_oFormMenu.children.item(IdName);
    }
    return tmpobj;
}

function replaceCR(s) {
    return s.replace(/\n/g, "<br>");
}

function selectDistRow(e) {
    var evt = (window.event) ? window.event : e;
    var oRow;
    oRow = (evt.srcElement) ? evt.srcElement : evt.target;
    if (oRow != null) {
        switchDistSelectedRow(oRow);
    } else {
        m_selectedDistRow = null;
        m_selectedDistRowId = null;
    }

}

function switchDistSelectedRow(oRow) {
    while (oRow != null && oRow.tagName != "TR") {
        oRow = oRow.parentNode;
    }
    if (oRow != null) {
        if (m_selectedDistRow != null) {
            m_selectedDistRow.style.backgroundColor = "#FFFFFF";
        }

        oRow.style.backgroundColor = "#EEF7F9";
        m_selectedDistRow = oRow;
        m_selectedDistRowId = oRow.id;
    }
}

function changeTab(pStrID) {
    $("#divExt").children("li").each(function (i, oLi) {
        if ($(this).attr("id") == "div" + pStrID) {
            if (pStrID == "tApvLine") $(this).attr("class", "app_line_conf_r_tab_on");
            else $(this).attr("class", "app_line_conf_r_tab_on2");
            $("#divdetail" + pStrID).css({ "display": "block" });
            if ($("#divdetail" + pStrID).html().length == 0) {
            }
        }
        else {
            if (oLi.id == "divtApvLine") $(this).attr("class", "app_line_conf_r_tab_off");
            else $(this).attr("class", "app_line_conf_r_tab_off2");
            $("#divdetail" + ($(this).attr("id")).replace("div", "")).css({ "display": "none" });
        }
    });
}
//*개인결재선 보기/닫기
function fnShowApvLineMgr(pStrMode) {
    //사이즈 조정 넣을 것
    if (pStrMode == "open") {//plus -> open
    	$("#groupTreeDiv").css({"display":"none"}); //조직도 트리 숨김
    	$("#btnOpen").css({"display":"none"});	//open 버튼 비활성화
    	$("#btnClose").css({"display":""});	//close 버튼 비활성화
    	$("#divApvLineMgrSub").css({ "display": "" });
    	$("#orgSearchListMessage").css("left","75px");
    } else {
    	$("#groupTreeDiv").css({"display":""}); //조직도 트리 보기게
    	//$("#btnOpen").css({ "display": "block" });
    	$("#btnClose").css({ "display": "none" });
    	$("#divApvLineMgrSub").css({ "display": "none" });
    	$("#orgSearchListMessage").css("left","295px");
    }
}
// 트리, 검색결과에서 같은 데이터 선택시 체크 (결재선 팝업)
function isDupl(obj, mJson, boolKeynameIncluded) {
	var tar = obj.json(boolKeynameIncluded).item;
	// 트리 관련된 item 제거
	for(var x in tar) {
	    if(x == "__index" || x == "open" || x == "display" || x == "pHash" || x == "hash" || x == "__isLastChild" || x == "__subTreeLength") {
	    	delete tar[x];
	    }
	}

	var tarList = mJson.find("selected > group > item").json(boolKeynameIncluded).item;
	var duplFg = false;	// 중복 Flag
	
	if (typeof(tarList) != "undefined") {
		var tarLen = tarList.length;
		var tarStr = JSON.stringify(tar);
		
		if (tarLen > 1) {
			$.each(tarList, function(i, v) {
    			if (JSON.stringify(v) == tarStr) {
    				duplFg = true;
    			}	            				
			});
		} else {
			if (JSON.stringify(tarList) == tarStr) {
				duplFg = true;
			}
		}
	}
	
	return duplFg;
}
//배포처 수정 시작
function addRecDept() {
    var $$_m_Json = $$({
       "selected": {
          "to": {},
          "cc": {},
          "bcc": {},
          "user": {},
          "group": {},
          "role": {}
       }
    });
    var sSelectedUserJson = aContentAdd_OnClick();
    var $$_m_JsonExt = $$(sSelectedUserJson);
    //const BOOL_KEYNAME_INCLUDED = true;  //[IE 10 이하  const 사용 오류]
    var BOOL_KEYNAME_INCLUDED = true;				// 선언 이외의 곳에서 값 변경 X

    var bUser = false;
    $$_m_JsonExt.find("Items > item").concat().each(function (i, $$) {
        var $$_json = $$.json(BOOL_KEYNAME_INCLUDED);
        
        // 선택된 데이터 중 중복 되지 않은 데이터만
    	if (!isDupl($$, $$_m_Json, BOOL_KEYNAME_INCLUDED)) {
    		$$_m_Json.find("selected > group ").append($$_json);
    	}
        
    });
    setDistDept($$_m_Json.find("selected"));
}

function delList(obj) {
	var oSelTR;

	if(obj!=undefined && obj !=null){ //개별 삭제 버튼 (row에 위치하는 삭제 버튼을 클릭한 경우
		oSelTR = $(obj).closest('tr')[0];
	}else{
		 oSelTR = getSelectedDistRow();
	}
   
    var sRecDept = "";
    if (oSelTR != null) {
        if (oSelTR.id != null) {
            var aRecDept = m_RecDept.split(";");
            for (var i = 0; i < aRecDept.length; i++) {
                if (aRecDept[i] != "") {
                    if (aRecDept[i].split(":")[1] == oSelTR.id) {
                        aRecDept[i] = "";
                    }
                }
            }
            for (var i = 0; i < aRecDept.length; i++) {
                if (aRecDept[i] != "") sRecDept += ";" + aRecDept[i];
            }
            m_RecDept = sRecDept;
            if (m_RecDept.indexOf(";") == 0) m_RecDept = m_RecDept.substring(1);
        } else {
            if (oSelTR.type == "0") {
                Common.Warning(strMsg_187); //"배포리스트 구분을 조직도를 선택하세요."
            } else {
                Common.Warning(strMsg_188); //"배포리스트 구분을 배포리스트를 선택하세요."
            }
        }
        chkAction(mType);
    }
}

function moveUpDownDeploy(str) {

    var tmpTR;
    var tmpIndex;
    var oSelTR = getSelectedDistRow();
    if (oSelTR == null) {
        Common.Warning(coviDic.dicMap["msg_apv_Line_UnSelect"]);
        return false;
    }
    if (oSelTR.id != null) {
        var aRecDept = m_RecDept.split(";");
        for (var i = 0; i < aRecDept.length; i++) {
            if (aRecDept[i] != "") {
                if (aRecDept[i].split(":")[1] == oSelTR.id) {
                    if (str == "UP") {
                        if (i > 0) {
                            var sTemp = "";
                            sTemp = aRecDept[i - 1];
                            aRecDept[i - 1] = aRecDept[i];
                            aRecDept[i] = sTemp;
                        }
                    } else {
                        if (i < aRecDept.length - 1) {
                            var sTemp = "";
                            sTemp = aRecDept[i + 1];
                            aRecDept[i + 1] = aRecDept[i];
                            aRecDept[i] = sTemp;
                            i = aRecDept.length;
                        }
                    }
                }
            }
        }
        var sRecDept = "";
        for (var i = 0; i < aRecDept.length; i++) {
            if (aRecDept[i] != "") sRecDept += ";" + aRecDept[i];
        }
        m_RecDept = sRecDept;
        if (m_RecDept.indexOf(";") == 0) m_RecDept = m_RecDept.substring(1);
        chkAction(mType);
        switchDistSelectedRow($("#" + oSelTR.id)[0]);
    }
}

//배포처 추가 
var mType = 0;
var sCheckBoxFormat = "";
var bchkAbsent = false;
function setDistDept($$_oList) {
	
    var aRecDept = m_RecDept.split(";");
    var elmList, emlNode;
    var sRecDept = "";
    var $$_elmList = $$_oList.find("item");
    
    $$_elmList.concat().each(function (i, $$_emlNode) {
       if (chkDuplicate($$_emlNode.attr("OUCODE"))) {
            var sDN = $$_emlNode.attr("UCORGFULLNAME");
            var sType = "0";
            
            sRecDept += ";" + sType + ":" + $$_emlNode.attr("OUCODE");
            sRecDept += ":" + $$_emlNode.attr("OUORDER");
            sRecDept += ":" + sDN.replace(/;/gi, "^");
            sRecDept += ":" + $$_emlNode.attr("OU");
            sRecDept += ":" + $$_emlNode.attr("TOPOUCODE");
            sRecDept += ":" + $$_emlNode.attr("DN");
            sRecDept += ":" + $$_emlNode.attr("REPOUCODE");
            sRecDept += ":" + $$_emlNode.attr("PARENTOUCODE");
            sRecDept += ":" + $$_emlNode.attr("PARENTOUNAME");
            sRecDept += ":" + $$_emlNode.attr("OULEVEL");
            sRecDept += ":" + $$_emlNode.attr("HASSUBOU");
            
            sRecDept += ":X";
            sRecDept += ":" + $$_emlNode.attr("DISPLAY_UCCHIEFTITLE");
        }
    });
    m_RecDept += sRecDept;
    if (m_RecDept.indexOf(";") == 0) m_RecDept = m_RecDept.substring(1);
    chkAction(mType);
}

function chkAction(actType) {
    if (m_sApvMode.toUpperCase() != "DEPTLIST" && m_sApvMode.toUpperCase() != "CFADMIN") {
        mType = actType;

        make_selRec();
        if (mType == "2" && selTab != "tDeployList") {
            changeTab("tDeployList");
        }
    }
}

function make_selRec() {
    var otbl = document.getElementById("tblrecinfo");
    var tbllength = otbl.rows.length;
    //Table 지우기
    for (var i = 0; i < tbllength - 2; i++) {
        otbl.deleteRow(tbllength - i - 1);
    }

    var eTR, eTD, aRec;

    var sRec = m_RecDept.split(";");
    if (m_RecDept == "") return;
    for (var i = 0; i < sRec.length; i++) {
        if (sRec[i] != "" && sRec[i] != null) {
            aRec = sRec[i].split(":");
            eTR = otbl.insertRow(otbl.rows.length);
            
            eTR.setAttribute("id", aRec[1]);
            eTR.setAttribute("OUCODE", aRec[1]);
            eTR.setAttribute("OUORDER", aRec[2]);
            eTR.setAttribute("UCORGFULLNAME", XFN_Replace(aRec[3], "^", ";"));
            eTR.setAttribute("OU", aRec[4]);
            eTR.setAttribute("TOPOUCODE", aRec[5]);
            eTR.setAttribute("DN", aRec[6]);
            eTR.setAttribute("REPOUCODE", aRec[7]);
            eTR.setAttribute("PARENTOUCODE", aRec[8]);
            eTR.setAttribute("PARENTOUNAME", aRec[9]);
            eTR.setAttribute("OULEVEL", aRec[10]);
            eTR.setAttribute("HASSUBOU", aRec[11]);
            eTR.setAttribute("mType", aRec[0]);
            eTR.setAttribute("mKind", aRec[12]);

            $(eTR).bind("mousedown", selectDistRow);

            var strName = aRec[13];
            //JAL
            if(standalone_mode) {
                eTD = eTR.insertCell(eTR.cells.length);
                eTD.innerHTML = strName.split('^')[0];
                eTD.height = 20 + "px";
            } else {
                eTD = eTR.insertCell(eTR.cells.length); eTD.innerHTML = m_oFormEditor.getLngLabel(strName, false, "^"); eTD.height = 20 + "px";
            }
            
            if (aRec[0] == "0") {
                eTD = eTR.insertCell(eTR.cells.length);

                if (aRec[12] == "Y") {
                    eTD.innerHTML = "<INPUT id='' Type='Checkbox' class='input_check8' "
                                    + "onclick=\"changeCheckBox('" + aRec[12] + "','" + aRec[1] + "','" + aRec[3] + "')\" style=\"padding-right=15px\" CHECKED>" + Common.GetDic("lbl_apv_recinfo_td2");
                } else if (aRec[12] == "X") {
                } else {
                    if (sCheckBoxFormat.indexOf(";" + aRec[1] + ":") > -1) {
                        eTD.innerHTML = "<INPUT id='' Type='Checkbox' disabled class='input_check8' "
                                    + "onclick=\"changeCheckBox('" + aRec[12] + "','" + aRec[1] + "','" + aRec[3] + "')\" style=\"padding-right=15px\" >" + Common.GetDic("lbl_apv_recinfo_td2");
                    } else {
                        eTD.innerHTML = "<INPUT id='' Type='Checkbox' class='input_check8' "
                                    + "onclick=\"changeCheckBox('" + aRec[12] + "','" + aRec[1] + "','" + aRec[3] + "')\" style=\"padding-right=15px\" >" + Common.GetDic("lbl_apv_recinfo_td2");
                    }
                }

            } else {
                eTD = eTR.insertCell(eTR.cells.length);
                eTD.innerHTML = "&nbsp;";
            }
            
            //삭제 버튼 추가
            eTD = eTR.insertCell(eTR.cells.length);
            eTD.innerHTML = "<a href='#' class='icnDel' onclick='delList(this)'>"+coviDic.dicMap["btn_apv_delete"]+"</a>";
        }
    }
    return;
}

function chkDuplicate(code) {
    var cmpIndex = m_RecDept.indexOf(code);

    //비슷한 부서코드 추가 시 배포목록에 추가 되지않아 수정
    var arr = new Array();
    var check = true;
    if (m_RecDept.replace(/;/g,"").length > 0) {
        var index = m_RecDept.split(";").length;

        for (var i = 0; i < index; i++) {
            //arr.push(m_RecDept.split(";")[i + 2].split(":")[1]);
        	arr.push(m_RecDept.split(";")[i].split(":")[1]);
        }
    }
    if (arr != '') {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == code) {
                check = false;
            }
        }

        return check;
    } else {
        if (cmpIndex < 0) { return true; } else { return false; }
    }
}

function XFN_Replace(pString, pStringMode1, pStringMode2) {
    var sReturn = "";
    var aReturn = pString.split(pStringMode1);
    for (var i = 0; i < aReturn.length; i++) {
        if (i > 0) sReturn += pStringMode2;
        sReturn += aReturn[i];
    }
    if (sReturn == "") sReturn = pString;
    return sReturn;
}

function getSelectedDistRow() { return m_selectedDistRow; }

function changeCheckBox(type, code, name) {

    var sRecDept = m_RecDept;

    if (sRecDept.indexOf(code + ":" + name + ":N") > -1) {
        sRecDept = sRecDept.replace(code + ":" + name + ":N", code + ":" + name + ":Y");
    } else {
        sRecDept = sRecDept.replace(code + ":" + name + ":Y", code + ":" + name + ":N");
    }
    m_RecDept = sRecDept;
}
//배포처 수정 끝

var _aStrDic = Common.getDicAll('lbl_SearchEmployees;lbl_SearchDepartment');

// 조직도 트리를 조회하고 상단 검색 컨트롤은 초기화 합니다.
// 검색어가 있을 경우 검색을 실시하고,
// 검색어가 없을 경우 조직도 트리에서 조회를 실시합니다.
$(document).ready(function () {
    //OrgTree_Binding();

    $("#txtSearchText").focus(function () {
        txtSearchText_OnFocus();
    });
    $("#txtSearchText").blur(function () {
        txtSearchText_OnBlur();
    });
    $("#txtSearchText").keypress(function () {
        txtSearchText_OnKeyPress();
    });
    $("#chkSearchDept").change(function () {
        chkSearchDept_OnChange();
    });

    var sSearchText = $("#txtSearchText").val();
    var sSearchType = $("#ddlSearchTypeUser").val(); // 사용자 검색용
    if ($("#chkSearchDept").is(":checked")) {
        sSearchType = $("#ddlSearchTypeDept").val(); // 부서 검색용
    }

    if ((sSearchType == "") &&
                    ((sSearchText == _aStrDic["lbl_SearchDepartment"]) ||
                    (sSearchText == _aStrDic["lbl_SearchEmployees"]))) {
        $("#hidSearchType").val(sSearchType);
        $("#hidSearchText").val("");
        divSearchList_Binding();
    }
});

//==========================================
// 상단 검색 영역
//==========================================
// 부서 검색 여부 선택에 따라 드룹다운 컨트롤 표시를 변경합니다.
function chkSearchDept_OnChange() {
    var bSearchDept = $("#chkSearchDept").is(":checked");
    if (bSearchDept) {
        $("#ddlSearchTypeUser").css({ "display": "none" });     // 사용자 검색용 비 활성화
        $("#ddlSearchTypeDept").css({ "display": "block" });    // 부서 검색용 활성화
    }
    else {
        $("#ddlSearchTypeUser").css({ "display": "block" });    // 사용자 검색용 활성화
        $("#ddlSearchTypeDept").css({ "display": "none" });     // 부서 검색용 비 활성화
    }
    txtSearchText_OnBlur();
}

// 검색어 입력칸에 포커스 이동시 실행됩니다.
function txtSearchText_OnFocus() {
    if (($("#txtSearchText").val() == _aStrDic["lbl_SearchDepartment"]) ||
                    ($("#txtSearchText").val() == _aStrDic["lbl_SearchEmployees"])) {
        $("#txtSearchText").val("");
    }
}

// 검색어 입력칸에 키 입력시 실행됩니다.
function txtSearchText_OnKeyPress() {
    if (event.keyCode == 13) {
        this.btnSearch_OnClick();
    }
}

// 검색어 입력칸에서 포커스 잃을 때 실행됩니다.
function txtSearchText_OnBlur() {
    if (($("#txtSearchText").val() == "") ||
                    ($("#txtSearchText").val() == _aStrDic["lbl_SearchDepartment"]) ||
                    ($("#txtSearchText").val() == _aStrDic["lbl_SearchEmployees"])) {
        if ($("#chkSearchDept").is(":checked")) {
            $("#txtSearchText").val(_aStrDic["lbl_SearchDepartment"]);  // 부서 검색
        }
        else {
            $("#txtSearchText").val(_aStrDic["lbl_SearchEmployees"]);   // 사용자 검색
        }
    }
}

// 입력된 조건을 기준으로 검색을 실시합니다.
function btnSearch_OnClick() {
    var sSearchType = $("#ddlSearchTypeUser").val(); // 사용자 검색용
    if ($("#chkSearchDept").is(":checked")) {
        sSearchType = $("#ddlSearchTypeDept").val(); // 부서 검색용
    }

    if (sSearchType == "") {
        Common.Warning(coviDic.dicMap["msg_apv_OrgMap01"]);  // 검색조건을 선택하여 주십시오.
        return;
    }
    $("#hidSearchType").val(sSearchType);

    var sSearchText = $("#txtSearchText").val();
    if ((sSearchText == _aStrDic["lbl_SearchDepartment"]) ||
                    (sSearchText == _aStrDic["lbl_SearchEmployees"])) {
        sSearchText = "";
    }
    if (sSearchText.length < 2) {
        Common.Warning(coviDic.dicMap["msg_Common_07"]);  // 검색어는 2글자 이상 입력하여 주십시오.
        return;
    }
    $("#hidSearchText").val(sSearchText);

    this.divSearchList_Binding();
}

//==========================================
// 2열 결과 조회 영역
//==========================================

// 조건에 따른 검색을 실시합니다.
// 검색 결과는 divSearchList에 표시합니다.
function divSearchList_Binding() {
    var sType = $("#hidType").val();
    var sDN_ID = $("#ddlDomain").val();
    var sTarget = "U";

    // 사용자 최초 조회시 요약화면으로 나오게 하는 부분
    var sViewType = "LIST";
    if ($("#chkSearchDept").is(":checked")) {
        $("#divViewType").css({ "display": "none" });
        sTarget = "D";
        sViewType = "LIST";
    }
    else {
        $("#divViewType").css({ "display": "block" });
        //결재선 관리 SUMMRY 보기 없음
        //                    if ($("#divSearchUserSummary").css("display") != "none") {
        //                        sViewType = "SUMMARY";
        //                    }
    }
    var sSearchType = $("#hidSearchType").val();
    var sSearchText = $("#hidSearchText").val();

    var sURL = "/WebSite/Approval/Address/ListItems.aspx?Type=" + sType + "&DN_ID=" + sDN_ID + "&Target=" + sTarget + "&SearchType=" + sSearchType + "&SearchText=" + escape(sSearchText) + "&ViewType=" + sViewType;
    Common.AjaxLoad("divSearchList", sURL, {}, null);

    this.btnListViewType_OnClick("SEARCH");
    this.btnViewType_OnClick(sViewType);
}

// 검색/최근선택 리스트 보기를 변경합니다.
function btnListViewType_OnClick(pStrType) {
    if (pStrType == "SEARCH") {
        // 검색리스트
        $("#aSearch").attr("class", "t_on").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab.gif");
        $("#aOftenSelected").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");

        if ($("#chkSearchDept").is(":checked")) {
            $("#divViewType").css({ "display": "none" });
        }
        else {
            if ($("#divSearchDeptList").css("display") == "none") {
                $("#divViewType").css({ "display": "block" });
            }
        }
        $("#divSearchList").css({ "display": "block" });
        $("#divOftenSelectedList").css({ "display": "none" });
    }
    else if (pStrType == "OFTENSELECTED") {
        // 자주 선택리스트
        $("#aSearch").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");
        $("#aOftenSelected").attr("class", "t_on").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab.gif");

        $("#divViewType").css({ "display": "none" });
        $("#divSearchList").css({ "display": "none" });
        $("#divOftenSelectedList").css({ "display": "block" });
    }
    else if (pStrType == "ALL") {
        // 전체항목
        $("#aSelectedAll").attr("class", "t_on").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab.gif");
        $("#aSelectedNew").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");
        $("#aSelectedOld").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");

        $("#divSelectedAll").css({ "display": "block" });
        $("#divSelectedNew").css({ "display": "none" });
        $("#divSelectedOld").css({ "display": "none" });
    }
    else if (pStrType == "NEW") {
        // 추가항목
        $("#aSelectedAll").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");
        $("#aSelectedNew").attr("class", "t_on").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab.gif");
        $("#aSelectedOld").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");

        $("#divSelectedAll").css({ "display": "none" });
        $("#divSelectedNew").css({ "display": "block" });
        $("#divSelectedOld").css({ "display": "none" });
    }
    else if (pStrType == "OLD") {
        // 기존항목
        $("#aSelectedAll").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");
        $("#aSelectedNew").attr("class", "t_off").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab2.gif");
        $("#aSelectedOld").attr("class", "t_on").children("img").filter(":first").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/ico_tab.gif");

        $("#divSelectedAll").css({ "display": "none" });
        $("#divSelectedNew").css({ "display": "none" });
        $("#divSelectedOld").css({ "display": "block" });
    }
}

// 요약/리스트 보기를 변경합니다.
function btnViewType_OnClick(pStrType) {
    if (pStrType == "SUMMARY") {
        // 요약 보기
        $("#imgSummaryView").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/sum_over.gif");
        $("#imgListView").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/list_off.gif");
        $("#divSearchUserSummary").css({ "display": "block" });
        $("#divSearchUserList").css({ "display": "none" });
    }
    else if (pStrType == "LIST") {
        // 리스트 보기
        $("#imgSummaryView").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/sum_off.gif");
        $("#imgListView").attr("src", "/HtmlSite/smarts4j_n/covicore/resources/images/covision/list_over.gif");
        $("#divSearchUserSummary").css({ "display": "none" });
        $("#divSearchUserList").css({ "display": "block" });
    }
}

// 검색 결과의 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
function chkSearchAll_OnChange() {
    var bChecked = $("#chkSearchAll").is(":checked");

    if ($("#divSearchDeptList").css("display") != "none") {
        $("input[id^='chkSearchDeptList']").attr("checked", bChecked);
    }
    else if ($("#divSearchUserSummary").css("display") != "none") {
        $("input[id^='chkSearchUserSummary']").attr("checked", bChecked);
        $("input[id^='chkSearchUserList']").attr("checked", bChecked);
    }
    else if ($("#divSearchUserList").css("display") != "none") {
        $("input[id^='chkSearchUserList']").attr("checked", bChecked);
        $("input[id^='chkSearchUserSummary']").attr("checked", bChecked);
    }
}

// 검색 결과의 요약 보기 각 항목의 체크박스 선택 변경시 목록 보기의 체크박스 선택을 변경합니다.
function chkSearchUserSummary_OnChange(pStrCode) {
    $("input[id^='chkSearchUserList'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSearchUserSummary'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}
// 검색 결과의 요약 보기 각 항목의 체크박스 선택 변경시 목록 보기의 체크박스 선택을 변경합니다.
// 검색 결과의 요약 보기에서 더블클릭 시 무조건 체크박스 true 하여 결재자로 추가됨.
function chkSearchUserList_Checked(pStrCode) {
    $("input[id^='chkSearchUserList'][value='" + pStrCode + "']").filter(":first").attr("checked", true);
}

// 검색 결과의 목록 보기 각 항목의 체크박스 선택 변경시 요약 보기의 체크박스 선택을 변경합니다.
function chkSearchUserList_OnChange(pStrCode) {
    $("input[id^='chkSearchUserSummary'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSearchUserList'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 자주 선택 항목 중 임직원의 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
function chkOftenSelectedUserAll_OnChange() {
    $("input[id^='chkOftenSelectedUser']").attr("checked", $("#chkOftenSelectedUserAll").attr("checked"));
}

// 자주 선택 항목 중 부서의 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
function chkOftenSelectedDeptAll_OnChange() {
    $("input[id^='chkOftenSelectedDept']").attr("checked", $("#chkOftenSelectedDeptAll").attr("checked"));
}

//==========================================
// 3열 추가/삭제 버튼
//==========================================

// 추가 버튼 클릭시 실행되며, 화면에 표시중인 목록/트리 중 선택된 항목을 추가합니다.
// 조직도 트리는 축소(-)해도 선택한 항목을 추가하도록 합니다.
// 선택 목록의 전체/추가 항목에 같은 내용을 추가하도록 합니다.
function aContentAdd_OnClick() {
    function makeItem(oThis, arrItem){
        if (oThis.is(":checked")) {
            var item = oThis.val().replace(/&/g, "&amp;");
            arrItem.push(JSON.parse(item));
            oThis.attr("checked", false);
        }
    }

    var arrItem = [], item;
    // 트리
    $("input[id^='groupTree_treeCheckbox']").each(function () {
        makeItem($(this), arrItem);
    });

    // 검색/자주선택
    if ($("#divSearchDeptList").css("display") != "none") {
        $("input[id^='orgSearchList_dept']").each(function () {
        	makeItem($(this), arrItem);
        });
    }

    var items = {
        Items: { 
            item: arrItem
        }
    };


    return items;
}

// 선택 목록에서 화면이 표시중인 목록의 선택된 항목을 제거 합니다.
// 선택 목록의 전체 항목에서 제거시, 추가/기존 항목의 같은 내용은 같이 지워줍니다.
// 선택 목록의 추가/기존 항목에서 제거시, 전체 항목의 같은 내용은 같이 지워줍니다.
function aContentDel_OnClick() {
    if ($("#divSelectedAll").css("display") != "none") {
        $("input[id^='chkSelectedAllUser']").each(function () {
            if (($(this).attr("id") != "chkSelectedAllUserAll") &&
                            ($(this).is(":checked"))) {
                $(this).parent().remove();
                $("input[id^='chkSelectedNewUser'][value='" + $(this).val() + "']").filter(":first").parent().remove();
                $("input[id^='chkSelectedOldUser'][value='" + $(this).val() + "']").filter(":first").parent().remove();
            }
        });
        $("input[id^='chkSelectedAllDept']").each(function () {
            if (($(this).attr("id") != "chkSelectedAllDeptAll") &&
                            ($(this).is(":checked"))) {
                $(this).parent().remove();
                $("input[id^='chkSelectedNewDept'][value='" + $(this).val() + "']").filter(":first").parent().remove();
                $("input[id^='chkSelectedOldDept'][value='" + $(this).val() + "']").filter(":first").parent().remove();
            }
        });
    }
    else if ($("#divSelectedNew").css("display") != "none") {
        $("input[id^='chkSelectedNewUser']").each(function () {
            if (($(this).attr("id") != "chkSelectedNewUserAll") &&
                            ($(this).is(":checked"))) {
                $("input[id^='chkSelectedAllUser'][value='" + $(this).val() + "']").filter(":first").parent().remove();
                $(this).parent().remove();
            }
        });
        $("input[id^='chkSelectedNewDept']").each(function () {
            if (($(this).attr("id") != "chkSelectedNewDeptAll") &&
                            ($(this).is(":checked"))) {
                $("input[id^='chkSelectedAllDept'][value='" + $(this).val() + "']").filter(":first").parent().remove();
                $(this).parent().remove();
            }
        });
    }
    else if ($("#divSelectedOld").css("display") != "none") {
        $("input[id^='chkSelectedOldUser']").each(function () {
            if (($(this).attr("id") != "chkSelectedOldUserAll") &&
                            ($(this).is(":checked"))) {
                $("input[id^='chkSelectedAllUser'][value='" + $(this).val() + "']").filter(":first").parent().remove();
                $(this).parent().remove();
            }
        });
        $("input[id^='chkSelectedOldDept']").each(function () {
            if (($(this).attr("id") != "chkSelectedOldDeptAll") &&
                            ($(this).is(":checked"))) {
                $("input[id^='chkSelectedAllDept'][value='" + $(this).val() + "']").filter(":first").parent().remove();
                $(this).parent().remove();
            }
        });
    }
}

//==========================================
// 4열 선택 결과 영역
//==========================================

// 조직도 오픈시 기존에 선택된 항목을 화면에 표시하도록 합니다.
function divSelectedItem_Binding() {
    var sSelectedItems = $("#" + $("#hidSelectedItemID").val(), parent.document).val();
    if ((sSelectedItems == null) ||
                    (sSelectedItems == "")) {
        return;
    }

    var sUser = "";
    var sDept = "";
    $($.parseXML(sSelectedItems)).find("ItemInfo").each(function () {
        if ($(this).attr("itemType").toUpperCase() == "GROUP") {
            sDept += $(this).find("GroupCode").text() + ",";
        }
        else {
            sUser += $(this).find("UserCode").text() + ",";
        }
    });

    var sURL = Common.GetPgModule("Portal.WebService");
    var oResult = CFN_CallAjaxJson(sURL + "/OrgMapSelectedLoad", "{ pStrDept:'" + sDept + "', pStrUser:'" + sUser + "' }", false, null);

    var bSucces = eval($.parseJSON(oResult).d[0].Value);
    var sResult = $.parseJSON(oResult).d[1].Value;

    if (bSucces) {
        $($.parseXML(sResult)).find("ItemInfo").each(function () {
            ulSelectedAll_Binding($(this), "OLD");
            ulSelectedOld_Binding($(this));
        });
    } else {
        Common.Error(sResult);
    }
}

// 선택목록의 전체 항목에 입력받은 개체를 추가합니다.
function ulSelectedAll_Binding(pObjItem, pStrType) {
    if (pObjItem.attr("itemType").toUpperCase() == "USER") {
        $("#ulSelectedAllUser").append(this.liSelectedUser(pObjItem, "SelectedAllUser", pStrType));
    }
    else {
        $("#ulSelectedAllDept").append(this.liSelectedDept(pObjItem, "SelectedAllDept", pStrType));
    }
}

// 선택목록의 추가 항목에 입력받은 개체를 추가합니다.
function ulSelectedNew_Binding(pObjItem) {
    if (pObjItem.attr("itemType").toUpperCase() == "USER") {
        $("#ulSelectedNewUser").append(this.liSelectedUser(pObjItem, "SelectedNewUser", ""));
    }
    else {
        $("#ulSelectedNewDept").append(this.liSelectedDept(pObjItem, "SelectedNewDept", ""));
    }
}

// 선택목록의 기존 항목에 입력받은 개체를 추가합니다.
function ulSelectedOld_Binding(pObjItem) {
    if (pObjItem.attr("itemType").toUpperCase() == "USER") {
        $("#ulSelectedOldUser").append(this.liSelectedUser(pObjItem, "SelectedOldUser", ""));
    }
    else {
        $("#ulSelectedOldDept").append(this.liSelectedDept(pObjItem, "SelectedOldDept", ""));
    }
}

// 선택 목록에 표시할 임직원정보 HTML을 생성합니다.
function liSelectedUser(pObjItem, pStrName, pStrType) {
    var sCode = pObjItem.find("UR_Code").text();
    var sID = pStrName + sCode;
    var sUserName = CFN_GetDicInfo(pObjItem.find("ExDisplayName").text(),langCode);
    var sGroupName = CFN_GetDicInfo(pObjItem.find("ExGroupName").text(),langCode);
    var sJobTitleName = CFN_GetDicInfo(pObjItem.find("ExJobTitleName").text().split("&")[1],langCode);
    var sJobPositionName = CFN_GetDicInfo(pObjItem.find("ExJobPositionName").text().split("&")[1],langCode);
    var sItemInfo = "<ItemInfo itemType=\"" + pObjItem.attr("itemType") + "\">";
    pObjItem.children().each(function () {
        sItemInfo += "<" + this.tagName + "><![CDATA[" + $(this).text() + "]]></" + this.tagName + ">";
    });
    sItemInfo += "</ItemInfo>";

    var sHTML = "<li";
    if (pStrType == "NEW") {
        sHTML += " class=\"sel\"";
    }
    sHTML += ">";
    sHTML += "<input id=\"chk" + sID + "\" name=\"" + pStrName + "\" type=\"checkbox\" class=\"input_check\" value=\"" + sCode + "\" onchange=\"chkSelectedAllUser_OnChange('" + sCode + "');\" />";
    sHTML += "<textarea id=\"txt" + sID + "\" cols=\"0\" rows=\"0\" style=\"display: none;\">" + sItemInfo + "</textarea>";
    sHTML += "<label for=\"chk" + sID + "\">";
    sHTML += "<span class=\"txt_gn12\">" + sUserName + "</span>";
    sHTML += "<span class=\"txt_gn11_blur3\">(" + sGroupName + ", " + sJobTitleName + ", " + sJobPositionName + ")</span>";
    sHTML += "</label>";
    sHTML += "</li>";
    return sHTML;
}

// 선택 목록에 표시할 부서정보 HTML을 생성합니다.
function liSelectedDept(pObjItem, pStrName, pStrType) {
    var sCode = pObjItem.find("GR_Code").text();
    var sID = pStrName + sCode;
    var sCompanyName = CFN_GetDicInfo(pObjItem.find("CompanyName").text(),langCode);
    var sGroupName = CFN_GetDicInfo(pObjItem.find("GroupName").text(),langCode);
    var sItemInfo = "<ItemInfo itemType=\"" + pObjItem.attr("itemType") + "\">";
    pObjItem.children().each(function () {
        sItemInfo += "<" + this.tagName + "><![CDATA[" + $(this).text() + "]]></" + this.tagName + ">";
    });
    sItemInfo += "</ItemInfo>";

    var sHTML = "<li";
    if (pStrType == "NEW") {
        sHTML += " class=\"sel\"";
    }
    sHTML += ">";
    sHTML += "<input id=\"chk" + sID + "\" name=\"" + pStrName + "\" type=\"checkbox\" class=\"input_check\" value=\"" + sCode + "\" onchange=\"chkSelectedAllDept_OnChange('" + sCode + "');\" />";
    sHTML += "<textarea id=\"txt" + sID + "\" cols=\"0\" rows=\"0\" style=\"display: none;\">" + sItemInfo + "</textarea>";
    sHTML += "<label for=\"chk" + sID + "\">";
    sHTML += "<span class=\"txt_gn12\">" + sGroupName + "</span>";
    sHTML += "<span class=\"txt_gn11_blur3\">(" + sCompanyName + ")</span>";
    sHTML += "</label>";
    sHTML += "</li>";
    return sHTML;
}

// 선택 목록 전체 항목의 임직원 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 추가/기존 항목 체크박스의 선택도 변경합니다.
function chkSelectedAllUserAll_OnChange() {
    $("input[id^='chkSelectedAllUser']").attr("checked", $("#chkSelectedAllUserAll").attr("checked"));
    $("input[id^='chkSelectedNewUser']").attr("checked", $("#chkSelectedAllUserAll").attr("checked"));
    $("input[id^='chkSelectedOldUser']").attr("checked", $("#chkSelectedAllUserAll").attr("checked"));
}

// 선택 목록 전체 항목의 부서 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 추가/기존 항목 체크박스의 선택도 변경합니다.
function chkSelectedAllDeptAll_OnChange() {
    $("input[id^='chkSelectedAllDept']").attr("checked", $("#chkSelectedAllDeptAll").attr("checked"));
    $("input[id^='chkSelectedNewDept']").attr("checked", $("#chkSelectedAllDeptAll").attr("checked"));
    $("input[id^='chkSelectedOldDept']").attr("checked", $("#chkSelectedAllDeptAll").attr("checked"));
}

// 선택 목록 추가 항목의 임직원 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedNewUserAll_OnChange() {
    $("input[id^='chkSelectedNewUser']").each(function () {
        $(this).attr("checked", $("#chkSelectedNewUserAll").attr("checked"));
        chkSelectedNewUser_OnChange($(this).val());
    });
}

// 선택 목록 추가 항목의 부서 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedNewDeptAll_OnChange() {
    $("input[id^='chkSelectedNewDept']").each(function () {
        $(this).attr("checked", $("#chkSelectedNewDeptAll").attr("checked"));
        chkSelectedNewDept_OnChange($(this).val());
    });
}

// 선택 목록 기존 항목의 임직원 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedOldUserAll_OnChange() {
    $("input[id^='chkSelectedOldUser']").each(function () {
        $(this).attr("checked", $("#chkSelectedOldUserAll").attr("checked"));
        chkSelectedOldUser_OnChange($(this).val());
    });
}

// 선택 목록 기존 항목의 부서 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedOldDeptAll_OnChange() {
    $("input[id^='chkSelectedOldDept']").each(function () {
        $(this).attr("checked", $("#chkSelectedOldDeptAll").attr("checked"));
        chkSelectedOldDept_OnChange($(this).val());
    });
}

// 선택 목록 전체 항목의 각 임직원 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 추가/기존 항목 체크박스의 선택도 변경합니다.
function chkSelectedAllUser_OnChange(pStrCode) {
    $("input[id^='chkSelectedNewUser'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedAllUser'][value='" + pStrCode + "']").filter(":first").attr("checked"));
    $("input[id^='chkSelectedOldUser'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedAllUser'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 선택 목록 전체 항목의 각 부서 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 추가/기존 항목 체크박스의 선택도 변경합니다.
function chkSelectedAllDept_OnChange(pStrCode) {
    $("input[id^='chkSelectedNewDept'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedAllDept'][value='" + pStrCode + "']").filter(":first").attr("checked"));
    $("input[id^='chkSelectedOldDept'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedAllDept'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 선택 목록 추가 항목의 각 임직원 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedNewUser_OnChange(pStrCode) {
    $("input[id^='chkSelectedAllUser'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedNewUser'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 선택 목록 추가 항목의 각 부서 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedNewDept_OnChange(pStrCode) {
    $("input[id^='chkSelectedAllDept'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedNewDept'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 선택 목록 기존 항목의 각 임직원 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedOldUser_OnChange(pStrCode) {
    $("input[id^='chkSelectedAllUser'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedOldUser'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 선택 목록 기존 항목의 각 부서 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
// 전체 항목 체크박스의 선택도 변경합니다.
function chkSelectedOldDept_OnChange(pStrCode) {
    $("input[id^='chkSelectedAllDept'][value='" + pStrCode + "']").filter(":first").attr("checked", $("input[id^='chkSelectedOldDept'][value='" + pStrCode + "']").filter(":first").attr("checked"));
}

// 확인 버튼 클릭시 실행되며 CallBack 함수를 호출한 후, 조직도를 종료합니다.
function btnConfirm_OnClick() {
    if (($("#hidType").val().substring(0, 1) != "A") &&
                    ($("#hidCallBackMethod").val() != "")) {
        var sValue = "<Items>";
        $("textarea[id^='txtSelectedAllUser']").each(function () { sValue += $(this).val(); });
        $("textarea[id^='txtSelectedAllDept']").each(function () { sValue += $(this).val(); });
        sValue += "</Items>";

        var sSubSystem = $("#hidSubSystem").val();
        var sUR_Codes = "";
        var sGR_Codes = "";
        $($.parseXML(sValue)).find("ItemInfo").each(function () {
            if ($(this).attr("itemType").toUpperCase() == "USER") {
                sUR_Codes += $(this).find("UR_Code").text() + ",";
            }
            else {
                sGR_Codes += $(this).find("GR_Code").text() + ",";
            }
        });

        var sURL = Common.GetPgModule("Portal.WebService");
        var oResult = CFN_CallAjaxJson(sURL + "/OrgMapSelectedSave", "{ pStrSubSystem:'" + sSubSystem + "', pStrUR_Codes:'" + sUR_Codes + "', pStrGR_Codes:'" + sGR_Codes + "' }", false, null);
        var bSucces = eval($.parseJSON(oResult).d[0].Value);
        var sResult = $.parseJSON(oResult).d[1].Value;

        if (bSucces) {
            //alert("선택목록이 저장 되었습니다.");
        } else {
            Common.Error(sResult);
        }

        eval("parent." + $("#hidCallBackMethod").val() + "('" + sValue + "')");
    }
    parent.Common.Close($("#hidOpenName").val());
}

// 닫기인 버튼 클릭시 실행되며, 조직도를 종료합니다.
function btnClose_OnClick() {
    parent.Common.Close($("#hidOpenName").val());
}

//JAL-소스위치이동
$(window).load(function () {
    //결재선목록처리
    initialize();
});

$(document).mousedown(function(e){
	if($("#dvCommonList").css('display')!='none'){
		var btnList = $("#dvCommonList");
		
		if (!btnList.is(e.target) && btnList.has(e.target).length === 0){
			btnList.css("display","none");
		}
	}
});

var strMsg_187 = Common.getDic("msg_apv_187");
var strMsg_188 = Common.getDic("msg_apv_188");
var gHasPrivateLines = false;
var gRequestDivisionLimit = Common.getBaseConfig("RequestDivisionLimit");
//결재자 선택 관련 종료