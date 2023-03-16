import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../Model';
import { Repository } from '../../helpers';

@Injectable()
export class UsersCommandRepository extends Repository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }

  public async deleteUser(id: string): Promise<boolean> {
    return await this.deleteUsingId(this.userModel, id);
  }

  public async saveUser(user: UserDocument) {
    return await this.saveEntity(user);
  }
}
