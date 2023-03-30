import { Login, LoginUseCase } from './login.service';
import { Logout, LogoutUseCase } from './logout.service';
import { Refresh, RefreshUseCase } from './refresh.service';
import { Register, RegistrationUseCase } from './registration.service';
import { SetRecovery, SetRecoveryCodeUseCase } from './recovery.service';
import { KillSession, SessionKillingUseCase } from './kill-session.service';
import { ConfirmAccount, ConfirmationUseCase } from './confirmation.service';
import {
  ResendConfirmCode,
  ResendingConfirmationCodeUseCase,
} from './resend.service';
import {
  ChangePassword,
  PasswordChangingUseCase,
} from './change-password.service';
import {
  KillAllSessionsExcludeCurrent,
  KillingAllSessionsExcludeCurrentUseCase,
} from './kill-all-sessions.service';

export const command = {
  ConfirmAccount,
  ChangePassword,
  Login,
  Logout,
  Register,
  Refresh,
  ResendConfirmCode,
  SetRecovery,
  KillSession,
  KillAllSessionsExcludeCurrent,
};

export const commandHandlers = [
  ConfirmationUseCase,
  LoginUseCase,
  LogoutUseCase,
  RegistrationUseCase,
  RefreshUseCase,
  ResendingConfirmationCodeUseCase,
  SetRecoveryCodeUseCase,
  PasswordChangingUseCase,
  SessionKillingUseCase,
  KillingAllSessionsExcludeCurrentUseCase,
];
