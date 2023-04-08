import { Length } from 'class-validator';
import { BanInput, IsMatchMongoId, TrimIfString } from '../../Base';
import { BanUserForBlogInputModel } from '../../Model';

export class BunUserForBlogInput
  extends BanInput
  implements BanUserForBlogInputModel
{
  @TrimIfString()
  @Length(20, 300)
  banReason: string;

  @TrimIfString()
  @Length(1)
  @IsMatchMongoId()
  blogId: string;
}
