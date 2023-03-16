import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../helpers';
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
