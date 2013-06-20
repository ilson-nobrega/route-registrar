var
	fs = require("fs"),
	path = require("path");

module.exports = function(lookUpPath){
	return function(app, options){
		fs.readdirSync(lookUpPath).forEach(function(controllerName){
			if(controllerName.indexOf("Controller.js") !== -1){
				var controller = require(path.join(lookUpPath, controllerName));
				controller.init(app);
			}
		});
	};
};
