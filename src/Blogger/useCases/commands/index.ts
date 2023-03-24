import { CreateBlog, CreateBlogUseCase } from './create-blog.service';

export const bloggerCommands = { CreateBlog };

export const bloggerCommandsHandlers = [CreateBlogUseCase];
