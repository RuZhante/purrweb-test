import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ColumnService } from '../column.service';

@Injectable()
export class UserIsOwnerColumnGuard implements CanActivate {
  constructor(private readonly columnService: ColumnService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const columnId = request.params.id;
    const currentUserId = request.user.id;

    const currentColumn = await this.columnService.findById(columnId);

    if (currentUserId === currentColumn.user.id) {
      return true;
    }

    throw new HttpException('Forbidden resource!', HttpStatus.FORBIDDEN);
  }
}
