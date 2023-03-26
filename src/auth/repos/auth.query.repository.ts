import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from '../../Base';
import {
  User,
  UserDocument,
  UserAccessDTO,
  Session,
  SessionDocument,
  NullablePromise,
  SessionModelStatics,
  UserInfoType,
} from '../../Model';

@Injectable()
export class AuthQueryRepository extends Repository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name)
    private sessionModel: Model<SessionDocument> & SessionModelStatics,
  ) {
    super();
  }

  public async getUserInfo(id: string): Promise<UserInfoType> {
    const user = await this.findById<UserDocument>(this.userModel, id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { email: user.email, login: user.login, userId: user.id };
  }

  public async findSession(deviceId: string): NullablePromise<SessionDocument> {
    return await this.findById(this.sessionModel, deviceId);
  }

  public async getSessions(userId: string) {
    return await this.sessionModel.findUsersSessions(userId);
  }
}
