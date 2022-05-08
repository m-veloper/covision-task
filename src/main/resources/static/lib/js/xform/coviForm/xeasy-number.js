/* Revised by Covision
    Version  Date    Note
    -----------------------
    1.0.1 2014.07.04  backspace 키로 (-)부호 제거 오류 수정(재수정)
    1.0.2 2014.08.01  IE10 clear button(x표시 버튼)으로 제거 후 키 입력시 (-)부호 제거. 2014.08.01. KJW
	1.0.3 2014.09.18  delete key 적용. KJW
	1.0.4 2014.09.18  마이너스 부호 뒤에서 backspace, delete key 입력시 커서 위치 강제유지. KJW
    1.0.5 2014.09.26  직접 입력한 숫자 0 유지  
    1.0.6 2014.10.06  중복 바인딩 오류 처리 및 코드 라인 끝(;) 정리
*/

/**
 * jQuery number plug-in 2.1.3
 * Copyright 2012, Digital Fusion
 * Licensed under the MIT license.
 * http://opensource.teamdf.com/license/
 *
 * A jQuery plugin which implements a permutation of phpjs.org's number_format to provide
 * simple number formatting, insertion, and as-you-type masking of a number.
 * 
 * @author	Sam Sehnert
 * @docs	http://www.teamdf.com/web/jquery-number-format-redux/196/
 */
