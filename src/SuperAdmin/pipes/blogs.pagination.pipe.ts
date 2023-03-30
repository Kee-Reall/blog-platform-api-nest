import { DefaultBlogQuery, PaginationConfig } from '../../Base';
import { FilterQuery } from 'mongoose';
import { BlogFilter, BlogLogicModel } from '../../Model';

export class BlogsPaginationPipe extends PaginationConfig {
  filter: FilterQuery<BlogLogicModel>;
  constructor(query: BlogFilter) {
    super(query);
    this.filter = { name: new RegExp(query.searchNameTerm || '[*]*', 'gi') };
  }
}
export class DefaultBlogsFilters extends DefaultBlogQuery {}
