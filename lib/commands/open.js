var exec = require('child_process').exec;

exports.plugin = function(cupboard)
{
	cupboard.commands.open = function(ops)
	{
		cupboard.loadProjectConfig(ops.target, function(configs)
		{
			configs.forEach(function(cfg)
			{
				exec('open ' + cfg.directory);
			})
		})
	}
}