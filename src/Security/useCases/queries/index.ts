import { GetUserInfo, GetUserInfoUseCase } from './get-user-info.service';
import { GetSessions, GetSessionsUseCase } from './get-sessions.service';

export const query = { GetUserInfo, GetSessions };

export const queriesHandlers = [GetUserInfoUseCase, GetSessionsUseCase];
