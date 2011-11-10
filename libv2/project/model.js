var ProjectConfig = require('./config')

//model part for projects
module.exports = {
	
	/**
	 * loads the project configuration
	 */
	
	'loadConfig': function(onLoadCallback)
	{
		if(!this._config) this._config = new ProjectConfig(this);
		
		this._config.load(onLoadCallback);
	},
	
	/**
	 */
	
	'static getQuery': function(queryOrName)
	{
		var query;
		
		if(typeof queryOrName == 'string')
		{
			if(queryOrName == '--all')
			{
				search = { name: { $ne: null } }; //all
			}                     
			else
			{
				query = { name: { $in: (queryOrName || '').split('+') } };
			}
		}
		else
		{
			query = queryOrName;
		}
		
		return query;
	},
	
	/**
	 */
	
	'override find': function(queryOrName, callback)
	{
		this._super(this.getQuery(queryOrName), callback);
	},
	
	/**
	 */
	
	'override findOne': function(queryOrName, callback)
	{
		this._super(this.getQuery(queryOrName), callback);
	},
	
	/**
	 */
	
	'static exists': function(queryOrName, callback)
	{
		this.findOne(queryOrName, function(err, result)
		{
			callback(err, !!result);
		});
	}
};