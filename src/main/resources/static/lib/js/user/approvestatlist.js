//
var gApvList = "";
var strTimeZoneDisplay = Common.getSession("UR_TimeZoneDisplay");
var bPresenceView;
var cmtid =0;
var cmtGid = 0;
//개별호출 일괄호 변경
Common.getDicList(["lbl_apv_global","lbl_apv_app","lbl_apv_recieve_apv","lbl_apv_authorize","lbl_apv_substitue"
                                       ,"lbl_apv_audit_fulltime","lbl_apv_audit_daily","lbl_apv_assist","lbl_apv_after","lbl_apv_inactive"
                                       ,"lbl_apv_NoApprvl","lbl_apv_normalapprove","lbl_apv_review","lbl_apv_hold","lbl_apv_Par","lbl_apv_PersonalCon"
                                       ,"lbl_apv_PublicInspect","lbl_apv_SendInfo","lbl_apv_Seq","lbl_apv_writer","lbl_apv_oriapprover"
                                       ,"lbl_apv_charge_approve","lbl_apv_ChargeDept_Rec","lbl_apv_DistributeList_Rec","lbl_apv_DeptConsent"
                                       ,"lbl_apv_DAsist","lbl_apv_dept_audit","lbl_apv_dept_audit3","lbl_apv_watch","lbl_apv_ref","lbl_apv_circulation_sent"
                                       ,"lbl_apv_comment","msg_apv_029","msg_apv_033","msg_apv_042","msg_apv_044","msg_apv_046","msg_apv_047","msg_apv_048"
                                       ,"msg_apv_049","msg_apv_050","msg_apv_051","msg_apv_052","msg_apv_054","msg_apv_055","msg_apv_056"
                                       ,"msg_apv_058","msg_apv_121","msg_apv_124","msg_apv_125","msg_apv_149","msg_apv_177","msg_apv_179"
                                       ,"msg_apv_181","msg_apv_186","msg_apv_187","msg_apv_188","msg_apv_254","msg_apv_254","msg_apv_259","msg_apv_276"
                                       ,"msg_apv_304","msg_apv_343","msg_apv_348","msg_apv_355","lbl_apv_ExtType","lbl_apv_person_audit","lbl_apv_ChargeDept"
                                       ,"lbl_apv_charge_person","lbl_apv_receive","lbl_apv_deptconsent_parallel","lbl_apv_PersonConsent"
                                       ,"msg_lbl_Committee","lbl_apv_deptassist_parallel","lbl_apv_DeptAssist","btn_apv_dept_audit","btn_apv_person_audit"
                                       ,"lbl_apv_DeptApprv","lbl_apv_consent","lbl_apv_audit","lbl_apv_investigation","lbl_apv_bypass","lbl_apv_charge","lbl_apv_Confidential"
                                       ,"lbl_apv_forward","lbl_apv_share4list","lbl_apv_ExtType_agree","btn_apv_draft","lbl_apv_ExtType_disagree","lbl_apv_reject"
                                       ,"lbl_apv_disagree","btn_apv_delete","btn_apv_ccinfo_before","btn_apv_ccinfo_after","btn_PersonalApvLine","msg_apv_input_privateDomainData"
                                       ,"lbl_apv_no","lbl_apv_username","lbl_apv_dept","lbl_apv_state","lbl_apv_kind","btn_apv_apv","lbl_apv_day","btn_apv_receive","lbl_apv_setschema_102","lbl_apv_Draft","btn_apv_receipt","lbl_apv_confirmed"
                                       ,"lbl_apv_serial","lbl_apv_parallel","lbl_apv_person","lbl_apv_tit_consent","lbl_apv_Acceptdept","lbl_apv_reject_consent"
                                       ,"lbl_apv_DeptConsent_2","lbl_apv_DeptAssist2","btn_apv_consultors","btn_apv_consultors_2","lbl_apv_assist_2","btn_apv_person_audit1"
                                       ,"lbl_apv_Confirm","lbl_apv_confirmor"]);

function getList(data) {
   gApvList = getListHeader();
   receiveHTTPList(data);
   document.getElementById("ListDiv").innerHTML = gApvList + "</table>";
}

