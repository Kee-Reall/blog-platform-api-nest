import { BanUserInputModel } from '../../Model';
import { IsBoolean, Length } from 'class-validator';
import { TrimIfString } from '../../Infrastructure';

export class BanUserInput implements BanUserInputModel {
  @Length(20, 200)
  @TrimIfString()
  banReason: string;
  @IsBoolean()
  isBanned: boolean;
}
