(function(window, doc){	
    var fp_ajax = function(options){
        var that = this;
        
        //default options
        that.options = {
            url: "",
            type: "GET",
            success: function(id,status,result){
            },
            id: Math.floor(Math.random() * 10000),
			timeout:""
        };
        
        // User defined options
        for (i in options) 
            that.options[i] = options[i];
					
		uexXmlHttpMgr.onData = function(id,status,result){
			if (status == 1) {
				that.options.success(id, status, result);
				uexXmlHttpMgr.close(id);
			}
		};
		uexXmlHttpMgr.open(that.options.id,that.options.type,that.options.url,that.options.timeout);
		uexXmlHttpMgr.send(that.options.id);

//		$.getJSON(that.options.url,function(data){
//			alert(data);
//			that.options.success(0,1,data);
//		},"json",function(error){
//			alert(error);
//		},that.options.type,true);
    };
	
    fp_ajax.prototype = {};
	
	if (typeof exports !== 'undefined') exports.fp_ajax = fp_ajax;
	else window.fp_ajax = fp_ajax;
	
})(window, document);
