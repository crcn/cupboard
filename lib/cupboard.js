require('colors');

var gumbo = require('gumbo'),
celeri = require('celeri'),
fs = require('fs'),
ini = require('ini'),   
queue = require('./queue'),
exec = require('./exec'),
utils = require('./utils');


var db = gumbo.db({
	persist:{
		fs: '/usr/local/etc/data/db'
	}
}),
c_projects = db.collection('projects');  
                 
                          
//no dupe names
c_projects.ensureIndex("name");    

exports.projects = c_projects;     
                                           

exports.commands = {};       

exports.hasProject = function(target, callback)
{
	c_projects.find({ name: target }, function(err, projects)
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
		c_projects.find({ name: target }, function(err, projects)
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
	require('./commands/' + module).plugin(exports);
})
      