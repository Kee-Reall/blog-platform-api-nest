import { IsUUID } from 'class-validator';
import { TrimIfString } from '../../Base';

export class CodeInput {
  @IsUUID()
  @TrimIfString()
  code;
}
