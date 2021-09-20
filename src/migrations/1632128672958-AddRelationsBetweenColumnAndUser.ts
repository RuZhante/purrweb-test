import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenColumnAndUser1632128672958 implements MigrationInterface {
    name = 'AddRelationsBetweenColumnAndUser1632128672958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."columns" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."columns" ADD CONSTRAINT "FK_43dea26ad518ea50c5a45c17724" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."columns" DROP CONSTRAINT "FK_43dea26ad518ea50c5a45c17724"`);
        await queryRunner.query(`ALTER TABLE "public"."columns" DROP COLUMN "userId"`);
    }

}
