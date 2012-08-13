(function(window, doc){
    var fp_app_index = function(options){
        var that = this;
        
        //default options
        that.options = {
            productTypeWrapper: "product_type_wrapper",
            productTypeList: ".product_type_list",
            productTypeItem: ".product_type_item",
            productWrapper: "product_wrapper",
            productList: ".product_list"
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
        
        that.currentActiveProductType;
        that.loadProductTypes = function(){
            new fp_ajax({
                url: new fp_app_base().url + "/a/ProductList",
                success: function(id, status, result){
                    var tmpl = '<div class="product_type_item ufl uinn6 t-wh" productTypeId="${ID}">' +
                    '${Name}' +
                    '</div>';
                    
                    var tempArray = new Array();
                    tempArray.push({
                        ID: 0,
                        Name: "推荐"
                    });
                    
                    var list = tempArray.concat(JSON.parse(result));
                    
                    var tmpl_result = zy_tmpl(tmpl, list, zy_tmpl_count(list));
                    $(that.options.productTypeList).html("");
                    $(that.options.productTypeList).html(tmpl_result);
                    
                    that.refreshPTS();
                    
                    $(that.options.productTypeItem).unbind('click').bind('click', function(){
                        var target = this;
                        
                        if (that.currentActiveProductType) 
                            $(that.currentActiveProductType).removeClass("active");
                        that.currentActiveProductType = target;
                        $(that.currentActiveProductType).addClass("active");
                        
                        that.loadProductList($(target).attr('productTypeId'));
                    });
                    
                    //active first product type
                    $(".product_type_item:first").click();
                }
            });
        };
        
        that.loadProductList = function(id){
            if (id == 0) {
                that.loadIndexList();
            }
            else {
                that.loadProductListById(id);
            }
        };
        that.loadIndexList = function(){
            new fp_ajax({
                url: new fp_app_base().url + "/a/Index",
                success: function(id, status, result){
                    var tmpl = '<div ontouchstart="zy_touch("btn-act")" class="product_item ub ubb b-gra ub-ac umh5" productId="${ID}" publicType="${Type}">' +
                    '<div class="lis-icon_1 ub-img ${cb:Type_Image_1}"></div>' +
                    '<div class="t-blu umar-r">' +
                    '${Product}' +
                    '</div>' +
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
                    
                    $(that.options.productList).html("");
                    $(that.options.productList).html(tmpl_result);
                    
                    $(".product_item").unbind('click').bind('click', function(){
                        that.productClick($(this).attr('productId'), $(this).attr('publicType'));
                    });
                }
            });
        };
        that.loadProductListById = function(id){
            new fp_ajax({
                url: new fp_app_base().url + "/a/Product?id=" + id,
                success: function(id, status, result){
                    var tmpl = '<div class="product_item ub ubb b-gra ub-ac umh5"  productId="${ID}" publicType="${Type}">' +
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
                    
                    $(that.options.productList).html("");
                    $(that.options.productList).html(tmpl_result);
                    
                    $(".product_item").unbind('click').bind('click', function(){
                        that.productClick($(this).attr('productId'), $(this).attr('publicType'));
                    });
                }
            });
        };
        
        that.productClick = function(id, type){
			fp_data.setItem("n-p-id",id);
            switch (type) {
                case "Order":
                    uexWindow.open('product', '0', 'order.html', 2, '', '', 0);
                    break;
                case "Tactics":
                    uexWindow.open('product', '0', 'tactics.html', 2, '', '', 0);
                    break;
            }
        }
    };
    
    fp_app_index.prototype = {};
    
    if (typeof exports !== 'undefined') 
        exports.fp_app_index = fp_app_index;
    else 
        window.fp_app_index = fp_app_index;
    
})(window, document);
