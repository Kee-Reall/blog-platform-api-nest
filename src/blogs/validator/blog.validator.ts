import { BlogInputModel } from '../../Model/Type/blogs.types';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlogInput implements BlogInputModel {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 500)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 15)
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
