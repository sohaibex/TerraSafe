import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1701644071567 implements MigrationInterface {
    name = 'UpdateUserTable1701644071567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`ice\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_3e2c6f039fad0e7a9c24e04380\` (\`ice\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_3e2c6f039fad0e7a9c24e04380\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`ice\``);
    }

}
