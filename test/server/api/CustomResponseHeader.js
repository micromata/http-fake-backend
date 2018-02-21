'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const SetupEndpoint = require('../../../server/api/setup/');
const GetCustomResponseHeader = require('../../../server/api/setup/lib/getCustomResponseHeader');

const apiUrlPrefix = Config.get('/apiUrlPrefix');

const Endpoint = SetupEndpoint({
    name: 'customResponseHeader',
    urls: [
        {
            params: '/regularResponse',
            requests: [
                { response: '/test/server/api/fixtures/response.json' }
            ]
        },
        {
            params: '/fileResponse',
            requests: [{
                response: '/test/server/api/fixtures/example.pdf',
                sendFile: true,
                mimeType: 'application/pdf'
            }]
        },
        {
            params: '/boomError',
            requests: [{ statusCode: 402 }]
        }
    ]
});

const lab = exports.lab = Lab.script();
let request;
let server;

lab.beforeEach((done) => {

    const plugins = [Endpoint];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.experiment('Custom response header', () => {

    lab.beforeEach((done) => {


        done();
    });

    lab.test('should be read from .env file', (done) => {

        const env = Object.assign({}, process.env);

        env.CUSTOM_HEADER_NAME = 'Authorization';
        env.CUSTOM_HEADER_VALUE = 'Bearer eyJhbGciOiJIUzUxMiJ9';

        Code.expect(GetCustomResponseHeader(env)).to.equal({
            name: 'Authorization',
            value: 'Bearer eyJhbGciOiJIUzUxMiJ9'
        });

        done();
    });

    lab.test('should have a fallback if not defined in .env file', (done) => {


        Code.expect(GetCustomResponseHeader(process.env)).to.equal({
            name: 'X-Powered-By',
            value: 'https://hapijs.com'
        });

        done();
    });

    lab.test('regular responses should have the defined response header', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/customResponseHeader/regularResponse'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

            done();
        });
    });

    lab.test('file responses should have the defined response header', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/customResponseHeader/fileResponse'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

            done();
        });
    });

    lab.test('boom errors should have the defined response header', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/customResponseHeader/boomError'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

            done();
        });
    });

    lab.test('unallowed methods of regular responses should have the defined response header', (done) => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/customResponseHeader/regularResponse'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

            done();
        });
    });

    lab.test('unallowed methods of boom errors should have the defined response header', (done) => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/customResponseHeader/boomError'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

            done();
        });
    });

});
