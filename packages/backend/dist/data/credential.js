"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.credentialEntityColumnMapping = Object.assign({ id: "id", source: "source", encryptedToken: "encrypted_token", user: "user_id" }, utils_1.timestamps);
exports.credentialTableName = "credentials";
