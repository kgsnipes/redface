



redfaceapp.controller('WelcomeController', ['$scope', '$http','$location','$rootScope','cacheService',
  function ($scope, $http,$location,$rootScope,cacheService) {
   

   $scope.performLogin=function()
   {
    if($scope.user.userName!=undefined && $scope.user.apiKey!=undefined && $scope.user.userName!=undefined && $scope.user.userName!="" && $scope.user.apiKey!="" && $scope.user.userName!="")
    {

      userdata=angular.copy($scope.user);
      cacheService.setData("user",userdata);
      cacheService.setData("ajaxheader",{ 'X-Redmine-API-Key':userdata.apiKey});
      
       $location.path( "/home" );
       
      
    }
    else
    {

      if($scope.user.apiKey==undefined || $scope.user.apiKey=='')
      {

        angular.element(document.getElementById("login_apikey")).addClass("login_input_error");
      }
      else
      {
        angular.element(document.getElementById("login_apikey")).removeClass("login_input_error");
      }

       if($scope.user.userName==undefined || $scope.user.userName=='')
      {

        angular.element(document.getElementById("login_username")).addClass("login_input_error");
      }
      else
      {
        angular.element(document.getElementById("login_username")).addClass("login_input_error");
      }
      
    }
   		
   };

   $scope.init=function()
   {
      $scope.user={};
      $scope.user.domain='https://projects.groupfmg.com';
      userdata=cacheService.getData("user");
      userdata={};
      userdata.userName='kaushik';
      userdata.apiKey='997c164b300bac708e1fed7f3f4367a2477ff0d9';
      if(userdata)
      {
         $scope.user.userName=userdata.userName;
         $scope.user.apiKey=userdata.apiKey;
      }
          
       
      document.getElementById("login_username").focus();
   };

    
  }]); 

