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
		},

		displayList: function(){
			var me = this;
			var jqXHR = $.ajax('/clients/list')
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

		successAjax: function(jqXHR){
			/*console.log("great succes!\n", jqXHR);*/
		},
	}

	app.init();
})();