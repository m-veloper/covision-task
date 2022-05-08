
// xform-load.js
// create container
var xform = {};

// REDIPS.table initialization
xform.init = function () {
    XFORM.canvas.init();
    //Overlay Editor. overlay를 사용하는 다른 기능보다 앞에 호출되어야 함.
    XFORM.overlay.init();
    //canvas view mode
    XFORM.viewmode.init();
    //canvas top menu
    XFORM.menu.init();
    //layout
    XFORM.layout.init();
    //show template list & load selected template
    XFORM.template.init();
    //temporary storage init
    XFORM.storage.init();
    //원본, 최종 편집 상태 옵션 선택
    XFORM.loadOption.init();

    XFORM.droppable.init();
    //context menu
    XFORM.context.init();
    //shortkey 
    XFORM.shortkey.init();

    //customize table on added to canvas 
    XFORM.customtable.init();
    //필드 CSS 수정 - Quick Editor
    XFORM.styler.init();
    //
    XFORM.form.initPage();
};
