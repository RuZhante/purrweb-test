import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @CurrentUser() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @CurrentUser('id') currentUserId: number,
    @Body('user') updateUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildResponse(updatedUser);
  }

  @Delete('user')
  @UseGuards(AuthGuard)
  async deleteUser(@CurrentUser('id') userId: number): Promise<DeleteResult> {
    return await this.userService.deleteUser(userId);
  }
}
