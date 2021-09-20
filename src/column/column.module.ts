import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnController } from './column.controller';
import { ColumnEntity } from './column.entity';
import { ColumnService } from './column.service';
import { UserIsOwnerColumnGuard } from './guards/userIsOwnerColumn.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity])],
  controllers: [ColumnController],
  providers: [ColumnService, UserIsOwnerColumnGuard],
  exports: [ColumnService],
})
export class ColumnModule {}
