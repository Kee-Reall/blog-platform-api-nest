import { IsUUID } from 'class-validator';
import { TrimIfString } from '../../helpers/';

export class CodeInput {
  @IsUUID()
  @TrimIfString()
  code;
}
