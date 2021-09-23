import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnEntity } from 'src/column/column.entity';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CardEntity } from './card.entity';
import { CreateCardDto } from './dto/createCard.dto';
import { CardResponseInterface } from './types/cardResponse.interface';
import { CardsResponseInterface } from './types/cardsResponse.interface';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async createCard(
    columnId: number,
    currentUser: UserEntity,
    createCardDto: CreateCardDto,
  ): Promise<CardEntity> {
    const card = new CardEntity();
    Object.assign(card, createCardDto);
    const colunm = await this.columnRepository.findOne(columnId);
    card.column = colunm;
    card.user = currentUser;
    return await this.cardRepository.save(card);
  }

  async getCardById(cardId: number): Promise<CardEntity> {
    const card = await this.cardRepository.findOne(cardId);
    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return card;
  }

  async getAllCards(): Promise<CardEntity[]> {
    return await this.cardRepository.find();
  }

  async updateCard(
    cardId: number,
    updateCardDto: CreateCardDto,
  ): Promise<CardEntity> {
    const card = await this.getCardById(cardId);

    if (!card) {
      throw new HttpException(
        'Card does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    Object.assign(card, updateCardDto);
    return await this.cardRepository.save(card);
  }

  async deleteCard(cardId: number): Promise<DeleteResult> {
    return await this.cardRepository.delete({ id: cardId });
  }

  buildResponse(card: CardEntity): CardResponseInterface {
    return { card };
  }

  buildResponseAllCards(cards: CardEntity[]): CardsResponseInterface {
    return { cards };
  }
}
