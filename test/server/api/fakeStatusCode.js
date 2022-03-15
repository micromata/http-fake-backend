'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Config = require('../../../config');
const Hapi = require('@hapi/hapi');
const SetupEndpoint = require('../../../server/api/setup/');

const apiUrlPrefix = Config.get('/apiUrlPrefix');

const EndpointLevel = SetupEndpoint({
    name: 'endpoint',
    urls: [{
        requests: [
            { response: '/test/server/api/fixtures/response.json' }
        ]
    }],
    statusCode: 401
});

const RequestLevel = SetupEndpoint({
    name: 'request',
    urls: [
        {
            params: '/boomError',
            requests: [{ statusCode: 402 }]
        },
        {
            params: '/customError',
            requests: [
                {
                    response: { error: true },
                    statusCode: 406
                }
            ]
        }
    ]
});

const RequestLevelBeatsEndpointLevel = SetupEndpoint({
    name: 'requestBeatsEndpoint',
    urls: [
        {
            params: '/boomError',
            requests: [{ statusCode: 402 }]
        },
        {
            params: '/customError',
            requests: [
                {
                    response: { error: true },
                    statusCode: 406
                }
            ]
        }
    ],
    statusCode: 401
});

const lab = exports.lab = Lab.script();
let request;
let server;

lab.beforeEach(() => {

    const plugins = [
        EndpointLevel,
        RequestLevel,
        RequestLevelBeatsEndpointLevel
    ];
    server = new Hapi.Server({ port: Config.get('/port/web') });
    server.register(plugins, {}).catch((err) => {

        if (err) {
            throw new Error(err);
        }

    });
});


lab.experiment('Fake status codes', () => {

    lab.experiment('on endpoint level', () => {

        lab.test('returns correct error provided by boom', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/endpoint'
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(401);
            });
        });

        lab.test('undefined method returns correct error provided by boom', () => {

            request = {
                method: 'PUT',
                url: apiUrlPrefix + '/endpoint'
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(401);

            });
        });
    });

    lab.experiment('on request level', () => {

        lab.test('returns correct error provided by boom', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/request/boomError'
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(402);

            });
        });

        lab.test('returns correct faked status code with regular response', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/request/customError'
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(406);
                Code.expect(response.result).to.equal({ error: true });

            });
        });
    });

    lab.experiment('request level beats endpoint level', () => {

        lab.test('returns correct error provided by boom', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/requestBeatsEndpoint/boomError'
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(402);

            });
        });

        lab.test('returns correct faked status code with regular response', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/requestBeatsEndpoint/customError'
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(406);
                Code.expect(response.result).to.equal({ error: true });

            });
        });
    });
});
