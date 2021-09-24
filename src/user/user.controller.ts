import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create User.',
    type: UserEntity,
  })
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildResponse(user);
  }

  @Post('users/login')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login User.',
    type: UserEntity,
  })
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body() loginUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildResponse(user);
  }

  @Get('user')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get current User.',
    type: CreateUserDto,
  })
  @UseGuards(AuthGuard)
  async currentUser(
    @CurrentUser() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildResponse(user);
  }

  @Put('user')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update User.',
    type: CreateUserDto,
  })
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @CurrentUser('id') currentUserId: number,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildResponse(updatedUser);
  }

  @Delete('user')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete User.',
  })
  @UseGuards(AuthGuard)
  async deleteUser(@CurrentUser('id') userId: number): Promise<DeleteResult> {
    return await this.userService.deleteUser(userId);
  }
}
