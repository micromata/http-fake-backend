'use strict';

const Boom = require('boom');
const Fs = require('fs');
const Path = require('path');

module.exports = function (server, proposedRequest, settings, params, path) {

    const method = proposedRequest.method || 'GET';
    const mimeType = proposedRequest.mimeType || 'application/json';

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
                    const filePath = Path.normalize(Path.join(__dirname, '../../../', proposedRequest.response));
                    response = Fs.readFileSync(filePath, 'utf8');
                }
                else {
                    response = proposedRequest.response;
                }

            }

            if (proposedRequest.statusCode && proposedRequest.response) {
                return reply(response).code(proposedRequest.statusCode).type(mimeType);
            }

            if (response.isBoom === true) {
                return reply(response);
            }

            return reply(response).type(mimeType);
        }
    };
};
