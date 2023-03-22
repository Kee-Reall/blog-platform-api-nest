import { Length } from 'class-validator';
import { PostInputModel } from '../../Model';
import { IsMatchMongoId, TrimIfString } from '../../Infrastructure';
import { IsBlogExist } from './isBlogExist';

export class PostInput implements PostInputModel {
  @TrimIfString()
  @Length(1, 100)
  @IsMatchMongoId()
  @IsBlogExist()
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
