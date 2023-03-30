import { IsEnum } from 'class-validator';
import { LikeENUM } from '../../Helpers';
import { LikeInputModel, LikeStatus } from '../../Model';
import { TrimIfString } from '../../Base';

export class LikeInput implements LikeInputModel {
  @TrimIfString()
  @IsEnum(LikeENUM)
  likeStatus: LikeStatus;
}
