'use strict';

const Confidence = require('@hapipal/confidence');
const Config = require('./config');
const Fs = require('fs');
const Path = require('path');
const GetCustomResponseHeader = require('./server/api/setup/lib/getCustomResponseHeader');
const Glue = require('@hapi/glue');

const criteria = {
    env: process.env.NODE_ENV
};

const pathToEndpointConfigFiles = './server/api';

const manifest = {
    server: {
        debug: {
            request: ['error']
        },
        port: Config.get('/port/web'),
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
    },
    register: {
        plugins: [
            { plugin: '@hapi/vision' },
            {
                plugin: '@hapi/good',
                options: {
                    ops: {
                        interval: 15000
                    },
                    reporters: {
                        console: [{
                            module: '@hapi/good-squeeze',
                            name: 'Squeeze',
                            args: [{
                                log: '*',
                                response: '*'
                            }]
                        }, {
                            module: '@hapi/good-console',
                            args: [{ format: 'YYYY-MM-DD/HH:mm:ss.SSS' }]
                        }, 'stdout']
                    }
                }
            },
            { plugin: '@hapi/inert' },
            { plugin: require('./server/web/index') },
            { plugin: require('./server/web/public') },
        ]
    }
};

// Add plugins to manifest.registration for every endpoint in ./server/api
Fs.readdirSync(pathToEndpointConfigFiles).map((file) => {
    return Path.join(pathToEndpointConfigFiles, file);
}).filter((file) => {
    return Fs.statSync(file).isFile();
}).forEach((file) => {
    const plugin = { plugin: require('./server/api/' + Path.parse(file).name) };
    manifest.register.plugins.push(plugin);
});

const store = new Confidence.Store(manifest);

const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, {});
        await server.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();

exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
