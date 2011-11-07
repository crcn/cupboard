var celeri = require('celeri');

exports.plugin = function(cupboard)
{
	function drawTable(table)
	{
		celeri.drawTable(table, {
		    columns: [
			{
				width: 50,
				name: 'command'
			},
			{
				name: 'desc',
				width: 50
			}
			],
			
			ellipsis: true,
		    horz: ''

		});
	}
	
	cupboard.commands.help = cupboard.commands["--help"] = cupboard.commands["-help"] = cupboard.commands["-h"] = function()
	{
		
		
		
		var helpItems = [

		    {
		        command: 'help',
				desc: 'Shows the help menu.'
		    },
			{
		        command: 'init',
				desc: 'Adds a project in cwd to cupboard.'
		    },
			{
				command: 'list',
				desc: 'List all projects in cupboard organized by most recently updated.'
			},
			{
				command: 'updates',
				desc: 'List all projects with updates.'
			},
			{
				command: 'publish <proj>',
				desc: 'Calls publish command provided by project.'
			},
			{
				command: 'open <proj>',
				desc: 'Opens project in finder.'
			},
			{
				command: 'dir <proj>',
				desc: 'Returns the project path.'
			},
			{
				command: 'details <proj>',
				desc: 'Returns details about the given project such as modified files, and number of updates.'
			},
			{
				command: '<cmd> <proj>',
				desc: 'Calls custom command in .cupboard script in target project directory.'
			}

		];
		
		
		
		var special = [
			{
				command: '<cmd> --all',
				desc: 'Invokes given command on *all* projects in cupboard.'
			},
			{
				command: '<cmd> <proj>+<proj2>+...',
				desc: 'Invokes given command on specified projects.'
			}
		];
		
		var examples = [
			{
				command: 'cd `cbd dir <proj>`',
				desc: 'Changes the current working directory to given project.'
			},
			{
				command: 'cbd ignore --all npm_modules',
				desc: 'appends npm_modules to .gitignore in all projects (must be specified in .cupboard script)'
			},
			{
				command: 'cbd github cupboard+celeri+bonsai',
				desc: 'Calls github command in .cupboard script specified in the projects cupboard, celeri, and bonsai. Opens them in default browser (Safari/Firefix/etc.).'
			}
		];
		
		console.log('\nCommands:'.bold);
		
		drawTable(helpItems);
		
		
		console.log('\nSpecial flags:'.bold);
		
		drawTable(special);
		
		console.log('\nExamples:'.bold);
		
		drawTable(examples);
		
		
		console.log('\n');
	}
}