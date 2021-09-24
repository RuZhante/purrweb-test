import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UserIsOwnerCommentGuard } from './guard/userIsOwnerComment.guard';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { CommentsResponseInterface } from './types/commentsResponse.interface';

@ApiTags('comments')
@Controller('*cards/:cardId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create comment.',
    type: CommentEntity,
  })
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @CurrentUser() currentUser: UserEntity,
    @Param('cardId', new ParseIntPipe()) cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.createComment(
      currentUser,
      cardId,
      createCommentDto,
    );
    return this.commentService.buildResponse(comment);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all comments.',
    type: [CommentEntity],
  })
  async getAllComments(
    @Param('cardId', new ValidationPipe()) cardId: number,
  ): Promise<CommentsResponseInterface> {
    const comments = await this.commentService.getAllComments(cardId);
    return this.commentService.buildResponseAllComments(comments);
  }

  @Get(':commentId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get comment by ID.',
    type: CommentEntity,
  })
  async getCommentById(
    @Param('commentId', new ParseIntPipe()) commentId: number,
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.getCommentById(cardId, commentId);
    return this.commentService.buildResponse(comment);
  }

  @Put(':commentId')
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update comment.',
    type: CommentEntity,
  })
  @UseGuards(AuthGuard, UserIsOwnerCommentGuard)
  @UsePipes(new ValidationPipe())
  async updateComment(
    @Param('commentId', new ParseIntPipe()) commentId: number,
    @Param('cardId', new ParseIntPipe()) cardId: number,
    @Body() updateCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.updateComment(
      commentId,
      cardId,
      updateCommentDto,
    );
    return this.commentService.buildResponse(comment);
  }

  @Delete(':commentId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete comment.',
  })
  @UseGuards(AuthGuard, UserIsOwnerCommentGuard)
  async deleteComment(
    @Param('commentId', new ParseIntPipe()) commentId: number,
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<DeleteResult> {
    return await this.commentService.deleteComment(commentId, cardId);
  }
}
