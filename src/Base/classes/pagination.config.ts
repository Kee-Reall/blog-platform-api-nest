import { FilterQuery } from 'mongoose';
import { AbstractFilter, SortDirection } from '../../Model';

export abstract class PaginationConfig {
  limit: number;
  shouldSkip: number;
  sortDirection: SortDirection = 'desc';
  sortBy: string;
  pageNumber: number;
  abstract filter: FilterQuery<unknown>;
  protected constructor(query: AbstractFilter<any>) {
    this.pageNumber = Math.floor(+query.pageNumber || 1);
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    }
    this.limit = Math.floor(+query.pageSize || 10);
    if (this.limit < 1) {
      this.limit = 10;
    }
    this.shouldSkip = this.limit * (this.pageNumber - 1);
    this.sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';
    this.sortBy = <string>query.sortBy || 'createdAt';
  }
}
