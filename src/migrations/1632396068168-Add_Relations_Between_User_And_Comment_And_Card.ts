import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenUserAndCommentAndCard1632396068168 implements MigrationInterface {
    name = 'AddRelationsBetweenUserAndCommentAndCard1632396068168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD "cardId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."comments" ADD CONSTRAINT "FK_e0d58e922daf1775d69a9965ad0" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP CONSTRAINT "FK_e0d58e922daf1775d69a9965ad0"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP COLUMN "cardId"`);
        await queryRunner.query(`ALTER TABLE "public"."comments" DROP COLUMN "userId"`);
    }

}