function getListHeader() {
	var rtnValue = "";
	rtnValue += "<table border='0' cellpadding='0' cellspacing='0' class='listLinePlus' style='width:624px;text-align: center;'>";
    rtnValue += "<colgroup>";
    rtnValue += "<col id='number' />";
    rtnValue += "<col id='name' />";
    rtnValue += "<col id='condition' />";
    rtnValue += "<col id='kind' />";
    rtnValue += "<col id='date' />";
    rtnValue += "<col id='date2' />";
    rtnValue += "<col id='mobile' />";  //모바일결재
    rtnValue += "</colgroup>";
    rtnValue += "<thead>";
    rtnValue += "<tr>";
    rtnValue += "<th scope='col'><span class='table_top_last'>" + coviDic.dicMap["lbl_apv_no"] + "</span></th>"; //<!--순번-->
    rtnValue += "<th scope='col' ><span class='table_top'>" + coviDic.dicMap["lbl_apv_username"] + " (" + coviDic.dicMap["lbl_apv_dept"] + " )" + "</span></th>"; //<!--이름/직책/직위-->
    rtnValue += "<th scope='col'><span class='table_top'>" + coviDic.dicMap["lbl_apv_state"] + "</span></th>"; //<!--상태-->
    rtnValue += "<th scope='col'><span class='table_top'>" + coviDic.dicMap["lbl_apv_kind"] + "</span></th>";  //<!--종류-->
    rtnValue += "<th scope='col'><span class='table_top'>" + coviDic.dicMap["btn_apv_apv"] + coviDic.dicMap["lbl_apv_day"] + "<br/>" + strTimeZoneDisplay + "</span></th>";    //<!--결재일-->
    rtnValue += "<th scope='col'><span class='table_top'>" + coviDic.dicMap["btn_apv_receive"] + coviDic.dicMap["lbl_apv_day"] + "<br/>" + strTimeZoneDisplay + "</span></th>";    //<!--수신일-->
    //rtnValue += "<th scope='col'><span class='table_top'>" + coviDic.dicMap["lbl_apv_comment") + "</span></th>";   //<!--의견-->
    rtnValue += "<th scope='col'><span class='table_top'>" + coviDic.dicMap["lbl_apv_setschema_102"] + "</span></th>";   //<!--모바일결재--> lbl_Mobile
    rtnValue += "</tr>";
    rtnValue += "</thead>";
    return rtnValue;
}


