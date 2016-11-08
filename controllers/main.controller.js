var fs = require('fs');
var pathListClients = __dirname + "/../data/crm.json";

function getParsedJSON(req ,callback, sendResponse){
	fs.readFile(pathListClients, 'utf8', function(err, data){
		if(err){console.log(err, "\nfail readJson\n");}
		var customers = JSON.parse(data);
		console.log("\navant ajout\n",customers);
		callback(req, customers, sendResponse);
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

function getDisplayClients(req, customers, sendResponse){
	var toSend = "";
	for (var i = 0; i < customers.length; i++) {
		var client = '<div class="client'+i+' ui grid"><div class="first_name height wide column">' +
		customers[i].first_name +'</div><div class="last_name height wide column">'+ customers[i].last_name +
		'</div><div class="company height wide column">'+ customers[i].company+ '</div><div class="role '+
		'height wide column">'+ customers[i].role +'</div><div class="email height wide column">'+
		customers[i].email +'"</div><div class="phone height wide column">'+ customers[i].phone +'</div>' +
		'<div class="description sixteen wide column">'+ customers[i].description +' </div></div>';
		toSend += client;
	}	
	sendResponse(toSend);

}

module.exports = {
	getDisplayClients: getDisplayClients,
	addClient: addClient,
	getParsedJSON: getParsedJSON,
}