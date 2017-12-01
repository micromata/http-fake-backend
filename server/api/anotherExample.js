'use strict';

const SetupEndpoint = require('./setup/');

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
    }]
});