function receiveHTTPList(data) {
//  var xmlReturn = data;
//  alert("xmlReturn: "+xmlReturn);
  var oApvList = JSON.parse(data);
	//var oApvList = data;
//  if (xmlReturn == "") { m_oApvList = $.parseXML("<?xml version='1.0' encoding='utf-8'?><steps/>"); return; }
//  document.getElementById("APVLIST").value = dataresponseXML;
//  m_oApvList = $.parseXML("<?xml version='1.0' encoding='utf-8'?>" + xmlReturn);
//
//  var errorNode = $(m_oApvList).find("error");
//  if (errorNode.length > 0) {
//      m_oApvList.loadXML("<?xml version='1.0' encoding='utf-8'?><steps/>");
//      Common.Error("Desc: " + errorNode.text);
//      return;
//  }
  var ApvListDisplayOrder = "DESC";
  var szLIST = "";
  var didx = 1;
  var $$_elmList = $$(oApvList).find("steps > division");
  $$_elmList.concat().each(function (index_div, $$_odiv) {
      var $$_osteps = $$_odiv.find("step");
      var $$_ohiddensteps = $$_odiv.find("step > taskinfo[visible='n']");
      if ($$_elmList.valLength() > 1) {
          //var sHTML = calltemplatehtmlrow((index_div + 1), viewtype, $$_odiv.find("taskinfo"), "True");
          //if (ApvListDisplayOrder == "DESC") { szLIST = sHTML + szLIST; } else { szLIST = szLIST + sHTML; }
          var sHTML = calltemplatehtmlrow("division[" + index_div + "]", (index_div + 1),
        		  $$_odiv.attr("name"), ";", ";", $$_odiv.find(">taskinfo"), ($$_odiv.attr("ouname") == null) ? "" : $$_odiv.attr("ouname"), "");
              if (ApvListDisplayOrder == "DESC") { szLIST = sHTML + szLIST; } else { szLIST = szLIST + sHTML; }
      }
      $$_odiv.find("step").concat().each(function (index_step, ostep) {
          var osteptaskinfo = $$(ostep).find("taskinfo");
          if (osteptaskinfo == null || $$(osteptaskinfo).attr("visible") != 'n') {
              var steproutetype = $$(ostep).attr("routetype");
              var stepunittype = $$(ostep).attr("unittype");
              var stepallottype = $$(ostep).attr("allottype");
              var assureouvisible = "";
              if (steproutetype == "notify") {
              } else {
                  if (stepunittype == "ou" && (steproutetype == "assist" || steproutetype == "consult" || steproutetype == "receive" || steproutetype == "audit")) assureouvisible = "true";
                  var oous = $$(ostep).find("ou");
                  var ohiddenoous = $$(ostep).find("ou > taskinfo[visible='n']");
                  //$$_ostep.find("ou").concat().each(function (index_ou, oou) {
                  $$(ostep).find("ou").concat().each(function (index_ou, oou) { //----
                      var ooutaskinfo = $$(oou).find(">taskinfo");
                      var opersons = $$(oou).find("person", "role");
                      var ohiddenpersons = $$(oou).find("person > taskinfo[visible='n']", "role > taskinfo[visible='n']");
                      var p_steproutetype = steproutetype;    // [2015-08-03 han modi] 수신부서일때도 결재현황보기에 결재선 펼침버튼이 나와서
                      var cntvisibleperson = opersons.length - ohiddenpersons.length;
                     // if ((stepunittype != 'person' && cntvisibleperson == 0) || (cntvisibleperson > 0 && assureouvisible == 'true')) { //====
                      if (stepunittype == "ou" && (steproutetype == "assist" || steproutetype == "consult")) {
                          if (!ooutaskinfo.exist() || $$(ooutaskinfo).attr("visible") != 'n') {
                              var index_total = dblDigit(index_div + 1);
                              index_total += ((index_total != "") ? "." : "") + dblDigit(index_step + 1 - $$_ohiddensteps.length);
                              if (oous.length > 1) {
                                  index_total += ((index_total != "") ? "." : "") + dblDigit(index_ou + 1 - $$_ohiddensteps.length);
                              }
                              // 결재선 ROW 가져오기
                              // [2015-08-03 han modi] 수신부서일때도 결재현황보기에 결재선 펼침버튼이 나와서 , 병렬일 경우 index에 오류가있어서
                              //var sHTML = calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]", index_total,
                              //    $(oou).attr("name"), "", "", $(oou).find("taskinfo"), $(oou).attr("name"), "", "ou","");
                              var sHTML = calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]", index_total,
                                  $$(oou).attr("name"), "", "", ooutaskinfo, $$(oou).attr("name"), "", "ou", "", p_steproutetype, oous.length);

                              if (ApvListDisplayOrder == "DESC") { szLIST = sHTML + szLIST; } else { szLIST = szLIST + sHTML; }
                              didx++;
                          }
                      }
                      $$(oou).find("person", "role").concat().each(function (index_person, operson) {
                          var otaskinfo = $$(operson).find("taskinfo");
                          //role인경우 처리
                          if (otaskinfo.length == 0) {
                              otaskinfo = $$(operson.parentNode).find("taskinfo");
                              operson = operson.parentNode;
                          }
                          var index_total = dblDigit(index_div + 1);
                          index_total += ((index_total != "") ? "." : "") + dblDigit(index_step + 1 - $$_ohiddensteps.length);
                          if ((stepunittype == 'person' && cntvisibleperson > 1)) {
                              index_total += ((index_total != "") ? "." : "") + dblDigit(index_person + 1 - $$_ohiddensteps.length);
                          } else {
                              if (stepunittype != 'person') {
                                  if (stepallottype == "parallel") index_total += ((index_total != "") ? "." : "") + dblDigit(index_ou + 1 - ohiddenoous.length)
                                  index_total += ((index_total != "") ? "." : "") + dblDigit(index_person + 1 - ohiddenpersons.length);
                              }
                          }
                          if ($$(otaskinfo).attr("visible") != 'n') {
                              var displayname = "";
                              var title = "";
                              var level = "";
                              var oudisplayname = "";
                              var code = "";
                              var oroleperson = null;
                              if (operson.nodeName == "role") {
                                  displayname = $$(operson).attr("name");
                                  oudisplayname = $$(operson).attr("ouname");
                                  code = $$(operson).attr("code");
                              } else {
                                  displayname = getPresence($$(operson).attr("code"), CFN_GetDicInfo($$(operson).attr("name")), $$(operson).attr("sipaddress")) + CFN_GetDicInfo($$(operson).attr("name"));
                                  title = $$(operson).attr("title");
                                  level = $$(operson).attr("position");
                                  oudisplayname = $$(operson).attr("ouname");
                                  code = $$(operson).attr("code");
                              }
                              // 결재선 ROW 가져오기
                              var sHTML = "";
                              // 대결자 표시를 위해 대결자 정보 가져옴
                              if ($$(otaskinfo).attr("kind") == "substitute") {
                                  var sBypassPerson = DisBypassPerson(CFN_GetDicInfo($$(operson).next().attr("name")), $$(operson).next().attr("title"), $$(operson).next().attr("position"), $$(operson).next().attr("ouname"));

                                  //[2015-07-21 add kh] 원결재자 - 후열 표시 s ----------------------------
                                  if ('' != sBypassPerson) {
                                      var setByPassPerson = getPresence($$(operson).next().attr("code"), CFN_GetDicInfo($$(operson).next().attr("name")), $$(operson).next().attr("sipaddress")) + CFN_GetDicInfo($$(operson).next().attr("name"));
                                      setByPassPerson = DisBypassPerson(setByPassPerson, $$(operson).next().attr("title"), $$(operson).next().attr("position"), $$(operson).next().attr("ouname"));

                                      sHTML += "<tr>";
                                      sHTML += "<td> - </td>";
                                      sHTML += "<td style='overflow: hidden; text-overflow: ellipsis;'><span class='talign_l'>" + setByPassPerson + "</span></td>"; // [16-03-31] kimhs, white-space: nowrap; 속성제거
                                      sHTML += "<td>" + coviDic.dicMap["lbl_apv_bypass"] + "</td>";
                                      sHTML += "<td>" + coviDic.dicMap["lbl_apv_oriapprover"] + "</td>";
                                      sHTML += "<td> - </td>"; //결재일자
                                      sHTML += "<td> - </td>"; // 받은일시
                                      sHTML += "<td></td>"; //모바일 결재 여부
                                      sHTML += "</tr>";

                                      // // [2015-08-03 han modi] 병렬일 경우 index에 오류가있어서
                                      //sHTML += calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]/(person|role)[" + index_person + "]", index_total,
                                      //    displayname, title, level, otaskinfo, oudisplayname, code, stepunittype, sBypassPerson);
                                      sHTML += calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]/(person|role)[" + index_person + "]", index_total,
                                          displayname, title, level, otaskinfo, oudisplayname, code, stepunittype, sBypassPerson, "", oous.length);

                                  }   //[2015-07-21 add kh] 원결재자 - 후열 표시 e ----------------------------
                                  else {

                                      // [2015-08-03 han modi] 병렬일 경우 index에 오류가있어서
                                      //sHTML = calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]/(person|role)[" + index_person + "]", index_total,
                                      //displayname, title, level, otaskinfo, oudisplayname, code, stepunittype, sBypassPerson);
                                      sHTML = calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]/(person|role)[" + index_person + "]", index_total,
                                      displayname, title, level, otaskinfo, oudisplayname, code, stepunittype, sBypassPerson, "", oous.length);

                                  }
                              }
                              else {

                                  // [2015-08-03 han modi] 병렬일 경우 index에 오류가있어서
                                  //sHTML = calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]/(person|role)[" + index_person + "]", index_total,
                                  //displayname, title, level, otaskinfo, oudisplayname, code, stepunittype, "");
                                  sHTML = calltemplatehtmlrow("division[" + index_div + "]/step[" + index_step + "]/ou[" + index_ou + "]/(person|role)[" + index_person + "]", index_total,
                                  displayname, title, level, otaskinfo, oudisplayname, code, stepunittype, "", "", oous.length);

                              }

                              if (ApvListDisplayOrder == "DESC") {
                                  szLIST = sHTML + szLIST;
                              }
                              else {
                                  szLIST = szLIST + sHTML;
                              }
                              didx++;

                          }
                      });
                  });
              }
          }
      });
  });
  gApvList += "<tbody>" + szLIST + "</tbody>";

}

