'use strict';

const SetupEndpoint = require('./setup/index.js');

module.exports = SetupEndpoint({
    name: 'simpleExample',
    urls: [{
        requests: [
            { response: '/json-templates/simpleExample.json' }
        ]
    }]
});
