import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, User, UserDocument } from '../../Model';
import { Repository } from '../../Base';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminCommandRepository extends Repository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }

  public async deleteUser(id: string | ObjectId): Promise<boolean> {
    return await this.deleteUsingId(this.userModel, id);
  }

  public async saveUser(user: UserDocument) {
    return await this.saveEntity(user);
  }

  public async saveBlog(blog: BlogDocument) {
    return await this.saveEntity(blog);
  }
}