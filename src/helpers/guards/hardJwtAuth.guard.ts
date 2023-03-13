import { AuthGuard } from '@nestjs/passport';

export class HardJwtAuthGuard extends AuthGuard('jwt') {}
