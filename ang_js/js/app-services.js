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




redfaceapp.service('redfaceLogicService', function() {
  var obj = new Object();

 
   var manipulateTaskTrackersWithStatus=function(currentproject,payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if(currentproject.statusdata==undefined)
          {
              currentproject.statusdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
              if(currentproject.statusdata[payload.data.issues[i].status.id+'']==undefined)
              {
                currentproject.statusdata[payload.data.issues[i].status.id+'']={};
                currentproject.statusdata[payload.data.issues[i].status.id+''].id=payload.data.issues[i].status.id;
                currentproject.statusdata[payload.data.issues[i].status.id+''].name=payload.data.issues[i].status.name;
                currentproject.statusdata[payload.data.issues[i].status.id+''].count=1;
                currentproject.statusdata[payload.data.issues[i].status.id+''].issue=[];
                currentproject.statusdata[payload.data.issues[i].status.id+''].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
              }
              else
              {
                currentproject.statusdata[payload.data.issues[i].status.id+''].count++;
                currentproject.statusdata[payload.data.issues[i].status.id+''].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
              }
          }
      }

      
   };

   var manipulateTaskTrackersWithSeverity=function(currentproject,payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if(currentproject.customdata==undefined)
          {
              currentproject.customdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            if(payload.data.issues[i].custom_fields!=undefined && payload.data.issues[i].custom_fields.length>0)
            {
              for(j=0;j<payload.data.issues[i].custom_fields.length;j++)
              {
                   if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]==undefined)
                    {
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]={};
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].name=payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value;
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count=1;
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue=[];
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)}});
                    }
                    else if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]!=undefined)
                    {
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count++;
                      currentproject.customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)}});
                    }

              }
             
            }
              
          }
      }
   };

    var manipulateTaskTrackersWithBugsSeverity=function(currentproject,payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if(currentproject.bugsdata==undefined)
          {
              currentproject.bugsdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            if(payload.data.issues[i].tracker.name=='Issue Tracker' && payload.data.issues[i].custom_fields!=undefined && payload.data.issues[i].custom_fields.length>0)
            {
              for(j=0;j<payload.data.issues[i].custom_fields.length;j++)
              {
                   if(payload.data.issues[i].custom_fields[j].name.indexOf('Severity')!=-1 && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]==undefined)
                    {
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]={};
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].name=payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value;
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count=1;
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue=[];
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                    }
                    else if(payload.data.issues[i].custom_fields[j].name.indexOf('Severity')!=-1 && payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]!=undefined)
                    {
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count++;
                      currentproject.bugsdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                    }

              }
             
            }
              
          }
      }
      
   };

