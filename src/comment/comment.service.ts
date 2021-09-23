import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/card.entity';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { CommentsResponseInterface } from './types/commentsResponse.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  async createComment(
    currentUser: UserEntity,
    cardId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const comment = new CommentEntity();
    Object.assign(comment, createCommentDto);
    const card = await this.cardRepository.findOne(cardId);

    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    comment.card = card;
    comment.user = currentUser;
    return await this.commentRepository.save(comment);
  }

  async getAllComments(cardId: number): Promise<CommentEntity[]> {
    const card = await this.cardRepository.findOne(cardId);

    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.commentRepository.find({
      where: { card: { id: cardId } },
    });
  }

  async getCommentById(
    cardId: number,
    commentId: number,
  ): Promise<CommentEntity> {
    const card = await this.cardRepository.findOne(cardId);

    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.commentRepository.findOne(commentId);
  }

  async updateComment(
    commentId: number,
    cardId: number,
    updateCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const card = await this.cardRepository.findOne(cardId);

    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const comment = await this.commentRepository.findOne(commentId);

    if (!comment) {
      throw new HttpException(
        'Comment does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async deleteComment(
    commentId: number,
    cardId: number,
  ): Promise<DeleteResult> {
    const card = await this.cardRepository.findOne(cardId);

    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.commentRepository.delete({ id: commentId });
  }

  async findCommentById(commentId: number): Promise<CommentEntity> {
    return await this.commentRepository.findOne(commentId);
  }

  buildResponse(comment: CommentEntity): CommentResponseInterface {
    return { comment };
  }

  buildResponseAllComments(
    comments: CommentEntity[],
  ): CommentsResponseInterface {
    return { comments };
  }
}
