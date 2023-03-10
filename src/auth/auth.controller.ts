import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email/email.service';
import { UserInput } from '../users/validators/user.validator';
import { AuthService } from './auth.service';
import { EmailInput } from './validators/email';
import { CodeInput } from './validators/code';
import { VoidPromise } from '../Model/Type/promise.types';
import { RecoveryInput } from './validators/recoveryInput';
import { LoginInput } from './validators/login';
import { Cookies } from '../helpers/functions/cookies.decorator';
import { CookiesInput } from './validators/cookiesInput';

@Controller('api/auth')
export class AuthController {
  constructor(private mailer: EmailService, private service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() dto: LoginInput,
    @Cookies() cook: CookiesInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(res.cookie('from', 'to'));
    console.log('----------------------------------------------------------');
    console.log(cook);
    return this.service.loginAttempt(dto);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() dto: UserInput): VoidPromise {
    await this.service.registration(dto);
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resendConfirmCode(@Body() dto: EmailInput): VoidPromise {
    return await this.service.resendRegistryCode(dto.email);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirm(@Body() dto: CodeInput): VoidPromise {
    return await this.service.confirmUser(dto.code);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async recoveryPassword(@Body() dto: EmailInput): VoidPromise {
    return await this.service.passwordRecoveryAttempt(dto.email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(@Body() dto: RecoveryInput): VoidPromise {
    return await this.service.changePassword(dto);
  }
}
