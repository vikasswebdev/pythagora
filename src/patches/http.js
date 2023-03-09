module.exports = function (httpModule) {
    const originalHttp = require(httpModule);
    const Pythagora = require("../Pythagora");

    const originalCreateServer = originalHttp.createServer;
    originalHttp.createServer = function (app) {
        global.Pythagora = new Pythagora(process.env.PYTHAGORA_MODE);
        global.Pythagora.setMongoClient(global.pythagoraMongoClient);
        global.Pythagora.runRedisInterceptor().then(() => {
            if (process.env.PYTHAGORA_MODE === 'test') {
                require('../../RunPythagoraTests.js');
            }
        });

        if (app) app.isPythagoraExpressInstance = true;
        let server = originalCreateServer.apply(this, arguments);

        const originalServerOnRequest = server.on;
        server.on = function (event, callback) {
            if (event === 'request' && typeof callback === 'function') callback.isPythagoraExpressInstance = true;
            return originalServerOnRequest.apply(this, arguments);
        }

        return server;
    }


    return originalHttp;
}
