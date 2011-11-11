var findit = require('findit'),
relativeDate = require('relative-date');

module.exports = function(path, sinceDate)
{
	if(!sinceDate) sinceDate = 0;
	
	var updatedFiles = [],
	count = 0;
	
	findit.findSync(path, function(file, stats)
	{
		var relativePath = file.replace(path,'').substr(1);                    

		//no hidden files, no node modules
		if(relativePath.match(/\.[^\/]+\//g) || relativePath.indexOf('node_modules') > -1 || stats.isDirectory()) return; 

		try
		{
			var mtime = stats.mtime.getTime(),
			datediff = mtime - sinceDate;
			
			if(datediff > 0) count++;
			
			updatedFiles.push({
				path: relativePath || file,
				mtime: mtime,
				datediff: datediff
			}); 
		}
		catch(e)
		{
		}
	});
	
	
	
	updatedFiles.sort(function(a, b)
	{
		return a.mtime > b.mtime ? -1 : 1;
	})
	
	return {
		count: count,
		files: updatedFiles
	};
}