module.exports.init = function(app, options){
	console.log("clientController has access to: ");
	console.log(options);
	
	app.get("/clients", function(req, res, next){
		res.send("Clients!");
	});
};

module.exports.before = function(req, res, next){
	console.log("---");
	console.log("BEFORE CLIENTS!");
	next();
};

module.exports.after = function(req, res, next){
	console.log("AFTER CLIENTS!");
	console.log("---");
	next();
};