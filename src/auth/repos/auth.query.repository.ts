import { Repository } from '../../helpers/classes/repository.class';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserAccessDTO } from '../../Model';
import { Model } from 'mongoose';

@Injectable()
export class AuthQueryRepository extends Repository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }

  public async getUserInfo({ userId }: UserAccessDTO) {
    const user = await this.findById(this.userModel, userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
