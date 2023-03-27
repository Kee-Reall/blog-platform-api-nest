import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException } from '@nestjs/common';
import { VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';
import { EmailService } from '../../email';

export class SetRecovery {
  constructor(public email: string) {}
}

@CommandHandler(SetRecovery)
export class SetRecoveryCodeUseCase implements ICommandHandler<SetRecovery> {
  private emailErMsg: string = 'failed EMAIL sending attempt to: ';
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
    this.mailServ // don't wait for mail server
      .sendRecoveryInfo(user.email, user.recovery.recoveryCode)
      .then((isSent) => {
        if (!isSent) console.error(this.emailErMsg + command.email);
      });
    return;
  }
}
