



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
      if(userdata)
      {
         $scope.user.userName=userdata.userName;
         $scope.user.apiKey=userdata.apiKey;
      }
          
       
      document.getElementById("login_username").focus();
   };

    
  }]); 

redfaceapp.controller('HomeController', ['$scope', '$http','$rootScope','cacheService','redmineService','$location','$window',
  function ($scope, $http,$rootScope,cacheService,redmineService,$location,$window) {
    
    $scope.printreport=function()
    {
        $window.print();
        // $scope.writesamplefile();
    };

    $scope.writesamplefile=function()
    {

     
      /*
      chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {

        console.log(readOnlyEntry);

            chrome.fileSystem.getWritableEntry(readOnlyEntry, function(writableFileEntry) {
        writableFileEntry.createWriter(function(writer) {
          writer.onerror = $scope.writesamplefileerrorhandler;
          writer.onwriteend = callback;

        chosenFileEntry.file(function(file) {
          writer.write(file);
        });
      }, $scope.writesamplefileerrorhandler);
    });
});
*/
        /*  chrome.fileSystem.getWritableEntry(chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
}), function(writableFileEntry) {
    writableFileEntry.createWriter(function(writer) {
      writer.onerror = $scope.writesamplefileerrorhandler;
      writer.onwriteend = callback;

    chosenFileEntry.file(function(file) {
      writer.write(file);
    });
  }, $scope.writesamplefileerrorhandler);
});
        */

        
    };

    $scope.writesamplefileerrorhandler=function()
    {
        console.log("file write error");
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
            
            $scope.manipulateTaskTrackers(payload);

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
            
            $scope.manipulateTaskTrackersWithStatus(payload);

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
      console.log("hello");

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

   $scope.manipulateTaskTrackersWithStatus=function(payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if($scope.currentproject.statusdata==undefined)
          {
              $scope.currentproject.statusdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
              if($scope.currentproject.statusdata[payload.data.issues[i].status.id+'']==undefined)
              {
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+'']={};
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].id=payload.data.issues[i].status.id;
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].name=payload.data.issues[i].status.name;
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].count=1;
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].issue=[];
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
              }
              else
              {
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].count++;
                $scope.currentproject.statusdata[payload.data.issues[i].status.id+''].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
              }
          }
      }
   };

   $scope.manipulateTaskTrackersWithSeverity=function(payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if($scope.currentproject.customdata==undefined)
          {
              $scope.currentproject.customdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            if(payload.data.issues[i].custom_fields!=undefined && payload.data.issues[i].custom_fields.length>0)
            {
              for(j=0;j<payload.data.issues[i].custom_fields.length;j++)
              {
                   if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]==undefined)
                    {
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]={};
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].name=payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value;
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count=1;
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue=[];
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)}});
                    }
                    else if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]!=undefined)
                    {
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count++;
                      $scope.currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)}});
                    }

              }
             
            }
              
          }
      }
   };

    $scope.manipulateTaskTrackersWithBugsSeverity=function(payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if($scope.currentproject.bugsdata==undefined)
          {
              $scope.currentproject.bugsdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            if(payload.data.issues[i].tracker.name=='Issue Tracker' && payload.data.issues[i].custom_fields!=undefined && payload.data.issues[i].custom_fields.length>0)
            {
              for(j=0;j<payload.data.issues[i].custom_fields.length;j++)
              {
                   if(payload.data.issues[i].custom_fields[j].name.indexOf('Severity')!=-1 && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]==undefined)
                    {
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]={};
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].name=payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value;
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count=1;
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue=[];
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                    }
                    else if(payload.data.issues[i].custom_fields[j].name.indexOf('Severity')!=-1 && payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]!=undefined)
                    {
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count++;
                      $scope.currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                    }

              }
             
            }
              
          }
      }
   };


   $scope.manipulateTaskTrackers=function(payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
          if($scope.currentproject.trackerdata==undefined)
          {
              $scope.currentproject.trackerdata={};
          }

          if($scope.currentproject.issuedata==undefined)
          {
            $scope.currentproject.issuedata={};
            $scope.currentproject.issuedata.total_count=0;
            $scope.currentproject.issuedata.unassignedcount=0;
            $scope.currentproject.issuedata.unassigned=[];
          }
          

          if($scope.currentproject.userdata==undefined)
          {
            $scope.currentproject.userdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            $scope.currentproject.issuedata.total_count++;
            //tracker data
              if($scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+'']==undefined)
              {
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+'']={};
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].issueid=[];
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].count=1;
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].name=payload.data.issues[i].tracker.name;
                 $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].id=payload.data.issues[i].tracker.id;

              }
              else
              {
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                 $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].count++;
              }

              //user data
              if(payload.data.issues[i].assigned_to==undefined)
              {
                $scope.currentproject.issuedata.unassigned.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'issueauthor':payload.data.issues[i].author});
                 $scope.currentproject.issuedata.unassignedcount++;
              }
             
              if(payload.data.issues[i].assigned_to!=undefined && payload.data.issues[i].assigned_to.id!=undefined && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']==undefined)
              {
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']={};
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid=[];
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issuecount=1;
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].name=payload.data.issues[i].assigned_to.name;
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].id=payload.data.issues[i].assigned_to.id;

              }
              else if(payload.data.issues[i].assigned_to!=undefined && payload.data.issues[i].assigned_to.id!=undefined && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']!=undefined)
              {
                 $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                 $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issuecount++;
              }

              if(payload.data.issues[i].assigned_to!=undefined && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata==undefined)
              {
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata={};
              }

              if(payload.data.issues[i].assigned_to!=undefined &&  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+'']==undefined)
              {
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+'']={};
                 $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata={};
               $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].count=1;
               $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].id=payload.data.issues[i].tracker.id;
               $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].name=payload.data.issues[i].tracker.name;


              }
              else if(payload.data.issues[i].assigned_to!=undefined &&  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+'']!=undefined )
              {
                  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].count++;
              }

              if(payload.data.issues[i].assigned_to!=undefined && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata!=undefined)
              {
                if($scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+'']==undefined)
                {
                  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+'']={};
                  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+''].name=payload.data.issues[i].status.name;
                  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+''].count=1;
                }
                else
                {
                  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+''].count++;
                }
              }
                if(payload.data.issues[i].assigned_to!=undefined  && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata==undefined )
                {
                  $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata={};
                }

               if(payload.data.issues[i].assigned_to!=undefined  && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']!=undefined && payload.data.issues[i].custom_fields!=undefined && payload.data.issues[i].custom_fields.length>0)
                {
                  for(j=0;j<payload.data.issues[i].custom_fields.length;j++)
                  {
                       if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]==undefined)
                        {
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]={};
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].name=payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value;
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count=1;
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue=[];
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                        }
                        else if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]!=undefined)
                        {
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count++;
                          $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                        }

                  }
                 
                }


              
          }
      }
      console.log($scope.currentproject.userdata.customdata);

      //$scope.manipulateTaskTrackersWithSeverity(payload);
      $scope.manipulateTaskTrackersWithBugsSeverity(payload);
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


