'use strict';

const Glue = require('@hapi/glue');
const Manifest = require('./manifest');


const composeOptions = {
    relativeTo: __dirname
};


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
