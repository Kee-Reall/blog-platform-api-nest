import { PostInputModel } from '../../Model/Type/posts.types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class PostInput implements Omit<PostInputModel, 'blogId'> {
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
  @Transform(({ value }) => value.trim())
  @Length(1, 30)
  title: string;
}
