import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { AuthCommandRepository } from '../../repos';
import { SecurityService } from '../base';
import {
  ModelWithStatic,
  Session,
  SessionDocument,
  SessionModelStatics,
  User,
  UserDocument,
  UserLoginModel,
  UserModelStatics,
  WithClientMeta,
} from '../../../Model';

export class Login implements WithClientMeta<UserLoginModel> {
  public loginOrEmail: string;
  public password: string;
  constructor(public agent: string, public ip: string, dto: UserLoginModel) {
    this.loginOrEmail = dto.loginOrEmail;
    this.password = dto.password;
  }
}

@CommandHandler(Login)
export class LoginUseCase
  extends SecurityService
  implements ICommandHandler<Login>
{
  constructor(
    @InjectModel(User.name)
    private userModel: ModelWithStatic<UserDocument, UserModelStatics>,
    @InjectModel(Session.name)
    private sessionModel: ModelWithStatic<SessionDocument, SessionModelStatics>,
    private commandRepo: AuthCommandRepository,
    protected jwtService: JwtService,
  ) {
    super();
  }
  public async execute(command: Login): Promise<any> {
    const user = await this.userModel.findByLoginOrEmail(command.loginOrEmail);
    if (!user || !user.confirmation.isConfirmed || user.banInfo.isBanned) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await user.comparePasswords(command.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const session = new this.sessionModel({
      userId: user._id,
      title: command.agent,
      ip: [command.ip],
    });
    const isSaved: boolean = await this.commandRepo.saveSession(session);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return this.generateTokenPair(this.jwtService, session.getMetaForToken());
  }
}
