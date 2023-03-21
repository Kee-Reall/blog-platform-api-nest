import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailService } from './email';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DeviceController } from './device.controller';
import { Session, SessionSchema, User, UserSchema } from '../Model';
import { AuthCommandRepository, AuthQueryRepository } from './repos';
import {
  HardJwtAuthStrategy,
  RefreshJwtAuthStrategy,
  appConfig,
} from '../infrastructure';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.register({}),
    ThrottlerModule.forRoot(appConfig.throttlerOptions),
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
