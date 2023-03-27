import { SessionJwtMeta, VoidPromise } from '../../../Model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { SecurityService } from '../base';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class KillAllSessionsExcludeCurrent implements SessionJwtMeta {
  deviceId: string;
  updateDate: string;
  userId: string;
  constructor(dto: SessionJwtMeta) {
    this.updateDate = dto.updateDate;
    this.userId = dto.userId;
    this.deviceId = dto.deviceId;
  }
}

@CommandHandler(KillAllSessionsExcludeCurrent)
export class KillingAllSessionsExcludeCurrentUseCase
  extends SecurityService
  implements ICommandHandler<KillAllSessionsExcludeCurrent>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
  ) {
    super();
  }
  public async execute(command: KillAllSessionsExcludeCurrent): VoidPromise {
    const session = await this.queryRepo.findSession(command.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(command, session)) {
      throw new UnauthorizedException();
    }
    return await this.commandRepo.killAllSessionsExcludeCurrent(command);
  }
}
