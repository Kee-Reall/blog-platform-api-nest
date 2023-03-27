import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Base/';
import {
  User,
  UserDocument,
  SessionDocument,
  SessionJwtMeta,
  ModelWithStatic,
  SessionModelStatics,
  UserModelStatics,
  Session,
} from '../../Model/';

@Injectable()
export class AuthCommandRepository extends Repository {
  constructor(
    @InjectModel(User.name)
    private userModel: ModelWithStatic<UserDocument, UserModelStatics>,
    @InjectModel(Session.name)
    private sessionModel: ModelWithStatic<SessionDocument, SessionModelStatics>,
  ) {
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

  async killAllSessionsExcludeCurrent(command: SessionJwtMeta) {
    return await this.sessionModel.killAllSessionsExcludeCurrent(command);
  }
}
