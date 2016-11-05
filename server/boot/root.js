'use strict';

module.exports = function(server) {
    var container = server.dataSources.Storage.createModel('container');
    server.model(container);

    var router = server.loopback.Router();
    router.get('/status', server.loopback.status());
    server.use(router);
};
