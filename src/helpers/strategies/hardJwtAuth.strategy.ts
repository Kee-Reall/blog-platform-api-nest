import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload, UserAccessDTO } from '../../Model/';

@Injectable()
export class HardJwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: object): Promise<UserAccessDTO> {
    if (payload.hasOwnProperty('userId')) {
      const { userId } = payload as AccessTokenPayload;
      return { userId };
    }
    throw new UnauthorizedException();
  }
}
