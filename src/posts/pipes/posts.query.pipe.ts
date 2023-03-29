import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { CommentsFilter, PostFilter } from '../../Model';
import { PostsPaginationConfig } from './posts.pagination.class';
import { PublicCommentsPaginationPipe } from '../../Public/pipes';

export class PostsQueryPipe implements PipeTransform {
  transform(inputQuery: PostFilter, metadata: ArgumentMetadata) {
    return new PostsPaginationConfig(inputQuery);
  }
}

export class CommentsByPost implements PipeTransform {
  transform(inputQuery: CommentsFilter, metadata: ArgumentMetadata) {
    return function (id: string) {
      return new PublicCommentsPaginationPipe(inputQuery, id);
    };
  }
}

export type CommentConfigFabric = (
  blogId: string,
) => PublicCommentsPaginationPipe;
