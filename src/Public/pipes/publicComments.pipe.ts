import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import { Comment, CommentsFilter, IPaginationConfig } from '../../Model';

export class PublicCommentsPaginationPipe
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<Comment>;
  constructor(query: CommentsFilter, postId: string | ObjectId) {
    super(query);
    this.filter = { postId, _isOwnerBanned: false };
  }
}
