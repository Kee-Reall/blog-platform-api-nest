import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import { Blog, BlogFilter, IPaginationConfig } from '../../Model';

export class PublicBlogsPipe
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<Blog>;
  constructor(filter: BlogFilter) {
    super(filter);
    this.filter = this.filter = {
      name: new RegExp(filter.searchNameTerm || '[*]*', 'gi'),
      _isOwnerBanned: false,
    };
  }
}
