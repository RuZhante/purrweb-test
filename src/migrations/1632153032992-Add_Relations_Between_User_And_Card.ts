import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsBetweenUserAndCard1632153032992
  implements MigrationInterface
{
  name = 'AddRelationsBetweenUserAndCard1632153032992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."cards" ADD "userId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."cards" ADD CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."cards" DROP CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."cards" DROP COLUMN "userId"`,
    );
  }
}
