import { IsJWT, IsNotEmpty } from 'class-validator';

export class CookiesInput {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
