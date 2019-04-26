"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const credential_1 = require("../data/credential");
const utils_1 = require("./utils");
exports.CredentialEntity = new typeorm_1.EntitySchema({
    name: "Credential",
    tableName: credential_1.credentialTableName,
    columns: Object.assign({}, utils_1.IdEntity, { source: {
            type: String,
            name: credential_1.credentialEntityColumnMapping.source,
            nullable: true
        }, encryptedToken: {
            type: String,
            name: credential_1.credentialEntityColumnMapping.encryptedToken
        } }, utils_1.TimestampsEntity),
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            lazy: true,
            persistence: false,
            onDelete: "CASCADE",
            joinColumn: {
                name: credential_1.credentialEntityColumnMapping.user
            }
        }
    }
});
