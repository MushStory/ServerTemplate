import {MigrationInterface, QueryRunner} from 'typeorm';

export class modifyUsersPasswordLength1685906619753 implements MigrationInterface {
  name = 'modifyUsersPasswordLength1685906619753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Users\` MODIFY \`password\` varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Users\` MODIFY \`password\` varchar(20)`);
  }
}