(function ($) {

    "use strict";

    /**
	 * Method for selecting a range of characters in an input/textarea.
	 *
	 * @param int rangeStart			: Where we want the selection to start.
	 * @param int rangeEnd				: Where we want the selection to end.
	 *
	 * @return void;
	 */
    function setSelectionRange(rangeStart, rangeEnd) {
        // Check which way we need to define the text range.
        if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveStart('character', rangeStart);
            range.moveEnd('character', rangeEnd - rangeStart);
            range.select();
        }

            // Alternate setSelectionRange method for supporting browsers.
        else if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(rangeStart, rangeEnd);
        }
    }

    /**
	 * Get the selection position for the given part.
	 * 
	 * @param string part			: Options, 'Start' or 'End'. The selection position to get.
	 *
	 * @return int : The index position of the selection part.
	 */
    function getSelection(part) {
        var pos = this.value.length;

        // Work out the selection part.
        part = (part.toLowerCase() == 'start' ? 'Start' : 'End');

        if (document.selection) {
            // The current selection
            var range = document.selection.createRange(), stored_range, selectionStart, selectionEnd;
            // We'll use this as a 'dummy'
            stored_range = range.duplicate();
            // Select all text
            //stored_range.moveToElementText( this );
            stored_range.expand('textedit');
            // Now move 'dummy' end point to end point of original range
            stored_range.setEndPoint('EndToEnd', range);
            // Now we can calculate start and end points
            selectionStart = stored_range.text.length - range.text.length;
            selectionEnd = selectionStart + range.text.length;
            return part == 'Start' ? selectionStart : selectionEnd;
        }

        else if (typeof (this['selection' + part]) != "undefined") {
            pos = this['selection' + part];
        }
        return pos;
    }


    function allowedSpecialKey(key, e) {
        var r = (
                    key == 9 || key == 27 || key == 13 ||
                    // Allow: Ctrl+A, Ctrl+R
                    ((key == 65 || key == 82) && (e.ctrlKey || e.metaKey) === true) ||
                    // Allow: Ctrl+V, Ctrl+C
                    ((key == 86 || key == 67) && (e.ctrlKey || e.metaKey) === true) ||
                    // Allow: home, end, left, right
                    (key >= 35 && key <= 39)
                );
        return r;
    }

    function getKeyCode(evt) {

        var char = '';
        var keyCode = (evt.which) ? evt.which : event.keyCode;
        var keyChar = {
            8: 'backspace',	//  backspace
            9: 'tab',	//  tab
            13: 'enter',	//  enter
            16: 'shift',	//  shift
            17: 'ctrl',	//  ctrl
            18: 'alt',	//  alt
            19: 'pause/break',	//  pause/break
            20: 'capslock',	//  caps lock
            27: 'escape',	//  escape
            33: 'pageup',	// page up, to avoid displaying alternate character and confusing people	         
            34: 'pagedown',	// page down
            35: 'end',	// end
            36: 'home',	// home
            37: 'left',	// left arrow
            38: 'up',	// up arrow
            39: 'right',	// right arrow
            40: 'down',	// down arrow
            45: 'insert',	// insert
            46: 'delete',	// delete
            91: 'leftwindow',	// left window
            92: 'rightwindow',	// right window
            93: 'selectkey',	// select key
            96: '0',	// numpad 0
            97: '1',	// numpad 1
            98: '2',	// numpad 2
            99: '3',	// numpad 3
            100: '4',	// numpad 4
            101: '5',	// numpad 5
            102: '6',	// numpad 6
            103: '7',	// numpad 7
            104: '8',	// numpad 8
            105: '9',	// numpad 9
            106: 'multiply',	// multiply
            107: 'add',	// add
            109: 'subtract',	// subtract
            110: '.',	// decimal point
            111: 'divide',	// divide
            112: 'F1',	// F1
            113: 'F2',	// F2
            114: 'F3',	// F3
            115: 'F4',	// F4
            116: 'F5',	// F5
            117: 'F6',	// F6
            118: 'F7',	// F7
            119: 'F8',	// F8
            120: 'F9',	// F9
            121: 'F10',	// F10
            122: 'F11',	// F11
            123: 'F12',	// F12
            144: 'numlock',	// num lock
            145: 'scrolllock',	// scroll lock
            173: 'subtract', // dash
            186: ';',	// semi-colon
            187: '=',	// equal-sign
            188: ',',	// comma
            189: '-',	// dash
            190: '.',	// period
            191: '/',	// forward slash
            192: '`',	// grave accent
            219: '[',	// open bracket
            220: '\\',	// back slash
            221: ']',	// close bracket
            222: '\'',	// single quote
        };

        if (keyChar.hasOwnProperty(keyCode)) {
            char = keyChar[keyCode];
        } else {
            char = String.fromCharCode(keyCode);
        }

        return char;

    }


    /**
	 * Substitutions for keydown keycodes.
	 * Allows conversion from e.which to ascii characters.
	 */
    var _keydown = {

        shifts: {
            96: "~",
            49: "!",
            50: "@",
            51: "#",
            52: "$",
            53: "%",
            54: "^",
            55: "&",
            56: "*",
            57: "(",
            48: ")",
            45: "_",
            61: "+",
            91: "{",
            93: "}",
            92: "|",
            59: ":",
            39: "\"",
            44: "<",
            46: ">",
            47: "?"
        }
    };

    /**
	 * jQuery number formatter plugin. This will allow you to format numbers on an element.
	 *
	 * @params proxied for format_number method.
	 *
	 * @return : The jQuery collection the method was called with.
	 */
    $.fn.number = function (number, decimals, dec_point, thousands_sep) {

        // Enter the default thousands separator, and the decimal placeholder.
        thousands_sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        dec_point = (typeof dec_point === 'undefined') ? '.' : dec_point;
        decimals = (typeof decimals === 'undefined') ? 0 : decimals;

        // Work out the unicode character for the decimal placeholder.
        var u_dec = ('\\u' + ('0000' + (dec_point.charCodeAt(0).toString(16))).slice(-4)),
	    	regex_dec_num = new RegExp('[^' + u_dec + '0-9]', 'g'),
	    	regex_dec = new RegExp(u_dec, 'g');

        if ($(this).hasClass('pattern-active')) return;

        // If we've specified to take the number from the target element,
        // we loop over the collection, and get the number.
        if (number === true) {
            // If this element is a number, then we add a keyup
            if (this.is('input:text')) {
                // Return the jquery collection.
                return this.on({

                    /**
	    			 * Handles keyup events, re-formatting numbers.
	    			 *
	    			 * @param object e			: the keyup event object.s
	    			 *
	    			 * @return void;
	    			 */
                    'keydown.format': function (e) {

                        // Define variables used in the code below.
                        var $this = $(this),
	    					data = $this.data('numFormat'),
	    					code = (e.keyCode ? e.keyCode : e.which),
							chara = '', //unescape(e.originalEvent.keyIdentifier.replace('U+','%u')),
	    					start = getSelection.apply(this, ['start']),
	    					end = getSelection.apply(this, ['end']),
	    					val = '',
							setPos = false,

							/*---- Delete 키 관련 상태 값 --------------------------------*/
							backspace_key = 8,
							delete_key = 46,
							value_length = this.value.length,
							decimal_left = false,
							decimal_just_left = false,
							decimal_just_left_deletekey = false,
							decimal_right = false,
							decimal_right_deletekey_pressed = false,
							decimal_just_right = false,
							decimal_tobe_deleted = false,
							decimal_pos_from_end = -1 * decimals,
							value_is_zero = (parseFloat(this.value) == 0),
							post_start_caret = -1 * (value_length - start),
							pos_end_caret = -1 * (value_length - end),
							one_and_more_chars_selected = false;

                        //- 부호 바로 뒤에서 delete키를 입력하는 경우 최초 위치를 저장
                        if (start == 1 && data.isNegative && code == delete_key) {
                            data.originstart = start;
                        } else if (start == 2 && data.isNegative && code == backspace_key) {
                            data.originstart = 1;
                        } else {
                            data.originstart = null;
                        }

                        /*---- Delete 키 관련 상태 값 변경  --------------------------------*/
                        if (pos_end_caret < decimal_pos_from_end) {
                            decimal_left = true;
                            if (pos_end_caret == decimal_pos_from_end - 1 && decimal_pos_from_end < 0) {
                                decimal_just_left = true;
                            }
                        }

                        if (decimals > 0 && pos_end_caret >= decimal_pos_from_end && decimal_pos_from_end < 0) {
                            decimal_right = true;
                            if (pos_end_caret == decimal_pos_from_end) {
                                decimal_just_right = true;
                            }
                        }

                        if (decimals > 0 && decimal_just_right && code == backspace_key) {
                            decimal_tobe_deleted = true;
                        }

                        if (decimals > 0 && decimal_just_left && code == delete_key) {
                            decimal_tobe_deleted = true;
                            decimal_just_left_deletekey = true;
                        }

                        //필드 값 없음
                        if (value_length == 0 && code == delete_key) {
                            e.preventDefault();
                            return false;
                        }

                        if (post_start_caret < pos_end_caret) {
                            one_and_more_chars_selected = true;
                        }

                        //decimal 오른쪽에서 delete 키 입력
                        if (decimal_right && code == delete_key && !one_and_more_chars_selected) {
                            decimal_right_deletekey_pressed = true;
                        }
                        /*-------------------------------------------------------*/

                        chara = getKeyCode(e);

                        //disable if readonly. 2014.06.18. KJW
                        if (($this).is('[readonly]')) return;

                        //ie10 clear button으로 제거 후 키 입력시 -부호 제거. 2014.08.01. KJW
                        if (this.value.length == 0) data.isNegative = false;

                        if (chara.match(/[0-9]/)) {
                            //숫자이면 다음으로 진행
                        } else if (chara === 'backspace' || chara === 'delete') {
                            //다음으로 진행
                        } else if (chara.match(/[-]/)) {
                            //-부호가 맨 앞이 아닌 위치면 입력취소
                            if (start !== 0) return false;
                            //이미 음수인 경우 입력 취소
                            if (data.isNegative) return false;
                            //전체선택 후 -키를 입력한 경우
                            if (end == this.value.length) {
                                // User is trying to make this field a negative number or select all text
                                data.isNegative = true;
                            }
                        } else if (allowedSpecialKey(code, e)) {
                            return;
                        } else if (chara === dec_point) {
                            //소숫점 입력시 허용
                        }
                        else if (chara === 'subtract') {
                            //[2016-01-14 modi kh] 숫자 키 패드 '-' 마이너스 부호 입력 가능 code 109 추가
                        }
                        else {
                            //그 외 문자는 입력방지
                            e.preventDefault();
                            return false;
                        }

                        // The whole lot has been selected, or if the field is empty...
                        if (start == 0 && end == this.value.length) {
                            //backspace or delete key
                            if (code === 8 || code === 46) {
                                // Blank out the field, but only if the data object has already been instanciated.
                                start = end = 1;
                                this.value = '';

                                // Reset the cursor position.
                                data.init = (decimals > 0 ? -1 : 0);
                                data.c = (decimals > 0 ? -(decimals + 1) : 0);
                                data.isNegative = false;
                                setSelectionRange.apply(this, [0, 0]);
                            } else if (code === 45) { //- sign
                                // Blank out the field, but only if the data object has already been instanciated.
                                start = end = 0;
                                data.isNegative = true;
                            }
                            else if (chara === dec_point) {
                                start = end = 1;
                                this.value = '0' + dec_point + (new Array(decimals + 1).join('0'));

                                // Reset the cursor position.
                                data.init = (decimals > 0 ? 1 : 0);
                                data.c = (decimals > 0 ? -(decimals + 1) : 0);
                            }
                            else if (this.value.length === 0) {
                                // Reset the cursor position.
                                data.init = (decimals > 0 ? -1 : 0);
                                data.c = (decimals > 0 ? -(decimals) : 0);
                            }
                            else {
                                // Blank out the field, but only if the data object has already been instanciated.
                                start = end = 1;
                                this.value = '';

                                // Reset the cursor position.
                                data.init = (decimals > 0 ? -1 : 0);
                                data.c = (decimals > 0 ? -(decimals + 1) : 0);
                                data.isNegative = false;
                                setSelectionRange.apply(this, [0, 0]);
                            }
                        } else if ($this.val() == 0) {
                            // number after (-) sign
                            data.c = (decimals > 0 ? -(decimals + 1) : 0);

                        } else {
                            // Otherwise, we need to reset the caret position
                            // based on the users selection.
                            data.c = end - this.value.length;
                        }

                        // If they are trying to delete the negative sign
                        if (start <= 1 && data.isNegative) {
                            if (code == 8) {
                                data.isNegative = false;
                            } else if (code === 46) {
                                data.isNegative = false;
                            }
                        }
                            // If the start position is before the decimal point,
                            // and the user has typed a decimal point, we need to move the caret
                            // past the decimal place.
                        else if (decimals > 0 && chara == dec_point && start == this.value.length - decimals - 1) {
                            data.c++;
                            //data.init = Math.max(0,data.init);
                            e.preventDefault();

                            // Set the selection position.
                            setPos = this.value.length + data.c;
                        }

                            // If the user is just typing the decimal place,
                            // we simply ignore it.
                        else if (chara == dec_point) {
                            data.init = Math.max(0, data.init);
                            e.preventDefault();
                        }

                            // If hitting the delete key, and the cursor is behind a decimal place,
                            // we simply move the cursor to the other side of the decimal place.
                        else if (decimals > 0 && code == 8 && start == this.value.length - decimals) {
                            e.preventDefault();
                            data.c--;

                            // Set the selection position.
                            setPos = this.value.length + data.c;
                        }

                            // If hitting the delete key, and the cursor is to the right of the decimal
                            // (but not directly to the right) we replace the character preceeding the
                            // caret with a 0.
                        else if (decimals > 0 && code == 8 && start > this.value.length - decimals) {
                            if (this.value === '') return;

                            // If the character preceeding is not already a 0,
                            // replace it with one.
                            if (this.value.slice(start - 1, start) != '0') {
                                val = this.value.slice(0, start - 1) + '0' + this.value.slice(start);
                                $this.val(val.replace(regex_dec_num, '').replace(regex_dec, dec_point));
                            }

                            e.preventDefault();
                            data.c--;

                            // Set the selection position.
                            setPos = this.value.length + data.c;
                        }

                            // If the delete key was pressed, and the character immediately
                            // before the caret is a thousands_separator character, simply
                            // step over it.

                        else if (code == 8 && this.value.slice(start - 1, start) == thousands_sep) {
                            e.preventDefault();
                            data.c--;

                            // Set the selection position.
                            setPos = this.value.length + data.c;
                        }

                            // If the caret is to the right of the decimal place, and the user is entering a
                            // number, remove the following character before putting in the new one. 
                        else if (
	    					decimals > 0 &&
	    					start == end &&
	    					this.value.length > decimals + 1 &&
	    					start > this.value.length - decimals - 1 && isFinite(+chara) &&
		    				!e.metaKey && !e.ctrlKey && !e.altKey && chara.length === 1
	    				) {
                            // If the character preceeding is not already a 0,
                            // replace it with one.
                            if (end === this.value.length) {
                                val = this.value.slice(0, start - 1);
                            }
                            else {
                                val = this.value.slice(0, start) + this.value.slice(start + 1);
                            }

                            // Reset the position.
                            this.value = val;
                            setPos = start;
                        }

                        //delete 키 입력시 커서 위치 조정 및 값 조정
                        if (code == 46) {
                            //delete in the left of decimal
                            if (one_and_more_chars_selected) {
                                data.c = pos_end_caret;
                            } else {
                                data.c = pos_end_caret + 1;
                            }

                            //decimal 오른쪽에서 delete 키 누름 ==> 삭제된 숫자위치에 0 삽입
                            if (decimal_right_deletekey_pressed) {
                                val = this.value.slice(0, end) + '0' + this.value.slice(end + 1);
                                $this.val(val);
                                e.preventDefault();
                            }

                            if (decimal_just_left_deletekey) {
                                e.preventDefault();
                            }

                            setPos = false;

                        }

                        // If we need to re-position the characters.
                        if (setPos !== false) {
                            setSelectionRange.apply(this, [setPos, setPos]);
                        }

                        // Store the data on the element.
                        $this.data('numFormat', data);

                    },

                    /**
	    			 * Handles keyup events, re-formatting numbers.
	    			 *
	    			 * @param object e			: the keyup event object.s
	    			 *
	    			 * @return void;
	    			 */
                    'keyup.format': function (e) {

                        // Store these variables for use below.
                        var $this = $(this),
	    					data = $this.data('numFormat'),
	    					code = (e.keyCode ? e.keyCode : e.which),
	    					start = getSelection.apply(this, ['start']),
	    					setPos;

                        // Stop executing if the user didn't type a number key, a decimal, or a comma.
                        //[2016-01-14 modi kh] 숫자 키 패드 '-' 마이너스 부호 입력 가능 code 109 추가
                        if (this.value === '' || (code < 48 || code > 57) && (code < 96 || code > 105) && code !== 8 && code !== 46 && code !== 45 && code !== 109) return;

                        // Re-format the textarea.
                        $this.val($this.val());

                        if (decimals > 0) {
                            // If we haven't marked this item as 'initialised'
                            // then do so now. It means we should place the caret just 
                            // before the decimal. This will never be un-initialised before
                            // the decimal character itself is entered.
                            if (data.init < 1) {
                                start = this.value.length - decimals - (data.init < 0 ? 1 : 0);
                                data.c = start - this.value.length;
                                data.init = 1;

                                $this.data('numFormat', data);
                            }

                                // Increase the cursor position if the caret is to the right
                                // of the decimal place, and the character pressed isn't the delete key.
                            else if (start > this.value.length - decimals && code != 8 && code != 46) {
                                data.c++;

                                // Store the data, now that it's changed.
                                $this.data('numFormat', data);
                            }
                        }

                        //console.log( 'Setting pos: ', start, decimals, this.value.length + data.c, this.value.length, data.c );
                        var v = $this.get(0).value;
                        if (!v.length || v == '0') {
                            // If they delete the entire contents of the text field, remove the 'negative' variable
                            if (data.isNegative) {
                                $this.get(0).value = '-';
                            } else {
                                data.isNegative = false;
                            }
                        } else if (data.isNegative) {
                            // Otherwise, we add the - sign to the beginning of the field if it's negative
                            if (v.indexOf('-') < 0) {
                                $this.get(0).value = '-' + this.value;
                            }
                        }

                        if (v.numeric() >= 0) data.isNegative = false;

                        //- 부호 뒤에서 delete키와 backspace 키 입력 한 경우 부호 바로 뒤에 위치 유지
                        if (data.originstart != null && (code == 46 || code == 8)) {
                            data.c = 1 - this.value.length;
                        }
                        // Set the selection position.
                        setPos = this.value.length + data.c;
                        setSelectionRange.apply(this, [setPos, setPos]);
                    },

                    'change.format': function (e) {
                        var $this = $(this),
	    					data = $this.data('numFormat'),
	    			        v = $this.get(0).value;
                        if (v == '-' || v == '') {
                            $this.get(0).value = '';
                            data.isNegative = false;
                        }
                        $this.data('numFormat', data);
                    },
                    'blur.format': function (e) {
                        var $this = $(this),
	    					data = $this.data('numFormat'),
	    			        v = $this.get(0).value;
                        if (v == '-' || v == '') {
                            $this.get(0).value = '';
                            data.isNegative = false;
                        }
                        $this.data('numFormat', data);
                    },

                    /**
	    			 * Reformat when pasting into the field.
	    			 *
	    			 * @param object e 		: jQuery event object.
	    			 *
	    			 * @return false : prevent default action.
	    			 */
                    'paste.format': function (e) {

                        // Defint $this. It's used twice!.
                        var $this = $(this),
	    					original = e.originalEvent,
	    					val = null;

                        // Get the text content stream.
                        if (window.clipboardData && window.clipboardData.getData) { // IE
                            val = window.clipboardData.getData('Text');
                        } else if (original.clipboardData && original.clipboardData.getData) {
                            val = original.clipboardData.getData('text/plain');
                        }

                        // Do the reformat operation.
                        $this.val(val);

                        // Stop the actual content from being pasted.
                        e.preventDefault();
                        return false;
                    }

                })

	    		// Loop each element (which isn't blank) and do the format.
    			.each(function () {

    			    var decimals_conv = (decimals == 0) ? decimals : -(decimals + 1);
    			    var $this = $(this).data('numFormat', {
    			        c: decimals_conv,
    			        decimals: decimals,
    			        thousands_sep: thousands_sep,
    			        dec_point: dec_point,
    			        regex_dec_num: regex_dec_num,
    			        regex_dec: regex_dec,
    			        init: false
    			    });

    			    // Return if the element is empty.
    			    if (this.value === '') return;

    			    // Otherwise... format!!
    			    $this.val($this.val());
    			});
            }
            else {
                // return the collection.
                return this.each(function () {
                    var $this = $(this),
						isNegative = $this.text().match(/^-/) ? -1 : 1,
						num = +$this.text().replace(regex_dec_num, '').replace(regex_dec, '.') * isNegative;

                    if ($this.text() !== '') {
                        $this.number(!isFinite(num) ? 0 : +num, decimals, dec_point, thousands_sep);
                    }
                });
            }
        }

        // Add this number to the element as text.
        return this.text($.number.apply(window, arguments));
    };

    //
    // Create .val() hooks to get and set formatted numbers in inputs.
    //

    // We check if any hooks already exist, and cache
    // them in case we need to re-use them later on.
    var origHookGet = null, origHookSet = null;

    // Check if a text valHook already exists.
    if ($.isPlainObject($.valHooks.text)) {
        // Preserve the original valhook function
        // we'll call this for values we're not 
        // explicitly handling.
        if ($.isFunction($.valHooks.text.get)) origHookGet = $.valHooks.text.get;
        if ($.isFunction($.valHooks.text.set)) origHookSet = $.valHooks.text.set;
    }
    else {
        // Define an object for the new valhook.
        $.valHooks.text = {};
    }

    /**
	 * Define the valHook to return normalised field data against an input
	 * which has been tagged by the number formatter.
	 *
	 * @param object el			: The raw DOM element that we're getting the value from.
	 *
	 * @return mixed : Returns the value that was written to the element as a
	 *				   javascript number, or undefined to let jQuery handle it normally.
	 */
    $.valHooks.text.get = function (el) {

        // Get the element, and its data.
        var $this = $(el), num,
			data = $this.data('numFormat');

        // Does this element have our data field?
        if (!data) {
            // Check if the valhook function already existed
            if ($.isFunction(origHookGet)) {
                // There was, so go ahead and call it
                return origHookGet(el);
            }
            else {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
            }
        }
        else {
            // Remove formatting, and return as number.
            if (el.value === '') return '';

            // If the first character is a minus sign,
            // we assume the number is negative.
            if (el.value.match(/^-/)) {
                data.isNegative = true;
            }

            // Convert to a number.
            num = +(el.value
				.replace(data.regex_dec_num, '')
				.replace(data.regex_dec, '.'));

            // If we've got a finite number, return it.
            // Otherwise, simply return 0.
            num = (isFinite(num) ? num : 0);

            // If it's a negative number, times by -1.
            if (num != 0 && data.isNegative) {
                num *= -1;
            }

            // Return as a string... thats what we're
            // used to with .val()
            return '' + num;
        }
    };

    /**
	 * A valhook which formats a number when run against an input
	 * which has been tagged by the number formatter.
	 *
	 * @param object el		: The raw DOM element (input element).
	 * @param float			: The number to set into the value field.
	 *
	 * @return mixed : Returns the value that was written to the element,
	 *				   or undefined to let jQuery handle it normally. 
	 */
    $.valHooks.text.set = function (el, val) {
        // Get the element, and its data.
        var $this = $(el),
			data = $this.data('numFormat');

        // Does this element have our data field?
        if (!data) {

            // Check if the valhook function already exists
            if ($.isFunction(origHookSet)) {
                // There was, so go ahead and call it
                return origHookSet(el, val);
            }
            else {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
            }
        }
        else {
            if (val === '') {
                return el.value = '';
            }
            // Otherwise, don't worry about other valhooks, just run ours.
            return el.value = $.number(val, data.decimals, data.dec_point, data.thousands_sep);
        }
    };

    /**
	 * The (modified) excellent number formatting method from PHPJS.org.
	 * http://phpjs.org/functions/number_format/
	 *
	 * @modified by Sam Sehnert (teamdf.com)
	 *	- don't redefine dec_point, thousands_sep... just overwrite with defaults.
	 *	- don't redefine decimals, just overwrite as numeric.
	 *	- Generate regex for normalizing pre-formatted numbers.
	 *
	 * @param float number			: The number you wish to format, or TRUE to use the text contents
	 *								  of the element as the number. Please note that this won't work for
	 *								  elements which have child nodes with text content.
	 * @param int decimals			: The number of decimal places that should be displayed. Defaults to 0.
	 * @param string dec_point		: The character to use as a decimal point. Defaults to '.'.
	 * @param string thousands_sep	: The character to use as a thousands separator. Defaults to ','.
	 *
	 * @return string : The formatted number as a string.
	 */
    $.number = function (number, decimals, dec_point, thousands_sep) {
        // Set the default values here, instead so we can use them in the replace below.
        thousands_sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        dec_point = (typeof dec_point === 'undefined') ? '.' : dec_point;
        decimals = !isFinite(+decimals) ? 0 : Math.abs(decimals);

        // Work out the unicode representation for the decimal place and thousand sep.	
        var u_dec = ('\\u' + ('0000' + (dec_point.charCodeAt(0).toString(16))).slice(-4));
        var u_sep = ('\\u' + ('0000' + (thousands_sep.charCodeAt(0).toString(16))).slice(-4));

        // Fix the number, so that it's an actual number.
        number = (number + '')
			.replace('\.', dec_point) // because the number if passed in as a float (having . as decimal point per definition) we need to replace this with the passed in decimal point character
			.replace(new RegExp(u_sep, 'g'), '')
			.replace(new RegExp(u_dec, 'g'), '.')
			.replace(new RegExp('[^0-9+\-Ee.]', 'g'), '');

        var n = !isFinite(+number) ? 0 : +number,
		    s = '',
		    toFixedFix = function (n, decimals) {
		        var k = Math.pow(10, decimals);
		        return '' + Math.round(n * k) / k;
		    };

        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
        }
        if ((s[1] || '').length < decimals) {
            s[1] = s[1] || '';
            s[1] += new Array(decimals - s[1].length + 1).join('0');
        }
        return s.join(dec_point);
    };

})(jQuery);
