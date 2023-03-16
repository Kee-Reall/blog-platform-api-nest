import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { CommentsFilter, PostFilters } from '../../Model/Type/query.types';
import { PostsPaginationConfig } from './posts.pagination.class';
import { CommentsPaginationConfig } from './comments.pagination.class';

export class PostsQueryPipe implements PipeTransform {
  transform(inputQuery: PostFilters, metadata: ArgumentMetadata) {
    return new PostsPaginationConfig(inputQuery);
  }
}

export class CommentsByPost implements PipeTransform {
  transform(inputQuery: CommentsFilter, metadata: ArgumentMetadata) {
    return function (id: string) {
      return new CommentsPaginationConfig(inputQuery, id);
    };
  }
}

export type CommentConfigFabric = (blogId: string) => CommentsPaginationConfig;
