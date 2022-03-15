'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Config = require('../../../config');
const Hapi = require('@hapi/hapi');
const Fs = require('fs');
const Path = require('path');
const SetupEndpoint = require('../../../server/api/setup/');

const apiUrlPrefix = Config.get('/apiUrlPrefix');

const Endpoint = SetupEndpoint({
    name: 'fileTypes',
    urls: [{
        params: '/json',
        requests: [{
            response: '/test/server/api/fixtures/response.json'
        }]
    }, {
        params: '/json/download',
        requests: [{
            response: '/test/server/api/fixtures/response.json',
            sendFile: true
        }]
    }, {
        params: '/text',
        requests: [{
            response: '/test/server/api/fixtures/response.txt',
            mimeType: 'text/plain'
        }]
    }, {
        params: '/html',
        requests: [{
            response: '/test/server/api/fixtures/response.html',
            statusCode: 201,
            mimeType: 'text/html'
        }]
    }, {
        params: '/pdf',
        requests: [{
            response: '/response-files/example.pdf',
            sendFile: true
        }]
    }, {
        params: '/pdf/tweaked',
        requests: [{
            response: '/response-files/example.pdf',
            sendFile: true,
            statusCode: 201,
            mimeType: 'application/pdf'
        }]
    }]
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


lab.experiment('Different file types', () => {


    lab.experiment('send file contents ', () => {

        lab.test('content-type header defaults to `application/json`', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/json'
            };

            server.inject(request, (response) => {

                Code.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
                Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

            });
        });

        lab.test('return text files with the defined content-type header`', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/text'
            };

            server.inject(request, (response) => {

                Code.expect(response.headers['content-type']).to.equal('text/plain; charset=utf-8');
                Code.expect(response.result).to.equal('This is just a plain old text file ✅\n');

            });
        });

        lab.test('return with the defined content-type header and custom status code`', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/html'
            };

            server.inject(request, (response) => {

                Code.expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                Code.expect(response.result).to.equal('<a href="https://github.com">GitHub 💖</a>\n');
                Code.expect(response.statusCode).to.equal(201);

            });
        });

    });



    lab.experiment('send files ', () => {

        lab.test('ascii files have correctly encoded content', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/json/download'
            };

            server.inject(request, (response) => {

                Code.expect(JSON.parse(response.result)).to.equal({ response: '🐷' });

            });
        });

        lab.test('binary files have correctly encoded content', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/pdf'
            };

            const fixtureContent = Fs.readFileSync(Path.normalize(Path.join(__dirname, '/fixtures/example.pdf'))).toString();

            server.inject(request, (response) => {

                Code.expect(response.result).to.equal(fixtureContent);

            });
        });

        lab.test('send files with the default content-type and the correct name`', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/pdf'
            };

            server.inject(request, (response) => {

                Code.expect(response.headers['content-type']).to.equal('application/octet-stream');
                Code.expect(response.headers['content-disposition']).to.equal('attachment; filename=example.pdf');
                Code.expect(response.statusCode).to.equal(200);

            });
        });

        lab.test('send files with a defined content-type and a custom status code`', () => {

            request = {
                method: 'GET',
                url: apiUrlPrefix + '/fileTypes/pdf/tweaked'
            };

            server.inject(request, (response) => {

                Code.expect(response.headers['content-type']).to.equal('application/pdf');
                Code.expect(response.headers['content-disposition']).to.equal('attachment; filename=example.pdf');
                Code.expect(response.statusCode).to.equal(201);

            });
        });

    });


});
