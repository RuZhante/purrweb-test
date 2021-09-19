import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(6)
  readonly password: string;
}
