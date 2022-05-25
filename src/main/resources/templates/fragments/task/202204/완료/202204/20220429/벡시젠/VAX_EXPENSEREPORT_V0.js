//양식별 다국어 정의 부분
var localLang_ko = {
    localLangItems: {
    }
};

var localLang_en = {
    localLangItems: {
    }
};

var localLang_ja = {
    localLangItems: {
    }
};

var localLang_zh = {
    localLangItems: {
    }
};

//양식별 후처리를 위한 필수 함수 - 삭제 시 오류 발생
function postRenderingForTemplate() {
    // 체크박스, radio 등 공통 후처리
    postJobForDynamicCtrl();
    $('#tblFormSubject').hide();
    

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        //<!--loadMultiRow_Read-->
        $('*[name=REQ_DivInputName]').each(function () {
            $(this).css("display", "block");
        });
        
        
        //쓰기모드
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'R');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 2 });

        }

    }
    else {
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });
        
        

        // 에디터 처리
        //<!--AddWebEditor-->
        
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {
        	
        	//settingSelect();

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
     
        //<!--loadMultiRow_Write-->
        if (formJson.BodyContext != null && formJson.BodyContext.TBLINFO != null) {
            XFORM.multirow.load(JSON.stringify(formJson.BodyContext.TBLINFO), 'json', '#TBLINFO', 'W');
        } else {
            XFORM.multirow.load('', 'json', '#TBLINFO', 'W', { minLength: 1 });
        }
        if (formJson.Request.mode == "TEMPSAVE") {
      	  settingSelect();
      	if(document.getElementById("subTitle").value ==""){
    		document.getElementById("subTitle").value =document.getElementById("Subject").value;
    	}
      }
    }
}

function setLabel() {
}

function setFormInfoDraft() {
}

function checkForm(bTempSave) {
	
	if( document.getElementById("subTitle").value =="" ){
		console.log("제목 " +document.getElementById("subTitle").value);
		COST_MAX();
	}else {
		document.getElementById("Subject").value = document.getElementById("subTitle").value;
	}
	
	
    if (bTempSave) {
        return true;
    } else {
    	
        if (document.getElementById("subTitle").value == '') {
            Common.Warning('제목을 입력하세요.');
            //SUBJECT.focus();
            return false;
        } else if (!($("#div11").is(":checked")) &&!($("#div12").is(":checked")) &&!($("#div13").is(":checked")) &&!($("#div14").is(":checked"))
        		&& !($("#div51").is(":checked"))
        		
        ) {
            Common.Warning('결재방법을 선택하세요');
            return false;
        }else if (!($("#div51").is(":checked")) &&!($("#div52").is(":checked"))    ) {
            Common.Warning('입금성격을 선택하세요');
            return false;
        }
        
        else if (document.getElementById("SaveTerm").value == '') {
            Common.Warning('보존년한을 선택하세요.');
            return false;
        } else {
            return EASY.check().result;
        }
    }
}
function setBodyContext(sBodyContext) {
}

