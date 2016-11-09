var fs = require('fs');
var pathListClients = __dirname + "/../data/crm.json";

function getParsedJSON(req ,callback, sendResponse){
	fs.readFile(pathListClients, 'utf8', function(err, data){
		if(err){console.log(err, "\nfail readJson\n");}
		var customers = JSON.parse(data);
		console.log("\nserving this callback:\n",callback);
		if (callback){
			callback(req, customers, sendResponse);
		}else{
			sendResponse(customers);
		}
	});
}

function addClient(req, customers, sendResponse){
	req.body.id = customers.length + 1;
	customers.push(req.body);
	console.log("\napres ajout\n",customers);
	getDisplayClients(req, customers, sendResponse);
	var customers = JSON.stringify(customers);
	fs.writeFile(pathListClients, customers,'utf8', function(err, data){
		if(err){
			console.log(err, jsonStringfied, "\nerror in write file JSON\n");
		}
	});
}

function getDropdownClients(req, customers, sendResponse){
	var toSend = "";
	for (var i = 0; i < customers.length; i++) {
		var clientDropdown = '<option value="'+ customers[i].id +'">'+ 
		customers[i].first_name + customers[i].last_name + '</option>';
		toSend += clientDropdown;
	}
	console.log("\n avant envoi drop\n",toSend);
	sendResponse(toSend);
}

function getDisplayClients(req, customers, sendResponse){
	var toSend = "";
	if (req.body.id){
		var i = req.body.id;
		toSend += returnClientCard(i, customers);
	}else{
		for (var i = 0; i < customers.length; i++) {
			toSend += returnClientCard(i, customers);
		}		
	}
	sendResponse(toSend);
}

function returnClientCard(i, customers){
	var card = '<div class="client ui grid"><input id="clientID" value="'+ customers[i].id +'" hidden type="text"><div class="first_name height wide column">' +
			customers[i].first_name +'</div><div class="last_name height wide column">'+ customers[i].last_name +
			'</div><div class="company height wide column">'+ customers[i].company+ '</div><div class="role '+
			'height wide column">'+ customers[i].role +'</div><div class="email height wide column">'+
			customers[i].email +'"</div><div class="phone height wide column">'+ customers[i].phone +'</div>' +
			'<div class="description sixteen wide column">'+ customers[i].description +' </div></div>';
			return(card);
}

module.exports = {
	getDisplayClients: getDisplayClients,
	addClient: addClient,
	getParsedJSON: getParsedJSON,
	getDropdownClients: getDropdownClients,
}