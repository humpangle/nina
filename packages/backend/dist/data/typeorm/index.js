"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
exports.dbCreateUser = user_1.createUser;
exports.dbLogin = user_1.login;
exports.dbGetUserById = user_1.getUserById;
exports.dbGetUserByEmail = user_1.getUserByEmail;
// getCredentialByUserId as dbGetCredentialByUserId,
exports.dbUpdateCredential = user_1.updateCredential;
