import { ObjectId } from 'mongodb';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BloggerQueryRepository } from '../../repos';
import { CommentsForBloggerPaginationPipe } from '../../pipes';
import { CommentsFilter, IPaginationConfig } from '../../../Model';

export class GetCommentsForBlogger {
  public config: IPaginationConfig;
  constructor(public userId: string, filter: CommentsFilter) {
    this.config = new CommentsForBloggerPaginationPipe(filter);
  }
}

@QueryHandler(GetCommentsForBlogger)
export class GetCommentsForBloggerUseCase
  implements IQueryHandler<GetCommentsForBlogger>
{
  constructor(private repo: BloggerQueryRepository) {}
  public async execute(query: GetCommentsForBlogger) {
    const posts = await this.repo.getAllPostsByOwner(query.userId);
    const postsId: ObjectId[] = posts.map((post) => post._id);
    console.log(postsId);
    query.config.filter = {
      _isOwnerBanned: false,
      postId: { $in: postsId },
    };
    const comments = await this.repo.getCommentsForPost(
      query.config,
      query.userId,
    );
    console.log(comments);
    return comments;
  }
}
