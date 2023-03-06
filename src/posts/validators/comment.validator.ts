import { CommentInputModel } from '../../Model/Type/comments.types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class CommentInput implements CommentInputModel {
  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(20, 30)
  content: string;
}
