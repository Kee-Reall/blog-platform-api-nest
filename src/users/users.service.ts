import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserInputModel } from '../Model/Type/users.types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Model/Schema/user.schema';
import { Model } from 'mongoose';
import { hash as genHash, genSalt } from 'bcrypt';
import { UsersCommandRepository } from './repos/users.comman.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private commandRepo: UsersCommandRepository,
  ) {}

  public async createUser(dto: UserInputModel) {
    const { login, email, password } = dto;
    const hash = await genHash(password, await genSalt(10));
    const user = new this.userModel({ login, email, hash });
    const isSaved: boolean = await this.commandRepo.saveNewUser(user);
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
