import { DeleteUser, DeleteUserUseCase } from './deleteUser.service';
import { CreateUser, CreateUserUseCase } from './createUser.service';

export const adminCommand = { DeleteUser, CreateUser };

export const superAdminCommandHandlers = [DeleteUserUseCase, CreateUserUseCase];
