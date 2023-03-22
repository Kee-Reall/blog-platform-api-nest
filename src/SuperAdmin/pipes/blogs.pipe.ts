import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { BlogsPagination } from '../../Infrastructure';
import { BlogFilter } from '../../Model';

export class BlogsQueryPipe implements PipeTransform {
  transform(inputQuery: BlogFilter, metadata: ArgumentMetadata) {
    return new BlogsPagination(inputQuery);
  }
}
