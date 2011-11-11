module.exports = function(logs, color)
{
	if(!(logs instanceof Array)) logs = [logs];
	
	
	logs.forEach(function(log)
	{
		
		//convert markdown-style string to output
		var msg = log.message.replace(/\*\*([^\*]+)\*\*/g,'$1'.bold);
		
		//italics -- to do
		// replace(/\*(\w+)\*/g,'$1'.italic)
		
		
		//colorize, and print
		console.log(color ? msg[color] : msg);
	});
}