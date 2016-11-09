(function(){
	"use strict";
	var app = {

		urlServer: "http://192.168.1.107:8080",
		selectors: { 
			add_form: $("#add_form"), form_title: $("#form_title"),
			title: $("#title"), clients: $("#clients"), form: $('.form'),
			first_name: $("#first_name"), last_name: $("#last_name"),company: $("#company"),
			role: $("#role"), phone: $("#phone"), email: $("#email"), description: $("#description"),
			go_to_add: $("#go_to_add"), form_button: $("#form_button"), add: $("#add"),
			search_select: $("#search_select"), eddit_button: $("#edit_button"),
			main: $("#main"),
		},

		init: function(){
			this.getHomePage();
			this.listeners();
		},

		getHomePage: function(){
			var me = this;
			var jqXHR = $.ajax('/public/html/home.html')
			.done(function(data){
				me.selectors.main.html(data);
				me.formSettings();
				me.dropdownFill();
			});
		},

		getEditPage: function(){
			var jqXHR = $.ajax('/public/html/edit.html')
			.done(function(data){
				console.log('\ncontenu edit:\n',data);
				me.selectors.main.html(data);
				/*me.formSettings();*/
			});
		},

		listeners: function(){
			var me = this;

			me.selectors.form_button.on('click', (event)=>{
				event.preventDefault();
				me.addNewContact.call(me);
			});

			me.selectors.eddit_button.on('click',(event)=>{
				me.showEditForm(me.formFillValue);
			});

			$(".main").on('click',"#add",(event)=>{
				console.log("add");
				event.preventDefault();
				me.showAddForm.call(me);
			});


			/*document.getElementById("clients").addEventListener("click", function(event) {
				console.log(event.target.parentNode.classList[0]);
				if(event.target.parentNode.classList[0] === "client"){
					me.formFillValue(event.target.parentNode);
				}
			}*/
		},

		dropdownFill: function(){
			var me = this;
			var jqXHR = $.ajax('/clients/list/dropdown')
			.done(function(data){
				console.log('\ncontenu drop:\n',data);
				me.selectors.search_select.html(data);
				me.dropdownSettings();
			});
		},

		displayList: function(){
			var me = this;
			var jqXHR = $.ajax('/clients/list/display')
			.done(function(data){
				console.log("display list\n",data)
				/*me.selectors.clients.html(data);*/
			});
		},

		addNewContact: function(){
			var me = this;
			var valueForm = this.selectors.form.form('get values');
			var jqXHR = $.post(me.urlServer + "/clients/add", valueForm)
			.done(function(data){
				me.selectors.clients.html(data);
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
			console.log("drop setting ");
			this.selectors.search_select
			.dropdown({
				onChange: function (value, text, choice) {
					console.log(value);
					console.log(text);
					console.log(choice);
					console.log(this);
					me.showSelectedClient(value)
				}
			})
		},

		showSelectedClient: function(id){

		},

		formFillValue: function(event){
			var me = this;
			var idSelected = event.currentTarget.firstChild.value;
			var editedCustomer = {};
			var customers = [];
			var jqXHR = $.ajax('/clients/list')
			.done(function(data){
				customers = data;
				console.log("event:\n", event, "\nid:\n", event.currentTarget.firstChild.value, "\ncustomers:\n", customers);
				for (var i = customers.length - 1; i >= 0; i--) {
					if(customers[i].id === parseInt(idSelected, 10)){
						break;
					}
					if (i === 0){me.error("Client not found"); return;}
				}
				editedCustomer = customers[i];
				console.log(i, customers, editedCustomer);
				me.selectors.first_name.val(editedCustomer.first_name);
				me.selectors.last_name.val(editedCustomer.last_name);
				me.selectors.company.val(editedCustomer.company);
				me.selectors.phone.val(editedCustomer.phone);
				me.selectors.description.val(editedCustomer.description);
				me.selectors.email.val(editedCustomer.email);
				me.selectors.role.val(editedCustomer.role);
			});
		},

		successAjax: function(jqXHR){
			/*console.log("great succes!\n", jqXHR);*/
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