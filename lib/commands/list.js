
var findit = require('findit'),
relativeDate = require('relative-date'),
celeri = require('celeri');

function getProjectFiles(project)
{          
	try
	{
		var files = findit.sync(project.directory),
		fileStats = [],
		now = Date.now(); 
		
		files.forEach(function(file)
		{   
			var relativePath = file.replace(project.directory,'').substr(1);                    
			                              
			
			//no hidden files, no node modules
			if(relativePath.substr(0,1) == '.' || relativePath.indexOf('node_modules') > -1) return; 
			          
			var mtime = fs.lstatSync(file).mtime.getTime(),
			datediff = now - mtime;
			                               
			        
			fileStats.push({
				path: relativePath, 
				mtime: mtime,   
				datediff: datediff,
				prettyDate: relativeDate(mtime)
			});
		});     
		                           
	}
	catch(e)
	{                                    
    	return [];
	}                              
	
	fileStats.sort(function(a,b)
	{
		return a.mtime > b.mtime ? -1 : 1;
	});
	
	return fileStats;
} 

exports.plugin = function(cupboard)
{
	cupboard.list = function()
	{                        
		cupboard.projects.all(function(err, projects)
		{       
			var details = [];

			for(var i = projects.length; i--;)
			{              
				var project = projects[i];  
				                       
				
				if(!project) continue;                      
				
				var updatedFiles = getProjectFiles(project),
				lastPublishedAt = project.lastPublishedAt || 0,
				updates = 0;
				     
				                               
				
				for(var j = updatedFiles.length; j--;)
				{
					if(updatedFiles[j].mtime > lastPublishedAt)
					{                                   
						updates++;
					}
				}       
				
				//var pubdiffSeconds = (updatedFiles[0].mtime - lastPublishedAt) / 10000,
				                                  

				details.push({
					'name': project.name[updates ? 'green' : 'grey'],            
					'updates': updates,                
					'last modified': relativeDate(updatedFiles[0].mtime),         
					'last publish': lastPublishedAt ? relativeDate(lastPublishedAt) : 'never',     
					'path': project.directory
				}); 
				
				/*if(newestFile) details[project.name] = {
					path: 
				}*/              
			}  
			
			details.sort(function(a, b)
			{
				return a.updates > b.updates ? -1 : 1;
			});
			
			var detailsTree = {};
			
			details.forEach(function(details)
			{ 
				detailsTree[details.name] = details;  
				delete details['name'];
			})                          

			console.log('|');
			celeri.drawTree(detailsTree);
		})
	};
}