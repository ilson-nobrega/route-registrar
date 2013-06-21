module.exports.init = function(app, options){
	console.log("productController has access to: ");
	console.log(options);
	
	app.get("/products", function(req, res, next){
		res.send("Products!");
	});
};

module.exports.before = function(req, res, next){
	console.log("---");
	console.log("ONLY BEFORE PRODUCTS!");
	console.log("---");
	next();
};