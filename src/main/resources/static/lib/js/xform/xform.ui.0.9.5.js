/* revision
16.06.01 속성 팝업 취소 버튼 추가

*/

//캔버스 상단의 툴바(undeo, redo, duplicate...)에 대한 기능 정의
XFORM.menu = (function () {
    var init,
        initToolbar,
        bindToolbarDraggable,
        bindTableEvent,
        getFirstTable,
        toggleTableMode,
        bindMenuEvent;

    init = function () {

        initToolbar();

        //bindTableEvent();

        bindMenuEvent();

        //bindToolbarDraggable();

    };

    initToolbar = function () {
        //all hover and click logic for buttons
        $(".fg-button:not(.ui-state-disabled)")
        .hover(
             function () {
                 $(this).addClass("ui-state-hover");
             },
             function () {
                 $(this).removeClass("ui-state-hover");
             }
        )
        .mousedown(function () {
            $(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
            if ($(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active')) { $(this).removeClass("ui-state-active"); }
            else { $(this).addClass("ui-state-active"); }
        })
        .mouseup(function () {
            if (!$(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button')) {
                $(this).removeClass("ui-state-active");
            }
        });

    }

    bindToolbarDraggable = function () {
        $('#toolbars_panel').addClass('toolbars_panel_drag');
        $('#toolbars_panel').draggable({ handle: '.handle' });
    };

    bindTableEvent = function () {
        /*-----------------------------------------
          Initialize : Canvas Editing Menu
        ------------------------------------------*/
        //table editing mode
        $('.edit-table').bind('click', function () {

            var tbl = getFirstTable();

            //선택된 테이블 없으면, 첫번째 테이블 자동 선택
            if (XFORM.form.selectedId() == '') {
                XFORM.form.containerSelected(tbl);
                //return;
            }

            toggleTableMode($(this));


        });
    };
    //return : first table object or null
    getFirstTable = function () {
        var tbl = $('#canvas').find('table').first();

        if (typeof tbl === 'undefined') {
            if (confirm('캔버스에 추가된 테이블이 없습니다. \n테이블을 추가하시겠습니까?')) {
                $('[data-field="table"]').find('.add-canvas').click();
                tbl = $('#canvas').find('table').first();
            } else {
                return null;
            }
        }

        return tbl;
    };

    toggleTableMode = function (el) {
        var $el = el;
        if ($el.is(':checked')) {
            XFORM.form.tableEditMode('element');
        } else {
            XFORM.form.tableEditMode('layout');
        }
    }

    bindMenuEvent = function () {

        //table job option
        //$('[name=table_option]').bind('click', function () { XFORM.form.tableMode($(this).val()); });
        //element undo
        $('.element-undo').bind('click', function () { XFORM.storage.historyBack(); });
        //redo
        $('.element-redo').bind('click', function () { XFORM.storage.historyForward(); });
        //explicit temporary saving
        $('.element-temporary').bind('click', function () { XFORM.storage.tempSave('e', 'default'); });
        //history button
        $('.element-history').bind('click', function () { $('#version_tracer').toggle(); });
        //magic button
        $('.element-magic').bind('click', function () { XFORM.form.magic.show(); });
        //create new
        $('.element-new').bind('click', function () {
            if (confirm('Are you sure that you remove all elements on the canvas?')) {
                $('#canvas *').unbind().remove();
            }
        });
        //save to server
        $('.element-save').bind('click', function () {
            //if (confirm('template을 서버에 적용합니다')) {
            //    $("#if_convert").attr("src", "xsource.html");
            //}

            if (confirm('캔버스를 서버에 적용합니다')) {
                $("#if_convert").attr("src", "/approval/resources/script/xform/xsource.html");
            }


            //window.open('xsource.html', '', 'top=0,left=150,width=790,height=700');
        });
        $('.element-copy').bind('click', function () { XFORM.form.copy(); });
        $('.element-cut').bind('click', function () { XFORM.form.cut(); });
        $('.element-paste').bind('click', function () { XFORM.form.paste(); });
        $('.element-duplicate').bind('click', function () { XFORM.form.duplicate(); });
        $('.element-delete').bind('click', function () { XFORM.form.del(); });
        $('.element-quit').bind('click', function () { XFORM.form.quit(); });
        //table editing mode
        $('.element-table').bind('click', function () { event.stopPropagation(); XFORM.form.toggleTableEdit(); });
        //toogle container or element mode
        $('.element-container').bind('click', function () {
            if (window.console) {
            	//console.log(XFORM.form.selectMode());
            }
            if (XFORM.form.selectMode() == 'container') {
                XFORM.form.selectMode('element');
            } else {
                XFORM.form.selectMode('container');
            }
        });
        //view current source code
        $('.element-code').bind('click', function () { XFORM.form.viewCode(); });
        //edit element attributes 
        $('.element-edit').bind('click', function () { XFORM.form.elementModal(); });
        $('.container-edit').bind('click', function () { XFORM.form.elementModal('container'); });
        $('.container-code').bind('click', function () { XFORM.form.viewCode('container'); });
        $('.container-copy').bind('click', function () { XFORM.form.copy('container'); });
        $('.container-duplicate').bind('click', function () { XFORM.form.duplicate('container'); });
        $('.container-cut').bind('click', function () { XFORM.form.cut('container'); });
        $('.container-paste').bind('click', function () { XFORM.form.paste('container'); });
        $('.container-delete').bind('click', function () { XFORM.form.del('container'); });

        /*----------------------------- 
            menu tooltip 
        -------------------------------*/
        $('.tooltip').tooltipster();

        /* css tool */
        $('.css-tool-copy').bind('click', function () { XFORM.form.duplicate(); });
        $('.css-tool-trash').bind('click', function () { XFORM.form.del(); });
        $('.css-tool-gear').bind('click', function () { XFORM.form.elementModal(); });
        $('.css-tool-disk').bind('click', function () { XFORM.storage.tempSave('e', 'default'); });
        $('.css-tool-info').bind('click', function () { XFORM.form.viewCode(); });
        $('.css-tool-close').bind('click', function () {
            XFORM.form.elementPanel.hide();
            //contentEditable('', false); 
        });

    };

    return {
        init: init
    };

}());

//캔버스 상단의 추가 옵션에 대한 정의(다중선택, 개체 하이라이트)
XFORM.viewmode = (function () {
    var init,
        bindModeEvent,
        bindOptionEvent,
        mode,
        showLiveView;

    init = function () {

        bindModeEvent();

        bindOptionEvent();
    };

    bindOptionEvent = function () {
        //Drag & Select Range
        $('.multi-select').bind('click', function () {
            //alert( $(this).is(':checked'));
            if ($(this).is(':checked')) {
                $('#canvas').selectable({ filter: '.sortable-container, .sortable, p, div, h1, h2, h3, input' });
            } else {
                $('#canvas').selectable('destroy');
            }
        });

        $('.element-highlight').bind('click', function () {
            /*
            if ($(this).is(':checked')) {
                $('#canvas * ').addClass('outline-highlight');
            } else {
                $('#canvas * ').removeClass('outline-highlight');
            }*/
            if ($(this).is(':checked')) {
                $('#canvas table').addClass('outline-highlight');
                $('#canvas div').addClass('outline-highlight-div');
            } else {
                $('#canvas table').removeClass('outline-highlight');
                $('#canvas div').removeClass('outline-highlight-div');
            }

        });

    };

    bindModeEvent = function () {

        /*-----------------------------
          Initialize : Canvas Mode
        ------------------------------*/
        $('#view_mode > li').click(function () {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        });

        //bind view-mode event 
        $('#design_view').bind('click', function () { mode('design'); });
        $('#code_view').bind('click', function () { mode('code'); });
        $('#origin_view').bind('click', function () { mode('origin'); });
        $('#live_view').bind('click', function () { mode('live'); });
    };

    //view mode
    mode = function (p_mode) {

        $('#view_mode > li > a').removeClass('select');

        if (p_mode == 'design') {

            $('#toolbars_panel').show();
            $('.view-mode').hide();
            $('#canvas').show();
            $('#design_view').addClass('select');
            return;
        } else {
            if (XFORM.form.statTablePanel()) XFORM.form.toggleTableEdit();
        }

        if (p_mode == 'code') {
            XFORM.form.showHtmlCode();
            $('#toolbars_panel').hide();
            $('.view-mode').hide();
            $('#codeview').show();
            $('#code_view').addClass('select');
            return;
        }

        if (p_mode == 'origin') {
            $('#toolbars_panel').hide();
            $('.view-mode').hide();
            $('#originview').show();
            $('#origin_view').addClass('select');

            if (!XFORM.form.showOriginalCode()) {
                alert('원본 파일이 존재하지 않습니다');
                return;
            }
        }

        if (p_mode == 'live') {
            showLiveView();
            return;
        }

    }

    /*-----------------------------------------
    function : Canvas Top Menu
    ------------------------------------------*/
    showLiveView = function () {
        var formid = getFormId();
        var baseurl;

	    baseurl = '/approval/approval_Form.do';

        var url = baseurl + '?' + 'formID=' + formid + '&mode=DRAFT';
        window.open(url, '', 'top=0,left=150,width=790,height=700');

    };

    return {
        init: init,
        mode: mode
    };

}());

//저장 버튼(수정된 내용을 양식에 반영하는 버튼)의 동작에 대한 정의
XFORM.savefile = (function () {
    var init,
        bindListen,
        receiveConvertMessage,
        saveTemplateFile;

    init = function () {

        bindConvertListener();

    };

    bindConvertListener = function () {
        //listen event if canvas is successfully converted for saving
        addEventListener("message", receiveConvertMessage, false);
    };


    //check if canvas data is converted for saving
    receiveConvertMessage = function (event) {

        if (event.data == 'OK') {

            var c = $("#if_convert").contents().find("#xform_contents").val();

            var form_content;
            form_content = c;
            
            // [2016-02-24 leesm] script 저장 내용 가져오기
            var d = $("#if_convert").contents().find("#xform_contents_js").val();
            var js_form_content = d;

            var filename = $('#hidFilename').val();

            // [2016-02-24 leesm] jsfilename 추가
            var jsfilename = $('#hidJsFilename').val();
            if (filename == '') {
                alert('등록되지 않은 템플릿으로 저장할 수 없습니다');
                return;
            }
            saveTemplateFile(filename, jsfilename, form_content, js_form_content, function (result) {

                if (result) {
                    alert('정상적으로 저장되었습니다');
                } else {
                    alert('템플릿이 정상적으로 저장되지 못했습니다.');
                }
            });
        } else {
            // alert('데이터 변환에 실패하였습니다');
            XFORM.form.showStatus('데이터 변환에 실패하였습니다');
        }
    }

    // [2016-02-24 leesm] js 불러오기 작업으로 인한 수정
    saveTemplateFile = function (filename, jsfilename, form_content, js_form_content, callback) { //g_template_version
    	$.ajax({
            type: "POST",
            async: false,
            url: "xform/createFormFile.do",
            data: {
            	"htmlFileName" : filename,
            	"jsFileName" : jsfilename,
            	"htmlFileContent" : form_content,
            	"jsFileContent" : js_form_content
            },
            success: function (data) {
                if(data.result=="ok" ){
	            	if(data.htmlResult=="ERROR" || data.jsResult=="ERROR"){
	            		 alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
	                     return;
	            	}
	            	return callback(true);	         
                }
            },
            error: function (error) {
            	//에러 처리 필요
            	alert("xform.ui.0.9.5.js 402줄 에러"+error);
            	return false;
            }
        });
    }

    return {
        init: init
    };

}());

//템플릿 리스트, 로드 관련 기능
XFORM.template = (function () {
    var init,
        //템플릿 로드
        initView,
        loadTemplateList,
        templateId,
        loadCurrent,
        loadTemplate,
        reload,
        getFormInfo,
        setFormInfo,
        getfile,
        bindTemplateRow,
        loadToCanvas,
        dispBlock,
        wrapBlock,
        //템플릿 저장
        bindListen,
        receiveConvertMessage,
        saveTemplateFile;

    init = function () {

        loadTemplateList();
        bindTemplateRow();
        initView();
        bindConvertListener();

        //load requested template on load
        var load_ok = loadCurrent();

    };

    initView = function () {
        $('#form_load_source').hide(); //???? unused
    };

    loadTemplateList = function () {
        /*-----------------------------------------
          Initialize : Load Template List
        ------------------------------------------*/

        //create template list table and bind event
        if ($('#hidFormList').val() != '') {
            var tbl_body = "";
            var data = jQuery.parseJSON($('#hidFormList').val());
            var form_name, file_name, form_id, form_version;
            var tbl_row = '';
            var version_prefix = 'template-version-';

            //create template list tr
            // [2016-02-24 leesm] JsFileName 추가
            for (var i = 0; data.length > i; i++) {
                form_name = data[i].FormName;
                file_name = data[i].FileName;
                form_id = data[i].FormID;
                form_version = data[i].Revision;
                js_form_name = data[i].FileName.replace(".html",".js") //기존양식을 사용할 js 파일명이 prefix_version 으로 지정된 파일이 없는 문제 수정

                //[16-11-16] 이연재, 자바 버전 변경과정 수정
                tbl_row += '<tr><td style="text-align:left;"><span class="template-file ' + version_prefix + 'new" data-file-name="' + file_name + '" data-js-file-name="' + js_form_name + '" data-form-id="' + form_id + '"  data-form-name="' + form_name + '" data-form-version=new><b>' + form_name + '</b> <span>' + file_name + '</span></span></td></tr>';
                /*if (form_version == 'new') // [16-04-15] kimhs, 통합양식만 불러오도록 수정
                {
                tbl_row += '<tr><td style="text-align:left;"><span class="template-file ' + version_prefix + form_version + '" data-file-name="' + file_name + '" data-js-file-name="' + js_form_name + '" data-form-id="' + form_id + '"  data-form-name="' + form_name + '" data-form-version="' + form_version + '">' + form_name + ' <span>' + file_name + '</span></span></td></tr>';
                }*/

            }
            //append template list
            $("#template_list table tbody").html(tbl_row);

        }
    };
    //현재 양식 id
    templateId = function () {
        return $('#hidFormId').val();
    };

    loadCurrent = function () {
        //get template id
        var id = templateId();
        if (id == null || id == '') return false;

        loadTemplate(id);
        return true;
    };

    loadTemplate = function (id) {

        var info = getFormInfo(id);

        //save in hidden field
        setFormInfo(info);

        //read template content
        // [2016-02-24 leesm] info.jsfilename 추가
        getfile(info.filename, info.jsfilename, info.formname, info.formversion);
    };

    reload = function () {
        // [2016-02-24 leesm] s_jsfilename 추가
        var id = templateId(),
            s_filename = $('#hidFilename').val(),
            s_jsfilename = $('#hidJsFilename').val(),
            s_formname = $('#hidFormname').val(),
        s_formversion = $('#hidFormversion').val();
        //read template content
        getfile(s_filename, s_jsfilename, s_formname, s_formversion);
    }

    // [2016-02-24 leesm] jsfilename 추가
    getFormInfo = function (id) {
        if (typeof id === 'undefined') return false;

        var filename = '',
            jsfilename = '',
            formname = '',
            formversion = '',
            result = {},
            found = false;

        $('.template-file').each(function () {
            if ($(this).data().formId == id) {
                filename = $(this).data().fileName;
                jsfilename = $(this).data().jsFileName;
                formname = $(this).data().formName;
                formversion = $(this).data().formVersion;
                found = true;
                return;
            }
        });

        if (found) {
            result.formid = id;
            result.filename = filename;
            result.jsfilename = jsfilename;
            result.formname = formname;
            result.formversion = formversion;
        }

        return result;
    };

    // [2016-02-24 leesm] jsfilename 추가
    setFormInfo = function (r) {
        $('#hidFilename').val(r.filename);
        $('#hidJsFilename').val(r.jsfilename);
        $('#hidFormname').val(r.formname);
        $('#hidFormversion').val(r.formversion);
    };

    // [2016-02-24 leesm] jsfilename 추가
    //양식을 AJAX로 로드
    getfile = function (filename, jsfilename, formname, formversion) {
        if (formversion == 'dead') {
            alertTimeout('존재하지 않는 파일입니다.');
            return false;
        }
        var form_content = "";
        var js_form_content = "";
        var ver = (typeof formversion !== 'undefined') ? formversion : g_template_version;
        
        $.ajax({
            type: "POST",
            async: false,
            url: "xform/getFormFile.do",
            data: {
            	"htmlFileName" : filename,
            	"jsFileName" : jsfilename,
            	"fileVersion" : formversion
            },
            success: function (data) {
                if(data.result=="ok" ){
	            	if(data.htmlStr=="ERROR" || data.jsStr=="ERROR"){
	            		//alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
	                    alertTimeout('파일이 존재하지 않습니다.');
	
	                    // 파일 로드 실패 시 제목을 공백으로 하고 저장버튼 가리기 (20160513 장용욱)
	                    $('.xform-file-name').text('');
	                    $('.xform-form-name').text('');
	                    $('.element-save').css('display','none');
	                    
	                    return;
	            	}
	            	
	            	form_content = data.htmlStr.replace(/\r\n/g, '\n');
	            	js_form_content = data.jsStr.replace(/\r\n/g, '\n');
	
	                loadToCanvas(formname, form_content, js_form_content);
	                XFORM.form.selectMode('default');
	                XFORM.viewmode.mode('design');
	                XFORM.form.containerSelectable($('#canvas .sortable-container').eq(0)); // [16-05-19] kimhs, selectMode가 실행되면서 첫번째 div에 click event가 사라져 추가..
	
	                $('.xform-file-name').text(filename);
	                $('.xform-form-name').text(formname);
                }
            },
            error: function (error) {
            	//에러 처리 필요
            	alert("xform.ui.0.9.5.js 589줄 에러"+error);
            }
        });
    };

    //양식 목록에서 특정 양식 선택
    // [2016-02-24 leesm]  jsfilename 추가
    bindTemplateRow = function () {
        //bind click event on template row
        var filename, formname;
        $('.template-file').click(function () {
            $('#loader').show();
            var filename = $(this).data().fileName;
            var jsfilename = $(this).data().jsFileName;
            var formname = $(this).data().formName;
            var formid = $(this).data().formId;
            var formversion = $(this).data().formVersion;

            //get content of a template file [AJAX]
            getfile(filename, jsfilename, formname, formversion);

            //save template meta data in hidden field
            $('#hidFilename').val(filename);
            $('#hidJsFilename').val(jsfilename);
            $('#hidFormname').val(formname);
            $('#hidFormId').val(formid);
            $('#hidFormVersion').val(formversion);

            //reload editing history tracer
            XFORM.storage.reDraw();

            setTimeout("$('#loader').hide();", 300);

            // 저장버튼 보이기 (20160513 장용욱)
            $('.element-save').css('display', '');
        });
    };
    //메시지 팝업을 표시하고, 일정시간(1초) 지나면 자동으로 닫힘
    var alertTimeout = function (msg) {

        $('#loader').hide();

        var o = $('#alerts');
        o.html(msg).show();

        setTimeout(function () {
            o.hide();
        }, 1000);
    }
    /*-----------------------------------------
      function : load template to canvas
    ------------------------------------------*/
    //양식 HTML 데이터를 캔버스에 로드
    loadToCanvas = function (formname, fcontent, js_fcontent) {

        var s = fcontent;
        s = s.replace(/\\\"/g, '"');
        s = s.replace(/\\t/g, '');

        //remove script 
        var stringOfHtml = s;
        var noScript = stringOfHtml.replace(/\<script/g, "<NOSCRIPT");
        noScript = noScript.replace(/\/script/g, "/NOSCRIPT");

        //script block
        s = noScript;
        $('#form_load_source').empty().val(s);
        $('#canvas').empty().html(s);
        $('#canvas_js').empty().val(js_fcontent);

        $('noscript').each(function () {

            if (!$(this).parent().hasClass('xform-script-block')) {

                if ($(this).attr('src') != null && $(this).attr('src').indexOf('WebEditor') > -1) {
                    wrapBlock($(this), '{Web Editor Block}');
                } else {
                    wrapBlock($(this), '{Script Block}');
                }
            }

        });
        //approval line
        var $o;
        if ($('#bodytable_content')) {
            $o = $('#bodytable_content').children().first();
            $o.hide().wrap('<div class="xform-header-block" style="display:block; border: dashed 1px #555; padding: 5px; margin: 5px 0; text-align: center; font-weight: bold; font-size: 14px;"></div>');
            $o.before('<p class="xform xform-remove-this" style="font-weight: bold; ">{Approval Line Block}</p>');
            $o = $o.parent();
        } else {
            $o = $('<span id="fake_approval_line" />').prepend('#canvas');
        }

        //id명을 td에 표시(개발편의상)
        dispBlock($o.next()); //문서분류
        dispBlock($o.next().next()); //수신처
        dispBlock($o.next().next().next()); //참조

        //table convert
        var $table = $('#canvas').find('table');
        $table.addClass('sortable');
        //
        XFORM.form.containerDroppable($table, 'table');
        //
        XFORM.form.containerSelectable($table, 'table'); //??

        //if table has no id, add ID
        XFORM.form.addTableId();

        $o.before($('<div id="xform_header_seperator"><p class="xform xform-remove-this" style="font-weight: bold; ">{Header Seperator}</p></div>'));
        $o.unwrap();

        var $div = $('#canvas').find('div'); // [16-05-18] kimhs, 기존 children()을 사용하여 직계 자식만 가져옴, find()로 바꿔주어 하위 div도 sortable-container 클래스가 추가되도록 함
        $div.addClass('sortable-container');
        XFORM.form.containerDroppable($div, 'container');
        XFORM.form.containerSelectable($div); //??

        //2014.06.13 라디오, 체크박스의 옵션 수정을 위해 상위 개체에 클래스 추가
        $('#canvas').find('input:radio').each(function () {
            var $parent = $(this).parent();
            if (!$parent.hasClass('xform-radio')) $parent.addClass('xform-radio');
        });

        // [2016-04-21 leesm] radio와 checkbox class 분리
        $('#canvas').find('input:checkbox').each(function () {
            var $parent = $(this).parent();
            if (!$parent.hasClass('xform-checkbox')) $parent.addClass('xform-checkbox');
        });

        //enable element click
        XFORM.form.elementSelectable();

        //true: 편집모드  false: 드래그 모드
        //XFORM.form.initContentEditable(false);
        XFORM.form.canvasMode.init('move');

    };

    dispBlock = function (el) {
        //old version에서 td에 있는 id 값을 개발편의상 표시하기 위함
        if (g_template_version != 'old') return;

        var $el = el;
        $el.find('td, th').each(function () {
            if (typeof $(this).prop('id') !== 'undefined')
                $(this).text($(this).prop('id'));
        });
    }
    wrapBlock = function (el, title) {
        var $el = el;
        $el.hide().wrap('<div class="xform-script-block" style="display:block; border: dashed 1px #555; padding: 5px; text-align: center; font-weight: bold; font-size: 14px;"></div>');
        $el.before('<p class="xform xform-remove-this" style="font-weight: bold; ">' + title + '</p>');
    }

    bindConvertListener = function () {
        //listen event if canvas is successfully converted for saving
        addEventListener("message", receiveConvertMessage, false);
    };

    //check if canvas data is converted for saving
    receiveConvertMessage = function (event) {

        if (event.data == 'OK') {

            var c = $("#if_convert").contents().find("#xform_contents").val();

            var form_content;
            form_content = c;

            // [2016-02-24 leesm] script 저장 내용 가져오기
            var d = $("#if_convert").contents().find("#xform_contents_js").val();
            var js_form_content = d;

            var filename = $('#hidFilename').val();
            var jsfilename = $('#hidJsFilename').val();
            if (filename == '') {
                alert('등록되지 않은 템플릿으로 저장할 수 없습니다');
                return;
            }
            saveTemplateFile(filename, jsfilename, form_content, js_form_content, function (result) {

                if (result) {
                    alert('정상적으로 저장되었습니다');
                } else {
                    alert('템플릿이 정상적으로 저장되지 못했습니다.');
                }
            });
        } else {
            // alert('데이터 변환에 실패하였습니다');
            XFORM.form.showStatus('데이터 변환에 실패하였습니다');
        }
    }

    // [2016-02-24 leesm] js 편집 내용 저장을 위해 js_form_content 파라미터 추가
    saveTemplateFile = function (filename, jsfilename, form_content, js_form_content, callback) { //g_template_version
    	$.ajax({
            type: "POST",
            async: false,
            url: "xform/createFormFile.do",
            data: {
            	"htmlFileName" : filename,
            	"jsFileName" : jsfilename,
            	"htmlFileContent" : form_content,
            	"jsFileContent" : js_form_content
            },
            success: function (data) {
                if(data.result=="ok" ){
	            	if(data.htmlResult=="ERROR" || data.jsResult=="ERROR"){
	            		 alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
	                     return;
	            	}
	            	return callback(true);	         
                }
            },
            error: function (error) {
            	//에러 처리 필요
            	alert("xform.ui.0.9.5.js 837줄 에러"+error);
            	return false;
            }
        });
    }

    return {
        init: init,
        loadToCanvas: loadToCanvas,
        reload: reload
    };

}());

//개체상자의 +버튼을 이용한 캔버스내 개체 추가 이벤트 바인딩
XFORM.droppable = (function () {
    var init,
        bindAdd;

    init = function () {
        bindAdd();

        // [2016-03-04 leesm] 클립보드 복사 기능 추가
        bindClip();
    };

    bindAdd = function () {
        //initialize toolbox add button
        $('.add-canvas, .add-block').click(function (event) {
            event.stopPropagation();            
            XFORM.form.draw($(this));
        });
    }

    // [2016-02-22 leesm] 개선된 xform 추가
    bindClip = function () {
        //initialize toolbox add button
        $('.add-clip').click(function (event) {
            event.stopPropagation();

            var el_type = $(this).parent().attr('data-field');
            //get html
            var shtml = XFORM.form.getElementHtml(el_type);
            var $obj = $(shtml).appendTo('#clipboard');

            XFORM.form.copy($obj);
        });
    }

    return {
        init: init
    };

}());

//캔버스 화면에서 오른 클릭하면 뜨는 팝업메뉴
XFORM.context = (function () {
    var init,
        initLeft;

    init = function () {

        initMenu();

    };

    initMenu = function () {
        /*----------------------------- 
            context menu 
        -------------------------------*/
        //canvas body
        $.contextMenu({
            selector: '#canvas',
            callback: function (key, options) {
                switch (key) {
                    case 'code':
                        $('.element-code').click();
                        break;
                    case 'paste':
                        // [16-05-18] kimhs, canvas에서 우클릭 후 paste 시 붙여넣기 되지 않아 수정
                        XFORM.form.paste('', 'append');

                        //if ($(this).hasClass('table-container')) {
                        //    $('.container-paste').click();
                        //} else if ($(this).hasClass('div-container')) {
                        //    $('.element-paste').click();
                        //}
                        break;
                    case 'quit': // [16-04-07] kimhs, 포커스 벗어나기
                        $('.element-quit').click();
                        break;
                }
            },
            items: {
                "code": { name: "Show Code", icon: "code" },
                "paste": { name: "Paste", icon: "paste" },
                "sep1": "---------",
                "quit": { name: "Quit", icon: "quit" }
            }
        });

        //canvas element
        $.contextMenu({
            // [2016-02-22 leesm] xform 개선 추가
            selector: '#canvas input, #canvas select, #canvas textarea, #canvas h1, #canvas a, #canvas label, #canvas img',
            callback: function (key, options) {
                //var m = "clicked: " + key;
                //window.console && console.log(m) || alert(m); 
                switch (key) {
                    case 'code':
                        $('.element-code').click();
                        break;
                    case 'copy':
                        $('.element-copy').click();
                        break;
                    case 'cut':
                        $('.element-cut').click();
                        break;
                    case 'paste':
                        $('.element-paste').click();
                        break;
                    case 'edit':
                        $('.element-edit').click();
                        break;
                    case 'delete':
                        $('.object-delete').click();
                        break;
                    case 'setings':
                        XFORM.form.elementModal();
                        break;
                    case 'quit': // [16-04-07] kimhs, 포커스 벗어나기
                        $('.element-quit').click();
                        break;
                }
            },
            items: {
                "code": { name: "Show Code", icon: "code" },
                "edit": { name: "Edit", icon: "edit" },
                "sep0": "---------",
                "edit": { name: "Edit", icon: "edit" },
                "copy": { name: "Copy", icon: "copy" },
                "cut": { name: "Cut", icon: "cut" },
                "paste": { name: "Paste after", icon: "paste" },
                "paste_inner": { name: "Paste inner", icon: "paste" },
                "delete": { name: "Delete", icon: "delete" },
                "sep1": "---------",
                "quit": { name: "Quit", icon: "quit" }
            }
        });

        //TABLE
        $.contextMenu({
            selector: '#container_panel .table-container',
            trigger: 'left',
            callback: function (key, options) {
                switch (key) {
                    case 'table':
                        $('.element-table').click();
                        break;
                    case 'duplicate':
                        $('.container-duplicate').click();
                        break;
                    case 'copy':
                        $('.container-copy').click();
                        break;
                    case 'cut':
                        $('.container-cut').click();
                        break;
                    case 'paste':
                        $('.container-paste').click();
                        break;
                    case 'delete':
                        $('.container-delete').click();
                        break;
                    case 'code':
                        if (window.console) {
                        	//console.log($(this).prop('class'));
                        }
                        $('.container-code').click();
                        break;
                    case 'edit':
                        // [2016-02-22 leesm] xform 개선 추가
                        $('.container-edit').click();
                        break;
                    case 'quit': // [16-04-07] kimhs, 포커스 벗어나기
                        $('.element-quit').click();
                        break;
                }
            },
            items: {
                "code": { name: "Show Code", icon: "code" },
                "edit": { name: "Edit", icon: "edit" },
                "sep0": "---------",
                "table": { name: "Edit Table", icon: "table" },
                "duplicate": { name: "Duplicate", icon: "copy" },
                "copy": { name: "Copy", icon: "copy" },
                "cut": { name: "Cut", icon: "cut" },
                "paste": { name: "Paste after", icon: "paste" },
                "delete": { name: "Delete", icon: "delete" },
                "sep1": "---------",

                "quit": { name: "Quit", icon: "quit" }
            }
        });

        //DIV 
        $.contextMenu({
            selector: '#container_panel .div-container',
            trigger: 'hover',
            callback: function (key, options) {
                switch (key) {
                    case 'duplicate':
                        XFORM.form.duplicate();
                        break;
                    case 'copy':
                        XFORM.form.copy();
                        break;
                    case 'cut':
                        XFORM.form.cut();
                        break;
                    case 'paste':
                        XFORM.form.paste();
                        break;
                    case 'delete':
                        XFORM.form.del();
                        break;
                    case 'code':
                        XFORM.form.viewCode();
                        break;
                    case 'edit':
                        // [2016-02-22 leesm] xform 개선 추가
                        $('.element-edit').click();
                        break;
                    case 'quit': // [16-04-07] kimhs, 포커스 벗어나기
                        $('.element-quit').click();
                        break;
                }
            },
            items: {
                "duplicate": { name: "Duplicate", icon: "copy" },
                "copy": { name: "Copy", icon: "copy" },
                "cut": { name: "Cut", icon: "cut" },
                "paste": { name: "Paste after", icon: "paste" },
                "delete": { name: "Delete", icon: "delete" },
                "sep1": "---------",
                "code": { name: "Show Code", icon: "code" },

                // [2016-02-22 leesm] xform 개선 추가
                "edit": { name: "Edit", icon: "edit" },

                "sep0": "---------",
                "quit": { name: "Quit", icon: "quit" }
            }
        });



        //canvas table
        $.contextMenu({
            selector: '#canvas table',
            callback: function (key, options) {

                switch (key) {
                    case 'table':
                        $('.element-table').click();
                        break;
                    case 'rowsncols':
                        $('#table_design').click();
                        break;

                    case 'merge':
                        $('.cell-merge').click();
                        break;
                    case 'split-v':
                        $('.cell-split-v').click();
                        break;
                    case 'split-h':
                        $('.cell-split-h').click();
                        break;
                    case 'copy':
                        $('.element-copy').click();
                        break;
                    case 'paste_inner':
                        XFORM.form.paste('', 'append');
                        break;
                    case 'delete':
                        $('.object-delete').click();
                        break;
                    case 'code':
                        $('.element-code').click();
                        break;
                    case 'edit':
                        $('.element-edit').click();
                        break;
                    case 'edit_table':
                        $('.container-edit').click();
                        break;
                    case 'quit': // [16-04-07] kimhs, 포커스 벗어나기
                        $('.element-quit').click();
                        break;

                }
            },
            events: {
                show: function (opt) {

                    var $this = this;

                },
                hide: function (opt) {
                }
            },
            items: {
                "code": { name: "Code", icon: "code" },
                "sep0": "---------",
                "edit": { name: "Edit", icon: "edit" },
                "copy": { name: "Copy", icon: "copy" },
                "paste_inner": { name: "Paste", icon: "paste" },
                "delete": { name: "Delete", icon: "delete" },
                "sep1": "---------",
                "table": {
                    name: "Edit Table",
                    icon: "table",
                    disabled: function (key, opt) {
                        return (XFORM.form.tableEditMode().toUpperCase() == 'TABLE');
                    }
                },
                "merge": {
                    name: "Merge",
                    icon: "merge",
                    disabled: function (key, opt) {
                        return (XFORM.form.tableEditMode().toUpperCase() != 'TABLE');
                    }
                },
                "sep2": "---------",
                "split-v": {
                    name: "Split Vertically",
                    icon: "split-v",
                    disabled: function (key, opt) {
                        return (XFORM.form.tableEditMode().toUpperCase() != 'TABLE');
                    }
                },
                "split-h": {
                    name: "Split Horizontally",
                    icon: "split-h",
                    disabled: function (key, opt) {
                        return (XFORM.form.tableEditMode().toUpperCase() != 'TABLE');
                    }
                },

                "sep3": "---------",
                "quit": { name: "Quit", icon: "quit" }
            }
        });

        //canvas div
        // [2016-03-04 leesm] 클립보드 복사기능 - div 내에 붙혀넣기 할 때 div 밖에 붙혀넣어져서 수정함
        $.contextMenu({
            selector: '#canvas div',
            callback: function (key, options) {

                switch (key) {
                    case 'duplicate':
                        XFORM.form.duplicate();
                        break;
                    case 'copy':
                        XFORM.form.copy();
                        break;
                    case 'cut':
                        XFORM.form.cut();
                        break;
                    case 'paste_inner':
                        XFORM.form.paste('', 'append');
                        break;
                    case 'delete':
                        XFORM.form.del();
                        break;
                    case 'code':
                        XFORM.form.viewCode();
                        break;
                    case 'edit':
                        $('.element-edit').click();
                        break;
                }
            },
            events: {
                show: function (opt) {

                    var $this = this;

                },
                hide: function (opt) {
                }
            },
            items: {
                "code": { name: "Code", icon: "code" },
                "edit": { name: "Edit", icon: "edit" },
                "copy": { name: "Copy", icon: "copy" },
                "paste_inner": { name: "Paste", icon: "paste" }
            }
        });
    };

    return {
        init: init
    };

}());

//캔버스의 개체 추가에 대한 이벤트 바인딩
XFORM.canvas = (function () {
    var init,
        changed,
        dropped,
        added,
        listenChangeOnCanvas;

    init = function () {
        //캔버스 변경내용 Listen & 임시 저장
        listenChangeOnCanvas();
    };

    changed = function () {
        //when block or element is dropped, evoke event
        $.event.trigger({
            type: "changedOnCanvas",
            message: "attributes of element changed",
            time: new Date()
        });
    };

    dropped = function () {
        //when block or element is dropped, evoke event
        $.event.trigger({
            type: "droppedOnCanvas",
            message: "drag and dropped",
            time: new Date()
        });
    };

    added = function () {
        //when block or element is dropped, evoke event
        $.event.trigger({
            type: "addedOnCanvas",
            message: "new element added",
            time: new Date()
        });
    };

    //캔버스 개체 추가/변경시 임시저장 - 단, 레이블 수정은 이벤트 발생안됨
    listenChangeOnCanvas = function () {
        $(document).on("droppedOnCanvas", function (evt) {
            if (window.console) {
            	//console.log(evt.time.toLocaleString() + ": " + evt.message);
            }
            XFORM.storage.tempSave();
        });

        $(document).on("addedOnCanvas", function (evt) {
            if (window.console) {
            	//console.log(evt.time.toLocaleString() + ": " + evt.message);
            }
            XFORM.storage.tempSave();
        });
        //캔버스 개체 변경
        $(document).on("changedOnCanvas", function (evt) {
            if (window.console) {
            	//console.log(evt.time.toLocaleString() + ": " + evt.message);
            }
            //컨테이너 패널 등 표시여부
            XFORM.form.canvasRefresh();
            //임시저장
            XFORM.storage.tempSave();
        });
    };

    return {
        init: init,
        changed: changed,
        dropped: dropped,
        added: added
    };
}());

//메인화면의 레이아웃 초기화
XFORM.layout = (function () {
    var init,
        initView,
        initLeft,
        initTop,
        initRight;

    init = function () {
        initView();

        initLeft();

        initTop();

        initRight();
    };

    initView = function () {

        /*-----------------------------
          Initialize : Layout View Status
        ------------------------------*/
        //hide templates for default
        $('#template_list').hide();
        $('#template_list2').hide();

        //set default view of toolbar 
        if ($.cookie('layoutbar') == 0) {
            toggleToolbar('layout_tool');
        }

        if ($.cookie("elementbar") == 0) {
            toggleToolbar('element_tool');
        }

        if ($.cookie("quickbar") == 0) {
            toggleToolbar('quick_tool');
        }

        if ($.cookie("property") == 0) {
            rightPanel.hide();
        }

        //toggle tool name bar
        function toggleToolbar(toolname) {
            var o = $('#' + toolname);

            o.prev().toggle('blind', 300);
            o.toggle('blind', 300);
        }
    }
    fitHeight = function (div) {
        $(window).resize(function () {
            adjustHeight(div);
        });

        function adjustHeight(div) {
            $(div).height($(window).height() - 60);
        }

    }

    initLeft = function () {
        /*-----------------------------
          Initialize : Toolbox Layout
        ------------------------------*/
        fitHeight('#template_list');
        fitHeight('#template_list2');

        $('#toolbox').click(function () {
            $('#header ul.tab li a').removeClass('active');
            $(this).addClass('active');

            $('#template_list').hide();
            $('#template_list2').hide();
            $('#tools_panel').show();

            rightPanel.hide();              //속성보기
            codePanel.hide();		        //소스편집
            templatelinkPanel.hide();	    //템플릿
            ViewlinkPanel.hide();		    //조회연동
            WritelinkPanel.hide();		    //저장연동

            // 체크박스별 uncheck 처리 (장용욱:20160318)
            $('.show-right-panel').prop('checked', false);      //속성보기
            $('.code-edit').prop('checked', false);             //소스편집
            $('.show-template-panel').prop('checked', false);   //템플릿
            $('.show-viewlink-panel').prop('checked', false);   //조회연동
            $('.show-writelink-panel').prop('checked', false);  //저장연동
        });

        $('#templates').click(function () {
            g_template_version = 'new';

            $('#header ul.tab li a').removeClass('active');
            $(this).addClass('active');

            $('#tools_panel').hide();
            $('#template_list2').hide();
            $('#template_list').show();

            rightPanel.hide();              //속성보기
            codePanel.hide();		        //소스편집
            templatelinkPanel.hide();	    //템플릿
            ViewlinkPanel.hide();		    //조회연동
            WritelinkPanel.hide();		    //저장연동

            // 체크박스별 uncheck 처리 (장용욱:20160318)
            $('.show-right-panel').prop('checked', false);      //속성보기
            $('.code-edit').prop('checked', false);             //소스편집
            $('.show-template-panel').prop('checked', false);   //템플릿
            $('.show-viewlink-panel').prop('checked', false);   //조회연동
            $('.show-writelink-panel').prop('checked', false);  //저장연동
        });

        $('#templates2').click(function () {
            g_template_version = 'new';

            $('#header ul.tab li a').removeClass('active');
            $(this).addClass('active');

            $('#tools_panel').hide();
            $('#template_list').hide();
            $('#template_list2').show();
        });


        //initialize toggling of toolbar 
        $('.tools-toggle').click(function () {
            var o = $(this);
            var pre_stat = o.next().css("display");
            var tool_name;
            if (o.hasClass('layout')) {
                tool_name = 'layoutbar';
            } else if (o.hasClass('element')) {
                tool_name = 'elementbar';
            } else if (o.hasClass('quick')) {
                tool_name = 'quickbar';
            }

            o.next().toggle('blind', 300);
            o.next().next().toggle('blind', 300);

            if (pre_stat == 'none') {
                $.cookie(tool_name, 1);
            } else {
                $.cookie(tool_name, 0);
            }

        });

        //toggle preview of toolbox
        $('div.toolbox li').click(function () {
            var o = $(this);
            if (o.next().find('.preview-area').length < 1) return;
            var field_type = o.data().field;
            var tpl_field = $('#template').find('[data-field="' + field_type + '"]');
            var tpl = tpl_field.html();
            var info = tpl_field.data() ? tpl_field.data().info : '';

            o.next().find('.preview-desc').html(info);
            o.next().find('.preview-area').html(tpl);
            o.next().toggle('blind', 300);
        });

    }

    initTop = function () {
        /*-----------------------------
          Initialize : Top Layout
        ------------------------------*/
        //check full screen
        if ($.cookie("fullscreen") == 1) {
            $('#header_up a').removeClass('btn_close').addClass('btn_open');
            rightPanel.hide();
            $('#header').toggle('blind', 300);
        }

        $('#header_up a').bind('click', function () {
            if ($(this).hasClass('btn_open')) {
                $.cookie("fullscreen", 0);
                $(this).removeClass('btn_open').addClass('btn_close');

                if ($('.show-right-panel').is(':checked')) {
                    rightPanel.show();
                }
            } else {
                $.cookie("fullscreen", 1);
                //mode to full screen
                $(this).removeClass('btn_close').addClass('btn_open');
                if ($('.show-right-panel').is(':checked')) {
                    rightPanel.hide();
                }
            }
            $('#header').toggle('blind', 300);
        });
    };

    initRight = function () {
        /*-----------------------------
          Initialize : Right Layout
        ------------------------------*/

        // 쿠키정보 처리 주석. (장용욱:20160318)
        //if ($.cookie('property') == 1) {
        //    $('.show-right-panel').prop('checked', true);
        //    rightPanel.show();
        //} else {
        //    rightPanel.hide();
        //}
        $('div.colleft').css('margin-right', '0'); // 기본 354px;

        //check full screen
        if ($.cookie("fullscreen") == 1) {
            rightPanel.hide();
        }

        $('.show-right-panel').bind('click', function () {
            if ($(this).is(':checked')) {
                rightPanel.show();
                // 쿠키정보 처리 주석. (장용욱:20160318)
                //$.cookie('property', 1);
            } else {
                rightPanel.hide();
                // 쿠키정보 처리 주석. (장용욱:20160318)
                //$.cookie('property', 0);
            }
        });

        // XForm 고도화-조회연동. 체크박스 이벤트 추가. (장용욱:20160310)        
        $('.show-viewlink-panel').bind('click', function () {
            if ($(this).is(':checked')) {
                ViewlinkPanel.show();
            } else {
                ViewlinkPanel.hide();
            }
        });

        // XForm 고도화-저장연동. 체크박스 이벤트 추가. (장용욱:20160321)        
        $('.show-writelink-panel').bind('click', function () {
            if ($(this).is(':checked')) {
                WritelinkPanel.show();
            } else {
                WritelinkPanel.hide();
            }
        });

        // XForm 고도화-조회연동. 연동구분 선택 이벤트 추가. (장용욱:20160310)
        $('.viewlink-type').unbind('change').bind('change', function () {

            if ($('.viewlink-type').val() == "D") {

                $('.viewlink-type-database').show();
                $('.viewlink-type-webservice').hide();
                $('.viewlink-type-sap').hide();

            } else if ($('.viewlink-type').val() == "W") {

                $('.viewlink-type-database').hide();
                $('.viewlink-type-webservice').show();
                $('.viewlink-type-sap').hide();

            } else if ($('.viewlink-type').val() == "S") {

                $('.viewlink-type-database').hide();
                $('.viewlink-type-webservice').hide();
                $('.viewlink-type-sap').show();

                var strHtml = "";
                var options = "";
                strHtml += "<li class='draggable-item ui-draggable' data-field='viewlink_s_text' data-connect='' data-table='' data-map=''>";
                strHtml += "<img class='ico_img drag-handle' src='img/ico_textbox.png'>";
                strHtml += "<span class='drag-handle'><input type='text' id='viewlink-tool-sap-column' value='컬럼아이디'></span>";
                strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='img/ico_copy.png'></a>";
                strHtml += "<a class='btn_add viewlink-sap-add-block' href='javascript: void(0);'><img src='img/ico_add.old.png'></a>";
                strHtml += "</li>";
                // 컬럼목록 바인딩
                $('#viewlink-tool-sap').find("ul").html(strHtml);

                // 클립보드 복사 기능
                XFORM.linkage.bindClip_ViewLink();

                // 드래그 기능
                $('#viewlink-sap-ul li:not(.element-preview)').addClass('draggable-item');
                $('#viewlink-sap-ul li:not(.element-preview)').draggable({
                    connectToSortable: '.sortable td, .sortable-container',
                    revert: 'invalid',
                    handle: ".drag-handle",
                    helper: function () {
                        var helper = $(this).clone();
                        helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
                        return helper;
                    }
                });

                // 추가 버튼 클릭
                $('.viewlink-sap-add-block').click(function (event) {
                    event.stopPropagation();
                    XFORM.form.draw($(this));
                });
            }
        });

        // XForm 고도화-저장연동. 연동구분 선택 이벤트 추가. (장용욱:20160321)
        $('.writelink-type').unbind('change').bind('change', function () {

            if ($('.writelink-type').val() == "D") {

                $('.writelink-type-database').show();
                $('.writelink-type-webservice').hide();
                $('.writelink-type-sap').hide();

            } else if ($('.writelink-type').val() == "W") {

                $('.writelink-type-database').hide();
                $('.writelink-type-webservice').show();
                $('.writelink-type-sap').hide();

            } else if ($('.writelink-type').val() == "S") {

                $('.writelink-type-database').hide();
                $('.writelink-type-webservice').hide();
                $('.writelink-type-sap').show();
                
                var strHtml = "";
                var options = "";
                strHtml += "<li class='draggable-item ui-draggable' data-field='writelink_s_text' data-connect='' data-table='' data-map=''>";
                strHtml += "<img class='ico_img drag-handle' src='/approval/resources/images/xform/ico_textbox.png'>";
                strHtml += "<span class='drag-handle'><input type='text' id='writelink-tool-sap-column' value='컬럼아이디'></span>";
                strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_copy.png'></a>";
                strHtml += "<a class='btn_add writelink-sap-add-block' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_add.old.png'></a>";
                strHtml += "</li>";
                // 컬럼목록 바인딩
                $('#writelink-tool-sap').find("ul").html(strHtml);

                // 클립보드 복사 기능
                XFORM.linkage.bindClip_WriteLink();

                // 드래그 기능
                $('#writelink-sap-ul li:not(.element-preview)').addClass('draggable-item');
                $('#writelink-sap-ul li:not(.element-preview)').draggable({
                    connectToSortable: '.sortable td, .sortable-container',
                    revert: 'invalid',
                    handle: ".drag-handle",
                    helper: function () {
                        var helper = $(this).clone();
                        helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
                        return helper;
                    }
                });

                // 추가 버튼 클릭
                $('.writelink-sap-add-block').click(function (event) {
                    event.stopPropagation();
                    XFORM.form.draw($(this));
                });
            }
        });

        // XForm 고도화-조회연동. 데이터베이스 조회버튼 클릭 이벤트 추가. (장용욱:20160310)
        $('.viewlink-type-database-connect-button').bind('click', function () {
            XFORM.linkage.getDataTableList($('.viewlink-type-database-connect').val());
        });

        // XForm 고도화-조회연동. 웹서비스 조회버튼 클릭 이벤트 추가. (장용욱:20160410)
        $('.viewlink-type-webservice-connect-button').bind('click', function () {
            XFORM.linkage.getMethodList($('.viewlink-type-webservice-connect').val());
        });

        // XForm 고도화-저장연동. 데이터베이스 조회버튼 클릭 이벤트 추가. (장용욱:20160321)
        $('.writelink-type-database-connect-button').bind('click', function () {
            XFORM.linkage.getDataTableList($('.writelink-type-database-connect').val());
        });

        // XForm 고도화-저장연동. 웹서비스 조회버튼 클릭 이벤트 추가. (장용욱:20160420)
        $('.writelink-type-webservice-connect-button').bind('click', function () {
            XFORM.linkage.getMethodList($('.writelink-type-webservice-connect').val());
        });

        // XForm 고도화-조회연동. 테이블목록 선택 이벤트 추가. (장용욱:20160310)
        $('.viewlink-type-database-table').unbind('change').bind('change', function () {
            XFORM.linkage.getDataTableColumnList($('.viewlink-type-database-connect').val(), $('.viewlink-type-database-table').val());
        });

        // XForm 고도화-조회연동. 함수목록 선택 이벤트 추가. (장용욱:20160310)
        $('.viewlink-type-webservice-table').unbind('change').bind('change', function () {
            XFORM.linkage.getParamList($('.viewlink-type-webservice-connect').val(), $('.viewlink-type-webservice-table').val());
        });

        // XForm 고도화-저장연동. 테이블목록 선택 이벤트 추가. (장용욱:20160321)
        $('.writelink-type-database-table').unbind('change').bind('change', function () {
            XFORM.linkage.getDataTableColumnList($('.writelink-type-database-connect').val(), $('.writelink-type-database-table').val());
        });

        // XForm 고도화-저장연동. 함수목록 선택 이벤트 추가. (장용욱:20160310)
        $('.writelink-type-webservice-table').unbind('change').bind('change', function () {
            XFORM.linkage.getParamList($('.writelink-type-webservice-connect').val(), $('.writelink-type-webservice-table').val());
        });

        // [2016-03-23 leesm] 템플릿 추가
        $('.show-template-panel').bind('click', function () {
            if ($(this).is(':checked')) {
                templatelinkPanel.show();
                XFORM.templatelink.getTemplateList();
            } else {
                templatelinkPanel.hide();
            }
        });

        // [2016-03-24 leesm] 템플릿 저장버튼
        $('.templatelink-template-save').bind('click', function () {
            if (confirm("저장하시겠습니까?")) {
                XFORM.templatelink.setTemplateHtml($('#templatelink-template-name').val(), $('#canvas').html());
            }
        });
    };

    var rightPanel = {
        show: function () {
            // 체크박스별 uncheck 처리 (장용욱:20160318)
            $('.code-edit').prop('checked', false);             //소스편집
            $('.show-template-panel').prop('checked', false);   //템플릿
            $('.show-viewlink-panel').prop('checked', false);   //조회연동
            $('.show-writelink-panel').prop('checked', false);  //저장연동


            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '354px');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '5px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '20px');

            $('div.col1').hide();           //레이아웃툴
            $('div.col3').show();           //속성보기            
            $('div.col4').hide();           //조회연동
            $('div.col5').hide();           //저장연동
            $('div.col6').hide();           //템플릿
            $('#demotext_wrap').hide();     //소스편집
            // 에디터 2개 생기는 현상방지
            if (editor || js_editor) {
                editor.toTextArea();
                js_editor.toTextArea();
            }


            /*
            var max_width = 1550;
            //브라우저 너비가 1320픽셀 이하이면 왼쪽 패널을 표시할 공간이 없음
            if ($(window).width() < max_width) {
                leftPanel.hide();
            }

            $('div.colleft').css('margin-right', '354px');
            $('div.col3').show();
            $('.show-right-panel').prop('checked', true);
            $('div.col1').hide();

            this.status = 'show';

            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            $('div.col2 .layout_tab_box').css('margin-left', '5px');   
            */
        },
        hide: function () {
            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '0');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '316px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '0');

            $('div.col3').hide();   //속성보기
            $('div.col1').show();   //레이아웃툴

            /*
            $('div.colleft').css('margin-right', '0');
            $('div.col3').hide();
            
            var max_width = 1550;
            //브라우저 너비가 1320픽셀 이하이면 왼쪽 패널을 표시할 공간이 없음
            if ($(window).width() >= max_width) {
                leftPanel.show();
            }

            if (!($(".code-edit").is(":checked"))) {
                $('div.col1').show();
            }

            $('.show-right-panel').prop('checked', false);
            this.status = 'hide';

            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            $('div.col2 .layout_tab_box').css('margin-left', '316px');            
            */
        },
        width: function () {
            return $('div.col3').is(':visible') ? $('div.col3').width() : 0;
        },
        status: 'show'
    }

    // XForm 고도화-조회연동. Panel추가. (장용욱:20160310)
    var ViewlinkPanel = {
        show: function () {
            // 체크박스별 uncheck 처리 (장용욱:20160318)            
            $('.show-right-panel').prop('checked', false);          //속성보기
            $('.code-edit').prop('checked', false);                 //소스편집
            $('.show-template-panel').prop('checked', false);       //템플릿
            $('.show-writelink-panel').prop('checked', false);      //저장연동


            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '354px');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '5px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '20px');

            $('div.col1').hide();           //레이아웃툴
            $('div.col3').hide();           //속성보기            
            $('div.col4').show();           //조회연동
            $('div.col5').hide();           //저장연동
            $('div.col6').hide();           //템플릿
            $('#demotext_wrap').hide();     //소스편집
            // 에디터 2개 생기는 현상방지
            if (editor || js_editor) {
                editor.toTextArea();
                js_editor.toTextArea();
            }


            /*
            var max_width = 1550;
            //브라우저 너비가 1320픽셀 이하이면 왼쪽 패널을 표시할 공간이 없음
            if ($(window).width() < max_width) {
                leftPanel.hide();
            }

            $('div.colleft').css('margin-right', '354px');
            $('div.col4').show();
            $('.show-right-panel').prop('checked', true);
            $('div.col1').hide();

            this.status = 'show';

            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            $('div.col2 .layout_tab_box').css('margin-left', '5px');
            */
        },
        hide: function () {
            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '0');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '316px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '0');

            $('div.col4').hide();   //조회연동
            $('div.col1').show();   //레이아웃툴

            /*
            $('div.colleft').css('margin-right', '0');
            $('div.col4').hide();


            var max_width = 1550;
            //브라우저 너비가 1320픽셀 이하이면 왼쪽 패널을 표시할 공간이 없음
            if ($(window).width() >= max_width) {
                leftPanel.show();
            }

            if (!($(".code-edit").is(":checked"))) {
                $('div.col1').show();
            }

            $('.show-right-panel').prop('checked', false);
            this.status = 'hide';

            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            $('div.col2 .layout_tab_box').css('margin-left', '316px');
            */
        },
        width: function () {
            return $('div.col4').is(':visible') ? $('div.col4').width() : 0;
        },
        status: 'show'
    }

    // XForm 고도화-저장연동. Panel추가. (장용욱:20160321)
    var WritelinkPanel = {
        show: function () {
            // 체크박스별 uncheck 처리 (장용욱:20160318)            
            $('.show-right-panel').prop('checked', false);          //속성보기
            $('.code-edit').prop('checked', false);                 //소스편집
            $('.show-template-panel').prop('checked', false);       //템플릿
            $('.show-viewlink-panel').prop('checked', false);       //조회연동

            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '354px');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '5px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '20px');

            $('div.col1').hide();           //레이아웃툴
            $('div.col3').hide();           //속성보기            
            $('div.col4').hide();           //조회연동
            $('div.col5').show();           //저장연동
            $('#demotext_wrap').hide();     //소스편집
            // 에디터 2개 생기는 현상방지
            if (editor || js_editor) {
                editor.toTextArea();
                js_editor.toTextArea();
            }
        },
        hide: function () {
            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '0');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '316px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '0');

            $('div.col5').hide();   //저장연동
            $('div.col1').show();   //레이아웃툴            
        },
        width: function () {
            return $('div.col5').is(':visible') ? $('div.col5').width() : 0;
        },
        status: 'show'
    }

    // [2016-02-18 leesm] code mirror add
    var codePanel = {
        show: function () {
            // 체크박스별 uncheck 처리 (장용욱:20160318)
            $('.show-right-panel').prop('checked', false);      //속성보기
            $('.show-template-panel').prop('checked', false);   //템플릿
            $('.show-viewlink-panel').prop('checked', false);   //조회연동
            $('.show-writelink-panel').prop('checked', false);  //저장연동


            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '0');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '5px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '20px');

            $('div.col1').hide();           //레이아웃툴
            $('div.col3').hide();           //속성보기            
            $('div.col4').hide();           //조회연동            
            $('div.col5').hide();           //저장연동            
            $('div.col6').hide();           //템플릿

            // 소스편집
            $('#demotext_wrap').css('width', this.getWidth() + 'px').css('float', 'left').show();
            $('#demotext_wrap').css('height', '350px !important');
            $('#demotext_wrap .CodeMirror').css('height', '350px !important');

            /*
            if (this.status == 'show') return;

            this.panels.toggle('show');
            $('div.col1').hide();

            $('#demotext_wrap').css('width', this.getWidth() + 'px').css('float', 'left').show();
            $('#demotext_wrap').css('height', '350px !important');
            $('#demotext_wrap .CodeMirror').css('height', '350px !important');
            
            this.status = 'show';
            
            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            $('div.col2 .layout_tab_box').css('margin-left', '5px');            
            */
        },
        hide: function () {
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '316px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '0');

            $('div.col1').show();           //레이아웃툴
            $('div.col3').hide();           //속성보기            
            $('div.col4').hide();           //조회연동
            $('div.col5').hide();           //저장연동
            $('div.col6').hide();           //템플릿
            $('#demotext_wrap').hide();     //소스편집
            // 에디터 2개 생기는 현상방지
            if (editor || js_editor) {
                editor.toTextArea();
                js_editor.toTextArea();
            }

            /*
            $('#demotext_wrap').hide();
            $('div.col1').show();
            
            this.status = 'hide';
            this.panels.toggle('hide');
            
            // [2016-02-22 leesm] edit code 선택 취소 시 좌측 Toolbox 안나와서 추가함
            $('div.col2 .layout_tab_box').css('margin-left', '316px');            
            */
        },
        getWidth: function () { //코드 패널의 예상폭
            return $(window).width() - 150 - (leftPanel.width() + rightPanel.width() + $('#canvas').width());
        },
        panels: {
            status: {
                left: '',
                right: ''
            },
            toggle: function (show_or_not) {
                /*
                if (show_or_not === 'show') {
                    if (rightPanel.status === 'show' && codePanel.getWidth() < 400) {
                        this.status.right = 'hide';
                        rightPanel.hide();
                    }

                    if (leftPanel.status === 'show' && codePanel.getWidth() < 600) {
                        this.status.left = 'hide';
                        leftPanel.hide();
                    }
                } else {
                    if (this.status.left === 'hide') leftPanel.show();
                    if (this.status.right === 'hide') rightPanel.show();
                }
                */
            }
        }
    }

    // [2016-03-23 leesm] 템플릿 add
    var templatelinkPanel = {
        show: function () {
            // 체크박스별 uncheck 처리 (장용욱:20160318)
            $('.show-right-panel').prop('checked', false);      //속성보기
            $('.code-edit').prop('checked', false);             //소스편집
            $('.show-viewlink-panel').prop('checked', false);   //조회연동
            $('.show-writelink-panel').prop('checked', false);  //저장연동

            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '354px');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '5px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '20px');

            $('div.col1').hide();           //레이아웃툴         
            $('div.col3').hide();           //속성보기            
            $('div.col4').hide();           //조회연동       
            $('div.col5').hide();           //저장연동
            $('div.col6').show();           //템플릿      
            $('#demotext_wrap').hide();     //소스편집
            // 에디터 2개 생기는 현상방지
            if (editor || js_editor) {
                editor.toTextArea();
                js_editor.toTextArea();
            }
        },
        hide: function () {
            // 캔버스, 미리보기 탭을 감싸고 있는 div 오른쪽 margin
            $('div.colleft').css('margin-right', '0');
            // 캔버스, 미리보기 탭을 감싸고 있는 div 왼쪽 margin
            $('div.col2 .layout_tab_box').css('margin-left', '316px');
            // 캔버스 margin
            $('div.col2').css('padding-left', '0');

            $('div.col6').hide();   //템플릿
            $('div.col1').show();   //레이아웃툴
        },
        width: function () {
            return $('div.col6').is(':visible') ? $('div.col6').width() : 0;
        },
        status: 'show'
    }

    var leftPanel = {
        css: {
            col2_layout_tab_box: '',
            col_left_background: '',
            col2_padding_left: ''
        },
        show: function () {
            if (this.status == 'show') return;

            $('div.col1').show();

            $('div.colleft').css('background', this.css.col_left_background);
            $('div.col2').css('padding-left', this.css.col2_padding_left);
            this.status = 'show';

            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            // $('div.col2 .layout_tab_box').css('margin-left', this.css.col2_layout_tab_box);
            // this.css.col2_layout_tab_box = $('div.col2 .layout_tab_box').css('margin-left', '316px');
        },
        hide: function () {
            $('div.col1').hide();

            this.css.col_left_background = $('div.colleft').css('background');
            $('div.colleft').css('background', 'none');

            this.css.col2_padding_left = $('div.col2').css('padding-left');
            $('div.col2').css('padding-left', '20px');
            this.status = 'hide';

            // [2016-02-22 leesm] 속성보기, CodeMirror 보고 난 후 상단 tab box 스타일이 이상하여 추가
            // this.css.col2_layout_tab_box = $('div.col2 .layout_tab_box').css('margin-left');
            // $('div.col2 .layout_tab_box').css('margin-left', '5px');
        },
        width: function () {
            return $('div.col1').is(':visible') ? $('div.col1').width() : 0;
        },
        status: 'show'
    }

    return {
        init: init,
        leftPanel: leftPanel,
        rightPanel: rightPanel,
        codePanel: codePanel,
        ViewlinkPanel: ViewlinkPanel,
        WritelinkPanel: WritelinkPanel,
        templatelinkPanel: templatelinkPanel
    };
}());

