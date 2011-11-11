var fs = require('fs'),
celeri = require('celeri');

exports.plugin = function(cupboard)
{
	cupboard.commands.bump = function(ops)
	{                                  
		var pkgPath = ops.directory + '/package.json';   
		
		try
		{
			var pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));
			
			//console.log(pkg);
		}
		catch(e)
		{
			
		}
	}
}