var Structr = require('structr'),
EventEmitter = require('events').EventEmitter,
spawn = require('child_process').spawn,
exec = require('child_process').exec;

/**
 * group of processes
 */

var Script = Structr({

	/**
	 */

	'__construct': function(processor, script, ops) {

		this._processor = processor;
		this._script = script;
		this._em = new EventEmitter();
		this._project = processor.project;
		this._router = this._project.router;

		this.coloredName = (this._project.name()+':')[Processor.nextTermColor()].bold;
	},

	/**
	 */

	'_log': function(data) {
		data = data.toString();

		var pid = data.match(/CHILD-PID\:(\d+)/),
		self = this;

		if(pid) {
			self._cpid = Number(pid[1]);
			return;
		}


		data.replace(/[\s\r\n]+$/,'').split(/[\r\n]+/g).forEach(function(msg) {

			console.log('%s %s', self.coloredName, msg);
		});
	},

	/**
	 */

	'execute': function(ops, callback) {

		this._em.addListener('complete', callback);

		//already running, skip
		if(!!this._proc) return;


		var self = this,
		script = this._script.replace(/,/g,';').replace(/\$@/g, ops.args.join(' ')),
		project = this._project;


		//replace "script with passed args"
		for(var param in ops.data) {
			var search = new RegExp('\\\$\{'+param+'\}');
			script = script.replace(search, ops.data[param]);
		}


		var proc = this._proc = spawn(__dirname + '/execute', [script], { cwd: project.path() });


		function log(data) {
			self._log(data);
		}

		log(script.bold);


		//send user notification if installed ~ growl
		// this._router.push('user/notification', { message: ops.command + " " + this._project.name() });


		proc.stdout.on('data', log);
		proc.stderr.on('data', log);
		proc.on('exit', function(code, signal) {
			self._proc = null;

			// log('done');

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

		//self._log('killing: '+ this._script.bold);

		this._em.addListener('complete', function() {
			onKilled(self);
		});


		process.kill(this._cpid, 'SIGKILL');
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
			onReady(this._scripts[script] = new Script(self, script, ops));
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