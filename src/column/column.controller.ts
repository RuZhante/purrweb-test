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
import { ColumnEntity } from './column.entity';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/createColumn.dto';
import { UserIsOwnerColumnGuard } from './guards/userIsOwnerColumn.guard';
import { ColumnResponseInterface } from './types/columnResponse.interface';
import { ColumnsResponseInterface } from './types/columnsResponse.interface';
@ApiTags('columns')
@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @ApiBody({ type: CreateColumnDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create column.',
    type: ColumnEntity,
  })
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createColumn(
    @CurrentUser() currentUser: UserEntity,
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseInterface> {
    const column = await this.columnService.createColumn(
      currentUser,
      createColumnDto,
    );

    return this.columnService.buildResponse(column);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all columns.',
    type: [ColumnEntity],
  })
  async getAllColumns(): Promise<ColumnsResponseInterface> {
    const columns = await this.columnService.getAllColumns();
    return this.columnService.buildResponseAllColumns(columns);
  }

  @Get(':columnId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get column by ID.',
    type: ColumnEntity,
  })
  async getColumnById(
    @Param('columnId', new ParseIntPipe()) columnId: number,
  ): Promise<ColumnResponseInterface> {
    const column = await this.columnService.getColumnById(columnId);
    return this.columnService.buildResponse(column);
  }

  @Put(':columnId')
  @ApiBody({ type: CreateColumnDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update column.',
    type: ColumnEntity,
  })
  @UseGuards(AuthGuard, UserIsOwnerColumnGuard)
  @UsePipes(new ValidationPipe())
  async updateColumn(
    @Param('columnId', new ParseIntPipe()) columnId: number,
    @Body() updateColumnDto: CreateColumnDto,
  ): Promise<ColumnResponseInterface> {
    const column = await this.columnService.updateColumn(
      columnId,
      updateColumnDto,
    );
    return this.columnService.buildResponse(column);
  }

  @Delete(':columnId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete column.',
  })
  @UseGuards(AuthGuard, UserIsOwnerColumnGuard)
  async deleteColumn(
    @Param('columnId', new ParseIntPipe()) columnId: number,
  ): Promise<DeleteResult> {
    return await this.columnService.deleteColumn(columnId);
  }
}
