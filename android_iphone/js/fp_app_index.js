(function(window, doc){
    var fp_app_index = function(options){
        var that = this;
        
        //default options
        that.options = {
            productWrapper: "product_wrapper",
			productList:".product_list"
        };
        
        // User defined options
        for (i in options) 
            that.options[i] = options[i];
        
        that._iscrollBeforeScrollStart = function(e){
            var target = e.target;
            while (target.nodeType != 1) 
                target = target.parentNode;
            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'A') 
                e.preventDefault();
        };
        that.productScroll = new iScroll(that.options.productWrapper, {
            checkDOMChanges: true,
            bounce: false,
            onBeforeScrollStart: that._iscrollBeforeScrollStart
        });
        that.refreshPS = function(){
            if (that.productScroll != undefined) 
                that.productScroll.refresh();
        };
        
        that.loadProducts = function(){
            new fp_ajax({
                url: new fp_app_base().url +"/a/Index",
                success: function(id, status, result){
					var tmpl = '<div ontouchstart="zy_touch("btn-act")" class="product_item ub ubb b-gra ub-ac umh5">'
							  +'<div class="lis-icon_1 ub-img ${cb:Type_Image_1}"></div>'
							  +'<div class="t-blu umar-r">'
							  +'${Product}'
							  +'</div>'
							  +'<div class="ub-f1 ut-s">'
							  +'${cb:Tactics_Title}'
							  +'</div>'
							  +'<div class="lis-icon_2 ub-img ${cb:Type_Image_2}"></div>'
							  +'</div>';
                    var list = JSON.parse(result);
					
					var tmpl_result =zy_tmpl(tmpl,list,zy_tmpl_count(list),function(data,cb){
						switch(cb[1]){
							case "Tactics_Title":
								if (data.Type == "Order") {
									return "入市位：" + data.入市位 + "  获利位：" + data.获利位 + "  止损位：" + data.止损位;
								}
								else{
									return data.Tactics_Title;									
								}
								break;
							case "Type_Image_1":
								if(data.Type == "Order"){
									if(data.Direction == "买/揸")
										return "im_o_b_1";
									else
										return "im_o_s_1";
								}
								else{
									return "im_t_1";
								}
								break;
							case "Type_Image_2":
								if(data.Type == "Order"){
									if(data.Direction == "买/揸")
										return "im_o_b_2";
									else
										return "im_o_s_2";
								}
								else{
									return "im_t_2";
								}
								break;
						}
						return "";
					});
					
					$(that.options.productList).html(tmpl_result);
                }
            });
        };
    };
    
    fp_app_index.prototype = {};
    
    if (typeof exports !== 'undefined') 
        exports.fp_app_index = fp_app_index;
    else 
        window.fp_app_index = fp_app_index;
    
})(window, document);
