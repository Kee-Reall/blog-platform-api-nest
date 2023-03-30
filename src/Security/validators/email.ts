import { IsEmail, Length } from 'class-validator';
import { TrimIfString } from '../../Base';

export class EmailInput {
  @IsEmail()
  @Length(3, 100)
  @TrimIfString()
  email: string;
}
