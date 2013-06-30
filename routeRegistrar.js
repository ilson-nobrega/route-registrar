var
	fs = require("fs"),
	path = require("path"),
	methods = require("methods"),
	oUtils = require("gammautils").object,
	aUtils = require("gammautils").array,
	_ = require("underscore");

module.exports = function(lookUpPath, app, options){
	methods.push("all");
	methods.push("del");
	
	var routes = [];
	methods.forEach(function(method){
		app[method] = _.wrap(app[method], function(fn){
			var args = oUtils.argsToArray(arguments, 1);
			
			var meta = { method: method, route: args[0]};
			if(args.length > 2 && oUtils.isObject(args[args.length - 1])){
				meta.meta = args[args.length - 1];
				aUtils.removeLast(args);
			} 
			
			routes.push(meta);
			
			var before = arguments.callee.caller.caller.before;
			if(before) aUtils.insertAt(args, 1, before);
			
			var after = arguments.callee.caller.caller.after;
			if(after) aUtils.insertAt(args, args.length - 1, after);

			return fn.apply(app, args);
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
	
	return routes;
};
