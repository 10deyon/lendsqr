# LENDSQR
​
> ### Lendsqr is an assessment that has the following functionalities: 
- [x] A user can create an account
- [x] A user can fund their account
- [x] A user can transfer funds to another user’s account
- [x] A user can withdraw funds from their account
​
This repo is functionality complete but open to fixes!
​
----------
# Getting started
​
## Installation
Please check the official lumen installation guide for server requirements before you start. [Official Documentation](https://lumen.laravel.com/docs/8.x)
​
Open the bash terminal
​
Clone the repository
​
````
git clone https://github.com/10deyon/lendsqr.git
````
​
Switch to the repo folder
​
````
cd lendsqr
````
​
Install all the dependencies using composer
​
````
npm install
````
​
Copy the example env file and make the required configuration changes in the .env file
​
````
cp .env.example config.env
````
​
Run the database migrations (**Set the database connection in .env before migrating**)
​
````
knex migrate:latest
````
​
​
**TL;DR command list**
```
  git clone https://github.com/10deyon/lendsqr.git
  cd lendsqr
  npm install
  cp .env.example config.env
```

**Make sure you set the correct database connection information before running the migrations in the .env file** [Environment variables](#environment-variables)
​
```
  knex migrate:latest
  npm run start ```development environment```
  npm run start:prod ```production environment```
```
​
## Environment variables
- `config.env` - Environment variables can be set in this file
​
***Note*** : You can quickly set the database information and other variables in this file and have the application fully working.
​
----------
## Testing API
​
Run the server
​
```
  npm run start
  npm run start:prod
```
​
​
The root url of the api is
​
```
  http://localhost:3000/api
```
----------
## API Specification
​
More information regarding the project can be found here
​
> [Full API Spec](https://www.getpostman.com/collections/b4ebca45fa1ba5ff4cc9)
​
----------
​
<br>
## Run Test
  - User the following command to run test
​
Open the bash terminal
​
​
Run all available test in the project
```
  
```
​
Run test based on a specific test 
```
  
```