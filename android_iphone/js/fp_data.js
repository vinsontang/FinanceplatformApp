(function(window, doc){
    var fp_data = function(){
	};
    
    fp_data.prototype = {};
	
	fp_data.setItem = function(key,value,before,after){
		if(!window.localStorage)
			return false;
		
		var temp = window.localStorage.getItem(key);
		var cancel = false;
		
		if(before)
			cancel = before(key,temp);
			
		if(cancel)
			return false;

		window.localStorage.setItem(key,value);
			
		if(after)
			after(key,temp);
			
		return true;
	};
	
	fp_data.getItem = function(key){
		if(!window.localStorage)
			return undefined;
			
		return window.localStorage.getItem(key);
	};
	
    
    if (typeof exports !== 'undefined') 
        exports.fp_data = fp_data;
    else 
        window.fp_data = fp_data;
    
})(window, document);
