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
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/createColumn.dto';
import { UserIsOwnerColumnGuard } from './guards/userIsOwnerColumn.guard';
import { ColumnResponseInterface } from './types/columnResponse.interface';
import { ColumnsResponseInterface } from './types/columnsResponse.interface';

@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createColumn(
    @CurrentUser() currentUser: UserEntity,
    @Body('column') createColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseInterface> {
    const column = await this.columnService.createColumn(
      currentUser,
      createColumnDto,
    );

    return this.columnService.buildResponse(column);
  }

  @Get()
  async getAllColumns(): Promise<ColumnsResponseInterface> {
    const columns = await this.columnService.getAllColumns();
    return this.columnService.buildResponseAllColumns(columns);
  }

  @Get(':id')
  async getColumnById(
    @Param('id', ParseIntPipe) columnId: number,
  ): Promise<ColumnResponseInterface> {
    const column = await this.columnService.getColumnById(columnId);
    return this.columnService.buildResponse(column);
  }

  @Put(':id')
  @UseGuards(AuthGuard, UserIsOwnerColumnGuard)
  @UsePipes(new ValidationPipe())
  async updateColumn(
    @Param('id', ParseIntPipe) columnId: number,
    @Body('column') updateColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseInterface> {
    const column = await this.columnService.updateColumn(
      columnId,
      updateColumnDto,
    );
    return this.columnService.buildResponse(column);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, UserIsOwnerColumnGuard)
  async deleteColumn(@Param('id') columnId: number): Promise<DeleteResult> {
    return await this.columnService.deleteColumn(columnId);
  }
}
