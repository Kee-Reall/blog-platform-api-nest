import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Model/Schema/user.schema';
import { AuthCommandRepository } from './repos/auth.command.repository';
import { JwtModule } from '@nestjs/jwt';
import { Session, SessionSchema } from '../Model/Schema/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, AuthCommandRepository],
})
export class AuthModule {}
