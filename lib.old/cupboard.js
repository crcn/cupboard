require('colors');

var gumbo = require('gumbo'),
celeri = require('celeri'),
fs = require('fs'),
ini = require('ini'),   
queue = require('./queue'),
exec = require('./exec'),
utils = require('./utils');

process.env.DATA_DIR = '/usr/local/etc/cupboard/data';


var db = gumbo.db({
	persist:{
		fs: process.env.DATA_DIR + '/db'
	}
}),
c_projects = db.collection('projects');  
                 
                          
//no dupe names
c_projects.ensureIndex("name");    

exports.projects = c_projects;     
                                           

exports.commands = {};     

function getSearch(target)
{
	var search = {};
	
	if(target == '--all')
	{
		search = { name: { $ne: null } }; //all
	}                     
	else
	{
		search = {name: { $in: (target || '').split('+') } };
	}   
	                     
	
	return search;
}
  

exports.hasProject = function(target, callback)
{                                    
	c_projects.find(getSearch(target), function(err, projects)
	{                                          
		callback(!!projects.length)
	})
}

exports.loadProjectConfig = function(target, callback)
{                     
	function loadByDir()
	{
		var cfg = utils.loadConfig(utils.getConfigPath(process.cwd()));  
		                  
		
		if(cfg) cfg.directory = process.cwd();
		
		 
		callback(cfg ? [cfg] : []);
	}            
	                      
	
	
	if(target)
	{        
		                       
		    
		c_projects.find(getSearch(target), function(err, projects)
		{                         
			var configs = [];
			
			projects.forEach(function(project)
			{                 
				var cfg = utils.loadConfig(utils.getConfigPath(project.directory));  
				        
				if(!cfg)
				{              
					//shouldn't happen, but it does
					cfg = {
						project: {
							name: target
						}
					}
				} 
				
				cfg.directory = project.directory;  
				cfg.lastPublishedAt = project.lastPublishedAt;
				
				
				
				configs.push(cfg);
			});   
			
			if(!configs.length) return loadByDir();           
			
			callback(configs)                                          
		});
	}
	else
	{       
		loadByDir();
	}
}

fs.readdirSync(__dirname + '/commands').forEach(function(module)
{
	if(!module.match(/\.js$/g)) return;
	
	require('./commands/' + module).plugin(exports);
})
      