//메인화면을 로드한 후 마지막 편집 내용을 선택할 수 있는 팝업 레이어
XFORM.loadOption = (function () {
    var init,
        config,
        addOption,
        bindEvent,
        existHistory,
        showPopup,
        loadMode,

        $pop,
        $pop_link,
        $pop_close,
        $content;

    var display = {
        title: '',
        subtitle: 'Select option'
    };

    init = function () {
        //popup loading option : template or temporary storage
        config();

        if (XFORM.storage.checkHistory()) {
            addOption();
            bindEvent();
            showPopup();
        }
    }

    config = function () {
        $pop = $('#modal_popup_content');
        $pop_link = $('#modal_content');
        $pop_close = $pop.find('.modal_close');
        $content = $pop.find('.modal-content').empty();

        $pop.find('.title').hide();
        $pop.find('.subtitle').html(display.subtitle);
    };

    addOption = function () {
        $content.append('<span class="source-select-option" data-source-mode="origin">원본에서 로드</span>');
        //$content.append('<span class="source-select-option" data-source-mode="explicit">마지막 저장상태에서 로드</span>');
        $content.append('<span class="source-select-option" data-source-mode="implicit">마지막 편집상태에서 로드</span>');
    };

    bindEvent = function () {
        $('.source-select-option').click(function () {
            loadMode($(this).data().sourceMode);
        });
    };

    existHistory = function () {
        // [2016-02-22 leesm] xform 개선 추가
        return ($('.storage-history').children().length > 1) ? true : false;
    };

    showPopup = function () {
        if (existHistory()) $pop_link.click();
    };

    //switch to loadimg mode
    loadMode = function (mode) {

        if (mode == 'origin') {
            //원본을 로드 - 임시저장 불필요
            $pop_close.click();
            XFORM.storage.clearAllHistory();
        } else if (mode == 'explicit') {
            //명시 저장된 상태를 로드
            var last_explicit_ver = $('.storage-history-explicit').last().data().historyVer;
            //alert(last_explicit_ver);
            $('[data-history-ver="' + last_explicit_ver + '"]').click();
            XFORM.storage.clearAllHistory();
            XFORM.canvas.changed();
        } else if (mode == 'implicit') {
            //자동 저장된 상태를 로드
            var last_ver = $('.storage-history-ver').last().data().historyVer;
            last_ver = parseInt(last_ver);
            //if (last_ver > 0) last_ver--;
            $('[data-history-ver="' + last_ver + '"]').click();
            XFORM.storage.clearAllHistory();
            XFORM.canvas.changed();
            $pop_close.click();
        } else {
            $pop_close.click();
            XFORM.storage.clearAllHistory();
        }
    }

    return {
        init: init
    };
}());

