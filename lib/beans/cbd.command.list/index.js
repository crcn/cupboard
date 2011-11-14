var findit = require('findit'),
celeri = require('celeri'),
vine = require('vine'),
relativeDate = require('relative-date'),
_ = require('underscore');


/**
 * lists all projects within cupboard
 */

exports.plugin = function(router) {
	
	function drawProjects(projects) {
		var tree = {};
		
		projects.forEach(function(project) {
			var name = project.name(),
			updated = project.getUpdatedFiles(),
			lastPublishedAt = project.get('lastPublishedAt');
			
			if(updated.count) name = name.green;
			
			tree[name] = {
				'last modified': updated.files.length ? relativeDate(updated.files[0].mtime) : 'unknown'.red,
				'last published': lastPublishedAt ? relativeDate(lastPublishedAt) : 'never'.red
			}
		});
		
		celeri.drawTree(tree);
	}
	
	
	router.on({
	
		/**
		 */
		
		'pull projects/all-projects -> command/execute/list': function(request) {
			
			//re-order projects based on what has been updated
			request.projects.sort(function(a, b) {
				
				return a.getUpdatedFiles().count > b.getUpdatedFiles().count ? -1 : 1;
			});
			
			if(!request.next()) {
				
				drawProjects(request.projects);
				vine.result(request.projects).end(request);
			}
		},
		
		/**
		 */
		
		'pull command/execute/list -> command/execute/updates': function(request) {
			
			//filter out only projects that have been updated
			request.projects = _.filter(request.projects, function(a)
			{
				return !!a.getUpdatedFiles().count;
			});
			
			if(!request.next())
			{
				drawProjects(request.projects);
				
				vine.result(request.projects).end(request);
			}
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function() {
			return {
				commands: [ {
						command: 'updates',
						desc: 'List all projects with updates.'
					},
					{
						command: 'list',
						desc: 'List all projects in cupboard organized by most recently updated.'
					} ]
			};
		}
	});
}