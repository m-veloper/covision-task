//xform-tablehighlight.js
// Drag and Select
(function($){
    $.fn.highlight = function() {   
       
        this.each( function(){

            var $table = $(this);
            var isMouseDown = false,
            isHighlighted,
            oHighlight;
        
            if($table.prop('tagName').toLowerCase() == 'table'){
                oHighlight = $table.find('td');
            }else{
                oHighlight = $table;
            }
            
            oHighlight
            .mousedown(function () {
                if(event.which === 1){
                    isMouseDown = true;
                    $(this).toggleClass("highlighted");
                    isHighlighted = $(this).hasClass("highlighted");
                    return false; // prevent text selection
                }
            })
            .mouseover(function () {
                if (isMouseDown) {
                    $(this).toggleClass("highlighted", isHighlighted);
                }
            })
            .bind("selectstart", function () {
                return false;
            });
            
            $(document)
            .mouseup(function () {
                isMouseDown = false;
            });
            
        })
        
        
    };
})(jQuery);