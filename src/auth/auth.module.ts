import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Model/Schema/user.schema';
import { AuthCommandRepository } from './repos/auth.command.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, AuthCommandRepository],
})
export class AuthModule {}
