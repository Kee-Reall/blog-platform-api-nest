import { BanUserInputModel } from '../../Model';
import { Length } from 'class-validator';
import { TrimIfString } from '../../Base';
import { BanInput } from '../../Base/validators/ban.validator';

export class BanUserInput extends BanInput implements BanUserInputModel {
  @Length(20, 200)
  @TrimIfString()
  banReason: string;
}
