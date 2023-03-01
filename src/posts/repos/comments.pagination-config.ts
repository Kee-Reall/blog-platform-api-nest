import { PaginationConfigClass } from '../../helpers/classes/pagination-config.class';
import { CommentsLogicModel } from '../../Model/Type/comments.types';
import { FilterQuery } from 'mongoose';
import { IPaginationConfig } from '../../Model/Type/pagination.types';
import { CommentsFilter } from '../../Model/Type/query.types';

export class CommentsPaginationConfig
  extends PaginationConfigClass
  implements IPaginationConfig
{
  filter: FilterQuery<CommentsLogicModel>;
  constructor(query: CommentsFilter, postId: string) {
    super(query);
    this.filter = { postId };
  }
}
