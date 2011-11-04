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
   

That command will run you through the basic setup. If you're like me however, your a lazy coder who wants to use  
	
That command alone will use the *default* cupboard template. You can of course use other templates. Right now they include the following: `git`, `git+npm`, and `npm`. Essentially, templates

	
the `init` command will walk you through a setup process. There are a few built-in templates you can use, such as `npm`, and 

                                                         

After *that*, call `cupboard init`, and the project will be available globally via the `cupboard` CLI.

## Commands           
                  
- `cbd init` - adds an project to cupboard.
- `cbd list` - list all the registered projects. Also contains details of what projects have
been updated.                                                                                   
- `cbd publish [PROJ_NAME]` - publishes given application
- `cbd [COMMAND] [PROJ_NAME]` - custom command given for target application
- `cbd open [PROJ_NAME]` - open a project in finder    
- `cbd dir [PROJ_NAME]` - returns the directory of the target app


## Useful tricks

the following chunk will change the current working directory to the application specified:   

````bash

cd `cupboard dir my-project-name`

````
              

                       




                                    

