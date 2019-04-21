import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1555747115033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "citext";');

    await queryRunner.query(
      `CREATE TABLE "credentials"
        (
            "id" SERIAL NOT NULL,
            "source" character varying,
            "encrypted_token" character varying NOT NULL,
            "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "user_id" integer,
            
            CONSTRAINT "REL_c68a6c53e95a7dc357f4ebce8f" UNIQUE ("user_id"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id")
        )`
    );

    await queryRunner.query(
      `CREATE TABLE "users"
        (
            "id" SERIAL NOT NULL,
            "username" citext NOT NULL,
            "email" character varying NOT NULL,
            "first_name" character varying,
            "last_name" character varying,
            "inserted_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            
            CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        )`
    );

    await queryRunner.query(
      `ALTER TABLE "credentials"
        ADD CONSTRAINT "FK_c68a6c53e95a7dc357f4ebce8f0"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "credentials"
        DROP CONSTRAINT "FK_c68a6c53e95a7dc357f4ebce8f0"`
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "credentials"`);
  }
}
