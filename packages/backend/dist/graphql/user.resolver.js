"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../data/models");
const jwt_1 = require("../data/jwt");
const createUserResolver = function createUserResolverFn(root, { input }, { connection }) {
    return models_1.createUser(connection, input);
};
const loginResolver = function loginResolverFn(root, { input }, { connection }) {
    return models_1.login(connection, input);
};
exports.userResolver = {
    Mutation: {
        createUser: createUserResolver,
        login: loginResolver
    },
    User: {
        jwt: user => {
            return jwt_1.idToJwt(user.id);
        }
    }
};
