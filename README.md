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

- [cupboard.github](http://github.com/spiceapps/cupboard.github)
- [cupboard.scaffold](http://github.com/spiceapps/cupboard.scaffold) 
	
## Basic Usage                                   
                          
For each project you want to use in cupboard, simply call this command in your project directory:
                                            
	cbd init               
	
You can also provide a path:

	cbd init /path/to/project

That'll setup a basic GIT configuration. There are however a few additional options. If you want to add NPM and GIT, just swap in the template like so:

	cbd init --tpl=git+npm
	

## Custom Templates 

Custom templates allow to easily specify a set of custom commands for any given project. Here's an example:


```ini

[template:svn:commands]
publish=svn commit ...
my-custom-command

```


When writing custom templates, or any custom configuration, they should be placed in `~/.cupboard/my_conf/`. The example above might be written to `~/.cupboard/my_conf/svn.conf`. After that, you can start using it:

	cbd init --tpl=svn


## Custom Commands

You can easily specify custom commands for each project. There are few ways to do so:

- Create a `/path/to/project/.cupboard` file. An example might be:

```ini

[commands]
my_custom_command=args

```

-  Modify the project setting under `~/.cupboard/projects.conf`. Like so:

````ini

[project:my-project:commands]
my_custom_commands=args

````

I prefer method one since it's a bit more portable.
                                                                      
                             
## Default Commands           
                  
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


## Default Templates

- `git+npm`
- `git`


## Writing Plugins

- TODO - see [github](http://github.com/spiceapps.com/cupboard.github) plugin for now.



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
	


              

                       




                                    

