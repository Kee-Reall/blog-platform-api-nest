import { PaginationConfig } from '../../Base';
import { IPaginationConfig, Post, PostFilter } from '../../Model';
import { FilterQuery } from 'mongoose';

export class PublicPostsPaginationPipe
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<Post> = { _isOwnerBanned: false, _isBlogBanned: false };
  constructor(filter: PostFilter) {
    super(filter);
  }
}
