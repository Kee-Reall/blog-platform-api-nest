import { PostInputModel } from '../../Model';
import { Length } from 'class-validator';
import { TrimIfString } from '../../infrastructure';

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
