import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult } from 'typeorm';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UserIsOwnerCommentGuard } from './guard/userIsOwnerComment.guard';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { CommentsResponseInterface } from './types/commentsResponse.interface';

@Controller('*cards/:cardId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @CurrentUser() currentUser: UserEntity,
    @Param('cardId', new ParseIntPipe()) cardId: number,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.createComment(
      currentUser,
      cardId,
      createCommentDto,
    );
    return this.commentService.buildResponse(comment);
  }

  @Get()
  async getAllComments(
    @Param('cardId', new ValidationPipe()) cardId: number,
  ): Promise<CommentsResponseInterface> {
    const comments = await this.commentService.getAllComments(cardId);
    return this.commentService.buildResponseAllComments(comments);
  }

  @Get(':commentId')
  async getCommentById(
    @Param('commentId', new ParseIntPipe()) commentId: number,
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.getCommentById(cardId, commentId);
    return this.commentService.buildResponse(comment);
  }

  @Put(':commentId')
  @UseGuards(AuthGuard, UserIsOwnerCommentGuard)
  @UsePipes(new ValidationPipe())
  async updateComment(
    @Param('commentId', new ParseIntPipe()) commentId: number,
    @Param('cardId', new ParseIntPipe()) cardId: number,
    @Body('comment') updateCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.updateComment(
      commentId,
      cardId,
      updateCommentDto,
    );
    return this.commentService.buildResponse(comment);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard, UserIsOwnerCommentGuard)
  async deleteComment(
    @Param('commentId', new ParseIntPipe()) commentId: number,
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<DeleteResult> {
    return await this.commentService.deleteComment(commentId, cardId);
  }
}
