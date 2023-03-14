import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SoftJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('ctx');
    req.user = { userId: null };
    try {
      const [type, token] = req.headers.authorization.split(' ');
      if (type === 'Bearer') {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        req.user.userId = payload.userId;
      }
    } finally {
      return true;
    }
  }
}
