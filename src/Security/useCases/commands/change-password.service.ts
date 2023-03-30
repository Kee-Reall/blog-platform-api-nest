import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityService } from '../base';
import { RecoveryInputModel, VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class ChangePassword implements RecoveryInputModel {
  newPassword: string;
  recoveryCode: string;
  constructor(dto: RecoveryInputModel) {
    this.recoveryCode = dto.recoveryCode;
    this.newPassword = dto.newPassword;
  }
}

@CommandHandler(ChangePassword)
export class PasswordChangingUseCase
  extends SecurityService
  implements ICommandHandler<ChangePassword>
{
  private rc = 'recoveryCode';
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
  ) {
    super();
  }
  public async execute(command: ChangePassword): VoidPromise {
    const user = await this.queryRepo.getUserByRecoveryCode(
      command.recoveryCode,
    );
    if (!user) {
      throw new BadRequestException(this.generateNotAllowMessage(this.rc));
    }
    const canBeRecovered: boolean = user.isRecoveryCodeActive();
    if (!canBeRecovered) {
      throw new BadRequestException(this.generateNotAllowMessage(this.rc));
    }
    await user.changePassword(command.newPassword);
    await this.commandRepo.saveAfterChanges(user);
    return;
  }
}
