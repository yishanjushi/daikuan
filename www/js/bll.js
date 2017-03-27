
var bll = {};
	//bll.service = 'http://192.168.20.41:8088/';
	//bll.service = 'http://192.168.0.100:8088/'; //tianhu
    //bll.service = 'http://192.168.31.215:8088/';
    //bll.service = 'http://192.168.0.138:8088/';
	bll.service = 'http://app.doapple.com/iad-appapi/';
	bll.imgserv = 'http://doapple-img.oss-cn-hangzhou.aliyuncs.com/dmh/';
	//bll.service = 'http://localhost:8088/';

	bll.app_id = 1;
	bll.title = '51贷款之家';
	bll.version='1.0.0';
	bll.user_id=10;
	bll.self_id=0;
	bll.open_udid='';
	bll.user_token='';
	
	bll.getUser=function()
	{
		var tmp = com.getItem("User");
		if(tmp==null||tmp=='')
			return null;
		var obj = JSON.parse(tmp);
		return obj;
	};
	
	bll.getUserId=function()
	{
		var user = bll.getUser();
		if(user==null)	return 0;
		return user.user_id;
	};
	
	bll.getToken=function()
	{
		var user = bll.getUser();
		if(user==null)	return '';
		return user.token;
	};
	
	bll.getNickname = function()
	{
		var user = bll.getUser();
		if(user==null)	return '';
		return user.nick_name;
	};
	
	bll.isLogin=function()
	{
		var user = bll.getUser();
		if(user==null) return false;
		if(user.user_id>0&&user.token.length>0)
			return true;
		return false;   
    };

    bll.get = function ($http,url,fn) {
        $http.jsonp(url).success(function (data) {
            fn(data);
        }).error(
            function (e) { fn({ "code": 100, "msg": "网络问题,请重试" }) }
        );
    }


    bll.newPass = function (pw, newPw, fn, $http) {
        var data =
		    {
		        "cmd": "D000111",
		        "userId": bll.getUserId(),
		        "token": bll.getToken(),
		        "version": bll.version,
		        "data": {
		            "pw": pw,
		            "new_pw": newPw
		        }
		    };

        var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
        bll.get($http, url, fn);
    };

    bll.login = function (type, mobile, pw, fn, $http) {
        var data =
		{
		    "cmd": "D000110",
		    "userId": bll.user_id,
		    "token": bll.user_token,
		    "version": bll.version,
		    "data": {
		        "type": type,
		        "mobile": mobile,
		        "pw": pw
		    }
		};

        var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';

        bll.get($http, url,
        function (data) {
            if (data && data.code == 0) {
                com.setItem("User", JSON.stringify(data.User));
            }
            fn(data);
        }
        );
    };

	bll.logout = function (fn) {
	    com.removeItem("User");
	    if (fn) fn();
	}

	bll.logView = function (type, content, $http) {
	    var Device = {};
	    if (typeof (device) == 'object') {
	        Device = device;
	    }
	    var data =
			{
			    "cmd": "D000012",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
			        "event_type": type,
			        "event_content": content
			    },
			    "Device": Device
			};
	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, function () { });
	}


	bll.getUserInfo = function (fn, $http) {
	    var data =
			{
			    "cmd": "D000112",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {}
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};

	bll.getLoanPlats = function (platType, fn, $http) {
	    var data =
		{
			"cmd": "D010501",
			"userId": bll.getUserId(),
			"token": bll.getToken(),
			"version": bll.version,
			"data": {
            "plat_type":platType
            }
		};

		var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';

	    bll.get($http, url, fn);
	};


	bll.getLoanPlat = function (platId, fn, $http) {
	    var data =
			{
			    "cmd": "D010505",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
                "plat_id":platId
                }
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	}

	bll.getLoanLines = function (showHide, fn, $http) {
	    var data =
			{
			    "cmd": "D010507",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {"show_hide":showHide}
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	}

	bll.getLoanLine = function (lineId, fn, $http) {
	    var data =
			{
			    "cmd": "D010509",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
                line_id:lineId
                }
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	}

	bll.setLoanLine = function (item, fn, $http) {
	    var data =
			{
			    "cmd": "D010508",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": item
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};

	bll.saveLoanLine = function (item, fn, $http) {
	    var data =
			{
			    "cmd": "D010506",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": item
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};


	bll.getLoanMaterial = function (fn, $http) {
	    var data =
			{
			    "cmd": "D010504",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {}
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};

	bll.saveLeave = function (platId, content, fn, $http) {
	    var data =
			{
			    "cmd": "D010502",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
			        "plat_id": platId,
			        "content": content
			    }
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};

	bll.getLeaves = function (platId, fn, $http) {
	    var data =
			{
			    "cmd": "D010503",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
                "plat_id": platId
                }
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};

	bll.sendMessage = function (obj, fn, $http)
	{
	    var data =
			{
			    "cmd": "D000010",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
			        "app_id": bll.app_id,
			        "content_type": obj.content_type,
			        "content": obj.content,
                    "auto_id":obj.auto_id
			    }
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	}

	bll.getMessages = function (lastAutoId, fn, $http) {
	    var data =
			{
			    "cmd": "D000011",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
			        "app_id": bll.app_id,
			        "last_auto_id": lastAutoId
			    }
			};

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, fn);
	};

	bll.getPicPath = function (n) {
	    if (n.length == 0)
	        return 'img/nopro.jpg';
	    return this.imgserv + 'pics/' + n;
	}

	bll.getHeadPath = function (n) {
	    if (n.length == 0)
	        return 'img/nohead.jpg';
	    return this.imgserv + 'head/' + n;
	}



    bll.saveUserInfo = function(User, fn, $http) {
    	var data =
		{
			"cmd": "B000112",
			"userId": bll.getUserId(),
			"token": bll.getToken(),
			"version": bll.version,
			"data": {  
                "nick_name": User.nick_name
            }
		};

	    var url = bll.service + 'bv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    $http.jsonp(url).success(function (data) {
	        fn(data);
	    });
    }

	

    bll.setProductPic = function (proId, picName, type, fn, $http) {
        var data =
			{
			    "cmd": "B000109",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
			        "pro_id": proId,
			        "pic_name": picName,
			        "type": type//1设为默  2删除
			    }
			};

        var url = bll.service + 'bv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
        $http.jsonp(url).success(function (data) {
            fn(data);
        });
    };

	window.bll = bll; //js表达式需要使用

