/* revision
16.05.31 checkbox, radio 옵션 변경위해 추가한 text -> data-text로 변경
16.06.01 속성 팝업 취소 버튼 추가 / multi-sum-table 구성 변경 / 모두 적용 기능 추가
         라디오, 체크박스 data-node-name 변경가능하도록 수정 / 붙여넣기 마법사 이용 시 style 속성 제거

*/


//name space
var XFORM = XFORM || {};
//개별호출 - 일괄호출처리
Common.getDicList(["msg_OccurError"]);
XFORM.form = (function(){
    
    var initPage,
        elementDraggable,    //toolbox item draggable
        elementSelectable,
        containerSelectable, //컨테이너(DIV, TABLE)를 편집 가능하도록 이벤트 연결
        containerDroppable, //
        canvasDroppable,
        objectDropped,
        removeHover,
        getElementHtml,
        // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
        getElementHtml_ViewLink,
        // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
        getElementHtml_WriteLink,
        // [2016-03-29 leesm] XForm 고도화-템플릿
        getElementHtml_TemplateLink,
        outlineHighlight,
        newId,
        dropCallback,
        tableResizable,  //table column resizable
        element_click,  //element click event
        showAttr, // show element attributes 
        getElementAttr,
        getAttrTable,
        getProperty,   //property to json
        setProperty,   //property to canvas
        setPanel,    //modal value to property
        bindPropertyMenu,      //apply, delete button
        edit_table,         //table edit
        loadDataField,     //data field to DB
        addToCanvas,  //click and add to canvas
        addToContainer,   //click and add to block
        selectedId,   //selected object id
        selectedObj,    //selected object
        selectedCon,    //selected container
        selectedTag,    //selected object tagname(lower case)
        copiedObj,      // copied object
        tableEditMode,    //table edit or not (table/element)
        tableMode,  //table mode
        draw,     //element attach to canvas or block
        copy,
        paste,
        cut,
        duplicate, //copy & paste
        del, //
        quit,
        table,
        elementModal, //show element attributes modal
        toObject, //get jquery object
        viewCode, // view source code of selected element
        modalPop, //popup content modal
        g_editing_object,   // 편집 중인 table
        showStatus,

        tableEditEnable,
        addTableId,
        containerUnDroppable,
        popBlockCustom,
        checkObjSelected,
        getElements,
        loadAttr,
        hideAttr,
        loadElementOptions,
        getHtmlOption,
        getRadioOption,
        bindHtmlOption,
        alertTimeout,
        containerMovable,
        dragRow,
        showModeStatus,
        statTablePanel,
        bindContentUneditable,
        bindContentEditable,
        initContentEditable,
        contentEditable,
        contentEditableMode,
        cssToJson,
        readStyle,
        loadStyleEditor,
        unloadStyleEditor,
        styleEditor,
        containerPanel,
        elementPanel,
        hideTablePanel,
        showTablePanel,
        makeId,
        showHtmlCode,
        showOriginalCode,
        pureCode,

        makeElementOptions,
        makeSelectHtml,
        makeRadioHtml,
        saveProperty,
        elementKeydown,
        showDataField,
        getDataTypeHtml,
        getDataPatternHtml,
        getSelectHtml,
        getFileSource,


        //전역 변수
        element_nums,
        g_show_table_panel,
        g_table_edit_mode = false,
        g_dropped_item,
        g_dropped_item_prev,
        g_selected_element, //클릭한 엘레멘트
        g_selected_container,
        g_selected_object,
        g_has_html, //html의 보유 여부
        g_has_option,   //option 보유 여부
        object_id,
        item_delete_confirm = 'n',
        g_select_mode = 'element',  //container or element
        g_content_editable = true,
        g_prev_select_mode = '',
        g_cutted_object = null,
        msg_2;

        //메시지
        var message = {
            element_mode	: '캔버스의 개체 추가가 중지되었습니다.',
            layout_mode	    : '캔버스의 개체 추가가 재개되었습니다.',
            copied          : '개체가 복사되었습니다(ctrl+c)',
            notcopied       : '개체 복사에 실패하였습니다!',
            pasted          : '개체를 붙여넣었습니다(ctrl+v)',
            notpasted       : '개체 붙여넣기에 실패하였습니다!',
            table_not_selected       : '선택된 테이블이 없습니다',
            object_not_selected       : '선택된 개체가 없습니다',
            empty: 'please put something here',
            container_mode  : '컨테이너 편집 모드입니다.',
            element_mode: '개체 편집 모드입니다.',

            item_delete: '선택하신 필드를 삭제하시겠습니까?'
        };
	
    var alertTxt;
    
    initPage = function () {
        
        elementDraggable(); // toolbox 개체를 캔버스에 드래그 가능하도록 함.
        elementSelectable(); 
        selectMode('default');
        containerSelectable();
        canvasDroppable('#canvas', 'canvas' );
        showAttr();
        bindPropertyMenu();    //top object manage button
        elementPanel.init();
        containerPanel.init();

        $('div.col2').bind('click', function (event) {
            if (tableEditMode() == 'table') {
                //tableEditMode('element');
            }
        });
        //캔버스 여백 클릭
        $('#canvas').bind('click', function (event) {
            if (window.console) {
            	//console.log('click');
            }
            canvasMode.init();

            // [16-04-06] kimhs, canvas 빈 공간 클릭 시 focus 잃도록 처리
            XFORM.form.quit();
        });

        /*
        properties      : 속성보기
        editorsource    : 소스편집
        templatelink    : 템플릿
        viewlink        : 기안조회연동
        writelink       : 완료저장연동
        */
        Common.getBaseConfigList(["XFormType", "EditorType"]);
        //  공통에서 사용하는 기초 설정이 개발되면 변경
        if (coviCmn.configMap["XFormType"] == "1") {        // 전체기능
            $('#properties').css('display', '');
            $('#editorsource').css('display', '');
            $('#templatelink').css('display', '');
            $('#viewlink').css('display', '');
            $('#writelink').css('display', '');
        } else if (coviCmn.configMap["XFormType"] == "2") {  // 기본기능
            $('#properties').css('display', '');
            $('#editorsource').css('display', '');
            $('#templatelink').css('display', '');
        } else {
            $('#properties').css('display', '');
            $('#editorsource').css('display', '');
            $('#templatelink').css('display', '');
        }

    };
    //create element id for manipulating table
    addTableId = function () {
        $('#canvas table.sortable').each( function(){
            if( $(this).prop('id') === '' ){
                $(this).prop('id', newId() );
            }
        });
    };

    tableEditEnable = function (el) {
        var $el = el;
        $el.addClass('block_fixed');

        REDIPS.table.mark_enable = true;

        //oDropped.highlight();
        //tableResizable($el); // [16-05-26] kimhs, 지정된 size 유지되도록 주석 처리
        //enable cell merge & split
        if(window.console) {
        	//console.log('table edit enabled');
        }
        XFORM.table.init();

        //table row drag
        //tableDnD.init(selectedCon()[0]);
    }

    tableEditDisable = function (el) {
        //table row drag
        if( selectedCon()[0].tagName.toUpperCase() == 'TABLE'){
            tableDnD.terminate(selectedCon()[0]);
        }

        REDIPS.table.unmark(selectedCon()[0]);
        REDIPS.table.mark_enable = false;
    }
    
    showStatus = function (msg) {
        var m;
        if(typeof msg === 'undefined'){
            m = alertTxt;
        }else{
            m = msg;
        }
        $('.canvas-status').html(m);
    };
    //도구상자의 개체에 대한 drag 지원
    elementDraggable = function (mode) {
        if(mode === false){
            alertTxt = message.element_mode;
        }else{
            if($('#block li').data('draggable')){
                $('#block li').draggable({ disabled : false });
                $('#element li').draggable({ disabled: false });
                $('#quick li').draggable({ disabled: false });
                alertTxt = message.layout_mode;
            }else{
                $('#element li:not(.element-preview)').addClass('draggable-item');
                $('#block li:not(.element-preview)').addClass('draggable-item');
                $('#quick li:not(.element-preview)').addClass('draggable-item');
                
                //source draggable
                $('#element li:not(.element-preview)').draggable({
                    connectToSortable: '.sortable td, .sortable-container',
                    revert: 'invalid',
                    handle: ".drag-handle",
                    helper: function() {
                        var helper = $(this).clone();
                        helper.css({'border':'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity':'0.3' });
                        return helper;
                    }
                });
                
                //source draggable
                $('#block li:not(.element-preview), #quick li:not(.element-preview)').draggable({
                    connectToSortable: '#canvas',
                    revert: 'invalid',
                    handle: ".drag-handle",
                    cancel: ".add-canvas, .preview",
                    helper: function() {
                        var helper = $(this).clone();
                        helper.css({'border':'solid 1px #777', 'width': '120px', 'height': '20px', 'background-color': '#999', 'opacity':'0.3' });
                        return helper;
                    }
                });

            }
        }
    };  

    containerUnDroppable = function (el) {
        var $el, $target;
        $el = (typeof el === 'object') ? el : $(el);

        $target = $el.find('td, th');
        $target.sortable('destroy');
    };
    //컨테이너에 개체를 담을 수 있도록 처리
    containerDroppable = function(el, mode, action){

        var $el;
        var shtml;
        var oElement;
        var $drag;
        var oDropped;
        var connect_with;
        var $target=null;
        
        $el = (typeof el === 'object') ? el : $(el);
        if(mode=='container'){
            $target = $el;
            connect_with = '.sortable td, .sortable-container';
        } else if (mode == 'table') {
            $target = $el.find('td');
            connect_with = '.sortable td, .sortable-container';
        }
        
        if(action == 'enable'){
            if($target != null) $target.sortable( 'enable' );
            return;
        }else if(action == 'disable'){
        	if($target != null) $target.sortable( 'disable' );
            return;
        }        
        //target sortable & table to non-table
        if($target != null){
            $target.sortable({
                connectWith: connect_with, 
                placeholder: 'placeholder',
                opacity: 0.6,
                cursor: 'move',
                tolerance: "pointer",
                distance: 5,
                cancel: null,
                //handle: '.ui-icon', //}cancel: ':input,button,.contenteditable', //for editing label, h2
                start: function(event, ui) { 
                    if(window.console) {
                    	//console.log('start');
                    }
                },
                update: function(e, ui)
                {
                    if(window.console) {
                    	//console.log('attach');
                    }
                    $drag = $(ui.item);
                    
                    if( $drag.hasClass('draggable-item') ) {
                        //element type
                        var el_type = $drag.attr('data-field');
                        //get html  
                        // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
                        if (el_type == "viewlink_d_text" || el_type == "viewlink_w_text" || el_type == "viewlink_s_text") {
                            var el_type2 = $drag.attr('data-connect');
                            var el_type3 = $drag.attr('data-table');
                            var el_type4 = $drag.attr('data-map');
                            shtml = getElementHtml_ViewLink(el_type, el_type2, el_type3, el_type4);
                        }
                        // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
                        else if (el_type == "writelink_d_text" || el_type == "writelink_w_text" || el_type == "writelink_s_text") {
                            var el_type2 = $drag.attr('data-connect');
                            var el_type3 = $drag.attr('data-table');
                            var el_type4 = $drag.attr('data-map');
                            shtml = getElementHtml_WriteLink(el_type, el_type2, el_type3, el_type4);
                        }
                        // XForm 고도화 - 템플릿
                        else if (el_type == "template_html") {
                            var templateID = $drag.attr('templateidx');
                            shtml = getElementHtml_TemplateLink("SELECT", templateID);
                        }
                        else {
                            shtml = getElementHtml(el_type);
                        }
                        
                        oElement = renderElement($(shtml)); //추가 개체의 기본속성 부여
                        //wrap up drop element 
                        if(window.console) {
                        	//console.log(mode);
                        }
                        
                        oDropped = $(ui.item).parent();
                        //and remove original element
                        $(ui.item).after(oElement);
                        $(ui.item).remove();
                        
                        if (oElement.prop('id') == '') oElement.prop('id', newId());
                        elementSelectable(oElement);
                    }
                    if(window.console) {
                    	//console.log('el_type: '+el_type);
                    }

                    dropCallback(oElement);
                }
            });        	
        }
    };

    popBlockCustom = function (el_type) {
        if(typeof el_type !== 'undefined'){
            if (el_type.toLowerCase() == 'table') {
                $('#table_design').click();
            }
        }
    }
    //컨테이너(테이블, DIV)를 캔버스에 추가
    addToCanvas = function (el) {
        //element type
        var $el,el_type,oElement;
        var shtml;
        if(typeof el === 'object'){
            $el = el;
            el_type = $el.parent().attr('data-field');
        }else{
            el_type = el;
        }

        //get html
        // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
        if (el_type == "viewlink_d_text" || el_type == "viewlink_w_text" || el_type == "viewlink_s_text") {
            var el_type2 = $el.parent().attr('data-connect');
            var el_type3 = $el.parent().attr('data-table');
            var el_type4 = $el.parent().attr('data-map');
            shtml = getElementHtml_ViewLink(el_type, el_type2, el_type3, el_type4);
        }
        // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
        else if (el_type == "writelink_d_text" || el_type == "writelink_w_text" || el_type == "writelink_s_text") {
            var el_type2 = $el.parent().attr('data-connect');
            var el_type3 = $el.parent().attr('data-table');
            var el_type4 = $el.parent().attr('data-map');
            shtml = getElementHtml_WriteLink(el_type, el_type2, el_type3, el_type4);
        }
        // XForm 고도화 - 템플릿
        else if (el_type == "template_html") {
            var templateID = $el.attr('templateidx');
            shtml = getElementHtml_TemplateLink("SELECT", templateID);
        }
        else {
            shtml = getElementHtml(el_type);
        }
        oElement = renderElement($(shtml)); //추가 개체의 기본속성 부여
    
        if(el_type.indexOf('table') > -1){
            $('#canvas').append(oElement);
            oElement.addClass('sortable');
            containerDroppable(oElement, 'table' );
        }else{
            $('#canvas').append(oElement);
            oElement.addClass('sortable-container');
            containerDroppable(oElement, 'container' );
        }
        
        if (oElement.prop('id') == '') oElement.prop('id', newId());
        //click event binding
        containerSelectable(oElement, el_type);
        // init table on added
        popBlockCustom(el_type);

        //drop 후 기본 선택
        containerSelected(oElement);
        
        //컨테이너 이동시 포커스와 속성 정보는 변경되지 않음
        //containerSelected 대신 objectDropped 사용
        objectDropped(oElement);

        //click, focus, and make editable        
        bindContentEditable(oElement);
        
        return oElement;
        
    };


    // [2016-02-23 leesm] Magic Paste 사용시 엑셀 디자인은 포함되지 않음 수정
    //컨테이너(테이블, DIV)를 캔버스에 추가
    appendHtmlToCanvas = function (html) {
        var oElement = $(html);
        oElement = $(oElement).not("font");
        var el_type = oElement.prop('tagName');

        if (el_type.toUpperCase().indexOf('TABLE') > -1) {
            $('#canvas').append(oElement);
            oElement.addClass('sortable');
            containerDroppable(oElement, 'table');
        } else {
            $('#canvas').append(oElement);
            oElement.addClass('sortable-container');
            containerDroppable(oElement, 'container');
        }

        if (oElement.prop('id') == '') oElement.prop('id', newId());
        //click event binding
        containerSelectable(oElement, el_type);

        //drop 후 기본 선택
        containerSelected(oElement);

        //컨테이너 이동시 포커스와 속성 정보는 변경되지 않음
        //containerSelected 대신 objectDropped 사용
        objectDropped(oElement);

        //click, focus, and make editable        
        bindContentEditable(oElement);

        // [16-04-06] kimhs, 적용한 스타일 그대로 저장하기 위하여 주석척리
        //css-table_10
        //if (oElement.prop('tagName').toUpperCase() == 'TABLE') {
        //    oElement.addClass('table_10');
        //}
        //oElement.css('width', '100%');

        return oElement;

    };
    //엘레멘트(컨테이너가 아닌)를 캔버스에 추가
    addToContainer = function (el) {
        //element type
        var $el = el;
        var el_type = $el.parent().attr('data-field');
        //get html
        var shtml;
        // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
        if (el_type == "viewlink_d_text" || el_type == "viewlink_w_text" || el_type == "viewlink_s_text") {
            var el_type2 = $el.parent().attr('data-connect');
            var el_type3 = $el.parent().attr('data-table');
            var el_type4 = $el.parent().attr('data-map');
            shtml = getElementHtml_ViewLink(el_type, el_type2, el_type3, el_type4);
        }
        // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
        else if (el_type == "writelink_d_text" || el_type == "writelink_w_text" || el_type == "writelink_s_text") {
            var el_type2 = $el.parent().attr('data-connect');
            var el_type3 = $el.parent().attr('data-table');
            var el_type4 = $el.parent().attr('data-map');
            shtml = getElementHtml_WriteLink(el_type, el_type2, el_type3, el_type4);
        }
        // [2016-03-31 leesm] XForm 고도화-템플릿. 컨트롤 HTML 생성.
        else if (el_type == "template_html") {
            var templateID = $el.attr('templateidx');
            shtml = getElementHtml_TemplateLink("SELECT", templateID);

            //appendHtmlToCanvas(shtml);
            $(shtml).each(function (i, obj) {
                if ($(obj)[0].outerHTML != undefined)
                    appendHtmlToCanvas($(obj)[0].outerHTML); // div로 감싸지 않고 그대로 추가
                                                             // div와 table에 동일한 클래스가 적용되어 따로 처리
            });

            return;
        } else {
            shtml = getElementHtml(el_type);
        }

        if (shtml != undefined) {            
            //var oElement = $(shtml);
            var oElement = renderElement($(shtml)); //추가 개체의 기본속성 부여
            //div 컨테이너를 먼저 생성하고, 개체를 추가(개별 개체는 캔버스에 바로 추가 할 수 없음 - 정책)        
            var oBlock = addToCanvas('div');
            oBlock.append(oElement);

            if (oElement.prop('id') == '') oElement.prop('id', newId());
            //click event binding
            elementSelectable(oElement);
        }
    };

    checkObjSelected = function () {
        if (typeof g_selected_object === 'undefined'){
            alertTxt = message.object_not_selected;
            return false;
        };
        return true;
    }

    selectMode = function (mode) {

        var s_mode = mode;
        if (typeof s_mode === 'undefined') return g_select_mode;

        var $containers = $('#canvas .sortable-container, #canvas .sortable');
        var $elements = $('#canvas .sortable-container .xform-element, #canvas table.sortable th, #canvas table.sortable td');

        if (typeof $containers.data('events') === 'undefined') {
            alertTxt = '캔버스 이벤트 연결 오류';
            showStatus(alertTxt);
            return;
        }

        var container_click_handler = ($containers.length > 0) ? $containers.data("events")['click'] : null;
        var element_click_handler = ($elements.length > 0) ? $elements.data("events")['click'] : null;
        var container_of_element, firstchild_of_container;
        
        //var $el;
        if (s_mode == 'default') s_mode = g_select_mode;

        if (s_mode == 'container') {
            g_select_mode = s_mode;
            $elements.data("events")['click'] = null;
            if(container_click_handler) $containers.data("events")['click'] = container_click_handler;

            alertTxt = message.container_mode;
            if(typeof g_selected_object !== 'undefined' && g_selected_object != null){
                container_of_element = g_selected_object.closest('.sortable-container, .sortable');
                container_of_element.trigger('click');
            }

        } else if (s_mode == 'element') {
            g_select_mode = s_mode;
            $containers.data("events")['click'] = null;
            if (element_click_handler) $elements.data("events")['click'] = element_click_handler;
            $elements.removeClass('no-hover');
            alertTxt = message.element_mode;

            //firstchild_of_container;
            if (typeof g_selected_object !== 'undefined' && g_selected_object != null) {
                if (g_selected_object.prop('tagName').toLowerCase() == 'table') {
                    firstchild_of_container = g_selected_object.find('th, td').first();
                } else {
                    firstchild_of_container = g_selected_object.find('*').first();
                }
                firstchild_of_container.trigger('click');
            }
        }

        showStatus(alertTxt);

        showModeStatus();
    }
    //el = container
    //컨테이너 개체 유형 정의
    getElements = function (el) {
        var $elements;
        if( typeof el === 'undefined') {
            $elements = $('#canvas .sortable-container .xform-element, #canvas table.sortable th, #canvas table.sortable td');
            //$elements = $('#canvas .xform-element, #canvas table.sortable th, #canvas table.sortable td');
        } else {
            // [2016-02-16 leesm] div 복제할 때 radio 버튼 Edit 팝업이 뜨지 않아서 수정함
            $elements = el.find('.xform-element, th, td, input, select, textarea, span, p, label, a, button, img, .xform-radio, .xform-checkbox');
        }
                
        return $elements;
    }
    //el = container
    //컨테이너 개체 유형 정의
    getGroupElements = function (el) {

        var $children = el.find('.xform-element, th, td, input, select, textarea, span, p, label, a, button, img');
        var $elements = el.add($children);

        return $elements;
    }
    //el = object
    elementSelectable = function (el) {
        var $el;

        // [2016-02-15 leesm] Checkbox 옵션 변경 시 Radio 로 변경되는 현상으로 xform-checkbox 추가함
        if( typeof el === 'undefined') {
            $el = getElements();
        } else if (el.hasClass('sortable-container') || el.hasClass('sortable')) {
            $el = getElements(el);
        } else if (el.hasClass('xform-radio')) {
            $el = getGroupElements(el);
        } else if (el.hasClass('xform-checkbox')) {
            $el = getGroupElements(el);
        } else {
            $el = el;
        }

        $el.unbind('click').bind('click', function (event) {            
            //debug
            if (g_select_mode == 'element' || g_table_edit_mode)
                event.stopPropagation();
            //A 태그를 선택하기 위해 클릭하는 경우 href 링크로 이동하지 않도록 하기 위함.
            //ctrl+click 한 경우에만 링크가 동작함
            if ($(this).prop('tagName').toLowerCase() == 'a') {
                if (event.ctrlKey) {
                    return;
                } else {
                    event.preventDefault();
                }
            }

            element_click($(this));
            
            // [16-05-23] kimhs, checkbox or radio의 부모 노드의 경우 복사 붙여넣기 되지않아 기본 이벤트 동작 막음
            if ($(this).is('.group-focus')) {
                event.preventDefault();
            }
        });
        //Unbind() 추가하지 말 것 - sortable 이벤트가 취소됨!
        $el.bind('mousedown', function (event) {
            if (event.button == 2) {
                //debug
                if (g_select_mode == 'element' || g_table_edit_mode)
                    event.stopPropagation();
            }
        });
        
        // [2016-02-15 leesm] Checkbox 옵션 변경 시 Radio 로 변경되는 현상으로 xform-checkbox 추가함
        $el.unbind('dblclick').bind('dblclick', function (event) {
            if (g_select_mode == 'element' || g_select_mode == 'container') {
                var xformRdo = $(this).closest('.xform-radio');
                var xformChk = $(this).closest('.xform-checkbox');

                // [16-04-05] kimhs, 실행되지 않는 구조로 주석 처리
                // [16-04-29] kimhs, xformRdo, xformChk의 length가 1 이상일 때 실행되도록 수정
                //if (1 == 0 && xformRdo.length > 0) {
                //    event.stopPropagation();
                //    elementModal(xformRdo);
                //} else if (1 == 0 && xformChk.length > 0) {
                //    event.stopPropagation();
                //    elementModal(xformChk);
                //} else
                if ($(this).find("input").prop('type') != null && ($(this).find("input").prop('type').toLowerCase() == 'radio' || $(this).find("input[type=radio]").length > 0) && xformRdo.length > 0) {
                    event.stopPropagation();
                    elementModal(xformRdo);
                } else if ($(this).find("input").prop('type') != null && ($(this).find("input").prop('type').toLowerCase() == 'checkbox' || $(this).find("input[type=checkbox]").length > 0) && xformChk.length > 0) {
                    event.stopPropagation();
                    elementModal(xformChk);
                } else {
                    // 체크박스 추가 시 라벨 안에 있는 체크박스 클릭 시 상단의 라벨 속성창이 뜨도록 수정
                    // 라디오박스 추가 시 라벨 안에 있는 라디오박스 클릭 시 상단의 라벨 속성창이 뜨도록 수정
                    // [16-04-26] kimhs, 라벨 외 DIV, SPAN으로 묶일 수도 있어 조건 변경
                    if ($(this).is(':checkbox') && $(this).parent().attr('class').indexOf("xform-checkbox") > -1) {
                        event.stopPropagation();
                        g_selected_object = $(this).parent(); // input 객체 클릭하여 속성 저장 시, 라벨에 html이 추가되어 수정
                        elementModal(xformChk);
                    } else if ($(this).is(':radio') && $(this).parent().attr('class').indexOf("xform-radio") > -1) {
                        event.stopPropagation();
                        g_selected_object = $(this).parent();
                        elementModal(xformRdo);
                    } else {
                        event.stopPropagation();
                        elementModal();
                    }
                }
            }
            
        });
    };

    //개체의 속성을 편집하는 팝업 레이어(속성편집창)
    elementModal = function (el) {
        var $el;
        if (typeof el === 'undefined') {
            $el = g_selected_object;
        } else if (el === 'container') {
            $el = g_selected_container;
        } else {
            $el = el;
        }
        if ($el == undefined) {
            alert('편집할 개체가 선택되지 않았습니다\n다시 선택해 주세요');
            return;
        }
        if ($el.is(':checkbox, :radio') && $el.parent().is('.xform-checkbox, .xform-radio')) { // [16-04-26] kimhs, 체크박스, 라디오의 경우 input 객체를 감싸고 있는 Label의 속성창 띄워주기
            $el = $el.parent();
        }

        // [16-04-26] kimhs, TD혹은 TH의 경우 태그명을 바꿀 수 있도록 수정
        // [16-04-29] kimhs, TD, TH 수정시 select box 사용
        var tmpNodeName = $el[0].nodeName.toUpperCase();
        $('#property_popup').find('[data-field-id=type]').remove();
        if (tmpNodeName == 'TD' || tmpNodeName == 'TH')
            $('.attr-container-type').find('td').eq(1).append('<select name="type" data-field-id="type" class="xform-builder"><option value="TD">TD</option><option value="TH">TH</option></select>');
        else
            $('.attr-container-type').find('td').eq(1).append('<span class="xform-builder" data-field-id="type">' + tmpNodeName + '</span>');

        var el_type = $el.prop('tagName').toLowerCase();
        var has_html = 'p,h,h1,h2,h3,label,span,div,td,th,textarea,a'.split(','); // [16-05-19] kimhs, 속성창에서 a태그 html 수정가능하도록 추가
        var has_html_attr = (has_html.indexOf(el_type) > -1) ? true : false;

        //popup
        var $popup = $('#property_popup');
        var title ='속성 추가/편집창';
        var $title = $popup.find('.title');
        var $html;
        //default load

        //html editor 대신 textarea를 기본으로 띄움
        $('#property_popup [name=attr_disp_opt][value=textarea]').trigger('click');

        var tag_type = (typeof ($el.prop('type') === 'undefined') || $el.prop('type') === 'undefined') ? '' : $el.prop('type');
        //if (tag_type == 'undefined') tag_type = '';
        if (tag_type != '') tag_type = '[' + tag_type + ']';
        
        loadAttr($el,'type', $el.prop('tagName') + tag_type);
        loadAttr($el, 'id');
        loadAttr($el, 'value');
        loadAttr($el, 'class');
        loadAttr($el, 'name');
        loadAttr($el, 'style');
        loadAttr($el, 'html');

        if (el_type == 'a') {
            hideAttr('href', false);
            hideAttr('target', false);
            loadAttr($el, 'href');
            loadAttr($el, 'target');
        } else {
            hideAttr('href', true);
            hideAttr('target', true);
        }

        hideAttr('data-node-name', true);
        $('.apply_all').css('display', ''); // 모두적용 버튼 보이기
        loadElementOptions($el, 'options');  //not option!

        //html() 을 가진 개체
        if (has_html_attr) {
            g_has_html = true;
            hideAttr('html', false);
        } else {
            g_has_html = false;
            hideAttr('html', true);
        }

        // [16-06-01] kimhs, cancel 및 모두적용 기능 추가
        $popup.find('.apply_all').unbind().bind('click', function (event) { // 모두 적용
            var tmpVal = $('#property_popup input[data-field-id="id"]').val() == '' ? $('#property_popup input[data-field-id="name"]').val() : $('#property_popup input[data-field-id="id"]').val();
            var tmpObj;

            if (tmpVal != '' && el_type.toLowerCase() == 'textarea') {
                if ($('input[name=attr_disp_opt]:checked').val() == 'textarea') {
                    tmpObj = $('#property_popup textarea[data-field-id="html"]');
                    tmpObj.val(tmpObj.val().replace(/{{ doc.BodyContext..* }}/g, ('{{ doc.BodyContext.' + tmpVal + ' }}')));
                    //tmpObj.val(tmpObj.val().replace(/{{ doc.BODY_CONTEXT..* }}/g, ('{{ doc.BODY_CONTEXT.' + tmpVal + ' }}')));
                }
                else {
                    tmpObj = $('#property_popup div .jqte_editor');
                    tmpObj.text(tmpObj.text().replace(/{{ doc.BodyContext..* }}/g, ('{{ doc.BodyContext.' + tmpVal + ' }}')));
                    //tmpObj.text(tmpObj.text().replace(/{{ doc.BODY_CONTEXT..* }}/g, ('{{ doc.BODY_CONTEXT.' + tmpVal + ' }}')));
                }
            }
            if (tmpVal != '') {
                tmpObj = $('#property_popup input[data-field-id="value"]');
                tmpObj.val(tmpObj.val().replace(/{{ doc.BodyContext..* }}/g, ('{{ doc.BodyContext.' + tmpVal + ' }}')));
                //tmpObj.val(tmpObj.val().replace(/{{ doc.BODY_CONTEXT..* }}/g, ('{{ doc.BODY_CONTEXT.' + tmpVal + ' }}')));
            }

            event.preventDefault();
        });

        $popup.find('.cancel').unbind().bind('click', function (event) { // 취소 버튼
            event.preventDefault();
        });

        //팝업의 속성 정보 저장
        $popup.find('.ok').unbind().bind('click', function (event) {
            makeElementOptions($popup, $el);

            //save data to dom
            if ($('#property_popup').find('select[data-field-id=type]').length > 0) { // [16-04-26] kimhs, TD혹은 TH의 경우 태그명을 바꿀 수 있도록 수정
                setPanel('type');
            }
            if ($('#property_popup').find('input[data-field-id="data-node-name"]').length > 0) { // [16-06-01] kimhs, checkbox, radio의 경우 입력된 값으로 data-node-name 속성 변경
                setPanel('data-node-name');
            }

            setPanel('id');
            setPanel('name');
            setPanel('class');
            setPanel('style');
            setPanel('value'); //???
            setPanel('html');

            if (el_type == 'a') {
                setPanel('href');
                setPanel('target');
            }
            //$('.property-area').find('[data-field-id="html"]').val($html.val());
            $('.property-apply').click();

            //$popup.find('*').unbind();
            event.preventDefault();
            $('.modal_close').click();
        });
        //팝업 HTML 보기 버튼 
        $('#show_html').unbind().bind('click', function () {
            if ($(this).is(':checked')) {
                makeElementOptions($popup, $el);
                hideAttr('html', false);
            } else {
                hideAttr('html', true);
            }
        });

        //modal trigger(anchor)
        $('#modal_popup').click();
        //default: show option
        $('#property_popup .selectBox').find('.selectOptions').show();
    };

    //선택 개체의 해당 속성(fieldid)을 표시
    loadAttr = function (el, fieldid, value) {
        var $d, $s;
        var $el = el;

        //data-field-id = 태그의 속성명
        $d = $('#property_popup').find('[data-field-id=' + fieldid + ']');

        //value 속성을 갖는 개체인지 확인하여 value 또는 text 표시
        if (typeof value === 'undefined') {
            $d.val(''); //초기화
            $s = $('.property-area').find('[data-field-id='+fieldid+']');
            if(typeof $s !== 'undefined' && typeof $d !== 'undefined')
                $d.val( $s.val() );
        } else {
            if (fieldid == 'type') // [16-04-29] kimhs, TD, TH 수정시 select box 사용
                $d.val(value).attr("selected", "selected");
            else
                $d.text( value );
        }
    };
    
    hideAttr = function (fieldid, opt) {
        var $d = $('#property_popup').find('[data-field-id='+fieldid+']');
        if (typeof $d !== 'undefined') {
            if (typeof opt === 'undefined' || opt == true) {
                $d.hide();
                $d.closest('.attr-container').hide();
            } else {
                $d.show();
                $d.closest('.attr-container').show();
            }
        }
    };
    
    // [2016-02-15 leesm] Checkbox 옵션 변경 시 Radio 로 변경되는 현상으로 xform-checkbox 추가함
    loadElementOptions = function (el, fieldid) {
        var $el = el;
        //converted html option

        var el_type = $el.prop('tagName').toLowerCase();
        var el_class = $el.prop('class').toLowerCase();

        var has_html_option = 'select'.split(',');
        var radio_class = 'xform-radio';
        var checkbox_class = 'xform-checkbox';

        var has_select_attr = (has_html_option.indexOf(el_type) > -1) ? true : false;
        var has_radio_attr = (el_class.indexOf(radio_class) > -1) ? true : false;
        var has_checkbox_attr = (el_class.indexOf(checkbox_class) > -1) ? true : false;

        //get html
        var html;
        if (has_select_attr) {
            g_has_option = true;
            html = getHtmlOption(el);
            $('.apply_all').css('display', 'none'); // 모두적용 버튼 숨김
        } else if (has_radio_attr || has_checkbox_attr) {
            g_has_option = true;
            html = getRadioOption(el);

            // [16-06-01] kimhs, checkbox, radio의 경우 data-node-name 속성 편집가능하도록 보여주기
            hideAttr('data-node-name', false);
            loadAttr($el, 'data-node-name');
            $('.apply_all').css('display', 'none'); // 모두적용 버튼 숨김
        } else {
            g_has_option = false;
            html = '';
        }

        //html bind
        if (g_has_option) {
            var $d = $('#property_popup').find('[data-field-id=' + fieldid + ']');
            bindHtmlOption($d, $el, html, has_radio_attr, has_checkbox_attr);
            //show option
            hideAttr('options', false);
            //hide html
            if( !$('#show_html').is(':checked') )
                hideAttr('html', true);
        } else {
            //option-less
            //show html
            hideAttr('options', true);
        }

    };
    
    getHtmlOption = function (el) {
        var $el = el;
        var k, v, h='';
        $el.children('option').each(function(){
            v = $(this).prop('value');
            k = $(this).text();
            
            if (typeof v == 'undefined') v = '';
            if (typeof k == 'undefined') k = '';

            h += '<span class="selectOption">';
            h += '<p class="handle"></p>';
            h += '<span class="key">'+k+'</span>';
            h += '<span class="value">'+v+'</span>';
            h += '<span class="del">-</span>';
            h += '</span>';
        });
        
        return h;
    };
    /*<label><input type="radio" name="wLWUT" value="y">Yes</label><label><input type="radio" name="wLWUT" value="n">No</label>*/
    getRadioOption = function (el) {
        var $el = el;
        var k, v, h = '';
        if ($el.length > 0) { // [16-04-05] kimhs, Radio & CheckBox label 제거로 인해 수정
            $el.find(':radio, :checkbox').each(function () {
                // var $opt = $(this);
                v = $(this).prop('value');
                k = $(this).attr('data-text');

                if (typeof v == 'undefined') v = '';
                if (typeof k == 'undefined') k = '';

                h += '<span class="selectOption">';
                h += '<p class="handle"></p>';
                h += '<span class="key">' + k + '</span>';
                h += '<span class="value">' + v + '</span>';
                h += '<span class="del">-</span>';
                h += '</span>';
            });
        }
        
        return h;
    }
    
    bindHtmlOption = function (el, src, html, radio_opt, check_opt){
        var $el = el;
        var $src = src;
        var $sel = $el;
        var $options = $el.find('.selectOptions');
        $options.children('.selectOption').remove();
        $options.append(html);
        
        var $opt = $el.find('.selectOption');
        var $selected = $el.children('span.selected');
        var $help = $el.find('.selectHelp');
        
        $help.hide();
    	    
        $selected.html($options.children('span.selectHelp').html());

        $selected.unbind().click(function (event) {
            event.stopPropagation();
            if($options.css('display') == 'none'){
                $options.css('display','block');
            }
            else
            {
                $options.css('display','none');
            }
        });
		
        $opt.find('span.key, span.value').attr('contentEditable',true);
        $opt.click(function(){
            focusOption($(this));
        });
        // [16-04-21] kimhs, 붙여넣기 시, span 태그 자체가 추가되어 수정
        $opt.find('span.key, span.value').unbind('paste').bind('paste', function (e) {
            var $obj = $(this);
            setTimeout(function (e) {
                $obj.html($obj.text());
            }, 0); // 일종의 트릭, 값이 바뀐 후 html 요소를 제거하고 text만 넣어주기
        });
		
        $el.find('.del').click( function(){ bindDel( $(this) ); });        
        $el.find('.add').click(function () { bindAdd($(this)); });

        $('.new_option').unbind('click').bind('click', function () {
            var $h = $('<span class="selectOption" />');
            $h.append('<p class="handle"></p>')
                .append('<span class="key">Name</span>')
                .append('<span class="value">Value</span>')
                .append('<span class="del">-</span>')
                .append('</span>')
                .appendTo($options)
                .find('span.key, span.value')
                .attr('contentEditable', true);

            // [16-04-05] kimhs, 새로 추가된 속성 삭제되도록 수정 
            $options.find('.del').click(function () { bindDel($(this)); });
            // [16-04-21] kimhs, 붙여넣기 시, span 태그 자체가 추가되어 수정
            $options.find('span.key, span.value').unbind('paste').bind('paste', function (e) {
                var $obj = $(this);
                setTimeout(function (e) {
                    $obj.html($obj.text());
                }, 0); // 일종의 트릭, 값이 바뀐 후 html 요소를 제거하고 text만 넣어주기
        });
        });

        $options.sortable({ handle: '.handle' });

        // [2016-02-15 leesm] Checkbox 옵션 변경 시 Radio 로 변경되는 현상으로 xform-checkbox 추가함
        $sel.removeClass('mode-radio');
        $sel.removeClass('mode-checkbox');
        
        if (radio_opt) {
            $sel.addClass('mode-radio');
        } else if (check_opt) {
            $sel.addClass('mode-checkbox');
        }
        
        $('div.selectBox').click(function (event) {
            event.stopPropagation();
        });
    };

    //put element options to [html] field
    // [2016-02-15 leesm] Checkbox 옵션 변경 시 Radio 로 변경되는 현상으로 xform-checkbox 추가함
    makeElementOptions = function (el_modal, el_src) {

        if (!g_has_option) return;

        var $el_modal = el_modal;
        var $el_src = el_src;
        var $selectBox = $el_modal.find('.selectBox');
        var option_html;

        $el_src.attr('data-node-name', $el_modal.find('input[data-field-id="data-node-name"]').val()); // 입력한 data-node-name 값으로 변경

        if ($selectBox.hasClass('mode-checkbox')) {
            option_html = makeCheckHtml($selectBox, $el_src);
        } else if ($selectBox.hasClass('mode-radio')) {
            option_html = makeRadioHtml($selectBox, $el_src);
        } else {
            option_html = makeSelectHtml($selectBox);
        }

        $('#property_popup').find('[data-field-id=html]').val(option_html);
        //$el_modal.find('div.selectOptions').css('display', 'none');
    };
    
    makeSelectHtml = function (el){
        var $el = el;
        var $key,$val,html_opt = '';
        $el.find('.selectOption').each( function(){
            $key = $(this).children('.key');
            $val = $(this).children('.value');

            html_opt += '<option value="'+$val.text()+'">'+$key.text()+'</option>';
        })
        
        return html_opt;
    };
    
    makeRadioHtml = function (el, n){
        var $el = el;
        var $key, $val, html_opt = '';
        var $n = n;

        // [16-04-22] kimhs, 멀티로우(rField) 라디오버튼 속성 저장 시 태그 오류 수정
        if (g_selected_object.attr("data-type") == 'mField') {
            // [2016-02-15 leesm] XForm CheckBox 오류 수정
            // [16-04-05] kimhs, Radio & CheckBox label 제거로 인해 수정
            for (var i = 0; i < $el.find('.selectOption').length; i++) {
                $key = $el.find('.selectOption').children('.key').eq(i).text();
                $val = $el.find('.selectOption').children('.value').eq(i).text();
                if (typeof $key == 'undefined') $key = '';
                if (typeof $val == 'undefined') $val = '';

                html_opt += '<input type="radio"';
                html_opt += ' name="' + $n.attr('data-node-name') + '" value="' + $val + '" data-text="' + $key + '">' + $key;
            }
        } else if (g_selected_object.attr("data-type") == 'rField') {
            var seq = makeId();

            for (var i = 0; i < $el.find('.selectOption').length; i++) {
                $key = $el.find('.selectOption').children('.key').eq(i);
                $val = $el.find('.selectOption').children('.value').eq(i);
                html_opt += '\n<input type="radio"';

                html_opt += ' name="' + ($n.find('input').eq(i).attr('name') == '' ? 'XFORM_ELID_' + seq : $n.find('input').eq(i).attr('name')) + '" value="' + $val.text() + '" data-text="' + $key.text() + '" data-face-for="' + $n.attr('data-node-name') + '" >' + $key.text();
            }

            html_opt += '\n<input type="text" name="' + $n.attr('data-node-name') + '" style="display: none;" data-face-real="y" >\n';
        }
        
        return html_opt;
    };
    
    // [2016-02-15 leesm] Checkbox 옵션 변경 시 Radio 로 변경되는 현상으로 xform-checkbox 추가함
    makeCheckHtml = function (el, n) {
        var $el = el;
        var $key, $val, html_opt = '';
        var $n = n;

        // [16-04-22] kimhs, 멀티로우(rField) 체크박스 속성 저장 시 태그 오류 수정
        if (g_selected_object.attr("data-type") == 'mField') {
        // [16-04-05] kimhs, Radio & CheckBox label 제거로 인해 수정
        for (var i = 0; i < $el.find('.selectOption').length; i++) {
            $key = $el.find('.selectOption').children('.key').eq(i).text();
            $val = $el.find('.selectOption').children('.value').eq(i).text();
            if (typeof $key == 'undefined') $key = '';
            if (typeof $val == 'undefined') $val = '';

            html_opt += '<input type="checkbox"';
            var seq = makeId();                
            html_opt += ' name="' + $n.attr('data-node-name') + '" value="' + $val + '" data-text="' + $key + '">' + $key;
        }
        } else if (g_selected_object.attr("data-type") == 'rField') {
            for (var i = 0; i < $el.find('.selectOption').length; i++) {
                $key = $el.find('.selectOption').children('.key').eq(i);
                $val = $el.find('.selectOption').children('.value').eq(i);
                html_opt += '\n<input type="checkbox"';

                var seq = makeId();
                html_opt += ' name="' + ($n.find('input').eq(i).attr('name') == '' ? 'XFORM_ELID_' + seq : $n.find('input').eq(i).attr('name')) + '" value="' + $val.text() + '" data-text="' + $key.text() + '" data-face-for="' + $n.attr('data-node-name') + '" >' + $key.text();
            }
            html_opt += '\n<input type="text" name="' + $n.attr('data-node-name') + '" style="display: none;" data-face-real="y" >\n';
        }

        return html_opt;
    };

    function focusOption(el){
        el.siblings().removeClass('selectOptionEdit'); 
        el.addClass('selectOptionEdit');
    };
    	
    function bindDel(el){
        el.parent().unbind().remove();
    };

    function bindAdd(el){
        var $opt = el.parent();
        var $clone = $opt.clone();
        $opt.after($clone);
        $clone.find('span.key, span.value').attr('contentEditable',true);
        $clone.find('.del').click(function () { bindDel($(this)); });        
        $clone.find('.add').click( function(){ bindAdd( $(this) ); });
		
        $clone.click(function(){ focusOption($(this)); });
    };
    
    setPanel = function (fieldid) {
        var $d = $('.property-area').find('[data-field-id='+fieldid+']');
        var $s = $('#property_popup').find('[data-field-id='+fieldid+']');
        $d.val($s.val());
        if (fieldid == 'html') {
            if(window.console) {
            	//console.log($s.val());
            }
        }
    };
    //다른 컨테이너를 클릭했는지 여부(true/false)
    var other_container_click = function (el) {
        ///var is_table_mode = (tableEditMode() == 'table');
        var el_container = el.closest('.sortable-container, .sortable');
        var same_container = (el_container.length ==0 || el_container.hasClass('container-focus'));

        return !same_container;
    }
    //컨테이너 내의 개체가 클릭된 경우
    element_click = function (el) {

        //현재 테이블 편집모드인 경우, 편집모드를 일단 종료 후 컨테이너 재지정
        //같은 테이블 내 다른 필드를 클릭한 경우 tableEditMode()를 호출하게 되면
        //셀병합을 위한 셀선택이 되지 않음에 주의!. 2014.08.16. KJW
        var prev_mode;
        if (tableEditMode() == 'table' && other_container_click(el)) {
            prev_mode = 'table';
            tableEditMode('element');
        }

        $('#canvas .element-focus').removeClass('element-focus');
        $('#canvas .container-focus').removeClass('container-focus');
        $('#canvas .group-focus').removeClass('group-focus');

        //개체 지정
        g_selected_object = el;
        //컨테이너 지정
        g_selected_container = el.closest('.sortable-container, .sortable');
        g_selected_container.addClass('container-focus'); //container background

        if (g_selected_object.is('.xform-radio, .xform-checkbox')) {
            g_selected_object.addClass('group-focus');   //element
        } else if (g_selected_object.is(':radio, :checkbox') && g_selected_object.parent().is('.xform-radio, .xform-checkbox')) {
            g_selected_object.parent().addClass('group-focus');   //element
            // [16-05-18] kimhs, checkbox or radio 선택할 경우 input tag의 parent를 가지고 있게 함, 이후 copy&paste를 위함
            g_selected_object = g_selected_object.parent();
        } else {
            g_selected_object.addClass('element-focus');   //element
        }

        showAttr(el);
        $('.property-apply').prop('disabled', false).css('cursor', 'pointer');
        $('.object-delete').prop('disabled', false).css('cursor', 'pointer');
        //컨테이너 정보를 표시하는 패널
        containerPanel.show();
        //css 수정 패널(일명 styler)
        elementPanel.show();

        //직전 테이블 편집 모드였다면 다시 테이블편집 모드로 변경
        if (prev_mode == 'table') {
            tableEditMode('table');
        }
    };
    
    elementKeydown = function (el) {
        if(window.console) {
        	//console.log('keydown!' + el.prop('tagName'));
        }
        containerMovable(false);
    };

    showAttr = function(el) {
        var attr_json;
        if(typeof el === 'undefined'){
            attr_json = {};
        } else {
            if (el.is(':checkbox, :radio') && el.parent().is('.xform-checkbox, .xform-radio')) { // [16-04-26] kimhs, 체크박스, 라디오의 경우 input 객체를 감싸고 있는 Label의 속성 보여주기
                el = el.parent();
            }

            attr_json = getElementAttr(el);
        }

        var property_array = getAttrList(attr_json);
        $('.property-required').empty().append(property_array[0]);
        $('.property-optional').empty().append(property_array[1]);
        $('.property-data').empty().append(property_array[2]);
        //data 유형 표시
        if (attr_json == undefined) return;

        var field_type = (attr_json['data-type'] != undefined) ? attr_json['data-type'] : '';

        $('[data-field-id="data-type"]').val(field_type);

        //dfield 이면, data field 표시
        $('.property-data [data-field-id="data-type"]').unbind('change').bind('change', function () {
            showDataField();
        });

        showDataField();
        
    };
    //데이터 필드 설정필드를 화면에 표시할 것인지 여부
    showDataField = function () {
        var field_type = $('.property-data [data-field-id="data-type"]').val();
        //dfield 이면, data field 표시
        if (field_type == 'dField' || field_type == 'smField') {
            $('.property-data [data-field-id="data-model"]').show();
        } else {
            $('.property-data [data-field-id="data-model"]').hide();
        }
    }
    //속성 정보를 가져옴
    getAttrList = function (jsondata) {    
        //json to table
        if (jsondata == undefined) return [];
        var result = [];
        var req_html = '<table><col style="width: 30%;" /><col style="width: 70%;" />';
        var opt_html = req_html;
        var dat_html = req_html;
        
        //lower case only!!!
        // [2016-02-17 leesm] data-length -> data-max-char 변경, data-range 정상동작 안함으로 제거
        var req_tag = ['id','name','class','style','value'];
        var opt_tag = ['data-pattern', 'data-max-char', 'placeholder']; // 'data-range'
        var opt_val = ['','','',''];
        var dat_tag = ['data-type', 'data-model'];
        var dat_val = ['mField', ''];
        
        var skip_tag = ['tagname','type'];
        var html_tag = ['html'];
        var key,key_val,x;

        var tag_type;
        if(typeof jsondata['type'] === 'undefined'){
            tag_type = jsondata['tagname'];
        }else{
            tag_type = jsondata['type'];
        }
        
        if (tag_type == 'TD' || tag_type == 'TH') { // [16-04-26] kimhs, TD혹은 TH의 경우 태그명을 바꿀 수 있도록 수정
            var tmpSelect;
            if (tag_type == 'TD')
                tmpSelect = '<select name="type" data-field-id="type" class="xform-builder"><option value="TD" selected="selected">TD</option><option value="TH">TH</option></select>';
            else
                tmpSelect = '<select name="type" data-field-id="type" class="xform-builder"><option value="TD">TD</option><option value="TH" selected="selected">TH</option></select>';

            req_html += '<tr><td>TYPE</td><td>' + tmpSelect + '</td></tr>';
        } else {
            req_html += '<tr><td>TYPE</td><td>' + tag_type + '</td></tr>';
        }
        
        //requried attributes
        for( x = 0; x < req_tag.length; x++){
            key = req_tag[x];
            key_val = jsondata[key];
            if(typeof key_val === 'undefined') key_val = '';
            req_html += '<tr><td>' + key + '</td><td><input type="text" name="' + key + '" data-field-id="' + key + '" class="xform-builder" value="' + key_val + '" /></td></tr>';
        }
        
        key = 'html';
        key_val = jsondata[key];
        req_html += '<tr><td>' + key + '</td><td><textarea name="' + key + '" data-field-id="' + key + '" class="xform-builder" style="width:90%; height:50px;">' + key_val + '</textarea></td></tr>';
        
        //optional attributes
        for( x = 0; x < opt_tag.length; x++){
            key = opt_tag[x];
            key_val = jsondata[key];
            if (key == 'data-pattern') {
                opt_html += '<tr><td>' + key + '</td><td>' + getDataPatternHtml(key_val) + '</td></tr>';
                continue;
            }
            
            //HTML 속성 중 data-type 등 DB관련 속성은 제외
            if (dat_tag.indexOf(key) > -1) {
                continue;
            }

            if (typeof key_val === 'undefined') {
                key_val = opt_val[x]; //기본값
            }
            opt_html += '<tr><td>' + key + '</td><td><input type="text" name="' + key + '" data-field-id="' + key + '" class="xform-builder" value="' + key_val + '" /></td></tr>';
        }
        
        //HTML 속성으로 정의되면 자동으로 속성 리스트로 가져옴
        //required, optional, data 기타 속성
        for( key in jsondata){
            if(req_tag.indexOf(key) > -1 || opt_tag.indexOf(key) > -1 || dat_tag.indexOf(key) > -1 || skip_tag.indexOf(key) > -1 || html_tag.indexOf(key) > -1){
                continue;
            }else{
                key_val = jsondata[key];
                if(typeof key_val === 'undefined') key_val = '';
                opt_html += '<tr><td>' + key + '</td><td><input type="text" name="' + key + '" data-field-id="' + key + '" class="xform-builder" value="' + key_val + '" /></td></tr>';
            }
        }

        key = 'data-type';
        //if(window.console) console.log(jsondata);
        key_val = jsondata[key];
        dat_html += '<col style="width: 30%;" /><col style="width: 70%;" />';
        dat_html += '<tr><td>Data Type</td><td>';
        dat_html += getDataTypeHtml();
        dat_html += '</td></tr>';
        
        key = 'data-model';
        dat_html += '<tr><td>Data Field</td>';
        dat_html += '<td>' + loadDataField(key) + '</td>';
        dat_html += '</td></tr>';
        
        req_html += '</table>';
        opt_html += '</table>';
        dat_html += '</table>';
        
        result.push(req_html);
        result.push(opt_html);
        result.push(dat_html);
        
        return result;
    };

    getDataTypeHtml = function () {
        // [2016-02-17 leesm] 멀티로우를 위한 rField 추가
        var key = 'data-type';
        var options = ['', 'mField', 'dField', 'smField', 'stField', 'rField'];
        var dat_html = getSelectHtml('', 'data_field_type', 'data-type', options)
        return dat_html;
    }

    getDataPatternHtml = function (v) {

        var key = 'data-pattern';
        var options = ['', 'numeric', 'currency', 'numeral', 'time', 'date', 'period'];
        var dat_html = getSelectHtml('', 'data_pattern', 'data-pattern', options, v)
        return dat_html;
    }

    getSelectHtml = function (id, name, attr, options, value) {

        var s_id = (id == '') ? '' : ' id="' + id + '"';
        var s_name = (name == '') ? '' : ' name="' + name + '"';
        var s_options = '<select' + s_id + s_name + ' data-field-id="' + attr + '" class="xform-builder">';
        var s_selected;
        for (var i = 0; i < options.length; i++) {
            if (typeof value !== 'undefined' && options[i] == value + '') {
                s_selected = ' selected';
            } else {
                s_selected = '';
            }
            s_options += '<option value="' + options[i] + '"' + s_selected + '>' + options[i] + '</option>';
        }
        
        s_options += '</select>';
        return s_options;
    }
    
    loadDataField = function (key) {
        //sample 데이터
        var field_list = [{"name":"SUBJECT","description":"제목"},
                          {"name":"Con_Name","description":"계약명"},
                          { "name": "SDATE", "description": "시작일" },
                          { "name": "ETC", "description": "기타" }];
        var field_json = jQuery.parseJSON(field_list);
        var field_html = '<select name="data_field_mapping" data-field-id="' + key + '" class="xform-builder">';

        field_html += '<option value=""></option>';
        $.each(field_list, function() {
            field_html += '<option value="'+this['name']+'">' + this['description'] + '('+this['name']+')'+'</option>';
        });
        field_html += '</select>';
        
        return field_html;
    };

    saveProperty = function(el) {
        //var attr_json = {id: "myID", title: "I am Title", myattr: "I am something else"}; 
        var $el = (typeof el === 'undefined') ? g_selected_object : el;
        
        //attributes list to json
        //json to html
        var attr_json = getProperty($el);
        var apply_result = setProperty($el, attr_json);
        return apply_result;
    };
    
    getProperty = function (el) {    
        if(typeof el === 'undefined') return;
        
        var attr_id, attr_val, attrs = {};
        $('.property-required .xform-builder').each( function(){
            attr_id = $(this).data().fieldId;
            attr_val = $(this).attr('value');
            attrs[attr_id] = attr_val; 
        });
        
        $('.property-optional .xform-builder').each( function(){
            attr_id = $(this).data().fieldId;
            attr_val = $(this).prop('value');
            attrs[attr_id] = attr_val; 
        });
        
        $('.property-data .xform-builder').each( function(){
            attr_id = $(this).data().fieldId;
            if($(this).prop('type')=='radio'){
                attr_val = $(this).filter(':checked').prop('value');
            }else{
                attr_val = $(this).prop('value');
            }
            //key 가 없으면 등록
            if( !(attr_id in attrs) ){
                attrs[attr_id] = attr_val; 
                //if(attr_id=='data-model') alert(attr_val);
            }
            
        });
        
        return attrs;
    };
    
    getElementAttr = function (el) {
        //attributes to json
        var $el = (typeof el === 'object') ? el : $(el);
        var attrs = {};
        if ($el[0] == undefined) return;
        var attrMap = $el[0].attributes; // [0] can not be omitted

        $.each(attrMap, function (i, e) { 
            attrs[e.nodeName] = e.nodeValue; 
            //if(window.console) console.log(e.nodeValue); 
        });
        attrs['tagname'] = el.prop('tagName');
        attrs['html'] = el.html();
        
        return attrs;
    };
    
    setProperty = function (el, jsondata) {    
        if(typeof el === 'undefined') return;
        //attach json to dom

        var skip_compare = [];
        var skip_bind = [];
        skip_bind.push('html');
        skip_compare.push('type');
        skip_bind.push('type');
        
        //type : can not be changed
        for( var key in jsondata){
            if(skip_bind.indexOf(key) < 0){
                if (typeof jsondata[key] === 'undefined' || jsondata[key] == '') {
                    if (el.attr(key) !== undefined) // [16-05-26] kimhs, 기존에 있던 속성일 때만 attr 변경
                        el.attr(key, jsondata[key]);
                    else
                        skip_compare.push(key);
                } else {
                    el.attr(key, jsondata[key]);
                }
            }
        }
        //html()은 attribute가 아니므로 별도 저장
        el.html(jsondata['html']);

        // [16-04-26] kimhs, TD혹은 TH의 경우 태그명을 바꿀 수 있도록 수정
        // [16-04-29] kimhs, TD, TH 수정시 select box 사용
        if ($('.property-required select[data-field-id=type]').length > 0) {
            var newElement;
            if (jsondata['type'].toUpperCase() == 'TD')
                newElement = el.get(0).outerHTML.replace(/^<th/i, "<td").replace(/<\/th>$/i, "</td>");
            else if (jsondata['type'].toUpperCase() == 'TH')
                newElement = el.get(0).outerHTML.replace(/^<td/i, "<th").replace(/<\/td>$/i, "</th>");

            el.replaceWith(newElement);
            // [16-04-27] kimhs, replaceWith 실행 후 기존 클래스가 사라져 추가
            if (newElement.indexOf('ui-sortable') > -1 && el[0].outerHTML.indexOf('ui-sortable') < 0) {
                el.addClass('ui-sortable');
            }
        }

        var jsondata2 = getElementAttr(el);
        var comp_result = compare_json_data(jsondata, jsondata2, skip_compare );

        containerSelectable(); // 수정 후 클릭이벤트 사라져 추가

        return comp_result;
    };
    
    compare_json_data = function (json1, json2, skip_compare) {    
        if(typeof json1 === 'undefined' || typeof json2 === 'undefined') return;
        
        var c1, c2;
        var result = true;
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

        for( var key in json1){
            if(skip_compare.indexOf(key) > -1){
                continue;
            }
            else if (json1[key].indexOf("{{ doc.") > -1 && json1[key].indexOf("}}") > -1) { // [2016-04-21 leesm] textarea의 경우 {{ }} 문자때문에 오류가 나서 수정함..
                continue;
            }
            else if (key == "html" && regExp.test(json1[key])) { // [16-05-13] kimhs, html 처음과 끝에 특수문자 들어가면 오류나서 수정
                continue;
            }
            else {
                //비교제외대상 아니면 값 비교

                c1 = json1[key];
                c2 = json2[key.toLowerCase()]; //attribute 조회명(c2)은 소문자로만 반환됨!


                if (typeof c1 === 'undefined') c1 = '';
                if (typeof c2 === 'undefined') c2 = '';

                if (key == "style") { // [16-05-13] kimhs, style 순서가 바뀌는 현상이 있어 수정
                    c1 = c1.replace(/ /g, '').replace(/;$/, "").split(';');
                    c2 = c2.replace(/ /g, '').replace(/;$/, "").split(';');

                    c1.sort();
                    c2.sort();
                    c1 = c1.toString();
                    c2 = c2.toString();
                }

                // html type 과 name 이 반대로 되어 있는 경우가 발생되어 속성 및 value 값 검사
                if (key == "html" || key == 'class') { // [16-04-27] kimhs, class 순서 바뀔 수 있어 추가
                    var check = true;

                    for (var i = 0; i < $(c1).length; i++) {
                        if ($(c1)[i].attributes != null) {
                            for (var j = 0; j < $(c1)[i].attributes.length; j++) {
                                if ($(c1)[i].attributes[j].nodeValue != $(c2)[i].attributes[$(c1)[i].attributes[j].nodeName].nodeValue) {
                                    check = false;
                                    break;
                                }
                            }
                        }
                    }

                    // 모든 노드의 속성값이 틀릴경우
                    if (check == false) {
                        if (window.console){
                        	//console.log(json1[key] + ':' + json2[key]);
                        }
                        if (window.console) {
                        	//console.log('false!!!');
                        }
                        result = false;
                        break;
                    }
                }
                else {
                    if (c1 != c2) {
                        if (window.console) {
                        	//console.log(json1[key] + ':' + json2[key]);
                        }
                        if (window.console) {
                        	//console.log('false!!!');
                        }
                        result = false;
                        break;
                    }
                }
            }
        }

        return result;
    };
    
    getAttrTable = function (jsondata) {    
        //json to table
        var html = '<table><col style="width: 30%;" /><col style="width: 70%;" />';
        for( var key in jsondata){
            html += '<tr><td>' + key + '</td><td><input type="text" id="' + key + '" class="xform-builder" value="' + jsondata[key] + '"</td></tr>';
        }
        html += '</table>';
        return html;
    };
    
    canvasDroppable = function(el, mode, action){
        var $el;
        var shtml;
        var oElement;
        var $drag;
        var oDropped;
        
        $el = (typeof el === 'object') ? el : $(el);
        
        var connect_with;
        
        //$target = $el;
        connect_with = '#canvas';
        
        if(action == 'enable'){
            $el.sortable( 'enable' );
            return;
        }else if(action == 'disable'){
            $el.sortable( 'disable' );
            return;
        }
        //target sortable & table to non-table
        $el.sortable({
            connectWith: connect_with, 
            placeholder: 'placeholder',
            opacity: 0.6,
            cursor: 'move',
            tolerance: "pointer",
            distance: 5,
            start: function(event, ui) { 
                
            },
            update: function(e, ui)
            {
                if(window.console) {
                	//console.log('attach');
                }
                canvasDropped(e, ui);
            }
        }); 
  
    };
    
    canvasDropped = function (e, ui) {
        var $drag = $(ui.item);
        var shtml;
        var blnTable = false;
        if( $drag.hasClass('draggable-item') ) {
            //element html
            // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
            var el_type = $drag.attr('data-field');
            if (el_type == "viewlink_d_text" || el_type == "viewlink_w_text" || el_type == "viewlink_s_text") {
                var el_type2 = $drag.attr('data-connect');
                var el_type3 = $drag.attr('data-table');
                var el_type4 = $drag.attr('data-map');
                shtml = getElementHtml_ViewLink(el_type, el_type2, el_type3, el_type4);
            }
            // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
            else if (el_type == "writelink_d_text" || el_type == "writelink_w_text" || el_type == "writelink_s_text") {
                var el_type2 = $drag.attr('data-connect');
                var el_type3 = $drag.attr('data-table');
                var el_type4 = $drag.attr('data-map');
                shtml = getElementHtml_WriteLink(el_type, el_type2, el_type3, el_type4);
            } else {
                shtml = getElementHtml(el_type);
            }
            //oElement = $(shtml);
            var oElement = renderElement($(shtml)); //추가 개체의 기본속성 부여
            //wrap up drop element 

            if(el_type.indexOf('table') > -1){
                blnTable = true;
                $(ui.item).after(oElement);
                $(ui.item).remove();
                oElement.addClass('sortable');
                
                containerDroppable(oElement, 'table' );
                
            }else{
                $(ui.item).after(oElement);
                $(ui.item).remove();
                oElement.addClass('sortable-container');
                containerDroppable(oElement, 'container' );
            }
            
            if (oElement.prop('id') == '') oElement.prop('id', newId());
            //click event binding
            containerSelectable(oElement, el_type);
            // init table on dropped
            popBlockCustom(el_type);

            //drop 후 기본 선택
            containerSelected(oElement);
            
            //컨테이너 이동시 포커스와 속성 정보는 변경되지 않음
            //containerSelected 대신 objectDropped 사용
            objectDropped(oElement);
            //click, focus, and make editable            
            bindContentEditable(oElement);

            dropCallback(oElement);
        }
        
        
    };
    //컨테이너를 클릭할 수 있도록 이벤트 바인딩
    containerSelectable = function (el, el_type) {
        var $el;
        if( typeof el === 'undefined') {
            $el = $('#canvas .sortable-container, #canvas .sortable');
        }else{
            $el = el;
        }

        $el.bind('click', function (event) {
            event.stopPropagation();
            //if(window.console) console.log($(this));
            containerSelected($(this));
        });

        // [16-05-18] kimhs, el이 전체 canvas아래 전체 div를 가지고 있으므로 주석처리 함
        //$el.find('div').bind('click', function (event) {
        //    event.stopPropagation();
        //    //if(window.console) console.log($(this));
        //    containerSelected($(this));
        //});

        elementSelectable($el);
        
    };
    //div 컨테이너가 클릭되었을 때 처리 함수(table x)
    containerSelected = function (el) {

        $('#canvas .container-focus').removeClass('container-focus');
        $('#canvas .group-focus').removeClass('group-focus');

        el.find('.element-focus').removeClass('element-focus');
        el.find('.group-focus').removeClass('group-focus');
        
        if (el.hasClass('sortable-container') || el.hasClass('sortable')) {
            el.addClass('container-focus'); //container background
        } else{
            el.addClass('group-focus'); //radio or check group
        }

        g_selected_object = el;
        object_id = el.prop('id');
        $('#object_id').val(object_id);

        g_selected_container = el.closest('.sortable-container, .sortable'); // [16-04-05] kimhs, 편집 사용 위해 클릭 시 container 객체정보 저장
        
        showAttr(el);
        $('.property-apply').prop('disabled', false).attr('style', 'cursor: pointer;');
        $('.object-delete').prop('disabled', false).attr('style', 'cursor: pointer;');
        //show container control menu
        objectDropped( el ); 

        if(g_table_edit_mode && g_selected_container != g_editing_object){
            //editMode('element');
        }
        containerPanel.show();
    };
    
    //show contorl menu
    objectDropped = function (o) {

        if(o.hasClass('control-binded')){
            //already binded
            return;
        }else{   
            $('.control-binded').removeClass('control-binded');
        }
        
        g_dropped_item_prev = g_dropped_item;
        g_dropped_item = o;
        
        return;
    };
    
    
    //code processing
    showHtmlCode = function () {
        var html = $('#canvas').html();
        html = html.replace(/\</g, '&lt;');
        html = html.replace(/\>/g, '&gt;');

        $('#codeview .snippet-container').remove();
        $('#codeview').append('<pre class="htmlCode"></pre>');

        //case - code snippet
        $('#codeview pre').empty().append(html);
        
        $("#codeview pre.htmlCode").snippet("html",{style:"kwrite"}); //whitengrey
    };

    showOriginalCode = function () {
        if ($('#hidFilename').val() == '') return false;
         // [2016-02-24 leesm] js 불러오기 작업으로 인한 수정
        getFileSource($('#hidFilename').val(), $('#hidJsFilename').val(),$('#hidFormname').val(), function (content) {
            var html = content;
            html = html.replace(/\</g, '&lt;');
            html = html.replace(/\>/g, '&gt;');

            $('#originview .snippet-container').remove();
            $('#originview').append('<pre class="htmlCode"></pre>');

            //case - code snippet
            $('#originview pre').empty().append(html);
            $("#originview pre.htmlCode").snippet("html", { style: "kwrite" }); //whitengrey
        });

        return true;
    };

    // [2016-02-24 leesm] js 불러오기 작업으로 인한 수정 (jsfilename 파라미터 추가)
    getFileSource = function (filename, jsfilename, formname, callback) {

        var formid = $('#hidFormId').val();
        var formversion = $('#hidFormversion').val();
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
	            	if(data.htmlStr=="ERROR"){
	            		alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
	            		return;
	            	}
	            	
	            	var form_content = data.htmlStr.replace(/\r\n/g, '\n');
	                return callback(form_content);
                }
            },
            error: function (error) {
            	//에러 처리 필요
            	alert("xform.0.9.6.js 1946줄 에러"+error);
            }
        });
        
    }


    //code processing
    pureCode = function (c) {
        var s = c.replace(/\</g, '&lt;');
        s = s.replace(/\>/g, '&gt;');
        return s;
    }
    
    /*-----------------------------------------
      function : Template Data
    ------------------------------------------*/
    getFormId = function () {
        return $('#hidFormId').val();
    };

    //property apply iniy
    bindPropertyMenu = function () {

        //property apply iniy
        $('.property-apply').live('click', function(){
            if (saveProperty()) {
                XFORM.canvas.changed();
                $('.property-apply-success').show();
                alertTimeout('정상 처리되었습니다.');
                setTimeout(function () { $('.property-apply-success').hide(); }, 3000);

            }else{
                alert('처리 중 오류가 발생하였습니다.');
                $('.property-apply-fail').show();
                setTimeout(function(){ $('.property-apply-fail').hide(); }, 3000);
            };
        });
        
        $('.object-delete').live('click', function(){
            var del_confirmed = false;
            if(item_delete_confirm.toLowerCase() != 'y'){
                del_confirmed = true;
            }else if(confirm(message.item_delete) ){
                del_confirmed = true;
            }
            
            if( $('.multi-select').is(':checked') ){
                if(del_confirmed) $('#canvas .ui-selected').unbind('all').remove();
            }

            if(del_confirmed) g_selected_object.unbind('all').remove();

            containerPanel.hide();
            $('.property-area').find('input[type=text], textarea, select').prop('disabled', true); // [16-04-15] kimhs, 포커스 잃을 시(여백 클릭, 삭제 등) 속성창 정보 날림
            $('.property-apply').prop('disabled', true).attr('style', 'cursor: default;');
            $('.object-delete').prop('disabled', true).attr('style', 'cursor: default;');

            XFORM.canvas.changed();
             
        });

        $('[name=edit_mode]').live('click', function () {
            var edit_mode = $(this).val();
            if (edit_mode == 'move') {
                canvasMode.movable();
            } else if (edit_mode == 'edit') {
                canvasMode.editable();
            }

        });
    };

    //캔버스의 편집 모드를 설정함
    //movable: 컨테이너와 내부 개체를 이동할 수 있는 모드
    //editable : 개체 편집 또는 테이블의 셀편집을 할 수 있는 모드
    var canvasMode = {
        status: '',
        stat: function (mode) {
            if (typeof mode === 'undefined') {
                return this.status;
            } else {
                this.status = mode;
            }
        },
        init: function (mode) {
            if (mode == 'edit') {
                this.editable();
            } else {
                //필드 스타일러 숨김
                elementPanel.hide();
                //테이블 에디터 모드 해제
                if (tableEditMode() == 'table') {
                    XFORM.form.toggleTableEdit();
                }

                this.movable(); //default

                containerPanel.clearMode();
            }
        },
        movable: function () {
            $('[name=edit_mode][value=move]').prop('checked', true);
            containerMovable(true);
            contentEditableMode(false);
            bindContentUneditable();
            XFORM.form.elementPanel.hide();
            this.stat('move');
            $('.element-tool-stat .move-disabled-alert').remove();
        },
        editable: function () {
            $('[name=edit_mode][value=edit]').prop('checked', true);
            containerMovable(false);
            contentEditableMode(true);            
            bindContentEditable();
            this.stat('edit');

            if (elementPanel.show()) { // [16-04-04] kimhs, 컨테이너 or 개체 미 선택시 스크립트 오류 발생하여 수정
                this.alertDrag();
            }
        },
        alertDrag: function () {
            var el = $('.element-tool-stat')
                .find('.move-disabled-alert')
                .remove()
                .end();

            el.each(function () {
                $('<a href="javascript: void(0);" class="move-disabled-alert tooltip" title="레이블 편집 모드에서는 드래그 할 수 없습니다."></a>')
                .tooltipster()
                .appendTo($(this));
            });
        }
    }

    dropCallback = function (el) {
        //when block or element is dropped, evoke event
        XFORM.canvas.dropped();
    };
    
    removeHover = function(){
        $('#canvas *').removeClass('over_target');
    };
    
    makeId = function (){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }
    
    //get html of Element  
    // [2016-02-15 leesm] radio, checkbox div->label 로 변경, data-node-name, style 추가, checkbox class xform-radio -> xform-checkbox로 변경
    // [2016-02-18 leesm] span, p 태그 추가
    getElementHtml = function (el_type) {        
        var default_data_type = 'mField';
        if(typeof el_type === 'undefined') return;
        
        var s;
        var new_name = 'XFORM_ELID_' + makeId();
        //var new_value = '{{ doc.BODY_CONTEXT.' + new_name + ' }}';
        var new_value = '{{ doc.BodyContext.' + new_name + ' }}';

        if (new_name == undefined) {
            new_value = "";
        }

        var s_type = el_type.toLowerCase();
        
        if( s_type == 'text'){
            //textbox
            s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" />';
        } else if (s_type == 'numeric') {
            //textarea
            s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" value="' + new_value + '" class="xform" data-pattern="numeric" value="1000" />';
        } else if (s_type == 'currency') {
            //textarea
            s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" value="' + new_value + '" class="xform" data-pattern="currency" value="100,000" />';
        } else if (s_type == 'date') {
            //textarea
            s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" value="' + new_value + '" class="xform" data-pattern="date" value="" />';
        } else if (s_type == 'maxchar') {
            //textarea
            s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" value="' + new_value + '" class="xform" data-max-char="10" value="일이삼사오" />';
        } else if (s_type == 'textarea') {
            //textarea
            // [2016-02-15  Kimjh] XForm textarea 오류 수정
            s = '<textarea data-type="' + default_data_type + '" id="' + new_name + '" class="xform" rows="4">' + new_value + '</textarea>';
        }else if( s_type == 'selectbox'){
            //selectbox
            s = '<select data-type="' + default_data_type + '" id="' + new_name + '" class="xform" data-element-type="sel_d_t" style="width: 60px"><option value="1">One</option><option value="2">Two</option><option value="3">Three</option></select>';
        }else if( s_type == 'radio'){
            //radio
            s = '<label class="xform-radio" data-type="mField" data-element-type="rdo_d" data-node-name="' + new_name + '" style="padding-left:2px;padding-right:2px;"><input type="radio" name="' + new_name + '" value="y" data-text="Yes">Yes<input type="radio" name="' + new_name + '" value="n" data-text="No">No</label>';
        } else if (s_type == 'checkbox') {
            //radio
            s = '<span>Colors: </span><label class="xform-checkbox" data-type="mField" data-element-type="chk_d" data-node-name="' + new_name + '" style="padding-left:2px;padding-right:2px;"><input type="checkbox" name="' + new_name + '" value="Red" data-text="Red">Red<input type="checkbox" name="' + new_name + '" value="White" data-text="White">White<input type="checkbox" name="' + new_name + '" value="Black" data-text="Black">Black</label>';
        } else if (s_type == 'button') {
            //button
            s = '<input type="button" data-type="' + default_data_type + '" id="' + new_name + '" class="xform" value="Button" onclick="javascript:void(0);">';
        }else if( s_type == 'a'){
            //a
            s = '<a href="javascript: void(0);" target="">Link</a>';
        }else if( s_type == 'div'){
            //div
            //s = '<div/>';
            s = $('#template div[data-field=div]').html();
        }else if( s_type == 'heading1'){
            //heading1
            s = '<h1>Heading</h1>';
        }else if( s_type == 'label'){
            //label
            s = '<label>Label</label>';
        } else if (s_type == 'span') {
            //span
            s = '<span>Span</span>';
        } else if (s_type == 'p') {
            //p
            s = '<p>Edit Me</p>';
        }else if( s_type == 'table'){
            //table
            s = $('#template div[data-field=table]').html();
        }else if( s_type == 'table3col'){
            //table
            s = $('#template div[data-field=table3col]').html();
        } else if (s_type == 'table1row2col') {
            //table
            s = $('#template div[data-field=table1row2col]').html();
        } else if (s_type == 'sum_multi_row_table') {
            //table
            s = $('#template div[data-field=sum_multi_row_table]').html();
        } else if (s_type == 'jqgrid') {
            //table
            s = $('#template div[data-field=jqgrid]').html();
        } else {
            //s_type은 반드시 소문자와 숫자로만 구성함
            s = $('#template div[data-field=' + s_type + ']').html();
        }
        
        return s;
    };


    // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
    getElementHtml_ViewLink = function (el_type, el_type2, el_type3, el_type4) {
        var default_data_type = 'mField';
        if (typeof el_type === 'undefined') return;

        var s;
        var new_name = 'XFORM_ELID_' + makeId();
        var new_value = '{{ doc.BodyContext.' + new_name + ' }}';
        //var new_value = '{{ doc.BODY_CONTEXT.' + new_name + ' }}';

        if (new_name == undefined) {
            new_value = "";
        }

        var s_type = el_type.toLowerCase();

        if (s_type == 'viewlink_d_text') {
            
            var s_param1 = $('.viewlink-type-database-param1').val();
            var s_param2 = $('.viewlink-type-database-param2').val();
            var s_param3 = $('.viewlink-type-database-param3').val();
            var s_param4 = $('.viewlink-type-database-param4').val();
            
            if (s_param1 == "" && s_param2 == "" && s_param3 == "" && s_param4 == "") {
                alert("파라미터를 선택해 주세요.");
                return;
            } else {
            	//연결정보 암호화  
            	$.ajax({
            		type:"POST",
            		async:false,
            		url:"xform/getEncrypt.do",
            		data:{
            			"pSettingValue" : el_type2
            		},
            		success : function(data){
            			if(data != "" && data.result=="ok"){
            				if(data.encryptStr=="ERROR"){
        					  alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                              return;
            				}else{
            					el_type2 = data.encryptStr;
            				}
            			}
            		},
            		error : function(error){
            			alert(error);
            		}
            	});
            	
                s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" name="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" style="width:99%;" readonly="readonly"';
                s = s + ' ext-data-type1="' + el_type + '"';
                s = s + ' ext-data-type2="' + el_type2 + '"';
                s = s + ' ext-data-type3="' + el_type3 + '"';
                s = s + ' ext-data-type4="' + el_type4 + '"';
                s = s + ' ext-data-param1="' + s_param1 + '"';
                s = s + ' ext-data-param2="' + s_param2 + '"';
                s = s + ' ext-data-param3="' + s_param3 + '"';
                s = s + ' ext-data-param4="' + s_param4 + '"';
                s = s + ' />';
            }
        } else if (s_type == 'viewlink_w_text') {
            
            var s_param1 = $('.viewlink-type-webservice-param1').val();
            var s_param2 = $('.viewlink-type-webservice-param2').val();
            var s_param3 = $('.viewlink-type-webservice-param3').val();
            var s_param4 = $('.viewlink-type-webservice-param4').val();

            // 웹서비스 조회연동은 맵핑 컬럼을 입력받아 처리하도록 한다.
            el_type4 = $('#viewlink-tool-webservice-column').val();

            if (s_param1 == "" && s_param2 == "" && s_param3 == "" && s_param4 == "") {
                alert("파라미터를 선택해 주세요.");
                return;
            }
            if (el_type4 == "") {
                alert("컬럼아이디를 입력해 주세요.");
                return;
            }

          //연결정보 암호화  
        	$.ajax({
        		type:"POST",
        		async:false,
        		url:"xform/getEncrypt.do",
        		data:{
        			"pSettingValue" : el_type2
        		},
        		success : function(data){
        			if(data != "" && data.result=="ok"){
        				if(data.encryptStr=="ERROR"){
    					  alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                          return;
        				}else{
        					el_type2 = data.encryptStr;
        				}
        			}
        		},
        		error : function(error){
        			alert(error);
        		}
        	});

            // 웹서비스 조회 연동 카운트
            var count = 0;
            $('*[ext-data-type1="viewlink_w_text"]').each(function () {
                count = count + 1;
            });

            var bCheck = true;
            if (count > 0) {
                // 연결정보가 다른 것이 있는지 체크
                $('*[ext-data-type1="viewlink_w_text"]').each(function () {
                    if (bCheck) {
                        // 클립보드에 복사된 항목 제외 하기
                        if ($(this).parent().attr("id") != "clipboard") {
                            if ($(this).attr("ext-data-type2") != el_type2) {
                                alert("웹서비스 URL이 기존 URL과 다릅니다.");
                                bCheck = false;
                            }
                        }
                    }
                });

                // 함수 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_w_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type3") != el_type3) {
                                    alert("함수가 기존 함수와 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 동일한 컬럼아이디가 존재하는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_w_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type4") == el_type4) {
                                    alert("동일한 컬럼아이디가 존재합니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }
            }

            if (bCheck) {
                s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" name="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" style="width:99%;" readonly="readonly"';
                s = s + ' ext-data-type1="' + el_type + '"';
                s = s + ' ext-data-type2="' + el_type2 + '"';
                s = s + ' ext-data-type3="' + el_type3 + '"';
                s = s + ' ext-data-type4="' + el_type4 + '"';
                s = s + ' ext-data-param1="' + s_param1 + '"';
                s = s + ' ext-data-param2="' + s_param2 + '"';
                s = s + ' ext-data-param3="' + s_param3 + '"';
                s = s + ' ext-data-param4="' + s_param4 + '"';
                s = s + ' />';
            } else {
                return;
            }
        } else if (s_type == 'viewlink_s_text') {

            var s_param1 = $('.viewlink-type-sap-param1').val();
            var s_param2 = $('.viewlink-type-sap-param2').val();
            var s_param3 = $('.viewlink-type-sap-param3').val();
            var s_param4 = $('.viewlink-type-sap-param4').val();

            // Sap 조회연동은 모든 항목을 입력 받는다.
            el_type2 = $('.viewlink-type-sap-connect').val();
            el_type3 = $('.viewlink-type-sap-table').val();
            el_type4 = $('#viewlink-tool-sap-column').val();
            
            if (el_type2 == "") {
                alert("Destination을 입력해 주세요.");
                return;
            }
            if (el_type3 == "") {
                alert("Function을 입력해 주세요.");
                return;
            }
            if (s_param1 == "" && s_param2 == "" && s_param3 == "" && s_param4 == "") {
                alert("파라미터를 입력해 주세요.");
                return;
            }
            if (el_type4 == "") {
                alert("컬럼아이디를 입력해 주세요.");
                return;
            }

            //연결정보 암호화  
        	$.ajax({
        		type:"POST",
        		async:false,
        		url:"xform/getEncrypt.do",
        		data:{
        			"pSettingValue" : el_type2
        		},
        		success : function(data){
        			if(data != "" && data.result=="ok"){
        				if(data.encryptStr=="ERROR"){
    					  alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                          return;
        				}else{
        					el_type2 = data.encryptStr;
        				}
        			}
        		},
        		error : function(error){
        			alert(error);
        		}
        	});


            // SAP 조회 연동 카운트
            var count = 0;
            $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                count = count + 1;
            });

            var bCheck = true;
            if (count > 0) {
                // 연결정보가 다른 것이 있는지 체크
                $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                    if (bCheck) {
                        // 클립보드에 복사된 항목 제외 하기
                        if ($(this).parent().attr("id") != "clipboard") {
                            if ($(this).attr("ext-data-type2") != el_type2) {
                                alert("Destination이 기존 Destination과 다릅니다.");
                                bCheck = false;
                            }
                        }
                    }
                });

                // 함수 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type3") != el_type3) {
                                    alert("Function이 기존 Function과 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 파라미터1 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-param1") != s_param1) {
                                    alert("파라미터1이 기존 파라미터1과 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 파라미터2 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-param2") != s_param2) {
                                    alert("파라미터2이 기존 파라미터2과 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 파라미터3 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-param3") != s_param3) {
                                    alert("파라미터3이 기존 파라미터3과 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 파라미터4 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-param4") != s_param4) {
                                    alert("파라미터4이 기존 파라미터4와 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 동일한 컬럼아이디가 존재하는지 체크
                if (bCheck) {                    
                    $('*[ext-data-type1="viewlink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type4") == el_type4) {
                                    alert("동일한 컬럼아이디가 존재합니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }
            }

            if (bCheck) {
                s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" name="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" style="width:99%;" readonly="readonly"';
                s = s + ' ext-data-type1="' + el_type + '"';
                s = s + ' ext-data-type2="' + el_type2 + '"';
                s = s + ' ext-data-type3="' + el_type3 + '"';
                s = s + ' ext-data-type4="' + el_type4 + '"';
                s = s + ' ext-data-param1="' + s_param1 + '"';
                s = s + ' ext-data-param2="' + s_param2 + '"';
                s = s + ' ext-data-param3="' + s_param3 + '"';
                s = s + ' ext-data-param4="' + s_param4 + '"';
                s = s + ' />';
            } else {
                return;
            }
        }

        return s;
    };

    // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
    getElementHtml_WriteLink = function (el_type, el_type2, el_type3, el_type4) {        
        var default_data_type = 'mField';
        if (typeof el_type === 'undefined') return;

        var s;
        var new_name = 'XFORM_ELID_' + makeId();
        var new_value = '{{ doc.BodyContext.' + new_name + ' }}';
        //var new_value = '{{ doc.BODY_CONTEXT.' + new_name + ' }}';

        if (new_name == undefined) {
            new_value = "";
        }

        var s_type = el_type.toLowerCase();

        if (s_type == 'writelink_d_text') {
        	//연결정보 암호화  
        	$.ajax({
        		type:"POST",
        		async:false,
        		url:"xform/getEncrypt.do",
        		data:{
        			"pSettingValue" : el_type2
        		},
        		success : function(data){
        			if(data != "" && data.result=="ok"){
        				if(data.encryptStr=="ERROR"){
    					  alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                          return;
        				}else{
        					el_type2 = data.encryptStr;
        				}
        			}
        		},
        		error : function(error){
        			alert(error);
        		}
        	});
            
            s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" name="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" style="width:99%;"';
            s = s + ' ext-data-type1="' + el_type + '"';
            s = s + ' ext-data-type2="' + el_type2 + '"';
            s = s + ' ext-data-type3="' + el_type3 + '"';
            s = s + ' ext-data-type4="' + el_type4 + '"';
            s = s + ' />';
        } else if (s_type == 'writelink_w_text') {
            // 웹서비스 저장연동은 맵핑 컬럼을 입력받아 처리하도록 한다.
            el_type4 = $('#writelink-tool-webservice-column').val();

            if (el_type4 == "") {
                alert("컬럼아이디를 입력해 주세요.");
                return;
            }

            //연결정보 암호화  
        	$.ajax({
        		type:"POST",
        		async:false,
        		url:"xform/getEncrypt.do",
        		data:{
        			"pSettingValue" : el_type2
        		},
        		success : function(data){
        			if(data != "" && data.result=="ok"){
        				if(data.encryptStr=="ERROR"){
    					  alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                          return;
        				}else{
        					el_type2 = data.encryptStr;
        				}
        			}
        		},
        		error : function(error){
        			alert(error);
        		}
        	});
           

            // 웹서비스 조회 연동 카운트
            var count = 0;
            $('*[ext-data-type1="writelink_w_text"]').each(function () {
                count = count + 1;
            });

            var bCheck = true;
            if (count > 0) {
                // 연결정보가 다른 것이 있는지 체크
                $('*[ext-data-type1="writelink_w_text"]').each(function () {
                    if (bCheck) {
                        // 클립보드에 복사된 항목 제외 하기
                        if ($(this).parent().attr("id") != "clipboard") {
                            if ($(this).attr("ext-data-type2") != el_type2) {
                                alert("웹서비스 URL이 기존 URL과 다릅니다.");
                                bCheck = false;
                            }
                        }
                    }
                });

                // 함수 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="writelink_w_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type3") != el_type3) {
                                    alert("함수가 기존 함수와 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }

                // 동일한 컬럼아이디가 존재하는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="writelink_w_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type4") == el_type4) {
                                    alert("동일한 컬럼아이디가 존재합니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }
            }

            if (bCheck) {
                s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" name="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" style="width:99%;"';
                s = s + ' ext-data-type1="' + el_type + '"';
                s = s + ' ext-data-type2="' + el_type2 + '"';
                s = s + ' ext-data-type3="' + el_type3 + '"';
                s = s + ' ext-data-type4="' + el_type4 + '"';                
                s = s + ' />';
            } else {
                return;
            }
        } else if (s_type == 'writelink_s_text') {
            
            // Sap 저장연동은 모든 항목을 입력 받는다.
            el_type2 = $('.writelink-type-sap-connect').val();
            el_type3 = $('.writelink-type-sap-table').val();
            el_type4 = $('#writelink-tool-sap-column').val();

            if (el_type2 == "") {
                alert("Destination을 입력해 주세요.");
                return;
            }
            if (el_type3 == "") {
                alert("Function을 입력해 주세요.");
                return;
            }            
            if (el_type4 == "") {
                alert("컬럼아이디를 입력해 주세요.");
                return;
            }

            //연결정보 암호화  
        	$.ajax({
        		type:"POST",
        		async:false,
        		url:"xform/getEncrypt.do",
        		data:{
        			"pSettingValue" : el_type2
        		},
        		success : function(data){
        			if(data != "" && data.result=="ok"){
        				if(data.encryptStr=="ERROR"){
    					  alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                          return;
        				}else{
        					el_type2 = data.encryptStr;
        				}
        			}
        		},
        		error : function(error){
        			alert(error);
        		}
        	});

            // SAP 저장연동 카운트
            var count = 0;
            $('*[ext-data-type1="writelink_s_text"]').each(function () {
                count = count + 1;
            });

            var bCheck = true;
            if (count > 0) {
                // 연결정보가 다른 것이 있는지 체크
                $('*[ext-data-type1="writelink_s_text"]').each(function () {
                    if (bCheck) {
                        // 클립보드에 복사된 항목 제외 하기
                        if ($(this).parent().attr("id") != "clipboard") {
                            if ($(this).attr("ext-data-type2") != el_type2) {
                                alert("Destination이 기존 Destination과 다릅니다.");
                                bCheck = false;
                            }
                        }
                    }
                });

                // 함수 다른 것이 있는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="writelink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type3") != el_type3) {
                                    alert("Function이 기존 Function과 다릅니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }
                
                // 동일한 컬럼아이디가 존재하는지 체크
                if (bCheck) {
                    $('*[ext-data-type1="writelink_s_text"]').each(function () {
                        if (bCheck) {
                            // 클립보드에 복사된 항목 제외 하기
                            if ($(this).parent().attr("id") != "clipboard") {
                                if ($(this).attr("ext-data-type4") == el_type4) {
                                    alert("동일한 컬럼아이디가 존재합니다.");
                                    bCheck = false;
                                }
                            }
                        }
                    });
                }
            }

            if (bCheck) {
                s = '<input type="text" data-type="' + default_data_type + '" id="' + new_name + '" name="' + new_name + '" value="' + new_value + '" class="xform" value="Text Box" style="width:99%;"';
                s = s + ' ext-data-type1="' + el_type + '"';
                s = s + ' ext-data-type2="' + el_type2 + '"';
                s = s + ' ext-data-type3="' + el_type3 + '"';
                s = s + ' ext-data-type4="' + el_type4 + '"';                
                s = s + ' />';
            } else {
                return;
            }
        }

        return s;
    };

    // [2016-03-30 leesm] XForm 고도화-템플릿. 컨트롤 HTML 생성.
    getElementHtml_TemplateLink = function (el_mode, el_tableidx) {        
        if (typeof el_mode === 'undefined') return;
        var s = "";
        
        $.ajax({
        	type:"POST",
        	async:false,
        	url:"xform/templateHtmlFn.do",
        	data: {
        		"mode" : el_mode,
        		"templateID" : el_tableidx,
        		"templateName" : "",
        		"templateHTML" : "",
        	},
        	success: function(data){
        		if(data != ""){
        			if(data.templateResult == "ERROR"){
        				alert(coviDic.dicMap["msg_OccurError"]);  //에러가 발생했습니다
                        return;
        			}else{
        				s = data.templateResult;
        			}
        		}
        	},
        	error: function(error){
        		alert("Error: " + e.description + "\r\nError number: " + e.number);
        		alert("xform.0.9.6.js 2744줄 에러"+error);
            	return false;
        	}
        });
        
        return s;        
    };

    //캔버스에 추가된 개체 또는 컨테이너 내의 개체에 name과 data-type을 자동부여
    function renderElement(elems) {
        var tag = elems.prop('tagName');
        var targets = 'input, select, textarea';
        if (targets.indexOf(tag) > -1) {
            //추가된 것이 개체이면 
            setDefault(elems);
        } else {
            //추가된 것이 컨테이너이면
            elems.find(targets).each(function () {
                setDefault($(this));
            });
        }

        return elems;

        function setDefault(elem) {
            var id, nm, d, nv;
            var seq = makeId();

            if ( (elem.attr('id') == null || elem.attr('id') == '' ) && elem.closest('.multi-row-table').length == 0  ) {                
                id = 'XFORM_ELID_' + seq;
                elem.attr('id', id);
            }

            if (elem.attr('name') == null || elem.attr('name') == '') {
                nm = 'XFORM_ELNM_' + seq;
                elem.attr('name', nm);
            }

            // [2016-02-15  Kimjh] type -> data-type 수정, elem.data -> elem.attr 수정
            // [2016-02-17 leesm] multirow rField 위해 추가
            if (elem.attr('data-type') == null || elem.attr('data-type') == '') {
                if ($(elem).closest(".multi-row-table").length > 0) {
                    d = 'rField';
                }
                else {
                    if (elem.attr('type') != "checkbox" && elem.attr('type') != "radio") {
                    d = 'mField';
                }
                }
                elem.attr('data-type', d);
            }

            if (elem.is(':text')) {
                if (elem.attr('data-type') != null && elem.attr('data-type') != 'rField') {
                    // [2016-03-31 leesm] 템플릿 추가 시 id, name이 존재하기 때문에 nm 변수에 값 할당이 안되어 undefined라 value 값 매핑이 undefined로 되므로 수정함
                    if (nm == null) {
                        if (elem.attr("id") != null) {
                            nm = elem.attr("id");
                        }
                    }
                    //nv = '{{ doc.BODY_CONTEXT.' + nm + ' }}';
                    nv = '{{ doc.BodyContext.' + nm + ' }}';
                    // [2016-02-15  Kimjh] val() 함수에서 attr 함수로 수정
                    elem.attr("value", nv);
                }
            }

            if (elem.is(':radio, :checkbox')) {
                if ($(elem).parent().attr('data-node-name') == undefined || $(elem).parent().attr('data-node-name') == '') {
                    $(elem).parent().attr('data-node-name', nm);

                    if (elem.attr('data-type') != 'rField') // rField가 아닐때만 id 생성
                        $(elem).attr("id", 'XFORM_ELID_' + makeId());
                }
                else {
                    $(elem).attr('name', $(elem).parent().attr('data-node-name'));
                }
            }

            return elem;
        }
    }
    
    outlineHighlight = function () {
        $('#canvas table').highlight();
    };
    
    newId = function() {
        if(typeof element_nums === 'undefined')
            element_nums = 0;
        element_nums++;
        return 'xformid_' + element_nums;
    };
    
    tableResizable = function (el, mode) {
        el.colResizable();
    };
    
    selectedId = function(){
        return $('#object_id').val();
    };
    
    selectedObj = function(){
        return g_selected_object;
    };
    selectedCon = function () {
        return g_selected_container;
    };
    

    selectedTag = function () {
        return g_selected_object.prop('tagName').toLowerCase();
    };
    
    showTablePanel = function () {
        var $t = selectedCon();
        g_show_table_panel = true;
        var selected_obj_left = $t.offset().left + $t.width() - $('.table-panel').width() - 20;
        var selected_obj_top = $t.offset().top - parseInt($('.table-panel').css('height').replace(/px/g, '')) - 8;
        $('.table-panel').css('top', selected_obj_top + 'px')
                         .css('left', selected_obj_left +'px')
                         .show();

        elementPanel.hide();
    }

    hideTablePanel = function () {
        g_show_table_panel = false;
        $('.table-mode-control input').prop('disabled', true);
        $('.table-mode-option input').prop('disabled', true);
            
        $('.table-panel').hide();
        //contentEditableMode(true);
    }

    elementPanel = {
        stat: function () {
            var el = $('.element-panel');
            return el.css('display');
        },
        show: function () {
            if (g_selected_container == undefined) { // [16-04-04] kimhs, 컨테이너 or 개체 미 선택시 스크립트 오류 발생하여 수정
                alert('편집할 개체를 선택하세요.');
                canvasMode.movable();

                return false;
            }

            var el = $('.element-panel');

            if (!contentEditableMode()) return;
            if (g_show_table_panel) return;
            if(window.console) {
            	//console.log(!contentEditableMode(), g_show_table_panel);
            }
            if ( !$('.tool-fixed').is(':checked')  ) {
                var canvas_width = $('#canvas').css('width').replace('px', '');
                var panel_width = $('.element-panel').css('width').replace('px', '');
                var selected_obj_left2 = g_selected_container.position().left + (parseInt(canvas_width) - parseInt(panel_width)) / 2;
                el.css('left', selected_obj_left2 + 'px')
                  .css('top', g_selected_object.position().top - 90 + 'px').show();
            }

            el.show();
            loadStyleEditor();

            return true;
        },
        hide: function () {
            $('.element-panel').hide();
            unloadStyleEditor();
        },
        init: function () {
        }

    };

    containerPanel = {
        stat: function () {
            var el = $('#container_panel');
            return el.css('display');
        },
        show: function () {
            var el = $('.container-panel');
            var el_control = el.find('.container-control');
            var obj;

            if (g_selected_object.hasClass('sortable-container')) {
                obj = g_selected_object;
                el.removeClass('table-container').addClass('div-container');
                el_control.removeClass('table-container').addClass('div-container');
            } else {
                obj = g_selected_container;
                el.removeClass('div-container').addClass('table-container');
                el_control.removeClass('div-container').addClass('table-container');
            }
            if (typeof obj === 'undefined' || obj == null) return;
            if (obj.length <= 0) {
                containerPanel.hide();
                return;
            }

            el.find('.container-type').html(obj.prop('tagName'));
            el.css('left', (obj.position().left -30) + 'px')
              .css('top', (obj.position().top + 38) + 'px').show();

            if (obj.prop('tagName').toUpperCase() == 'TABLE') {
                el.find('.element-table-edit').show();
            } else {
                el.find('.element-table-edit').hide();
            }

        },
        hide: function () {
            var el = $('.container-panel');
            var el_control = el.find('.container-control');
            el_control.removeClass('div-container').removeClass('table-container');
            el.removeClass('div-container').removeClass('table-container').hide();
            el.removeClass('table-edit-mode');
        },
        exitTableEdit: function () {
            //테이블 에디터 모드 해제
            if (tableEditMode() == 'table') {
                XFORM.form.toggleTableEdit();
            }
        },
        clearMode: function () {
            $('#container_panel .element-mode').removeClass('element-mode-selected');
        },
        setMode: function (elem) {
            this.clearMode();
            $(elem).addClass('element-mode-selected');
        },
        init: function () {
            var that = this;
            $('#container_panel .element-movable').unbind('click').bind('click', function (event) {
                canvasMode.movable();
                that.setMode(this);
                //테이블 에디터 모드 해제
                that.exitTableEdit();
            });

            $('#container_panel .element-editable').unbind('click').bind('click', function (event) {
                canvasMode.editable();
                that.setMode(this);
                //테이블 에디터 모드 해제
                that.exitTableEdit();
            });

            $('#container_panel .element-table-edit').unbind('click').bind('click', function (event) {
                toggleTableEdit();
                that.setMode(this);
            });
        },
        refresh: function () {
            var panel = $('#container_panel'),
                container_type = ( panel.hasClass('table-container')) ? 'table' : 'div',
                obj_selected_container = (container_type == 'table') ? g_selected_container : g_selected_object;
            if (obj_selected_container == null) this.hide();

        }
    }
    //참조하는 개체에 변경이 있을 때 다시 참조정보를 재확인히여
    //숨기거나 표시함.
    var canvasRefresh = function () {
        containerPanel.refresh();
    }

    styleEditor = {
        load: function (el) {
            loadStyleEditor(el);
        },
        unload: function () {
            unloadStyleEditor();
        }
    }

    unloadStyleEditor = function () {
        var $toolbar = $('#element_css'),
            $tools = $toolbar.find('.css-tool-single'),
            $tools_manual = $toolbar.find('.css-tool-manual');

        //tool click
        $tools.unbind('click');
        //font-size change
        $tools.unbind('change');

        $tools_manual.unbind('blur');

    }

    loadStyleEditor = function (el) {
        //var o = $("#stylediv");
        var $toolbar = $('#element_css'),
            $tools = $toolbar.find('.css-tool-single'),
            $buttons = $toolbar.find('.canvas-set-style'),
            $select = $toolbar.find('.css-tool-select'),
            $width_styler = $toolbar.find('.element-width-style'),

            $slide_width = $width_styler.find('.slide-width'),
            $slide_width_max = $width_styler.find('.slide-width-max'),
            $manual_width = $width_styler.find('.manual-width'),
            $width_style = $width_styler.find('.width-style'),
            $width_minus = $width_styler.find('.width-minus'),
            $width_plus = $width_styler.find('.width-plus');

        var element_max_width = 1600;
        var o = (typeof el === 'undefined') ? g_selected_object : el;
        var j = cssToJson(o);

        //single styler event bind - 하나의 style 값만을 갖는 필드
        $buttons.unbind('click').bind('click', function (event) {
            setSingleStyle( $(this), event);
            
        });
        //여러 가지 style 값을 갖는 select 필드
        $select.unbind('change').bind('change', function (event) {
            //변경된 값을 style-value에 저장.
            $(this).data('style-value', $(this).val());
            setSingleStyle($(this), event);

        });

        function setSingleStyle(el, event) {
            var k = el.data().styleKey;
            var v = el.data().styleValue;
            var t = el.data().styleToggle;
            if (t == null) {
                o.styles(k, v);
            } else {
                if (t == 'false') {
                    o.styles(k, v);
                } else {
                    o.styles(k, '');
                }
            }

            readStyle($tools, cssToJson(o));

            XFORM.canvas.changed();
        }

        //multi styler event bind
        $width_minus.unbind('mousedown').bind('mousedown', function () {
            var w = o[0].style.width + '';
            w.replace('px', '').replace('em', '').replace('pt', '').replace('%', '');
            w = parseInt(w);
            w = (w > 0) ? w-1 : w;
            $slide_width.val(w);
            setWidth();
        });

        $width_plus.unbind('mousedown').bind('mousedown', function () {
            var w = o[0].style.width + '';
            w.replace('px', '').replace('em', '').replace('pt', '').replace('%', '');
            w = parseInt(w);
            w = (w > 0) ? w + 1 : w;
            $slide_width.val(w);
            setWidth();
        });

        //element width change
        $slide_width.unbind('change').bind('change', function () {
            setWidth();
        });

        $manual_width.unbind().bind('blur', function () {
            $slide_width.val( $(this).val() );
            setWidth();
        });

        $width_style.unbind('change').bind('change', function () {
            if ($(this).val() == '%') {
                $slide_width.attr('max', '100');
                if (parseInt($slide_width.val()) > 100) {
                    $slide_width.val('100');
                } else {
                    $slide_width.val($slide_width.val() - 1);
                    //$slide_width.val($slide_width.val() + 1);
                }
            } else {
                $slide_width.attr('max', element_max_width);
                $slide_width.val($slide_width.val() - 1);
                //$slide_width.val($slide_width.val() + 1);
            }
            refreshWidthMax();

            $slide_width.val(parseInt($slide_width.val()) + 1);

            setWidth();
            
        });

        // o : style을 적용할 개체, $tools: css-tool class 개체, 
        // $slide_width : 너비설정 슬라이더, $manual_width: 너비를 지정하는 입력 텍스트박스
        function setWidth() {
            var w = $slide_width.val();
            var t = $width_style.val();
            //매뉴얼 입력 필드에 너비 표시
            $manual_width.val(w);
            //슬라이더의 data()에 너비 css 저장
            $slide_width.data().styleValue = w + t;
            //style 적용
            o.styles($slide_width.data().styleKey, $slide_width.data().styleValue);

            XFORM.canvas.changed();
        }
        
        function refreshWidthMax() {
            $slide_width_max.text($slide_width.attr('max'));
        }

        //단일 스타일 필드 : style-key와 style-value 만으로 style을 적용할 수 있는 필드의 설정값을 읽어 들임
        readStyle($tools, j);

        //개체의 너비 로드
        readWidthStyle();

        function readWidthStyle() {
            var w = o[0].style.width;
            var s;
            if (w.indexOf('px') > -1) {
                s = 'px';
            } else if (w.indexOf('em') > -1) {
                s = 'em';
            } else if (w.indexOf('pt') > -1) {
                s = 'pt';
            } else if (w.indexOf('%') > -1) {
                s = '%';
            }

            var w = o[0].style.width.replace('px', '').replace('em', '').replace('pt', '').replace('%', '');
            w = parseInt(w);

            //width 스타일에 따라 max 설정, 너비 조정
            if (s == '%') {
                $slide_width.attr('max', '100');
                if (w > 100) w = 100;
            } else {
                $slide_width.attr('max', element_max_width);
            }

            $slide_width.val(w);
            $manual_width.val(w);
            $width_style.val(s);

            refreshWidthMax();
        }
        

    }

    //toolbar object
    readStyle = function ($t, j) {
        //read
        //if(window.console) console.log(j);
        $t.each(function () {

            var k = $(this).data().styleKey;
            var v = $(this).data().styleValue;
            var t = $(this).data().styleToggle;
            var m = false;

            var obj_style = j.style[k];
            //if(window.console) console.log('tool_css_key:' + k + ', tool_css_style:' + v + ', obj_css_style' + obj_style);
            if (v != null) {
                if ($(this).prop('tagName').toUpperCase() === 'SELECT') {
                    $(this).val(obj_style);
                    return;
                }

                if (j.style.hasOwnProperty(k) && obj_style == v) {
                    //match
                    $(this).addClass('style-matched').addClass('ui-state-active');
                    if (t != null) $(this).data().styleToggle = 'true';
                } else {
                    //not match
                    $(this).removeClass('style-matched').removeClass('ui-state-active');
                    if (t != null) $(this).data().styleToggle = 'false';
                }

            }/* else {
                if (j.style.hasOwnProperty(k)) {
                    //defined
                } else {
                    //not defined
                }
            }*/
        });
    }

    cssToJson = function (el) {
        var style = (typeof el.attr('style') === 'undefined') ? '' : el.attr('style');
        var styles = style.split(';'),
            i = styles.length,
            json = { style: {} },
            style, k, v;


        while (i--) {
            style = styles[i].split(':');
            k = $.trim(style[0]);
            v = $.trim(style.splice(1, style.length).join(":"));
            if (k.length > 0 && v.length > 0) {
                json.style[k] = v;
            }
        }
        //if(window.console) console.log(json);
        return json;
    }

    jQuery.fn.extend({
        styles: function (k, v) {
            var j = cssToJson(this);
            if (typeof v === 'undefined') {
                return j.style.hasOwnProperty(k);
            } else {
                this.css(k, v);
            }
        }
    });

    contentEditableMode = function (m) {
        if (typeof m === 'undefined') {
            return g_content_editable;
        } else {
            g_content_editable = m
        }
    };

    contentEditable = function (el, opt) {
        var p = (typeof opt === 'undefined') ? true : opt;
        var $el = el;
        if (p) {

            var $this = $el,
            $container = $el.closest('table'),
            $others;

            if ($container.length > 0) {
                $others = $container.find('th, td');
            } else {
                $container = $el.closest('.sortable-container');
                if ($container.length > 0) {
                    $others = $container.find('*');
                } else {
                    return;
                }
            }

            $others.prop('contenteditable', false).removeClass('editable');
            $this.prop('contenteditable', true).addClass('editable');
            $this.focus();
        } else {
            $el.find('*').removeAttr('contenteditable').removeClass('editable');
        }
    }

    initContentEditable = function (m) {
        contentEditableMode(m);
    };

    bindContentEditable = function (el) {
        var $el;
        if (typeof el === 'undefined'){
            $el = $('#canvas');
        }else if (typeof el === 'object'){
            $el = el;
        } else if (typeof el === 'string') {
            $el = $(el);
        }

        //편집 모드 - td click시
        if(window.console) {
        	//console.log('content edit event binded');
        }
        if ($el) {
            $el.find('*').click(function (event) {
                event.stopPropagation();
                //컨텐트 에디팅 이벤트는 에디팅 가능 모드에서만 동작
                if (!contentEditableMode()) return;

                contentEditable($(this));
            });
        }
    }

    bindContentUneditable = function () {
        contentEditable($('#canvas'), false);
    }

    statTablePanel = function () {
        return g_show_table_panel;
    };

    showModeStatus = function (mode) {
        //g_table_edit_mode
        var m;
        if(g_select_mode == 'container'){
            if(g_table_edit_mode){
                m = '<span style="color:red">Table</span>';
            }else{
                $('#edit_mode span').text('Layout');
                m = '<span style="color:tomato;">Container</span>';
            }
        }else{
            m = '<span style="color:royalblue">Element</span>';
        }
        
        $('#edit_mode span').html(m);
  
    }

    var toggleTableStat = function (stat) {
        var el = $('.container-panel');
        if (stat == 'table') {
            //테이블 모드 전환
            el.addClass('table-edit-mode');
        } else {
            //테이블 모드 종료
            el.removeClass('table-edit-mode');
        }
    }
    //show_panel : 패널 표시 여부(기본값 true)
    tableEditMode = function (mode, show_panel) {

        if (typeof mode === 'undefined') {
            return ($('.edit-table').is(':checked') ? 'table' : 'element');
        } else {
            if (mode == 'table' && g_table_edit_mode) { //이미 테이블 모드인 경우 재호출시 종료
                return;
            }
        }

        if(!checkObjSelected()) return;
        //if (g_selected_object.prop('tagName').toLowerCase() != 'table') {
         //   alertTxt = message.table_not_selected;
        //    return false;
        //}

        if (typeof g_dropped_item === 'undefined' && typeof g_selected_container === 'undefined') {
            alert('테이블을 먼저 선택하세요');
            return false;
        }

        //컨테이너 선택시 왼쪽상단에 따라 다니는 "선택메뉴"의 상태 변경
        toggleTableStat(mode);

        var $table = g_dropped_item ? g_dropped_item : g_selected_container;

        if( mode == 'table'){
            if(typeof g_editing_object !== 'undefined'){
                g_editing_object.removeClass('block_fixed');
                if (g_editing_object.parent().hasClass('position-relative')) elementPanel.hide();
            }

            $('.add-canvas').click( function(event){
                event.preventDefault();
            });
            //elementDraggable(false);
            showStatus(alertTxt);

            g_table_edit_mode = true;
            contentEditableMode(false);
            //row+/-
            tableEditEnable($table);
            $('#canvas .CRC').css('display', 'none'); // [16-04-25] kimhs, 테이블 편집 툴 사용 시 xform-colResizable.js에서 div를 생성하여 임시 처리함

            showModeStatus();

            //disable canvas droppable
            $table.addClass('block_fixed');
            
            $('.edit-table').prop('checked', true);
            $('.table-mode-control input').prop('disabled', false);
            $('.table-mode-option input').prop('disabled', false);
            
            //table editing panel
            showTablePanel();
            
            $('.element-table').addClass('glowing-red');

        }else if( mode == 'element'){

            showStatus(alertTxt);
            
            //toggle Table Mode
            g_table_edit_mode = false;
            contentEditableMode(true);
            tableEditDisable();
            
            g_selected_container.removeClass('block_fixed');

            selectMode(g_prev_select_mode); //기존 모드로 복원            
            hideTablePanel();
            showModeStatus();            

            $('.edit-table').prop('checked', false);
            $('.element-table').removeClass('glowing-red');
        }

        //컨테이너 floating menu 표시
        if (typeof show_panel === 'undefined' || show_panel === true) {
            if (mode == 'table' && containerPanel.stat() == 'none') {
                containerPanel.show();
            } else if (mode == 'element' && elementPanel.stat() == 'none') {
                elementPanel.show();
            }
        } else {
            elementPanel.hide();
        }
    };
    
    dragRow = function (el, mode) {
        if(mode){
            el.removeClass('draggable-ignore');
        }else{
            el.addClass('draggable-ignore');
        }
    }
    
    draw = function (el){
        
        if(tableEditMode() == 'table'){
            return false;
        }
        
        var $el = el;

        if( el.hasClass('add-canvas')){            
            addToCanvas($el);
            XFORM.canvas.added();
            if(window.console) {
            	//console.log('add-canvas');
            }
        } else if (el.hasClass('add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('templatelink-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('viewlink-database-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('writelink-database-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('viewlink-webservice-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('writelink-webservice-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('viewlink-sap-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else if (el.hasClass('writelink-sap-add-block')) {
            addToContainer($el);
            XFORM.canvas.added();
        } else {
            if (window.console) {
            	//console.log('draw nothing');
            }
        }
    };
    
    duplicate = function (el, opt) {
        copy(el);
        paste(el, opt);
    }
    
    copy = function (el) {

        if(typeof el === 'undefined'){
            copiedObj = selectedObj();
            alertTxt = message.copied;
        }else if(typeof el === 'object'){
            copiedObj = el;
            alertTxt = message.copied;
        } else if (el === 'container') {
            copiedObj = g_selected_container;
            alertTxt = message.copied;
        } else if (typeof el === 'string') {
            copiedObj = $(el);
            alertTxt = message.copied;
        }else{
            alertTxt = message.notcopied;
            showStatus();
            return;
        }
        
        showStatus();
        return copiedObj;
    }

    cut = function (el) {
        var o = copy(el);
        g_cutted_object = o;

        o.remove(); // [16-05-26] kimhs, 기존에 복사만 되고 있음, 삭제 추가(잘라내기)
    }

    paste = function (el, opt) {
        if (copiedObj == undefined) return;
        if(typeof el !== 'undefined' && typeof el !== 'object' && typeof el !== 'string'){
            alertTxt = message.notpasted;
            showStatus();
            return;
        }

        var $current;
        var copiedObjTmp = [];
        if (el === 'container') {
            $current = g_selected_container;
        }
        else {
            $current = selectedObj();
        }

        // [2016-03-31 leesm] 템플릿 붙혀넣기 할 때 캔버스에서 선택된 컨테이너가 없어 오류남.. 
        // 없으면 Canvas 객체를 가지고 있게하여 Canvas 에 바로 붙혀넣을 수 있도록 했음..
        if (typeof $current === 'undefined' || $current == null) {
            // [16-04-21] kimhs, 붙여넣기 할 object가 객체이면 캔버스위에 바로 추가 못하게 막음 
            if (copiedObj.find('.sortable-container, .sortable').length > 0 || copiedObj.is('.sortable-container, .sortable'))
                $current = $("#canvas");
            else
                return;
        }

        if (typeof copiedObj.prop('tagName') === 'undefined') {
            if (copiedObj.length > 1) {
                copiedObj.each(function () {
                    if (this instanceof HTMLElement) {
                        copiedObjTmp[copiedObjTmp.length] = this;
                    }
                });
            }
            else {
                copiedObjTmp = copiedObj;
            }
        }
        else {
            copiedObjTmp = copiedObj;
        }


        var $clone = $(copiedObjTmp).clone();
        var el_type = $(copiedObjTmp).prop('tagName');
        var target_type = $(copiedObjTmp).prop('tagName').toLowerCase();
        var append_list = 'th, td, p';

        var paste_mode = (typeof opt === 'undefined') ? 'after' : 'append';
        if (paste_mode === 'append' || append_list.indexOf(target_type) > -1) {
            if ($clone.prop('tagName').toLowerCase() === 'td' || $clone.prop('tagName').toLowerCase() === 'th') {
                $clone = $clone.html();
            }

            if (typeof el === 'undefined' || el === '') {
                $current.html($current.html().replace(/^&nbsp;/, "" )); // [16-05-19] kimhs, td or th 복사 시 기존 
                $current.append($clone);
            } else if (typeof el === 'object') {
                el.append($clone);
            } else if (typeof el === 'string') {
                $(el).append($clone);
            } 
        } else {
            if (typeof el === 'undefined') {
                $current.after($clone);
            } else if (typeof el === 'object') {
                el.after($clone);
            } else if (el === 'container') {
                $current.after($clone);
            } else if (typeof el === 'string') {
                $(el).after($clone);
            }
        }
        
        var $new = $clone;

        if(el_type.toLowerCase().indexOf('table') > -1){
            $new.addClass('sortable');
            containerDroppable($new, 'table' );
        } else if (el_type.toLowerCase().indexOf('div') > -1) {
            $new.addClass('sortable-container');
            containerDroppable($new, 'container' );
        }

        // [2016-02-15 leesm] $new 객체에 id 속성을 가질 수 없을 때..? 오류가 발생하여 수정함
        try {
            if ($new.prop('id') == '') {
                $new.attr('id', newId());
            }
        }
        catch (e) { }

        // [2016-02-16 leesm] 복제할 때 Name 값 변경이 되지 않음 수정(Name이 동일해야하는 Radio, Checkbox 제외)
        var newId;
        var newName;
        if (typeof $new == 'string') { // [16-05-13] kimhs, TD, TH 복사 붙여넣기 시 객체가 text로 복사되어 수정
            $new = $($new);
        }

        if ($new.find("input[type=radio], input[type=checkbox]").length > 0) {            
            if ($new.prop('tagName').toLowerCase() === 'label' || $new.prop('tagName').toLowerCase() === 'div') {
                $new.find("label, div").removeAttr("id");
                $new.find("label, div").removeAttr("name");
            }

            $new.find("label.xform-checkbox").each(function () {
                newName = 'XFORM_ELNM_' + makeId();
                $(this).attr("data-node-name", newName);
                $(this).find("input[type=radio], input[type=checkbox]").each(function () {                    
                    newId = 'XFORM_ELID_' + makeId();
                    $(this).prop('id', newId);
                    $(this).prop('name', newName);
                });
            });

            $new.find("div.xform-checkbox").each(function () {
                newName = 'XFORM_ELNM_' + makeId();
                $(this).attr("data-node-name", newName);
                $(this).find("input[type=radio], input[type=checkbox]").each(function () {                    
                    newId = 'XFORM_ELID_' + makeId();
                    $(this).prop('id', newId);
                    $(this).prop('name', newName);
                });
            });
        } 

        if (el_type.toLowerCase().indexOf('table') > -1 || el_type.toLowerCase().indexOf('div') > -1) {
            //click event binding
            containerSelectable($new, el_type);

            //drop 후 기본 선택
            containerSelected($new);

            //컨테이너 이동시 포커스와 속성 정보는 변경되지 않음
            //containerSelected 대신 objectDropped 사용
            objectDropped($new);
        }
        
        // [16-05-13] kimhs, 객체가 여러개일 때 이벤트 바인딩 되도록 수정        
        //elementSelectable($new);
        containerSelectable();

        alertTxt = message.pasted;
        showStatus();

        XFORM.canvas.added();

        if (typeof g_cutted_object === 'object' && g_cutted_object != null) {
            g_cutted_object.remove();
            g_cutted_object = null;
        }
        
        return $clone;        
    };
    
    del = function (el) {

        var del_confirmed = false;
        if(item_delete_confirm.toLowerCase() != 'y'){
            del_confirmed = true;
        }else if(confirm(message.item_delete) ){
            del_confirmed = true;
        }
        
        if( $('.multi-select').is(':checked') ){
            if(del_confirmed) $('#canvas .ui-selected').unbind('all').remove();
        }

        var $current;
        if (el === 'container') {
            $current = g_selected_container;
        } else {
            $current = selectedObj();
        }

        if ($current == undefined) return;
        //if (del_confirmed) g_selected_object.unbind('all').remove();
        if (del_confirmed) $current.unbind('all').remove();

        if ($current[0].nodeName.toLowerCase() == 'table' && tableEditMode() == 'table') { // [16-04-11] kimhs, 테이블 편집모드 상태로 개체 삭제 할 경우, 편집모드 종료
            canvasMode.movable();
            tableEditMode('element'); //테이블 편집 모드 종료
        }

        g_selected_container = null;
        g_selected_object = null;

        containerPanel.hide();
        $('.property-area').find('input[type=text], textarea, select').prop('disabled', true); // [16-04-15] kimhs, 포커스 잃을 시(여백 클릭, 삭제 등) 속성창 정보 날림
        $('.property-apply').prop('disabled', true).attr('style', 'cursor: default;');
        $('.object-delete').prop('disabled', true).attr('style', 'cursor: default;');

        XFORM.canvas.changed();
    };

    quit = function () { // [16-04-07] kimhs, 포커스 벗어나기
        $('#canvas .container-focus').removeClass('container-focus');
        $('#canvas .group-focus').removeClass('group-focus');
        $('#canvas .element-focus').removeClass('element-focus');

        containerPanel.hide();
        $('.property-area').find('input[type=text], textarea, select').prop('disabled', true); // [16-04-15] kimhs, 포커스 잃을 시(여백 클릭, 삭제 등) 속성창 정보 날림
        $('.property-apply').prop('disabled', true).attr('style', 'cursor: default;');
        $('.object-delete').prop('disabled', true).attr('style', 'cursor: default;');

        if (g_selected_container != null) g_selected_container = null;
        if (g_selected_object != null) g_selected_object = null;
    };

    var magic = {
        stat : false,
        getStat: function(){
            return this.stat;
        },
        obj: {
            link : $('#modal_content'),
            container: $('#modal_popup_content'),
            content: function () {
                return this.container.find('.modal-content')
            }
        },
        init : function(){
            this.obj.content().empty()
                .append('<p>복사한 내용을 아래에 붙여 넣으세요</p>')
                .append('<div contenteditable="true" class="magic" />')
                .append('<div class="btn-fld"><button class="cancel">취소 »</button><button class="ok">적용 »</button></div>');
            this.bindEvent();
            this.stat = true;
        },
        bindEvent: function () {
            var that = this;
            var ok_btn = that.obj.container.find('.ok');
            var cancel_btn = that.obj.container.find('.cancel');
            ok_btn.unbind().bind('click', function (event) {
                event.preventDefault(); //button 기본동작(submit) 중지
                that.showMagic();
                that.close();
            });
            cancel_btn.unbind().bind('click', function (event) {
                event.preventDefault();
            });
        },
        show: function () {
            if (!this.stat) this.init();
            this.obj.link.click();
        },
        close : function(){
            this.obj.container.find('.modal_close').click();
        },
        showMagic: function () {
            //팝업의 속성 정보 저장
            var content = this.obj.container.find('.magic').html().replace(/</g, '&lt;').replace(/>/g, '&gt;');

            // [16-05-30] kimhs, text 입력 시 div, span 태그로 감싸주기
            if (content.indexOf('&lt;') < 0) {
                content = '<div><span>' + content + '</span><div>';
            }
            else if (content.indexOf('&lt;') > -1 && content.indexOf('&gt;') < 0) {
                content = '<div><span>' + content + '</span><div>';
            }
            else if (content.indexOf('div') < 0 && content.indexOf('table') < 0) {
                content = '<div>' + content + '<div>';
            }

            var tmpObj = appendHtmlToCanvas(content.replace(/&lt;font/gi, '&lt;span').replace(/font&gt;/gi, 'span&gt;').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
            tmpObj.removeAttr('style'); // style 속성 제거
            tmpObj.find('*').removeAttr('style');
            tmpObj.find('table').addClass('table_10');
            this.stat = false;
        }
    };
    
    //table mode toggle
    toggleTableEdit = function () {
        // [16-04-11] kimhs, 편집할 개체가 테이블일 떄만, 편집 모드로 전환되도록 수정
        if(g_selected_object == null || g_selected_container == null) {
            alert('편집할 개체가 선택되지 않았습니다\n다시 선택해 주세요');
            return;
        }
        if (g_selected_container[0].nodeName.toLowerCase() != 'table') {
            alert('편집할 테이블 컨테이너가 선택되지 않았습니다.\n다시 선택해 주세요.');
            return;
        }

        //edit 모드로 자동 변경
        if (canvasMode.stat() != 'edit') {
            canvasMode.editable();
        }

        //테이블 편집 모드
        if (tableEditMode() == 'element') {           
            var success = tableEditMode('table');
            if (!success) showStatus(alertTxt);
        }else {
            tableEditMode('element'); //테이블 편집 모드 종료
        }
        
    }
    //컨테이너를 캔버스 내에서 이동가능하도록 함
    containerMovable = function (opt) {
        //edit mode
        if (!opt) {
            containerDroppable('.sortable-container', 'container', 'disable');
            containerDroppable('.sortable', 'table', 'disable');
            canvasDroppable('#canvas', 'canvas', 'disable');
        } else {
            containerDroppable('.sortable-container', 'container', 'enable');
            containerDroppable('.sortable', 'table', 'enable');
            canvasDroppable('#canvas', 'canvas', 'enable');
        }
    };

    toObject = function (el) {
        var $el;
        if (typeof el === 'undefined') {
            $el = g_selected_object;
        } else if(typeof el === 'object'){
            $el = el;
        } else if(typeof el == 'string'){
            $el = $(el);
        }
        return $el;
    };

    viewCode = function (el) {
        
        var $el, s, $t;

        // [2016-04-20 leesm] 객체를 선택하지 않고 canvas 등에서 ShowCode 하였을 때 객체가 없어 Clone이 되지 않아 canvas 객체를 가지고 있게 수정하였음.
        if (g_selected_object == null) {
            g_selected_object = $("#canvas");
        }

        if (typeof el === 'undefined') {
            $t = g_selected_object;
            s = $t.clone(false).wrap('<div>').parent().html();
        } else if (el === 'container') {
            $t = g_selected_container;
            s = $t.clone(false).wrap('<div>').parent().html();
        } else {
            $t = g_selected_object;
            $el = toObject(el);
            s = $el.html();
        }
        //convert < or > tag to &lt; and &gt;
        s = pureCode(s);

        $('#modal_popup_content div.modal-content').empty();

        var $code =  $('<div class="code-container"></div>')
                        .appendTo($('#modal_popup_content div.modal-content'))
                        .append('<pre></pre>')
                        .children();
        $code.append(s).snippet("html",{style:"kwrite"}); //whitengrey
        modalPop('Code View', $t.prop('tagName'));
    };

    modalPop = function (title, subtitle, content) {
        if(typeof content !== 'undefined'){
            $('#modal_popup_content div.modal-content').empty().html(content);
        }
        $('#modal_popup_content > div.modal-header > .title').empty().html(title);
        $('#modal_popup_content > div.modal-content > .subtitle').empty().html(subtitle);
        $('#modal_content').trigger('click');
    };

    alertTimeout = function (msg) {

        $('#loader').hide();

        var o = $('#alerts');
        o.html(msg).show();

        setTimeout(function () {
            o.hide();
        }, 1000);
    };

    return {
        initPage : initPage,
        containerDroppable : containerDroppable,
        canvasDroppable : canvasDroppable,
        outlineHighlight : outlineHighlight,
        saveProperty : saveProperty,
        showAttr : showAttr,
        edit_table      : edit_table,
        g_selected_object  : g_selected_object,
        g_editing_object : g_editing_object,
        object_id       : object_id,
        addToCanvas   : addToCanvas,
        addToContainer: addToContainer,
        getElementHtml: getElementHtml, // [2016-03-04 leesm] 클립보드 복사 기능 추가
        // XForm 고도화-조회연동. 컨트롤 HTML 생성. (장용욱:20160318)
        getElementHtml_ViewLink: getElementHtml_ViewLink, // 연동 클립보드 복사 기능 추가
        // XForm 고도화-저장연동. 컨트롤 HTML 생성. (장용욱:20160321)
        getElementHtml_WriteLink: getElementHtml_WriteLink,
        // [2016-03-29 leesm] XForm 고도화-템플릿
        getElementHtml_TemplateLink: getElementHtml_TemplateLink,
        selectedId      : selectedId,
        selectedObj     : selectedObj,
        selectedCon     : selectedCon,
        selectedTag     : selectedTag,
        containerSelected     : containerSelected,
        tableEditMode        : tableEditMode,
        draw            : draw,
        copy: copy,
        cut: cut,
        paste           : paste,
        duplicate       : duplicate,
        del             : del,
        quit            : quit,
        toggleTableEdit : toggleTableEdit,
        elementModal: elementModal,
        elementSelectable: elementSelectable,
        selectMode      : selectMode,
        containerSelectable: containerSelectable,
        viewCode        : viewCode,
        makeId          : makeId,
        addTableId      : addTableId,
        showStatus: showStatus,
        containerUnDroppable: containerUnDroppable,
        showHtmlCode: showHtmlCode,
        showOriginalCode: showOriginalCode,
        statTablePanel: statTablePanel,
        hideTablePanel: hideTablePanel,
        contentEditable: contentEditable,
        bindContentEditable: bindContentEditable,
        initContentEditable: initContentEditable,
        elementPanel: elementPanel,
        alertTimeout: alertTimeout,
        magic: magic,
        canvasMode: canvasMode,
        canvasRefresh: canvasRefresh
    };
}());
