import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import { Blog, BlogFilter } from '../../Model';

export class PublicBlogsPaginationPipe extends PaginationConfig {
  filter: FilterQuery<Blog>;
  constructor(filter: BlogFilter) {
    super(filter);
    this.filter = this.filter = {
      name: new RegExp(filter.searchNameTerm || '[*]*', 'gi'),
      _isOwnerBanned: false,
    };
  }
}
