
var bll = {};
	//bll.service = 'http://192.168.20.41:8088/';
	//bll.service = 'http://192.168.0.100:8088/'; //tianhu
    //bll.service = 'http://192.168.31.215:8088/';
    //bll.service = 'http://192.168.0.138:8088/';
	bll.service = 'http://app.doapple.com/iad-appapi/';
	bll.imgserv = 'http://doapple-img.oss-cn-hangzhou.aliyuncs.com/dmh/';
	//bll.service = 'http://localhost:8088/';

	bll.app_id = 1;
	bll.title = '51贷款管家';
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

	bll.getUuId = function () {
	    if (window.device)
	        return window.device.uuid;
	    return '';
	}
	
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

    bll.get = function ($http, url, fn) {
        return $http.jsonp(encodeURI(url)).success(function (data) {
            if (data && data.code == 101) {//登录验证失败
                com.removeItem("User");
            }
            fn(data);
        }).error(
            function (e) { console.log(e); fn({ "code": 100, "msg": "网络问题,请重试" }) }
        );
    }

    bll.post = function ($http, url, param, fn) {
        $http.post(url, param, { 'Content-Type': 'application/x-www-form-urlencoded' }).success(function (data) {
            if (data && data.code == 101) {//登录验证失败
                com.removeItem("User");
            }
            fn(data);
        }).error(
            function (e) { console.log(e); fn({ "code": 100, "msg": "网络问题,请重试" }) }
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
	    var tmp =
        {
            "uuid":"test",
            "platform": "Windows 7",
            "model": ""
        }
	    var data =
			{
			    "cmd": "D000012",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {
			        "app_id": bll.app_id,
			        "event_type": type,
			        "event_content": content
			    },
			    "Device": typeof (window.device) == 'undefined' ? tmp : window.device
			};
	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    bll.get($http, url, function () { });
	    //bll.post($http, bll.service + 'xv1.htm', data, function () { });
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

	bll.getServeInfo = function (fn, $http) {
	    var data =
			{
			    "cmd": "D010510",
			    "userId": bll.getUserId(),
			    "token": bll.getToken(),
			    "version": bll.version,
			    "data": {}
			};
		var inFn = function (data) {
			if (data && data.code == 0) {
			    com.setItem("ServeInfo", JSON.stringify(data));
			}
			else {
			    try {
			        var str = com.getItem("ServeInfo");
			        if (str != null) {
			            data = JSON.parse(str);
			        }
			    }
			    catch (e) {
			        console.log(e);
			        com.removeItem("ServeInfo");
			    }
			}
			fn(data);
		}
	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    return bll.get($http, url, inFn);
	};

	bll.getLoanPlats = function (platType, fn, $http) {
	    var data =
		{
		    "cmd": "D010501",
		    "userId": bll.getUserId(),
		    "token": bll.getToken(),
		    "version": bll.version,
		    "data": {
		        "plat_type": platType
		    }
		};

	    var inFn = function (data) {
	        if (data && data.code == 0) {
	            com.setItem("LoanPlats", JSON.stringify(data));
	        }
	        else {
	            try {
	                var str = com.getItem("LoanPlats");
	                if (str != null) {
	                    data = JSON.parse(str);
	                }
	            }
	            catch (e) {
	                console.log(e);
	                com.removeItem("LoanPlats");
	            }
	        }
	        fn(data);
	    }

	    try {
	        if (com.getItem("LoanPlats") != null && com.getItem("ServeInfo") != null) {
	            var obj = JSON.parse(com.getItem("ServeInfo"));
	            var obj1 = JSON.parse(com.getItem("LoanPlats"));
	            if (obj.ModifyTime.loan_plat_time == obj1.loan_plat_time) {
	                inFn({ "code": 101 });
	                return;
	            }
	        }
	    }
	    catch (e) {
	        console.log(e);
	        com.removeItem("ServeInfo");
	        com.removeItem("LoanPlats");
	    }

	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';

	    return bll.get($http, url, inFn);
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
			    "data": { "show_hide": showHide }
			};
	    var inFn = function (data) {
	        if (data && data.code == 0) {
	            com.setItem("LoanLines", JSON.stringify(data));
	        }
	        else {
	            try {
	                var str = com.getItem("LoanLines");
	                if (str != null) {
	                    data = JSON.parse(str);
	                }
	            }
	            catch (e) {
	                console.log(e);
	                com.removeItem("LoanLines");
	            }
	        }
	        fn(data);
	    }




	    var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    return bll.get($http, url, inFn);
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

		var inFn = function (data) {
			if (data && data.code == 0) {
			    com.setItem("LoanMaterial", JSON.stringify(data));
			}
			else {
			    try {
			        var str = com.getItem("LoanMaterial");
			        if (str != null) {
			            data = JSON.parse(str);
			        }
			    }
			    catch (e) {
			        console.log(e);
			        com.removeItem("LoanMaterial");
			    }
			}
			fn(data);
        }

        try {
            if (com.getItem("LoanMaterial") != null && com.getItem("ServeInfo") != null) {
                var obj = JSON.parse(com.getItem("ServeInfo"));
                var obj1 = JSON.parse(com.getItem("LoanMaterial"));
                if (obj.ModifyTime.loan_material_time == obj1.loan_material_time) {
                    inFn({ "code": 101 });
                    return;
                }
            }
        }
        catch (e) {
            console.log(e);
            com.removeItem("ServeInfo");
            com.removeItem("LoanMaterial");
        }



        var url = bll.service + 'xv1.htm?data=' + JSON.stringify(data) + '&callback=JSON_CALLBACK';
	    return bll.get($http, url, inFn);
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

	bll.sendMessage = function (obj, fn, $http) {
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
			        "auto_id": obj.auto_id,
                    "uuid":bll.getUuId()
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
			        "last_auto_id": lastAutoId,
                    "uuid":bll.getUuId()
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

