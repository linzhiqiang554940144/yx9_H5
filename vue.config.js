// if (process.env.NODE_ENV === 'development') {
// 	module.exports = {
// 	    chainWebpack: config => {
// 	        config.plugin("define")
// 	            .tap(args => {    
// 	                args[0]["process.env"].API = JSON.stringify("http://devapi.youxi9.com");
// 					args[0]["process.env"].USER_API = JSON.stringify("https://devuser.youxi9.com"); 
// 					args[0]["process.env"].CDN = JSON.stringify("https://cdn.youxi9.com"); 
// 	                args[0]["VERSION"]=JSON.stringify("1.0.0");
// 	                return args;    
// 	            });    
// 	    },    
// 	};
// } else {
// 	module.exports = {
// 	    chainWebpack: config => {
// 	        config.plugin("define")
// 	            .tap(args => {    
// 	                args[0]["process.env"].API = JSON.stringify("https://api.youxi9.com");
// 	                args[0]["process.env"].USER_API = JSON.stringify("https://user.youxi9.com");
// 					 args[0]["process.env"].CDN = JSON.stringify("https://cdn.youxi9.com"); 
// 	                args[0]["VERSION"]=JSON.stringify("1.0.0");
// 	                return args;    
// 	            });    
// 	    },    
// 	};
// }

//测试打包
module.exports = {
	chainWebpack: config => {
		config.plugin("define")
			.tap(args => {    
				args[0]["process.env"].API = JSON.stringify("http://devapi.youxi9.com");
				args[0]["process.env"].USER_API = JSON.stringify("https://devuser.youxi9.com"); 
				args[0]["process.env"].CDN = JSON.stringify("https://cdn.youxi9.com"); 
				args[0]["VERSION"]=JSON.stringify("1.0.0");
				return args;    
			});    
	},    
};