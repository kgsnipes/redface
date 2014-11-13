redfaceapp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/welcome.html',
        controller: 'WelcomeController'
      }).
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);