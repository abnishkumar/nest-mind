
## Description
> This is my Nest.js + Mongodb + Node.js CURD api and having Authorization! 
Include files upload、download、getFile、searchFile api!


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CURD API

* create user

```bash
POST
http://localhost:3000/user
Body param:
{
  userName: string,
  passWord: string,
  email: string,
  createdDate: Date,
  updatedDate: Date,
}
```

* find all user

```bash
GET
http://localhost:3000/user
Query param
pageSize: number,
pageIndex: number
```

* find user by id

```bash
GET
http://localhost:3000/user/:id
Path param
```

* update user by id

```bash
PUT
http://localhost:3000/user/:id
Path param:
id
Body param:
{
  userName: string,
  passWord: string,
  email: string,
  createdDate: Date,
  updatedDate: Date,
}

```

* delete user by id

```bash
DELETE
http://localhost:3000/user/:id
Path param:
id
```

* login api

```bash
http://localhost:3000/auth/login

response: access_token

{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTI3Njc2MTgsImV4cCI6MTYxMjc2ODIxOH0.Hv_QFRfkh0T0WLV5-TIBv6JmLzmrPUf8gKIjI-_tgis"
}
```