import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1656032871844 implements MigrationInterface {
    name = 'CreateUsersTable1656032871844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "name" character varying(30) NOT NULL, "email" character varying(60) NOT NULL, "password" character varying(30) NOT NULL, "signUpVerifyToken" character varying(60) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
