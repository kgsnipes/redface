



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

redfaceapp.controller('HomeController', ['$scope', '$http','$rootScope','cacheService','redmineService',
  function ($scope, $http,$rootScope,cacheService,redmineService,$http) {
    
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

    $scope.promiseForTrackerIssues=function(projectid,trackername,trackerid,off,lim)
   {
      var promiseProjectTrackerList=redmineService.getProjectIssues(userdata.domain,cacheService.getData("ajaxheader"),projectid,trackerid,off,lim);
      promiseProjectTrackerList.then(
          function(payload) { 
            
            if($scope.currentproject.trackerdata==undefined)
            {
              $scope.currentproject.trackerdata={};
              $scope.currentproject.trackercount=0;
            }
            if(payload.data.total_count==0)
            {
                if($scope.currentproject.trackerdata[trackername]==undefined)
                    {
                      $scope.currentproject.trackerdata[trackername]={};
                      $scope.currentproject.trackerdata[trackername].name=trackername;
                      $scope.currentproject.trackerdata[trackername].issueCount=1;
                      $scope.currentproject.trackercount=$scope.currentproject.trackercount+1;
                    }
                    
            }
              
              for(i=0;i<payload.data.issues.length;i++)
              {
                if(typeof payload.data.issues[i]=="object")
                 {
                    if($scope.currentproject.trackerdata[payload.data.issues[i].tracker.name]==undefined)
                    {
                      $scope.currentproject.trackerdata[payload.data.issues[i].tracker.name]={};
                      $scope.currentproject.trackerdata[payload.data.issues[i].tracker.name].name=payload.data.issues[i].tracker.name;
                      $scope.currentproject.trackerdata[payload.data.issues[i].tracker.name].issueCount=1;
                      $scope.currentproject.trackercount=$scope.currentproject.trackercount+1;
                    }
                    else
                    {
                      $scope.currentproject.trackerdata[payload.data.issues[i].tracker.name].issueCount=$scope.currentproject.trackerdata[payload.data.issues[i].tracker.name].issueCount+1;
                    }
                 }
              }
                 
                
            

            if(payload.data.issues.total_count>off)
            {
              $scope.promiseForTrackerIssues(projectid,trackername,trackerid,off+lim,lim);
            }
            
            cacheService.setData("currentProject",angular.copy($scope.currentproject));
           
           console.log($scope.currentproject.trackercount);
           console.log($scope.currentproject.trackers.length);
           if($scope.currentproject.trackercount==$scope.currentproject.trackers.length)
           {
            $scope.currentproject.showtrackerdata=true;
             $scope.showloading=false;
           }
                
            
           
              
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
          });

   };


   $scope.updateProjectInfo=function()
   {
    $scope.showloading=true;
      console.log(this.selectedProject);
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
          
           for(i=0;i<$scope.currentproject.trackers.length;i++)
                $scope.promiseForTrackerIssues($scope.currentproject.id,$scope.currentproject.trackers[i].name,$scope.currentproject.trackers[i].id,0,100);
              
          },
          function(errorPayload) {
             $scope.currentproject.errormsg="Project info not found.";
             $scope.currentproject.showcurrentprojectinfo=false;
          });

   };

   $scope.showTrackerSplitup=function(name)
   {
      console.log(name);
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
      
      

   };

    
    
  }]);

