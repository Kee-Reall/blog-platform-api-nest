import { PostInputModel } from '../../Model/Type/posts.types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class PostInput implements PostInputModel {
  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 100)
  blogId: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 1000)
  content: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 30)
  title: string;
}
