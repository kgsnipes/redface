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
         return $http.get(domain+"/projects.json?offset="+offset+"&limit="+limit,{headers:header});
      };

    var getProjectDetails= function(domain,header,id) {
         return $http.get(domain+"/projects/"+id+".json?include=trackers,issue_categories",{headers:header});
      };

  var getProjectIssues= function(domain,header,id,trackerid,offset,limit) {
         return $http.get(domain+"/issues.json?project_id="+id+"&tracker_id="+trackerid+"&offset="+offset+"&limit="+limit,{headers:header});
      };

    var getProjectIssuesWithoutTrackers= function(domain,header,id,offset,limit) {
         return $http.get(domain+"/issues.json?project_id="+id+"&offset="+offset+"&limit="+limit,{headers:header});
      };


  return {
    getCurrentUserProfile: getCurrentUserProfile,
    getProjectsListForProfile:getProjectsListForProfile,
    getProjectDetails:getProjectDetails,
    getProjectIssues:getProjectIssues,
    getProjectIssuesWithoutTrackers:getProjectIssuesWithoutTrackers
  };

});