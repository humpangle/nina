"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const models_1 = require("./models");
const SECRET = process.env.SECRET || "";
// istanbul ignore next
if (!SECRET || SECRET.length < 3) {
    throw new Error('Invalid "SECRET" key');
}
function userFromJwt(connection, token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { id: id } = (yield jsonwebtoken_1.default.verify(token, SECRET));
        return yield models_1.getUserById(connection, id);
    });
}
exports.userFromJwt = userFromJwt;
const DEFAULT_JWT_EXPIRATION = "30 days";
function idToJwt(id, expiresIn = DEFAULT_JWT_EXPIRATION) {
    return jsonwebtoken_1.default.sign({ id: "" + id }, SECRET, { expiresIn });
}
exports.idToJwt = idToJwt;
