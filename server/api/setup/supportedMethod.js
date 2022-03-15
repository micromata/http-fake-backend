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
        handler: function (request, toolkit) {

            let data;

            if (proposedRequest.statusCode && !proposedRequest.response) {
                data = Boom.create(proposedRequest.statusCode);
            }
            else if (settings.statusCode && !proposedRequest.statusCode) {
                data = Boom.create(settings.statusCode);
            }
            else {
                server.log('info', 'Received payload:' + JSON.stringify(request.payload));

                if (typeof proposedRequest.response === 'string') {
                    const filePath = Path.normalize(Path.join(__dirname, '../../../', proposedRequest.response));
                    data = Fs.readFileSync(filePath);
                }
                else {
                    data = proposedRequest.response;
                }

            }

            if (data.isBoom === true) {
                data.output.headers[CustomResponseHeader.name] = CustomResponseHeader.value;
                return toolkit.response(data);
            }

            if (sendFile && isFile) {
                return toolkit.response(data).code(proposedRequest.statusCode || 200).type(mimeType)
                    .header('Content-Disposition', GetContentDisposition(proposedRequest.response))
                    .header(CustomResponseHeader.name, CustomResponseHeader.value);
            }
            return toolkit.response(data).code(proposedRequest.statusCode || 200).type(mimeType)
                .header(CustomResponseHeader.name, CustomResponseHeader.value);
        }
    };
};
