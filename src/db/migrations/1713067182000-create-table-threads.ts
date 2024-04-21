import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableThreads1713067182000 implements MigrationInterface {
    name = 'CreateTableThreads1713067182000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "thread_users_users" ("threadId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_e871c9ff02425fe2589f4e57a24" PRIMARY KEY ("threadId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c9900d630e3927423abbbbe00c" ON "thread_users_users" ("threadId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f823088d0ffd071daeb3c5913" ON "thread_users_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "identity" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_b635d2aa252f3eb7c348ca2daf9" UNIQUE ("identity")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "thread_users_users" ADD CONSTRAINT "FK_c9900d630e3927423abbbbe00ce" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "thread_users_users" ADD CONSTRAINT "FK_2f823088d0ffd071daeb3c59134" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread_users_users" DROP CONSTRAINT "FK_2f823088d0ffd071daeb3c59134"`);
        await queryRunner.query(`ALTER TABLE "thread_users_users" DROP CONSTRAINT "FK_c9900d630e3927423abbbbe00ce"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_b635d2aa252f3eb7c348ca2daf9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "identity"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f823088d0ffd071daeb3c5913"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9900d630e3927423abbbbe00c"`);
        await queryRunner.query(`DROP TABLE "thread_users_users"`);
    }

}
