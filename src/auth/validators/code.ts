import { IsUUID } from 'class-validator';
import { TrimIfString } from '../../infrastructure';

export class CodeInput {
  @IsUUID()
  @TrimIfString()
  code;
}
