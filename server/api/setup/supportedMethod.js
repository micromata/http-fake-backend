'use strict';

const Boom = require('boom');

module.exports = function (server, proposedRequest, settings, params, path) {

    const method = proposedRequest.method || 'GET';

    return {
        method,
        path: path + params,
        handler: function (request, reply) {

            let response;

            if (proposedRequest.statusCode && !proposedRequest.response) {
                response = Boom.create(proposedRequest.statusCode);
            }
            else if (settings.statusCode && !proposedRequest.statusCode) {
                response = Boom.create(settings.statusCode);
            }
            else {
                server.log('info', 'Received payload:' + JSON.stringify(request.payload));

                if (typeof proposedRequest.response === 'string') {
                    response = require('../../..' + proposedRequest.response);
                }
                else {
                    response = proposedRequest.response;
                }

            }

            if (proposedRequest.statusCode && proposedRequest.response) {
                return reply(response).code(proposedRequest.statusCode);
            }
            return reply(response);
        }
    };
};
