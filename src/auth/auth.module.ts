import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email';
import { AuthCommandRepository, AuthQueryRepository } from './repos';
import { HardJwtAuthStrategy, RefreshJwtAuthStrategy } from '../helpers';
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