redfaceapp.controller('HomeController', ['$scope', '$http','$rootScope','cacheService','redmineService','$location','$window','csvService','redfaceLogicService',
  function ($scope, $http,$rootScope,cacheService,redmineService,$location,$window,csvService,redfaceLogicService) {
    
    $scope.printreport=function()
    {
        $window.print();
        // $scope.writesamplefile();
    };

    $scope.getCSVData=function()
    {
        $scope.csvContent="";
         $scope.csvContent+='Project Info;\r\n';
         $scope.csvContent+='\r\n';
        $scope.getProjectInfoCSV();
         $scope.csvContent+='\r\n';
         $scope.csvContent+='Overall Tracker Split;\r\n';
        $scope.getProjectBubblesInfoCSV();
         $scope.csvContent+='\r\n';
         $scope.csvContent+='Overall Status Split;\r\n';
        $scope.getProjectStatusBubblesInfoCSV();
         $scope.csvContent+='\r\n';
         $scope.csvContent+='Overall Bug Severity Split;\r\n';
        $scope.getProjectBugsBubblesInfoCSV();
         $scope.csvContent+='\r\n';
         $scope.csvContent+='Overall Team Member Split;\r\n';
        $scope.getProjectTeamMemberInfoCSV();
        return  $scope.csvContent;
    };

    $scope.getProjectInfoCSV=function(csvContent){

       $scope.csvContent+='Project Name;'+$scope.currentproject.name+'\r\n';
       $scope.csvContent+='Project ID;'+$scope.currentproject.id+'\r\n';
       $scope.csvContent+='Created On;'+$scope.currentproject.createdOn+'\r\n';
       $scope.csvContent+='Unassigned Issues;'+$scope.currentproject.issuedata.unassignedcount+'\r\n';
      
    };

    $scope.getProjectBubblesInfoCSV=function(csvContent){
         console.log($scope.currentproject.trackerdata);
        trackernames='';
        trackercounts='';
        for(track in $scope.currentproject.trackerdata)
        {
          console.log(track);
          trackernames+=$scope.currentproject.trackerdata[track].name+';';
          trackercounts+=$scope.currentproject.trackerdata[track].count+';';
        }
         $scope.csvContent+=trackernames+'\r\n';
         $scope.csvContent+=trackercounts+'\r\n';
      
    };

    $scope.getProjectStatusBubblesInfoCSV=function(csvContent){

        trackernames='';
        trackercounts='';
        for(track in $scope.currentproject.statusdata)
        {
          trackernames+=$scope.currentproject.statusdata[track].name+';';
          trackercounts+=$scope.currentproject.statusdata[track].count+';';
        }
         $scope.csvContent+=trackernames+'\r\n';
         $scope.csvContent+=trackercounts+'\r\n';
      
    };

    $scope.getProjectBugsBubblesInfoCSV=function(csvContent){

        trackernames='';
        trackercounts='';
        for(track in $scope.currentproject.bugsdata)
        {
          trackernames+=$scope.currentproject.bugsdata[track].name+';';
          trackercounts+=$scope.currentproject.bugsdata[track].count+';';
        }
         $scope.csvContent+=trackernames+'\r\n';
         $scope.csvContent+=trackercounts+'\r\n';
      
    };

    $scope.getProjectTeamMemberInfoCSV=function(csvContent){

      
        for(user in $scope.currentproject.userdata)
        {
           $scope.csvContent+='\r\n\r\n';
           $scope.csvContent+=$scope.currentproject.userdata[user].name+';\r\n';

            for(tracker in $scope.currentproject.userdata[user].trackerdata)
            {
              $scope.csvContent+='\r\n';
              $scope.csvContent+=$scope.currentproject.userdata[user].trackerdata[tracker].name+';'+$scope.currentproject.userdata[user].trackerdata[tracker].count+';\r\n';
                for(status in $scope.currentproject.userdata[user].trackerdata[tracker].statusdata)
                {
                    $scope.csvContent+='\r\n';
                    $scope.csvContent+=$scope.currentproject.userdata[user].trackerdata[tracker].statusdata[status].name+';'+$scope.currentproject.userdata[user].trackerdata[tracker].statusdata[status].count+';\r\n';
                }
            }

            for(custom in $scope.currentproject.userdata[user].customdata)
            {
              $scope.csvContent+='\r\n';
              $scope.csvContent+=$scope.currentproject.userdata[user].customdata[custom].name+';'+$scope.currentproject.userdata[user].customdata[custom].count+';\r\n';
               
            }
        }
         
      $scope.csvContent+='\r\n\r\n';
    };

    $scope.downloadReport=function()
    {

        csvService.writeDataToFile($scope.currentproject.name,$scope.getCSVData(),"csv",function(flag){
            if(flag)
            {
              console.log("success");
            }
            else
            {
              console.log("fail");
            }
        });
    };

   

     $scope.logout=function()
    {
      cacheService.clearData();
       $location.path( "/" );
    };

    $scope.closeError=function()
    {
        $scope.showloadingerror=false;
    };

     $scope.promiseForInit=function(off,lim)
   {
     //$scope.userdata=cacheService.getData("user");
     //get current user data
     $scope.showloading=true;
    $scope.showloadingerror=false;
     var promise=redmineService.getCurrentUserProfile($scope.userdata.domain,cacheService.getData("ajaxheader"));
     promise.then(
            function(payload) { 
             
                cacheService.setData("currentUserProfile",payload.data.user);
                $scope.promiseForProject(0,100);
                $scope.promiseForStatuses();
            },
            function(errorPayload) {
                console.error('failure loading movie', errorPayload);
                $scope.showloading=false;
                $scope.showloadingerror=true;
            });
     
  };

   $scope.promiseForStatuses=function(off,lim)
   {
     
     $scope.showloading=true;
    $scope.showloadingerror=false;
     var promise=redmineService.getProjectStatuses($scope.userdata.domain,cacheService.getData("ajaxheader"));
     promise.then(
            function(payload) { 
             
                cacheService.setData("redmine_statuses",payload.data.issue_statuses);
               
            },
            function(errorPayload) {
                console.error('failure loading movie', errorPayload);
                $scope.showloading=false;
                $scope.showloadingerror=true;
            });
     
  };
   

   $scope.promiseForProject=function(off,lim)
   {
    $scope.showloadingerror=false;
      var promiseProjectList=redmineService.getProjectsListForProfile($scope.userdata.domain,cacheService.getData("ajaxheader"),off,lim);
      promiseProjectList.then(
          function(payload) { 
            
            if($scope.projects==undefined)
            {
              projects=angular.copy(payload.data);              
              
              for(project in payload.data.projects)
                 if(typeof project=="object")
                    projects.projects.push(project);

                 $scope.projects=projects;   
            }
            else
            {
              for(project in payload.data.projects)
                  if(typeof project=="object")
                    $scope.projects.projects.push(project);
            }

            if($scope.projects.total_count>off)
            {
              $scope.promiseForProject(off+lim,lim);
            }
            
            cacheService.setData("userProjectList",angular.copy($scope.projects));
           $scope.showloading=false;
              
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
              $scope.showloading=false;
                $scope.showloadingerror=true;
          });

   };

  


   $scope.promiseForIssues=function(projectid,off,lim)
   {
    $scope.showloadingerror=false;
      var promiseProjectIssueList=redmineService.getProjectIssuesWithoutTrackers($scope.userdata.domain,cacheService.getData("ajaxheader"),projectid,off,lim);
      promiseProjectIssueList.then(
          function(payload) { 
            
            redfaceLogicService.manipulateTaskTrackers($scope.currentproject,payload);

            if(payload.data.total_count>off)
            {
              $scope.promiseForIssues(projectid,off+lim,lim);
            }
            else
            {
              $scope.showloading=false;
              statuses=cacheService.getData("redmine_statuses");
              if(statuses.length>0)
              {
                for(i=0;i<statuses.length;i++)
                    $scope.promiseForIssuesWithStatus($scope.currentproject.id,statuses[i].id,0,100);
              }
            }
            
            cacheService.setData("currentProject",angular.copy($scope.currentproject));
            
           
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
              $scope.showloading=false;
                $scope.showloadingerror=true;
          });

   };

   $scope.promiseForIssuesWithStatus=function(projectid,statusid,off,lim)
   {
      $scope.showloadingerror=false;
      $scope.showloading=true;
      var promiseProjectIssueListWithStatus=redmineService.getProjectIssuesWithStatus($scope.userdata.domain,cacheService.getData("ajaxheader"),projectid,statusid,off,lim);

      promiseProjectIssueListWithStatus.then(
          function(payload) { 
            
            redfaceLogicService.manipulateTaskTrackersWithStatus($scope.currentproject,payload);

            if(payload.data.total_count>off)
            {
              $scope.promiseForIssuesWithStatus(projectid,statusid,off+lim,lim);
            }
            else
            {
              $scope.showloading=false;
            }
            
            cacheService.setData("currentProject",angular.copy($scope.currentproject));
            
           
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
              $scope.showloading=false;
                $scope.showloadingerror=true;
          });

   };


   $scope.updateProjectInfo=function()
   {
    selprj=this.selectedProject;
    $scope.showloading=true;
    $scope.showloadingerror=false;
      console.log(this.selectedProject);
     // $scope.userdata=cacheService.getData("user");
      
      if(selprj==undefined)
      {
          if($scope.currentproject!=undefined && $scope.currentproject.id!=undefined)
          {
            selprj=$scope.currentproject.id;
          }
      }
      $scope.currentproject={};
      var promiseProjectInfo=redmineService.getProjectDetails($scope.userdata.domain,cacheService.getData("ajaxheader"),selprj);
      promiseProjectInfo.then(
          function(payload) { 
             
            $scope.currentproject.name=payload.data.project.name;
            $scope.currentproject.id=payload.data.project.id;
            $scope.currentproject.identifier=payload.data.project.identifier;
            $scope.currentproject.description=payload.data.project.description;
            $scope.currentproject.createdOn=moment(payload.data.project.created_on).format("D - MMM - YYYY, h:mm:ss a");
            $scope.currentproject.showcurrentprojectinfo=true;
            $scope.currentproject.trackers=payload.data.project.trackers;
            cacheService.setData("currentProject",angular.copy($scope.currentproject));

            $scope.promiseForIssues($scope.currentproject.id,0,100);

           
           
          },
          function(errorPayload) {
             $scope.currentproject.errormsg="Project info not found.";
             $scope.currentproject.showcurrentprojectinfo=false;
             $scope.showloading=false;
                $scope.showloadingerror=true;
          });

   };

   $scope.showTeamMemberDetailIssues=function(id)
   {
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.userdata[id+'']));
      console.log(id);
      $location.path( "/issues" );
   };

   $scope.showUnassignedIssues=function(id)
   {
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.issuedata.unassigned));
      console.log(id);
      $location.path( "/unassignedissues" );
   };

   $scope.showTeamMemberTrackerIssues=function(id,tid)
   {console.log(tid);
      userdata=$scope.currentproject.userdata[id+''];
      issueid=[];
      for(i=0;i<userdata.issueid.length;i++)
      {
        console.log(userdata.issueid[i].trackerid);
        if(userdata.issueid[i].trackerid==tid)
        {
          console.log("added");
           issueid.push(userdata.issueid[i]);
        }
           
      }
      cacheService.setData("currentMemberDetail",angular.copy(issueid));
      console.log(id);
      $location.path( "/unassignedissues" );
   };

    $scope.showTeamSeverityIssues=function(id,tid)
   {console.log(tid);
      userdata=$scope.currentproject.userdata[id+''].customdata[tid];
      issueid=userdata.issue;
     
      cacheService.setData("currentMemberDetail",angular.copy(issueid));
      console.log(id);
      $location.path( "/unassignedissues" );
   };

   $scope.init=function()
   {
      

      $scope.currentproject=cacheService.getData("currentProject");
      $scope.projects=cacheService.getData("userProjectList");
       $scope.userdata=cacheService.getData("user");
     
       if($scope.userdata)
       {
        if($scope.currentproject==undefined && $scope.projects==undefined)
          {
              $scope.currentproject={};
              $scope.currentproject.errormsg="Select a project.";
              $scope.currentproject.showcurrentprojectinfo=false;
              $scope.currentproject.showtrackerdata=false;
              $scope.projects=undefined;
             $scope.promiseForInit();
          }
          else
          {

          }
       }
          

   };

   $scope.refreshprojectdetails=function()
   {
      $scope.updateProjectInfo();
   };

   $scope.showTrackerIssues=function(id)
   {
    console.log(id);
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.trackerdata[id+''].issueid));
      //console.log($scope.currentproject.trackerdata[id+'']);
      $location.path( "/unassignedissues" );
   };

    $scope.showStatusIssues=function(id)
   {
    console.log(id);
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.statusdata[id+''].issue));
      //console.log($scope.currentproject.trackerdata[id+'']);
      $location.path( "/unassignedissues" );
   };

    $scope.showCustomIssues=function(id)
   {
    console.log(id);
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.customdata[id+''].issue));
      //console.log($scope.currentproject.trackerdata[id+'']);
      $location.path( "/unassignedissues" );
   };
   $scope.showBugIssues=function(id)
   {
    console.log(id);
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.bugsdata[id+''].issue));
      //console.log($scope.currentproject.trackerdata[id+'']);
      $location.path( "/unassignedissues" );
   };
  
    
  }]);



