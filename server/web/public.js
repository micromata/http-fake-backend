'use strict';

exports.name = 'public-plugin';

exports.register = function (server) {

    server.route({
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: './server/web/public/assets',
                listing: true
            }
        }
    });
};


exports.register.attributes = {
    name: 'public'
};
