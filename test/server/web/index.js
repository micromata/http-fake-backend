'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HomePlugin = require('../../../server/web/index');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [Vision, Inert, HomePlugin];
    server = new Hapi.Server({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.views({
            engines: { hbs: require('handlebars') },
            layout: true,
            path: './server/web/views',
            partialsPath: './server/web/views/partials',
            layoutPath: './server/web/views/layout',
            helpersPath: './server/web/views/helpers',
            isCached: false
        });

        done();
    });
});


lab.experiment('Home Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/'
        };

        done();
    });


    lab.test('home page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/<title>http-fake-backend - endpoints \/ routes<\/title>/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });

    lab.test('endpoints are delivered to the view', (done) => {

        server.inject(request, (response) => {

            const endpointsInView = response.result.match(/<code>(.+)<\/code>/)[1];
            const endpointsInController = JSON.stringify(response.request.preResponses.getEndpoints.source);

            Code.expect(endpointsInController).to.equal(endpointsInView);

            done();
        });
    });
});
