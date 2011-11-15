Repository management (GIT/NPM) for your projects       


![Alt screenshot](http://i.imgur.com/YWIey.png)    


## Features                                
           
- All projects accessible via the `cbd` cli.
- easily identify which projects have been updated. 
- Customizable actions: publish, bump, etc.      
- Push to both NPM, and GIT with one command. 
- **Install third-party plugins**
- Ability to call a command against multiple projects. e.g:
	- `cbd ignore --all node_modules` adds node_modules to all .gitignore files.
	- `cbd open my-app+another-app` opens the given applications in finder.
                                            
## Requirements

- [Node.js](http://nodejs.org)
- [NPM](http://npmjs.org/)

## Installation 

	npm install cupboard
	
## Plugins

- [Github Plugin](http://github.com/spiceapps/bean.cupboard.github) - basic commands: launch github page, launch github issues page.™
- [Scaffolding Plugin](http://github.com/spiceapps/bean.cupboard.scaffold) - quickly create coffeescript/html5-boilerplate/etc. based projects. 
- [Growl Plugin](http://github.com/spiceapps/bean.notify.growl) - get notified when commands are executed - useful for watching projects.
	
## Basic Usage                                   
                          
For each project you want to use in cupboard, simply call this command in your project directory:
                                            
	cbd init               
	
You can also provide a path:

	cbd init /path/to/project

That'll setup a basic GIT configuration. There are however a few additional options. If you want to add NPM and GIT, just swap in the template like so:

	cbd init --tpl=git+npm
	

## Templates 

templates allow to easily specify a set of custom commands for any given project. Here's an example:


```ini

[template:svn:commands]
publish=svn commit ...
my-custom-command

```


When writing custom templates, or any custom configuration, they should be placed in `~/.cupboard/my_conf/`. The example above might be written to `~/.cupboard/my_conf/svn.conf`. After that, you can start using it:

	cbd init --tpl=svn
	
### Default

The following templates come with cupboard:

- `git+npm`
- `git`



## Commands

You can specify custom commands for each project. There are few ways to do so. The first option would be to create a `/path/to/project/.cupboard` file. An example might be:

```ini
[commands]
my_custom_command=args
```

The other option is to modify the project setting under `~/.cupboard/projects.conf`. Like so:

````ini
[project:my-project:commands]
my_custom_commands=args
````                                                                  
                             
### Default           
                  
- `cbd init` - Adds an project to cupboard.
- `cbd list` - Lit all the projects. Also contains details of what projects have been updated.         
- `cbd updates` - List projects with updates.                                                                          
- `cbd publish <proj>` - Publishes given application.          
- `cbd install <plugin>` - Installs a cupboard plugin.
- `cbd uninstall <plugin>` - Uninstalls a cupboard plugin.
- `cbd plugins` - Lists third-party plugins.
- `cbd dir <proj>` - Returns the directory of the target app.     
- `cbd details <proj>` - show details of given project.
' `cbd untouch <proj>` - sets the given project to "updated"
- `cbd <cmd> <proj>` - Custom command given for target application. Some examples:
	- `cbd open-project my-projected` might open the my-project xcode/textmate project.

### Watching Projects

You can easily watch any project, and invoke commands on change by adding `--watch`. Here's an example:

	cbd make --all --watch  
	
Another valid command is:

	cbd some-command cupboard+celeri --watch
	
That command will watch projects cupboard, and celeri, and invoke `some-command` on any change. 

In some cases, you may want to ignore certain directories from triggering `--watch`. You can easily do that by adding a `.ignorewatch` file. 


## API

### cupboard.getProjects(projects, callback)

Returns all the projects registered in cupboard.

- `projects` - can be a string, or an array of projects. String can also be `--all`, or `project+another-project`.

````javascript

var cupboard = require('cupboard');

cupboard.getProjects('bonsai', function(err, projects) {
	
	projects.forEach(function(project) {
		
		console.log('Listing %s changes:', project.name());
		
		//return list of changed files for given project
		project.getUpdatedFiles(function(err, files) {
			
			
		});
	});
});
````

### Project.name()

Returns the name of the given project.

### Project.path()

Returns the symlink path of the given project.

### Project.get(property)

Returns a property specified in the `projects.conf` file under the given project.

### Project.untouch()

"Untouches" project so no changes will be listed.

### Project.watch():FileWatcher
 
Watches file for any file changes.

### Project.loadConfig(callback)

Loads all configuration settings for given project, including all target specific commands. 

### Project.execute(ops, callback)

Executes a command against the given project. 

- `ops`
	- `command` - Command to execute against the project.
	- `args` - Arguments to pass onto given command.

### Project.getScript(command, callback)

Returns script assigned to command

### FileWatcher.on(event, callback)

- `event`
    - `change` - file changed
	- `add` - file added
	- `remove` - file removed
	
#### An example:

In the `.cupboard` file located in `path/to/my-project`:

````ini

[commands]
say-hello=echo Hello $@

````

In your node.js script:

````javascript

cupboard.getProjects('my-project', function(err, projects) {
	
	var myProject = projects[0];
	
	
	myProject.execute({ command: 'say-hello' args: ['Craig'] }); //terminal print "Hello Craig!"
	myProject.execute({ command: 'publish', args: ['Some commit message']})
});

````

## Writing Plugins

- TODO - see [github](http://github.com/spiceapps/cupboard.github) plugin for now.



## Useful tricks

Easily change to the directory of any project:

````bash
cd `cbd dir my-project`
````

Invoke a command against all project directories:

````bash
for DIR in `cbd dir --all`; 
	echo $DIR; # do stuff here
done;
````

Assuming you have `make`, and `start` specified in your project commands, you can easily start your project, and restart it whenever it's changed:

```bash
cbd make+start my-project --watch
```

	


              

                       




                                    

