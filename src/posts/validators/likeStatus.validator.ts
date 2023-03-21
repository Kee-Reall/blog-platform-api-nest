import { IsEnum } from 'class-validator';
import { LikeENUM } from '../../helpers';
import { TrimIfString } from '../../infrastructure';
import { LikeInputModel, LikeStatus } from '../../Model';

export class LikeInput implements LikeInputModel {
  @TrimIfString()
  @IsEnum(LikeENUM)
  likeStatus: LikeStatus;
}
