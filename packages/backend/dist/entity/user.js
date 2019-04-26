"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_1 = require("../data/user");
const utils_1 = require("./utils");
exports.UserEntity = new typeorm_1.EntitySchema({
    name: "User",
    tableName: user_1.userTableName,
    columns: Object.assign({}, utils_1.IdEntity, { username: {
            type: "citext",
            name: user_1.userEntityColumnMapping.username,
            unique: true
        }, email: {
            type: String,
            name: user_1.userEntityColumnMapping.email,
            unique: true
        }, firstName: {
            type: String,
            name: user_1.userEntityColumnMapping.firstName,
            nullable: true
        }, lastName: {
            type: String,
            name: user_1.userEntityColumnMapping.lastName,
            nullable: true
        } }, utils_1.TimestampsEntity),
    relations: {
        credential: {
            type: "one-to-one",
            target: "Credential",
            lazy: true
        }
    }
});