XFORM.templatelink = (function () {
    var setTemplateHtml,
        getTemplateList,
        delTemplateHtml,
        bindClip_Link;
    var strMode = "";
    
    //자주 사용하는 템플릿 저장
    setTemplateHtml = function (strTemplateName, strTemplateHtml) {
        strMode = "SAVE";
        
        $.ajax({
        	type:"POST",
        	async:false,
        	url:"xform/templateHtmlFn.do",
        	data: {
        		"mode" : strMode,
        		"templateID" : "",
        		"templateName" : strTemplateName,
        		"templateHTML" : strTemplateHtml,
        	},
        	success: function(data){
        		if(data.templateResult == "OK"){
    			  alert(Common.getDic('msg_apv_117'));  //성공적으로 저장하였습니다.
                  $("#templatelink-template-name").val("");
                  getTemplateList();
                  return true;
        		}else{
        			alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
                    return;
        		}
        	},
        	error: function(error){
        		alert("xform.ui.0.9.5.js 2258줄 에러"+error);
            	return false;
        	}
        });
     
    };

    //자주 사용하는 템플릿 삭제
    delTemplateHtml = function (strTemplateIndex) {
        strMode = "DELETE";
        
        $.ajax({
        	type:"POST",
        	async:false,
        	url:"xform/templateHtmlFn.do",
        	data: {
        		"mode" : strMode,
        		"templateID" : strTemplateIndex,
        		"templateName" : "",
        		"templateHTML" : "",
        	},
        	success: function(data){
        		if(data.templateResult == "OK"){
        			alert(Common.getDic('msg_138'));  //성공적으로 삭제되었습니다.
                    getTemplateList();
                    return true;
        		}else{
        			alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
                    return;
        		}
        	},
        	error: function(error){
        		alert("Error: " + e.description + "\r\nError number: " + e.number);
        		alert("xform.ui.0.9.5.js 2258줄 에러"+error);
            	return false;
        	}
        });
    };

    //자주 사용하는 템플릿 목록 조회
    getTemplateList = function () {
        strMode = "LIST";
        
        $.ajax({
        	type:"POST",
        	async:false,
        	url:"xform/templateHtmlFn.do",
        	data: {
        		"mode" : strMode,
        		"templateID" : "",
        		"templateName" : "",
        		"templateHTML" : "",
        	},
        	
        	success: function(data){
        		//console.log(data);
        		//console.log(JSON.stringify(data.templateResult));
        		if(data.templateResult!=""){
        			if(data.templateResult == "ERROR"){
        				 alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
                         return;
        			}
        			
                    var l_ListStr = "";
                    var oJson = eval('(' + JSON.stringify(data.templateResult) + ')');

                    var strHtml = "";
                    for (var i = 0; oJson.Table.length > i; i++) {
                        strHtml += "<li data-field='template_html'>";
                        strHtml += "<img class='ico_img' src='/approval/resources/images/xform/ico_textbox.png'>";
                        strHtml += "<span>" + oJson.Table[i].TemplateName + "</span>";
                        strHtml += "<a title='copy to clipboard' class='templatelink_btn_clip add-clip' href='javascript: void(0);' templateidx='" + oJson.Table[i].TemplateID + "'><img src='/approval/resources/images/xform/ico_copy.png'></a>";
                        strHtml += "<a class='templatelink_btn_add templatelink-add-block' href='javascript: void(0);'' templateidx='" + oJson.Table[i].TemplateID + "'><img src='/approval/resources/images/xform/ico_add.old.png'></a>";
                        strHtml += "<a class='templatelink_btn_del del-block' href='javascript: void(0);' templateidx='" + oJson.Table[i].TemplateID + "'><img src='/approval/resources/images/xform/modal_close.png'></a>";
                        strHtml += "</li>";
                    }
                    // 컬럼목록 바인딩
                    $('#templatelink-tool').find("ul").html(strHtml);

                    // 클립보드 복사 기능
                    bindClip_Link();

                    // 드래그 기능
                    //$('#templatelink-ul li:not(.element-preview)').addClass('draggable-item');
                    //$('#templatelink-ul li:not(.element-preview)').draggable({
                    //    connectToSortable: '.sortable td, .sortable-container',
                    //    revert: 'invalid',
                    //    handle: ".drag-handle",
                    //    helper: function () {
                    //        var helper = $(this).clone();
                    //        helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
                    //        return helper;
                    //    }
                    //});

                    // 추가 버튼 클릭
                    $('.templatelink-add-block').click(function (event) {
                        event.stopPropagation();                    
                        XFORM.form.draw($(this));
                    });

                    // 삭제 버튼 클릭
                    $('.del-block').click(function (event) {
                        event.stopPropagation();
                        XFORM.templatelink.delTemplateHtml($(this).attr("templateidx"));
                    });
        			
        		}else { //data.templateResult == ""
        			
                    var strHtml = "";
                    strHtml += "<li>";
                    strHtml += "<span>저장된 리스트가 없습니다.</span>";
                    strHtml += "</li>";

                    // 컬럼목록 바인딩
                    $('#templatelink-tool').find("ul").html(strHtml);
                }
        	},
        	error: function(error){
        		alert("Error: " + e.description + "\r\nError number: " + e.number);
        		alert("xform.ui.0.9.5.js 2258줄 에러"+error);
            	return false;
        	}
        });
    }

    // XForm 고도화-템플릿. 복사하기 바인딩 추가
    bindClip_Link = function () {
        //initialize toolbox add button
        $('.add-clip').click(function (event) {
            event.stopPropagation();

            var el_mode = "SELECT";
            var el_tableidx = $(this).attr('templateidx');

            //get html
            // [2016-03-30 leesm] XForm 고도화-템플릿. 컨트롤 HTML 생성.
            var shtml = XFORM.form.getElementHtml_TemplateLink(el_mode, el_tableidx);
            var $obj = $(shtml).appendTo('#clipboard');

            XFORM.form.copy($obj);
        });
    }

    return {
        setTemplateHtml: setTemplateHtml,
        getTemplateList: getTemplateList,
        delTemplateHtml: delTemplateHtml,
        bindClip_Link: bindClip_Link
    };
}());

