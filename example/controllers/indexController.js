module.exports.before = function(req, res, next){
    console.log(' >>> This will be called before every action <<<');
    next();
};

module.exports.init = function(app){
    app.get("/", getIndex);
};

function getIndex(req, res, next){
    res.send("This works!");
}