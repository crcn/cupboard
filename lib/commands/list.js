
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

function getUpdatedFiles(project)
{
	var files = getProjectFiles(project),
	updated = {}
	
	var num = files.length,
	max = 5,
	diff = max - num;      
	
	for(var i = 0, n = Math.min(files.length, max); i < n; i++)
	{                      
		var file = files[i];  
		
		if(!updated[file.prettyDate])
		{
			updated[file.prettyDate] = [];
		}                                 
		
		updated[file.prettyDate].push(file.path);       
	}                                                
	
	if(diff < 0)
	{   
		var spliced = {},
		count = 0;
		
		for(var i in updated)
		{
			spliced[i] = updated[i];     
			
			if(count++ > max) break;
		}                           
		
		updated = spliced;     
		
		updated['unlisted'] = -diff;
	}
	      
	return updated;
	
}

exports.plugin = function(cupboard)
{
	cupboard.list = function()
	{                        
		cupboard.projects.all(function(err, projects)
		{       
			var details = {};

			for(var i = projects.length; i--;)
			{              
				var project = projects[i],
				updatedFiles = getUpdatedFiles(project);


				details[project.name] = {        
					'updates': 'yes'.green,
					'path': project.directory,
					'files:': updatedFiles
				};                         
			}                             

			console.log('|');
			celeri.drawTree(details);
		})
	};
}