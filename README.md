# News Backend Application

The purpose of this project is to serve as the backend for a news website and integrate with your frontend project. This project allows people to create users, topics and articles, as well as users being able to comment on those articles. 

The project has been built with TDD in mind and so has been tested for reliability to ensure it's suitability.


## Hosting

- See the following link to view the hosted version: https://davids-nc-news-app.herokuapp.com/.
- A summary of all the endpoints are found at this link: https://davids-nc-news-app.herokuapp.com/api.

## Tools & Technologies

The server itself is implemented using NodeJS and PSQL has been used for the database.

Express.js is the NodeJS framework chosen for this project. Node-Postgres is used to interact with the database.

Jest is used for testing.



## Requirements

For test and development, you will need NodeJS and NPM installed in your environment.

Minimum versions needed to run this project are:
- NodeJS: v16.14.2


## Installation

Enter the following commands in your terminal to clone the repository and install all the required dependencies.

```bash
$ git clone https://github.com/Dantren18/davids-nc-news-app.git
$ code davids-nc-news-app
$ npm i
```


## Test & deployment
After that, you'll need to create two databases for development and testing by running this script:
```bash
$ npm run setup-dbs
```

Two .env files need to be added to the route directory: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). 

At this point, you can start running the tests by using the command below:
```bash
$ npm run test
```

