var celeri = require('celeri'),
utils = require('../utils'),
ini = require('ini');   

function addCommand(config, callback)
{
	celeri.confirm("Add a custom command?", function(yes)
	{   
		if(!yes) return callback(); 
		
		var name, command;
		
		celeri.prompt("Name: ", function(n)
		{            
			name = n;
		}).
		prompt("Command: ", function(command)
		{               
			config.commands[name] = command;   
			
			addCommand(config, callback);
		});

	});
}

function setupConfig(callback)
{           
	var config = {
		project:{
			name: null
		},
		commands:{
			publish: null
		}
	};
	    
	
	celeri.prompt("Project name: ", function(name)
	{
		config.project.name = name;
	}).
	prompt("Publish command: ", function(name)
	{                      
		config.commands.publish = name;
	});
	
	addCommand(config, function()
	{
		callback(config); 
	});  
	     
	celeri.open();
}   
      

exports.plugin = function(cupboard)
{
	cupboard.init = function()
	{            

		var hasFile = false,  
		projectDirectory = process.cwd(),
		configPath = utils.getConfigPath(projectDirectory),      
		config = utils.loadConfig(configPath);      



		function onSave(config)
		{
			if(!hasFile)
			{
				fs.writeFileSync(configPath, ini.stringify(config)); 
				console.log('Wrote %s config to %s'.grey, config.project.name, configPath);        
			}

			console.log('Added %s'.green, config.project.name.bold);
		}            


		function onConfig(config)
		{                       
			var toInsert = {    
				name: config.project.name,  
				directory: projectDirectory
			};

			cupboard.projects.insert(toInsert, function(err, result)
			{                        
				if(err) return console.error("The project \"%s\" already exists".red, toInsert.name.bold);  

				onSave(config)
			}); 
		}

		if(config)
		{
			onConfig(config);
		}
		else
		{
			setupConfig(onConfig);
		}           
	}
}


