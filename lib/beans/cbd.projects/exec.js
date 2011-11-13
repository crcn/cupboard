var child_process = require('child_process'),  
exec = child_process.exec,
spawn = child_process.spawn;

module.exports = function(command, ops, callback) {
	var commands = command.split(','),
	error = 0,
	running = commands.length;  
	           
	
	commands.forEach(function(command, index) {
		
		var args = command.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ').split(' '),
		bin = args.shift(),
		self = this;          

		if(args.indexOf('$@') > -1)  {
			            
			args.splice(args.indexOf('$@'), 1, ops.args);
		}                       

		commands[index] = bin + ' ' + args.join(' ');
	});     
	       
	var commands = command.replace(/,/g,';').replace('$@',ops.args.join(' '));
	                  
	console.log('calling: %s'.grey, commands.bold);      
	
	exec(commands, { cwd: ops.cwd }, function(err, stdout, stderr) {
		                      
		if(err) return console.error(err.message);
		
		if(stdout.match(/\w/g)) console.log(stdout);
		if(stdout.match(/\w/g)) console.log(stderr); 
		               
		if(callback) callback(0);
	});
}