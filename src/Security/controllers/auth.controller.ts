import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CookieOptions, Response } from 'express';
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
import { command, query } from '../useCases';
import { appConfig } from '../../Infrastructure';
import {
  HardJwtAuthGuard,
  RefreshJwtAuthGuard,
  User,
} from '../../Infrastructure';
import {
  CodeInput,
  EmailInput,
  LoginInput,
  RecoveryInput,
  UserInput,
} from '../validators';
import {
  AccessTokenMeta,
  SessionJwtMeta,
  TokenPair,
  UserInfoType,
  VoidPromise,
} from '../../Model';

@Controller('api/auth')
export class AuthController {
  private readonly cookiesOptions: CookieOptions = appConfig.cookiesOptions;

  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') agent: string,
    @Body() dto: LoginInput,
    @Ip() ip: string,
  ): Promise<Pick<TokenPair, 'accessToken'>> {
    const tokenPair: TokenPair = await this.commandBus.execute(
      new command.Login(agent, ip, dto),
    );
    res.cookie('refreshToken', tokenPair.refreshToken, this.cookiesOptions);
    return { accessToken: tokenPair.accessToken };
  }

  @Get('me')
  @UseGuards(HardJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getInfoByToken(
    @User() user: AccessTokenMeta,
  ): Promise<UserInfoType> {
    return await this.queryBus.execute(new query.GetUserInfo(user.userId));
  }

  @Post('refresh-token')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async refreshSession(
    @Res({ passthrough: true }) res: Response,
    @User() userMeta: SessionJwtMeta,
    @Ip() ip,
  ): Promise<Pick<TokenPair, 'accessToken'>> {
    const tokenPair: TokenPair = await this.commandBus.execute(
      new command.Refresh(userMeta, ip),
    );
    res.cookie('refreshToken', tokenPair.refreshToken, this.cookiesOptions);
    return { accessToken: tokenPair.accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(
    @Res({ passthrough: true }) res: Response,
    @User() userMeta: SessionJwtMeta,
  ): VoidPromise {
    await this.commandBus.execute(new command.Logout(userMeta));
    res.clearCookie('refreshToken');
    return;
  }

  @Post('registration')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() dto: UserInput): VoidPromise {
    return await this.commandBus.execute(new command.Register(dto));
  }

  @Post('registration-email-resending')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resendConfirmCode(@Body() dto: EmailInput): VoidPromise {
    return await this.commandBus.execute(
      new command.ResendConfirmCode(dto.email),
    );
  }

  @Post('registration-confirmation')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirm(@Body() dto: CodeInput): VoidPromise {
    return await this.commandBus.execute(new command.ConfirmAccount(dto.code));
  }

  @Post('password-recovery')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async recoveryPassword(@Body() dto: EmailInput): VoidPromise {
    return await this.commandBus.execute(new command.SetRecovery(dto.email));
  }

  @Post('new-password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(@Body() dto: RecoveryInput): VoidPromise {
    return await this.commandBus.execute(new command.ChangePassword(dto));
  }
}
