import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { useCases } from './useCases';
import { EmailService } from './email';
import { appConfig } from '../Infrastructure';
import { HardJwtAuthStrategy } from '../Base';
import { RefreshJwtAuthStrategy } from './strategy';
import { AuthController, DeviceController } from './controllers';
import { Session, SessionSchema, User, UserSchema } from '../Model';
import { AuthCommandRepository, AuthQueryRepository } from './repos';

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
    EmailService,
    AuthCommandRepository,
    AuthQueryRepository,
    HardJwtAuthStrategy,
    RefreshJwtAuthStrategy,
    ...useCases,
  ],
})
export class SecurityModule {}
