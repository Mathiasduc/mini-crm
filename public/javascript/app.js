(function(){
	"use strict";
	var app = {

		urlServer: "http://192.168.1.107:8080",
		formSelector: $('.form'),
		clientsSelector: $("#clients"),

		init: function(){
			this.formSettings();
			this.displayList();
			this.listeners();
		},

		listeners: function(){
			var me = this;

			$('#form_button').on('click', (event)=>{
				event.preventDefault();
				me.addNewContact.call(me);
			});

			$('#clients').on('click', ".client",(event)=>{
				me.formFillValue(event);
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
				me.clientsSelector.html(data);
			});
		},

		addNewContact: function(){
			var me = this;
			var valueForm = this.formSelector.form('get values');
			var jqXHR = $.post(me.urlServer + "/clients/add", valueForm)
			.done(function(data){
				me.clientsSelector.html(data);
			});
		},

		formSettings: function(){
			this.formSelector
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
			var id = event.currentTarget.firstChild.value;
			var customers = "";
			var jqXHR = $.ajax('/clients/list')
			.done(function(data){
				customers = data;
				console.log("event:\n", event, "\nid:\n", event.currentTarget.firstChild.value, "\ncustomers:\n", customers);
			});
			this.formSelector.addClass("edit");
		},

		successAjax: function(jqXHR){
			/*console.log("great succes!\n", jqXHR);*/
		},
	}

	app.init();
})();