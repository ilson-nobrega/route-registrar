//run before testing: npm install express portfinder jade

var
	express = require("express"),
	portfinder = require("portfinder"),
	routeRegistrar = require("../routeRegistrar");

var app = express();

var routes = routeRegistrar.find(__dirname + "/controllers", app);

//any configurations here!

routeRegistrar.register(true);

portfinder.getPort(function(err, port){
	if(err) throw new Error("Error finding available port");

	app.listen(port, function(){
		console.log("Listening on port " + port);
	});
});

