"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_nodejs_1 = tslib_1.__importDefault(require("bcrypt-nodejs"));
exports.timestamps = {
    updatedAt: "updated_at",
    insertedAt: "inserted_at"
};
function hashSync(token) {
    return bcrypt_nodejs_1.default.hashSync(token, bcrypt_nodejs_1.default.genSaltSync(8));
}
exports.hashSync = hashSync;
function verifyHashSync(token, tokenHash) {
    return bcrypt_nodejs_1.default.compareSync(token, tokenHash);
}
exports.verifyHashSync = verifyHashSync;
exports.INVALID_INPUT_ERROR_TITLE = "invalid input";
