import { Injectable } from '@nestjs/common';
import { Repository } from '../../helpers/classes/repository.class';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../Model/Schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SessionDocument } from '../../Model/Schema/session.schema';

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
