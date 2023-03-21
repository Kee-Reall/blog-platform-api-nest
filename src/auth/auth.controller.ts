import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EmailService } from './email';
import { VoidPromise } from '../Model/';
import { AuthService } from './auth.service';
import { AuthQueryRepository } from './repos';
import { HardJwtAuthGuard, RefreshJwtAuthGuard, User } from '../infrastructure';
import {
  CodeInput,
  EmailInput,
  LoginInput,
  RecoveryInput,
  UserInput,
} from './validators';
import { appConfig } from '../infrastructure';

@Controller('api/auth')
export class AuthController {
  constructor(
    private mailer: EmailService,
    private service: AuthService,
    private queryRepo: AuthQueryRepository,
  ) {}

  private readonly cookiesOptions: CookieOptions = appConfig.cookiesOptions;

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') agent,
    @Body() dto: LoginInput,
    @Ip() ip: string,
  ) {
    const tokenPair = await this.service.loginAttempt({
      ...dto,
      agent,
      ip,
    });
    res.cookie('refreshToken', tokenPair.refreshToken, this.cookiesOptions);
    return { accessToken: tokenPair.accessToken };
  }

  @Get('me')
  @UseGuards(HardJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getInfoByToken(@User() user) {
    return this.queryRepo.getUserInfo(user);
  }

  @Post('refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async refreshSession(
    @Res({ passthrough: true }) res,
    @User() userMeta,
    @Ip() ip,
  ) {
    const tokenPair = await this.service.refreshAttempt(userMeta, ip);
    res.cookie('refreshToken', tokenPair.refreshToken, this.cookiesOptions);
    return { accessToken: tokenPair.accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Res({ passthrough: true }) res, @User() userMeta) {
    await this.service.logout(userMeta);
    res.clearCookie('refreshToken');
    return;
  }

  @Post('registration')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() dto: UserInput): VoidPromise {
    await this.service.registration(dto);
    return;
  }

  @Post('registration-email-resending')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resendConfirmCode(@Body() dto: EmailInput): VoidPromise {
    return await this.service.resendRegistryCode(dto.email);
  }

  @Post('registration-confirmation')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirm(@Body() dto: CodeInput): VoidPromise {
    return await this.service.confirmUser(dto.code);
  }

  @Post('password-recovery')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async recoveryPassword(@Body() dto: EmailInput): VoidPromise {
    return await this.service.passwordRecoveryAttempt(dto.email);
  }

  @Post('new-password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(@Body() dto: RecoveryInput): VoidPromise {
    return await this.service.changePassword(dto);
  }
}
