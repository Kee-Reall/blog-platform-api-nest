import { AuthGuard } from '@nestjs/passport';
import { HardJwtAuthStrategy } from '../strategies/hardJwtAuth.strategy';

export class HardJwtAuthGuard extends AuthGuard(HardJwtAuthStrategy.name) {}
