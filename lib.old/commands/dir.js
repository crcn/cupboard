exports.plugin = function(cupboard)
{                                         
	
	//useful in this case:     
	//cd `cupboard dir celeri`
	cupboard.commands.dir = function(ops)
	{                       
		cupboard.projects.find({ name: ops.project.name }, function(err, projects)
		{                                                                  
			projects.forEach(function(project)
			{                                
				console.log(project.directory);
			});
		});
	}
}