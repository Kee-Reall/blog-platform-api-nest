import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { superAdminRepositories } from './repos';
import { superAdminCommandHandlers, superAdminQueryHandlers } from './useCases';
import { Blog, BlogSchema, User, UserSchema } from '../Model';
import {
  SuperAdminBlogsController,
  SuperAdminUsersController,
} from './controllers';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SuperAdminBlogsController, SuperAdminUsersController],
  providers: [
    ...superAdminRepositories,
    ...superAdminQueryHandlers,
    ...superAdminCommandHandlers,
  ],
})
export class SuperAdminModule {}
