import { Length } from 'class-validator';
import { TrimIfString } from '../../Infrastructure';
import { CommentInputModel } from '../../Model';

export class CommentInput implements CommentInputModel {
  @TrimIfString()
  @Length(20, 300)
  content: string;
}
