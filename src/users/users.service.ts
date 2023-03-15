import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStatics, UserInputModel } from '../Model';
import { Model } from 'mongoose';
import { UsersCommandRepository } from './repos/users.comman.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument> & UserModelStatics,
    private commandRepo: UsersCommandRepository,
  ) {}

  public async createUser(dto: UserInputModel) {
    const { login, email, password } = dto;
    const user = new this.userModel({ login, email });
    const [isUnique, fieldsArray] = await user.isFieldsUnique();
    if (!isUnique) {
      const errorsMessages = fieldsArray.map((field) => {
        return {
          message: 'already using',
          field,
        };
      });
      throw new BadRequestException({ errorsMessages });
    }
    await user.setHash(password);
    user.confirm();
    console.log(user.confirmation, user.recovery);
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
