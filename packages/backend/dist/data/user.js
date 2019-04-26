"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Yup = tslib_1.__importStar(require("yup"));
const utils_1 = require("./utils");
var userDataLen;
(function (userDataLen) {
    userDataLen[userDataLen["usernameMin"] = 3] = "usernameMin";
    userDataLen[userDataLen["usernameMax"] = 15] = "usernameMax";
    userDataLen[userDataLen["passwordMin"] = 5] = "passwordMin";
    userDataLen[userDataLen["passwordMax"] = 20] = "passwordMax";
})(userDataLen = exports.userDataLen || (exports.userDataLen = {}));
exports.userEntityColumnMapping = Object.assign({ id: "id", username: "username", email: "email", firstName: "first_name", lastName: "last_name" }, utils_1.timestamps);
exports.userTableName = "users";
exports.PASSWORD_TOO_SHORT_ERROR = "must be at least 5 characters";
// tslint:disable-next-line: no-any
function makePasswordValidator(errorMessage) {
    return Yup.string()
        .required(errorMessage && errorMessage.required)
        .min(userDataLen.passwordMin, (errorMessage && errorMessage.min) || exports.PASSWORD_TOO_SHORT_ERROR)
        .max(userDataLen.passwordMax, errorMessage && errorMessage.max);
}
exports.makePasswordValidator = makePasswordValidator;
function makeCreateUserSchemaDefinition(
// tslint:disable-next-line: no-any
errorMessages = {}) {
    return {
        username: Yup.string()
            .required(errorMessages.username && errorMessages.username.required)
            .min(userDataLen.usernameMin, errorMessages.username &&
            (errorMessages.username.min || errorMessages.username.required))
            .max(userDataLen.usernameMax, errorMessages.username &&
            (errorMessages.username.max || errorMessages.username.required)),
        email: Yup.string()
            .required(errorMessages.email && errorMessages.email.required)
            .email(errorMessages.email &&
            (errorMessages.email.email || errorMessages.email.required)),
        firstName: Yup.string(),
        lastName: Yup.string(),
        password: makePasswordValidator(errorMessages.password)
    };
}
exports.makeCreateUserSchemaDefinition = makeCreateUserSchemaDefinition;
exports.CreateUserValidator = Yup.object().shape(makeCreateUserSchemaDefinition());
