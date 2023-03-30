import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { SecurityService } from '../base';
import { Nullable, SessionJwtMeta, TokenPair } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class Refresh {
  public ip: Nullable<string> = null;
  constructor(public meta: SessionJwtMeta, ip: string) {
    if (ip) {
      this.ip = ip;
    }
  }
}

@CommandHandler(Refresh)
export class RefreshUseCase
  extends SecurityService
  implements ICommandHandler<Refresh>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    protected jwtService: JwtService,
  ) {
    super();
  }
  public async execute(command: Refresh): Promise<TokenPair> {
    const session = await this.queryRepo.findSession(command.meta.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(command.meta, session)) {
      throw new UnauthorizedException();
    }
    session.setNewUpdateDate();
    if (command.ip) {
      session.setLastIp(command.ip);
    }
    const isSaved: boolean = await this.commandRepo.saveSession(session);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return this.generateTokenPair(this.jwtService, session.getMetaForToken());
  }
}
