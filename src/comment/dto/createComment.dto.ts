import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2)
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2)
  readonly body: string;
}
