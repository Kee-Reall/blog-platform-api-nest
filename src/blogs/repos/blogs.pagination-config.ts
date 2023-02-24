import { IPaginationConfig } from '../../Model/Type/pagination.types';
import { BlogLogicModel } from '../../Model/Type/blogs.types';
import { PaginationConfig } from '../../helpers/classes/pagination-config';
import { BlogFilters } from '../../Model/Type/query.types';
import { FilterQuery } from 'mongoose';

export class BlogsPaginationConfig
  extends PaginationConfig<BlogLogicModel>
  implements IPaginationConfig
{
  filter: FilterQuery<BlogLogicModel>;
  constructor(query: BlogFilters) {
    super(query);
    this.filter = { name: new RegExp(query.searchNameTerm || '[*]*', 'gi') };
  }
}
