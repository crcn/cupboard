Repository management (GIT/NPM) for your projects 
                                           

## Features                                
           
- All projects accessible via the `cupboard` cli.
- easily identify which projects have been updated. 
- Customizable actions: publish, bump, etc.    
                                            

## To-Do

- --all flag       
- ability to add custom templates

## Installation 

	npm install cupboard
                             

## Usage                                   
                          
For each project you want to use in cupboard, simply call:
                                            
	cupboard init               

That command will run you through the basic setup. You can also used pre-defined templates to speed things up. For instance:
    
	cupboard init git+npm
	                         
will add basic GIT, and NPM functions to your target project such as `publish`, and `ignore` For example:

	cupboard ignore my-app my/file/to/ignore
	
will append **my/file/to/ignore** to **.gitignore** because **ignore** was specified in the **git+npm** template. Here's another example:

 	cupboard publish my-app "my commit message"
                   
will call the **publish** command specified in git+npm, which happens to commit, and publish **my-app** to both GIT, and NPM.


	                                                                                                        

## Commands           
                  
- `cbd init` - adds an project to cupboard.
- `cbd list` - list all the registered projects. Also contains details of what projects have
been updated.                                                                                   
- `cbd publish [PROJ_NAME]` - publishes given application
- `cbd [COMMAND] [PROJ_NAME]` - custom command given for target application
- `cbd open [PROJ_NAME]` - open a project in finder    
- `cbd dir [PROJ_NAME]` - returns the directory of the target app      


## Default Template

- `git+npm`
- `git`
- `npm`


## Useful tricks

the following chunk will change the current working directory to the application specified:   

````bash

cd `cupboard dir my-project-name`

````
              

                       




                                    

