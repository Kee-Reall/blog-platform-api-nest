import { FilterQuery } from 'mongoose';
import { Blog, BlogFilter } from '../../Model';
import { PaginationConfig, Transformer } from '../../Base';

export class BlogsForOwnerPaginationConfig extends PaginationConfig {
  filter: FilterQuery<Blog>;

  constructor(query: BlogFilter, userId: string) {
    super(query);
    this.filter = {
      name: new RegExp(query.searchNameTerm || '[*]*', 'gi'),
      '_blogOwnerInfo.userId': Transformer.stringToObjectId(userId),
      _isBlogBanned: false,
    };
  }
}
