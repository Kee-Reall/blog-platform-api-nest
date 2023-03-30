import {
  GetPaginatedBlogs,
  GetPaginatedBlogsUseCase,
} from './get-paginated-blogs.service';

export const bloggerQueries = { GetPaginatedBlogs };

export const bloggerQueriesHandlers = [GetPaginatedBlogsUseCase];
