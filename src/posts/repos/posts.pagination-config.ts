import { PaginationConfigClass } from '../../helpers/classes/pagination-config.class';
import { PostLogicModel } from '../../Model/Type/posts.types';
import { IPaginationConfig } from '../../Model/Type/pagination.types';
import { FilterQuery } from 'mongoose';
import { PostFilters } from '../../Model/Type/query.types';

export class PostsPaginationConfig
  extends PaginationConfigClass
  implements IPaginationConfig
{
  filter: FilterQuery<PostLogicModel>;
  constructor(query: PostFilters, filter: FilterQuery<PostLogicModel> = {}) {
    super(query);
    this.filter = filter;
  }
}
