import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { HardJwtAuthStrategy } from '../Base';
import { useCasesHandlers } from './useCases';
import { IsBlogExistConstraint } from './decorators';
import { BloggerCommandRepository, BloggerQueryRepository } from './repos';
import { BloggerBlogsController, BloggerUsersController } from './controller';
import {
  Ban,
  BanSchema,
  Blog,
  BlogSchema,
  Post,
  PostSchema,
  User,
  UserSchema,
} from '../Model';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Ban.name, schema: BanSchema },
    ]),
  ],
  controllers: [BloggerBlogsController, BloggerUsersController],
  providers: [
    BloggerCommandRepository,
    BloggerQueryRepository,
    HardJwtAuthStrategy,
    IsBlogExistConstraint,
    ...useCasesHandlers,
  ],
})
export class BloggerModule {}
