



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
    $scope.projects=undefined;
     offset=0;
   limit=10;
   userdata=cacheService.getData("user");
   //get current user data
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
           
              
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
          });

   };


   $scope.updateProjectInfo=function()
   {
      console.log($scope.selectedProject);

   };
  	
   
    
  }]);