// XForm 고도화-연동. 연동 관련된 이벤트. (장용욱:20160311)    
XFORM.linkage = (function () {
    var getDataTableList,
        getDataTableColumnList,
        bindClip_ViewLink,
        bindClip_WriteLink,
        getMethodList,
        getParamList,

    // 테이블조회 함수
    getDataTableList = function (strConString) {
    	$.ajax({
            type: "POST",
            async: false,
            url: "xform/getDataTableList.do",
            data: {
            	"connectionStr" : strConString
            },
            success: function (data) {
                if(data != "" && data.result=="ok" ){
                	if(data.tableList.indexOf('ERROR')==0){
                		alert(data.tableList);
                        return;
                	}
                	
                	 // 초기화
                    if ($('.show-viewlink-panel').is(':checked')) {
                        // 테이블 목록 초기화
                        $('.viewlink-type-database-table').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                        // 파라미터1 목록 초기화
                        $('.viewlink-type-database-param1').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                        // 파라미터2 목록 초기화
                        $('.viewlink-type-database-param2').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                        // 파라미터3 목록 초기화
                        $('.viewlink-type-database-param3').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                        // 파라미터4 목록 초기화
                        $('.viewlink-type-database-param4').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                    } else if ($('.show-writelink-panel').is(':checked')) {
                        // 테이블 목록
                        $('.writelink-type-database-table').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                    }

                    var l_ListStr = "";
                    var oJson = eval('(' + JSON.stringify(data) + ')');
                    var options = "";
                    for (var i = 0; oJson.tableList.length > i; i++) {
                        options += '<option value="' + oJson.tableList[i].NAME + '">' + oJson.tableList[i].NAME + '</option>';
                    }

                    // 조회연동, 저장연동 분기
                    if ($('.show-viewlink-panel').is(':checked')) {
                        $('.viewlink-type-database-table').append(options);
                    } else if ($('.show-writelink-panel').is(':checked')) {
                        $('.writelink-type-database-table').append(options);
                    }
                	
                }
            },
            error: function (error) {
            	//에러 처리 필요
            	alert("xform.ui.0.9.5.js 2496줄 에러"+error);
            	return false;
            }
        });
    }

    // 컬럼조회 함수
    getDataTableColumnList = function (strConString, strTableName) {
        $.ajax({
        	type:"POST",
        	async:false,
        	url:"xform/getDataColumnList.do",
        	data:{
        		"connectionStr" : strConString,
        		"tableName" : strTableName
        	},
        	success: function(data){
        		 if(data != "" && data.result=="ok" ){
        				if(data.columnList.indexOf('ERROR')==0){
                    		alert(data.tableList);
                            return;
                    	}
        			 
        				var l_ListStr = "";
    	                var oJson = eval('(' + JSON.stringify(data) + ')');

    	                var strHtml = "";
    	                var options = "";

    	                // 조회연동, 저장연동 분기
    	                if ($('.show-viewlink-panel').is(':checked')) {                
    	                    // 파라미터1 목록 초기화
    	                    $('.viewlink-type-database-param1').find("option").each(function () {
    	                        if ($(this).val() != "") {
    	                            $(this).remove();
    	                        }
    	                    });
    	                    // 파라미터2 목록 초기화
    	                    $('.viewlink-type-database-param2').find("option").each(function () {
    	                        if ($(this).val() != "") {
    	                            $(this).remove();
    	                        }
    	                    });
    	                    // 파라미터3 목록 초기화
    	                    $('.viewlink-type-database-param3').find("option").each(function () {
    	                        if ($(this).val() != "") {
    	                            $(this).remove();
    	                        }
    	                    });
    	                    // 파라미터4 목록 초기화
    	                    $('.viewlink-type-database-param4').find("option").each(function () {
    	                        if ($(this).val() != "") {
    	                            $(this).remove();
    	                        }
    	                    });
    	               
    	                    for (var i = 0; oJson.columnList.length > i; i++) {
    	                        strHtml += "<li class='draggable-item ui-draggable' data-field='viewlink_d_text' data-connect='" + strConString + "' data-table='" + strTableName + "' data-map='" + oJson.columnList[i].NAME + "'>";
    	                        strHtml += "<img class='ico_img drag-handle' src='/approval/resources/images/xform/ico_textbox.png'>";
    	                        strHtml += "<span class='drag-handle'>" + oJson.columnList[i].NAME + "</span>";
    	                        strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_copy.png'></a>";
    	                        strHtml += "<a class='btn_add viewlink-database-add-block' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_add.old.png'></a>";
    	                        strHtml += "</li>";

    	                        options += '<option value="' + oJson.columnList[i].NAME + '">' + oJson.columnList[i].NAME + '</option>';
    	                    }

    	                    // 컬럼목록 바인딩
    	                    $('#viewlink-tool-database').find("ul").html(strHtml);
    	                    // 파라미터1 바인딩
    	                    $('.viewlink-type-database-param1').append(options);
    	                    // 파라미터2 바인딩
    	                    $('.viewlink-type-database-param2').append(options);
    	                    // 파라미터3 바인딩
    	                    $('.viewlink-type-database-param3').append(options);
    	                    // 파라미터4 바인딩
    	                    $('.viewlink-type-database-param4').append(options);

    	                    // 클립보드 복사 기능
    	                    bindClip_ViewLink();

    	                    // 드래그 기능
    	                    $('#viewlink-database-ul li:not(.element-preview)').addClass('draggable-item');
    	                    $('#viewlink-database-ul li:not(.element-preview)').draggable({
    	                        connectToSortable: '.sortable td, .sortable-container',
    	                        revert: 'invalid',
    	                        handle: ".drag-handle",
    	                        helper: function () {
    	                            var helper = $(this).clone();
    	                            helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
    	                            return helper;
    	                        }
    	                    });

    	                    // 추가 버튼 클릭                
    	                    $('.viewlink-database-add-block').click(function (event) {
    	                        event.stopPropagation();
    	                        XFORM.form.draw($(this));
    	                    });

    	                } else if ($('.show-writelink-panel').is(':checked')) {

    	                    for (var i = 0; oJson.columnList.length > i; i++) {
    	                        strHtml += "<li class='draggable-item ui-draggable' data-field='writelink_d_text' data-connect='" + strConString + "' data-table='" + strTableName + "' data-map='" + oJson.columnList[i].NAME + "'>";
    	                        strHtml += "<img class='ico_img drag-handle' src='/approval/resources/images/xform/ico_textbox.png'>";
    	                        strHtml += "<span class='drag-handle'>" + oJson.columnList[i].NAME + "</span>";
    	                        strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_copy.png'></a>";
    	                        strHtml += "<a class='btn_add writelink-database-add-block' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_add.old.png'></a>";
    	                        strHtml += "</li>";

    	                        options += '<option value="' + oJson.columnList[i].NAME + '">' + oJson.columnList[i].NAME + '</option>';
    	                    }

    	                    // 컬럼목록 바인딩
    	                    $('#writelink-tool-database').find("ul").html(strHtml);

    	                    // 클립보드 복사 기능
    	                    bindClip_WriteLink();

    	                    // 드래그 기능
    	                    $('#writelink-database-ul li:not(.element-preview)').addClass('draggable-item');
    	                    $('#writelink-database-ul li:not(.element-preview)').draggable({
    	                        connectToSortable: '.sortable td, .sortable-container',
    	                        revert: 'invalid',
    	                        handle: ".drag-handle",
    	                        helper: function () {
    	                            var helper = $(this).clone();
    	                            helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
    	                            return helper;
    	                        }
    	                    });

    	                    // 추가 버튼 클릭                
    	                    $('.writelink-database-add-block').click(function (event) {
    	                        event.stopPropagation();
    	                        XFORM.form.draw($(this));
    	                    });

    	                }
        		 }
        		 
        	},
        	error: function(error){
        		//에러 처리 필요
            	alert("xform.ui.0.9.5.js 2496줄 에러"+error);
            	return false;
        	}
        	
        });
    }

    // 웹서비스 함수 조회
    getMethodList = function (strConString) {
        $.ajax({
        	type : "POST",
        	async : false,
        	url : "xform/getMethodList.do",
        	data : {
        		"strConnectString" : strConString
        	},
        	success : function(data){
        		if(data != "" && data.result=="ok"){
        			if(data.Table.indexOf('ERROR') == 0 ){
        				alert(data.Table);
        				return;
        			}
        			
        			// 조회연동, 저장연동 분기
                    if ($('.show-viewlink-panel').is(':checked')) {
                        // 웹메소드 목록 초기화
                        $('.viewlink-type-webservice-table').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });

                        // 파라미터 초기화
                        $('.viewlink-type-webservice-param1').val("");
                        $('.viewlink-type-webservice-param2').val("");
                        $('.viewlink-type-webservice-param3').val("");
                        $('.viewlink-type-webservice-param4').val("");

                        // 컬럼 초기화
                        $('#viewlink-tool-webservice').find("ul").html("");

                    } else if ($('.show-writelink-panel').is(':checked')) {
                        // 웹메소드 목록 초기화
                        $('.writelink-type-webservice-table').find("option").each(function () {
                            if ($(this).val() != "") {
                                $(this).remove();
                            }
                        });
                        
                        // 컬럼 초기화
                        $('#writelink-tool-webservice').find("ul").html("");
                    }


                    var l_ListStr = "";
                    var oJson = eval('(' + JSON.stringify(data) + ')');
                    var options = "";
                    for (var i = 0; oJson.Table.length > i; i++) {
                        options += '<option value="' + oJson.Table[i].NAME + '">' + oJson.Table[i].NAME + '</option>';
                    }

                    // 조회연동, 저장연동 분기
                    if ($('.show-viewlink-panel').is(':checked')) {
                        $('.viewlink-type-webservice-table').append(options);
                    } else if ($('.show-writelink-panel').is(':checked')) {
                        $('.writelink-type-webservice-table').append(options);
                    }
        		}
        	},
        	error : function(error){
        		alert(error);
        	}
        
        });
    	/*CFN_PageMethodJSON_Url("/WebSite/Approval/Forms/Templates/xform/xform_webservice.aspx", "GetMethodList", "{strConnectString:'" + strConString + "'}", false, function (pResult, pContext) {
            if (pResult != "") {
                if (pResult.d.indexOf('ERROR') == 0) {
                    alert(pResult.d);
                    //alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
                    return;
                }

                // 조회연동, 저장연동 분기
                if ($('.show-viewlink-panel').is(':checked')) {
                    // 웹메소드 목록 초기화
                    $('.viewlink-type-webservice-table').find("option").each(function () {
                        if ($(this).val() != "") {
                            $(this).remove();
                        }
                    });

                    // 파라미터 초기화
                    $('.viewlink-type-webservice-param1').val("");
                    $('.viewlink-type-webservice-param2').val("");
                    $('.viewlink-type-webservice-param3').val("");
                    $('.viewlink-type-webservice-param4').val("");

                    // 컬럼 초기화
                    $('#viewlink-tool-webservice').find("ul").html("");

                } else if ($('.show-writelink-panel').is(':checked')) {
                    // 웹메소드 목록 초기화
                    $('.writelink-type-webservice-table').find("option").each(function () {
                        if ($(this).val() != "") {
                            $(this).remove();
                        }
                    });
                    
                    // 컬럼 초기화
                    $('#writelink-tool-webservice').find("ul").html("");
                }


                var l_ListStr = "";
                var oJson = eval('(' + pResult.d + ')');
                var options = "";
                for (var i = 0; oJson.Table.length > i; i++) {
                    options += '<option value="' + oJson.Table[i].NAME + '">' + oJson.Table[i].NAME + '</option>';
                }

                // 조회연동, 저장연동 분기
                if ($('.show-viewlink-panel').is(':checked')) {
                    $('.viewlink-type-webservice-table').append(options);
                } else if ($('.show-writelink-panel').is(':checked')) {
                    $('.writelink-type-webservice-table').append(options);
                }
            }
        });*/
    }

    // 파라미터 조회 함수
    getParamList = function (strConString, strTableName) {
        // 조회연동, 저장연동 분기
        if ($('.show-viewlink-panel').is(':checked')) {
        	$.ajax({
        		type : "POST",
        		async : false,
        		url : "xform/getParamList.do",
        		data : {
        			"strConnectString" : strConString,
        			"strTableName" : strTableName
        		},
        		success : function(data){
        			if(data != "" && data.result == "ok"){
        				if(data.Table.indexOf('ERROR') == 0){
        					alert(data.Table);
        					return;
        				}

                        // 초기화
                        $('.viewlink-type-webservice-param1').val("");
                        $('.viewlink-type-webservice-param2').val("");
                        $('.viewlink-type-webservice-param3').val("");
                        $('.viewlink-type-webservice-param4').val("");

                        var l_ListStr = "";
                        var oJson = eval('(' +JSON.stringify(data)+ ')');

                        var strHtml = "";
                        var options = "";

                        strHtml += "<li class='draggable-item ui-draggable' data-field='viewlink_w_text' data-connect='" + strConString + "' data-table='" + strTableName + "' data-map=''>";
                        strHtml += "<img class='ico_img drag-handle' src='/approval/resources/images/xform/ico_textbox.png'>";
                        strHtml += "<span class='drag-handle'><input type='text' id='viewlink-tool-webservice-column' value='컬럼아이디'></span>";
                        strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_copy.png'></a>";
                        strHtml += "<a class='btn_add viewlink-webservice-add-block' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_add.old.png'></a>";
                        strHtml += "</li>";

                        // 컬럼목록 바인딩
                        $('#viewlink-tool-webservice').find("ul").html(strHtml);

                        for (var i = 0; oJson.Table.length > i; i++) {
                            if (i == 0) {
                                $('.viewlink-type-webservice-param1').val(oJson.Table[i].NAME);
                            } else if (i == 1) {
                                $('.viewlink-type-webservice-param2').val(oJson.Table[i].NAME);
                            } else if (i == 2) {
                                $('.viewlink-type-webservice-param3').val(oJson.Table[i].NAME);
                            } else if (i == 3) {
                                $('.viewlink-type-webservice-param4').val(oJson.Table[i].NAME);
                            }
                        }

                        // 클립보드 복사 기능
                        bindClip_ViewLink();

                        // 드래그 기능
                        $('#viewlink-webservice-ul li:not(.element-preview)').addClass('draggable-item');
                        $('#viewlink-webservice-ul li:not(.element-preview)').draggable({
                            connectToSortable: '.sortable td, .sortable-container',
                            revert: 'invalid',
                            handle: ".drag-handle",
                            helper: function () {
                                var helper = $(this).clone();
                                helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
                                return helper;
                            }
                        });

                        // 추가 버튼 클릭
                        $('.viewlink-webservice-add-block').click(function (event) {
                            event.stopPropagation();
                            XFORM.form.draw($(this));
                        });
        				
        				
        			}
        		},
        		error : function(error){
        			alert(error);
        		}
        		
        	});
        	
      /*      CFN_PageMethodJSON_Url("/WebSite/Approval/Forms/Templates/xform/xform_webservice.aspx", "getParamList", "{strConnectString:'" + strConString + "', strTableName:'" + strTableName + "'}", false, function (pResult, pContext) {
                if (pResult != "") {
                    if (pResult.d.indexOf('ERROR') == 0) {
                        alert(pResult.d);
                        //alert(Common.getDic('msg_OccurError'));  //에러가 발생했습니다
                        return;
                    }

                    // 초기화
                    $('.viewlink-type-webservice-param1').val("");
                    $('.viewlink-type-webservice-param2').val("");
                    $('.viewlink-type-webservice-param3').val("");
                    $('.viewlink-type-webservice-param4').val("");

                    var l_ListStr = "";
                    var oJson = eval('(' + pResult.d + ')');

                    var strHtml = "";
                    var options = "";

                    strHtml += "<li class='draggable-item ui-draggable' data-field='viewlink_w_text' data-connect='" + strConString + "' data-table='" + strTableName + "' data-map=''>";
                    strHtml += "<img class='ico_img drag-handle' src='img/ico_textbox.png'>";
                    strHtml += "<span class='drag-handle'><input type='text' id='viewlink-tool-webservice-column' value='컬럼아이디'></span>";
                    strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='img/ico_copy.png'></a>";
                    strHtml += "<a class='btn_add viewlink-webservice-add-block' href='javascript: void(0);'><img src='img/ico_add.old.png'></a>";
                    strHtml += "</li>";

                    // 컬럼목록 바인딩
                    $('#viewlink-tool-webservice').find("ul").html(strHtml);

                    for (var i = 0; oJson.Table.length > i; i++) {
                        if (i == 0) {
                            $('.viewlink-type-webservice-param1').val(oJson.Table[i].NAME);
                        } else if (i == 1) {
                            $('.viewlink-type-webservice-param2').val(oJson.Table[i].NAME);
                        } else if (i == 2) {
                            $('.viewlink-type-webservice-param3').val(oJson.Table[i].NAME);
                        } else if (i == 3) {
                            $('.viewlink-type-webservice-param4').val(oJson.Table[i].NAME);
                        }
                    }

                    // 클립보드 복사 기능
                    bindClip_ViewLink();

                    // 드래그 기능
                    $('#viewlink-webservice-ul li:not(.element-preview)').addClass('draggable-item');
                    $('#viewlink-webservice-ul li:not(.element-preview)').draggable({
                        connectToSortable: '.sortable td, .sortable-container',
                        revert: 'invalid',
                        handle: ".drag-handle",
                        helper: function () {
                            var helper = $(this).clone();
                            helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
                            return helper;
                        }
                    });

                    // 추가 버튼 클릭
                    $('.viewlink-webservice-add-block').click(function (event) {
                        event.stopPropagation();
                        XFORM.form.draw($(this));
                    });
                }
            });*/

            
        } else if ($('.show-writelink-panel').is(':checked')) {

            var strHtml = "";
            var options = "";

            strHtml += "<li class='draggable-item ui-draggable' data-field='writelink_w_text' data-connect='" + strConString + "' data-table='" + strTableName + "' data-map=''>";
            strHtml += "<img class='ico_img drag-handle' src='/approval/resources/images/xform/ico_textbox.png'>";
            strHtml += "<span class='drag-handle'><input type='text' id='writelink-tool-webservice-column' value='컬럼아이디'></span>";
            strHtml += "<a title='copy to clipboard' class='btn_clip add-clip' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_copy.png'></a>";
            strHtml += "<a class='btn_add writelink-webservice-add-block' href='javascript: void(0);'><img src='/approval/resources/images/xform/ico_add.old.png'></a>";
            strHtml += "</li>";

            // 컬럼목록 바인딩
            $('#writelink-tool-webservice').find("ul").html(strHtml);

            // 클립보드 복사 기능
            bindClip_WriteLink();

            // 드래그 기능
            $('#writelink-webservice-ul li:not(.element-preview)').addClass('draggable-item');
            $('#writelink-webservice-ul li:not(.element-preview)').draggable({
                connectToSortable: '.sortable td, .sortable-container',
                revert: 'invalid',
                handle: ".drag-handle",
                helper: function () {
                    var helper = $(this).clone();
                    helper.css({ 'border': 'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity': '0.3' });
                    return helper;
                }
            });

            // 추가 버튼 클릭
            $('.writelink-webservice-add-block').click(function (event) {
                event.stopPropagation();                
                XFORM.form.draw($(this));
            });
        }

        
    }

    // XForm 고도화-조회연동. 복사하기 바인딩 추가 (장용욱:20160314)
    bindClip_ViewLink = function () {
        //initialize toolbox add button
        $('.add-clip').click(function (event) {
            event.stopPropagation();

            var el_type = $(this).parent().attr('data-field');
            var el_type2 = $(this).parent().attr('data-connect');
            var el_type3 = $(this).parent().attr('data-table');
            var el_type4 = $(this).parent().attr('data-map');

            //get html
            // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
            var shtml = XFORM.form.getElementHtml_ViewLink(el_type, el_type2, el_type3, el_type4);
            var $obj = $(shtml).appendTo('#clipboard');

            XFORM.form.copy($obj);
        });
    }

    // XForm 고도화-저장연동. 복사하기 바인딩 추가 (장용욱:20160321)
    bindClip_WriteLink = function () {
        //initialize toolbox add button
        $('.add-clip').click(function (event) {
            event.stopPropagation();

            var el_type = $(this).parent().attr('data-field');
            var el_type2 = $(this).parent().attr('data-connect');
            var el_type3 = $(this).parent().attr('data-table');
            var el_type4 = $(this).parent().attr('data-map');

            //get html
            // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
            var shtml = XFORM.form.getElementHtml_WriteLink(el_type, el_type2, el_type3, el_type4);
            var $obj = $(shtml).appendTo('#clipboard');

            XFORM.form.copy($obj);
        });
    }

    return {
        getDataTableList: getDataTableList,
        getDataTableColumnList: getDataTableColumnList,
        bindClip_ViewLink: bindClip_ViewLink,
        bindClip_WriteLink: bindClip_WriteLink,
        getMethodList: getMethodList,
        getParamList: getParamList
    };
}());

