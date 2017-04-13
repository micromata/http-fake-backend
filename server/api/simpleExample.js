'use strict';

const SetupEndpoint = require('./setup/');

module.exports = SetupEndpoint({
    name: 'simpleExample',
    urls: [{
        requests: [
            { response: '/json-templates/simpleExample.json' }
        ]
    }]
});
