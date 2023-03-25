import { FilterQuery } from 'mongoose';
import { PaginationConfig } from './pagination.config';
import {
  IPaginationConfig,
  BlogLogicModel,
  BlogFilter,
  BlogPresentationModel,
  Direction,
} from '../../Model';

export class BlogsPagination
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<BlogLogicModel>;
  constructor(query: BlogFilter) {
    super(query);
    this.filter = { name: new RegExp(query.searchNameTerm || '[*]*', 'gi') };
  }
}

export class DefaultBlogQuery implements Required<BlogFilter> {
  pageNumber: number = 1;
  pageSize: number = 10;
  searchNameTerm: string = '[*]*';
  sortBy: string | keyof BlogPresentationModel = 'createdAt';
  sortDirection: Direction = 'desc';
}
