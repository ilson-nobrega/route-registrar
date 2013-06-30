var opt = null;

module.exports.before = function(req, res, next){
	console.log("I am called before the action (and every middlewares) - use me to load resources, for example");
	next();
};

module.exports.after = function(err, req, res, next){
	console.log("I am called after the action (and every middlewares) - " +
			"use me to give controller specific treatment for errors, or to release resources, for example");
	
	next(err);
}; 

module.exports.init = function(app, options){
	opt = options;
	
	//if the last parameter is an object, it will be passed back after
	//registering all the routes
	app.get("/", middlewareBefore, getIndex, middlewareAfter, {extra: "Route for main url"});
	app.post("/i-have-no-meta", function(req, res, next){ res.send(200); });
};

function getIndex(req, res, next){
	console.log("Executing main route now");
	return next(new Error("efwee"));
	
	res.render("index", {
		parameter: "works!",
		foo: opt.foo,
		importantThing: opt.importantThing
	});
}

function middlewareBefore(req, res, next){
	console.log("Middlewares **before** the action are still valid, nothing changes with your express syntax!");
	next();
}

function middlewareAfter(req, res, next){
	console.log("Middlewares **after** the action are still valid, nothing changes with your express syntax!");
	console.log("I am executed only if you call 'next' on your action");
	next();
}