var express = require('express'),
    lovelink = require('./routes.js');
 
var app = express();

app.get('/register/:number', lovelink.register);
app.get('/getinvite/:number', lovelink.getInvite);
app.get('/invite/:number1/:number2', lovelink.invite); //todo change to post
app.get('/accept/:number1/:number2', lovelink.acceptInvite);

app.get('/love/:number1/:number2', lovelink.love); //todo move number1 to data field
app.get('/checklove/:number', lovelink.checkLove);

//app.get('/getNickname', lovelink.checkLove);
 
app.listen(1337);
console.log('Listening on port 1337...');