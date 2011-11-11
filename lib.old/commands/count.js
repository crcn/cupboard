var fs = require('fs'),
celeri = require('celeri');

exports.plugin = function(cupboard)
{
	cupboard.count = function()
	{                                  
		cupboard.projects.all(function(err, projects)
		{
			console.log(projects.length);
		});
	}
}