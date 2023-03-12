import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';
import { IsUUID, Length } from 'class-validator';
import { RecoveryInputModel } from '../../Model';

export class RecoveryInput implements RecoveryInputModel {
  @TrimIfString()
  @IsUUID()
  recoveryCode: string;

  @TrimIfString()
  @Length(6, 20)
  newPassword: string;
}
