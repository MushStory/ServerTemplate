import {MigrationInterface, QueryRunner} from 'typeorm';

export class addUsersTable1685883611612 implements MigrationInterface {
  name = 'addUsersTable1685883611612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Users\` (\`id\` varchar(255) NOT NULL, \`password\` varchar(20) NOT NULL, \`refreshToken\` varchar(255) NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`Users\``);
  }
}
