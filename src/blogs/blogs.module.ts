import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository, BlogsCommandRepository } from './repos';
import { SoftJwtAuthGuard } from '../infrastructure';
import {
  Blog,
  BlogSchema,
  Post,
  PostSchema,
  Like,
  LikeSchema,
} from '../Model/';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsCommandRepository,
    SoftJwtAuthGuard,
  ],
})
export class BlogsModule {}
