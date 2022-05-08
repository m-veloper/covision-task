/**
 * 결재선 지정 스크립트
 */
//# sourceURL=ApvlineManager.js

//getInfo 변경으로 수정
function getInfo(sKey) {
    try {
        if ('function' == typeof (m_oInfoSrc.getInfo) || 'object' == typeof (m_oInfoSrc.getInfo)) {
        	if(m_oInfoSrc.g_dicFormInfo != undefined && m_oInfoSrc.g_dicFormInfo.item("CLSYS") == "approval") { //이어카운팅에서 결재로 넘어올 때 getInfo 함수가 남아있음
                return m_oInfoSrc.g_dicFormInfo.item(sKey);
        	} else {
                return m_oInfoSrc.getInfo(sKey);
        	}
        }
        else {
            return m_oInfoSrc.g_dicFormInfo.item(sKey);
        }
    }
    catch (e) {
    	return undefined;
    }
}

//XmlHttpRequest 생성
function CreateXmlHttpRequest() {
	if (window.ActiveXObject !== undefined) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
			return new ActiveXObject("Msxml.XMLHTTP");
		}
	} else if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else {
		return null;
	}
}

function convertKindToSignTypeByRTnUT(sKind, sParentUT, sRT, sUT, customattribute2, stepallottype) {
    if (scustomattribute2 == undefined) {
        scustomattribute2 = "";
    }
    var sSignType = " ";
    var scustomattribute2 = (customattribute2 == undefined) ? "" : customattribute2;
    if (scustomattribute2 == "ExtType") {
        sSignType = coviDic.dicMap["lbl_apv_ExtType"]; 
    } else if (scustomattribute2 == "audit_law") {
        sSignType = coviDic.dicMap["lbl_apv_person_audit"];
    } else {
        switch (sRT) {
            case "receive":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = coviDic.dicMap["lbl_apv_ChargeDept"]; break;
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                        } break;
                    case "role":
                    case "person":
                        sSignType = coviDic.dicMap["lbl_apv_charge_person"]; break;
                    case "group":
                        sSignType = coviDic.dicMap["lbl_apv_receive"];  break;
                } break;
            case "consult":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = (stepallottype=="parallel")? coviDic.dicMap["lbl_apv_DeptConsent_2"]:coviDic.dicMap["lbl_apv_DeptConsent"];  break;
                            case "role":
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                        } break;
                    case "role":
                    case "person":
                    	//scConsetnMart는 비사용 값이기 때문에 변경
                    	if (stepallottype=="parallel") sSignType = coviDic.dicMap["lbl_apv_PersonConsent"]; 
                        else sSignType = coviDic.dicMap["lbl_apv_PersonalCon"]; 
                    	break;
                } break;
            case "assist":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = (stepallottype=="parallel")? coviDic.dicMap["lbl_apv_DeptAssist2"] :coviDic.dicMap["lbl_apv_DeptAssist"];  break;
                            case "role":
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                        } break;
                    case "role":
                    case "person":
                    	//scConsentMark는 비사용 값이기 때문에 주석 처리
                        if (scustomattribute2 != "") sSignType = scustomattribute2;
                        else if (stepallottype=="serial") sSignType = coviDic.dicMap["lbl_apv_assist"]; 			//TODO 개인 협조 병렬 다국어 변경필요
                        else if (stepallottype=="parallel") sSignType = coviDic.dicMap["lbl_apv_assist_2"]; 			//TODO 개인 협조 병렬 다국어 변경필요
                        else sSignType =coviDic.dicMap["lbl_apv_assist"]; 
                        break;
                } break;
            case "audit":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = (scustomattribute2 == "audit_dept" ? coviDic.dicMap["btn_apv_dept_audit"]: coviDic.dicMap["lbl_apv_dept_audit"]); break;
                            case "role":
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                        } break;
                    case "role":
                    case "person":
                        sSignType = coviDic.dicMap["btn_apv_person_audit"];break;
                } break;
            case "review":
                sSignType = coviDic.dicMap["lbl_apv_PublicInspect"]; break;
            case "notify":
                sSignType = coviDic.dicMap["lbl_apv_SendInfo"]; break;
            case "approve":
                switch (sUT) {
                    case "role":
                    case "person":
                        sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                    case "ou":
                        sSignType = coviDic.dicMap["lbl_apv_DeptApprv"];break;
                } break;
        }
    }
    return sSignType;
}

function convertKindToSignTypeByRTnUT2(sKind, sParentUT, sRT, sUT, customattribute2) {
   var sSignType = " ";
   var scustomattribute2 = (customattribute2 == undefined) ? "" : customattribute2;
   if (scustomattribute2 == "ExtType") {
       sSignType = coviDic.dicMap["lbl_apv_ExtType"];  
   } else if (scustomattribute2 == "audit_law") {
       sSignType = coviDic.dicMap["lbl_apv_person_audit"]; 
   } else {
       switch (sRT) {
           case "receive":
               switch (sUT) {
                   case "ou":
                       switch (sParentUT) {
                           case "ou": sSignType = coviDic.dicMap["lbl_apv_ChargeDept"]; break;
                           case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                       } break;
                   case "role":
                   case "person":
                       sSignType = coviDic.dicMap["lbl_apv_charge_person"]; break;
                   case "group":
                       sSignType = coviDic.dicMap["lbl_apv_receive"]; break;
               } break;
           case "consult":
               switch (sUT) {
                   case "ou":
                       switch (sParentUT) {
                           case "ou": sSignType = coviDic.dicMap["lbl_apv_DeptConsent"];  break;
                           case "role":
                           case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                       } break;
                   case "role":
                   case "person":
                	   //scConsentMart는 비사용 값이기 때문에 변경.
                       //sSignType = (getInfo("scConsentMark") == "1" true?  coviDic.dicMap["msg_lbl_Committee"] : coviDic.dicMap["lbl_apv_consent"] ); break;
                	   sSignType = coviDic.dicMap["lbl_apv_consent"];  break;
               } break;
           case "assist":
               switch (sUT) {
                   case "ou":
                       switch (sParentUT) {
                           case "ou": sSignType = coviDic.dicMap["lbl_apv_DeptAssist"];  break;
                           case "role":
                           case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                       } break;
                   case "role":
                   case "person":
                       sSignType = (scustomattribute2 == "" ? coviDic.dicMap["lbl_apv_assist"]: scustomattribute2); break;
               } break;
           case "audit":
               switch (sUT) {
                   case "ou":
                       switch (sParentUT) {
                           case "ou": sSignType = (scustomattribute2 == "" ? coviDic.dicMap["lbl_apv_audit"] : scustomattribute2); break;
                           case "role":
                           case "person": sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                       } break;
                   case "role":
                   case "person":
                       sSignType = coviDic.dicMap["lbl_apv_audit"]; break;
               } break;
           case "review":
               sSignType = coviDic.dicMap["lbl_apv_PublicInspect"]; break;
           case "notify":
               sSignType = coviDic.dicMap["lbl_apv_SendInfo"];  break;
           case "approve":
               switch (sUT) {
                   case "role":
                   case "person":
                       sSignType = convertKindToSignType(sKind, scustomattribute2); break;
                   case "ou":
                       sSignType = coviDic.dicMap["lbl_apv_DeptApprv"]; break;
                   } break;
           }
       }
       return sSignType;
}

function convertKindToSignType(sKind, customattribute2) {
    var sSignType;
    var scustomattribute2 = (customattribute2 == undefined) ? "" : customattribute2;
    switch (sKind) {
        case "normal":
        sSignType = coviDic.dicMap["lbl_apv_normalapprove"]; break;
    case "consent":
        sSignType = coviDic.dicMap["lbl_apv_investigation"]; break;
    case "authorize":
        sSignType = coviDic.dicMap["lbl_apv_authorize"]; break;
    case "substitute":
        sSignType = coviDic.dicMap["lbl_apv_substitue"]; break;
    case "review":
        sSignType = coviDic.dicMap["lbl_apv_review"];  break;
    case "bypass":
        sSignType = coviDic.dicMap["lbl_apv_bypass"];  break;
    case "charge":
        sSignType = coviDic.dicMap["lbl_apv_charge"]; break;
    case "confidential":
        sSignType = coviDic.dicMap["lbl_apv_Confidential"];  break;
    case "conveyance":
        sSignType = coviDic.dicMap["lbl_apv_forward"]; break;
    case "skip":
        sSignType = coviDic.dicMap["lbl_apv_NoApprvl"] + (String(scustomattribute2)==""?"":" " + String(scustomattribute2)); break;
    case "confirm":
        sSignType = coviDic.dicMap["lbl_apv_Confirm"]; break;
    case "reference":
        sSignType = coviDic.dicMap["lbl_apv_share4list"]; break;
    default:
        //sSignType = "&nbsp;";break;
        sSignType = " ";
    }
    return sSignType;
}


function convertSignResult(sResult, sKind, customattribute2) {
    var sSignResult;
    if (customattribute2.indexOf("참조") > -1) {
        return "";
    }
    switch (sResult) {
        case "prebypass":
        case "inactive":
            sSignResult = coviDic.dicMap["lbl_apv_inactive"]; break;
        case "pending":
            sSignResult = coviDic.dicMap["lbl_apv_inactive"];  break;
        case "reserved":
            sSignResult = coviDic.dicMap["lbl_apv_hold"]; break;
        case "completed":
            if (customattribute2 == "ExtType") {
                sSignResult =coviDic.dicMap["lbl_apv_ExtType_agree"];  break;
            } else {
                sSignResult = (sKind == 'charge') ? coviDic.dicMap["btn_apv_draft"]: coviDic.dicMap["lbl_apv_app"]; 
            } break;
        case "rejected":
            if (customattribute2 == "ExtType") {
                sSignResult = coviDic.dicMap["lbl_apv_ExtType_disagree"];
            } else {
                sSignResult = coviDic.dicMap["lbl_apv_reject"];
            } break;
        case "rejectedto":
            sSignResult = coviDic.dicMap["lbl_apv_reject"]; break;
        case "authorized":
            sSignResult = coviDic.dicMap["lbl_apv_authorize"]; break;
        case "reviewed":
            sSignResult = coviDic.dicMap["lbl_apv_review"]; break;
        case "substituted":
            sSignResult = coviDic.dicMap["lbl_apv_substitue"];  break;
        case "agreed":
            if (customattribute2 == "ExtType") {
                sSignResult = coviDic.dicMap["lbl_apv_ExtType_agree"];
            } else {
            	sSignResult = coviDic.dicMap["lbl_apv_consent"]; 
            } break;
        case "disagreed":
            if (customattribute2 == "ExtType") {
                sSignResult = coviDic.dicMap["lbl_apv_ExtType_disagree"];
            } else {
                sSignResult = coviDic.dicMap["lbl_apv_disagree"];
            } break;
        case "bypassed":
            sSignResult = coviDic.dicMap["lbl_apv_bypass"]; break;
        case "skipped":
            sSignResult = coviDic.dicMap["lbl_apv_NoApprvl"]; break;
        case "confirmed":
            sSignResult = coviDic.dicMap["lbl_apv_confirmed"]; break;
        default:
            //sSignResult = "&nbsp;";break;
            sSignResult = " ";
            break;
    }
    return sSignResult;
}

function makeAbstract(oJson){
	var len = $$(oJson).find('step').valLength();
	var sAbstract = "";
	
	$$(oJson).find('step').concat().each(function(i,$$){    
		  if($$.attr('routetype') == 'consult' && $$.attr('allottype') == 'parallel'){
			  sAbstract += convertKindToSignType($$.find('taskinfo').attr('kind'),'')+'('+$$.find('>ou').valLength()+')'  
		  }else{
			  sAbstract += $$.find('ou>person').attr('name')+'['+convertKindToSignType($$.find('ou>person>taskinfo').attr('kind'),'') +']';
		  }
		  
		  if(i != len -1){
			  sAbstract += ' - ';
		  }
	});
	
	return sAbstract;
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
var m_oApvList;
var m_oCCList;
var m_sApvMode;
var m_sSelectedStepType;
var m_sSelectedDivisionType;
var m_sSelectedRouteType;
var m_sSelectedUnitType;
var m_sSelectedAllotType;
var m_sSelectedRuleApvClass;
var m_sSelectedRuleApvClassAtt01;
var m_sSelectedStepRef;
var m_oXSLProcessor;
var m_oHTMLProcessor;
var m_oInfoSrc;
var m_oFormMenu;
var m_oFormEditor;
var m_oCurrentOUNode;
var m_bCC;
var l_bGroup; //그룹참조여부
var m_sNAuthTL1 = '000'; //보직없음
var m_sNAuthTL2 = '31';
var m_modeless = null;
var m_selectedRowApvlist = null;
var m_selectedRowApvlistId = null;
var m_selectedDistRow = null;
var m_selectedDistRowId = null;
var m_RecDept = '';
var assureouvisibleCheck = false;

var $$_m_oApvList;
var $$_m_oApvListSteps;
var $$_m_oCCList;
var realArray;

JsonQuery.prototype.remove = function(key){
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
            //document.getElementById("btnfnShowOpen").style.display = "none";
            //document.getElementById("btnfnShowClose").style.display = "none";
            //document.getElementById("divApvLineMgrSub").style.display = "none";
        }
        m_oFormMenu = m_oInfoSrc;
        m_oFormEditor = m_oInfoSrc;
        // initButtons(); - list를 그리고 생기는 버튼은 조작할 수 없어서 리스트 그리고 난 후로 위치 변경
    }
    
    if(standalone_mode) {
        // 1) not refer parent or operner
        //m_oApvList = __standalone_apvline;
        //$$_m_oApvList = $$(m_oApvList);
        
        // 2) refer parent 
    	m_oApvList =jQuery.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value.replace(/&/g, "&amp;"));
        $$_m_oApvList = $$(m_oApvList);
    } else {
    	 m_oApvList =jQuery.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value.replace(/&/g, "&amp;"));
    }

    if (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") {
        $$_m_oApvList = $$(m_oApvList);
        var json_m_oApvList = JSON.stringify($$_m_oApvList.json());
        var $$_m_oApvListClone = $$(JSON.parse(json_m_oApvList));
        var $$_m_oSubReStep = $$_m_oApvListClone.find("division").has(">taskinfo[status='pending']").find("step[unittype='ou']").has("taskinfo[status='pending'][piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']");
        
        $$_m_oApvList.find("division").has(">taskinfo[status='pending']").find("step").remove();
        $$_m_oApvList.find("division").has(">taskinfo[status!='pending']").remove();
        
        //JSONER remove 오류로 동일 remove 두번 실행. jsoner 보완후 아래 두문장 하나로 통일.
        $$_m_oSubReStep.find("ou").concat().has(">taskinfo[piid!='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']").remove();
        
        if ($$_m_oSubReStep.find("ou>person>taskinfo[kind='charge']").length == 0) {
            //?? var oPerson = m_oApvList.createElement("person");
            //?? var oTaskinfo = m_oApvList.createElement("taskinfo");
            
            $$_m_oSubReStep.find("ou").append('person',{
                code: getInfo("AppInfo.usid"),
                name: getInfo("AppInfo.usnm"),
                position: getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"),
                title: getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"),
                level: getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.ustn"),
                oucode: getInfo("AppInfo.dpid"),
                ouname: getInfo("AppInfo.dpnm"),
                sipaddress: getInfo("AppInfo.ussip"),
                taskinfo: {
                    status: "inactive",
                    result: "inactive",
                    kind: "charge"
                }
            });

        }
        $$_m_oSubReStep.attr("unittype", "person");
        $$_m_oSubReStep.attr("routetype", "approve");
        $$_m_oApvList.find("division").append("step", $$_m_oSubReStep.json())
        //$$_m_oApvList.find("division>step").json().push($$_m_oSubReStep); //JAL-ADD STEP TO ARRAY()
    }

    initiateCC();
    refreshList();
    refreshCC();
    
    if (Common.getBaseConfig("RuleBtnApvMgr") == "Y") { //전결규정 버튼을 결재선 팝업 내에서 표시할 것인지
	    if (getInfo("Request.loct") == "DRAFT" || getInfo("Request.loct") == "TEMPSAVE") {
	        var ruleItemList = getInfo("RuleInfo") ? getInfo("RuleInfo") : getInfo("ExtInfo.RuleItemLists");
	        var ruleItemInfoStr = CFN_GetQueryString("openID").indexOf("account_") > -1 ? m_oInfoSrc.accountCtrl.getInfo("RuleItemInfo").val() : m_oInfoSrc.$("#RuleItemInfo").val();
	        
	        if (ruleItemList.length > 0) {
	        	// 본인 회사 기준 체크
        		var oTemp = JSON.parse(ruleItemList).filter(function(rule) {
        			return rule.DNCode == Common.getSession("DN_Code");
        		});
        		
	        	// 그룹사 기준 체크
		        if (oTemp.length == 0) {
	        		oTemp = JSON.parse(ruleItemList).filter(function(rule) {
	        			return rule.DNCode == "ORGROOT";
	        		});
		        }
		        ruleItemList = oTemp;
	        }

	        if(ruleItemList.length > 0) {
	        	window.resizeTo(window.outerWidth, 730);	        	
	        	refreshRule(false, ruleItemInfoStr);		
	        }
	    }
    }

    if (m_oInfoSrc != null){
    	initButtons(); //list를 그리고 생기는 버튼은 조작할 수 없어서 리스트 그리고 난 후로 위치 변경
    } 
    return true;
}

//로딩시 참조 초기화
function initiateCC() {
    var $$_ccList = $$_m_oApvList.find("steps > ccinfo");

    $$_ccList.concat().each(function (i, jsoner) {
        $$($$_m_oCCList).append(jsoner.json());
    });
}

//*버튼 초기화
function initButtons() {
    //JAL
    if(standalone_mode) {
        m_RecDept = m_oFormEditor.document.getElementById("ReceiveNames")!=null? m_oFormEditor.document.getElementById("ReceiveNames").value:"";
        m_bCC = (getInfo("SchemaContext.scCC.isUse") == "Y" ? true : false); //JWK
        
        if(m_oFormEditor.$("[name=MULTI_RECEIVENAMES]").length > 0){
        	var idx = m_oFormEditor.$("#writeTab li.on").attr('idx');

        	var m_rectype = m_oFormEditor.$('[name=MULTI_RECEIVER_TYPE]')[idx].value;
        	if(m_rectype == Sendtype){
        		if(window.location.href.toUpperCase().indexOf("MULTIRECEIVELINE") > 0) { // 수신처 팝업에서는 자기것만 
        			m_RecDept = m_oFormEditor.$('[name=MULTI_RECEIVENAMES]')[idx].value;
        		}
        		else { // 결재선 팝업에서는 전체 수신처 묶기
        			if(m_oFormMenu.document.getElementById("ReceiveNames")!=null){
                		var totalRecDept = "";
                		
                    	m_oFormEditor.$(".multi-row [name=MULTI_RECEIVENAMES]").each(function(idx, item){
                    		  var type = m_oFormEditor.$(".multi-row [name=MULTI_RECEIVER_TYPE]")[idx].value;
                    		  if($(item).val() != "" && type == "In"){
                    		  	totalRecDept += ';' + $(item).val();
                    		  }
                    	  });
                          if (totalRecDept.indexOf(";") == 0) totalRecDept = totalRecDept.substring(1);
                          m_RecDept = totalRecDept;
                   	  }	
        		}
        	} else {
        		m_RecDept = "";
        	}
        }
    } else {
        m_RecDept =m_oFormEditor.document.getElementById("ReceiveNames")!=null? m_oFormEditor.document.getElementById("ReceiveNames").value:"";
        m_bCC = (getInfo("SchemaContext.scCC.isUse") == "Y" ? true : false);
    }

    //배포처 size 키우기
    if (getInfo("SchemaContext.scDeployBtn.isUse") == "N" && getInfo("SchemaContext.scIPub.isUse") == "Y") {
    	if(getInfo('ExtInfo.UseHWPEditYN') == "Y" && window.location.href.toUpperCase().indexOf("MULTIRECEIVELINE") > 0){
    		chkActionMulti(mType);
    	} else {
            chkAction(mType);
    	}
        $("#divtPersonDeployList").attr("style", "display:;");
        if (getInfo("SchemaContext.scGRec.isUse") == "Y") {
            $("#divtDeployList").attr("style", "display:;"); //park
        }
    }
    //디자인조정
    if (getInfo("SchemaContext.scCC.isUse") != "Y"  && getInfo("SchemaContext.scIPub.isUse") != "Y") {
    	$("#divapvinfo").attr("class","appInfo02") //결재목록만 보일경우
    	$("#ApvlistSendRight").attr("class","btnWArea02");
        $("#Apvlist").attr("style", "height:498px;");
    } else if (getInfo("SchemaContext.scCC.isUse") != "Y" && (getInfo("SchemaContext.scDeployBtn.isUse") == "N" && getInfo("SchemaContext.scIPub.isUse") == "Y")) {
        if (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "RECAPPROVAL" || getInfo("mode") == "SUBREDRAFT") {
        	$("#divapvinfo").attr("class","appInfo02") //결재목록만 보일경우
        	$("#ApvlistSendRight").attr("class","btnWArea02");
            $("#Apvlist").attr("style", "height:498px;");

            $("#tabrecinfo").attr("style", "display:none;"); //배포 탭 버튼 표시 여부 추가
            $("#divrecinfo").attr("style", "display:none;");
            $("#divrecinfolist").attr("style", "display:none;");
            $("#dvRec").attr("style", "display:none;");
        } else {
        	$("#divapvinfo").attr("class", "appInfo02");//결재목록 + 배포목록 보일 때
        	$("#ApvlistSendRight").attr("class","btnWArea02");
        	$("#Apvlist").attr("style", "height:398px;");

            //스타일 변경하지 않고 표시 여부만 변경(디자인은 css 파일에서 하도록 변경)
            $("#tabrecinfo").attr("style", "display:;");
            $("#divrecinfo").attr("style", "display:;");
            $("#divrecinfolist").attr("style", "display:;");
            $("#dvRec").attr("style", "display:;");
        
        }

    } else if (getInfo("SchemaContext.scCC.isUse") == "Y"&& getInfo("SchemaContext.scIPub.isUse") != "Y") {
    	$("#divapvinfo").attr("class", "appInfo"); //결재목록 + 참조목록 보일때 
    	$("#ApvlistSendRight").attr("class","btnWArea");

    	//보이도록만 스타일 변경 이외 디자인은 css에서 하도록 변경
    	$("#divccinfo").attr("style", "display:;");
    	$("#divccinfolist").attr("style", "display:;");
    	$("#dvCC").attr("style", "display:;");
        if (getInfo("SchemaContext.scReceiptRef.isUse") == "Y") {
            if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
            else { $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
        } else {
            if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblDraftRefAfter").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
        }

    } else if (getInfo("SchemaContext.scCC.isUse") == "Y" && (getInfo("SchemaContext.scDeployBtn.isUse") == "N" && getInfo("SchemaContext.scIPub.isUse") == "Y")) {
        if (getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "RECAPPROVAL") {
        	$("#divapvinfo").attr("class", "appInfo"); //결재목록 + 참조목록 보일때
        	$("#ApvlistSendRight").attr("class","btnWArea");
            
            $("#tabrecinfo").attr("style", "display:none;"); //배포 탭 버튼 표시 여부 추가
            $("#divrecinfo").attr("style", "display:none;");
            $("#divrecinfolist").attr("style", "display:none;");
            $("#dvRec").attr("style", "display:none;");

            //보이도록만 변경 이외 디자인은 css에서 하도록 변경
            $("#divccinfo").attr("style", "display:;");
            $("#divccinfolist").attr("style", "display:;");
            $("#dvCC").attr("style", "display:;");
            if (getInfo("SchemaContext.scReceiptRef.isUse") == "Y") {
                if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
                else { $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
            } else {
                if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblDraftRefAfter").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
            }

        } else if (getInfo("Request.mode") == "SUBREDRAFT" || getInfo("Request.mode") == "SUBAPPROVAL") {
        	$("#divapvinfo").attr("class", "appInfo02"); //결재목록만 보일때
        	$("#ApvlistSendRight").attr("class","btnWArea02");
        	$("#Apvlist").attr("style", "height:398px;");
        } else {
        	$("#divapvinfo").attr("class", "appInfo"); //결재목록+참조목록+배포목록 모두 보일 때
        	$("#ApvlistSendRight").attr("class","btnWArea");

            //스타일 변경하지 않고 표시 여부만 변경(디자인은 css 파일에서 하도록 변경)
            $("#tabrecinfo").attr("style", "display:;");
            $("#divrecinfo").attr("style", "display:;");
            $("#divrecinfolist").attr("style", "display:;");
            $("#dvRec").attr("style", "display:;");
           
            $("#divccinfo").attr("style", "display:;");
            $("#divccinfolist").attr("style", "display:;");
            $("#dvCC").attr("style", "display:;");
            if (getInfo("SchemaContext.scReceiptRef.isUse") == "Y") {
                if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
                else { $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
            } else {
                if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblDraftRefAfter").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
            }
        }
    } else if (getInfo("SchemaContext.scCC.isUse") == "Y") {
    	$("#divapvinfo").attr("class", "appInfo");//결재목록+참조목록 보일때 
    	$("#ApvlistSendRight").attr("class","btnWArea");

    	//보이도록만 변경 이 외 디자인은 css에서 하도록 변경
    	$("#divccinfo").attr("style", "display:;");
    	$("#divccinfolist").attr("style", "display:;");
    	$("#dvCC").attr("style", "display:;");

    	if (getInfo("SchemaContext.scReceiptRef.isUse") == "Y") {
            if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
            else { $("#tblReceiptRef").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
        } else {
            if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") { $("#tblDraftRefBefor").attr("style", "display:;"); $("#tblDraftRefAfter").attr("style", "display:;"); $("#tblDraftRef").attr("style", "display:none;"); }
        }

    }


    try {
        if ((getInfo("Request.mode") == "REDRAFT" || getInfo("Request.mode") == "RECAPPROVAL")
            && (getInfo("SchemaContext.scDRec.isUse") == "Y"
            || getInfo("SchemaContext.scChgr.isUse") == "Y"
            || getInfo("SchemaContext.scChgrEnt.isUse") == "Y"
            || getInfo("SchemaContext.scChgrReg.isUse") == "Y"
            || getInfo("SchemaContext.scChgrOU.isUse") == "Y"
            || getInfo("SchemaContext.scChgrOUEnt.isUse") == "Y"
            || getInfo("SchemaContext.scChgrOUReg.isUse") == "Y"
            || (getInfo("SchemaContext.scDeployBtn.isUse") == "N" && getInfo("SchemaContext.scIPub.isUse") == "Y")
            || getInfo("SchemaContext.scChgrPerson.isUse") == "Y")) {
        	
        	if (getInfo("SchemaContext.scReceiptRef.isUse") == "Y") {
                document.getElementById("tblReceiptRef").style.display = "";
        	}
            document.getElementById("tblDraftRef").style.display = "none";
            document.getElementById("dvRec").style.display = "none";
            document.getElementById("btDeleteRec").style.display = "none";
            $("#divtPersonDeployList").attr("style", "display:none;");
        }
    } catch (e) { }

    if (admintype == 'ADMIN') {//관리자로 결재선관리 open 한 경우
        if (getInfo("Request.loct") == "PREAPPROVAL" || getInfo("Request.loct") == "APPROVAL" || getInfo("Request.loct") == "PROCESS" && m_sApvMode != "REJECT") {
        } else {
            document.getElementById("dvCommon").style.display = "none";
            try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
            m_bCC = false;
        }
    } else if (getInfo("Request.loct") == "PREAPPROVAL" || getInfo("Request.loct") == "COMPLETE" && m_sApvMode != "REJECT") {
        document.getElementById("dvCommon").style.display = "none";
        try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
        m_bCC = false;
    } else {
        switch (m_sApvMode) {
            case "APPROVAL":
            	if($$_m_oApvList.find("division>step").concat().has("taskinfo[status=pending],[status=reserved]").parent().index() == 0){
	                if (getInfo("SchemaContext.scPAdt.isUse") == "Y" && getInfo("SchemaContext.scPAdt.value") != "") $("#btPAudit").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDAdt.isUse") == "Y" && getInfo("SchemaContext.scDAdt.value")  != "") $("#btDAudit").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPAdt1.isUse") == "Y" && getInfo("SchemaContext.scPAdt1.value") != "") $("#btPAudit1").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDAdt1.isUse") == "Y" && getInfo("SchemaContext.scDAdt1.value") != "") $("#btDAudit1").attr("style", "display:;");
	                // 비사용 if (getInfo("scExtType") == 1 && getInfo("scExtTypeV") != "") $("#btExtType").attr("style", "display:;");
	
	                //2012.05 yu2mi : 버튼 분할
	                if (getInfo("SchemaContext.scPAdt.isUse") == "Y" && getInfo("SchemaContext.scPAdt.value") == "") $("#btPAuditLeft").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDAdt.isUse") == "Y"&& getInfo("SchemaContext.scDAdt.value")  == "") $("#btDAuditLeft").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPAdt1.isUse") == "Y" && getInfo("SchemaContext.scPAdt1.value") == "") $("#btPAudit1Left").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDAdt1.isUse") == "Y" && getInfo("SchemaContext.scDAdt1.value") == "") $("#btDAudit1Left").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPAgrSEQ.isUse") == "Y") $("#btPConsult").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPAgr.isUse") == "Y") $("#btPConsult2").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPCoo.isUse") == "Y") $("#btPAssist").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPCooPL.isUse") == "Y") $("#btPAssistPL").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPRec.isUse") == "Y") $("#btCharge").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPConfirm.isUse") == "Y") $("#btPersonConfirm").attr("style", "display:;");
	                if (getInfo("SchemaContext.scPShare.isUse") == "Y") $("#btPersonShare").attr("style", "display:;");
	                //2020.07 공람기능추가
	                if (getInfo("SchemaContext.scReview.isUse") == "Y") $("#btPReview").attr("style", "display:;");
	
	                if (getInfo("SchemaContext.scDAgrSEQ.isUse") == "Y") $("#btDConsult").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDAgr.isUse") == "Y") $("#btDConsult2").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDCooPL.isUse") == "Y") $("#btDAssistPL").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDCoo.isUse") == "Y") $("#btDAssist").attr("style", "display:;");
	                if (getInfo("SchemaContext.scDRec.isUse") == "Y") $("#btReceipt").attr("style", "display:;");
	                // 비사용 스키마 값  if (getInfo("scMltStep") == "Y") $("#btAssistGroupDelete").attr("style", "display:;");
	                // 비사용 스키마 값  if (getInfo("scMltStep") == "Y") $("#btAssistGroup").attr("style", "display:;");
            	}
                break;
            case "RECAPPROVAL":
                //if (getInfo("SchemaContext.scDAgrSEQR.isUse") == "Y") $("#btDConsult2").attr("style", "display:;");
                //if (getInfo("SchemaContext.scDAgrR.isUse") == "Y") $("#btDConsult").attr("style", "display:;"); //부서합의 병렬
                //if (getInfo("SchemaContext.scDCooPLR.isUse") == "Y") $("#btDAssistPL").attr("style", "display:;"); //부서협조 병렬
                //if (getInfo("SchemaContext.scDCooR.isUse") == "Y") $("#btDAssist").attr("style", "display:;");//부서협조 순차
                if (getInfo("SchemaContext.scPAgr.isUse") == "Y") $("#btPConsult").attr("style", "display:;");
                if (getInfo("SchemaContext.scPAgrSEQ.isUse") == "Y") $("#btPConsult2").attr("style", "display:;"); //개인합의순차
                if (getInfo("SchemaContext.scPCoo.isUse") == "Y") $("#btPAssist").attr("style", "display:;");
                if (getInfo("SchemaContext.scPCooPL.isUse") == "Y") $("#btPAssistPL").attr("style", "display:;");      
                break;
            case "SUBAPPROVAL":
               
                $("#divccinfo").attr("style", "display:none;");
                $("#dvCC").attr("style", "display:none;");
                
                $("#divapvinfo").attr("class", "appInfo02"); //결재목록만 보일때
                $("#ApvlistSendRight").attr("class","btnWArea02");
        		$("#Apvlist").attr("style", "height:398px;");
                break;
            case "CHARGE":
                break;
            case "REDRAFT":
                $("#divtApvLine").attr("style", "display:;");
                if ($("#divdetailtApvLine tbody").html().length == 0){
                	getPrivateDomainList();
                }
                $("#groupTreeDiv").attr("style", "display:none;");//추가
                $("#btnClose").attr("style", "display:;");
                $("#divApvLineMgrSub").css({ "display": "block" });
                break;
            case "SUBREDRAFT":
                $("#divccinfo").attr("style", "display:none;");
                $("#dvCC").attr("style", "display:none;");
                
                $("#divapvinfo").attr("class", "appInfo02"); //결재목록만 보일때
                $("#ApvlistSendRight").attr("class","btnWArea02");
        		$("#Apvlist").attr("style", "height:398px;");
                break;
            case "PCONSULT":
                document.getElementById("dvCommon").style.display = "none";
                try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
                //오른쪽 버튼 활성화 막기
                try { document.getElementById("btResetLine").style.display = "none"; } catch (e) { }
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "PROCESS":
                document.getElementById("dvCommon").style.display = "none";
                try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
                //오른쪽 버튼 활성화 막기
                try { document.getElementById("btResetLine").style.display = "none"; } catch (e) { }
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "COMPLETE":
                document.getElementById("dvCommon").style.display = "none";
                try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
                //오른쪽 버튼 활성화 막기
                try { document.getElementById("btResetLine").style.display = "none"; } catch (e) { }
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "REJECT":
                document.getElementById("dvCommon").style.display = "none";
                try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
                //오른쪽 버튼 활성화 막기
                try { document.getElementById("btResetLine").style.display = "none"; } catch (e) { }
                document.getElementById("btUp").style.display = "none";
                document.getElementById("btDown").style.display = "none";
                document.getElementById("btDelete").style.display = "none";
                document.getElementById("btDeleteCC").style.display = "none";
                break;
            case "MONITOR":
                document.getElementById("dvCommon").style.display = "none";
                try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
                document.getElementById("dvCC").style.display = "none";
                break;
            case "PREAPPROVAL":
                document.getElementById("dvCommon").style.display = "none";
                try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
                document.getElementById("dvCC").style.display = "none";
                break;
            case "":
                m_bCC = false;
                break;
            case "DEPTLIST":
                break;
            case "TEMPSAVE" :
            case "DRAFT":
            	$("#groupTreeDiv").attr("style", "display:none;");
            	$("#btnClose").attr("style", "display:;");
            	$("#divApvLineMgrSub").css({ "display": "block" });
            default:
                if (getInfo("SchemaContext.scPAdt.isUse") == "Y" && getInfo("SchemaContext.scPAdt.value") != "") $("#btPAudit").attr("style", "display:;");
                if (getInfo("SchemaContext.scDAdt.isUse") == "Y"&& getInfo("SchemaContext.scDAdt.value")  != "") $("#btDAudit").attr("style", "display:;");
                if (getInfo("SchemaContext.scPAdt1.isUse") == "Y" && getInfo("SchemaContext.scPAdt1.value") != "") $("#btPAudit1").attr("style", "display:;");
                if (getInfo("SchemaContext.scDAdt1.isUse") == "Y" && getInfo("SchemaContext.scDAdt1.value") != "") $("#btDAudit1").attr("style", "display:;");
                // 비사용 스키마 값 if (getInfo("scExtType") == 1 && getInfo("scExtTypeV") != "") $("#btExtType").attr("style", "display:;");

                if (getInfo("SchemaContext.scPAdt.isUse") == "Y" && getInfo("SchemaContext.scPAdt.value") == "") $("#btPAuditLeft").attr("style", "display:;");
                if (getInfo("SchemaContext.scDAdt.isUse") == "Y"&& getInfo("SchemaContext.scDAdt.value")  == "") $("#btDAuditLeft").attr("style", "display:;");
                if (getInfo("SchemaContext.scPAdt1.isUse") == "Y" && getInfo("SchemaContext.scPAdt1.value") == "") $("#btPAudit1Left").attr("style", "display:;");
                if (getInfo("SchemaContext.scDAdt1.isUse") == "Y" && getInfo("SchemaContext.scDAdt1.value") == "") $("#btDAudit1Left").attr("style", "display:;");
                
                if (getInfo("SchemaContext.scPAgrSEQ.isUse") == "Y") $("#btPConsult").attr("style", "display:;");
                if (getInfo("SchemaContext.scPAgr.isUse") == "Y") $("#btPConsult2").attr("style", "display:;");
                if (getInfo("SchemaContext.scPCoo.isUse") == "Y") $("#btPAssist").attr("style", "display:;");
                if (getInfo("SchemaContext.scPCooPL.isUse") == "Y") $("#btPAssistPL").attr("style", "display:;");
                if (getInfo("SchemaContext.scPRec.isUse") == "Y") $("#btCharge").attr("style", "display:;");
                if (getInfo("SchemaContext.scPConfirm.isUse") == "Y") $("#btPersonConfirm").attr("style", "display:;");
                if (getInfo("SchemaContext.scPShare.isUse") == "Y") $("#btPersonShare").attr("style", "display:;");
                //2020.07 공람기능추가
                if (getInfo("SchemaContext.scReview.isUse") == "Y") $("#btPReview").attr("style", "display:;");

                if (getInfo("SchemaContext.scDAgrSEQ.isUse") == "Y") $("#btDConsult").attr("style", "display:;");
                if (getInfo("SchemaContext.scDAgr.isUse") == "Y") $("#btDConsult2").attr("style", "display:;");
                if (getInfo("SchemaContext.scDCooPL.isUse") == "Y") $("#btDAssistPL").attr("style", "display:;");
                if (getInfo("SchemaContext.scDCoo.isUse") == "Y") $("#btDAssist").attr("style", "display:;");
                if (getInfo("SchemaContext.scDRec.isUse") == "Y") $("#btReceipt").attr("style", "display:;");

                $("#divtApvLine").attr("style", "display:;");
                if ($("#divdetailtApvLine tbody").html().length == 0){
                	getPrivateDomainList();
                }
                if (getInfo("SchemaContext.scPApprover.isUse") == "Y") $("#btPlPerson").attr("style", "display:;");    //동시결재
                break;
        }
    }
}

function initPrivateLineBtns() {
    document.getElementById("dvCommon").style.display = "";
    document.getElementById("tblPerson").style.display = "";
    document.getElementById("tblReceipt").style.display = "none";
    document.getElementById("tblPAssist").style.display = "none";
    document.getElementById("tblDAssist").style.display = "none";
    document.getElementById("tblPConsult").style.display = "";
    document.getElementById("tblDConsult").style.display = "none"; document.getElementById("divDConsult").style.display = "none";
    document.getElementById("tblPAudit").style.display = "none";
    document.getElementById("tblDAudit").style.display = "none";
    try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
    document.getElementById("dvCC").style.display = "none";
    try { document.getElementById("btResetLine").style.display = "none"; } catch (e) { }
    document.getElementById("tblapvinfo").style.height = 400 + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;

    try { document.getElementById("tblPlPerson").style.display = "none"; } catch (e) { } //동시결재
}
function initFormLineBtns() {
    document.getElementById("dvCommon").style.display = "";
    document.getElementById("tblPerson").style.display = "";
    document.getElementById("tblReceipt").style.display = "none";
    document.getElementById("tblPAssist").style.display = "none";
    document.getElementById("tblDAssist").style.display = "none";
    document.getElementById("tblPConsult").style.display = "none";
    document.getElementById("tblDConsult").style.display = "none"; document.getElementById("divDConsult").style.display = "none";
    try { document.getElementById("dvAudit").style.display = "none"; } catch (e) { }
    document.getElementById("dvCC").style.display = "none";
    try { document.getElementById("btResetLine").style.display = "none"; } catch (e) { }
    //신청서 수신처 추가 for BC
    document.getElementById("tblReceipt").style.display = "none";
    document.getElementById("tblCharge").style.display = "";
    document.getElementById("tblapvinfo").style.height = 400 + "px"; document.getElementById("Apvlist").style.height = document.getElementById("tblapvinfo").style.height;
}

function deleteSelfAndParent(elmCur, sLimit) {

    var elmParent = elmCur.parent();
    do {
        var nodeName = elmCur[0].nodeName;
        if (nodeName == "division" || nodeName == sLimit || elmParent.find(nodeName).length > 1) {
            var elmDeleted = $(elmParent)[0].removeChild(elmCur[0]);
            return elmDeleted;
        } else if (nodeName == "step" || nodeName == sLimit || elmParent.find(nodeName).length > 1) {
            var elmDeleted = $(elmParent)[0].removeChild(elmCur[0]);
            return elmDeleted;
        } else if (nodeName == "step" || nodeName == sLimit || elmParent.find(nodeName).length > 1 || elmParent.find("step").length == 1) {
            elmCur = elmParent;
            elmParent = elmCur.parent();
        } else {
            elmCur = elmParent;
            elmParent = elmCur.parent();
        }
    } while (elmParent != null);
}
function convertSignTypeToAllotType(sSignType) {
    var sAllotType;
    switch (sSignType) {
        case strlable_normalapprove: sAllotType = ""; break;    //"일반결재"
        case strlable_Seq: sAllotType = "serial"; break; 	    //"순차합의"
        case strlable_Par: sAllotType = "parallel"; break;      //"병렬합의"
    }
    return sAllotType;
}
function convertUserSignTypeToKind(sSignType, bConsult) {
    var sKind;
    switch (sSignType) {
        case strlable_normalapprove: sKind = (bConsult ? "consent" : "normal"); break;  //"일반결재"
        case strlable_NoApprvl: sKind = "normal"; break; 								//"결재안함"
        case strlable_authorize: sKind = "authorize"; break; 							//"전결"
        case strlable_substitue: sKind = "substitute"; break; 							//"대결"
        case strlable_review: sKind = "review"; break; 									//"후결"
        case strlable_after: sKind = "bypass"; break; 									//"사후보고"
    }
    return sKind;
}
function interpretSignStatus(sSignStatus, bConsult, bPending, sStatus, sResult) {
    switch (sSignStatus) {
        case strlable_inactive: sStatus = (bPending ? "pending" : "inactive"); sResult = (bPending ? "pending" : "inactive"); break; //"대기"
        case strlable_apv: sStatus = "completed"; sResult = (bConsult ? "agreed" : "completed"); break; 							  //"결재" 
        case strlable_authorize: sStatus = "completed"; sResult = "authorized"; break; 												//"전결"
        case strlable_review: sStatus = "completed"; sResult = "reviewed"; break; 													//"후결"
        case strlable_after: sStatus = "completed"; sResult = "bypassed"; break; 													//"사후보고"
        case strlable_substitue: sStatus = "completed"; sResult = "substituted"; break; 											//"대결"
        case lbl_reject: sStatus = (bConsult ? "completed" : "rejected"); sResult = (bConsult ? "disagreed" : "rejected"); break; 	//"반송"        
        case strlable_hold: sStatus = "reserved"; sResult = "reserved"; break; 													  //"보류"
    }
}
function interpretType(sType, sUnitType, sRouteType) {
    switch (sType) {
        case strlable_normalapprove: sUnitType = "person"; sRouteType = "approve"; break; //"일반결재"
        case strlable_DeptConsent: sUnitType = "ou"; sRouteType = "consult"; break;       //"부서합의"
        case strlable_PersonalCon: sUnitType = "person"; sRouteType = "consult"; break;   //"개인합의"
        case strlable_recieve_apv: sUnitType = "ou"; sRouteType = "receive"; break;       //"수신결재"
        case strlable_audit_fulltime: sUnitType = "role"; sRouteType = "audit"; break;    //"상근감사"		
        case strlable_audit_daily: sUnitType = "ou"; sRouteType = "audit"; break;         //"일상감사"
        case strlable_assist: sUnitType = "ou"; sRouteType = "assist"; break;             //"협조"
        case strlable_assist: sUnitType = "person"; sRouteType = "assist"; break;         //"협조"
        case strlable_PublicInspect: sUnitType = "ou"; sRouteType = "review"; break;      //"공람"
        case strlable_SendInfo: sUnitType = "ou"; sRouteType = "notify"; break;           //"통보"
        default: sUnitType = "person"; sRouteType = "approve"; break;
    }
}
function getSplitted(src, delim, idx) { var aSrc = src.split(delim); return (aSrc.length > idx ? aSrc[idx] : ""); }
function recalcXPath(orgXPath, elmName, diff) {
    var idxbegin;
    var idxend;

    if (elmName != "person") {
        idxbegin = orgXPath.indexOf(elmName) + elmName.length + 1;
        idxend = orgXPath.indexOf("]", idxbegin);
    } else {
        idxbegin = orgXPath.indexOf(elmName) + elmName.length + 7;
        idxend = orgXPath.indexOf("]", idxbegin)
    }

    var prefix = orgXPath.substr(0, idxbegin);
    var suffix = orgXPath.substr(idxend);

    var idx = (diff == 0 ? 0 : parseInt(orgXPath.substring(idxbegin, idxend)) + diff);
    if (idx < 0) idx = 0;
    return prefix + idx + suffix;
}
function getFamilyAttribute(elmCur, sTargetNode, sAttrName) {
    var elmParent = elmCur;
    while (elmParent != null) {
        if ($(elmParent)[0].nodeName == sTargetNode) {
            if (elmParent.attr(sAttrName) == null) { return ""; } else { return elmParent.attr(sAttrName); };
        }
        elmParent = elmParent.parent();
    }
    return null;
}
function getSibling(elmCur, sLevel, sKeyName, sKeyValue, bNext, bIgnoreCurrentLevel) {
    var elmLevelCur = elmCur;
    var elmChildPath;
    bIgnoreCurrentLevel = (bIgnoreCurrentLevel == null ? false : bIgnoreCurrentLevel);
    while (elmLevelCur != null) {
        if (elmLevelCur[0].nodeName == sLevel) {
            var elmSiblingNext = (bNext ? $(elmLevelCur[0].nextSibling) : $(elmLevelCur[0].previousSibling));
            while (elmSiblingNext != null) {
                if (sKeyName == null || elmSiblingNext.attr(sKeyName) == sKeyValue) {
                    var elmNext = ((!bIgnoreCurrentLevel) && elmChildPath != null ? elmSiblingNext.find(elmChildPath) : elmSiblingNext);
                    return elmNext;
                }
                elmSiblingNext = (bNext ? elmSiblingNext.nextSibling : elmSiblingNext.previousSibling);
            }
            break;
        }
        var sCurNodeName = (
			elmLevelCur[0].nodeName == "person" || elmLevelCur[0].nodeName == "role" ?
			("person,role") :
			elmLevelCur[0].nodeName);
        elmChildPath = sCurNodeName + (elmChildPath != null ? ">" + elmChildPath : "");
        elmLevelCur = elmLevelCur.parent();
    }
    return null;
}
function getNextElm(elmCur) {
    var sRouteType = getFamilyAttribute(elmCur, "step", "routetype");
    var sUnitType = getFamilyAttribute(elmCur, "step", "unittype");
    var sCurUnitType = elmCur[0].nodeName;
    var sLevel, sKeyAttribute, sKeyValue,sAdopteeLevel,sAdopteeNodeName;
    switch (sRouteType) {
        case "approve":
            sLevel = "step";
            sKeyAttribute = "routetype";
            sKeyValue = sRouteType;
            break;
        case "assist":
        case "receive":
        case "consult":
        default:
            sLevel = sCurUnitType;
            sKeyAttribute = null;
            sKeyValue = null;
            sAdopteeLevel = "person";
            sAdopteeNodeName = "role";
            break;
    }
    var elmNext = getSibling(elmCur, sLevel, sKeyAttribute, sKeyValue, true, false);
    return elmNext;
}

function deletePerson(obj) {
	var oSelTR;
	
	if(obj!=undefined && obj !=null){ //개별 삭제 버튼 (row에 위치하는 삭제 버튼을 클릭한 경우
		oSelTR = $(obj).closest('tr')[0];
	}else{
		oSelTR = getSelectedRowApvlist();
	}
	var nrowTBindex = $(oSelTR).index();

    var sel_table = $(oSelTR).closest('table').attr('id');
    if (oSelTR == null || sel_table == 'tblccinfo') {
        Common.Warning(coviDic.dicMap["msg_apv_Line_UnSelect"]);
        return false;
    }


    if (oSelTR != null && oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != "" 
    	|| (oSelTR.childNodes[division_divisiontype].innerHTML == "send" && oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML == "charge")
    	|| (oSelTR.childNodes[division_divisiontype].innerHTML == "receive" && oSelTR.childNodes[division_taskinfo_status].innerHTML == "pending" && oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML == "charge")
    	|| (m_sApvMode != "SUBREDRAFT" && m_sApvMode != "SUBAPPROVAL" && oSelTR.childNodes[ou_taskinfo_datereceived].innerHTML != "")) {
        Common.Warning(strMsg_033); //"기안자이거나 이미 수신받은 결재자는 삭제할 수 없습니다."
        return;
    }

    if (getInfo("scChgrPersonV") != "") {
        if (oSelTR != null && oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != "" || oSelTR.childNodes[step_name].innerHTML == "담당결재_") {
            Common.Warning(strMsg_355); //"고정 담당자는 삭제할 수 없습니다."
            return;
        }
    }
    
    //전결 삭제 시 이후 결재선 처리 (결재안함 -> 일반결재)
    if(oSelTR != null && oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML == "authorize") {
    	changePrevInactive(oSelTR);
    }

    var oTable = document.getElementById("tblApvLine");

    if ($(oSelTR.childNodes[division_divisiontype]).text() == "receive" && $(oSelTR.childNodes[step_routetype]).text() == "receive" && $(oSelTR.childNodes[step_unittype]).text() == "ou") {
        switchSelectedRowApvlist(oSelTR.nextSibling.nextSibling);
        var nrowIndex = oSelTR.rowIndex;
        oTable.deleteRow(nrowIndex + 1);
        oTable.deleteRow(nrowIndex);
    } else if ($(oSelTR.childNodes[division_divisiontype]).text() == "receive" && $(oSelTR.childNodes[step_routetype]).text() == "receive" && $(oSelTR.childNodes[step_unittype]).text() == "person") {
        switchSelectedRowApvlist(oSelTR.nextSibling.nextSibling);
        var nrowIndex = oSelTR.rowIndex;
        oTable.deleteRow(nrowIndex + 1);
        oTable.deleteRow(nrowIndex);
    } else {
        switchSelectedRowApvlist(oSelTR.nextSibling);
        oTable.deleteRow(oSelTR.rowIndex);
    }
    
    var oTBody = oTable.getElementsByTagName("TBODY")[0];
    for(var i=nrowTBindex-1; i>=0; i--){
    	if($(oTBody.rows[i]).children().eq(division_divisiontype).text() != "receive"){
	    	var tmpIndex = $(oTBody.rows[i+1]).children().eq(dp_apv_no).text();
	        if (tmpIndex.length == 1) {
	            tmpIndex = ".01";
	        } else {
	            var tmpIndexDot = tmpIndex.substring(0, tmpIndex.lastIndexOf("-") + 1).split("-").join(".");
	            tmpIndex = tmpIndex.substring(tmpIndex.lastIndexOf("-") + 1);
	            tmpIndex = dblDigit(Number(tmpIndex) + 1);
	            tmpIndex = tmpIndexDot + tmpIndex;
	        }
	    	
	    	$(oTBody.rows[i].childNodes[dp_apv_no]).html(getDotCountSpace(tmpIndex));
    	}
    }
}

//일괄버튼처리
function addPersonOUALL() {
    var m_XMLDOM = CreateXmlDocument();
    m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
    if (!m_XMLDOM.parsed) {
    }
    var sElm = "selected/user";
    var sXML = aContentAdd_OnClick();

    var m_XMLDOMExt = CreateXmlDocument();
    m_XMLDOMExt.loadXML(sXML);

    //사용자 넘기기
    m_sSelectedStepType = "division";
    m_sSelectedRouteType = "approve";
    m_sSelectedAllotType = "";
    l_bGroup = false;

    if (m_sApvMode == "CHARGE") {
        m_sSelectedDivisionType = "send";
        m_sSelectedUnitType = "role";
        m_sSelectedStepRef = strlable_charge_approve; //"담당결재"
    } else if (m_sApvMode == "REDRAFT") {
        m_sSelectedDivisionType = "receive";
        m_sSelectedUnitType = "person";
        m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    } else {
        m_sSelectedDivisionType = "send";
        m_sSelectedUnitType = "person";
        m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    }

    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    //사람더하기
    $(m_XMLDOMExt).find("Items > item[itemType=user]").each(function () {
        $(m_XMLDOM).find("selected > user ").append($(this));
    });
    insertToList($(m_XMLDOM).find("selected>user"));

    //부서 넘기기
    if (getInfo("scDAdt") == 1 || getInfo("scDAdt1") == 1 || getInfo("scDCoo") == 1 || getInfo("scDCooPL") == 1 || getInfo("scDAgrSEQ") == 1 || getInfo("scDAgr") == 1 || getInfo("scDRec") == 1) {
        var szAllotType = "parallel";
        m_sSelectedStepType = "division";
        m_sSelectedDivisionType = "send";
        m_sSelectedUnitType = "ou";

        if (getInfo("scDAdt") == 1 || getInfo("scDAdt1") == 1) {
            m_sSelectedRouteType = "audit";
            m_sSelectedAllotType = "serial";
            m_sSelectedStepRef = (getInfo("scDAdt1") == 1) ? strlable_dept_audit : strlable_dept_audit3;
        }
        if (getInfo("scDCoo") == 1 || getInfo("scDCooPL") == 1) {
            m_sSelectedRouteType = "assist";
            m_sSelectedAllotType = (getInfo("scDCooPL") == 1) ? "parallel" : "serial";
            m_sSelectedStepRef = strlable_DeptConsent; //"부서합의"
        }
        if (getInfo("scDAgr") == 1 || getInfo("scDAgrSEQ") == 1) {
            m_sSelectedRouteType = "consult";
            m_sSelectedAllotType = (getInfo("scDAgr") == 1) ? "parallel" : "serial";
            m_sSelectedStepRef = strlable_DeptConsent; //"부서합의"
        }
        if (getInfo("scDRec") == 1) {
            m_sSelectedStepType = "division";
            m_sSelectedDivisionType = "receive";
            m_sSelectedRouteType = "receive";
            m_sSelectedUnitType = "ou";
            m_sSelectedAllotType = "";
            m_sSelectedStepRef = strlable_ChargeDept_Rec; //"담당부서수신"
        }

        l_bGroup = false;

        //부서더하기
        $(m_XMLDOMExt).find("Items > item[itemType=group]").each(function () {
            $(m_XMLDOM).find("selected > group ").append($(this));
        });
        insertToList($(m_XMLDOM).find("selected>group"));
    }
}

// 일반결재
function addPerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    l_bGroup = false;

    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList_BeforeRuleCheck(switchParentNode(3));
}

function addparallelPerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "parallel";
    m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList(switchParentNode(3));
}

function addRecPerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_recieve_apv; //"수신결재"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList(switchParentNode(3));
}

function addReceiptPerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "receive";
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_normalapprove; //"일반결재"
    l_bGroup = false;

    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList_BeforeRuleCheck(switchParentNode(3));
}

function addSubPerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "assist";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_recieve_apv; //"수신결재"
    l_bGroup = false;

    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList(switchParentNode(3));
}

function addChargePerson() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "role";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_charge_approve; //"담당결재"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList_BeforeRuleCheck(switchParentNode(3));
}

function addCharge() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "receive";
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_charge_approve; //"담당결재"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList(switchParentNode(3));
}

// 개인합의 (순차/병렬)
function addPConsult(sAllotType) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = (m_sApvMode == "REDRAFT" ? "receive" : "send");
    m_sSelectedRouteType = "consult";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = sAllotType; //"parallel";
    m_sSelectedStepRef = (sAllotType == "serial" ? strlable_Seq : strlable_Par);  //"순차합의":"병렬합의"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList_BeforeRuleCheck(switchParentNode(3));
}

function addReceipt() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "receive";
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_ChargeDept_Rec; //"담당부서수신"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList_BeforeRuleCheck(switchParentNode(4));
}

function addGroup() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "receive";
    m_sSelectedUnitType = "group";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = strlable_DistributeList_Rec; //"배포목록수신"
    l_bGroup = true;
    m_sSelectedUnitType = "group";
}

// 부서합의 (순차/병렬)
function addDConsult(szAllotType) {
    m_sSelectedStepType = "division";
    // m_sSelectedDivisionType = "send";
    m_sSelectedDivisionType = (m_sApvMode == "REDRAFT" ? "receive" : "send"); //수신부서 부서합의
    m_sSelectedRouteType = "consult";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = szAllotType; //"parallel";
    m_sSelectedStepRef = (szAllotType == "serial" ? strlable_DeptConsent : strlable_DeptConsent2); //"부서합의":"부서합의(병렬)"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    if (selTab == "tSearch" || selTab == "tGroup") {
	    insertToList_BeforeRuleCheck(switchParentNode(4));
    }
}

// 부서협조 (순차/병렬)
function addDAssist(szAllotType) {
    m_sSelectedStepType = "division";
    // m_sSelectedDivisionType = "send";
    m_sSelectedDivisionType = (m_sApvMode == "REDRAFT" ? "receive" : "send"); //수신부서 부서협조
    m_sSelectedRouteType = "assist";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = szAllotType; //"serial";
    m_sSelectedStepRef = (szAllotType == "serial" ? strlable_DAsist : strlable_DAsist2); //"부서협조":"부서협조(병렬)"
    l_bGroup = false;

    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    if (selTab == "tSearch" || selTab == "tGroup") {
	    insertToList_BeforeRuleCheck(switchParentNode(4));
    }
}

// 개인협조 (순차/병렬)
function addPAssist(szAllotType) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = (m_sApvMode == "REDRAFT" ? "receive" : "send");
    m_sSelectedRouteType = "assist";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = szAllotType; //"serial"
    m_sSelectedStepRef = (szAllotType == "serial" ? strlable_Seq1 : strlable_Par1); //"개인협조":"개인협조(병렬)"
    l_bGroup = false;
    
    insertToList_BeforeRuleCheck(switchParentNode(3));
}

// 전결규정 체크 후 결재선 추가 처리
function insertToList_BeforeRuleCheck(pObjList) {

	var nSelected = 0;
	if ($$(pObjList).find("item").length != 0) {
		if ($$(pObjList).find("itemType").length == 0) {
			nSelected = 1;
		}
		else {
			nSelected = $$(pObjList).find("itemType").length;
		}
	}
	if (nSelected == 0) {
    	//Common.Warning("결재선에 추가할 항목을 선택하여 주십시오");
		return;
	}
	

    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    var nCheckCount = $("#tblApvLine > tbody > tr").find("INPUT[type='checkbox']:checked").length;
    if (nCheckCount == 1) {
		var oDelRow = $("#tblApvLine > tbody > tr").find("INPUT[type='checkbox']:checked").closest("tr");
		
		if (oDelRow.find("td").eq(key_readonly).text() == "True") {
			Common.Warning("기안자이거나 이미 수신받은 결재자는 변경할 수 없습니다.");
			return;
		}
	
	    if (oDelRow.find("td").eq(step_ruleapvclass).text() == "DRAFTER") { // 선택된 ROW가 기안자 결정인 경우,
		    if (nSelected > 1) { // pObjList 개수 체크
		    	Common.Confirm("결재선에 추가 할 항목은 1개만 선택하여 주십시오.");
		    	return;
		    }
		    else {
		    	if (m_sSelectedRouteType != oDelRow.find("td").eq(step_routetype).text()) {
			    	Common.Confirm("추가 할 결재 유형이 다릅니다. 새로 추가하시겠습니까?", "", function(result) {
			    		if (result) {
		    				insertToList(pObjList);
			    		}
			    	});
			    	return;
		    	}
			    m_sSelectedRuleApvClass = oDelRow.find("td").eq(step_ruleapvclass).text();
			    m_sSelectedRuleApvClassAtt01 = oDelRow.find("td").eq(step_ruleapvclassatt01).text();
			    
    			if (!insertToList(pObjList)) {
    				return;
    			}

				// 위치 바꾸기 / 현재 선택 된 Index 체크(추가 후 자동 선택을 위해)
				var oNewRow = null;
				var isNewRow = false;
				var nIndex = 0;
				$("#tblApvLine > tbody > tr").each(function(pIntIndex) {
					if ($(this).find("INPUT[type='checkbox']").is(":checked")) {
						nIndex = pIntIndex;
					}
					
					if (!isNewRow) {
						if (m_sSelectedDivisionType != "receive") {
							var sDivisionType = $(this).find("td").eq(division_divisiontype).text();
							if ((sDivisionType != m_sSelectedDivisionType) &&
								(sDivisionType != "division")) {
								return true;
							}
						}
						else {
							nIndex = 1;
						}
						oNewRow = $(this);
						isNewRow = true;
					}
					
					if ((nIndex != 0) && (isNewRow)) {
						return false;
					}
				});
				if (oNewRow.length <= 0) {
					// null 인 경우 오류 
					return;
				}
				
			    oNewRow.insertBefore(oDelRow);
			    oDelRow.remove();
			    
				// 결재선 다시 그리기
				var sHTML_THEAD = $("#tblApvLine").find("thead").html();
			    makeApvLineXml();
			    document.getElementById("Apvlist").innerHTML = "";
			    refreshList();
			    $("#tblApvLine").find("thead").html(sHTML_THEAD);
			    
			    try {
				    oNewRow = document.getElementById("tblApvLine").lastChild.rows[nIndex - 1];
					m_selectedRowApvlist = oNewRow;
					m_selectedRowApvlistId = oNewRow.id;
	        		$(oNewRow).css("background-Color", "#eef7f9");
        		}
        		catch (e) { alert(e); }
		    }
	    }
	    else {
	    	Common.Confirm("변경이 가능한 결재선이 아닙니다. 새로 추가하시겠습니까?", "", function(result) {
	    		if (result) {
    				insertToList(pObjList);
	    		}
	    	});
	    }
    }
    else if (nCheckCount > 1) {
    	Common.Warning("변경할 결재선은 1개만 체크 해 주세요");
    	return;
    }
    else {
		insertToList(pObjList);
    }
}

function addPAudit(sMode) {//개인감사-준법감시인
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "audit";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "serial";
    m_sSelectedStepRef = sMode; 
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    if (sMode == "audit_law") {
        if (getInfo("SchemaContext.scPAdt1.value") == "") {
            insertToList(switchParentNode(3));
        } else {
            var aAudit = getInfo("SchemaContext.scPAdt1.value").split("@@"); //2007.12 변경
            var m_AuditevalXML = $.parseJSON(aAudit[2]);
            insertToList($(m_AuditevalXML));
        }
    } else {
        if (getInfo("SchemaContext.scPAdt.value") == "") {
            insertToList(switchParentNode(3));
        } else {
            var aAudit = getInfo("SchemaContext.scPAdt.value").split("@@"); //2007.12 변경
            var m_AuditevalXML = $.parseJSON(aAudit[2]);
            insertToList($(m_AuditevalXML));
        }
    }
}
function addDAudit(sMode) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "audit";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "serial";
    m_sSelectedStepRef = sMode; //"부서감사"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    if (sMode == "audit_law_dept") {
        if (getInfo("SchemaContext.scDAdt1.value") == "") {
            insertToList(switchParentNode(4));
        } else {
            var aAudit = getInfo("SchemaContext.scDAdt1.value").split("@@"); //2007.12 변경
            var m_AuditevalXML = $.parseJSON(aAudit[2]);
            insertToList($(m_AuditevalXML));
        }
    } else {
        if (getInfo("SchemaContext.scDAdt.value") == "") {
            insertToList(switchParentNode(4));
        } else {
            var aAudit = getInfo("SchemaContext.scDAdt.value").split("@@"); //2007.12 변경
            var m_AuditevalXML = $.parseJSON(aAudit[2]);
            insertToList($(m_AuditevalXML));
        }
    }

}
function addDAuditETC() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "audit";
    m_sSelectedUnitType = "ou";
    m_sSelectedAllotType = "serial";
    m_sSelectedStepRef = strlable_watch; //"감시"
    l_bGroup = false;
    var oAssistStep = $(m_oApvList).find("steps>division>step[routetype='audit'][name='감시']:has(taskinfo[datereceived!=''])");
    if (oAssistStep == null) {
        var elmRoot = m_oApvList.documentElement;
        var aAssist = gAssistOU.split(":");
        var elmAssist = elmRoot.selectSingleNode("division/step[@routetype='audit' and @name='감시']/ou");
        if (elmAssist == null) {
            var oCurrentDiv = $(m_oApvList).find("steps>division(taskinfo[status='inactive'],taskinfo[status='pending'])");
            var oStep = m_oApvList.createElement("step");
            var oOU = m_oApvList.createElement("ou");
            var oRole = m_oApvList.createElement("role");
            var oTaskinfo = m_oApvList.createElement("taskinfo");
            var oOUTaskinfo = m_oApvList.createElement("taskinfo");
            oCurrentDiv.appendChild(oStep).appendChild(oOUTaskinfo);
            oStep.appendChild(oOU).appendChild(oTaskinfo);
            oStep.setAttribute("unittype", "ou");
            oStep.setAttribute("routetype", "audit");
            oStep.setAttribute("allottype", "serial");
            oStep.setAttribute("name", strlable_watch); //"감시"
            oOU.setAttribute("code", aAssist[0]);
            oOU.setAttribute("name", aAssist[1]);
            oOUTaskinfo.setAttribute("status", "inactive");
            oOUTaskinfo.setAttribute("result", "inactive");
            oOUTaskinfo.setAttribute("kind", "normal");
            oTaskinfo.setAttribute("status", "inactive");
            oTaskinfo.setAttribute("result", "inactive");
            oTaskinfo.setAttribute("kind", "normal");
        }
        refreshList();
    } else {
        Common.Warning(strMsg_177);  //"결재선에서 감시는 단 1회 만 지정할 수 있습니다. 이미 감시가 완료되었습니다."

    }
}
//공람자추가
function addPReview() {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "review";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "parallel";
    m_sSelectedStepRef = "review"; //"일반결재"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList(switchParentNode(3));
}
function setCC(allottype,befortype) {
    m_sSelectedStepType = "ccinfo";
    m_sSelectedDivisionType = befortype;
    m_sSelectedRouteType = "ccinfo";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = allottype;
    m_sSelectedStepRef = strlable_ref; //"참조자"
    var sAddage;
    l_bGroup = false;

    var m_Json = {
       "selected": {
          "to": {},
          "cc": {},
          "bcc": {},
          "user": {},
          "group": {},
          "role": {}
       }
    };
    var $$_m_Json = $$(m_Json);
    var sSelectedUserJson = aContentAdd_OnClick();
    var $$_m_JsonExt = $$(sSelectedUserJson), context;
    //const BOOL_KEYNAME_INCLUDED = true; //[IE 10 이상 const 사용 오류]
    var BOOL_KEYNAME_INCLUDED = true;				// 선언 이외의 곳에서 값 변경 X
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
	//사람더하기
    if (getInfo("SchemaContext.scCC.isUse") === "Y" && (getInfo("SchemaContext.scCC.value") === "NN" || getInfo("SchemaContext.scCC.value").substring(0, 1) === "Y")) {
    	$$_m_JsonExt.find("Items > item[itemType=user]").concat().each(function (i, $$) {
    		$$_m_Json.find("selected > user ").append($$.json(BOOL_KEYNAME_INCLUDED));
    	});
    	context = "selected > user";
    	m_sSelectedUnitType = "person";
    	insertToList($$_m_Json.find(context));
    } else {
    	if($$_m_JsonExt.find("Items > item[itemType=user]").concat().length > 0)
    		Common.Warning(coviDic.dicMap["msg_apv_notAddCCPerson"]); //개인참조를 추가할 수 없는 양식입니다.
    }

	//부서더하기
    if (getInfo("SchemaContext.scCC.isUse") === "Y" && (getInfo("SchemaContext.scCC.value") == "NN" || getInfo("SchemaContext.scCC.value").substring(1) === "Y")) {
    	$$_m_JsonExt.find("Items > item[itemType='group']").concat().each(function (i, $$) {
        	// 선택된 데이터 중 중복 되지 않은 데이터만
        	if (!isDupl($$, $$_m_Json, BOOL_KEYNAME_INCLUDED)) {
        		$$_m_Json.find("selected > group ").append($$.json(BOOL_KEYNAME_INCLUDED));
        	}
    	});
    	context = "selected > group";
    	m_sSelectedUnitType = "ou";
    	insertToList($$_m_Json.find(context));
    } else {
    	if($$_m_JsonExt.find("Items > item[itemType=group]").concat().length > 0)
    		Common.Warning(coviDic.dicMap["msg_apv_notAddCCDept"]); //부서참조를 추가할 수 없는 양식입니다.
    }
}

function reverseItems(oNodeList) {
    if (oNodeList.length > 0) {
        var sList = "";
        for (var i = 0; i < oNodeList.length; i++) {
            var oPNode = oNodeList[i];
            if (l_bGroup) {
                sList += "<item tl=\"" + "" + "\" po=\"" + "" + "\" lv=\"" + "" + "\"><DN>" + oPNode.getAttribute("name") + "</DN><DO>" + oPNode.getAttribute("name") + "</DO><JD/><LN/><FN/><TL>" + "" + "</TL><PO>" + "" + "</PO><LV>" + "" + "</LV><AN>" + oPNode.getAttribute("code") + "</AN><PI/><CP/><DP>" + oPNode.getAttribute("name") + "</DP><RGNM>" + oPNode.getAttribute("name") + "</RGNM><OF/><CY/><EM/><SO/><SG>" + "" + "</SG><RG>" + oPNode.getAttribute("code") + "</RG></item>";
            } else {
                sList += "<item tl=\"" + oPNode.getAttribute("title") + "\" po=\"" + oPNode.getAttribute("position") + "\" lv=\"" + oPNode.getAttribute("level") + "\"><DN>" + oPNode.getAttribute("name") + "</DN><DO>" + oPNode.getAttribute("name") + "</DO><JD/><LN/><FN/><TL>" + oPNode.getAttribute("title").split(";")[1] + "</TL><PO>" + oPNode.getAttribute("position").split(";")[1] + "</PO><LV>" + oPNode.getAttribute("level").split(";")[1] + "</LV><AN>" + oPNode.getAttribute("code") + "</AN><PI/><CP/><DP>" + oPNode.getAttribute("ouname") + "</DP><RGNM>" + oPNode.getAttribute("ouname") + "</RGNM><OF/><CY/><EM/><SO/><SG>" + oPNode.getAttribute("oucode") + "</SG><RG>" + oPNode.getAttribute("oucode") + "</RG></item>";
            }
        }
        return sList;
    }
}

function deleteCC(obj) {
	var oSelTR;

	if(obj!=undefined && obj !=null){ //개별 삭제 버튼 (row에 위치하는 삭제 버튼을 클릭한 경우)
		oSelTR = $(obj).closest('tr')[0];
	}else{
		 oSelTR = getSelectedRowApvlist();
	}

	var sel_table = $(oSelTR).closest('table').attr('id');
	if (oSelTR == null || sel_table == 'tblApvLine') {
		Common.Warning(coviDic.dicMap["msg_apv_Line_UnSelect"]);
		return;
	}

    if (oSelTR.childNodes[ccinfo_datereceived].innerHTML != "") {
        Common.Warning(strMsg_348); //"이미 받은 문서는 삭제 할 수 없습니다."
        return;
    }
    switchSelectedRowApvlist(oSelTR.nextSibling);
    var oTable = document.getElementById("tblccinfo");
    oTable.deleteRow(oSelTR.rowIndex);
}

//oList --> 조직도 화면에서 리턴값으로 넘어온 xml 데이타
function insertToList(oList) {
    if (m_sSelectedRouteType == 'dist') {
		// 배포는 별도 UI에 처리... dist로 들어오는 Case가 있나??
        setDistDept(oList);
        return true;
    }

    var $$_oSrcDoc = $$(oList);
    
    //결재선에 중복 사용자 삽입 방지
    if (m_sSelectedUnitType != "ou" && m_sApvMode != "SUBREDRAFT" && getInfo("SchemaContext.scChkDuplicateApv.isUse") == "Y") {
        $$_oSrcDoc = chkDuplicateApprover($$_oSrcDoc);
    } else if (m_sSelectedRouteType == "ccinfo") {
        $$_oSrcDoc = chkDuplicateApprover($$_oSrcDoc);
    } else {
        $$_oSrcDoc = $$_oSrcDoc;
    }
    if ($$_oSrcDoc.find("item").length == 0) {
        return false;
    }
    var index = "";

    $$_oSrcDoc.find("item").concat().each(function (i, $$_element) {

        var arrDivision = [];
        var arrDivisionTaskinfo = [];
        if (m_sSelectedDivisionType == "receive" && m_sSelectedRouteType == "receive") {
            var oTBody = document.getElementById("tblApvLine").lastChild;
            if (oTBody.lastChild != null) { //1 - 발신 없으면 말들기
                if ($(oTBody.lastChild).children().eq(dp_apv_no).text() != "1") {
                    var arrDivisionS = [];
                    var arrDivisionTaskinfoS = [];
                    var arrStepS = [];
                    var arrStepTaskinfoS = [];
                    var arrOuS = [];
                    var arrOuTaskinfoS = [];
                    var arrRolePersonS = [];
                    var arrRolePersonTaskinfoS = [];
                    var arrRolePersonTaskinfoCommentS = [];
                    var arrRolePersonTaskinfoCommentLastS = [];
                    var arrRolePersonTaskinfoCommentFileInfoS = [];

                    arrDivisionS.push("send"); //division_divisiontype
                    arrDivisionS.push("발신"); //division_name
                    arrDivisionS.push(""); //division_oucode
                    arrDivisionS.push(""); //division_ouname

                    arrDivisionTaskinfoS.push("inactive");
                    arrDivisionTaskinfoS.push("inactive");
                    arrDivisionTaskinfoS.push(m_sSelectedDivisionType);
                    arrDivisionTaskinfoS.push("");
                    arrDivisionTaskinfoS.push("");
                    inserthtmlrow("tblApvLine", 1, viewtype, "True", "Division", arrDivisionS, arrDivisionTaskinfoS, arrStepS, arrStepTaskinfoS, arrOuS, arrOuTaskinfoS, arrRolePersonS, arrRolePersonTaskinfoS, arrRolePersonTaskinfoCommentS, arrRolePersonTaskinfoCommentLastS, arrRolePersonTaskinfoCommentFileInfoS, "");
                }
            }

            var nDivisionNo = 1;
            {//division 번호 가져 오기
                var oTable = document.getElementById("tblApvLine");
                //if (oTable.childNodes.length <= 1) { colgroup 추가로 변경
                if ($(oTable).find('tbody').length <= 0) {
                    oTBody = document.createElement("TBODY");
                } else {
                    oTBody = oTable.lastChild;
                }
                var nTBodyRow = oTBody.childNodes;
                for (var j = 0; j < nTBodyRow.length; j++) {
                    if ($(nTBodyRow[j].childNodes[key_displayonly]).text() == "True") {
                        nDivisionNo++;
                    }
                }

            }
            //수신처 제한 확인
            if (gRequestDivisionLimit == "" || gRequestDivisionLimit == "0") {
                //제한없음
            } else {
                if ((nDivisionNo - 1) > parseInt(gRequestDivisionLimit)) {
                    return false;
                }
            }
            var arrDivisionR = [];
            var arrDivisionTaskinfoR = [];
            var arrStepR = [];
            var arrStepTaskinfoR = [];
            var arrOuR = [];
            var arrOuTaskinfoR = [];
            var arrRolePersonR = [];
            var arrRolePersonTaskinfoR = [];
            var arrRolePersonTaskinfoCommentR = [];
            var arrRolePersonTaskinfoCommentLastR = [];
            var arrRolePersonTaskinfoCommentFileInfoR = [];

            arrDivisionR.push("receive"); //division_divisiontype
            arrDivisionR.push(m_sSelectedStepRef); //division_name
            if($$_element.attr("itemType") == "user"){
            	arrDivisionR.push($$_element.attr('RG')); //division_oucode
            	arrDivisionR.push($$_element.attr('RGNM')); //division_ouname
            }
            else{
            	arrDivisionR.push($$_element.attr('AN')); //division_oucode
            	arrDivisionR.push($$_element.attr('DN')); //division_ouname
            }

            arrDivisionTaskinfoR.push("inactive");
            arrDivisionTaskinfoR.push("inactive");
            arrDivisionTaskinfoR.push(m_sSelectedDivisionType);
            arrDivisionTaskinfoR.push("");
            arrDivisionTaskinfoR.push("");


            inserthtmlrow("tblApvLine", nDivisionNo, viewtype, "True", "Division", arrDivisionR, arrDivisionTaskinfoR, arrStepR, arrStepTaskinfoR, arrOuR, arrOuTaskinfoR, arrRolePersonR, arrRolePersonTaskinfoR, arrRolePersonTaskinfoCommentR, arrRolePersonTaskinfoCommentLastR, arrRolePersonTaskinfoCommentFileInfoR, "");

            arrDivision.push(m_sSelectedDivisionType); //division_divisiontype
            arrDivision.push(m_sSelectedStepRef); //division_name
            if($$_element.attr("itemType") == "user"){
            	arrDivision.push($$_element.attr('RG')); //division_oucode
            	arrDivision.push($$_element.attr('RGNM')); //division_ouname
            }
            else{
            	arrDivision.push($$_element.attr('AN')); //division_oucode
            	arrDivision.push($$_element.attr('DN')); //division_ouname
            }

            arrDivisionTaskinfo.push("inactive");
            arrDivisionTaskinfo.push("inactive");
            arrDivisionTaskinfo.push(m_sSelectedDivisionType);
            arrDivisionTaskinfo.push("");
            arrDivisionTaskinfo.push("");
        } else if (m_sSelectedStepType == "ccinfo") {
            arrDivision.push(m_sSelectedAllotType); //send,receiver
            arrDivision.push(m_sSelectedDivisionType); //befor,after
            arrDivision.push(""); //division_oucode
            arrDivision.push(m_oFormMenu.getInfo("AppInfo.usid")); //senderid
            arrDivision.push(m_oFormMenu.getInfo("AppInfo.usnm_multi")); //sendername
        } else {
            arrDivision.push(m_sSelectedStepType); //division_divisiontype
            arrDivision.push(m_sSelectedStepRef); //division_name
            arrDivision.push($$_element.attr('RG')); //division_oucode
            arrDivision.push($$_element.attr('RGNM')); //division_ouname
        }

        var arrStep = [];
        arrStep.push(m_sSelectedUnitType); //step_unittype
        arrStep.push(m_sSelectedRouteType); //step_routetype
        arrStep.push(m_sSelectedAllotType); //step_allottype
        arrStep.push(m_sSelectedStepRef); //step_name
        arrStep.push(m_sSelectedRuleApvClass); //step_ruleapvclass
        arrStep.push(m_sSelectedRuleApvClassAtt01); //step_ruleapvclassatt01

        var arrStepTaskinfo = null;
        if (m_sSelectedRouteType == "consult" || m_sSelectedRouteType == "assist" || m_sSelectedRouteType == "audit") {
            arrStepTaskinfo = [];
            arrStepTaskinfo.push("inactive"); //step_taskinfo_status
            arrStepTaskinfo.push("inactive"); //step_taskinfo_result
            if (m_sSelectedRouteType == "consult") {
                arrStepTaskinfo.push("consult"); //step_taskinfo_kind
            } else if (m_sSelectedRouteType == "review") {
                arrStepTaskinfo.push("review"); //step_taskinfo_kind
            } else if (m_sSelectedStepRef == "confirm") {
                arrStepTaskinfo.push("confirm"); //step_taskinfo_kind
            } else if (m_sSelectedStepRef == "reference") {
                arrStepTaskinfo.push("reference"); //step_taskinfo_kind
            } else {
                arrStepTaskinfo.push("normal"); //step_taskinfo_kind
            }
            arrStepTaskinfo.push(""); //step_taskinfo_datereceived
            arrStepTaskinfo.push(""); //step_taskinfo_datecompleted
        }
        //동시결재 taskinfo 추가
        if (m_sSelectedRouteType == "approve" && m_sSelectedAllotType == "parallel") {
            arrStepTaskinfo = [];
            arrStepTaskinfo.push("inactive"); //step_taskinfo_status
            arrStepTaskinfo.push("inactive"); //step_taskinfo_result
            if (m_sSelectedRouteType == "consult") {
                arrStepTaskinfo.push("consult"); //step_taskinfo_kind
            } else if (m_sSelectedRouteType == "review") {
                arrStepTaskinfo.push("confirm"); //step_taskinfo_kind
            } else if (m_sSelectedStepRef == "confirm") {
                arrStepTaskinfo.push("confirm"); //step_taskinfo_kind
            } else if (m_sSelectedStepRef == "reference") {
                arrStepTaskinfo.push("reference"); //step_taskinfo_kind
            } else {
                arrStepTaskinfo.push("normal"); //step_taskinfo_kind
            }
            arrStepTaskinfo.push(""); //step_taskinfo_datereceived
            arrStepTaskinfo.push(""); //step_taskinfo_datecompleted
        }

        var arrOu = [];
        var arrOuTaskinfo = [];
        var arrRolePerson = [];
        var arrRolePersonTaskinfo = [];
        var arrRolePersonTaskinfoComment = [];
        var arrRolePersonTaskinfoCommentLast = null;
        var arrRolePersonTaskinfoCommentFileInfo = null;

        var taskType = "RolePerson";
        
        if (m_sSelectedUnitType == "ou") {
            arrOu.push($$_element.attr('AN')); //ou_code
            arrOu.push($$_element.attr('DN')); //ou_name

            arrOuTaskinfo.push("inactive"); //ou_taskinfo_status
            arrOuTaskinfo.push("inactive"); //ou_taskinfo_result
            switch (m_sSelectedRouteType) {
                case "consult":
                    arrOuTaskinfo.push("consult"); //ou_taskinfo_kind
                    break;
                case "review":
                case "confirm":
                    arrOuTaskinfo.push("confirm"); //ou_taskinfo_kind
                    break;
                case "reference":
                    arrOuTaskinfo.push("reference"); //ou_taskinfo_kind
                    break;
                default:
                    arrOuTaskinfo.push("normal"); //ou_taskinfo_kind
            }
            arrOuTaskinfo.push(""); //ou_taskinfo_datereceived
            arrOuTaskinfo.push(""); //ou_taskinfo_datecompleted
            arrOuTaskinfo.push(""); //ou_taskinfo_piid

            arrRolePerson = null;
            arrRolePersonTaskinfo = null;
            arrRolePersonTaskinfoComment = null;
            arrRolePersonTaskinfoCommentLast = null;
            taskType = "Ou";
        } else {
            arrOu.push($$_element.attr('RG')); //ou_code
            arrOu.push($$_element.attr('RGNM')); //ou_name

            arrOuTaskinfo = null;

            arrRolePerson.push(m_sSelectedUnitType); //roleperson_nodetype
            arrRolePerson.push($$_element.attr("AN")); //roleperson_code
            arrRolePerson.push($$_element.attr("DN")); //roleperson_name
            arrRolePerson.push($$_element.attr("po")); //roleperson_position
            arrRolePerson.push($$_element.attr("tl")); //roleperson_title
            arrRolePerson.push($$_element.attr("lv")); //roleperson_level
            arrRolePerson.push($$_element.attr("SG")); //roleperson_oucode
            arrRolePerson.push($$_element.attr("SGNM")); //roleperson_ouname
            arrRolePerson.push($$_element.attr("SIP")); //roleperson_sipaddress

            arrRolePersonTaskinfo.push("inactive"); //roleperson_taskinfo_status
            arrRolePersonTaskinfo.push("inactive"); //roleperson_taskinfo_result

            if (m_sSelectedRouteType == "consult") {
                arrRolePersonTaskinfo.push("consult"); //roleperson_taskinfo_kind
            } else if (m_sSelectedRouteType == "review") {
                arrRolePersonTaskinfo.push("confirm"); //roleperson_taskinfo_kind
            } else if (m_sSelectedStepRef == "confirm") {
                arrRolePersonTaskinfo.push("confirm"); //roleperson_taskinfo_kind
            } else if (m_sSelectedStepRef == "reference") {
                arrRolePersonTaskinfo.push("reference"); //roleperson_taskinfo_kind
            } else if(m_sSelectedStepRef == strlable_charge_approve) { // 담당결재(담당자 지정)
            	arrRolePersonTaskinfo.push("charge"); //roleperson_taskinfo_kind
            } else {
                arrRolePersonTaskinfo.push("normal"); //roleperson_taskinfo_kind
            }

            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_datereceived
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_datecompleted
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_rejectee
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_wiidrejectedto
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_daterejectedto
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_wiid
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_visible
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_customattribute1
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_customattribute2
            arrRolePersonTaskinfo.push(""); //roleperson_taskinfo_mobilegubun  //모바일 결재 여부

            arrRolePersonTaskinfoComment = null;
            arrRolePersonTaskinfoCommentLast = null;
            arrRolePersonTaskinfoCommentFileInfo = null;
            taskType = "RolePerson";
        }
        if (m_sSelectedRouteType == "ccinfo") {
            inserthtmlrowCC("tblccinfo", taskType, arrDivision, arrOu, arrRolePerson);
        } else {
            inserthtmlrow("tblApvLine", index, viewtype, "False", taskType, arrDivision, arrDivisionTaskinfo, arrStep, arrStepTaskinfo, arrOu, arrOuTaskinfo, arrRolePerson, arrRolePersonTaskinfo, arrRolePersonTaskinfoComment, arrRolePersonTaskinfoCommentLast, arrRolePersonTaskinfoCommentFileInfo,"");
        }
    }
	);

    return true;
}
//var gselectedRowId = null;

var viewtype = "create";
//*결재선 목록 그리기
function refreshList() {
    viewtype = "read";
    if (getInfo("Request.loct") == "PREAPPROVAL" || getInfo("Request.loct") == "COMPLETE") {
        viewtype = "read";
    } else {
        switch (m_sApvMode) {
            case "DRAFT":
            case "TEMPSAVE": viewtype = "create"; break;
            case "REDRAFT": viewtype = "change"; break;
            case "SUBREDRAFT": viewtype = "change"; break;
            case "APVLINE": viewtype = "create"; break;
            case "APPROVAL": viewtype = "change"; break;
            case "SUBAPPROVAL": viewtype = "change"; break;
            case "RECAPPROVAL": viewtype = "change"; break;
            case "CHARGE": viewtype = "change"; break;
            case "PROCESS": viewtype = "change"; break;
            case "DEPTLIST":
                viewtype = "create"; break;
            case "AUDIT":
                viewtype = "create"; break;
            default: viewtype = "read"; break;
        }
    }
    var oTable = document.createElement("table");
	oTable.id = "tblApvLine";
	oTable.className = "tableStyle t_center hover infoTable"; //"app_line_conf_applist_table"; 디자인 변경으로 클래스명 변경
	oTable.cellSpacing = 0;
    oTable.cellPadding = 0;
    
    var szHeader = "";
    var szLIST = "";
    switch (viewtype) {
        case "read": //szHeader = szLISTread; break;
        case "change":
        case "create":
            fn_tblCreateHead(oTable); //디자인 변경으로 head 그리지 않음.
            break;
    }
    
    document.getElementById("Apvlist").appendChild(oTable);
    var didx = 1;
    var delIdx = 0;
    var tempIndexStep = -1;
    
    var $$_elmList = $$_m_oApvList.find("steps > division");
    $$_m_oApvList.find("steps > division").concat().each(function (index_div, $$_odiv) {
        var $$_osteps = $$_odiv.find("step");
        var $$_ohiddensteps = $$_odiv.find("step > taskinfo[visible='n']");
        if ($$_elmList.valLength() > 1) {
            calltemplatehtmlrow((index_div + 1), viewtype, $$_odiv.find(">taskinfo"), "True");
        }   
        
        delIdx = 0;
        $$_odiv.find("step").concat().each(function (index_step, $$_ostep) {
        	//if($$_ostep.find("person>taskinfo").attr("visible") != "n" && $$_ostep.find("person>taskinfo").attr("kind") != "bypass"){
	            var $$_osteptaskinfo = $$_ostep.find("taskinfo");
	            var steproutetype = $$_ostep.attr("routetype");
	            var stepunittype = $$_ostep.attr("unittype");
	            var parentunittype = steproutetype;
	            var stepruleapvclass = $$_ostep.attr("ruleapvclass");
	            var stepruleapvclassatt01 = $$_ostep.attr("ruleapvclassatt01");
	            var assureouvisible = "";
	            if (steproutetype == "notify") {
	            } //else if (!$$_osteptaskinfo.exist() && $$_osteptaskinfo.attr("visible") == 'n') {}
	            else {
	                if (stepunittype == "ou" && (steproutetype == "assist" || steproutetype == "consult" || steproutetype == "receive" || steproutetype == "audit")) {
	                    assureouvisible = "true";
	                    assureouvisibleCheck = true;
	                }
	                var $$_oous = $$_ostep.find("ou");
	                var $$_ohiddenoous = $$_ostep.find("ou > taskinfo[visible='n']");
	                if($$_ohiddenoous.concat().length > 0) return;
	                
	                $$_ostep.find("ou").concat().each(function (index_ou, $$_oou) {
	                    var $$_ooutaskinfo = $$_oou.find(">taskinfo");
	                    var $$_opersons = $$_oou.find("person", "role");
	                    var $$_ohiddenpersons = $$_oou.find("person > taskinfo[visible='n']", "role > taskinfo[visible='n']");
	
	                    var cntvisibleperson = $$_opersons.length - $$_ohiddenpersons.length;
	
	                    if ((stepunittype != 'person' && cntvisibleperson == 0) || (cntvisibleperson > 0 && assureouvisible == 'true')) {
	                        if ($$_ooutaskinfo.length === 0 || $$_ooutaskinfo.attr("visible") == 'n' || $$_ooutaskinfo.attr("kind") == 'bypass') {
	                            if (tempIndexStep != index_step) {
	                                delIdx--;
	                            }
	                        }
	                        var index_total = dblDigit(index_div + 1);
	                        index_total += ((index_total != "") ? "." : "") + dblDigit(index_step + 1 + delIdx);
	                        if ($$_oous.length > 1) {
	                            index_total += ((index_total != "") ? "." : "") + dblDigit(index_ou + 1 + delIdx);
	                        }
	
	                        calltemplatehtmlrow(index_total, viewtype, $$_oou.find("taskinfo"), "False", true);
	                        //if (ApvListDisplayOrder == "DESC") { szLIST = sHTML + szLIST; } else { szLIST = szLIST + sHTML; }
	                        didx++;
	                    }
	
	                    $$_oou.find("person", "role").concat().each(function (index_person, $$_operson) {
	                        var $$_otaskinfo = $$_operson.find("taskinfo");
	                        //role인경우 처리
	                        if ($$_otaskinfo.length == 0) {
	                            $$_otaskinfo = $$_operson.parent().find("taskinfo");
	                            $$_operson = $$_operson.parent();
	                        }
	                        if ($$_otaskinfo.attr("visible") == 'n' || $$_otaskinfo.attr("kind") == 'bypass') {
	                            if (tempIndexStep != index_step) {
	                                delIdx--;
	                            }
	                        }
	                        var index_total = dblDigit(index_div + 1);
	                        //index_total += ((index_total != "") ? "." : "") + dblDigit(index_step + 1 + delIdx);
	
	                        //부서합의 내 결재선만 보여주는 방식으로 변경되어 수정함
	                        if (getInfo("Request.mode") == "SUBAPPROVAL") {
	                            index_total += ((index_total != "") ? "." : "") + dblDigit(index_person + 1 + delIdx);
	                        } else {
	                            index_total += ((index_total != "") ? "." : "") + dblDigit(index_step + 1 + delIdx);
	                        }
	
	                        var displayname = "";
	                        var title = ";";
	                        var level = ";";
	                        var oudisplayname = "";
	                        var code = "";
	
	                        var oroleperson = null;
	                        if ($$_operson.nodename() == "role") {
	                            displayname = $$_operson.attr("name");
	                            oudisplayname = $$_operson.attr("ouname");
	                            code = $$_operson.attr("code");
	                        } else {
	                            displayname = $$_operson.attr("name");
	                            title = $$_operson.attr("title");
	                            level = $$_operson.attr("position");
	                            oudisplayname = $$_operson.attr("ouname");
	                            code = $$_operson.attr("code");
	                        }
	                        if (assureouvisible == "true") {
	                            if (getInfo("Request.mode") == "SUBAPPROVAL") {
	                                calltemplatehtmlrow(index_total, viewtype, $$_otaskinfo, "False");
	                            }
	                        } else {
	                            var displayBypass = true;
	                            if ($$_otaskinfo.attr("kind") == 'bypass') {
					                var step_taskinfo = $$_otaskinfo.closest("step").find("person > taskinfo[kind='charge'], person > taskinfo[kind='substitute']");
	                                if (step_taskinfo.length >= 1) {
	                                    displayBypass = false;
	                                } 
	                                if($$_otaskinfo.closest("step").attr("name") == "원결재자") {
	                                	displayBypass = false;
	                                }
	                            }
	                            calltemplatehtmlrow(index_total, viewtype, $$_otaskinfo, "False", displayBypass);
	                        }
	                        //if (ApvListDisplayOrder == "DESC") { szLIST = sHTML + szLIST; } else { szLIST = szLIST + sHTML; }
	                        didx++;
	                        tempIndexStep = index_step;
	                    });
	                });
	            }
        	//}
        });
    });
}

function refreshCC(bAll) {
    if (bAll) $("#tblccinfo tbody tr").remove();
    var taskType = "";
    $$_m_oApvList.find("steps > ccinfo").concat().each(function (index_cc, $$_occ) {
        $$_occ.find("ou").concat().each(function (index_ou, $$_oou) {
            var arrCCinfo = [];
            var arrOu = [];
            var arrPerson = [];

            if ($$_oou.length !== 0) {
                var sbeforecc = "n";
                if ($$_oou.parent().attr("beforecc") != null) {
                    if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") {
                        sbeforecc = $$_oou.parent().attr("beforecc");
                    }
                    else {
                        $$_oou.parent().remove("beforecc");
                    }
                }
                arrCCinfo.push($$_oou.parent().attr("belongto"));
                arrCCinfo.push(sbeforecc);
                arrCCinfo.push($$_oou.parent().attr("datereceived"));
                arrCCinfo.push($$_oou.parent().attr("senderid"));
                arrCCinfo.push($$_oou.parent().attr("sendername"));

                arrOu.push(($$_oou.attr("code") == null) ? "" : $$_oou.attr("code"));
                arrOu.push(($$_oou.attr("name") == null) ? "" : $$_oou.attr("name"));
            }
            if ($$_oou.find("person").length == 0) {
                taskType = "Ou";
                inserthtmlrowCC("tblccinfo", taskType, arrCCinfo, arrOu, null);
            } else {
                taskType = "RolePerson";

                var $$_operson = $$_oou.find("person");
                if ($$_operson.length > 0) {
                    arrPerson.push("");
                    arrPerson.push(($$_operson.attr("code") == null) ? "" : $$_operson.attr("code"));
                    arrPerson.push(($$_operson.attr("name") == null) ? "" : $$_operson.attr("name"));
                    arrPerson.push(($$_operson.attr("position") == null) ? "" : $$_operson.attr("position"));
                    arrPerson.push(($$_operson.attr("title") == null) ? "" : $$_operson.attr("title"));
                    arrPerson.push(($$_operson.attr("level") == null) ? "" : $$_operson.attr("level"));
                    arrPerson.push(($$_operson.attr("oucode") == null) ? "" : $$_operson.attr("oucode"));
                    arrPerson.push(($$_operson.attr("ouname") == null) ? "" : $$_operson.attr("ouname"));
                    arrPerson.push(($$_operson.attr("sipaddress") == null) ? "" : $$_operson.attr("sipaddress"));
                }
                inserthtmlrowCC("tblccinfo", taskType, arrCCinfo, arrOu, arrPerson);
            }
        });
    });
}

/*======================================
--전결규정 버튼 표시에 따른 UI 처리
--====================================*/
function refreshRule(isChanged, ruleItem) {
	/* // 버튼 위치 변경에 따라 코드 변경
	var $div = $("<div>",{ "class" : "appBox_appline" })
		.append(
			$("<div>",{ "class" : "nea_appline_wrap", "style" : "margin:auto;" })
				.append(
					$("<div>",{ "class" : "nea_appline_top" })
						.append($("<p>", { "class" : "nea_appline_tit" }).text(coviDic.dicMap.apv_btn_rule))
						.append($("<ul>", { "class" : "nea_appline_list" }))
						.append($("<a>", { "href" : "#", "class" : "nea_appline_btn", "id" : "btnChangeRuleApv" }).append($("<span>").text(coviDic.dicMap.lbl_apv_change)))
						.append($("<input>", { "type" : "hidden", "id" : "hidRuleItemInfo" }))
				)
				.append(
					$("<div>",{ "class" : "nea_appline_bot" })
						.append($("<p>", { "class" : "nea_appline_tit" }).text(coviDic.dicMap.lbl_ApprovalLine))
						.append($("<ul>", { "class" : "nea_appline_list" }))
				)
		);
	
	$("#orgTargetDiv > div.appBox_appline").remove();
	$("#orgTargetDiv").prepend($div);
	*/

	if ($("#searchdiv").find("SPAN[id='spanRuleApv']").length <= 0) {
		$("#searchdiv").append("<span id=\"spanRuleApv\"><input type=\"button\" class=\"smButton\" id=\"btnChangeRuleApv\" name=\"btnChangeRuleApv\" value=\"" + coviDic.dicMap.apv_btn_rule + "\" style=\"padding: 0px; width: 80px; height: 30px; margin-left: 5px;\" /></span>");
		
		$("#btnChangeRuleApv").on("click", function(){    
		    CFN_OpenWindow("/approval/getApprovalLinePopup.do", "", 1000, 400, "scroll");
		});
	}
	
	ruleItem && setRuleApvLine(isChanged, ruleItem);
}

function setRuleApvLine(isChanged, ruleItem) {
	if(isChanged) {
		var itemId = ruleItem;
		$.ajax({
			type:"POST",
			url:"admin/getItemMoreInfo.do",
			async: false,
			data:{
				"itemId":itemId
			},
			success:function(data){
				if(data.result == "ok" && data.list.length > 0){				
					ruleItem = data.list[0];
					$("#hidRuleItemInfo").val(JSON.stringify(ruleItem));
				}
			},
			error:function(response, status, error){
				CFN_ErrorAjax("admin/getItemMoreInfo.do", response, status, error);
			}
		});
	} else {
		ruleItem = JSON.parse(ruleItem);
	}
	
	//전결규정 정보
	var pathArr = ruleItem.PATH.split(">");
	$(".nea_appline_top").find("ul").append(
		pathArr.map( function(item, idx) { 
			var $li = $("<li>").html(item.trim());
			if(idx == pathArr.length-1) {
				if(ruleItem.MaxAmount && ruleItem.MaxAmount.split(".")[0] != "0") {
					$li.append($("<span>", { "class" : "nea_appline_span", "style" : "margin: 5px;" }).html("( ~" + CFN_AddComma(ruleItem.MaxAmount.split(".")[0]) + " " + coviDic.dicMap.lbl_below + ")"));
				} else if(ruleItem.ItemDesc) {
					$li.append($("<span>", { "class" : "nea_appline_span", "style" : "margin: 5px;" }).html("(" + ruleItem.ItemDesc + ")"));
				}
			}
			return $li;
		})
	);
		
	//결재/합의/협조
	var $step = $($$_m_oApvList.find("step").json());								
	$(".nea_appline_bot").find("ul").append(
		$step.map( function (idx, item) {
			var $li = 
				item.ou.length > 1
					? $(item.ou).map( function(i, ou) { return $("<li>").html(ou.person ? CFN_GetDicInfo(ou.person.name) : CFN_GetDicInfo(ou.name)); } )
					: $("<li>").html(item.ou.person ? CFN_GetDicInfo(item.ou.person.name) : CFN_GetDicInfo(item.ou.name));				
			return $li;
		}).map( function (idx, item) { return item[0] })
	);

	//참조
	var $ccinfo = $($$_m_oApvList.find("ccinfo").json());
	if($ccinfo.length > 0) {		
		var ccinfoStr = "";					
		$ccinfo.each( function (idx, item) { ccinfoStr += (item.ou.person ? CFN_GetDicInfo(item.ou.person.name) : CFN_GetDicInfo(item.ou.name)) + "," } )
		
		$(".nea_appline_bot").find("ul").append(
			$("<li>").append(
				$("<span>", { "class" : "nea_appline_span" }).html(coviDic.dicMap.lbl_apv_cc + "(" + ccinfoStr.substr(0, ccinfoStr.length -1) + ")")
			)
		);
	}
}

function moveUpDown(str) {
    var tmpTR,oTBody;
    var tmpIndex;
    var oSelTR = getSelectedRowApvlist();

    var sel_table = $(oSelTR).closest('table').attr('id');
    if (oSelTR == null || sel_table == 'tblccinfo') {
        Common.Warning(coviDic.dicMap["msg_apv_Line_UnSelect"]); // 대상을 선택하세요.
        return false;
    }

    if ($(oSelTR.childNodes[key_readonly]).text() == "True") return;

    if (str == "UP") {
        tmpTR = $(oSelTR).prev('tr');
        if (tmpTR.length != 0 && $(tmpTR[0].childNodes[key_readonly]).text() == "True") return;
        tmpTR.before($(oSelTR));
    } else {
        tmpTR = $(oSelTR).next('tr');
        if ($(tmpTR[0].childNodes[key_readonly]).text() == "True") return;
        tmpTR.after($(oSelTR));
    }
    if (tmpTR[0] != null) {
        tmpIndex = tmpTR[0].childNodes[dp_apv_no].innerHTML;
        tmpTR[0].childNodes[dp_apv_no].innerHTML = oSelTR.childNodes[dp_apv_no].innerHTML;
        oSelTR.childNodes[dp_apv_no].innerHTML = tmpIndex;
    }

    //동시결재일때 같은 번호 써야함 
    var oTable = document.getElementById("tblApvLine");
    if ($(oTable).find('tbody').length <= 0) {
        oTBody = document.createElement("TBODY");
    } else {
        oTBody = oTable.lastChild;
    }
    var nTBodyRow = oTBody.childNodes;
    var nSelecter = 0;
    for (var j = nTBodyRow.length - 1; j >= 0; j--) {
        if (nTBodyRow[j] == oSelTR) {
            nSelecter = j;
        }
    }
    makeApvLineXml();
    document.getElementById("Apvlist").innerHTML = "";
    refreshList();

    var oTable = document.getElementById("tblApvLine");
    if ($(oTable).find('tbody').length <= 0) {
        oTBody = document.createElement("TBODY");
    } else {
        oTBody = oTable.lastChild;
    }
    var nTBodyRow = oTBody.childNodes;
    for (var j = nTBodyRow.length - 1; j >= 0; j--) {
        if (j == nSelecter) {
            switchSelectedRowApvlist(nTBodyRow[j]);
        }
    }
}

function statusChange(e) {
    var bSetDirty = false;
    var oSelTR;
    oSelTR = getPatentRowApvlist(e)
    var xpathCur = oSelTR.id;
    if (window.ActiveXObject === undefined) { xpathCur = ConvertXpath(xpathCur); }

    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

    var sRouteType = getFamilyAttribute(elmCur, "step", "routetype");
    var sUnitType = getFamilyAttribute(elmCur, "step", "unittype");

    //본인이 속해있는 결재단계만 수정을 한다.
    //합의 부서에서 일반결재 단계 수정을 막는다.
    if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (sRouteType == "approve")) {
        refreshList();
        return;
    }
    if ((m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") && (sRouteType != "approve")) {
        var Curpiid = m_oCurrentOUNode.selectSingleNode("taskinfo/@piid").text;
        var Cmppiid = elmCur.parentNode.selectSingleNode("taskinfo/@piid").text;
        if (Curpiid == Cmppiid) {
        } else {
            refreshList();
            return;
        }
    }

    var elmNext = getNextElm(elmCur);
    var sCurType = (window.ActiveXObject === undefined) ? e.target.value : event.srcElement.value;

    switch (sCurType) {
        case "substitute": //대결
            if (elmNext == null) {
                Common.Warning(strMsg_042);//"결재종류를 바꿀 수 없습니다. 대결을 할 대상이 없습니다."
            } else {
                var elmNextTaskInfo = elmNext.find("taskinfo");
                if (elmNextTaskInfo.attr("kind") != "normal") {
                    Common.Warning(strMsg_046);//"결재종류를 바꿀 수 없습니다. 다음 결재자의 결재종류는 일반결재이어야 합니다."
                } else {
                    elmTaskInfo.attr("kind", "substitute");
                    elmNextTaskInfo.attr("kind", "bypass");
                    bSetDirty = true;
                }
            }
            break;
        case "authorize": //전결
            var elmNextAssist = getSibling(elmCur, "step", "routetype", "assist", true, true)
            var elmNextConsult = getSibling(elmCur, "step", "routetype", "consult", true, true);
            var elmNextAudit = getSibling(elmCur, "step", "routetype", "audit", true, true);

            if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == " role") && elmNextAssist != null) {
                Common.Warning(strMsg_044);  //"결재종류를 바꿀 수 없습니다. 전결자 다음에 협조가 올 수 없습니다."
            } else if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == "role") && elmNextConsult != null) {
                Common.Warning(strMsg_044);
            } else if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == "role") && elmNextAudit != null) {
                Common.Warning(strMsg_044);
            } else {
                elmTaskInfo.setAttribute("kind", "authorize");
                while (elmNext != null) {
                    var elmNextTaskInfo = elmNext.attr("taskinfo");
                    elmNextTaskInfo.attr("kind", "skip");
                    elmNextTaskInfo.attr("status", "skipped");
                    elmNextTaskInfo.attr("result", "skipped");
                    elmNext = getNextElm(elmNext);
                }
                bSetDirty = true;
            }
            break;
        case "review": //후결
            if (elmTaskInfo.attr("datereceived") != null) {
                Common.Warning(strMsg_121);  //"결재종류를 바꿀 수 없습니다. 현재 결재자는 후결로 변경할 수 없습니다."
            } else {
                var elmAnotherReviewer;
                var xPathReviewer = "person:has(taskinfo[kind='review']),role:has(taskinfo[kind='review'])";
                if (window.ActiveXObject === undefined) { xPathReviewer = xPathReviewer.replace("(person|role)", "(name()='person' or name()='role')") }

                if (sRouteType == "approve" && (sUnitType == "person" || sUnitType == "role")) {
                    elmAnotherReviewer = elmRoot.selectSingleNode(xpathCur.split(">")[0] + ">step>ou>" + xPathReviewer);
                } else {
                    elmAnotherReviewer = elmCur.parent().find(xPathReviewer);
                }
                if (elmAnotherReviewer != null) {
                    Common.Warning(strMsg_046); //"결재종류를 바꿀 수 없습니다. 후결자가 두 명이상 있을 수 없습니다."
                } else {
                    elmTaskInfo.attr("kind", "review");
                    bSetDirty = true;
                }
            }
            break;
        case "confidential":  //친선
            elmTaskInfo.attr("kind", "confidential");
            while (elmNext != null) {
                elmNextTaskInfo = elmNext.find("taskinfo");
                elmNextTaskInfo.attr("kind", "normal");
                elmNextTaskInfo.attr("status", "inactive");
                elmNextTaskInfo.attr("result", "inactive");

                elmNext = getNextElm(elmNext);
                if (elmNext == null || elmNext.find("taskinfo[kind='skip']") == null) elmNext = null;
            }
            bSetDirty = true;
            break;
        case "conveyance":  //전달
            elmTaskInfo.attr("kind", "conveyance");
            while (elmNext != null) {
                elmNextTaskInfo = elmNext.find("taskinfo");
                elmNextTaskInfo.attr("kind", "normal");
                elmNextTaskInfo.attr("status", "inactive");
                elmNextTaskInfo.attr("result", "inactive");

                elmNext = getNextElm(elmNext);
                if (elmNext == null || elmNext.find("taskinfo[@kind='skip']") == null) elmNext = null;
            }
            bSetDirty = true;
            break;
        case "normal": //일반결재
            if (elmNext == null) {
                elmTaskInfo.attr("kind", "normal");
                if (elmTaskInfo.attr("datereceived") != null) {
                } else {
                    elmTaskInfo.attr("status", "inactive");
                    elmTaskInfo.attr("result", "inactive");
                }
            } else {
                var bExitNormal = false;
                while (elmNext != null) {
                    elmNextTaskInfo = elmNext.find("taskinfo");
                    if (elmNextTaskInfo.attr("datereceived") != null) {
                        Common.Warning(strMsg_179); //"다음 결재자가 이미 문서를 받았습니다."

                        elmNext = null;
                        bExitNormal = true;
                    } else {
                        elmNextTaskInfo.attr("kind", "normal");
                        if (elmNextTaskInfo.attr("datereceived") != null) {
                        } else {
                            elmNextTaskInfo.attr("status", "inactive");
                            elmNextTaskInfo.attr("result", "inactive");
                        }
                        if (elmNextTaskInfo.attr("customattribute2") != null) elmNextTaskInfo.removeAttribute("customattribute2");
                        elmNext = getNextElm(elmNext);
                    }
                }
                if (!bExitNormal) {
                    elmTaskInfo.attr("kind", "normal");
                    if (elmTaskInfo.attr("datereceived") != null) {
                    } else {
                        elmTaskInfo.attr("status", "inactive");
                        elmTaskInfo.attr("result", "inactive");
                    }
                    if (elmTaskInfo.attr("customattribute2") != null) elmTaskInfo.removeAttribute("customattribute2");
                }
            }
            bSetDirty = true;
            break;
        case "bypass": //후열
            if (elmNext == null) {
                Common.Warning(strMsg_149); //"결재종류를 바꿀 수 없습니다. 최종 결재자는 후열을 선택 할 수 없습니다."
            } else {
                elmTaskInfo.attr("kind", "bypass");
                elmTaskInfo.attr("status", getInfo("AppInfo.svdt"));
                elmTaskInfo.attr("result", "prebypass");
                bSetDirty = true;
                try { m_oFormMenu.setApvChangeMode("bypass"); } catch (e) { }
            }
            break;
        case "skip": //결재안함
            var bExitNormal = false;
            if (elmTaskInfo.attr("datereceived") != null) {
                bExitNormal = true;
                elmNext = null;
            }
            //skip 다음으로 결재문서를 받은 사용자가 있을 경우 변경을 하지 못함
            while (elmNext != null) {
                elmNextTaskInfo = elmNext.find("taskinfo");
                if (elmNextTaskInfo.attr("datereceived") != null) {
                    Common.Warning(strMsg_179); //"다음 결재자가 이미 문서를 받았습니다."
                    bExitNormal = true;
                    elmNext = null;
                } else {
                    elmNext = getNextElm(elmNext);
                }
            }
            if (!bExitNormal) {
                elmTaskInfo.attr("kind", "skip");
                elmTaskInfo.attr("status", "skipped");
                elmTaskInfo.attr("result", "skipped");
                bSetDirty = true;
            }
            break;
        default:
    }
    if (bSetDirty) try { m_oFormMenu.setApvDirty(); } catch (e) { }
    refreshList();
}
function setApvList() {

    if (evaluateApvList()) {
        if (chkAuthorize) {
            if (!window.confirm(coviDic.dicMap["msg_apv_chkAuthorize"])) {//전결자가 지정되어있는 경우 이후 결재자는 모두 결재안함으로 변경 됩니다.
                return;
            }
        }
        //감사/준법 1개 이상 체크
        var chkAudit = "";
        $$_m_oApvList.find("steps>division>step[routetype='audit']").concat().each(function (i, $$_audit) {
            if ($$_m_oApvList.find("steps>division>step[routetype='audit'][name='" + $$_audit.attr("name") + "']").length > 1) {
                chkAudit = $$_audit.attr("name");
            }
        });
        if (chkAudit != "") {
            Common.Warning(coviDic.dicMap["msg_apv_chkAudit"].replace("~", chkAudit));
            return;
        }

        //child가 없는 node 삭제
        var $$_ccInfos = $$_m_oApvList.find("steps>ccinfo");
        $$_ccInfos.concat().each(function (i, $$_ccInfo) {
            var $$_ccList = $$_ccInfo.children();
            if ($$_ccList.length == 0) { $$_ccInfo.remove(); }
        });

        var bChange = false;
        var m_oApvListExt = jQuery.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value.replace(/&/g, "&amp;"));
        var $$_m_oApvListExt = $$(m_oApvListExt);
        if (JSON.stringify($$_m_oApvListExt.json()) != JSON.stringify($$_m_oApvList.json()) ) { bChange = true; }

        m_oFormMenu.document.getElementById("APVLIST").value = JSON.stringify($$_m_oApvList.json());
        
        if(getInfo('ExtInfo.UseHWPEditYN') == "Y"){
        	m_oFormMenu.$("#APVLIST").trigger("change");
        }

        //배포처 관련 시작
        var sRec0 = "";
        var sRec1 = "";
        var sRec2 = "";
        if(m_oFormMenu.document.getElementById("ReceiveNames")!=null){m_oFormMenu.document.getElementById("ReceiveNames").value = m_RecDept;}
        if (m_RecDept != "") {
            var aRecDept = m_RecDept.split(";");
            for (var i = 0; i < aRecDept.length; i++) {
                if (aRecDept[i] != "") {
                    var aRec = aRecDept[i].split(":");
                    if (aRec[0] == "0") {
                        if (sRec0 == "") sRec0 += aRec[1] + "|" + aRec[3];
                        else sRec0 += ";" + aRec[1] + "|" + aRec[3];
                    } else if (aRec[0] == "1") {
                        if (sRec1 == "") sRec1 += aRec[1];
                        else sRec1 += ";" + aRec[1];
                    } else {
                        if (sRec2 == "") sRec2 += aRec[1];
                        else sRec2 += ";" + aRec[1];
                    }
                }
            }
        }
        if(m_oFormEditor.document.getElementById("ReceiptList")!=null){
        	m_oFormEditor.document.getElementById("ReceiptList").value = sRec0 + "@" + sRec1 + "@" + sRec2;
        }

        if (admintype == "ADMIN") {//관리자 일 경우 결재선 변경 함수 호출
        	if (getInfo("FormInstanceInfo.ReceiptList") != m_oFormEditor.document.getElementById("ReceiptList").value) { bChange = true; }

            if (bChange) {
                var ApvLines = m_oFormEditor.__setInlineApvList();
                m_oFormEditor.drawFormApvLinesAll(ApvLines); 
            }

            if (openID != "") { parent.Common.Close("btLine" + getInfo("FormInstanceInfo.FormInstID")); } else { window.close(); }
        }
        else {
            var sMode = m_sApvMode.toUpperCase();
            
            if ((sMode == "DRAFT") || (sMode == "TEMPSAVE") || (sMode == "REDRAFT") || (sMode == "SUBREDRAFT") || (sMode == "APPROVAL") || (sMode == "PROCESS") || (sMode == "RECAPPROVAL") || (sMode == "SUBAPPROVAL")) {  //2007.10 박동현 (sMode == "RECAPPROVAL") 추가 [2016-04-21] 김지현(sMode == "SUBAPPROVAL") --> 합의부서내결재 추가
            	var ApvLines = m_oFormEditor.__setInlineApvList();
            	m_oFormEditor.drawFormApvLinesAll(ApvLines); 
            	
                if (sMode == "PROCESS") {  // 진행함일때만 결재선변경 버튼 필요 sMode == "APPROVAL" || 
                    if (bChange) m_oFormMenu.document.getElementById("btChgApv").style.display = "";
                }

                //마지막 결재자인지 확인	
                var oPendingSteps = $$_m_oApvList.find("division>step:has(taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='pending']), division>step:has(taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='reserved'])");
                var oinActiveSteps = $$_m_oApvList.find("division>step:has(taskinfo[kind!='review'][kind!='bypass'][kind!='skip'][status='inactive'])");
                var oLASTAPPROVER = m_oFormMenu.document.getElementById("bLASTAPPROVER");

                if ((oPendingSteps.length == 1) && (oinActiveSteps.length == 0)) {
                    if (oLASTAPPROVER != null) oLASTAPPROVER.value = "true";
                } else {
                    if (oLASTAPPROVER != null) oLASTAPPROVER.value = "false";
                }
                
                if ((sMode == "REDRAFT") || (sMode == "SUBREDRAFT")) {
                	if (sMode == "SUBREDRAFT"){ 
                		var $$_m_oSubReOu = $$_m_oApvList.find("division").has(">taskinfo[status='pending']").find(">step[unittype='ou']>ou").has("taskinfo[status='pending'][piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']");
                		if($$_m_oSubReOu.find("person").concat().length == 1) if (oLASTAPPROVER != null) oLASTAPPROVER.value = "true";
                	} 
                	if(oLASTAPPROVER.value == "true") {
                		if((sMode == "REDRAFT" && getInfo("SchemaContext.scRec.isUse") == "Y") || 
                				(sMode == "SUBREDRAFT" && getInfo("SchemaContext.scChrDraft.isUse") == "Y")){
                			m_oFormMenu.document.getElementById("btRec").style.display = "";
                		} else if(getInfo("SchemaContext.scChrRedraft.isUse") == "Y"){
                			m_oFormMenu.document.getElementById("btApproved").style.display = "";
                		}
                		m_oFormMenu.document.getElementById("btDeptDraft").style.display = "none";
                	} else {
                		m_oFormMenu.document.getElementById("btRec").style.display = "none";
                		m_oFormMenu.document.getElementById("btApproved").style.display = "none";
                		m_oFormMenu.document.getElementById("btDeptDraft").style.display = "";
                    }                    
                    m_oFormMenu.document.getElementById("btCharge").style.display = "none";
                }
                //마지막 결재자인지 확인
            }

            if (sMode == "DEPTLIST" || sMode == "CFADMIN") {
                var m_oApvList2 = $.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value);
                
                var elmRoot = $$(m_oApvList2).find('steps');
                var elmlistCount = $$(elmRoot).find("division>step ou>person").length;
                if (elmlistCount == 0) {
                    if (!window.confirm(strMsg_259)) {
                        return;
                    } else {
                        m_oInfoSrc.goBatchApvLine("DEPT");
                    }
                } else {
                    m_oInfoSrc.goBatchApvLine("DEPT");
                }
            }
            
            if(CFN_GetQueryString("openID").indexOf("account_") > -1) { 
				m_oInfoSrc.accountCtrl.getInfo("RuleItemInfo").val($("#hidRuleItemInfo").val());
			} else {
				$("#RuleItemInfo").val($("#hidRuleItemInfo").val()); 
			}

            if (openID == "L") {
                Common.Close();
            } else if (openID != "" && parent.length > 0) {
            	parent.Common.Close("btLine" + getInfo("FormInstanceInfo.FormInstID"));
            } else {
            	window.close();
            }
        }
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

/*======================================
-- 버튼에 따른 기능 정의
--====================================*/
function doButtonAction(obj) {
    var bSetDirty = false;
    
    switch (obj.id) {
		case "btPersonOUALL":
			bSetDirty = true;
		    addPersonOUALL();
		    break;
		case "btPerson": // 일반결재
			bSetDirty = true;
		    if (m_sApvMode == "CHARGE") {
		        addChargePerson();
		    } else if (m_sApvMode == "REDRAFT") {
		        addReceiptPerson();
		    } else {
		        addPerson();
		    }
		    break;
		case "btReceipt": // 수신처
			bSetDirty = true; addReceipt(); break;
		case "btCharge": // 담당자
			bSetDirty = true; addCharge(); break;
		case "btGroup":
			bSetDirty = true; addGroup(); break;
		case "btPAssist": // 개인협조
			bSetDirty = true; addPAssist('serial'); break;
		case "btPAssistPL": // 개인협조(병렬)
			bSetDirty = true; addPAssist('parallel'); break; //병렬협조추가forBK
		case "btDAssist": // 부서협조
			bSetDirty = true; addDAssist('serial'); break;
		case "btDAssistPL": // 부서협조(병렬)
			bSetDirty = true; addDAssist('parallel'); break;
		case "btPConsult": // 개인합의
			bSetDirty = true; addPConsult('serial'); break;
		case "btPConsult2": // 개인합의(병렬)
			bSetDirty = true; addPConsult('parallel'); break;
		case "btDConsult": // 부서합의
			bSetDirty = true; addDConsult('serial'); break;
		case "btDConsult2": // 부서합의(병렬)
			bSetDirty = true; addDConsult('parallel'); break;
		case "btDelete":
			bSetDirty = true; deletePerson(); break;
		case "btUp": // 위로
			bSetDirty = true; moveUpDown("UP"); break;
		case "btDown": // 아래로
			bSetDirty = true; moveUpDown("DOWN"); break;
		case "btCC":
			if (m_bCC) { bSetDirty = true; setCC("global","n"); } break;
		case "btSendCC": // 참조
			if (m_bCC) { bSetDirty = true; setCC("sender","n"); } break;
		case "btRecCC": // 수신참조
			if (m_bCC) { bSetDirty = true; setCC("receiver", "n"); } break;
		case "btSendCCBefor": // 사전참조
		    if (m_bCC) {
		        var deptGubun = "sender";
		        if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
		            deptGubun = "receiver";
		        }
		        bSetDirty = true; setCC(deptGubun, "y");
			} break;
		case "btSendCCAfter": // 사후참조
		    if (m_bCC) {
		        var deptGubun = "sender";
		        if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
		            deptGubun = "receiver";
		        }
		        bSetDirty = true; setCC(deptGubun, "n");
			} break;
		case "btDeleteCC":
			bSetDirty = true; deleteCC(); break;
		case "btApplyLine":
			bSetDirty = true; applyLine(); break;
		case "btResetLine":
			resetLine(); break;
		case "btOK": // 확인
			setApvList(); break;
		case "btExit": // 닫기
			if (openID != "" && parent.length > 0) { parent.Common.Close("btLine" + getInfo("FormInstanceInfo.FormInstID")); } else { window.close(); } break;
		case "btRecDept": // 배포추가
			addRecDept(); break;
		case "btDeleteRec":
			delList(); break;
		case "btPlPerson": // 동시결재
			bSetDirty = true; addparallelPerson(); break; //동시결재 추가
		case "btPAudit": // 개인감사
		case "btPAuditLeft": // 개인감사
			bSetDirty = true; addPAudit("audit"); break; //감사 추��� 2007.02 by sunny
		case "btPAudit1": // 개인준법
		case "btPAudit1Left": // 개인준법
			bSetDirty = true; addPAudit("audit_law"); break;
		case "btDAudit": // 부서감사
		case "btDAuditLeft": // 부서감사
			bSetDirty = true; addDAudit("audit_dept"); break;
		case "btDAudit1": // 부서준법
		case "btDAudit1Left": // 부서준법
			bSetDirty = true; addDAudit("audit_law_dept"); break; //준법처
		case "btDAuditETC":
			bSetDirty = true; addDAuditETC(); break;
		case "btExtType": // 특이기능
			bSetDirty = true; addExtType(); break;
		case "btPReview": // 개인공람
			bSetDirty = true; addPReview(); break;
		case "btPersonConfirm": // 확인자
			bSetDirty = true; addPersonExt('confirm'); break;
		case "btPersonShare": // 참조자
			bSetDirty = true; addPersonExt('reference'); break;
		case "btDeletePersonOUALL":
			bSetDirty = true; deletePerson(); break;
		case "btDeleteCCALL":
			bSetDirty = true; deleteCC(); break;
		case "btPersonalLineSave":
			personalLine(); break;
		case "btDeleteRecALL":
			delList(); break;
		case "btAssistGroup": // 합의그룹구분
			assistGroup(); break;
		case "btAssistGroupDelete": // 합의그룹전체해제
			deleteAssistGroup(); break;
		case "btUpDeploy":
			bSetDirty = true; moveUpDownDeploy("UP"); break;
		case "btDownDeploy":
			bSetDirty = true; moveUpDownDeploy("DOWN"); break;

    }
    if (bSetDirty) try { if (m_oFormMenu.contentWindow) { m_oFormMenu.contentWindow.setApvDirty(); } else { m_oFormMenu.setApvDirty(); } } catch (e) { }
}
function viewComment(idx) {
    var rgParams = null;
    rgParams = new Array();
    rgParams["objMessage"] = document.getElementById(idx).value;
    var nWidth = 420;
    var nHeight = 420;
    var sFeature = "dialogHeight:" + nHeight + "px;dialogWidth:" + nWidth + "px;status:no;resizable:yes;scrolling:no;help:no;";
    var strNewFearture = ModifyDialogFeature(sFeature);
    var vRetval = window.showModalDialog("comment.aspx", rgParams, strNewFearture);
}
function applyLine() {
    if (self.iApvLine.m_id != "") {
        switch (m_sApvMode) {
            case "REDRAFT":
                var oSteps = self.iApvLine.getApvlineStep();
                var oCheckSteps = chkAbsent(oSteps);
                if (oCheckSteps) {
                    var nodesAllItems = oSteps.selectNodes("division/step");
                    for (var x = 0; x < nodesAllItems.length; x++) {
                        m_oCurrentOUNode.appendChild(nodesAllItems.item(x));
                    }
                    refreshList();
                    self.iApvLine.getPrivateSteps();
                }
                break;
            case "SUBREDRAFT":
                //협조전				
                Common.Error(strMsg_047); //"아직 지원하지 않습니다"
                break;
            default:
                var oSteps = self.iApvLine.getApvlineStep();
                var oCheckSteps = chkAbsent(oSteps);
                var oApvList = CreateXmlDocument();

                if (oCheckSteps) {
                    var oStep = oApvList.createElement("step");
                    var oOU = oApvList.createElement("ou");
                    var oPerson = oApvList.createElement("person");
                    var oTaskinfo = oApvList.createElement("taskinfo");
                    var oDivStep = oSteps.selectSingleNode("division/step");
                    var oDivTaskinfo = oSteps.selectSingleNode("division/taskinfo");
                    var oDiv = oSteps.selectSingleNode("division");
                    oSteps.firstChild.insertBefore(oStep, oDivStep).appendChild(oOU).appendChild(oPerson).appendChild(oTaskinfo);
                    oSteps.setAttribute("initiatoroucode", getInfo("AppInfo.dpid_apv"));
                    oStep.setAttribute("unittype", "person");
                    oStep.setAttribute("routetype", "approve");
                    oStep.setAttribute("name", strlable_writer);
                    oOU.setAttribute("code", getInfo("AppInfo.dpid_apv"));
                    oOU.setAttribute("name", getInfo("AppInfo.dpdn_apv"));
                    oPerson.setAttribute("code", getInfo("AppInfo.usid"));
                    oPerson.setAttribute("name", getInfo("AppInfo.usdn"));
                    oPerson.setAttribute("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
                    oPerson.setAttribute("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
                    oPerson.setAttribute("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.ustn"));
                    oPerson.setAttribute("oucode", getInfo("AppInfo.dpid"));
                    oPerson.setAttribute("ouname", getInfo("AppInfo.dpdn"));
                    oPerson.setAttribute("sipaddress", getInfo("AppInfo.ussip"));
                    oTaskinfo.setAttribute("status", "inactive");
                    oTaskinfo.setAttribute("result", "inactive");
                    oTaskinfo.setAttribute("kind", "charge");
                    oTaskinfo.setAttribute("datereceived", getInfo("AppInfo.svdt_TimeZone"));
                    oTaskinfo.setAttribute("customattribute1", getInfo("AppInfo.usit"));
                    oDivTaskinfo.setAttribute("status", "inactive");
                    oDivTaskinfo.setAttribute("result", "inactive");
                    oDivTaskinfo.setAttribute("kind", "normal");
                    oDivTaskinfo.setAttribute("datereceived", getInfo("AppInfo.svdt_TimeZone"));
                    oDiv.setAttribute("name", strlable_circulation_sent); //"발신"
                    oDiv.setAttribute("oucode", getInfo("AppInfo.dpid_apv"));
                    oDiv.setAttribute("ouname", getInfo("AppInfo.dpdn_apv"));

                    var nodesAllItems = oSteps.selectNodes("steps/division/step");
                    for (var x = 0; x < nodesAllItems.length; x++) {
                        oSteps.documentElement.appendChild(nodesAllItems.item(x));
                    }

                    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + oSteps.xml);
                    refreshList();
                    refreshCC(true);
                    self.iApvLine.getPrivateSteps();
                }
                break;
        }
    } else {
        Common.Warning(strMsg_048); //"결재선을 먼저 선택하십시요"
    }
}
function resetLine() {
    m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?>" + m_oFormMenu.APVLIST.value);
    document.getElementById("Apvlist").contentWindow.clearSelection();
    refreshList();
}
var chkAuthorize = false; //전결체크

//*결재선 생성
function makeApvLineXml() {
    var oDivision, oStep, oOu, oRolePerson;
    var maxlimit = 100, i=0;
    var chkRejectee = false;
    
    var arrForward = new Array();
    
    $$_m_oApvListSteps = $$_m_oApvList.find('>steps');
    $$_m_oApvListSteps.children().remove();


    var oTable = document.getElementById("tblApvLine");
    if (oTable == null)
        return;

    var oTBody = oTable.getElementsByTagName("TBODY")[0];
    if (oTBody == null)
        return;
    
    chkAuthorize = false;

    for (var y = oTBody.rows.length - 1; y >= 0; y--) {
        if ($(oTBody.rows[y].childNodes[key_displayonly]).text() == "False") {
            //- 대결/후열일경우에만 동일 ou밑으로 처리
            if ($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "bypass" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_result]).text() == "inactive" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_status]).text() == "inactive" && $(oTBody.rows[y + 1].childNodes[roleperson_taskinfo_kind]).text() == "substitute") {
                oRolePerson = makeApvLineRolePersonXml(oTBody.rows[y], oOu);
                //- 수신자 대결의 경우 bypass의 앞이 charge로 설정됨
            } else if ($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "bypass" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_result]).text() == "inactive" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_status]).text() == "inactive" && $(oTBody.rows[y + 1].childNodes[roleperson_taskinfo_kind]).text() == "charge"
                    && $(oTBody.rows[y]).css("display") == "none"
                    && $(oTBody.rows[y].childNodes[step_name]).text() != "원결재자") { //대결은 display:none 처리 상태임, step name이 원결재자가 아닌 경우는 기존 수신자 대결 결재선은 현행유지를 위해 다음과 같이 처리
                    oRolePerson = makeApvLineRolePersonXml(oTBody.rows[y], oOu);
              //이미완료된결재선에대해서 처리 해당 조건 추가
            } else if ($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "bypass" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_result]).text() == "bypassed" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_status]).text() == "completed" && $(oTBody.rows[y + 1].childNodes[roleperson_taskinfo_kind]).text() == "substitute") {
        		oRolePerson = makeApvLineRolePersonXml(oTBody.rows[y], oOu);		
        	} else if ($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "conveyance" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_result]).text() == "completed" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_status]).text() == "completed") {
        		// 전달한 결재선 step 분리되지 않도록 추가
        		arrForward.push(y);
        	} else {
               	// 수신부서에서 재기안자한테 지정반려 했을 시
        		if($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "charge" && $(oTBody.rows[y].childNodes[division_divisiontype]).text() == "receive" 
                	&& $(oTBody.rows[y].childNodes[roleperson_taskinfo_rejectee]).text() == "y") {
                	oDivision = makeApvLineDivisionXml(oTBody.rows[y]);
                    oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                	
                    chkRejectee = true;
                } else if ($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "charge" && !chkRejectee) {
                    oDivision = makeApvLineDivisionXml(oTBody.rows[y]);
                    oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                    
                    chkRejectee = false;
                } else if(chkRejectee) {
                	oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                } else if ($(oTBody.rows[y].childNodes[division_divisiontype]).text() == "receive" && $(oTBody.rows[y].childNodes[step_routetype]).text() == "receive") {
                    oDivision = makeApvLineDivisionXml(oTBody.rows[y]);
                    oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                } else if ($(oTBody.rows[y].childNodes[step_allottype]).text() != "parallel") {
                    oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                } else if ($(oTBody.rows[y].childNodes[dp_apv_kind]).text().indexOf("분리") > -1) {
                    oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                } else if (($(oTBody.rows[y + 1].childNodes[step_unittype]).text() != $(oTBody.rows[y].childNodes[step_unittype]).text())
                        ||
                        ($(oTBody.rows[y + 1].childNodes[step_routetype]).text() != $(oTBody.rows[y].childNodes[step_routetype]).text())
                        ||
                        ($(oTBody.rows[y + 1].childNodes[step_allottype]).text() != $(oTBody.rows[y].childNodes[step_allottype]).text())) {
                    oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                } else if ($(oTBody.rows[y].childNodes[roleperson_taskinfo_kind]).text() == "bypass" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_result]).text() == "inactive" && $(oTBody.rows[y].childNodes[roleperson_taskinfo_status]).text() == "inactive" && $(oTBody.rows[y + 1].childNodes[roleperson_taskinfo_kind]).text() == "charge"
                    	&& $(oTBody.rows[y]).css("display") == "none"
                    	&& $(oTBody.rows[y].childNodes[step_name]).text() == "원결재자") { //step name이 원결재자일 경우 step 추가
                	oStep = makeApvLineStepXml(oTBody.rows[y], oDivision);
                }
                oOu = makeApvLineOuXml(oTBody.rows[y], oStep);
                
                if(arrForward.length > 0) {
                	for(var i=0; i<arrForward.length; i++) {
                		oRolePerson = makeApvLineRolePersonXml(oTBody.rows[arrForward[i]], oOu);	
                	}
                	
                	arrForward = [];
                }                
                oRolePerson = makeApvLineRolePersonXml(oTBody.rows[y], oOu);
            }
        }
    }

    var prev_apvlist = jQuery.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value.replace(/&/g, "&amp;"));
    $$(prev_apvlist).find('division').concat().each(function(i, $$division){
        var processDescID = $$division.attr('processDescID');
        var processID = $$division.attr('processID');
        if(processDescID && processDescID !=='') {
            var $$_new_division = $$_m_oApvList.find('division').concat().eq(i);
            $$_new_division.attr('processDescID', processDescID);
            $$_new_division.attr('processID', processID);
            
            $$division.find('step').has("ou>person:has(taskinfo[visible='n'])").remove();
            
            $$division.find('>step>ou').concat().each(function(j, $$ou){
                var widescid = $$ou.attr('widescid');
                var pfid = $$ou.attr('pfid');
                var taskid = $$ou.attr('taskid');
                var wiid = $$ou.attr('wiid');
                var $$_new_ou = $$_new_division.find('>step>ou').concat().eq(j);
                var ouUserCode = $$ou.find("person, role").concat().eq(0).attr("code");
                var new_ouUserCode = $$_new_ou.find("person, role").concat().eq(0).attr("code");
                if(widescid && widescid !==''&& ouUserCode === new_ouUserCode) {
                    $$_new_ou.attr('widescid', widescid);
                    $$_new_ou.attr('pfid', pfid);
                    $$_new_ou.attr('taskid', taskid);
                    $$_new_ou.attr('wiid', wiid);
                }
                
                $$ou.find('>person').concat().each(function(x, $$person){
                	var p_widescid = $$person.attr('widescid');
                    var p_pfid = $$person.attr('pfid');
                    var p_taskid = $$person.attr('taskid');
                    var p_wiid = $$person.attr('wiid');
                    var $$_new_person = $$_new_division.find('>step>ou').concat().eq(x).find('person');
                    var personUserCode = $$person.attr("code");
                    var new_personUserCode = $$_new_person.attr("code");
                    if(p_widescid && p_widescid !==''&& personUserCode === new_personUserCode){
                    	$$_new_person.attr('widescid', p_widescid);
                    	$$_new_person.attr('pfid', p_pfid);
                    	$$_new_person.attr('taskid', p_taskid);
                    	$$_new_person.attr('wiid', p_wiid);
                    }
                });
            });            
        }
    });

    if (getInfo("Request.mode") == "SUBREDRAFT" || getInfo("Request.mode") == "SUBAPPROVAL") return;
    var oCcinfo, oCcOu, oCcPerson;
    var oTable = document.getElementById("tblccinfo");
    if (oTable == null)
        return;
    var oTBody = oTable.getElementsByTagName("TBODY")[0];
    if (oTBody == null)
        return;
    chkAuthorize = false;
    for (var y = 0; y < oTBody.rows.length ; y++) {
        oCcinfo = makeApvLineCcinfoXml(oTBody.rows[y]);
        oCcOu = makeApvLineCcinfoOuXml(oTBody.rows[y], oCcinfo);
        if ($(oTBody.rows[y].childNodes[ccinfo_person_code]).text() != "") {
            oCcPerson = makeApvLineCcinfoPersonXml(oTBody.rows[y], oCcOu);
        }
    }
    // 결재선 "적용" 후 참조 여러명 추가 시 한명만 추가되는 오류 수정
    oTBody = oTable.getElementsByTagName("TBODY")[1];
    if (oTBody == null)
        return;
    chkAuthorize = false;
    for (var y = 0; y < oTBody.rows.length ; y++) {
        oCcinfo = makeApvLineCcinfoXml(oTBody.rows[y]);
        oCcOu = makeApvLineCcinfoOuXml(oTBody.rows[y], oCcinfo);
        if ($(oTBody.rows[y].childNodes[ccinfo_person_code]).text() != "") {
            oCcPerson = makeApvLineCcinfoPersonXml(oTBody.rows[y], oCcOu);
        }
    }
}

//*결재선 XML Division
function makeApvLineDivisionXml(oTr) {
    chkAuthorize = false;
    var $$_oDivision = $$_m_oApvListSteps.create("division");
    
    if ($(oTr.childNodes[division_divisiontype]).text() != "") $$_oDivision.attr("divisiontype", $(oTr.childNodes[division_divisiontype]).text());
    if ($(oTr.childNodes[division_name]).text() != "") $$_oDivision.attr("name", $(oTr.childNodes[division_name]).text());
    if ($(oTr.childNodes[division_oucode]).text() != "") $$_oDivision.attr("oucode", $(oTr.childNodes[division_oucode]).text());
    if ($(oTr.childNodes[division_ouname]).text() != "") $$_oDivision.attr("ouname", $(oTr.childNodes[division_ouname]).text());
    if ($(oTr.childNodes[division_taskinfo_status]).text() != "") {
        var $$_oTaskinfo = $$_oDivision.create("taskinfo");
        if ($(oTr.childNodes[division_taskinfo_status]).text() != "") $$_oTaskinfo.attr("status", $(oTr.childNodes[division_taskinfo_status]).text());
        if ($(oTr.childNodes[division_taskinfo_result]).text() != "") $$_oTaskinfo.attr("result", $(oTr.childNodes[division_taskinfo_result]).text());
        if ($(oTr.childNodes[division_taskinfo_kind]).text() != "") $$_oTaskinfo.attr("kind", $(oTr.childNodes[division_taskinfo_kind]).text());
        if ($(oTr.childNodes[division_taskinfo_datereceived]).text() != "") $$_oTaskinfo.attr("datereceived", $(oTr.childNodes[division_taskinfo_datereceived]).text());
        if ($(oTr.childNodes[division_taskinfo_datecompleted]).text() != "") $$_oTaskinfo.attr("datecompleted", $(oTr.childNodes[division_taskinfo_datecompleted]).text());
    }
    if ($(oTr.childNodes[division_ouname]).text() != "") $$_oDivision.attr("ouname", $(oTr.childNodes[division_ouname]).text());
    return $$_oDivision;
}
//*결재선 XML Step
function makeApvLineStepXml(oTr, $$_oDivision) {
    var $$_oStep = $$_oDivision.create("step");
    
    if ($(oTr.childNodes[step_unittype]).text() != "") $$_oStep.attr("unittype", $(oTr.childNodes[step_unittype]).text());
    if ($(oTr.childNodes[step_routetype]).text() != "") $$_oStep.attr("routetype", $(oTr.childNodes[step_routetype]).text());
    if ($(oTr.childNodes[step_allottype]).text() != "") $$_oStep.attr("allottype", $(oTr.childNodes[step_allottype]).text());
    if ($(oTr.childNodes[step_name]).text() != "") $$_oStep.attr("name", $(oTr.childNodes[step_name]).text());
    if ($(oTr.childNodes[step_taskinfo_status]).text() != "") {
        var $$_oTaskinfo = $$_oStep.create("taskinfo");
        
        if ($(oTr.childNodes[step_taskinfo_status]).text() != "") $$_oTaskinfo.attr("status", $(oTr.childNodes[step_taskinfo_status]).text());
        if ($(oTr.childNodes[step_taskinfo_result]).text() != "") $$_oTaskinfo.attr("result", $(oTr.childNodes[step_taskinfo_result]).text());
        if ($(oTr.childNodes[step_taskinfo_kind]).text() != "") $$_oTaskinfo.attr("kind", $(oTr.childNodes[step_taskinfo_kind]).text());
        if ($(oTr.childNodes[step_taskinfo_datereceived]).text() != "") $$_oTaskinfo.attr("datereceived", $(oTr.childNodes[step_taskinfo_datereceived]).text());
        if ($(oTr.childNodes[step_taskinfo_datecompleted]).text() != "") $$_oTaskinfo.attr("datecompleted", $(oTr.childNodes[step_taskinfo_datecompleted]).text());
    }
    if ($(oTr.childNodes[step_ruleapvclass]).text() != "") $$_oStep.attr("ruleapvclass", $(oTr.childNodes[step_ruleapvclass]).text());
    if ($(oTr.childNodes[step_ruleapvclassatt01]).text() != "") $$_oStep.attr("ruleapvclassatt01", $(oTr.childNodes[step_ruleapvclassatt01]).text());
    return $$_oStep;
}
//*결재선 XML Ou
function makeApvLineOuXml(oTr, $$_oStep) {
    var $$_oOu = $$_oStep.create("ou");

    if ($(oTr.childNodes[ou_code]).text() != "") $$_oOu.attr("code", $(oTr.childNodes[ou_code]).text());
    if ($(oTr.childNodes[ou_name]).text() != "") $$_oOu.attr("name", $(oTr.childNodes[ou_name]).text());
    if ($(oTr.childNodes[ou_taskinfo_status]).text() != "") {
        var $$_oTaskinfo = $$_oOu.create("taskinfo");
        if ($(oTr.childNodes[ou_taskinfo_status]).text() != "") $$_oTaskinfo.attr("status", $(oTr.childNodes[ou_taskinfo_status]).text());
        if ($(oTr.childNodes[ou_taskinfo_result]).text() != "") $$_oTaskinfo.attr("result", $(oTr.childNodes[ou_taskinfo_result]).text());
        if ($(oTr.childNodes[ou_taskinfo_kind]).text() != "") $$_oTaskinfo.attr("kind", $(oTr.childNodes[ou_taskinfo_kind]).text());
        if ($(oTr.childNodes[ou_taskinfo_datereceived]).text() != "") $$_oTaskinfo.attr("datereceived", $(oTr.childNodes[ou_taskinfo_datereceived]).text());
        if ($(oTr.childNodes[ou_taskinfo_datecompleted]).text() != "") $$_oTaskinfo.attr("datecompleted", $(oTr.childNodes[ou_taskinfo_datecompleted]).text());
        if ($(oTr.childNodes[ou_taskinfo_piid]).text() != "") $$_oTaskinfo.attr("piid", $(oTr.childNodes[ou_taskinfo_piid]).text());
    }
    return $$_oOu;
}

//*결재선 XML Role OR Person
function makeApvLineRolePersonXml(oTr, $$_oOu) {
     if ($(oTr.childNodes[roleperson_nodetype]).text() == "") return;
    var roleperson_nodetype_text = $(oTr.childNodes[roleperson_nodetype]).text();
    var $$_oRolePerson = $$_oOu.create(roleperson_nodetype_text);

    if ($(oTr.childNodes[roleperson_code]).text() != "") $$_oRolePerson.attr("code", $(oTr.childNodes[roleperson_code]).text());
    if ($(oTr.childNodes[roleperson_name]).text() != "") $$_oRolePerson.attr("name", $(oTr.childNodes[roleperson_name]).text());
    if ($(oTr.childNodes[roleperson_position]).text() != "") $$_oRolePerson.attr("position", $(oTr.childNodes[roleperson_position]).text());
    if ($(oTr.childNodes[roleperson_title]).text() != "") $$_oRolePerson.attr("title", $(oTr.childNodes[roleperson_title]).text());
    if ($(oTr.childNodes[roleperson_level]).text() != "") $$_oRolePerson.attr("level", $(oTr.childNodes[roleperson_level]).text());
    if ($(oTr.childNodes[roleperson_oucode]).text() != "") $$_oRolePerson.attr("oucode", $(oTr.childNodes[roleperson_oucode]).text());
    if ($(oTr.childNodes[roleperson_ouname]).text() != "") $$_oRolePerson.attr("ouname", $(oTr.childNodes[roleperson_ouname]).text());
    if ($(oTr.childNodes[roleperson_sipaddress]).text() != "") $$_oRolePerson.attr("sipaddress", $(oTr.childNodes[roleperson_sipaddress]).text());
    if ($(oTr.childNodes[roleperson_taskinfo_status]).text() != "") {
        var $$_oTaskinfo = $$_oRolePerson.create("taskinfo");
        if (chkAuthorize && $(oTr.childNodes[step_routetype]).text() == "approve") {
            $$_oTaskinfo.attr("status", "skipped");
            $$_oTaskinfo.attr("result", "skipped");
            $$_oTaskinfo.attr("kind", "skip");
        } else if (!chkAuthorize && $(oTr.childNodes[roleperson_taskinfo_kind]).text() == "skip" && $(oTr.childNodes[step_routetype]).text() == "approve") {
        	$$_oTaskinfo.attr("status", "inactive");
        	$$_oTaskinfo.attr("result", "inactive");
        	$$_oTaskinfo.attr("kind", "normal");
        }  else {
            if ($(oTr.childNodes[roleperson_taskinfo_status]).text() != "") $$_oTaskinfo.attr("status", $(oTr.childNodes[roleperson_taskinfo_status]).text());
            if ($(oTr.childNodes[roleperson_taskinfo_result]).text() != "") $$_oTaskinfo.attr("result", $(oTr.childNodes[roleperson_taskinfo_result]).text());
            if ($(oTr.childNodes[roleperson_taskinfo_kind]).text() != "") $$_oTaskinfo.attr("kind", $(oTr.childNodes[roleperson_taskinfo_kind]).text());
            if ($(oTr.childNodes[roleperson_taskinfo_kind]).text() == "authorize") chkAuthorize = true;
        }
        if ($(oTr.childNodes[roleperson_taskinfo_datereceived]).text() != "") $$_oTaskinfo.attr("datereceived", $(oTr.childNodes[roleperson_taskinfo_datereceived]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_datecompleted]).text() != "") $$_oTaskinfo.attr("datecompleted", $(oTr.childNodes[roleperson_taskinfo_datecompleted]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_rejectee]).text() != "") $$_oTaskinfo.attr("rejectee", $(oTr.childNodes[roleperson_taskinfo_rejectee]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_wiidrejectedto]).text() != "") $$_oTaskinfo.attr("wiidrejectedto", $(oTr.childNodes[roleperson_taskinfo_wiidrejectedto]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_daterejectedto]).text() != "") $$_oTaskinfo.attr("daterejectedto", $(oTr.childNodes[roleperson_taskinfo_daterejectedto]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_wiid]).text() != "") $$_oTaskinfo.attr("wiid", $(oTr.childNodes[roleperson_taskinfo_wiid]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_visible]).text() != "") $$_oTaskinfo.attr("visible", $(oTr.childNodes[roleperson_taskinfo_visible]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_customattribute1]).text() != "") $$_oTaskinfo.attr("customattribute1", $(oTr.childNodes[roleperson_taskinfo_customattribute1]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_customattribute2]).text() != "") $$_oTaskinfo.attr("customattribute2", $(oTr.childNodes[roleperson_taskinfo_customattribute2]).text());
        if ($(oTr.childNodes[roleperson_taskinfo_mobilegubun]).text() != "") $$_oTaskinfo.attr("mobileType", $(oTr.childNodes[roleperson_taskinfo_mobilegubun]).text());  //모바일 결재 여부
        if ($(oTr.childNodes[roleperson_taskinfo_comment]).text() != "") {
            var $$_oComment = $$_oTaskinfo.create("comment");
            if ($(oTr.childNodes[roleperson_taskinfo_comment_relatedresult]).text() != "") $$_oComment.attr("comment_relatedresult", $(oTr.childNodes[roleperson_taskinfo_comment_relatedresult]).text());
            if ($(oTr.childNodes[roleperson_taskinfo_comment_datecommented]).text() != "") $$_oComment.attr("comment_datecommented", $(oTr.childNodes[roleperson_taskinfo_comment_datecommented]).text());
            if ($(oTr.childNodes[roleperson_taskinfo_comment]).text() != "") {
                var CommentText = $(oTr.childNodes[roleperson_taskinfo_comment]).text();
                $$_oComment.append('#text', CommentText);
            }
            if ($(oTr.childNodes[roleperson_taskinfo_commentLast]).text() != "") {
                var $$_oCommentLast = $$_m_oApvList.create("commentLast");
                $$_oTaskinfo.append($$_oCommentLast);
                var CommentLastText = $(oTr.childNodes[roleperson_taskinfo_commentLast]).text();
                $$_oCommentLast.append('#text', CommentLastText);
            }
        }
        if ($(oTr.childNodes[roleperson_taskinfo_comment_fileinfo]).text() != "") {
            var CommentFileInfoJson = JSON.parse($(oTr.childNodes[roleperson_taskinfo_comment_fileinfo]).text());
            var $$_oComment_fileinfo = $$_oTaskinfo.append("comment_fileinfo", CommentFileInfoJson);
        }
    }

	// nRolePerson_Person 조건 추가 (role - 부서장 결재단계 - taskinfo 이후에 person이 다시 있어서 이부분 유지)
    if ($(oTr.childNodes[roleperson_person_nodetype]).text() != "") {
        var sRolePerson_Person = $(oTr.childNodes[roleperson_person_nodetype]).text();
    	var $$_oRolePerson_Person = $$_oRolePerson.create(sRolePerson_Person);
    	
    	if ($(oTr.childNodes[roleperson_person_code]).text() != "") $$_oRolePerson_Person.attr("code", $(oTr.childNodes[roleperson_person_code]).text());
    	if ($(oTr.childNodes[roleperson_person_name]).text() != "") $$_oRolePerson_Person.attr("name", $(oTr.childNodes[roleperson_person_name]).text());
    	if ($(oTr.childNodes[roleperson_person_position]).text() != "") $$_oRolePerson_Person.attr("position", $(oTr.childNodes[roleperson_person_position]).text());
    	if ($(oTr.childNodes[roleperson_person_title]).text() != "") $$_oRolePerson_Person.attr("title", $(oTr.childNodes[roleperson_person_title]).text());
    	if ($(oTr.childNodes[roleperson_person_level]).text() != "") $$_oRolePerson_Person.attr("level", $(oTr.childNodes[roleperson_person_level]).text());
    	if ($(oTr.childNodes[roleperson_person_oucode]).text() != "") $$_oRolePerson_Person.attr("oucode", $(oTr.childNodes[roleperson_person_oucode]).text());
    	if ($(oTr.childNodes[roleperson_person_ouname]).text() != "") $$_oRolePerson_Person.attr("ouname", $(oTr.childNodes[roleperson_person_ouname]).text());
    	if ($(oTr.childNodes[roleperson_person_sipaddress]).text() != "") $$_oRolePerson_Person.attr("sipaddress", $(oTr.childNodes[roleperson_person_sipaddress]).text());
    }
    //$$_oOu.append(roleperson_nodetype_text, $$_oRolePerson.json());

    return $$_oRolePerson;
}

function makeApvLineCcinfoXml(oTr) {
    var $$_oCcinfo = $$_m_oApvList.find('>steps').create("ccinfo");
    $$_oCcinfo.attr("belongto", $(oTr.childNodes[ccinfo_belongto]).text());
    if ($(oTr.childNodes[ccinfo_beforecc]).text() == "y") $$_oCcinfo.attr("beforecc", $(oTr.childNodes[ccinfo_beforecc]).text());
    $$_oCcinfo.attr("datereceived", $(oTr.childNodes[ccinfo_datereceived]).text());
    $$_oCcinfo.attr("senderid", $(oTr.childNodes[ccinfo_sender_id]).text());
    $$_oCcinfo.attr("sendername", $(oTr.childNodes[ccinfo_sender_name]).text());
    return $$_oCcinfo;
}

function makeApvLineCcinfoOuXml(oTr, $$_oCcinfo) {
    var $$_oCcOu = $$_oCcinfo.create("ou");
    
    if ($(oTr.childNodes[ccinfo_ou_code]).text() != "") $$_oCcOu.attr("code", $(oTr.childNodes[ccinfo_ou_code]).text());
    if ($(oTr.childNodes[ccinfo_ou_name]).text() != "") $$_oCcOu.attr("name", $(oTr.childNodes[ccinfo_ou_name]).text());
    return $$_oCcOu;
}

function makeApvLineCcinfoPersonXml(oTr, $$_oCcOu) {
    var $$_oCcPerson = $$_oCcOu.create("person");

    if ($(oTr.childNodes[ccinfo_person_code]).text() != "") $$_oCcPerson.attr("code", $(oTr.childNodes[ccinfo_person_code]).text());
    if ($(oTr.childNodes[ccinfo_person_name]).text() != "") $$_oCcPerson.attr("name", $(oTr.childNodes[ccinfo_person_name]).text());
    if ($(oTr.childNodes[ccinfo_person_position]).text() != "") $$_oCcPerson.attr("position", $(oTr.childNodes[ccinfo_person_position]).text());
    if ($(oTr.childNodes[ccinfo_person_title]).text() != "") $$_oCcPerson.attr("title", $(oTr.childNodes[ccinfo_person_title]).text());
    if ($(oTr.childNodes[ccinfo_person_level]).text() != "") $$_oCcPerson.attr("level", $(oTr.childNodes[ccinfo_person_level]).text());
    if ($(oTr.childNodes[ccinfo_person_oucode]).text() != "") $$_oCcPerson.attr("oucode", $(oTr.childNodes[ccinfo_person_oucode]).text());
    if ($(oTr.childNodes[ccinfo_person_ouname]).text() != "") $$_oCcPerson.attr("ouname", $(oTr.childNodes[ccinfo_person_ouname]).text());
    if ($(oTr.childNodes[ccinfo_person_sipaddress]).text() != "") $$_oCcPerson.attr("sipaddress", $(oTr.childNodes[ccinfo_person_sipaddress]).text());
    return $$_oCcPerson;
}

//*결재선 체크
function evaluateApvList() {
    //create Approval Line
    makeApvLineXml();
    
    // 개인협조 및 부서협조 체크 마지막 결재선 체크
    var oLastAppSteps = $$_m_oApvList.find("division>step").concat().has("[routetype=assist']").last();
    if( oLastAppSteps.length >0 && parseInt(oLastAppSteps.index()) == $$_m_oApvList.find("division>step").concat().length - 1){
    	//Common.Warning(strMsg_RuleError);
    	//return false;
    }
    
    if (m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL") {
        var m_oApvList_SubRe = jQuery.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value);
        var $$_m_oApvList_SubRe = $$(m_oApvList_SubRe);
        var $$_m_oSubReOu = $$_m_oApvList_SubRe.find("division").has(">taskinfo[status='pending']").find(">step[unittype='ou']>ou").has("taskinfo[status='pending'][piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "']");
        $$_m_oSubReOu.find("person").remove();

        $$_m_oApvList.find("ou person").concat().each(function (i, $$_elm) {
            $$_m_oSubReOu.append("person", $$_elm.json());
        });
        $$_m_oApvList = $$_m_oApvList_SubRe;
    } else {
        if (assureouvisibleCheck) {
            var m_oApvList_SubRe = jQuery.parseJSON(m_oFormMenu.document.getElementById("APVLIST").value);
            var $$_m_oApvList_SubRe = $$(m_oApvList_SubRe);

            $$_m_oApvList.find("division>step").concat().has("[unittype='ou']").has("ou>taskinfo[piid!='']").concat().each(function (i, $$_elm) {
            	$$_elm.find("ou>taskinfo").concat().each(function(j,$$_task){
            		var $$_sStepPiid = $$_task.attr("piid");
            		
            		var $$_m_oSubReOu = $$_m_oApvList_SubRe.find("division>step").concat().has("[unittype='ou']").find("ou").has("taskinfo[piid='" + $$_sStepPiid + "']");
            		$$_m_oSubReOu.find("person").concat().each(function (i, $$_elmP) {
            			$$_task.parent().append("person",$$_elmP.json());
            		});
            	});
            });
        }
    }

    var $$_elmRoot = $$_m_oApvList;
    //scCHLimit 결재자 제한	//scACLimit  합의자 제한
    if (getInfo("SchemaContext.scCHLimit.isUse") == "Y" && getInfo("SchemaContext.scCHLimit.value") != '') {
    	var $$_elmApprove = $$_elmRoot.find("division[divisiontype='"+(m_sApvMode == "REDRAFT" ? "receive" : "send")+"']>step").concat().has("[routetype='approve'][unittype='role'],[routetype='approve'][unittype='person']").has("ou>person>taskinfo[kind!='charge'],ou>role>taskinfo[kind!='charge']");
        if (!$$_elmApprove.exist()) {
        	if(!(((m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE") && getInfo("SchemaContext.scChrDraft.isUse") == "Y") || (m_sApvMode == "REDRAFT" && getInfo("SchemaContext.scChrRedraft.isUse") == "Y"))){
	            Common.Warning(strMsg_049); //"결재자를 지정하십시요"
	            return false;
        	}
        } else if ($$_elmApprove.length > parseInt(getInfo("SchemaContext.scCHLimit.value"))) {
        	Common.Warning(strMsg_050.replace('~', getInfo("SchemaContext.scCHLimit.value")));
            return false;
        }
    }

    if ((getInfo("SchemaContext.scPCoo.isUse") == "Y" || getInfo("SchemaContext.scPCooPL.isUse") == "Y") && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT")) {
        //var $$_elmAssist = $$_elmRoot.find("division>step[routetype='assist'][unittype='person']");
        //if (!$$_elmAssist.exist()) { //협조자가 마지막에 올수 있는 경우 아래 주석 부분 고려하여 수정
            if (!chkConsultAppLine($$_elmRoot)) return false;
        //} else {
        //    if (!chkConsultAppLine($$_elmRoot)) return false;
        //}
    }

    if ((getInfo("SchemaContext.scPAgr.isUse") == "Y" || getInfo("SchemaContext.scPAgrSEQ.isUse") == "Y" )&& (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT")) {
        var $$_elmConsult = $$_elmRoot.find("division>step[routetype='consult'][unittype='person']");
        if (!$$_elmConsult.exist()) {
            if (getInfo("SchemaContext.scDAgr.isUse") == "Y") {
                if (!chkConsultAppLine($$_elmRoot)) return false;
            }
        } else {
            if (getInfo("SchemaContext.scACLimit.isUse") == "Y" && getInfo("SchemaContext.scACLimit.value") != '' && $$_elmConsult.find("ou").concat().length > parseInt(getInfo("SchemaContext.scACLimit.value"))) {
                //Common.Warning(strMsg_051 + "\r\n ~ : " + getInfo("SchemaContext.scACLimit.value"));
                Common.Warning( strMsg_051.replace('~ ',getInfo("SchemaContext.scACLimit.value")) );
                return false;
            } else {
                if (!chkConsultAppLine($$_elmRoot)) return false;
            }
        }
    }
    if (getInfo("SchemaContext.scDAgr.isUse") == "Y" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT")) {
        var $$_elmConsult = $$_elmRoot.find("division>step[routetype='consult'][unittype='ou']");
        if (!$$_elmConsult.exist()) {
            if (getInfo("SchemaContext.scPAgr.isUse") == "Y") {
                if (!chkConsultAppLine($$_elmRoot)) return false;
            }
        }
    }

    if (getInfo("SchemaContext.scPAgr.isUse") == "Y" && (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL")) {
        var $$_elmConsult = $$_elmRoot.find("division>step[routetype='consult'][unittype='person']");
        if (!$$_elmConsult.exist()) {
        } else {
            var $$_emlSteps = $$_elmRoot.find("division>step");
            var $$_emlStep;
            var HasApprover = false;
            var HasConsult = false;
            $$_emlSteps.concat().each(function (i, $$_emlStep) {
                if ($$_emlStep.attr("routetype") == "consult") {
                    HasConsult = true;
                }
                if (HasConsult) {
                    if ($$_emlStep.attr("routetype") == "approve") {
                        HasApprover = true;
                    }
                }
            });

            if (HasApprover == true) {
            } else {
                Common.Warning(strMsg_052);  //"결재선에서 합의는 최종결재자 전에 위치해야 합니다.\n현 합의를 결재자 아래로 내려주십시요."
                return false;
            }
        }
    }

    if (getInfo("SchemaContext.scChgr.isUse") == "Y" && getInfo("SchemaContext.scChgr.value") == "select" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        var $$_elmOu = $$_elmRoot.find("division>step[routetype='receive']>ou>role");
        if (!elmOu.exist()) {
            Common.Warning(strMsg_054);  //"담당업무를 지정하십시요"
            return false;
        } else if (elmOu.length > 1) {
            Common.Warning(strMsg_055);  //"담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요."
            return false;
        } else {
            var $$_elmReceive = $$_elmRoot.find("division>step[unittype='person'][routetype='receive']");
            if ($$_elmReceive.exist()) { Common.Warning(strMsg_055); return false; } //"담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요."
            var $$_ouReceive = $$_elmReceive.find("role");
            if ($$_ouReceive.exist()) { Common.Warning(strMsg_055); return false; } //"담당업무는 1개만 지정 가능 합니다. \n담당업무를 다시 지정해 주십시요."
        }
        var $$_emlSteps = $$_elmRoot.find("division>step");
        var $$_emlStep;
        var HasApprover = false;
        var HasReceive = false;
        $$_emlSteps.concat().each(function (i, $$_emlStep) {
            if ($$_emlStep.attr("routetype") == "receive" && $$_emlStep.attr("unittype") == "person") {
                HasReceive = true;
            }
            if (HasReceive) {
                if ($$_emlStep.attr("routetype") == "approve") {
                    HasApprover = true;
                }
            }
        });
        if (HasApprover == true) {
            Common.Warning(strMsg_056);  //"결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요."
            return false;
        }
    }

    if (getInfo("SchemaContext.scDAgr.isUse") == "Y" && m_sApvMode == "SUBREDRAFT") {
        if ($$_elmRoot.find("division>step>ou:has(taskinfo[status='pending'][piid='" + getInfo("ProcessInfo.ProcessID").toUpperCase() + "'])>person:has(taskinfo[kind!='skip'])").length < 1) {
            Common.Warning(strMsg_029);  //"결재선을 지정하십시요"
            return false;
        }
    }
    //수신자 추가 
    if (getInfo("SchemaContext.scPRec.isUse") == "Y" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        var $$_elmOu = $$_elmRoot.find("division>step[routetype='receive']>ou>person");
        if (!$$_elmOu.exist()) {
            if (getInfo("SchemaContext.scPRec.value") == "select") {
            } else {
                if (getInfo("SchemaContext.scDRec.isUse") == "Y" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
                    $$_elmOu = $$_elmRoot.find("division>step[routetype='receive']");
                    if ($$_elmOu.length == 0) {
                        if ($$_elmRoot.find("division[divisiontype='receive']>step").length== 0) {
	                        Common.Warning(strMsg_181);
	                        return false;
                        }
                    }
                } else {
                    Common.Warning(strMsg_181);
                    return false;
                }
            }
        }

        var $$_emlSteps = $$_elmRoot.find("division>step");
        var emlStep;
        var HasApprover = false;
        var HasReceive = false;
        $$_emlSteps.concat().each(function (i, $$_emlStep) {
            if ($$_emlStep.attr("routetype") == "receive" && $$_emlStep.attr("unittype") == "person") {
                HasReceive = true;
            }
            if (HasReceive) {
                if ($$_emlStep.attr("routetype") == "approve") {
                    HasApprover = true;
                }
            }
        });
        if (HasApprover == true) {
            Common.Warning(strMsg_056); //"결재선에서 담당부서처리는 최종결재자 다음에 위치해야 합니다.\n현 업무담당를 결재자 위로 올려주십시요."
            return false;
        }
    }

    //감사 조건 추가 - 최종결재자 이전에 위치해야 함
    //비사용 스키마  - 일상감사
   /* if (getInfo("scGAdt") == 1 && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT" || m_sApvMode == "AUDIT")) {
        var $$_elmAudit = $$_elmRoot.find("division>step[routetype='audit'][unittype='person']");
        if (!$$_elmAudit.exist()) {
            return chkConsultAppLine($$_elmRoot);
        }
    }*/

    //감사 관련 종료
    //감사사용 양식에서 상무 이상이 결재자에 있는 경우 감사자가 반드시 존재해야함
    if (getInfo("SchemaContext.scDAdt.isUse") == "Y" && (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL")) {
        var $$_emlSteps = $$_elmRoot.find("division>step[routetype!='review']");
        var emlStep;
        var $$_elmList = $$_elmRoot.find("division>step[unittype='person'][routetype='approve']>ou>person,division>step[unittype='role'][routetype='approve']>ou>role");
        var elm, elmTaskInfo, ii;
        var HasApprover = false;
        var HasConsult = false;
        var HadReviewer = false;
        var PreConsult = false;
        var EndReviewer = false;
        var CurConsult = false;
        var bAuth = false;
        ii = 0;
        var baudit = false;
        $$_emlSteps.concat().each(function (i, $$_emlStep) {
            if ($$_emlStep.attr("routetype") == "audit") {
                HasConsult = true;
                if (bAuth) {
                    baudit = true;
                    return false;
                }
            } //감사관련 수정
            if (i == $$_emlSteps.length - 2 && $$_emlStep.attr("routetype") == "audit") PreConsult = true; 
            if (i == $$_emlSteps.length - 1 && $$_emlStep.attr("routetype") == "audit") CurConsult = true; 
            if ($$_emlStep.find("ou>person>taskinfo").exist() && $$_emlStep.find("ou>person>taskinfo").attr("kind") == "authorize") bAuth = true;
        });

        if (bAuth && baudit) {
            Common.Warning(strMsg_304);
            return false;
        }
        
        let $$_elmTaskInfo;
        $$_elmList.concat().each(function (i, $$_elm) {
            $$_elmTaskInfo = $$_elm.find("taskinfo");
            if (i == $$_elmList.length - 1 && ($$_elmTaskInfo.attr("kind") == "review" || $$_elmTaskInfo.attr("kind") == "confirm")) EndReviewer = true; // 2004.10.26 update
        });

        if (HasConsult) {
            if ($$_elmRoot.find("division>step[routetype!='review']").attr("routetype") && $$_elmTaskInfo.attr("kind") != "review" && $$_elmTaskInfo.attr("kind") != "skip") HasApprover = true; // 2004.10.26 update
        }
    }
    
    //(재기안시 결재선 체크)     
    if (m_sApvMode == "REDRAFT") {
        var $$_rtask = $$_elmRoot.find("division").has("taskinfo[kind='receive'][status='pending']").find(">step>ou>person>taskinfo[kind!='charge']"); /*$$_elmRoot.find("division:has(taskinfo[kind='receive'][status='pending'])>step>ou>person>taskinfo[kind != 'charge']");*/
        if (!$$_rtask.exist()) { 
            if (getInfo("SchemaContext.scChrRedraft.isUse") == "Y") {
            } else {
                Common.Warning(strMsg_049); //"결재자를 지정하십시요"
                return false;
            }
        }
    }

    return true;
}
//감사 처리
function setAudit() { }
function switchAudit() { }
function getChargeNode() {
    var oPerson = m_oApvList.createElement("person");
    var oTaskinfo = m_oApvList.createElement("taskinfo");
    oPerson.appendChild(oTaskinfo);
    oPerson.setAttribute("code", getInfo("AppInfo.usid"));
    oPerson.setAttribute("name", getInfo("AppInfo.usdn"));
    oPerson.setAttribute("position", getInfo("AppInfo.uspc") + ";" + getInfo("AppInfo.uspn"));
    oPerson.setAttribute("title", getInfo("AppInfo.ustc") + ";" + getInfo("AppInfo.ustn"));
    oPerson.setAttribute("level", getInfo("AppInfo.uslc") + ";" + getInfo("AppInfo.usln"));
    oPerson.setAttribute("oucode", getInfo("AppInfo.dpid"));
    oPerson.setAttribute("ouname", getInfo("AppInfo.dpdn"));
    oPerson.setAttribute("sipaddress", getInfo("AppInfo.ussip"));
    oTaskinfo.setAttribute("status", "inactive");
    oTaskinfo.setAttribute("result", "inactive");
    oTaskinfo.setAttribute("kind", "charge");

    return oPerson;
}
var g_szAcceptLang = "ko";

function setVisibility(e) {
    var bSetDirty = false;
    var oSelTR;
    oSelTR = getPatentRowApvlist(e);
    var xpathCur = oSelTR.id;
    if (window.ActiveXObject === undefined) { xpathCur = ConvertXpath(xpathCur); }

    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTaskInfo = elmCur.selectSingleNode("taskinfo");

    var sCurType = Apvlist.event.srcElement.value;
    switch (sCurType) {
        case "y": //보이기			
            elmTaskInfo.setAttribute("visible", "y");
            bSetDirty = true;
            break;
        case "n": //감추기
            elmTaskInfo.setAttribute("visible", "n");
            bSetDirty = true;
            break;
    }
    if (bSetDirty) try { m_oFormMenu.setApvDirty(); } catch (e) { }
    refreshList();
}
function changeVtitle(e) {
    var bSetDirty = false;
    var oSelTR;
    oSelTR = getPatentRowApvlist(e);
    var xpathCur = oSelTR.id;
    if (window.ActiveXObject === undefined) { xpathCur = ConvertXpath(xpathCur); }

    var elmRoot = m_oApvList.documentElement;
    var elmCur = elmRoot.selectSingleNode(xpathCur);
    var elmTitle = elmCur.getAttribute("title");
    var aTitle = elmTitle.split(";");
    var sCurType = Apvlist.event.srcElement.value;
    var elmNewTitle = aTitle[0] + ";" + sCurType;

    elmCur.setAttribute("title", elmNewTitle);
    bSetDirty = true;
    if (m_oFormMenu.document.getElementById("APVLIST") == "undefined") m_oFormMenu.setApvDirty();
    refreshList();
}
function getChargeOUNode() {
    var oStep = m_oApvList.createElement("step");
    var oOU = m_oApvList.createElement("ou");
    var oTaskinfo = m_oApvList.createElement("taskinfo");
    m_oApvList.documentElement.appendChild(oStep).appendChild(oOU).appendChild(oTaskinfo);
    oStep.setAttribute("unittype", "ou");
    oStep.setAttribute("routetype", "receive");
    oStep.setAttribute("name", strlable_ChargeDept_Rec); //"담당부서수신"
    oOU.setAttribute("code", getInfo("AppInfo.dpid_apv"));
    oOU.setAttribute("name", getInfo("AppInfo.dpdn_apv"));
    oTaskinfo.setAttribute("status", "pending");
    oTaskinfo.setAttribute("result", "pending");
    oTaskinfo.setAttribute("kind", "normal");
    oTaskinfo.setAttribute("datereceived", getInfo("AppInfo.svdt_TimeZone"));
    return m_oApvList.documentElement.selectSingleNode("division/step[@unittype='ou']/ou[@code='" + getInfo("AppInfo.dpid_apv") + "' and taskinfo/@status='pending']"); //
}
function getPersonDeploy() {
    if (self.iPersonDeployList.m_id != "") {

        var oSteps = self.iPersonDeployList.queryGetData();
        var oCheckSteps = chkAbsent(oSteps);
    }
    return oSteps;
}
function chkAbsent(oSteps) {
    var elmUsers;
    var sUsers = "";
    $$(oSteps).find("division > step > ou > person").each(function (i, $$) {
        if (sUsers.length > 0) {
            var szcmpUsers = ";" + sUsers + ";";
            if (szcmpUsers.indexOf(";" + $$.attr("code") + ";") == -1) { sUsers += ";" + $$.attr("code"); }
        } else {
            sUsers += $$.attr("code");
        }
    });
    
    var bReturn = false;
    
	if (sUsers != "") {
	    $.ajax({
	    	type:"POST",
	    	url:"apvline/checkAbsentMember.do",
	    	async:false,
	    	data:{
	    		"users":sUsers
	    	},
	    	success : function(data){
	              var sAbsentResult = "";
	              var sResult = "";
	              var oChkAbsentNode;
	    		  $$(oSteps).find("division>step>ou>person").each(function (i, oUser) {
	    			  if($$(oUser).concat().length <= 1) { // 대결자 있는 경우 퇴사자로 인식하여 예외처리
		    			  sAbsentResult += m_oFormMenu.getLngLabel(oUser.attr("name").toString(), false) + ",";
		    			  sResult += m_oFormMenu.getLngLabel(oUser.attr("name").toString(), false) + ",";
		                  $(data.list).each(function (idx, oChkAbsentNode) {
		                      if (oChkAbsentNode.PERSON_CODE == oUser.attr("code")) {
		                          if (oChkAbsentNode.UNIT_CODE == oUser.attr("oucode")) {
		                              oUser.attr("oucode", oChkAbsentNode.UNIT_CODE);
		                              oUser.attr("ouname", oChkAbsentNode.UNIT_NAME);
		                              oUser.attr("position", oChkAbsentNode.JOBPOSITION_Z);
		                              oUser.attr("title", oChkAbsentNode.JOBTITLE_Z);
		                              oUser.attr("level", oChkAbsentNode.JOBLEVEL_Z);
		                              sResult = sResult.replace(m_oFormMenu.getLngLabel(oUser.attr("name"), false) + ",", "");
		                          }
		
		                          sAbsentResult = sAbsentResult.replace(m_oFormMenu.getLngLabel(oUser.attr("name"), false) + ",", "");
		                      } else {//퇴직자
		                      }
		                  });
	    			  }
	              });
	    		  if (sAbsentResult != "") {
	    			  alert(coviDic.dicMap["msg_apv_057"] + '\n\n' + coviDic.dicMap["msg_apv_359"] + " : " + sAbsentResult.substring(0, sResult.length - 1)); //선택된 결재선에 퇴직자가 포함되어 적용이 되지 않습니다.\n\n퇴직자 : 슈퍼관리자
	                  bReturn = false;
	              } else {
	                  if (sResult != "") {
	                      alert(coviDic.dicMap["msg_apv_173"] + '\n\n' + coviDic.dicMap["msg_apv_358"] + " : " + sResult.substring(0, sResult.length - 1)); //선택한 개인 결재선의 부서/인사정보가 최신정보와 일치하지 않아 제외됩니다.\n\n제외 대상자 : 슈퍼관리자
	                      bReturn = false;
	                  } else {
	                      bReturn = true;
	                  }
	              }
	    	},
	    	error:function(response, status, error){
				CFN_ErrorAjax("apvline/checkAbsentMember.do", response, status, error);
			}
	    	
	    });
	}
   
    return bReturn;
}

function chkConsultAppLine($$_elmRoot) {
    var $$_emlSteps = $$_elmRoot.find("division>step");
    //발신,수신체크
    if (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT") {
        $$_emlSteps = $$_elmRoot.find("division[divisiontype='send']>step");
    } else if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
        $$_emlSteps = $$_elmRoot.find("division:has(>taskinfo[status='pending'])>step");
    }
    var emlStep;
    var $$_elmList = $$_elmRoot.find("division>step[unittype='person'][routetype='approve'],step[unittype='role'][routetype='approve']>ou>person,role");
    //발신,수신체크
    if (m_sApvMode == "DRAFT" || m_sApvMode == "TEMPSAVE" || m_sApvMode == "APPROVAL" || m_sApvMode == "PCONSULT") {
        $$_elmList = $$_elmRoot.find("division[divisiontype='send']>step[unittype='person'][routetype='approve'],step[unittype='role'][routetype='approve']>ou>person,role");
    } else if (m_sApvMode == "REDRAFT" || m_sApvMode == "RECAPPROVAL") {
        $$_elmList = $$_elmRoot.find("division:has(>taskinfo[status='pending'])>step[unittype='person'][routetype='approve'],step[unittype='role'][routetype='approve']>ou>person,role");
    }
    var $$_elm, $$_elmTaskInfo;
    var HasApprover = false;
    var HasConsult = false;
    var HadReviewer = false;
    var PreConsult = false;
    var EndReviewer = false;
    var CurConsult = false;
    var CurAssist = false;

    $$_emlSteps.concat().each(function (i, $$_emlStep) {
        if ($$_emlStep.attr("routetype") == "consult" || $$_emlStep.attr("routetype") == "assist" || $$_emlStep.attr("routetype") == "audit") HasConsult = true; //감사관련 수정
        if (i == $$_emlSteps.valLength() - 2 && $$_emlStep.attr("routetype") == "consult") PreConsult = true;
        if (i == $$_emlSteps.valLength() - 1 && $$_emlStep.attr("routetype") == "consult") CurConsult = true;
        if (i == $$_emlSteps.valLength() - 1 && $$_emlStep.attr("routetype") == "assist") CurAssist = true;
    });

    $$_elmList.concat().each(function (j, $$_elm) {
        $$_elmTaskInfo = $$_elm.find("taskinfo");
        if (j == $$_elmList.length - 1 && $$_elmTaskInfo.attr("kind") == "review") EndReviewer = true;
    });

    /*if (HasConsult) {
        if (emlStep && $$(emlStep).attr("routetype") == "approve" && $$_elmTaskInfo.attr("kind") != "review") HasApprover = true;
    }*/
    if (HasConsult) {
        if (HasApprover == true) {
            return true;
        } else {
            if (PreConsult && EndReviewer) {
                Common.Warning(strMsg_058); //"최종결재자가 후결인 경우에 전 결재자는 합의일 수 없습니다."
                return false;
            } else {
                if (CurConsult) {
                    Common.Warning(strMsg_052);
                    return false;
                }
//                최종결재자에 협조가 올 수 있음
//                else if (CurAssist) {
//                    Common.Warning(strMsg_059);
//                    return false;
//                } 
                else { return true; }
            }
        }
    } else {
        return true;
    }
}

function chkDuplicateApprover(oSrcDoc) {
    var oSrcDocList = $$(oSrcDoc).find("item").concat();
    var bDelete = false;
    var bDeleteCC = false;
    var removeList = new Array();
    
    oSrcDocList.each(function(i, item){
        switch (m_sSelectedUnitType) {
        case "person":
            if (m_sSelectedStepType == "ccinfo") {
                $("#tblccinfo").find("tr").each(function (i, itemTR) {
                    if ($(itemTR.childNodes[ccinfo_person_code]).text() == $$(item).attr("AN")) {
                        try {
                        	$$(item).attr("isDeleted", "Y");
                            bDeleteCC = true;
                        } catch (e) {
                        }
                    }
                });
            } else {
                $("#tblApvLine").find("tr").each(function (i, itemTR) {
                    if ($(itemTR.childNodes[roleperson_code]).text() == $$(item).attr("AN")) {
                        try {
                        	$$(item).attr("isDeleted", "Y");
                            bDelete = true;
                        } catch (e) {
                        }
                    }
                });
            }
            break;
        case "ou":
            if (m_sSelectedStepType == "ccinfo") {
                $("#tblccinfo").find("tr").each(function (i, itemTR) {
                    if ($(itemTR.childNodes[ccinfo_ou_code]).text() == $$(item).attr("AN") && $(itemTR.childNodes[ccinfo_person_code]).text() == "") {
                        try {
                        	$$(item).attr("isDeleted", "Y");
                            bDeleteCC = true;
                        } catch (e) {
                        }
                    }
                });
            } else {
                $("#tblApvLine").find("tr").each(function (i, itemTR) {
                    if ($(itemTR.childNodes[ou_code]).text() == $$(item).attr("AN")) {
                        try {
                        	$$(item).attr("isDeleted", "Y");
                            bDelete = true;
                        } catch (e) {
                        }
                    }
                });
            }
            break;
        }
    });
    
    //item remove
    /*var oRemove = $$(oSrcDoc).find("item[isDeleted=Y]").concat();
	for(var i=0; i<oRemove.length; i++){
		if($$(oSrcDoc).find("item").concat().length > 1)
			$$(oSrcDoc).find("item").remove($$(oRemove).eq(0).index());
		else
			$$(oSrcDoc).find("item").remove();
	}*/
    $$(oSrcDoc).find("item[isDeleted=Y]").remove();
    if($$(oSrcDoc).find("item").concat().length == 0) $$(oSrcDoc).find("item").remove();
    
    if (bDelete) { Common.Warning(strMsg_186); } //"결재자가 이미 지정되어 있습니다."
    if (bDeleteCC) { Common.Warning(coviDic.dicMap["msg_AlreadyRegisted"]); } //"이미 등록되어있습니다
    return oSrcDoc;

}
function chkManagerConsult(oSrcDoc) {
    var bDeleted = false;
    if (m_sSelectedRouteType == "consult") {
        var oSrcDocList = oSrcDoc.selectNodes("//item");
        for (var i = 0; i < oSrcDocList.length; i++) {
            var item = oSrcDocList.nextNode();
            var xPathDelete = '';
        }
    }
    //if (bDeleted) Common.Warning(strMsg_124); //"합의자는 부서장만 선택할 수 있습니다.\n개인을 직접 지정할 수 없습니다."
    return oSrcDoc;
}
function chkManagerApprove(oSrcDoc) {
    var bDeleted = false;
    if (m_sSelectedRouteType == "approve" || m_sSelectedRouteType == "receive") {
        var oSrcDocList = oSrcDoc.selectNodes("//item");
        for (var i = 0; i < oSrcDocList.length; i++) {
            var item = oSrcDocList.nextNode();
            var xPathDelete = '';
            if (item.selectSingleNode("ROLE") != null) {
                if (item.selectSingleNode("ROLE").text == "manager") {
                    oSrcDoc.documentElement.removeChild(item);
                    bDeleted = true;
                }
            }
        }
    }
    if (bDeleted) Common.Warning(strMsg_125); //"결재자는 부서장을 선택할 수 없습니다.\n개인을 직접 지정하십시요."
    return oSrcDoc;
}

function ConvertXpath(szXPath) {
    //index변환 "divison[0]/step[1]/ou[3]/(person|role)
    /*
    "divison [
    0        ]/step [
    1        ]/ou [
    3        ]/(person|role)
    */
    var szCVTPath = "";
    if (szXPath.indexOf("division[0]/step[") > -1 || szXPath.indexOf("division[1]/step[") > -1 || szXPath.indexOf("division[2]/step[") > -1 || szXPath.indexOf("division[3]/step[") > -1 || szXPath.indexOf("division[4]/step[") > -1
    || szXPath.indexOf("ccinfo[") > -1
    ) {
        var AryNumber = szXPath.split("[");
        for (var i = 0; i < AryNumber.length; i++) {
            if (AryNumber[i].indexOf("]") > -1) {
                var AryNumber2 = AryNumber[i].split("]");
                for (var j = 0; j < AryNumber2.length; j++) {
                    if (isNumber(AryNumber2[j])) {
                        AryNumber2[j] = parseInt(AryNumber2[j]) + 1;
                    }
                }
                for (var j = 0; j < AryNumber2.length; j++) {
                    szCVTPath += AryNumber2[j] + ((j == 0) ? "]" : "")
                }
                if (i < AryNumber.length - 1) szCVTPath += "[";
            } else {
                szCVTPath += AryNumber[i] + ((i == 0) ? "[" : "");
            }
        }
    } else {
        szCVTPath = szXPath;
    }
    return szCVTPath.replace("(person|role)", "*[name()='person' or name()='role']");
}
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

//*결재 목록 ROW 데이터 추출
function calltemplatehtmlrow(index, viewtype, itemtaskinfo, displayonly, displayBypass) { //파라미터 displayBypass 추가, 표시해야하는 후열과 표시되지 말아야하는 후열(대결로 인한 자동후열)을 구분하기 위해 추가.
//in progress
//itemtaskinfo: $$jsoner

    var $$_nDivision, $$_nDivisionTaskinfo, $$_nStep, $$_nStepTaskinfo, $$_nOu, $$_nOuTaskinfo,
        $$_nRolePerson, $$_nRolePersonTaskinfo, $$_nRolePersonTaskinfoComment, $$_nRolePersonTaskinfoCommentLast, $$_nRolePersonTaskinfoCommentFileInfo, $$_nRolePerson_Person;
        
    var szcustomattribute2 = "";
    var taskType = "RolePerson";
    var $$_nTempTaskinfo; 
    if($.isArray(itemtaskinfo.concat().json())==true){
    	itemtaskinfo.concat().each(function(i,$$_elm){
    		if($$_elm.parent().nodename()=="ou"){
    			$$_nTempTaskinfo = $$_elm;
    		}
    	});
    	if($$_nTempTaskinfo==null){
    		$$_nTempTaskinfo = $$(itemtaskinfo).concat().eq($$(itemtaskinfo).valLength()-1); 	
    	}
    	//부서 합의의 경우 ou의 taskinfo가 xml에서는 제일 위였지만 json에선 find로 찾으면 젤 뒤로 감.
    }else{
    	$$_nTempTaskinfo = $$(itemtaskinfo).concat().eq(0);
    }
    if ($$_nTempTaskinfo.parent().exist() && ($$_nTempTaskinfo.parent().nodename() == "person" || $$_nTempTaskinfo.parent().nodename() == "role")) {
        $$_nRolePersonTaskinfo = $$_nTempTaskinfo;
        taskType = "RolePerson";
        $$_nRolePerson = $$_nRolePersonTaskinfo.parent(); //@@@@ progress
        
        var $$_TaskInfoChildren = $$_nRolePersonTaskinfo.children();
        for (var i = 0; i < $$_TaskInfoChildren.length; i++) {
            var $$_TaskInfoChild = $$_TaskInfoChildren.eq(i);
            
            if ($$_TaskInfoChild != null && $$_TaskInfoChild.nodename() == "comment")
                $$_nRolePersonTaskinfoComment = $$_TaskInfoChild;
            if ($$_TaskInfoChild != null && $$_TaskInfoChild.nodename() == "commentLast")
                $$_nRolePersonTaskinfoCommentLast = $$_TaskInfoChild;
            if ($$_TaskInfoChild != null && $$_TaskInfoChild.nodename() == "comment_fileinfo")
                $$_nRolePersonTaskinfoCommentFileInfo = $$_TaskInfoChild;
        }
        
        if ($$_nRolePerson.parent()!= null && $$_nRolePerson.parent().nodename() == "ou") {
            $$_nOu = $$_nRolePerson.parent();
            if ($$_nOu.love("taskinfo").exist())
                $$_nOuTaskinfo = $$_nOu.love("taskinfo");
            if ($$_nOu.parent() != null && $$_nOu.parent().nodename() == "step") {
                $$_nStep = $$_nOu.parent();
                szcustomattribute2 = $$_nStep.attr("name");
                if ($$_nStep.love("taskinfo").exist())
                    $$_nStepTaskinfo = $$_nStep.love("taskinfo");
                if ($$_nStep.parent() != null && $$_nStep.parent().nodename() == "division") {
                    $$_nDivision = $$_nStep.parent();
                    if ($$_nDivision.love("taskinfo").exist())
                        $$_nDivisionTaskinfo = $$_nDivision.love("taskinfo");
                }
            }
        }

    	// nRolePerson_Person 조건 추가 (role - 부서장 결재단계 - taskinfo 이후에 person이 다시 있어서 이부분 유지)
		// <step><ou><role><taskinfo><comment></comment></taskinfo>   <person></person>   </role></ou></step>
        if ($$_nTempTaskinfo.parent().nodename() == "role" && $$_nRolePerson.find("person").exist()) {
        	$$_nRolePerson_Person = $$_nRolePerson.find("person");
        }

    } else if ($$_nTempTaskinfo.parent().exist() && $$_nTempTaskinfo.parent().nodename() == "ou") {
        $$_nOu = $$_nTempTaskinfo.parent();
        taskType = "Ou";
        $$_nOuTaskinfo = $$_nTempTaskinfo;
        if ($$_nOu.parent().exist() && $$_nOu.parent().nodename() == "step") {
            $$_nStep = $$_nOu.parent();
            szcustomattribute2 = $$_nStep.attr("name");
            if ($$_nStep.love("taskinfo").exist())
                $$_nStepTaskinfo = $$_nStep.love("taskinfo");
            if ($$_nStep.parent().exist() && $$_nStep.parent().nodename() == "division") {
                $$_nDivision = $$_nStep.parent();
                if ($$_nDivision.love("taskinfo").exist())
                    $$_nDivisionTaskinfo = $$_nDivision.love("taskinfo");
            }
        }
    } else if ($$_nTempTaskinfo.parent().exist() && $$_nTempTaskinfo.parent().nodename() == "step") {
        $$_nStep = $$_nTempTaskinfo.parent();
        taskType = "Step";
        szcustomattribute2 = $$_nStep.attr("name");
        $$_nStepTaskinfo = $$_nTempTaskinfo;
        if ($$_nStep.parent().exist() && $$_nStep.parent().nodename() == "division") {
            $$_nDivision = $$_nStep.parent();
            if ($$_nDivision.love("taskinfo").exist())
                $$_nDivisionTaskinfo = $$_nDivision.love("taskinfo");
        }
    } else if ($$_nTempTaskinfo.parent().exist() && $$_nTempTaskinfo.parent().nodename() == "division") {
        $$_nDivision = $$_nTempTaskinfo.parent();
        taskType = "Division";
        $$_nDivisionTaskinfo = $$_nTempTaskinfo;
    }

    var arrDivision = [];
    if ($$_nDivision != undefined && $$_nDivision.exist()) {
        arrDivision.push(($$_nDivision.attr("divisiontype") == null) ? "" : $$_nDivision.attr("divisiontype"));
        arrDivision.push(($$_nDivision.attr("name") == null) ? "" : $$_nDivision.attr("name"));
        arrDivision.push(($$_nDivision.attr("oucode") == null) ? "" : $$_nDivision.attr("oucode"));
        arrDivision.push(($$_nDivision.attr("ouname") == null) ? "" : $$_nDivision.attr("ouname"));
    }

    var arrDivisionTaskinfo = [];
    if ($$_nDivisionTaskinfo != undefined && $$_nDivisionTaskinfo.exist()) {
        arrDivisionTaskinfo.push(($$_nDivisionTaskinfo.attr("status") == null) ? "" : $$_nDivisionTaskinfo.attr("status"));
        arrDivisionTaskinfo.push(($$_nDivisionTaskinfo.attr("result") == null) ? "" : $$_nDivisionTaskinfo.attr("result"));
        arrDivisionTaskinfo.push(($$_nDivisionTaskinfo.attr("kind") == null) ? "" : $$_nDivisionTaskinfo.attr("kind"));
        arrDivisionTaskinfo.push(($$_nDivisionTaskinfo.attr("datereceived") == null) ? "" : $$_nDivisionTaskinfo.attr("datereceived"));
        arrDivisionTaskinfo.push(($$_nDivisionTaskinfo.attr("datecompleted") == null) ? "" : $$_nDivisionTaskinfo.attr("datecompleted"));
    }

    var arrStep = [];
    var description = "";
    if ($$_nStep != undefined && $$_nStep.exist()) {
        arrStep.push(($$_nStep.attr("unittype") == null) ? "" : $$_nStep.attr("unittype"));
        arrStep.push(($$_nStep.attr("routetype") == null) ? "" : $$_nStep.attr("routetype"));
        arrStep.push(($$_nStep.attr("allottype") == null) ? "" : $$_nStep.attr("allottype"));
        arrStep.push(($$_nStep.attr("name") == null) ? "" : $$_nStep.attr("name"));
        arrStep.push(($$_nStep.attr("ruleapvclass") == null) ? "" : $$_nStep.attr("ruleapvclass"));
        arrStep.push(($$_nStep.attr("ruleapvclassatt01") == null) ? "" : $$_nStep.attr("ruleapvclassatt01"));

        //합의그룹(분리) 표시
        if ($$_nStep.prev().exist()) {
            //step이 병렬 합의 && 이전 step이 합의 && step하위의 첫번째 ou인 경우
            if ($$_nStep.attr("routetype") == "assist" && $$_nStep.attr("allottype") == "parallel" && $$_nStep.prev().attr("routetype") == "assist" && $$_nStep.find("ou").comparePath($$_nOu) ) {
                //description = "(분리)";
            }
        }
    }

    var arrStepTaskinfo = [];
    if ($$_nStepTaskinfo != null) {
        arrStepTaskinfo.push(($$_nStepTaskinfo.attr("status") == null) ? "" : $$_nStepTaskinfo.attr("status"));
        arrStepTaskinfo.push(($$_nStepTaskinfo.attr("result") == null) ? "" : $$_nStepTaskinfo.attr("result"));
        arrStepTaskinfo.push(($$_nStepTaskinfo.attr("kind") == null) ? "" : $$_nStepTaskinfo.attr("kind"));
        arrStepTaskinfo.push(($$_nStepTaskinfo.attr("datereceived") == null) ? "" : $$_nStepTaskinfo.attr("datereceived"));
        arrStepTaskinfo.push(($$_nStepTaskinfo.attr("datecompleted") == null) ? "" : $$_nStepTaskinfo.attr("datecompleted"));
    }

    var arrOu = [];
    if ($$_nOu != null) {
        arrOu.push(($$_nOu.attr("code") == null) ? "" : $$_nOu.attr("code"));
        arrOu.push(($$_nOu.attr("name") == null) ? "" : $$_nOu.attr("name"));
    }

    var arrOuTaskinfo = [];
    if ($$_nOuTaskinfo != null) {
        arrOuTaskinfo.push(($$_nOuTaskinfo.attr("status") == null) ? "" : $$_nOuTaskinfo.attr("status"));
        arrOuTaskinfo.push(($$_nOuTaskinfo.attr("result") == null) ? "" : $$_nOuTaskinfo.attr("result"));
        arrOuTaskinfo.push(($$_nOuTaskinfo.attr("kind") == null) ? "" : $$_nOuTaskinfo.attr("kind"));
        arrOuTaskinfo.push(($$_nOuTaskinfo.attr("datereceived") == null) ? "" : $$_nOuTaskinfo.attr("datereceived"));
        arrOuTaskinfo.push(($$_nOuTaskinfo.attr("datecompleted") == null) ? "" : $$_nOuTaskinfo.attr("datecompleted"));
        arrOuTaskinfo.push(($$_nOuTaskinfo.attr("piid") == null) ? "" : $$_nOuTaskinfo.attr("piid"));
    }

    var arrRolePerson = [];
    if ($$_nRolePerson != null) {
        arrRolePerson.push($$_nRolePerson.nodename());
        arrRolePerson.push(($$_nRolePerson.attr("code") == null) ? "" : $$_nRolePerson.attr("code"));
        arrRolePerson.push(($$_nRolePerson.attr("name") == null) ? "" : $$_nRolePerson.attr("name"));
        arrRolePerson.push(($$_nRolePerson.attr("position") == null) ? "" : $$_nRolePerson.attr("position"));
        arrRolePerson.push(($$_nRolePerson.attr("title") == null) ? "" : $$_nRolePerson.attr("title"));
        arrRolePerson.push(($$_nRolePerson.attr("level") == null) ? "" : $$_nRolePerson.attr("level"));
        arrRolePerson.push(($$_nRolePerson.attr("oucode") == null) ? "" : $$_nRolePerson.attr("oucode"));
        arrRolePerson.push(($$_nRolePerson.attr("ouname") == null) ? "" : $$_nRolePerson.attr("ouname"));
        arrRolePerson.push(($$_nRolePerson.attr("sipaddress") == null) ? "" : $$_nRolePerson.attr("sipaddress"));
    }

    var arrRolePerson_person = [];
    if ($$_nRolePerson_Person != null) {
    	arrRolePerson_person.push($$_nRolePerson_Person[0].nodeName);
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("code") == null) ? "" : $$_nRolePerson_Person.attr("code"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("name") == null) ? "" : $$_nRolePerson_Person.attr("name"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("position") == null) ? "" : $$_nRolePerson_Person.attr("position"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("title") == null) ? "" : $$_nRolePerson_Person.attr("title"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("level") == null) ? "" : $$_nRolePerson_Person.attr("level"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("oucode") == null) ? "" : $$_nRolePerson_Person.attr("oucode"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("ouname") == null) ? "" : $$_nRolePerson_Person.attr("ouname"));
    	arrRolePerson_person.push(($$_nRolePerson_Person.attr("sipaddress") == null) ? "" : $$_nRolePerson_Person.attr("sipaddress"));
    }

    var arrRolePersonTaskinfo = [];
    if ($$_nRolePersonTaskinfo != null) {
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("status") == null) ? "" : $$_nRolePersonTaskinfo.attr("status"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("result") == null) ? "" : $$_nRolePersonTaskinfo.attr("result"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("kind") == null) ? "" : $$_nRolePersonTaskinfo.attr("kind"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("datereceived") == null) ? "" : $$_nRolePersonTaskinfo.attr("datereceived"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("datecompleted") == null) ? "" : $$_nRolePersonTaskinfo.attr("datecompleted"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("rejectee") == null) ? "" : $$_nRolePersonTaskinfo.attr("rejectee"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("wiidrejectedto") == null) ? "" : $$_nRolePersonTaskinfo.attr("wiidrejectedto"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("daterejectedto") == null) ? "" : $$_nRolePersonTaskinfo.attr("daterejectedto"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("wiid") == null) ? "" : $$_nRolePersonTaskinfo.attr("wiid"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("visible") == null) ? "" : $$_nRolePersonTaskinfo.attr("visible"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("customattribute1") == null) ? "" : $$_nRolePersonTaskinfo.attr("customattribute1"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("customattribute2") == null) ? "" : $$_nRolePersonTaskinfo.attr("customattribute2"));
        arrRolePersonTaskinfo.push(($$_nRolePersonTaskinfo.attr("mobileType") == null) ? "" : $$_nRolePersonTaskinfo.attr("mobileType"));   //모바일 결재 여부
    }

    var arrRolePersonTaskinfoComment = [];
    if ($$_nRolePersonTaskinfoComment != null) {
        arrRolePersonTaskinfoComment.push(($$_nRolePersonTaskinfoComment.attr("relatedresult") == null) ? "" : $$_nRolePersonTaskinfoComment.attr("relatedresult"));
        arrRolePersonTaskinfoComment.push(($$_nRolePersonTaskinfoComment.attr("datecommented") == null) ? "" : $$_nRolePersonTaskinfoComment.attr("datecommented"));
        arrRolePersonTaskinfoComment.push(($$_nRolePersonTaskinfoComment.text() == null) ? "" : $$_nRolePersonTaskinfoComment.text());
    }

    var arrRolePersonTaskinfoCommentLast = [];
    if ($$_nRolePersonTaskinfoCommentLast != null) {
        arrRolePersonTaskinfoCommentLast.push(($$_nRolePersonTaskinfoCommentLast.text() == null) ? "" : $$_nRolePersonTaskinfoCommentLast.text());
    }

    var arrRolePersonTaskinfoCommentFileInfo = [];
    if ($$_nRolePersonTaskinfoCommentFileInfo != null) {
    	arrRolePersonTaskinfoCommentFileInfo.push(($$_nRolePersonTaskinfoCommentFileInfo.json() == null) ? "" : JSON.stringify($$_nRolePersonTaskinfoCommentFileInfo.json()));
    }

	// nRolePerson_Person 조건 추가 (role - 부서장 결재단계 - taskinfo 이후에 person이 다시 있어서 이부분 유지)
    inserthtmlrow("tblApvLine", index, viewtype, displayonly, taskType, arrDivision, arrDivisionTaskinfo, arrStep, arrStepTaskinfo, arrOu, arrOuTaskinfo, arrRolePerson, arrRolePersonTaskinfo, arrRolePersonTaskinfoComment, arrRolePersonTaskinfoCommentLast, arrRolePersonTaskinfoCommentFileInfo, description, arrRolePerson_person, displayBypass);
}

//*결재 목록 ROW 추가
// nRolePerson_Person 조건 추가 (role - 부서장 결재단계 - taskinfo 이후에 person이 다시 있어서 이부분 유지)
// 파라미터 displayBypass 추가, 표시해야하는 후열과 표시되지 말아야하는 후열(대결로 인한 자동후열)을 구분하기 위해 추가.
function inserthtmlrow(objTB, index, viewtype, displayonly, taskType, arrDivision, arrDivisionTaskinfo, arrStep, arrStepTaskinfo, arrOu, arrOuTaskinfo, arrRolePerson, arrRolePersonTaskinfo, arrRolePersonTaskinfoComment, arrRolePersonTaskinfoCommentLast, arrRolePersonTaskinfoCommentFileInfo, description, arrRolePerson_person, displayBypass) {

    var oTable = document.getElementById(objTB);
    var oTBody;
    if ($(oTable).find('tbody').length <= 0) {
        oTBody = document.createElement("TBODY");
    } else {
        oTBody = oTable.lastChild;
    }
    var tmpIndex = "";
    var nrowNo = 0;
    var nTBodyRow = oTBody.childNodes;
    var bReceiveInactive = true;
    if (viewtype == "create" || viewtype == "change") {
        if (index == 1) { nrowNo = nTBodyRow.length; } //발신 division 맨아래 그리기
        else {
            for (var j = 0; j < nTBodyRow.length; j++) {
                if ( $(nTBodyRow[j]).children().eq(dp_apv_no).text() == "2" && $(nTBodyRow[j].childNodes[division_taskinfo_status]).text() == "inactive") { //수신division 이 있을경우 발신부서 결재 수신 division 아래 그리기
                    if (arrStep != null && arrStep[0] != null) {
                        if (arrDivision[0] != "receive") {
                            nrowNo = nTBodyRow.length - (nTBodyRow.length - (j + 1));
                            tmpIndex = $(oTBody.rows[nrowNo]).children().eq(dp_apv_no).text();
                        }
                    }
                } else if ($(nTBodyRow[j].childNodes[division_taskinfo_status]).text() == "pending" && $(nTBodyRow[j].childNodes[division_taskinfo_kind]).text() == "receive") {
                    if (arrStep != null && arrStep[0] != null && arrRolePersonTaskinfo != null) {
                        if (arrRolePersonTaskinfo[0] == "inactive" && m_sSelectedDivisionType == "receive" && m_sSelectedRouteType != "receive") {
                            if (bReceiveInactive) {
                                nrowNo = j;
                                tmpIndex = $(oTBody.rows[nrowNo]).children().eq(dp_apv_no).text();
                                bReceiveInactive = false;
                                arrDivisionTaskinfo.push("pending");
                                arrDivisionTaskinfo.push("pending");
                                arrDivisionTaskinfo.push("receive");
                            }
                        } else if (arrRolePersonTaskinfo[0] == "inactive" && m_sSelectedRouteType != "receive" && $(nTBodyRow[j].childNodes[division_taskinfo_status]).text() == "pending" && $(nTBodyRow[j].childNodes[division_taskinfo_status]).text() == "pending") {
                            if (bReceiveInactive) {
                                nrowNo = j;
                                tmpIndex = $(oTBody.rows[nrowNo].firstChild).text();
                                bReceiveInactive = false;
                            }
                        }
                    } else if (arrStep != null && arrStep[0] != null && arrRolePersonTaskinfo == null && arrOuTaskinfo != null && taskType.toLowerCase() == "ou") {  //부서협조, 합의 선택시 엉뚱한 index 찾음 오류 수정
                        if (arrOuTaskinfo[0] == "inactive" && m_sSelectedDivisionType == "receive" && (m_sSelectedRouteType == "assist" || m_sSelectedRouteType == "consult")) {
                            if (bReceiveInactive) {
                                nrowNo = j;
                                tmpIndex = $(oTBody.rows[nrowNo].firstChild).text();
                                bReceiveInactive = false;
                                arrDivisionTaskinfo.push("pending");
                                arrDivisionTaskinfo.push("pending");
                                arrDivisionTaskinfo.push("receive");
                            }
                        }
                    }
                }
            }
        }

        /*if (arrStep[2] == "parallel"
            && nTBodyRow[0] != null
            && $(nTBodyRow[0].childNodes[step_unittype]).text() == "person"            
            && $(nTBodyRow[0].childNodes[step_allottype]).text() == "parallel") //&& $(nTBodyRow[0].childNodes[step_routetype]).text() == "approve"
        {
            tmpIndex = $(nTBodyRow[0].childNodes[dp_apv_no]).text().replace("-",".");
        }*/
        
        if (arrStep[2] == "parallel"	
            && nTBodyRow[0] != null	
            && $(nTBodyRow[0].childNodes[step_unittype]).text() == "person" && arrStep[0] == "person"           	
            && $(nTBodyRow[0].childNodes[step_allottype]).text() == "parallel"	
        	&& $(nTBodyRow[0].childNodes[step_routetype]).text() == arrStep[1]) //&& $(nTBodyRow[0].childNodes[step_routetype]).text() == "approve"
        {	
            tmpIndex = $(nTBodyRow[0].childNodes[dp_apv_no]).text().replace("-",".");	
        }	


    }

    if (oTBody.firstChild != null) {
        if (tmpIndex == "") tmpIndex = $(oTBody.firstChild).children().eq(dp_apv_no).text();//$(oTBody.firstChild.firstChild).text();
        if (tmpIndex.length == 1) {
            tmpIndex = ".01";
        } else {
            var tmpIndexDot = tmpIndex.substring(0, tmpIndex.lastIndexOf("-") + 1).split("-").join(".");
            tmpIndex = tmpIndex.substring(tmpIndex.lastIndexOf("-") + 1);
            tmpIndex = dblDigit(Number(tmpIndex) + 1);
            tmpIndex = tmpIndexDot + tmpIndex;
        }
    }

    oTable.appendChild(oTBody);
    var oRow = oTBody.insertRow(nrowNo);
    var oCell_dp_apv_checkbox = oRow.insertCell(dp_apv_checkbox); //체크박스 추가
    var oCell_dp_apv_no = oRow.insertCell(dp_apv_no);
    var oCell_dp_apv_username = oRow.insertCell(dp_apv_username);
    var oCell_dp_apv_state = oRow.insertCell(dp_apv_state);
    var oCell_dp_apv_kind = oRow.insertCell(dp_apv_kind);
    var oCell_dp_apv_approvdate = oRow.insertCell(dp_apv_approvdate);
    var oCell_key_displayonly = oRow.insertCell(key_displayonly);
    var oCell_key_readonly = oRow.insertCell(key_readonly);
    var oCell_key_description = oRow.insertCell(key_description);
    var oCell_division_seq = oRow.insertCell(division_seq);
    var oCell_division_divisiontype = oRow.insertCell(division_divisiontype);
    var oCell_division_name = oRow.insertCell(division_name);
    var oCell_division_oucode = oRow.insertCell(division_oucode);
    var oCell_division_ouname = oRow.insertCell(division_ouname);
    var oCell_division_taskinfo_status = oRow.insertCell(division_taskinfo_status);
    var oCell_division_taskinfo_result = oRow.insertCell(division_taskinfo_result);
    var oCell_division_taskinfo_kind = oRow.insertCell(division_taskinfo_kind);
    var oCell_division_taskinfo_datereceived = oRow.insertCell(division_taskinfo_datereceived);
    var oCell_division_taskinfo_datecompleted = oRow.insertCell(division_taskinfo_datecompleted);
    var oCell_step_seq = oRow.insertCell(step_seq);
    var oCell_step_unittype = oRow.insertCell(step_unittype);
    var oCell_step_routetype = oRow.insertCell(step_routetype);
    var oCell_step_allottype = oRow.insertCell(step_allottype);
    var oCell_step_name = oRow.insertCell(step_name);
    var oCell_step_taskinfo_status = oRow.insertCell(step_taskinfo_status);
    var oCell_step_taskinfo_result = oRow.insertCell(step_taskinfo_result);
    var oCell_step_taskinfo_kind = oRow.insertCell(step_taskinfo_kind);
    var oCell_step_taskinfo_datereceived = oRow.insertCell(step_taskinfo_datereceived);
    var oCell_step_taskinfo_datecompleted = oRow.insertCell(step_taskinfo_datecompleted);
    var oCell_ou_seq = oRow.insertCell(ou_seq);
    var oCell_ou_code = oRow.insertCell(ou_code);
    var oCell_ou_name = oRow.insertCell(ou_name);
    var oCell_ou_taskinfo_status = oRow.insertCell(ou_taskinfo_status);
    var oCell_ou_taskinfo_result = oRow.insertCell(ou_taskinfo_result);
    var oCell_ou_taskinfo_kind = oRow.insertCell(ou_taskinfo_kind);
    var oCell_ou_taskinfo_datereceived = oRow.insertCell(ou_taskinfo_datereceived);
    var oCell_ou_taskinfo_datecompleted = oRow.insertCell(ou_taskinfo_datecompleted);
    var oCell_ou_taskinfo_piid = oRow.insertCell(ou_taskinfo_piid);
    var oCell_roleperson_seq = oRow.insertCell(roleperson_seq);
    var oCell_roleperson_nodetype = oRow.insertCell(roleperson_nodetype);
    var oCell_roleperson_code = oRow.insertCell(roleperson_code);
    var oCell_roleperson_name = oRow.insertCell(roleperson_name);
    var oCell_roleperson_position = oRow.insertCell(roleperson_position);
    var oCell_roleperson_title = oRow.insertCell(roleperson_title);
    var oCell_roleperson_level = oRow.insertCell(roleperson_level);
    var oCell_roleperson_oucode = oRow.insertCell(roleperson_oucode);
    var oCell_roleperson_ouname = oRow.insertCell(roleperson_ouname);
    var oCell_roleperson_sipaddress = oRow.insertCell(roleperson_sipaddress);
    var oCell_roleperson_taskinfo_status = oRow.insertCell(roleperson_taskinfo_status);
    var oCell_roleperson_taskinfo_result = oRow.insertCell(roleperson_taskinfo_result);
    var oCell_roleperson_taskinfo_kind = oRow.insertCell(roleperson_taskinfo_kind);
    var oCell_roleperson_taskinfo_datereceived = oRow.insertCell(roleperson_taskinfo_datereceived);
    var oCell_roleperson_taskinfo_datecompleted = oRow.insertCell(roleperson_taskinfo_datecompleted);
    var oCell_roleperson_taskinfo_rejectee = oRow.insertCell(roleperson_taskinfo_rejectee);
    var oCell_roleperson_taskinfo_wiidrejectedto = oRow.insertCell(roleperson_taskinfo_wiidrejectedto);
    var oCell_roleperson_taskinfo_daterejectedto = oRow.insertCell(roleperson_taskinfo_daterejectedto);
    var oCell_roleperson_taskinfo_wiid = oRow.insertCell(roleperson_taskinfo_wiid);
    var oCell_roleperson_taskinfo_visible = oRow.insertCell(roleperson_taskinfo_visible);
    var oCell_roleperson_taskinfo_customattribute1 = oRow.insertCell(roleperson_taskinfo_customattribute1);
    var oCell_roleperson_taskinfo_customattribute2 = oRow.insertCell(roleperson_taskinfo_customattribute2);
    var oCell_roleperson_taskinfo_comment_relatedresult = oRow.insertCell(roleperson_taskinfo_comment_relatedresult);
    var oCell_roleperson_taskinfo_comment_datecommented = oRow.insertCell(roleperson_taskinfo_comment_datecommented);
    var oCell_roleperson_taskinfo_comment = oRow.insertCell(roleperson_taskinfo_comment);
    var oCell_roleperson_taskinfo_commentLast = oRow.insertCell(roleperson_taskinfo_commentLast);
    var oCell_roleperson_person_code = oRow.insertCell(roleperson_person_code);
    var oCell_roleperson_person_name = oRow.insertCell(roleperson_person_name);
    var oCell_roleperson_person_position = oRow.insertCell(roleperson_person_position);
    var oCell_roleperson_person_title = oRow.insertCell(roleperson_person_title);
    var oCell_roleperson_person_level = oRow.insertCell(roleperson_person_level);
    var oCell_roleperson_person_oucode = oRow.insertCell(roleperson_person_oucode);
    var oCell_roleperson_person_ouname = oRow.insertCell(roleperson_person_ouname);
    var oCell_roleperson_taskinfo_mobilegubun = oRow.insertCell(roleperson_taskinfo_mobilegubun);   //모바일 결재 여부
    var oCell_roleperson_person_nodetype = oRow.insertCell(roleperson_person_nodetype);			// role - 부서장 결재단계 - taskinfo 이후에 person 유지값 중 nodename(role,person...) , sipaddress가 없어서 추가
    var oCell_roleperson_person_sipaddress = oRow.insertCell(roleperson_person_sipaddress);		// role - 부서장 결재단계 - taskinfo 이후에 person 유지값 중 nodename(role,person...) , sipaddress가 없어서 추가
    var oCell_dp_apv_delete_button = oRow.insertCell(dp_apv_delete_button);		// 결재선 별 삭제 추가
    var oCell_roleperson_taskinfo_comment_fileinfo = oRow.insertCell(roleperson_taskinfo_comment_fileinfo); //의견첨부 정보
    var oCell_step_ruleapvclass = oRow.insertCell(step_ruleapvclass);				// 전결규정에서 설정한 유형 값
    var oCell_step_ruleapvclassatt01 = oRow.insertCell(step_ruleapvclassatt01);		// 전결규정에서 설정한 유형 추가속성

    oRow.style.height = "25px";
    oRow.style.width = "430px";
    
    oCell_dp_apv_checkbox.noWrap = true;
    oCell_dp_apv_no.noWrap = true;
    oCell_dp_apv_username.style.textAlign = "left";
    oCell_dp_apv_state.noWrap = true;
    oCell_dp_apv_kind.noWrap = true;
    if (viewtype == "create") {
        oCell_dp_apv_approvdate.style.display = "none";
    } else {
    	oCell_dp_apv_approvdate.noWrap = true;
    }
    oCell_key_displayonly.style.display = "none";
    oCell_key_readonly.style.display = "none";
    oCell_key_description.style.display = "none";
    oCell_division_seq.style.display = "none";
    oCell_division_divisiontype.style.display = "none";
    oCell_division_name.style.display = "none";
    oCell_division_oucode.style.display = "none";
    oCell_division_ouname.style.display = "none";
    oCell_division_taskinfo_status.style.display = "none";
    oCell_division_taskinfo_result.style.display = "none";
    oCell_division_taskinfo_kind.style.display = "none";
    oCell_division_taskinfo_datereceived.style.display = "none";
    oCell_division_taskinfo_datecompleted.style.display = "none";
    oCell_step_seq.style.display = "none";
    oCell_step_unittype.style.display = "none";
    oCell_step_routetype.style.display = "none";
    oCell_step_allottype.style.display = "none";
    oCell_step_name.style.display = "none";
    oCell_step_taskinfo_status.style.display = "none";
    oCell_step_taskinfo_result.style.display = "none";
    oCell_step_taskinfo_kind.style.display = "none";
    oCell_step_taskinfo_datereceived.style.display = "none";
    oCell_step_taskinfo_datecompleted.style.display = "none";
    oCell_ou_seq.style.display = "none";
    oCell_ou_code.style.display = "none";
    oCell_ou_name.style.display = "none";
    oCell_ou_taskinfo_status.style.display = "none";
    oCell_ou_taskinfo_result.style.display = "none";
    oCell_ou_taskinfo_kind.style.display = "none";
    oCell_ou_taskinfo_datereceived.style.display = "none";
    oCell_ou_taskinfo_datecompleted.style.display = "none";
    oCell_ou_taskinfo_piid.style.display = "none";
    oCell_roleperson_seq.style.display = "none";
    oCell_roleperson_nodetype.style.display = "none";
    oCell_roleperson_code.style.display = "none";
    oCell_roleperson_name.style.display = "none";
    oCell_roleperson_position.style.display = "none";
    oCell_roleperson_title.style.display = "none";
    oCell_roleperson_level.style.display = "none";
    oCell_roleperson_oucode.style.display = "none";
    oCell_roleperson_ouname.style.display = "none";
    oCell_roleperson_sipaddress.style.display = "none";
    oCell_roleperson_taskinfo_status.style.display = "none";
    oCell_roleperson_taskinfo_result.style.display = "none";
    oCell_roleperson_taskinfo_kind.style.display = "none";
    oCell_roleperson_taskinfo_datereceived.style.display = "none";
    oCell_roleperson_taskinfo_datecompleted.style.display = "none";
    oCell_roleperson_taskinfo_rejectee.style.display = "none";
    oCell_roleperson_taskinfo_wiidrejectedto.style.display = "none";
    oCell_roleperson_taskinfo_daterejectedto.style.display = "none";
    oCell_roleperson_taskinfo_wiid.style.display = "none";
    oCell_roleperson_taskinfo_visible.style.display = "none";
    oCell_roleperson_taskinfo_customattribute1.style.display = "none";
    oCell_roleperson_taskinfo_customattribute2.style.display = "none";
    oCell_roleperson_taskinfo_comment_relatedresult.style.display = "none";
    oCell_roleperson_taskinfo_comment_datecommented.style.display = "none";
    oCell_roleperson_taskinfo_comment.style.display = "none";
    oCell_roleperson_taskinfo_commentLast.style.display = "none";
    oCell_roleperson_taskinfo_comment_fileinfo.style.display = "none";
    oCell_roleperson_person_code.style.display = "none";
    oCell_roleperson_person_name.style.display = "none";
    oCell_roleperson_person_position.style.display = "none";
    oCell_roleperson_person_title.style.display = "none";
    oCell_roleperson_person_level.style.display = "none";
    oCell_roleperson_person_oucode.style.display = "none";
    oCell_roleperson_person_ouname.style.display = "none";
    oCell_roleperson_taskinfo_mobilegubun.style.display = "none";   //모바일 결재 여부
    oCell_roleperson_person_nodetype.style.display = "none";		//role - 부서장 결재단계 - taskinfo 이후에 person 유지값 중 nodename(role,person...) , sipaddress가 없어서 추가
    oCell_roleperson_person_sipaddress.style.display = "none";		//role - 부서장 결재단계 - taskinfo 이후에 person 유지값 중 nodename(role,person...) , sipaddress가 없어서 추가
    oCell_step_ruleapvclass.style.display = "none";
    oCell_step_ruleapvclassatt01.style.display = "none";
    
    //oCell_dp_apv_checkbox.innerHTML="<input type='checkbox'/>";
    oCell_dp_apv_kind.innerHTML = "";
    oCell_dp_apv_approvdate.innerHTML = "";
    oCell_key_displayonly.innerHTML = displayonly;
    oCell_key_readonly.innerHTML = "False";
    oCell_key_description.innerHTML = "";
    oCell_division_seq.innerHTML = "";
    
    if (arrDivision != null && arrDivision[0] != null) {
        oCell_division_divisiontype.innerHTML = (arrDivision[0] == null) ? "" : arrDivision[0];
        oCell_division_name.innerHTML = (arrDivision[1] == null) ? "" : arrDivision[1];
        oCell_division_oucode.innerHTML = (arrDivision[2] == null) ? "" : arrDivision[2];
        oCell_division_ouname.innerHTML = (arrDivision[3] == null) ? "" : arrDivision[3];
        if (taskType == "Division") {
            oCell_dp_apv_username.innerHTML = CFN_GetDicInfo($(oCell_division_name).text(),langCode) + "&#160;";
            oCell_key_readonly.innerHTML = "True";
        }

    } else {
        oCell_division_divisiontype.innerHTML = "";
        oCell_division_name.innerHTML = "";
        oCell_division_oucode.innerHTML = "";
        oCell_division_ouname.innerHTML = "";
    }
    if (arrDivisionTaskinfo != null && arrDivisionTaskinfo[0] != null) {
        oCell_division_taskinfo_status.innerHTML = (arrDivisionTaskinfo[0] == null) ? "" : arrDivisionTaskinfo[0];
        oCell_division_taskinfo_result.innerHTML = (arrDivisionTaskinfo[1] == null) ? "" : arrDivisionTaskinfo[1];
        oCell_division_taskinfo_kind.innerHTML = (arrDivisionTaskinfo[2] == null) ? "" : arrDivisionTaskinfo[2];
        oCell_division_taskinfo_datereceived.innerHTML = (arrDivisionTaskinfo[3] == null) ? "" : arrDivisionTaskinfo[3];
        oCell_division_taskinfo_datecompleted.innerHTML = (arrDivisionTaskinfo[4] == null) ? "" : arrDivisionTaskinfo[4];
    } else {
        oCell_division_taskinfo_status.innerHTML = "";
        oCell_division_taskinfo_result.innerHTML = "";
        oCell_division_taskinfo_kind.innerHTML = "";
        oCell_division_taskinfo_datereceived.innerHTML = "";
        oCell_division_taskinfo_datecompleted.innerHTML = "";
    }
    oCell_step_seq.innerHTML = "";
    if (arrStep != null && arrStep[0] != null) {
        oCell_step_unittype.innerHTML = (arrStep[0] == null) ? "" : arrStep[0];
        oCell_step_routetype.innerHTML = (arrStep[1] == null) ? "" : arrStep[1];
        oCell_step_allottype.innerHTML = (arrStep[2] == null) ? "" : arrStep[2];
        oCell_step_name.innerHTML = (arrStep[3] == null) ? "" : arrStep[3];
        oCell_step_ruleapvclass.innerHTML = (arrStep[4] == null) ? "" : arrStep[4];
        oCell_step_ruleapvclassatt01.innerHTML = (arrStep[5] == null) ? "" : arrStep[5];
    } else {
        oCell_step_unittype.innerHTML = "";
        oCell_step_routetype.innerHTML = "";
        oCell_step_allottype.innerHTML = "";
        oCell_step_name.innerHTML = "";
        oCell_step_ruleapvclass.innerHTML = "";
        oCell_step_ruleapvclassatt01.innerHTML = "";
    }
    
    if (arrStepTaskinfo != null && arrStepTaskinfo[0] != null) {
        oCell_step_taskinfo_status.innerHTML = (arrStepTaskinfo[0] == null) ? "" : arrStepTaskinfo[0];
        oCell_step_taskinfo_result.innerHTML = (arrStepTaskinfo[1] == null) ? "" : arrStepTaskinfo[1];
        oCell_step_taskinfo_kind.innerHTML = (arrStepTaskinfo[2] == null) ? "" : arrStepTaskinfo[2];
        oCell_step_taskinfo_datereceived.innerHTML = (arrStepTaskinfo[3] == null) ? "" : arrStepTaskinfo[3];
        oCell_step_taskinfo_datecompleted.innerHTML = (arrStepTaskinfo[4] == null) ? "" : arrStepTaskinfo[4];
    } else {
        oCell_step_taskinfo_status.innerHTML = "";
        oCell_step_taskinfo_result.innerHTML = "";
        oCell_step_taskinfo_kind.innerHTML = "";
        oCell_step_taskinfo_datereceived.innerHTML = "";
        oCell_step_taskinfo_datecompleted.innerHTML = "";
    }
    oCell_ou_seq.innerHTML = "";
    if (arrOu != null && arrOu[0] != null) {
        oCell_ou_code.innerHTML = (arrOu[0] == null) ? "" : arrOu[0];
        oCell_ou_name.innerHTML = (arrOu[1] == null) ? "" : arrOu[1];
    } else {
        oCell_ou_code.innerHTML = "";
        oCell_ou_name.innerHTML = "";
    }
    if (arrOuTaskinfo != null && arrOuTaskinfo[0] != null) {
        oCell_ou_taskinfo_status.innerHTML = (arrOuTaskinfo[0] == null) ? "" : arrOuTaskinfo[0];
        oCell_ou_taskinfo_result.innerHTML = (arrOuTaskinfo[1] == null) ? "" : arrOuTaskinfo[1];
        oCell_ou_taskinfo_kind.innerHTML = (arrOuTaskinfo[2] == null) ? "" : arrOuTaskinfo[2];
        oCell_ou_taskinfo_datereceived.innerHTML = (arrOuTaskinfo[3] == null) ? "" : arrOuTaskinfo[3];
        oCell_ou_taskinfo_datecompleted.innerHTML = (arrOuTaskinfo[4] == null) ? "" : arrOuTaskinfo[4];
        oCell_ou_taskinfo_piid.innerHTML = (arrOuTaskinfo[5] == null) ? "" : arrOuTaskinfo[5];
        if (taskType == "Ou") {
            oCell_dp_apv_username.innerHTML = CFN_GetDicInfo($(oCell_ou_name).text(),langCode) + "&#160;";
            if ($(oCell_ou_taskinfo_datereceived).text() != "") oCell_key_readonly.innerHTML = "True";
            if ($(oCell_ou_taskinfo_datecompleted).text() != "") oCell_dp_apv_approvdate.innerHTML = $(oCell_ou_taskinfo_datecompleted).text().substring(5, $(oCell_ou_taskinfo_datecompleted).text().length - 3);
        }
    } else {
        oCell_ou_taskinfo_status.innerHTML = "";
        oCell_ou_taskinfo_result.innerHTML = "";
        oCell_ou_taskinfo_kind.innerHTML = "";
        oCell_ou_taskinfo_datereceived.innerHTML = "";
        oCell_ou_taskinfo_datecompleted.innerHTML = "";
        oCell_ou_taskinfo_piid.innerHTML = "";
    }
    oCell_roleperson_seq.innerHTML = "";
    if (arrRolePerson != null && arrRolePerson[0] != null) {
        oCell_roleperson_nodetype.innerHTML = arrRolePerson[0];
        oCell_roleperson_code.innerHTML = (arrRolePerson[1] == null) ? "" : arrRolePerson[1];
        oCell_roleperson_name.innerHTML = (arrRolePerson[2] == null) ? "" : arrRolePerson[2];
        oCell_roleperson_position.innerHTML = (arrRolePerson[3] == null) ? "" : arrRolePerson[3];
        oCell_roleperson_title.innerHTML = (arrRolePerson[4] == null) ? "" : arrRolePerson[4];
        oCell_roleperson_level.innerHTML = (arrRolePerson[5] == null) ? "" : arrRolePerson[5];
        oCell_roleperson_oucode.innerHTML = (arrRolePerson[6] == null) ? "" : arrRolePerson[6];
        oCell_roleperson_ouname.innerHTML = (arrRolePerson[7] == null) ? "" : arrRolePerson[7];
        oCell_roleperson_sipaddress.innerHTML = (arrRolePerson[8] == null) ? "" : arrRolePerson[8];
        oCell_dp_apv_username.innerHTML = CFN_GetDicInfo($(oCell_roleperson_name).text(),langCode) +"<br>"+ "(" + splitName($(oCell_roleperson_position).text()) + "," + CFN_GetDicInfo($(oCell_roleperson_ouname).text(),langCode) + ")&#160;";
    } else {
        oCell_roleperson_nodetype.innerHTML = "";
        oCell_roleperson_code.innerHTML = "";
        oCell_roleperson_name.innerHTML = "";
        oCell_roleperson_position.innerHTML = "";
        oCell_roleperson_title.innerHTML = "";
        oCell_roleperson_level.innerHTML = "";
        oCell_roleperson_oucode.innerHTML = "";
        oCell_roleperson_ouname.innerHTML = "";
        oCell_roleperson_sipaddress.innerHTML = "";
    }
    if (arrRolePersonTaskinfo != null && arrRolePersonTaskinfo[0] != null) {
        oCell_roleperson_taskinfo_status.innerHTML = (arrRolePersonTaskinfo[0] == null) ? "" : arrRolePersonTaskinfo[0];
        oCell_roleperson_taskinfo_result.innerHTML = (arrRolePersonTaskinfo[1] == null) ? "" : arrRolePersonTaskinfo[1];
        oCell_roleperson_taskinfo_kind.innerHTML = (arrRolePersonTaskinfo[2] == null) ? "" : arrRolePersonTaskinfo[2];
        oCell_roleperson_taskinfo_datereceived.innerHTML = (arrRolePersonTaskinfo[3] == null) ? "" : arrRolePersonTaskinfo[3];
        oCell_roleperson_taskinfo_datecompleted.innerHTML = (arrRolePersonTaskinfo[4] == null) ? "" : arrRolePersonTaskinfo[4];
        oCell_roleperson_taskinfo_rejectee.innerHTML = (arrRolePersonTaskinfo[5] == null) ? "" : arrRolePersonTaskinfo[5];
        oCell_roleperson_taskinfo_wiidrejectedto.innerHTML = (arrRolePersonTaskinfo[6] == null) ? "" : arrRolePersonTaskinfo[6];
        oCell_roleperson_taskinfo_daterejectedto.innerHTML = (arrRolePersonTaskinfo[7] == null) ? "" : arrRolePersonTaskinfo[7];
        oCell_roleperson_taskinfo_wiid.innerHTML = (arrRolePersonTaskinfo[8] == null) ? "" : arrRolePersonTaskinfo[8];
        oCell_roleperson_taskinfo_visible.innerHTML = (arrRolePersonTaskinfo[9] == null) ? "" : arrRolePersonTaskinfo[9];
        if ($(oCell_roleperson_taskinfo_visible).text() == "n" ) {
            oRow.style.display = "none";
            oCell_key_readonly.innerHTML = "True";
        }
        if ($(oRow).next('tr').length > 0) {
            //대결일 경우 display:none 처리
            if ($(oCell_roleperson_taskinfo_kind).text() == "bypass" && displayBypass == false) {
                oRow.style.display = "none";
                oCell_key_readonly.innerHTML = "True";
            }
        }
        oCell_roleperson_taskinfo_customattribute1.innerHTML = (arrRolePersonTaskinfo[10] == null) ? "" : arrRolePersonTaskinfo[10];
        oCell_roleperson_taskinfo_customattribute2.innerHTML = (arrRolePersonTaskinfo[11] == null) ? "" : arrRolePersonTaskinfo[11];
        oCell_roleperson_taskinfo_mobilegubun.innerHTML = (arrRolePersonTaskinfo[12] == null) ? "" : arrRolePersonTaskinfo[12];   //모바일 결재 여부
        oCell_dp_apv_state.innerHTML = convertSignResult(String($(oCell_roleperson_taskinfo_result).text()), String($(oCell_roleperson_taskinfo_kind).text()), String($(oCell_step_name).text())) + "&#160;";
        if (taskType == "RolePerson") {
            if ($(oCell_roleperson_taskinfo_kind).text() == "charge") oCell_key_readonly.innerHTML = "True";
            if ($(oCell_roleperson_taskinfo_datereceived).text() != "") oCell_key_readonly.innerHTML = "True";
            if ($(oCell_roleperson_taskinfo_datecompleted).text() != "") oCell_dp_apv_approvdate.innerHTML = $(oCell_roleperson_taskinfo_datecompleted).text().substring(5, $(oCell_roleperson_taskinfo_datecompleted).text().length - 3);
        }
    } else {
        oCell_roleperson_taskinfo_status.innerHTML = "";
        oCell_roleperson_taskinfo_result.innerHTML = "";
        oCell_roleperson_taskinfo_kind.innerHTML = "";
        oCell_roleperson_taskinfo_datereceived.innerHTML = "";
        oCell_roleperson_taskinfo_datecompleted.innerHTML = "";
        oCell_roleperson_taskinfo_rejectee.innerHTML = "";
        oCell_roleperson_taskinfo_wiidrejectedto.innerHTML = "";
        oCell_roleperson_taskinfo_daterejectedto.innerHTML = "";
        oCell_roleperson_taskinfo_wiid.innerHTML = "";
        oCell_roleperson_taskinfo_visible.innerHTML = "";
        oCell_roleperson_taskinfo_customattribute1.innerHTML = "";
        oCell_roleperson_taskinfo_customattribute2.innerHTML = "";
        oCell_roleperson_taskinfo_mobilegubun.innerHTML = "";   //모바일 결재 여부
    }
    if (arrRolePersonTaskinfoComment != null && arrRolePersonTaskinfoComment[0] != null) {
        oCell_roleperson_taskinfo_comment_relatedresult.innerHTML = (arrRolePersonTaskinfoComment[0] == null) ? "" : arrRolePersonTaskinfoComment[0];
        oCell_roleperson_taskinfo_comment_datecommented.innerHTML = (arrRolePersonTaskinfoComment[1] == null) ? "" : arrRolePersonTaskinfoComment[1];
        oCell_roleperson_taskinfo_comment.innerHTML = (arrRolePersonTaskinfoComment[2] == null) ? "" : arrRolePersonTaskinfoComment[2];
    } else {
        oCell_roleperson_taskinfo_comment_relatedresult.innerHTML = "";
        oCell_roleperson_taskinfo_comment_datecommented.innerHTML = "";
        oCell_roleperson_taskinfo_comment.innerHTML = "";
    }
    if (arrRolePersonTaskinfoCommentLast != null && arrRolePersonTaskinfoCommentLast[0] != null) {
        oCell_roleperson_taskinfo_commentLast.innerHTML = (arrRolePersonTaskinfoCommentLast[0] == null) ? "" : arrRolePersonTaskinfoCommentLast[0];
    } else {
        oCell_roleperson_taskinfo_commentLast.innerHTML = "";
    }
    if (arrRolePersonTaskinfoCommentFileInfo != null && arrRolePersonTaskinfoCommentFileInfo[0] != null) {
    	oCell_roleperson_taskinfo_comment_fileinfo.innerHTML = (arrRolePersonTaskinfoCommentFileInfo[0] == null) ? "" : arrRolePersonTaskinfoCommentFileInfo[0];
    } else {
    	oCell_roleperson_taskinfo_comment_fileinfo.innerHTML = "";
    }

	//nRolePerson_Person 조건 추가 (role - 부서장 결재단계 - taskinfo 이후에 person이 다시 있어서 이부분 유지)
    if (arrRolePerson_person != null && arrRolePerson_person[0] != null) {
    	oCell_roleperson_person_nodetype.innerHTML = arrRolePerson_person[0];
    	oCell_roleperson_person_code.innerHTML = (arrRolePerson_person[1] == null) ? "" : arrRolePerson_person[1];
    	oCell_roleperson_person_name.innerHTML = (arrRolePerson_person[2] == null) ? "" : arrRolePerson_person[2];
    	oCell_roleperson_person_position.innerHTML = (arrRolePerson_person[3] == null) ? "" : arrRolePerson_person[3];
    	oCell_roleperson_person_title.innerHTML = (arrRolePerson_person[4] == null) ? "" : arrRolePerson_person[4];
    	oCell_roleperson_person_level.innerHTML = (arrRolePerson_person[5] == null) ? "" : arrRolePerson_person[5];
    	oCell_roleperson_person_oucode.innerHTML = (arrRolePerson_person[6] == null) ? "" : arrRolePerson_person[6];
    	oCell_roleperson_person_ouname.innerHTML = (arrRolePerson_person[7] == null) ? "" : arrRolePerson_person[7];
    	oCell_roleperson_person_sipaddress.innerHTML = (arrRolePerson_person[8] == null) ? "" : arrRolePerson_person[8];
    } else {
    	oCell_roleperson_person_code.innerHTML = "";
    	oCell_roleperson_person_name.innerHTML = "";
    	oCell_roleperson_person_position.innerHTML = "";
    	oCell_roleperson_person_title.innerHTML = "";
    	oCell_roleperson_person_level.innerHTML = "";
    	oCell_roleperson_person_oucode.innerHTML = "";
    	oCell_roleperson_person_ouname.innerHTML = "";
    	oCell_roleperson_person_nodetype.innerHTML = "";
    	oCell_roleperson_person_sipaddress.innerHTML = "";
    }

    oCell_dp_apv_kind.innerHTML = description + applytemplatesitemtaskinfo(
                                        viewtype,
                                        $(oCell_roleperson_taskinfo_datecompleted).text(),
                                        $(oCell_step_unittype).text(),
                                        $(oCell_step_routetype).text(),
                                        $(oCell_step_allottype).text(),
                                        $(oCell_step_name).text(),
                                        $(oCell_step_taskinfo_status).text(),
                                        $(oCell_roleperson_nodetype).text(),
                                        $(oCell_step_unittype).text(),
                                        $(oCell_roleperson_taskinfo_kind).text(),
                                        $(oCell_roleperson_taskinfo_status).text(),
                                        $(oCell_roleperson_taskinfo_customattribute2).text());


	// 체크박스 UI, 삭제버튼 및 결재 종류 수정

    if (oCell_key_readonly.innerHTML == "True") { 
    	//if ((oCell_key_readonly.innerHTML == "True") && 
    		//(oCell_division_taskinfo_kind.innerHTML != "receive")) {
    		//Common.Warning("기안자이거나 이미 수신받은 결재자는 변경할 수 없습니다.");
        	oCell_dp_apv_checkbox.innerHTML="<input type='checkbox' isDrafter='false' style='display: none;' />";
	}
	else {
		if (oCell_step_ruleapvclass.innerHTML == "DRAFTER") {
	    	oCell_dp_apv_checkbox.innerHTML="<input type='checkbox' isDrafter='true' />";
	    	if ((oCell_ou_code.innerHTML == "") &&
	    		(oCell_roleperson_code.innerHTML == "")) {
	    		oCell_dp_apv_kind.innerHTML = oCell_dp_apv_kind.innerHTML.replace("부서", "").replace("개인", "");
	    	}
	        oRow.style.backgroundColor = "#f9f7ee";
	    }
	    else {
	    	oCell_dp_apv_checkbox.innerHTML="<input type='checkbox' isDrafter='false' />";
	    }
	    
	    // 삭제버튼
	    if(arrStep.length != 0) {
	    	oCell_dp_apv_delete_button.innerHTML = "<a href='#' class='icnDel' onclick='deletePerson(this)'>"+coviDic.dicMap["btn_apv_delete"]+"</a>";
	    	
	    	// 이벤트 처리(Click / Drag and Drop)
        	oRow.addEventListener('mousedown', function(event) { selectRowApvlist(null, event); });
        	
        	if (oCell_division_taskinfo_kind.innerHTML != "receive") {
				oRow.draggable = "true";
	        	oRow.addEventListener('dragstart', function(event) { void_dragStart(event); });
	        	oRow.addEventListener('dragend', function(event) { void_dragEnd(event); });
	        	oRow.addEventListener('drop', function(event) { void_drop(event); });
	        	oRow.addEventListener('dragover', function(event) { void_dragOver(event); });
        	}
	    }
	}
	
    
    if (index == "" || $(oCell_key_readonly).text() == "False") {
        index = tmpIndex;
    }
    if (index.toString().indexOf(".") == -1) {
        oRow.style.backgroundColor = "#e8e8e8";
    }

    oCell_dp_apv_no.innerHTML = getDotCountSpace(String(index));

}

// 결재선 드레그 시작
// 이동할 데이터 설정
var wStrDragHTML = "";
function void_dragStart(pObjEvent) {
	if (pObjEvent.target.nodeName != "TR") {
		return;
	}
	wStrDragHTML = pObjEvent.target.outerHTML;
	var sData = "APVList§§§";
	sData += pObjEvent.target.rowIndex.toString();
	// IE는 text만 가능
	pObjEvent.dataTransfer.setData("text", sData);
}

// 결재선 드레그 종료
// temp ROW 제거
function void_dragEnd(pObjEvent) {
	$("#tblApvLine > tbody > tr").each(function () {
		if ($(this).attr("data-type") != null) {
			$(this).remove();
		}
	});
	
	// 결재선 다시 그리기
	var sHTML_THEAD = $("#tblApvLine").find("thead").html();
    makeApvLineXml();
    document.getElementById("Apvlist").innerHTML = "";
    refreshList();
    $("#tblApvLine").find("thead").html(sHTML_THEAD);
}

// 결재선 이동
// 선택 된 temp ROW 영역에 결재선 ROW 삽입. 결재선 이동의 경우, 이전 항목은 제거
function void_drop(pObjEvent) {
	pObjEvent.preventDefault();
	if (pObjEvent.target.nodeName != "TD") {
		return;
	}
	
	if (pObjEvent.dataTransfer.getData("text") == "") {
		$("#tblApvLine > tbody > tr").each(function () {
			if ($(this).attr("data-type") != null) {
				$(this).remove();
			}
		});
		return;
	}
	
	var sType = pObjEvent.dataTransfer.getData("text").split("§§§")[0];
	var sID = pObjEvent.dataTransfer.getData("text").split("§§§")[1];
	if ((sType == "") ||
	    (sID == "")) {
	    return;
	}
	
	if (sType == "APVList") {
		// 위/아래 이동
		if (wStrDragHTML == "") {
			return;
		}
		
		var oTR = $(pObjEvent.target).parent();
		if ($(oTR).attr("data-type") != "temp") {
			return;
		}
		
		// 위치 확인
		var nSelectIndex = new Number(sID);
		var nMovedIndex = pObjEvent.target.parentNode.rowIndex;
		if ((nMovedIndex == nSelectIndex) ||
			(nMovedIndex == nSelectIndex + 1)) {
			return;
		}
		
		if (nMovedIndex > nSelectIndex) {
			// 아래로 옮긴 경우,
			$("#tblApvLine > tbody > tr").eq(nSelectIndex - 1).remove();
			$(oTR).after(wStrDragHTML);
			wStrDragHTML = "";
		}
		else {
			// 위로 옮긴 경우,
			$("#tblApvLine > tbody > tr").eq(nSelectIndex).remove();
			$(oTR).after(wStrDragHTML);
			wStrDragHTML = "";
		}
	}
	else {
		var oTR = $(pObjEvent.target).parent();
		if ($(oTR).attr("data-type") == "temp") {
			// 추가
			$("#orgSearchList").find("INPUT[type='checkbox']").prop("checked", false);
			if ($("#" + sID).length <= 0) {
				return;
			}
			$("#" + sID).prop("checked", true);
			
			// 추가 전 Rows
			var nBeforeRowsCount = $("#tblApvLine > tbody > tr").length;
			
			// 추가
			document.getElementById("btnSelect").click();
			
			// 추가 후 Rows
			var nAfterRowsCount = $("#tblApvLine > tbody > tr").length;
			
			// 1건 추가되었으면 정상
			if (nBeforeRowsCount + 1 == nAfterRowsCount) {
				// 이동
				var nSelectIndex = 0;
				$("#tblApvLine > tbody > tr").each(function(pIntIndex) {
					if ($(this).attr("draggable")) {
						nSelectIndex = pIntIndex;
						return false;
					}
				});
				
				$("#tblApvLine > tbody > tr").eq(nSelectIndex).insertBefore($(oTR));
			 	
				$("#tblApvLine > tbody > tr").each(function () {
					if ($(this).attr("data-type") != null) {
						$(this).remove();
					}
				});
				
				// 결재선 다시 그리기
				var sHTML_THEAD = $("#tblApvLine").find("thead").html();
			    makeApvLineXml();
			    document.getElementById("Apvlist").innerHTML = "";
			    refreshList();
			    $("#tblApvLine").find("thead").html(sHTML_THEAD);
			}
			else {
				$("#tblApvLine > tbody > tr").each(function () {
					if ($(this).attr("data-type") != null) {
						$(this).remove();
					}
				});
			}
		}
		else {
			// 변경
			if ($(oTR).find("td").eq(step_ruleapvclass).text() == "DRAFTER") {
				$(oTR).find("INPUT[type='checkbox']").prop("checked", true);
				$(oTR).find("INPUT[type='checkbox']").parent().click();
			}
			
			// 추가
			$("#orgSearchList").find("INPUT[type='checkbox']").prop("checked", false);
			if ($("#" + sID).length <= 0) {
				return;
			}
			$("#" + sID).prop("checked", true);
			
			// 추가 전 Rows
			var nBeforeRowsCount = $("#tblApvLine > tbody > tr").length;
			
			// 추가
			document.getElementById("btnSelect").click();
			
			// 추가 후 Rows
			var nAfterRowsCount = $("#tblApvLine > tbody > tr").length;
			
			// 1건 추가되었으면 정상
			if (nBeforeRowsCount + 1 == nAfterRowsCount) {
			}
			else {
				$(oTR).find("INPUT[type='checkbox']").prop("checked", false);
			}
		}
	}
}

// 결재선 이동 중...
// 이동하려는 위 / 아래로 temp ROW를 표시
function void_dragOver(pObjEvent) {
	pObjEvent.preventDefault();
	if (pObjEvent.target.nodeName != "TD") {
		return;
	}
	var oTR = $(pObjEvent.target).parent();
	
	var nHeight = $(pObjEvent.target).height();
	var nBorder = (nHeight - 20) / 2;
	if ((pObjEvent.offsetY > 0) &&
		(pObjEvent.offsetY < nBorder)) {
		if ($(oTR).next().attr("data-type") != null) {
			$(oTR).next().remove();
		}
		if ($(oTR).prev().attr("data-type") == null) {
			$(oTR).before("<tr id='hTRTemp' data-type='temp' ondrop=\"void_drop(event)\" ondragover=\"event.preventDefault();\"><td colspan='" + $(oTR).find("td").length + "' style='background-color: #ffffe2;'></td></tr>");
		}
	}
	else if (pObjEvent.offsetY > nHeight - nBorder) {
		if ($(oTR).prev().attr("data-type") != null) {
			$(oTR).prev().remove();
		}
		if ($(oTR).next().attr("data-type") == null) {
			$(oTR).after("<tr id='hTRTemp' data-type='temp' ondrop=\"void_drop(event)\" ondragover=\"event.preventDefault();\"><td colspan='" + $(oTR).find("td").length + "' style='background-color: #ffffe2;'></td></tr>");
		}
	}
	else {
		if ($(oTR).prev().attr("data-type") != null) {
			$(oTR).prev().remove();
		}
		if ($(oTR).next().attr("data-type") != null) {
			$(oTR).next().remove();
		}
	}
	
}


//*참조 목록 ROW 추가
function inserthtmlrowCC(objTB,taskType, arrCCinfo, arrOu, arrPerson) {
    var oTable = document.getElementById(objTB);
    var oTBody;
    if ($(oTable).find('tbody').length <= 0) {
    	oTBody = document.createElement("TBODY");
    } else {
        oTBody = oTable.lastChild;
    }

    oTable.appendChild(oTBody);
    var nTBodyRow = oTBody.childNodes;
    var nrowNo = nTBodyRow.length;
    var oRow = oTBody.insertRow(nrowNo);
    var oCell_dp_cc_beforecc = oRow.insertCell(dp_cc_beforecc);
    var oCell_dp_cc_username = oRow.insertCell(dp_cc_username);
    var oCell_ccinfo_belongto = oRow.insertCell(ccinfo_belongto);
    var oCell_ccinfo_beforecc = oRow.insertCell(ccinfo_beforecc);
    var oCell_ccinfo_datereceived = oRow.insertCell(ccinfo_datereceived);
    var oCell_ccinfo_ou_code = oRow.insertCell(ccinfo_ou_code);
    var oCell_ccinfo_ou_name = oRow.insertCell(ccinfo_ou_name);
    var oCell_ccinfo_person_code = oRow.insertCell(ccinfo_person_code);
    var oCell_ccinfo_person_name = oRow.insertCell(ccinfo_person_name);
    var oCell_ccinfo_person_position = oRow.insertCell(ccinfo_person_position);
    var oCell_ccinfo_person_title = oRow.insertCell(ccinfo_person_title);
    var oCell_ccinfo_person_level = oRow.insertCell(ccinfo_person_level);
    var oCell_ccinfo_person_oucode = oRow.insertCell(ccinfo_person_oucode);
    var oCell_ccinfo_person_ouname = oRow.insertCell(ccinfo_person_ouname);
    var oCell_ccinfo_person_sipaddress = oRow.insertCell(ccinfo_person_sipaddress);
    var oCell_ccinfo_delete_button = oRow.insertCell(ccinfo_delete_button);
    var oCell_ccinfo_sender_id = oRow.insertCell(ccinfo_sender_id);
    var oCell_ccinfo_sender_name = oRow.insertCell(ccinfo_sender_name);

    oRow.style.height = "25px";

    oCell_dp_cc_beforecc.noWrap = true;
    oCell_dp_cc_username.noWrap = true;
    oCell_dp_cc_username.style.textAlign = "left";

    oCell_ccinfo_belongto.style.display = "none";
    oCell_ccinfo_beforecc.style.display = "none";
    oCell_ccinfo_datereceived.style.display = "none";
    oCell_ccinfo_ou_code.style.display = "none";
    oCell_ccinfo_ou_name.style.display = "none";
    oCell_ccinfo_person_code.style.display = "none";
    oCell_ccinfo_person_name.style.display = "none";
    oCell_ccinfo_person_position.style.display = "none";
    oCell_ccinfo_person_title.style.display = "none";
    oCell_ccinfo_person_level.style.display = "none";
    oCell_ccinfo_person_oucode.style.display = "none";
    oCell_ccinfo_person_ouname.style.display = "none";
    oCell_ccinfo_person_sipaddress.style.display = "none";
    oCell_ccinfo_sender_id.style.display = "none";
    oCell_ccinfo_sender_name.style.display = "none";

    if (arrCCinfo != null && arrCCinfo[0] != null) {
        oCell_ccinfo_belongto.innerHTML = (arrCCinfo[0] == null) ? "" : arrCCinfo[0];
        oCell_ccinfo_beforecc.innerHTML = (arrCCinfo[1] == null) ? "" : arrCCinfo[1];
        oCell_ccinfo_datereceived.innerHTML = (arrCCinfo[2] == null) ? "" : arrCCinfo[2];
        oCell_ccinfo_sender_id.innerHTML = (arrCCinfo[3] == null) ? "" : arrCCinfo[3];
        oCell_ccinfo_sender_name.innerHTML = (arrCCinfo[4] == null) ? "" : arrCCinfo[4];
        if (getInfo("SchemaContext.scBeforCcinfo.isUse") == "Y") oCell_dp_cc_beforecc.innerHTML = beforeccselector(arrCCinfo[1], arrCCinfo[2]);
    } else {
        oCell_ccinfo_belongto.innerHTML = "";
        oCell_ccinfo_beforecc.innerHTML = "";
    }

   
    if (arrOu != null && arrOu[0] != null) {
        oCell_ccinfo_ou_code.innerHTML = (arrOu[0] == null) ? "" : arrOu[0];
        oCell_ccinfo_ou_name.innerHTML = (arrOu[1] == null) ? "" : arrOu[1];
        if (taskType == "Ou") {
            oCell_dp_cc_username.innerHTML = CFN_GetDicInfo($(oCell_ccinfo_ou_name).text(),langCode) + "&#160;";
            if (arrCCinfo[0] == "receiver") oCell_dp_cc_username.innerHTML = oCell_dp_cc_username.innerHTML + "- " + coviDic.dicMap["lbl_apv_receive"];
        }
    } else {
        oCell_ccinfo_ou_codee.innerHTML = "";
        oCell_ccinfo_ou_codee.innerHTML = "";
    }

    if (arrPerson != null && arrPerson[0] != null) {
        oCell_ccinfo_person_code.innerHTML = (arrPerson[1] == null) ? "" : arrPerson[1];
        oCell_ccinfo_person_name.innerHTML = (arrPerson[2] == null) ? "" : arrPerson[2];
        oCell_ccinfo_person_position.innerHTML = (arrPerson[3] == null) ? "" : arrPerson[3];
        oCell_ccinfo_person_title.innerHTML = (arrPerson[4] == null) ? "" : arrPerson[4];
        oCell_ccinfo_person_level.innerHTML = (arrPerson[5] == null) ? "" : arrPerson[5];
        oCell_ccinfo_person_oucode.innerHTML = (arrPerson[6] == null) ? "" : arrPerson[6];
        oCell_ccinfo_person_ouname.innerHTML = (arrPerson[7] == null) ? "" : arrPerson[7];
        oCell_ccinfo_person_sipaddress.innerHTML = (arrPerson[8] == null) ? "" : arrPerson[8];
        if (taskType == "RolePerson" && arrCCinfo[0] == "receiver") {
            oCell_dp_cc_username.innerHTML = CFN_GetDicInfo($(oCell_ccinfo_person_name).text(),langCode) + "(" + splitName($(oCell_ccinfo_person_position).text()) + "," + CFN_GetDicInfo($(oCell_ccinfo_person_ouname).text(),langCode) + ")&#160;" + "- " + coviDic.dicMap["lbl_apv_receive"];
        } else if (taskType == "RolePerson") {
            oCell_dp_cc_username.innerHTML = CFN_GetDicInfo($(oCell_ccinfo_person_name).text(),langCode) + "(" + splitName($(oCell_ccinfo_person_position).text()) + "," + CFN_GetDicInfo($(oCell_ccinfo_person_ouname).text(),langCode) + ")&#160;";
        }
        oCell_ccinfo_delete_button.innerHTML = "<a href='#' class='icnDel' onclick='deleteCC(this)'>"+coviDic.dicMap["btn_apv_delete"]+"</a>";
    } else {
        oCell_ccinfo_person_code.innerHTML = "";
        oCell_ccinfo_person_name.innerHTML = "";
        oCell_ccinfo_person_position.innerHTML = "";
        oCell_ccinfo_person_title.innerHTML = "";
        oCell_ccinfo_person_level.innerHTML = "";
        oCell_ccinfo_person_oucode.innerHTML = "";
        oCell_ccinfo_person_ouname.innerHTML = "";
        oCell_ccinfo_person_sipaddress.innerHTML = "";
        oCell_ccinfo_delete_button.innerHTML = "<a href='#' class='icnDel' onclick='deleteCC(this)'>"+coviDic.dicMap["btn_apv_delete"]+"</a>";
    }

    oRow.onmousedown = function (event) { selectRowApvlist(null, event) };
}

function beforeccselector(value, date) {
    var sSelector = "";
    if (value == "y") sSelector = coviDic.dicMap["btn_apv_ccinfo_before"];
    else sSelector = coviDic.dicMap["btn_apv_ccinfo_after"];

    return sSelector;
}
function ChangeCCinfo(e)
{
    var oSelTR = getPatentRowApvlist(e);
    var sCurType = (window.ActiveXObject === undefined) ? e.target.value : event.srcElement.value;
    oSelTR.childNodes[ccinfo_beforecc].innerHTML = sCurType;
}

//의견조회 관련 수정
var cmtid = 0;
function applytemplatesdisplaycomment(itemtaskinfo, itemid) {
    var commentkey = itemid;
    var sHTML = "";
    if (itemtaskinfo.find("comment").length > 0) {
        commentkey = cmtid; cmtid++;
        sHTML = "<a href=\"javascript:viewComment('" + commentkey + "');\">" + strlable_comment + "</a>";
        sHTML += "<textarea style=\"display:none\" id=\"" + commentkey + "\">" + applytemplatescomment(itemtaskinfo.find("comment").eq(0)) + "</textarea>";
    }
    return sHTML;
}
function applytemplatescomment(comment) {
    var sHTML = "";
    if (comment != null) {
        sHTML = "<b>" + convertSignResult(String(comment.attr("relatedresult")), String(comment.attr("kind")), comment.parent().parent().parent().parent().attr("name")) + "</b>";
        sHTML += formatDate(String(comment.attr("datecommented")));
        sHTML += "<br />" + replaceCR(String(comment.val()));
    }
    return sHTML;
}
//결재종류 추가 ( 확인, 참조)
function addPersonExt(szkind) {
    m_sSelectedStepType = "division";
    m_sSelectedDivisionType = "send";
    m_sSelectedRouteType = "approve";
    m_sSelectedUnitType = "person";
    m_sSelectedAllotType = "";
    m_sSelectedStepRef = szkind; //"일반결재"
    l_bGroup = false;
    
    m_sSelectedRuleApvClass = "";
    m_sSelectedRuleApvClassAtt01 = "";
    
    insertToList(switchParentNode(3));
}
function CFN_XpathCur(obj, nfind) {
    var aFind = nfind.split("/");
    var elmObj = obj;
    $(aFind).each(function (i, elm) {
        var sid = elm.split("[")[0];
        var svalue = sid;
        if (elm.split("[").length > 1) {
            var svalue = elm.split("[")[1];
            svalue = svalue.substring(0, svalue.length - 1);
            elmObj = $(elmObj).find(sid.replace("|", ",").replace("(", "").replace(")", "")).eq(svalue);
        } else {
            elmObj = $(elmObj).find(sid.replace("|", ",").replace("(", "").replace(")", ""));
        }

    });
    return elmObj;
}
function statusChangeALL(e) {
    var bSetDirty = false;
    var oSelTR = getPatentRowApvlist(e);
    var sUnitType = $(oSelTR.childNodes[step_unittype]).text();
    var sRouteType = $(oSelTR.childNodes[step_routetype]).text();
    var sAllotType = $(oSelTR.childNodes[step_allottype]).text();
    var sStepName = $(oSelTR.childNodes[step_name]).text();
    var sKind = $(oSelTR.childNodes[roleperson_taskinfo_kind]).text();

    var sCurType = (window.ActiveXObject === undefined) ? e.target.value : event.srcElement.value;
    var acmpKey = sCurType.split("@"); //steproutetype + "@" + stepunittype + "@" + sallottype + "@" + kind+@ +stepname;

    switch (acmpKey[3]) {
        case "authorize": //전결
            if (oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != null && oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != "") {
            } else {
                oSelTR.childNodes[roleperson_taskinfo_status].innerHTML = "inactive";
                oSelTR.childNodes[roleperson_taskinfo_result].innerHTML = "inactive";
            }
            oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML = "authorize";
            
            bSetDirty = true;
            break;
        case "review": //후결
            if (oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != null && oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != "") {
                if (window.ActiveXObject === undefined) { e.target.options[0].selected = true; } else { event.srcElement.options[0].selected = true; }
                statusChangeALL(e); // [21-09-07 add] 이후 결재자들도 일반결재로 변경되도록 수정
                Common.Warning(strMsg_121);
            } else {
                oSelTR.childNodes[roleperson_taskinfo_status].innerHTML = "inactive";
                oSelTR.childNodes[roleperson_taskinfo_result].innerHTML = "inactive";
                oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML = "review";
                
                changePrevInactive(oSelTR);
                
                bSetDirty = true;
            }
            break;
        case "normal": //일반결재
            if (oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != null && oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != "") {
            } else {
                oSelTR.childNodes[roleperson_taskinfo_status].innerHTML = "inactive";
                oSelTR.childNodes[roleperson_taskinfo_result].innerHTML = "inactive";
            }
            oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML = "normal";

            changePrevInactive(oSelTR);

            bSetDirty = true;
            break;
        case "bypass": //후열
            oSelTR.childNodes[roleperson_taskinfo_status].innerHTML = "inactive";
            oSelTR.childNodes[roleperson_taskinfo_result].innerHTML = "inactive";
            oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML = "bypass";
            bSetDirty = true;
            
            changePrevInactive(oSelTR);
            
            try { m_oFormMenu.setApvChangeMode("bypass"); } catch (e) { }
            break;
        case "skip": //결재안함
            oSelTR.childNodes[roleperson_taskinfo_status].innerHTML = "skipped";
            oSelTR.childNodes[roleperson_taskinfo_result].innerHTML = "skipped";
            oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML = "skip";
            bSetDirty = true;
            break;
        case "confidential": //친전
            if (oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != null && oSelTR.childNodes[roleperson_taskinfo_datereceived].innerHTML != "") {
            } else {
                oSelTR.childNodes[roleperson_taskinfo_status].innerHTML = "inactive";
                oSelTR.childNodes[roleperson_taskinfo_result].innerHTML = "inactive";
                oSelTR.childNodes[roleperson_taskinfo_kind].innerHTML = "confidential";
            }
            
            changePrevInactive(oSelTR);
            
            bSetDirty = true;
            break;
        default:
    }
    if (bSetDirty) {
        oSelTR.childNodes[step_unittype].innerHTML = acmpKey[1];
        oSelTR.childNodes[step_routetype].innerHTML = acmpKey[0];
        oSelTR.childNodes[step_allottype].innerHTML = acmpKey[2];
    }
    if (bSetDirty) try { m_oFormMenu.setApvDirty(); } catch (e) { }

}

function changePrevInactive(oSelTR) {
	var oTempTR = oSelTR;
    while (oTempTR.previousSibling != null) {
        oTempTR = oTempTR.previousSibling;
        if (oTempTR.tagName == "TR") {
            if (oTempTR.childNodes[roleperson_taskinfo_kind].innerHTML == "skip") {
                oTempTR.childNodes[roleperson_taskinfo_status].innerHTML = "inactive";
                oTempTR.childNodes[roleperson_taskinfo_result].innerHTML = "inactive";
                oTempTR.childNodes[roleperson_taskinfo_kind].innerHTML = "normal";
                oTempTR.childNodes[dp_apv_state].innerHTML = convertSignResult("inactive", "normal", "일반결재") + "&#160;";
                oTempTR.childNodes[dp_apv_kind].innerHTML = applytemplatesitemtaskinfo(
                                                                viewtype,
                                                                oTempTR.childNodes[roleperson_taskinfo_datecompleted].innerHTML,
                                                                oTempTR.childNodes[step_unittype].innerHTML,
                                                                oTempTR.childNodes[step_routetype].innerHTML,
                                                                oTempTR.childNodes[step_allottype].innerHTML,
                                                                oTempTR.childNodes[step_name].innerHTML,
                                                                oTempTR.childNodes[step_taskinfo_status].innerHTML,
                                                                oTempTR.childNodes[roleperson_nodetype].innerHTML,
                                                                oTempTR.childNodes[step_unittype].innerHTML,
                                                                oTempTR.childNodes[roleperson_taskinfo_kind].innerHTML,
                                                                oTempTR.childNodes[roleperson_taskinfo_status].innerHTML,
                                                                oTempTR.childNodes[roleperson_taskinfo_customattribute2].innerHTML);
                
                if (oTempTR.childNodes[step_ruleapvclass].innerHTML == "DRAFTER") {
        			oTempTR.childNodes[dp_apv_checkbox].innerHTML="<input type='checkbox' isDrafter='true' />";
        	    	if ((oTempTR.childNodes[ou_code].innerHTML == "") &&
        	    		(oTempTR.childNodes[step_ruleapvclass].innerHTML == "")) {
        	    		oTempTR.childNodes[dp_apv_checkbox].innerHTML = oTempTR.childNodes[dp_apv_checkbox].innerHTML.replace("부서", "").replace("개인", "");
        	    	}
        	    }
        	    else {
        	    	oTempTR.childNodes[dp_apv_checkbox].innerHTML="<input type='checkbox' isDrafter='false' />";
        	    }

        	    // 삭제버튼
        		oTempTR.childNodes[dp_apv_delete_button].innerHTML = "<a href='#' class='icnDel' onclick='deletePerson(this)'>"+coviDic.dicMap["btn_apv_delete"]+"</a>";
    	    	
    	    	// 이벤트 처리(Click / Drag and Drop)
    	    	oTempTR.addEventListener('mousedown', function(event) { selectRowApvlist(null, event); });
            	
            	if (oTempTR.childNodes[division_taskinfo_kind].innerHTML != "receive") {
            		oTempTR.draggable = "true";
            		oTempTR.addEventListener('dragstart', function(event) { void_dragStart(event); });
            		oTempTR.addEventListener('dragend', function(event) { void_dragEnd(event); });
            		oTempTR.addEventListener('drop', function(event) { void_drop(event); });
    	        	oTempTR.addEventListener('dragover', function(event) { void_dragOver(event); });
            	}
                clearSelectionApvlist();
            }
        }
    }
}

function replaceCR(s) {
    return s.replace(/\n/g, "<br>");
}
//*결재 종류 표시
function applytemplatesitemtaskinfo(viewtype, datecompleted, stepunittype, steproutetype, stepallottype, stepname, stepstatus, parentNodeName, parentunittype, kind, status, customattribute2) {
    if (datecompleted != "" || viewtype == 'read' || viewtype == 'myread') {
        if ((steproutetype == 'assist' || steproutetype == 'consult' || steproutetype == 'audit') && stepunittype == 'ou') {
            if ((parentNodeName == 'person' || parentNodeName == 'role')) {
                return convertKindToSignTypeByRTnUT(kind, parentNodeName, steproutetype, stepunittype, customattribute2);
            } else {
                return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname);
            }
        } else {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname);
        }
    } else if (stepname == "ExtType") {
        return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname);
    } else if (steproutetype == "ccinfo") {
        return "";
    } else if (stepunittype == 'ou') {
        if ((parentNodeName == 'person' || parentNodeName == 'role') && (stepstatus == "pending") && steproutetype != undefined) {
            return calltemplatestatusselectorALL(kind, viewtype, parentNodeName, steproutetype, stepunittype, stepstatus, stepallottype, stepname, status);
        } else {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname, (stepallottype == null ? "" : stepallottype));
        }
    } else if (stepunittype == 'person') {
        if (kind == "charge" || kind == "skip") {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "", status);
        } else if ((steproutetype == "audit" && parentunittype == "person") && ((getInfo("SchemaContext.scPAdt.isUse") == "Y") || (getInfo("SchemaContext.scPAdt1.isUse") == "Y"))) {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname);
        } else if ((steproutetype == "consult" && parentunittype == "person")) {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname, (stepallottype == null ? "" : stepallottype));
        } else if ((steproutetype == "assist" && parentunittype == "person")) {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "", (stepallottype == null ? "" : stepallottype));
        } else if (steproutetype == "approve" && kind == "reference") {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "");
        } else if (steproutetype == "approve" && kind == "confirm") {
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "");
        } else if (steproutetype == "review" && kind == "confirm") { //공람기능추가
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "");            
        } else if (steproutetype == 'approve' && stepallottype == "parallel") { //동시결재 결재선 추가
            return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "");
        } else {
            return calltemplatestatusselectorALL(kind, viewtype, parentunittype, steproutetype, stepunittype, stepstatus, (stepallottype == null ? "" : stepallottype), stepname, status);
        }
    } else {
        return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, "");
    }
}

function calltemplatestatusselectorALL(kind, viewtype, parentunittype, steproutetype, stepunittype, stepstatus, sallottype, sstepname, taskinfostatus) {
    
    var cmpKey = steproutetype + "@" + stepunittype + "@" + sallottype + "@" + kind;
    var aApvKindUsage = ApvKindUsage.split(";");
    if (steproutetype == "audit") cmpKey += "@" + sstepname;
    //부서종류 변경
    if (stepunittype == "ou") {
        if (stepstatus == "") { //시작하지 않았음 변경
            return "<select onchange=\"statusChangeALL(event)\">"
                   + (getInfo("SchemaContext.scDAdt.isUse") == "Y" ? "<option value=\"audit@ou@serial@normal@" + strlable_dept_audit3 + "\" " + (("audit@ou@serial@normal@" + strlable_dept_audit3) == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("normal", "ou", "audit", "ou", "감사") + "</option>" : "")
                   + (getInfo("SchemaContext.scDAdt1.isUse") == "Y" ? "<option value=\"audit@ou@serial@normal@" + strlable_dept_audit + "\" " + (("audit@ou@serial@normal@" + strlable_dept_audit) == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("normal", "ou", "audit", "ou", "준법") + "</option>" : "")
                   + (getInfo("SchemaContext.scDCoo.isUse") == "Y" ? "<option value=\"assist@ou@serial@normal\" " + ("assist@ou@serial@normal" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("normal", "ou", "assist", "ou", "") + "</option>" : "")
                   + (getInfo("SchemaContext.scDCooPL.isUse") == "Y" ? "<option value=\"assist@ou@parallel@normal\" " + ("assist@ou@parallel@normal" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("normal", "ou", "assist", "ou", "") + "</option>" : "")
                   + (getInfo("SchemaContext.scDAgrSEQ.isUse") == "Y" ? "<option value=\"consult@ou@serial@consent\" " + ("consult@ou@serial@consent" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("consent", "ou", "consult", "ou", "") + "</option>" : "")
                   + (getInfo("SchemaContext.scDAgr.isUse") == "Y" ? "<option value=\"consult@ou@parallel@consent\" " + ("consult@ou@parallel@consent" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("consent", "ou", "consult", "ou", "") + "</option>" : "")
                   + (getInfo("SchemaContext.scDRec.isUse") == "Y" ? "<option value=\"receive@ou@serial@normal\" " + ("receive@ou@serial@normal" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignTypeByRTnUT("normal", "ou", "receive", "ou", "") + "</option>" : "")
                   + "</select>";
        } else if (stepstatus == "pending") { //진행중 --> 부서 내 사용자들만 변경 가능
            if (kind == "normal" || (kind == 'authorize') || (gDeputyType == "F" && (kind == 'substitute')) || (kind == 'confidential')) {
                return "<select onchange=\"statusChange(event)\">"
                            + "<option value=\"normal\" " + ("normal" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('normal', '') + "</option>"
                            + ((gDeputyType == "F") ? "<option value=\"substitute\" " + ("normal" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('substitute', '') + "</option>" : "")
                            + ((aApvKindUsage[0] == "1") ? "<option value=\"authorize\" " + ("authorize" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('authorize', '') + "</option>" : "")
                            + ((aApvKindUsage[2] == "1") ? "<option value=\"review\" " + ("review" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('review', '') + "</option>" : "")
                            + ((aApvKindUsage[3] == "1") ? "<option value=\"bypass\" " + ("bypass" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('bypass', '') + "</option>" : "")
                        + "</select>";
            } else {
                return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, sstepname);
            }
        } else {//여기는 언제타지?
            return "<select onchange=\"statusChangeALL(event)\">"
                            + "<option value=\"" + steproutetype + "@" + stepunittype + "@normal\" selected=\"t\">" + convertKindToSignType('normal', '') + "</option>"
                            + ((gDeputyType == "F") ? "<option value=\"" + steproutetype + "@" + stepunittype + "@substitute\">" + convertKindToSignType('substitute', '') + "</option>" : "")
                            + ((aApvKindUsage[0] == "1") ? "<option value=\"" + steproutetype + "@" + stepunittype + "@authorize\">" + convertKindToSignType('authorize', '') + "</option>" : "")
                            + ((aApvKindUsage[2] == "1") ? "<option value=\"" + steproutetype + "@" + stepunittype + "@review\">" + convertKindToSignType('review', '') + "</option>" : "")
                            + ((aApvKindUsage[3] == "1") ? "<option value=\"" + steproutetype + "@" + stepunittype + "@bypass\">" + convertKindToSignType('bypass', '') + "</option>" : "")
                        + "</select>";
        }
    } else {
        //개인종류 변경
        if (taskinfostatus == "pending") {
            switch (kind) {
                case "consent": return convertKindToSignTypeByRTnUT(kind, 'person', steproutetype, 'person', ''); break;
                case "substitute": return convertKindToSignTypeByRTnUT(kind, 'person', steproutetype, 'person', ''); break;
                default:
                    if (steproutetype == "audit" && parentunittype == "person") {
                        return convertKindToSignTypeByRTnUT(kind, 'person', steproutetype, 'person', sstepname); break;
                    } else {
                        return "<select onchange=\"statusChangeALL(event)\">"
                                        + "<option value=\"approve@person@@normal\" " + ("approve@person@@normal" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignType('normal', '') + "</option>"
                                        + ((aApvKindUsage[0] == "1") ? "<option value=\"approve@person@@authorize\" " + ("authorize" == kind ? "selected=\"t\" " : "") + " >" + convertKindToSignType('authorize', '') + "</option>" : "")
                                        + ((aApvKindUsage[2] == "1") ? "<option value=\"approve@person@serial@review\" " + ("review" == kind ? "selected=\"t\" " : "") + " >" + convertKindToSignType('review', '') + "</option>" : "")
                                        + ((aApvKindUsage[3] == "1") ? "<option value=\"approve@person@serial@bypass\" " + ("bypass" == kind ? "selected=\"t\" " : "") + " >" + convertKindToSignType('bypass', '') + "</option>" : "")
                                        + ((aApvKindUsage[4] == "1") ? "<option value=\"approve@person@@confidential\" " + ("confidential" == kind ? "selected=\"t\" " : "") + " >" + convertKindToSignType('confidential', '') + "</option>" : "") //2013.11.11 친전
                                    + "</select>";
                    }
            }
        } else {
        	if(m_sApvMode == "SUBREDRAFT" || m_sApvMode == "SUBAPPROVAL"){
	            return "<select onchange=\"statusChangeALL(event)\">"
	                    + "<option value=\"approve@person@@normal\" " + ("approve@person@@normal" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignType('normal', '') + "</option>";
        	}else{
        		return "<select onchange=\"statusChangeALL(event)\">"
                + "<option value=\"approve@person@@normal\" " + ("approve@person@@normal" == cmpKey ? "selected=\"t\" " : "") + " >" + convertKindToSignType('normal', '') + "</option>"
                + ((aApvKindUsage[0] == "1") ? "<option value=\"approve@person@@authorize\" " + ("authorize" == kind ? "selected=\"t\" " : "") + " >" + convertKindToSignType('authorize', '') + "</option>" : "")
                + ((aApvKindUsage[2] == "1") ? "<option value=\"approve@person@@review\"  " + ("review" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('review', '') + "</option>" : "")
                + ((aApvKindUsage[3] == "1") ? "<option value=\"approve@person@@bypass\"  " + ("bypass" == kind ? "selected=\"t\" " : "") + ">" + convertKindToSignType('bypass', '') + "</option>" : "")
                + ((aApvKindUsage[4] == "1") ? "<option value=\"approve@person@@confidential\" " + ("confidential" == kind ? "selected=\"t\" " : "") + " >" + convertKindToSignType('confidential', '') + "</option>" : "") //2013.11.11 친전
        	}
        }
    }
}

function setSelectedRowId(id) { m_selectedRowApvlistId = id; }

function selectRowApvlist(id, e) {
    var evt = (window.event) ? window.event : e;
    var oRow;
    if (id == null) {
        oRow = (evt.srcElement) ? evt.srcElement : evt.target;
    } else {
        oRow = document.getElementById(id);
    }
    if (oRow != null) {
        switchSelectedRowApvlist(oRow);
    } else {
        m_selectedRowApvlist = null;
        m_selectedRowApvlistId = null;
    }
}

/*======================================
-- 결재목록 선택에 따른 UI 조정
--====================================*/
function switchSelectedRowApvlist(oRow) {
    while (oRow != null && oRow.tagName != "TR") {
        oRow = oRow.parentNode;
    }
    if (oRow != null) {
    	/*
		if ($(oRow.childNodes[key_readonly]).text() == "True") {
			//Common.Warning("기안자이거나 이미 수신받은 결재자는 변경할 수 없습니다.");
			return;
		}
		*/

        if (m_selectedRowApvlist != null) {
        	if ($(m_selectedRowApvlist.childNodes[step_ruleapvclass]).text() == "DRAFTER") {
        		m_selectedRowApvlist.style.backgroundColor = "#F9F7EE";
        	}
        	else {
        		m_selectedRowApvlist.style.backgroundColor = "";
        	}
        }
        oRow.style.backgroundColor = "#EEF7F9";
        m_selectedRowApvlist = oRow;
        m_selectedRowApvlistId = oRow.id;
        
        // 미정인 경우(부서 코드/사용자 코드 == ""), 선택한 결재자의 체크박스 선택 및 (추가)버튼 변경
        //if (($(m_selectedRowApvlist.childNodes[ou_code]).text() == "") &&
        //	($(m_selectedRowApvlist.childNodes[roleperson_code]).text() == "")) {
        	var sRouteType = $(m_selectedRowApvlist.childNodes[step_routetype]).text();
        	var sAllotType = $(m_selectedRowApvlist.childNodes[step_allottype]).text();
    		var sID = "";
    		switch(sRouteType) {
				case "assist": // 개인협조
					if (sAllotType == "parallel") { // 병렬
						sID = "btPAssistPL";
					}
					else {
						sID = "btPAssist";
					}
    				break;
				case "consult": // 개인합의
					if (sAllotType == "parallel") { // 병렬
						sID = "btPConsult2";
					}
					else {
						sID = "btPConsult";
					}
    				break;
				case "receive": // 수신처
					sID = "btReceipt";
    				break;
				case "ccinfo":
				case "ccinfo-before":
    				break;
				case "approve": // 일반결재
				default:
					sID = "btPerson";
    				break;
    		}
        	if ($("#" + sID).css("display") != "none") {
				$('#btnSelect').attr("value", $("#" + sID).text());
				$('#btnSelect').attr("onclick","doButtonAction(document.getElementById('" + sID + "'))");
    		}
        //}
    }
}
function clearSelectionApvlist() {
	if(m_selectedRowApvlist) m_selectedRowApvlist.style.backgroundColor = "#FFFFFF";
    m_selectedRowApvlist = null;
    m_selectedRowApvlistId = null;
}
function getPatentRowApvlist(e) {
    var evt = (window.event) ? window.event : e;
    switchSelectedRowApvlist((evt.srcElement) ? evt.srcElement : evt.target);
    return m_selectedRowApvlist;
}
function getSelectedRowApvlist() { return m_selectedRowApvlist; }
function getComment(id) { return document.getElementById(id).innerHTML; }
function selectCCRow(e) {
    var evt = (window.event) ? window.event : e;
    var oRow;
    oRow = (evt.srcElement) ? evt.srcElement : evt.target;
    if (oRow != null) {
        switchSelectedRow(oRow);
    } else {
        m_selectedCCRow = null;
        m_selectedCCRowId = null;
    }
}
function switchSelectedRow(oRow) {
    while (oRow != null && oRow.tagName != "TR") {
        oRow = oRow.parentNode;
    }
    if (oRow != null) {
        if (m_selectedCCRow != null) m_selectedCCRow.style.backgroundColor = "#FFFFFF";
        oRow.style.backgroundColor = "#EEF7F9";
        m_selectedCCRow = oRow;
        m_selectedCCRowId = oRow.id;
    }
}
function getSelectedRow() { return m_selectedCCRow; }

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
            //            if (m_selectedRowApvlist.id.indexOf("step") == -1) {
            //                m_selectedRowApvlist.style.backgroundColor = "#e8e8e8";
            //            } else {
            m_selectedDistRow.style.backgroundColor = "#FFFFFF";
            //            }
        }

        oRow.style.backgroundColor = "#EEF7F9";
        m_selectedDistRow = oRow;
        m_selectedDistRowId = oRow.id;
    }
}

function formatDate(sDate) {
    if (sDate == "" || sDate == null)
        return "";
    var szDate = sDate.replace(/-/g, "/").replace(/오후/, "pm").replace(/오전/, "am");
    if (szDate.indexOf("pm") > -1) {
        szDate = szDate.replace("pm ", "");
        var atemp = szDate.split(" ");
        var tmp = parseInt(atemp[1].split(":")[0]) + 12;
        if (tmp > 23 && parseInt(atemp[1].split(":")[1]) > 0) tmp = tmp - 12;
        tmp = dblDigit(tmp);
        var atemp2 = atemp[0].split("/");
        szDate = atemp2[1] + "/" + atemp2[2] + "/" + atemp2[0] + " " + tmp + atemp[1].substring(atemp[1].indexOf(":"), 10);
    } else {
        szDate = szDate.replace("am ", "");
        var atemp = szDate.split(" ");
        var atemp2 = atemp[0].split("/");
        szDate = atemp2[1] + "/" + atemp2[2] + "/" + atemp2[0] + " " + atemp[1];
    }
    var dtDate = new Date(szDate);
    return dtDate.getFullYear() + "-" + dblDigit(dtDate.getMonth() + 1) + "-" + dblDigit(dtDate.getDate()) + " " + dblDigit(dtDate.getHours()) + ":" + dblDigit(dtDate.getMinutes()); //+":"+dblDigit(dtDate.getSeconds());
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
    	$("#btnOpen").css({ "display": "block" });
    	$("#btnClose").css({ "display": "none" });
    	$("#divApvLineMgrSub").css({ "display": "none" });
    	$("#orgSearchListMessage").css("left","295px");
    }
}

function dblDigit(iVal) { return (iVal < 10 ? "0" + iVal : iVal); }

//결재 순번 처리(Division 순번 감추고 하위 순번 들여쓰기)
function getDotCountSpace(sDotVar) {
    var aDotCount = sDotVar.split(".");
    var sDotCount = "";
    for (var i = 0; i < aDotCount.length - 1; i++) {
        if (sDotCount == "") {
            sDotCount += "<font color='white'>-</font>";
        } else {
            sDotCount += "&nbsp;&nbsp;";
        }
    }
    return sDotCount + sDotVar.substring(sDotVar.lastIndexOf(".") + 1);
}

function splitName(sValue) {
    var sValue02 = sValue.substring(sValue.indexOf(";") + 1);
    return CFN_GetDicInfo(sValue02,langCode);
}

//결재자 선택 관련 시작
function switchParentNode(iType) {

    var m_Json = {
       "selected": {
          "to": {},
          "cc": {},
          "bcc": {},
          "user": {},
          "group": {},
          "role": {}
       }
    };
    var $$_m_Json = $$(m_Json);
    
    var sSelectedUserJson = aContentAdd_OnClick();
    var $$_m_JsonExt = $$(sSelectedUserJson);
    //const  BOOL_KEYNAME_INCLUDED = true; //[IE 10 이상 const 사용 오류]
    var  BOOL_KEYNAME_INCLUDED = true;				// 선언 이외의 곳에서 값 변경 X
    var sContext;
    switch (iType) {
        case 0:
            {
                $$_m_JsonExt.find("Items > item[itemType=to]").concat().each(function (i, $$) {
                    $$_m_Json.find("selected > to ").append($$.json(BOOL_KEYNAME_INCLUDED));
                });
                sContext = "selected > to"; break;
            }
        case 1:
            {
                $$_m_JsonExt.find("Items > item[itemType=cc]").concat().each(function (i, $$) {
                    $$_m_Json.find("selected > cc ").append($$.json(BOOL_KEYNAME_INCLUDED));
                });
                sContext = "selected > cc"; break;
            }
        case 2:
            {
                $$_m_JsonExt.find("Items > item[itemType=bcc]").concat().each(function (i, $$) {
                    $$_m_Json.find("selected > bcc ").append($$.json(BOOL_KEYNAME_INCLUDED));
                });
                sContext = "selected > bcc"; break;
            }
        case 3:
            {
                //사람더하기
                $$_m_JsonExt.find("Items > item[itemType=user]").concat().concat().each(function (i, $$) {
                    $$_m_Json.find("selected > user ").append($$.json(BOOL_KEYNAME_INCLUDED));
                });
                sContext = "selected > user"; break;
            }
        case 4:
            {
                //부서더하기
                $$_m_JsonExt.find("Items > item[itemType=group]").concat().each(function (i, $$) {
	            	// 선택된 데이터 중 중복 되지 않은 데이터만
                	if (!isDupl($$, $$_m_Json, BOOL_KEYNAME_INCLUDED)) {
                		$$_m_Json.find("selected > group ").append($$.json(BOOL_KEYNAME_INCLUDED));
                	}
                });
                
                sContext = "selected > group"; break;
            }
        case 5:
            {
                //부서더하기
                $$_m_JsonExt.find("Items > item[itemType=group]").concat().each(function (i, $$) {
                    $$_m_Json.find("selected > group ").append($$.json(BOOL_KEYNAME_INCLUDED));
                });
                sContext = "selected > group"; break;
            }

    }

    return $$_m_Json.find(sContext);

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

//버튼 분할 전 함수
function switchParentNode_bak(iType) {
    var m_XMLDOM = CreateXmlDocument();
    var m_oParent;
    m_XMLDOM.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");
    if (!m_XMLDOM.parsed) {
    }
    var sElm = "selected/user";
    switch (iType) {
        case 0: m_oParent = m_XMLDOM.selectSingleNode("selected/to"); sElm = "selected/to"; break;
        case 1: m_oParent = m_XMLDOM.selectSingleNode("selected/cc"); sElm = "selected/cc"; break;
        case 2: m_oParent = m_XMLDOM.selectSingleNode("selected/bcc"); sElm = "selected/bcc"; break;
        case 3: m_oParent = m_XMLDOM.selectSingleNode("selected/user"); sElm = "selected/user"; break;
        case 4: m_oParent = m_XMLDOM.selectSingleNode("selected/group"); sElm = "selected/group"; break;
        case 5: m_oParent = m_XMLDOM.selectSingleNode("selected/group"); sElm = "selected/group"; break;
    }

    var m_XMLDOMExt = CreateXmlDocument();
    m_XMLDOMExt.loadXML("<selected><to></to><cc></cc><bcc></bcc><user></user><group></group><role></role></selected>");

    return m_XMLDOM.selectSingleNode(sElm);
}
function addClicked() {
    var oSelNode = ((window.addEventListener) ? m_oUserList.contentWindow : m_oUserList).getCurrentNode();
    if (oSelNode != null) {
        if (m_oParent.selectSingleNode("item[AN = '" + oSelNode.selectSingleNode("AN").text + "']") == null) {
            //부서장결재 참조 추가 방지
            if ((m_sSelectedRouteType == "ccinfo" || m_sSelectedRouteType == "dist") && oSelNode.selectSingleNode("ROLE") != null && oSelNode.selectSingleNode("ROLE").text == "manager") {
            } else {
                addListItem(oSelNode.cloneNode(true));
            }
        }
    }
}

function addListItem(oNode) {
    try {
        m_oParent.appendChild(oNode);
    } catch (e) {
        Common.Error(e.description);
    }
}
function selectListItmes(iType) {
    var sChk = document.getElementById("chk").value;
    var busechk = false;
    if (window.addEventListener) {
        busechk = iSearch.document.getElementById("buse").checked;
    } else {
        busechk = iSearch.buse.checked;
    }
    try {
        if ((selTab == 'tSearch' && ((iType == 3 && !busechk) || (iType == 4 && busechk))) || selTab == 'tGroup' || selTab == 'tDeployList') {
            if (sChk == "1") {
                var sel_row = (window.addEventListener) ? m_oUserList.contentDocument.getElementsByName('chkRowSelect') : m_oUserList.document.getElementsByName('chkRowSelect');
                var chk_count = sel_row.length;
                if (chk_count > 0) {
                    for (var i = (chk_count - 1); i >= 0; i--) {
                        if (sel_row[i].checked) {
                            var eTR = sel_row[i].parentNode;
                            while (eTR.tagName != "TR") { eTR = eTR.parentNode; }

                            ListItems.g_eCurrentRow = eTR;
                            ListItems.processSelectedRow();
                            addClicked();
                            sel_row[i].checked = false;
                        }
                    }
                }
            } else {
                addClicked();
            }
        }
    } catch (e) {
        Common.Error(e.message);
    }
    document.getElementById("chk").value = 1;

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

    var bUser = true;
    $$_m_JsonExt.find("Items > item").concat().each(function (i, $$) {
        var $$_json = $$.json(BOOL_KEYNAME_INCLUDED);
        if ($$.attr("type") == "user" && bUser) {
            Common.Warning(coviDic.dicMap["msg_apv_addRecDept"]); //수신처에는 부서만 추가 가능합니다.
            return false;
        } else {
            //selected > group 이 항상 실행되며, 
            //이 때 append node가 이동되므로, 아래 라인은 불필요한 것으로 보여 주석처리함
            //$$_m_Json.find("selected > user ").append($$_json);
        }
        
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
       if (chkDuplicate($$_emlNode.attr("AN"))) {
            var sDN = $$_emlNode.attr("DN");
            var sType = $$_emlNode.attr("itemType") == null ? mType : ($$_emlNode.attr("itemType") == "group" ? "0" : "1");

            sRecDept += ";" + sType + ":" + $$_emlNode.attr("AN") + ":" + sDN.replace(/;/gi, "^"); //다국어처리
            if (sType == "0" && !bchkAbsent) {
                if ($$_emlNode.attr("hasChild") != "0") {
                    sRecDept += ":N"; //Y에서 N으로 변경, 하위부서포함 default에서 미포함으로 변경
                } else {
                    sRecDept += ":X"; //Y에서 N으로 변경, 하위부서포함 default에서 미포함으로 변경
                }
                if ($$_emlNode.attr("CHILD_CNT") != null) {
                    if (mType == 0 && $$_emlNode.attr("CHILD_CNT") == "N") {
                        sCheckBoxFormat += ";" + $$_emlNode.attr("AN") + ":";
                    }
                }
            } else {
                sRecDept += ":X";
                sRecDept += ":" + $$_emlNode.attr("RG");
            }
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

    var eTR, eTD;

    var sRec = m_RecDept.split(";");
    var aRec;
    if (m_RecDept == "") return;
    for (var i = 0; i < sRec.length; i++) {
        if (sRec[i] != "" && sRec[i] != null) {
            aRec = sRec[i].split(":");
            eTR = otbl.insertRow(otbl.rows.length);
            eTR.setAttribute("id", aRec[1]);
            eTR.setAttribute("AN", aRec[1]); //개인배포그룹추가
            eTR.setAttribute("DN", XFN_Replace(aRec[2], "^", ";")); //개인배포그룹추가
            eTR.setAttribute("mType", aRec[0]);
            eTR.setAttribute("mKind", aRec[3]);

            $(eTR).bind("mousedown", selectDistRow);

            var strName = aRec[2];
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

                if (aRec[3] == "Y") {
                    eTD.innerHTML = "<INPUT id='' Type='Checkbox' class='input_check8' "
                                    + "onclick=\"changeCheckBox('" + aRec[3] + "','" + aRec[1] + "','" + aRec[2] + "')\" style=\"padding-right=15px\" CHECKED>" + coviDic.dicMap["lbl_apv_recinfo_td2"];
                } else if (aRec[3] == "X") {
                } else {
                    if (sCheckBoxFormat.indexOf(";" + aRec[1] + ":") > -1) {
                        eTD.innerHTML = "<INPUT id='' Type='Checkbox' disabled class='input_check8' "
                                    + "onclick=\"changeCheckBox('" + aRec[3] + "','" + aRec[1] + "','" + aRec[2] + "')\" style=\"padding-right=15px\" >" + coviDic.dicMap["lbl_apv_recinfo_td2"];
                    } else {
                        eTD.innerHTML = "<INPUT id='' Type='Checkbox' class='input_check8' "
                                    + "onclick=\"changeCheckBox('" + aRec[3] + "','" + aRec[1] + "','" + aRec[2] + "')\" style=\"padding-right=15px\" >" + coviDic.dicMap["lbl_apv_recinfo_td2"];
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
        return true;
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

        // [17-03-14] kimhs, 검색 시 UI 틀어지는 현상 처리
        if (!$("#chkSearchDept").is(":checked")) {
            $("#divSearchDeptList ").css({ "display": "none" });
            $("#divSearchUserList").css({ "display": "block" });
        }
    }
}

// 검색 결과의 전체 선택 체크박스의 선택 변경시 해당 컨트롤들의 선택을 변경합니다.
function chkSearchAll_OnChange() {
    var bChecked = $("#chkSearchAll").is(":checked");

    // [17-03-20] kimhs, disabled 된 체크박스는 체크되지 않도록 :enabled 추가
    if ($("#divSearchDeptList").css("display") != "none") {
        $("input[id^='chkSearchDeptList']:enabled").attr("checked", bChecked);
    }
    else if ($("#divSearchUserSummary").css("display") != "none") {
        $("input[id^='chkSearchUserSummary']:enabled").attr("checked", bChecked);
        $("input[id^='chkSearchUserList']:enabled").attr("checked", bChecked);
    }
    else if ($("#divSearchUserList").css("display") != "none") {
        $("input[id^='chkSearchUserList']:enabled").attr("checked", bChecked);
        $("input[id^='chkSearchUserSummary']:enabled").attr("checked", bChecked);
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
    var sType = $("#hidType").val().substring(0, 1);
    
    function makeItem(oThis, arrItem, bTree){
        if (oThis.is(":checked")) {
            var item = oThis.val().replace(/&/g, "&amp;");
            arrItem.push(JSON.parse(item));
            oThis.attr("checked", false);
            if(bTree && coviOrg && coviOrg.groupTree && coviOrg.groupTree.gridCheckClick) coviOrg.groupTree.gridCheckClick(null,oThis.attr("id"));
        }
    }

    var arrItem = [], item;
    if (sType != "B") {
        // 트리
        $("input[id^='groupTree_treeCheckbox']").each(function () {
            makeItem($(this), arrItem, true);
        });
    }

    // 검색/자주선택
    if (sType != "B") {
        if ($("#divSearchDeptList").css("display") != "none") {
            $("input[id^='chkSearchDeptList']").each(function () {
                makeItem($(this), arrItem);
            });
        }
    }
    if (sType != "C") {
        if ($("#divSearchUserList").css("display") != "none") {
            $("input[id^='orgSearchList_people']").each(function () {
                makeItem($(this), arrItem);
            });
            $("input[id^='orgSearchList_dept']").each(function () {
            	makeItem($(this), arrItem);
            });
            $("input[id^='chkSearchUserSummary']").each(function () {
                if ($(this).is(":checked")) {
                    $(this).attr("checked", false);
                }
            });
        }
    }

    $("#chkSearchAll").attr("checked", false);
    
    var sMessage = "";
    var nTypeCount = new Number($("#hidType").val().substring(1, 2));
    if (nTypeCount == 1) {
        var sTemp = "";
        if (sType == "B") {
            $("textarea[id^='txtSelectedAllUser']").each(function () { sTemp += $(this).val() });
            sMessage = coviDic.dicMap["msg_apv_OrgMap03"];   // 선택목록의 임직원(사용자) 항목은 1개만 추가 할 수 있습니다.
        }
        else if (sType == "C") {
            $("textarea[id^='txtSelectedAllDept']").each(function () { sTemp += $(this).val() });
            sMessage = coviDic.dicMap["msg_apv_OrgMap04"];   // 선택목록의 부서(그룹) 항목은 1개만 추가 할 수 있습니다.
        }
        else if (sType == "D") {
            $("textarea[id^='txtSelectedAllUser']").each(function () { sTemp += $(this).val() });
            $("textarea[id^='txtSelectedAllDept']").each(function () { sTemp += $(this).val() });
            sMessage = coviDic.dicMap["msg_apv_OrgMap05"];   // 선택목록의 임직원(사용자) / 부서(그룹) 항목은 1개만 추가 할 수 있습니다.
        }

        //sTemp = "<items>" + sTemp + sXML.replace(/&/g, "&amp;") + "</items>";
        var items = {
                Items: { 
                    item: arrItem
                }
            };

        if ($$(items).find("ItemInfo").length > 1) {
            Common.Warning(sMessage);
            return;
        }
    }

    items = {
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

function assistGroup() {
    var oSelTR = getSelectedRowApvlist();
    if (oSelTR != null) {
        if (oSelTR.childNodes[step_routetype].innerHTML != "assist") {
            Common.Warning("합의자만 선택 가능 합니다.");
            return;
        }
        var oTable = document.getElementById("tblApvLine");
        oSelTR.childNodes[dp_apv_kind].innerHTML = "(분리)" + oSelTR.childNodes[dp_apv_kind].innerHTML;
    }
}

function deleteAssistGroup() {
    var oTable = document.getElementById("tblApvLine");
    var oTBody = oTable.getElementsByTagName("TBODY")[0];
    if (oTBody == null)
        return;
    for (var y = oTBody.rows.length - 1; y >= 0; y--) {
        if ($(oTBody.rows[y].childNodes[dp_apv_kind]).text().indexOf("(분리)") > -1) {
            $(oTBody.rows[y].childNodes[dp_apv_kind]).text($(oTBody.rows[y].childNodes[dp_apv_kind]).text().replace("(분리)", ""));
        }
    }
}

//--- 드래그앤 드롭 라이브러리
function ApvListDrag(s, opt, ext){
	
  var tbody = (s && typeof s === 'object' && s.tbody) ? s.tbody : s;
  var $tbody = $(tbody);

  this.dp_apv_no = 0 + CON_PRE_TD_COUNT;
  this.key_readonly = 6 + CON_PRE_TD_COUNT;
  this.init = init;
  this.set = set;
  this.get = get;
  this.start = opt && opt.start ? opt.start : null;
  this.checkback = opt && opt.checkback ? opt.checkback : null;
  this.check = check;
  this.stop = opt && opt.stop ? opt.stop : null;
  
  for(var i in ext){
  	this[i] = ext[i];
  }
  
  function set(keyname, keyvalue){
    $tbody.attr(keyname, keyvalue);
  }
  
  function get(keyname, keyvalue){
    return $tbody.attr(keyname);
  }

  function init(){    
	var me = this;
    $tbody.sortable({
      helper : fixWidthHelper,
      update: function( event, ui ) { 
        var newIndex = ui.item.index();
        var oldIndex = $(this).attr('data-previndex');
        $(this).attr('data-nextindex', newIndex);

        var way = getway(newIndex, oldIndex);
        var mustBack = me.check($(this).children().eq(newIndex), $(this).children().eq(oldIndex), way);

        if(mustBack !== ''){
          goback();
        }else{
          me.stop.apply(null, [me, event, ui.item ]);
        }
        delHistory();
      },
      start: function(e, ui) {
    	$("#Apvlist .tableStyle").css("table-layout", "fixed");

        $(this).attr('data-previndex', ui.item.index());
        if(typeof me.start === 'function'){
       // console.log(me);
          me.start.apply(null, [me, e, ui.item ]);
        }
      }
    });
  }

  function fixWidthHelper(e, ui) {
	    ui.children().each(function(i,obj) {
	    	if(i == dp_apv_no) return true;
	        $(this).width($(this).width());
	    });
	    return ui;
  }
  
  function check($new, $old, way){
    var ret = '';
    if(typeof this.checkback === 'function'){
      ret = this.checkback.apply (null, [this, $new, $old, way]);
    }
    return ret;
  }

  function getway(newIndex, oldIndex){
    var way = newIndex > oldIndex ? 'down' : 'up';
    return way;
  }
  function goback(){
    var o = $tbody;
    var oldIndex = o.attr('data-previndex');
    if(oldIndex === '') return;

    var newIndex = o.attr('data-nextindex');
    var $old = o.children().eq(oldIndex);
    var $new = o.children().eq(newIndex);
    var way = getway(newIndex, oldIndex);

    var border = $new.css('border');
    var color = $new.css('color');

    $new.css('outline', 'solid 1px #f00');
    $new.css('color', '#f00');

    $new.animate({
      opacity: 0
    }, {
      duration: 700
    });  

    setTimeout(function(){
      if(way==='down'){
        $old.before($new);
      }else{
        $old.after($new);
      }

      $new.animate({
        opacity: 1
      }, {
        duration: "slow"
      });

      setTimeout(function(){
        $new.css('color', color);
        $new.css('outline', border);
      }, 1500);

    }, 500);

  }
  function delHistory(){
    var o = $( "#tblApvLine>tbody" );
    o.removeAttr('data-previndex');
    o.removeAttr('data-nextindex');
    o.removeAttr('data-prevcount');

    $("#Apvlist .tableStyle").css("table-layout", "auto");	
  }
}

//--- 일반 결재선 드래그앤 드롭
function initApvLineDrag() {
	var dragFunc =  {
    	start : function(oInst, e, $el){
			$(".tableStyle tbody tr").css("height",41);	
			//$(".tableStyle tbody tr").css("width",430);	
			var previousReadOnlyCount = oInst.checkPrevReadonly($el);
			oInst.set('data-prevcount', previousReadOnlyCount);
		},
		checkback : function(oInst, $new, $old, way){
			if ($new.children().eq(oInst.key_readonly).text() == "True") {
				return 'B1';
			}
			
			var previousReadOnlyCount = oInst.get('data-prevcount');
			var currentReadOnlyCount = oInst.checkPrevReadonly($new);
			
			if(parseInt(previousReadOnlyCount) !== parseInt(currentReadOnlyCount)){
				return 'B2';
			}
			return '';
		},
		stop : function(oInst, event, $el){
			var nSelecter = $el.index();
			makeApvLineXml();
			document.getElementById("Apvlist").innerHTML = "";
			refreshList();
			
			var oTable = document.getElementById("tblApvLine");
			var oTBody;
			//if (oTable.childNodes.length <= 1) { colgroup 추가로 변경
			if ($(oTable).find('tbody').length <= 0) {
			    oTBody = document.createElement("TBODY");
			} else {
			    oTBody = oTable.lastChild;
			}
			var nTBodyRow = oTBody.childNodes;
			for (var j = nTBodyRow.length - 1; j >= 0; j--) {
			    if (j == nSelecter) {
			        switchSelectedRowApvlist(nTBodyRow[j]);
			    }
			}
			//re-init
			initApvLineDrag();
		}
	};
	var extFunc = {
		checkPrevReadonly: function($tr){
			if(!$tr) return 0;
			
			var idx = $tr.index();
			var readonly = 0;
			var me = this;
			$.each($tr.siblings(), function(i){
				if(i===idx) return false;
				if($(this).children().eq(me.key_readonly).text() == "True") readonly++;
			});
			return readonly;
		}
	}
	var BaseApvListDrag = new ApvListDrag('#tblApvLine>tbody', dragFunc, extFunc);
	BaseApvListDrag.init();
}

//JAL-소스위치이동
$(window).load(function () {
    //결재선목록처리
    initialize();
    //일반 결재선 드래그앤 드롭
    //initApvLineDrag();
    $('#btDown, #btUp').on('click', function(){
        //initApvLineDrag();
    });
});
$(document).mousedown(function(e){
	if($("#dvCommonList").css('display')!='none'){
		var btnList = $("#dvCommonList");
		
		if (!btnList.is(e.target) && btnList.has(e.target).length === 0){
			btnList.css("display","none");
		}
	}
});


/** ApvlineMgr.js 용 리소스 파일 변수 Start  **/
Common.getDicList(["lbl_apv_global","lbl_apv_app","lbl_apv_recieve_apv","lbl_apv_authorize","lbl_apv_substitue"
                     ,"lbl_apv_audit_fulltime","lbl_apv_audit_daily","lbl_apv_assist","lbl_apv_assist_2","lbl_apv_after","lbl_apv_inactive"
                     ,"lbl_apv_NoApprvl","lbl_apv_normalapprove","lbl_apv_review","lbl_apv_hold","lbl_apv_Par","lbl_apv_PersonalCon"
                     ,"lbl_apv_PublicInspect","lbl_apv_SendInfo","lbl_apv_Seq","lbl_apv_writer"
                     ,"lbl_apv_charge_approve","lbl_apv_ChargeDept_Rec","lbl_apv_DistributeList_Rec","lbl_apv_DeptConsent","lbl_apv_DeptConsent_2"
                     ,"lbl_apv_DAsist","lbl_apv_dept_audit","lbl_apv_dept_audit3","lbl_apv_watch","lbl_apv_ref","lbl_apv_circulation_sent"
                     ,"lbl_apv_comment","msg_apv_029","msg_apv_033","msg_apv_042","msg_apv_044","msg_apv_046","msg_apv_047","msg_apv_048"
                     ,"msg_apv_049","msg_apv_050","msg_apv_051","msg_apv_052","msg_apv_054","msg_apv_055","msg_apv_056"
                     ,"msg_apv_058","msg_apv_121","msg_apv_124","msg_apv_125","msg_apv_149","msg_apv_177","msg_apv_179"
                     ,"msg_apv_181","msg_apv_186","msg_apv_187","msg_apv_188","msg_apv_254","msg_apv_254","msg_apv_259","msg_apv_276"
                     ,"msg_apv_304","msg_apv_343","msg_apv_348","msg_apv_355","lbl_apv_ExtType","lbl_apv_person_audit","lbl_apv_ChargeDept"
                     ,"lbl_apv_charge_person","lbl_apv_receive","lbl_apv_PersonConsent"
                     ,"msg_lbl_Committee","lbl_apv_DeptAssist","lbl_apv_DeptAssist2","btn_apv_dept_audit","btn_apv_person_audit"
                     ,"lbl_apv_DeptApprv","lbl_apv_consent","lbl_apv_audit","lbl_apv_investigation","lbl_apv_bypass","lbl_apv_charge","lbl_apv_Confidential"
                     ,"lbl_apv_forward","lbl_apv_share4list","lbl_apv_ExtType_agree","btn_apv_draft","lbl_apv_ExtType_disagree","lbl_apv_reject"
                     ,"lbl_apv_disagree","btn_apv_delete","btn_apv_ccinfo_before","btn_apv_ccinfo_after","btn_PersonalApvLine","msg_apv_input_privateDomainData"
                     ,"msg_apv_setFormRuleErrorMsg","msg_apv_Line_UnSelect","msg_apv_chkAuthorize","msg_apv_chkAudit","msg_apv_057","msg_apv_359","msg_apv_173"
                     ,"msg_apv_358","msg_AlreadyRegisted","msg_apv_addRecDept","lbl_apv_recinfo_td2","msg_apv_OrgMap01","msg_Common_07","msg_apv_OrgMap03","msg_apv_OrgMap04","msg_apv_OrgMap05"
                     ,"lbl_apv_Confirm","lbl_apv_confirmed","apv_btn_rule","lbl_ApprovalLine","lbl_apv_change","lbl_apv_cc","lbl_below","msg_apv_notAddCCPerson", "msg_apv_notAddCCDept"]);

var strlable_global = coviDic.dicMap["lbl_apv_global"];
var strlable_apv = coviDic.dicMap["lbl_apv_app"];
var strlable_recieve_apv = coviDic.dicMap["lbl_apv_recieve_apv"];
var strlable_authorize = coviDic.dicMap["lbl_apv_authorize"];
var strlable_substitue = coviDic.dicMap["lbl_apv_substitue"];
var strlable_audit_fulltime = coviDic.dicMap["lbl_apv_audit_fulltime"];
var strlable_audit_daily = coviDic.dicMap["lbl_apv_audit_daily"];
var strlable_assist = coviDic.dicMap["lbl_apv_assist"];
var strlable_after = coviDic.dicMap["lbl_apv_after"];
var strlable_inactive = coviDic.dicMap["lbl_apv_inactive"];
var strlable_NoApprvl = coviDic.dicMap["lbl_apv_NoApprvl"];
var strlable_normalapprove = coviDic.dicMap["lbl_apv_normalapprove"];
var strlable_review = coviDic.dicMap["lbl_apv_review"];
var strlable_hold = coviDic.dicMap["lbl_apv_hold"];
var strlable_Par = coviDic.dicMap["lbl_apv_Par"];
var strlable_Seq = coviDic.dicMap["lbl_apv_Seq"];
var strlable_Seq1 = coviDic.dicMap["lbl_apv_assist"];
var strlable_Par1 = coviDic.dicMap["lbl_apv_assist_2"];
var strlable_PersonalCon = coviDic.dicMap["lbl_apv_PersonalCon"];
var strlable_PublicInspect = coviDic.dicMap["lbl_apv_PublicInspect"];
var strlable_SendInfo = coviDic.dicMap["lbl_apv_SendInfo"];
var strlable_writer = coviDic.dicMap["lbl_apv_writer"];
var strlable_charge_approve = coviDic.dicMap["lbl_apv_charge_approve"];
var strlable_ChargeDept_Rec = coviDic.dicMap["lbl_apv_ChargeDept_Rec"];
var strlable_DistributeList_Rec = coviDic.dicMap["lbl_apv_DistributeList_Rec"];
var strlable_DeptConsent = coviDic.dicMap["lbl_apv_DeptConsent"];
var strlable_DeptConsent2 = coviDic.dicMap["lbl_apv_DeptConsent_2"];
var strlable_DAsist = coviDic.dicMap["lbl_apv_DeptAssist"];
var strlable_DAsist2 = coviDic.dicMap["lbl_apv_DeptAssist2"];
var strlable_dept_audit = coviDic.dicMap["lbl_apv_dept_audit"];
var strlable_dept_audit3 = coviDic.dicMap["lbl_apv_dept_audit3"];
var strlable_watch = coviDic.dicMap["lbl_apv_watch"];
var strlable_ref = coviDic.dicMap["lbl_apv_ref"];
var strlable_circulation_sent = coviDic.dicMap["lbl_apv_circulation_sent"];
var strlable_comment = coviDic.dicMap["lbl_apv_comment"];
/** ApvlineMgr.js 용 리소스 파일 변수 End **/
var strMsg_029 = coviDic.dicMap["msg_apv_029"];
var strMsg_033 = coviDic.dicMap["msg_apv_033"];
var strMsg_042 = coviDic.dicMap["msg_apv_042"];
var strMsg_044 = coviDic.dicMap["msg_apv_044"];
var strMsg_046 = coviDic.dicMap["msg_apv_046"];
var strMsg_047 = coviDic.dicMap["msg_apv_047"];
var strMsg_048 = coviDic.dicMap["msg_apv_048"];
var strMsg_049 = coviDic.dicMap["msg_apv_049"];
var strMsg_050 = coviDic.dicMap["msg_apv_050"];
var strMsg_051 = coviDic.dicMap["msg_apv_051"];
var strMsg_052 = coviDic.dicMap["msg_apv_052"];
var strMsg_054 = coviDic.dicMap["msg_apv_054"];
var strMsg_055 = coviDic.dicMap["msg_apv_055"];
var strMsg_056 = coviDic.dicMap["msg_apv_056"];
var strMsg_058 = coviDic.dicMap["msg_apv_058"];
var strMsg_121 = coviDic.dicMap["msg_apv_121"];
var strMsg_124 = coviDic.dicMap["msg_apv_124"];
var strMsg_125 = coviDic.dicMap["msg_apv_125"];
var strMsg_149 = coviDic.dicMap["msg_apv_149"];
var strMsg_177 = coviDic.dicMap["msg_apv_177"];
var strMsg_179 = coviDic.dicMap["msg_apv_179"];
var strMsg_181 = coviDic.dicMap["msg_apv_181"];
var strMsg_186 = coviDic.dicMap["msg_apv_186"];
var strMsg_187 = coviDic.dicMap["msg_apv_187"];
var strMsg_188 = coviDic.dicMap["msg_apv_188"];
var strMsg_254 = coviDic.dicMap["msg_apv_254"];
var strMsg_255 = coviDic.dicMap["msg_apv_255"];
var strMsg_259 = coviDic.dicMap["msg_apv_259"];
var strMsg_304 = coviDic.dicMap["msg_apv_304"];
var strMsg_348 = coviDic.dicMap["msg_apv_348"];
var strMsg_355 = coviDic.dicMap["msg_apv_355"];
var strMsg_RuleError = coviDic.dicMap["msg_apv_setFormRuleErrorMsg"];

var gHasPrivateLines = false;
var gDeputyType = "";

var gRequestDivisionLimit = Common.getBaseConfig("RequestDivisionLimit");
//결재자 선택 관련 종료

//결재선 정보 변수 선언
//const CON_PRE_TD_COUNT = 1; //앞에서 부터 추가된 열(column)의 수   //[IE 10 이상 const 사용 오류]
var CON_PRE_TD_COUNT = 1; 		//앞에서 부터 추가된 열(column)의 수. 선언 이외의 곳에서 값 변경 X

var dp_apv_checkbox = 0;
var dp_apv_no = 0 + CON_PRE_TD_COUNT;
var dp_apv_username = 1 + CON_PRE_TD_COUNT;
var dp_apv_state = 2 + CON_PRE_TD_COUNT;
var dp_apv_kind = 3 + CON_PRE_TD_COUNT;
var dp_apv_approvdate = 4 + CON_PRE_TD_COUNT;
var key_displayonly = 5 + CON_PRE_TD_COUNT;
var key_readonly = 6 + CON_PRE_TD_COUNT;
var key_description = 7 + CON_PRE_TD_COUNT;
var division_seq = 8 + CON_PRE_TD_COUNT;
var division_divisiontype = 9 + CON_PRE_TD_COUNT;
var division_name = 10 + CON_PRE_TD_COUNT;
var division_oucode = 11 + CON_PRE_TD_COUNT;
var division_ouname = 12 + CON_PRE_TD_COUNT;
var division_taskinfo_status = 13 + CON_PRE_TD_COUNT;
var division_taskinfo_result = 14 + CON_PRE_TD_COUNT;
var division_taskinfo_kind = 15 + CON_PRE_TD_COUNT;
var division_taskinfo_datereceived = 16 + CON_PRE_TD_COUNT;
var division_taskinfo_datecompleted = 17 + CON_PRE_TD_COUNT;
var step_seq = 18 + CON_PRE_TD_COUNT;
var step_unittype = 19 + CON_PRE_TD_COUNT;
var step_routetype = 20 + CON_PRE_TD_COUNT;
var step_allottype = 21 + CON_PRE_TD_COUNT;
var step_name = 22 + CON_PRE_TD_COUNT;
var step_taskinfo_status = 23 + CON_PRE_TD_COUNT;
var step_taskinfo_result = 24 + CON_PRE_TD_COUNT;
var step_taskinfo_kind = 25 + CON_PRE_TD_COUNT;
var step_taskinfo_datereceived = 26 + CON_PRE_TD_COUNT;
var step_taskinfo_datecompleted = 27 + CON_PRE_TD_COUNT;
var ou_seq = 28 + CON_PRE_TD_COUNT;
var ou_code = 29 + CON_PRE_TD_COUNT;
var ou_name = 30 + CON_PRE_TD_COUNT;
var ou_taskinfo_status = 31 + CON_PRE_TD_COUNT;
var ou_taskinfo_result = 32 + CON_PRE_TD_COUNT;
var ou_taskinfo_kind = 33 + CON_PRE_TD_COUNT;
var ou_taskinfo_datereceived = 34 + CON_PRE_TD_COUNT;
var ou_taskinfo_datecompleted = 35 + CON_PRE_TD_COUNT;
var ou_taskinfo_piid = 36 + CON_PRE_TD_COUNT;
var roleperson_seq = 37 + CON_PRE_TD_COUNT;
var roleperson_nodetype = 38 + CON_PRE_TD_COUNT;
var roleperson_code = 39 + CON_PRE_TD_COUNT;
var roleperson_name = 40 + CON_PRE_TD_COUNT;
var roleperson_position = 41 + CON_PRE_TD_COUNT;
var roleperson_title = 42 + CON_PRE_TD_COUNT;
var roleperson_level = 43 + CON_PRE_TD_COUNT;
var roleperson_oucode = 44 + CON_PRE_TD_COUNT;
var roleperson_ouname = 45 + CON_PRE_TD_COUNT;
var roleperson_sipaddress = 46 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_status = 47 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_result = 48 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_kind = 49 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_datereceived = 50 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_datecompleted = 51 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_rejectee = 52 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_wiidrejectedto = 53 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_daterejectedto = 54 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_wiid = 55 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_visible = 56 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_customattribute1 = 57 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_customattribute2 = 58 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_comment_relatedresult = 59 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_comment_datecommented = 60 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_comment = 61 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_commentLast = 62 + CON_PRE_TD_COUNT;
var roleperson_person_code = 63 + CON_PRE_TD_COUNT;
var roleperson_person_name = 64 + CON_PRE_TD_COUNT;
var roleperson_person_position = 65 + CON_PRE_TD_COUNT;
var roleperson_person_title = 66 + CON_PRE_TD_COUNT;
var roleperson_person_level = 67 + CON_PRE_TD_COUNT;
var roleperson_person_oucode = 68 + CON_PRE_TD_COUNT;
var roleperson_person_ouname = 69 + CON_PRE_TD_COUNT;
var roleperson_taskinfo_mobilegubun = 70 + CON_PRE_TD_COUNT;   //모바일 결재 여부
var roleperson_person_nodetype = 71 + CON_PRE_TD_COUNT;		// role - 부서장 결재단계 - taskinfo 이후에 person 유지값 중 nodename(role,person...) , sipaddress가 없어서 추가
var roleperson_person_sipaddress = 72 + CON_PRE_TD_COUNT;	// role - 부서장 결재단계 - taskinfo 이후에 person 유지값 중 nodename(role,person...) , sipaddress가 없어서 추가
var dp_apv_delete_button = 73 + CON_PRE_TD_COUNT;	// 삭제 버튼 추가.
var roleperson_taskinfo_comment_fileinfo = 74 + CON_PRE_TD_COUNT; // 의견첨부 정보
var step_ruleapvclass = 75 + CON_PRE_TD_COUNT;
var step_ruleapvclassatt01 = 76 + CON_PRE_TD_COUNT;
//결재선 정보 변수 선언 종료

//참조 정보 변수 선언 시작
var dp_cc_beforecc = 0;
var dp_cc_username = 1;
var ccinfo_belongto = 2;
var ccinfo_beforecc = 3;
var ccinfo_datereceived = 4;
var ccinfo_ou_code = 5;
var ccinfo_ou_name = 6;
var ccinfo_person_code = 7;
var ccinfo_person_name = 8;
var ccinfo_person_position = 9;
var ccinfo_person_title = 10;
var ccinfo_person_level = 11;
var ccinfo_person_oucode = 12;
var ccinfo_person_ouname = 13;
var ccinfo_person_sipaddress = 14;
var ccinfo_delete_button = 15; //삭제 버튼 추가
var ccinfo_sender_id = 16;
var ccinfo_sender_name = 17;
 //참조 정보 변수 선언 끝
