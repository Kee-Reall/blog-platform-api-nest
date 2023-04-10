import { DeleteUser, DeleteUserUseCase } from './delete.service';
import { CreateUser, CreateUserUseCase } from './create.service';
import { BanUser, BanUserUseCase } from './ban-user.service';
import { BindBlog, BindBlogUseCase } from './bind.service';
import { BanBlogUseCase, BanBlog } from './ban-blog.service';

export const adminCommand = {
  BanUser,
  BanBlog,
  BindBlog,
  CreateUser,
  DeleteUser,
};

export const superAdminCommandHandlers = [
  BindBlogUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
  BanUserUseCase,
  BanBlogUseCase,
];
