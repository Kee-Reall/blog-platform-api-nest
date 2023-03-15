import { Length } from 'class-validator';
import { PostInputModel } from '../../Model';
import { TrimIfString, IsValidObjectId } from '../../helpers';

export class PostInput implements PostInputModel {
  @TrimIfString()
  @Length(1, 100)
  @IsValidObjectId()
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
