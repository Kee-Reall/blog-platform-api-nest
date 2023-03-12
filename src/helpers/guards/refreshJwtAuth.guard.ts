import { AuthGuard } from '@nestjs/passport';
import { RefreshJwtAuthStrategy } from '../strategies/refreshJwtAuth.strategy';

export class RefreshJwtAuthGuard extends AuthGuard(
  RefreshJwtAuthStrategy.name,
) {}
