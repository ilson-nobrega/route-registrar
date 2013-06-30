//run before testing: npm install express portfinder jade

var
	express = require("express"),
	portfinder = require("portfinder"),
	routeRegistrar = require("../routeRegistrar");
	
var app = express();
app.set('view engine', 'jade');

//route-registrar return an object containing meta info about your routes
var meta = routeRegistrar(__dirname + "/controllers", app, {
	foo: "bar"
});

//you can still register routes everywhere
app.get("/stillworks", function(req, res, next){
	res.send("Yes!");
}, {extra: "This route sends 'Yes!' to the browser"});

console.log(meta);

portfinder.getPort(function(err, port){
	if(err) throw new Error("Error finding available port");
	
	app.listen(port, function(){
		console.log("Listening on port " + port);
	});
});

