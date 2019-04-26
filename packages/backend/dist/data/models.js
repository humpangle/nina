"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_server_core_1 = require("apollo-server-core");
const user_1 = require("./user");
const typeorm_1 = require("./typeorm");
const utils_1 = require("./utils");
const jwt_1 = require("./jwt");
exports.getUserById = typeorm_1.dbGetUserById;
exports.INVALID_LOGIN_INPUT_ERROR = "Invalid username/email/password";
exports.INVALID_PASSWORD_RECOVERY_TOKEN_ERROR = "Invalid token";
function createUser(connection, input) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            user_1.CreateUserValidator.validateSync(input);
        }
        catch ({ errors }) {
            throw new apollo_server_core_1.UserInputError(utils_1.INVALID_INPUT_ERROR_TITLE, { errors });
        }
        return yield typeorm_1.dbCreateUser(connection, input);
    });
}
exports.createUser = createUser;
function login(connection, _a) {
    var { password } = _a, input = tslib_1.__rest(_a, ["password"]);
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!(input.email || input.username)) {
            throw new apollo_server_core_1.UserInputError(exports.INVALID_LOGIN_INPUT_ERROR);
        }
        const user = yield typeorm_1.dbLogin(connection, input);
        if (!user) {
            throw new apollo_server_core_1.UserInputError(exports.INVALID_LOGIN_INPUT_ERROR);
        }
        if (!utils_1.verifyHashSync(password, user.credential.encryptedToken)) {
            throw new apollo_server_core_1.UserInputError(exports.INVALID_LOGIN_INPUT_ERROR);
        }
        return user;
    });
}
exports.login = login;
const DEFAULT_PASSWORD_TOKEN_EXPIRATION = "24 hours";
function getPasswordRecoveryToken(connection, email, expiresIn = DEFAULT_PASSWORD_TOKEN_EXPIRATION) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const user = yield typeorm_1.dbGetUserByEmail(connection, email);
        if (user) {
            return jwt_1.idToJwt(user.id, expiresIn);
        }
        return null;
    });
}
exports.getPasswordRecoveryToken = getPasswordRecoveryToken;
function resetPassword(connection, { token, password }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            user_1.makePasswordValidator().validateSync(password);
        }
        catch ({ errors }) {
            throw new apollo_server_core_1.UserInputError(utils_1.INVALID_INPUT_ERROR_TITLE, { errors });
        }
        let user;
        try {
            user = yield jwt_1.userFromJwt(connection, token);
        }
        catch (e) {
            return false;
        }
        if (!user) {
            return false;
        }
        return yield typeorm_1.dbUpdateCredential(connection, { user_id: user.id }, { encryptedToken: utils_1.hashSync(password) });
    });
}
exports.resetPassword = resetPassword;
