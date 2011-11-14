var Structr = require('structr'),
EventEmitter = require('events').EventEmitter,
spawn = require('child_process').spawn;

/**
 * group of processes
 */

var Script = Structr({
	
	/**
	 */
	
	'__construct': function(processor, script) {
		
		this._processor = processor;
		this._script = script;
		this._em = new EventEmitter();
		this._project = processor.project;
	},
	
	/**
	 */
	
	'execute': function(ops, callback) {
		
		this._em.addListener('complete', callback);
		
		//already running, skip
		if(!!this._proc) return;
		
		
		var self = this,
		script = this._script.replace(/,/g,';').replace(/\$@/g, ops.args.join(' ')),
		project = this._project,
		coloredName = (this._project.name()+':')[this._processor.termColor].bold;
		
		
		//replace "script with passed args"
		for(var param in ops.data) {
			var search = new RegExp('\\\$\{'+param+'\}');
			script = script.replace(search, ops.data[param]);
		}
		
		var proc = this._proc = spawn(__dirname + '/execute', [script], { cwd: project.path() });
		
		
		function log(data) {
			
			data.toString().replace(/[\s\r\n]+$/,'').split(/[\r\n]+/g).forEach(function(msg) {
				
				console.log('%s %s', coloredName, msg);
			});
		}
		
		log('calling: ' + script.bold);
		
		
		proc.stdout.on('data', log);
		proc.stderr.on('data', log);
		proc.on('exit', function(code, signal) {
			self._proc = null;
			
			log('done');
			
			var killed = code !== 0;
			
			self._em.emit('complete', killed ? new Error('killed') : null, !killed ? 1 : null);
			self._em.removeAllListeners('complete');
		});
		
		
		return this;
	},
	
	/**
	 */
	
	'kill': function(onKilled) {
		
		var self = this;
		
		if(!this._proc) return onKilled(this);
		
		
		console.log('killing: %s'.grey, this._script);
		
		this._em.addListener('complete', function() {
			onKilled(self);
		});
		
		this._proc.kill();
		this._proc = null;
	}
	
});



var Processor = module.exports = Structr({

	/**
	 */
	
	'__construct': function(project) {
		this.project = project;
		this._scripts = {};
		this.termColor = Processor.nextTermColor();
	},
	
	/**
	 */
	
	'execute': function(script, ops, callback) {
		var scr = this._scripts[script],
		self = this;
		
		function onReady(scr) {
			scr.execute(ops, callback);
		}
		
		//still running? kill it.
		if(scr) {
			scr.kill(onReady);
		} else {
			onReady(this._scripts[script] = new Script(self, script));
		}
	},
	
	/**
	 */
	
	'static nextTermColor': function() {
		
		if(!this._colors) {
			
			this._colors = ['green','blue','yellow','magenta','cyan','grey'];
			this._curColor = 0;
		}
		
		return this._colors[this._curColor++ % this._colors.length ];
	},
	
	/**
	 * singleton is used because the project model is instantiated each time find is called. 
	 */
	
	'static getInstance': function(project) {
		if(!this._processors) {
			this._processors = {};
		}
		
		return this._processors[project.name()] || (this._processors[project.name()]  = new module.exports(project));
	}
});