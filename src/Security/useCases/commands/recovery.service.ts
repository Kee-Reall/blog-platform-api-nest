import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException } from '@nestjs/common';
import { EmailService } from '../../email';
import { VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class SetRecovery {
  constructor(public email: string) {}
}

@CommandHandler(SetRecovery)
export class SetRecoveryCodeUseCase implements ICommandHandler<SetRecovery> {
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    private mailServ: EmailService,
  ) {}
  public async execute(command: SetRecovery): VoidPromise {
    const user = await this.queryRepo.getUserByEmail(command.email);
    if (!user || !user.confirmation.isConfirmed) {
      return; //not found exception, but we shouldn't say it to client
    }
    user.setRecoveryMetadata();
    const isSaved = await this.commandRepo.saveAfterChanges(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    this.mailServ.sendRecoveryInfo(user.email, user.recovery.recoveryCode); // don't wait for this Promise
    return;
  }
}
