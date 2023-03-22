import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { BlogFilter, PostFilter } from '../../Model';
import { BlogsPagination } from '../../Infrastructure/paginations/blogs.pagination.class';
import { PostsPaginationConfig } from '../../posts/pipes/posts.pagination.class';
import { ObjectId } from 'mongodb';

export class BlogsQueryPipe implements PipeTransform {
  transform(inputQuery: BlogFilter, metadata: ArgumentMetadata) {
    return new BlogsPagination(inputQuery);
  }
}

export class PostsByBlogPipe implements PipeTransform {
  transform(inputQuery: PostFilter, metadata: ArgumentMetadata) {
    return function (blogIdStr: string) {
      try {
        const blogId = new ObjectId(blogIdStr);
        return new PostsPaginationConfig(inputQuery, { blogId });
      } catch (e) {
        throw new NotFoundException();
      }
    };
  }
}

export type PostConfigFabric = (blogId: string) => PostsPaginationConfig;
