import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Model/';
import { UsersQueryRepository } from './repos/users.query.repository';
import { UsersCommandRepository } from './repos/users.comman.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepository, UsersCommandRepository],
})
export class UsersModule {}
