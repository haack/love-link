var express = require('express'),
    lovelink = require('./routes.js');
 
var app = express();

app.get('/register/:number', lovelink.register);
app.get('/getinvite/:number', lovelink.getInvite);
app.get('/invite/:number1/:number2', lovelink.invite);
 
app.listen(1337);
console.log('Listening on port 1337...');