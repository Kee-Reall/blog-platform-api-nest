import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class BasicAuth implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    debugger;
    const authorization = req.headers.authorization;
    if (!authorization) {
      return false;
    }

    const auth = authorization.split(' ');
    if (!Array.isArray(auth)) {
      return false;
    }
    const [type, auth64] = auth;
    const [login, password] = Buffer.from(auth64 ?? '', 'base64')
      .toString('ascii')
      .split(':');
    const [adminLogin, adminPassword] = [
      process.env.LOGIN,
      process.env.PASSWORD,
    ];
    return (
      login === adminLogin && password === adminPassword && type === 'Basic'
    );
  }
}
