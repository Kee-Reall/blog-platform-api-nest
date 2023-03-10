import { UserLoginModel } from '../../Model/Type/users.types';
import { TrimIfString } from '../../helpers/functions/transformIfString.decorator';
import { Length } from 'class-validator';

export class LoginInput implements UserLoginModel {
  @TrimIfString()
  @Length(3, 100)
  loginOrEmail: string;

  @TrimIfString()
  @Length(6, 20)
  password: string;
}
