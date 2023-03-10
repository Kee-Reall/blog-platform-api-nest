import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EmailService } from './email/email.service';
import { UserInputModel } from '../Model/Type/users.types';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserModelStatic,
} from '../Model/Schema/user.schema';
import { AuthCommandRepository } from './repos/auth.command.repository';
import { InjectModel } from '@nestjs/mongoose';
import { VoidPromise } from '../Model/Type/promise.types';

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
          message: 'already using',
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
    if (!user) {
      throw new NotFoundException({
        errorMessages: [{ message: 'already using', field: 'email' }],
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
    const isSaved = await this.commandRepo.saveAfterCodeChanges(user);
    if (isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
