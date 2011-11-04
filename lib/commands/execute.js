var exec = require('../exec');

exports.plugin = function(cupboard)
{   

	cupboard.execute = function(ops, callback) 
	{
		function onConfig(config)
		{                                
                                                 
			config.params = ops.params;
			
			var command = config.commands[ops.command]; 

			if(cupboard.commands[ops.command])
			{
				cupboard.commands[ops.command](config);
			}
			else
			if(command)
			{
				exec(command, config)
			}     
			else
			{     
				console.error('Command "%s" does not exist'.red, ops.command.bold);
			}  
		}    
         
		cupboard.loadProjectConfig(ops.target, function(configs)
		{                            
			configs.forEach(onConfig);
		});    
	}

	
}                
