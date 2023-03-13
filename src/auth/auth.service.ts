import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from './email/';
import { AuthCommandRepository } from './repos';
import { MessageENUM } from '../helpers';
import {
  User,
  UserDocument,
  UserModelStatic,
  RecoveryInputModel,
  UserInputModel,
  UserLoginModel,
  WithIp,
  VoidPromise,
  Session,
  SessionDocument,
  SessionJwtMeta,
  TokenPair,
} from '../Model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument> & UserModelStatic,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private mailService: EmailService,
    private commandRepo: AuthCommandRepository,
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
        errorMessages: fieldsArray.map((field) => ({
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
        errorMessages: [{ message: MessageENUM.NOT_ALLOW, field: 'email' }],
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
        errorMessages: [{ message: MessageENUM.NOT_ALLOW, field: 'code' }],
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
      errorMessages: [
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
    const accessToken = this.jwtService.sign(
      { userId: meta.userId },
      { expiresIn: '2m', secret: process.env.JWT_SECRET, algorithm: 'HS512' },
    );
    const refreshToken = this.jwtService.sign(meta, {
      expiresIn: '5d',
      secret: process.env.JWT_SECRET,
      algorithm: 'HS512',
    });
    return { accessToken, refreshToken };
  }

  public async loginAttempt({
    loginOrEmail,
    password,
    ip,
  }: WithIp<UserLoginModel>): Promise<TokenPair> {
    const user = await this.userModel.findByLoginOrEmail(loginOrEmail);
    if (!user || !user.confirmation.isConfirmed) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await user.comparePasswords(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const session = new this.sessionModel({ userId: user._id, ip: [ip] });
    const isSaved: boolean = await this.commandRepo.saveSession(session);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    const meta = session.getMetaForToken();
    return this.generateTokenPair(meta);
  }
}
