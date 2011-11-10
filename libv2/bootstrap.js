var beanpole = require('beanpole'),
router = exports.router = beanpole.router();

//where the data lives explicit to cupboard
process.env.ETC_DIR = '/usr/local/etc/cupboard';

//load up all the plugins
router.require(__dirname + '/beans');


//initialize once we're ready
router.push('init');
