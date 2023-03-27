import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityService } from '../base';
import { AuthQueryRepository } from '../../repos';
import {
  NullablePromise,
  SessionDocument,
  SessionJwtMeta,
} from '../../../Model';

export class GetSessions implements SessionJwtMeta {
  deviceId: string;
  updateDate: string;
  userId: string;
  constructor(dto: SessionJwtMeta) {
    this.deviceId = dto.deviceId;
    this.updateDate = dto.updateDate;
    this.userId = dto.userId;
  }
}

@QueryHandler(GetSessions)
export class GetSessionsUseCase
  extends SecurityService
  implements IQueryHandler<GetSessions>
{
  constructor(private repo: AuthQueryRepository) {
    super();
  }
  public async execute(query: GetSessions): NullablePromise<SessionDocument[]> {
    const session = await this.repo.findSession(query.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(query, session)) {
      throw new UnauthorizedException();
    }
    return await this.repo.getSessions(query.userId);
  }
}
