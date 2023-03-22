import {
  AdminGetBlogsHandler,
  GetPaginatedBlogs,
} from './adminGetBlogs.service';
import {
  AdminGetUsersHandler,
  GetPaginatedUsers,
} from './adminGetUsers.service';

export const superAdminQueryHandlers = [
  AdminGetBlogsHandler,
  AdminGetUsersHandler,
];
export const adminQuery = { GetPaginatedBlogs, GetPaginatedUsers };
