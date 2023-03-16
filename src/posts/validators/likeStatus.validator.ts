import { IsEnum } from 'class-validator';
import { LikeENUM, TrimIfString } from '../../helpers';
import { LikeInputModel, LikeStatus } from '../../Model';

export class LikeInput implements LikeInputModel {
  @TrimIfString()
  @IsEnum(LikeENUM)
  likeStatus: LikeStatus;
}
