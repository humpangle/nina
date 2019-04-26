"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// tslint:disable: no-console
const typeorm_1 = require("typeorm");
const node_graceful_1 = tslib_1.__importDefault(require("node-graceful"));
const server_setup_1 = require("./server-setup");
const ormconfig_1 = tslib_1.__importDefault(require("./ormconfig"));
const PORT = process.env.PORT || "";
if (!PORT) {
    throw new Error("'PORT' environment variable not found");
}
(function startApp() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield typeorm_1.createConnection(ormconfig_1.default);
            const { webServer } = server_setup_1.setupServer(connection);
            webServer.listen(PORT, () => {
                console.log(`
        -----------------------------------------------------------------
        | Apollo server is now running at http://127.0.0.1:${PORT}/graphql |
        -----------------------------------------------------------------
        `);
            });
            const shutdownListener = onShutdownListener(webServer, connection, PORT);
            node_graceful_1.default.on("SIGTERM", shutdownListener, true);
            node_graceful_1.default.on("SIGINT", shutdownListener, true);
            node_graceful_1.default.on("SIGBREAK", shutdownListener, true);
            node_graceful_1.default.on("SIGHUP", shutdownListener, true);
            node_graceful_1.default.on("SIGUSR2", shutdownListener, true); // nodemon
            node_graceful_1.default.on("shutdown", shutdownListener, false); // tests
        }
        catch (error) {
            console.error("\n\nError connecting to database and starting apollo server server:\n\t\t", error);
        }
    });
})();
function onShutdownListener(server, dbConnection, port) {
    // tslint:disable-next-line: no-any
    return function (done, event, signal) {
        console.warn(`!)\tGraceful ${signal} signal received.`);
        return new Promise(resolve => {
            console.warn(`3)\tHTTP & WebSocket servers on port ${port} closing.`);
            return server.close(resolve);
        })
            .then(() => {
            console.warn(`2)\tDatabase connections closing.`);
            return dbConnection.close();
        })
            .then(() => {
            console.warn(`1)\tShutting down. Goodbye!\n`);
            return done();
        })
            .catch(err => {
            console.error("!)\tGraceful termination error\n", err);
            process.exit(1);
        });
    };
}
