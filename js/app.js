function APP(){};
APP.prototype.domain='https://projects.groupfmg.com';
APP.prototype.apikey=undefined;
APP.prototype.ajaxheaders=undefined;
APP.prototype.projects=undefined;
APP.prototype.issues=undefined;
APP.prototype.trackers=undefined;
APP.prototype.profile=undefined;
APP.prototype.limit=100;
APP.prototype.init=function()
{
	self=this;
	console.log("started");

	/* test*/ 
	/*self.ajaxheaders={ 'X-Redmine-API-Key':self.apikey};
	self.getTrackerWiseTeamTasks(self);*/
	/* test*/ 



};

APP.prototype.getProjectsForProfile=function(self)
{
	
		self.getAllProjects(self,0);
	
};


APP.prototype.getCurrentUserProfile=function(self)
{
	
	URL=self.domain+'/users/current.json';
	
	$.when($.ajax({url:URL,dataType:"json",headers: self.ajaxheaders,success:function(json){
				if(json!=undefined)
				{
					console.log(json);
					self.profile=json;
				}
			
			
		}}))
		.then(function(){
			console.log("success");
			
			self.showProfileChangesOnUI(self);
			self.getProjectsForProfile(self,0);
			
		},function(){
			console.log("failure");
			
			
		});
};

APP.prototype.showProfileChangesOnUI=function(self)
{

	if(!$(".nav_username").is(":visible"))
	{
		$(".nav_username").html("<a href=\"javascript:void(0);\">"+msgs.hi+self.profile.user.firstname+"</a>");
		$(".nav_username").show();
		$(".api_key_form").hide();
	}
};

APP.prototype.updateProjectListOnUI=function(self)
{

	if($(".nav_username").is(":visible"))
	{
		$.each(self.projects.projects,function()
		{
			option=document.createElement("option");
			$(option).attr("value",this.id).text(this.name);
			$(".project_select").append(option);
		});
		$(".project_select option:first-child").attr("selected","selected");
		$(".project_dropdown").show();
	}
};

APP.prototype.showSideNavigation=function(self)
{

	if($(".nav_username").is(":visible"))
	{
		
		$(".apppage").show();
	}
};

APP.prototype.getRedmineTrackers=function(self)
{
	URL=self.domain+'/trackers.json';
	
	$.when($.ajax({url:URL,dataType:"json",headers: self.ajaxheaders,success:function(json){
				if(json!=undefined)
				{
					console.log(json);
					self.trackers=json;
				}
			
			
		}}))
		.then(function(){
			console.log("success");
			
			
			
		},function(){
			console.log("failure");
			
			
		});
	
};

APP.prototype.getTrackerWiseTeamTasks=function(self,projectId)
{
	

	self.getAllIssuesForProject(self,projectId,0);
	
};


APP.prototype.getAllProjects=function(self,offset)
{
	URL=self.domain+"/projects.json?offset="+offset+"&limit="+self.limit;
	if(self.projects==undefined)
		self.projects={};
	if(self.ajaxheaders!=undefined)
	{ 
		
		$.when($.ajax({url:URL,dataType:"json",headers: self.ajaxheaders,success:function(json){
			if (!self.projects.projects) {self.projects=json;}
			else{$.each(json.projects,function(){self.projects.projects.push(this);});}
			
		}}))
		.then(function(){
			console.log("success");
			
			if(self.projects.total_count>offset)
			{
				self.getAllProjects(self,offset+self.limit);
			}
			else
			{
				self.updateProjectListOnUI(self);
				self.showSideNavigation(self);
			}
			
		},function(){
			console.log("failure");
			
			
		});
		
	}


	
};

APP.prototype.getAllIssuesForProject=function(self,projectid,offset)
{
	console.log(offset);
	URL=self.domain+"/issues.json?project_id="+projectid+"&offset="+offset+"&limit="+self.limit;
	if(self.issues==undefined)
		self.issues={};
	if(self.ajaxheaders!=undefined)
	{ 
		
		$.when($.ajax({url:URL,dataType:"json",headers: self.ajaxheaders,success:function(json){
			if (!self.issues.issues) {self.issues=json;}
			else{$.each(json.issues,function(){self.issues.issues.push(this);});}
			
		}}))
		.then(function(){
			console.log("success");
			
			if(self.issues.total_count>offset)
			{
				self.getAllIssuesForProject(self,projectid,offset+self.limit);
			}
			else
			{
				console.log(self.issues);
				self.sortIssuesForProject(self);
			}
			
		},function(){
			console.log("failure");
			
			
		});
		
	}


	
};


APP.prototype.sortIssuesForProject=function(self)
{

	if(self.issues.total_count>0)
	{
		self.projectusers={};
		$.each(self.issues.issues,function(){
			
			if(this.assigned_to!=undefined)
			{
				if(self.projectusers[this.assigned_to.id+''])
				{
					self.projectusers[this.assigned_to.id+''].issuecount=self.projectusers[this.assigned_to.id+''].issuecount+1;
					
				}
				else
				{
					self.projectusers[this.assigned_to.id+'']={};

					self.projectusers[this.assigned_to.id+''].issuecount=1;

					self.projectusers[this.assigned_to.id+''].name=this.assigned_to.name;
				}

				if(self.projectusers[this.assigned_to.id+''].priority && self.projectusers[this.assigned_to.id+''].priority[this.priority.id+''])
				{

					self.projectusers[this.assigned_to.id+''].priority[this.priority.id+''].count=self.projectusers[this.assigned_to.id+''].priority[this.priority.id+''].count+1;
				}
				else
				{
					self.projectusers[this.assigned_to.id+''].priority={};
					self.projectusers[this.assigned_to.id+''].priority[this.priority.id+'']={};
					self.projectusers[this.assigned_to.id+''].priority[this.priority.id+''].id=this.priority.id;
					self.projectusers[this.assigned_to.id+''].priority[this.priority.id+''].name=this.priority.name;
					self.projectusers[this.assigned_to.id+''].priority[this.priority.id+''].count=1;
			

				}
			}
			

		});

		self.showIssuesForProject(self);

	}
};


APP.prototype.showIssuesForProject=function(self)
{
	console.log(self.projectusers);
	$(".display_container").empty();
	graphdiv=document.createElement("div");
	
	$(".display_container").append(graphdiv);
	
	var data=[];
	$.each(self.projectusers,function(k,v){
			d=[];
			d[0]=v.name;
			d[1]=v.issuecount;
			data.push(d);

	});
	var graph=$(graphdiv).kggraph({'title':'Issue Distribution','type':'pie chart','width':500,'height':300,'data':data,'useRGBAColorScheme':false,'columnTitles':['Name','Issue Count']});
	

};