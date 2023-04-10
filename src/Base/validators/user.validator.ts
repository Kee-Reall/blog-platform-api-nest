import { UserInputModel } from '../../Model';
import { IsEmail, Length, Matches } from 'class-validator';
import { TrimIfString } from '../decorators';

export class UserValidator implements UserInputModel {
  @TrimIfString()
  @IsEmail()
  @Length(5, 100)
  public email: string;
  @TrimIfString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  public login: string;
  @TrimIfString()
  @Length(6, 20)
  public password: string;
}
