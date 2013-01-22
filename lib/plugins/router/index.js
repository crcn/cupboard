var beanpoll = require("beanpoll");

exports.plugin = function () {
	return beanpoll.router();
}