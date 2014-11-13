
var redfacecontrollers=angular.module('redfacecontrollers', []);


redfacecontrollers.controller('WelcomeController', ['$scope', '$http','$location','$rootScope',
  function ($scope, $http,$location,$rootScope) {
   
   $scope.performLogin=function()
   {
   		$rootScope.user=angular.copy($scope.user);
   		$location.path( "/home" );
   };

    
  }]);

redfacecontrollers.controller('HomeController', ['$scope', '$http','$rootScope',
  function ($scope, $http,$rootScope) {
   $scope.user=$rootScope.user;
  	console.log("in home"+$rootScope.user);
    
  }]);

