import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { BlogFilters, PostFilters } from '../../Model/Type/query.types';
import { BlogsPagination } from './blogs.pagination.class';
import { PostsPaginationConfig } from '../../posts/repos/posts.pagination-config';

export class BlogsQueryPipe implements PipeTransform {
  transform(inputQuery: BlogFilters, metadata: ArgumentMetadata) {
    return new BlogsPagination(inputQuery);
  }
}

export class PostsByBlogPipe implements PipeTransform {
  transform(inputQuery: PostFilters, metadata: ArgumentMetadata) {
    return function (blogId: string) {
      return new PostsPaginationConfig(inputQuery, { blogId });
    };
  }
}

export type PostConfigFabric = (blogId: string) => PostsPaginationConfig;
