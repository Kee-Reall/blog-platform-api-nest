import { IsUUID } from 'class-validator';
import { TrimIfString } from '../../Infrastructure';

export class CodeInput {
  @IsUUID()
  @TrimIfString()
  code;
}
