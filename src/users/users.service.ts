import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserInputModel } from '../Model/Type/users.types';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelStatic,
} from '../Model/Schema/user.schema';
import { Model } from 'mongoose';
import { UsersCommandRepository } from './repos/users.comman.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument> & UserModelStatic,
    private commandRepo: UsersCommandRepository,
  ) {}

  public async createUser(dto: UserInputModel) {
    const { login, email, password } = dto;
    const user = new this.userModel({ login, email });
    const [isUnique, fieldsArray] = await user.isFieldsUnique();
    if (!isUnique) {
      const errorMessages = fieldsArray.map((field) => {
        return {
          message: 'already using',
          field,
        };
      });
      throw new BadRequestException({ errorMessages });
    }
    debugger;
    await user.setHash(password);
    const isSaved: boolean = await this.commandRepo.saveUser(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return user;
  }

  public async deleteUser(id: string) {
    const res = await this.commandRepo.deleteUser(id);
    if (!res) {
      throw new NotFoundException();
    }
    return;
  }
}
