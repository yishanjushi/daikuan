
	var com = {};

	com.alert = function (message, fn) {
	    if (typeof (cordova) == 'undefined') {
	        alert(message);
	        if (fn)
	            fn();
	    }
	    else
	        navigator.notification.alert(
	        message,  // message
	        fn,         // callback
	        '提示',            // title
	        '确定'                  // buttonName
	    );
	}


	com.confirm = function (message, confirmCallback, title, buttonLabels) {
	    
	    if (typeof (navigator.notification) == 'undefined') {
	        var r = confirm(message)
	        if (r == true) {
	            confirmCallback(1);
	        }
	        else {
	            confirmCallback(0);
	        }
	    }
	    else
	        navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
	}

	com.open = function (url) {
	    if (typeof (cordova) == 'undefined')
	        window.open(url);
	    else
	        cordova.ThemeableBrowser.open(url, '_blank', {
	            statusbar: {
	                color: '#3d81f1'
	            },
	            toolbar: {
	                height: 44,
	                color: '#3d81f1'
	            },
	            title: {
	                color: '#ffffff',
	                showPageTitle: true
	            },
	            closeButton: {
	                image: 'close',
	                imagePressed: 'close_pressed',
	                align: 'left',
	                event: 'closePressed'
	            },
	            backButtonCanClose: true
	        });
	}


	com.checkReload = function () {
	    var fn = function () {
	        document.location.reload();
	    }
	    //com.confirm('网络连接出错，需要重新载入吗', fn, '提示', ['取消', '刷新']);
	    com.alert('网络连接出错,重新载入',fn);
	}


	com.ajax = function (url, fn) {
	    if (url.indexOf('&') < 0 && url.indexOf('?') < 0)
	        url += '?';
	    else
	        url += '&';
	    //url += 'jv=' + Config.jv + '&self_id=' + User.self_id + '&user_id=' + User.user_id + '&token=' + escape(User.token) + '&_=' + new Date().getTime();
	    url += 'jv=' + '' + '&self_id=' + '0' + '&user_id=' + '0' + '&token=' + '' + '&_=' + new Date().getTime();
//	    var urlHost = getHost(url).toLowerCase();
//	    var thisHost = getHost(document.location.href).toLowerCase();
	//
//	    var data_type = urlHost == thisHost ? '' : 'jsonp';

	    var data_type = 'jsonp';
	    $.ajax({
	        dataType: data_type,
	        url: url,
	        success: function (data) {
	            if (fn)
	                fn(data);
	        },
	        error: function (ex, textStatus, errorThrown) {
	            var obj = JSON.parse('{ "code":' + ex.status + ', "msg":"' + ex.statusText + '"}');
	            if (fn)
	                fn(obj);
	        }
	    });
	};
	
	
	com.setItem= function(key, val, c) {
	    if (c === undefined)
	        window.localStorage.setItem(key, val);
	    else
	        $.cookie(key, val);
	};
	
	com.getItem = function (key,c){
	    if (c === undefined)
	        return window.localStorage.getItem(key);
	    else
	        $.cookie(key);
	};
	
	com.removeItem = function(key, c) {
	    if (c === undefined)
	        window.localStorage.removeItem(key);
	    else
	        $.cookie(key, '');
	};
	
	com.clearItem = function() {
	    window.localStorage.clear();
	};
	
	

	com.getHost = function(url) {
	    var host = "null";
	    if (typeof url == "undefined"
	                        || null == url)
	        url = window.location.href;
	    var regex = /.*\:\/\/([^\/]*).*/;
	    var match = url.match(regex);
	    if (typeof match != "undefined"
	                        && null != match)
	        host = match[1];
	    return host;
	};

	com.today = function () {
	    var dd = new Date();

	};

	com.myDate = function(dt) {
	    var tmp = dt + '';
	    tmp = tmp.replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/');
	    return new Date(tmp);
	};

	com.convertToDateTime = function (dt, format) {
	    var date = com.myDate(dt);
	    var y = date.getFullYear();
	    var m = date.getMonth() + 1;
	    var d = date.getDate();
	    if (format == '1') {
	        return y + '年' + m + '月' + d + '日';
	    }
	    else
	        if (format == '2') {
	            if (m < 10) m = '0' + m;
	            if (d < 10) d = '0' + d;
	            return y + '-' + m + '-' + d;
	        }
	    return '';
	};

	com.getURLParam = function (url, paramName) {

	    //取得参数开始后面的整个字符串
	    var iPos = url.indexOf("&" + paramName + "=");
	    if (iPos < 0) iPos = url.indexOf("?" + paramName + "=");
	    if (iPos < 0) return "";
	    url = url.substr(iPos + 1);
	    //去掉后面的参数
	    iPos = url.indexOf("&");
	    if (iPos > -1) url = url.substr(0, iPos);
	    iPos = url.indexOf("=");
	    url = url.substr(iPos + 1);
	    return decodeURIComponent(url);
	};
	
	
	com.checkMobile = function(mobile){ 
	    if((/^1[34578]\d{9}$/.test(mobile))){ 
	        return true; 
	    }
	    return false;
	};

	com.addMonth = function (dtstr, n) {   // n个月后 
	    dtstr = dtstr.replace('-', '/').replace('-', '/');
	    var date = new Date(dtstr);
	    date.setMonth(date.getMonth() + n*1);
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    if (month < 10)
	        month = '0' + month;
	    var day = date.getDate();
	    if (day < 10)
	        day = '0' + day;
	    return year+'-'+month+'-'+day;
	}

	window.com = com; //js表达式需要使用

