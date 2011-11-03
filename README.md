Repository management (GIT/NPM) for your projects 
                                           

## Features                                
           
- All projects accessible via the `cupboard` cli.
- easily identify which projects have been updated. 
- Customizable actions: publish, bump, etc.    

## Installation 

	npm install cupboard
                             

## Usage                                   
                          
For each project you want to use in cupboard, simply call:
                                            
	cupboard init                       
	
the `init` command will walk you through a setup process. But if you're like me, you'll want more granular control over the cupboard script. In your root project directory, create a file called `.cupboard`, add some config settings similar to the following chunk:

```init    

[project]
name=my app name

[commands]    

# publishes the project to these locations
publish=npm publish, git push origin master  

# bumps the version of a given app
bump=npm bump         

# whatever command you want...
XXXX=whatever custom command you want
                      

```                                                          

After *that*, call `cupboard init`, and the project will be available globally via the `cupboard` CLI.

## Commands           
                  
- `cupboard init` - adds an project to cupboard.
- `cupboard list` - list all the registered projects. Also contains details of what projects have
been updated.                                                                                   
- `cupboard publish [APP_NAME]` - publishes given application
- `cupboard [COMMAND] [APP_NAME]` - custom command given for target application
         


## Additional flags

- `--all` - execute command for all applications in cupboard. e.g: 

	cupboard publish --all

                       




                                    

