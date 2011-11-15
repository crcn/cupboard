var findit = require('findit'),
relativeDate = require('relative-date'),
exec = require('child_process').exec,
fs = require('fs');

module.exports = function(path, sinceDate, callback) {
	
	if(!sinceDate) sinceDate = 0;
	
	var updatedFiles = [],
	count = 0;
	
	exec(__dirname + '/mostRecent ' + Math.round(sinceDate/1000) + ' ' + path, { cwd: path }, function(err, stdout) {
		
		if(err) return callback(err);
		
		var files = [];
		
		stdout.split(/[\n\r]+/g).forEach(function(file) {
			
			
			if(!file.match(/\w+/g) || file.match(/\/(node_modules|\.)/)) return;
			
			file = file.substr(2);
			 
			var stat = fs.statSync(path+'/'+file);
			
			if(stat.isDirectory()) return;
			
			files.push({
				path: file.substr(),
				mtime: stat.mtime,
				datediff: stat.mtime - sinceDate
			});
			
			
		})
		
		files.sort(function(a, b) {

			return a.mtime > b.mtime ? -1 : 1;
		})
		
		callback(err, files);
	});
}