'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Config = require('../../../config');
const Hapi = require('@hapi/hapi');
const SetupEndpoint = require('../../../server/api/setup/');

const apiUrlPrefix = Config.get('/apiUrlPrefix');

const Endpoint = SetupEndpoint({
    name: 'endpoint',
    urls: [
        {
            requests: [
                { response: '/test/server/api/fixtures/response.json' }
            ]
        },
        {
            params: '/object',
            requests: [{
                response: {
                    javascript: 'object'
                }
            }]
        },
        {
            params: '/read',
            requests: [{
                method: 'GET',
                response: '/test/server/api/fixtures/response.json'
            }]
        },
        {
            params: '/update/{id}',
            requests: [{
                method: 'PUT',
                response: '/test/server/api/fixtures/response.json'
            }, {
                method: 'PATCH',
                response: {
                    success: true
                }
            }]
        },
        {
            params: '/delete/{id}',
            requests: [{
                method: 'DELETE',
                response: '/test/server/api/fixtures/response.json'
            }]
        },
        {
            params: '/multipleMethods',
            requests: [{
                method: ['PUT', 'PATCH'],
                response: {
                    success: true
                }
            }]
        }
    ]
});

const lab = exports.lab = Lab.script();
let request;
let server;

lab.beforeEach(() => {

    const plugins = [Endpoint];
    server = new Hapi.Server({ port: Config.get('/port/web') });
    server.register(plugins, {}).catch((err) => {

        if (err) {
            throw new Error(err);
        }

    });
});


lab.experiment('Setup endpoints', () => {


    lab.test('returns 404 for unknown route', () => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/baz'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);

        });
    });

    lab.test('returns 405: Method Not Allowed for undefined methods', () => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/endpoint/read'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(405);
            Code.expect(response.result).to.equal({
                statusCode: 405,
                error: 'Method Not Allowed',
                message: 'Method Not Allowed'
            });

        });
    });

    lab.test('params and method are optional', () => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/endpoint'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

        });
    });

    lab.test('returns correct json from JavaScript object', () => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/endpoint/object'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({ javascript: 'object' });

        });
    });

    lab.test('returns correct json from JSON template', () => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/endpoint/read'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

        });
    });

    lab.test('PUT returns correct json', () => {

        request = {
            method: 'PUT',
            url: apiUrlPrefix + '/endpoint/update/foo'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

        });
    });

    lab.test('PATCH on same route returns different json', () => {

        request = {
            method: 'PATCH',
            url: apiUrlPrefix + '/endpoint/update/foo'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({ success: true });

        });
    });

    lab.test('DELETE returns correct json', () => {

        request = {
            method: 'DELETE',
            url: apiUrlPrefix + '/endpoint/delete/foo'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

        });
    });

    lab.test('correct json for multiple Methods', () => {

        const putRequest = {
            method: 'PUT',
            url: apiUrlPrefix + '/endpoint/multipleMethods'
        };

        const patchRequest = {
            method: 'PATCH',
            url: apiUrlPrefix + '/endpoint/multipleMethods'
        };

        const postRequest = {
            method: 'POST',
            url: apiUrlPrefix + '/endpoint/multipleMethods'
        };

        server.inject(putRequest, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({ success: true });
        });

        server.inject(patchRequest, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({ success: true });
        });

        server.inject(postRequest, (response) => {

            Code.expect(response.statusCode).to.equal(405);
            Code.expect(response.result).to.equal({
                statusCode: 405,
                error: 'Method Not Allowed',
                message: 'Method Not Allowed'
            });

        });


    });

});
