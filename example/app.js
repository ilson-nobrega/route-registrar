//run before testing: npm install express portfinder

var
	express = require("express"),
	portfinder = require("portfinder"),
	routeRegistrar = require("../routeRegistrar");
	
var app = express();

routeRegistrar(__dirname, app, {
	foo: "bar",
	importantThing: true
});

app.get("/stillworks", function(req, res, next){
	res.send("Yes!");
});

portfinder.getPort(function(err, port){
	if(err) throw new Error("Error finding available port");
	
	app.listen(port, function(){
		console.log("Listening on port " + port);
	});
});

