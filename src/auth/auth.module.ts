import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email';
import { AuthCommandRepository, AuthQueryRepository } from './repos';
import { HardJwtAuthStrategy, RefreshJwtAuthStrategy } from '../helpers';
import { Session, SessionSchema, User, UserSchema } from '../Model';
import { DeviceController } from './device.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.register({}),
    ThrottlerModule.forRoot({
      limit: +process.env.IP_RESTRICTION_LIMIT || 5,
      ttl: +process.env.IP_RESTRICTION_TTL || 10,
    }),
  ],
  controllers: [AuthController, DeviceController],
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
