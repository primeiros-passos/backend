import { ContentType, Level, ContentStatus } from '@prisma/client';
import { IsNumber, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateContentDto {
  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public link: string;

  @IsNumber()
  @IsNotEmpty()
  public value: number;

  @IsEnum(Level)
  @IsNotEmpty()
  public level: Level;

  @IsEnum(ContentType)
  @IsNotEmpty()
  public type: ContentType;

  @IsEnum(ContentStatus)
  @IsNotEmpty()
  public status: ContentStatus;
}
