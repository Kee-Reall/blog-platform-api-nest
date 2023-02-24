import { SortDirection } from '../../Model/Type/pagination.types';
import { AbstractFilter } from '../../Model/Type/query.types';
export abstract class PaginationConfig<T extends { createdAt: Date }> {
  limit: number;
  shouldSkip: number;

  sortDirection: SortDirection = 'desc';
  sortBy: string | keyof T;
  protected constructor(query: AbstractFilter<any>) {
    this.limit = +query.pageSize || 10;
    this.shouldSkip = this.limit * ((+query.pageNumber || 1) - 1);
    this.sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';
    this.sortBy = this.sortBy || 'createdAt';
  }
}
