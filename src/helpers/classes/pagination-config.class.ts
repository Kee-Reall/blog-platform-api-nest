import { SortDirection } from '../../Model/Type/pagination.types';
import { AbstractFilter } from '../../Model/Type/query.types';
import { FilterQuery } from 'mongoose';

export abstract class PaginationConfigClass {
  limit: number;
  shouldSkip: number;
  sortDirection: SortDirection = 'desc';
  sortBy: string;
  pageNumber: number;
  abstract filter: FilterQuery<unknown>;
  protected constructor(query: AbstractFilter<any>) {
    this.pageNumber = +query.pageNumber || 1;
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    }
    this.limit = +query.pageSize || 10;
    if (this.limit < 1) {
      this.limit = 10;
    }
    this.shouldSkip = this.limit * (this.pageNumber - 1);
    this.sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';
    this.sortBy = <string>query.sortBy || 'createdAt';
  }
}
