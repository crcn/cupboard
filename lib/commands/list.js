
var findit = require('findit'),
relativeDate = require('relative-date'),
celeri = require('celeri'),
_ = require('underscore');



function getProjectFiles(project)
{       
	var fileStats = [],  
	now = Date.now();
	            
	findit.findSync(project.directory, function(file, stats)
	{
		var relativePath = file.replace(project.directory,'').substr(1);                    

		//no hidden files, no node modules
		if(file.match(/\/\.[^\/]+/g) || relativePath.indexOf('node_modules') > -1 || stats.isDirectory()) return; 

		try
		{
			var mtime = stats.mtime.getTime(),
			datediff = mtime - project.lastPublishedAt;
			
			fileStats.push({
				path: relativePath || file,
				mtime: mtime,
				datediff: datediff,
				prettyDate: relativeDate(mtime) 
			}); 
		}
		catch(e)
		{
		}
	});
	                  
	
	fileStats.sort(function(a,b)
	{
		return a.mtime > b.mtime ? -1 : 1;
	});
	
	return fileStats;
} 



function getDetails(projects)
{                
	var details = [];
	
	for(var i = projects.length; i--;)
	{              
		var project = projects[i];  
		                       
		
		if(!project) continue;                      
		
		var fileStats = getProjectFiles(project),
		lastPublishedAt = project.lastPublishedAt || 0,
		updates = fileStats.length && fileStats[0].mtime > lastPublishedAt; 
		                               
		                        

		details.push({
			'name': project.name[updates ? 'green' : 'grey'],            
			'updates': updates,                
			'last modified': fileStats.length ? relativeDate(fileStats[0].mtime) : 'unknown'.red,         
			'last publish': (lastPublishedAt ? relativeDate(lastPublishedAt) : 'never')/*[warn]*/,     
			//'path': project.directory
		});              
	}  
	
	details.sort(function(a, b)
	{
		return a.mtime > b.mtime ? -1 : 1;
	});
	
	return details;
}    

function drawTree(details)
{   
	
	var detailsTree = {};
	
	    
	
	details.forEach(function(details)
	{ 
		detailsTree[details.name] = details;  
		delete details['name'];
		delete details['updates']
	})            
	
	console.log(' ');
	celeri.drawTree(detailsTree);
}


exports.plugin = function(cupboard)
{
	cupboard.list = function(filter)
	{                   
		cupboard.projects.all(function(err, projects)
		{       
			var details = getDetails(projects);
			
			if(filter) details = filter(details) || details;
			
			drawTree(details);            
		})
	};  
	
	cupboard.commands.details = function(project)
	{
		var stats = getProjectFiles(project),
		inf = {
			'path': project.directory,
			'last published': relativeDate(project.lastPublishedAt),
			updates: 0, 
			details: {}
		};
		
		
		stats.forEach(function(stat)
		{
			if(stat.datediff < 0 ) return;
			
			inf.updates++;
			
			inf.details[stat.path] = {
				'last modified': stat.prettyDate
			};
		})
		
		celeri.drawTree(inf);
	}
	
	cupboard.updates = function()
	{
		cupboard.list(function(details)
		{ 
			return _.filter(details, function(detail)
			{
				return detail.updates;
			})  
		});
	};
}