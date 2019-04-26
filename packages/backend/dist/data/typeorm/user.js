"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_1 = require("../../entity/user");
const credential_1 = require("../../entity/credential");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
function getUserRepo(connection) {
    return connection.getRepository(user_1.UserEntity);
}
function getCredentialRepo(connection) {
    return connection.getRepository(credential_1.CredentialEntity);
}
function createUser(connection, _a) {
    var { password } = _a, input = tslib_1.__rest(_a, ["password"]);
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield getUserRepo(connection).save(input);
            const repo = getCredentialRepo(connection);
            const credential = (yield repo.save({
                encryptedToken: utils_1.hashSync(password)
            }));
            yield repo
                .createQueryBuilder()
                .relation("Credential", "user")
                .of(credential)
                .set(user.id);
            credential.encryptedToken = null;
            user.credential = credential;
            return user;
        }
        catch (error) {
            throw new Error(utils_2.normalizeDbError(error.detail));
        }
    });
}
exports.createUser = createUser;
function login(connection, args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let where = "";
        Object.entries(args).forEach(([key, v]) => {
            if (v) {
                const q = `user.${key}=:${key}`;
                if (where === "") {
                    where = q;
                }
                else {
                    where += ` AND ${q}`;
                }
            }
        });
        let query = getCredentialRepo(connection)
            .createQueryBuilder("credential")
            .leftJoinAndSelect("credential.user", "user")
            .where(where, args);
        let credential = yield query.getOne();
        query = null;
        if (credential) {
            const user = Object.assign({}, credential.__user__);
            if (user) {
                delete credential.__user__;
                user.credential = credential;
                return user;
            }
        }
        return null;
    });
}
exports.login = login;
function getUserById(connection, id) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return getUserRepo(connection).findOne(id);
    });
}
exports.getUserById = getUserById;
function getUserByEmail(connection, email) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return getUserRepo(connection)
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
    });
}
exports.getUserByEmail = getUserByEmail;
// export function getCredentialByUserId(connection: Connection, userId: ID) {
//   return getCredentialRepo(connection)
//     .createQueryBuilder("credential")
//     .where("credential.user_id = :userId", { userId })
//     .getOne();
// }
function updateCredential(connection, whereArgs, updateArgs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const where = Object.keys(whereArgs).reduce((acc, key) => {
            const k = `${key} = :${key}`;
            if (acc === "") {
                return k;
            }
            return `${acc} AND ${k}`;
        }, "");
        const { raw } = yield getCredentialRepo(connection)
            .createQueryBuilder()
            .update(credential_1.CredentialEntity)
            .set(updateArgs)
            .where(where, whereArgs)
            .returning(Object.keys(updateArgs))
            .execute();
        return raw.length === 0 ? false : true;
    });
}
exports.updateCredential = updateCredential;
