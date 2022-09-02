var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var port = 3001;
var hostname = "127.0.0.1";

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,token');
    next();
}

app.use(cors);


const Routes = require('./routes/routes');
app.use(Routes);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});