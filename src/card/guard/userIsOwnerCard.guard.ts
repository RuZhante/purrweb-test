import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CardService } from '../card.service';

@Injectable()
export class UserIsOwnerCardGuard implements CanActivate {
  constructor(private readonly cardService: CardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cardId = request.params.cardId;
    const currentUserId = request.user.id;
    const currentCard = await this.cardService.getCardById(cardId);

    if (currentUserId === currentCard.user.id) {
      return true;
    }

    throw new HttpException('Forbidden resource!', HttpStatus.FORBIDDEN);
  }
}