//리스트 표시
function calltemplatehtmlrow(itemid, index, displayname, title, level, itemtaskinfo, oudisplayname, person_code, stepunittype, tBypassPerson, p_steproutetype, oousLen) {
    var rtnValue = "";
    var szcustomattribute2 = "";
    var skind = itemtaskinfo.attr("kind");
    var sMobile = "";
    var tempUserName = displayname;            // 사용자 이름

    if (itemtaskinfo.attr("mobileType") != null) {  //모바일 결재 여부
        // 20150506 LeeSM 모바일결재 y -> O 로 변경
        sMobile = "O";
    }

    if (itemtaskinfo.parent().parent().parent().nodename() == "step") szcustomattribute2 = itemtaskinfo.parent().parent().parent().attr("name");
    //if (itemtaskinfo.parent().parent().parent().nodeName == "step") szcustomattribute2 = itemtaskinfo.parent().parent().parent().attr("name");

    //if (person_code == "") var tempUserName = CFN_GetDicInfo(displayname); // 부서이름
    //else {     // 프리젠스 추가 필요(person_code)
    //var tempUserName = "<a href = '#'><img src='/Images/Images/common/Btn/ico_x02.gif' style='margin-top:-1px; margin-right:3px;' /></a>";
    if (title != "") {
        if (title != ";") {
            tempUserName += " (" + splitName(title);           // 직책
            tempUserName += "," + splitName(level);      // 직위
            tempUserName += "," + CFN_GetDicInfo(oudisplayname) + ")";      // 부서
        }
    } else {
        if (itemtaskinfo.parent().eq(0).nodename() == "role") {
            tempUserName += " (" + CFN_GetDicInfo(itemtaskinfo.parent().eq(0).find("person").attr("name")) + ")";
        }
/*        if (itemtaskinfo.parent()[0].nodename() == "role") {
        	tempUserName += " (" + CFN_GetDicInfo($(itemtaskinfo.parent()[0]).find("person").attr("name")) + ")";
        }
*/    }
    //
    var tmpindex = "";
    //합의부서 +,- 추가
    //대결자 리스트에서 제외
    if (skind != "bypass") {
        if (person_code != "" && stepunittype == "ou") {
            tmpindex = index.split(".");
            index = tmpindex[0] + "." + tmpindex[1];

            // [2015-08-03 han modi] 병렬일 경우 index에 오류가있어서
            if (oousLen > 1 && tmpindex.length > 2) {
                index += "." + tmpindex[2];
            }

            var trId = "tr_" + index;
            //var trId = "tr_" + String(index).replace("." + String(index).split(".")[String(index).split(".").length - 1], "");
            rtnValue += "<tr id='" + trId + "' name='" + trId + "'  style='display:none;background-color:lightyellow;'>";
        } else {
            rtnValue += "<tr>";
        }

        if (person_code == "" && stepunittype == "ou") {

            // [2015-08-03 han modi] 수신부서일때도 결재현황보기에 결재선 펼침버튼이 나와서
            //rtnValue += "<td>" + "<div class='olist_plus' onclick=\"fnDisplayPerson('tr_" + index + "','div_" + index + "')\" id='div_" + index + "'><a href='#'></a></div><div class='olist_num'>" + getDotCountSpace(String(index).split(".")[String(index).split(".").length - 1]); +"</div></td>";
            if (p_steproutetype == "assist" || p_steproutetype == "consult" || p_steproutetype == "audit") {
                rtnValue += "<td>" + "<div class='olist_plus' onclick=\"fnDisplayPerson('tr_" + index + "','div_" + index + "')\" id='div_" + index + "'><a href='#'></a></div><div class='olist_num'>" + getDotCountSpace(String(index).split(".")[String(index).split(".").length - 1]) +"</div></td>";
            } else {
                rtnValue += "<td>" + "<div class='olist_num'>" + getDotCountSpace(String(index).split(".")[String(index).split(".").length - 1]) +"</div></td>";
            }

            tempUserName = CFN_GetDicInfo(tempUserName);
        } else {
            if (skind == "substitute") {
                tmpindex = index.split(".");
                index = tmpindex[0] + "." + tmpindex[1];

                // [2015-08-03 han modi] 병렬일 경우 index에 오류가있어서
                if (oousLen > 1 && tmpindex.length > 2) {
                    index += "." + tmpindex[2];
                }

            }
            if (itemtaskinfo.parent().eq(0).nodename() == "role") { //부서장결재일 경우 순번표시 개선
                rtnValue += "<td>" + getDotCountSpace(String(index).substring(0, String(index).lastIndexOf("."))) +"</td>";
            } else {
                rtnValue += "<td>" + getDotCountSpace(String(index)) +"</td>";
            }
        }
        if (skind == "substitute") {    //대결
            //[2015-07-21 add kh] 원결재자
            //rtnValue += "<td style='overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' title='원결재자: " + tBypassPerson + "'><span class='talign_l'>" + tempUserName + "</span></td>";
            rtnValue += "<td style='overflow: hidden; text-overflow: ellipsis;' ><span class='talign_l'>" + tempUserName + "</span></td>"; // [16-03-31] kimhs, white-space: nowrap; 속성제거
        }
        else {
            rtnValue += "<td style='overflow: hidden; text-overflow: ellipsis;'><span class='talign_l'>" + tempUserName + "</span></td>"; // [16-03-31] kimhs, white-space: nowrap; 속성제거
        }
        rtnValue += "<td>" + convertSignResult(String(itemtaskinfo.attr("result")), String(itemtaskinfo.attr("kind")), String(szcustomattribute2), itemid) + "</td>";
        rtnValue += "<td>" + applytemplatesitemtaskinfo(itemtaskinfo, itemid) + "</td>";
        rtnValue += "<td>" + CFN_TransLocalTime(formatDate(itemtaskinfo.attr("datecompleted"))) + "</td>"; //결재일자
        rtnValue += "<td>" + CFN_TransLocalTime(formatDate(itemtaskinfo.attr("datereceived"))) + "</td>"; // 받은일시
        rtnValue += "<td>" + sMobile + "</td>"; //모바일 결재 여부
        rtnValue += "</tr>";

        // 의견 XML 이 안 맞는 것 같아 Comment 처리함.
        if (itemtaskinfo.find("comment").length > 0 && person_code != "") { //신청서 같은경우 발신/수신 구분값에도 기안자 의견이 들어가서 person_code !="" 로 막음        	
        	var text = Base64.b64_to_utf8(itemtaskinfo.find("comment").text());
        	if( text.replace(/\s/g,'').length > 0 ){ //의견 값이 없거나 공백인 경우 안보여주도록 2020.04.10 dgkim
        		// [2015-03-19 modi]
                //rtnValue += "<tr>";
                if (person_code != "" && stepunittype == "ou") {
                    rtnValue += "<tr id='" + trId + "_comment' style='display:none;background-color:lightyellow;'>";  //id='" + trId + "'
                } else {
                    rtnValue += "<tr>";
                }
                rtnValue += "<td>";
                rtnValue += "</td>";
                rtnValue += "<td style='text-align:left;padding-left:15px' colspan='6' id = 'txtComment" + cmtid + "' >→&nbsp;" + coviDic.dicMap["lbl_apv_comment"];
                if(itemtaskinfo.find("comment_fileinfo").length > 0){
                	rtnValue += "<div class=\"fClip\" style=\"display: inline-block; float: none; height: 16px;\"><a class=\"mClip\" onclick='openFileList_comment(this,"+(parseInt(index.split(".")[1])-1)+")'><spring:message code='Cache.lbl_attach'/></a></div>";
                }
                rtnValue += ":&nbsp;";
                //rtnValue += itemtaskinfo.find("comment").text().replace(/\n/g, "<br>");
                rtnValue += text;
                rtnValue += "</td>";
                rtnValue += "</tr>";
        	}
        }
    }
    return rtnValue;
}

