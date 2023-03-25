import { InjectModel } from '@nestjs/mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { appConfig } from '../appConfig.class';
import {
  AccessTokenPayload,
  ModelWithStatic,
  User,
  UserAccessDTO,
  UserDocument,
  UserModelStatics,
} from '../../Model';

@Injectable()
export class HardJwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private mdl: ModelWithStatic<UserDocument, UserModelStatics>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  public async validate(payload: object): Promise<UserAccessDTO> {
    if (!payload.hasOwnProperty('userId')) {
      throw new UnauthorizedException();
    }
    const { userId } = payload as AccessTokenPayload;
    const user = await this.mdl.nullableFindById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.banInfo.isBanned) {
      throw new UnauthorizedException();
    }
    return { userId };
  }
}
