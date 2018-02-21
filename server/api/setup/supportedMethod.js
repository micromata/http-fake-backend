'use strict';

const Boom = require('boom');
const Fs = require('fs');
const Path = require('path');

const GetContentDisposition = require('./lib/getContentDisposition');
const CustomResponseHeader = require('./lib/getCustomResponseHeader')(process.env);

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
                    response = Fs.readFileSync(filePath);
                }
                else {
                    response = proposedRequest.response;
                }

            }

            if (response.isBoom === true) {
                response.output.headers[CustomResponseHeader.name] = CustomResponseHeader.value;
                return reply(response);
            }

            if (sendFile && isFile) {
                return reply(response).code(proposedRequest.statusCode || 200).type(mimeType)
                    .header('Content-Disposition', GetContentDisposition(proposedRequest.response))
                    .header(CustomResponseHeader.name, CustomResponseHeader.value);
            }
            return reply(response).code(proposedRequest.statusCode || 200).type(mimeType)
                .header(CustomResponseHeader.name, CustomResponseHeader.value);
        }
    };
};
