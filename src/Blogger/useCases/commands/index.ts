import { CreateBlog, CreateBlogUseCase } from './create-blog.service';
import { CreatePost, CreatePostUseCase } from './create-post.service';

export const bloggerCommands = { CreateBlog, CreatePost };

export const bloggerCommandsHandlers = [CreateBlogUseCase, CreatePostUseCase];
