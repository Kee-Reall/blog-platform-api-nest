import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { EmailService } from './email/email.service';
import { UserInput } from '../users/validators/user.validator';
import { AuthService } from './auth.service';
import { EmailInput } from './validators/email';
import { CodeInput } from './validators/code';
import { VoidPromise } from '../Model/';
import { RecoveryInput } from './validators/recoveryInput';
import { LoginInput } from './validators/login';
import { HardJwtAuthGuard, RefreshJwtAuthGuard } from '../helpers';
import { AuthQueryRepository } from './repos/auth.query.repository';
import { User } from '../helpers/functions/user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private mailer: EmailService,
    private service: AuthService,
    private queryRepo: AuthQueryRepository,
  ) {}

  private readonly cookiesOptions: CookieOptions = {
    //domain: 'ht-02-03.vercel.app',
    sameSite: 'none',
    //secure: true,
    httpOnly: true,
  };

  @Get('me')
  @UseGuards(HardJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getInfoByToken(@User() user) {
    console.log(user);
    return this.queryRepo.getUserInfo(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginInput,
    @Ip() ip: string,
  ) {
    const { accessToken, refreshToken } = await this.service.loginAttempt({
      ...dto,
      ip,
    });
    res.cookie('refreshToken', refreshToken, this.cookiesOptions);
    return { accessToken };
  }

  @Post('refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async refreshSession() {
    return { refresh: 'you so fresh' };
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
