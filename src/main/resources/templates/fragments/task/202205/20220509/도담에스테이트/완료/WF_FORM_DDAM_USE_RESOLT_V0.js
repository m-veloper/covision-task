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

    //읽기 모드 일 경우
    if (getInfo("Request.templatemode") == "Read") {

        $('*[data-mode="writeOnly"]').each(function () {
            $(this).hide();
        });
        
        
        // selectedResort, selectedRoom 보이기
     	let selectedResort = document.getElementById("selectedResort");
     	let selectedRoom = document.getElementById("selectedRoom");
     	selectedResort.style.display = "block";
     	selectedRoom.style.display = "block";
        //<!--loadMultiRow_Read-->

    }
    else {

 
    	// 이름 자동 등록 
    	let name = document.getElementById("name");
    	let reqUser = document.getElementById("reqUser");
    	name.addEventListener('focusout', function(event){
    		reqUser.value = event.target.value;
    	});
    	
        $('*[data-mode="readOnly"]').each(function () {
            $(this).hide();
        });

        // 에디터 처리
        //<!--AddWebEditor-->
        
        if (formJson.Request.mode == "DRAFT" || formJson.Request.mode == "TEMPSAVE") {

            document.getElementById("InitiatorOUDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.dpnm"), false);
            document.getElementById("InitiatorDisplay").value = m_oFormMenu.getLngLabel(getInfo("AppInfo.usnm"), false);
        }
     
        // 임시저장 모드일 경우 셀렉트박스 세팅
        if (formJson.Request.mode == "TEMPSAVE") {
      	  settingSelect();
        }
        
        //<!--loadMultiRow_Write-->
    }
}

function setLabel() {
}

function setFormInfoDraft() {
}

function checkForm(bTempSave) {
    if (bTempSave) {
        return true;
    } else {
        // 필수 입력 필드 체크
        return EASY.check().result;
    }
}

function setBodyContext(sBodyContext) {
}

//본문 XML로 구성
function makeBodyContext() {
    /*var sBodyContext = "";
    sBodyContext = "<BODY_CONTEXT>" + getFields("mField") + "</BODY_CONTEXT>";*/
	var bodyContextObj = {};
	bodyContextObj["BodyContext"] = getFields("mField");
    return bodyContextObj;
}


/**
 * 날짜에 따른 몇박 몇일 계산
 * @param obj
 * @returns
 */
function calSDATEEDATE(obj) {
    var tmpObj = obj;
    while (tmpObj.tagName != "TR") {
        tmpObj = tmpObj.parentNode; //??????????????
    }
    if ($(tmpObj).find("input[id=SDATE]").val() != "" && $(tmpObj).find("input[id=EDATE]").val() != "") {
        var SDATE = $(tmpObj).find("input[id=SDATE]").val().split('-');
        var EDATE = $(tmpObj).find("input[id=EDATE]").val().split('-');

        var SOBJDATE = new Date(parseInt(SDATE[0], 10), parseInt(SDATE[1], 10) - 1, parseInt(SDATE[2], 10));
        var EOBJDATE = new Date(parseInt(EDATE[0], 10), parseInt(EDATE[1], 10) - 1, parseInt(EDATE[2], 10));
        var tmpday = EOBJDATE - SOBJDATE;
        tmpday = parseInt(tmpday, 10) / (1000 * 3600 * 24);
        if (tmpday < 0) {
            alert("이전 일보다 전 입니다. 확인하여 주십시오.");
            $(tmpObj).find("input[id=SDATE]").val("");
            $(tmpObj).find("input[id=EDATE]").val("");
        }
        else {
            $("#CALNIGHT").val(tmpday);
            $("#CALDAY").val(tmpday + 1);
        }
    }
}


/**
 * 지역에 따른 콘도 목록 
 */
