import { Length, Matches } from 'class-validator';
import { PostInputModel } from '../../Model';
import { TrimIfString } from '../../helpers';

export class PostInput implements PostInputModel {
  @TrimIfString()
  @Length(1, 100)
  @Matches(/^[0-9a-fA-F]{24}$/)
  blogId: string;

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
