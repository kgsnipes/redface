



redfaceapp.controller('WelcomeController', ['$scope', '$http','$location','$rootScope','cacheService',
  function ($scope, $http,$location,$rootScope,cacheService) {
   

   $scope.performLogin=function()
   {
    if($scope.user.domain!=undefined && $scope.user.apiKey!=undefined && $scope.user.userName!=undefined && $scope.user.domain!="" && $scope.user.apiKey!="" && $scope.user.userName!="")
    {
      userdata=angular.copy($scope.user);
      cacheService.setData("user",userdata);
      cacheService.setData("ajaxheader",{ 'X-Redmine-API-Key':userdata.apiKey});
       
      $location.path( "/home" );
    }
    else
    {
      $rootScope.user=angular.copy($scope.user);
      $location.path( "/" );
    }
   		
   };

    
  }]);

redfaceapp.controller('HomeController', ['$scope', '$http','$rootScope','cacheService','redmineService','$location',
  function ($scope, $http,$rootScope,cacheService,redmineService,$location) {
    
     offset=0;
   limit=10;
   userdata=cacheService.getData("user");
   //get current user data
   $scope.showloading=true;
   var promise=redmineService.getCurrentUserProfile(userdata.domain,cacheService.getData("ajaxheader"));
   promise.then(
          function(payload) { 
           
              cacheService.setData("currentUserProfile",payload.data.user);
              $scope.promiseForProject(offset,limit);
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
          });
   
  
   

   $scope.promiseForProject=function(off,lim)
   {
      var promiseProjectList=redmineService.getProjectsListForProfile(userdata.domain,cacheService.getData("ajaxheader"),off,lim);
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
          });

   };

  


   $scope.promiseForIssues=function(projectid,off,lim)
   {
      var promiseProjectIssueList=redmineService.getProjectIssuesWithoutTrackers(userdata.domain,cacheService.getData("ajaxheader"),projectid,off,lim);
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
            }
            
            cacheService.setData("currentProject",angular.copy($scope.currentproject));
            
           
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
          });

   };


   $scope.updateProjectInfo=function()
   {
    $scope.showloading=true;
      console.log(this.selectedProject);
      $scope.currentproject={};
      var promiseProjectInfo=redmineService.getProjectDetails(userdata.domain,cacheService.getData("ajaxheader"),this.selectedProject);
      promiseProjectInfo.then(
          function(payload) { 
             
            $scope.currentproject.name=payload.data.project.name;
            $scope.currentproject.id=payload.data.project.id;
            $scope.currentproject.identifier=payload.data.project.identifier;
            $scope.currentproject.description=payload.data.project.description;
            $scope.currentproject.createdOn=payload.data.project.created_on;
            $scope.currentproject.showcurrentprojectinfo=true;
            $scope.currentproject.trackers=payload.data.project.trackers;
            cacheService.setData("currentProject",angular.copy($scope.currentproject));

            $scope.promiseForIssues($scope.currentproject.id,0,100);
           
          },
          function(errorPayload) {
             $scope.currentproject.errormsg="Project info not found.";
             $scope.currentproject.showcurrentprojectinfo=false;
          });

   };

   $scope.showTeamMemberDetailIssues=function(id)
   {
      cacheService.setData("currentMemberDetail",angular.copy($scope.currentproject.userdata[id+'']));
      console.log(id);
      $location.path( "/issues" );
   };

   $scope.init=function()
   {
      console.log("hello");

      $scope.currentproject=cacheService.getData("currentProject");
      $scope.projects=cacheService.getData("userProjectList");

      if($scope.currentproject==undefined && $scope.projects==undefined)
      {
          $scope.currentproject={};
          $scope.currentproject.errormsg="Select a project.";
          $scope.currentproject.showcurrentprojectinfo=false;
          $scope.currentproject.showtrackerdata=false;
          $scope.projects=undefined;
         
      }
      else
      {
       
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
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].count=1;
                $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].name=payload.data.issues[i].tracker.name;

              }
              else
              {
                 $scope.currentproject.trackerdata[payload.data.issues[i].tracker.id+''].count++;
              }

              //user data
              if(payload.data.issues[i].assigned_to==undefined)
              {
                 $scope.currentproject.issuedata.unassignedcount++;
              }
             
              if(payload.data.issues[i].assigned_to!=undefined && payload.data.issues[i].assigned_to.id!=undefined && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']==undefined)
              {
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']={};
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid=[];
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status});
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issuecount=1;
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].name=payload.data.issues[i].assigned_to.name;
                $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].id=payload.data.issues[i].assigned_to.id;

              }
              else if(payload.data.issues[i].assigned_to!=undefined && payload.data.issues[i].assigned_to.id!=undefined && $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+'']!=undefined)
              {
                 $scope.currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status});
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

              
          }
      }
   };

  
    
    
  }]);



redfaceapp.controller('IssueController', ['$scope', '$http','$rootScope','cacheService','redmineService','$location',
  function ($scope, $http,$rootScope,cacheService,redmineService,$location) {
    
  

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
      console.log($scope.userdata);
      console.log($scope.issuedata);

   };

   $scope.gotoProjectDetails=function()
   {
       $location.path( "/home" );
   };

  
    
    
  }]);

