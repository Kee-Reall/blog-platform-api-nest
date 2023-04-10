import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import { Comment, CommentsFilter, IPaginationConfig } from '../../Model';

export class CommentsForBloggerPaginationPipe
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<Comment>;
  constructor(query: CommentsFilter) {
    super(query);
  }
}
