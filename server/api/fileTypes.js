'use strict';

const SetupEndpoint = require('./setup/');

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
            statusCode: 201,
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
