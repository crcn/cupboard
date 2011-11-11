exports.plugin = function(cupboard)
{
	var templateDirs = [ __dirname + '/../templates', process.env.DATA_DIR + '/templates' ];
	
	cupboard.loadTemplate = function(name)
	{
		
	}
	
	cupboard.listTemplates = function()
	{
		
	}
	
	cupboard.addTemplate = function(source, name)
	{
	}
}