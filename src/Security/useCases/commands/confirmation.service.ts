import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { SecurityService } from '../base';
import { VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class ConfirmAccount {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmAccount)
export class ConfirmationUseCase
  extends SecurityService
  implements ICommandHandler<ConfirmAccount>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
  ) {
    super();
  }
  public async execute(command: ConfirmAccount): VoidPromise {
    const user = await this.queryRepo.getUserByCode(command.code);
    if (!user || user.confirmation.isConfirmed) {
      throw new BadRequestException(this.generateNotAllowMessage('code'));
    }
    user.confirm();
    const isSaved = await this.commandRepo.saveAfterChanges(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
