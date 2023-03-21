import { Length } from 'class-validator';
import { UserLoginModel } from '../../Model/';
import { TrimIfString } from '../../infrastructure';

export class LoginInput implements UserLoginModel {
  @TrimIfString()
  @Length(3, 100)
  loginOrEmail: string;

  @TrimIfString()
  @Length(6, 20)
  password: string;
}
