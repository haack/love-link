var express = require('express'),
    lovelink = require('./routes.js');
 
var app = express();

app.get('/register/:number', lovelink.register);
 
app.listen(1337);
console.log('Listening on port 1337...');