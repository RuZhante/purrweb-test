import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { CreateColumnDto } from './dto/createColumn.dto';
import { ColumnResponseInterface } from './types/columnResponse.interface';
import { ColumnsResponseInterface } from './types/columnsResponse.interface';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async createColumn(
    currentUser: UserEntity,
    createColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    const column = new ColumnEntity();
    Object.assign(column, createColumnDto);
    column.user = currentUser;
    return await this.columnRepository.save(column);
  }

  async getColumnById(columnId: number): Promise<ColumnEntity> {
    return await this.columnRepository.findOne(columnId);
  }

  async getAllColumns(): Promise<ColumnEntity[]> {
    return await this.columnRepository.find();
  }

  async updateColumn(
    columnId: number,
    updateColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    const column = await this.columnRepository.findOne(columnId);
    Object.assign(column, updateColumnDto);
    return await this.columnRepository.save(column);
  }

  async deleteColumn(columnId: number): Promise<DeleteResult> {
    return await this.columnRepository.delete({ id: columnId });
  }

  async findById(columnId: number): Promise<ColumnEntity> {
    return await this.columnRepository.findOne(columnId);
  }

  buildResponse(column: ColumnEntity): ColumnResponseInterface {
    return { column };
  }
  buildResponseAllColumns(columns: ColumnEntity[]): ColumnsResponseInterface {
    return { columns };
  }
}