XFORM.overlay = (function () {
    var init,
        initLeanModal,
        addDragHandler,
        initHtmlEditor;

    init = function () {

        initLeanModal();

        addDragHandler();

        initHtmlEditor();
    };

    initLeanModal = function () {
        //initialize overlay
        $('a[rel*=leanModal]').leanModal({ top: 200, closeButton: ".modal_close, .table_modal_close, .cancel, .table_cancel" });
    }

    addDragHandler = function () {
        //make overlay draggable
        $('.xform-overlay').draggable({ handle: '.header' });
    }

    initHtmlEditor = function () {
        /*-----------------------------------------
        Initialize : Attribute Popup HTML Editor
        ------------------------------------------*/
        $('#property_popup [name=attr_disp_opt]').click(function () {
            if ($(this).val() == 'html' && $('#property_popup .jqte_editor').length == 0) {
                $('#property_popup textarea').jqte();
            } else if ($(this).val() == 'textarea' && $('#property_popup .jqte_editor').length > 0) {
                $('#property_popup textarea').jqte();
            }
        });
    };

    return {
        init: init
    };
}());

XFORM.shortkey = (function () {
    var init = function () {
        //Short Cut Key Event : copy & paste...
        Mousetrap.bind('ctrl+c', function (e) { XFORM.form.copy(); });
        Mousetrap.bind('ctrl+x', function (e) { XFORM.form.cut(); });
        Mousetrap.bind('ctrl+v', function (e) {
            // [2016-03-04 leesm] 클립보드 복사기능 - div 내에 붙혀넣기 할 때 div 밖에 붙혀넣어져서 수정함
            if (typeof e === 'undefined' || typeof e === 'string') {
                XFORM.form.paste();
            } else if (typeof e === 'object') {
                XFORM.form.paste('', 'append');
            } else {
                XFORM.form.paste();
            }
        });

        // [2016-02-22 leesm] xform 개선 추가
        Mousetrap.bind('ctrl+s', function (e) { e.preventDefault(); XFORM.storage.tempSave('e', 'default'); });

        Mousetrap.bind('del', function (e) { XFORM.form.del(); });
        Mousetrap.bind('ctrl+z', function (e) { $('.element-undo').click(); });
        Mousetrap.bind('f2', function (e) { $('.element-edit').click(); });
        Mousetrap.bind('esc', function (e) {
            XFORM.form.canvasMode.init();
            //XFORM.form.tableEditMode('element', false); //change mode & hide element panel 
        });
    }

    return {
        init: init
    };
}());

