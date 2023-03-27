import { DeleteUser, DeleteUserUseCase } from './delete.service';
import { CreateUser, CreateUserUseCase } from './create.service';
import { BanUser, BanUserUseCase } from './ban.service';
import { BindBlog, BindBlogUseCase } from './bind.service';

export const adminCommand = { BindBlog, DeleteUser, CreateUser, BanUser };

export const superAdminCommandHandlers = [
  BindBlogUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
  BanUserUseCase,
];
