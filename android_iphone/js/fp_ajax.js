(function(window, doc){
    var appcan_xmlhttpmgr_id = 0;
    var fp_ajax = function(options){
        var that = this;
        
        //default options
        that.options = {
            url: "",
            type: "GET",
            success: function(id, status, result){
            },
            id: appcan_xmlhttpmgr_id++,
            timeout: ""
        };
        
        // User defined options
        for (i in options) 
            that.options[i] = options[i];
        
		that.load = function(){
			console.log(that.options.url);
			$("#msg_overlay").removeClass("uhide");
			uexWindow.toast(1,5,'  正在加载数据...     ',0);
			uexXmlHttpMgr.onData = function(id, status, result){
                if (status == 1) {
                    that.options.success(id, status, result);
                    uexXmlHttpMgr.close(id);
                }
                //window.localStorage.setItem(that.options.url, result);
				fp_data.setItem(that.options.url,result);
				
				uexWindow.closeToast();
				$("#msg_overlay").addClass("uhide");				
            };
            uexXmlHttpMgr.open(that.options.id, that.options.type, that.options.url, that.options.timeout);
            uexXmlHttpMgr.send(that.options.id);
		};
		
        var localData = fp_data.getItem(that.options.url);//window.localStorage.getItem(that.options.url);
        if (localData == 'undefined') {
            that.options.success(that.options.id, 999, localData);
			that.load();
        }
        else {
            that.load();
        }
    };
    
    fp_ajax.prototype = {};
    
    if (typeof exports !== 'undefined') 
        exports.fp_ajax = fp_ajax;
    else 
        window.fp_ajax = fp_ajax;
    
})(window, document);
