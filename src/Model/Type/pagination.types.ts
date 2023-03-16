import { FilterQuery } from 'mongoose';

export type SortDirection = 'asc' | 'desc';
export interface IPaginationConfig {
  filter?: FilterQuery<any>;
  sortBy: string;
  shouldSkip: number;
  limit: number;
  sortDirection: SortDirection;
  pageNumber?: number;
}

export type PaginatedOutput<Data> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Data[];
};
