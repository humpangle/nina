"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class initial1555747115033 {
    up(queryRunner) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('CREATE EXTENSION IF NOT EXISTS "citext";');
            yield queryRunner.query(`CREATE TABLE "credentials"
        (
            "id" SERIAL NOT NULL,
            "source" character varying,
            "encrypted_token" character varying NOT NULL,
            "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "user_id" integer,
            
            CONSTRAINT "REL_c68a6c53e95a7dc357f4ebce8f" UNIQUE ("user_id"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id")
        )`);
            yield queryRunner.query(`CREATE TABLE "users"
        (
            "id" SERIAL NOT NULL,
            "username" citext NOT NULL,
            "email" character varying NOT NULL,
            "first_name" character varying,
            "last_name" character varying,
            "inserted_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            
            CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        )`);
            yield queryRunner.query(`ALTER TABLE "credentials"
        ADD CONSTRAINT "FK_c68a6c53e95a7dc357f4ebce8f0"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "credentials"
        DROP CONSTRAINT "FK_c68a6c53e95a7dc357f4ebce8f0"`);
            yield queryRunner.query(`DROP TABLE "users"`);
            yield queryRunner.query(`DROP TABLE "credentials"`);
        });
    }
}
exports.initial1555747115033 = initial1555747115033;
