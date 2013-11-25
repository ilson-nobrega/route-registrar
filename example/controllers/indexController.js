module.exports.before = function(req, res, next){
    console.log('Current Route: ');
    console.log(require('util').inspect(req.routeRegistrar.route));
    next();
};

module.exports.init = function(app){
    app.get("/", getIndex, {testing: true});
    app.get("/client/:id", getClient, {private: true});
};

function getClient(req, res, next) {
    res.send("Client #" + req.params.id);
}

function getIndex(req, res, next) {
    res.send("This works!");
}