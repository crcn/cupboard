var Structr = require('structr'),
EventEmitter = require('events').EventEmitter,
watch_r = require('watch_r'),
_ = require('underscore');
  

module.exports = Structr({
	
	/**
	 */
	 
	'__construct': function(project) {
		
		this._project = project;
		this._em = new EventEmitter();
		
		this._watch();
	},
	 
	/**
	 */
	
	'on': function(event, callback) {
		
		this._em.on(event, callback);
	},
	
	/**
	 */  
	
	'_watch': function() {
		   
		var self = this,
		
		//throttle num changes - could happen rapidly 
		onChange = _.debounce(function()
		{
			self._em.emit('change');
		}, 500);   
		 
		watch_r(this._project.path() , function(err, monitor) {
			 
			monitor.on('change', onChange);
		});
	}
	
});