//결재 순번 처리(Division 순번 감추고 하위 순번 들여쓰기)
function getDotCountSpace(sDotVar) {
    var aDotCount = sDotVar.split(".");
    var sDotCount = "";
    /*
    for (var i = 0; i < aDotCount.length - 1; i++) {
        if (sDotCount == "") {
            sDotCount += "<font color='white'>-</font>";
        } else {
            sDotCount += "&nbsp;&nbsp;";
        }
    }
    */
    return sDotCount + sDotVar.substring(sDotVar.lastIndexOf(".") + 1);
    //return sDotVar;
}

function splitName(sValue) {
    var sValue02 = "";
    if (sValue != undefined) {
        sValue02 = sValue.substring(sValue.indexOf(";") + 1);
    }
    return CFN_GetDicInfo(sValue02);
}

bPresenceView = true;
function getPresence(sCreatorCode, sCreatorName, sSipAddress) {
    var szreturn = ""
    if (bPresenceView) {
        szreturn = "<span class='spanImnmark' presenceStyle='margin: -2px 3px 0px 0px;'  sipaddress='" + sSipAddress + "'></span>";
        //szreturn += "<span class=\"txt_gn11_blur2\" style=\"cursor:pointer\" onclick=\"XFN_ShowContextMenuConnectUser(event, '" + sCreatorCode + "', '" + sSipAddress + "', '" + sSipAddress + "', '');\"><a href='javascript:void(0)'>" + sCreatorName + "</a></span>"
    }
    else {
        szreturn = "&nbsp;";
    }
    return szreturn;
}

