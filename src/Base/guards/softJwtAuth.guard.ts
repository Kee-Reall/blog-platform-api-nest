import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../../Infrastructure';

@Injectable()
export class SoftJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    req.user = { userId: null };
    try {
      const [type, token] = req.headers.authorization.split(' ');
      if (type === 'Bearer') {
        const payload = this.jwtService.verify(token, {
          secret: appConfig.jwtSecret,
        });
        req.user.userId = payload.userId;
      }
    } finally {
      return true;
    }
  }
}
