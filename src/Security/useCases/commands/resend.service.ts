import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ImATeapotException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EmailService } from '../../email';
import { VoidPromise } from '../../../Model';
import { SecurityService } from '../base';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class ResendConfirmCode {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmCode)
export class ResendingConfirmationCodeUseCase
  extends SecurityService
  implements ICommandHandler<ResendConfirmCode>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    private mailServ: EmailService,
  ) {
    super();
  }
  public async execute(command: ResendConfirmCode): VoidPromise {
    const user = await this.queryRepo.getUserByEmail(command.email);
    if (!user || user.confirmation.isConfirmed) {
      throw new BadRequestException(this.generateNotAllowMessage('email'));
    }
    user.updateConfirmCode();
    const isMailSent = await this.mailServ.sendConfirmation(
      user.email,
      user.confirmation.code,
    );
    if (!isMailSent) {
      throw new ServiceUnavailableException();
    }
    const isSaved = await this.commandRepo.saveAfterChanges(user);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
