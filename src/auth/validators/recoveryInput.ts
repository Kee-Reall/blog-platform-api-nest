import { IsUUID, Length } from 'class-validator';
import { RecoveryInputModel } from '../../Model';
import { TrimIfString } from '../../infrastructure';

export class RecoveryInput implements RecoveryInputModel {
  @TrimIfString()
  @IsUUID()
  recoveryCode: string;

  @TrimIfString()
  @Length(6, 20)
  newPassword: string;
}
