/**
 * 전자결재 공통
 * ----------------------------------------------------------------------
 * 작성자		: dgkim
 * 최종수정일	: 2020-01-14
 * ----------------------------------------------------------------------
 */

var appvCmmn = {
	
	appvFormJson : function( jsonStr ){
		
		var _formJson = jsonStr;
		
		var _function = {
			getJson : function(){ return _formJson }
		
			,getInfo : function(sKey){
				try {
					  sKey = "$."+sKey;				      
					  var isExitJsonValue = jsonPath(_formJson, sKey).length === undefined ? false : true;
				      var formJsonValue = isExitJsonValue ? jsonPath(_formJson, sKey)[0] : jsonPath(_formJson, sKey);
				      
				      if ( !formJsonValue && !isExitJsonValue ) {
				    	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
				    	  return undefined;
				    	  
				      }else if (formJsonValue.constructor === "".constructor) {				    	  
				    	  return formJsonValue;
				    	  
				      }else if (formJsonValue.constructor === [].constructor || formJsonValue.constructor === {}.constructor || formJsonValue.constructor === true.constructor) {				          
				    	  return JSON.stringify(formJsonValue);
				    	  
				      }else {
				    	  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
				    	  return undefined;
				      }

				  }catch (e) {
					  /*비사용
					   * alert(Message254 + sKey + gMessage255);//"양식정보에 없는 키값["+sKey+"]입니다."*/
					  //console.log("양식정보에 없는 키값[" + sKey + "]입니다.");
					  return undefined;
				  }
			}
		}
		
		return _function 
	}
}





