redfaceapp.service('csvService', function() {
  
  var writeDataToFile = function(projectname,content,fileformat,callback) {
     
     chrome.fileSystem.chooseEntry( {
      type: 'saveFile',
      suggestedName: projectname+moment().format("_D_MMM_YYYY")+'.csv',
      accepts: [ { description: 'CSV files (*.'+fileformat+')',
                   extensions: [fileformat]} ],
      acceptsAllTypes: true
    }, function(fileEntry){


      fileEntry.createWriter(function(fileWriter) {

      var truncated = false;
      var blob = new Blob([content]);

      fileWriter.onwriteend = function(e) {
        if (!truncated) {
          truncated = true;
          // You need to explicitly set the file size to truncate
          // any content that might have been there before
          this.truncate(blob.size);
          return;
        }
        
      };

      fileWriter.onerror = function(e) {
        console.log("error");
        callback(false);
      };

      fileWriter.write(blob);
      callback(true);

    });


    });

  };

  
  return {
    writeDataToFile: writeDataToFile
  };

});

redfaceapp.service('cacheService', function() {
  var obj = new Object();

  var setData = function(key,value,callback) {
     obj[key]=value;
  };

  var getData = function(key,callback){
      return obj[key];
  };

  var clearData = function(){
      return obj=new Object();
  };

  return {
    setData: setData,
    getData: getData,
    clearData:clearData
  };

});

redfaceapp.service('asyncCacheService', function() {
  var obj = new Object();

  var setData = function(key,value,callback) {
    var obj = {};
    obj[name] = value;
     chrome.storage.local.set(obj, function() {
        if(callback) callback();
    });
  };

  var getData = function(key,callback){
      chrome.storage.local.get(key, function(r) {
        if (callback) {
           console.log(r);
            callback(r[key]);
        }
       
    });
  };

  var clearData = function(){
      return obj=new Object();
  };

  return {
    setData: setData,
    getData: getData,
    clearData:clearData
  };

});



redfaceapp.service('redmineService', function($http) {
  
  var getCurrentUserProfile= function(domain,header) {
         return $http.get(domain+'/users/current.json',{headers:header});
      };

  var getProjectStatuses= function(domain,header) {
         return $http.get(domain+'/issue_statuses.json',{headers:header});
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

  var getProjectIssuesWithStatus= function(domain,header,id,statusid,offset,limit) {
         return $http.get(domain+"/issues.json?project_id="+id+"&status_id="+statusid+"&offset="+offset+"&limit="+limit,{headers:header});
      };


  return {
    getCurrentUserProfile: getCurrentUserProfile,
    getProjectsListForProfile:getProjectsListForProfile,
    getProjectDetails:getProjectDetails,
    getProjectIssues:getProjectIssues,
    getProjectIssuesWithoutTrackers:getProjectIssuesWithoutTrackers,
    getProjectStatuses:getProjectStatuses,
    getProjectIssuesWithStatus:getProjectIssuesWithStatus
  };

});




