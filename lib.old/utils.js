var ini = require('ini') 
fs = require('fs')

exports.getConfigPath = function(directory)
{
	return directory + '/.cupboard';
}                   

exports.loadConfig = function(configPath)
{
	try
	{                           
		return ini.parse(fs.readFileSync(configPath ,"utf8").replace(/;[^\n]+/g,''));    
		hasFile = true;
	}
	catch(e)
	{                                      
		return null;                 
	} 
}   

