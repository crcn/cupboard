var spawn = require('child_process').spawn,
vine = require('vine');

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function() {
			
			var colors = ['green','blue','yellow','magenta','cyan','grey'],
			count = 0,
			running = {},
			assignedColors = {};
			
			return {
				name: 'start',
				execute: function(data, callback) {
					var project = this,
					name = project.name();
					
					if(running[name]) running[name].kill();
					
					this.getScript('start', function(err, script)
					{
						if(err) return console.log('Cannot start "%s"'.red, project.name().bold);
						
						var args = script.split(' '),
						bin = args.shift();
						
						var proc = running[name] = spawn(bin, args, { cwd: project.path() }),
						color = colors[count++ % colors.length],
						coloredName = assignedColors[name] = assignedColors[name] || name[color].bold.underline; 
						
						function log(data)
						{
							data.toString().replace(/[\s\r\n]+$/,'').split(/[\r\n]+/g).forEach(function(msg)
							{
								console.log('%s: %s', coloredName, msg);
							})
						}
						
						proc.stdout.on('data', log);
						proc.stderr.on('data', log);
						
						proc.on('exit', function(exit)
						{
						});
						
						
						callback();
					})
				}
			}
		},
		
		/**
		 */

		'pull -multi help/item': function() {
			return {
				commands: [ {
				        command: 'start <proj>',
						desc: 'Starts target project.'
				    } ]
			};
		}
	});
}