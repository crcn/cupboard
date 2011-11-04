
var findit = require('findit'),
relativeDate = require('relative-date'),
celeri = require('celeri'),
_ = require('underscore');

function getProjectFiles(project)
{                                    
	var files = findit.sync(project.directory),
	fileStats = [],
	now = Date.now(); 

	files.forEach(function(file)
	{   
		var relativePath = file.replace(project.directory,'').substr(1);                    


		//no hidden files, no node modules
		if(file.match(/\/\.[^\/]+/g) || relativePath.indexOf('node_modules') > -1) return; 

		try
		{
			var mtime = fs.lstatSync(file).mtime.getTime(),
			datediff = mtime - project.lastPublishedAt;


			fileStats.push({
				path: relativePath, 
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
		
		//seconds
		var datediff = (updatedFiles.length ? updatedFiles[0].datediff : 1) / 1000 / 60,
		warn = 'grey';
		
		
		//longer the time between commits + updates = higher warning.
		if(datediff < 3600 / updates)
		{
			warn = 'grey';
		}                  
		else
		if(datediff < 3600 * 6 / updates)
		{
			warn = 'yellow';
		}                   
		else
		if(datediff < 3600 * 24 / updates)
		{
			warn = 'red';
		}                       

		details.push({
			'name': project.name[updates ? 'green' : 'grey'],            
			'updates': updates,                
			'last modified': updatedFiles.length ? relativeDate(updatedFiles[0].mtime) : 'unknown'.red,         
			'last publish': (lastPublishedAt ? relativeDate(lastPublishedAt) : 'never')[warn],     
			'path': project.directory
		});              
	}  
	
	details.sort(function(a, b)
	{
		return a.updates > b.updates ? -1 : 1;
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
	
	cupboard.updates = function()
	{
		cupboard.list(function(details)
		{ 
			return _.filter(details,function(detail)
			{
				return detail.updates > 0;
			})  
		});
	};
}