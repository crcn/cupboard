var exec = require('../exec')

exports.plugin = function(cupboard)
{
	cupboard.commands.publish = function(ops)
	{                       
		exec(ops.commands.publish, ops, function(err)
		{                                           
			if(!err)
			{                          
				cupboard.projects.update({ name: ops.project.name }, {$set:{ lastPublishedAt: Date.now() }}, function()
				{                  
					// console.log('')
				})
			}
		});
	}
}