import { GetBlog, GetBlogUseCase } from './get-blog.service';
import { GetBlogs, GetPaginatedBlogsUseCase } from './get-blogs.service';
import {
  GetPostsByBlog,
  GetPostsByBlogsUseCase,
} from './get-posts-by-blog.service';

export const query = { GetBlog, GetBlogs, GetPostsByBlog };

export const queryUseCases = [
  GetBlogUseCase,
  GetPaginatedBlogsUseCase,
  GetPostsByBlogsUseCase,
];
