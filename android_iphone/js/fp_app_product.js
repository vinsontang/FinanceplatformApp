(function(window, doc){
    var fp_app_product = function(options){
        var that = this;
        
        //default options
        that.options = {
            productTypeWrapper: "product_type_wrapper",
            productTypeList: ".product_type_list",
            productTypeItem: ".product_type_item",
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
        that.productTypeScroll = new iScroll(that.options.productTypeWrapper, {
            hScrollbar: false,
            checkDOMChanges: true,
            bounce: false,
            onBeforeScrollStart: that._iscrollBeforeScrollStart
        });
        that.productScroll = new iScroll(that.options.productWrapper, {
            checkDOMChanges: true,
            bounce: false,
            onBeforeScrollStart: that._iscrollBeforeScrollStart
        });
        that.refreshPTS = function(){
            if (that.productTypeScroll != undefined) {
                var productTypeListWidth = 0;
                $(that.options.productTypeItem, that.options.productTypeList).each(function(){
                    productTypeListWidth += $(this).outerWidth();
                });
                $(that.options.productTypeList).width(productTypeListWidth);
                that.productTypeScroll.refresh();
            }
        };
        that.refreshPS = function(){
            if (that.productScroll != undefined) 
                that.productScroll.refresh();
        };
        
        that.loadProductTypes = function(){
            new fp_ajax({
                url: new fp_app_base().url +"/a/ProductList",
                success: function(id, status, result){
                    var tmpl = '<div class="product_type_item ufl uinn" productId="${ID}">' +
                    '${Name}' +
                    '</div>';
                    
                    var list = JSON.parse(result);
                    var tmpl_result = zy_tmpl(tmpl, list, zy_tmpl_count(list));
                    $(that.options.productTypeList).html(tmpl_result);
                    
                    that.refreshPTS();
                    
                    $(that.options.productTypeItem).unbind('click').bind('click', function(){
                        that.loadProductListById($(this).attr('productId'));
                    });
                }
            });
        };
        
        that.loadProductListById = function(id){
            new fp_ajax({
                url: new fp_app_base().url + "/a/Product?id=" + id,
                success: function(id, status, result){
                    var tmpl = '<div class="product_item ub ubb b-gra ub-ac umh5">' +
                    '<div class="lis-icon_1 ub-img ${cb:Type_Image_1}"></div>' +
                    '<div class="ub-f1 ut-s">' +
                    '${cb:Tactics_Title}' +
                    '</div>' +
                    '<div class="lis-icon_2 ub-img ${cb:Type_Image_2}"></div>' +
                    '</div>';
                    var list = JSON.parse(result);
                    
                    var tmpl_result = zy_tmpl(tmpl, list, zy_tmpl_count(list), function(data, cb){
                        switch (cb[1]) {
                            case "Tactics_Title":
                                if (data.Type == "Order") {
                                    return "入市位：" + data.入市位 + "  获利位：" + data.获利位 + "  止损位：" + data.止损位;
                                }
                                else {
                                    return data.Tactics_Title;
                                }
                                break;
                            case "Type_Image_1":
                                if (data.Type == "Order") {
                                    if (data.Direction == "买/揸") 
                                        return "im_o_b_1";
                                    else 
                                        return "im_o_s_1";
                                }
                                else {
                                    return "im_t_1";
                                }
                                break;
                            case "Type_Image_2":
                                if (data.Type == "Order") {
                                    if (data.Direction == "买/揸") 
                                        return "im_o_b_2";
                                    else 
                                        return "im_o_s_2";
                                }
                                else {
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
    
    fp_app_base.prototype = {};
    
    if (typeof exports !== 'undefined') 
        exports.fp_app_product = fp_app_product;
    else 
        window.fp_app_product = fp_app_product;
    
})(window, document);
