var gumbo = require('gumbo'),

c_projects = gumbo.db({
	persist: {
		fs: process.env.ETC_DIR + '/data/conf'
	}
}).collection({
	name: 'projects',
	model: require(__dirname + '/model')
});


//expose the project model only
module.exports = c_projects.model;