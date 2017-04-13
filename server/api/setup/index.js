'use strict';

const Config = require('../../../config');
const UnsupportedMethods = require('./unsupportedMethods');
const SupportedMethod = require('./supportedMethod');

module.exports = function (settings) {

    const exportEndpoint = {};
    const path = Config.get('/apiUrlPrefix') + '/' + settings.name;
    const urls = settings.urls;

    exportEndpoint.register = function (server, options, next) {

        const routes = [];

        const createRoutes = function (url) {

            const params = url.params || '';

            url.requests.forEach((proposedRequest) => {

                const supportedMethod = SupportedMethod(server, proposedRequest, settings, params, path);
                routes.push(supportedMethod);
            });

            const unsupportedMethods = UnsupportedMethods(settings, params, path);
            routes.push(unsupportedMethods);
        };

        urls.forEach(createRoutes);
        server.route(routes);
        next();
    };

    exportEndpoint.register.attributes = {
        name: settings.name,
        path,
        urls
    };

    return exportEndpoint;
};
