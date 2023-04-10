import { GetBannedUsers, GetBannedUsersUseCase } from './get-users.service';
import {
  GetPaginatedBlogs,
  GetPaginatedBlogsUseCase,
} from './get-paginated-blogs.service';
import {
  GetCommentsForBlogger,
  GetCommentsForBloggerUseCase,
} from './get-comments.service';

export const bloggerQueries = {
  GetCommentsForBlogger,
  GetPaginatedBlogs,
  GetBannedUsers,
};

export const bloggerQueriesHandlers = [
  GetPaginatedBlogsUseCase,
  GetBannedUsersUseCase,
  GetCommentsForBloggerUseCase,
];