//본문 XML로 구성
function makeBodyContext() {
    /*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	
    var bodyContextObj = {};
	var editorContent = {"tbContentElement" : document.getElementById("dhtml_body").value};
	
	bodyContextObj["BodyContext"] = $.extend(editorContent, getFields("mField"));
	$$(bodyContextObj["BodyContext"]).append(getMultiRowFields("TBLINFO", "rField"));
    return bodyContextObj;
}



	


/************************************************************************
함수명		: CnvtComma
작성목적	: 빠져나갈때 포맷주기(123456 => 123,456)
*************************************************************************/
function CnvtComma(num) {
    try {
        var ns = num.toString();
        var dp;

        if (isNaN(ns))
            return "";

        dp = ns.search(/\./);

        if (dp < 0) dp = ns.length;

        dp -= 3;

        while (dp > 0) {
            ns = ns.substr(0, dp) + "," + ns.substr(dp);
            dp -= 3;
        }
        return ns;
    }
    catch (ex) {
    }


    
    
}
//select box 변경 함수
function initDivSelect(obj) {
    var oHtml = '';
    var m_index = $("select[name=REQ_Div1]").index(obj);

    // 반차, 선반차
    if($(obj).val() == "0" ){
    	$(obj).parent().parent().find("[name=REQ_Div2]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div3]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div4]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div5]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div6]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div2]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div3]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div4]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div5]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div6]").val(0);  
    }else if($(obj).val() == "1" ){
    	$(obj).parent().parent().find("[name=REQ_Div2]").css("display", "block");
    	$(obj).parent().parent().find("[name=REQ_Div3]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div4]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div5]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div6]").css("display", "none"); 
    	$(obj).parent().parent().find("[name=REQ_Div2]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div3]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div4]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div5]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div6]").val(0); 
    }else if($(obj).val() == "2" ){
    	$(obj).parent().parent().find("[name=REQ_Div2]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div3]").css("display", "block");
    	$(obj).parent().parent().find("[name=REQ_Div4]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div5]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div6]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div2]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div3]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div4]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div5]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div6]").val(0);
    }else if($(obj).val() == "3" ){
    	$(obj).parent().parent().find("[name=REQ_Div2]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div3]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div4]").css("display", "block");
    	$(obj).parent().parent().find("[name=REQ_Div5]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div6]").css("display", "none"); 
    	$(obj).parent().parent().find("[name=REQ_Div2]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div3]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div4]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div5]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div6]").val(0);   
    	$(obj).parent().parent().find("[name=REQ_Div7]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div8]").val(0);
    }else if($(obj).val() == "4" ){
    	$(obj).parent().parent().find("[name=REQ_Div2]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div3]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div4]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div5]").css("display", "block");
    	$(obj).parent().parent().find("[name=REQ_Div6]").css("display", "none"); 
    	$(obj).parent().parent().find("[name=REQ_Div2]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div3]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div4]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div5]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div6]").val(0);    	
    }else   if($(obj).val() == "5" ){
    	$(obj).parent().parent().find("[name=REQ_Div2]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div3]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div4]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div5]").css("display", "none");
    	$(obj).parent().parent().find("[name=REQ_Div6]").css("display", "block"); 
    	$(obj).parent().parent().find("[name=REQ_Div2]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div3]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div4]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div5]").val(0);
    	$(obj).parent().parent().find("[name=REQ_Div6]").val(0);
    }
}
//값 선택시 REQ_DivInputName 에 값 세팅(읽기모드일 경우 사용하기 위함)
function initDivInput(obj, id){
	if(id =="2"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div2] option:checked").text()); 
	}else if(id =="3"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div3] option:checked").text()); 
	}else if(id =="4"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div4] option:checked").text()); 
	}else if(id =="5"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div5] option:checked").text()); 
	}else if(id =="6"){
		$(obj).parent().parent().find("[name=REQ_DivInputName]").val($(obj).parent().find("[name=REQ_Div6] option:checked").text()); 
	}
	
}
//자동계산 함수
function COST_CAL() {
    var tblobj = document.getElementById("TBLINFO"); //멀티로우 TABLE ID
    var cost_sum = 0;
    var tex_sum = 0;
    
    for (i = 3 ; i < tblobj.rows.length; i++) {
    	
    	// 값을 입력하지 않았을 경우 계산방지
    	if(isEmptyStr($(tblobj).find("input[name=REQ_VAT]").val())) {
    		tex_sum = 0;
    	} else {
    		tex_sum = parseFloat($(tblobj).find("input[name=REQ_VAT]").val());
    	}
    	
    	if($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val() != undefined) {
    		if(isEmptyStr($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val())) {
    			cost_sum += 0;
    		} else {
    			cost_sum += parseFloat($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val());
    		}
    	}
    }
    
    $(tblobj).find("input[name=REQ_TOTAL]").val(cost_sum  + tex_sum );
}
//최대값 체크하여 제목에 입력 하는 함수
function COST_MAX() {
    var tblobj = document.getElementById("TBLINFO"); //멀티로우 TABLE ID
    var cost_Max_seq = 0;
    var cost_Max =0;
    //항목1_항목2_파이프라인_외_합계_거래처 로 제목 만들기
    var sREQ_Div1 =""; //항목1
    var sREQ_Div2 =""; //항목2
    var sPipeLine =""; //파이프라인
    var sREQ_TOTAL =""; //합계금액
    var sCompanyName ="";//거래처
    var costCount =0; //비용 갯수
    
    for (i = 3 ; i < tblobj.rows.length; i++) {
    	costCount++;
    	
    	if($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val() != undefined) {
    		if(isEmptyStr($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val())) {
    			
    		} else {
    			if(cost_Max <= parseFloat($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val()) ){
    				cost_Max = parseFloat($(tblobj.rows[i]).find("input[name=REQ_PRICE]").val())
    				sREQ_Div1 =$(tblobj.rows[i]).find("[name=REQ_Div1] option:checked").text(); //항목1
				    sPipeLine =$(tblobj.rows[i]).find("[name=PipeLine] option:checked").text(); //파이프라인
				    
				    if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==1){
				    	sREQ_Div2 =$(tblobj.rows[i]).find("[name=REQ_Div2] option:checked").text(); //항목2				    	
				    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==2){
				    	sREQ_Div2 =$(tblobj.rows[i]).find("[name=REQ_Div3] option:checked").text(); //항목2				    	
				    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==3){
				    	sREQ_Div2 =$(tblobj.rows[i]).find("[name=REQ_Div4] option:checked").text(); //항목2				    	
				    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==4){
				    	sREQ_Div2 =$(tblobj.rows[i]).find("[name=REQ_Div5] option:checked").text(); //항목2
				    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==5){
				    	sREQ_Div2 =$(tblobj.rows[i]).find("[name=REQ_Div6] option:checked").text(); //항목2
				    }	    
    
    				cost_Max_seq =i;
    			}
    			
    		}
    		
    	}
    }
   
    sCompanyName = $("textarea#CompanyName").val();
	sREQ_TOTAL = $("input[name=REQ_TOTAL]").val();
	
	
	
	if(costCount==1){
		var titleMakig = sREQ_Div1 +"_" + sREQ_Div2 + "_" + sPipeLine + "  " + sREQ_TOTAL + "_" + sCompanyName;
		
		document.getElementById("Subject").value = titleMakig;
		document.getElementById("subTitle").value = titleMakig;
		
	}else{
		costCount = costCount-3;
		var titleMakig = sREQ_Div1 +"_" + sREQ_Div2 + "_" + sPipeLine + "_외"+costCount+" 건 " + sREQ_TOTAL + "_" + sCompanyName;
		document.getElementById("Subject").value = titleMakig;
		document.getElementById("subTitle").value = titleMakig;
	}
	
}

//임시저장의 경우 select box 표시 유무 함수
function settingSelect() {
    var tblobj = document.getElementById("TBLINFO"); //멀티로우 TABLE ID    
    
    for (i = 3 ; i < tblobj.rows.length; i++) { 
    	
    	if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==1){
			$(tblobj.rows[i]).find("[name=REQ_Div2]").css("display", "block");    	
	    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==2){
	    	$(tblobj.rows[i]).find("[name=REQ_Div3]").css("display", "block"); 	
	    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==3){
	    	$(tblobj.rows[i]).find("[name=REQ_Div4]").css("display", "block");    	
	    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==4){
	    	$(tblobj.rows[i]).find("[name=REQ_Div5]").css("display", "block");
	    }else if($(tblobj.rows[i]).find("[name=REQ_Div1]").val() ==5){
	    	$(tblobj.rows[i]).find("[name=REQ_Div6]").css("display", "block");
	    }	
    }
	
}
//multi-row 행추가 후 이벤트
XFORM.multirow.event('afterRowAdded', function ($rows) { 
	COST_CAL();
});

// multi-row 행삭제 후 이벤트
XFORM.multirow.event('afterRowRemoved', function ($rows) { 
	COST_CAL();
}); 
