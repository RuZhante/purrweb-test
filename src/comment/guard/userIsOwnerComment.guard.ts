import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CommentService } from '../comment.service';

@Injectable()
export class UserIsOwnerCommentGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params.commentId;
    const currentUserId = request.user.id;
    const currentComment = await this.commentService.findCommentById(commentId);

    if (currentUserId === currentComment.user.id) {
      return true;
    }

    throw new HttpException('Forbidden resource!', HttpStatus.FORBIDDEN);
  }
}
