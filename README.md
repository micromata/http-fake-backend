[![GitHub version](https://badge.fury.io/gh/micromata%2Fhttp-fake-backend.svg)](https://badge.fury.io/gh/micromata%2Fhttp-fake-backend)
[![Build Status](https://travis-ci.org/micromata/http-fake-backend.svg?branch=master)](https://travis-ci.org/micromata/http-fake-backend)
[![Coverage Status](https://coveralls.io/repos/github/micromata/http-fake-backend/badge.svg?branch=master)](https://coveralls.io/github/micromata/http-fake-backend?branch=master)
[![Dependency Status](https://david-dm.org/micromata/http-fake-backend.svg)](https://david-dm.org/micromata/http-fake-backend)
[![devDependency Status](https://david-dm.org/micromata/http-fake-backend/dev-status.svg?theme=shields.io)](https://david-dm.org/micromata/http-fake-backend#info=devDependencies)
[![Unicorn](https://img.shields.io/badge/unicorn-approved-ff69b4.svg?style=flat)](https://www.youtube.com/watch?v=qRC4Vk6kisY) 

# http-fake-backend

> Build a fake backend by providing the content of JSON files or JavaScript objects through configurable routes.

*It actually can serve the content of other file types as well as sending the files itself as response.*

Comes as a Node.js server. Useful for mocking, testing and developing independent of the »real« backend.

## Example
Let’s say you need an endpoint like <http://localhost:8081/api/example> which should return:

```
{
  "response": "Yeah"
}
```

It’s a matter of seconds to create this endpoint with help of this little hapi server.

It might take a few seconds longer as setting up the well-made [JSON Server](https://github.com/typicode/json-server) but it’s way more flexible.

## Requirements

- Node.js (v6.0.0 or greater)

## Install

```bash
git clone https://github.com/micromata/http-fake-backend.git
npm install
```

Or with help of [Yeoman](http://yeoman.io)

```bash
npm install -g yo
npm install -g generator-http-fake-backend
```

This comes in handy, because the Yeoman generator has a sub-generator to setup endpoints of your fake backend very convenient. See <https://github.com/micromata/generator-http-fake-backend>.

## Default Address
The server runs at <http://localhost:8081/> providing a page with links to all existing API endpoints.

## Start the server

There are the following two options.

### During development

```
npm run start:dev
```

This way the server uses `nodemon` to restart itself on changes. 


### Later (eg. for tests in CI)

```
npm start
```

Just starts the server via node.

## Configure endpoints

Each endpoint needs a configuration file in `/server/api/` to define routes, http method and the response.

### Example configurations

#### Simple Example

`/server/api/simpleExample.js`:

```js
module.exports = SetupEndpoint({
    name: 'simpleExample',
    urls: [{
        requests: [
            { response: '/response-files/simpleExample.json' }
        ]
    }]
});
```

#### Advanced Example

`/server/api/anotherExample.js`:

```js
module.exports = SetupEndpoint({
    name: 'anotherExample',
    urls: [{
        params: '/read',
        requests: [{
            method: 'GET',
            response: '/response-files/anotherExample.json'
        }]
    }, {
        params: '/update/{id}',
        requests: [{
            method: ['PUT', 'PATCH'],
            response: {
                success: true
            }
        }, {
            method: 'DELETE',
            response: {
                deleted: true
            }
        }]
    }, ]
});
```

#### Serving different content types

`/server/api/fileTypes.js`:

```js
module.exports = SetupEndpoint({
    name: 'fileTypes',
    urls: [{
        params: '/json',
        requests: [{
            response: '/response-files/simpleExample.json'
        }]
    }, {
        params: '/text',
        requests: [{
            response: '/response-files/example.txt',
            mimeType: 'text/plain'
        }]
    }, {
        params: '/html',
        requests: [{
            response: '/response-files/example.html',
            mimeType: 'text/html'
        }]
    }, {
        params: '/pdf',
        requests: [{
            response: '/response-files/example.pdf',
            sendFile: true
        }]
    }]
});
```

#### Faking HTTP errors and status code

`/server/api/fakingStatusCodes.js`:

```js
module.exports = SetupEndpoint({
    name: 'statusCodes',
    urls: [
        {
            params: '/boomError',
            requests: [{
                // Returns a 402 status code + error message provided by boom:
                // {
                //   "error" : "Payment Required",
                //   "message" : "Payment Required",
                //   "statusCode" : 402
                // }
                statusCode: 402
            }]
        },
        {
            params: '/customError',
            requests: [{
                // Returns a HTTP status code 406 and a self defined response:
                response: { error: true },
                statusCode: 406
            }]
        },
        {
            params: '/regularResponse',
            requests: [{
                // Returns a 401 error provided by boom
                // as defined on endpoint level
                response: '/response-files/anotherExample.json'
            }]
        }
    ],
    statusCode: 401
});
```

The configuration object in Detail:

* `name`  
  * Is used to set the endpoint.
* `urls`
  * You need to add at least one url object.
* `urls.params`
  * Optional
  * URL path parameters with fixed and/or variable path segments.
  * Example:
    * `params: '/update/{id}'`
  * See hapi docs. For example regarding optional [path parameters](http://hapijs.com/api#path-parameters).
* `urls.requests`
    *  You need to add at least one request object.
    *  Multiple request objects are needed in case you like to serve different responses via different HTTP methods with the same URL.
* `urls.requests.method` 
    * optional. Uses `GET` when not defined.
    * `string`, or `array` of strings.
    * is used to define the http method(s) to which the endpoint will listen.
* `urls.requests.response` 
  * Could be a string pointing to a file:
    *   `response: '/response-files/articles.json'`
  * Or just a JavaScript object:
    * `response: { success: true }`
* `urls.requests.mimeType` 
  * Optional (string). Defaults to `application/json`.
  * Is used to set the `content-type` response header. 
* `urls.requests.sendFile`
  * Optional (boolean). Defaults to `false`.
  * Sends the file as response instead of returning the file content.
* `urls.requests.statusCode` 
  * Optional (boolean). Defaults to `200`
  * The HTTP status code of the response.
  * Will return: 
    * a status code with a self defined response if you provide a response property
    * a status code with a predefined error object provided by [boom](https://github.com/hapijs/boom) if you dont provide a response property for that request.
* `statusCode`
  * Optional
  * Every subroute of this endpoint will return a HTTP error with the given status code provided by [boom](https://github.com/hapijs/boom).

## Configure server

The main config is handled via a file named `.env` with the following content:

```dosini
# NODE_ENV
# Could be either `development` or `production`
NODE_ENV=development

# Port of the Server
SERVER_PORT=8081

# Port for running the tests
TEST_PORT=9090

# URL Prefix for the endpoints
# eg. http://localhost:8081/api/foo
API_PREFIX=/api

# Custom response header
#CUSTOM_HEADER_NAME=Authorization
#CUSTOM_HEADER_VALUE=Bearer eyJhbGciOiJIUzUxMiJ9

```


## Related

* [Yeoman Generator](https://github.com/micromata/generator-http-fake-backend) – Easily generate your fake backend and use sub-generators to setup endpoints  like :zap:

## License

Please be aware of the licenses of the components we use in this project.
Everything else that has been developed by the contributions to this project is under [MIT License](LICENSE).
