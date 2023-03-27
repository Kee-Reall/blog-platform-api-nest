import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Base';
import {
  User,
  UserDocument,
  Session,
  SessionDocument,
  NullablePromise,
  SessionModelStatics,
  UserInfoType,
  ModelWithStatic,
  UserModelStatics,
} from '../../Model';

@Injectable()
export class AuthQueryRepository extends Repository {
  constructor(
    @InjectModel(User.name)
    private userModel: ModelWithStatic<UserDocument, UserModelStatics>,
    @InjectModel(Session.name)
    private sessionModel: ModelWithStatic<SessionDocument, SessionModelStatics>,
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

  public async getUserByEmail(email: string): NullablePromise<UserDocument> {
    return await this.findOneWithFilter(this.userModel, { email });
  }

  public async getUserByCode(code: string): NullablePromise<UserDocument> {
    return await this.findOneWithFilter(this.userModel, {
      'confirmation.code': code,
    });
  }

  public async getUserByRecoveryCode(
    recoveryCode: string,
  ): NullablePromise<UserDocument> {
    return await this.findOneWithFilter(this.userModel, {
      'recovery.recoveryCode': recoveryCode,
    });
  }
}
