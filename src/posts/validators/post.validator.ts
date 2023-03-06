import { PostInputModel } from '../../Model/Type/posts.types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class PostInput implements PostInputModel {
  @IsNotEmpty()
  @IsString()
  @TrimIfString()
  @Length(1, 100)
  blogId: string;

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
