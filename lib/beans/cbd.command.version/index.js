/**
 * returns the directoy of the target project. Function is similar to `pwd`
 */

var vine = require('vine'),
fs = require('fs');

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			return {
				name: 'version',
				execute: function(data, callback)
				{
					var version = data.args[0];
					
					var pkgPath = this.path()+'/package.json';
					var pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));
					
					
					if(version) 
					{
						pkg.version = version;
						fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4));
					}
					
					
						console.log(pkg.version);
					
					
					callback();
				}
			};
		},
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: {
					command: 'version <proj> <vers>',
					desc:'Sets the project version.' 
				}
			};
		}
	})
}