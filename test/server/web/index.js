'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Config = require('../../../config');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HomePlugin = require('../../../server/web/index');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach(() => {

    const plugins = [Vision, Inert, HomePlugin];
    server = new Hapi.Server({ port: Config.get('/port/web') });
    server.register(plugins, {}).catch((err) => {

        if (err) {
            throw new Error(err);
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

    });
});


lab.experiment('Home Page View', () => {

    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/'
        };

    });


    lab.test('home page renders properly', () => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/<title>http-fake-backend - endpoints \/ routes<\/title>/i);
            Code.expect(response.statusCode).to.equal(200);

        });
    });

    lab.test('endpoints are delivered to the view', () => {

        server.inject(request, (response) => {

            const endpointsInView = response.result.match(/<code>(.+)<\/code>/)[1];
            const endpointsInController = JSON.stringify(response.request.preResponses.getEndpoints.source);

            Code.expect(endpointsInController).to.equal(endpointsInView);

        });
    });
});
