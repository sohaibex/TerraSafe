import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1697211166645 implements MigrationInterface {
    name = 'CreateAllTables1697211166645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`property_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`type\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`url\` varchar(255) NOT NULL, \`type\` enum ('images', 'attachments', 'floorPlans') NOT NULL, \`description\` text NULL, \`uploadedById\` int NULL, \`propertyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exteriors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`type\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`code\` int NOT NULL, \`name\` varchar(240) NOT NULL, \`arabicName\` varchar(240) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`districts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`code\` int NOT NULL, \`name\` varchar(240) NOT NULL, \`arabicName\` varchar(240) NOT NULL, \`cityId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`address\` varchar(255) NOT NULL, \`aptSuite\` varchar(255) NULL, \`zip\` varchar(255) NOT NULL, \`districtId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contacts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`property_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`properties\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` enum ('RENT', 'SELL') NOT NULL, \`size\` int NOT NULL, \`videoUrl\` varchar(255) NOT NULL, \`vrTourUrl\` varchar(255) NOT NULL, \`price\` decimal NOT NULL, \`rooms\` int NOT NULL, \`bedrooms\` int NOT NULL, \`bathrooms\` int NOT NULL, \`livingSpaceSize\` int NOT NULL, \`landSize\` int NOT NULL, \`furnished\` tinyint NOT NULL, \`latitude\` decimal(9,6) NOT NULL, \`longitude\` decimal(9,6) NOT NULL, \`userId\` int NULL, \`propertyTypeId\` int NULL, \`locationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pricing\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`stripeProductId\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`amount\` decimal NOT NULL, \`currency\` varchar(255) NOT NULL, \`interval\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`features\` json NULL, \`status\` tinyint NULL, \`created\` timestamp NOT NULL, \`validFrom\` timestamp NULL, \`validTo\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`stripePaymentId\` varchar(255) NOT NULL, \`customerId\` varchar(255) NOT NULL, \`customerEmail\` varchar(255) NOT NULL, \`amountTotal\` decimal NOT NULL, \`currency\` varchar(255) NOT NULL, \`paymentStatus\` varchar(255) NOT NULL, \`cardBrand\` varchar(255) NOT NULL, \`billingDetails\` json NULL, \`promoCode\` varchar(255) NULL, \`discountAmount\` decimal NULL, \`pricingId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`firebaseUid\` varchar(255) NOT NULL, \`username\` varchar(200) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('user', 'agency', 'admin') NOT NULL DEFAULT 'user', \`fullName\` varchar(255) NULL, \`phoneNumber\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`agencyName\` varchar(255) NULL, \`agencyDescription\` varchar(255) NULL, \`stripeCustomerId\` varchar(255) NULL, UNIQUE INDEX \`IDX_e621f267079194e5428e19af2f\` (\`firebaseUid\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`properties_exteriors_exteriors\` (\`propertiesId\` int NOT NULL, \`exteriorsId\` int NOT NULL, INDEX \`IDX_6d3f0089f1546c347f2dd94b7b\` (\`propertiesId\`), INDEX \`IDX_b6603c2fb5b1ff037c1e6f24fd\` (\`exteriorsId\`), PRIMARY KEY (\`propertiesId\`, \`exteriorsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_4974d31d47717ebefc8b613eb27\` FOREIGN KEY (\`uploadedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_002dc9026d4ae43dea33ab15e13\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`districts\` ADD CONSTRAINT \`FK_65f489c5687887adeeb14b87df7\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD CONSTRAINT \`FK_89e09cf52a27eec4a04378bbdda\` FOREIGN KEY (\`districtId\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contacts\` ADD CONSTRAINT \`FK_cfdd2d226dd6d010cdf282ad48e\` FOREIGN KEY (\`property_id\`) REFERENCES \`properties\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`properties\` ADD CONSTRAINT \`FK_6b55a80fd17a5bb77b753635496\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`properties\` ADD CONSTRAINT \`FK_3e26ce84675ec56ba2e81f9a8bb\` FOREIGN KEY (\`propertyTypeId\`) REFERENCES \`property_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`properties\` ADD CONSTRAINT \`FK_90530c354a71778dd06739fbf9c\` FOREIGN KEY (\`locationId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_38a2e30d4fab9ad49651cfe3f54\` FOREIGN KEY (\`pricingId\`) REFERENCES \`pricing\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_b046318e0b341a7f72110b75857\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`properties_exteriors_exteriors\` ADD CONSTRAINT \`FK_6d3f0089f1546c347f2dd94b7bf\` FOREIGN KEY (\`propertiesId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`properties_exteriors_exteriors\` ADD CONSTRAINT \`FK_b6603c2fb5b1ff037c1e6f24fd4\` FOREIGN KEY (\`exteriorsId\`) REFERENCES \`exteriors\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`properties_exteriors_exteriors\` DROP FOREIGN KEY \`FK_b6603c2fb5b1ff037c1e6f24fd4\``);
        await queryRunner.query(`ALTER TABLE \`properties_exteriors_exteriors\` DROP FOREIGN KEY \`FK_6d3f0089f1546c347f2dd94b7bf\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_b046318e0b341a7f72110b75857\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_38a2e30d4fab9ad49651cfe3f54\``);
        await queryRunner.query(`ALTER TABLE \`properties\` DROP FOREIGN KEY \`FK_90530c354a71778dd06739fbf9c\``);
        await queryRunner.query(`ALTER TABLE \`properties\` DROP FOREIGN KEY \`FK_3e26ce84675ec56ba2e81f9a8bb\``);
        await queryRunner.query(`ALTER TABLE \`properties\` DROP FOREIGN KEY \`FK_6b55a80fd17a5bb77b753635496\``);
        await queryRunner.query(`ALTER TABLE \`contacts\` DROP FOREIGN KEY \`FK_cfdd2d226dd6d010cdf282ad48e\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_89e09cf52a27eec4a04378bbdda\``);
        await queryRunner.query(`ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_65f489c5687887adeeb14b87df7\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_002dc9026d4ae43dea33ab15e13\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_4974d31d47717ebefc8b613eb27\``);
        await queryRunner.query(`DROP INDEX \`IDX_b6603c2fb5b1ff037c1e6f24fd\` ON \`properties_exteriors_exteriors\``);
        await queryRunner.query(`DROP INDEX \`IDX_6d3f0089f1546c347f2dd94b7b\` ON \`properties_exteriors_exteriors\``);
        await queryRunner.query(`DROP TABLE \`properties_exteriors_exteriors\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_e621f267079194e5428e19af2f\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP TABLE \`pricing\``);
        await queryRunner.query(`DROP TABLE \`properties\``);
        await queryRunner.query(`DROP TABLE \`contacts\``);
        await queryRunner.query(`DROP TABLE \`address\``);
        await queryRunner.query(`DROP TABLE \`districts\``);
        await queryRunner.query(`DROP TABLE \`cities\``);
        await queryRunner.query(`DROP TABLE \`exteriors\``);
        await queryRunner.query(`DROP TABLE \`media\``);
        await queryRunner.query(`DROP TABLE \`property_types\``);
    }

}
