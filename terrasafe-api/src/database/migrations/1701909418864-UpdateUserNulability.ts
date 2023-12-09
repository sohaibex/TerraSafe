import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserNulability1701909418864 implements MigrationInterface {
    name = 'UpdateUserNulability1701909418864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`ice\` \`ice\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`address\` \`address\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`address\` \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`ice\` \`ice\` varchar(255) NOT NULL`);
    }

}
