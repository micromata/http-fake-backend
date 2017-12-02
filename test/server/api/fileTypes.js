'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
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
    }]
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


lab.experiment('Different file types', () => {

    lab.beforeEach((done) => {


        done();
    });


    lab.test('content-type header defaults to `application/json`', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/fileTypes/json'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    lab.test('return text files with the defined content-type header`', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/fileTypes/text'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['content-type']).to.equal('text/plain; charset=utf-8');
            Code.expect(response.result).to.equal('This is just a plain old text file.\n');

            done();
        });
    });

    lab.test('return with the defined content-type header and custom status code`', (done) => {

        request = {
            method: 'GET',
            url: apiUrlPrefix + '/fileTypes/html'
        };

        server.inject(request, (response) => {

            Code.expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
            Code.expect(response.result).to.equal('<a href="https://github.com">GitHub</a>\n');
            Code.expect(response.statusCode).to.equal(201);

            done();
        });
    });


});
