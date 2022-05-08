/* 프로그램 저작권 정보
// 이 프로그램에 대한 저작권을 포함한 지적재산권은 (주)코비젼에 있으며,
// (주)코비젼이 명시적으로 허용하지 않은 사용, 복사, 변경, 제3자에의 공개, 배포는 엄격히 금지되며,
// (주)코비젼의 지적재산권 침해에 해당됩니다.
// (Copyright ⓒ 2011 Covision Co., Ltd. All Rights Reserved)
//
// You are strictly prohibited to copy, disclose, distribute, modify, or use  this program in part or
// as a whole without the prior written consent of Covision Co., Ltd. Covision Co., Ltd.,
// owns the intellectual property rights in and to this program.
// (Copyright ⓒ 2011 Covision Co., Ltd. All Rights Reserved)
*/

/* revision
    14.07.11 캘린더 매뉴얼 입력 추가
    14.07.15 IE8의 멀티로우 읽기모드에서 SPAN변환 오류 수정
    14.07.15 IE8 캘린더 날짜 선택 오류(IE자체버그) 수정
    14.07.15 IE8 trim() 메서드 비지원 오류 수정
    14.07.18 watch-value 클래스 기능 추가(watch-data 속성도 함께 정의)
    14.07.21 isSum 기능 보완(sum 대상 필드의 모니터링을 watch 기능으로 대신. 휴가신청서 오류 수정)
    14.07.21 watchValue() 함수 추가. init() 수정
    14.07.21 watchAdded() 추가. 동적으로 필드 추가시(DOMNodeAdded) isSum() 재호출(합계 대상 필드의 모니터링 갱신)
    14.07.21 replaceLineBreak() 입력값 null 처리
    14.07.24 시계열 그래프 기능 추가
    14.07.28 특정 요일 선택 불가 기능 추가
    14.07.28 calendar의 월 선택시 select 박스가 열렸다 닫히는 jquery 1.8.18 이전 버전의 버그 수정
    14.07.30 calendar iframe 제거 오류 수정(reported by KH)
    14.07.30 년-월 캘린더의 REOPEN 오류 수정(reported by JYJ)
    14.07.30 합계테이블-콤마가 포함된 숫자의 계산 오류(reported by KJW)
    14.07.30 currency 패턴의 부호설정 오류(reported by PES). 데이터를 직접 변경하는 스크립트에서 EASY.formChanged('currency');
    14.07.31 년월 캘린더의 선택완료시 change() 이벤트 추가
    14.08.01 캘린더의 수가 늘어나면 기간의 합계계산이 느려지는 증상 수정(reported by KJW)
    14.08.04 멀티로우 템플릿 내 INPUT필드가 zero 처리되는 오류 수정(reported by PES) 
    14.08.05 합계필드(sum)의 대상 필드에 watch-value-active 클래스 추가
    14.08.05 합계필드(sum)의 currency 속성 추가
    14.08.06 멀티로우에서 추가된 합계필드(sum)가 동작하지 않는 오류 수정
    14.08.06 sum 패턴 자릿수 지정시 모두 반올림으로 처리되는 오류 수정
    14.09.03 합계테이블 열/행 합계필드의 자릿수 처리
    14.09.03 행합계 클래스가 없는 경우의 오류 처리(line 2030-2035)
	14.09.15 합계 테이블의 원화표시 개선(line 1972: 함수명 및 문자제거 코드 수정)
	14.09.18 DOM Inserted 이벤트 사용여부에 대한 옵션처리(AJAX로 HTML템플릿을 불러와 패턴을 처리하는 경우에 대한 성능개선)
	14.09.18 numeral 한국 통화기호 ￦ 가 일부 브라우저에서 표시되지 않는 증상 수정
    14.09.25 합계테이블 소숫점 자리 지정, 반올림/버림 기능 추가
    14.09.26 DOM Inserted 이벤트시 INPUT 태그만 처리(options.dynamic=true 사용시 성능 개선)
    14.09.26 합계필드 계산시 콤마 처리 오류수정
    14.09.29 newDate() 의 시/분 인자 추가(time 패턴의 시간 간격처리 오류 수정)
    14.09.29 합계 테이블의 숫자 0 이 제거되는 오류 수정
    14.09.29 합계필드의 참조대상필드의 화폐기호 처리
    14.10.06 코드 라인 끝 세미콜론 보완
    14.10.22 data-sum-ref 속성의 값이 있으면 sum 패턴적용
    14.10.22 unpattern() 패턴제거 기능 추가
    14.10.23 eventAdded() data.pattern() NULL 관련 오류 수정
    14.10.24 sumtable의 multirow 내 multirow 지원
    14.10.24 sumtable 초기화시 table-sum-active 클래스 추가 - Line1871 tableSum()
    14.10.25 pattern-skip 상속 기능 추가(해당 클래스에 있는 모든 개체의 렌더링 제외) - activatePattern() 수정
	14.12.04 합계테이블에서 0을 유지할 것인지 아닌지 keep-zero-format클래스 추가
    16.04.14 multi-row-template 2줄 이상일 때 미리보기 누르면 텍스트가 굵게 처리되므로 지움
    16.04.28 합계테이블 이벤트 change -> keyup 으로 변경
    16.05.10 속도 측정 fn_TimeStamp 함수 추가
    16.06.09 numeric 속성의 data-range 범위 초과시 alert창
*/

// 시간체크
var fn_TimeStamp = function (argFlag) {
    var chkTime = new Date();
    var stampValue = chkTime.getHours() + ':' + chkTime.getMinutes() + ':' + chkTime.getSeconds() + ':' + chkTime.getMilliseconds() + '\t';
    stampValue += '[' + argFlag.toUpperCase() + ']' + '\t';
    return stampValue;
};

