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
import { CardService } from './card.service';
import { CreateCardDto } from './dto/createCard.dto';
import { UserIsOwnerCardGuard } from './guard/userIsOwnerCard.guard';
import { CardResponseInterface } from './types/cardResponse.interface';
import { CardsResponseInterface } from './types/cardsResponse.interface';

@Controller('columns/:columnId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createCard(
    @Param('columnId', new ParseIntPipe()) columnId: number,
    @Body('card') createCardDto: CreateCardDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CardResponseInterface> {
    const card = await this.cardService.createCard(
      columnId,
      currentUser,
      createCardDto,
    );
    return this.cardService.buildResponse(card);
  }

  @Get(':cardId')
  async getCardById(
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<CardResponseInterface> {
    const card = await this.cardService.getCardById(cardId);
    return this.cardService.buildResponse(card);
  }

  @Get()
  async getAllCards(): Promise<CardsResponseInterface> {
    const cards = await this.cardService.getAllCards();
    return this.cardService.buildResponseAllCards(cards);
  }

  @Put(':cardId')
  @UseGuards(AuthGuard, UserIsOwnerCardGuard)
  @UsePipes(new ValidationPipe())
  async updateCard(
    @Param('cardId', new ParseIntPipe()) cardId: number,
    @Body('card') updateCardDto: CreateCardDto,
  ): Promise<CardResponseInterface> {
    const card = await this.cardService.updateCard(cardId, updateCardDto);
    return this.cardService.buildResponse(card);
  }

  @Delete(':cardId')
  @UseGuards(AuthGuard, UserIsOwnerCardGuard)
  async deleteCard(
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<DeleteResult> {
    return await this.cardService.deleteCard(cardId);
  }
}
