'use strict';

const Boom = require('boom');
const CustomResponseHeader = require('./lib/getCustomResponseHeader')(process.env);

module.exports = function (settings, params, path) {

    return {
        method: '*',
        path: path + params,
        handler: function (request, toolkit) {

            let data;

            if (settings.statusCode) {
                data = Boom.create(settings.statusCode);
            }
            else {
                data = Boom.methodNotAllowed();
            }

            data.output.headers[CustomResponseHeader.name] = CustomResponseHeader.value;
            return toolkit.response(data);
        }
    };
};
