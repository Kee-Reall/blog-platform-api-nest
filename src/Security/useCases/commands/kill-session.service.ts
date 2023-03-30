import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityService } from '../base';
import { SessionJwtMeta } from '../../../Model';
import { AuthQueryRepository } from '../../repos';

export class KillSession {
  constructor(public deviceId: string, public meta: SessionJwtMeta) {}
}

@CommandHandler(KillSession)
export class SessionKillingUseCase
  extends SecurityService
  implements ICommandHandler<KillSession>
{
  constructor(private queryRepo: AuthQueryRepository) {
    super();
  }
  public async execute(command: KillSession): Promise<any> {
    const currentSession = await this.queryRepo.findSession(
      command.meta.deviceId,
    );
    if (!currentSession) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(command.meta, currentSession)) {
      throw new UnauthorizedException();
    }
    const session = await this.queryRepo.findSession(command.deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (session.userId.toHexString() !== currentSession.userId.toHexString()) {
      throw new ForbiddenException();
    }
    await session.killYourself();
  }
}
