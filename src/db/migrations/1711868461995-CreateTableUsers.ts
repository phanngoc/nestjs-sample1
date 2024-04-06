import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableUsers1711868461995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'email', type: 'varchar', isUnique: true },
                { name: 'password', type: 'varchar', isNullable: false },
                { name: 'refresh_token', type: 'varchar', isNullable: true },
                { name: 'first_name', type: 'varchar', isNullable: false },
                { name: 'last_name', type: 'varchar', isNullable: false },
                { name: 'created_at', type: 'timestamp', default: 'now()' },
                { name: 'updated_at', type: 'timestamp', default: 'now()' },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
