redfaceapp.service('cacheService', function() {
  var obj = new Object();

  var setData = function(key,value) {
     obj[key]=value;
  };

  var getData = function(key){
      return obj[key];
  };

  return {
    setData: setData,
    getData: getData
  };

});


redfaceapp.service('redmineService', function($http) {
  
  var getCurrentUserProfile= function(domain,header) {
         return $http.get(domain+'/users/current.json',{headers:header});
      };

      
  return {
    getCurrentUserProfile: getCurrentUserProfile
  };

});