import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from './email/email.service';
import {
  RecoveryInputModel,
  UserInputModel,
  UserLoginModel,
} from '../Model/Type/users.types';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserModelStatic,
} from '../Model/Schema/user.schema';
import { AuthCommandRepository } from './repos/auth.command.repository';
import { InjectModel } from '@nestjs/mongoose';
import { VoidPromise } from '../Model/Type/promise.types';
import { MessageENUM } from '../helpers/enums/message.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument> & UserModelStatic,
    private mailService: EmailService,
    private commandRepo: AuthCommandRepository,
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
      console.log('you are here');
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
      console.log('you are here');
      throw new BadRequestException(objectError);
    }
    await user.changePassword(newPassword);
    await this.commandRepo.saveAfterChanges(user);
    return;
  }

  public async loginAttempt({ loginOrEmail, password }: UserLoginModel) {
    const user = await this.userModel.findByLoginOrEmail(loginOrEmail);
    if (!user || !user.confirmation.isConfirmed) {
      throw new UnauthorizedException();
    }
    if (!(await user.comparePasswords(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