XFORM.table = (function () {
    var init,
        eventbind,
        redips_table = '';

    // create redips container
    var redips = {};

    init = function () {
        redips.init();
        redips.eventbind();
    };

    redips.eventbind = function () {

        $('.cell-merge').unbind('click').bind('click', function () {
            event.stopPropagation();
            redips.merge();
            XFORM.canvas.changed();
        });

        $('.cell-split-v').unbind('click').bind('click', function () {
            redips.split('v');
            XFORM.canvas.changed();
        });

        $('.cell-split-h').unbind('click').bind('click', function () {
            redips.split('h');
            XFORM.canvas.changed();
        });

        //row insert
        $('.cell-row-insert').unbind('click').bind('click', function () {
            event.stopPropagation();
            redips.row('insert');
            XFORM.canvas.changed();
        });

        //row delete
        $('.cell-row-delete').unbind('click').bind('click', function () {
            redips.row('delete');
            XFORM.canvas.changed();
        });
        //col insert
        $('.cell-col-insert').unbind('click').bind('click', function () {
            redips.column('insert');
            XFORM.canvas.changed();
        });
        //col delete
        $('.cell-col-delete').unbind('click').bind('click', function () {
            // [2016-02-22 leesm] xform 개선 추가
            var r = redips.column('delete');
            if (r) XFORM.canvas.changed();
        });
        $('.cell-col-close').unbind('click').bind('click', function () {
            //XFORM.form.selectMode('container');
            XFORM.form.toggleTableEdit();
            if (window.console) {
            	//console.log('close clicked');
            }
        });
    };

    /*------------------------------------------ 
        function : redips - table manipulation 
    ------------------------------------------*/

    // REDIPS.table initialization
    redips.init = function () {
        // define reference to the REDIPS.table object
        var rt = REDIPS.table;
        // activate onmousedown event listener on cells within table with id="mainTable"
        var tbl = XFORM.form.selectedCon()[0];

        redips_table = tbl;

        rt.onmousedown(tbl, true);
        // show cellIndex (it is nice for debugging)
        rt.cell_index(true);
        // define background color for marked cell
        rt.color.cell = '#9BB3DA';

    };

    // function merges table cells
    redips.merge = function () {
        // first merge cells horizontally and leave cells marked
        REDIPS.table.merge('h', false);
        // and then merge cells vertically and clear cells (second parameter is true by default)
        REDIPS.table.merge('v');
    };

    // function splits table cells if colspan/rowspan is greater then 1
    // mode is 'h' or 'v' (cells should be marked before)
    redips.split = function (mode) {
        REDIPS.table.split(mode);
        //split 후 drop 가능하도록
        //XFORM.form.containerDroppable( $('#'+redips_table), 'table', 'disable' );
        XFORM.form.containerDroppable($(redips_table), 'table');
    };

    redips.row = function (type) {
        REDIPS.table.row(redips_table, type);

        $(redips_table).unbind('dblclick');

        XFORM.form.containerUnDroppable($(redips_table));
        XFORM.form.containerDroppable($(redips_table), 'table');
        XFORM.form.elementSelectable($(redips_table).find('th, td'));
    };

    // insert/delete table column
    redips.column = function (type) {
        REDIPS.table.column(redips_table, type);

        $(redips_table).unbind('dblclick');

        XFORM.form.containerUnDroppable($(redips_table));
        XFORM.form.containerDroppable($(redips_table), 'table');
        //14.08.19 
        XFORM.form.elementSelectable($(redips_table).find('th, td'));
    };


    return {
        init: init
    };
}());

