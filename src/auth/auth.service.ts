import {
  BadRequestException,
  ForbiddenException,
  ImATeapotException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from './email/';
import { AuthCommandRepository, AuthQueryRepository } from './repos';
import { MessageENUM } from '../helpers';
import {
  User,
  UserDocument,
  UserModelStatics,
  RecoveryInputModel,
  UserInputModel,
  UserLoginModel,
  WithClientMeta,
  VoidPromise,
  Session,
  SessionDocument,
  SessionJwtMeta,
  TokenPair,
  SessionModelStatics,
  ModelWithStatic,
} from '../Model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: ModelWithStatic<UserDocument, UserModelStatics>,
    @InjectModel(Session.name)
    private sessionModel: ModelWithStatic<SessionDocument, SessionModelStatics>,
    private commandRepo: AuthCommandRepository,
    private queryRepo: AuthQueryRepository,
    private mailService: EmailService,
    private jwtService: JwtService,
  ) {}

  public async registration({
    login,
    email,
    password,
  }: UserInputModel): VoidPromise {
    const user = new this.userModel({ login, email });
    const [isUnique, fieldsArray] = await user.isFieldsUnique();
    if (!isUnique) {
      throw new BadRequestException({
        errorsMessages: fieldsArray.map((field) => ({
          message: MessageENUM.ALREADY_EXISTS,
          field,
        })),
      });
    }
    await user.setHash(password);
    const isSaved: boolean = await this.commandRepo.saveUserAfterRegistry(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    const isMailSent = await this.mailService.sendConfirmationAfterRegistration(
      user.email,
      user.confirmation.code,
    );
    if (!isMailSent) {
      await user.killYourself();
      throw new ServiceUnavailableException();
    }
    return;
  }

  public async resendRegistryCode(email: string): VoidPromise {
    const user = await this.userModel.findOne({ email });
    if (!user || user.confirmation.isConfirmed) {
      throw new BadRequestException({
        errorsMessages: [{ message: MessageENUM.NOT_ALLOW, field: 'email' }],
      });
    }
    user.updateConfirmCode();
    const isMailSent = await this.mailService.sendConfirmationAfterRegistration(
      user.email,
      user.confirmation.code,
    );
    if (!isMailSent) {
      throw new ServiceUnavailableException();
    }
    const isSaved = await this.commandRepo.saveAfterChanges(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }

  public async confirmUser(code: string): VoidPromise {
    const user = await this.userModel.findOne({ 'confirmation.code': code });
    if (!user || user.confirmation.isConfirmed) {
      throw new BadRequestException({
        errorsMessages: [{ message: MessageENUM.NOT_ALLOW, field: 'code' }],
      });
    }
    user.confirm();
    const isSaved = await this.commandRepo.saveAfterChanges(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }

  public async passwordRecoveryAttempt(email: string): VoidPromise {
    const user = await this.userModel.findOne({ email });
    if (!user || !user.confirmation.isConfirmed) {
      return; //not found exception, but we shouldn't say it to client
    }
    user.setRecoveryMetadata();
    const isSaved = await this.commandRepo.saveAfterChanges(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    this.mailService // don't wait for mail server
      .sendRecoveryInfo(user.email, user.recovery.recoveryCode)
      .then((isSent) =>
        !isSent
          ? console.error('failed EMAIL sending attempt to: ' + email)
          : null,
      );
    return;
  }

  public async changePassword({
    recoveryCode,
    newPassword,
  }: RecoveryInputModel): VoidPromise {
    const user = await this.userModel.findOne({
      'recovery.recoveryCode': recoveryCode,
    });
    const objectError = {
      errorsMessages: [
        { message: MessageENUM.NOT_ALLOW, field: 'recoveryCode' },
      ],
    };
    if (!user) {
      throw new BadRequestException(objectError);
    }
    const canBeRecovered: boolean = user.isRecoveryCodeActive();
    if (!canBeRecovered) {
      throw new BadRequestException(objectError);
    }
    await user.changePassword(newPassword);
    await this.commandRepo.saveAfterChanges(user);
    return;
  }

  private generateTokenPair(meta: SessionJwtMeta): TokenPair {
    const [accessTokenLiveTime, refreshTokenLiveTime] = [
      process.env.JWT_ACCESS_LIFETIME,
      process.env.JWT_REFRESH_LIFETIME,
    ];
    const accessToken = this.jwtService.sign(
      { userId: meta.userId },
      {
        expiresIn: accessTokenLiveTime,
        secret: process.env.JWT_SECRET,
        algorithm: 'HS512',
      },
    );
    const refreshToken = this.jwtService.sign(meta, {
      expiresIn: refreshTokenLiveTime,
      secret: process.env.JWT_SECRET,
      algorithm: 'HS512',
    });
    return { accessToken, refreshToken };
  }

  public async loginAttempt({
    ip,
    password,
    loginOrEmail,
    agent: title,
  }: WithClientMeta<UserLoginModel>): Promise<TokenPair> {
    const user = await this.userModel.findByLoginOrEmail(loginOrEmail);
    if (!user || !user.confirmation.isConfirmed) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await user.comparePasswords(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const session = new this.sessionModel({
      userId: user._id,
      title,
      ip: [ip],
    });
    const isSaved: boolean = await this.commandRepo.saveSession(session);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return this.generateTokenPair(session.getMetaForToken());
  }

  private checkValidMeta(
    meta: SessionJwtMeta,
    session: SessionDocument,
  ): boolean {
    const isSameUser = session.userId.toHexString() === meta.userId;
    const isSameDate = meta.updateDate === session.updateDate.toISOString();
    return isSameUser && isSameDate;
  }

  public async refreshAttempt(
    meta: SessionJwtMeta,
    ip: string = null,
  ): Promise<TokenPair> {
    const session = await this.queryRepo.findSession(meta.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(meta, session)) {
      throw new UnauthorizedException();
    }
    session.setNewUpdateDate();
    if (ip) {
      session.setLastIp(ip);
    }
    const isSaved: boolean = await this.commandRepo.saveSession(session);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return this.generateTokenPair(session.getMetaForToken());
  }

  public async logout(meta: SessionJwtMeta): VoidPromise {
    const session = await this.queryRepo.findSession(meta.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(meta, session)) {
      throw new UnauthorizedException();
    }
    return await session.killYourself();
  }

  public async killSessionsExcludeCurrent(meta: SessionJwtMeta) {
    const session = await this.queryRepo.findSession(meta.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(meta, session)) {
      throw new UnauthorizedException();
    }
    return await this.sessionModel.killAllSessionsExcludeCurrent(meta);
  }

  public async killSession(meta: SessionJwtMeta, deviceId: string) {
    const currentSession = await this.queryRepo.findSession(meta.deviceId);
    if (!currentSession) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(meta, currentSession)) {
      throw new UnauthorizedException();
    }
    const session = await this.queryRepo.findSession(deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (session.userId.toHexString() !== currentSession.userId.toHexString()) {
      throw new ForbiddenException();
    }
    await session.killYourself();
  }

  async getSessions(meta: SessionJwtMeta) {
    const session = await this.queryRepo.findSession(meta.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(meta, session)) {
      throw new UnauthorizedException();
    }
    return await this.queryRepo.getSessions(meta.userId);
  }
}
