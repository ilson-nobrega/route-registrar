var
	fs = require("fs"),
	path = require("path"),
	methods = require("methods"),
	oUtils = require("gammautils").object,
	aUtils = require("gammautils").array,
	_ = require("underscore");

function pathRegExp(path, keys, sensitive, strict) {
	//this code comes from express: 
	//https://github.com/visionmedia/express/blob/master/lib/utils.js#L293-L313
	
	if (toString.call(path) == '[object RegExp]') return path;
	if (Array.isArray(path)) path = '(' + path.join('|') + ')';
	path = path
		.concat(strict ? '' : '/?')
		.replace(/\/\(/g, '(?:/')
		.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
      
			keys.push({ name: key, optional: !! optional });
			slash = slash || '';
			return ''
				+ (optional ? '' : slash)
		        + '(?:'
		        + (optional ? slash : '')
		        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
		        + (optional || '')
		        + (star ? '(/*)?' : '');
    })
    	.replace(/([\/.])/g, '\\$1')
    	.replace(/\*/g, '(.*)');
  
	return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}

var appBkp = null;
var unregisteredRoutes = [];

module.exports.register = function(debug){
	unregisteredRoutes.sort(function(a, b){
		a = a.args[0].split("/");
		b = b.args[0].split("/");
		
		if(a.length !== b.length){
			return a.length - b.length;
		}else{
			for(var i = 0; i < a.length; i++){
				if(a[i].indexOf(":") === 0) return 1;
				if(b[i].indexOf(":") === 0) return -1;
			}
			
			return 0; 
		}
	});
	
	unregisteredRoutes.forEach(function(route){
		if(debug)
			console.log(route.args[0]);
		
		route.fn.apply(appBkp, route.args);
	});
};

module.exports.find = function(lookUpPath, app, options){
	appBkp = app;
	
	methods.push("all");
	methods.push("del");
	
	var routes = [];
	methods.forEach(function(method){
		app[method] = _.wrap(app[method], function(fn){
			var args = oUtils.argsToArray(arguments, 1);
			
			if(args.length === 1 && method === "get")
				return fn.apply(app, args);
			else{
				var params = [];
				var meta = { 
						method: (method === "del" ? "delete" : method),
						regexp: pathRegExp(args[0], params, false, false),
						params: params,
						path: args[0], 
						meta: {}
				};
				
				if(args.length > 2 && oUtils.isObject(args[args.length - 1])){
					meta.meta = args[args.length - 1];
					aUtils.removeLast(args);
				} 
				
				routes.push(meta);
				
				var before = arguments.callee.caller.caller.before;
				if(before) aUtils.insertAt(args, 1, before);
				
				var after = arguments.callee.caller.caller.after;
				if(after) aUtils.insertAt(args, args.length - 1, after);
				
				unregisteredRoutes.push({fn: fn, args: args});
			}
		});
	});
	
	fs.readdirSync(lookUpPath).forEach(function(controllerName){
		if(controllerName.indexOf("Controller.js") !== -1){
			var controller = require(path.join(lookUpPath, controllerName));
			if(controller.init){
				if(controller.before) controller.init.before = controller.before; 
				if(controller.after) controller.init.after = controller.after;
				
				controller.init(app, options);
			}
			else throw new Error("Controllers must have a 'module.exports.init' function");
		}
	});
	
	routes.sort(function(a, b){
		a = a.path.split("/");
		b = b.path.split("/");
		
		if(a.length !== b.length){
			return a.length - b.length;
		}else{
			for(var i = 0; i < a.length; i++){
				if(a[i].indexOf(":") === 0) return 1;
				if(b[i].indexOf(":") === 0) return -1;
			}
			
			return 0; 
		}
	});
	
	return routes;
};
