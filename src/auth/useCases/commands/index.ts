import { Login, LoginUseCase } from './login.service';
import { Refresh, RefreshUseCase } from './refresh.service';
import { Logout, LogoutUseCase } from './logout.service';

export const command = { Login, Logout, Refresh };

export const commandHandlers = [LoginUseCase, LogoutUseCase, RefreshUseCase];
