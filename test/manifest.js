'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Manifest = require('../manifest');


const lab = exports.lab = Lab.script();


lab.experiment('Manifest', () => {

    lab.test('it gets manifest data', () => {

        Code.expect(Manifest.get('/')).to.be.an.object();
    });

    lab.test('it gets the correct custom response header', () => {

        Code.expect(Manifest.get('/').server.routes.cors.additionalExposedHeaders).to.equal(['X-Powered-By']);
    });
});
