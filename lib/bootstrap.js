var beanpole = require('beanpole'),
exec = require('child_process').exec,
fs = require('fs');

//where the data lives explicit to cupboard
process.env.CONF_DIR = process.env.HOME + '/.cupboard';
process.env.MAIN_CFG = process.env.CONF_DIR + '/inc.conf';
process.env.PROJ_DIR = process.env.CONF_DIR + '/projects';



exports.init = function(callback)
{
	function init()
	{
		var router = beanpole.router();

		//load up all the plugins
		router.require(__dirname + '/beans');


		router.pull('load/config', function()
		{
			//initialize once we're ready
			router.push('init', null);

			callback(router);
		});
	}

	//needed ONLY on first time initializing app 
	exec('mkdir -p '+process.env.CONF_DIR+'; mkdir -p '+ process.env.CONF_DIR + '/my_conf' +'; ln -s ' + __dirname + '/../conf/ ' + process.env.CONF_DIR + '/conf;', function()
	{
		fs.stat(process.env.MAIN_CFG, function(err, stat)
		{
			if(err)
			{
				var cfg = "; DO NOT modify this config file - add custom scripts to my_conf/* \n\n";
				cfg += "[include]\n";
				cfg += "files = files = conf/*.conf my_conf/*.conf";
				
				fs.writeFileSync(process.env.MAIN_CFG, cfg);
			}
			
			init();
		})
	});
}