let getRegion = () => {
	
	let elemnet = document.getElementById("region");
	let val = elemnet.options[elemnet.selectedIndex].value;
	

	let condoA = document.getElementById("condoA");
	let condoB = document.getElementById("condoB");
	let condoC = document.getElementById("condoC");
		
	switch (val) {
	case "안면도":
		condoA.style.display = "block";
		condoB.style.display = "none";
		condoC.style.display = "none";
		break;
	case "제천":
		condoB.style.display = "block";
		condoC.style.display = "none";
		condoA.style.display = "none";
		break;
	case "덕산":
		condoC.style.display = "block";
		condoB.style.display = "none";
		condoA.style.display = "none";
		break;
	default:
		condoA.style.display = "none";
		condoB.style.display = "none";
		condoC.style.display = "none";
		getRoom.count();
		getRoom.make("any");
		break;
	}
}


/**
 * 리조트 선택시 동작 함수
 */
let resort = {
		
	// selectedResort input 태그에 데이터 입력
	setValue : function (data) {
     	let selectedResort = document.getElementById("selectedResort");
     	selectedResort.value = data; 
	},
    getResortA: function () {
    	let val = "";
    	let condoA = document.getElementById("condoA");
    	let valueA = condoA.options[condoA.selectedIndex].value;
    	val = valueA;
    	this.setValue(val);
    	showRooms(val);
    }, 
	getResortB: function () {
		let val = "";
		let condoB = document.getElementById("condoB");
		let valueB = condoB.options[condoB.selectedIndex].value;
		val = valueB;
		this.setValue(val);
		showRooms(val);
	},
    getResortC: function () {
    	let val = "";
    	let condoC = document.getElementById("condoC");
    	let valueC = condoC.options[condoC.selectedIndex].value;
    	val = valueC;
    	this.setValue(val);
    	showRooms(val);
    }
}

/**
 * 특정 리조트 선택시 
 * 해당 리조트의 룸 목록을 호출
 */
let showRooms = (resort) => {
	
	switch (resort) {
	case "오션빌라스":
		getRoom.oceanB("oceanB");
		break;
	case "오션타워":
		getRoom.oceanT("oceanT");
		break;
	case "포레스트":
		getRoom.forest("forest");
		break;
	case "레스트리":
		getRoom.restri("restri");
		break;
	case "플렉스타워":
		getRoom.flexT("flexT");
		break;
	case "스테이타워":
		getRoom.stayT("stayT");
		break;
	default:
		// 데이터 초기화
		getRoom.any("any");
		getRoom.count();
		resort.setValue("");
		break;
	}
}

/**
 * 호출된 룸을 보여줌
 */
let getRoom = {
	// 선택된 룸의 개수를 카운팅
	// 선택된 룸을 selectedRoom input 태그에 세팅
	count : function () {		
	
		// 선택된 객실 수 
		let cnt = 0;
		let trList = document.querySelectorAll(".rooms select");
		let roomCount = document.getElementById("roomCount");
		
		// 선택된 룸 정보 세팅
		let selectedRoom = document.getElementById("selectedRoom");
		
		Array.from(trList).forEach(function(element) {
		
			if (element.style.display === "block" && element.value !== "0" ) {
				cnt ++;
				selectedRoom.value =  element.value;
				roomCount.value = cnt;
			}
			if (element.style.display === "block" && element.value === "0" ) {
				selectedRoom.value =  "";
			}
		});

	},
	
	make: function (id) {
		let roomList = [
			document.getElementById("oceanB"), 
			document.getElementById("oceanT"), 
			document.getElementById("forest"), 
			document.getElementById("restri"), 
			document.getElementById("flexT"), 
			document.getElementById("stayT"), 
		]
		
		// 처음을 선택할 경우 동작
		if (id === "any") {
			
			// selectedResort input 태그에 데이터 초기화
			resort.setValue("");
			
			Array.from(roomList).forEach(function(element) { 
				element.style.display = "none";
			});
			
			
			// 특정 리조트를 선택할 경우 룸 목록을 보여줌
		}else {
			Array.from(roomList).forEach(function(element) { 
				if(element.id === id){
					element.style.display = "block";
				}else{
					element.style.display = "none";
				}
			});
		}

	},
	oceanB : function (id) {
		this.make(id)
    }, 
    oceanT : function (id) {
		this.make(id);
	},
	forest : function (id) {	
		this.make(id);
    },
	restri : function (id) {
		this.make(id);
	},
	flexT : function (id) {
		this.make(id);
    },
    stayT : function (id) {
		this.make(id);
	}
    ,
    any : function (id) {
		this.make(id);
	}
}


