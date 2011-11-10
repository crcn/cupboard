var Structr = require('structr'),
EventEmitter = require('events').EventEmitter;


/**
 * Loads the Project configuration. E.g:
 * [project:beanpoll]
 * extends=some:template
 * 
 * might be expanded to:
 *
 * [project:beanpoll]
 * publish=git commit -m $@, git push origin master;
 * ignore= echo $@ >> .gitignore
 * 
 * The config also might be loaded from the .cupboard file located in the project directory
 */


module.exports = Structr({

	/**
	 */
	
	'__construct': function(project)
	{
		this._project = project;
		this._em = new EventEmitter();
	},
	
	/**
	 */
	
	'load': function(onLoadCallback)
	{
		if(this.loaded) return onLoadCallback(this);
		
		this._em.addListener('loaded', onLoadCallback);
		
		//private load func - does the real thing
		this._load();
	},
	
	/**
	 */
	
	'_load': function()
	{
		
		var config = this._project.doc;
		
		if(config.extends) 
		
		
		this.loaded = true;
		this._em.emit('loaded', onCallback);
	}
});