/**
 * 문서유통 한글 필터
 * ----------------------------------------------------------------------
 * 작성자		: dgkim
 * 최종수정일	: 2020-11-27
 * ----------------------------------------------------------------------
 */
(function(j){
	j.extend({
		convertHWP : function(html){
			
			if (!(this instanceof arguments.callee )) return new arguments.callee(html);
			
			var $ele = $(html).wrapAll('<div>').parent();
			
			this.getHtml = function(){
				return $ele.html();
			}
			
			this.getObj = function(){
				return $ele;
			}
			
			this.convertTHtoTD = function(){
				$('table th',$ele).map(function(){
					var $td = $("<td>");
					Array.prototype.slice.call( this.attributes ).forEach(function(item,idx){ $td.attr( item.name ,item.value); }.bind(this));
					$(this).replaceWith( $td.append( this.innerHTML ) );
				})
			}
			
			this.convertTableStyle = function(){
				var tableStyleAttributes = ['width','height'];					
				$('table,table tr,table td',$ele).each(function(){
					var _this = $(this);
				   	Array.prototype.slice.call( this.attributes ).forEach(function(item,idx){    	
				    if( item.name === 'style' ){      	
				      	tableStyleAttributes.forEach(function(name,idx){
				      		$.trim(this.style[name]) && $(_this).attr(name, this.style[name].replace(/[^0-9\.]/gi,'')).css(name,''); 
				        }.bind(this))
				      }else{      	
				        $.trim( this.getAttribute( item.name ) ) || this.removeAttribute( item.name );
				      }
				    }.bind(this))    
				});	
			}
		}
	})
})($)
