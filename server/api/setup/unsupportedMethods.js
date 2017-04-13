'use strict';

const Boom = require('boom');

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

            return reply(response);
        }
    };
};
