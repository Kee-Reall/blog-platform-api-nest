import { IsUUID } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class CodeInput {
  @IsUUID()
  @TrimIfString()
  code;
}
