import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCommandRepository } from './repos/auth.command.repository';
import { JwtModule } from '@nestjs/jwt';
import { HardJwtAuthStrategy } from '../helpers/strategies/hardJwtAuth.strategy';
import { AuthQueryRepository } from './repos/auth.query.repository';
import { RefreshJwtAuthStrategy } from '../helpers/strategies/refreshJwtAuth.strategy';
import { Session, SessionSchema, User, UserSchema } from '../Model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    AuthCommandRepository,
    AuthQueryRepository,
    HardJwtAuthStrategy,
    RefreshJwtAuthStrategy,
  ],
})
export class AuthModule {}