//대결자 정보 세팅
function DisBypassPerson(displayname, title, level, oudisplayname) {
    var tempUserName = displayname;                     // 사용자 이름
    if (title != "") {
        if (title != ";") {
            tempUserName += " (" + splitName(title);    // 직책
            tempUserName += "," + splitName(level);     // 직위
            tempUserName += "," + CFN_GetDicInfo(oudisplayname) + ")";      // 부서
        }
    }
    return tempUserName;
}

function dblDigit(iVal) { return (iVal < 10 ? "0" + iVal : iVal); }

function applytemplatesitemtaskinfo(itemtaskinfo, itemid) {
	 var datereceived = itemtaskinfo.attr("datereceived");
	 var datecompleted = itemtaskinfo.attr("datecompleted");
	 var steproutetype = null;
	 var stepunittype = null;
	 var stepname = null;
	 var parentNodeName = itemtaskinfo.parent().eq(0).nodename();
	 var stepstatus = null;
	 var allottype = null;
	 /*JAR-CONVERT 1227.01 origin
	 * if (itemtaskinfo.parent().parent().parent()[0].nodeName == "step") {
	 steproutetype = itemtaskinfo.parent().parent().parent().attr("routetype");
	 stepunittype = itemtaskinfo.parent().parent().parent().attr("unittype");
	 stepname = itemtaskinfo.parent().parent().parent().attr("name");
	 allottype = itemtaskinfo.parent().parent().parent().attr("allottype");
	 if (itemtaskinfo.parent().parent().parent() != null) {
	 if (itemtaskinfo.parent().parent().parent().find("taskinfo").length > 0) {
	 stepstatus = itemtaskinfo.parent().parent().parent().find("taskinfo").attr("status");
	 }
	 } else {
	 if (itemtaskinfo.parent().parent().find("taskinfo").length > 0) {
	 stepstatus = itemtaskinfo.parent().parent().find("taskinfo").attr("status");
	 }
	 }
	 } else {
	 steproutetype = itemtaskinfo.parent().parent().attr("routetype")
	 stepunittype = itemtaskinfo.parent().parent().attr("unittype");
	 stepname = itemtaskinfo.parent().parent().attr("name");
	 allottype = itemtaskinfo.parent().parent().attr("allottype");
	 }*/
	 //JAR-CONVERT 1227.01 start
	 if (itemtaskinfo.parent().parent().parent().nodename() == "step") {
	 steproutetype = itemtaskinfo.parent().parent().parent().attr("routetype")
	 stepunittype = itemtaskinfo.parent().parent().parent().attr("unittype");
	 stepname = itemtaskinfo.parent().parent().parent().attr("name");
	 allottype = itemtaskinfo.parent().parent().parent().attr("allottype");
	 if (itemtaskinfo.parent().parent().parent() != null) {
	 if (itemtaskinfo.parent().parent().parent().find("taskinfo").valLength() > 0) {
	 stepstatus = itemtaskinfo.parent().parent().parent().find("taskinfo").attr("status");
	 }
	 } else {
	 if (itemtaskinfo.parent().parent().find("taskinfo").valLength() > 0) {
	 stepstatus = itemtaskinfo.parent().parent().find("taskinfo").attr("status");
	 }
	 }
	 } else {
	 steproutetype = itemtaskinfo.parent().parent().attr("routetype")
	 stepunittype = itemtaskinfo.parent().parent().attr("unittype");
	 stepname = itemtaskinfo.parent().parent().attr("name");
	 allottype = itemtaskinfo.parent().parent().attr("allottype");
	 }
	 var kind = itemtaskinfo.attr("kind");
	 var status = itemtaskinfo.attr("status");
	 var parentunittype = stepunittype;
	 var customattribute2 = itemtaskinfo.attr("customattribute2");
	 if ((steproutetype == 'assist' || steproutetype == 'consult' || steproutetype == 'audit') && stepunittype == 'ou') {
		 if ((parentNodeName == 'person' || parentNodeName == 'role')) {//&& (kind == 'normal' || kind == 'normal' || kind == 'authorize' || kind == 'substitute' || kind == 'review' || kind == 'skip')
		 		return convertKindToSignTypeByRTnUT(kind, parentNodeName, steproutetype, stepunittype, customattribute2, itemid);
		 } else {
			 return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname, itemid);
		 }
	 } else {
		 return convertKindToSignTypeByRTnUT(kind, parentunittype, steproutetype, stepunittype, stepname, itemid);
	 }
	}


