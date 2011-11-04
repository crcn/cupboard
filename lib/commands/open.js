var exec = require('child_process').exec;

exports.plugin = function(cupboard)
{
	cupboard.commands.open = function(ops)
	{                                    
		cupboard.loadProjectConfig(ops.project.name, function(configs)
		{
			configs.forEach(function(cfg)
			{                                    
				console.log('opening %s'.grey, cfg.directory);
				
				exec('open ' + cfg.directory);
			})
		})
	}
}