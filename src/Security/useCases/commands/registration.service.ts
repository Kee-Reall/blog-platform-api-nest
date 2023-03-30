import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ImATeapotException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EmailService } from '../../email';
import { MessageENUM } from '../../../Helpers';
import { AuthCommandRepository } from '../../repos';
import {
  ModelWithStatic,
  User,
  UserDocument,
  UserInputModel,
  UserModelStatics,
  VoidPromise,
} from '../../../Model';

export class Register implements UserInputModel {
  email: string;

  login: string;
  password: string;
  constructor(dto: UserInputModel) {
    this.email = dto.email;
    this.login = dto.login;
    this.password = dto.password;
  }
}

@CommandHandler(Register)
export class RegistrationUseCase implements ICommandHandler<Register> {
  constructor(
    @InjectModel(User.name)
    private mdl: ModelWithStatic<UserDocument, UserModelStatics>,
    private repo: AuthCommandRepository,
    private mailServ: EmailService,
  ) {}

  public async execute(command: Register): VoidPromise {
    const { login, email, password } = command;
    const user = new this.mdl({ login, email });
    const [isUnique, fieldsArray] = await user.isFieldsUnique();
    if (!isUnique) {
      throw new BadRequestException(this.generateError(fieldsArray));
    }
    await user.setHash(password);
    const isSaved: boolean = await this.repo.saveUserAfterRegistry(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    const isMailSent = await this.mailServ.sendConfirmation(
      user.email,
      user.confirmation.code,
    );
    if (!isMailSent) {
      await user.killYourself();
      throw new ServiceUnavailableException();
    }
    return;
  }

  private generateError(array: string[]) {
    return {
      errorsMessages: array.map((field) => ({
        message: MessageENUM.ALREADY_EXISTS,
        field,
      })),
    };
  }
}
