export type SortDirection = 'asc' | 'desc';
export interface IPaginationConfig {
  filter?: any;
  sortBy: string;
  shouldSkip: number;
  limit: number;
  sortDirection: SortDirection;
}

export type PaginatedOutput<Data> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Data[];
};
