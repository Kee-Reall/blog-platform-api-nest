import { IsEnum } from 'class-validator';
import { LikeENUM } from '../../Helpers';
import { TrimIfString } from '../../Infrastructure';
import { LikeInputModel, LikeStatus } from '../../Model';

export class LikeInput implements LikeInputModel {
  @TrimIfString()
  @IsEnum(LikeENUM)
  likeStatus: LikeStatus;
}
