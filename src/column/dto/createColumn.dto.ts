import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2)
  @IsString()
  readonly title: string;
}
