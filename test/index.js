'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Composer = require('../index');


const lab = exports.lab = Lab.script();


lab.experiment('App', () => {

    lab.test('it composes a server', () => {

        Composer((err, composedServer) => {

            if (err) {
                console.log(err.stack);
            }

            Code.expect(composedServer).to.be.an.object();
        });
    });
});
