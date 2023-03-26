import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { useCases } from './useCases';
import { EmailService } from './email';
import { AuthService } from './auth.service';
import { AuthController, DeviceController } from './controllers';
import { Session, SessionSchema, User, UserSchema } from '../Model';
import { AuthCommandRepository, AuthQueryRepository } from './repos';
import {
  RefreshJwtAuthStrategy,
  HardJwtAuthStrategy,
  appConfig,
} from '../Infrastructure';

@Module({
  imports: [
    CqrsModule,
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
    ...useCases,
  ],
})
export class AuthModule {}
