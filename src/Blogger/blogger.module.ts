import { Module } from '@nestjs/common';
import { BloggerController } from './controller';
import { bloggerCommandsHandlers } from './useCases/commands';
import { BloggerCommandRepository, BloggerQueryRepository } from './repos';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema, User, UserSchema } from '../Model';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [BloggerController],
  providers: [
    BloggerCommandRepository,
    BloggerQueryRepository,
    ...bloggerCommandsHandlers,
  ],
})
export class BloggerModule {}
