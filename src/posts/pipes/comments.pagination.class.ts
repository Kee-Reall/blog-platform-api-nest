import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../helpers/classes/pagination.config';
import {
  CommentsFilter,
  CommentsLogicModel,
  IPaginationConfig,
} from '../../Model';

export class CommentsPaginationConfig
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<CommentsLogicModel>;
  constructor(query: CommentsFilter, postId: string) {
    super(query);
    this.filter = { postId };
  }
}
