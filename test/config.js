'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Config = require('../config');


const lab = exports.lab = Lab.script();


lab.experiment('Config', () => {

    lab.test('it gets config data', () => {

        Code.expect(Config.get('/')).to.be.an.object();
    });


    lab.test('it gets config meta data', () => {

        Code.expect(Config.meta('/')).to.match(/general project wide config/i);
    });
});
