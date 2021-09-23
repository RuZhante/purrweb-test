import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from 'src/column/column.entity';
import { CardController } from './card.controller';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { UserIsOwnerCardGuard } from './guard/userIsOwnerCard.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity, ColumnEntity])],
  controllers: [CardController],
  providers: [CardService, UserIsOwnerCardGuard],
  exports: [CardService],
})
export class CardModule {}
