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
						
						//add onto version
						if(version.substr(0,1) == '+')
						{
							version = version.substr(1).split('.');
							var oldVersion = pkg.version.split('.'),
							newVersion = new Array(oldVersion.length);
							
							for(var i = version.length; i--;)
							{
								newVersion[i] = Number(oldVersion[i]) + Number(version[i]);
							}
							
							version = newVersion.join('.');
						}
						
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
					desc:'Sets the project version' 
				}
			};
		}
	})
}