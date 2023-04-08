import { CreateBlog, CreateBlogUseCase } from './create-blog.service';
import { CreatePost, CreatePostUseCase } from './create-post.service';
import { UpdateBlog, UpdateBlogUseCase } from './update-blog.service';
import { UpdatePost, UpdatePostUseCase } from './update-post.service';
import { DeleteBlog, DeleteBlogUseCase } from './delete-blog.service';
import { DeletePost, DeletePostUseCase } from './delete-post.service';
import {
  BanUserForBlog,
  BloggerBanUserUseCase,
} from './ban-user-for-blog.service';

export const bloggerCommands = {
  BanUserForBlog,
  CreateBlog,
  CreatePost,
  UpdateBlog,
  UpdatePost,
  DeleteBlog,
  DeletePost,
};

export const bloggerCommandsHandlers = [
  BloggerBanUserUseCase,
  CreateBlogUseCase,
  CreatePostUseCase,
  UpdateBlogUseCase,
  UpdatePostUseCase,
  DeleteBlogUseCase,
  DeletePostUseCase,
];
