import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityService } from '../base';
import { AuthQueryRepository } from '../../repos';
import { SessionJwtMeta, VoidPromise } from '../../../Model';

export class Logout implements SessionJwtMeta {
  deviceId: string;

  updateDate: string;
  userId: string;
  constructor(meta: SessionJwtMeta) {
    this.deviceId = meta.deviceId;
    this.updateDate = meta.updateDate;
    this.userId = meta.userId;
  }
}

@CommandHandler(Logout)
export class LogoutUseCase
  extends SecurityService
  implements ICommandHandler<Logout>
{
  constructor(private repo: AuthQueryRepository) {
    super();
  }

  public async execute(command: Logout): VoidPromise {
    const session = await this.repo.findSession(command.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(command, session)) {
      throw new UnauthorizedException();
    }
    return await session.killYourself();
  }
}
