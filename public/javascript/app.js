(function(){
	"use strict";
	var app = {

		urlServer: "http://192.168.1.107:8080",
		selectors: { 
			add_form: $("#add_form"), form_title: $("#form_title"),
			title: $("#title"), clients: $("#clients"), form: $('.form'),
			first_name: $("#first_name"), last_name: $("#last_name"),company: $("#company"),
			role: $("#role"), phone: $("#phone"), email: $("#email"), description: $("#description"),
			go_to_add: $("#go_to_add"), form_button: $("#form_button"), add: $("#add")
		},

		init: function(){
			this.formSettings();
			this.displayList();
			this.listeners();
		},

		listeners: function(){
			var me = this;

			me.selectors.form_button.on('click', (event)=>{
				event.preventDefault();
				me.addNewContact.call(me);
			});

			me.selectors.clients.on('click', ".client",(event)=>{
				me.showEditForm();
				me.formFillValue.call(me, event);
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

		displayList: function(){
			var me = this;
			var jqXHR = $.ajax('/clients/list/display')
			.done(function(data){
				me.selectors.clients.html(data);
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

		showEditForm: function(){
			console.log("this",this);
			this.selectors.form.addClass("edit");
			this.selectors.title.html("Editing a client:");
			this.selectors.go_to_add.html('<button id="add" class="ui secondary button">Stop edit and show list</button>');
			this.selectors.clients.hide();
		},

		showAddForm: function(){
			this.selectors.form.removeClass("edit");
			this.selectors.title.html("Add new client:");
			this.selectors.go_to_add.html('');
			this.selectors.first_name.val("");
			this.selectors.last_name.val("");
			this.selectors.company.val("");
			this.selectors.phone.val("");
			this.selectors.description.val("");
			this.selectors.email.val("");
			this.selectors.role.val("");
			this.selectors.clients.show();
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