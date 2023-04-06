import { IsBoolean } from 'class-validator';
export class BanInput {
  @IsBoolean()
  isBanned: boolean;
}
