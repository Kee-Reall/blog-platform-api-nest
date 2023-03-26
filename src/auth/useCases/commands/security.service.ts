import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../../../Infrastructure';
import { SessionDocument, SessionJwtMeta, TokenPair } from '../../../Model';

export abstract class SecurityService {
  protected abstract jwtService: JwtService;
  protected generateTokenPair(meta: SessionJwtMeta): TokenPair {
    const [accessTokenLiveTime, refreshTokenLiveTime] =
      appConfig.jwtLifeTimePair;
    const accessToken = this.jwtService.sign(
      { userId: meta.userId },
      {
        expiresIn: accessTokenLiveTime,
        secret: appConfig.jwtSecret,
        algorithm: 'HS512',
      },
    );
    const refreshToken = this.jwtService.sign(meta, {
      expiresIn: refreshTokenLiveTime,
      secret: appConfig.jwtSecret,
      algorithm: 'HS512',
    });
    return { accessToken, refreshToken };
  }

  protected checkValidMeta(
    meta: SessionJwtMeta,
    session: SessionDocument,
  ): boolean {
    const isSameUser = session.userId.toHexString() === meta.userId;
    const isSameDate = meta.updateDate === session.updateDate.toISOString();
    return isSameUser && isSameDate;
  }
}
