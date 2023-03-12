import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload, UserAccessDTO } from '../../Model/';
import { UnauthorizedException } from '@nestjs/common';

export class HardJwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: object): Promise<UserAccessDTO> {
    console.log('Hard strategy');
    if (payload.hasOwnProperty('userId')) {
      const { userId } = payload as AccessTokenPayload;
      return { userId };
    }
    throw new UnauthorizedException();
  }
}
