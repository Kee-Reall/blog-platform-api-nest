import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload, SessionJwtMeta } from '../../Model/';
import { UnauthorizedException } from '@nestjs/common';

export class RefreshJwtAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (!req.cookies && !req.cookies.hasOwnProperty('refreshToken')) {
            throw new UnauthorizedException();
          }
          return req.cookies.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  public async validate(payload: object): Promise<SessionJwtMeta> {
    console.log('Refresh strategy');
    const requiredProperty = ['deviceId', 'userId', 'updateDate'];
    const hasAllProperty = requiredProperty.every((el) =>
      payload.hasOwnProperty(el),
    );
    if (!hasAllProperty) {
      throw new UnauthorizedException();
    }
    const { userId, deviceId, updateDate } = payload as RefreshTokenPayload;
    return { userId, deviceId, updateDate };
  }
}