//name space
var EASY = (function () {

	var validate,
        isCurrency,
        isGuide,
        isDatepicker,
        isTimepicker,
        isPeriod,
        isSum,
        maxChar,
        formValidate,
        init,
        area,
        check,
        scope,
        extension,
        demo,   //demo
        options,
        message,
        status,
        checkRange,
        alertTxt,
        data,
        v,
        no_patterns,
        pattern,
        validation = { stopped: null },
        options = {
        	dynamic: true,
        	validator: true,
        	alerts: true,
        	debug: false,
        	alertFocus: true,
        	focusHighlight: 'check-this', //값 오류가 있는 필드의 강조 class
        	alertType: 'popup',   //popup, layer
        	skip: '.pattern-skip',
        	mode: '',
        	version: '0.9.2',
        	initialized: false
        },
        watch_list = [],
        script_stop = false,

    /* general text messages
	*/
    message = {
    	invalid: 'invalid input',
    	//empty			: '입력되지 않은 항목이 있습니다 - [{0}]',
    	//empty: '{0} 입력되지 않았습니다', 
        empty: '{0}' + Common.getDic('lbl_apv_noenter'),
    	min: 'input is too short',
    	max: 'input is too long',
    	number_min: '<span style="color: #f00;">{0}</span> 이상의 숫자를 입력하세요',
    	number_max: '<span style="color: #f00;">{0}</span> 이하의 숫자를 입력하세요',
    	numberonly: '* Input digits (0 - 9)',
    	url: 'invalid URL',
    	number: '숫자가 아닙니다',
    	email: 'email address is invalid',
    	email_repeat: 'emails do not match',
    	password_repeat: 'passwords do not match',
    	repeat: 'no match',
    	complete: 'input is not complete',
    	select: 'Please select an option',
    	char_remains: '<span style="color: #f00">{0}</span> 글자 남았습니다.'
    };

	status = {
		show: function (el, m, $s) {
			if (window.console && options.debug) console.log('ok', m);

			//오류 표시 설정 확인
			if (!options.alerts) return;

			var o = (typeof $s === 'object') ? $s : this.obj(el);
			//Key Down 이벤트 체크시 html() 관련 처리에서 이벤트를 놓치는 경우가 있어 timeout으로 처리함
			setTimeout(function () {
				if (o) {
					if (o.html() != m) {
						o.html(m).show();
					}
				}
			}, 1);
		},
		hide: function (el, $s) {
			var o = (typeof $s === 'object') ? $s : this.obj(el);
			o.empty().hide();
		},
		obj: function (el) {
			var status_id = el.attr('data-status-place');
			if (status_id == undefined || status_id == null) {
				return null;
			}

			if ($('#' + status_id).length == 0) {
				if (window.console && options.debug) {
					console.log('HTML 속성에서 data-status-place 가 사용되었으나, 이 값을 ID로 정의한 개체가 없습니다!');
				}
				return null;
			}
			return $('#' + status_id);
		}

	};
	/*-----------------------------------------
	 컴포넌트 타입 별 활성화 기능 연결
	-----------------------------------------*/
	var patterns = {
		numeric: {
			selector: '[data-pattern=numeric]',     //컴포넌트로 사용할 HTML 속성(jQuery Selector)
			active: true,                          //컴포넌트를 폼에서 활성화할 것인지 여부(true/false)
			activator: function (el) {                //해당 Markup을 컴포넌트로 활성화하는 함수
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isNumeric($el);
				markupActive($el, 'pattern-numeric-active');
			},
			/* submit버튼 클릭시 validation 관련 */
			validate: false,                       //validation을 사용할 것인지 여부(true/false)
			validatorKey: 'numeric',               //tests에서 validation으로 사용하는 키
			validateLog: false,                     //log를 콘솔에 남김
			dynamic: true
		},
		currency: {
			selector: '[data-pattern=currency]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isCurrency($el);
				markupActive($el, 'pattern-currency-active');
			},
			validate: false,
			validatorKey: 'currency',
			validateLog: false,
			dynamic: true
		},
		numeral: {
			selector: '[data-pattern=numeral]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isNumeral($el);
				markupActive($el, 'pattern-numeral-active');
			},
			formatter: function (el) {
				//blur 이벤트시 포맷 재적용
				//el.trigger('blur');
				isNumeral(el, 'reformat');
			},
			validate: false,
			validatorKey: 'numeral',
			validateLog: false,
			dynamic: true
		},
		time: {
			selector: '[data-pattern=time]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isTimepicker($el);
				markupActive($el, 'pattern-time-active');
			},
			validate: false,
			validatorKey: 'time',
			validateLog: false,
			dynamic: true
		},
		date: {
			selector: '[data-pattern=date]',
			active: true,
			activator: function (el) {
				if (options.mode == 'R') return;
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isDatepicker($el);
				markupActive($el, 'pattern-date-active');
			},
			validate: false,
			validatorKey: 'date',
			validateLog: false,
			dynamic: true
		},
		period: {
			selector: '[data-pattern=period]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isPeriod($el);
				markupActive($el, 'pattern-period-active');
			},
			validate: false,
			validatorKey: 'period',
			validateLog: false,
			dynamic: true
		},
		guide: {
			selector: '[data-pattern=guide]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isGuide($el);
				markupActive($el, 'pattern-guide-active');
			},
			validate: false,
			validatorKey: 'guide',
			validateLog: false,
			dynamic: true
		},
		range: {
			selector: '[data-range]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				checkRange($el);
				markupActive($el, 'pattern-range-active');
			},
			validate: false,
			validatorKey: 'range',
			validateLog: true,
			dynamic: true
		},
		maxchar: {
			selector: '[data-max-char]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				maxChar($el);
				markupActive($el, 'pattern-maxchar-active');
			},
			validate: false,
			validatorKey: 'range',
			validateLog: false,
			dynamic: true
		},
		required: {
			selector: '[required]',
			active: true,
			activator: function (el) {
				if (options.mode == 'R') return;
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isRequired($el);
				markupActive($el, 'pattern-required-active');
			},
			validate: true,
			validatorKey: 'required',
			validateLog: false,
			dynamic: true
		},
		sum: {
			selector: '[data-pattern=sum],[data-sum-ref]',
			active: true,
			activator: function (el) {
				var $el = (typeof el !== 'undefined') ? el : $(this.selector, $(scope));
				$el = skipPattern($el);
				isSum($el);
				markupActive($el, 'pattern-sum-active');
			},
			validate: false,
			validatorKey: 'sum',
			validateLog: false,
			dynamic: true
		}
	};
	/*-----------------------------------------
	 Form Submit 이벤트시 Validation 키 정의
	-----------------------------------------*/
	var tests = {

		hasValue: function (a) {
			if (!a) {
				alertTxt = message.empty;
				return false;
			}
			return true;
		},

		email: function (a) {
			if (!email_filter.test(a) || a.match(email_illegalChars)) {
				alertTxt = a ? message.email : message.empty;
				return false;
			}
			return true;
		},

		currency: function (a) {
			return true; // to-be defined
		},

		numeral: function (a) {
			return true; // to-be defined
		},

		alphanumeric: function (a) {// a --> value of input

			var regex = /^[a-z0-9]+$/i;
			try {
				if (regex && !eval(regex).test(a))
					return false;
			}
			catch (err) {
				if (window.console) console.log(err, field, 'regex is invalid');
				return false;
			}

			return true;
		},
		//문자열이 숫자열인지
		numeric: function (el) {
			var a = el.val();
			var regex = /^[0-9]+$/i;
			var n = (regex && !eval(regex).test(a));
			if (!n) return false; //숫자 아닌 문자 포함시 false

			//유효한 숫자열인지 판단
			return !isNaN(parseFloat(a)) && isFinite(a);
		},
		//문자열이 숫자로 구성되어 있는지
		number: function (a) {// a --> value of input

			var regex = /^[0-9]+$/i;
			try {
				if (regex && !eval(regex).test(a))
					return false;
			}
			catch (err) {
				if (window.console) console.log(err, field, 'regex is invalid');
				return false;
			}

			return true;
		},

		phone: function (a) {// a --> value of input

			var regex = /^\+?([0-9]|[-|' '])+$/i;
			try {
				if (regex && !eval(regex).test(a))
					return false;
			}
			catch (err) {
				if (window.console) console.log(err, field, 'regex is invalid');
				return false;
			}

			return true;
		},

		// Date is validated in European format (day,month,year)
		date: function (a) {
			var day, A = a.split(/[-./]/g), i;
			// if there is native HTML5 support:
			//if( field[0].valueAsNumber )
			//    return true;

			for (i = A.length; i--;) {
				if (isNaN(parseFloat(a)) && !isFinite(a))
					return false;
			}
			try {
				day = new Date(A[2], A[1] - 1, A[0]);
				if (day.getMonth() + 1 == A[1] && day.getDate() == A[0])
					return day;
				return false;
			}
			catch (er) {
				if (window.console) console.log('date test: ', err);
				return false;
			}
		},
		range: function (el) {

			var a = el.val();
			var r = el.data().range;
			var t = { alerts: 'ok' };

			if (r == null || r == '' || r.split(',').length < 2) {
				return false;
			}

			var m = r.split(',');
			var min = m[0], max = m[1];
			var r = rangeVal(a, min, max);

			if (r.message == 'small') {
				t.alerts = message.number_min.replace('{0}', min);
			} else if (r.message == 'big') {
				t.alerts = message.number_max.replace('{0}', max);
			}
			t.result = r.result;
			//console.log(a, min, max, r.message, t.result, t.alerts);

			return t;

			function rangeVal(i, min, max) {
				var val = Math.abs(parseInt(i, 10) || 1);
				var r = {};
				var m = 'ok';
				var v = val;
				if (val > max) {
					v = max;
					m = 'big';
				}

				if (val < min) {
					v = min;
					m = 'small';
				}

				var b = (parseInt(v) === parseInt(val)) ? true : false;
				r.message = m;
				r.result = b;

				return r;
			}
		},
		maxlength: function (el) {

			var a = el.val();
			var max = el.data().maxChar;
			var imax = parseInt(max);
			var t = { alerts: 'ok' };

			var inow = parseInt(el.val().length);
			var iremain = (inow >= imax) ? 0 : (imax - inow);

			t.alerts = message.char_remains.replace('{0}', iremain);
			t.result = (iremain > 0) ? true : false;
			t.max = (t.result) ? null : imax;
			//console.log(a, min, max, r.message, t.result, t.alerts);

			return t;
		},
		required: function (el) {

			var a = el.val();
			var t = { alerts: 'ok', result: true };

			var exclude_list = '.no-required';
			//조상 중에 required skip 설정이 있으면 validation 하지 않음
			if (el.closest(exclude_list).length > 0 || el.is('span')) {
				t.result = true;
				return t;
			}

			if (!a) {
				var title = (el.attr('title')) ? el.attr('title') : '';
				var h = hangeulSuffix(title).subjectSuffix;

				if (title == '') {
					title = (el.attr('name')) ? el.attr('name') : '';
				}
				t.alerts = message.empty.replace('{0}', title + h);
				t.result = false;
			}
			return t;
		},
		sum: function (a) {
			return true; // no validation
		}
	};

	/*-------------------------------------------------
	 숫자만 입력받는 컴포넌트
	---------------------------------------------------*/
	isNumeric = function (obj) {

		//alert( !isNaN(parseFloat('033')) && isFinite('033') );

		obj.each(function () {
			var o = $(this);
			//ime-mode disable
			o.css('ime-mode', 'disabled');
			o.css('text-align', 'right'); //우측 정렬
			bindEvent(o);
		});

		function bindEvent(el) {
			var prev_value;

			var no_alert = (el.data().range != undefined) ? true : false;
			var custom_alert = customAlerts(el, message.number);
			var $status = status.obj(el);
			var result;
			var ctrl_a = false;
			//기본으로 change 이벤트에서 입력값 체크
			el.live('change', function (event) {
				if (!tests.numeric(el)) {
					//console.log('not number!');
					if (window.console) console.log('changed');
					showAlert(result, no_alert, custom_alert, $status);

					var val = $(this).val();
					val = val.replace(/[^0-9]+/g, "");
					$(this).val(val);
				}
			});
			//change 이벤트 체크만으로 충분하나 가이드 차원에서 key down 이벤트를 체크함
			el.live('keydown', function (event) {
				prev_value = $(this).val();
				result = checkVal(el, event);
			});


			//key down 이벤트에 대한 오류 알림만 설정
			el.live('keyup', function (e) {
				showAlert(result, no_alert, custom_alert, $status);
			});
		}

		function showAlert(r, a, custom_alert, $s) {
			//오류 알림
			if ($s == undefined) return;

			var $t = $s;

			if (!a) {
				if (!r) {
					status.show('', custom_alert, $t);
				} else {
					status.hide('', $t);
				}
			}
		}
		function checkVal(o, event) {
			//validation method 1
			var ret_type = checkKeyCode(event);
			if (window.console) console.log(ret_type);
			var t = { alerts: 'ok' };
			//숫자 or ctrl or 지정된 키를 제외한 특수키
			t.result = (ret_type == 1 || ret_type == 12 || ret_type == 14);
			//입력값 오류시 키 입력 방지
			if (!t.result) {
				event.preventDefault();
			}

			return t.result;
		}

		function checkKeyCode(e) {
			var b_debug = false;
			var specialKeys = [];
			specialKeys.push(8); //Backspace
			specialKeys.push(9); //tab
			specialKeys.push(13); //enter
			specialKeys.push(27); //escape
			specialKeys.push(46); //delete
			specialKeys.push(35); //end
			specialKeys.push(36); //home
			specialKeys.push(37); //left
			specialKeys.push(38); //up
			specialKeys.push(39); //right
			specialKeys.push(144); //number lock

			var keyCode = e.which ? e.which : e.keyCode;
			if (b_debug) {
				if (window.console && options.debug) console.log('keydown keycode: ' + e.keyCode);
			}

			if (e.shiftKey) {
				//shift key
				return 10;
			} else if (e.ctrlKey === true && keyCode == 65) {
				//ctrl + A
				//console.log('ctrl+A');
				return 12;
			} else if (e.ctrlKey === true) {
				//ctrl + A
				//console.log('ctrl+A');
				return 12;
			} else if (specialKeys.indexOf(keyCode) != -1) {
				//특수키
				return 14;
			} else if (keyCode >= 48 && keyCode <= 57) {
				//숫자
				//console.log('number', keyCode);
				return 1;
			} else if (keyCode >= 96 && keyCode <= 105) {
				//숫자 키패드
				//console.log('number', keyCode);
				return 1;
			} else if (keyCode >= 65 && keyCode <= 90) {
				//영어
				return 2;
			} else if (keyCode == 229) {
				//한글
				return 3;
			} else {
				return 0;
			}
		}
	};
	/*-------------------------------------------------
	 1000 단위마다 콤마 구분자가 들어가는 컴포넌트
	---------------------------------------------------*/
	isCurrency = function (el) {

		var $el = (typeof el === 'undefined') ? $('input[data-pattern=currency]') : el;

		$el.each(function () {
			$(this).css('ime-mode', 'disabled')
                   .css('-ms-image-mode', 'disabled')
                   .css('text-align', 'right');
			var $that = $(this);
			var decimal = $that.data().digit;
			if (typeof decimal === 'undefined') decimal = 0;
			$that.number(true, decimal);

		});

	};
	/*-------------------------------------------------
	 1000 단위마다 콤마 삽입 : blur 이벤트에서 실행
	---------------------------------------------------*/
	isNumeral = function (el, opt) {

		numeral.language('fr', {
			delimiters: {
				thousands: ' ',
				decimal: ','
			},
			abbreviations: {
				thousand: 'k',
				million: 'm',
				billion: 'b',
				trillion: 't'
			},
			ordinal: function (number) {
				return number === 1 ? 'er' : 'ème';
			},
			currency: {
				symbol: '€'
			}
		});

		numeral.language('us', {
			currency: {
				symbol: 'USD'
			}
		});

		numeral.language('kr', {
			delimiters: {
				thousands: ',',
				decimal: '.'
			},
			abbreviations: {
				thousand: 'k',
				million: 'm',
				billion: 'b',
				trillion: 't'
			},
			ordinal: function (number) {
				return '차';
			},
			currency: {
				symbol: '￦'
			}
		});
		//default language
		numeral.language('kr');

		//필드의 값 반환
		if (typeof opt === 'string') {
			if (opt === 'val') {
				return getUnformatNumber(el);
			} else if (opt === 'reformat') {
				el.each(function () {
					var o = $(this);
					o.css('display', 'inline-block').css('text-align', 'right'); //우측 정렬
					formatNumber(o);
				});
				return;
			}
		}

		var $el = (typeof el === 'undefined') ? $('input[data-pattern=numeral]') : el;

		$el.each(function () {
			var o = $(this);
			o.css('text-align', 'right'); //우측 정렬
			bindEvent(o);
			formatNumber(o);
		});

		//formchange event
		$(document).on("formChanged", function (event) {
			EASY.formatter($('[data-pattern=numeral]'));
		});

		function bindEvent(el) {
			if (!(hasVal(el))) return;

			el.live('change blur', function (event) {
				formatNumber($(this));
			});

			el.live('focus', function (event) {
				unformatNumber($(this));
			});

		}

		function formatNumber(el) {
			var v = getValue(el);
			var f = el.data().numeralFormat;
			//입력값 공백이면 처리하지 않음
			if ($.trim(v) == '') return;

			if (typeof el.data().numeralNation === 'string') {
				numeral.language(el.data().numeralNation);
			} else {
				setDefaultLanguage();
			}

			setValue(el, numeral(v).format(f));
		}

		function unformatNumber(el) {
			var v = getValue(el);
			//입력값 공백이면 처리하지 않음
			if ($.trim(v) == '') return;

			if (typeof el.data().numeralNation === 'string') {
				numeral.language(el.data().numeralNation);
			} else {
				setDefaultLanguage();
			}

			setValue(el, numeral().unformat(v));
		}

		function getUnformatNumber(el) {
			if (typeof el.data().numeralNation === 'string') {
				numeral.language(el.data().numeralNation);
			} else {
				setDefaultLanguage();
			}
			return numeral().unformat(el.val());
		}

		function setDefaultLanguage() {
			numeral.language('kr');
		}
		function setValue(el, v) {
			var t = hasVal(el);
			if (t) {
				el.val(v);
			} else {
				el.html(v);
			}
		}

		function getValue(el) {
			var t = hasVal(el);
			return (t) ? el.val() : el.html();
		}
		function hasVal(el) {
			var t = el.prop('tagName').toLowerCase();
			return (t == 'input' || t == 'textarea') ? true : false;
		}
	};
	/*-------------------------------------------------
	 입력 가이드가 내부에 표시되는 컴포넌트
	---------------------------------------------------*/
	isGuide = function (el) {

		var $el = (typeof el === 'undefined') ? $('input[placeholder]') : el;
		$el.each(function () {
			$(this).inputHints();
		});

	};
	/*-------------------------------------------------
	 날짜만 입력 받는 캘린더 컴포넌트
	---------------------------------------------------*/
	isDatepicker = function (el) {

		var $el = (typeof el === 'undefined') ? $('input[data-pattern=date]') : el;
		$el.each(function () {
			if ($(this).closest('.multi-row-template').length > 0) return;
			$(this).datePicker();
		});
	};

	/*-------------------------------------------------
	 시/분을 선택하는 컴포넌트
	---------------------------------------------------*/
	isTimepicker = function (el) {

		var $el = (typeof el === 'undefined') ? $('input[data-pattern=time]') : el;
		var $that, timeOption;
		$el.each(function () {
			$that = $(this);
			timeOption = {};

			var timeStep = $that.data().timeStep;
			if (timeStep != '') timeOption.step = timeStep;

			var optionFormat = $that.data().timeFormat;
			if (optionFormat != '') timeOption.timeFormat = optionFormat;

			timeOption.minTime = ($that.data().timeMin !== '') ? $that.data().timeMin : '';
			timeOption.maxTime = ($that.data().timeMax !== '') ? $that.data().timeMax : '';

			var optionLock = (typeof $that.data().timeLock === 'undefined') ? '' : $that.data().timeLock;
			var blockedTimeZone, blockedTime, timeArray = [], timeZoneArray = [];
			//console.log(optionLock);
			if (optionLock != '') {
				blockedTimeZone = optionLock.split(',');
				//ie8의 배열 처리 미지원으로 인해 아래 행 수정함. 2014.07.18. KJW
				for (var i = 0; i < blockedTimeZone.length; i++) {
					blockedTime = blockedTimeZone[i].split('-');
					timeZoneArray.push(blockedTime);
				}
				timeOption.disableTimeRanges = timeZoneArray;
			}

			$that.timepicker(timeOption);
		});

	};
	/*-------------------------------------------------
	 기간을 계산하는 컴포넌트
	---------------------------------------------------*/
	isPeriod = function (el) {
		var period_container = '.multi-period';
		var $el = (typeof el === 'undefined') ? $('input[data-pattern=period]') : el;

		$el.each(function () {
			var $that = $(this);
			var ref = $that.data().periodRef;
			var trigger = $that.data().periodTrigger;
			var interval = $that.data().periodType;
			var digit = $that.data().periodDigit;
			var refArray, $s, $d, $t, r, a;

			if (typeof ref === 'undefined') ref = '';
			if (typeof trigger === 'undefined') trigger = '';
			if (typeof interval === 'undefined') interval = 'day';
			if (typeof digit === 'undefined') digit = '0';
			if (ref == '') return;

			refArray = ref.split(',');

			//동적 테이블에서 기간 계산 시작일과 종료일이 ID를 사용하지 않는 경우
			if ($that.closest(period_container).length > 0) {
				$s = $('[name=' + refArray[0] + ']', $that.closest(period_container));
				$d = $('[name=' + refArray[1] + ']', $that.closest(period_container));
				$t = $('[name=' + trigger + ']', $that.closest(period_container));
			} else {
				$s = $('#' + refArray[0]);
				$d = $('#' + refArray[1]);
				$t = $('#' + trigger);
			}

			a = (refArray.length > 2) ? refArray[2] : 0;    //additional days

			if (trigger == '') {
				$s.bind('change', function () {
					//캘린더의 날짜를 직접 입력하는 경우, 입력하는 과정에서는 포맷이 없이 yyyymmdd 형식을 사용하므로,
					//change 이벤트 발생시 포맷이 없는 형태의 값이 넘어와 포맷이 적용되도록 기다리기 위한 timeout 설정이 필요함
					//2014.07.11. KJW
					setTimeout(function () { calPeriod($s, $d, a, $that, interval, digit); }, 100);
				});
				$d.bind('change', function () {
					setTimeout(function () { calPeriod($s, $d, a, $that, interval, digit); }, 100);
				});
			} else {
				$t.bind('click', function () { //click은 timeout설정이 필요하지 않음.
					calPeriod($s, $d, a, $that, interval, digit);
				});
			}

		});
		//yyyymmdd 포맷을 yyyy-mm-dd로 변환
		function convDateToYYYYMMDD(strDate) {
			var match = strDate.match(/(\d{4})(\d{2})(\d{2})/);
			var str2 = match[1] + '-' + match[2] + '-' + match[3];
			return str2;
		}

		//2개의 날짜 간의 기간계산
		//date1: 시작일, date2 : 종료일, interval: 계산 유형
		function dateDiff(date1, date2, interval) {
			var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
			// 구분자 없는 날짜는 계산을 위하여 변환함.
			if (date1.length == 8) date1 = convDateToYYYYMMDD(date1);
			if (date2.length == 8) date2 = convDateToYYYYMMDD(date2);

			date1 = date1.newDate();
			date2 = date2.newDate();

			var timediff = date2 - date1;

			if (isNaN(timediff)) return NaN;
			if (interval == undefined) interval = 'day';
			switch (interval) {
				case "year": return date2.getFullYear() - date1.getFullYear(); break;
				case "month": return (
                    (date2.getFullYear() * 12 + date2.getMonth())
                    -
                    (date1.getFullYear() * 12 + date1.getMonth())
                ); break;
				case "week": return Math.floor(timediff / week); break;
				case "day": return Math.floor(timediff / day); break; //시작일 산입 안됨
				case "hour": return Math.floor(timediff / hour); break;
				case "minute": return Math.floor(timediff / minute); break;
				case "second": return Math.floor(timediff / second); break;
				default: return Math.floor(timediff / day); break;
			}
		}

		function timeDiff(s, e) {
			var diff = (newDate("1970-1-1 " + e) - newDate("1970-1-1 " + s)) / 1000 / 60 / 60;
			//console.log(diff.toFixed(1));
			return diff;
		}
		//계산된 기간을 대상 필드에 삽입
		function calPeriod(from, to, ext, target, interval, digit) {
			//console.log('x' + from.prop('value') + 'x' + to.prop('value') + 'x');
			var t;
			if (from.prop('value') == undefined || to.prop('value') == undefined || from.val() == '' || to.val() == '') return;

			var s, d, r;
			if (from.val().indexOf(':') < 0 && to.val().indexOf(':') < 0) { //참조 필드의 데이터가 시간 타입이 아니면,
				t = dateDiff(from.val(), to.val(), interval);
				r = parseFloat(t.toFixed(digit)) + parseFloat(ext);
			} else {
				t = timeDiff(from.val(), to.val());
				if (digit == '+') {
					r = Math.ceil(t);
				} else if (digit == '-') {
					r = Math.floor(t);
				} else {
					r = t.toFixed(digit);
				}


			}

			target.val(r);
			$(document).trigger('formChanged');
		}

	};
	/*-------------------------------------------------
	 최대 입력 문자수가 제한되어 있는 컴포넌트
	---------------------------------------------------*/
	maxChar = function (el) {
		var $el = (typeof el === 'undefined') ? $('input[data-max-char]') : el;

		$el.each(function () {
			var o = $(this);
			//checkVal(o);
			bindEvent(o);
		});

		function bindEvent(el) {
			el.live('keyup change', function (event) { checkVal(el); });
		}

		function checkVal(o) {
			var test = tests.maxlength(o);
			//테스트 결과 : false이면
			if (!test.result) {
				validation.stopped = o;
				o.val(o.val().substr(0, parseInt(test.max)))
			}
			status.show(o, test.alerts);
			//문자열 길이 초과시 최대값으로 제한

		}
	};
	/*-------------------------------------------------
	 입력값(숫자)의 범위가 제한되어 있는 컴포넌트
	---------------------------------------------------*/
	checkRange = function (el) {
		var $el = (typeof el === 'undefined') ? $('input[data-range]') : el;

		$el.each(function () {
			var o = $(this);
			checkVal(o);
			bindEvent(o);
		});

		function bindEvent(el) {
			el.live('keyup change', function (event) { checkVal(el); });
		}

		function checkVal(o) {
			var test = tests.range(o);
			if (!test.result) validation.stopped = o;
		    // status.show(o, test.alerts);
            //2016-06-09 kimjh 범위 초과시 alert창
			if (test.result == false) {
			    alert("범위를 초과하였습니다. 다시 입력하시기 바랍니다.");
			    $(o).val("");
			}
		}
	};
	/*-------------------------------------------------
	 Form Submit에서 공백으로 남겨 둘 수 없는 컴포넌트
	---------------------------------------------------*/
	isRequired = function (el) {
		var $el = (typeof el === 'undefined') ? $('[required]').not('span') : el.not('span');

		$el.each(function () {
			var o = $(this);
			renderUI(o); //필수입력 항목 렌더링은 로드시 처리
		});
		//필수입력 필드임을 표시하는 UI 클래스 부여
		function renderUI(el) {
			el.addClass('input-required');
		}

		function bindEvent(el) {
		}

		function checkVal(o) {
			var test = tests.range(o);
			if (window.console) console.log(test.result);
			if (!test.result) {
				o.addClass('bad');
				validation.stopped = o;
			}
			status.show(o, test.alerts);

			return test.result;
		}

	}

	/*-------------------------------------------------
	 기간을 계산하는 컴포넌트
	---------------------------------------------------*/
	isSum = function (el) {
		var sum_container = '.multi-sum';
		if (window.console && options.debug) console.log('sum init');

		var $el = (typeof el === 'undefined') ? $('input[data-pattern=sum]') : el;

		$el.each(function () {
			var sRef;
			var $that = $(this);
			var sRef = $that.data().sumRef;
			var sTrigger = $that.data().sumTrigger;

			var refArray, $sum = $(this), $t;

			if (typeof sRef === 'undefined' || sRef === '') return;
			if (typeof sTrigger === 'undefined') sTrigger = '';

			//합계 계산버튼이 별도 없는 경우
			if (sTrigger == '') {
				//합계에 사용되는 계산 필드의 변경사항이 있는지 이벤트를 감지하여
				//이벤트 발생시 합계를 계산함.
				//멀티로우 템플릿 내인 경우는 바인드하지 않음. 2014.08.06. KJW
				if ($that.closest('.multi-row-template').length == 0) {
					bindChange($sum, sRef, $that);
				}
			} else {
				$t = $('[name=' + sTrigger + ']', $that.closest(sum_container));
				$t.unbind('click').bind('click', function () {
					getSum($that);
				});

			}
			//
			var sType = $sum.data().sumType;
			if (sType != undefined && sType == 'currency') {
				//합계필드는 currency 패턴을 지정할 수 없으므로 추가속성에 의해 처리. 2014.08.05. KJW
				//currency 패턴을 주면 소숫점의 자릿수 지정이 무시됨. 자릿수 처리가 필요한 경우는
				//currency 패턴을 주지 않도록 함. 2014.08.06. KJW.
				$sum.css('ime-mode', 'disabled')
                    .css('-ms-image-mode', 'disabled')
                    .css('text-align', 'right');
			}

		});

		//처음 화면이 로드되었을 때만 실행
		if (!options.initialized) {
			//폼의 변경사항 있을 때 합계를 재계산함
			//보충설명: formChanged 이벤트?
			//  폼의 변경사항 있을 때 발생하는 이벤트로, 다음의 경우에 명시적으로 이벤트를 발생시킴
			//  1. period 패턴이 참조하는 시작일과 종료일의 기간이 계산되어 값이 입력될 때,
			//  2. 멀티로우의 행 추가/삭제시

			$(document).on("formChanged", function (event) {
				$('input[data-pattern=sum]').each(function () {
					getSum($(this));
				});
			});
		}

		function bindChange($sum, sRef, $this) {
			var $container = $this.closest(sum_container);
			var formula = $this.data().formula;

			//sum 대상 필드의 값을 모니터링하여 변동내용이 있으면 합계 계산.
			var watch_array = getObjArray(sRef, $container);
			for (var i = 0; i < watch_array.length; i++) {
				var $w = watch_array[i];
				if ($w.hasClass('watch-value-active') == false) {
					$w.addClass('watch-value-active');
					$w.watch('value', function (propName, oldVal, newVal) {
						if (window.console) console.log('watch-value LN1099', 'Value has been changed to ' + newVal);
						if (window.console) console.log('isSum:formChanged');
						getSum($sum);
					});
				}
			}
			//register watch list
			watch_list.push(sRef);
		}

		function setVal(o, v) {
			var result;
			var tag = o.prop('tagName');
			if (tag.toLowerCase() == 'input') {
				o.val(v);
				result = (o.val() == v) ? true : false;
			} else {
				o.html(v);
				result = (o.html() == v) ? true : false;
			}

			return result;
		}

		function getSum($this) {
			var sRef = $this.data().sumRef;
			var sType = $this.data().sumType;
			var $container = $this.closest(sum_container);
			var sFormula = $this.data().formula;
			var formula_digit = ($this.data() != undefined && $this.data().formulaDigit != undefined) ? $this.data().formulaDigit : 0;
			var formula_under_zero = ($this.data() != undefined && $this.data().formulaZero != undefined) ? $this.data().formulaZero : 0.5;
			var obj_formula = {};
			obj_formula.digit = formula_digit;
			obj_formula.underzero = formula_under_zero;

			var total = 0, $els;
			var refArray = getObjArray(sRef, $container);
			var default_formula = '+';
			if (sFormula == undefined || sFormula == '') sFormula = default_formula;
			if (sFormula == '+' || sFormula == '*' || sFormula == '-' || sFormula == '/') {

				//IE8에서 위 코드의 배열처리시 오류가 있어, 아래와 같이 수정함. 2014-07-14. KJW
				var n = 0;
				for (var i = 0; i < refArray.length; i++) {
					$els = refArray[i];
					$els.each(function () {
						n++;
					});
				}
				var sCustomFormula = makeFormula(n, sFormula);

				n = 0;
				for (var j = 0; j < refArray.length; j++) {
					$els = refArray[j];
					$els.each(function () {
						var $o = $(this);
						if ($o.is('[data-pattern=numeral]')) {
							v = numeral().unformat($o.val());
						} else {
							v = $o.val();
						}

						if (notNumber(v)) return;
						if (v == '') v = 0;
						sCustomFormula = sCustomFormula.replace('{' + n + '}', v);
						n++;
					});
				}
				obj_formula.formula = sCustomFormula;
				total = sumFormula(obj_formula);

			} else {
				for (var i = 0; i < refArray.length; i++) {
					var $field = refArray[i], v;
					if ($field.is('[data-pattern=numeral]')) {
						v = numeral().unformat($field.val());
					} else {
						v = $field.val();
					}
					if ($.trim(v) == '') v = 0;
					sFormula = sFormula.replace('{' + i + '}', v);
				}
				obj_formula.formula = sFormula;
				total = sumFormula(obj_formula);
			}

			//currency 설정이 있으면 추가 처리
			//setVal($this, total);
			if (sType == 'currency') {
				total = total.currency();
				setVal($this, total);
			} else {
				setVal($this, total);
				if ($this.data().numeralFormat != null) {
					EASY.formatter($this, 'numeral');
				}
                
                if(typeof getInfo != 'undefined') {// 관리자 - Xeasy컴포넌트에서 getInfo 속성이 없다는 오류 발생으로 예외처리함.
                    if(getInfo("fmpf") == "WF_COVI_03") {
                        if(typeof afterSumFormula == 'function') {
                            afterSumFormula();
                        }
                    }
                }
			}
		}

		function getObj(r, c) {
			var $s;
			var $container = c;
			var container_exist = ($container == undefined || $container == null || $container.length == 0) ? false : true;
			if (r.indexOf('.') == 0) {
				//class selector
				if (container_exist) {
					$s = $(r, $container);
				} else {
					$s = $(r);
				}
			} else if (r.indexOf('#') == 0) {
				//id selector
				if (container_exist) {
					$s = $(r, $container);
				} else {
					$s = $(r);
				}
			} else {
				if (container_exist) {
					$s = $('[name="' + r + '"]', $container);
				} else {
					$s = $('[name="' + r + '"]');
				}
			}
			return $s;
		}

		function getObjArray(sRef, container) {
			var refArray, ref_name, $o, $els = [];

			if (typeof sRef === 'undefined' || sRef === '') return;

			refArray = sRef.split(',');
			for (var i = 0; i < refArray.length; i++) {
				ref_name = refArray[i];
				$o = getObj(ref_name, container);
				$els.push($o);
			}

			return $els;
		}
	}

	//n(umber): 횟수, s(ymbol): 부호
	function makeFormula(n, s) {
		if (n < 0) return;
		var r = '{0}';
		for (var i = 1; i < n; i++) {
			r += s + '{' + i + '}';
		}
		return r;
	}

	function sumFormula(obj_formula) {
		var r, f;
		f = obj_formula.formula;
		var d = obj_formula.digit;
		var z = obj_formula.underzero;

		f = f.replace(/ /g, '');
		f = f.replace(/,/g, '');
		f = f.replace('/0', '/1');
		if (window.console && options.debug) console.log(f);
		try {
			if (!script_stop) r = eval(f);
		} catch (e) {
			r = 0;
			//watchStop();
		}

		r = isNaN(r) ? 0 : r;
		r = r.toDigit(d, z);
		return r;
	}

	//데모 페이지를 위한 함수
	demo = function () {
		$('.code-source').each(function () {
			var s = $(this).data().source;
			var $c = $('#' + s).clone();
			$c.find('.code').remove();

			var html = $c.html();
			if (html) {
				html = html.replace(/\</g, '&lt;');
				html = html.replace(/\>/g, '&gt;');
			}

			$(this).append(html).snippet('html', { style: 'kwrite', showNum: false }); //whitengrey
		});
	};

	function notNumber(a) {
		if (isNaN(parseFloat(a)) && !isFinite(a)) {
			return true;
		} else {
			return false;
		}
	}

	/*-------------------------------------------------
	 한글의 초/중/종성을 추출하는 함수
	---------------------------------------------------*/
	function iSound(a) {
		var r = ((a.charCodeAt(0) - parseInt('0xac00', 16)) / 28) / 21;
		var t = String.fromCharCode(r + parseInt('0x1100', 16));
		return t;
	}

	function mSound(a) {
		var r = ((a.charCodeAt(0) - parseInt('0xac00', 16)) / 28) % 21;
		var t = String.fromCharCode(r + parseInt('0x1161', 16));
		return t;
	}

	function tSound(a) {
		var s = {};
		var r = (a.charCodeAt(0) - parseInt('0xac00', 16)) % 28;
		var c = r + parseInt('0x11A8') - 1;
		s.char = (c != 4519) ? String.fromCharCode(c) : ''
		s.last = (s.char == '') ? false : true;
		return s;
	}
	//한글 문자열의 주어 또는 목적어 접미사 반환
	function hangeulSuffix(a) {
//		var r = {};
//		r.subjectSuffix = tSound(lastChar(a)).last ? '이' : '가';
//		r.objectSuffix = tSound(lastChar(a)).last ? '을' : '를';
//		return r;
        var r = {};
        if(Common.getSession('LanguageCode') == 'ko')
        {
        r.subjectSuffix = tSound(lastChar(a)).last ? '이' : '가';
		r.objectSuffix = tSound(lastChar(a)).last ? '을' : '를';
        }else{
        r.subjectSuffix = ' '; // r.subjectSuffix = tSound(lastChar(a)).last ? ' ' : ' '
		r.objectSuffix = ' '; // r.objectSuffix = tSound(lastChar(a)).last ? ' ' : ' '
        }
        	return r;
	}
	//문자열의 마지막 1개 문자
	function lastChar(a) {
		if (a == null || a == '') return '';
		//console.log(a.substr(a.length-1, 1));
		return a.substr(a.length - 1, 1);

	}

	/*-------------------------------------------------
	 입력 필드 가이드 Extension
	---------------------------------------------------*/
	// jQuery Input Hints plugin
	// Copyright (c) Rob Volk
	// https://github.com/robvolk/jQuery.InputHints
	// http://robvolk.com/jquery-form-input-hints-plugin

	(function ($) { // alias the $ function for use with jquery in no-conflict mode
		$.fn.inputHints = function () {
			function showHints(el) {
				if (jQuery(el).val() == '')
					jQuery(el).val($(el).attr('placeholder'))
                        .addClass('hint');
			};

			function hideHints(el) {
				if ($(el).val() == $(el).attr('placeholder'))
					$(el).val('')
                        .removeClass('hint');
			};

			// hides the input display text stored in the placeholder on focus
			// and sets it on blur if the user hasn't changed it.

			var el = $(this);

			// show the display text on empty elements
			el.each(function () {
				showHints(this);
			});

			// clear the hints on form submit
			el.closest('form').submit(function () {
				el.each(function () {
					hideHints(this);
				});
				return true;
			});

			// hook up the blur &amp; focus
			return el.focus(function () {
				hideHints(this);
			}).blur(function () {
				showHints(this);
			});
		};
	})(jQuery);
	/*-------------------------------------------------
	  html 개체의 복사본을 만들고 ID를 제거한 개체를 반환
	---------------------------------------------------*/
	(function ($) {
		$.fn.twin = function () {
			var o = $(this);
			var s = rmAttr(o);
			o.after(s);
			return o.next();

			function walkDom(node, func) {
				func(node);
				node = node.firstChild;
				while (node) {
					walkDom(node, func);
					node = node.nextSibling;
				}
			};

			function rmAttr(el) {
				var wrapper = document.createElement('div');
				wrapper.innerHTML = el[0].outerHTML;
				walkDom(wrapper, function (el) {
					if (el.removeAttribute) {
						el.removeAttribute('id');
					}
				});
				let result = wrapper.innerHTML;
				return result;
			}
		};
	})(jQuery);

	/*-------------------------------------------------
	 jQuery 캘린더 Custom
	---------------------------------------------------*/
	(function ($) { // alias the $ function for use with jquery in no-conflict mode
		$.fn.datePicker = function (json_option) {

			var not_valid_date = '날짜를 다시 확인해 주세요';
			var not_selectable_date = '선택 가능한 날짜 또는 요일이 아닙니다';
			//날짜를 매뉴얼로 입력시 validation을 위해 기존의 유효한 값을 백업함(data-backup-before)
			var backupValue = function backupValue(elem) {
				elem.data('backup-before', elem.val());
			}
			//날짜의 validation 실패시 기존의 유효한 값으로 복원함(data-backup-before)
			var restoreValue = function restoreValue(elem) {
				elem.val(elem.data().backupBefore);
			}

			function getDateFormat(elem) {
				var date_format = elem.data().dateFormat;
				var is_yymm = elem.hasClass('date-year-month');

				if (date_format == undefined) {
					date_format = (!is_yymm) ? 'yy-mm-dd' : 'yy.mm';
				}
				return date_format;
			}

			/* korean */
			$.datepicker.regional['ko'] = {
				closeText: '완료',
				prevText: '', //let this blank in case of using image 
				nextText: '', //let this blank in case of using image
				currentText: '오늘',
				monthNames: ['1월', '2월', '3월', '4월', '5월', '6월',
                             '7월', '8월', '9월', '10월', '11월', '12월'],
				monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월',
                                  '7월', '8월', '9월', '10월', '11월', '12월'],
				dayNames: ['일', '월', '화', '수', '목', '금', '토'],
				dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
				dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
				dateFormat: 'yy-mm-dd', firstDay: 0,
				isRTL: false,
				showMonthAfterYear: true
			};

			/* English */
			$.datepicker.regional['en'] = {
				closeText: 'close',
				prevText: '', //let this blank in case of using image 
				nextText: '', //let this blank in case of using image
				currentText: 'Today',
				//monthNames: ['JAN','FEB','MAR','APR','MAY','JUN',
				//             'JUL','AUG','SEP','OCT','NOV','DEC'],
				//monthNamesShort: ['JAN','FEB','MAR','APR','MAY','JUN',
				//             'JUL','AUG','SEP','OCT','NOV','DEC'],
				dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				dateFormat: 'yy-mm-dd', firstDay: 0,
				isRTL: false
			};

			//오늘로 이동 버튼
			$.datepicker._gotoToday = function (id) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
					inst.selectedDay = inst.currentDay;
					inst.drawMonth = inst.selectedMonth = inst.currentMonth;
					inst.drawYear = inst.selectedYear = inst.currentYear;
				}
				else {
					var date = new Date();
					inst.selectedDay = date.getDate();
					inst.drawMonth = inst.selectedMonth = date.getMonth();
					inst.drawYear = inst.selectedYear = date.getFullYear();
					// the below two lines are new
					this._setDateDatepicker(target, date);
					this._selectDate(id, this._getDateDatepicker(target));
				}
				this._notifyChange(inst);
				this._adjustDate(target);
			}

			var $el = $(this);
			//기본 언어 설정: ko
			$.datepicker.setDefaults($.datepicker.regional['ko']);
			//월 Select 클릭시 Select 창이 열렸다 다시 닫히는 버그(jquery.1.8.18 이전 버전의 버그)를 수정. 2014.07.28. KJW
			$.datepicker._clickMonthYear = function (id) { };

			$el.each(function () {
				//년-월로만 구성된 일자를 사용하기 위한 class
				var is_yymm = $(this).hasClass('date-year-month');

				var date_format = $(this).data().dateFormat;
				var date_months = $(this).data().dateMonths;
				var date_min = $(this).data().dateMin;
				var date_max = $(this).data().dateMax;
				var date_default = $(this).val();
				//HTML Markup에서 정의한 jQuery 옵션
				var date_extens_html = (typeof $(this).data().dateExt === 'undefined') ? {} : $(this).data().dateExt;
				//파라미터로 넘겨 받은 jQuery 옵션
				var date_extens_param = (typeof json_option === 'undefined') ? {} : json_option;
				//옵션 병합
				$.extend(date_extens_param, date_extens_html);

				if (date_months == undefined) date_months = 1;
				if (date_default == undefined) date_default = '';
				if (date_format == undefined) {
					date_format = (!is_yymm) ? 'yy-mm-dd' : 'yy.mm';
				}
				//locale 확인
				var date_locale = $(this).data().dateLocale; //ko, en, fr, it
				if (date_locale == undefined) date_locale = 'ko';

				//선택 불가 요일(단축 요일명의 리스트. 콤마로 구분)
				var disabled_days = $(this).data().dateDisabled;
				//선택 불가 요일을 인덱스(숫자)로 변환한 목록
				var disabled_days_index = getDisabledDayIndex(disabled_days);

				var date_options = {
					minDate: date_min, //최소일
					maxDate: date_max, //최대일
					showButtonPanel: true,
					showOtherMonths: true,
					selectOtherMonths: true, //이전 또는 다음월의 일부 일자를 표시(요일의 남은 기간)
					changeMonth: true, //월 선택 셀렉트
					changeYear: true, //년 선택 셀렉트
					dateFormat: date_format, //날짜 형식
					setDate: date_default,  //캘린더 팝업시 기본으로 선택되는 날짜
					numberOfMonths: date_months,
					//캘린더 표시 전 처리(공통)
					beforeShow: function (input) {
						setTimeout(function () {
							$('.ui-datepicker').addClass('ui-datepicker-pop');
						}, 1);

						//ActiveX 위에 올리기위해 배경 깔기
						setTimeout(function () {
							$("#ui-datepicker-div").before("<iframe id='ui-datepicker-div-bg-iframe' class='datepicker-iframe' frameborder='0' scrolling='no' style='filter:alpha(opacity=0); position:absolute; "
                                    + "left: " + $("#ui-datepicker-div").css("left") + ";"
                                    + "top: " + $("#ui-datepicker-div").css("top") + ";"
                                    + "width: " + $("#ui-datepicker-div").outerWidth(true) + "px;"
                                    + "height: " + $("#ui-datepicker-div").outerHeight(true) + "px;'></iframe>");
						}, 50);
					},
					onClose: function (dateText, inst) {
						//ActiveX 위에 올리기위해 추가한 배경 제거
						//#ui-datepicker-div-bg-iframe 를 datepicker-iframe 클래스로 변경. iframe이 남아 있는 경우 방지. 2014.07.30. KJW
						$(".datepicker-iframe").remove();
					},
					//선택 불가능한 요일의 설정
					//date: 캘린더의 각 일자(date형)
					//getDay(): 요일 인덱스 반환
					//disabled_days_index: 선택 불가 요일 리스트를 요일인덱스로 변환한 목록
					beforeShowDay: function (date) {
						if (disabled_days_index.length = 0) {
							return [false, ""];
						} else {
							var day_disabled = checkDisabledDays(date.getDay(), disabled_days_index);
							return [!day_disabled, ""];
						}
					}

				}
				//년-월 표시 캘린더에만 해당
				if (is_yymm) {
					var date_options_ext = {
						//캘린더가 닫힐 때 처리
						onClose: function (dateText, inst) {
							var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
							var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
							//캘린더의 reopen 방지를 위해 disable, enable 코드 추가. 2014.07.30.KJW
							$(this).datepicker('disable');
							$(this).datepicker('setDate', new Date(year, month, 1));
							$(this).datepicker('enable');
							//이벤트 바인딩 제거
							$('.ui-datepicker').off('click change', '.ui-datepicker-next, .ui-datepicker-prev, .ui-datepicker-month, .ui-datepicker-year');
							//캘린더 숨김
							hideCal();
							//년월 선택시 change 이벤트
							$(this).change();
						},
						//캘런더 표시전 처리
						beforeShow: function (input) {
							setTimeout(function () {
								$('.ui-datepicker').addClass('ui-datepicker-pop');
								$('.ui-datepicker').off('mousehover', '.ui-datepicker-next');

								hideCal();

								//날짜 선택시
								$('.ui-datepicker')
                                .on('click change', '.ui-datepicker-next, .ui-datepicker-prev, .ui-datepicker-month, .ui-datepicker-year', function () {
                                	hideCal();
                                });
								//창 닫기 이벤트
								$('.ui-datepicker')
                                .off('click', '.ui-datepicker-close')
                                .on('click', '.ui-datepicker-close', function () {
                                	hideCal();
                                });

							}, 1);
						}
					};
					//캘린더 옵션 병합
					$.extend(date_options, date_options_ext);
					$.extend(date_options, date_extens_param);
				}
				//요일 인덱스가 disabled 값 범위 내인지 판단
				//day_index: 캘린더 각 일자의 요일(0~6)
				//disabled_days_index : data-date-disabled에서 지정한 disabled 요일을 인덱스로 변환한 목록
				function checkDisabledDays(day_index, disabled_days_index) {
					var arr_days = (disabled_days_index == undefined) ? [] : disabled_days_index.split(',');
					var is_disabled_day = false;
					for (var x = 0; x < arr_days.length; x++) {
						//공백 제외
						if ($.trim(arr_days[x]) == '') continue;
						//요일 인덱스가 disabled 값 범위 내인 경우
						if (parseInt(arr_days[x]) == parseInt(day_index)) {
							is_disabled_day = true;
							break;
						}
					}
					return is_disabled_day;
				}
				//disabed로 설정한 요일명 리스트를 요일 인덱스 리스트로 변환
				//disabled_days: 선택 불가 요일 인덱스 예) 0,1 ---> 일, 월
				function getDisabledDayIndex(disabled_days) {
					var arr_days = (disabled_days == undefined) ? [] : disabled_days.split(',');
					var day_index_list = '';
					for (var x = 0; x < arr_days.length; x++) {
						if (x > 0) day_index_list += ',';
						day_index_list += getDayIndex(arr_days[x]);
					}
					return day_index_list;
				}
				//단축 요일명을 요일 인덱스로 변환
				//day_shortname: 요일의 단축명(sun --> sunday, mon ---> monday... )
				function getDayIndex(day_shortname) {
					var day_index;
					switch (day_shortname) {
						case 'sun':
							day_index = 0;
							break;
						case 'mon':
							day_index = 1;
							break;
						case 'tue':
							day_index = 2;
							break;
						case 'wed':
							day_index = 3;
							break;
						case 'thu':
							day_index = 4;
							break;
						case 'fri':
							day_index = 5;
							break;
						case 'sat':
							day_index = 6;
							break;
					}
					return day_index;
				}

				//캘린더 숨김
				function hideCal() {
					$('.ui-datepicker-calendar').hide();
					$('.ui-datepicker-current').hide();
					$('.ui-datepicker-close').show();
				}
				//날짜를 필드에 직접 입력할 수 있도록 함. 2014.07.11. KJW
				//포커스를 받으면 서식을 제거하여 yyyymmdd 형식에서 수정하고,
				//포커스를 잃으면 data-date-format 속성에 따라 서식을 재적용하여 표시함.
				//주의: jquery datepicker의 특성상 캘린더 레이어가 뜬 상태에서 enter키를 
				//      입력하면 현재 날짜가 필드에 들어가도록 되어 있음. 따라서, 직접 입력한 날짜를
				//      필드에 반영하기 위해서는 가능한 마우스 click을 이용하거나, 빠른 입력을 위해서는
				//      TAB키를 이용하기 바람
				$(this).datepicker(date_options)
                    .on("focus", function (e) {
                    	var df = getDateFormat($(this));
                    	var curDate = $(this).val();
                    	try {
                    		backupValue($(this));
                    		var r = $.datepicker.parseDate(df, curDate);
                    		var r2 = $.datepicker.formatDate("yymmdd", r);
                    		$(this).val(r2);
                    	} catch (e) {

                    	}
                    }).on("blur", function (e) {
                    	var df = getDateFormat($(this));
                    	var curDate = $(this).val();
                    	if (curDate == '') return; //날짜를 제거하는 경우는 허용


                    	try {
                    		if ($(this).hasClass('date-year-month')) {

                    		} else {

                    			//날짜 형식 일치 여부
                    			var r = $.datepicker.parseDate("yymmdd", curDate);
                    			var r2 = $.datepicker.formatDate(df, r);

                    			//날짜 선택 가능 여부
                    			if (checkInputIsDisabled(r, $(this))) {
                    				alert(not_selectable_date);
                    				restoreValue($(this));
                    				return;
                    			}

                    			$(this).val(r2);
                    		}

                    	} catch (e) {
                    		//포맷이 들어간 날짜는 아래의 로직으로 처리
                    		try {
                    			var x = $.datepicker.parseDate(df, curDate);
                    			var x2 = $.datepicker.formatDate(df, x);
                    			//날짜 선택 가능 여부
                    			if (checkInputIsDisabled(x, $(this))) {
                    				alert(not_selectable_date);
                    				restoreValue($(this));
                    				return;
                    			}
                    			$(this).val(x2);
                    		} catch (e) {
                    			alert(not_valid_date);
                    			restoreValue($(this));
                    		}
                    	}
                    });

				function checkInputIsDisabled(date, elem) {
					//선택 불가 요일(단축 요일명의 리스트. 콤마로 구분)
					var disabled_days = elem.data().dateDisabled;
					//선택 불가 요일을 인덱스(숫자)로 변환한 목록
					var disabled_days_index = getDisabledDayIndex(disabled_days);
					var day_disabled = checkDisabledDays(date.getDay(), disabled_days_index);
					return day_disabled;
				}
			});
		};
	})(jQuery);

	/*-------------------------------------------------
	 행/열 합계 테이블
	---------------------------------------------------*/

	jQuery.fn.extend({
		removeComma: function () {
			this.val(this.val().replace(/,/g, ""));
			return this;
		},
		insertComma: function () {
			try {
				var num = this.val();
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
				this.val(ns);
				return this;
			}
			catch (ex) {
			}
		},
		tableSum: function (opt) {
			var $tables = this;

			var form_mode = options.mode;
			var json;
			if (typeof opt === 'undefined') {
				json = {};
			} else {
				json = (typeof opt === 'object') ? opt : jQuery.parseJSON(opt);
			}

			$tables.each(function () {
				//합계 테이블 초기화시 클래스 추가
				var $table = $(this);
				if ($table.hasClass('table-sum-active')) return; //이미 초기화된 경우 진행 중지
				if ($table.closest('.pattern-skip').length > 0) return; //패턴 스킵의 자손이면 진행 중지

				sum($(this), json);
				//읽기 모드에서 우측정렬을 위해 스타일 추가
				if (form_mode == 'R') {
					//sum-table-cell
					//$(this).find('.sum-table-cell').css('display', 'inline-block');
					//$(this).find('.sum-table-rowsum').css('display', 'inline-block');
					//$(this).find('.sum-table-colsum').css('display', 'inline-block');
					//$(this).find('.sum-table-total').css('display', 'inline-block');
				}

				$table.addClass('table-sum-active');
			});

			function sum(table, json) {

				var btnC = json.calButton;
				var $tb = table;
				var skip = false;
				if (btnC == null) btnC = '.table-sum-button';

				bindEvent($tb);

				function skipEvent(bl) {
					if (typeof bl === 'undefined') {
						return skip;
					} else {
						skip = bl;
					}
				}
				function bindEvent(tb) {
					//합계 버튼 클릭
					$tb.on('change', '.sum-table-cell', function () {

						if (window.console && options.debug) console.log('change_sum:' + skip);
						if (skipEvent()) {
							skipEvent(false);
							return;
						}

						getSum(tb);
						if (window.console && options.debug) console.log('change_sum_exec:' + skip);

					});

					$tb.on('keyup', '.sum-table-cell', function () {
						getSum(tb);
						skipEvent(true);
						//합계 필드의 패턴 재처리-2014.06.23. KJW
						EASY.formatter($('.sum-table-total', $tb));
						EASY.formatter($('.sum-table-colsum', $tb));
						EASY.formatter($('.sum-table-rowsum', $tb));
					});

					$tb.on('click', btnC, function () {
						getSum(tb);
					});

                    //합계 버튼 클릭
                                    

					$(document).on("formChanged", function (event) {
						if (window.console) console.log('tableSum.formChanged');
						getSum(tb);
					});


				}
				//n(umber): 횟수, s(ymbol): 부호
				function makeFormula(n, s) {
					if (n < 0) return;
					var r = '{0}';
					for (var i = 1; i < n; i++) {
						r += s + '{' + i + '}';
					}
					return r;
				}
				function validateFormula(f) {
					var v = true;
					if (f.indexOf('{') > -1 || f.indexOf('}') > -1) {
						v = false;
					}
					return v;
				}
				//수식 필드의 계산값을 반환 & 자릿수와 절사 처리
				function calFormula(f, d, z) {
					var r, s;
					s = f;
					s = s.replace(/ /g, '');
					s = s.replace(/\/0/g, '/1');
					if (window.console && options.debug) console.log(s);
					r = eval(s);
					r = isNaN(r) ? 0 : r;
					r = r.toDigit(d, z);
					return r;
				}

				function convZeroToBlank(v) {
					return (parseInt(v) == 0) ? '' : v;
					//return (v + '' == '0') ? '' : v;
				}

				function getNumeralUnFormat(el) {
					var v = getValue(el);
					if ($.trim(v) == '') return; //빈값이면 공백 반환하고 종료

					//numeral 포맷여부 확인
					var f = el.data().numeralFormat;

					if (f != null) {
						//numeral 패턴이면 패턴에서 지정한 자릿수를 반영한 값을 반환
						if (typeof el.data().numeralNation === 'string') {
							numeral.language(el.data().numeralNation);
						} else {
							numeral.language('kr');
						}
						return numeral().unformat(v) + ''; //문자로 반환
					} else {
						//아니면 숫자화한 값을 반환
						return v.numeric();
					}
				}

				function getValue(el) {
					var t = hasVal(el);
					return (t) ? el.val() : el.html();
				}
				function hasVal(el) {
					var t = el.prop('tagName').toLowerCase();
					return (t == 'input' || t == 'textarea') ? true : false;
				}
				function getDigitFormat(elem, number) {
					var digit = getDigit(elem);
					var digit_zero = getDigitZero(elem);
					if (digit == null || digit_zero == null) {
						return number;
					}
					return number.toDigit(digit, digit_zero);
				}
				function getDigit(elem) {
					var digit = elem.data().digit;
					if (digit == null) {
						digit = elem.data().formulaDigit;
					}

					return digit;
				}
				function getDigitZero(elem) {
					var digit_zero = elem.data().digitZero;
					if (digit_zero == null) {
						digit_zero = elem.data().formulaZero;
					}
					return digit_zero;
				}

//				function getSum(tb) {
//					var col_sum = [];
//					var row_sum = [];
//					var $tb = tb;
//					var total = 0;
//					var row = -1, t, v = 0;
//					var $trRows = $tb.children('tbody').children('tr');
//					var $tdCells = $trRows.children('td');

//					var colsum_nums = $tdCells.children('.sum-table-colsum').length;
//					var total_nums = $tdCells.children('.sum-table-total').length;
//					var cell_index = -1;
//					var colsum_by_cell_index = [];
//					var total_index = -1;
//					var total_by_row_index = [];

//					var $total_cell = $tb.children('tbody').children('tr').children('td').children('.sum-table-total');
//					var total_formula_digit = ($total_cell.data() && $total_cell.data().formulaDigit) ? $total_cell.data().formulaDigit : 0;
//					var formula_not_validated = false;
//					//row
//					$trRows.each(function (i, tr) {
//						var $tr = $(this);
//						var $cells = $tr.children('td');
//						var $fields = $cells.children('.sum-table-cell');
//						var cell_num = $fields.length;
//						if (cell_num == 0) return;

//						var $row_sum = $cells.children('.sum-table-rowsum');
//						//data-digit 이 data-formula-digit보다 우선
//						var formula = ($row_sum.data() && $row_sum.data().formula) ? $row_sum.data().formula : '+';
//						var formula_digit = ($row_sum.data() && $row_sum.data().formulaDigit != undefined) ? $row_sum.data().formulaDigit : 0;
//						formula_digit = ($row_sum.data() && $row_sum.data().digit != undefined) ? $row_sum.data().digit : formula_digit;

//						//data-digit-zero 가 data-formula-zero보다 우선
//						var digit_zero = ($row_sum.data() && $row_sum.data().formulaZero != undefined) ? $row_sum.data().formulaZero : 0.5;
//						digit_zero = ($row_sum.data() && $row_sum.data().digitZero != undefined) ? $row_sum.data().digitZero : digit_zero;

//						var temp_formula = '';
//						var custom_formula;

//						if (formula == '+' || formula == '*') {
//							custom_formula = makeFormula(cell_num, formula);
//						} else {
//							custom_formula = formula;
//						}

//						//return;

//						if ($fields.length == 0) {
//							return;
//						} else {
//							row++;
//						}

//						if (row_sum[row] == null) row_sum[row] = 0;
//						//field
//						$fields.each(function (col, field) {
//							var $field = $(this);
//							t = getNumeralUnFormat($field);
//							//콤마가 포함된 숫자의 계산 오류 방지를 위해 콤마제거. 2014.07.30.KJW
//							t = (t == undefined) ? 0 : t.numeric();
//							v = (t == '') ? 0 : parseFloat(t);
//							v = isNaN(v) ? 0 : v;

//							//열 합계 셀의 개수만큼 배열 인덱스 증가 - 2단 합계 행의 고려
//							cell_index = (++cell_index) % colsum_nums;
//							if (colsum_by_cell_index[cell_index] == null) colsum_by_cell_index[cell_index] = 0;
//							colsum_by_cell_index[cell_index] += v;

//							custom_formula = custom_formula.replace('{' + col + '}', v);

//						});
//						if (!validateFormula(custom_formula)) {
//							formula_not_validated = true;
//							return false;
//						}
//						row_sum[row] = calFormula(custom_formula, formula_digit, digit_zero);

//						//2단 합계 행의 고려
//						total_index = (++total_index) % total_nums;
//						if (total_by_row_index[total_index] == null) total_by_row_index[total_index] = 0;
//						total_by_row_index[total_index] += parseFloat(row_sum[row]);
//					});

//					if (formula_not_validated) {
//						alert('행 합계의 수식에 오류가 있습니다\n계산필드 외 필드가 포함되어 있는지 확인하세요');
//						return;
//					}

//					$tdCells.children('.sum-table-colsum').each(function (col, tr) {
//						//2단 합계행의 예
//						var digit_formatted = getDigitFormat($(this), colsum_by_cell_index[col]);
//						//var fv = convZeroToBlank(digit_formatted);
//						var fv = ($(this).hasClass('keep-zero-format')) ? digit_formatted : convZeroToBlank(digit_formatted);
//						//toDigit
//						$(this).val(fv);
//						formatter($(this));
//					});

//					$tdCells.children('.sum-table-rowsum').each(function (row, tr) {
//						var digit_formatted = getDigitFormat($(this), row_sum[row]);
//						//var fv = convZeroToBlank(digit_formatted);
//						var fv = ($(this).hasClass('keep-zero-format')) ? digit_formatted : convZeroToBlank(digit_formatted);
//						$(this).val(fv);
//						formatter($(this));
//					});

//					//2단 합계행의 예
//					$tdCells.children('.sum-table-total').each(function (row, tr) {
//						var total = total_by_row_index[row];
//						total = isNaN(total) ? 0 : total;

//						var digit_formatted = getDigitFormat($(this), total);
//						$(this).val(digit_formatted);
//						formatter($(this));
//					});

//				}
//			}
//		}

//	});

//150902: 변경: 부분합(열 소계) 기능 추가
				function getSum(tb) {
                    var col_sum = [];
                    var row_sum = [];
                    var $tb = tb;
                    var total = 0;
                    var row = -1, t, v = 0;
                    //멀티로우내 합계 테이블사용시 템플릿을 계산에서 제외: 15.08.31
                    var templateLength = $tb.find('.multi-row-template').length;
                    var $trRows = (templateLength > 0) ? $tb.children('tbody').children('tr.multi-row') : $tb.children('tbody').children('tr');
                    var $tdCells = $trRows.children('td');

                    var colsum_nums = $tb.find('.sum-table-colsum').length;
                    var total_nums = $tb.find('.sum-table-total').length;
                    //부분 소계
                    var subcolsum_nums = $tdCells.children('.sum-table-subcolsum').length;
                    var subtotal_nums = $tdCells.children('.sum-table-subtotal').length;
                    
                    var tpl_nums = $trRows.length / templateLength; // 템플릿 단위의 데이터행 개수
                    var tpl_colsum_nums = (templateLength === 0) ? subcolsum_nums : (subcolsum_nums / tpl_nums);
                    var tpl_total_nums = (templateLength === 0) ? subtotal_nums : (subtotal_nums / tpl_nums);
                    
                    var cell_index = -1;
                    var sub_cell_index = -1;
                    
                    var colsum_by_cell_index = [];
                    var sub_colsum_by_cell_index = [];
                    
                    var total_index = -1;
                    var total_by_row_index = [];
                    
                    var subtotal_index = -1;
                    var subtotal_by_row_index = [];
                    var formula_not_validated = false;
                    //row
                    var templateIndex = [];
                    $trRows.each(function (i, tr) {
                        var $tr = $(this);
                        var $cells = $tr.children('td');
                        var $fields = $cells.children('.sum-table-cell');
                        var cell_num = $fields.length;
                        var tId = (templateLength === 0) ? 0 : parseInt(i / templateLength); //반복구간 인덱스
                        if (cell_num == 0) {
                            // 새로운 템플릿 영역
                            if( (i+1) % templateLength === 0 ){
                                templateIndex[tId] = sub_colsum_by_cell_index.slice(0);
                                sub_colsum_by_cell_index = []; //초기화
                                //for(var i in sub_colsum_by_cell_index){
                                //    sub_colsum_by_cell_index[i] = ''; //초기화
                                //}
                            }  
                            return;
                        }

                        var $row_sum = $cells.children('.sum-table-rowsum');
                        //data-digit 이 data-formula-digit보다 우선
                        var formula = ($row_sum.data() && $row_sum.data().formula) ? $row_sum.data().formula : '+';
                        var formula_digit = ($row_sum.data() && $row_sum.data().formulaDigit != undefined) ? $row_sum.data().formulaDigit : 0;
                        formula_digit = ($row_sum.data() && $row_sum.data().digit != undefined) ? $row_sum.data().digit : formula_digit;

                        //data-digit-zero 가 data-formula-zero보다 우선
                        var digit_zero = ($row_sum.data() && $row_sum.data().formulaZero != undefined) ? $row_sum.data().formulaZero : 0.5;
                        digit_zero = ($row_sum.data() && $row_sum.data().digitZero != undefined) ? $row_sum.data().digitZero : digit_zero;

                        var temp_formula = '';
                        var custom_formula;

                        if (formula == '+' || formula == '*') {
                            custom_formula = makeFormula(cell_num, formula);
                        } else {
                            custom_formula = formula;
                        }

                        //return;

                        if ($fields.length == 0) {
                            return;
                        } else {
                            row++;
                        }

                        if (row_sum[row] == null) row_sum[row] = 0;
                        //field
                        $fields.each(function (col, field) {
                            var $field = $(this);
                            t = getNumeralUnFormat($field);
                            //콤마가 포함된 숫자의 계산 오류 방지를 위해 콤마제거. 2014.07.30.KJW
                            t = (t == undefined) ? 0 : t.numeric();
                            v = (t == '') ? 0 : parseFloat(t);
                            v = isNaN(v) ? 0 : v;

                            //열 합계 셀의 개수만큼 배열 인덱스 증가 - 2단 합계 행의 고려
                            cell_index = colsum_nums === 0 ? (cell_index + 1): (cell_index + 1) % colsum_nums;
                            if (colsum_by_cell_index[cell_index] == null) colsum_by_cell_index[cell_index] = 0;
                            colsum_by_cell_index[cell_index] += v;
                            
                            //열 소계 계산
                            sub_cell_index = cell_index % tpl_colsum_nums;
                            if (sub_colsum_by_cell_index[sub_cell_index] == null) sub_colsum_by_cell_index[sub_cell_index] = 0;
                            sub_colsum_by_cell_index[sub_cell_index] += v;                            

                            custom_formula = custom_formula.replace('{' + col + '}', v);

                        });
                        if (!validateFormula(custom_formula)) {
                            formula_not_validated = true;
                            return false;
                        }
                        row_sum[row] = calFormula(custom_formula, formula_digit, digit_zero);

                        //전체 계: 2단 합계 행의 고려
                        total_index = (++total_index) % total_nums;
                        if (total_by_row_index[total_index] == null) total_by_row_index[total_index] = 0;
                        total_by_row_index[total_index] += parseFloat(row_sum[row]);
                        
                        //행소계의 합
                        subtotal_index = tId;
                        if (subtotal_by_row_index[subtotal_index] == null) subtotal_by_row_index[subtotal_index] = 0;
                        subtotal_by_row_index[subtotal_index] += parseFloat(row_sum[row]);
                        
                    });

                    if (formula_not_validated) {
                        alert('행 합계의 수식에 오류가 있습니다\n계산필드 외 필드가 포함되어 있는지 확인하세요');
                        return;
                    }
                    //열 합계 값 표시
                    $tb.find('.sum-table-colsum').each(function (col, tr) {
                        //2단 합계행의 예
                        var digit_formatted = getDigitFormat($(this), colsum_by_cell_index[col]);
                        var fv = ($(this).hasClass('keep-zero-format')) ? digit_formatted : convZeroToBlank(digit_formatted);
                        //toDigit
                        $(this).val(fv);
                        formatter($(this));
                    });
                    //열 소계 값 표시
                    var $subcolsum = $tdCells.children('.sum-table-subcolsum'), 
                        sublength = $subcolsum.length / tpl_nums; // 멀티로우 각 반복구간 내 열소계 필드의 개수
                    $subcolsum.each(function (col, tr) {
                        var subRowId = parseInt(col / sublength);
                        var subColId = col % sublength;
                        var digit_formatted = getDigitFormat($(this), templateIndex[subRowId][subColId]);
                        var fv = ($(this).hasClass('keep-zero-format')) ? digit_formatted : convZeroToBlank(digit_formatted);
                        //toDigit
                        $(this).val(fv);
                        formatter($(this));
                    });
                    
                    //행 합계 값 표시
                    $tdCells.children('.sum-table-rowsum').each(function (row, tr) {
                        var digit_formatted = getDigitFormat($(this), row_sum[row]);
                        var fv = ($(this).hasClass('keep-zero-format')) ? digit_formatted : convZeroToBlank(digit_formatted);
                        $(this).val(fv);
                        formatter($(this));
                    });

                    //2단 합계행의 예
                    $tb.find('.sum-table-total').each(function (row, tr) {
                        var total = total_by_row_index[row];
                        total = isNaN(total) ? 0 : total;

                        var digit_formatted = getDigitFormat($(this), total);
                        $(this).val(digit_formatted);
                        formatter($(this));
                    });
                    
				    //소계 값 표시
                    $tdCells.children('.sum-table-subtotal').each(function (row, tr) {
                        var total = subtotal_by_row_index[row];
                        total = isNaN(total) ? 0 : total;

                        var digit_formatted = getDigitFormat($(this), total);
                        var fv = ($(this).hasClass('keep-zero-format')) ? digit_formatted : convZeroToBlank(digit_formatted);
                        $(this).val(fv);
                        formatter($(this));
                    }); 

                }
				
			}
		}

	});


	/*-------------------------------------------------
         table to CSV
    ---------------------------------------------------*/
	jQuery.fn.table2CSV = function (options) {
		var options = jQuery.extend({
			separator: ',',
			header: [],
			delivery: 'popup' // popup, value
		},
                                    options);

		var csvData = [];
		var headerArr = [];
		var el = this;

		//header
		var numCols = options.header.length;
		var tmpRow = []; // construct header avalible array

		if (numCols > 0) {
			for (var i = 0; i < numCols; i++) {
				tmpRow[tmpRow.length] = formatData(options.header[i]);
			}
		} else {
			$(el).filter(':visible').find('th').each(function () {
				if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
			});
		}

		row2CSV(tmpRow);

		// actual data
		$(el).find('tr').each(function () {
			var tmpRow = [];
			/*
            $(this).filter(':visible').find('td').each(function () {
                if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
            });
            */
			$(this).find('td').each(function () {
				if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
			});
			row2CSV(tmpRow);
		});
		if (options.delivery == 'popup') {
			var mydata = csvData.join('\n');
			return popup(mydata);
		} else {
			var mydata = csvData.join('\n');
			return mydata;
		}

		function row2CSV(tmpRow) {
			var tmp = tmpRow.join('') // to remove any blank rows
			// alert(tmp);
			if (tmpRow.length > 0 && tmp != '') {
				var mystr = tmpRow.join(options.separator);
				csvData[csvData.length] = mystr;
			}
		}
		function formatData(input) {
			// replace " with “
			var regexp = new RegExp(/["]/g);
			var output = input.replace(regexp, "“");
			//HTML
			var regexp = new RegExp(/\<[^\<]+\>/g);
			var output = output.replace(regexp, "");
			if (output == "") return '';
			return '"' + output + '"';
		}
		function popup(data) {
			var generator = window.open('', 'csv', 'height=400,width=600');
			generator.document.write('<html><head><title>CSV</title>');
			generator.document.write('</head><body >');
			generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
			generator.document.write(data);
			generator.document.write('</textArea>');
			generator.document.write('</body></html>');
			generator.document.close();
			return true;
		}
	};

	/*-------------------------------------------------
	 컴포넌트 전체 초기화 함수 - 폼 로드시 1회 실행
	---------------------------------------------------*/
	init = function (s) {
	    
	    //if (window.console) console.log(fn_TimeStamp("xeasy.0.9.2.js init start"));

		//페이지 전체 로드시 실행
		if (!options.initialized) {
			if (options.mode == '') {
				checkMode(); //읽기, 쓰기 모드 설정
			}

			//EASY_PATTERN_CHECK 이벤트를 Listen함
			listenPattern();

			//extension 으로 동작하는 기능 추가
			extension();

			//demo 화면을 위한 초기화(운영 환경에서는 불필요)
			//demo();

			if (options.dynamic) {
				listenDomAddEvent();
			}

			//if (window.console) console.log(watch_list);

			options.initialized = true;
		}

		//컴포넌트를 초기화할 영역 - 지정되지 않으면 body가 기본값.
		scope = (typeof s === 'undefined') ? 'body' : s;

		no_patterns = $('.multi-row-template [data-pattern], .multi-row-template [required], .multi-row-template *');

		//컴포넌트 타입별 activator 실행
		for (var p in patterns) {
			if (patterns[p].active) patterns[p].activator();
		}

		//합계 테이블 초기화
		$('.RowSumTable', $(scope)).tableSum();
		/*----------------------------------------------------
		 span 태그에서도 값 변경시 패턴 적용 : currency, numeral
		 -----------------------------------------------------*/
		$('[data-pattern=currency]').not('.pattern-active').bind("DOMSubtreeModified", function () {
			//console.log('changed');
			$(this).trigger('changed');
		});

		$('[data-pattern=numeral]').not('.pattern-active').bind("DOMSubtreeModified", function () {
			//console.log('blur');
			$(this).trigger('blur');
		});

		watchValue();

		//if (window.console) console.log(fn_TimeStamp("xeasy.0.9.2.js init end"));
	}

	//시계열 그래프.14.07.24.KJW
	function renderGraph() {
		$('.time-graph').each(function () {
			var ref_type = (!$(this).hasClass('time-graph-datafield')) ? 'A' : 'B';
			var elem = this;
			var graph_ref = $(elem).data().graphRef;
			if (graph_ref == undefined) return;

			var graph_options = $(elem).data().graphOptions;
			var graph_options_json = (graph_options == undefined) ? {} : stringToObject(graph_options);//jQuery.parseJSON('{'+graph_options+'}');
			var table_header, csv_option, graph_data;

			if (ref_type == 'A') {
				//테이블에서 csv 포맷의 데이터 추출
				table_header = $(elem).data().graphHeader;
				csv_option = {};
				csv_option.delivery = 'value';
				csv_option.header = (table_header == undefined) ? null : table_header.split(',');
				graph_data = $('#' + graph_ref).table2CSV(csv_option);
				//따옴표 제거
				graph_data = graph_data.replace(/"/g, '');
			} else if (ref_type == 'B') {
				graph_data = $('#' + graph_ref).val();
			}

			//if (window.console) console.log(graph_data);

			var g = new Dygraph(
                this, // containing div
                graph_data, // graph data
                // CSV or path to a CSV file.
                /*
                "Date,Temperature,Temperature2\n" +
                "2008-05-07,75,95\n" +
                "2008-05-08,70,75\n"
                */
                graph_options_json // graph option
          );
		});

		function stringToObject(string) {
			var properties = string.split(',');
			var obj = {};
			properties.forEach(function (property) {
				var tup = property.split(':');
				obj[$.trim(tup[0])] = $.trim(tup[1]);
			});
			return obj;
		}
	}

	//필드 값 미러링(watch 기능 적용)
	function watchValue(obj) {
		var elems = (obj == undefined) ? $('.watch-value') : $('.watch-value', obj);
		elems.each(function () {
			var target = this;
			var source = $(this).data().watch;
			//watch list
			watch_list.push(source);
			//if (window.console) console.log('watch-value LN2154', 'list:  ' + source);
			$(source).watch('value', function (propName, oldVal, newVal) {
				//if(window.console) console.log('watch-value LN1850', 'Value has been changed to ' + newVal);
				$(target).setVal(newVal);
			});
		});
	}

	//DOM에 동적으로 추가된 개체에 대해 watch 이벤트 재적용
	function watchAdded(obj) {
		//동적으로 추가된 개체에 watch-value 클래스가 있는 경우,
		//watch 속성을 처리
		watchValue(obj);
		//합계 필드에서 참조하고 있는 개체가 동적으로 추가된 경우
		//대상 개체는 참조여부에 대한 속성을 가지고 있지 않으므로,
		//합계 필드의 렌더링과 바인딩을 다시 진행함.
		//파라미터로 obj를 넘기면 안됨. 2014.08.01. KJW
		isSum();
	}

	/*-------------------------------------------------
	 Validation 함수 - 폼 submit 또는 전단계에서 사용
	---------------------------------------------------*/
	check = function (s) {
		scope = (typeof s === 'undefined') ? 'body' : s;
		var false_then_stop = false;
		var el_stopped;
		var stopped = false;
		var result = true;
		var returns = {};
		//activator
		for (var p in patterns) {

			if (!patterns[p].validate) continue;

			var sel = patterns[p].selector;
			var key = patterns[p].validatorKey;

			$(sel, $(scope)).each(function () {
				var o = $(this);
				if (o.hasClass('bad')) o.removeClass('bad');

				var res = testVal(key, o);
				var highlight = options.focusHighlight;
				if (o.hasClass(highlight)) o.removeClass(highlight);

				//최초 validation=false 인 필드
				if (result && !res.result) {
					el_stopped = o;
					result = false;
					returns.name = o.prop('name');
					returns.id = o.prop('id');
					if (window.console) console.log(o.data().alert == undefined); // == null);
					returns.alerts = (o.data().alert == undefined) ? res.alerts : o.data().alert;
				}

				if (!res.result && false_then_stop) {
					stopped = true;
					return false;
				}
				//console.log('name', o.prop('name'), 'validation', res.result);
			});

			if (stopped) break;

		}
		//console.log('result', result);
		//return result;
		returns.result = result;

		//alert
		if (options.alerts) {
			if (options.alertType == 'popup') {
				//validation 실패
				if (!returns.result) {
					//경고창 표시
					alert(returns.alerts);
					//해당 필드에 포커스
					if (options.alertFocus) {
						el_stopped.focus().addClass(options.focusHighlight);
					}
				}
			}
		}

		return returns;

		function testVal(k, o) {

			var test = tests[k](o);
			if (!test.result) {
				o.addClass('bad');
			} else {
				o.removeClass('bad');
			}
			status.show(o, test.alerts);

			return test;
		}
	}

	// Dom에 새로 추가된 개체를 감지
	var listenDomAddEvent = function () {

		$('body').live('DOMNodeInserted,DOMSubtreeModified', function (event) {
			if (event.srcElement != null &&
                    (event.srcElement.nodeName == 'INPUT' ||
                     event.srcElement.nodeName == 'input'
				//event.srcElement.nodeName == 'SPAN' ||
				//event.srcElement.nodeName == 'span' ||
				//event.srcElement.nodeName == 'TR' ||
				//event.srcElement.nodeName == 'tr'
                    )
               ) {
				//if (window.console) console.log(event.target, ' was inserted: DOM_NODE_INSERT:2455');
				var $target = $(event.target);
				//data-pattern 처리
				eventAdded($target);
				//field watch 처리
				watchAdded($target);
			}
		});
	}

	//외부에서 호출가능한 동적으로 개체를 추가한 경우 사용할 트리거
	//사용법 : EASY.pattern(추가된 개체);
	//파라미터 : 추가된 개체를 오브젝트로 넘김
	pattern = function (obj, patternForce) {
		var $obj = (typeof obj === 'string') ? $(obj) : obj;
		//DOM inserted event를 사용하는 경우
		if (options.dynamic && (typeof patternForce === 'undefined' || patternForce === false)) {
			$.event.trigger({
				type: "EASY_PATTERN_CHECK",
				message: "EASY_PATTERN_CHECK",
				time: new Date(),
				object: $obj
			});
			return;
		} else if (patternForce === true) {
			EASY.unpattern($obj);
		}

		//data-pattern 처리
		eventAdded($obj);
		//field watch 처리
		watchAdded($obj);

	}

	var unpattern = function (obj) {
		var o = (typeof obj === 'object') ? obj : $(obj);
		//패턴 배열 생성
		var patternArray = [];
		for (var p in patterns) {
			patternArray.push(p);
		}
		//자신의 패턴 제거
		removePattern(o, patternArray)

		o.find('[data-pattern]').each(function () {
			removePattern($(this), patternArray);
		});

		return o;

		//자식의 패턴 제거
		function removePattern(el, patternArray) {
			if (el.hasClass('hasDatepicker')) {
				el.removeClass('hasDatepicker');
				el.removeAttr('id');
				el.datepicker('destroy');
			}

			el.removeClass('pattern-active');

			for (var i = 0; i < patternArray.length; i++) {
				el.removeClass('pattern-' + patternArray[i] + '-active');
			}
		}
	}

	//패턴 건너뜀
	function skipPattern(el) {
		return el.not(options.skip).not(no_patterns);
	}

	//DOM에 개체가 추가된 이벤트를 바인딩하여, 개체의 패턴 렌더링을 진행함
	function listenPattern() {

		$(document).on("EASY_PATTERN_CHECK", function (evt) {
			if (window.console && options.debug) console.log(evt.time.toLocaleString() + ": " + evt.message + evt.object);
			if (window.console && options.debug) {
				if (evt.object != undefined) {
					console.log(evt.object.html());
				}
			}
			//data-pattern 처리
			eventAdded(evt.object);
			//field watch 처리
			watchAdded(evt.object);
		});
	}

	//pattern 처리
	//사용자가 멀티로우의 추가 버튼 등 명시적으로 추가한 패턴에 대해
	//해당 개체 또는 자식 개체의 data-pattern 속성을 조사하여 렌더링을 진행
	function eventAdded(el) {
		var p;
		if (typeof el === 'undefined') return;

		//합계 테이블 렌더링. 14.10.27.KJW
		$('.RowSumTable', el).tableSum();

		//패턴 렌더링
		var pattern_elems = el.find('[data-pattern],[required]');

		if (pattern_elems.length == 0) {
			/*
            if (typeof el.data() === 'undefined' || typeof el.data().pattern === 'undefined') {
                if (el.is('[required]')) {
                    activatePattern(el);
                } else {
                    return;
                }
            } else {
                activatePattern(el);
            }*/
			if (el.data() && el.data().pattern) {
				activatePattern(el);

			} else {
				if (el.is('[required]')) {
					activatePattern(el);
				} else {
					return;
				}
			}

		} else {
			pattern_elems.each(function () {
				activatePattern($(this));
			});
		}
	};

	//패턴이 렌더링된 개체에 클래스를 주어 구별함
	function markupActive(el, name) {
		el.addClass('pattern-active');
		if (typeof name !== 'undefined') {
			el.addClass(name);
		}
	}

	//INIT 이후 동적으로 추가된 개체에 모든 패턴별로 패턴을 적용
	//el: 패턴을 가진 HTML 태그
	function activatePattern(el) {

		//pattern-active 클래스는 패턴을 적용하여 동작하는 필드에 부여되는 것으로,
		//제거되어서는 안됨.
		if (el.hasClass('pattern-sum-active')) {
			el.removeClass('pattern-active').removeClass('pattern-sum-active');
		}
		if (el.hasClass('pattern-skip') || el.hasClass('pattern-active')) return;

		//조상 중 pattern-skip 이 있으면 렌더링 중지
		if (el.closest('.pattern-skip').length > 0) return;

		//jquery calendar가 다시 렌더링 오류를 방지하기 위해 클래스 제거
		el.removeClass('hasDatepicker');

		//등록된 패턴을 기준으로 해당 개체의 패턴 렌더링을 진행함
		for (var p in patterns) {
			if (patterns[p] != undefined && 'dynamic' in patterns[p] && patterns[p].active) {
				if (el.is(patterns[p].selector)) {
					patterns[p].activator(el);
				}
			}
		}
	}

	extension = function () {
		$.fn.isCurrency = function () { isCurrency(this); return this; }
		$.fn.isNumeric = function () { isNumeric(this); return this; }
		$.fn.unformat = function () {
			var p = this.data().pattern;
			if (typeof p === 'string') {
				if (p == 'numeral') {
					return isNumeral(this, 'val');
				}
			}
		}
	}

	//트리거
	var triggerFormChanged = function (scope) {
		//when block or element is dropped, evoke event
		/*
        $.event.trigger({
            type: "formChanged",
            message: "element data changed",
            time: new Date()
        });
        */
		var event = $.Event({
			type: "formChanged",
			message: "element data changed",
			time: new Date()
		});

		var $scope = (scope) ? $(scope) : $(document);
		$scope.trigger(event);
	}

	//이번트 발생시 실행할 함수
	var formChanged = function (p) {
		//currency 패턴의 필드에 스크립트로 값이 들어온 경우 부호에 대한 설정이
		//자동으로 반영되지 않아 수동으로 호출하여 문서 전체에서 부호를 재설정함.
		//2014.07.30. KJW
		if (p == 'currency') {
			$('[data-pattern=currency]').each(function () {
				//var v = $(this).val();
				var data = $(this).data('numFormat');
				var obj = {};
				var v = $(this)[0].value;
				if (v != undefined) {
					if (v.numeric() < 0) {
						obj.isNegative = true;
						$.extend(data, obj);
						$(this).data('numFormat-isNegative', data);
					} else {
						obj.isNegative = false;
						$.extend(data, obj);
						$(this).data('numFormat-isNegative', data);
					}
				}
			});

		}
	}

	//패턴의 포맷을 재적용
	var formatter = function (el, pattern_forced) {
		var p;
		var $el = el;
		if (el.data() == null || typeof el.data() === 'undefined' || typeof el.data().pattern === 'undefined') return;

		if (pattern_forced == undefined) {
			p = el.data().pattern;
		} else {
			p = pattern_forced;
		}

		var skip_this = false;
		if (typeof p === 'string' && p != '') {
			if (patterns[p] != undefined && 'formatter' in patterns[p]) {
				//formatter 정의가 있는 경우만 실행
				patterns[p].formatter(el);
			}
		}
	}

	var makeid = function () {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	customAlerts = function (el, msg) {
		return (el.data().alert) ? el.data().alert : msg;
	}

	//읽기/쓰기 모드 : R or W
	function checkMode() {
		var m;
		if (typeof getInfo === 'function') {
			m = getInfo("templatemode"); //Read or Write
			if (m.toLowerCase() == 'read') {
				options.mode = 'R';
			} else {
				options.mode = 'W';
			}
		} else {
			options.mode = 'W';
		}
	}

	//14.10.31 getRowsSum()
	//지정한 행 또는 행집합에서 input 태그를 찾아
	//값을 합산하여 반환
	var getFieldSum = function ($fields) {
		var sum = 0, s;
		$fields.each(function () {
			s = getValue($(this));
			if ($.trim(s) === '') s = '0';
			sum += parseInt(s.numeric());
		});

		return sum;

		function getValue(el) {
			var t = hasVal(el);
			return (t) ? el.val() : el.html();
		}
		function hasVal(el) {
			var t = el.prop('tagName').toLowerCase();
			return (t == 'input' || t == 'textarea') ? true : false;
		}
	};

	return {
		check: check,
		area: area,
		message: message,
		init: init,
		tests: tests,
		options: options,
		triggerFormChanged: triggerFormChanged,
		formChanged: formChanged,
		formatter: formatter,  //format 재적용(이벤트 바인딩 없음)
		pattern: pattern, //load 후에 data-pattern 속성이 추가된 개체에 패턴을 활성화하는 경우(이벤트 바인딩 & 포맷팅)
		unpattern: unpattern, //패턴을 제거한 개체 반환
		getFieldSum: getFieldSum //행 내부 값 합산
	};

}());

/*-------------------------------------------------
	 네이티브 자바스크립트의 익스텐션
---------------------------------------------------*/
(function () {
	//콤마를 비롯한 비숫자 형태를 제거하고, 순수한 숫자를 반환
	//의존: numeral.js 
	String.prototype.numeric = function () {
		var s = this, r;
		r = s.replace(/[A-Za-z$\,\s]/g, '');
		return r;
	}

	//콤마와 원화가 표시된 숫자
	String.prototype.money = function (places, symbol, thousand, decimal) {
		return parseInt(this).money();
	};
	Number.prototype.money = function (places, symbol, thousand, decimal) {
		places = !isNaN(places = Math.abs(places)) ? places : 0;
		symbol = symbol !== undefined ? symbol : "₩";
		thousand = thousand || ",";
		decimal = decimal || ".";
		var number = this,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
		return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
	};
	//콤마가 삽입된 숫자
	String.prototype.currency = function () {
		return parseInt(this).currency();
	};
	Number.prototype.currency = function () {
		return this.money(0, '');
	};
	//문자열 타입의 날짜를 날짜 타입으로 반환
	//의존 함수 : newDate()
	String.prototype.newDate = function () {
		return newDate(this);
	};
	//날짜 포맷
	Date.prototype.yyyymmdd = function (d) {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
		var dd = this.getDate().toString();
		var ds = (d) ? d : '-';
		return yyyy + ds + (mm[1] ? mm : "0" + mm[0]) + ds + (dd[1] ? dd : "0" + dd[0]); // padding
	};

	//숫자 자릿수
	Number.prototype.toDigit = function (dp, vp) {
		return (this + '').toDigit(dp, vp);
	}

	//n 자릿수, v : 반올림(0.5), 올림(1), 버림(0)
	String.prototype.toDigit = function (dp, vp) {
		var n = parseFloat(this);
		var d = (dp == undefined) ? 0 : dp; //자릿수 0 기본값
		var v = (vp == undefined) ? 0.5 : vp;  //반올림 기본값
		var r, p = Math.pow(10, d);

		if (v == 0.5) {
			//반올림
			r = (Math.round(n * p) / p);
		} else if (v == 0) {
			//버림(절사)
			r = (Math.floor(n * p) / p);
		} else if (v == 1) {
			//올림
			r = (Math.ceil(n * p) / p);
		}
		return r;
	};

}).call(this);

/*-------------------------------------------------
	 공통 함수 : 일부 익스텐션에서 사용하는 함수 포함
---------------------------------------------------*/
function newDate(str) {
	var a = $.map(str.split(/[^0-9]/), function (s) { return parseInt(s, 10) });
	return new Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0);
}


/*-------------------------------------------------
	 jQuery 익스텐션
---------------------------------------------------*/

//nth : 컬렉션 내 n번째 개체를 배열로 반환
jQuery.fn.extend({
	nth: function (f) {
		var n = $(this).length;
		var r = [];

		for (var i = 0; i < n; i++) {
			//check pattern;
		    if (checktype(i, f)) {
                // [2016-04-14 leesm] multi-row-template 2줄 이상일 때 미리보기 누르면 텍스트가 굵게 처리되므로 지움
				// $(this).eq(i).css('font-weight', 'bold');
				r.push($(this).eq(i)[0]);
			}
		}
		return jQuery.makeArray(r);

		function format(f) {
			var s = f,
                i = s.indexOf('+'),
                r = (i < 0) ? 0 : s.substring(i);//.replace('+',''),
			var v = s.substring(0, s.indexOf('n')),
            arr = [];

			arr.push(v);
			arr.push(r);
			return arr;
		}

		function checktype(n, f) {
			var fa = format(f),
                v = fa[0],
                r = fa[1];
			var res = ((parseInt(n) - parseInt(r)) % parseInt(v) == 0);
			//if(window.console) console.log(n, r, v, res);
			return res;
		}

		function testcase(f) {
			var r = '<span>formula : ' + f + '</span><br>';
			for (var i = 0; i < 10; i++) {
				var t = checktype(i, f);
				var c = t ? 'true' : '';
				r += '<span class=' + c + '>' + i + ' => ' + t + '</span><br>';
			}
			return r + '<br>-------------------------<br>';
		}
	},

});

//패턴 처리 extension
$.fn.easyPattern = function (opt) {
	var $target = $(this);
	EASY.pattern($target, opt);
	return this;
};

//HTML 속성 상속(copy)
//14.07.15 KJW
$.fn.inheritAttr = function (elem) {
	var $target = $(this);
	var attributes = elem.prop("attributes");

	// loop through <select> attributes and apply them on <div>
	$.each(attributes, function () {
		$target.attr(this.name, this.value);
	});

	return $target;
}
//HTML INPUT 태그를 SPAN 태그로 변환하고, 기존 속성을 유지
//multirow의 읽기모드에서 참조
//14.07.15 KJW
$.fn.convertTagTo = function (target) {

	var $s = $(this);
	var t = replaceLineBreak($s.val());
	var $d = $('<' + target + ' />').text(t);

	$d.inheritAttr($s).removeAttr('value');
	$s.replaceWith($d);
	return $d;

	function replaceLineBreak(s) {
		//null 처리 추가. 2014.07.21. KJW
		if (s == undefined || s == null) return '';
		return s.replace(/(?:\r\n|\r|\n)/g, '<br />');
	}
}
//IE8에서 배열의 인덱스참조(indexOf)가 지원되지 않으므로
//프로토타입을 추가함
//14.07.15 KJW
if (!Array.indexOf) {
	Array.prototype.indexOf = function (obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		return -1;
	}
}

/* field value watcher */
/* watch, unwatch, getVal, setVal */
jQuery.fn.watch = function (id, fn) {

	return this.each(function () {

		var self = this;
		var oldVal = getVal(self, id);

		$(self).data(
            'watch_timer',
            setInterval(function () {
            	//if (self[id] !== oldVal) {
            	if (getVal(self, id) !== oldVal) {
            		fn.call(self, id, oldVal, getVal(self, id));
            		oldVal = getVal(self, id);
            	}
            }, 100)
        );

	});

	function getVal(el, id) {
		//if (window.console) console.log('watch.getval');
		var t = el.tagName.toUpperCase();
		if (t == 'SPAN' || t == 'P' || t == 'DIV') {
			return el.innerHTML;
		} else {
			return el[id];
		}
	}

	return self;
};

jQuery.fn.unwatch = function (id) {

	return this.each(function () {
		clearInterval($(this).data('watch_timer'));
	});

};

function watchStop() {
	clearInterval($('*').data('watch_timer'));
}

jQuery.fn.getVal = function () {
	var el = this;
	var t = el.tagName.toUpperCase();
	if (t == 'SPAN' || t == 'P' || t == 'DIV') {
		return el.innerHTML;
	} else {
		return el.value;
	}

};
jQuery.fn.setVal = function (v) {

	return this.each(function () {
		var el = this;
		var t = el.tagName.toUpperCase();
		if (t == 'SPAN' || t == 'P' || t == 'DIV') {
			el.innerHTML = v;
		} else {
			el.value = v;
		}
	});

};
