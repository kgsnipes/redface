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

  var getProjectsListForProfile= function(domain,header,offset,limit) {
         return $http.get(domain+"/projects.json?offset="+offset+"&limit="+self.limit,{headers:header});
      };


  return {
    getCurrentUserProfile: getCurrentUserProfile,
    getProjectsListForProfile:getProjectsListForProfile
  };

});