redfaceapp.controller('IssueController', ['$scope', '$http','$rootScope','cacheService','redmineService','$location',
  function ($scope, $http,$rootScope,cacheService,redmineService,$location) {
    
   $scope.printreport=function()
    {
        window.print();
    };

   $scope.showTrackerSplitup=function(name)
   {
      console.log(name);
   };

   $scope.init=function()
   {
      
      $scope.userdata=cacheService.getData("user");
      $scope.currentproject=cacheService.getData("currentProject");
      $scope.currentMemberDetail = cacheService.getData("currentMemberDetail");
      $scope.issuedata=$scope.currentproject.userdata[$scope.currentMemberDetail.id+''].issueid;
      

   };

   $scope.gotoProjectDetails=function()
   {
       $location.path( "/home" );
   };

  
    
    
  }]);

redfaceapp.controller('UnassignedIssueController', ['$scope', '$http','$rootScope','cacheService','redmineService','$location','$document',
  function ($scope, $http,$rootScope,cacheService,redmineService,$location,$document) {
    
  
     $scope.printreport=function()
    {
        window.print();
    };
    
   $scope.showTrackerSplitup=function(name)
   {
      console.log(name);
   };

   $scope.init=function()
   {
      
      $scope.userdata=cacheService.getData("user");
      $scope.currentproject=cacheService.getData("currentProject");
     $scope.issuedata = cacheService.getData("currentMemberDetail");
     
   };

   $scope.gotoProjectDetails=function()
   {
       $location.path( "/home" );
   };

  
    
    
  }]);


