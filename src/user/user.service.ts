import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JwtSecret } from 'src/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (userByEmail) {
      throw new HttpException(
        'Email are taken!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      { select: ['id', 'email', 'password'] },
    );

    if (!userByEmail) {
      throw new HttpException(
        'Email does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await compare(
      loginUserDto.password,
      userByEmail.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        'Password is not valid!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete userByEmail.password;

    return userByEmail;
  }

  async updateUser(
    userId: number,
    updateUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: updateUserDto.email,
    });

    if (!userByEmail) {
      throw new HttpException(
        'Email does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.userRepository.findOne(
      {
        id: userId,
      },
      { select: ['id', 'email', 'password'] },
    );

    user.password = await hash(updateUserDto.password, 10);

    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: userId });
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      JwtSecret,
    );
  }

  buildResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
