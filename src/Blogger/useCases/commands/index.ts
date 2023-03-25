import { CreateBlog, CreateBlogUseCase } from './create-blog.service';
import { CreatePost, CreatePostUseCase } from './create-post.service';
import { UpdateBlog, UpdateBlogUseCase } from './update-blog.service';
import { DeleteBlog, DeleteBlogUseCase } from './delete-blog.service';

export const bloggerCommands = {
  CreateBlog,
  CreatePost,
  UpdateBlog,
  DeleteBlog,
};

export const bloggerCommandsHandlers = [
  CreateBlogUseCase,
  CreatePostUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
];
