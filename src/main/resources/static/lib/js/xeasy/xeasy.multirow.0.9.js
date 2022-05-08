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
14.07.21 replaceLineBreak() 입력값 null 처리
14.07.23 짝수행의 배경색 지정. options.rowColor
14.08.11 addRow() 에 callback 파라미터  추가
14.10.06 읽기 모드에서 currency의 numeral 패턴변환을 중지 
14.10.27 멀티로우 내 멀티로우 기능 추가
14.10.27 EASY 오브젝트 존재 체크
14.11.07 multi-row-auto-span(자동증가행)이 템플릿 내에 들어가는 경우 행 증가시 오류 처리
14.12.04 checkbox로 multirow 중간행 삭제시 시퀀스 새로고침
16.04.26 XForm 고도화 프로젝트 속도 개선 및 기능 개선
16.05.11 바인딩 시 span 태그 아래 a 태그로 되어 있는 것 (이미지 버튼)이 안나오는 부분 수정
16.05.12 바인딩 시 span 태그 data-type='rField' 바인딩 되도록 수정
16.05.19 mField checkbox 맵핑 안되는 부분 있어 주석

*/

// 시간체크
var fn_TimeStamp = function (argFlag) {
    var chkTime = new Date();
    var stampValue = chkTime.getHours() + ':' + chkTime.getMinutes() + ':' + chkTime.getSeconds() + ':' + chkTime.getMilliseconds() + '\t';
    stampValue += '[' + argFlag.toUpperCase() + ']' + '\t';
    return stampValue;
};

var XFORM = {};

