



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

   userdata=cacheService.getData("user");
   //get current user data
   var promise=redmineService.getCurrentUserProfile(userdata.domain,cacheService.getData("ajaxheader"));
   promise.then(
          function(payload) { 
            console.log(payload);
              cacheService.setData("currentUserProfile",payload);
              
          },
          function(errorPayload) {
              console.error('failure loading movie', errorPayload);
          });
   
  	
   
    
  }]);

