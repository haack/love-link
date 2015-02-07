
exports.register = function(req, res, next) {
    console.log("User register.");
    var id = req.params.number;
    res.send("Number registered: " + id);
};