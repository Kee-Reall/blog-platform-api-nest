import {
  BadRequestException,
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
    const user = await this.userModel.newUser(dto);
    const isSaved: boolean = await this.commandRepo.saveUser(user);
    if (!isSaved) {
      throw new BadRequestException();
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
