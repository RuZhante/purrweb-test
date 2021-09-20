import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty()
  @Length(2)
  @IsString()
  readonly title: string;
}
