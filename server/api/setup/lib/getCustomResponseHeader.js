'use strict';

module.exports = function (env) {

    return {
        name: env.CUSTOM_HEADER_NAME || 'X-Powered-By',
        value: env.CUSTOM_HEADER_VALUE || 'https://hapijs.com'
    };
};
