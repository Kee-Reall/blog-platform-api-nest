import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { MessageENUM } from '../../../Helpers';
import { AdminCommandRepository } from '../../repos';
import {
  ErrorMessage,
  ModelWithStatic,
  User,
  UserDocument,
  UserInputModel,
  UserModelStatics,
} from '../../../Model';

export class CreateUser implements UserInputModel {
  email: string;
  login: string;
  password: string;

  constructor(dto: UserInputModel) {
    this.email = dto.email;
    this.login = dto.login;
    this.password = dto.password;
  }
}

export type AdminPresentation = any;

@CommandHandler(CreateUser)
export class CreateUserUseCase implements ICommandHandler<CreateUser> {
  constructor(
    @InjectModel(User.name)
    private model: ModelWithStatic<UserDocument, UserModelStatics>,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute({
    login,
    email,
    password,
  }: CreateUser): Promise<AdminPresentation> {
    const user = new this.model({ login, email });
    const [isUnique, fieldsArray] = await user.isFieldsUnique();
    if (!isUnique) {
      throw new BadRequestException(this.generateNotUniqueError(fieldsArray));
    }
    await user.setHash(password);
    user.confirm();
    console.log(user.confirmation, user.recovery);
    const isSaved: boolean = await this.commandRepo.saveUser(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return { ...user.toJSON(), banInfo: user.banInfo };
  }

  private generateNotUniqueError(fields: string[]): {
    errorsMessages: ErrorMessage[];
  } {
    const errorsMessages = fields.map((field) => ({
      message: MessageENUM.ALREADY_EXISTS,
      field,
    }));
    return { errorsMessages };
  }
}
