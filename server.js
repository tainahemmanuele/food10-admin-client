var express = require('express');

var app = express();

app.use(express.static(__dirname + '/')); 

var port = process.env.PORT || 4200
app.listen(port);

console.log('server is running on port ' + port + '.');