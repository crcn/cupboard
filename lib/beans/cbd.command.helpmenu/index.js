var celeri = require('celeri');

exports.plugin = function(router) {
	
	var helpMenu = {};
	
	function displayHelp() {
		
		for(var i = 0, n = arguments.length; i < n; i++) {
		
			var category = arguments[i];
			
			if(!helpMenu[category.name]) continue;
			
			
			console.log("\n%s:".bold, category.label);
			
			
			celeri.drawTable(helpMenu[category.name], {
			    columns: [ {
					minWidth: 30,
					width:20,
					name: 'command'
				},
				{
					name: 'desc',
					width: 80,
					align: 'left'
				} ],

				ellipsis: true,
			    horz: '',
			
				pad: {
					left: 9,
					right: 0
				}

			});
		}
		
		console.log("");
	}
	
	
	router.on({
		
		
		/**
		 */
		
		'push init': function() {

			router.on('push -collect help/item', function(help) {

				for(var category in help) {
					
					if(!helpMenu[category]) helpMenu[category] = [];
					
					var items = help[category];
					
					if(!(items instanceof Array)) items = [items];
					
					helpMenu[category] = helpMenu[category].concat(items);
					
					
				}
			});
		},
		
		/**
		 */
		
		'pull command/execute/help': function(req, res) {
			
			displayHelp({
				name: 'commands', 
				label: 'Commands'
			},
			{
				name: 'flags',
				label: 'Special Flags'
			},
			{
				name: 'examples',
				label: 'Examples'
			});

			res.end();
		},
		
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			res.end({
				commands: {
					command: 'help',
					desc:'Shows the help menu.' 
				}
			});
		}
	})
}