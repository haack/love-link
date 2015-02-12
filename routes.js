var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('lovelinkdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'lovelink' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'links' collection doesn't exist, sorry bro...");
            }
        });
    }
});

//todo 
//add informed errors
//change to post
//check for duplicates
exports.register = function(req, res, next) {
    var number = req.params.number;
	console.log("Registering user: " + number);

    db.collection('users', function(err, collection) {
    	var now = Date.now();
    	user = {"number": number, "joined": now, "last_logged": now};
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send({"Success:": "User registered..."});
            }
        });
    });
};

//todo 
//add informed errors
//change to post
//check for duplicates
exports.invite = function(req, res, next) {
    var number1 = req.params.number1;
    var number2 = req.params.number2;
	console.log("User: " + number1 + " invited by user: " + number2);

    db.collection('invites', function(err, collection) {
    	invite = {"invited": number1, "inviter": number2, "time": Date.now()};
        collection.insert(invite, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send({"Success:": "Invite registered..."});
            }
        });
    });
};

exports.getInvite = function(req, res, next) {
    var number = req.params.number;
	console.log("Checking for invite...");

    db.collection('invites', function(err, collection) {
        collection.findOne({'invited': number}, function(err, item) {
            if (item) {
            	console.log(item);
            	res.send(item);
            } else {
            	console.log("no item");
            	res.send({"error": "no result"});
            }
        });
    });
};