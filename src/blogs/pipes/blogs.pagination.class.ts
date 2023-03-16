import { IPaginationConfig, BlogLogicModel, BlogFilters } from '../../Model';
import { PaginationConfig } from '../../helpers/classes/pagination.config';
import { FilterQuery } from 'mongoose';

export class BlogsPagination
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<BlogLogicModel>;
  constructor(query: BlogFilters) {
    super(query);
    this.filter = { name: new RegExp(query.searchNameTerm || '[*]*', 'gi') };
  }
}
