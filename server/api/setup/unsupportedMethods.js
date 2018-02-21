'use strict';

const Boom = require('boom');
const CustomResponseHeader = require('./lib/getCustomResponseHeader')(process.env);

module.exports = function (settings, params, path) {

    return {
        method: '*',
        path: path + params,
        handler: function (request, reply) {

            let response;

            if (settings.statusCode) {
                response = Boom.create(settings.statusCode);
            }
            else {
                response = Boom.methodNotAllowed();
            }

            response.output.headers[CustomResponseHeader.name] = CustomResponseHeader.value;
            return reply(response);
        }
    };
};
