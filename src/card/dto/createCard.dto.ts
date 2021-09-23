import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @Length(2)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  readonly body: string;
}
