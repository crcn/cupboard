Repository management (GIT/NPM) for your projects       


![Alt screenshot](http://i.imgur.com/YWIey.png)    


## Why?                                                     
       
Managing a kajillion repositories is a pain in the ass. 

## Features                                
           
- All projects accessible via the `cupboard` cli.
- easily identify which projects have been updated. 
- Customizable actions: publish, bump, etc.      
- Push to both npm, and git with one command.
                                            

## To-Do

- --all flag       
- ability to add custom templates e.g: `cbd add-template /path/to/template.conf`
- ability to list available templates
- help menu

## Installation 

	npm install cupboard
                             

## Usage                                   
                          
For each project you want to use in cupboard, simply call this command in your project directory:
                                            
	cupboard init               

That command will run you through the basic setup. You can also used pre-defined templates to speed things up. For instance:
    
	cupboard init git+npm
	                         
will add basic GIT, and NPM functions to your target project such as `publish`, and `ignore`. For example:

	cupboard ignore my-app my/file/to/ignore
	
will append my/file/to/ignore to .gitignore. Here's another example:

 	cupboard publish my-app "my commit message"
                   
will call the publish command specified in the template git+npm, which happens to commit, and push my-app to both GIT, and NPM.       



If you want more granular control over your cupboard configurations, just edit the `.cupboard` in your root project directory. A config file looks like this:

````ini
    
[project]
name=project-name


[commands]
publish=my publish commands separated by commas
XXXX=whatever command I want...

````                                                                                                        

## Commands           
                  
- `cbd init` - adds an project to cupboard.
- `cbd list` - list all the registered projects. Also contains details of what projects have
been updated.                                                                                   
- `cbd publish [PROJ_NAME]` - publishes given application                        
- `cbd open [PROJ_NAME]` - open a project in finder    
- `cbd dir [PROJ_NAME]` - returns the directory of the target app     
- `cbd [COMMAND] [PROJ_NAME]` - custom command given for target application 


## Default Template

- `git+npm`
- `git`
- `npm`


## Useful Commands

the following chunk will change the current working directory to the application specified:   

````bash       
cd `cbd dir my-project-name`
````      
            




              

                       




                                    

