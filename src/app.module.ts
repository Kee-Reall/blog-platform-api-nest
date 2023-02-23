import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    BlogsModule,
    RouterModule.register([
      {
        path: 'api/blogs',
        module: BlogsModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
