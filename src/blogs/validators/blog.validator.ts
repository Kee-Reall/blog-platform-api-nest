import { BlogInputModel } from '../../Model/Type/blogs.types';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class BlogInput implements BlogInputModel {
  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 500)
  description: string;

  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 15)
  name: string;

  @IsNotEmpty()
  @TrimIfString()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
