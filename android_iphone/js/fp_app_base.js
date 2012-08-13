(function(window, doc){	
    var fp_app_base = function(){
        var that = this;
			
		that.url = "http://www.1sttz.com"; //"http://192.168.1.11";
    };
	
    fp_app_base.prototype = {};
	
	if (typeof exports !== 'undefined') exports.fp_app_base = fp_app_base;
	else window.fp_app_base = fp_app_base;
	
})(window, document);
