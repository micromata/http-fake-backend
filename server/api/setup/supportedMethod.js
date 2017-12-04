'use strict';

const Boom = require('boom');
const Fs = require('fs');
const Path = require('path');

const GetContentDisposition = require('./lib/getContentDisposition.js');

module.exports = function (server, proposedRequest, settings, params, path) {

    const method = proposedRequest.method || 'GET';
    const sendFile = proposedRequest.sendFile | false;
    const isFile = typeof proposedRequest.response === 'string';
    const mimeType = proposedRequest.mimeType || (sendFile ? 'application/octet-stream' : 'application/json');

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

                if (sendFile && isFile) {
                    return reply(response).code(proposedRequest.statusCode).type(mimeType).header('Content-Disposition', GetContentDisposition(proposedRequest.response));
                }
                return reply(response).code(proposedRequest.statusCode).type(mimeType);
            }

            if (response.isBoom === true) {
                return reply(response);
            }

            if (sendFile && isFile) {
                return reply(response).type(mimeType).header('Content-Disposition', GetContentDisposition(proposedRequest.response));
            }

            return reply(response).type(mimeType);
        }
    };
};
