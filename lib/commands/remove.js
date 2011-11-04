exports.plugin = function(cupboard)
{
	cupboard.remove = function(target)
	{                           
		     
		cupboard.loadProjectConfig(target, function(configs)
		{                            
			configs.forEach(function(config)
			{
				cupboard.projects.remove({ name: config.project.name }, function(err, removed)
				{                                       
					if(!removed.length) return console.log('The project "%s" does not exist'.red, config.project.name.bold);

					console.log('Removed %s', config.project.name);
				});
			})
		})
		
		
	}
}