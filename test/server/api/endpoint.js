'use strict';

const Lab = require('lab');
const Code = require('code');
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

lab.beforeEach((done) => {

    const plugins = [Endpoint];
    server = new Hapi.Server({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.experiment('Setup endpoints', () => {

    lab.beforeEach((done) => {


        done();
    });


    lab.test('returns 404 for unknown route', (done) => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/baz'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);

            done();
        });
    });

    lab.test('returns 405: Method Not Allowed for undefined methods', (done) => {

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

            done();
        });
    });

    lab.test('params and method are optional', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/endpoint'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

            done();
        });
    });

    lab.test('returns correct json from JavaScript object', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/endpoint/object'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({ javascript: 'object' });

            done();
        });
    });

    lab.test('returns correct json from JSON template', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/endpoint/read'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

            done();
        });
    });

    lab.test('PUT returns correct json', (done) => {

        request = {
            method: 'PUT',
            url: apiUrlPrefix + '/endpoint/update/foo'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

            done();
        });
    });

    lab.test('PATCH on same route returns different json', (done) => {

        request = {
            method: 'PATCH',
            url: apiUrlPrefix + '/endpoint/update/foo'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({ success: true });

            done();
        });
    });

    lab.test('DELETE returns correct json', (done) => {

        request = {
            method: 'DELETE',
            url: apiUrlPrefix + '/endpoint/delete/foo'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

            done();
        });
    });

    lab.test('correct json for multiple Methods', (done) => {

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

            done();
        });


    });

});
