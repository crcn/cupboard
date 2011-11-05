var celeri = require('celeri'),
utils = require('../utils'),
ini = require('ini'),
fs = require('fs');   

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

function setupConfig(template, callback)
{               
	try
	{   
		var tpl = fs.readFileSync(__dirname + '/../templates/' + template + '.conf','utf8');
	}
	catch(e)
	{          
		console.error('Template "%s" does not exist', template.bold);
		return;
	}      
	
	console.log('Using %s template'.grey, template.bold);
	    
	                                  
	
    (tpl.match(/\$\{.*?\}/g) || []).forEach(function(vr)
	{
		var name = vr.replace(/\$\{(.*?)\}/,'$1').replace(/_/g,' ').toLowerCase();
		                    
		celeri.prompt(name+': ', function(value)
		{
			tpl = tpl.replace(vr, value);
		});
	});                                  
	
	
	
	celeri.next(function()
	{           
		this.next();
		              
		var config = ini.parse(tpl);
		
		/*addCommand(config, function()
		{                         
			callback(config);
		});*/

		callback(config);       
		                 
	})            
	     
	celeri.open();
}   
      

exports.plugin = function(cupboard)
{
	cupboard.init = function(template)
	{                         
		if(!template) template = 'default';      
		   
		
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
			setupConfig(template, onConfig);
		}           
	}
}


