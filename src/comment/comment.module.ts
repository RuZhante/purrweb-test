import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/card.entity';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { UserIsOwnerCommentGuard } from './guard/userIsOwnerComment.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, CardEntity])],
  controllers: [CommentController],
  providers: [CommentService, UserIsOwnerCommentGuard],
  exports: [CommentService],
})
export class CommentModule {}
