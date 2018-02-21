'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Fs = require('fs');
const Path = require('path');
const GetCustomResponseHeader = require('./server/api/setup/lib/getCustomResponseHeader');

const criteria = {
    env: process.env.NODE_ENV
};

const pathToEndpointConfigFiles = './server/api';

const manifest = {
    $meta: 'Hapi server config used by glue to compose the server.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true,
                cors: {
                    origin: ['*'],
                    credentials: true,
                    additionalExposedHeaders: [GetCustomResponseHeader(process.env).name]
                }
            },
            router: {
                stripTrailingSlash: true,
                isCaseSensitive: false
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web']
    }],
    registrations: [
        { plugin: 'vision' },
        {
            plugin: {
                register: 'visionary',
                options: {
                    layout: true,
                    engines: { hbs: 'handlebars' },
                    path: './server/web/views',
                    partialsPath: './server/web/views/partials',
                    layoutPath: './server/web/views/layout',
                    helpersPath: './server/web/views/helpers',
                    isCached: {
                        $filter: 'env',
                        development: false,
                        production: true
                    }
                }
            }
        },
        {
            plugin: {
                register: 'good',
                options: {
                    ops: {
                        interval: 15000
                    },
                    reporters: {
                        console: [{
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{
                                log: '*',
                                response: '*'
                            }]
                        }, {
                            module: 'good-console',
                            args: [{ format: 'YYYY-MM-DD/HH:mm:ss.SSS' }]
                        }, 'stdout']
                    }
                }
            }
        },
        { plugin: 'inert' },
        { plugin: './server/web/index' },
        { plugin: './server/web/public' }
    ]
};

// Add plugins to manifest.registration for every endpoint in ./server/api
Fs.readdirSync(pathToEndpointConfigFiles).map((file) => {

    return Path.join(pathToEndpointConfigFiles, file);
}).filter((file) => {

    return Fs.statSync(file).isFile();
}).forEach((file) => {

    const plugin = { plugin: './server/api/' + Path.parse(file).name };
    manifest.registrations.push(plugin);
});

const store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