/**
 * 임시저장의 경우 select box 표시 유무 함수
 * @returns
 */
function settingSelect() {
	
	// 현재 신청로를 위하 로직은 임시 모드일 때에는 셀렉트박스가 보이지 않게 되어있다.
	// 임시저장 후 신청서를 다시 열었을 때 지역 선택에 따라 다머지 셀렉트박스들의 값을 세팅해 줘야 한다.
	
	// 지역 선택 셀렉트 박스의 값을 가져옴.
	getRegion();
   
    // 선택된 리조트 
    let selectedResort = document.getElementById("selectedResort");
    showRooms(selectedResort.value);
    // 선택된 룸
    let selectedRoom = document.getElementById("selectedRoom");
   
    
	let condoA = document.getElementById("condoA"); // 안면도 리조트 셀렉트박스
	let condoB = document.getElementById("condoB"); // 제천 리조트 셀렉트박스
	let condoC = document.getElementById("condoC"); // 덕산 리조트 셀렉트박스

	
	// 룸 세팅 함
    let setRoom = (resort, selectedRoom) => {
    	if(selectedRoom !== ""){    		
    		let resortSelectBox = document.getElementById(resort)
    		Array.from(resortSelectBox.options).forEach(function(option) { 
    			if(option.value === selectedRoom){
    				option.selected = true;
    			}
    		}); 
    	} else {
			
		}
    }
    
    switch (selectedResort.value) {
    case "오션빌라스":
    	// 리조트 데이터 셀렉트박스에 세팅
		Array.from(condoA.options).forEach(function(option) { 
			if(option.value === selectedResort.value){
				option.selected = true;
			}
		});  
	
		
    	// 룸 데이터 셀렉트박스에 세팅
		setRoom("oceanB", selectedRoom.value);
    	break;
    	
    case "오션타워":
    	// 리조트 데이터 셀렉트박스에 세팅
		Array.from(condoA.options).forEach(function(option) { 
			if(option.value === selectedResort.value){
				option.selected = true;
			}
		});
		
	
    	// 룸 데이터 셀렉트박스에 세팅
		setRoom("oceanT", selectedRoom.value);
    	break;
    	
    case "포레스트":
    	// 리조트 데이터 셀렉트박스에 세팅
		Array.from(condoB.options).forEach(function(option) { 
			if(option.value === selectedResort.value){
				option.selected = true;
			}
		});
		
    	// 룸 데이터 셀렉트박스에 세팅
		setRoom("forest", selectedRoom.value);
    	break;
    	
    case "레스트리":
    	// 리조트 데이터 셀렉트박스에 세팅
		Array.from(condoB.options).forEach(function(option) { 
			if(option.value === selectedResort.value){
				option.selected = true;
			}
		});
		
    	// 룸 데이터 셀렉트박스에 세팅
		setRoom("restri", selectedRoom.value);
    	break;
    	
    case "플렉스타워":
    	// 리조트 데이터 셀렉트박스에 세팅
		Array.from(condoC.options).forEach(function(option) { 
			if(option.value === selectedResort.value){
				option.selected = true;
			}
		}); 
		
    	// 룸 데이터 셀렉트박스에 세팅
		setRoom("flexT", selectedRoom.value);
    	break;
    	
    case "스테이타워":
    	// 리조트 데이터 셀렉트박스에 세팅
		Array.from(condoC.options).forEach(function(option) { 
			if(option.value === selectedResort.value){
				option.selected = true;
			}
		});
		
		// 룸 데이터 셀렉트박스에 세팅
		setRoom("stayT", selectedRoom.value);
		break;
		
	default:
		Common.Warning("콘도 또는 객실이 선택되지 않았습니다.");
		break;
	}
  
}
	




