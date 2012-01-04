exec = require('child_process').exec,
fs = require('fs');

require('./config');

//needed ONLY on first time initializing app 
exec('mkdir -p '+process.env.CONF_DIR+'; mkdir -p '+ process.env.CONF_DIR + '/my_conf' +'; ln -s ' + __dirname + '/../conf/ ' + process.env.CONF_DIR + '/conf;', function() {
	
	fs.stat(process.env.MAIN_CFG, function(err, stat) {
		
		if(err) {

			var cfg = "; DO NOT modify this config file - add custom scripts to my_conf/* \
			[include] \
			files = files = conf/*.conf my_conf/*.conf \
			\
			[core] \
			projects_directory = ./projects \
			";
			
			
			fs.writeFileSync(process.env.MAIN_CFG, cfg);
		}
	})
});