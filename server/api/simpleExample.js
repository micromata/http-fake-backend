'use strict';

const SetupEndpoint = require('./setup/');

module.exports = SetupEndpoint({
    name: 'simpleExample',
    urls: [{
        requests: [
            { response: '/response-files/simpleExample.json' }
        ]
    }]
});
