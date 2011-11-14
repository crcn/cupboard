var ProjectConfig = require('./config'),
getUpdatedFiles = require('./getUpdatesFiles'),
fs = require('fs'),
exec = require('./exec'),
gumbo = require('gumbo'),
FileWatcher = require('./watcher');



exports.init = function(config) {
	
	//model part for projects
	var ModelPartial = {
		
		/**
		 */
		
		'override __construct': function() {
			
			this._super.apply(this, arguments);
			
			this.globalConfig = config;
		},

		/**
		 * loads the project configuration
		 */

		'loadConfig': function(onLoadCallback) {
		
			if(!this._config) this._config = new ProjectConfig(this);

			this._config.load(onLoadCallback);
		},
		
		/**
		 */
		
		'getScript': function(cmd, callback) {
			var self = this;
			this.loadConfig(function(cfg)
			{
				var script = (cfg.data.commands || { })[cmd];
				callback(script ? null : new Error('Script does not exist'), script);
			});
		},


		/**
		 */

		'getUpdatedFiles': function(callback) {
			
			var ret = this._updatedFiles || (this._updatedFiles = getUpdatedFiles(this.path(), this.get('lastPublishedAt')));
			
			//temporary until async is available
			if(callback) return callback(false, ret);
			
			return ret;
		},

		/**
		 * invokes a command against the given project - must be specified in config
		 */

		'execute': function(ops, callback) {
			
			var self = this;

			this.loadConfig(function(config) {
				
				var script = (config.data.commands || { })[ops.command];
				
				if(!script) {
					
					console.error('Command "%s" does not exist', ops.command.bold);
					return;
				}
				
				var execOps = {
					args: ops.args,
					cwd: self.path()
				}
				
				exec(script, execOps, callback);
			});
		},

		/**
		 * updates the "lastPublishedAt"
		 */ 

		'untouch': function() {
			
			this.set('lastPublishedAt', Date.now());
			this.save();
		},

		/**
		 * watches project for any changes
		 */
		
		'watch': function() {
			
			return this._watcher || (this._watcher = new FileWatcher(this));
		},

		/**
		 */

		'name': function() {
			
			return this.get('_id').split(':').pop();
		},

		/**
		 */

		'path': function() {
			
			return Project.getPath(this.name());
		},

		/**
		 */

		'static getId': function(name) {
			
			return 'project:' + name;
		},

		/**
		 */

		'static getPath': function(name) {
			
			return process.env.PROJ_DIR + (name ? '/' + name : '');
		},

		/**
		 */

		'static getQuery': function(queryOrName) {
			var query;

			if(typeof queryOrName == 'string') {
				
				if(queryOrName == '--all' || queryOrName == 'all-projects') {
					
					search = { path: { $ne: null } }; //all
				} else {
					
					query = { _id: { $in: (queryOrName || '').replace(/([^+]+)/g,this.getId('$1')).split('+') } };
				}
			}
			else {
				query = queryOrName;
			}

			return query;
		},

		/**
		 */

		'override find': function(queryOrName, callback) {
			
			this._super(this.getQuery(queryOrName), callback);
		},

		/**
		 */

		'override findOne': function(queryOrName, callback) {
			
			this._super(this.getQuery(queryOrName), callback);
		},

		/**
		 */

		'static exists': function(queryOrName, callback) {
			
			this.findOne(queryOrName, function(err, result)
			{
				callback(err, !!result);
			});
		}
	};

	var Project = gumbo.db({
		persist: {
			ini: process.env.CONF_DIR
		}
	}).collection({
		name: 'projects',
		model: ModelPartial,
		file: 'projects.conf'
	}).model;
	
	return Project;
}



