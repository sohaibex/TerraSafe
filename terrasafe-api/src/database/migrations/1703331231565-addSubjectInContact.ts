import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubjectInContact1703331231565 implements MigrationInterface {
    name = 'AddSubjectInContact1703331231565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contacts\` ADD \`subject\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contacts\` DROP COLUMN \`subject\``);
    }

}