function convertKindToSignTypeByRTnUT(sKind, sParentUT, sRT, sUT, customattribute2, itemid) {
    if (scustomattribute2 == undefined) {
        scustomattribute2 = "";
    }
    var sSignType = " ";
    var scustomattribute2 = (customattribute2 == undefined) ? "" : customattribute2;
    if (scustomattribute2 == "ExtType") {
        sSignType = coviDic.dicMap["lbl_apv_ExtType"];
    } else if (scustomattribute2 == "audit_law") {
        sSignType = coviDic.dicMap["btn_apv_person_audit1"];
    } else {
        switch (sRT) {
            case "receive":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = coviDic.dicMap["lbl_apv_ChargeDept"]; break;
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2, itemid); break;
                        } break;
                    case "role":
                    case "person":
                        sSignType = coviDic.dicMap["lbl_apv_receive"]; break;
                    case "group":
                        sSignType = coviDic.dicMap["lbl_apv_receive"]; break;
                } break;
            case "consult":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = coviDic.dicMap["lbl_apv_DeptConsent"]; break;
                            case "role":
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2, itemid); break;
                        } break;
                    case "role":
                    case "person":
                        sSignType = (scustomattribute2 == coviDic.dicMap["msg_lbl_Committee"] ? scustomattribute2 : coviDic.dicMap["lbl_apv_PersonConsent"]); break;
                } break;
            case "assist":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou": sSignType = coviDic.dicMap["lbl_apv_DeptAssist"]; break;
                            case "role":
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2, itemid); break;
                        } break;
                    case "role":
                    case "person":
                        sSignType = (scustomattribute2 == "" ? coviDic.dicMap["lbl_apv_assist"] : scustomattribute2); break;
                } break;
            case "audit":
                switch (sUT) {
                    case "ou":
                        switch (sParentUT) {
                            case "ou":
                                sSignType = (scustomattribute2 == "" ? coviDic.dicMap["btn_apv_dept_audit"] : scustomattribute2);
                                if (scustomattribute2 == "audit_dept") {
                                    sSignType = coviDic.dicMap["btn_apv_dept_audit"];
                                }
                                else if (scustomattribute2 == "audit_law_dept") {
                                    sSignType = coviDic.dicMap["btn_apv_dept_audit1"];
                                }
                                break;
                            case "role":
                            case "person": sSignType = convertKindToSignType(sKind, scustomattribute2, itemid); break;
                        } break;
                    case "role":
                    case "person":
                        sSignType = coviDic.dicMap["btn_apv_person_audit"]; break;
                } break;
            case "review":
                sSignType = coviDic.dicMap["lbl_apv_PublicInspect"]; break;
            case "notify":
                sSignType = coviDic.dicMap["lbl_apv_SendInfo"]; break;
            case "approve":
                switch (sUT) {
                    case "role":
                    case "person":
                        sSignType = convertKindToSignType(sKind, scustomattribute2, itemid); break;
                    case "ou":
                        sSignType = coviDic.dicMap["lbl_apv_DeptApprv"]; break;
                } break;
        }
    }
    return sSignType;
}

