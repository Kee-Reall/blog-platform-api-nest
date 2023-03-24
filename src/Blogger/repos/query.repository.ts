import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Helpers';
import { NullablePromise, User, UserDocument } from '../../Model';

@Injectable()
export class BloggerQueryRepository extends Repository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }
  public async getUserEntity(userId: string): NullablePromise<UserDocument> {
    return this.findById(this.userModel, userId);
  }
}
