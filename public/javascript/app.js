(function(){
	"use strict";
	var app = {

		urlServer: "http://192.168.1.107:8080",
		selectors: { 
			form: $('.form'),
			form_button: $("#form_button"),
			search_select: $("#search_select"),
			main: $("#main"),
		},

		init: function(){
			this.listeners();
			this.dropdownFill();
			this.formSettings();
		},

		getHomePage: function(){
			var me = this;
			var jqXHR = $.ajax('/public/html/home.html')
			.done(function(data){
				me.selectors.main.html(data);
				me.dropdownFill();
				me.formSettings();
			});
		},

		getEditPage: function(id){
			var me = this;
			var jqXHR = $.ajax('/public/html/edit.html')
			.done(function(data){
				me.selectors.main.html(data);
				me.formFillValue(id);
			});
		},

		listeners: function(){
			var me = this;

			me.selectors.form_button.on('click', (event)=>{
				event.preventDefault();
				me.addNewClient.call(me);
			});

			me.selectors.main.on('click','#edit_button',(event)=>{
				var id = this.selectors.search_select.dropdown("get value")[0];
				console.log(id);
				me.getEditPage(id);
			});

			me.selectors.main.on('click','#to_home',(event)=>{
				me.getHomePage();
			});

			me.selectors.main.on('click','#form_edit',(event)=>{
				me.editClient
			});

		},

		dropdownFill: function(){
			var me = this;
			var jqXHR = $.ajax('/clients/list/dropdown')
			.done(function(data){
				$("#search_select").html(data);
				me.dropdownSettings();
			});
		},

		/*displayList: function(id){
			var me = this;
			var jqXHR = $.ajax('/clients/list/display')
			.done(function(data){
				console.log("display list\n",data)
			});
		},*/

		addNewClient: function(){
			var me = this;
			var valueForm = this.selectors.form.form('get values');
			var jqXHR = $.post(me.urlServer + "/clients/add", valueForm)
			.done(function(data){
				me.dropdownFill();
			});
		},

		formSettings: function(){
			this.selectors.form
			.form({
				fields: {
					first_name: 'empty',
					last_name: 	'empty',
					company: 	'empty',
					role: 		'empty',
					description:'empty',
					phone: 		'empty',
					email: 		'empty',
				}
			});
		},

		dropdownSettings: function(){
			var me = this;
			console.log("in drop setting ");
			$("#search_select")
			.dropdown({
				onChange: function (value, text, choice) {
					me.showSelectedClient(value)
				}
			})
		},

		showSelectedClient: function(id){
			console.log("in show selected , id:", id);
			var jqXHR = $.post('/clients/list/display',{id: id})
			.done(function(data){
				$("#client").html(data);
			});
		},

		formFillValue: function(idSelected){
			var me = this;
			idSelected = parseInt(idSelected, 10);
			var editedCustomer = {};
			var customers = [];
			var jqXHR = $.ajax('/clients/list')
			.done(function(data){
				customers = data;
				console.log("\nid:\n",idSelected, "\ncustomers:\n", customers);
				for (var i = customers.length - 1; i >= 0; i--) {
					if(customers[i].id === idSelected){
						break;
					}
					if (i === 0){me.error("Client not found"); return;}
				}
				editedCustomer = customers[i];
				console.log(i, editedCustomer);
				for(var key in editedCustomer){
					$('#'+ key).val(editedCustomer[key]);
				}
			});
		},

		error: function(message, ...args){
			console.log(message);
			if(args){	
				$.each(args , function (index, value){
					console.log(index + ':' + value); 
				});
			}
		}
	}

	app.init();
})();