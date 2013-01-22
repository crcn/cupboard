var findit = require('findit'),
celeri = require('celeri'),
vine = require('vine'),
relativeDate = require('relative-date'),
_ = require('underscore'),
async = require("async");

/**
 * lists all projects within cupboard
 */

exports.require = ["router"];
exports.plugin = function(router) {
	
	
	
	router.on({
	
		/**
		 */
		
		'pull projects/all-projects -> command/execute/list': function(req, res, mw) {

			function next() {

				
				if(!mw.next()) {



					vine.result(req.projects).end(res);
					
					var rows = [];
					
					req.projects.forEach(function(project) {
						
						lastPublishedAt = project.get('lastPublishedAt');
						
						var name = project.name();
						
						// if(project.__updatedFiles.length) name = name.green;
						
						rows.push({
							name: name,
							hasUpdates: project.__updatedFiles.length ? project.__updatedFiles.length + ' updates' : ' ',
							published: 'published: ' + (lastPublishedAt ? relativeDate(lastPublishedAt) : 'never')
						});
						
					});
					
					celeri.drawTable(rows, {
						columns: [{
							minWidth: 25,
							width: 10, 
							name: 'name'
						},
						{
							name: 'hasUpdates',
							width: 10,
						},
						{
							name: 'published',
							width:10,
							minWidth: 30,
							align: 'left'
						}/*,
						{
							name: 'padding',
							width: 10
						}*/],
						
						ellipsis: true
					});
				}
			}

			var i = req.projects.length;


			async.forEach(req.projects, function(project, next) {
				project.getUpdatedFiles(function(err, files) {
					project.__updatedFiles = files || [];
					next();
				});
			}, next);
			
			
		},
		
		/**
		 */
		
		'pull command/execute/list -> command/execute/updates': function(req, res, mw) {
			
			//filter out only projects that have been updated
			req.projects = _.filter(req.projects, function(a)
			{
				return a.__updatedFiles.length;
			});
			
			if(!mw.next())
			{
				var rows = [];
				
				
				req.projects.forEach(function(project) {
					rows.push({
						name: project.name(),
						updates: project.__updatedFiles.length + ' updates'
					})
				});
				
				celeri.drawTable(rows, {
					columns: {
						name: {
							width: 20,
							minWidth: 20
						},
						updates: 80
					}
				})
				
				vine.result(req.projects).end(res);
			}
		},
		
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			res.end({
				commands: [ {
						command: 'updates',
						desc: 'List all projects with updates'
					},
					{
						command: 'list',
						desc: 'List all projects'
					} ]
			});
		}
	});
}