var findit = require('findit'),
relativeDate = require('relative-date'),
exec = require('child_process').exec,
fs = require('fs'),
_ = require('underscore'),
ini = require('ini');


function getIgnore(path, file) {
	try {
		return fs.readFileSync(path + "/" + file, "utf8").split(/\n+/g);
	} catch(e) {
		return [];
	}
}

function getCbdIgnore(path) {

	try {
		var cfg = ini.parse(fs.readFileSync(path + "/.cupboard", "utf8"));

		return cfg.ignore ? Object.keys(cfg.ignore) : [];
	} catch(e) {
		return [];
	}

	return [];	
}

module.exports = function(path, sinceDate, callback) {
	
	if(!sinceDate) sinceDate = 0;
	
	var updatedFiles = [],
	count = 0;
	

	var ignore = getIgnore(path, '.gitignore').concat(getCbdIgnore(path)).filter(function(search) {
		return search.match(/\w+/);
	})

	ignore = _.map(ignore, function(search) {
		return new RegExp('(^|[^\\w])' + search + '([^\\w]|$)');
	})


	
	exec(__dirname + '/mostRecent ' + Math.round(sinceDate/1000) + ' ' + path, { cwd: path }, function(err, stdout) {
		
		if(err) return callback(err);
		
		var files = [];
		
		stdout.split(/[\n\r]+/g).forEach(function(file) {


			var intersect = ignore.filter(function(search) {
				return search.test(file);
			});


			if(!file.match(/\w+/g) || file.match(/\/(node_modules|\.)/) || intersect.length) return;
			
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