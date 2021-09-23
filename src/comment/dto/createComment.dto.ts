import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(2)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @Length(2)
  readonly body: string;
}
