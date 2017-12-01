'use strict';

const SetupEndpoint = require('./setup/');

module.exports = SetupEndpoint({
    name: 'statusCodes',
    urls: [
        {
            params: '/boomError',
            requests: [{
                // Returns a 402 status code + error message provided by boom:
                // {
                //   "error" : "Payment Required",
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
