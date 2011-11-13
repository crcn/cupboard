var Structr = require('structr'),
EventEmitter = require('events').EventEmitter,
fs = require('fs'),
ini = require('ini');


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
	
	'__construct': function(project) {
		
		this._project = project;
		this._em = new EventEmitter();
	},
	
	/**
	 */
	
	'load': function(onLoadCallback) {
		
		if(this.loaded) return onLoadCallback(this);
		
		this._em.addListener('loaded', onLoadCallback);
		
		//private load func - does the real thing
		this._load();
	},
	
	/**
	 */
	
	'_load': function() {
		
		var config = Structr.copy(this._project.doc);
		
		
		//fetch from the global configuration first
		Structr.copy(this._project.globalConfig.get(config.tpl || '') || {}, config);
		
		try {
			
			//THEN check locally against the project ~ .cupboard file 
			Structr.copy(ini.parse(fs.readFileSync(this._project.path() + '/.cupboard', 'utf8')), config);
		} catch(e) {
			
		}
		
		this.data = config;
		
		this.loaded = true;
		this._em.emit('loaded', this);
	}
});