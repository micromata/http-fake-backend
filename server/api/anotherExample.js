'use strict';

const SetupEndpoint = require('./setup/index.js');

module.exports = SetupEndpoint({
    name: 'anotherExample',
    urls: [{
        params: '/read',
        requests: [{
            method: 'GET',
            response: '/json-templates/anotherExample.json'
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