function convertKindToSignType(sKind, customattribute2, itemid) {
    var sSignType;
    var scustomattribute2 = (customattribute2 == undefined) ? "" : customattribute2;
    var aItemid = itemid.split("/");
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
            sSignType = coviDic.dicMap["lbl_apv_review"]; break;
        case "bypass":
            sSignType = coviDic.dicMap["lbl_apv_bypass"]; break;
        case "charge":
            if (aItemid[0] != "division[0]") sSignType = coviDic.dicMap["lbl_apv_receive"];
            else sSignType = coviDic.dicMap["lbl_apv_Draft"];
            break;
        case "confidential":
            sSignType = coviDic.dicMap["lbl_apv_Confidential"]; break;
        case "conveyance":
            sSignType = coviDic.dicMap["lbl_apv_forward"]; break;
        case "skip":    //전결
            //[2015-07-21 modi kh] 결재안함 일반결재 문구 수정 - 리스트 / 그래픽 동일하게 표시 됨
            //sSignType = coviDic.dicMap["lbl_apv_NoApprvl")+" "+String(scustomattribute2);break;
            sSignType = coviDic.dicMap["lbl_apv_NoApprvl"];
            if(String(scustomattribute2)!="")sSignType = sSignType+" "+String(scustomattribute2);
            break;
        case "confirm":
            sSignType = coviDic.dicMap["lbl_apv_Confirm"]; break;
        case "reference":
            sSignType = coviDic.dicMap["lbl_apv_share4list"]; break;
        default:
            sSignType = " ";
    }
    return sSignType;
}


function convertSignResult(sResult, sKind, customattribute2, itemid) {
    var sSignResult;
    var aItemid = itemid.split("/");
    switch (sResult) {
        case "inactive":
            sSignResult = coviDic.dicMap["lbl_apv_inactive"]; break;
        case "pending":
            sSignResult = coviDic.dicMap["lbl_apv_inactive"]; break;
        case "reserved":
            sSignResult = coviDic.dicMap["lbl_apv_hold"]; break;
        case "completed":
            if (customattribute2 == "ExtType") sSignResult = coviDic.dicMap["lbl_apv_ExtType_agree"];
            else if (sKind == 'charge') {
                if (aItemid[0] != "division[0]") sSignResult = coviDic.dicMap["btn_apv_receipt"];
                else sSignResult = coviDic.dicMap["btn_apv_draft"];
            } else {
                sSignResult = coviDic.dicMap["lbl_apv_app"];
            }
            break;
        case "rejected":
            if (customattribute2 == "ExtType") sSignResult = coviDic.dicMap["lbl_apv_ExtType_disagree"];
            else sSignResult = coviDic.dicMap["lbl_apv_reject"];
            break;
        case "rejectedto":
            sSignResult = coviDic.dicMap["lbl_apv_reject"]; break;
        case "authorized":
            sSignResult = coviDic.dicMap["lbl_apv_authorize"]; break;
        case "reviewed":
            sSignResult = coviDic.dicMap["lbl_apv_review"]; break;
        case "substituted":
            sSignResult = coviDic.dicMap["lbl_apv_substitue"]; break;
        case "agreed":
            if (customattribute2 == "ExtType") sSignResult = coviDic.dicMap["lbl_apv_ExtType_agree"];
            else sSignResult = coviDic.dicMap["lbl_apv_tit_consent"];
            break;
        case "disagreed":
            if (customattribute2 == "ExtType") sSignResult = coviDic.dicMap["lbl_apv_ExtType_disagree"];
            else sSignResult = coviDic.dicMap["lbl_apv_disagree"];
            break;
        case "bypassed":
            sSignResult = coviDic.dicMap["lbl_apv_bypass"]; break;
        case "skipped":
            sSignResult = coviDic.dicMap["lbl_apv_NoApprvl"]; break;
        case "confirmed":
            sSignResult = coviDic.dicMap["lbl_apv_confirmed"]; break;
        case "confidential":    //친전
            sSignResult = coviDic.dicMap["lbl_apv_app"]; break;
        default:
            sSignResult = " ";
            break;
    }
    return sSignResult;
}

function formatDate(sDate) {
    if (sDate == "" || sDate == null || sDate == undefined || sDate == "undefined")
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
