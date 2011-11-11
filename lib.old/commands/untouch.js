var exec = require('../exec')

exports.plugin = function(cupboard)
{
	cupboard.commands.untouch = function(ops)
	{                       
		console.log('Untouched %s'.grey, ops.project.name.bold);
		
		cupboard.projects.update({ name: ops.project.name }, {$set:{ lastPublishedAt: Date.now() }}, function()
		{                  
			// console.log('')
		})
	}
}