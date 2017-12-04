'use strict';

module.exports = function (filePath) {

    const fileName = /\/([^\/]+\.\S+)$/g.exec(filePath);
    return 'attachment; filename=' + fileName[1];
};
