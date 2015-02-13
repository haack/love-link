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
                exports.textInvite(number1, number2);
            }
        });
    });
};

exports.textInvite = function(num, name) {
    // Twilio Credentials 
    var accountSid = 'AC29cc81d4386b1a4dc76056da149c4af3'; 
    var authToken = '8535973c2932cfbe630e87fc0947474f'; 
     
    //require the Twilio module and create a REST client 
    var client = require('twilio')(accountSid, authToken); 
     
    client.messages.create({ 
        to: "+"+num, 
        from: "+441618505643", 
        body: "Hey, "+ name + " has invited you to join her on http://asdf.com",   
    }, function(err, message) { 
        // console.log(message.sid); 
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
            	res.send({"result": "no invite for user"});
            }
        });
    });
};

exports.acceptInvite = function(req, res, next) {
    var number1 = req.params.number1;
    var number2 = req.params.number2;
    console.log("User: " + number1 + " accepting invite from user: " + number2);

    db.collection('invites', function(err, collection) {
        collection.findOne({'invited': number1}, function(err, item) {
            if (item) {
                collection.remove(item);
                db.collection('partners', function(err, inviteCollection) {
                    inviteCollection.insert(item, {safe:true}, function(err, result) {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('Success: ' + JSON.stringify(result[0]));
                            res.send({"Success:": "Partners registered..."});
                        }
                    });
                });
            } else {
                console.log("no invites");
                res.send({"error": "no invite"});
            }
        });
    });
};

//todo: use data input instead of URL
exports.love = function(req, res, next) {
    var number1 = req.params.number1;
    var number2 = req.params.number2;
    console.log("User: " + number1 + " accepting invite from user: " + number2);

    db.collection('loves', function(err, collection) {
        love = {"lover": number1, "lovee": number2, "message": "Tyler Ward",  "time": Date.now()};
        collection.insert(love, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send({"Success:": "Love registered..."});
            }
        });
    });
};

exports.checkLove = function(req, res, next) {
    var number = req.params.number;
    console.log("Checking for invite...");

    db.collection('loves', function(err, collection) {
        collection.find({'lovee': number}).toArray(function(err, items) {
            if (items) {
                console.log(items);
                res.send(items);
            } else {
                console.log("no loves");
                res.send({"result": "no love for user"});
            }
        });
    });
};

