import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import {
  CommentsFilter,
  CommentsLogicModel,
  IPaginationConfig,
} from '../../Model';
import { ObjectId } from 'mongodb';

export class CommentsPaginationConfig
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<CommentsLogicModel>;
  constructor(query: CommentsFilter, postId: string | ObjectId) {
    super(query);
    this.filter = { postId };
  }
}
