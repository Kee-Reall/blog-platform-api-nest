import { SortDirection } from '../../Model/Type/pagination.types';
import { AbstractFilter } from '../../Model/Type/query.types';

export abstract class PaginationConfigClass {
  limit: number;
  shouldSkip: number;
  sortDirection: SortDirection = 'desc';
  sortBy: string;
  pageNumber: number;
  protected constructor(query: AbstractFilter<any>) {
    this.pageNumber = +query.pageNumber || 1;
    this.limit = +query.pageSize || 10;
    this.shouldSkip = this.limit * (this.pageNumber - 1);
    this.sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';
    this.sortBy = <string>query.sortBy || 'createdAt';
  }
}
