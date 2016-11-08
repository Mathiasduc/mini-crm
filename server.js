//dependencies
var express = require("express");
var bodyParser = require('body-parser');
var controller = require('./controllers/main.controller.js');
var app = express();
var jsonParser = bodyParser.json();

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));
app.use(jsonParser,function(req,rep,next){
	console.log("body req:\n",req.body);
	next();
});

//routes
app.get('/',(req,res)=>{res.sendFile(__dirname + '/public/html/index.html')});
app.get('/clients/list/display', function(req, res){
	controller.getParsedJSON(req, controller.getDisplayClients, function(toSend){res.json(toSend);});
});
app.get('/clients/list', function(req, res){
	controller.getParsedJSON(req, false, function(toSend){res.json(toSend);});
});

app.post('/clients/add', jsonParser, function(req, res){
	controller.getParsedJSON(req, controller.addClient, function(toSend){res.json(toSend);});
});

//error handling middlewares
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('\nSomething broke!');
});

//server init
app.listen(8080);