Repository management (GIT/NPM) for your projects       


![Alt screenshot](http://i.imgur.com/YWIey.png)    


## Why?                                                     
       
Managing a kajillion repositories is a pain in the ass. 

### Note:

This is a quick (few hours), and rough implementation. It works but the code 'aint pretty. I'll clean it up once I've put more thought into the architecture.

## Features                                
           
- All projects accessible via the `cbd` cli.
- easily identify which projects have been updated. 
- Customizable actions: publish, bump, etc.      
- Push to both npm, and git with one command. 
- Ability to call a command against multiple projects. e.g:
	- `cbd ignore --all node_modules` adds node_modules to all .gitignore files.
	- `cbd open my-app+another-app` opens the given applications in finder.
                                            

## To-Do

- ability to add custom templates e.g: `cbd add-template /path/to/template.conf`
- ability to list available templates
- honor .ignore files
- use directory as default name for program
- ability to set default template
- ability to open project file via `cbd open project-name` vs dir. e.g: opening textmate project
- create projects via cupboard? e.g: xcodeproj, tmproj
- ability to specify global commands.
- ability to point to template
- ability to see list of change
- ability to select specific files to commit
- change publish to commit+publish

## Installation 

	npm install cupboard
                             

## Usage                                   
                          
For each project you want to use in cupboard, simply call this command in your project directory:
                                            
	cbd init               

That command will run you through the basic setup. You can also used pre-defined templates to speed things up. For instance:
    
	cbd init git+npm
	                         
will add basic GIT, and NPM functions to your target project such as `publish`, and `ignore`. For example:

	cbd ignore my-app my/file/to/ignore
	
will append my/file/to/ignore to .gitignore. Here's another example:

 	cbd publish my-app "my commit message"
                   
will call the publish command specified in the template git+npm, which happens to commit, and push my-app to both GIT, and NPM.       



If you want more granular control over your cupboard configurations, just edit the `.cupboard` in your root project directory. A config file looks like this:

````ini
    
[project]
name=project-name


[commands]
publish=my publish commands separated by commas
XXXX=whatever command I want...
open-project=open my-project.tmproj

````                                                                                                        
                             
## Commands           
                  
- `cbd init` - Adds an project to cupboard.
- `cbd list` - Lit all the projects. Also contains details of what projects have been updated.         
- `cbd updates` - List projects with updates.                                                                          
- `cbd publish [PROJ_NAME]` - Publishes given application.                        
- `cbd open [PROJ_NAME]` - Open a project in finder.    
- `cbd dir [PROJ_NAME]` - Returns the directory of the target app.     
- `cbd details [PROJ_NAME]` - show details of given project.
' `cbd untouch [PROJ_NAME]` - sets the given project to "updated"
- `cbd [COMMAND] [PROJ_NAME]` - Custom command given for target application. Some examples:
	- `cbd open-project my-projected` might open the my-project xcode/textmate project.


## Default Template

- `git+npm`
- `git`
- `npm`


## Useful Commands

the following chunk will change the current working directory to the application specified:   

````bash       
cd `cbd dir my-project-name`
````      
            




              

                       




                                    

