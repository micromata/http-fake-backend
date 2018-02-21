'use strict';

const Lab = require('lab');
const Code = require('code');
const Manifest = require('../manifest');


const lab = exports.lab = Lab.script();


lab.experiment('Manifest', () => {

    lab.test('it gets manifest data', (done) => {

        Code.expect(Manifest.get('/')).to.be.an.object();
        done();
    });


    lab.test('it gets manifest meta data', (done) => {

        Code.expect(Manifest.meta('/')).to.match(/hapi server config used by glue to compose the server/i);
        done();
    });

    lab.test('it gets the correct custom response header', (done) => {

        Code.expect(Manifest.get('/').server.connections.routes.cors.additionalExposedHeaders).to.equal(['X-Powered-By']);
        done();
    });
});
