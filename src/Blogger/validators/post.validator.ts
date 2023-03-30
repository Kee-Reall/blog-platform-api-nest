import { Length } from 'class-validator';
import { TrimIfString } from '../../Base';
import { PostInputModel } from '../../Model';

export class PostInput implements PostInputModel {
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
