import { CommentInputModel } from '../../Model/Type/comments.types';
import { Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class CommentInput implements CommentInputModel {
  @TrimIfString()
  @Length(20, 300)
  content: string;
}
