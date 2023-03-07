import { PostInputModel } from '../../Model/Type/posts.types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class PostInputWithoutBlogId implements Omit<PostInputModel, 'blogId'> {
  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 1000)
  content: string;

  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 30)
  title: string;
}
