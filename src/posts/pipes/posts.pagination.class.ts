import { PaginationConfig } from '../../helpers/classes/pagination.config';
import { FilterQuery } from 'mongoose';
import { IPaginationConfig, PostFilters, PostLogicModel } from '../../Model';

export class PostsPaginationConfig
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<PostLogicModel>;
  constructor(query: PostFilters, filter: FilterQuery<PostLogicModel> = {}) {
    super(query);
    this.filter = filter;
  }
}
