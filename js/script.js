
var app;
var ui;
var msgs;
$(document).ready(function(){
	app=new APP();
	ui=new UI();
	msgs=new Messages();
	app.init();
	ui.init();
	

	 
});


function UI(){}

UI.prototype.init=function()
{

	$(".apikey_btn").click(function(){
		app.apikey=$(".api_key_txt").val(); 
		app.ajaxheaders={ 'X-Redmine-API-Key':app.apikey };
		app.getCurrentUserProfile(app);
		app.getRedmineTrackers(app);
		
	}); 

	$(".project_select").change(function(){
		projectId=$(this).val(); 
		console.log(projectId);
		app.getTrackerWiseTeamTasks(app,projectId);
		
	});

	$(".display_container").append($( "#sampleTemplate" ).tmpl( {"name":"kaushik"} ));

};


