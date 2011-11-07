var queue = require('./queue'),     
child_process = require('child_process'),  
exec = child_process.exec,
spawn = child_process.spawn;

module.exports = function(command, ops, callback)
{
	var commands = command.split(','),
	error = 0,
	running = commands.length;  
	           
	
	commands.forEach(function(command, index)
	{
		var params = command.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ').split(' '),
		bin = params.shift(),
		self = this;          

		if(params.indexOf('$@') > -1) 
		{            
			params.splice(params.indexOf('$@'), 1, ops.params);
		}                       

		commands[index] = bin + ' ' + params.join(' ');
	});     
	       
	var commands = command.replace(/,/g,';').replace('$@',ops.params.join(' '));
	                  
	console.log('calling: %s'.grey, commands.bold);      
	
	exec(commands, { cwd: ops.directory }, function(err, stdout, stderr)
	{                      
		if(err) return console.error(err.message);
		
		if(stdout.match(/\w/g)) console.log(stdout);
		if(stdout.match(/\w/g)) console.log(stderr); 
		               
		
		if(callback) callback(0);
	})      
	                             
	/*
	
	 
	var commands = command.split(','),
	error = 0,
	running = commands.length;
	
	commands.forEach(queue(function(command)
	{                       
		var params = command.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ').split(' '),
		bin = params.shift(),
		self = this;          

		if(params.indexOf('$@') > -1) 
		{            
			params.splice(params.indexOf('$@'), 1, ops.params);
		}                       

		command = bin + ' ' + params.join(' ');

		console.log('calling "%s"'.grey, command);         
                                       

		//console.log('%s %s', ops.command, )
		var proc = spawn(bin, params, { cwd: ops.directory });

		proc.stdout.on('data', function(data)
		{
			console.log(data.toString());
		});                    

		proc.stderr.on('data', function(data)
		{
			console.log(data.toString());
		});

		proc.on('exit', function(code)
		{                                                       
			self.next();
			if(code > 0) console.error('Command "%s" failed for %s', command.bold, ops.project.name);  

			error = code || error;  

			if(!(--running) && callback) callback(error);
		});
		})); */
}