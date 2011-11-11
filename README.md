Repository management (GIT/NPM) for your projects       


![Alt screenshot](http://i.imgur.com/YWIey.png)    



## Why?                                                     
       
Managing a kajillion repositories is a pain in the ass. 

## Features                                
           
- All projects accessible via the `cbd` cli.
- easily identify which projects have been updated. 
- Customizable actions: publish, bump, etc.      
- Push to both NPM, and GIT with one command. 
- Ability to call a command against multiple projects. e.g:
	- `cbd ignore --all node_modules` adds node_modules to all .gitignore files.
	- `cbd open my-app+another-app` opens the given applications in finder.
                                            
## Requirements

- [Node.js](http://nodejs.org)
- [NPM](http://npmjs.org/)

## Installation 

	npm install cupboard
	
## Basic Usage                                   
                          
For each project you want to use in cupboard, simply call this command in your project directory:
                                            
	cbd init               

	                         
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
                             
## Default Commands           
                  
- `cbd init` - Adds an project to cupboard.
- `cbd list` - Lit all the projects. Also contains details of what projects have been updated.         
- `cbd updates` - List projects with updates.                                                                          
- `cbd publish <proj>` - Publishes given application.                        
- `cbd open <proj>` - Open a project in finder.    
- `cbd dir <proj>` - Returns the directory of the target app.     
- `cbd details <proj>` - show details of given project.
' `cbd untouch <proj>` - sets the given project to "updated"
- `cbd <cmd> <proj>` - Custom command given for target application. Some examples:
	- `cbd open-project my-projected` might open the my-project xcode/textmate project.


## Default Template

- `git+npm`
- `git`


## Useful Commands

the following chunk will change the current working directory to the application specified:   

````bash       
cd `cbd dir my-project-name`
````      
            




              

                       




                                    

