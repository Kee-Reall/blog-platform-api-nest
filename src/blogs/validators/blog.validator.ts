import { BlogInputModel } from '../../Model/Type/blogs.types';
import { IsUrl, Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class BlogInput implements BlogInputModel {
  @TrimIfString()
  @Length(1, 500)
  description: string;

  @TrimIfString()
  @Length(1, 15)
  name: string;

  @TrimIfString()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
