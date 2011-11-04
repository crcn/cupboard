var queue = [],
running = false;
                   

function next()
{   
	if(!queue.length)
	{
		running = false;
		return;
	}             
	
	queue.shift()();
}

module.exports = function(callback)
{
	return function()
	{                       
		var args = arguments;  
		      
		queue.push(function()
		{
			callback.apply({
				next: next
			}, args);
		})
		
		if(!running)
		{          
			running = true;
			next();
		}
	};            
}