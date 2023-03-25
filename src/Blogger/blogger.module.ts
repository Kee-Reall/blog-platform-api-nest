import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggerController } from './controller';
import { IsBlogExistConstraint } from './decorators';
import { HardJwtAuthStrategy } from '../Infrastructure';
import { BloggerCommandRepository, BloggerQueryRepository } from './repos';
import { bloggerCommandsHandlers, bloggerQueriesHandlers } from './useCases';
import { Blog, BlogSchema, Post, PostSchema, User, UserSchema } from '../Model';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BloggerController],
  providers: [
    BloggerCommandRepository,
    BloggerQueryRepository,
    ...bloggerCommandsHandlers,
    ...bloggerQueriesHandlers,
    HardJwtAuthStrategy,
    IsBlogExistConstraint,
  ],
})
export class BloggerModule {}