XFORM.multirow = (function () {

    var init,
        load,
        clear,
        data,
        json,
        demo,
        loadTable,
        makeNewRow,
        remakeRowSeq,
        dataface,
        rowControlButton,
        bodyToJson,
        getdata,
        setdata,
        extension,
        xmlToJson,
        mode, //write or read
        options = {
            minLength: 0,  //minimum row length
            maxLength: -1,  //unlimited row length,
            rowColor: '',
            rowFirstColor: '',
            rowSecondColor: '',
            enableSubMultirow: false //멀티로우 내 멀티로우 사용여부
        },
		template,
        g_form_mode,
        g_initialized = [],
        getTemplateRowCount,
        getMultiRowCount,
        g_data_type;

    init = function (d, m, r) {

        //초기화한 테이블을 배열에 넣고, 이미 초기화된 테이블은 진행하지 않음
        if (r !== '' && $.inArray(r, g_initialized) > -1) {
            return;
        } else {
            g_initialized.push(r);
        }
        //load extension
        extension.field();
        extension.inJSON();
        extension.serialize();
        dataface.enable();
        //template은 patterning skip
        template.addClass('pattern-skip');
        //template은 validation skip
        template.addClass('no-required').hide(); //css & script

        $('[data-face-real=y]', r).hide(); //css & script

        $('.multi-row-selector-wrap', r).css('text-align', 'center');
        $('.multi-row-seq', r).css('text-align', 'center');
    };
    //bmt-jwk: step 4 - 대량 데이터 로드 처리 - fasload() 추가
    fastload = function (data, data_type, region, view_mode, load_options) {

        var $region = $(region);
        //view or wirte 모드 설정
        mode(view_mode);

        if (typeof load_options !== 'undefined') {
            $.extend(true, options, load_options); //merge client options to global options object
        }
        //bmt-jwk : step 1
        template = $('.multi-row-template', $region);

        var $newrows;

        init(data, mode(), $region);

        if (mode() == 'R') {
            $('input:text, textarea, select', template).each(function () {
                //if (typeof $(this).data().faceReal !== 'undefined') {
                //    return;
                //}

                var h = getValue($(this));

                var attributeStr = "";
                $.each($(this)[0].attributes, function (i, attr1) {
                    if (attr1.name.toLowerCase() != "type" &&
                        attr1.name.toLowerCase() != "readonly" &&
                        attr1.name.toLowerCase() != "data-type") {
                        attributeStr += " " + attr1.name + "=\"" + attr1.value + "\"";
                    }
                });
                $(this).replaceWith('<span' + attributeStr + '>' + replaceLineBreak(h) + '</span>');
            });

            if (data != null && data != "") {
                bulk(data, $region);
            }
        } else {
            //로드 전 테이블 행 제거
            clear($region);

            if (data != null && data != "") {
                var d,$newrow;
                if (data_type == null || data_type == 'xml') {//xml
                    d = xmlToJson(data);
                } else if (data_type == 'json') {//json
                    d = data;
                } else {
                    return false;
                }

                d = jQuery.parseJSON(d);

                if (d.length > 0) { $newrow = template.duplicate(template, d.length ? d.length : 1, d); }
                else { $newrow = template.clone(false); }

                var $last = template.siblings('.multi-row');
                var num = $last.length;
                if (num === 0) {
                    $last = template.last();
                } else {
                    $last = template.siblings('.multi-row').last();
                }

                // newrow 패턴 재적용
                $newrow.removeClass('no-required').removeClass('pattern-skip').removeClass("multi-row-template").addClass("multi-row");

                template.last().after($newrow);
                EASY.pattern($region);
                // EASY.isSum.getSum($region);

                // --- radio data-face -----
                // 1.face event bind
                dataface.enable($newrow);
                // 2.change name
                dataface.update($region, $newrow);
                dataface.load($region, view_mode);

                $newrow.show();
            }
            checkAndAddMinLength($region);
        }

        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js fastload start"));

        rowControlButton.init($region, 'table');
        if (typeof view_mode === 'string' && view_mode === 'W') {
            $('.multi-row-selector-all-wrap').show();
        } else {
            rowControlButton.disable(); //삭제버튼 숨김
            $('.multi-row-selector-all-wrap').hide(); // 전체선택 숨김
        }

        //sequence display
        fastRemakeRowSeq($region);

        // [2015-12-30 leesm] data-multi-row-colspan 처리
        changeAutoColumnSpan($region);

        // 멀티로우 속도 개선으로 인해 multi-row-autospan 기능이 정상 동작 안해서 추가하였지만.. 해당 함수로 인하여 속도가 많이 증가함...
        if ($region.find(".multi-row-autospan").length > 0) {
            changeAutoSpan($region);
        }

        //컴포넌트 초기화 이후 다시 멀티로우를 로드한 경우에는 패턴 재적용
        if (mode() !== 'R' && typeof EASY === 'object') {
            // EASY.init();
            EASY.triggerFormChanged();
            // if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged();
        }

        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js fastload end"));
    };

    load = function (data, data_type, region, view_mode, load_options) {
    	
    	if(typeof data =='undefined'){
    		data = "{}";
    	}
        var $region = $(region);
        //view or wirte 모드 설정
        mode(view_mode);

        if (typeof load_options !== 'undefined') {
            $.extend(true, options, load_options); //merge client options to global options object
            //if(window.console) console.log(options);
        }
        //bmt-jwk : step 1
        template = $('.multi-row-template', $region);

        init(data, mode(), $region);

        if (mode() == 'R') {
            /* currency 패턴의 이벤트 중복 처리 전 numeral로 변경하던 코드로 */
            /* currency의 digit 기능을 유지하기 위해 패턴은 그대로 두고 css만 수정하도록 함 2014.10.06. KJW */
            /*
            $('.multi-row-template')
            .find('[data-pattern=currency]')
            .removeAttr('data-pattern')
            .attr('data-pattern', 'numeral');
            */

            //bmt-jwk : step 1
            $('input:text, textarea', template).each(function () {
                if (typeof $(this).data().faceReal !== 'undefined') {
                    return;
                }

                var h = getValue($(this));

                var attributeStr = "";
                $.each($(this)[0].attributes, function (i, attr1) {
                    if (attr1.name.toLowerCase() != "type" &&
                        attr1.name.toLowerCase() != "readonly" &&
                        attr1.name.toLowerCase() != "data-type") {
                        attributeStr += " " + attr1.name + "=\"" + attr1.value + "\"";
                    }
                });
                $(this).replaceWith('<span' + attributeStr + '>' + replaceLineBreak(h) + '</span>');
                //$(this).replaceWith('<span name="' + $(this).attr('name') + '" data-pattern="' + ($(this).attr('data-pattern') ? $(this).attr('data-pattern') : '') + '">' + replaceLineBreak(h) + '</span>');
                //$(this).replaceWith('<span name="'+$(this).attr('name')+'">'+replaceLineBreak(h)+'</span>');
            });

            $('[data-pattern=currency]', template).css('text-align', 'right');
        }

        //로드 전 테이블 행 제거
        clear($region);

        var d;
        if (data_type == null || data_type == 'xml') {//xml
            d = xmlToJson(data);
        } else if (data_type == 'json') {//json
            d = data;
        } else {
            return false;
        }

        loadTable(d, $region);


        //최소 행 개수 체크
        // checkAndAddMinLength(region);

        changeAutoColumnSpan($region);
        changeAutoSpan($region);

        if (typeof view_mode === 'string' && view_mode === 'W') {
            rowControlButton.init($region, 'table');
            $('.multi-row-selector-all-wrap').show();
        } else {
            rowControlButton.init($region, 'table');
            rowControlButton.disable(); //삭제버튼 숨김
            $('.multi-row-selector-all-wrap').hide(); // 전체선택 숨김
        }

        //컴포넌트 초기화 이후 다시 멀티로우를 로드한 경우에는 패턴 재적용
        if (mode() !== 'R' && typeof EASY === 'object' && EASY.options.initialized) {
            // EASY.init();
            EASY.triggerFormChanged($region);
        }

    };

    //question: addRow, delRow, 
    //rows_length: 
    //1) question이 canAddRow인 경우, add할 수 있는 행의 개수
    //2) question이 mustAddRow인 경우, add해야 할 행의 개수
    //3) question이 canDelRow인 경우, delete할 수 있는 행의 개수
    //4) question이 mustDelRow인 경우, delete해야 할 행의 개수
    //반환값: 추가 또는 삭제할 수 있는 행의 개수를 반환    
    var inqueryRowLength = function (region, question, rows_length) {
        var $region = (typeof region === 'object') ? region : $(region);
        var min_length = parseInt(options.minLength);
        var max_length = parseInt(options.maxLength);
        var template_row_length = getTemplateRowCount($region);
        var multi_row_length = getMultiRowCount($region);
        var allowed_length = 0;
        var multi_rows_set = multi_row_length / template_row_length;

        if (question == 'canAddRow') {
            allowed_length = (multi_rows_set < max_length) ? max_length - multi_rows_set : 0;
            if (max_length < 0) allowed_length = -1; //unlimited max length
        } else if (question == 'mustAddRow') {
            allowed_length = (multi_rows_set < min_length) ? min_length - multi_rows_set : 0;
        } else if (question == 'canDelRow') {
            allowed_length = (multi_rows_set > min_length) ? multi_rows_set - min_length : 0;
        } else if (question == 'mustDelRow') {
            //no case
        }

        return allowed_length;

    };

    function checkAndAddMinLength(region) {
        var rows_must_length = inqueryRowLength(region, 'mustAddRow');
        XFORM.multirow.addRow(region, rows_must_length);
    }

    //template 행의 개수를 반영한 멀티로우 세트 개수
    function getRowSetNums(iTemplate, iMultirows) {
        return (iMultirows / iTemplate);
    }

    //var changeAutoColumnSpan = function (region) {
    //	var m = mode();
    //	$(region).children('tbody').children('tr').children('.multi-row-autospan').each(function () {
    //		if ($(this).data().multiRowColspan) {
    //			var spans = $(this).data().multiRowColspan.split(',');
    //			var write_mode_span = spans[0];
    //			var read_mode_span = spans[1];
    //			var el = $(this);
    //			if (m == 'W') {
    //				colSpan(el, write_mode_span);
    //			} else {

    //				colSpan(el, read_mode_span);
    //			}
    //		}
    //	});
    //};

    var changeAutoColumnSpan = function (region) {
        var m = mode();
        $(region).find('[data-multi-row-colspan]').each(function () {
            var spans = $(this).data().multiRowColspan.split(',');
            var write_mode_span = spans[0];
            var read_mode_span = spans[1];
            var el = $(this);
            if (m == 'W') {
                colSpan(el, write_mode_span);
            } else {
                colSpan(el, read_mode_span);
            }
        });
    }


    var colSpan = function (o, n) {
        if (o && n >= 1) {
            o.prop('colspan', parseInt(n));
        } else {
            o.removeAttr('colspan');
        }
    };

    var rowSpan = function (o, n) {
        if (o && n >= 1) {
            o.prop('rowspan', parseInt(n));
        } else {
            o.removeAttr('rowspan');
        }
    };


    mode = function (m) {
        if (typeof m === 'undefined') {
            return g_form_mode;
        } else {
            if (m.toLowerCase() == 'read' || m.toLowerCase() == 'r') {
                g_form_mode = 'R';
            } else if (m.toLowerCase() == 'write' || m.toLowerCase() == 'w') {
                g_form_mode = 'W';
            }
        }
    };

    demo = function () {

        //demo - RESET
        $('#reset').bind('click', function () {
            XFORM.multirow.clear('form');
        });
        //테이블 생성
        $('#load_table').bind('click', function () {
            XOFRM.multirow.load($('#multirow_data').val(), 'json', 'newform');
        });

        //데이터 생성
        $('#get_data').bind('click', function () {
            var json = XFORM.multirow.data('string');
            $('#multirow_data').val(json);
            return false;
        });

    };
    //동적 테이블 삭제(템플릿 행은 제외)
    clear = function (region) {
        //var $region = (typeof region === 'object') ? region : $(region);
        var $region = $(region);

        //$region.find("input:not([type=button],[type=radio],[type=checkbox]), textarea").not('.demo-result').val("");
        $region.find(".multi-row input:not([type=button],[type=radio],[type=checkbox]), .multi-row textarea").not('.demo-result').val("");

        // mField checkbox 맵핑 안되는 부분 있어 주석
        //$region.find("input[type=checkbox]").prop("checked", false);

        $region.find('.multi-row:not(.multi-row-template)').remove();
        changeAutoSpan($region);
    };

    data = function (opt, region) {
        if (opt == 'string') {
            return json.toString(region);
        } else {
            return json.toObject(region);
        }
    };

    json = {
        toString: function (region) {
            return JSON.stringify(bodyToJson(region));
        },

        toObject: function (region) {
            return bodyToJson(region);
        }
    };

    loadTable = function (dataArray, region) {

        var $region = $(region);
        var is_single_table = ($region.hasClass('multi-row-table')) ? true : false;

        var $tables;
        //단일 테이블이면 region이 곧 데이터를 바인딩할 테이블
        if (is_single_table) {
            $tables = $region;
            //json 데이터가 배열이 아닐 경우 처리
            if (typeof dataArray === 'string' && dataArray.indexOf('[') !== 0) {
                dataArray = '[' + dataArray + ']';
            }
        } else {
            $tables = ($region.hasClass('multi-row-table')) ? $region : $('.multi-row-table', $region).eq(0);
        }
        var view_mode = mode();

        var jsonData = (typeof dataArray === 'object') ? dataArray : jQuery.parseJSON(dataArray);

        //DOM에서 multi-row-table 클래스를 찾은 후, id를 키로 jsonData 오브젝트에서 바인딩할 데이터를 찾음
        $.each($tables, function () {
            var $table = $(this),
                tablerows_in_json;

            if (is_single_table) {
                tablerows_in_json = jsonData;
            } else {
                //JSON 오브젝트 전체에서 tableid 를 키로 사용하는 오브젝트 추출.
                //table = $.inJSON(jsonData, tableid);
                //첫번째 인덱스가 사용할 JSON 오브젝트
                //tablerows_in_json = table[0];
            }

            //한 테이블 내의 rows
            loadRow($table, tablerows_in_json);
            //hidden 값을 radio 또는 체크박스로 가져옴
            //dataface.load($('#' + tableid), mode());
            dataface.load($table, mode());

            //checkAndAddMinLength($('#' + tableid));
            checkAndAddMinLength($table);

            if (view_mode == 'R') {
                $('.multi-row', $table).find('input:text, textarea').each(function () {		//$('.multi-row', $table).find('input:text, textarea, select').each(function () { // [2015-01-28] 멀티로우 select text
                    //hidden 태그 제외
                    if (!$(this).is(':visible')) return;

                    //currency 패턴에 대한 추가 처리(패턴 부여 & 우측 정렬)
                    if ($(this).data() && $(this).data().pattern) {
                        var p = $(this).data().pattern;
                        var o = $(this).convertTagTo('span');
                        o.removeClass('pattern-active')
                         .removeAttr('required')
                         .removeClass('input-required');

                        //numeral은 우측 정렬
                        if (p == 'numeral') {
                            o.css('text-align', 'right');
                        }
                        //span에 있는 우측정렬 속성이 적용되도록 하기 위해, block 설정
                        if (o.css('text-align') == 'right') {
                            o.css('display', 'inline-block');
                        }
                    } else {
                        //bmt-jwk : step 1 아래 주석처리
                        //var h = getValue($(this));
                        //$(this).replaceWith(replaceLineBreak(h));
                    }
                });

                // [2015-01-28] 멀티로우 select text
                $('.multi-row', $table).find('select').each(function () {
                    //hidden 태그 제외
                    if (!$(this).is(':visible')) return;
                    var h;
                    //currency 패턴에 대한 추가 처리(패턴 부여 & 우측 정렬)
                    if ($(this).attr("data-element-type") == "sel_d_t") {
                        h = getText($(this));
                    } else {
                        h = getValue($(this));
                    }
                    $(this).replaceWith(replaceLineBreak("<span name=" + $(this).attr("name") + ">" + h + "</span>"));
                });

            }

        });

        // [2015-01-28] 멀티로우 select text
        function getText(el) {
            var t = el.find("option[value='" + el.val() + "']").text();
            return t;
        }

        function loadRow(tableObj, rows) {
            if (!rows) return;

            // [2016-01-05 leesm] 멀티로우 데이터가 1줄일 때 rows.length undefined 여서 안그려짐 수정
            if (rows.length == undefined) {
                var tmp = rows;
                rows = [];
                rows[0] = tmp;
            }

            var $table = tableObj;
            var last_index = rows.length - 1;
            var view_mode = mode();
            //bmt-jwk: step3
            //json 데이터 루프
            //$.each(rows, function (i, row) {
            //작성 모드는 템플릿행은 유지하므로, 첫행 이후만 생성. 첫행이 템플릿과 데이터 행을 겸할 경우
            //if(i > 0) makeNewRow($table, i);

            //템플릿행을 템플릿으로만 사용
            //var $newrows = makeNewRow($table, i);
            //loadRowSingle($table, i, row, $newrows);
            //});
            // var $newrows = makeNewRow($table, -1, rows.length, rows);
            var $newrows = rows.length > 0 ? makeNewRow($table, -1, rows.length, rows) : null;
            //loadRowSingle($table, -1, rows, $newrows);
            changeAutoSpan($table);
        }
        //rowData: JSON 데이터 오브젝트
        function loadRowSingle($table, iDataIndex, rowData, $newrows) {

            var $Rows = $newrows;
            //데이터 루프 row - {name:value, name2: value2,,,, }
            //k: key, v: value
            if (typeof rowData === 'string') {
                rowData = JSON.parse(rowData);
            }
            $.each(rowData, function (k, v) {
                if ($.isArray(v) && typeof v[0] === 'object' && options.enableSubMultirow) {
                    var tableName = k;
                    var dataArray = v;
                    var $SubTable = $Rows.find('[name=' + tableName + ']');

                    /**********************************************************/
                    //테이블내 멀티로우 테이블(value가 오브젝트의 배열인 경우) 처리
                    /**********************************************************/
                    XFORM.multirow.load(dataArray, 'json', $SubTable, mode(), { minLength: 1 });

                } else {
                    //15.01.21 KJW 중첩멀티로우를 사용하지 않으므로, 관대한 검색경로를 사용함
                    ///console.log(i, k, v);
                    //데이터에 해당하는 필드
                    //bmt-jwk : step 2 - $table 내 검색을 $newrows 내 검색으로 수정
                    //수정전:
                    //var $field = $('[name=' + k + '],[data-field=' + k + '],[data-field-alias=' + k + ']', $table).not('.multi-row-template *').eq(iDataIndex);
                    //var $fieldBelowContainer = $('.multi-row-container', $table).find('[name=' + k + '],[data-field=' + k + '],[data-field-alias=' + k + ']').not('.multi-row-template *').eq(iDataIndex);
                    //수정후:
                    var $field = $('[name=' + k + '],[data-field=' + k + '],[data-field-alias=' + k + ']', $newrows);
                    //var $fieldBelowContainer = $('.multi-row-container', $newrows).find('[name=' + k + '],[data-field=' + k + '],[data-field-alias=' + k + ']').not('.multi-row-template *').eq(iDataIndex);

                    //$field = $field.add($fieldBelowContainer);

                    var $field_notCheckedAndRadio = $field.not('input:checkbox').not('input:radio');
                    if ($field_notCheckedAndRadio.length === 0) return;
                    //console.log(i, k, v, $field.length);
                    //data binding
                    setValue($field_notCheckedAndRadio, v);
                }

            });
        }

    };

    function getChildrenElements(selector, $table) {
        return $table.children('tbody').children('tr').children('td').children(selector);
    }

    function getChildrenTr(selector, $table) {
        // 15.01.21 KJW 중첩멀티로우 사용시 TR 검색경로를 엄겨하게 제한함
        if (options.enableSubMultirow) {
            return $table.children('tbody').children(selector);
        } else {
            return $table.find(selector);
        }
    }

    jQuery.fn.getChildrenElements = function (selector) {
        //dataMap = { datakey : fieldkey, datakey2 : fieldkey2 ... }
        return getChildrenElements(selector, $(this));
    };

    //Row의 인덱스를 지정하여 데이터를 로드한다.
    var setRow = function (tableid, row_data, row_index) {
        var json = (typeof row_data === 'object') ? row_data : jQuery.parseJSON(row_data);
        var $table = (typeof tableid === 'object') ? tableid : $(tableid);
        var row_array = [];
        var row_id = (row_index === undefined) ? 0 : row_index;

        if (typeof row_data === 'array') {
            row_array = json;
        } else {
            row_array.push(json);
        }
        $.each(row_array, function (i, row) {
            //작성 모드는 템플릿행은 유지하므로, 첫행 이후만 생성. 첫행이 템플릿과 데이터 행을 겸할 경우
            //if(i > 0) makeNewRow($table, i);

            //템플릿행을 템플릿으로만 사용
            //makeNewRow($table, i);        

            $.each(row, function (k, v) {

                //var $field = $table.find('[name=' + k + ']').not('.multi-row-template *').eq(i + row_id);
                var $field = getChildrenElements('[name=' + k + '],[data-field=' + k + '],[data-field-alias=' + k + ']', $table).not('.multi-row-template *').eq(i + row_id);

                var $field_notCheckedAndRadio = $field.not('input:checkbox').not('input:radio');
                if ($field_notCheckedAndRadio.length === 0) return;
                //console.log(i, k, v, $field.length);
                //data binding

                //$field_notCheckedAndRadio.val(v);
                setValue($field_notCheckedAndRadio, v);
            });
        });
        //체크박스/라디오 값을 읽어 들인다.
        dataface.load($(tableid), mode());
        //폼의 변경여부를 통지한다.
        if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged($table);
    };

    function replaceLineBreak(s) {
        //null 처리 추가. 2014.07.21. KJW
        if (s === undefined || s == null) return '';
        //json 형식에 포함된 정수 처리 추가.
        //return s.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return s.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

    //bmt-jwk: step 3
    //function setValue(el, value) {
    var setValue = function (el, value) {
        var t = hasVal(el);
        var v = $.isArray(value) ? arrayToString(value) : value;
        if (t) {
            el.val(v);
        } else {
        	if ($(el).attr("data-element-type") == "textarea_linebreak" && v) {
                v = v.replace(/ /g, '&nbsp;');
            }
            v = replaceLineBreak(v);
            el.html(v);
        }
    }

    function arrayToString(arr) {
        var s = '';
        for (var i in arr) {
            if (s === '') {
                s = arr[i];
            } else {
                // [2015-05-20 modi] ie8에서 "for (var i in arr)" 구문에 function으로 돌아서 
                //s += '|' + arr[i]; 
                if (typeof arr[i] !== 'function' && typeof arr[i] !== 'object')
                    s += '|' + arr[i];

            }
        }
        return s;
    }

    function getValue(el) {
        var t = hasVal(el);
        return (t) ? el.val() : el.html();
    }

    function hasVal(el) {
        var t = (el.prop('tagName') != null) ? el.prop('tagName').toLowerCase() : '';
        return (t == 'input' || t == 'select' || t == 'textarea') ? true : false;
    }

    loadSingleData = function (json, $region) {
        //bid data to field
        mapField(json.BODY_CONTEXT, $region);
    };

    mapField = function (json, region) {
        var $region = region;

        $.each(json, function (k, v) {
            //if (window.console) console.log(k, v);
            $region.field(k, v);
        });
    };
    getTemplateRowCount = function (t) {
        var $table = t;
        var $template = getChildrenTr('.multi-row-template', $table);
        return $template.length;
    };

    getMultiRowCount = function (t) {
        var $table = t;
        var $rows = getChildrenTr('.multi-row', $table);
        return $rows.length;
    };

    //create new row
    //bmt-jwk : step3
    //makeNewRow = function (t, k) { //table, 
    //c : 대량 반복생성할 횟수
    //d: 바인드할 데이터
    makeNewRow = function (t, k, c, d) {
        var $table = t;
        var $template;
        //15.01.21 KJW 중첩멀티로우 사용시 엄격한 검색경로를 적용
        //if (options.enableSubMultirow) {
        //    $template = $table.children('tbody').children('.multi-row-template'); //find를 children으로 대체
        //} else {
        //    //bmt-jwk : step1
        //    //$template = $table.children('tbody').find('.multi-row-template');
        //    $template = template;
        //}

        // 2016.03.29 leesm 멀티로우 여러개 쓸 때 마지막 load한 template을 가지고 있어서 문제가 되므로 수정함.
        $template = $table.children('tbody').children('.multi-row-template');

        var $last = $template.siblings('.multi-row');

        var num = $template.siblings('.multi-row').length;
        if (num === 0) {
            $last = $template.last();
        } else {
            $last = $template.siblings('.multi-row').last();
        }
        //템플릿 단위로 1개행씩 건너 뛰며 배경색 지정. 14.07.23 KJW
        var template_base_num = parseInt(num / parseInt(getTemplateRowCount($table))) + 1;

        //radio, checkbox 의 name 제거시 예외
        var name_remove_exception = '.multi-row-selector';
        //new row just created
        //bmt-jwk : step 3
        var $newrow; //false
        // [2015-12-24 leesm] var $newrow = $template.duplicate(c ? c : 1, d); 에서 변경함.
        if (c > 0) { $newrow = $template.duplicate($template, c, d); }
        else { $newrow = $template.clone(false); }
        //var $newrow = $($template[0].outerHTML); //false
        //console.log('x', $template.prop('name'));
        //console.log($newrow.html());
        $newrow.find(':radio, :checkbox').not(name_remove_exception).removeAttr('name');

        //자동증가행의 속성상 반복해서 늘어날 수 없으므로, 템플릿 복제 후 삭제함. 단. 최소1개는 남아 있어야 함.
        if ($table.children('tbody').children('.multi-row').children('.multi-row-autospan').length > 0) {
            $newrow.children('.multi-row-autospan').remove();
        }

        //console.log($newrow.prop('name'));
        $newrow.unbind('click');
        $last.after($newrow.removeClass('multi-row-template').addClass('multi-row'));
        //console.log($template.attr('tagName'));

        // --- radio data-face -----
        // 1.face event bind
        dataface.enable($newrow);
        // 2.change name
        dataface.update($table, $newrow);

        //add/delete button event bind
        rowControlButton.init($newrow, 'tr');

        //template에 있는 no-required 클래스 제거
        $newrow.removeClass('no-required');
        //template에 있는 pattern-skip 클래스 제거
        $newrow.removeClass('pattern-skip');

        $newrow.show();

        //$newrow css
        setRowBackground($newrow, template_base_num);

        //sequence display
        remakeRowSeq($table);

        // changeAutoSpan($table);

        return $newrow;
    };

    //row 배경색 처리.14.07.23. KJW
    function setRowBackground(elem, tpl_num) {
        //홀수행 - options.rowFirstColor 가 정의되고 공백이 아닌 경우만 처리함
        if (tpl_num % 2 == 1) {
            elem.addClass('multi-row-first');
            if (options.rowFirstColor !== '') {
                elem.css('background-color', options.rowFirstColor);
            }
        } else {
            //짝수행 - options.rowSecondColor이 정의되거나, options.rowColor를 정의한 경우 처리
            elem.addClass('multi-row-second');
            if (options.rowSecondColor !== '') {
                elem.css('background-color', options.rowSecondColor);
            } else if (options.rowColor !== '') {
                elem.css('background-color', options.rowColor);
            }
        }
    }

    //after row added, increase seq.
    remakeRowSeq = function ($table) {
        var num = 1;
        var last = 0;
        var template_rows = parseInt(getTemplateRowCount($table));

        var $tr = $table.children('tbody').children('.multi-row');

        $tr.each(function (i, v) {
            //console.log('seq', i);
            //$(this).find('.multi-row-seq').text(i+1);
            last = (i / template_rows) + 1; //1부터 시작(개수와 일치)
            $(this).find('.multi-row-seq').eq(0).text(last);
        });

        return last;
    };

    //after row added, increase seq.
    fastRemakeRowSeq = function ($table) {
        var num = 1;
        var last = 0;
        var template_rows = parseInt(getTemplateRowCount($table));

        var $tr = $table.children('tbody').children('.fast-multi-row');
        if ($tr.find(".multi-row-seq") != null && $tr.find(".multi-row-seq").length > 0) {
            $tr.each(function (i, v) {
                //console.log('seq', i);
                //$(this).find('.multi-row-seq').text(i+1);
                // last = (i / template_rows) + 1; //1부터 시작(개수와 일치)
                last = i + 1; //1부터 시작(개수와 일치)
                $(this).find('.multi-row-seq').eq(0).text(last);
            });
        }
    };

    changeAutoSpan = function ($table) {
        //auto rowspan
        var $tr = $table.children('tbody').children('tr');
        var $autoSpanColumn = $tr.children('.multi-row-autospan');
        var $autoSpanColumnHide = $tr.children('th.multi-row-autospan-hide');
        var autoRowSpan = 1;
        var dataRowsNum = $tr.filter('.multi-row').length;
        var template_rows_num = parseInt(getTemplateRowCount($table));

        //멀티로우 초기화시 span 값 저장
        if ($autoSpanColumn.length > 0 && typeof $autoSpanColumn.data().multiRowHeadSpan === 'undefined') {
            var headRowsNum = ($autoSpanColumn.prop('rowspan') && $autoSpanColumn.closest('.multi-row-template').length === 0) ? $autoSpanColumn.prop('rowspan') : 0;
            //rowspan 상태를 data()에 저장
            $autoSpanColumn.data('multi-row-head-span', headRowsNum);

        }

        //헤더 rowspan값 읽기
        if ($autoSpanColumn.length > 0) {
            autoRowSpan = $autoSpanColumn.data().multiRowHeadSpan;
        }

        //테이블 하단 기본으로 표시될 항목(multi-row-autospan-hide)의 span값
        var iHideOnRowAdded = $autoSpanColumnHide.length;

        //스팬 값 = 헤더 스팬 + 데이터 로우 개수
        var iRowSpans = autoRowSpan + dataRowsNum + iHideOnRowAdded;
        if (iRowSpans > 1) {
            $autoSpanColumn.prop('rowspan', iRowSpans);
        } else {
            $autoSpanColumn.removeAttr('rowspan');
        }
        //데이터행(.multi-row)이 1개라도 있으면 multi-row-autospan-hide 클래스 숨김, 없으면 표시
        if (dataRowsNum === 0) {
            $autoSpanColumnHide.show();
        } else {
            $autoSpanColumnHide.hide();
        }
        if (dataRowsNum > 0) {
            for (var i = 0; i <= (dataRowsNum / template_rows_num) ; i += template_rows_num) {
                $table.find("tr.multi-row").eq(template_rows_num + i).find(".multi-row-autospan").remove();
            }
        }
    };
    //BODY to JSON
    bodyToJson = function (region) {

        if (typeof region === 'undefined') return;

        var j = {};
        var $obj = $(region),$tables;
        var $table;
        if ($obj.prop('tagName').toLowerCase() === 'table') {
            $table = $obj; //테이블 개체를 직접 지정한 경우
        } else {
            $table = $obj.closest('.multi-row-table'); //버튼 개체가 파라미터인 경우, 상위 테이블을 찾음
        }

        return multiRowToJson($table);

        function multiRowToJson(tableObj) {
            var $table = tableObj;

            var r = [], $rows;
            var template_rows_num = parseInt(getTemplateRowCount($table));

            //:nth-child(3n+1)
            if (template_rows_num == 1) {
                $rows = $table.children('tbody').children('tr.multi-row');
                $.each($rows, function () {//
                    var $row = $(this);
                    var rowjson = $row.rowSerialize();
                    r.push(rowjson);
                });
            } else {
                //multi-template
                //$rows = $table.children('tbody').children('tr.multi-row').not('.multi-row-parent').nth(template_rows_num + 'n');
                $rows = $table.children('tbody').children('tr.multi-row').nth(template_rows_num + 'n');
                $.each($rows, function () {//
                    var $row = $(this);
                    var rowjson = $row.nextAll().andSelf().slice(0, template_rows_num).rowSerialize();
                    r.push(rowjson);
                });
            }

            return r;
        }
    };
    //radio check event
    dataface = {
        enable: function (el) {
            var $df = this;
            var $face = (typeof el === 'undefined') ? $('[data-face-for]') : $('[data-face-for]', el);
            $face.bind('click', function () {
                var o = $(this),
                    face = o.attr('name'),
                    real = $df.name(face),
                    index = $df.index(face),
                    checked = $df.getAllChecked(face),
                    value = o.val();

                //$('[name=' + real + ']').eq(index).val(checked);
                setValue($('[name=' + real + ']').eq(index), checked);
            });

            $df.initIndex();
        },
        //hidden 값을 face로 표시, el = multi table
        load: function (el) {
            var $df = this;
            var $reals = (typeof el === 'undefined') ? $('.multi-row [data-face-real]') : $('.multi-row [data-face-real]', el);
            var view_mode = XFORM.multirow.mode();

            $.each($reals, function (i, v) {
                var $r = $(this),
                    index = $r.attr("data-face-index"),
                    value_array = ($r.val()).split('|'), //old: ,
                    name = $r.attr('name'),
                    opt_name = name + '_' + index,
                    //$faces = $('.multi-row [name=' + opt_name + ']');
                    $faces = $('[name=' + opt_name + ']', $(this).parent());
                if (typeof index === 'undefined') {
                    //if (window.console) console.log(name + ': face-index not defined');
                }
                if (view_mode == 'W') {
                    $df.loadEditable($faces, value_array);
                } else if (view_mode == 'R') {
                    $df.loadReadible($faces, value_array);
                }
            });
        },
        loadEditable: function ($faces, value_array) {
            $.each($faces, function () {
                //$(this).css('border','solid 1px #f00');
                var fv = $(this).val();
                var input_type = $(this).attr('type');

                //배열에서 값이 존재하는 인덱스를 반환
                if ($.inArray(fv, value_array) > -1) {
                    //console.log('arr=',value_array,'fv=',fv,'checked=','true');
                    $(this).prop({ "checked": true });
                } else {
                    if (input_type.toLowerCase() != 'radio') {
                        //console.log(input_type.toLowerCase());
                        $(this).prop({ "checked": false });
                    }
                }
            });
        },
        loadReadible: function ($faces, value_array) {
            $.each($faces, function () {
                var fv = $(this).val(),
                    view_type = $(this).data().elementType,
                    tag_type = $(this).prop('type').toLowerCase(),
                    chk,
                    unchk;

                if (tag_type == 'radio') {
                    chk = '<span class="radio-checked">●</span>';
                    unchk = '<span class="radio-unchecked">○</span>';
                } else if (tag_type == 'checkbox') {
                    chk = '<span class="checkbox-checked">■</span>';
                    unchk = '<span class="checkbox-unchecked">□</span>';
                }

                //배열에서 값이 존재하는 인덱스를 반환
                if ($.inArray(fv, value_array) > -1) {
                    //console.log('arr=',value_array,'fv=',fv,'checked=','true');
                    $(this).replaceWith(chk);
                } else {
                    $(this).replaceWith(unchk);
                }
            });
        },
        //테이블 첫 행의 인덱스 설정
        initIndex: function () {
            $('.multi-row-template [data-face-real]').each(function () {
                $(this).attr('data-face-index', '0');
                //console.log($(this).data().faceIndex);
            });
        },
        //체크된 값을 배열로 반환
        getAllChecked: function (s) {
            //var index = 0;
            if (!window.console) console = { log: function () { } };
            if (typeof s !== "string") return false;

            var o = $('[name=' + s + ']'),
                result = [];

            $.each(o, function (i, v) {
                if ($(this).is(":checked")) result.push($(this).val());
            });
            return result;
        },
        name: function (f) {
            return f.split('_')[0];
        },
        index: function (f) {
            return f.split('_')[1];
        },
        next: function (r, mode, i) {
            var n = this.nextIndex(r, mode, i);
            return r + '_' + n;
        },
        lastIndex: function (r, i) {
            // return (typeof i !== 'undefined' && XFORM.multirow.mode() == "R") ? i : $('[name=' + r + ']').length;
            return i;
        },
        nextIndex: function (r, mode, i) {
            var c = this.lastIndex(r, i);
            /*
            var n;
            if (mode == 'afterRowAdded') {
                n = c - 1;
            } else if (mode == 'beforeRowAdded') {
                n = c;
            }
            */
            return c;
        },
        //추가된 행의 name 변경
        //update: function ($table, $newrow) {
        //var templ_rows_num = parseInt(getTemplateRowCount($table));
        //var last_row_num = $('.multi-row',$table).index($newrow.eq(0)); //템플릿을 제외한 새로운 행의 직전 행의 개수
        //var last_tpl_num = (last_row_num / templ_rows_num);
        //var next_tpl_num = ++last_tpl_num;
        //var newrow_tpl_count = $newrow.length / templ_rows_num; //새 행집합의 템플릿 기준 데이터행 개수

        //for (var i = 0; i < newrow_tpl_count; i++) {
        //    var slice_index = i * templ_rows_num;
        //    var tplRow = $newrow.slice(slice_index, templ_rows_num + slice_index);
        //    var next_update_row_index = next_tpl_num + i;
        //    updateSequence(tplRow, next_update_row_index);
        //}
        ////추가된 행의 name 변경
        //function updateSequence($newrow, i) {
        //    $('[data-face-real=y]', $newrow).each(function () {
        //        var $real = $(this),
        //        curr_name = $real.prop('name'),
        //        next_name = curr_name + '_' + i; //$df.next(curr_name, 'afterRowAdded'),
        //        next_index = i; //$df.nextIndex(curr_name, 'afterRowAdded'),
        //        $faces = $('[data-face-for=' + curr_name + ']', $newrow);
        //        //index 값 변경 
        //        $real.data('face-index', next_index);
        //        $.each($faces, function () {
        //            $(this).prop('name', next_name);
        //        });
        //    });
        //}

        /* var $df = this;
         var tpl_length = $table.find(".multi-row-template").length;
         // var t_length = $table.find("tr.multi-row").length;
         // var $r_newrow = $table.find("tr.multi-row:nth-child(" + tpl_length + "n)");
         var elface = $table.find("*[face-index]");
         var faceIndex = (elface.length - $table.find(".multi-row").slice(0, tpl_length).find("[face-index]").length) - 1;
         var i = parseInt(elface.eq(faceIndex).attr("face-index"), 10) + 1;
         for (var rowIndex = 0 ; rowIndex < $newrow.length; rowIndex += tpl_length, i++) {
             var tRow = $newrow.slice(rowIndex, tpl_length + rowIndex);
             $reals = $('[data-face-real=y]', tRow);

             //index 값 변경      
             $.each($reals, function () {
                 var $real = $(this),
                     curr_name = $real.prop('name'),
                     next_name = $df.next(curr_name, 'afterRowAdded', i),
                     next_index = $df.nextIndex(curr_name, 'afterRowAdded', i),
                     $faces = $('[data-face-for=' + curr_name + ']', tRow);
                 //console.log(curr_name, next_name, next_index, $real.val());
                 $real.attr('face-index', next_index);
                 $.each($faces, function () {
                     $(this).attr('name', next_name);
                 });
             });
         }*/
        /*
        $.each($newrow, function () {
            var $row = $(this),
                $reals = $('[data-face-real=y]', $row);

            //index 값 변경      
            $.each($reals, function () {
                var $real = $(this),
                    curr_name = $real.prop('name'),
                    next_name = $df.next(curr_name, 'afterRowAdded', i),
                    next_index = $df.nextIndex(curr_name, 'afterRowAdded', i),
                    $faces = $('[data-face-for=' + curr_name + ']', $row);
                //console.log(curr_name, next_name, next_index, $real.val());
                $real.attr('face-index', next_index);
                $.each($faces, function () {
                    $(this).attr('name', next_name);
                });
            });
            i++;
        });
        */
        //    }
        //};
        update: function ($table, $newrow) {
            /* 2016-06-29 수정 후 */
            var templ_rows_num = parseInt(getTemplateRowCount($table));
            var last_row_num = $('.multi-row', $table).index($newrow.eq(0));  //템플릿을 제외한 새로운 행의 직전 행의 개수
            var last_tpl_num = (last_row_num / templ_rows_num);
            var next_tpl_num = ++last_tpl_num;
            var newrow_tpl_count = $newrow.length / templ_rows_num; //새 행집합의 템플릿 기준 데이터행 개수

            for (var i = 0; i < newrow_tpl_count; i++) {
                var slice_index = i * templ_rows_num;
                var tplRow = $newrow.slice(slice_index, templ_rows_num + slice_index);
                var next_update_row_index = next_tpl_num + i;
                updateSequence(tplRow, next_update_row_index);
            }

            //추가된 행의 name 변경
            function updateSequence($newrow, i) {

                $('[data-face-real=y]', $newrow).each(function () {
                    var $real = $(this),
                        curr_name = $real.prop('name'),
                        next_name = curr_name + '_' + i; //$df.next(curr_name, 'afterRowAdded'),
                    var next_index = i; //$df.nextIndex(curr_name, 'afterRowAdded'),
                    var $faces = $('[data-face-for=' + curr_name + ']', $newrow);

                    //index 값 변경                    
                    $real.attr('data-face-index', next_index);
                    $.each($faces, function () {
                        $(this).prop('name', next_name);
                    });
                });
            }
        }
    };

    /*------- row add/ delete event bind ----*/
    rowControlButton = {
        init: function (scope, scopeType) {
            var $el;
            if (scopeType === 'tr') return;

            //행 추가버튼
            var $scope = (typeof scope === 'string') ? $(scope) : scope;
            if (scopeType === 'table') {
                $el = $scope.find('.multi-row-add').eq(0);
            } else if (scopeType === 'tr') {
                $el = $scope.find('.multi-row-add').eq(0);
            }


            $el.each(function () {
                var $row_control = $(this).closest('.multi-row-control');
                var $table = $(this).closest('.multi-row-table');
                var $chk_all = $table.find('.multi-row-select-all');
                //테이블 상단에 정의된 삭제 버튼
                if ($row_control.length > 0) {
                    $(this).unbind('click').bind('click', function () {
                        XFORM.multirow.addRow($table);
                    });
                }
            });
            $el.show();

            //행 삭제버튼
            var $el2 = (typeof $scope === 'undefined') ? $('.multi-row-del') : $scope.find('.multi-row-del');
            $el2.each(function () {
                var $row_control = $(this).closest('.multi-row-control');
                var $table = $(this).closest('.multi-row-table');
                var $chk_all = $table.find('.multi-row-select-all');
                var template_rows_num = parseInt(getTemplateRowCount($table));
                var $checked_row;

                //테이블 상단에 정의된 삭제 버튼
                if ($row_control.length > 0) {
                    $(this).unbind('click').bind('click', function () {
                        var $chk = $table.find('.multi-row-selector:checked');
                        //$rows.slice(-1 * template_rows_num).remove();
                        $chk.each(function () {
                            $checked_row = $(this).closest('.multi-row');
                            if (template_rows_num == 1) {
                                $checked_row.remove();
                            } else {
                                $checked_row.nextAll().andSelf().slice(0, template_rows_num).remove();

                            }
                        });
                        events.afterRowRemoved();

                        $chk_all.prop('checked', false);
                        changeAutoSpan($table);

                        //시퀀스 새로고침.141204
                        XFORM.multirow.remakeRowSeq($table);

                        if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged();
                    });

                } else {
                    //테이블 각 행에 정의된 삭제 버튼
                    $(this).unbind('click').bind('click', function () {
                        var $container = $(this).closest('.multi-row');
                        $container.remove();
                        events.afterRowRemoved();
                        $chk_all.prop('checked', false);
                        changeAutoSpan($table);
                        if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged();
                    });
                }

            });
            $el2.show();

            //행 전체선택 체크박스
            var $el3 = (typeof $scope === 'undefined') ? $('.multi-row-select-all') : $scope.find('.multi-row-select-all');
            $el3.each(function () {
                var $table = $(this).closest('.multi-row-table');
                //테이블 상단에 정의된 삭제 버튼
                $(this).bind('change', function () {
                    var $chk = $table.find('.multi-row .multi-row-selector');
                    if ($(this).is(':checked')) {
                        $chk.prop('checked', true);
                    } else {
                        $chk.prop('checked', false);
                    }
                });
            });
            if ($el3) $el3.show();

            //행 선택 체크박스의 상위 TD를 작성/읽기 모드에 따라 표시/숨김
            var $el4 = (typeof $scope === 'undefined') ? $('.multi-row-selector-wrap') : $scope.find('.multi-row-selector-wrap');
            if ($el4) $el4.show();

            //행 선택 체크박스를 작성/읽기 모드에 따라 표시/숨김
            var $el5 = (typeof $scope === 'undefined') ? $('.multi-row-selector') : $scope.find('.multi-row-selector');
            $el5.show();

            //행 삭제버튼
            var $autodel = (typeof $scope === 'undefined') ? $('.multi-row-del-auto') : $scope.find('.multi-row-del-auto');
            $autodel.each(function () {
                var $row_control = $(this).closest('.multi-row-control');
                var $table = $(this).closest('.multi-row-table');
                var template_rows_num = parseInt(getTemplateRowCount($table));

                //테이블 상단에 정의된 삭제 버튼
                if ($row_control.length > 0) {
                    $(this).unbind('click').bind('click', function () {
                        XFORM.multirow.delRow($table);
                        if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged(); //합계 테이블과 복합된 경우 합계 재계산을 위해 호출.2014.07.07.KJW
                    });
                }

            });
            $autodel.show();

            //다중행 추가/삭제버튼
            var $buttons = (typeof $scope === 'undefined') ? $('.multi-row-control-button') : $scope.find('.multi-row-control-button');
            $buttons.show();
        },
        disable: function (el) {
            var $el = (typeof el === 'undefined') ? $('.multi-row-add') : el.find('.multi-row-add');
            var $el2 = (typeof el === 'undefined') ? $('.multi-row-del') : el.find('.multi-row-del');
            var $el3 = (typeof el === 'undefined') ? $('.multi-row-selector') : el.find('.multi-row-selector');
            var $el4 = (typeof el === 'undefined') ? $('.multi-row-selector-wrap') : el.find('.multi-row-selector-wrap');
            //행 전체선택 체크박스
            var $el5 = (typeof el === 'undefined') ? $('.multi-row-select-all') : el.find('.multi-row-select-all');
            var $autodel = (typeof el === 'undefined') ? $('.multi-row-del-auto') : el.find('.multi-row-del-auto');
            var $buttons = (typeof el === 'undefined') ? $('.multi-row-control-button') : el.find('.multi-row-control-button');


            $el.hide();
            $el2.hide();
            $el3.hide();
            $el4.hide();
            $el5.hide();
            $autodel.hide();
            $buttons.hide();
        }
    };

    var callRowAdded = function (obj) {
        //when block or element is dropped, evoke event
        $.event.trigger({
            type: "rowAdded",
            message: "rowAdded",
            time: new Date(),
            object: obj
        });
    };

    var event = function (message, callBack) {

        //if( window.console ) console.log('row added');
        if (typeof callBack !== 'undefined') {
            events[message] = callBack;
        }

    };

    var events = {
        afterRowAdded: function () { },
        afterRowRemoved: function () { }
    };

    var getMultiRowTable = function (table) {
        var $table;
        if (typeof table === 'string') {
            $table = $(table); //테이블 selector를 사용한 경우
        } else if (typeof table === 'object') {
            var obj = $(table);
            if (obj.prop('tagName').toLowerCase() === 'table') {
                $table = table; //테이블 개체를 직접 지정한 경우
            } else {
                $table = obj.closest('.multi-row-table'); //버튼 개체가 파라미터인 경우, 상위 테이블을 찾음
            }

        } else {
            return null;
        }

        return $table;
    };

    var addRow = function (table, row_num, fn) {

        var $table = getMultiRowTable(table);
        if ($table === null) return;

        var $chk_all = $table.find('.multi-row-select-all');
        var count = (typeof row_num === 'undefined') ? 1 : parseInt(row_num);
        //최대행 제한값에 따라 추가할 행의 개수를 조정
        var max_count = inqueryRowLength($table, 'canAddRow');
        if (parseInt(max_count) > -1 && parseInt(count) > parseInt(max_count)) {
            count = max_count;
        }
        var $rows = $();
        for (var x = 0; x < count; x++) {
            var new_rows = makeNewRow($table);

            //테이블내 멀티로우 초기화
            var $SubTables = new_rows.find('.multi-row-table');
            if ($SubTables.length > 0) {
                $SubTables.each(function () {
                    var $SubTable = $(this);
                    XFORM.multirow.load('', 'json', $SubTable, 'W');
                });
                /*for (var t in $SubTables) {
                var $SubTable = $SubTables[t];
                XFORM.multirow.load('', 'json', $SubTable, 'W');
                }*/
            }

            $rows = $rows.add(new_rows);
            callRowAdded(new_rows);
            events.afterRowAdded(new_rows);
            $chk_all.prop('checked', false);

            changeAutoSpan($table);

            //패턴 렌더링
            EASY.pattern(new_rows);
            //if (typeof EASY === 'object') EASY.init(new_rows);
        }
        //%%%out of scope
        if (fn !== undefined) {
            fn.call(this, $rows);
        }
    };

    var delRow = function (table, row_num) {
        var $table = getMultiRowTable(table);
        if ($table === null) return;
        var template_rows_num = parseInt(getTemplateRowCount($table));

        var count = (typeof row_num === 'undefined') ? 1 : parseInt(row_num);
        //최소행 제한값에 따라 삭제할 행의 개수를 조정
        var max_count = inqueryRowLength($table, 'canDelRow');
        if (parseInt(count) > parseInt(max_count)) count = max_count;

        for (var x = 0; x < count; x++) {
            var $rows = $table.find('.multi-row');
            if ($rows.length > 0) {
                $rows.slice(-1 * template_rows_num).remove();
                events.afterRowRemoved();
                changeAutoSpan($table);
            }
        }

        if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged();
    };

    var clearRow = function (table) {
        var $table = getMultiRowTable(table);
        if ($table === null) return;
        var template_rows_num = parseInt(getTemplateRowCount($table));

        //삭제 가능한 행의 개수를 조정
        var max_count = inqueryRowLength($table, 'canDelRow');

        for (var x = 0; x < max_count; x++) {
            var $rows = $table.find('.multi-row');
            if ($rows.length > 0) {
                $rows.slice(-1 * template_rows_num).remove();
                events.afterRowRemoved();
                changeAutoSpan($table);
            }
        }
    };
    var getAllRows = function (table) {
        var $table = $(table);
        var $first_tr = $table.find('tr.multi-row').eq(0);
        var $trs = $();
        $trs = $first_tr.add($first_tr.siblings('.multi-row'));
        return $trs;
    }

    //체크된 행 개체 반환
    var getCheckedRows = function (table) {
        var $table = $(table);
        var $chk = $table.find('.multi-row-selector:checked');
        var template_rows_num = parseInt(getTemplateRowCount($table));
        var elems = $();
        //$rows.slice(-1 * template_rows_num).remove();
        $chk.each(function () {
            var $checked_row = $(this).closest('.multi-row');
            if (template_rows_num == 1) {
                elems = elems.add($checked_row);
            } else {
                elems = elems.add($checked_row.nextAll().andSelf().slice(0, template_rows_num));

            }
        });

        return elems;
    }
    //체크된 행 삭제
    var delCheckedRows = function (table) {
        var $table = $(table);
        var rows = getCheckedRows($table);
        rows.remove();
        XFORM.multirow.remakeRowSeq($table); //행 시퀀스 새로고침
        events.afterRowRemoved();

        $table.find('.multi-row-select-all').eq(0).prop('checked', false);
        changeAutoSpan($table);
        if (mode() !== 'R' && typeof EASY === 'object') EASY.triggerFormChanged();
    }

    extension = {

        field: function () {

            $.fn.field = function (inputName, value) {
                //var index = 0;
                if (!window.console) console = { log: function () { } };
                if (typeof inputName !== "string") return false;

                //field name
                var $el;
                if ($('#' + inputName).length > 0) {
                    $el = $('#' + inputName);
                } else {
                    //field id
                    $el = $(this).find("[name=" + inputName + "]");
                }

                //checkbox : key && value match!!!
                if ($el.length === 0 || typeof $el === 'undefined') return;

                if ($el.attr("type") == "checkbox") {
                    /*
                    var c = [];
                    $.each($el, function(){
                    //console.log('***');
                    if( $(this).val() == value){
                    c.push($(this));
                    }
                    });
                    $el = c;
                    */
                }

                //get value
                if (typeof value === "undefined" && $el.length >= 1) {

                    if ($el.attr("type") == "checkbox") {
                        return $el.is(":checked");
                    } else if ($el.attr("type") == "radio") {
                        var result;
                        $.each($el, function (i, val) {
                            if ($(this).is(":checked")) result = $(this).val();
                        });
                        return result;
                    } else {
                        return $el.val();
                    }
                }

                //DIV, SPAN
                if ($el.tagName == 'DIV' || $el.tagName == 'SPAN') {
                    $el.text(value);
                    return $el;
                } else if ($el.tagName == 'SELECT') { //SELECT
                    $el.children('[value="' + value + '"]').prop('selected', true);
                    return $el;
                }

                if ($el.prop("type") == "checkbox") {
                    var v = ($.isArray(value)) ? value : [value];
                    if ($.inArray(v, $(this).val())) {
                        //if (window.console) console.log($(this).val());
                    }
                    //값이 일치하면 체크
                    $el.each(function (i) {
                        var fv = $(this).val();
                        if ($.inArray(fv, v)) {
                            $(this).prop({ "checked": true });
                        } else {
                            $(this).prop({ "checked": false });
                        }
                    });
                } else if ($el.prop("type") == "radio") {
                    $el.each(function (i) {
                        if ($(this).val() == value) {
                            $(this).prop({ "checked": true });
                            return;
                        }
                    });
                } else {
                    $el.val(value);
                }
                return $el;
            };

        },

        inJSON: function () {

            /*
            * $.inJSON utility
            *
            * Searches arbitrary JSON for a key and returns an array of all matches.
            * Intended for use with jQuery 1.4.2
            *
            * Copyright (c) 2010 Dan Connor
            * www.danconnor.com
            *
            * Dual-licensed under the MIT and GPL licenses:
            *   http://www.opensource.org/licenses/mit-license.php
            *   http://www.gnu.org/licenses/gpl.html
            */

            $.extend($, {
                inJSON: function (json, key) {
                    var hit, hits = [];
                    $.each(json, function (k, v) {
                        if (k === key)
                            hits.push(v);
                        if (typeof (v) === "string") {
                            return true;
                        } else if ($.isArray(v) || $.isPlainObject(v)) {
                            var r = $.inJSON(v, key);
                            if (r.length > 0)
                                hits = hits.concat(r);
                        }
                    });
                    return hits;
                }
            });
        },
        serialize: function () {

            $.fn.rowSerialize = function (c) {
                var json = {};
                var $tr = $(this);

                var $elems = $tr.children('td').children('input, select, textarea, span, div, table');
                var $elemOfContainer = $tr.children('td').children('.multi-row-container').find('input, select, textarea, span');
                var $elemAll = $elems.add($elemOfContainer);
                var $els;

                if (typeof c !== 'undefined') {
                    $els = $elemAll.not(c + ' *');
                } else {
                    $els = $elemAll;
                }

                $els.each(function () {
                    var val;
                    var elName = $(this).attr('name');
                    if (!elName) elName = $(this).attr('data-field');
                    if (!elName) return;

                    var tagname = this.tagName.toLowerCase();

                    if ('radio' === this.type) {
                        if (json[this.name]) { return; }

                        json[this.name] = this.checked ? this.value : '';
                    } else if ('checkbox' === this.type) {
                        val = json[this.name];

                        if (!this.checked) {
                            if (!val) { json[this.name] = ''; }
                        } else {
                            json[this.name] =
                              typeof val === 'string' ? [val, this.value] :
                            $.isArray(val) ? $.merge(val, [this.value]) :
                            this.value;
                        }
                    } else if ('span' === tagname || 'div' === tagname) {
                        //json[elName] = [];
                        json[elName] = $(this).text();
                    } else if ('table' === tagname) {
                        //json[elName] = [];
                        json[elName] = bodyToJson($(this));
                    } else {
                        val = json[this.name];
                        json[this.name] =
                            typeof val === 'string' ? [val, this.value] :
                          $.isArray(val) ? $.merge(val, [this.value]) :
                          this.value;
                    }
                });
                return json;
            };
        }
    };

    xmlToJson = function (xml) {
        // xml load 관련 오류 수정 2015.09.01 leesm
        if (xml == "") {
            return JSON.stringify(xml);
        }
        var x2js = new X2JS();
        var jsonObj = x2js.xml_str2json(xml);
        var json = JSON.stringify(jsonObj);
        return json;
    };

    var getOpt = function ($table) {
        var obj = {
            TemplateCount: getTemplateRowCount($table)
        }
        return obj;
    }

    //bmt-jwk: step 4 - 대량 데이터 로드 처리
    var bulk = function (data, $table) {

        // options.superload
        // 0 : 기본 조회모드(클래스/스타일 유지, 템플릿 사용) 
        // 1 : 속도개선 모드(클래스/스타일 제거, 템플릿 사용), 
        // 2 : pure javascript 모드 (클래스/스타일 제거, 템플릿 미사용) => 데이터 기준으로 td 태그를 자동으로 붙여 html 생성

        //tempate array -> text
        var m = typeof options.superload !== 'undefined' && options.superload ? options.superload : 0; // 0 : 기본, 1: 템플릿의 클래스 제거

        var map = [];
        var tplHiddenData = [];
        var tpl = template.clone(false);
        tpl.removeClass('multi-row-template').addClass('multi-row')
        //template에 있는 no-required 클래스 제거
			.removeClass('no-required')
        //template에 있는 pattern-skip 클래스 제거
			.removeClass('pattern-skip')
			.show();
                

        // [2015-12-28 leesm] superload : 2일 때, 멀티로우 내에 hidden 데이터 있을 때 template tr에 해당 name 추가
        // Hidden이 1개일 때 : multi-row-hidden-data="TEST1"
        // Hidden이 2개 이상일 때 : multi-row-hidden-data="TEST1;TEST2;TEST3"
        if (m === 2) {
            if (tpl.attr("multi-row-hidden-data") != null && tpl.attr("multi-row-hidden-data").length > 0) {
                if (tpl.attr("multi-row-hidden-data").indexOf(";") > -1) {
                    tplHiddenData = tpl.attr("multi-row-hidden-data").split(";");
                }
                else {
                    tplHiddenData[0] = tpl.attr("multi-row-hidden-data");
                }
            }
        }

        if (m === 1) {
            tpl.removeAttr('class').removeAttr('style');
            $('td', tpl).removeAttr('style');
        }

        
        // [2015-12-24 leesm] multi-row-seq 제외 시키고 치환
        $('span[name][class!=multi-row-seq]', tpl).each(function (i) {
            var that = $(this);
            map.push($(this).attr('name'));
            if (m === 0) {
                that.closest('td').find("span").html('{{' + $(this).attr('name') + '}}');
            } else {
                that.html('{{' + $(this).attr('name') + '}}');
            }
        });


        //$('input[data-face-real]', tpl).each(function (i) {
        //    var face_for_name = $(this).attr('name');
        //    var $faces = $('[data-face-for]', tpl);
        //    $(this).after('{{}}');

        //    //value_array = $(this).val().split('|');
        //    //dataface.loadReadible($faces, value_array);
        //});
        $('[data-face-real]', tpl).each(function () {
            var face_for_name = $(this).attr('name');
            var $faces = $('[data-face-for=' + face_for_name + ']', tpl);
            var face_options = '';

            $faces.each(function () {
                if (face_options != '') {
                    face_options += '|';
                }
                face_options += $(this).val();
            });

            //$(this).data('face-options', face_options);
            $(this).attr('data-face-options', face_options);
            if (window.console) console.log(face_options);
            $(this).attr('data-face-name', $faces.eq(0).attr("name"));
            $(this).attr('data-face-type', $faces.eq(0).attr('type'));
            // $faces.remove();

        });

        var tpl_html = '', data_html = '';
        tpl.eq(0).addClass('fast-multi-row');
        for (var i = 0; i < tpl.length; i++) {
            tpl_html += tpl[i].outerHTML;
        }


        json = $.parseJSON(data);
        // [2015-12-30 leesm] 멀티로우 데이터가 1줄일 때 json.length undefined 리턴와서 첫번 째 배열 생성
        if (json.length == undefined) {
            var tmp = json;
            json = [];
            json[0] = tmp;
        }
        
        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js bulk1"));


        //sample : [{"PRJCT_CD":"PRJCT_CD1","PRJCT_NM":"PRJCT_NM1","BIZNO":"BIZNO1","CONM":"CONM1","GB_NM":"GB_NM1","MPIA_AMT":"1000"}, --- ]
        var r = [];
        if (m === 2) {
            for (var j = 0; j < json.length; j++) {
                var t = '';
                for (var key in json[j]) {
                    if ($.inArray(key, tplHiddenData) == -1) {
                        t += '<td>' + json[j][key] + '</td>';
                    }
                }
                data_html += '<tr>' + t + '</tr>';
            }
        } else {
            for (var j = 0; j < json.length; j++) {
                var t = tpl_html;
                var d = "";
                // [2015-12-28 leesm] 넘어온 Json 데이터가 없을 때 null 처리 되는 문제 수정
                for (var key in json[j]) {
                    var re = new RegExp('{{' + key + '}}', 'g');
                    if (json[j][key] == null) {
                        d = "";
                    }
                    else {
                        d = json[j][key];
                    }
                    t = t.replace(re, d);
                }
                // data_html += '<tr>' + t + '</tr>';
                data_html += t;
            }

            // 행 추가시 추가 이벤트    
            // 한번에 추가 되므로 아래 함수 의미 없음 (장용욱)
            // events.afterRowAdded($(data_html));
        }

        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js bulk2"));

        var $new_tpl = $(data_html);

        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js bulk3"));

        $('[data-face-real]', $new_tpl).each(function () {
            var $faces = $(this).closest("td");
            var options = $(this).data().faceOptions;
            var options_arr = options.split('|');
            var name = $(this).data().faceName;
            var tag_type = $(this).data().faceType;
            var fv = $(this).text();

            $.each($faces.find('input[name=' + name + ']'), function () {
                var chk, unchk;
                if (tag_type == 'radio') {
                    chk = '<span class="radio-checked">●</span>';
                    unchk = '<span class="radio-unchecked">○</span>';
                } else if (tag_type == 'checkbox') {
                    chk = '<span class="checkbox-checked">■</span>';
                    unchk = '<span class="checkbox-unchecked">□</span>';
                }

                if (fv.indexOf("{{") > -1 && fv.indexOf("}}") > -1) {
                    $(this).replaceWith(unchk).show();
                } else if ($.inArray($(this).val(), fv) > -1) {
                    $(this).replaceWith(chk).show();
                } else {
                    $(this).replaceWith(unchk).show();
                }
            });
        });

        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js bulk4"));

        template.last().after($new_tpl);

        //if (window.console) console.log(fn_TimeStamp("xeasy.multirow.0.9.js bulk5"));


    }

    return {
        init: init,
        load: load,
        mode: mode,
        clear: clear,
        loadTable: loadTable,
        getdata: getdata,
        setdata: setdata,
        xmlToJson: xmlToJson,
        data: data,
        event: event,
        addRow: addRow,
        delRow: delRow,
        clearRow: clearRow,
        setRow: setRow,
        setValue: setValue, //bmt-jwk: step 3 - 필드 값 바인드
        fastload: fastload, //bmt-jwk: step 4 - 대량 데이터 로드
        remakeRowSeq: remakeRowSeq, //행 시퀀스 갱신 
        getCheckedRows: getCheckedRows, //체크된 행 집합 반환
        delCheckedRows: delCheckedRows, //체크된 행 삭제
        getAllRows: getAllRows,  //모든 데이터 행 중 최상위행 집합(템플릿 제외) 반환
        getOpt: getOpt //테이블 옵션
    };
}());

/* x2js : xml to json */
/*
Copyright 2011-2013 Abdulla Abdurakhmanov
Original sources are available at https://code.google.com/p/x2js/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function X2JS(config) {
    'use strict';

    var VERSION = "1.1.5";

    config = config || {};
    initConfigDefaults();
    initRequiredPolyfills();

    function initConfigDefaults() {
        if (config.escapeMode === undefined) {
            config.escapeMode = true;
        }
        config.attributePrefix = config.attributePrefix || "_";
        config.arrayAccessForm = config.arrayAccessForm || "none";
        config.emptyNodeForm = config.emptyNodeForm || "text";
        if (config.enableToStringFunc === undefined) {
            config.enableToStringFunc = true;
        }
        config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];
        if (config.skipEmptyTextNodesForObj === undefined) {
            config.skipEmptyTextNodesForObj = true;
        }
        if (config.stripWhitespaces === undefined) {
            config.stripWhitespaces = true;
        }
        config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
    }

    var DOMNodeTypes = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9
    };

    function initRequiredPolyfills() {
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }
        // Hello IE8-
        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () {
                return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
            };
        }
        if (typeof Date.prototype.toISOString !== 'function') {
            // Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
            Date.prototype.toISOString = function () {
                return this.getUTCFullYear()
                  + '-' + pad(this.getUTCMonth() + 1)
                  + '-' + pad(this.getUTCDate())
                  + 'T' + pad(this.getUTCHours())
                  + ':' + pad(this.getUTCMinutes())
                  + ':' + pad(this.getUTCSeconds())
                  + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                  + 'Z';
            };
        }
    }

    function getNodeLocalName(node) {
        var nodeLocalName = node.localName;
        if (nodeLocalName == null) // Yeah, this is IE!! 
            nodeLocalName = node.baseName;
        if (nodeLocalName == null || nodeLocalName == "") // =="" is IE too
            nodeLocalName = node.nodeName;
        return nodeLocalName;
    }

    function getNodePrefix(node) {
        return node.prefix;
    }

    function escapeXmlChars(str) {
        if (typeof (str) == "string")
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
        else
            return str;
    }

    function unescapeXmlChars(str) {
        return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '\/');
    }

    function toArrayAccessForm(obj, childName, path) {
        switch (config.arrayAccessForm) {
            case "property":
                if (!(obj[childName] instanceof Array))
                    obj[childName + "_asArray"] = [obj[childName]];
                else
                    obj[childName + "_asArray"] = obj[childName];
                break;
                /*case "none":
                break;*/
        }

        if (!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
            var idx = 0;
            for (; idx < config.arrayAccessFormPaths.length; idx++) {
                var arrayPath = config.arrayAccessFormPaths[idx];
                if (typeof arrayPath === "string") {
                    if (arrayPath == path)
                        break;
                }
                else
                    if (arrayPath instanceof RegExp) {
                        if (arrayPath.test(path))
                            break;
                    }
                    else
                        if (typeof arrayPath === "function") {
                            if (arrayPath(obj, childName, path))
                                break;
                        }
            }
            if (idx != config.arrayAccessFormPaths.length) {
                obj[childName] = [obj[childName]];
            }
        }
    }

    function fromXmlDateTime(prop) {
        // Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
        // Improved to support full spec and optional parts
        var bits = prop.split(/[-T:+Z]/g);

        var d = new Date(bits[0], bits[1] - 1, bits[2]);
        var secondBits = bits[5].split("\.");
        d.setHours(bits[3], bits[4], secondBits[0]);
        if (secondBits.length > 1)
            d.setMilliseconds(secondBits[1]);

        // Get supplied time zone offset in minutes
        if (bits[6] && bits[7]) {
            var offsetMinutes = bits[6] * 60 + Number(bits[7]);
            var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';

            // Apply the sign
            offsetMinutes = 0 + (sign == '-' ? -1 * offsetMinutes : offsetMinutes);

            // Apply offset and local timezone
            d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
        }
        else
            if (prop.indexOf("Z", prop.length - 1) !== -1) {
                d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
            }

        // d is now a local time equivalent to the supplied time
        return d;
    }

    function checkFromXmlDateTimePaths(value, childName, fullPath) {
        if (config.datetimeAccessFormPaths.length > 0) {
            var path = fullPath.split("\.#")[0];
            var idx = 0;
            for (; idx < config.datetimeAccessFormPaths.length; idx++) {
                var dtPath = config.datetimeAccessFormPaths[idx];
                if (typeof dtPath === "string") {
                    if (dtPath == path)
                        break;
                }
                else
                    if (dtPath instanceof RegExp) {
                        if (dtPath.test(path))
                            break;
                    }
                    else
                        if (typeof dtPath === "function") {
                            if (dtPath(obj, childName, path))
                                break;
                        }
            }
            if (idx != config.datetimeAccessFormPaths.length) {
                return fromXmlDateTime(value);
            }
            else
                return value;
        }
        else
            return value;
    }

    function parseDOMChildren(node, path) {
        if (node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
            var result = new Object;
            var nodeChildren = node.childNodes;
            // Alternative for firstElementChild which is not supported in some environments
            for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                var child = nodeChildren.item(cidx);
                if (child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                    var childName = getNodeLocalName(child);
                    result[childName] = parseDOMChildren(child, childName);
                }
            }
            return result;
        }
        else
            if (node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                var result = new Object;
                result.__cnt = 0;

                var nodeChildren = node.childNodes;

                // Children nodes
                for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                    var child = nodeChildren.item(cidx); // nodeChildren[cidx];
                    var childName = getNodeLocalName(child);

                    if (child.nodeType != DOMNodeTypes.COMMENT_NODE) {
                        result.__cnt++;
                        if (result[childName] == null) {
                            result[childName] = parseDOMChildren(child, path + "." + childName);
                            toArrayAccessForm(result, childName, path + "." + childName);
                        }
                        else {
                            if (result[childName] != null) {
                                if (!(result[childName] instanceof Array)) {
                                    result[childName] = [result[childName]];
                                    toArrayAccessForm(result, childName, path + "." + childName);
                                }
                            }
                            (result[childName])[result[childName].length] = parseDOMChildren(child, path + "." + childName);
                        }
                    }
                }

                // Attributes
                for (var aidx = 0; aidx < node.attributes.length; aidx++) {
                    var attr = node.attributes.item(aidx); // [aidx];
                    result.__cnt++;
                    result[config.attributePrefix + attr.name] = attr.value;
                }

                // Node namespace prefix
                var nodePrefix = getNodePrefix(node);
                if (nodePrefix != null && nodePrefix != "") {
                    result.__cnt++;
                    result.__prefix = nodePrefix;
                }

                if (result["#text"] != null) {
                    result.__text = result["#text"];
                    if (result.__text instanceof Array) {
                        result.__text = result.__text.join("\n");
                    }
                    if (config.escapeMode)
                        result.__text = unescapeXmlChars(result.__text);
                    if (config.stripWhitespaces)
                        result.__text = result.__text.trim();
                    delete result["#text"];
                    if (config.arrayAccessForm == "property")
                        delete result["#text_asArray"];
                    result.__text = checkFromXmlDateTimePaths(result.__text, childName, path + "." + childName);
                }
                if (result["#cdata-section"] != null) {
                    result.__cdata = result["#cdata-section"];
                    delete result["#cdata-section"];
                    if (config.arrayAccessForm == "property")
                        delete result["#cdata-section_asArray"];
                }

                if (result.__cnt == 1 && result.__text != null) {
                    result = result.__text;
                }
                else
                    if (result.__cnt == 0 && config.emptyNodeForm == "text") {
                        result = '';
                    }
                    else
                        if (result.__cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
                            if ((config.stripWhitespaces && result.__text == "") || (result.__text.trim() == "")) {
                                delete result.__text;
                            }
                        }
                delete result.__cnt;

                if (config.enableToStringFunc && (result.__text != null || result.__cdata != null)) {
                    result.toString = function () {
                        return (this.__text != null ? this.__text : '') + (this.__cdata != null ? this.__cdata : '');
                    };
                }

                return result;
            }
            else
                if (node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
                    return node.nodeValue;
                }
    }

    function startTag(jsonObj, element, attrList, closed) {
        var resultStr = "<" + ((jsonObj != null && jsonObj.__prefix != null) ? (jsonObj.__prefix + ":") : "") + element;
        if (attrList != null) {
            for (var aidx = 0; aidx < attrList.length; aidx++) {
                var attrName = attrList[aidx];
                var attrVal = jsonObj[attrName];
                if (config.escapeMode)
                    attrVal = escapeXmlChars(attrVal);
                resultStr += " " + attrName.substr(config.attributePrefix.length) + "='" + attrVal + "'";
            }
        }
        if (!closed)
            resultStr += ">";
        else
            resultStr += "/>";
        return resultStr;
    }

    function endTag(jsonObj, elementName) {
        return "</" + (jsonObj.__prefix != null ? (jsonObj.__prefix + ":") : "") + elementName + ">";
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function jsonXmlSpecialElem(jsonObj, jsonObjField) {
        if ((config.arrayAccessForm == "property" && endsWith(jsonObjField.toString(), ("_asArray")))
				|| jsonObjField.toString().indexOf(config.attributePrefix) == 0
				|| jsonObjField.toString().indexOf("__") == 0
				|| (jsonObj[jsonObjField] instanceof Function))
            return true;
        else
            return false;
    }

    function jsonXmlElemCount(jsonObj) {
        var elementsCnt = 0;
        if (jsonObj instanceof Object) {
            for (var it in jsonObj) {
                if (jsonXmlSpecialElem(jsonObj, it))
                    continue;
                elementsCnt++;
            }
        }
        return elementsCnt;
    }

    function parseJSONAttributes(jsonObj) {
        var attrList = [];
        if (jsonObj instanceof Object) {
            for (var ait in jsonObj) {
                if (ait.toString().indexOf("__") == -1 && ait.toString().indexOf(config.attributePrefix) == 0) {
                    attrList.push(ait);
                }
            }
        }
        return attrList;
    }

    function parseJSONTextAttrs(jsonTxtObj) {
        var result = "";

        if (jsonTxtObj.__cdata != null) {
            result += "<![CDATA[" + jsonTxtObj.__cdata + "]]>";
        }

        if (jsonTxtObj.__text != null) {
            if (config.escapeMode)
                result += escapeXmlChars(jsonTxtObj.__text);
            else
                result += jsonTxtObj.__text;
        }
        return result;
    }

    function parseJSONTextObject(jsonTxtObj) {
        var result = "";

        if (jsonTxtObj instanceof Object) {
            result += parseJSONTextAttrs(jsonTxtObj);
        }
        else
            if (jsonTxtObj != null) {
                if (config.escapeMode)
                    result += escapeXmlChars(jsonTxtObj);
                else
                    result += jsonTxtObj;
            }

        return result;
    }

    function parseJSONArray(jsonArrRoot, jsonArrObj, attrList) {
        var result = "";
        if (jsonArrRoot.length == 0) {
            result += startTag(jsonArrRoot, jsonArrObj, attrList, true);
        }
        else {
            for (var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
                result += startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
                result += parseJSONObject(jsonArrRoot[arIdx]);
                result += endTag(jsonArrRoot[arIdx], jsonArrObj);
            }
        }
        return result;
    }

    function parseJSONObject(jsonObj) {
        var result = "";

        var elementsCnt = jsonXmlElemCount(jsonObj);

        if (elementsCnt > 0) {
            for (var it in jsonObj) {

                if (jsonXmlSpecialElem(jsonObj, it))
                    continue;

                var subObj = jsonObj[it];

                var attrList = parseJSONAttributes(subObj);

                if (subObj == null || subObj == undefined) {
                    result += startTag(subObj, it, attrList, true);
                }
                else
                    if (subObj instanceof Object) {

                        if (subObj instanceof Array) {
                            result += parseJSONArray(subObj, it, attrList);
                        }
                        else if (subObj instanceof Date) {
                            result += startTag(subObj, it, attrList, false);
                            result += subObj.toISOString();
                            result += endTag(subObj, it);
                        }
                        else {
                            var subObjElementsCnt = jsonXmlElemCount(subObj);
                            if (subObjElementsCnt > 0 || subObj.__text != null || subObj.__cdata != null) {
                                result += startTag(subObj, it, attrList, false);
                                result += parseJSONObject(subObj);
                                result += endTag(subObj, it);
                            }
                            else {
                                result += startTag(subObj, it, attrList, true);
                            }
                        }
                    }
                    else {
                        result += startTag(subObj, it, attrList, false);
                        result += parseJSONTextObject(subObj);
                        result += endTag(subObj, it);
                    }
            }
        }
        result += parseJSONTextObject(jsonObj);

        return result;
    }

    this.parseXmlString = function (xmlDocStr) {
        var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
        if (xmlDocStr === undefined) {
            return null;
        }
        var xmlDoc;
        if (window.DOMParser) {
            var parser = new window.DOMParser();
            var parsererrorNS = null;
            // IE9+ now is here
            if (!isIEParser) {
                try {
                    parsererrorNS = parser.parseFromString("INVALID", "text/xml").childNodes[0].namespaceURI;
                }
                catch (err) {
                    parsererrorNS = null;
                }
            }
            try {
                xmlDoc = parser.parseFromString(xmlDocStr, "text/xml");
                if (parsererrorNS != null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
                    //throw new Error('Error parsing XML: '+xmlDocStr);
                    xmlDoc = null;
                }
            }
            catch (err) {
                xmlDoc = null;
            }
        }
        else {
            // IE :(
            if (xmlDocStr.indexOf("<?") == 0) {
                xmlDocStr = xmlDocStr.substr(xmlDocStr.indexOf("?>") + 2);
            }
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlDocStr);
        }
        return xmlDoc;
    };

    this.asArray = function (prop) {
        if (prop instanceof Array)
            return prop;
        else
            return [prop];
    };

    this.toXmlDateTime = function (dt) {
        if (dt instanceof Date)
            return dt.toISOString();
        else
            if (typeof (dt) === 'number')
                return new Date(dt).toISOString();
            else
                return null;
    };

    this.asDateTime = function (prop) {
        if (typeof (prop) == "string") {
            return fromXmlDateTime(prop);
        }
        else
            return prop;
    };

    this.xml2json = function (xmlDoc) {
        return parseDOMChildren(xmlDoc);
    };

    this.xml_str2json = function (xmlDocStr) {
        var xmlDoc = this.parseXmlString(xmlDocStr);
        if (xmlDoc != null)
            return this.xml2json(xmlDoc);
        else
            return null;
    };

    this.json2xml_str = function (jsonObj) {
        return parseJSONObject(jsonObj);
    };

    this.json2xml = function (jsonObj) {
        var xmlDocStr = this.json2xml_str(jsonObj);
        return this.parseXmlString(xmlDocStr);
    };

    this.getVersion = function () {
        return VERSION;
    };

}

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
                r = (i < 0) ? 0 : s.substring(i); //.replace('+',''),
            var v = s.substring(0, s.indexOf('n'));
            var arr = [];


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
    }
});

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
};

