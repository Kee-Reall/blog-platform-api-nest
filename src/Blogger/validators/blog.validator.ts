import { BlogInputModel } from '../../Model';
import { IsUrl, Length } from 'class-validator';
import { TrimIfString } from '../../Base';

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
