import { GetBlog, GetBlogUseCase } from './get-blog.service';
import { GetPost, GetPostUseCase } from './get-post.service';
import { GetPosts, GetPostsUseCase } from './get-posts.service';
import { GetComment, GetCommentUseCase } from './get-comment.service';
import { GetBlogs, GetPaginatedBlogsUseCase } from './get-blogs.service';
import {
  GetPostsByBlog,
  GetPostsByBlogsUseCase,
} from './get-posts-by-blog.service';
import {
  GetComments,
  GetCommentsUseCase,
} from './get-comments-by-post.service';

export const query = {
  GetBlog,
  GetBlogs,
  GetComment,
  GetComments,
  GetPostsByBlog,
  GetPost,
  GetPosts,
};

export const queryUseCases = [
  GetBlogUseCase,
  GetCommentUseCase,
  GetCommentsUseCase,
  GetPaginatedBlogsUseCase,
  GetPostsByBlogsUseCase,
  GetPostUseCase,
  GetPostsUseCase,
];
