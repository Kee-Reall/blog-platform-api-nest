import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { BlogsModule } from './blogs/blogs.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BlogsModule,
    RouterModule.register([
      {
        path: 'api/blogs',
        module: BlogsModule,
      },
    ]),
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/nest-train',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
