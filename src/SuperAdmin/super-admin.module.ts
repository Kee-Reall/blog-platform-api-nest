import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { superAdminRepositories } from './repos';
import { superAdminCommandHandlers, superAdminQueryHandlers } from './useCases';
import {
  SuperAdminBlogsController,
  SuperAdminUsersController,
} from './controllers';
import {
  Blog,
  BlogSchema,
  Comment,
  CommentSchema,
  Like,
  LikeSchema,
  Post,
  PostSchema,
  User,
  UserSchema,
} from '../Model';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
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
