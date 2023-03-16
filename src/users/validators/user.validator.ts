import { UserInputModel } from '../../Model';
import { IsEmail, Length, Matches } from 'class-validator';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';

export class UserInput implements UserInputModel {
  @TrimIfString()
  @IsEmail()
  @Length(5, 100)
  email: string;
  @TrimIfString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @TrimIfString()
  @Length(6, 20)
  password: string;
}
