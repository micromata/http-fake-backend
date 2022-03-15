'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Config = require('../../../config');
const Hapi = require('@hapi/hapi');
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

lab.beforeEach(() => {

    const plugins = [Endpoint];
    server = new Hapi.Server({ port: Config.get('/port/web') });
    server.register(plugins, {}).catch((err) => {

        if (err) {
            throw new Error(err);
        }

    });
});


lab.experiment('Custom response header', () => {

    lab.beforeEach(() => {
    });

    lab.test('should be read from .env file', () => {

        const env = Object.assign({}, process.env);

        env.CUSTOM_HEADER_NAME = 'Authorization';
        env.CUSTOM_HEADER_VALUE = 'Bearer eyJhbGciOiJIUzUxMiJ9';

        Code.expect(GetCustomResponseHeader(env)).to.equal({
            name: 'Authorization',
            value: 'Bearer eyJhbGciOiJIUzUxMiJ9'
        });
    });

    lab.test('should have a fallback if not defined in .env file', () => {


        Code.expect(GetCustomResponseHeader(process.env)).to.equal({
            name: 'X-Powered-By',
            value: 'https://hapijs.com'
        });
    });

    lab.test('regular responses should have the defined response header', () => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/customResponseHeader/regularResponse'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');
        });
    });

    lab.test('file responses should have the defined response header', () => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/customResponseHeader/fileResponse'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

        });
    });

    lab.test('boom errors should have the defined response header', (don) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/customResponseHeader/boomError'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

        });
    });

    lab.test('unallowed methods of regular responses should have the defined response header', () => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/customResponseHeader/regularResponse'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

        });
    });

    lab.test('unallowed methods of boom errors should have the defined response header', () => {

        request = {
            method: 'POST',
            url: apiUrlPrefix + '/customResponseHeader/boomError'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['x-powered-by']).to.equal('https://hapijs.com');

        });
    });

});
