import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import { IPaginationConfig, PostFilter, PostLogicModel } from '../../Model';

export class PostsPaginationConfig
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<PostLogicModel>;
  constructor(query: PostFilter, filter: FilterQuery<PostLogicModel> = {}) {
    super(query);
    this.filter = filter;
  }
}
