import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, SessionDocument } from '../../Model/';
import { Repository } from '../../helpers/';

@Injectable()
export class AuthCommandRepository extends Repository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }

  public async saveUserAfterRegistry(user: UserDocument): Promise<boolean> {
    return await this.saveEntity(user);
  }

  public async saveAfterChanges(user: UserDocument): Promise<boolean> {
    return await this.saveEntity(user);
  }

  public async saveSession(ses: SessionDocument): Promise<boolean> {
    return await this.saveEntity(ses);
  }
}