var manipulateBugsStatusData=function(currentproject,payload)
   {
      console.log("hello");
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
        if(currentproject.bugstatusdata==undefined)
          {
              currentproject.bugstatusdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            if(payload.data.issues[i].tracker!=undefined && payload.data.issues[i].tracker.name!=undefined && payload.data.issues[i].tracker.name=='Issue Tracker' && payload.data.issues[i].status!=undefined && payload.data.issues[i].status.name!="Closed")
            {
              
                   if(currentproject.bugstatusdata[payload.data.issues[i].status.id+'']==undefined)
                    {
                      console.log(payload.data.issues[i]);
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+'']={};
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].id=payload.data.issues[i].status.id;
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].name=payload.data.issues[i].status.name;
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].count=1;
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].issue=[];
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                    }
                    else if(currentproject.bugstatusdata[payload.data.issues[i].status.id+'']!=undefined)
                    {
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].count++;
                      currentproject.bugstatusdata[payload.data.issues[i].status.id+''].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                    }

            
             
            }
              
          }
      }
   };


   var manipulateTaskTrackers=function(currentproject,payload)
   {
      if(payload.data.issues!=undefined && payload.data.issues.length>0)
      {
          if(currentproject.trackerdata==undefined)
          {
              currentproject.trackerdata={};
          }

          if(currentproject.issuedata==undefined)
          {
            currentproject.issuedata={};
            currentproject.issuedata.total_count=0;
            currentproject.issuedata.unassignedcount=0;
            currentproject.issuedata.unassigned=[];
          }
          

          if(currentproject.userdata==undefined)
          {
            currentproject.userdata={};
          }

          for(i=0;i<payload.data.issues.length;i++)
          {
            currentproject.issuedata.total_count++;
            //tracker data
              if(currentproject.trackerdata[payload.data.issues[i].tracker.id+'']==undefined)
              {
                currentproject.trackerdata[payload.data.issues[i].tracker.id+'']={};
                currentproject.trackerdata[payload.data.issues[i].tracker.id+''].issueid=[];
                currentproject.trackerdata[payload.data.issues[i].tracker.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                currentproject.trackerdata[payload.data.issues[i].tracker.id+''].count=1;
                currentproject.trackerdata[payload.data.issues[i].tracker.id+''].name=payload.data.issues[i].tracker.name;
                 currentproject.trackerdata[payload.data.issues[i].tracker.id+''].id=payload.data.issues[i].tracker.id;

              }
              else
              {
                currentproject.trackerdata[payload.data.issues[i].tracker.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                 currentproject.trackerdata[payload.data.issues[i].tracker.id+''].count++;
              }

              //user data
              if(payload.data.issues[i].assigned_to==undefined)
              {
                currentproject.issuedata.unassigned.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':undefined});
                 currentproject.issuedata.unassignedcount++;
              }
             
              if(payload.data.issues[i].assigned_to!=undefined && payload.data.issues[i].assigned_to.id!=undefined && currentproject.userdata[payload.data.issues[i].assigned_to.id+'']==undefined)
              {
                currentproject.userdata[payload.data.issues[i].assigned_to.id+'']={};
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid=[];
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issuecount=1;
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].name=payload.data.issues[i].assigned_to.name;
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].id=payload.data.issues[i].assigned_to.id;

              }
              else if(payload.data.issues[i].assigned_to!=undefined && payload.data.issues[i].assigned_to.id!=undefined && currentproject.userdata[payload.data.issues[i].assigned_to.id+'']!=undefined)
              {
                 currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issueid.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                 currentproject.userdata[payload.data.issues[i].assigned_to.id+''].issuecount++;
              }

              if(payload.data.issues[i].assigned_to!=undefined && currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata==undefined)
              {
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata={};
              }

              if(payload.data.issues[i].assigned_to!=undefined &&  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+'']==undefined)
              {
                currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+'']={};
                 currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata={};
               currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].count=1;
               currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].id=payload.data.issues[i].tracker.id;
               currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].name=payload.data.issues[i].tracker.name;


              }
              else if(payload.data.issues[i].assigned_to!=undefined &&  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+'']!=undefined )
              {
                  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].count++;
              }

              if(payload.data.issues[i].assigned_to!=undefined && currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata!=undefined)
              {
                if(currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+'']==undefined)
                {
                  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+'']={};
                  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+''].name=payload.data.issues[i].status.name;
                  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+''].count=1;
                }
                else
                {
                  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].trackerdata[payload.data.issues[i].tracker.id+''].statusdata[payload.data.issues[i].status.id+''].count++;
                }
              }
                if(payload.data.issues[i].assigned_to!=undefined  && currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata==undefined )
                {
                  currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata={};
                }

               if(payload.data.issues[i].assigned_to!=undefined  && currentproject.userdata[payload.data.issues[i].assigned_to.id+'']!=undefined && payload.data.issues[i].custom_fields!=undefined && payload.data.issues[i].custom_fields.length>0)
                {
                  for(j=0;j<payload.data.issues[i].custom_fields.length;j++)
                  {
                       if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]==undefined)
                        {
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]={};
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].name=payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value;
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count=1;
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue=[];
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                        }
                        else if(payload.data.issues[i].custom_fields[j].name=='Severity' && (payload.data.issues[i].custom_fields[j].value!=undefined || payload.data.issues[i].custom_fields[j].value!='')  && currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value]!=undefined)
                        {
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].count++;
                          currentproject.userdata[payload.data.issues[i].assigned_to.id+''].customdata[payload.data.issues[i].custom_fields[j].name+'-'+payload.data.issues[i].custom_fields[j].value].issue.push({'issueid':payload.data.issues[i].id,'issuename':payload.data.issues[i].subject,'issuestatus':payload.data.issues[i].status,'trackerid':payload.data.issues[i].tracker.id,'issuedate':{'date':moment(payload.data.issues[i].created_on).format("D - MMM - YYYY, h:mm:ss a"),'dateObj':moment(payload.data.issues[i].created_on)},'issueauthor':payload.data.issues[i].author,'issueasignee':payload.data.issues[i].assigned_to});
                        }

                  }
                 
                }


              
          }
      }
        

      this.manipulateTaskTrackersWithBugsSeverity(currentproject,payload);
      this.manipulateBugsStatusData(currentproject,payload);
      
   };
  return {
    manipulateTaskTrackersWithStatus:manipulateTaskTrackersWithStatus,
    manipulateTaskTrackersWithSeverity:manipulateTaskTrackersWithSeverity,
    manipulateTaskTrackersWithBugsSeverity:manipulateTaskTrackersWithBugsSeverity,
    manipulateTaskTrackers:manipulateTaskTrackers,
    manipulateBugsStatusData:manipulateBugsStatusData
  };

});