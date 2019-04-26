"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const apollo_server_express_1 = require("apollo-server-express");
const http_1 = require("http");
const common_1 = require("@nina/common");
const user_resolver_1 = require("./graphql/user.resolver");
const IS_TEST = process.env.NODE_ENV === "test";
const IS_DEV = process.env.NODE_ENV === "development";
function setupServer(connection) {
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    /* istanbul ignore next: we don't care about logging in tests */
    if (!IS_TEST) {
        app.use(morgan_1.default("combined"));
    }
    const apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs: common_1.schema,
        resolvers: [
            {
                Query: {}
            },
            user_resolver_1.userResolver
            // tslint:disable-next-line: no-any
        ],
        introspection: IS_DEV,
        playground: IS_DEV,
        context: function createContext() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return { connection };
            });
        }
    });
    apolloServer.applyMiddleware({ app, path: "/graphql" });
    const webServer = http_1.createServer(app);
    apolloServer.installSubscriptionHandlers(webServer);
    return {
        apolloServer,
        app,
        webServer
    };
}
exports.setupServer = setupServer;
