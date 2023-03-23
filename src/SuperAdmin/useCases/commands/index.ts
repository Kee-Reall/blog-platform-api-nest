import { DeleteUser, DeleteUserUseCase } from './deleteUser.service';
import { CreateUser, CreateUserUseCase } from './createUser.service';
import { BanUser, BanUserUseCase } from './banUser.service';

export const adminCommand = { DeleteUser, CreateUser, BanUser };

export const superAdminCommandHandlers = [
  DeleteUserUseCase,
  CreateUserUseCase,
  BanUserUseCase,
];
