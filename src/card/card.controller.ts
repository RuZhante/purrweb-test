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
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/createCard.dto';
import { UserIsOwnerCardGuard } from './guard/userIsOwnerCard.guard';
import { CardResponseInterface } from './types/cardResponse.interface';
import { CardsResponseInterface } from './types/cardsResponse.interface';

@ApiTags('cards')
@Controller('columns/:columnId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create card.',
    type: CardEntity,
  })
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createCard(
    @Param('columnId', new ParseIntPipe()) columnId: number,
    @Body() createCardDto: CreateCardDto,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get card by ID.',
    type: CardEntity,
  })
  async getCardById(
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<CardResponseInterface> {
    const card = await this.cardService.getCardById(cardId);
    return this.cardService.buildResponse(card);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all cards.',
    type: [CardEntity],
  })
  async getAllCards(): Promise<CardsResponseInterface> {
    const cards = await this.cardService.getAllCards();
    return this.cardService.buildResponseAllCards(cards);
  }

  @Put(':cardId')
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update card.',
    type: CardEntity,
  })
  @UseGuards(AuthGuard, UserIsOwnerCardGuard)
  @UsePipes(new ValidationPipe())
  async updateCard(
    @Param('cardId', new ParseIntPipe()) cardId: number,
    @Body() updateCardDto: CreateCardDto,
  ): Promise<CardResponseInterface> {
    const card = await this.cardService.updateCard(cardId, updateCardDto);
    return this.cardService.buildResponse(card);
  }

  @Delete(':cardId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete card.',
  })
  @UseGuards(AuthGuard, UserIsOwnerCardGuard)
  async deleteCard(
    @Param('cardId', new ParseIntPipe()) cardId: number,
  ): Promise<DeleteResult> {
    return await this.cardService.deleteCard(cardId);
  }
}