//bmt-jwk : step 3 - 템플릿 복제와 데이터 바인드를 결합
$.fn.duplicate = function (template, count, data, cloneEvents) {    
    var tmp = [];
    var view_mode = XFORM.multirow.mode();
    //템플릿을 복제하면서 증가하는 순번에 해당하는 데이터를 찾아 바인드

    for (var x = 0; x < count; x++) {
        var $els = template.clone(cloneEvents);
        //
        //if ($els.find('[data-face-real]').length > 0) {
        //    $els.find('[data-face-real]').attr('data-face-real', '');
        //}


        var $field = $('input, textarea, span, select', $els);
        // span 태그 아래 a 태그로 되어 있는 것 제외 not('span:has(>a)') 추가 (장용욱_20160511)
        // span 태그 name 으로 data-type='rField' 추가 (장용욱_20160512)
        var $field_notCheckedAndRadio = $field.not('input:checkbox').not('input:radio').not('span:has(>a)').not("span:has[data-type='rField']");
        if ($field_notCheckedAndRadio.length === 0) return;

        //읽기 모드 패턴 처리
        if (view_mode === 'R') {
            for (var y = 0; y < $field_notCheckedAndRadio.length; y++) {
                var fieldname = $field_notCheckedAndRadio.eq(y).attr("name");
                //console.log(fieldname, data[x][fieldname]);
                //$field_notCheckedAndRadio.eq(y).text(replaceLineBreak(data[x][fieldname]));
                XFORM.multirow.setValue($field_notCheckedAndRadio.eq(y), data[x][fieldname]);
            }

            // if (!$field.is(':visible')) return;
            //currency 패턴에 대한 추가 처리(패턴 부여 & 우측 정렬)
            if ($field.data() && $(this).data().pattern && (typeof $(this).data().faceReal !== 'undefined')) {
                var p = $(this).data().pattern;
                var o = $(this).convertTagTo('span');
                o.removeClass('pattern-active')
					.removeAttr('required')
					.removeClass('input-required');

                //numeral은 우측 정렬
                if (p == 'numeral') {
                    o.css('text-align', 'right');
                }
                //span에 있는 우측정렬 속성이 적용되도록 하기 위해, block 설정
                if (o.css('text-align') == 'right') {
                    o.css('display', 'inline-block');
                }
            }
        }
        else {
            for (var y = 0; y < $field_notCheckedAndRadio.length; y++) {                
                var fieldname = $field_notCheckedAndRadio.eq(y).attr("name");
                XFORM.multirow.setValue($field_notCheckedAndRadio.eq(y), data[x][fieldname]);
            }
        }

        $.merge(tmp, $els);
    }

    return this.pushStack(tmp);

    function replaceLineBreak(s) {
        //null 처리 추가. 2014.07.21. KJW
        if (s === undefined || s == null) return '';
        return s.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
};