XFORM.customtable = (function () {

    var wartosc,
        wartosc2,
        i = 0,
        j = 0;

    var init = function () {

        $('#table_content').append('<table border="1"></table>');

        var table = $('#table_content').children();

        $('#rows').change();
    };

    var fn = function () {
    };

    // [2016-02-22 leesm] xform 개선 추가
    var rowChange = function (table, row) {
        table.find('tr').remove();
        //alert(document.body.innerHTML);
        wartosc = row;

        table.each(function () {
            for (i = 0; i < wartosc; i++) {
                $(this).append('<tr>');
            }
        });

        setThCss();
    }

    function colChange(table, col) {
        table.find('td').remove();
        wartosc2 = col;
        table.find('tr').each(function () {
            for (var j = 0; j < wartosc2; j++) {
                $(this).append('<td></td>');
            }
        });
        setThCss();
    }

    $('#rows').on('change input', function () {
        var row = this.value; //this.max - this.value + 1;
        rowChange($('#table_resize table'), row);
        $('#newValue').html(row);
        $('#cols').change();
    });

    $('#cols').on('change input', function () {
        var col = this.value;
        colChange($('#table_resize table'), col);
        $('#newValue2').html(col);
    });

    //테이블 행/열 팝업 완료
    $('#table_resize .ok').live('click', function (event) {
        var obj = $('#object_id').val();
        var $obj = $('#' + obj);
        //var $content_wrap = $('#table_content').clone().wrap('<div />')
        //var content = $content_wrap.html();
        tableChange($obj, $('#newValue').text(), $('#newValue2').text());

        event.preventDefault();

        $('.table_modal_close').click();
    });

    $('.table_modal_close, .table_cancel').on('click', function (event) { // [16-04-01] kimhs, 테이블 기본값 3행 5열로 세팅     
        event.preventDefault();

        $("#cols").val(3); $("#newValue2").text(3);
        $("#rows").val(5); $("#newValue").text(5);
        $('#rows').change();
    });

    $('#th_include input:checkbox').live('click', function (event) {
        setThCss();
    });

    function setThCss() {
        var chk = $('#th_include input:checkbox');
        if (chk.is(':checked')) {
            $('#table_content table tr').eq(0).css('background-color', '#DDD');
        } else {
            $('#table_content table tr').eq(0).css('background-color', '#FFF');
        }
    }

    function tableChange(table, row, col) {
        var $table = table;
        $table.find('tr, thead, tbody, tfoot').remove();

        var th = '';
        var th_include = $('#th_include input:checkbox').is(':checked');
        //THEAD 구성
        if (th_include) {
            var $thead = $('<thead></thead>').appendTo($table);
            for (var j = 0; j < col; j++) {
                th += '\n\t\t\t\t' + '<th></th>';
            }
            $thead.append('<tr>' + th + '</tr>');
        }
        //TBODY 구성
        var $tbody = $('<tbody></tbody>').appendTo($table);

        if (th_include) row--;
        for (i = 0; i < row; i++) {
            $tbody.append('\n\t\t\t\t' + '<tr></tr>');
        }

        $tbody.find('tr').each(function () {
            for (var j = 0; j < col; j++) {
                $(this).append('\n\t\t\t\t\t' + '<td></td>');
            }
        });

        var cl = '',
            cw = 100 / col;
        for (var j = 0; j < col; j++) {
            cl += '\n\t\t\t\t' + '<col style="width: ' + cw + '%;" />';
        }

        if ($table.find('colgroup').length === 0) {
            $('<colgroup>\n</colgroup>').prependTo($table);
        }
        $table.find('colgroup').empty().append(cl);


        XFORM.form.containerDroppable($table, 'table');
        XFORM.form.containerSelectable($table);
        XFORM.form.elementSelectable($table.find('th, td'));
        XFORM.form.bindContentEditable($table);
        XFORM.form.containerSelected($table);
        XFORM.form.canvasRefresh();
    }

    return {
        init: init,
        fn: fn
    };
}());

XFORM.styler = (function () {
    var init,
        bindAdd;

    init = function () {
        addOptions();
        addDragHandler();
    };

    addOptions = function () {
        //initialize toolbox add button
        var options;
        var min = 8, max = 32;
        for (var i = min; i <= max; i++) {
            options += '<option value="' + i + 'px">' + i + '</option>';
        }
        $('#styler_font_size').append(options);

    }

    addDragHandler = function () {
        //make draggable
        $('#element_css').draggable({ handle: '.drag-handle' });
    }

    return {
        init: init
    };

}());

XFORM.loader = {
    show: function () {
        $('#loader').show();
    },
    hide: function () {
        $('#loader').hide();
    }

}
