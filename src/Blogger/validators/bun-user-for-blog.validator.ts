import { BanInput } from '../../Base/validators/ban.validator';
import { Length } from 'class-validator';
import { IsMatchMongoId, TrimIfString } from '../../Base';

export class BunUserForBlogInput extends BanInput {
  @TrimIfString()
  @Length(20, 300)
  banReason: string;

  @TrimIfString()
  @Length(1)
  @IsMatchMongoId()
  blogId: string;
}
