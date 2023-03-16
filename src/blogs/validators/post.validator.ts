import { PostInputModel } from '../../Model/Type/posts.types';
import { Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class PostInputWithoutBlogId implements Omit<PostInputModel, 'blogId'> {
  @TrimIfString()
  @Length(1, 1000)
  content: string;

  @TrimIfString()
  @Length(1, 100)
  shortDescription: string;

  @TrimIfString()
  @Length(1, 30)
  title: string;
}
